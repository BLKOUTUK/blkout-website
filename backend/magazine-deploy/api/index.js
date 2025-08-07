/**
 * BLKOUT Magazine Backend - Serverless Function
 * Zero-budget deployment with community stories
 */

// Mock magazine stories
const mockStories = [
  {
    id: '1',
    title: 'Finding Home: A Black Trans Man\'s Journey in London',
    excerpt: 'Marcus shares his story of finding community and belonging in London\'s Black QTIPOC spaces.',
    content: 'When I first moved to London three years ago, I didn\'t know where I belonged. As a Black trans man from Birmingham, the city felt overwhelming and isolating. But through the BLKOUT community, I found not just a place to live, but a home where I could truly be myself...',
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
    content: 'Joy is not frivolous when you\'re fighting for your life. In Black queer spaces, every laugh, every dance, every moment of unbridled happiness is an act of resistance against systems designed to diminish us...',
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
    content: 'The conversation starts with recognition—we see ourselves in each other across the decades. When 25-year-old Jamal sits down with 67-year-old Winston, the parallels in their stories are undeniable despite the different eras they\'ve lived through...',
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
        service: 'BLKOUT Magazine Backend',
        mode: 'zero-budget'
      });
    }
    
    // Get articles/stories endpoint
    if (url === '/api/articles' && method === 'GET') {
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

      return res.status(200).json({
        articles: stories,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: skip + stories.length < total
      });
    }
    
    // Get single article/story endpoint
    if (url.startsWith('/api/articles/') && method === 'GET') {
      const storyId = url.split('/api/articles/')[1];
      const story = mockStories.find(s => s.id === storyId);
      
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      
      return res.status(200).json(story);
    }
    
    // 404 for other routes
    return res.status(404).json({
      error: 'Endpoint not found',
      available_endpoints: ['/health', '/api/articles', '/api/articles/:id']
    });
    
  } catch (error) {
    console.error('Magazine Backend Error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}