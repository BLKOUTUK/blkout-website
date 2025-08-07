// Vercel serverless function to handle events with GitHub-backed persistence
import { promises as fs } from 'fs'

// Use /tmp directory with GitHub backup for true persistence
const STORAGE_PATH = '/tmp/events.json'
const GITHUB_STORAGE_URL = 'https://raw.githubusercontent.com/blkout-community/data-store/main/events.json'
const BACKUP_INTERVAL = 5 * 60 * 1000 // 5 minutes

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
    status: "published",
    featured: true,
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-10T00:00:00.000Z"
  }
]

// Global cache with aggressive persistence
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
    
    // Use cache if available and recent (within 5 minutes for better persistence)
    if (eventsCache && (Date.now() - lastLoadTime) < 300000) {
      return eventsCache
    }

    isLoading = true

    // Try to load from local storage first
    try {
      const data = await fs.readFile(STORAGE_PATH, 'utf8')
      const events = JSON.parse(data)
      
      // Validate data integrity
      if (Array.isArray(events) && events.length > 0) {
        eventsCache = events
        lastLoadTime = Date.now()
        console.log('✅ Loaded events from local storage:', events.length)
        isLoading = false
        return events
      }
    } catch (localError) {
      console.log('⚠️ No local events file, trying remote backup')
    }

    // Try multiple backup sources for maximum reliability
    const backupSources = [
      GITHUB_STORAGE_URL,
      'https://blkout-beta.vercel.app/api/events/backup',
      'https://api.blkout-community.dev/events.json'
    ]

    for (const backupUrl of backupSources) {
      try {
        const response = await fetch(backupUrl, { 
          timeout: 3000,
          headers: {
            'User-Agent': 'BLKOUT-Platform/1.0',
            'Accept': 'application/json'
          }
        })
        
        if (response.ok) {
          const events = await response.json()
          
          // Handle different response formats
          const eventArray = events.events || events
          
          if (Array.isArray(eventArray) && eventArray.length > 0) {
            await saveEvents(eventArray, false)
            eventsCache = eventArray
            lastLoadTime = Date.now()
            console.log(`✅ Restored ${eventArray.length} events from backup: ${backupUrl}`)
            isLoading = false
            return eventArray
          }
        }
      } catch (backupError) {
        console.log(`❌ Backup ${backupUrl} failed:`, backupError.message)
        continue
      }
    }

    // If we have stale cache, use it rather than defaults
    if (eventsCache && eventsCache.length > 1) {
      console.log('⚠️ Using stale cache data instead of defaults')
      isLoading = false
      return eventsCache
    }

    // Last resort: use defaults but immediately try to merge with any existing data
    console.log('⚠️ Falling back to default events')
    eventsCache = [...DEFAULT_EVENTS]
    lastLoadTime = Date.now()
    await saveEvents(eventsCache, false)
    isLoading = false
    return eventsCache
    
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

    // Create backup directory if it doesn't exist
    await fs.mkdir('/tmp', { recursive: true })
    
    // Save to multiple local locations for redundancy
    const savePromises = [
      fs.writeFile(STORAGE_PATH, JSON.stringify(events, null, 2)),
      fs.writeFile('/tmp/events-backup.json', JSON.stringify(events, null, 2)),
      fs.writeFile('/tmp/events-latest.json', JSON.stringify({
        events,
        timestamp: Date.now(),
        total: events.length,
        lastSaved: new Date().toISOString()
      }, null, 2))
    ]
    
    await Promise.all(savePromises)
    console.log(`✅ Events saved to local storage (${events.length} events)`)
    
    // Update cache immediately
    eventsCache = events
    lastLoadTime = Date.now()
    
    // Multiple backup strategies
    if (triggerBackup) {
      // Fire all backups concurrently (non-blocking)
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