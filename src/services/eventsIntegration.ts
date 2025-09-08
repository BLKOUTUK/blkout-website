// Events Integration Service - Connect to events-blkout.vercel.app
// Handles fetching, syncing, and moderation of external events

interface ExternalEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer?: string
  category?: string
  tags?: string[]
  status: 'pending' | 'published' | 'rejected'
  source: 'external' | 'platform'
  original_url?: string
  image_url?: string
  created_at: string
  updated_at: string
}

class EventsIntegrationService {
  private readonly API_BASE = 'https://events-blkout.vercel.app/api'
  private readonly PLATFORM_API = '/api'

  // Fetch events from external site
  async fetchExternalEvents(filters: {
    status?: string
    category?: string
    limit?: number
    page?: number
  } = {}): Promise<ExternalEvent[]> {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.category) params.append('category', filters.category)
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.page) params.append('page', filters.page.toString())

      const response = await fetch(`${this.API_BASE}/events?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : data.events || []
    } catch (error) {
      console.error('Error fetching external events:', error)
      return []
    }
  }

  // Submit event to external site
  async submitEventToExternal(event: Omit<ExternalEvent, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          source: 'platform',
          status: 'pending' // All platform submissions go to moderation
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error submitting event to external site:', error)
      return false
    }
  }

  // Moderate event on external site (admin function)
  async moderateExternalEvent(eventId: string, action: 'approve' | 'reject', adminKey?: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (adminKey) {
        headers['Authorization'] = `Bearer ${adminKey}`
      }

      const response = await fetch(`${this.API_BASE}/events/${eventId}/moderate`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          action,
          status: action === 'approve' ? 'published' : 'rejected',
          moderated_by: 'platform-admin',
          moderated_at: new Date().toISOString()
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error moderating external event:', error)
      return false
    }
  }

  // Sync events between platform and external site
  async syncEvents(): Promise<{
    synced: number
    errors: string[]
  }> {
    const result = { synced: 0, errors: [] }

    try {
      // Fetch all published events from external site
      const externalEvents = await this.fetchExternalEvents({ status: 'published' })
      
      // Sync each event to platform database
      for (const event of externalEvents) {
        try {
          // Submit to platform API for processing
          const response = await fetch(`${this.PLATFORM_API}/events/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...event,
              external_id: event.id,
              source: 'events-blkout'
            })
          })

          if (response.ok) {
            result.synced++
          } else {
            result.errors.push(`Failed to sync event ${event.id}: ${response.status}`)
          }
        } catch (error) {
          result.errors.push(`Error syncing event ${event.id}: ${error}`)
        }
      }
    } catch (error) {
      result.errors.push(`Sync failed: ${error}`)
    }

    return result
  }

  // Get combined events (external + platform)
  async getCombinedEvents(filters: {
    category?: string
    search?: string
    limit?: number
    includeExternal?: boolean
  } = {}): Promise<ExternalEvent[]> {
    const { includeExternal = true, ...otherFilters } = filters
    const allEvents: ExternalEvent[] = []

    try {
      // Fetch platform events (existing logic)
      // This would integrate with existing EventsPage logic
      
      // Fetch external events if requested
      if (includeExternal) {
        const externalEvents = await this.fetchExternalEvents({
          status: 'published',
          ...otherFilters
        })
        allEvents.push(...externalEvents)
      }

      // Sort by date
      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      return filters.limit ? allEvents.slice(0, filters.limit) : allEvents
    } catch (error) {
      console.error('Error getting combined events:', error)
      return []
    }
  }

  // Health check for external site
  async checkExternalSiteHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/health`, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
}

export const eventsIntegration = new EventsIntegrationService()
export type { ExternalEvent }