// Events Service for connecting to the Black QTIPOC Events Calendar backend
interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime?: string
  endTime?: string
  location: string
  url?: string
  source: string
  status: 'pending' | 'approved' | 'rejected'
  cost?: string
  organizer?: string
  image?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface EventStats {
  pending: number
  approved: number
  rejected: number
  total: number
}

class EventsService {
  private baseUrl: string
  
  constructor() {
    // Use proxy API to avoid CORS issues
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/api'                                       // Vercel proxy to real backend
      : 'http://localhost:5173/api'                  // Local development
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      console.log('🔗 Attempting to connect to backend:', this.baseUrl)
      
      // First try to connect to real backend
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('📡 Backend response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📊 Backend data received:', data)
      
      if (data.success && data.events) {
        // Map backend format to frontend format
        return data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          startTime: event.time,
          endTime: event.endTime, // May not exist in backend
          location: typeof event.location === 'string' ? event.location : event.location?.address || 'TBD',
          url: event.url || event.registrationUrl,
          source: event.category?.toLowerCase() || 'community',
          status: event.status === 'published' ? 'approved' : event.status,
          cost: event.cost || (event.capacity ? 'Free' : 'Free'),
          organizer: event.organizer,
          image: event.image,
          tags: event.tags || [],
          createdAt: event.createdAt,
          updatedAt: event.updatedAt || event.createdAt
        }))
      }
      return []
    } catch (error) {
      console.error('❌ Events backend failed, using mock data:', error)
      console.log('🔄 Falling back to mock data')
      // Fallback to mock data if backend is unavailable
      return this.getMockEvents()
    }
  }

  async getEventStats(): Promise<EventStats> {
    try {
      const response = await fetch(`${this.baseUrl}/events/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn('Events stats not available, using mock data:', error)
      // Calculate stats from mock events
      const events = await this.getMockEvents()
      return {
        pending: events.filter(e => e.status === 'pending').length,
        approved: events.filter(e => e.status === 'approved').length,
        rejected: events.filter(e => e.status === 'rejected').length,
        total: events.length
      }
    }
  }

  async submitEvent(eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to submit event:', error)
      throw error
    }
  }

  // Check if events backend is available
  async checkBackendHealth(): Promise<{ available: boolean; url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      })
      
      return {
        available: response.ok,
        url: this.baseUrl
      }
    } catch (error) {
      return {
        available: false,
        url: this.baseUrl
      }
    }
  }

  // Mock data for when backend is unavailable
  private getMockEvents(): Event[] {
    return [
      {
        id: '1',
        title: 'Black QTIPOC Community Gathering',
        description: 'Monthly community meetup for Black QTIPOC folks to connect, share resources, and build community. Join us for food, conversation, and mutual support.',
        date: '2025-08-15',
        startTime: '18:00',
        endTime: '21:00',
        location: 'Community Center, Brixton, London',
        url: 'https://www.eventbrite.com/e/black-qtipoc-community-gathering-tickets',
        source: 'community',
        status: 'approved',
        organizer: 'BLKOUT Community',
        tags: ['community', 'networking', 'support', 'social'],
        createdAt: '2025-07-31',
        updatedAt: '2025-07-31',
        cost: 'Free'
      },
      {
        id: '2',
        title: 'Liberation Workshop Series: Part 1',
        description: 'Educational workshop exploring liberation theory and practice for Black queer and trans communities. This first session covers historical foundations.',
        date: '2025-08-22',
        startTime: '14:00',
        endTime: '17:00',
        location: 'Online via Zoom',
        url: 'https://liberation-collective.org/workshops/part-1',
        source: 'education',
        status: 'approved',
        organizer: 'Liberation Collective',
        tags: ['education', 'workshop', 'liberation', 'theory'],
        createdAt: '2025-07-31',
        updatedAt: '2025-07-31',
        cost: 'Sliding scale £5-£25'
      },
      {
        id: '3',
        title: 'Black Trans Joy Celebration',
        description: 'A celebration of Black trans joy, resilience, and community. Music, art, performance, and good vibes. All Black trans and gender non-conforming folks welcome.',
        date: '2025-08-29',
        startTime: '19:00',
        endTime: '23:00',
        location: 'South London Community Space',
        url: 'https://blacktranscollectiveuk.org/events/joy-celebration',
        source: 'celebration',
        status: 'approved',
        organizer: 'Black Trans Collective UK',
        tags: ['celebration', 'trans', 'joy', 'performance', 'music'],
        createdAt: '2025-07-31',
        updatedAt: '2025-07-31',
        cost: 'Free with donations welcome'
      },
      {
        id: '4',
        title: 'Wellness Wednesday: Self-Care for Activists',
        description: 'Monthly wellness session focused on self-care practices for Black QTIPOC activists. Meditation, movement, and mutual care practices.',
        date: '2025-09-05',
        startTime: '18:30',
        endTime: '20:30',
        location: 'East London Wellness Center',
        url: 'https://healingjusticecollective.org/wellness-wednesday',
        source: 'wellness',
        status: 'approved',
        organizer: 'Healing Justice Collective',
        tags: ['wellness', 'self-care', 'meditation', 'activism'],
        createdAt: '2025-07-31',
        updatedAt: '2025-07-31',
        cost: 'Free'
      },
      {
        id: '5',
        title: 'Queer Black History Walking Tour',
        description: 'Guided walking tour exploring Black queer history in London. Learn about historical figures, locations, and community spaces that shaped our heritage.',
        date: '2025-09-12',
        startTime: '11:00',
        endTime: '13:30',
        location: 'Starting from Piccadilly Circus, London',
        url: 'https://blackhistorywalks.uk/queer-history-tour',
        source: 'education',
        status: 'approved',
        organizer: 'Black History Walks UK',
        tags: ['history', 'education', 'walking-tour', 'heritage'],
        createdAt: '2025-07-31',
        updatedAt: '2025-07-31',
        cost: '£15 (concessions available)'
      },
      {
        id: '6',
        title: 'Community Skill Share: Digital Security',
        description: 'Learn essential digital security skills for activists and community organizers. Covers secure communication, privacy tools, and online safety.',
        date: '2025-09-19',
        startTime: '15:00',
        endTime: '18:00',
        location: 'North London Library, Digital Hub',
        url: 'https://techjusticecollective.org/digital-security-workshop',
        source: 'education',
        status: 'approved',
        organizer: 'Tech Justice Collective',
        tags: ['technology', 'security', 'education', 'skills'],
        createdAt: '2025-07-31',
        updatedAt: '2025-07-31',
        cost: 'Free'
      }
    ]
  }
}

export const eventsService = new EventsService()
export type { Event, EventStats }