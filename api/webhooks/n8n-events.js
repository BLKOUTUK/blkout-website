// n8n Webhook Integration for Events
// Handles automated workflows for event processing

import fs from 'fs/promises'
import path from 'path'

const STORAGE_PATH = '/tmp/events.json'
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || null

// n8n workflow triggers
const N8N_WORKFLOWS = {
  EVENT_CREATED: 'event-created',
  EVENT_APPROVED: 'event-approved', 
  EVENT_PUBLISHED: 'event-published',
  EVENT_REJECTED: 'event-rejected'
}

async function loadEvents() {
  try {
    const data = await fs.readFile(STORAGE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveEvents(events) {
  try {
    await fs.writeFile(STORAGE_PATH, JSON.stringify(events, null, 2))
  } catch (error) {
    console.error('Error saving events:', error)
  }
}

async function triggerN8nWorkflow(workflowType, eventData) {
  if (!N8N_WEBHOOK_URL) {
    console.log('n8n webhook URL not configured')
    return
  }

  try {
    const webhookUrl = `${N8N_WEBHOOK_URL}/${workflowType}`
    
    const payload = {
      workflow: workflowType,
      timestamp: new Date().toISOString(),
      event: eventData,
      source: 'blkout-events-api'
    }

    console.log(`Triggering n8n workflow: ${workflowType}`)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Source': 'blkout-events'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log(`n8n workflow ${workflowType} triggered successfully`)
    } else {
      console.error(`n8n workflow ${workflowType} failed:`, response.status)
    }
  } catch (error) {
    console.error(`Error triggering n8n workflow ${workflowType}:`, error)
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const { action, eventId, eventData } = req.body

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required'
        })
      }

      const events = await loadEvents()
      let targetEvent = null
      
      if (eventId) {
        targetEvent = events.find(e => e.id === eventId)
        if (!targetEvent) {
          return res.status(404).json({
            success: false,
            error: 'Event not found'
          })
        }
      }

      // Handle different n8n workflow triggers
      switch (action) {
        case 'created':
          if (eventData) {
            // New event created - trigger creation workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.EVENT_CREATED, eventData)
            
            // Auto-categorization workflow could run here
            // Community outreach workflow could be triggered
            // Social media posting workflow could be scheduled
          }
          break

        case 'approved':
          if (targetEvent) {
            targetEvent.status = 'approved'
            targetEvent.approvedAt = new Date().toISOString()
            await saveEvents(events)
            
            // Trigger approval workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.EVENT_APPROVED, targetEvent)
            
            // Could trigger:
            // - Email notifications to organizers
            // - Calendar integration
            // - Social media promotion
            // - Community newsletter inclusion
          }
          break

        case 'published':
          if (targetEvent) {
            targetEvent.status = 'published' 
            targetEvent.publishedAt = new Date().toISOString()
            await saveEvents(events)
            
            // Trigger publication workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.EVENT_PUBLISHED, targetEvent)
            
            // Could trigger:
            // - Website updates
            // - Push notifications
            // - Social media cross-posting
            // - Community group notifications
            // - Calendar sync
          }
          break

        case 'rejected':
          if (targetEvent) {
            targetEvent.status = 'rejected'
            targetEvent.rejectedAt = new Date().toISOString()
            await saveEvents(events)
            
            // Trigger rejection workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.EVENT_REJECTED, targetEvent)
            
            // Could trigger:
            // - Feedback email to submitter
            // - Alternative suggestions
            // - Resubmission instructions
          }
          break

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid action'
          })
      }

      return res.status(200).json({
        success: true,
        message: `Event ${action} workflow triggered`,
        event: targetEvent || eventData,
        workflows: {
          triggered: action,
          available: Object.values(N8N_WORKFLOWS)
        }
      })
    }

    if (req.method === 'GET') {
      // Get workflow status and configuration
      return res.status(200).json({
        success: true,
        n8n: {
          configured: !!N8N_WEBHOOK_URL,
          webhookUrl: N8N_WEBHOOK_URL ? `${N8N_WEBHOOK_URL.split('/').slice(0, -1).join('/')}/***` : null,
          workflows: N8N_WORKFLOWS
        },
        usage: {
          description: 'Send POST requests with action and eventId/eventData to trigger n8n workflows',
          actions: ['created', 'approved', 'published', 'rejected'],
          example: {
            action: 'approved',
            eventId: 'event-123'
          }
        }
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('n8n events webhook error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}