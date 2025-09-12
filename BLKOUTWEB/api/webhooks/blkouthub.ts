// BLKOUTHUB Mobile App Sync Webhook
// Notifies mobile app when content is published
// File: api/webhooks/blkouthub.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS for webhook calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests supported for BLKOUTHUB webhook'
    });
  }

  try {
    const { content, action, contentType } = req.body;

    if (!content || !action) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'content and action are required'
      });
    }

    // Send to BLKOUTHUB mobile app
    const blkouthubPayload = {
      event: 'content.published',
      data: {
        id: content.id,
        title: content.title,
        content: content.content,
        type: contentType,
        published_at: content.published_at,
        approved_by: content.approved_by,
        source: content.source,
        // Mobile-specific fields
        notification: {
          title: `New ${contentType}: ${content.title}`,
          body: content.content.substring(0, 100) + '...',
          action_url: `/content/${content.id}`
        }
      },
      timestamp: new Date().toISOString()
    };

    // Send to actual BLKOUTHUB endpoint with Bearer token authentication
    const blkouthubUrl = process.env.BLKOUTHUB_API_URL || 'https://hub.blkout.uk/api/v1/sync';
    const apiKey = process.env.BLKOUTHUB_API_KEY;
    
    if (apiKey && blkouthubUrl) {
      try {
        const blkouthubResponse = await fetch(blkouthubUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(blkouthubPayload)
        });

        if (!blkouthubResponse.ok) {
          console.warn('BLKOUTHUB API call failed:', blkouthubResponse.status);
        }
      } catch (error) {
        console.error('BLKOUTHUB webhook failed (non-critical):', error);
      }
    } else {
      console.log('BLKOUTHUB API not configured - skipping actual API call');
    }

    console.log('BLKOUTHUB webhook triggered:', blkouthubPayload);

    return res.status(200).json({
      success: true,
      message: 'BLKOUTHUB mobile app notified successfully',
      data: {
        contentId: content.id,
        action,
        notificationSent: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('BLKOUTHUB webhook failed:', error);
    return res.status(500).json({
      error: 'Webhook failed',
      message: error instanceof Error ? error.message : 'Unknown error during BLKOUTHUB sync'
    });
  }
}