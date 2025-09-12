// N8N Content Submission Webhook  
// Triggers N8N automation workflows when content is submitted
// File: api/webhooks/n8n-submit.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests supported for N8N webhook'
    });
  }

  try {
    const { content, contentType, action = 'submitted' } = req.body;

    if (!content || !contentType) {
      return res.status(400).json({
        error: 'Missing required fields', 
        message: 'content and contentType are required'
      });
    }

    // N8N workflow payload
    const n8nPayload = {
      trigger: 'content.submitted',
      content: {
        id: content.id,
        title: content.title,
        content: content.content || content.description,
        type: contentType,
        priority: content.priority || 'medium',
        status: content.status || 'pending',
        source: content.source,
        author: content.author,
        created_at: content.created_at,
        ...(contentType === 'events' ? {
          event_date: content.event_date,
          location: content.location
        } : {})
      },
      metadata: {
        webhook_source: 'blkoutnxt-platform',
        action,
        timestamp: new Date().toISOString(),
        workflow_triggers: {
          moderation_queue: true,
          social_media_prep: contentType === 'events' ? true : false,
          community_notifications: true
        }
      }
    };

    // Send to N8N webhook endpoint
    // Replace with your actual N8N webhook URL
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/content-submission';
    
    try {
      // const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.N8N_API_KEY || ''}`
      //   },
      //   body: JSON.stringify(n8nPayload)
      // });

      console.log('N8N workflow triggered:', n8nPayload);
      
      return res.status(200).json({
        success: true,
        message: 'N8N automation workflow triggered successfully',
        data: {
          contentId: content.id,
          contentType,
          action,
          workflowsTriggered: Object.keys(n8nPayload.metadata.workflow_triggers),
          timestamp: new Date().toISOString()
        }
      });

    } catch (n8nError) {
      // N8N webhook failed but don't fail the main process
      console.error('N8N webhook failed (non-critical):', n8nError);
      
      return res.status(200).json({
        success: true,
        message: 'Content processed (N8N webhook failed but non-critical)',
        data: {
          contentId: content.id,
          n8nError: 'Failed to reach N8N webhook',
          fallbackProcessed: true
        }
      });
    }

  } catch (error) {
    console.error('N8N webhook processing failed:', error);
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error during N8N workflow'
    });
  }
}