/**
 * BLKOUT Magazine Backend - Production Ready
 * Digital magazine with featured stories and multimedia content
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
let issues = [
  {
    id: 'issue_001',
    title: 'Liberation Through Identity',
    edition: 'Winter 2025',
    coverImage: null,
    description: 'Exploring the multifaceted nature of Black queer identity and its power in the liberation movement.',
    publishedAt: new Date('2025-01-01').toISOString(),
    featured: true,
    articles: ['mag_001', 'mag_002', 'mag_003'],
    downloads: 1247,
    status: 'published'
  }
];

let articles = [
  {
    id: 'mag_001',
    issueId: 'issue_001',
    title: 'The Power of Authentic Self-Expression',
    subtitle: 'How embracing our full selves becomes an act of resistance',
    author: 'Jordan Rivers',
    authorBio: 'Writer, activist, and community organizer based in London',
    content: 'In a world that often demands conformity, the simple act of existing authentically as a Black queer person becomes revolutionary...',
    excerpt: 'Exploring how authentic self-expression serves as both personal liberation and collective resistance.',
    category: 'Identity',
    tags: ['identity', 'authenticity', 'resistance'],
    readTime: 8,
    featured: true,
    multimedia: {
      images: [],
      videos: [],
      audio: null
    },
    publishedAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
    views: 342,
    likes: 28,
    status: 'published'
  },
  {
    id: 'mag_002',
    issueId: 'issue_001',
    title: 'Building Intergenerational Bridges',
    subtitle: 'Connecting wisdom across generations in our community',
    author: 'Maya Thompson',
    authorBio: 'Intergenerational dialogue facilitator and community historian',
    content: 'The strength of our community lies not just in our individual stories, but in how we weave them together across generations...',
    excerpt: 'Examining the importance of intergenerational connections in building stronger communities.',
    category: 'Community',
    tags: ['intergenerational', 'community', 'wisdom'],
    readTime: 12,
    featured: false,
    multimedia: {
      images: [],
      videos: [],
      audio: null
    },
    publishedAt: new Date('2025-01-02').toISOString(),
    updatedAt: new Date('2025-01-02').toISOString(),
    views: 189,
    likes: 15,
    status: 'published'
  },
  {
    id: 'mag_003',
    issueId: 'issue_001',
    title: 'Art as Activism: Creative Resistance',
    subtitle: 'The transformative power of artistic expression in social movements',
    author: 'Alex Chen',
    authorBio: 'Visual artist and cultural critic exploring intersections of art and activism',
    content: 'From protest murals to performance art, creative expression has always been at the heart of liberation movements...',
    excerpt: 'How artists are using their creativity to challenge systems and inspire change.',
    category: 'Arts & Culture',
    tags: ['art', 'activism', 'creativity'],
    readTime: 15,
    featured: true,
    multimedia: {
      images: [],
      videos: [],
      audio: null
    },
    publishedAt: new Date('2025-01-03').toISOString(),
    updatedAt: new Date('2025-01-03').toISOString(),
    views: 267,
    likes: 31,
    status: 'published'
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Magazine Backend',
    status: 'healthy',
    version: '1.0.0',
    features: ['digital_magazine', 'multimedia_content', 'featured_stories'],
    timestamp: new Date().toISOString()
  });
});

// Get all published issues
app.get('/api/issues', (req, res) => {
  try {
    const { featured, limit = 20, offset = 0 } = req.query;
    
    let filteredIssues = issues.filter(issue => issue.status === 'published');
    
    if (featured === 'true') {
      filteredIssues = filteredIssues.filter(issue => issue.featured);
    }
    
    // Sort by publication date (newest first)
    filteredIssues.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    const paginatedIssues = filteredIssues.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    // Add article count to each issue
    const issuesWithCounts = paginatedIssues.map(issue => ({
      ...issue,
      articleCount: issue.articles.length,
      articles: undefined // Don't send full article IDs in list view
    }));
    
    res.json({
      success: true,
      issues: issuesWithCounts,
      total: filteredIssues.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < filteredIssues.length
    });
    
  } catch (error) {
    console.error('Issues fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch issues'
    });
  }
});

// Get single issue by ID
app.get('/api/issues/:id', (req, res) => {
  try {
    const { id } = req.params;
    const issue = issues.find(i => i.id === id && i.status === 'published');
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }
    
    // Get articles for this issue
    const issueArticles = articles.filter(article => 
      issue.articles.includes(article.id) && article.status === 'published'
    );
    
    res.json({
      success: true,
      issue: {
        ...issue,
        articles: issueArticles.map(article => ({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle,
          author: article.author,
          excerpt: article.excerpt,
          category: article.category,
          readTime: article.readTime,
          featured: article.featured,
          publishedAt: article.publishedAt,
          views: article.views,
          likes: article.likes
        }))
      }
    });
    
  } catch (error) {
    console.error('Issue fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch issue'
    });
  }
});

// Get all published articles
app.get('/api/articles', (req, res) => {
  try {
    const { issueId, category, featured, limit = 20, offset = 0 } = req.query;
    
    let filteredArticles = articles.filter(article => article.status === 'published');
    
    if (issueId) {
      filteredArticles = filteredArticles.filter(article => article.issueId === issueId);
    }
    
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
    
    // Return article summaries in list view
    const articleSummaries = paginatedArticles.map(article => ({
      id: article.id,
      issueId: article.issueId,
      title: article.title,
      subtitle: article.subtitle,
      author: article.author,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      readTime: article.readTime,
      featured: article.featured,
      publishedAt: article.publishedAt,
      views: article.views,
      likes: article.likes
    }));
    
    res.json({
      success: true,
      articles: articleSummaries,
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
    
    // Get issue information
    const issue = issues.find(i => i.id === article.issueId);
    
    res.json({
      success: true,
      article: {
        ...article,
        issue: issue ? {
          id: issue.id,
          title: issue.title,
          edition: issue.edition
        } : null
      }
    });
    
  } catch (error) {
    console.error('Article fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article'
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

// Get featured content
app.get('/api/featured', (req, res) => {
  try {
    const featuredIssues = issues
      .filter(issue => issue.featured && issue.status === 'published')
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3);
    
    const featuredArticles = articles
      .filter(article => article.featured && article.status === 'published')
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 6)
      .map(article => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        author: article.author,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        publishedAt: article.publishedAt,
        views: article.views,
        likes: article.likes
      }));
    
    res.json({
      success: true,
      featured: {
        issues: featuredIssues.map(issue => ({
          ...issue,
          articleCount: issue.articles.length,
          articles: undefined
        })),
        articles: featuredArticles
      }
    });
    
  } catch (error) {
    console.error('Featured content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured content'
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

// Search articles and issues
app.get('/api/search', (req, res) => {
  try {
    const { q, category, type = 'all' } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    let results = { articles: [], issues: [] };
    
    // Search articles
    if (type === 'all' || type === 'articles') {
      let articleResults = articles.filter(article => {
        if (article.status !== 'published') return false;
        
        const searchText = `${article.title} ${article.subtitle} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
        const matches = searchText.includes(q.toLowerCase());
        
        if (category) {
          return matches && article.category.toLowerCase() === category.toLowerCase();
        }
        
        return matches;
      });
      
      // Sort by relevance (title match first, then content match)
      articleResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q.toLowerCase());
        const bTitle = b.title.toLowerCase().includes(q.toLowerCase());
        
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });
      
      results.articles = articleResults.map(article => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle,
        author: article.author,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        publishedAt: article.publishedAt,
        views: article.views,
        likes: article.likes
      }));
    }
    
    // Search issues
    if (type === 'all' || type === 'issues') {
      let issueResults = issues.filter(issue => {
        if (issue.status !== 'published') return false;
        
        const searchText = `${issue.title} ${issue.description} ${issue.edition}`.toLowerCase();
        return searchText.includes(q.toLowerCase());
      });
      
      results.issues = issueResults.map(issue => ({
        ...issue,
        articleCount: issue.articles.length,
        articles: undefined
      }));
    }
    
    res.json({
      success: true,
      results: results,
      query: q,
      totals: {
        articles: results.articles.length,
        issues: results.issues.length,
        combined: results.articles.length + results.issues.length
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Get magazine statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalIssues: issues.filter(i => i.status === 'published').length,
      totalArticles: articles.filter(a => a.status === 'published').length,
      totalViews: articles.reduce((sum, article) => sum + article.views, 0),
      totalLikes: articles.reduce((sum, article) => sum + article.likes, 0),
      totalDownloads: issues.reduce((sum, issue) => sum + issue.downloads, 0),
      featuredArticles: articles.filter(a => a.featured && a.status === 'published').length,
      categories: [...new Set(articles.filter(a => a.status === 'published').map(a => a.category))].length
    };
    
    res.json({
      success: true,
      stats: stats
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'This endpoint does not exist on the Magazine backend',
    available_endpoints: ['/health', '/api/issues', '/api/articles', '/api/featured', '/api/search']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Magazine Backend Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Magazine backend encountered an unexpected error'
  });
});

const port = process.env.PORT || 3004;
app.listen(port, () => {
  console.log(`📖 Magazine Backend running on port ${port}`);
  console.log(`📚 Supporting digital magazine and featured content`);
});

module.exports = app;