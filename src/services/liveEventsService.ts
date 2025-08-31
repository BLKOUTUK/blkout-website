/**
 * Live Community Events Service
 * Integrates real-time community activity feed showing breadth of UK Black queer organizing
 * Combines events calendar, social feeds, and community updates
 */

import { supabase } from '../utils/supabaseClient'

// Types for live events
export interface LiveEvent {
  id: string
  title: string
  description: string
  event_type: 'organizing' | 'cultural' | 'social' | 'educational' | 'celebration' | 'mutual_aid'
  start_time: string
  end_time?: string
  location: {
    city: string
    venue?: string
    online?: boolean
    hybrid?: boolean
  }
  organizer: {
    name: string
    type: 'individual' | 'organization' | 'collective'
    contact?: string
  }
  registration_info?: {
    required: boolean
    url?: string
    cost?: string
    accessibility?: string[]
  }
  tags: string[]
  community_focus: string[]
  accessibility_features: string[]
  status: 'upcoming' | 'live' | 'completed' | 'cancelled'
  participant_count?: number
  social_links?: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
  live_updates?: LiveUpdate[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface LiveUpdate {
  id: string
  event_id: string
  update_type: 'announcement' | 'reminder' | 'live_coverage' | 'results' | 'photos' | 'reflection'
  content: string
  media_url?: string
  posted_by: string
  posted_at: string
  engagement: {
    likes: number
    shares: number
    comments: number
  }
}

export interface EventsFeedOptions {
  timeframe_hours?: number
  max_events?: number
  event_types?: string[]
  locations?: string[]
  include_completed?: boolean
  include_live_updates?: boolean
  priority_order?: 'chronological' | 'engagement' | 'community_focus'
}

export interface CommunityActivityMetrics {
  active_events_count: number
  cities_with_activity: number
  total_participants_today: number
  event_type_breakdown: Record<string, number>
  geographic_spread: {
    london: number
    manchester: number
    birmingham: number
    leeds: number
    bristol: number
    glasgow: number
    other: number
  }
  engagement_stats: {
    total_updates: number
    avg_engagement_per_update: number
    trending_tags: string[]
  }
}

class LiveEventsService {

  /**
   * Get live community events feed showing current activity
   */
  async getLiveEventsFeed(options: EventsFeedOptions = {}): Promise<{
    events: LiveEvent[]
    metrics: CommunityActivityMetrics
    last_updated: string
  }> {
    const {
      timeframe_hours = 24,
      max_events = 20,
      event_types = [],
      locations = [],
      include_completed = true,
      include_live_updates = true,
      priority_order = 'chronological'
    } = options

    console.log('🔴 Loading live community events feed...')

    try {
      // For beta demonstration, generate realistic live events
      const liveEvents = await this.generateLiveEventsFeed({
        timeframe_hours,
        max_events,
        event_types,
        locations,
        include_completed
      })

      // Add live updates if requested
      if (include_live_updates) {
        for (const event of liveEvents) {
          event.live_updates = await this.generateLiveUpdates(event.id, event.event_type)
        }
      }

      // Calculate community activity metrics
      const metrics = this.calculateActivityMetrics(liveEvents)

      // Sort events based on priority order
      const sortedEvents = this.sortEventsByPriority(liveEvents, priority_order)

      console.log(`✅ Loaded ${sortedEvents.length} live events across ${metrics.cities_with_activity} cities`)

      return {
        events: sortedEvents.slice(0, max_events),
        metrics,
        last_updated: new Date().toISOString()
      }

    } catch (error) {
      console.error('❌ Error loading live events feed:', error)
      throw error
    }
  }

  /**
   * Generate realistic live events for demonstration
   */
  private async generateLiveEventsFeed(options: any): Promise<LiveEvent[]> {
    const now = new Date()
    const events: LiveEvent[] = []

    // Generate events across different timeframes and types
    const eventTemplates = [
      // Current/Live Events
      {
        title: 'Community Healing Circle - Processing Recent Events',
        description: 'Safe space for Black queer folks to process recent political developments and community challenges together.',
        event_type: 'social' as const,
        location: { city: 'London', venue: 'Hackney Community Centre', online: false },
        organizer: { name: 'London Black Queer Healing Network', type: 'collective' as const },
        start_time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // Started 2 hours ago
        status: 'live' as const,
        participant_count: 23,
        tags: ['healing', 'community support', 'mental health'],
        community_focus: ['Black', 'LGBTQ+', 'healing justice'],
        accessibility_features: ['BSL interpretation', 'wheelchair accessible', 'quiet space available']
      },
      
      // Upcoming Events Today
      {
        title: 'Emergency Housing Support Drop-In',
        description: 'Weekly drop-in for community members facing housing insecurity. Legal advice, advocacy support, and mutual aid available.',
        event_type: 'mutual_aid' as const,
        location: { city: 'Manchester', venue: 'Partisan Collective', online: false },
        organizer: { name: 'Manchester Black Queer Housing Collective', type: 'collective' as const },
        start_time: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), // In 3 hours
        end_time: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        status: 'upcoming' as const,
        registration_info: { required: false, cost: 'free', accessibility: ['wheelchair accessible'] },
        tags: ['housing justice', 'mutual aid', 'legal support'],
        community_focus: ['Black', 'LGBTQ+', 'housing insecure'],
        accessibility_features: ['wheelchair accessible', 'childcare available', 'sliding scale donations']
      },

      // Cultural Events
      {
        title: 'Afrobeats & Activism: Community Dance Session',
        description: 'Monthly dance session celebrating African diaspora music while fundraising for community organizing. All skill levels welcome!',
        event_type: 'cultural' as const,
        location: { city: 'Birmingham', venue: 'Digbeth Community Space', online: false },
        organizer: { name: 'Birmingham Black Arts Collective', type: 'collective' as const },
        start_time: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(), // Tonight
        end_time: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'upcoming' as const,
        participant_count: 45,
        registration_info: { required: true, url: 'https://example.com/register', cost: '£5-15 sliding scale' },
        tags: ['culture', 'fundraising', 'dance', 'afrobeats'],
        community_focus: ['Black', 'African diaspora', 'arts'],
        accessibility_features: ['wheelchair accessible', 'gender neutral bathrooms', 'alcohol-free space']
      },

      // Organizing Events
      {
        title: 'Trans Healthcare Campaign Planning Session',
        description: 'Monthly organizing meeting for Yorkshire Trans Healthcare Coalition. Planning direct actions and community education for September.',
        event_type: 'organizing' as const,
        location: { city: 'Leeds', venue: 'Leeds LGBT+ Centre', online: true, hybrid: true },
        organizer: { name: 'Yorkshire Trans Healthcare Coalition', type: 'collective' as const },
        start_time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 6.5 * 60 * 60 * 1000).toISOString(),
        status: 'upcoming' as const,
        participant_count: 32,
        registration_info: { required: false, accessibility: ['hybrid format', 'BSL available on request'] },
        tags: ['trans rights', 'healthcare organizing', 'direct action'],
        community_focus: ['trans', 'healthcare access', 'Yorkshire'],
        accessibility_features: ['hybrid attendance', 'BSL interpretation', 'child-friendly']
      },

      // Educational Events
      {
        title: 'Black Queer History Walking Tour - Brixton Edition',
        description: 'Community-led walking tour exploring Black LGBTQ+ history in South London. Stories of resistance, culture, and community building.',
        event_type: 'educational' as const,
        location: { city: 'South London', venue: 'Meet at Brixton Station', online: false },
        organizer: { name: 'South London Queer History Project', type: 'organization' as const },
        start_time: new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow
        end_time: new Date(now.getTime() + 28.5 * 60 * 60 * 1000).toISOString(),
        status: 'upcoming' as const,
        participant_count: 18,
        registration_info: { required: true, cost: 'pay what you can £0-10' },
        tags: ['history', 'education', 'walking tour', 'brixton'],
        community_focus: ['Black', 'LGBTQ+', 'South London history'],
        accessibility_features: ['accessible route planned', 'rest stops included', 'BSL interpreter available']
      },

      // Recently Completed Event
      {
        title: 'Community Kitchen - Sunday Meal Prep',
        description: 'Weekly community kitchen preparing meals for mutual aid distribution. Today we made 150 portions for community members.',
        event_type: 'mutual_aid' as const,
        location: { city: 'Bristol', venue: 'St Pauls Community Kitchen', online: false },
        organizer: { name: 'Bristol Black Community Kitchen', type: 'collective' as const },
        start_time: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        end_time: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // Ended 4 hours ago
        status: 'completed' as const,
        participant_count: 28,
        tags: ['mutual aid', 'food justice', 'community kitchen'],
        community_focus: ['Black', 'food security', 'Bristol'],
        accessibility_features: ['wheelchair accessible', 'halal options', 'allergen-conscious prep']
      }
    ]

    // Convert templates to full LiveEvent objects
    eventTemplates.forEach((template, index) => {
      const event: LiveEvent = {
        id: `live-event-${Date.now()}-${index}`,
        ...template,
        registration_info: template.registration_info || { required: false },
        social_links: {
          twitter: `@${template.organizer.name.toLowerCase().replace(/\s+/g, '')}`,
          instagram: `${template.organizer.name.toLowerCase().replace(/\s+/g, '')}`
        },
        metadata: {
          generated_for_demo: true,
          event_template_id: index,
          community_verified: true
        },
        created_at: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
      events.push(event)
    })

    return events
  }

  /**
   * Generate live updates for events
   */
  private async generateLiveUpdates(eventId: string, eventType: string): Promise<LiveUpdate[]> {
    const updates: LiveUpdate[] = []
    const now = new Date()

    // Generate different types of updates based on event type and status
    const updateTemplates = {
      organizing: [
        {
          update_type: 'announcement' as const,
          content: '📢 Reminder: Planning session starts in 1 hour! We\'ll be covering September direct action strategy and community education plans. Hybrid attendance available.',
          posted_by: 'Yorkshire Trans Coalition',
          engagement: { likes: 23, shares: 8, comments: 5 }
        },
        {
          update_type: 'live_coverage' as const,
          content: '🔥 Amazing turnout tonight - 32 community members joining planning session! Currently discussing healthcare access improvements and timeline for next campaign phase.',
          posted_by: 'Coalition Live Updates',
          engagement: { likes: 45, shares: 12, comments: 9 }
        }
      ],
      social: [
        {
          update_type: 'live_coverage' as const,
          content: '💙 Beautiful community gathering - 23 folks sharing stories, processing together, and building collective care. The healing circle energy is powerful tonight.',
          posted_by: 'Healing Network Coordinator',
          engagement: { likes: 67, shares: 15, comments: 12 }
        },
        {
          update_type: 'reflection' as const,
          content: '🌟 Grateful for this space to be vulnerable, share struggles, and find strength in community. Next healing circle: Thursday 7pm same location.',
          posted_by: 'Community Member',
          engagement: { likes: 34, shares: 8, comments: 6 }
        }
      ],
      cultural: [
        {
          update_type: 'announcement' as const,
          content: '🎵 Tonight\'s playlist includes Burna Boy, Wizkid, Tems, and classic Fela! DJ sets start at 8pm, fundraising for community organizing continues all night.',
          posted_by: 'Birmingham Black Arts',
          engagement: { likes: 89, shares: 23, comments: 18 }
        }
      ],
      mutual_aid: [
        {
          update_type: 'results' as const,
          content: '✊ Today\'s community kitchen success: 150 meal portions prepared and distributed! Thanks to 28 volunteers who made this possible. Next kitchen: Sunday 2pm.',
          posted_by: 'Bristol Community Kitchen',
          engagement: { likes: 156, shares: 34, comments: 27 }
        }
      ]
    }

    const templates = updateTemplates[eventType as keyof typeof updateTemplates] || []
    
    templates.forEach((template, index) => {
      updates.push({
        id: `update-${eventId}-${index}`,
        event_id: eventId,
        ...template,
        posted_at: new Date(now.getTime() - Math.random() * 4 * 60 * 60 * 1000).toISOString()
      })
    })

    return updates
  }

  /**
   * Calculate community activity metrics
   */
  private calculateActivityMetrics(events: LiveEvent[]): CommunityActivityMetrics {
    const metrics: CommunityActivityMetrics = {
      active_events_count: events.filter(e => e.status === 'live' || e.status === 'upcoming').length,
      cities_with_activity: 0,
      total_participants_today: 0,
      event_type_breakdown: {},
      geographic_spread: {
        london: 0,
        manchester: 0,
        birmingham: 0,
        leeds: 0,
        bristol: 0,
        glasgow: 0,
        other: 0
      },
      engagement_stats: {
        total_updates: 0,
        avg_engagement_per_update: 0,
        trending_tags: []
      }
    }

    const cities = new Set<string>()
    const allTags: string[] = []
    let totalEngagement = 0
    let totalUpdates = 0

    events.forEach(event => {
      // City tracking
      cities.add(event.location.city)
      
      // Geographic breakdown
      const city = event.location.city.toLowerCase()
      if (city.includes('london')) metrics.geographic_spread.london++
      else if (city.includes('manchester')) metrics.geographic_spread.manchester++
      else if (city.includes('birmingham')) metrics.geographic_spread.birmingham++
      else if (city.includes('leeds')) metrics.geographic_spread.leeds++
      else if (city.includes('bristol')) metrics.geographic_spread.bristol++
      else if (city.includes('glasgow')) metrics.geographic_spread.glasgow++
      else metrics.geographic_spread.other++

      // Event type breakdown
      metrics.event_type_breakdown[event.event_type] = (metrics.event_type_breakdown[event.event_type] || 0) + 1

      // Participant counts
      if (event.participant_count) {
        metrics.total_participants_today += event.participant_count
      }

      // Tag aggregation
      allTags.push(...event.tags)

      // Live updates engagement
      if (event.live_updates) {
        totalUpdates += event.live_updates.length
        event.live_updates.forEach(update => {
          totalEngagement += update.engagement.likes + update.engagement.shares + update.engagement.comments
        })
      }
    })

    metrics.cities_with_activity = cities.size
    metrics.engagement_stats.total_updates = totalUpdates
    metrics.engagement_stats.avg_engagement_per_update = totalUpdates > 0 ? totalEngagement / totalUpdates : 0

    // Calculate trending tags (most frequent)
    const tagCounts: Record<string, number> = {}
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
    metrics.engagement_stats.trending_tags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    return metrics
  }

  /**
   * Sort events by priority order
   */
  private sortEventsByPriority(events: LiveEvent[], priority: string): LiveEvent[] {
    switch (priority) {
      case 'engagement':
        return events.sort((a, b) => {
          const aEngagement = (a.live_updates || []).reduce((sum, update) => 
            sum + update.engagement.likes + update.engagement.shares + update.engagement.comments, 0)
          const bEngagement = (b.live_updates || []).reduce((sum, update) => 
            sum + update.engagement.likes + update.engagement.shares + update.engagement.comments, 0)
          return bEngagement - aEngagement
        })

      case 'community_focus':
        return events.sort((a, b) => {
          const aScore = a.community_focus.length + (a.participant_count || 0) / 10
          const bScore = b.community_focus.length + (b.participant_count || 0) / 10
          return bScore - aScore
        })

      case 'chronological':
      default:
        return events.sort((a, b) => {
          // Live events first, then upcoming, then completed
          const statusOrder = { live: 0, upcoming: 1, completed: 2, cancelled: 3 }
          const statusDiff = statusOrder[a.status] - statusOrder[b.status]
          if (statusDiff !== 0) return statusDiff
          
          // Within same status, sort by time
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        })
    }
  }

  /**
   * Get events happening now (live status)
   */
  async getLiveEvents(): Promise<LiveEvent[]> {
    const feed = await this.getLiveEventsFeed({
      timeframe_hours: 1,
      max_events: 10,
      include_completed: false
    })
    
    return feed.events.filter(event => event.status === 'live')
  }

  /**
   * Get upcoming events in next few hours
   */
  async getUpcomingEvents(hours: number = 8): Promise<LiveEvent[]> {
    const feed = await this.getLiveEventsFeed({
      timeframe_hours: hours,
      max_events: 15,
      include_completed: false
    })
    
    return feed.events.filter(event => event.status === 'upcoming')
  }

  /**
   * Get events by location
   */
  async getEventsByLocation(location: string): Promise<LiveEvent[]> {
    const feed = await this.getLiveEventsFeed({
      locations: [location],
      max_events: 20
    })
    
    return feed.events
  }

  /**
   * Submit new live event (for future integration with community submission)
   */
  async submitCommunityEvent(eventData: Partial<LiveEvent>): Promise<{
    success: boolean
    event_id?: string
    message: string
  }> {
    try {
      // In real implementation, this would:
      // 1. Validate community member credentials
      // 2. Check event data completeness
      // 3. Apply community moderation queue
      // 4. Send for community approval if needed
      
      console.log('📝 Community event submission received:', eventData.title)
      
      // For demo, return success with generated ID
      const eventId = `community-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      return {
        success: true,
        event_id: eventId,
        message: 'Event submitted for community review. It will appear in the feed once approved by community moderators.'
      }
      
    } catch (error) {
      console.error('Error submitting community event:', error)
      return {
        success: false,
        message: 'Failed to submit event. Please try again or contact support.'
      }
    }
  }
}

export default new LiveEventsService()