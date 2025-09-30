// Community Content Discovery Engine for RSS/Webscraping Automation
// Priority 1 Task: T015 - RSS content discovery automation
// Building on existing Supabase infrastructure

import { supabase } from '../lib/supabase';
import { XMLParser } from 'fast-xml-parser';

export interface CuratedContent {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  source_url: string;
  published_date: string;
  content_type: 'event' | 'news' | 'article' | 'announcement';
  relevance_score: number;
  auto_categories: string[];
  needs_community_approval: boolean;
  scraped_at: string;
  status: 'auto_discovered' | 'community_approved' | 'rejected';
  community_tags: string[];
  target_audience?: string;
  accessibility_notes?: string;
}

export interface DigestedContent extends CuratedContent {
  ai_summary: string;
  community_relevance: string;
  suggested_actions: string[];
  economic_justice_score: number;
  liberation_focus: string[];
}

export interface CommunityOrgSource {
  name: string;
  url: string;
  rss_feed?: string;
  scrape_pattern?: string;
  trust_level: 'high' | 'medium' | 'low';
  community_verified: boolean;
  last_scraped: string;
  active: boolean;
}

class CommunityContentDiscoveryService {
  private xmlParser: XMLParser;
  
  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text"
    });
  }

  // BLKOUT UK content scraping - immediate community value
  async scrapeBLKOUTUKContent(): Promise<CuratedContent[]> {
    console.log('🔍 Starting BLKOUT UK content discovery...');
    
    const blkoutSources = [
      'https://blkout.uk/events',
      'https://blkout.uk/news', 
      'https://blkout.uk/blog'
    ];
    
    const discoveredContent: CuratedContent[] = [];
    
    for (const sourceUrl of blkoutSources) {
      try {
        // Scrape BLKOUT UK content with community liberation focus
        const content = await this.scrapeWebsiteContent(sourceUrl, 'blkout_uk');
        discoveredContent.push(...content);
      } catch (error) {
        console.error(`❌ Failed to scrape ${sourceUrl}:`, error);
      }
    }
    
    // Flag as automatically discovered for community verification
    return discoveredContent.map(content => ({
      ...content,
      needs_community_approval: true,
      status: 'auto_discovered' as const,
      community_tags: ['black-queer-liberation', 'community-owned'],
      relevance_score: 0.9 // High relevance for BLKOUT UK content
    }));
  }

  // Community organisation RSS feeds processing
  async processRelevantRSSFeeds(): Promise<DigestedContent[]> {
    console.log('🔄 Processing community organisation RSS feeds...');
    
    const communityFeeds: CommunityOrgSource[] = [
      {
        name: 'Stonewall UK',
        url: 'https://www.stonewall.org.uk',
        rss_feed: 'https://www.stonewall.org.uk/rss.xml',
        trust_level: 'high',
        community_verified: true,
        last_scraped: new Date().toISOString(),
        active: true
      },
      {
        name: 'Mermaids UK',
        url: 'https://www.mermaidsuk.org.uk',
        rss_feed: 'https://www.mermaidsuk.org.uk/feed/',
        trust_level: 'high',
        community_verified: true,
        last_scraped: new Date().toISOString(),
        active: true
      },
      {
        name: 'Black Pride UK',
        url: 'https://www.blackpride.org.uk',
        rss_feed: 'https://www.blackpride.org.uk/feed/',
        trust_level: 'high',
        community_verified: true,
        last_scraped: new Date().toISOString(),
        active: true
      },
      {
        name: 'UK Black Pride',
        url: 'https://www.ukblackpride.org.uk',
        rss_feed: 'https://www.ukblackpride.org.uk/feed/',
        trust_level: 'high',
        community_verified: true,
        last_scraped: new Date().toISOString(),
        active: true
      }
    ];
    
    const digestedContent: DigestedContent[] = [];
    
    for (const feed of communityFeeds.filter(f => f.active)) {
      try {
        const rssContent = await this.processRSSFeed(feed);
        digestedContent.push(...rssContent);
      } catch (error) {
        console.error(`❌ Failed to process RSS feed ${feed.name}:`, error);
      }
    }
    
    return digestedContent;
  }

  // London/UK queer event aggregation with liberation focus
  async aggregateQueerEvents(): Promise<CuratedContent[]> {
    console.log('🎉 Aggregating queer community events...');
    
    // PRIORITY: Instagram discovery for grassroots Black LGBT organizations
    const { instagramContentDiscoveryService } = await import('./instagramContentDiscovery');
    
    try {
      console.log('📱 Starting Instagram discovery for grassroots organizations...');
      const instagramEvents = await instagramContentDiscoveryService.discoverInstagramEvents();
      
      // Convert Instagram events to CuratedContent format
      const instagramCuratedContent: CuratedContent[] = instagramEvents.map(instaEvent => ({
        id: instaEvent.id,
        title: instaEvent.title,
        description: instaEvent.description,
        url: instaEvent.url,
        source: instaEvent.source,
        source_url: instaEvent.source_url,
        published_date: instaEvent.published_date,
        content_type: instaEvent.content_type,
        relevance_score: instaEvent.relevance_score,
        auto_categories: [...instaEvent.auto_categories, 'instagram-grassroots'],
        needs_community_approval: instaEvent.needs_community_approval,
        scraped_at: instaEvent.scraped_at,
        status: instaEvent.status,
        community_tags: [...instaEvent.community_tags, 'grassroots-organization'],
        target_audience: instaEvent.target_audience,
        accessibility_notes: instaEvent.accessibility_notes
      }));
      
      console.log(`📱 Instagram discovery found ${instagramCuratedContent.length} grassroots events`);
      
      // Also include traditional event sources as backup
      const eventSources = [
        'https://www.eventbrite.co.uk/d/united-kingdom--london/black-pride/',
        'https://www.eventbrite.co.uk/d/united-kingdom--london/queer-poc/',
        'https://www.eventbrite.co.uk/d/united-kingdom--london/black-queer/',
        'https://www.facebook.com/events/search/?q=black%20queer%20london'
      ];
      
      const traditionalEvents: CuratedContent[] = [];
      
      for (const source of eventSources) {
        try {
          const events = await this.scrapeEventSource(source);
          traditionalEvents.push(...events);
        } catch (error) {
          console.error(`❌ Failed to aggregate events from ${source}:`, error);
        }
      }
      
      // Combine Instagram (priority) with traditional sources
      const allEvents = [...instagramCuratedContent, ...traditionalEvents];
      
      // Filter for Black/queer/trans relevance and accessibility
      return allEvents.filter(event => 
        this.assessLiberationRelevance(event) > 0.6
      ).map(event => ({
        ...event,
        content_type: 'event' as const,
        needs_community_approval: true,
        community_tags: [...event.community_tags, 'community-events', 'black-queer-liberation']
      }));
      
    } catch (error) {
      console.error('❌ Instagram discovery failed, falling back to traditional sources:', error);
      
      // Fallback to traditional event sources only
      const eventSources = [
        'https://www.eventbrite.co.uk/d/united-kingdom--london/black-pride/',
        'https://www.eventbrite.co.uk/d/united-kingdom--london/queer-poc/',
        'https://www.eventbrite.co.uk/d/united-kingdom--london/black-queer/'
      ];
      
      const aggregatedEvents: CuratedContent[] = [];
      
      for (const source of eventSources) {
        try {
          const events = await this.scrapeEventSource(source);
          aggregatedEvents.push(...events);
        } catch (error) {
          console.error(`❌ Failed to aggregate events from ${source}:`, error);
        }
      }
      
      return aggregatedEvents.filter(event => 
        this.assessLiberationRelevance(event) > 0.6
      ).map(event => ({
        ...event,
        content_type: 'event' as const,
        needs_community_approval: true,
        community_tags: ['community-events', 'black-queer-liberation']
      }));
    }
  }

  // RSS Feed Processing with AI filtering
  private async processRSSFeed(source: CommunityOrgSource): Promise<DigestedContent[]> {
    if (!source.rss_feed) return [];
    
    try {
      console.log(`📡 Fetching RSS feed: ${source.name}`);
      const response = await fetch(source.rss_feed);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      const parsed = this.xmlParser.parse(xmlText);
      
      const items = this.extractRSSItems(parsed);
      const digestedItems: DigestedContent[] = [];
      
      for (const item of items) {
        try {
          const relevanceScore = this.assessLiberationRelevance(item);
          
          if (relevanceScore > 0.5) { // Only include relevant content
            const digestedItem: DigestedContent = {
              id: this.generateContentId(item.title, source.name),
              title: item.title,
              description: item.description || '',
              url: item.url,
              source: source.name,
              source_url: source.url,
              published_date: item.published_date,
              content_type: this.categorizeContent(item),
              relevance_score: relevanceScore,
              auto_categories: this.generateAutoCategories(item),
              needs_community_approval: source.trust_level !== 'high',
              scraped_at: new Date().toISOString(),
              status: 'auto_discovered',
              community_tags: ['rss-feed', 'community-organisation'],
              ai_summary: await this.generateAISummary(item),
              community_relevance: this.assessCommunityRelevance(item),
              suggested_actions: this.generateSuggestedActions(item),
              economic_justice_score: this.assessEconomicJustice(item),
              liberation_focus: this.identifyLiberationFocus(item)
            };
            
            digestedItems.push(digestedItem);
          }
        } catch (itemError) {
          console.error(`❌ Failed to process RSS item:`, itemError);
        }
      }
      
      console.log(`✅ Processed ${digestedItems.length} relevant items from ${source.name}`);
      return digestedItems;
      
    } catch (error) {
      console.error(`❌ Failed to process RSS feed ${source.name}:`, error);
      return [];
    }
  }

  // Website content scraping for BLKOUT UK
  private async scrapeWebsiteContent(url: string, sourceKey: string): Promise<CuratedContent[]> {
    // Placeholder for web scraping implementation
    // In production, this would use puppeteer or similar
    console.log(`🌐 Scraping website content: ${url}`);
    
    // Mock implementation returning sample content
    return [
      {
        id: this.generateContentId(`scraped-${sourceKey}`, url),
        title: `Community Event from ${url}`,
        description: 'Auto-discovered community content requiring verification',
        url: url,
        source: sourceKey,
        source_url: url,
        published_date: new Date().toISOString(),
        content_type: 'article',
        relevance_score: 0.8,
        auto_categories: ['community', 'scraped'],
        needs_community_approval: true,
        scraped_at: new Date().toISOString(),
        status: 'auto_discovered',
        community_tags: ['website-scrape', 'needs-verification']
      }
    ];
  }

  // Event source scraping
  private async scrapeEventSource(url: string): Promise<CuratedContent[]> {
    console.log(`🎭 Scraping event source: ${url}`);
    
    // Mock implementation - would integrate with Eventbrite/Facebook APIs
    return [
      {
        id: this.generateContentId('event', url),
        title: 'Black Queer Community Gathering',
        description: 'Auto-discovered community event with accessibility information',
        url: url,
        source: 'eventbrite',
        source_url: url,
        published_date: new Date().toISOString(),
        content_type: 'event',
        relevance_score: 0.9,
        auto_categories: ['events', 'community'],
        needs_community_approval: true,
        scraped_at: new Date().toISOString(),
        status: 'auto_discovered',
        community_tags: ['events', 'community-gathering'],
        accessibility_notes: 'Wheelchair accessible venue, BSL interpreter available'
      }
    ];
  }

  // Store discovered content in Supabase for community moderation
  async storeDiscoveredContent(content: CuratedContent[]): Promise<boolean> {
    try {
      console.log(`💾 Storing ${content.length} discovered content items...`);
      
      const { data, error } = await supabase
        .from('auto_discovered_content')
        .insert(content)
        .select();
      
      if (error) {
        console.error('❌ Failed to store content:', error);
        return false;
      }
      
      console.log(`✅ Successfully stored ${data?.length || 0} content items`);
      return true;
    } catch (error) {
      console.error('❌ Error storing discovered content:', error);
      return false;
    }
  }

  // Get content pending community approval
  async getContentPendingApproval(): Promise<CuratedContent[]> {
    try {
      const { data, error } = await supabase
        .from('auto_discovered_content')
        .select('*')
        .eq('status', 'auto_discovered')
        .order('scraped_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching pending content:', error);
      return [];
    }
  }

  // Quick approval workflow for community organisations
  async approveContent(contentId: string, communityNotes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auto_discovered_content')
        .update({
          status: 'community_approved',
          approved_at: new Date().toISOString(),
          community_notes: communityNotes
        })
        .eq('id', contentId);
      
      if (error) throw error;
      console.log(`✅ Content ${contentId} approved by community`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to approve content ${contentId}:`, error);
      return false;
    }
  }

  // Utility methods for content assessment
  private assessLiberationRelevance(content: any): number {
    const liberationKeywords = [
      'black', 'queer', 'lgbtq', 'trans', 'liberation', 'justice', 
      'community', 'solidarity', 'empowerment', 'cooperative', 
      'mutual aid', 'accessibility', 'inclusion', 'democracy'
    ];
    
    const text = `${content.title || ''} ${content.description || ''}`.toLowerCase();
    const matches = liberationKeywords.filter(keyword => text.includes(keyword));
    return Math.min(matches.length / liberationKeywords.length, 1.0);
  }

  private categorizeContent(item: any): 'event' | 'news' | 'article' | 'announcement' {
    const title = (item.title || '').toLowerCase();
    
    if (title.includes('event') || title.includes('gathering') || title.includes('workshop')) {
      return 'event';
    }
    if (title.includes('news') || title.includes('update')) {
      return 'news';
    }
    if (title.includes('announce') || title.includes('launch')) {
      return 'announcement';
    }
    return 'article';
  }

  private generateAutoCategories(item: any): string[] {
    const categories: string[] = [];
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    
    if (text.includes('event')) categories.push('events');
    if (text.includes('community')) categories.push('community');
    if (text.includes('workshop') || text.includes('training')) categories.push('education');
    if (text.includes('support') || text.includes('help')) categories.push('support');
    if (text.includes('pride') || text.includes('celebration')) categories.push('celebration');
    
    return categories.length > 0 ? categories : ['general'];
  }

  private generateContentId(title: string, source: string): string {
    const timestamp = Date.now();
    const hash = title.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
    return `${source}-${hash}-${timestamp}`;
  }

  private extractRSSItems(parsed: any): any[] {
    // Handle different RSS formats (RSS 2.0, Atom, etc.)
    if (parsed.rss?.channel?.item) {
      return Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
    }
    if (parsed.feed?.entry) {
      return Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
    }
    return [];
  }

  private async generateAISummary(item: any): Promise<string> {
    // Placeholder for AI summarization
    return `Community-relevant content: ${(item.description || '').substring(0, 200)}...`;
  }

  private assessCommunityRelevance(item: any): string {
    return 'Relevant to Black queer liberation community - requires community review';
  }

  private generateSuggestedActions(item: any): string[] {
    return ['Share with community', 'Add to events calendar', 'Feature in newsletter'];
  }

  private assessEconomicJustice(item: any): number {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    const economicJusticeKeywords = ['cooperative', 'mutual aid', 'economic justice', 'community ownership'];
    const matches = economicJusticeKeywords.filter(keyword => text.includes(keyword));
    return matches.length / economicJusticeKeywords.length;
  }

  private identifyLiberationFocus(item: any): string[] {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    const focuses: string[] = [];
    
    if (text.includes('racial justice') || text.includes('black liberation')) focuses.push('racial-justice');
    if (text.includes('queer') || text.includes('lgbtq')) focuses.push('queer-liberation');
    if (text.includes('trans') || text.includes('transgender')) focuses.push('trans-rights');
    if (text.includes('economic') || text.includes('cooperative')) focuses.push('economic-justice');
    if (text.includes('accessibility') || text.includes('disability')) focuses.push('disability-justice');
    
    return focuses;
  }
}

export const contentDiscoveryService = new CommunityContentDiscoveryService();