/**
 * BLKOUT Newsroom Backend - Vercel Serverless Function
 * Community-driven news and articles with moderation
 */

// In-memory store (in production, use a database)
let articles = [
  {
    id: 'art_001',
    title: 'Building Safe Spaces: A Community Guide',
    content: 'Creating inclusive environments where Black queer voices can flourish requires intentional action and ongoing commitment...',
    author: 'Community Collective',
    category: 'Community Building',
    tags: ['safe spaces', 'community', 'inclusion'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2025-01-15').toISOString(),
    createdAt: new Date('2025-01-10').toISOString(),
    views: 245,
    likes: 18
  },
  {
    id: 'art_002', 
    title: 'Liberation Through Art: Creative Expression in Activism',
    content: 'Art has always been a powerful tool for resistance and liberation. From protest murals to performance art...',
    author: 'Creative Collective',
    category: 'Arts & Culture',
    tags: ['art', 'activism', 'creative expression'],
    status: 'published',
    featured: false,
    publishedAt: new Date('2025-01-12').toISOString(),
    createdAt: new Date('2025-01-08').toISOString(),
    views: 189,
    likes: 24
  }
];

let moderationQueue = [];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
        success: true,
        service: 'Newsroom Backend',
        status: 'healthy',
        version: '1.0.0',
        features: ['article_management', 'content_moderation', 'community_publishing'],
        timestamp: new Date().toISOString()
      });
    }
    
    // Get all published articles
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
      
      // Sort by publication date (newest first)
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
    
    // Get single article by ID
    if (url.startsWith('/api/articles/') && method === 'GET') {
      const id = url.split('/api/articles/')[1];
      const article = articles.find(a => a.id === id && a.status === 'published');
      
      if (!article) {
        return res.status(404).json({
          success: false,
          error: 'Article not found'
        });
      }
      
      // Increment view count
      article.views += 1;
      
      return res.status(200).json({
        success: true,
        article: article
      });
    }
    
    // Submit new article for moderation
    if (url === '/api/articles' && method === 'POST') {
      const { title, content, author, category, tags } = req.body;
      
      if (!title || !content || !author) {
        return res.status(400).json({
          success: false,
          error: 'Title, content, and author are required'
        });
      }
      
      const newArticle = {
        id: `art_${Date.now()}`,
        title,
        content,
        author,
        category: category || 'General',
        tags: tags || [],
        status: 'pending_moderation',
        featured: false,
        publishedAt: null,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
      };
      
      // Add to moderation queue
      moderationQueue.push({
        id: `mod_${Date.now()}`,
        type: 'newsroom_article',
        content: newArticle,
        submittedBy: author,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        priority: 'medium'
      });
      
      return res.status(200).json({
        success: true,
        message: 'Article submitted for moderation',
        articleId: newArticle.id,
        estimatedReviewTime: '24-48 hours'
      });
    }
    
    // Get article categories
    if (url === '/api/categories' && method === 'GET') {
      const categories = [...new Set(articles
        .filter(article => article.status === 'published')
        .map(article => article.category)
      )];
      
      return res.status(200).json({
        success: true,
        categories: categories
      });
    }
    
    // 404 for other routes
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      message: 'This endpoint does not exist on the Newsroom backend',
      available_endpoints: ['/health', '/api/articles', '/api/categories']
    });
    
  } catch (error) {
    console.error('Newsroom Backend Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Newsroom backend encountered an unexpected error'
    });
  }
}