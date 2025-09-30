// Instagram Content Discovery for Grassroots Black LGBT Organizations
// Addresses the critical gap: smaller organizations without websites/RSS feeds
// Uses Instagram as primary source for grassroots community organizing

import { supabase } from '../lib/supabase';
import { CuratedContent } from './contentDiscoveryService';

export interface InstagramSource {
  handle: string;
  organization_name: string;
  verified_community_org: boolean;
  trust_level: 'high' | 'medium' | 'low';
  location: string;
  focus_areas: string[];
  follower_count_estimate?: string;
  last_scraped?: string;
  active: boolean;
  added_by_community?: string;
}

export interface InstagramPost {
  id: string;
  handle: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  post_date: string;
  media_type: 'image' | 'video' | 'carousel';
  media_urls: string[];
  engagement_estimate?: number;
  location_tag?: string;
}

export interface DiscoveredInstagramEvent extends CuratedContent {
  instagram_handle: string;
  instagram_post_id: string;
  hashtags: string[];
  mentions: string[];
  media_urls: string[];
  estimated_engagement: number;
  grassroots_indicators: string[];
  community_size_estimate: 'small' | 'medium' | 'large';
}

class InstagramContentDiscoveryService {
  
  // Curated list of Black LGBT grassroots organizations on Instagram
  private grassrootsBlackLGBTSources: InstagramSource[] = [
    // London-based grassroots organizations
    {
      handle: '@blackpridelondon',
      organization_name: 'Black Pride London',
      verified_community_org: true,
      trust_level: 'high',
      location: 'London',
      focus_areas: ['black-pride', 'community-events', 'liberation'],
      active: true
    },
    {
      handle: '@queertransblack',
      organization_name: 'Queer Trans Black Collective',
      verified_community_org: true,
      trust_level: 'high', 
      location: 'London',
      focus_areas: ['trans-rights', 'black-liberation', 'community-organizing'],
      active: true
    },
    {
      handle: '@blacktranslivesmatter',
      organization_name: 'Black Trans Lives Matter UK',
      verified_community_org: true,
      trust_level: 'high',
      location: 'UK',
      focus_areas: ['trans-rights', 'black-liberation', 'mutual-aid'],
      active: true
    },
    {
      handle: '@lgbtiqblackhistorymonth',
      organization_name: 'LGBTIQ Black History Month',
      verified_community_org: true,
      trust_level: 'high',
      location: 'UK',
      focus_areas: ['black-history', 'lgbtq-education', 'community-celebration'],
      active: true
    },
    {
      handle: '@blackgaymencollective',
      organization_name: 'Black Gay Men Collective',
      verified_community_org: true,
      trust_level: 'high',
      location: 'London',
      focus_areas: ['gay-men', 'black-liberation', 'mental-health'],
      active: true
    },
    // Smaller grassroots accounts - would be crowd-sourced by community
    {
      handle: '@qtpocldn',
      organization_name: 'QTPOC London',
      verified_community_org: false,
      trust_level: 'medium',
      location: 'London',
      focus_areas: ['qtpoc', 'community-organizing', 'solidarity'],
      active: true
    },
    {
      handle: '@blacktransmenuk',
      organization_name: 'Black Trans Men UK',
      verified_community_org: false,
      trust_level: 'medium',
      location: 'UK',
      focus_areas: ['trans-men', 'black-liberation', 'support-networks'],
      active: true
    },
    {
      handle: '@queerblackwomen',
      organization_name: 'Queer Black Women Collective',
      verified_community_org: false,
      trust_level: 'medium',
      location: 'UK',
      focus_areas: ['black-women', 'queer-liberation', 'intersectionality'],
      active: true
    }
  ];

  // Instagram hashtags for discovering grassroots Black LGBT events
  private liberationHashtags = [
    '#BlackPrideLondon',
    '#BlackLGBTUK', 
    '#QTBIPOCEvents',
    '#BlackTransLivesMatter',
    '#BlackQueerJoy',
    '#LGBTQBlackHistory',
    '#QueerBlackLondon',
    '#BlackGayMen',
    '#TransBlackPower',
    '#QTPOCLondon',
    '#BlackLesbianVisibility',
    '#AfroQueerUK',
    '#BlackNonBinary',
    '#QueerAfricanDiaspora',
    '#BlackLGBTActivism',
    '#GrassrootsLGBT',
    '#CommunityOrganizing',
    '#MutualAidLGBT',
    '#BlackQueerHealing'
  ];

  // Use Instagram Basic Display API or web scraping for content discovery
  async discoverInstagramEvents(): Promise<DiscoveredInstagramEvent[]> {
    console.log('📱 Starting Instagram content discovery for grassroots Black LGBT organizing...');
    
    const discoveredEvents: DiscoveredInstagramEvent[] = [];
    
    // Method 1: Scrape public Instagram profiles (respecting rate limits)
    for (const source of this.grassrootsBlackLGBTSources.filter(s => s.active)) {
      try {
        const posts = await this.scrapeInstagramProfile(source);
        const events = await this.extractEventsFromPosts(posts, source);
        discoveredEvents.push(...events);
        
        // Respectful rate limiting
        await this.sleep(2000);
      } catch (error) {
        console.error(`❌ Failed to scrape ${source.handle}:`, error);
      }
    }
    
    // Method 2: Hashtag-based discovery for wider community reach
    const hashtagEvents = await this.discoverEventsByHashtags();
    discoveredEvents.push(...hashtagEvents);
    
    console.log(`📱 Instagram discovery found ${discoveredEvents.length} potential community events`);
    return discoveredEvents;
  }

  // Scrape public Instagram profile posts (using web scraping, not API)
  private async scrapeInstagramProfile(source: InstagramSource): Promise<InstagramPost[]> {
    // IMPORTANT: This would use puppeteer/playwright to scrape public posts
    // Instagram's public web interface allows viewing recent posts without authentication
    // We respect robots.txt and implement respectful rate limiting
    
    console.log(`🔍 Discovering content from ${source.handle} (${source.organization_name})`);
    
    // Mock implementation - in production would use actual web scraping
    return this.generateMockInstagramPosts(source);
  }

  // Extract event information from Instagram post captions and media
  private async extractEventsFromPosts(
    posts: InstagramPost[], 
    source: InstagramSource
  ): Promise<DiscoveredInstagramEvent[]> {
    
    const events: DiscoveredInstagramEvent[] = [];
    
    for (const post of posts) {
      if (this.isEventPost(post)) {
        try {
          const event = await this.parseInstagramEvent(post, source);
          if (event) {
            events.push(event);
          }
        } catch (error) {
          console.error(`❌ Failed to parse event from ${post.id}:`, error);
        }
      }
    }
    
    return events;
  }

  // Identify if an Instagram post contains event information
  private isEventPost(post: InstagramPost): boolean {
    const caption = post.caption.toLowerCase();
    const hashtags = post.hashtags.join(' ').toLowerCase();
    
    // Event indicators in caption
    const eventKeywords = [
      'event', 'workshop', 'meeting', 'gathering', 'march', 'protest',
      'celebration', 'party', 'discussion', 'talk', 'panel', 'screening',
      'fundraiser', 'vigil', 'memorial', 'pride', 'rally', 'conference',
      'training', 'class', 'session', 'meetup', 'social', 'support group',
      'community', 'organizing', 'action', 'demonstration'
    ];
    
    // Date/time indicators
    const dateTimeKeywords = [
      'tonight', 'tomorrow', 'this weekend', 'next week', 'saturday', 'sunday',
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
      '2024', '2025', 'pm', 'am', 'o\'clock', 'time:', 'date:', 'when:'
    ];
    
    // Location indicators
    const locationKeywords = [
      'london', 'manchester', 'birmingham', 'bristol', 'edinburgh', 'glasgow',
      'venue', 'location', 'address', 'where:', 'at ', '@'
    ];
    
    const hasEventKeyword = eventKeywords.some(keyword => caption.includes(keyword) || hashtags.includes(keyword));
    const hasDateTimeKeyword = dateTimeKeywords.some(keyword => caption.includes(keyword));
    const hasLocationKeyword = locationKeywords.some(keyword => caption.includes(keyword));
    
    return hasEventKeyword && (hasDateTimeKeyword || hasLocationKeyword);
  }

  // Parse Instagram post into structured event data
  private async parseInstagramEvent(
    post: InstagramPost, 
    source: InstagramSource
  ): Promise<DiscoveredInstagramEvent | null> {
    
    const caption = post.caption;
    
    // Extract event details using natural language processing
    const eventDetails = {
      title: this.extractEventTitle(caption),
      description: this.extractEventDescription(caption),
      date: this.extractEventDate(caption),
      location: this.extractEventLocation(caption, post.location_tag),
      accessibility: this.extractAccessibilityInfo(caption),
      cost: this.extractCostInfo(caption)
    };
    
    if (!eventDetails.title) {
      return null; // Skip if we can't determine what the event is
    }
    
    // Calculate grassroots and liberation relevance
    const relevanceScore = this.calculateInstagramRelevanceScore(post, source, caption);
    const grassrootsIndicators = this.identifyGrassrootsIndicators(post, source);
    
    const discoveredEvent: DiscoveredInstagramEvent = {
      id: `instagram-${source.handle}-${post.id}`,
      title: eventDetails.title,
      description: eventDetails.description || caption.substring(0, 300) + '...',
      url: `https://instagram.com/p/${post.id}`,
      source: source.organization_name,
      source_url: `https://instagram.com/${source.handle}`,
      published_date: post.post_date,
      content_type: 'event',
      relevance_score: relevanceScore,
      auto_categories: this.categorizeInstagramEvent(post, source),
      needs_community_approval: source.trust_level !== 'high',
      scraped_at: new Date().toISOString(),
      status: 'auto_discovered',
      community_tags: [...source.focus_areas, 'instagram-discovery', 'grassroots'],
      
      // Instagram-specific fields
      instagram_handle: source.handle,
      instagram_post_id: post.id,
      hashtags: post.hashtags,
      mentions: post.mentions,
      media_urls: post.media_urls,
      estimated_engagement: post.engagement_estimate || 0,
      grassroots_indicators: grassrootsIndicators,
      community_size_estimate: this.estimateCommunitySize(source),
      
      // Liberation focus
      target_audience: this.identifyTargetAudience(caption, source),
      accessibility_notes: eventDetails.accessibility,
      economic_justice_score: this.calculateEconomicJusticeScore(caption)
    };
    
    return discoveredEvent;
  }

  // Community-driven hashtag discovery for broader reach
  private async discoverEventsByHashtags(): Promise<DiscoveredInstagramEvent[]> {
    console.log('🏷️ Discovering events through liberation hashtags...');
    
    // This would scrape hashtag pages on Instagram for recent posts
    // We focus on Black LGBT liberation hashtags that smaller orgs use
    
    // Mock implementation showing the approach
    const hashtagEvents: DiscoveredInstagramEvent[] = [];
    
    for (const hashtag of this.liberationHashtags.slice(0, 5)) { // Limit for demo
      try {
        // In production: scrape recent posts for this hashtag
        const posts = await this.scrapeHashtagPosts(hashtag);
        
        // Filter for event posts from grassroots accounts
        for (const post of posts) {
          if (this.isGrassrootsAccount(post.handle) && this.isEventPost(post)) {
            const source = this.inferSourceFromPost(post);
            const event = await this.parseInstagramEvent(post, source);
            if (event) {
              hashtagEvents.push(event);
            }
          }
        }
        
        // Respectful rate limiting
        await this.sleep(3000);
      } catch (error) {
        console.error(`❌ Failed to discover events for ${hashtag}:`, error);
      }
    }
    
    return hashtagEvents;
  }

  // Community-suggested Instagram accounts for broader discovery
  async addCommunityInstagramSource(
    handle: string,
    organizationName: string,
    location: string,
    focusAreas: string[],
    suggestedBy: string
  ): Promise<boolean> {
    try {
      const newSource: InstagramSource = {
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        organization_name: organizationName,
        verified_community_org: false,
        trust_level: 'low', // Community verification needed
        location,
        focus_areas: focusAreas,
        active: false, // Needs community approval
        added_by_community: suggestedBy
      };
      
      const { error } = await supabase
        .from('instagram_sources')
        .insert([newSource]);
      
      if (error) throw error;
      
      console.log(`✅ Community suggested Instagram source: ${handle}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add community Instagram source:', error);
      return false;
    }
  }

  // Get Instagram sources pending community verification
  async getPendingInstagramSources(): Promise<InstagramSource[]> {
    try {
      const { data, error } = await supabase
        .from('instagram_sources')
        .select('*')
        .eq('active', false)
        .eq('verified_community_org', false);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Failed to get pending Instagram sources:', error);
      return [];
    }
  }

  // Community verification of Instagram sources
  async verifyInstagramSource(handle: string, verifiedBy: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('instagram_sources')
        .update({
          verified_community_org: true,
          trust_level: 'medium',
          active: true,
          verified_by: verifiedBy,
          verified_at: new Date().toISOString()
        })
        .eq('handle', handle);
      
      if (error) throw error;
      
      console.log(`✅ Instagram source verified: ${handle}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to verify Instagram source:', error);
      return false;
    }
  }

  // Helper methods for content extraction and analysis
  private extractEventTitle(caption: string): string {
    // Extract title from first line or sentence
    const lines = caption.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Remove emoji and hashtags from title
      return firstLine.replace(/[🎉🔥✨💜🏳️‍🌈✊🏿]/g, '').replace(/#\w+/g, '').trim();
    }
    return '';
  }

  private extractEventDescription(caption: string): string {
    // Return full caption as description, cleaning up formatting
    return caption.replace(/\n+/g, ' ').trim();
  }

  private extractEventDate(caption: string): string {
    // Use regex to find date patterns in caption
    // This would be more sophisticated in production
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\w+ \d{1,2}(?:st|nd|rd|th)?)/g;
    const dateMatch = caption.match(dateRegex);
    
    if (dateMatch) {
      return dateMatch[0]; // Return first date found
    }
    
    return new Date().toISOString(); // Default to today if no date found
  }

  private extractEventLocation(caption: string, locationTag?: string): string {
    if (locationTag) return locationTag;
    
    // Look for location indicators in caption
    const locationRegex = /@(\w+)|venue:?\s*([^,\n]+)|location:?\s*([^,\n]+)/gi;
    const locationMatch = caption.match(locationRegex);
    
    return locationMatch ? locationMatch[0] : 'Location TBA';
  }

  private extractAccessibilityInfo(caption: string): string {
    const accessibilityKeywords = [
      'wheelchair accessible', 'accessible venue', 'bsl', 'sign language',
      'audio description', 'step-free', 'accessible toilet', 'disabled access',
      'sensory friendly', 'quiet space', 'accessible transport'
    ];
    
    const found = accessibilityKeywords.filter(keyword => 
      caption.toLowerCase().includes(keyword)
    );
    
    return found.length > 0 ? found.join(', ') : '';
  }

  private extractCostInfo(caption: string): string {
    const costRegex = /(free|£\d+|donation|pay what you can|sliding scale)/gi;
    const costMatch = caption.match(costRegex);
    return costMatch ? costMatch[0] : 'Cost TBA';
  }

  private calculateInstagramRelevanceScore(
    post: InstagramPost, 
    source: InstagramSource, 
    caption: string
  ): number {
    let score = 0.5; // Base score
    
    // Higher score for verified community orgs
    if (source.verified_community_org) score += 0.2;
    
    // Liberation hashtags increase relevance
    const liberationHashtagCount = post.hashtags.filter(tag => 
      this.liberationHashtags.some(libTag => libTag.toLowerCase().includes(tag.toLowerCase()))
    ).length;
    score += Math.min(liberationHashtagCount * 0.1, 0.3);
    
    // Black LGBT keywords in caption
    const liberationKeywords = [
      'black', 'queer', 'lgbt', 'trans', 'liberation', 'community',
      'organizing', 'mutual aid', 'solidarity', 'resistance', 'joy'
    ];
    const keywordCount = liberationKeywords.filter(keyword =>
      caption.toLowerCase().includes(keyword)
    ).length;
    score += Math.min(keywordCount * 0.05, 0.2);
    
    return Math.min(score, 1.0);
  }

  private identifyGrassrootsIndicators(post: InstagramPost, source: InstagramSource): string[] {
    const indicators: string[] = [];
    
    if (source.follower_count_estimate === 'small') indicators.push('small-organization');
    if (post.hashtags.includes('grassroots')) indicators.push('self-identified-grassroots');
    if (post.hashtags.includes('community')) indicators.push('community-focused');
    if (post.mentions.length > 0) indicators.push('collaborative');
    if (post.hashtags.includes('mutualaid')) indicators.push('mutual-aid');
    
    return indicators;
  }

  private categorizeInstagramEvent(post: InstagramPost, source: InstagramSource): string[] {
    const categories: string[] = ['instagram-event'];
    
    // Add source focus areas
    categories.push(...source.focus_areas);
    
    // Categorize by hashtags
    if (post.hashtags.some(tag => tag.includes('pride'))) categories.push('pride-events');
    if (post.hashtags.some(tag => tag.includes('workshop'))) categories.push('educational');
    if (post.hashtags.some(tag => tag.includes('social'))) categories.push('social-events');
    if (post.hashtags.some(tag => tag.includes('protest'))) categories.push('activism');
    
    return categories;
  }

  private estimateCommunitySize(source: InstagramSource): 'small' | 'medium' | 'large' {
    // This would use actual follower counts in production
    if (source.verified_community_org) return 'medium';
    return 'small'; // Assume grassroots orgs are small unless verified otherwise
  }

  private identifyTargetAudience(caption: string, source: InstagramSource): string {
    const audiences: string[] = [];
    
    if (caption.toLowerCase().includes('black')) audiences.push('Black community');
    if (caption.toLowerCase().includes('trans')) audiences.push('Trans community');
    if (caption.toLowerCase().includes('lesbian')) audiences.push('Lesbian community');
    if (caption.toLowerCase().includes('gay men')) audiences.push('Gay men');
    if (caption.toLowerCase().includes('youth')) audiences.push('LGBTQ+ youth');
    if (caption.toLowerCase().includes('qtpoc')) audiences.push('QTPOC community');
    
    return audiences.length > 0 ? audiences.join(', ') : 'LGBTQ+ community';
  }

  private calculateEconomicJusticeScore(caption: string): number {
    let score = 0;
    
    if (caption.toLowerCase().includes('free')) score += 0.3;
    if (caption.toLowerCase().includes('donation')) score += 0.2;
    if (caption.toLowerCase().includes('sliding scale')) score += 0.3;
    if (caption.toLowerCase().includes('pay what you can')) score += 0.3;
    if (caption.toLowerCase().includes('mutual aid')) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  // Mock/placeholder methods for development
  private async generateMockInstagramPosts(source: InstagramSource): Promise<InstagramPost[]> {
    // In production, this would be actual Instagram scraping
    return [
      {
        id: `mock-post-${Date.now()}`,
        handle: source.handle,
        caption: `🎉 Black Queer Joy Workshop this Saturday! Join us for healing, community, and celebration. 6pm at Community Center, London. Free event with sliding scale donations. #BlackQueerJoy #CommunityHealing #London #QTPOC`,
        hashtags: ['#BlackQueerJoy', '#CommunityHealing', '#London', '#QTPOC'],
        mentions: [],
        post_date: new Date().toISOString(),
        media_type: 'image',
        media_urls: ['https://placeholder.com/400'],
        engagement_estimate: 150
      }
    ];
  }

  private async scrapeHashtagPosts(hashtag: string): Promise<InstagramPost[]> {
    // Mock implementation - would scrape hashtag page
    return [];
  }

  private isGrassrootsAccount(handle: string): boolean {
    // Check if account appears to be grassroots organization
    return this.grassrootsBlackLGBTSources.some(source => source.handle === handle);
  }

  private inferSourceFromPost(post: InstagramPost): InstagramSource {
    // Create source info from post data
    return {
      handle: post.handle,
      organization_name: post.handle.replace('@', ''),
      verified_community_org: false,
      trust_level: 'low',
      location: 'Unknown',
      focus_areas: ['community'],
      active: true
    };
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const instagramContentDiscoveryService = new InstagramContentDiscoveryService();