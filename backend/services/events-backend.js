/**
 * BLKOUT Events Calendar Backend - Production Ready
 * Community events with moderation and RSVP management
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
let events = [
  {
    id: 'evt_001',
    title: 'Community Healing Circle',
    description: 'A safe space for collective healing and support, facilitated by experienced community healers.',
    date: '2025-02-15',
    time: '18:00',
    duration: 120,
    location: {
      type: 'physical',
      address: 'Community Center, London',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    organizer: 'BLKOUT Healing Collective',
    category: 'Wellness',
    tags: ['healing', 'community', 'support'],
    capacity: 25,
    rsvps: 18,
    status: 'published',
    featured: true,
    imageUrl: null,
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-12').toISOString()
  },
  {
    id: 'evt_002',
    title: 'Black History Month Celebration',
    description: 'Celebrating our rich heritage with storytelling, music, and community connection.',
    date: '2025-02-28',
    time: '19:00',
    duration: 180,
    location: {
      type: 'physical',
      address: 'Cultural Arts Center, Manchester',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    organizer: 'Culture Keepers Collective',
    category: 'Cultural',
    tags: ['black history', 'celebration', 'culture'],
    capacity: 100,
    rsvps: 67,
    status: 'published',
    featured: true,
    imageUrl: null,
    createdAt: new Date('2025-01-08').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  },
  {
    id: 'evt_003',
    title: 'Digital Organizing Workshop',
    description: 'Learn effective digital organizing strategies for community activism and system change.',
    date: '2025-02-20',
    time: '14:00',
    duration: 240,
    location: {
      type: 'virtual',
      platform: 'Zoom',
      link: 'https://zoom.us/j/example'
    },
    organizer: 'System Disruptors Network',
    category: 'Activism',
    tags: ['organizing', 'digital', 'activism'],
    capacity: 50,
    rsvps: 34,
    status: 'published',
    featured: false,
    imageUrl: null,
    createdAt: new Date('2025-01-05').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString()
  }
];

let rsvps = [
  { eventId: 'evt_001', userId: 'user_001', name: 'Community Member', email: 'member@example.com', rsvpAt: new Date().toISOString() }
];

let moderationQueue = [];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Events Calendar Backend',
    status: 'healthy',
    version: '1.0.0',
    features: ['event_management', 'rsvp_system', 'content_moderation'],
    timestamp: new Date().toISOString()
  });
});

// Get all published events
app.get('/api/events', (req, res) => {
  try {
    const { category, featured, upcoming, limit = 20, offset = 0 } = req.query;
    
    let filteredEvents = events.filter(event => event.status === 'published');
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (featured === 'true') {
      filteredEvents = filteredEvents.filter(event => event.featured);
    }
    
    if (upcoming === 'true') {
      const now = new Date();
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.date) >= now
      );
    }
    
    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const paginatedEvents = filteredEvents.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      success: true,
      events: paginatedEvents,
      total: filteredEvents.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < filteredEvents.length
    });
    
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// Get single event by ID
app.get('/api/events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const event = events.find(e => e.id === id && e.status === 'published');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Get RSVP count and attendees
    const eventRsvps = rsvps.filter(rsvp => rsvp.eventId === id);
    
    res.json({
      success: true,
      event: {
        ...event,
        attendees: eventRsvps.length,
        rsvpList: eventRsvps.map(rsvp => ({
          name: rsvp.name,
          rsvpAt: rsvp.rsvpAt
        }))
      }
    });
    
  } catch (error) {
    console.error('Event fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// Submit new event for moderation
app.post('/api/events', (req, res) => {
  try {
    const { title, description, date, time, duration, location, organizer, category, tags, capacity } = req.body;
    
    if (!title || !description || !date || !time || !location || !organizer) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, date, time, location, and organizer are required'
      });
    }
    
    const newEvent = {
      id: `evt_${Date.now()}`,
      title,
      description,
      date,
      time,
      duration: duration || 120,
      location,
      organizer,
      category: category || 'General',
      tags: tags || [],
      capacity: capacity || 50,
      rsvps: 0,
      status: 'pending_moderation',
      featured: false,
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to moderation queue
    moderationQueue.push({
      id: `mod_${Date.now()}`,
      type: 'event',
      content: newEvent,
      submittedBy: organizer,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      priority: 'medium'
    });
    
    res.json({
      success: true,
      message: 'Event submitted for moderation',
      eventId: newEvent.id,
      estimatedReviewTime: '24-48 hours'
    });
    
  } catch (error) {
    console.error('Event submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit event'
    });
  }
});

// RSVP to an event
app.post('/api/events/:id/rsvp', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, userId } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required for RSVP'
      });
    }
    
    const event = events.find(e => e.id === id && e.status === 'published');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check if already RSVPed
    const existingRsvp = rsvps.find(rsvp => 
      rsvp.eventId === id && rsvp.email === email
    );
    
    if (existingRsvp) {
      return res.status(400).json({
        success: false,
        error: 'Already RSVPed to this event'
      });
    }
    
    // Check capacity
    const eventRsvps = rsvps.filter(rsvp => rsvp.eventId === id);
    if (eventRsvps.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Event is at full capacity'
      });
    }
    
    // Add RSVP
    const newRsvp = {
      eventId: id,
      userId: userId || `user_${Date.now()}`,
      name,
      email,
      rsvpAt: new Date().toISOString()
    };
    
    rsvps.push(newRsvp);
    event.rsvps += 1;
    
    res.json({
      success: true,
      message: 'RSVP confirmed',
      rsvp: {
        eventId: id,
        name,
        rsvpAt: newRsvp.rsvpAt
      }
    });
    
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to RSVP'
    });
  }
});

// Cancel RSVP
app.delete('/api/events/:id/rsvp', (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required to cancel RSVP'
      });
    }
    
    const rsvpIndex = rsvps.findIndex(rsvp => 
      rsvp.eventId === id && rsvp.email === email
    );
    
    if (rsvpIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'RSVP not found'
      });
    }
    
    rsvps.splice(rsvpIndex, 1);
    
    const event = events.find(e => e.id === id);
    if (event) {
      event.rsvps -= 1;
    }
    
    res.json({
      success: true,
      message: 'RSVP cancelled'
    });
    
  } catch (error) {
    console.error('RSVP cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel RSVP'
    });
  }
});

// Get event categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(events
      .filter(event => event.status === 'published')
      .map(event => event.category)
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

// Moderate event (admin only)
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
      // Publish the event
      const event = moderationItem.content;
      event.status = 'published';
      event.updatedAt = new Date().toISOString();
      events.push(event);
      
      // Remove from moderation queue
      moderationQueue = moderationQueue.filter(item => item.id !== id);
      
      res.json({
        success: true,
        message: 'Event approved and published',
        eventId: event.id
      });
      
    } else if (action === 'reject') {
      // Update moderation item
      moderationItem.status = 'rejected';
      moderationItem.reason = reason;
      moderationItem.reviewedAt = new Date().toISOString();
      
      res.json({
        success: true,
        message: 'Event rejected',
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
      error: 'Failed to moderate event'
    });
  }
});

// Search events
app.get('/api/search', (req, res) => {
  try {
    const { q, category, date } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    let searchResults = events.filter(event => {
      if (event.status !== 'published') return false;
      
      const searchText = `${event.title} ${event.description} ${event.tags.join(' ')}`.toLowerCase();
      const matches = searchText.includes(q.toLowerCase());
      
      if (category && !event.category.toLowerCase().includes(category.toLowerCase())) {
        return false;
      }
      
      if (date && event.date !== date) {
        return false;
      }
      
      return matches;
    });
    
    // Sort by date (upcoming first)
    searchResults.sort((a, b) => new Date(a.date) - new Date(b.date));
    
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
    message: 'This endpoint does not exist on the Events backend',
    available_endpoints: ['/health', '/api/events', '/api/categories', '/api/search']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Events Backend Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Events backend encountered an unexpected error'
  });
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`📅 Events Calendar Backend running on port ${port}`);
  console.log(`🎉 Supporting community events and gatherings`);
});

module.exports = app;