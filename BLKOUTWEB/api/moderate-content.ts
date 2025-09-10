// Moderation API Route
// File: api/moderate-content.ts
// Purpose: Handle approve/reject actions from moderation dashboard

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { publicationService } from '../src/services/publicationService';

// Content type detection helper
async function detectContentType(contentId: string): Promise<'events' | 'newsroom_articles'> {
  try {
    // Try events table first
    const eventCheck = await publicationService.getContentById(contentId, 'events');
    if (eventCheck) return 'events';
    
    // Try newsroom_articles table
    const articleCheck = await publicationService.getContentById(contentId, 'newsroom_articles');
    if (articleCheck) return 'newsroom_articles';
    
    throw new Error(`Content ${contentId} not found in any table`);
  } catch (error) {
    throw new Error(`Failed to detect content type: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

interface ModerationRequest {
  action: 'approve' | 'reject' | 'edit';
  contentId: string;
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
    const { action, contentId, moderatorId, reason, edits } = req.body as ModerationRequest;

    // Validate required fields
    if (!action || !contentId || !moderatorId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'action, contentId, and moderatorId are required'
      });
    }

    // Handle different moderation actions
    switch (action) {
      case 'approve':
        try {
          // Detect content type automatically  
          const contentType = await detectContentType(contentId);
          
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
          // Detect content type automatically
          const contentType = await detectContentType(contentId);
          
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
        
        try {
          // Detect content type automatically
          const contentType = await detectContentType(contentId);
          
          const updatedContent = await publicationService.editFromModeration(
            contentId,
            moderatorId,
            edits,
            contentType
          );
          
          return res.status(200).json({
            success: true,
            message: 'Content edited successfully',
            data: {
              updated: updatedContent,
              contentId,
              action: 'edited',
              edits,
              moderatorId,
              timestamp: new Date().toISOString()
            }
          });
          
        } catch (error) {
          console.error('Edit failed:', error);
          return res.status(500).json({
            error: 'Edit failed',
            message: error instanceof Error ? error.message : 'Unknown error during editing'
          });
        }

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