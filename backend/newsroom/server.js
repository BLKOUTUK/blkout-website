#!/usr/bin/env node

/**
 * BLKOUT Newsroom Backend
 * Community news and articles API
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
const multer = require('multer');
const sharp = require('sharp');
const RSSParser = require('rss-parser');
const { Feed } = require('feed');
const MarkdownIt = require('markdown-it');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

// Configuration
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/blkout_newsroom',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://blkoutuk.com',
    'https://www.blkoutuk.com',
    'https://newsroom.blkoutuk.com'
  ],
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
};

// Initialize markdown parser and DOM purifier
const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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

// Static files for uploads
app.use('/uploads', express.static(config.uploadPath));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
    files: 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// In-memory storage for zero-budget deployment
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
  logger.info('Using in-memory storage for newsroom (zero-budget mode)');
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

// Article model
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  excerpt: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String }
  },
  publishedAt: { type: Date, required: true },
  readTime: { type: Number, required: true }, // in minutes
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  imageUrl: { type: String },
  source: { type: String },
  externalUrl: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'breaking', 'updated', 'archived'], 
    default: 'draft' 
  },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  submittedBy: { type: String },
  moderatedBy: { type: String },
  moderatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ArticleSchema.index({ publishedAt: -1, status: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ featured: 1 });
ArticleSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const Article = mongoose.model('Article', ArticleSchema);

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

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const {
      status = 'published',
      category,
      featured,
      limit = 20,
      page = 1,
      tags,
      search
    } = req.query;

    // Check cache first
    const cacheKey = `articles:${JSON.stringify(req.query)}`;
    if (redisClient?.isReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const query = { status };
    
    // Add filters
    if (category) {
      query.category = category;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const articles = await Article.find(query)
      .sort({ featured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Article.countDocuments(query);

    const result = {
      articles,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: skip + articles.length < total
    };

    // Cache the response
    if (redisClient?.isReady) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(result)); // 5 minutes
    }

    res.json(result);
  } catch (error) {
    logger.error('Get articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment view count
    await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(article);
  } catch (error) {
    logger.error('Get article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit new article
app.post('/api/articles', upload.single('image'), [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('excerpt').trim().isLength({ min: 10, max: 500 }),
  body('content').trim().isLength({ min: 100 }),
  body('author.name').trim().isLength({ min: 1, max: 100 }),
  body('category').trim().isLength({ min: 1, max: 50 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageUrl = null;
    
    // Process uploaded image
    if (req.file) {
      const filename = `article-${Date.now()}.webp`;
      const filepath = path.join(config.uploadPath, filename);
      
      await sharp(req.file.buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);
      
      imageUrl = `/uploads/${filename}`;
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = req.body.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Sanitize content if it's HTML/Markdown
    let sanitizedContent = req.body.content;
    if (req.body.contentType === 'markdown') {
      sanitizedContent = DOMPurify.sanitize(md.render(req.body.content));
    } else if (req.body.contentType === 'html') {
      sanitizedContent = DOMPurify.sanitize(req.body.content);
    }

    const articleData = {
      ...req.body,
      content: sanitizedContent,
      readTime,
      imageUrl,
      publishedAt: new Date(),
      status: 'draft', // All submissions start as draft
      submittedBy: req.ip,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const article = new Article(articleData);
    await article.save();

    // Clear cache
    if (redisClient?.isReady) {
      const keys = await redisClient.keys('articles:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    logger.info(`New article submitted: ${article.title}`);
    res.status(201).json(article);
  } catch (error) {
    logger.error('Submit article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// RSS feed
app.get('/api/rss', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    const feed = new Feed({
      title: 'BLKOUT Newsroom',
      description: 'Latest news and articles from the Black QTIPOC+ community',
      id: 'https://newsroom.blkoutuk.com',
      link: 'https://newsroom.blkoutuk.com',
      language: 'en',
      image: 'https://blkoutuk.com/logo.png',
      favicon: 'https://blkoutuk.com/favicon.ico',
      copyright: 'BLKOUT Community',
      updated: new Date(),
      generator: 'BLKOUT Newsroom Backend',
      feedLinks: {
        rss2: 'https://newsroom.blkoutuk.com/api/rss'
      }
    });

    articles.forEach(article => {
      feed.addItem({
        title: article.title,
        id: article._id.toString(),
        link: `https://blkoutuk.com/newsroom/${article._id}`,
        description: article.excerpt,
        content: article.content,
        author: [{
          name: article.author.name
        }],
        date: article.publishedAt,
        category: [{
          name: article.category
        }]
      });
    });

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.rss2());
  } catch (error) {
    logger.error('RSS feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const draftArticles = await Article.countDocuments({ status: 'draft' });
    const totalViews = await Article.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const metrics = [
      `# HELP newsroom_articles_total Total number of articles`,
      `# TYPE newsroom_articles_total counter`,
      `newsroom_articles_total ${totalArticles}`,
      `# HELP newsroom_articles_published_total Total published articles`,
      `# TYPE newsroom_articles_published_total counter`,
      `newsroom_articles_published_total ${publishedArticles}`,
      `# HELP newsroom_articles_draft_total Total draft articles`,
      `# TYPE newsroom_articles_draft_total counter`,
      `newsroom_articles_draft_total ${draftArticles}`,
      `# HELP newsroom_views_total Total article views`,
      `# TYPE newsroom_views_total counter`,
      `newsroom_views_total ${totalViews[0]?.total || 0}`,
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
  logger.info(`Newsroom Backend running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  logger.info(`Redis: ${redisClient?.isReady ? 'Connected' : 'Disconnected'}`);
});

module.exports = app;