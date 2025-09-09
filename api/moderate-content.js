// Moderation API Route (JavaScript version for Vercel compatibility)
// File: api/moderate-content.js
// Purpose: Handle approve/reject actions from moderation dashboard

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
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
    const { action, contentId, contentType, moderatorId, reason } = req.body;

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
          // Get content from original table
          const { data: moderatedContent, error: fetchError } = await supabase
            .from(contentType)
            .select('*')
            .eq('id', contentId)
            .single();
          
          if (fetchError || !moderatedContent) {
            return res.status(404).json({
              error: 'Content not found',
              message: `Content not found in ${contentType}: ${fetchError?.message || 'Unknown error'}`
            });
          }

          // Update original table status to approved
          const { error: updateError } = await supabase
            .from(contentType)
            .update({ 
              status: 'approved',
              approved_by: moderatorId,
              approved_at: new Date().toISOString()
            })
            .eq('id', contentId);

          if (updateError) {
            return res.status(500).json({
              error: 'Approval failed',
              message: `Failed to update ${contentType} status: ${updateError.message}`
            });
          }

          // Determine target publication table
          const targetTable = contentType === 'events' ? 'published_events' : 'published_news';
          
          // Create published content
          const publishedContent = {
            id: crypto.randomUUID(),
            title: moderatedContent.title,
            content: moderatedContent.content,
            author: moderatedContent.author,
            published_at: new Date().toISOString(),
            status: 'published',
            source: moderatedContent.source || 'chrome_extension',
            approved_by: moderatorId,
            ...(contentType === 'events' ? { 
              original_event_id: moderatedContent.id,
              event_date: moderatedContent.event_date,
              location: moderatedContent.location 
            } : { 
              original_article_id: moderatedContent.id 
            }),
            metadata: {
              original_table: contentType,
              priority: moderatedContent.priority,
              approved_at: new Date().toISOString()
            }
          };

          // Insert into published content table
          const { data: published, error: publishError } = await supabase
            .from(targetTable)
            .insert(publishedContent)
            .select()
            .single();

          if (publishError) {
            return res.status(500).json({
              error: 'Publication failed',
              message: `Failed to publish content to ${targetTable}: ${publishError.message}`
            });
          }

          // Update original content status to published
          await supabase
            .from(contentType)
            .update({ status: 'published' })
            .eq('id', contentId);

          return res.status(200).json({
            success: true,
            message: 'Content approved and published successfully',
            data: {
              published: published,
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
          const { error } = await supabase
            .from(contentType)
            .update({ 
              status: 'rejected',
              rejected_by: moderatorId,
              rejection_reason: reason,
              rejected_at: new Date().toISOString()
            })
            .eq('id', contentId);

          if (error) {
            return res.status(500).json({
              error: 'Rejection failed',
              message: `Failed to reject ${contentType}: ${error.message}`
            });
          }

          return res.status(200).json({
            success: true,
            message: 'Content rejected successfully',
            data: {
              contentId,
              contentType,
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

      default:
        return res.status(400).json({
          error: 'Invalid action',
          message: 'action must be one of: approve, reject'
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