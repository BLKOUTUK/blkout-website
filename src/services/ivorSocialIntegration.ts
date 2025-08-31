// IVOR Social Integration Service
// Integrates community stories from newsroom into IVOR social sharing capabilities

import { newsroomService, NewsArticle } from './newsroomService'
import { eventsCalendarIntegration } from './eventsCalendarIntegration'

interface SocialShareContent {
  id: string
  type: 'story' | 'achievement' | 'event' | 'organizing'
  title: string
  content: string
  tags: string[]
  source: 'newsroom' | 'ivor-conversation' | 'community-event'
  shareableUrl?: string
  imageUrl?: string
  location?: string
  impact: 'individual' | 'local' | 'national'
  timestamp: string
}

interface SocialAmplificationRequest {
  contentId: string
  platforms: ('twitter' | 'instagram' | 'linkedin' | 'facebook')[]
  customMessage?: string
  scheduledFor?: Date
  communityTags?: string[]
}

class IVORSocialIntegrationService {
  private readonly ivorSocialUrl = 'https://ivor-social-4j0x0h2te-robs-projects-54d653d3.vercel.app'
  
  constructor() {
    console.log('🤝 IVOR Social Integration Service initialized')
  }

  // Get shareable community stories from newsroom
  async getShareableCommunityStories(options: {
    limit?: number
    category?: string
    featured?: boolean
    recentOnly?: boolean
  } = {}): Promise<SocialShareContent[]> {
    try {
      const {
        limit = 10,
        category,
        featured = false,
        recentOnly = true
      } = options

      // Fetch stories from newsroom
      const stories = await newsroomService.getArticles({
        limit,
        category,
        featured,
        status: 'published'
      })

      if (!stories || stories.length === 0) {
        console.log('📰 No published stories found in newsroom')
        return this.getFallbackShareableContent()
      }

      // Convert newsroom articles to shareable content
      const shareableContent: SocialShareContent[] = stories.map(story => ({
        id: story.id,
        type: this.mapCategoryToContentType(story.category),
        title: story.title,
        content: this.createSocialContent(story),
        tags: this.generateSocialTags(story),
        source: 'newsroom',
        shareableUrl: `https://blkout.org/newsroom/article/${story.slug}`,
        imageUrl: story.featured_image_url,
        location: this.extractLocationFromStory(story),
        impact: this.assessStoryImpact(story),
        timestamp: story.created_at
      }))

      console.log(`📱 Generated ${shareableContent.length} shareable community stories`)
      return shareableContent

    } catch (error) {
      console.error('❌ Failed to get shareable community stories:', error)
      return this.getFallbackShareableContent()
    }
  }

  // Create optimized social content from story
  private createSocialContent(story: NewsArticle): string {
    const maxLength = 250 // Twitter-optimized length
    
    // Extract compelling excerpt
    let content = story.excerpt || story.content.substring(0, 200)
    
    // Remove HTML/markdown formatting
    content = content.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '')
    
    // Add community context
    if (story.category === 'Community News') {
      content = `🏘️ Community Update: ${content}`
    } else if (story.category === 'Organizing') {
      content = `✊ Organizing Win: ${content}`
    } else if (story.category === 'Health & Wellness') {
      content = `💚 Health Update: ${content}`
    } else if (story.category === 'Culture & Arts') {
      content = `🎨 Cultural Celebration: ${content}`
    }
    
    // Truncate if needed
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...'
    }
    
    return content
  }

  // Generate social media tags
  private generateSocialTags(story: NewsArticle): string[] {
    const baseTags = ['BlackQueer', 'CommunityPower', 'QTIPOC', 'UKCommunity']
    
    // Add category-specific tags
    if (story.category === 'Community News') {
      baseTags.push('CommunityNews', 'BlackJoy')
    } else if (story.category === 'Organizing') {
      baseTags.push('CommunityOrganizing', 'CollectiveAction', 'Liberation')
    } else if (story.category === 'Health & Wellness') {
      baseTags.push('HealthEquity', 'Wellness', 'CommunityHealth')
    } else if (story.category === 'Culture & Arts') {
      baseTags.push('BlackArt', 'QueerArt', 'CulturalCelebration')
    }
    
    // Add from story tags
    if (story.tags && story.tags.length > 0) {
      baseTags.push(...story.tags.slice(0, 3)) // Add up to 3 story tags
    }
    
    return baseTags.slice(0, 8) // Limit to 8 tags total
  }

  // Extract location information from story
  private extractLocationFromStory(story: NewsArticle): string | undefined {
    const content = `${story.title} ${story.content} ${story.excerpt}`.toLowerCase()
    
    // Common UK cities/regions
    const locations = [
      'london', 'manchester', 'birmingham', 'glasgow', 'cardiff',
      'bristol', 'leeds', 'sheffield', 'liverpool', 'newcastle',
      'brighton', 'nottingham', 'leicester', 'coventry', 'hull'
    ]
    
    for (const location of locations) {
      if (content.includes(location)) {
        return location.charAt(0).toUpperCase() + location.slice(1)
      }
    }
    
    return undefined
  }

  // Assess story impact level
  private assessStoryImpact(story: NewsArticle): SocialShareContent['impact'] {
    const content = `${story.title} ${story.content}`.toLowerCase()
    
    if (content.includes('national') || content.includes('uk-wide') || content.includes('britain')) {
      return 'national'
    }
    
    if (content.includes('community') || content.includes('local') || content.includes('city')) {
      return 'local'
    }
    
    return 'individual'
  }

  // Map newsroom category to social content type
  private mapCategoryToContentType(category: string): SocialShareContent['type'] {
    const mapping: Record<string, SocialShareContent['type']> = {
      'Community News': 'story',
      'Organizing': 'organizing',
      'Health & Wellness': 'achievement',
      'Culture & Arts': 'event',
      'Housing Justice': 'organizing'
    }
    
    return mapping[category] || 'story'
  }

  // Amplify content through IVOR Social service
  async amplifyContentThroughIVOR(
    content: SocialShareContent,
    request: SocialAmplificationRequest
  ): Promise<{ success: boolean; amplificationId?: string; error?: string }> {
    try {
      // Send amplification request to IVOR Social
      const response = await fetch(`${this.ivorSocialUrl}/api/amplify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            ...content,
            customMessage: request.customMessage,
            communityTags: request.communityTags
          },
          platforms: request.platforms,
          scheduledFor: request.scheduledFor?.toISOString(),
          source: 'blkout-newsroom'
        })
      })

      if (!response.ok) {
        throw new Error(`IVOR Social API error: ${response.status}`)
      }

      const result = await response.json()
      
      console.log(`📢 Content amplified through IVOR: ${content.title}`)
      
      return {
        success: true,
        amplificationId: result.amplificationId || `amp-${Date.now()}`
      }

    } catch (error) {
      console.error('❌ Failed to amplify content through IVOR:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get trending community content for social sharing
  async getTrendingCommunityContent(): Promise<SocialShareContent[]> {
    try {
      // Combine trending stories and upcoming events
      const [trendingStories, upcomingEvents] = await Promise.all([
        this.getShareableCommunityStories({ 
          limit: 5, 
          featured: true, 
          recentOnly: true 
        }),
        eventsCalendarIntegration.getCommunityShowcaseData()
      ])

      // Convert featured events to shareable content
      const eventContent: SocialShareContent[] = upcomingEvents.featured_events
        .slice(0, 3)
        .map(event => ({
          id: `event-${event.id}`,
          type: 'event' as const,
          title: event.title,
          content: `🗓️ Upcoming Event: ${event.description || event.title} in ${event.location}. ${event.accessibility_info || 'Community-focused event.'}`,
          tags: ['CommunityEvents', 'BlackQueer', 'UKEvents', event.location || 'UK'],
          source: 'community-event' as const,
          shareableUrl: event.url,
          location: event.location,
          impact: 'local' as const,
          timestamp: event.date
        }))

      const combined = [...trendingStories, ...eventContent]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8)

      console.log(`📈 Generated ${combined.length} trending community content items`)
      return combined

    } catch (error) {
      console.error('❌ Failed to get trending community content:', error)
      return this.getFallbackShareableContent()
    }
  }

  // Bulk amplification for community storytelling campaigns
  async launchStorytelllingCampaign(options: {
    storyIds?: string[]
    theme?: string
    duration?: 'daily' | 'weekly' | 'monthly'
    platforms?: ('twitter' | 'instagram' | 'linkedin' | 'facebook')[]
  } = {}): Promise<{
    success: boolean
    campaignId?: string
    amplifiedCount?: number
    error?: string
  }> {
    try {
      const {
        storyIds,
        theme = 'Community Spotlight',
        duration = 'weekly',
        platforms = ['twitter', 'instagram']
      } = options

      // Get stories to amplify
      let content: SocialShareContent[]
      
      if (storyIds && storyIds.length > 0) {
        // Get specific stories
        const allStories = await this.getShareableCommunityStories({ limit: 50 })
        content = allStories.filter(story => storyIds.includes(story.id))
      } else {
        // Get trending content
        content = await this.getTrendingCommunityContent()
      }

      if (content.length === 0) {
        throw new Error('No content available for storytelling campaign')
      }

      // Launch amplification campaign
      const campaignId = `campaign-${theme.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      let amplifiedCount = 0

      for (const item of content) {
        const result = await this.amplifyContentThroughIVOR(item, {
          contentId: item.id,
          platforms,
          customMessage: `${theme}: ${item.title}`,
          communityTags: [...item.tags, theme.replace(/\s+/g, '')]
        })

        if (result.success) {
          amplifiedCount++
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      console.log(`🚀 Storytelling campaign launched: ${campaignId} (${amplifiedCount}/${content.length} amplified)`)
      
      return {
        success: true,
        campaignId,
        amplifiedCount
      }

    } catch (error) {
      console.error('❌ Failed to launch storytelling campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Fallback shareable content
  private getFallbackShareableContent(): SocialShareContent[] {
    return [
      {
        id: 'fallback-1',
        type: 'story',
        title: 'BLKOUT Community Platform Launch',
        content: '🏘️ Community Update: The BLKOUT platform is connecting Black queer communities across the UK with stories, events, and mutual aid. Join us in building community-owned liberation technology.',
        tags: ['BlackQueer', 'CommunityPower', 'QTIPOC', 'UKCommunity', 'TechForGood'],
        source: 'newsroom',
        shareableUrl: 'https://blkout.org',
        impact: 'national',
        timestamp: new Date().toISOString()
      },
      {
        id: 'fallback-2',
        type: 'organizing',
        title: 'Community Organizing Toolkit Available',
        content: '✊ Organizing Win: New community organizing resources now available through the BLKOUT platform. Tools for housing campaigns, mutual aid coordination, and collective action.',
        tags: ['CommunityOrganizing', 'CollectiveAction', 'Liberation', 'BlackQueer'],
        source: 'newsroom',
        shareableUrl: 'https://blkout.org/organizing',
        impact: 'local',
        timestamp: new Date().toISOString()
      }
    ]
  }
}

export const ivorSocialIntegration = new IVORSocialIntegrationService()
export type { SocialShareContent, SocialAmplificationRequest }