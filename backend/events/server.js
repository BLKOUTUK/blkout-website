#!/usr/bin/env node

/**
 * BLKOUT Events Calendar Backend
 * Community events management API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const redis = require('redis');
const winston = require('winston');
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

// Configuration
const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/blkout_events',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://blkoutuk.com',
    'https://www.blkoutuk.com',
    'https://events.blkoutuk.com'
  ],
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS
};

// Logger setup
const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Basic middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// In-memory storage for zero-budget deployment
let inMemoryEvents = [];
let isUsingInMemory = config.mongoUrl.includes('memory://');

if (!isUsingInMemory) {
  // MongoDB connection for production
  mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    logger.info('Falling back to in-memory storage');
    isUsingInMemory = true;
  });
} else {
  logger.info('Using in-memory storage for events (zero-budget mode)');
}

// Redis connection (optional)
let redisClient;
try {
  redisClient = redis.createClient({ url: config.redisUrl });
  redisClient.on('error', (err) => logger.error('Redis Client Error', err));
  redisClient.on('connect', () => logger.info('Connected to Redis'));
  redisClient.connect();
} catch (error) {
  logger.warn('Redis connection failed:', error.message);
}

// Event model
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String, required: true, maxlength: 500 },
  url: { type: String },
  source: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  cost: { type: String },
  organizer: { type: String },
  image: { type: String },
  tags: [{ type: String }],
  submittedBy: { type: String },
  moderatedBy: { type: String },
  moderatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

EventSchema.index({ date: 1, status: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ location: 'text', title: 'text', description: 'text' });

const Event = mongoose.model('Event', EventSchema);

// Swagger documentation
if (config.nodeEnv !== 'production') {
  try {
    const swaggerDocument = YAML.load('./docs/api.yaml');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    logger.warn('Swagger documentation not available:', error.message);
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: redisClient?.isReady ? 'connected' : 'disconnected'
    }
  };
  
  res.status(200).json(health);
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const {
      status = 'approved',
      limit = 50,
      page = 1,
      tags,
      location,
      startDate,
      endDate
    } = req.query;

    const query = { status };
    
    // Add filters
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Event.countDocuments(query);

    // Cache the response
    if (redisClient?.isReady) {
      const cacheKey = `events:${JSON.stringify(req.query)}`;
      await redisClient.setEx(cacheKey, 300, JSON.stringify({ events, total })); // 5 minutes
    }

    res.json({
      events,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: skip + events.length < total
    });
  } catch (error) {
    logger.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    logger.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit new event
app.post('/api/events', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('date').isISO8601(),
  body('location').trim().isLength({ min: 1, max: 500 }),
  body('source').trim().isLength({ min: 1, max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      status: 'pending', // All submissions start as pending
      submittedBy: req.ip,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const event = new Event(eventData);
    await event.save();

    // Clear cache
    if (redisClient?.isReady) {
      const keys = await redisClient.keys('events:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    logger.info(`New event submitted: ${event.title}`);
    res.status(201).json(event);
  } catch (error) {
    logger.error('Submit event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get event statistics
app.get('/api/events/stats', async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    res.json(result);
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const approvedEvents = await Event.countDocuments({ status: 'approved' });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    
    const metrics = [
      `# HELP events_total Total number of events`,
      `# TYPE events_total counter`,
      `events_total ${totalEvents}`,
      `# HELP events_approved_total Total approved events`,
      `# TYPE events_approved_total counter`,
      `events_approved_total ${approvedEvents}`,
      `# HELP events_pending_total Total pending events`,
      `# TYPE events_pending_total counter`,
      `events_pending_total ${pendingEvents}`,
    ].join('\n');
    
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    res.status(500).send('# Error generating metrics');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Cleanup tasks
cron.schedule('0 2 * * *', async () => {
  try {
    // Clean up old rejected events (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await Event.deleteMany({
      status: 'rejected',
      updatedAt: { $lt: thirtyDaysAgo }
    });
    
    if (result.deletedCount > 0) {
      logger.info(`Cleaned up ${result.deletedCount} old rejected events`);
    }
  } catch (error) {
    logger.error('Cleanup task error:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  if (redisClient?.isReady) {
    await redisClient.quit();
  }
  
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  if (redisClient?.isReady) {
    await redisClient.quit();
  }
  
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info(`Events Calendar Backend running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  logger.info(`Redis: ${redisClient?.isReady ? 'Connected' : 'Disconnected'}`);
});

module.exports = app;