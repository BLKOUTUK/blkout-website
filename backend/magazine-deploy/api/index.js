let articles = [
  {
    id: 'mag_001',
    title: 'The Power of Authentic Self-Expression',
    subtitle: 'How embracing our full selves becomes an act of resistance',
    author: 'Jordan Rivers',
    content: 'In a world that often demands conformity, the simple act of existing authentically as a Black queer person becomes revolutionary...',
    excerpt: 'Exploring how authentic self-expression serves as both personal liberation and collective resistance.',
    category: 'Identity',
    tags: ['identity', 'authenticity', 'resistance'],
    readTime: 8,
    featured: true,
    publishedAt: new Date('2025-01-01').toISOString(),
    views: 342,
    likes: 28,
    status: 'published'
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  try {
    if (url === '/health' && method === 'GET') {
      return res.status(200).json({
        success: true,
        service: 'Magazine Backend',
        status: 'healthy',
        version: '1.0.0',
        features: ['digital_magazine', 'multimedia_content', 'featured_stories'],
        timestamp: new Date().toISOString()
      });
    }
    
    if (url === '/api/articles' && method === 'GET') {
      const { category, featured, limit = 20, offset = 0 } = req.query;
      
      let filteredArticles = articles.filter(article => article.status === 'published');
      
      if (category) {
        filteredArticles = filteredArticles.filter(article => 
          article.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (featured === 'true') {
        filteredArticles = filteredArticles.filter(article => article.featured);
      }
      
      filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      const paginatedArticles = filteredArticles.slice(
        parseInt(offset), 
        parseInt(offset) + parseInt(limit)
      );
      
      return res.status(200).json({
        success: true,
        articles: paginatedArticles,
        total: filteredArticles.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredArticles.length
      });
    }
    
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      available_endpoints: ['/health', '/api/articles']
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}