// Updated Publication Service for bgjengudzfickgomjqmz project
// Works with existing 'events' and 'newsroom_articles' tables
// File: src/services/publicationService.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
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
}

// Export singleton instance
export const publicationService = new CommunityPublicationService();