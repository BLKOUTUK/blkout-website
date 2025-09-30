// Content Integration Service - Bridge between RSS automation and existing systems
// Integrates with existing events calendar and Supabase infrastructure
// Priority 1 implementation for immediate community organisation value

import { supabase } from '../lib/supabase';
import { contentDiscoveryService, CuratedContent } from './contentDiscoveryService';

export interface IntegratedEvent {
  // Existing event format from events calendar
  id: string;
  name: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer_name: string;
  source: string;
  source_url: string;
  tags: string[];
  status: 'draft' | 'reviewing' | 'approved' | 'archived';
  
  // RSS automation enhancements
  auto_discovered: boolean;
  relevance_score?: number;
  community_approved?: boolean;
  liberation_focus?: string[];
  accessibility_notes?: string;
}

export interface NewsroomContent {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_date: string;
  categories: string[];
  status: 'draft' | 'published';
  
  // Community curation enhancements
  community_curated: boolean;
  liberation_relevance: number;
  economic_justice_score: number;
  source_organisation: string;
}

class ContentIntegrationService {
  
  // Integrate auto-discovered content with existing events system
  async integrateDiscoveredEvents(): Promise<number> {
    try {
      console.log('🔗 Integrating auto-discovered events with existing calendar system...');
      
      // Get approved content that's marked as events
      const { data: approvedContent, error } = await supabase
        .from('auto_discovered_content')
        .select('*')
        .eq('status', 'community_approved')
        .eq('content_type', 'event')
        .is('integrated_at', null); // Not yet integrated
      
      if (error) throw error;
      
      let integratedCount = 0;
      
      for (const content of approvedContent || []) {
        try {
          // Transform to existing events table format
          const integratedEvent: Partial<IntegratedEvent> = {
            name: content.title,
            title: content.title,
            description: content.description || '',
            event_date: content.published_date,
            location: 'TBA', // Would extract from content if available
            organizer_name: content.source,
            source: 'community-rss',
            source_url: content.url,
            tags: [...(content.auto_categories || []), ...(content.community_tags || [])],
            status: 'approved',
            
            // RSS automation specific fields
            auto_discovered: true,
            relevance_score: content.relevance_score,
            community_approved: true,
            liberation_focus: content.liberation_focus || [],
            accessibility_notes: content.accessibility_notes
          };
          
          // Insert into existing events table
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .insert([{
              title: integratedEvent.name,
              description: integratedEvent.description,
              date: integratedEvent.event_date,
              location: integratedEvent.location,
              organizer: integratedEvent.organizer_name,
              source: integratedEvent.source,
              url: integratedEvent.source_url,
              tags: integratedEvent.tags,
              status: integratedEvent.status,
              // Additional metadata
              scraped_date: new Date().toISOString(),
              relevance_score: integratedEvent.relevance_score,
              liberation_focus: integratedEvent.liberation_focus,
              accessibility_notes: integratedEvent.accessibility_notes
            }])
            .select()
            .single();
          
          if (eventError) {
            console.error(`❌ Failed to integrate event: ${content.title}`, eventError);
            continue;
          }
          
          // Mark as integrated in auto_discovered_content
          await supabase
            .from('auto_discovered_content')
            .update({ 
              integrated_at: new Date().toISOString(),
              integrated_id: eventData.id,
              integration_type: 'events_calendar'
            })
            .eq('id', content.id);
          
          integratedCount++;
          console.log(`✅ Integrated event: ${content.title}`);
          
        } catch (integrationError) {
          console.error(`❌ Failed to integrate content ${content.id}:`, integrationError);
        }
      }
      
      console.log(`🎉 Successfully integrated ${integratedCount} events into calendar`);
      return integratedCount;
      
    } catch (error) {
      console.error('❌ Content integration failed:', error);
      return 0;
    }
  }
  
  // Create newsroom content from auto-discovered articles
  async integrateDiscoveredNews(): Promise<number> {
    try {
      console.log('📰 Integrating auto-discovered news with newsroom system...');
      
      const { data: approvedContent, error } = await supabase
        .from('auto_discovered_content')
        .select('*')
        .eq('status', 'community_approved')
        .in('content_type', ['news', 'article', 'announcement'])
        .is('integrated_at', null);
      
      if (error) throw error;
      
      let integratedCount = 0;
      
      for (const content of approvedContent || []) {
        try {
          const newsroomContent: Partial<NewsroomContent> = {
            title: content.title,
            content: content.ai_summary || content.description,
            excerpt: (content.description || '').substring(0, 200) + '...',
            author: content.source,
            published_date: content.published_date,
            categories: content.auto_categories || [],
            status: 'published',
            
            community_curated: true,
            liberation_relevance: content.relevance_score || 0,
            economic_justice_score: content.economic_justice_score || 0,
            source_organisation: content.source
          };
          
          // Insert into newsroom content table
          const { data: newsData, error: newsError } = await supabase
            .from('newsroom_content')
            .insert([newsroomContent])
            .select()
            .single();
          
          if (newsError) {
            console.error(`❌ Failed to integrate news: ${content.title}`, newsError);
            continue;
          }
          
          // Mark as integrated
          await supabase
            .from('auto_discovered_content')
            .update({ 
              integrated_at: new Date().toISOString(),
              integrated_id: newsData.id,
              integration_type: 'newsroom'
            })
            .eq('id', content.id);
          
          integratedCount++;
          console.log(`✅ Integrated news: ${content.title}`);
          
        } catch (integrationError) {
          console.error(`❌ Failed to integrate news ${content.id}:`, integrationError);
        }
      }
      
      console.log(`📰 Successfully integrated ${integratedCount} news items into newsroom`);
      return integratedCount;
      
    } catch (error) {
      console.error('❌ News integration failed:', error);
      return 0;
    }
  }
  
  // Run full content integration workflow
  async runFullContentIntegration(): Promise<{events: number, news: number}> {
    console.log('🚀 Starting full content integration workflow...');
    
    const [eventsIntegrated, newsIntegrated] = await Promise.all([
      this.integrateDiscoveredEvents(),
      this.integrateDiscoveredNews()
    ]);
    
    // Update integration statistics
    await this.updateIntegrationStats(eventsIntegrated, newsIntegrated);
    
    return {
      events: eventsIntegrated,
      news: newsIntegrated
    };
  }
  
  // Get integration statistics for community dashboard
  async getIntegrationStats(): Promise<{
    totalDiscovered: number;
    totalIntegrated: number;
    pendingIntegration: number;
    integrationByType: Record<string, number>;
    communityApprovalRate: number;
  }> {
    try {
      const [discoveredResult, integratedResult] = await Promise.all([
        supabase.from('auto_discovered_content').select('status, content_type, integrated_at'),
        supabase.from('auto_discovered_content').select('*').not('integrated_at', 'is', null)
      ]);
      
      const discovered = discoveredResult.data || [];
      const integrated = integratedResult.data || [];
      
      const stats = {
        totalDiscovered: discovered.length,
        totalIntegrated: integrated.length,
        pendingIntegration: discovered.filter(c => 
          c.status === 'community_approved' && !c.integrated_at
        ).length,
        integrationByType: discovered.reduce((acc: any, content) => {
          acc[content.content_type] = (acc[content.content_type] || 0) + 1;
          return acc;
        }, {}),
        communityApprovalRate: discovered.length > 0 ? 
          discovered.filter(c => c.status === 'community_approved').length / discovered.length : 0
      };
      
      return stats;
      
    } catch (error) {
      console.error('❌ Failed to get integration stats:', error);
      return {
        totalDiscovered: 0,
        totalIntegrated: 0,
        pendingIntegration: 0,
        integrationByType: {},
        communityApprovalRate: 0
      };
    }
  }
  
  // Enhanced event submission for community organisations
  async submitCommunityEvent(
    eventData: Partial<IntegratedEvent>, 
    orgProfile?: any
  ): Promise<{ success: boolean; eventId?: string; message: string }> {
    try {
      console.log('📝 Processing community organisation event submission...');
      
      // Enhanced event data with liberation focus
      const enhancedEventData = {
        ...eventData,
        source: orgProfile?.name || eventData.source || 'community-submission',
        status: orgProfile?.trust_level === 'high' ? 'approved' : 'reviewing',
        auto_discovered: false,
        community_submitted: true,
        liberation_focus: eventData.liberation_focus || orgProfile?.liberation_focus || [],
        accessibility_notes: eventData.accessibility_notes || '',
        community_approved: orgProfile?.trust_level === 'high'
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: enhancedEventData.name,
          description: enhancedEventData.description,
          date: enhancedEventData.event_date,
          location: enhancedEventData.location,
          organizer: enhancedEventData.organizer_name,
          source: enhancedEventData.source,
          url: enhancedEventData.source_url,
          tags: enhancedEventData.tags,
          status: enhancedEventData.status,
          liberation_focus: enhancedEventData.liberation_focus,
          accessibility_notes: enhancedEventData.accessibility_notes,
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const message = enhancedEventData.status === 'approved' 
        ? 'Event approved and published immediately (trusted organisation)'
        : 'Event submitted for community review';
      
      console.log(`✅ Event submitted: ${eventData.name} - ${message}`);
      
      return {
        success: true,
        eventId: data.id,
        message
      };
      
    } catch (error) {
      console.error('❌ Event submission failed:', error);
      return {
        success: false,
        message: 'Failed to submit event. Please try again.'
      };
    }
  }
  
  // Community organisation dashboard data
  async getCommunityOrgDashboardData(orgName: string): Promise<{
    eventsSubmitted: number;
    eventsApproved: number;
    communityReach: number;
    engagementRate: number;
    upcomingEvents: IntegratedEvent[];
    contentDiscovered: number;
  }> {
    try {
      const [eventsResult, discoveredResult] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .or(`organizer.eq.${orgName},source.eq.${orgName}`),
        supabase
          .from('auto_discovered_content')
          .select('*')
          .eq('source', orgName)
      ]);
      
      const events = eventsResult.data || [];
      const discovered = discoveredResult.data || [];
      
      return {
        eventsSubmitted: events.length,
        eventsApproved: events.filter(e => e.status === 'approved').length,
        communityReach: 847 + Math.floor(Math.random() * 200), // Placeholder - would calculate from actual engagement
        engagementRate: 0.85, // Placeholder - would calculate from actual metrics
        upcomingEvents: events
          .filter(e => new Date(e.date) > new Date() && e.status === 'approved')
          .slice(0, 5) as IntegratedEvent[],
        contentDiscovered: discovered.length
      };
      
    } catch (error) {
      console.error('❌ Failed to get org dashboard data:', error);
      return {
        eventsSubmitted: 0,
        eventsApproved: 0,
        communityReach: 0,
        engagementRate: 0,
        upcomingEvents: [],
        contentDiscovered: 0
      };
    }
  }
  
  private async updateIntegrationStats(events: number, news: number): Promise<void> {
    try {
      await supabase
        .from('integration_stats')
        .insert([{
          date: new Date().toISOString().split('T')[0],
          events_integrated: events,
          news_integrated: news,
          total_integrated: events + news,
          integration_run_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('❌ Failed to update integration stats:', error);
    }
  }
}

export const contentIntegrationService = new ContentIntegrationService();