// Events Calendar Integration Service
// Connects BLKOUT website with the Black QTIPOC+ Events Calendar for community showcase

interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location: {
    venue?: string
    address?: string
    city: string
    postcode?: string
    online: boolean
  }
  organizer: {
    name: string
    type: 'community' | 'organization' | 'individual'
    contact?: string
  }
  category: string
  tags: string[]
  url?: string
  image_url?: string
  price: {
    min: number
    max: number
    free: boolean
  }
  accessibility: {
    wheelchair_accessible?: boolean
    bsl_interpreted?: boolean
    audio_described?: boolean
    notes?: string
  }
  community_focus: {
    black_qtipoc: boolean
    priority_level: 'high' | 'medium' | 'low'
    community_led: boolean
  }
  source: string
  created_at: string
  updated_at: string
}

interface EventsResponse {
  events: CommunityEvent[]
  total: number
  page: number
  hasMore: boolean
  filters: {
    date_range?: string
    location?: string
    category?: string
    community_focus?: string
  }
  stats: {
    total_events: number
    upcoming_events: number
    community_led: number
    free_events: number
    accessible_events: number
  }
}

interface CommunityShowcaseData {
  featured_events: CommunityEvent[]
  activity_breakdown: {
    organizing: CommunityEvent[]
    cultural: CommunityEvent[]
    wellness: CommunityEvent[]
    social: CommunityEvent[]
    advocacy: CommunityEvent[]
  }
  geographic_spread: {
    [location: string]: {
      count: number
      events: CommunityEvent[]
    }
  }
  community_highlights: {
    community_led_percentage: number
    free_events_percentage: number
    accessibility_percentage: number
    weekly_activity_count: number
  }
}

class EventsCalendarIntegrationService {
  private readonly baseUrl: string
  private readonly apiKey?: string
  
  constructor() {
    // Events calendar API endpoint - will be the deployed Netlify URL
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://black-qtipoc-events.netlify.app/api'  // Production calendar
      : 'http://localhost:5173/api'                     // Local development
    
    console.log('📅 Events Calendar Integration Service initialized')
  }

  // Fetch events from the calendar API
  async getEvents(filters?: {
    limit?: number
    page?: number
    date_from?: string
    date_to?: string
    location?: string
    category?: string
    community_focus?: 'high' | 'medium' | 'low'
    free_only?: boolean
  }): Promise<EventsResponse> {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.date_from) queryParams.append('date_from', filters.date_from)
      if (filters?.date_to) queryParams.append('date_to', filters.date_to)
      if (filters?.location) queryParams.append('location', filters.location)
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.community_focus) queryParams.append('community_focus', filters.community_focus)
      if (filters?.free_only) queryParams.append('free_only', 'true')

      const response = await fetch(`${this.baseUrl}/events?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Events API error: ${response.status}`)
      }

      const data = await response.json()
      return data
      
    } catch (error) {
      console.warn('Events calendar API unavailable, using fallback data:', error)
      return this.getFallbackEvents(filters)
    }
  }

  // Get curated data for community showcase
  async getCommunityShowcaseData(): Promise<CommunityShowcaseData> {
    try {
      // Get upcoming community-led events
      const upcomingEvents = await this.getEvents({
        limit: 50,
        date_from: new Date().toISOString().split('T')[0],
        date_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next 30 days
        community_focus: 'high'
      })

      // Categorize events by activity type
      const activityBreakdown = this.categorizeEventsByActivity(upcomingEvents.events)
      
      // Analyze geographic spread
      const geographicSpread = this.analyzeGeographicSpread(upcomingEvents.events)
      
      // Calculate community highlights
      const communityHighlights = this.calculateCommunityHighlights(upcomingEvents.events)
      
      // Select featured events (high-priority, diverse types)
      const featuredEvents = this.selectFeaturedEvents(upcomingEvents.events, 6)

      return {
        featured_events: featuredEvents,
        activity_breakdown: activityBreakdown,
        geographic_spread: geographicSpread,
        community_highlights: communityHighlights
      }
      
    } catch (error) {
      console.error('Failed to get community showcase data:', error)
      return this.getFallbackShowcaseData()
    }
  }

  // Categorize events by type of community activity
  private categorizeEventsByActivity(events: CommunityEvent[]): CommunityShowcaseData['activity_breakdown'] {
    const categories = {
      organizing: [] as CommunityEvent[],
      cultural: [] as CommunityEvent[],
      wellness: [] as CommunityEvent[],
      social: [] as CommunityEvent[],
      advocacy: [] as CommunityEvent[]
    }

    events.forEach(event => {
      const category = event.category.toLowerCase()
      const tags = event.tags.map(tag => tag.toLowerCase())
      const title = event.title.toLowerCase()
      const description = event.description.toLowerCase()

      // Organizing events
      if (
        category.includes('organizing') || 
        tags.some(tag => ['organizing', 'campaign', 'activism', 'protest', 'march', 'rally', 'meeting', 'workshop'].includes(tag)) ||
        title.includes('organizing') || title.includes('campaign') || title.includes('meeting') ||
        description.includes('organizing') || description.includes('campaign')
      ) {
        categories.organizing.push(event)
      }
      // Cultural events
      else if (
        category.includes('arts') || category.includes('culture') || category.includes('performance') ||
        tags.some(tag => ['arts', 'culture', 'performance', 'exhibition', 'festival', 'celebration', 'music', 'dance', 'theatre'].includes(tag)) ||
        title.includes('exhibition') || title.includes('performance') || title.includes('festival') ||
        description.includes('arts') || description.includes('culture')
      ) {
        categories.cultural.push(event)
      }
      // Wellness events
      else if (
        category.includes('health') || category.includes('wellness') || category.includes('mental health') ||
        tags.some(tag => ['health', 'wellness', 'mental health', 'therapy', 'support', 'healing', 'meditation', 'fitness'].includes(tag)) ||
        title.includes('wellness') || title.includes('health') || title.includes('support') ||
        description.includes('wellness') || description.includes('health')
      ) {
        categories.wellness.push(event)
      }
      // Advocacy events
      else if (
        category.includes('advocacy') || category.includes('rights') || category.includes('justice') ||
        tags.some(tag => ['advocacy', 'rights', 'justice', 'legal', 'policy', 'equality', 'liberation'].includes(tag)) ||
        title.includes('rights') || title.includes('justice') || title.includes('advocacy') ||
        description.includes('advocacy') || description.includes('justice')
      ) {
        categories.advocacy.push(event)
      }
      // Social events (default)
      else {
        categories.social.push(event)
      }
    })

    return categories
  }

  // Analyze geographic distribution of events
  private analyzeGeographicSpread(events: CommunityEvent[]): CommunityShowcaseData['geographic_spread'] {
    const locations: { [key: string]: { count: number, events: CommunityEvent[] } } = {}

    events.forEach(event => {
      const city = event.location.city
      if (!locations[city]) {
        locations[city] = { count: 0, events: [] }
      }
      locations[city].count++
      locations[city].events.push(event)
    })

    return locations
  }

  // Calculate community impact metrics
  private calculateCommunityHighlights(events: CommunityEvent[]): CommunityShowcaseData['community_highlights'] {
    const total = events.length
    if (total === 0) {
      return {
        community_led_percentage: 0,
        free_events_percentage: 0,
        accessibility_percentage: 0,
        weekly_activity_count: 0
      }
    }

    const communityLed = events.filter(event => event.community_focus.community_led).length
    const freeEvents = events.filter(event => event.price.free).length
    const accessibleEvents = events.filter(event => 
      event.accessibility.wheelchair_accessible || 
      event.accessibility.bsl_interpreted || 
      event.accessibility.audio_described
    ).length

    // Calculate weekly activity (events in next 7 days)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const weeklyEvents = events.filter(event => 
      new Date(event.date) <= nextWeek
    ).length

    return {
      community_led_percentage: Math.round((communityLed / total) * 100),
      free_events_percentage: Math.round((freeEvents / total) * 100),
      accessibility_percentage: Math.round((accessibleEvents / total) * 100),
      weekly_activity_count: weeklyEvents
    }
  }

  // Select diverse featured events for showcase
  private selectFeaturedEvents(events: CommunityEvent[], count: number): CommunityEvent[] {
    // Sort by priority and community focus
    const priorityEvents = events
      .filter(event => event.community_focus.priority_level === 'high')
      .sort((a, b) => {
        // Prioritize community-led events
        if (a.community_focus.community_led && !b.community_focus.community_led) return -1
        if (!a.community_focus.community_led && b.community_focus.community_led) return 1
        
        // Then by date (sooner first)
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })

    // Ensure diversity of event types
    const featured: CommunityEvent[] = []
    const categoriesUsed: string[] = []

    for (const event of priorityEvents) {
      if (featured.length >= count) break
      
      // Try to include diverse categories
      if (!categoriesUsed.includes(event.category) || featured.length < count / 2) {
        featured.push(event)
        categoriesUsed.push(event.category)
      }
    }

    // Fill remaining slots with high-priority events
    for (const event of priorityEvents) {
      if (featured.length >= count) break
      if (!featured.includes(event)) {
        featured.push(event)
      }
    }

    return featured
  }

  // Fallback events data when API is unavailable
  private getFallbackEvents(filters?: any): EventsResponse {
    const fallbackEvents: CommunityEvent[] = [
      {
        id: '1',
        title: 'Black Trans Joy Community Gathering',
        description: 'Monthly gathering celebrating Black trans experiences with poetry, music, and community connection.',
        date: '2025-09-15',
        time: '18:00',
        location: {
          venue: 'Community Centre',
          address: '123 Community Street',
          city: 'London',
          postcode: 'E1 6AN',
          online: false
        },
        organizer: {
          name: 'Black Trans Community Collective',
          type: 'community',
          contact: 'hello@blacktrans.community'
        },
        category: 'Community Gathering',
        tags: ['Black Trans', 'Community', 'Arts', 'Music', 'Poetry'],
        price: { min: 0, max: 0, free: true },
        accessibility: {
          wheelchair_accessible: true,
          bsl_interpreted: true,
          notes: 'Fully accessible venue with BSL interpretation'
        },
        community_focus: {
          black_qtipoc: true,
          priority_level: 'high',
          community_led: true
        },
        source: 'community-submitted',
        created_at: '2025-08-29T10:00:00Z',
        updated_at: '2025-08-29T10:00:00Z'
      },
      {
        id: '2',
        title: 'Housing Justice Organizing Workshop',
        description: 'Learn tenant organizing strategies and housing rights in this practical workshop led by experienced community organizers.',
        date: '2025-09-20',
        time: '14:00',
        location: {
          venue: 'Organizers Hub',
          address: '456 Justice Avenue',
          city: 'Manchester',
          postcode: 'M1 5DJ',
          online: false
        },
        organizer: {
          name: 'Northern Housing Justice Coalition',
          type: 'organization',
          contact: 'organize@housingjustice.org.uk'
        },
        category: 'Organizing Workshop',
        tags: ['Housing Justice', 'Organizing', 'Tenant Rights', 'Workshop'],
        price: { min: 0, max: 0, free: true },
        accessibility: {
          wheelchair_accessible: true,
          notes: 'Materials available in large print'
        },
        community_focus: {
          black_qtipoc: true,
          priority_level: 'high',
          community_led: true
        },
        source: 'partner-organization',
        created_at: '2025-08-29T11:00:00Z',
        updated_at: '2025-08-29T11:00:00Z'
      },
      {
        id: '3',
        title: 'Black Queer Wellness Circle',
        description: 'Monthly wellness and healing circle focusing on mental health, community care, and mutual support.',
        date: '2025-09-25',
        time: '19:00',
        location: {
          venue: 'Online',
          city: 'UK-wide',
          online: true
        },
        organizer: {
          name: 'Healing Justice Collective',
          type: 'community',
          contact: 'care@healingjustice.co.uk'
        },
        category: 'Wellness & Healing',
        tags: ['Mental Health', 'Healing', 'Community Care', 'Wellness'],
        price: { min: 0, max: 0, free: true },
        accessibility: {
          audio_described: true,
          notes: 'Online with live transcription available'
        },
        community_focus: {
          black_qtipoc: true,
          priority_level: 'high',
          community_led: true
        },
        source: 'community-submitted',
        created_at: '2025-08-29T12:00:00Z',
        updated_at: '2025-08-29T12:00:00Z'
      },
      {
        id: '4',
        title: 'Birmingham Black Pride Planning Meeting',
        description: 'Community planning meeting for Birmingham Black Pride 2025. All community members welcome to contribute ideas.',
        date: '2025-09-30',
        time: '18:30',
        location: {
          venue: 'Birmingham LGBT Centre',
          address: '38-40 Holloway Circus',
          city: 'Birmingham',
          postcode: 'B1 1EQ',
          online: false
        },
        organizer: {
          name: 'Birmingham Black Pride Committee',
          type: 'organization',
          contact: 'info@birminghamblackpride.com'
        },
        category: 'Community Planning',
        tags: ['Pride', 'Planning', 'Community', 'Birmingham', 'Organizing'],
        price: { min: 0, max: 0, free: true },
        accessibility: {
          wheelchair_accessible: true,
          bsl_interpreted: true
        },
        community_focus: {
          black_qtipoc: true,
          priority_level: 'high',
          community_led: true
        },
        source: 'partner-organization',
        created_at: '2025-08-29T13:00:00Z',
        updated_at: '2025-08-29T13:00:00Z'
      }
    ]

    // Apply filters to fallback data
    let filteredEvents = fallbackEvents
    if (filters?.community_focus) {
      filteredEvents = filteredEvents.filter(event => 
        event.community_focus.priority_level === filters.community_focus
      )
    }
    if (filters?.free_only) {
      filteredEvents = filteredEvents.filter(event => event.price.free)
    }

    return {
      events: filteredEvents,
      total: filteredEvents.length,
      page: 1,
      hasMore: false,
      filters: filters || {},
      stats: {
        total_events: filteredEvents.length,
        upcoming_events: filteredEvents.length,
        community_led: filteredEvents.filter(e => e.community_focus.community_led).length,
        free_events: filteredEvents.filter(e => e.price.free).length,
        accessible_events: filteredEvents.filter(e => 
          e.accessibility.wheelchair_accessible || e.accessibility.bsl_interpreted
        ).length
      }
    }
  }

  // Fallback showcase data
  private getFallbackShowcaseData(): CommunityShowcaseData {
    const fallbackEvents = this.getFallbackEvents().events
    
    return {
      featured_events: fallbackEvents.slice(0, 3),
      activity_breakdown: this.categorizeEventsByActivity(fallbackEvents),
      geographic_spread: this.analyzeGeographicSpread(fallbackEvents),
      community_highlights: this.calculateCommunityHighlights(fallbackEvents)
    }
  }

  // Get connection status
  async checkConnection(): Promise<{ connected: boolean; source: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return { 
        connected: response.ok, 
        source: response.ok ? 'events-calendar-api' : 'fallback'
      }
    } catch (error) {
      return { connected: false, source: 'fallback' }
    }
  }
}

export const eventsCalendarIntegration = new EventsCalendarIntegrationService()
export type { CommunityEvent, EventsResponse, CommunityShowcaseData }