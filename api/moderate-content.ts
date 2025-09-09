// Moderation API Route
// File: api/moderate-content.ts
// Purpose: Handle approve/reject actions from moderation dashboard

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { publicationService } from '../src/services/publicationService';

interface ModerationRequest {
  action: 'approve' | 'reject' | 'edit';
  contentId: string;
  contentType: 'events' | 'newsroom_articles';
  moderatorId: string;
  reason?: string;
  edits?: {
    title?: string;
    content?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests supported for content moderation'
    });
  }

  try {
    const { action, contentId, contentType, moderatorId, reason, edits } = req.body as ModerationRequest;

    // Validate required fields
    if (!action || !contentId || !contentType || !moderatorId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'action, contentId, contentType, and moderatorId are required'
      });
    }

    // Validate content type
    if (!['events', 'newsroom_articles'].includes(contentType)) {
      return res.status(400).json({
        error: 'Invalid content type',
        message: 'contentType must be either "events" or "newsroom_articles"'
      });
    }

    // Handle different moderation actions
    switch (action) {
      case 'approve':
        try {
          const publishedContent = await publicationService.approveFromModeration(
            contentId, 
            moderatorId,
            contentType
          );
          
          return res.status(200).json({
            success: true,
            message: 'Content approved and published successfully',
            data: {
              published: publishedContent,
              contentId,
              contentType,
              action: 'approved',
              timestamp: new Date().toISOString()
            }
          });
          
        } catch (error) {
          console.error('Approval failed:', error);
          return res.status(500).json({
            error: 'Approval failed',
            message: error instanceof Error ? error.message : 'Unknown error during approval'
          });
        }

      case 'reject':
        if (!reason) {
          return res.status(400).json({
            error: 'Rejection reason required',
            message: 'reason field required when rejecting content'
          });
        }
        
        try {
          await publicationService.rejectFromModeration(
            contentId, 
            moderatorId, 
            reason,
            contentType
          );
          
          return res.status(200).json({
            success: true,
            message: 'Content rejected successfully',
            data: {
              contentId,
              action: 'rejected',
              reason,
              moderatorId,
              timestamp: new Date().toISOString()
            }
          });
          
        } catch (error) {
          console.error('Rejection failed:', error);
          return res.status(500).json({
            error: 'Rejection failed',
            message: error instanceof Error ? error.message : 'Unknown error during rejection'
          });
        }

      case 'edit':
        if (!edits || Object.keys(edits).length === 0) {
          return res.status(400).json({
            error: 'Edit data required',
            message: 'edits object required when editing content'
          });
        }
        
        // TODO: Implement edit functionality
        return res.status(501).json({
          error: 'Edit functionality not yet implemented',
          message: 'Content editing will be available in next update'
        });

      default:
        return res.status(400).json({
          error: 'Invalid action',
          message: 'action must be one of: approve, reject, edit'
        });
    }

  } catch (error) {
    console.error('Moderation API error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process moderation request',
      timestamp: new Date().toISOString()
    });
  }
}

// Export for testing
export { handler };