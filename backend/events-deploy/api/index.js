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
    createdAt: new Date('2025-01-10').toISOString()
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
        service: 'Events Calendar Backend',
        status: 'healthy',
        version: '1.0.0',
        features: ['event_management', 'rsvp_system', 'content_moderation'],
        timestamp: new Date().toISOString()
      });
    }
    
    if (url === '/api/events' && method === 'GET') {
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
      
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const paginatedEvents = filteredEvents.slice(
        parseInt(offset), 
        parseInt(offset) + parseInt(limit)
      );
      
      return res.status(200).json({
        success: true,
        events: paginatedEvents,
        total: filteredEvents.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredEvents.length
      });
    }
    
    return res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      available_endpoints: ['/health', '/api/events']
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}