// Updated Publication Service for bgjengudzfickgomjqmz project
// Works with existing 'events' and 'newsroom_articles' tables
// File: src/services/publicationService.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ModeratedContent {
  id: string;
  title: string;
  content: string;
  author?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  // Event-specific fields
  event_date?: string;
  location?: string;
  // Metadata
  created_at?: string;
  updated_at?: string;
}

interface PublishedContent {
  id: string;
  title: string;
  content: string;
  published_at: string;
  approved_by: string;
  status: 'published';
  source: string;
  original_event_id?: string;
  original_article_id?: string;
}

export interface PublicationService {
  approveFromModeration(contentId: string, approverId: string, contentType: 'events' | 'newsroom_articles'): Promise<PublishedContent>;
  rejectFromModeration(contentId: string, moderatorId: string, reason: string, contentType: 'events' | 'newsroom_articles'): Promise<void>;
  publishContent(content: ModeratedContent, contentType: 'events' | 'newsroom_articles'): Promise<PublishedContent>;
  updatePublicationStatus(contentId: string, status: 'published' | 'draft' | 'archived'): Promise<void>;
  getPublishedContent(type?: 'events' | 'news' | 'articles'): Promise<PublishedContent[]>;
  getModerationQueue(contentType?: 'events' | 'newsroom_articles'): Promise<ModeratedContent[]>;
  submitContent(content: Partial<ModeratedContent>, contentType: 'events' | 'newsroom_articles'): Promise<ModeratedContent>;
}

export class CommunityPublicationService implements PublicationService {
  
  async approveFromModeration(
    contentId: string, 
    approverId: string, 
    contentType: 'events' | 'newsroom_articles'
  ): Promise<PublishedContent> {
    try {
      // 1. Get content from original table (events or newsroom_articles)
      const { data: moderatedContent, error: fetchError } = await supabase
        .from(contentType)
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (fetchError || !moderatedContent) {
        throw new Error(`Content not found in ${contentType}: ${fetchError?.message || 'Unknown error'}`);
      }

      // 2. Update original table status to approved
      const { error: updateError } = await supabase
        .from(contentType)
        .update({ 
          status: 'approved',
          approved_by: approverId,
          approved_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (updateError) {
        throw new Error(`Failed to update ${contentType} status: ${updateError.message}`);
      }

      // 3. Publish the content
      const published = await this.publishContent(moderatedContent, contentType);

      // 4. Log the moderation action
      await this.logModerationAction(contentId, contentType, 'approved', approverId);

      return published;

    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  }

  async rejectFromModeration(
    contentId: string, 
    moderatorId: string, 
    reason: string,
    contentType: 'events' | 'newsroom_articles'
  ): Promise<void> {
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
        throw new Error(`Failed to reject ${contentType}: ${error.message}`);
      }

      // Log rejection for transparency
      await this.logModerationAction(contentId, contentType, 'rejected', moderatorId, reason);

    } catch (error) {
      console.error('Rejection failed:', error);
      throw error;
    }
  }

  async publishContent(content: ModeratedContent, contentType: 'events' | 'newsroom_articles'): Promise<PublishedContent> {
    try {
      // Determine target publication table
      const targetTable = this.getPublicationTable(contentType);
      
      const publishedContent = {
        id: crypto.randomUUID(),
        title: content.title,
        content: content.content,
        author: content.author,
        published_at: new Date().toISOString(),
        status: 'published' as const,
        source: content.source || 'chrome_extension',
        approved_by: content.approved_by,
        // Add original reference
        ...(contentType === 'events' ? { 
          original_event_id: content.id,
          event_date: content.event_date,
          location: content.location 
        } : { 
          original_article_id: content.id 
        }),
        metadata: {
          original_table: contentType,
          priority: content.priority,
          approved_at: content.approved_at
        }
      };

      // Insert into appropriate published content table
      const { data: published, error } = await supabase
        .from(targetTable)
        .insert(publishedContent)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to publish content to ${targetTable}: ${error.message}`);
      }

      // Log successful publication
      await this.logPublicationEvent(published.id, targetTable, content.id, contentType, content.approved_by);
      
      // Trigger publication webhooks
      await this.triggerWebhooks(published, contentType, 'published');

      // Update original content status to published
      await supabase
        .from(contentType)
        .update({ status: 'published' })
        .eq('id', content.id);

      return published;

    } catch (error) {
      console.error('Publication failed:', error);
      throw error;
    }
  }

  async updatePublicationStatus(contentId: string, status: 'published' | 'draft' | 'archived'): Promise<void> {
    try {
      // Update across all publication tables
      const tables = ['published_events', 'published_news', 'published_articles'];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', contentId);
        
        if (error && !error.message.includes('No rows')) {
          console.error(`Failed to update status in ${table}:`, error);
        }
      }
      
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  }

  async getPublishedContent(type?: 'events' | 'news' | 'articles'): Promise<PublishedContent[]> {
    try {
      const tables = type ? [this.getPublicationTable(type as any)] : 
                     ['published_events', 'published_news', 'published_articles'];
      
      const allContent: PublishedContent[] = [];
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(50);
        
        if (error) {
          console.error(`Failed to fetch from ${table}:`, error);
          continue;
        }
        
        if (data) {
          allContent.push(...data);
        }
      }
      
      // Sort by publication date across all tables
      return allContent.sort((a, b) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
      
    } catch (error) {
      console.error('Failed to get published content:', error);
      return [];
    }
  }

  async getModerationQueue(contentType?: 'events' | 'newsroom_articles'): Promise<ModeratedContent[]> {
    try {
      const tables = contentType ? [contentType] : ['events', 'newsroom_articles'];
      const allContent: ModeratedContent[] = [];
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .in('status', ['pending', 'rejected']) // Show pending and rejected items
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(`Failed to fetch moderation queue from ${table}:`, error);
          continue;
        }
        
        if (data) {
          allContent.push(...data);
        }
      }
      
      return allContent.sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      });
      
    } catch (error) {
      console.error('Failed to get moderation queue:', error);
      return [];
    }
  }

  private getPublicationTable(contentType: string): string {
    switch (contentType) {
      case 'events':
        return 'published_events';
      case 'newsroom_articles':
        return 'published_news';
      default:
        return 'published_articles'; // Default fallback
    }
  }

  private async logModerationAction(
    contentId: string,
    contentTable: string,
    action: string,
    moderatorId: string,
    reason?: string
  ): Promise<void> {
    try {
      await supabase
        .from('moderation_log')
        .insert({
          content_id: contentId,
          content_table: contentTable,
          action,
          moderator_id: moderatorId,
          reason,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log moderation action:', error);
      // Don't throw - logging is supplementary
    }
  }

  private async logPublicationEvent(
    publishedId: string,
    publishedTable: string,
    originalId: string,
    originalTable: string,
    approverId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('publication_log')
        .insert({
          published_id: publishedId,
          published_table: publishedTable,
          original_id: originalId,
          original_table: originalTable,
          approved_by: approverId,
          published_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log publication event:', error);
      // Don't throw - logging is supplementary
    }
  }

  // New methods for enhanced moderation functionality
  async getContentById(contentId: string, contentType: 'events' | 'newsroom_articles'): Promise<ModeratedContent | null> {
    try {
      const { data, error } = await supabase
        .from(contentType)
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (error) {
        console.error(`Failed to get content from ${contentType}:`, error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to get content by ID:', error);
      return null;
    }
  }

  async editFromModeration(
    contentId: string,
    moderatorId: string,
    edits: {
      title?: string;
      content?: string;
      priority?: 'low' | 'medium' | 'high';
      event_date?: string;
      location?: string;
    },
    contentType: 'events' | 'newsroom_articles'
  ): Promise<ModeratedContent> {
    try {
      // Update content with edits
      const { data: updatedContent, error } = await supabase
        .from(contentType)
        .update({
          ...edits,
          updated_at: new Date().toISOString(),
          // Keep status as pending after edit - requires re-approval
          status: 'pending'
        })
        .eq('id', contentId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to edit ${contentType}: ${error.message}`);
      }

      // Log the edit action
      await this.logModerationAction(
        contentId, 
        contentType, 
        'edited', 
        moderatorId, 
        `Edited fields: ${Object.keys(edits).join(', ')}`
      );

      return updatedContent;

    } catch (error) {
      console.error('Edit failed:', error);
      throw error;
    }
  }

  async batchModerationAction(
    contentIds: string[],
    action: 'approve' | 'reject',
    moderatorId: string,
    reason?: string
  ): Promise<{ successful: string[], failed: string[], results: any[] }> {
    const successful: string[] = [];
    const failed: string[] = [];
    const results: any[] = [];

    for (const contentId of contentIds) {
      try {
        // Detect content type for each item
        const contentType = await this.detectContentTypeInternal(contentId);
        
        if (action === 'approve') {
          const result = await this.approveFromModeration(contentId, moderatorId, contentType);
          successful.push(contentId);
          results.push({ contentId, status: 'approved', data: result });
        } else if (action === 'reject') {
          if (!reason) {
            throw new Error('Reason required for rejection');
          }
          await this.rejectFromModeration(contentId, moderatorId, reason, contentType);
          successful.push(contentId);
          results.push({ contentId, status: 'rejected', reason });
        }
      } catch (error) {
        console.error(`Batch ${action} failed for ${contentId}:`, error);
        failed.push(contentId);
        results.push({ 
          contentId, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return { successful, failed, results };
  }

  async getPendingCount(contentType?: 'events' | 'newsroom_articles'): Promise<number> {
    try {
      const tables = contentType ? [contentType] : ['events', 'newsroom_articles'];
      let totalCount = 0;
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        if (error) {
          console.error(`Failed to count pending items in ${table}:`, error);
          continue;
        }
        
        totalCount += count || 0;
      }
      
      return totalCount;
    } catch (error) {
      console.error('Failed to get pending count:', error);
      return 0;
    }
  }

  async submitContent(content: Partial<ModeratedContent>, contentType: 'events' | 'newsroom_articles'): Promise<ModeratedContent> {
    try {
      // Create complete content record
      const submissionData: ModeratedContent = {
        id: crypto.randomUUID(),
        title: content.title || 'Untitled',
        content: content.content || '',
        author: content.author || 'Community Submitted',
        status: 'pending',
        priority: content.priority || 'medium',
        source: content.source || 'web_form',
        created_at: new Date().toISOString(),
        ...content // Include any additional fields
      };

      // Insert into appropriate table (Supabase database)
      const { data, error } = await supabase
        .from(contentType)
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to submit ${contentType}: ${error.message}`);
      }

      console.log(`Successfully submitted ${contentType}:`, data.id);
      
      // Trigger webhook automation workflows
      await this.triggerWebhooks(data, contentType, 'submitted');
      
      // Notify IVOR and other federated services (optional enhancement)
      await this.notifyFederatedServices(data, contentType);
      
      return data;

    } catch (error) {
      console.error('Content submission failed:', error);
      throw error;
    }
  }

  private async notifyFederatedServices(content: ModeratedContent, contentType: string): Promise<void> {
    try {
      // Import federation services
      const { connectionManager } = await import('./FederatedConnectionManager');
      
      // Notify IVOR for wisdom and governance insights
      await connectionManager.executeOptionalCall(
        'IVOR',
        '/api/v1/content/submitted',
        {
          timeout: 1000,
          fallbackValue: null
        }
      );

      // Notify Events Calendar if it's an event
      if (contentType === 'events') {
        await connectionManager.executeOptionalCall(
          'EventsCalendar',
          '/api/events/sync',
          {
            timeout: 1000,
            fallbackValue: null
          }
        );
      }

      console.log(`✅ Federated services notified for content: ${content.id}`);
    } catch (error) {
      // Federated notifications are optional - don't fail the submission
      console.log(`ℹ️ Federated notification failed (non-critical):`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async detectContentTypeInternal(contentId: string): Promise<'events' | 'newsroom_articles'> {
    const eventCheck = await this.getContentById(contentId, 'events');
    if (eventCheck) return 'events';
    
    const articleCheck = await this.getContentById(contentId, 'newsroom_articles');
    if (articleCheck) return 'newsroom_articles';
    
    throw new Error(`Content ${contentId} not found in any table`);
  }

  private async triggerWebhooks(content: ModeratedContent | PublishedContent, contentType: string, action: 'submitted' | 'published'): Promise<void> {
    try {
      const webhookBase = 'https://blkout-moderation.vercel.app/api/webhooks';
      
      // Trigger N8N automation workflow
      try {
        await fetch(`${webhookBase}/n8n-submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            contentType,
            action
          })
        });
        console.log(`✅ N8N webhook triggered for ${action}:`, content.id);
      } catch (error) {
        console.log(`ℹ️ N8N webhook failed (non-critical):`, error);
      }

      // For published content, trigger additional webhooks
      if (action === 'published') {
        // Trigger BLKOUTHUB mobile app sync
        try {
          await fetch(`${webhookBase}/blkouthub`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              action,
              contentType
            })
          });
          console.log(`✅ BLKOUTHUB webhook triggered:`, content.id);
        } catch (error) {
          console.log(`ℹ️ BLKOUTHUB webhook failed (non-critical):`, error);
        }

        // Trigger social media automation
        try {
          await fetch(`${webhookBase}/social-publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              contentType,
              action
            })
          });
          console.log(`✅ Social media webhook triggered:`, content.id);
        } catch (error) {
          console.log(`ℹ️ Social media webhook failed (non-critical):`, error);
        }
      }

    } catch (error) {
      console.log(`ℹ️ Webhook triggers failed (non-critical):`, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

// Export singleton instance
export const publicationService = new CommunityPublicationService();