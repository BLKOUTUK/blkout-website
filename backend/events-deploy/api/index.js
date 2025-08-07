/**
 * BLKOUT Events Backend - Serverless Function
 * Zero-budget deployment with in-memory storage
 */

// Mock events data
const mockEvents = [
  {
    _id: '1',
    title: 'Black QTIPOC Community Gathering',
    description: 'Monthly community meetup for Black QTIPOC folks to connect, share resources, and build community.',
    date: new Date('2025-08-15'),
    startTime: '18:00',
    location: 'Community Center, Brixton, London',
    source: 'community',
    status: 'approved',
    organizer: 'BLKOUT Community',
    tags: ['community', 'networking', 'support'],
    createdAt: new Date('2025-07-31'),
    updatedAt: new Date('2025-07-31'),
    cost: 'Free'
  },
  {
    _id: '2',
    title: 'Liberation Workshop Series: Part 1',
    description: 'Educational workshop exploring liberation theory and practice for Black queer and trans communities.',
    date: new Date('2025-08-22'),
    startTime: '14:00',
    location: 'Online via Zoom',
    source: 'education',
    status: 'approved',
    organizer: 'Liberation Collective',
    tags: ['education', 'workshop', 'liberation'],
    createdAt: new Date('2025-07-31'),
    updatedAt: new Date('2025-07-31'),
    cost: 'Sliding scale £5-£25'
  },
  {
    _id: '3',
    title: 'Black Trans Joy Celebration',
    description: 'A celebration of Black trans joy, resilience, and community. Music, art, performance, and good vibes.',
    date: new Date('2025-08-29'),
    startTime: '19:00',
    location: 'South London Community Space',
    source: 'celebration',
    status: 'approved',
    organizer: 'Black Trans Collective UK',
    tags: ['celebration', 'trans', 'joy', 'performance'],
    createdAt: new Date('2025-07-31'),
    updatedAt: new Date('2025-07-31'),
    cost: 'Free with donations welcome'
  }
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  try {
    // Health endpoint
    if (url === '/health' && method === 'GET') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: 'in-memory',
          redis: 'disabled'
        }
      });
    }
    
    // Get events endpoint
    if (url === '/api/events' && method === 'GET') {
      const {
        status = 'approved',
        limit = 50,
        page = 1
      } = req.query;

      let events = mockEvents.filter(event => event.status === status);
      const total = events.length;
      
      // Apply pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      events = events.slice(skip, skip + parseInt(limit));

      return res.status(200).json({
        events,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: false
      });
    }
    
    // Get event stats endpoint
    if (url === '/api/events/stats' && method === 'GET') {
      return res.status(200).json({
        pending: 2,
        approved: 3,
        rejected: 0,
        total: 5
      });
    }
    
    // 404 for other routes
    return res.status(404).json({
      error: 'Endpoint not found',
      available_endpoints: ['/health', '/api/events', '/api/events/stats']
    });
    
  } catch (error) {
    console.error('Events Backend Error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}