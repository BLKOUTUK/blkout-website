// Webhook API endpoint for receiving moderation sync from other platforms
// This handles incoming moderation actions from events-calendar and other systems

import { unifiedModerationBridge, WebhookPayload } from '../../services/unifiedModerationBridge'

export async function POST(request: Request) {
  try {
    // Parse the webhook payload
    const payload: WebhookPayload = await request.json()
    
    // Validate webhook signature and headers
    const signature = request.headers.get('X-Webhook-Signature')
    const userAgent = request.headers.get('User-Agent')
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing webhook signature' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!userAgent?.includes('BLKOUT-Moderation')) {
      return new Response(
        JSON.stringify({ error: 'Invalid User-Agent' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate payload structure
    if (!payload.type || payload.type !== 'moderation_action') {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload type' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!payload.data || !payload.data.id || !payload.data.contentType || !payload.data.action) {
      return new Response(
        JSON.stringify({ error: 'Invalid moderation action data' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📥 Webhook received from ${payload.data.sourceSystem}:`, payload.data)

    // Process the webhook through the unified bridge
    const result = await unifiedModerationBridge.handleIncomingWebhook(payload)

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: result.message,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          error: result.error,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}

// Health check endpoint
export async function GET(request: Request) {
  const syncStatus = unifiedModerationBridge.getSyncStatus()
  
  return new Response(
    JSON.stringify({
      status: 'healthy',
      service: 'moderation-webhook',
      syncTargets: syncStatus.activeTargets,
      timestamp: new Date().toISOString()
    }), 
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  )
}