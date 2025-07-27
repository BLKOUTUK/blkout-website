// Temporary minimal newsroom backend for testing
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock articles data
const mockArticles = [
  {
    id: '1',
    title: 'Community Organizing Workshop Success',
    excerpt: 'Black QTIPOC+ leaders gathered to share organizing strategies and build collective power.',
    content: 'Our recent workshop brought together 45 community organizers from across the UK...',
    author: 'Maya Chen',
    category: 'Community Building',
    published_date: new Date().toISOString(),
    source: 'Community Reports',
    tags: ['organizing', 'workshop', 'community', 'power-building']
  },
  {
    id: '2', 
    title: 'Cooperative Economics in Practice',
    excerpt: 'Local worker cooperatives demonstrate alternative economic models that center community wealth.',
    content: 'Three new worker cooperatives have launched this month, showing the growing momentum...',
    author: 'Jordan Williams',
    category: 'Economics',
    published_date: new Date(Date.now() - 86400000).toISOString(),
    source: 'Liberation Economics',
    tags: ['cooperatives', 'economics', 'community-wealth', 'worker-ownership']
  },
  {
    id: '3',
    title: 'Digital Organizing Tools Workshop',
    excerpt: 'Community members learn to use technology for liberation rather than surveillance.',
    content: 'Our digital security and organizing tools workshop equipped 30 activists...',
    author: 'Alex Thompson',
    category: 'Technology',
    published_date: new Date(Date.now() - 172800000).toISOString(),
    source: 'Tech Liberation',
    tags: ['digital-organizing', 'security', 'tools', 'workshops']
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Newsroom Backend',
    timestamp: new Date().toISOString()
  });
});

// Articles endpoint
app.get('/api/articles', (req, res) => {
  res.json({ 
    articles: mockArticles,
    total: mockArticles.length,
    timestamp: new Date().toISOString()
  });
});

// Individual article endpoint
app.get('/api/articles/:id', (req, res) => {
  const article = mockArticles.find(a => a.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(mockArticles.map(a => a.category))];
  res.json({ categories });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🗞️  Newsroom backend running on http://localhost:${PORT}`);
  console.log(`📰 Articles available at http://localhost:${PORT}/api/articles`);
});