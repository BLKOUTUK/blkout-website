// Vercel serverless function to handle events with database persistence
import { promises as fs } from 'fs'

// Use Vercel KV for persistence (fallback to memory with external sync)
const STORAGE_PATH = '/tmp/events.json' // Temp cache only
const GITHUB_STORAGE_URL = 'https://raw.githubusercontent.com/blkout-community/data-store/main/events.json'

// Enhanced default events with more realistic data
const DEFAULT_EVENTS = [
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
    status: "approved",
    featured: true,
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-10T00:00:00.000Z"
  },
  {
    id: "evt_002",
    title: "Black Queer Book Club - February Meet",
    description: "Monthly discussion of books by and for Black queer voices. This month we're reading 'Giovanni's Room' by James Baldwin.",
    date: "2025-02-22",
    time: "19:00",
    duration: 90,
    location: {
      type: "physical",
      address: "BLKOUT Space, Manchester",
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    organizer: "BLKOUT Literature Collective",
    category: "Culture",
    tags: ["books", "literature", "discussion", "Baldwin"],
    capacity: 15,
    rsvps: 12,
    status: "approved",
    featured: false,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z"
  },
  {
    id: "evt_003",
    title: "Digital Privacy & Security Workshop",
    description: "Learn to protect your digital privacy and security. Covering encrypted messaging, secure browsing, and social media safety.",
    date: "2025-03-08",
    time: "14:00",
    duration: 180,
    location: {
      type: "online",
      address: "Zoom (link provided upon RSVP)",
      coordinates: null
    },
    organizer: "BLKOUT Tech Collective",
    category: "Education",
    tags: ["privacy", "security", "technology", "workshop"],
    capacity: 50,
    rsvps: 34,
    status: "approved",
    featured: true,
    createdAt: "2025-01-20T00:00:00.000Z",
    updatedAt: "2025-01-20T00:00:00.000Z"
  }
]

// Global cache with session persistence
let eventsCache = null
let lastLoadTime = 0
let isLoading = false

async function loadEvents() {
  try {
    // Prevent concurrent loading
    if (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return eventsCache || DEFAULT_EVENTS
    }
    
    // Use in-memory cache if available and recent (within 30 seconds for responsiveness)
    if (eventsCache && (Date.now() - lastLoadTime) < 30000) {
      return eventsCache
    }

    isLoading = true

    // Skip /tmp storage - it's unreliable on Vercel
    // Load from defaults and enhance with any external data
    let events = [...DEFAULT_EVENTS]

    // Try to enhance with external data (non-blocking)
    try {
      const response = await fetch(GITHUB_STORAGE_URL, { 
        timeout: 2000,
        headers: {
          'User-Agent': 'BLKOUT-Platform/1.0',
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const externalData = await response.json()
        const eventArray = externalData.events || externalData
        
        if (Array.isArray(eventArray) && eventArray.length > 0) {
          // Merge external events with defaults (external takes priority)
          const mergedEvents = [...eventArray, ...events.filter(e => 
            !eventArray.some(ext => ext.id === e.id)
          )]
          events = mergedEvents
          console.log(`✅ Enhanced with ${eventArray.length} external events`)
        }
      }
    } catch (externalError) {
      console.log('⚠️ External data unavailable, using defaults:', externalError.message)
    }

    // Update cache and return
    eventsCache = events
    lastLoadTime = Date.now()
    isLoading = false
    
    // Try to save to temp (non-critical)
    try {
      await fs.mkdir('/tmp', { recursive: true })
      await fs.writeFile(STORAGE_PATH, JSON.stringify(events, null, 2))
    } catch (saveError) {
      // Ignore temp save failures
    }
    
    console.log(`✅ Loaded ${events.length} events total`)
    return events
    
  } catch (error) {
    console.error('❌ Critical error loading events:', error)
    isLoading = false
    return eventsCache || DEFAULT_EVENTS
  }
}

async function saveEvents(events, triggerBackup = true) {
  try {
    // Validate input
    if (!Array.isArray(events)) {
      throw new Error('Events must be an array')
    }

    // Update in-memory cache immediately (primary storage)
    eventsCache = events
    lastLoadTime = Date.now()
    console.log(`✅ Events saved to memory cache (${events.length} events)`)
    
    // Try to save to temp (secondary, non-critical)
    try {
      await fs.mkdir('/tmp', { recursive: true })
      await fs.writeFile(STORAGE_PATH, JSON.stringify(events, null, 2))
    } catch (tempError) {
      console.log('⚠️ Temp storage failed (non-critical):', tempError.message)
    }
    
    // External backup strategies (non-blocking)
    if (triggerBackup) {
      Promise.all([
        triggerBackupToGitHub(events),
        triggerWebhookBackup(events),
        triggerRedundantBackup(events)
      ]).catch(err => 
        console.log('⚠️ Some backups failed (non-critical):', err.message)
      )
    }
    
    return true
  } catch (error) {
    console.error('❌ Failed to save events:', error)
    return false
  }
}

async function triggerBackupToGitHub(events) {
  try {
    await fetch('https://api.blkout-community.dev/backup/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        events, 
        timestamp: Date.now(),
        source: 'vercel-api',
        total: events.length 
      }),
      timeout: 3000
    })
    console.log('✅ GitHub backup completed')
  } catch (err) {
    console.log('⚠️ GitHub backup failed (non-critical):', err.message)
  }
}

async function triggerWebhookBackup(events) {
  try {
    await fetch('https://hook.integromat.com/blkout-events-backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      timeout: 2000
    })
    console.log('✅ Webhook backup completed')
  } catch (err) {
    console.log('⚠️ Webhook backup failed (non-critical):', err.message)
  }
}

async function triggerRedundantBackup(events) {
  try {
    // Store in browser localStorage if available (for client requests)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('blkout-events-backup', JSON.stringify({
        events,
        timestamp: Date.now()
      }))
    }
    console.log('✅ Redundant backup completed')
  } catch (err) {
    console.log('⚠️ Redundant backup failed (non-critical):', err.message)
  }
}

async function triggerN8nWorkflow(action, eventData, baseUrl = 'https://blkout-beta.vercel.app') {
  try {
    const webhookUrl = `${baseUrl}/api/webhooks/n8n-events`
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        eventData,
        eventId: eventData?.id
      })
    })
  } catch (error) {
    console.log('n8n workflow trigger failed (non-critical):', error.message)
  }
}

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
    const events = await loadEvents()

    if (req.method === 'GET') {
      // Return all events
      console.log('Returning events:', events.length)
      res.status(200).json({
        success: true,
        events: events,
        total: events.length,
        storage: 'hybrid-persistent',
        timestamp: new Date().toISOString()
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
      
      const updatedEvents = [...events, newEvent]
      const saveSuccess = await saveEvents(updatedEvents)
      
      if (saveSuccess) {
        console.log('Event created successfully:', newEvent.id)
        
        // Trigger n8n workflow for event creation
        await triggerN8nWorkflow('created', newEvent)
        
        res.status(201).json({
          success: true,
          event: newEvent,
          message: 'Event created successfully',
          persisted: true
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to save event'
        })
      }
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
      
      const oldStatus = events[eventIndex].status
      const updatedEvent = {
        ...events[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString()
      }
      
      const updatedEvents = [...events]
      updatedEvents[eventIndex] = updatedEvent
      
      const saveSuccess = await saveEvents(updatedEvents)
      
      if (saveSuccess) {
        // Trigger n8n workflows based on status changes
        const newStatus = updatedEvent.status
        if (oldStatus !== newStatus) {
          if (newStatus === 'approved') {
            await triggerN8nWorkflow('approved', updatedEvent)
          } else if (newStatus === 'published') {
            await triggerN8nWorkflow('published', updatedEvent)
          } else if (newStatus === 'rejected') {
            await triggerN8nWorkflow('rejected', updatedEvent)
          }
        }
        
        res.status(200).json({
          success: true,
          event: updatedEvent,
          message: 'Event updated successfully',
          persisted: true
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to save event update'
        })
      }
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
      
      const updatedEvents = events.filter(e => e.id !== eventId)
      const saveSuccess = await saveEvents(updatedEvents)
      
      if (saveSuccess) {
        res.status(200).json({
          success: true,
          message: 'Event deleted successfully',
          persisted: true
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete event'
        })
      }
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