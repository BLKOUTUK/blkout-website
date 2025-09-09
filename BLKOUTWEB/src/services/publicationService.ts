// Publication Service Implementation
// File: src/services/publicationService.ts
// Purpose: Bridge moderation queue to published content for community consumption

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ModeratedContent {
  id: string;
  content_id: string;
  type: 'news_digest' | 'community_event' | 'chrome_extension_content';
  title: string;
  content: string;
  author?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
}

interface PublishedContent {
  id: string;
  title: string;
  content: string;
  published_at: string;
  approved_by: string;
  status: 'published';
  source: string;
}

export interface PublicationService {
  approveFromModeration(contentId: string, approverId: string): Promise<PublishedContent>;
  rejectFromModeration(contentId: string, moderatorId: string, reason: string): Promise<void>;
  publishContent(content: ModeratedContent): Promise<PublishedContent>;
  updatePublicationStatus(contentId: string, status: 'published' | 'draft' | 'archived'): Promise<void>;
  getPublishedContent(type?: string): Promise<PublishedContent[]>;
}

export class CommunityPublicationService implements PublicationService {
  
  async approveFromModeration(contentId: string, approverId: string): Promise<PublishedContent> {
    try {
      // 1. Get content from moderation queue
      const { data: moderatedContent, error: fetchError } = await supabase
        .from('moderation_queue')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (fetchError || !moderatedContent) {
        throw new Error(`Content not found in moderation: ${fetchError?.message || 'Unknown error'}`);
      }

      // 2. Update moderation status to approved
      const { error: updateError } = await supabase
        .from('moderation_queue')
        .update({ 
          status: 'approved',
          approved_by: approverId,
          approved_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (updateError) {
        throw new Error(`Failed to update moderation status: ${updateError.message}`);
      }

      // 3. Publish the content
      const published = await this.publishContent(moderatedContent);

      // 4. Remove from moderation queue after successful publication
      await this.removeFromModerationQueue(contentId);

      return published;

    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  }

  async rejectFromModeration(contentId: string, moderatorId: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('moderation_queue')
        .update({ 
          status: 'rejected',
          rejected_by: moderatorId,
          rejection_reason: reason,
          rejected_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) {
        throw new Error(`Failed to reject content: ${error.message}`);
      }

      // Log rejection for transparency
      await this.logModerationAction(contentId, 'rejected', moderatorId, reason);

    } catch (error) {
      console.error('Rejection failed:', error);
      throw error;
    }
  }

  async publishContent(content: ModeratedContent): Promise<PublishedContent> {
    try {
      // Determine target publication table based on content type
      const targetTable = this.getPublicationTable(content.type);
      
      const publishedContent = {
        id: content.content_id || content.id,
        title: content.title,
        content: content.content,
        author: content.author,
        published_at: new Date().toISOString(),
        status: 'published' as const,
        source: content.source,
        approved_by: content.approved_by,
        original_moderation_id: content.id
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
      await this.logPublicationEvent(published.id, targetTable, content.approved_by);

      return published;

    } catch (error) {
      console.error('Publication failed:', error);
      throw error;
    }
  }

  async updatePublicationStatus(contentId: string, status: 'published' | 'draft' | 'archived'): Promise<void> {
    try {
      // Update across all publication tables - we don't know which one it's in
      const tables = ['published_news', 'published_events', 'published_articles'];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', contentId);
        
        // Don't throw on "not found" errors - content might be in a different table
        if (error && !error.message.includes('No rows')) {
          console.error(`Failed to update status in ${table}:`, error);
        }
      }
      
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  }

  async getPublishedContent(type?: string): Promise<PublishedContent[]> {
    try {
      const tables = type ? [this.getPublicationTable(type as any)] : 
                     ['published_news', 'published_events', 'published_articles'];
      
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

  private getPublicationTable(contentType: string): string {
    switch (contentType) {
      case 'news_digest':
      case 'automated_digest':
        return 'published_news';
      case 'community_event':
      case 'discovered_event':
        return 'published_events';
      case 'chrome_extension_content':
      case 'shared_article':
        return 'published_articles';
      default:
        return 'published_articles'; // Default fallback
    }
  }

  private async removeFromModerationQueue(contentId: string): Promise<void> {
    try {
      // Archive rather than delete for audit trail
      const { error } = await supabase
        .from('moderation_queue')
        .update({ 
          archived: true,
          archived_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) {
        console.error('Failed to archive moderation item:', error);
        // Don't throw - publication was successful, archiving is secondary
      }
    } catch (error) {
      console.error('Archive operation failed:', error);
    }
  }

  private async logModerationAction(
    contentId: string, 
    action: string, 
    moderatorId: string, 
    reason?: string
  ): Promise<void> {
    try {
      await supabase
        .from('moderation_log')
        .insert({
          content_id: contentId,
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
    table: string, 
    approverId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('publication_log')
        .insert({
          published_id: publishedId,
          table_name: table,
          approved_by: approverId,
          published_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log publication event:', error);
      // Don't throw - logging is supplementary
    }
  }
}

// Export singleton instance
export const publicationService = new CommunityPublicationService();