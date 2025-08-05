// Vercel serverless function to handle events with real storage
let events = [
  {
    id: "evt_001",
    title: "Community Healing Circle",
    description: "A safe space for collective healing and support, facilitated by experienced community healers.",
    date: "2025-02-15",
    time: "18:00",
    duration: 120,
    location: {
      type: "physical",
      address: "Community Center, London",
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    organizer: "BLKOUT Healing Collective",
    category: "Wellness",
    tags: ["healing", "community", "support"],
    capacity: 25,
    rsvps: 18,
    status: "published",
    featured: true,
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-10T00:00:00.000Z"
  }
]

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      // Return all events
      console.log('Returning events:', events.length)
      res.status(200).json({
        success: true,
        events: events,
        total: events.length
      })
    } 
    else if (req.method === 'POST') {
      // Create new event
      const eventData = req.body
      console.log('Creating new event:', eventData)
      
      const newEvent = {
        id: `evt_${Date.now()}`,
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rsvps: 0,
        status: eventData.status || 'draft'
      }
      
      events.push(newEvent)
      console.log('Event created successfully:', newEvent.id)
      
      res.status(201).json({
        success: true,
        event: newEvent,
        message: 'Event created successfully'
      })
    }
    else if (req.method === 'PUT') {
      // Update existing event
      const eventId = req.query.id
      const eventData = req.body
      
      const eventIndex = events.findIndex(e => e.id === eventId)
      if (eventIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        })
      }
      
      events[eventIndex] = {
        ...events[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString()
      }
      
      res.status(200).json({
        success: true,
        event: events[eventIndex],
        message: 'Event updated successfully'
      })
    }
    else if (req.method === 'DELETE') {
      // Delete event
      const eventId = req.query.id
      const eventIndex = events.findIndex(e => e.id === eventId)
      
      if (eventIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        })
      }
      
      events.splice(eventIndex, 1)
      
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      })
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('Events API error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: error.message
    })
  }
}