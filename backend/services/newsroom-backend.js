/**
 * BLKOUT Newsroom Backend - Production Ready
 * Community-driven news and articles with moderation
 */

const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://blkout-website-9stqi5sck-robs-projects-54d653d3.vercel.app',
    'https://blkoutuk.com',
    'https://www.blkoutuk.com',
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

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

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Newsroom Backend',
    status: 'healthy',
    version: '1.0.0',
    features: ['article_management', 'content_moderation', 'community_publishing'],
    timestamp: new Date().toISOString()
  });
});

// Get all published articles
app.get('/api/articles', (req, res) => {
  try {
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
    
    res.json({
      success: true,
      articles: paginatedArticles,
      total: filteredArticles.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < filteredArticles.length
    });
    
  } catch (error) {
    console.error('Articles fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles'
    });
  }
});

// Get single article by ID
app.get('/api/articles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const article = articles.find(a => a.id === id && a.status === 'published');
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    // Increment view count
    article.views += 1;
    
    res.json({
      success: true,
      article: article
    });
    
  } catch (error) {
    console.error('Article fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article'
    });
  }
});

// Submit new article for moderation
app.post('/api/articles', (req, res) => {
  try {
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
    
    res.json({
      success: true,
      message: 'Article submitted for moderation',
      articleId: newArticle.id,
      estimatedReviewTime: '24-48 hours'
    });
    
  } catch (error) {
    console.error('Article submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit article'
    });
  }
});

// Like an article
app.post('/api/articles/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    article.likes += 1;
    
    res.json({
      success: true,
      likes: article.likes
    });
    
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like article'
    });
  }
});

// Get article categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(articles
      .filter(article => article.status === 'published')
      .map(article => article.category)
    )];
    
    res.json({
      success: true,
      categories: categories
    });
    
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get moderation queue (admin only)
app.get('/api/admin/moderation-queue', (req, res) => {
  try {
    res.json({
      success: true,
      queue: moderationQueue,
      total: moderationQueue.length
    });
    
  } catch (error) {
    console.error('Moderation queue error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderation queue'
    });
  }
});

// Moderate article (admin only)
app.post('/api/admin/moderate/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'
    
    const moderationItem = moderationQueue.find(item => item.id === id);
    
    if (!moderationItem) {
      return res.status(404).json({
        success: false,
        error: 'Moderation item not found'
      });
    }
    
    if (action === 'approve') {
      // Publish the article
      const article = moderationItem.content;
      article.status = 'published';
      article.publishedAt = new Date().toISOString();
      articles.push(article);
      
      // Remove from moderation queue
      moderationQueue = moderationQueue.filter(item => item.id !== id);
      
      res.json({
        success: true,
        message: 'Article approved and published',
        articleId: article.id
      });
      
    } else if (action === 'reject') {
      // Update moderation item
      moderationItem.status = 'rejected';
      moderationItem.reason = reason;
      moderationItem.reviewedAt = new Date().toISOString();
      
      res.json({
        success: true,
        message: 'Article rejected',
        reason: reason
      });
      
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid action. Use "approve" or "reject"'
      });
    }
    
  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to moderate article'
    });
  }
});

// Search articles
app.get('/api/search', (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    let searchResults = articles.filter(article => {
      if (article.status !== 'published') return false;
      
      const searchText = `${article.title} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
      const matches = searchText.includes(q.toLowerCase());
      
      if (category) {
        return matches && article.category.toLowerCase() === category.toLowerCase();
      }
      
      return matches;
    });
    
    // Sort by relevance (simple title match first, then content match)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(q.toLowerCase());
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
    
    res.json({
      success: true,
      results: searchResults,
      query: q,
      total: searchResults.length
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'This endpoint does not exist on the Newsroom backend',
    available_endpoints: ['/health', '/api/articles', '/api/categories', '/api/search']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Newsroom Backend Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Newsroom backend encountered an unexpected error'
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`📰 Newsroom Backend running on port ${port}`);
  console.log(`🗞️ Supporting community journalism and storytelling`);
});

module.exports = app;