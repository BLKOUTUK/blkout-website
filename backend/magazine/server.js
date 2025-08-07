#!/usr/bin/env node

/**
 * BLKOUT Magazine Backend
 * Community magazine and story archive API
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuration
const config = {
  port: process.env.PORT || 3003,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://blkoutuk.com',
    'https://www.blkoutuk.com'
  ]
};

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));

// Mock story data for zero-budget deployment
const mockStories = [
  {
    id: '1',
    title: 'Finding Home: A Black Trans Man\'s Journey in London',
    excerpt: 'Marcus shares his story of finding community and belonging in London\'s Black QTIPOC spaces.',
    content: 'When I first moved to London...',
    author: { name: 'Marcus Williams', avatar: 'MW' },
    publishedAt: '2025-07-15',
    readTime: 6,
    category: 'Personal Stories',
    featured: true,
    tags: ['Trans', 'Community', 'London'],
    imageUrl: '/images/stories/marcus-story.jpg',
    likes: 156,
    comments: 23
  },
  {
    id: '2',
    title: 'The Healing Power of Black Queer Joy',
    excerpt: 'Exploring how celebration and joy become acts of resistance in Black queer communities.',
    content: 'Joy is not frivolous...',
    author: { name: 'Dr. Kemi Adebayo', avatar: 'KA' },
    publishedAt: '2025-07-10',
    readTime: 8,
    category: 'Cultural Commentary',
    featured: true,
    tags: ['Joy', 'Resistance', 'Culture'],
    imageUrl: '/images/stories/joy-healing.jpg',
    likes: 234,
    comments: 45
  },
  {
    id: '3',
    title: 'Building Bridges: Intergenerational Conversations',
    excerpt: 'Young and older Black queer men discuss community, activism, and the future.',
    content: 'The conversation starts with recognition...',
    author: { name: 'Community Contributors', avatar: 'CC' },
    publishedAt: '2025-07-05',
    readTime: 12,
    category: 'Community Voices',
    featured: false,
    tags: ['Intergenerational', 'Community', 'Activism'],
    imageUrl: '/images/stories/bridges.jpg',
    likes: 98,
    comments: 31
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BLKOUT Magazine Backend',
    mode: 'zero-budget'
  });
});

// Get all magazine articles/stories
app.get('/api/articles', (req, res) => {
  try {
    const {
      category,
      featured,
      limit = 10,
      page = 1
    } = req.query;

    let stories = [...mockStories];
    
    // Apply filters
    if (category) {
      stories = stories.filter(story => story.category === category);
    }
    if (featured !== undefined) {
      stories = stories.filter(story => story.featured === (featured === 'true'));
    }

    const total = stories.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    stories = stories.slice(skip, skip + parseInt(limit));

    res.json({
      articles: stories,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: skip + stories.length < total
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single article/story
app.get('/api/articles/:id', (req, res) => {
  try {
    const story = mockStories.find(s => s.id === req.params.id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`Magazine Backend running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Mode: Zero Budget - using mock data`);
});

module.exports = app;