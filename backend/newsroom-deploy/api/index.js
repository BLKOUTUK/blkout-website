/**
 * BLKOUT Newsroom Backend - Serverless Function
 * Zero-budget deployment with mock articles
 */

// Mock articles data
const mockArticles = [
  {
    _id: '1',
    title: 'BREAKING: New QTIPOC+ Housing Initiative Launched in Manchester',
    excerpt: 'Community-led housing cooperative provides safe, affordable homes for Black queer men in Greater Manchester area.',
    author: { name: 'Marcus Johnson', avatar: '/images/authors/mj.jpg' },
    publishedAt: new Date('2025-08-01'),
    readTime: 5,
    category: 'Breaking News',
    featured: true,
    tags: ['Housing', 'Community', 'Manchester'],
    status: 'breaking',
    views: 234,
    likes: 45,
    shares: 12
  },
  {
    _id: '2',
    title: 'POLICY ANALYSIS: Impact of Recent Gender Recognition Changes',
    excerpt: 'Comprehensive analysis of new gender recognition legislation and its effects on Black trans and non-binary communities.',
    author: { name: 'Dr. Alex Thompson', avatar: '/images/authors/at.jpg' },
    publishedAt: new Date('2025-07-30'),
    readTime: 8,
    category: 'Analysis',
    featured: true,
    tags: ['Policy', 'Trans Rights', 'Legal'],
    status: 'published',
    views: 456,
    likes: 89,
    shares: 23
  },
  {
    _id: '3',
    title: 'COMMUNITY SPOTLIGHT: Birmingham Pride Planning Update',
    excerpt: 'Local organizing committee shares plans for Birmingham Black Pride 2025 celebration.',
    author: { name: 'Jordan Clarke', avatar: '/images/authors/jc.jpg' },
    publishedAt: new Date('2025-07-28'),
    readTime: 4,
    category: 'Community News',
    featured: false,
    tags: ['Pride', 'Birmingham', 'Events'],
    status: 'published',
    views: 178,
    likes: 34,
    shares: 8
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
    
    // Get articles endpoint
    if (url === '/api/articles' && method === 'GET') {
      const {
        status = 'published',
        category,
        featured,
        limit = 20,
        page = 1
      } = req.query;

      let articles = mockArticles.filter(article => 
        article.status === status || (status === 'published' && article.status === 'breaking')
      );
      
      // Apply filters
      if (category) {
        articles = articles.filter(article => article.category === category);
      }
      if (featured !== undefined) {
        articles = articles.filter(article => article.featured === (featured === 'true'));
      }
      
      const total = articles.length;
      
      // Apply pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      articles = articles.slice(skip, skip + parseInt(limit));

      return res.status(200).json({
        articles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: false
      });
    }
    
    // Get single article endpoint
    if (url.startsWith('/api/articles/') && method === 'GET') {
      const articleId = url.split('/api/articles/')[1];
      const article = mockArticles.find(a => a._id === articleId);
      
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      return res.status(200).json(article);
    }
    
    // 404 for other routes
    return res.status(404).json({
      error: 'Endpoint not found',
      available_endpoints: ['/health', '/api/articles', '/api/articles/:id']
    });
    
  } catch (error) {
    console.error('Newsroom Backend Error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}