// Events Service with Supabase Integration
// Unified access to events from both Supabase and legacy backend

import { supabase, supabaseHelpers } from '../lib/supabase'
import type { Event as SupabaseEvent, FilterOptions, ModerationStats, Database } from '../types/supabase'

// Legacy interface for backward compatibility
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
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'draft' | 'reviewing' | 'archived'
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

interface EventsResponse {
  events: Event[]
  total: number
  stats?: EventStats
  source: 'supabase' | 'legacy' | 'fallback'
}

class EventsService {
  private baseUrl: string
  private isConnected: boolean = false
  private supabaseConnected: boolean = false
  private useSupabase: boolean = true // Prefer Supabase over legacy backend
  
  constructor() {
    // Use proxy API to avoid CORS issues
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/api'                                       // Vercel proxy to real backend
      : '/api'                                       // Production proxy
    
    // Test Supabase connection on initialization
    this.checkSupabaseConnection()
  }

  private async checkSupabaseConnection(): Promise<boolean> {
    try {
      const { connected } = await supabaseHelpers.testConnection()
      this.supabaseConnected = connected
      
      if (connected) {
        console.log('✅ Supabase events connection established')
      } else {
        console.warn('⚠️ Supabase events connection failed, falling back to legacy backend')
      }
      
      return connected
    } catch (error) {
      console.error('❌ Supabase events connection test failed:', error)
      this.supabaseConnected = false
      return false
    }
  }

  async getAllEvents(): Promise<Event[]> {
    // Try Supabase first if enabled
    if (this.useSupabase && this.supabaseConnected) {
      try {
        return await this.getEventsFromSupabase()
      } catch (error) {
        console.warn('Supabase events fetch failed, trying legacy backend:', error)
      }
    }

    // Fall back to legacy backend
    try {
      // Connecting to backend
      
      // First try to connect to real backend
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Backend response received

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Data processed successfully
      
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
      // Using fallback data
      // Fallback to mock data if backend is unavailable
      return this.getMockEvents()
    }
  }

  private async getEventsFromSupabase(filters?: FilterOptions): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:contacts(name)
      `)
      .order('event_date', { ascending: true })
    
    // Apply filters
    if (filters?.source && filters.source !== 'all') {
      query = query.eq('source', filters.source)
    }
    
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'pending') {
        query = query.in('status', ['draft', 'reviewing'])
      } else if (filters.status === 'approved') {
        query = query.eq('status', 'published')
      } else if (filters.status === 'rejected') {
        query = query.eq('status', 'archived')
      } else {
        query = query.eq('status', filters.status)
      }
    }
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    // Transform Supabase events to legacy format
    const events: Event[] = (data || []).map(event => ({
      id: event.id,
      title: event.name, // Map name to title
      description: event.description,
      date: event.event_date,
      startTime: this.extractTimeFromDate(event.event_date),
      endTime: undefined, // Not in current schema
      location: typeof event.location === 'string' ? event.location : JSON.stringify(event.location),
      url: event.source_url || event.registration_link,
      source: event.source,
      status: this.mapSupabaseStatus(event.status),
      cost: event.price || 'Free',
      organizer: (event.organizer as any)?.name || event.organizer_name || 'Unknown Organizer',
      image: event.image_url || undefined,
      tags: event.tags || [],
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }))
    
    // Apply additional client-side filters
    return this.applyClientFilters(events, filters)
  }

  private mapSupabaseStatus(status: string): Event['status'] {
    switch (status) {
      case 'published': return 'approved'
      case 'draft': 
      case 'reviewing': return 'pending'
      case 'archived': return 'rejected'
      default: return 'pending'
    }
  }

  private extractTimeFromDate(dateString: string): string | undefined {
    try {
      const date = new Date(dateString)
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        return undefined // All-day event
      }
      return date.toTimeString().substring(0, 5) // HH:MM format
    } catch {
      return undefined
    }
  }

  private applyClientFilters(events: Event[], filters?: FilterOptions): Event[] {
    if (!filters) return events
    
    return events.filter(event => {
      // Date filter
      if (filters.dateRange !== 'all') {
        const eventDate = new Date(event.date)
        const now = new Date()
        const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (filters.dateRange === 'today' && daysDiff !== 0) return false
        if (filters.dateRange === 'week' && daysDiff > 7) return false
        if (filters.dateRange === 'month' && daysDiff > 30) return false
      }

      // Location filter
      if (filters.location) {
        if (!event.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        return event.title.toLowerCase().includes(searchLower) ||
               event.description.toLowerCase().includes(searchLower) ||
               (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      }

      return true
    })
  }

  async getEventStats(): Promise<EventStats> {
    // Try Supabase first
    if (this.useSupabase && this.supabaseConnected) {
      try {
        return await this.getStatsFromSupabase()
      } catch (error) {
        console.warn('Supabase stats fetch failed, trying legacy backend:', error)
      }
    }

    // Fall back to legacy backend
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

  private async getStatsFromSupabase(): Promise<EventStats> {
    const { data, error } = await supabase
      .from('events')
      .select('status')
    
    if (error || !data) {
      return { pending: 0, approved: 0, rejected: 0, total: 0 }
    }
    
    const stats = data.reduce((acc, event) => {
      acc.total++
      if (event.status === 'draft' || event.status === 'reviewing') acc.pending++
      if (event.status === 'published') acc.approved++
      if (event.status === 'archived') acc.rejected++
      return acc
    }, { pending: 0, approved: 0, rejected: 0, total: 0 })
    
    return stats
  }

  async submitEvent(eventData: Partial<Event>): Promise<Event> {
    // Try Supabase first
    if (this.useSupabase && this.supabaseConnected) {
      try {
        return await this.submitEventToSupabase(eventData)
      } catch (error) {
        console.warn('Supabase event submission failed, trying legacy backend:', error)
      }
    }

    // Fall back to legacy backend
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

  private async submitEventToSupabase(eventData: Partial<Event>): Promise<Event> {
    // Create or find contact for organizer
    let organizerId = null
    if (eventData.organizer) {
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .eq('name', eventData.organizer)
        .single()

      if (existingContact) {
        organizerId = existingContact.id
      } else {
        // Create new contact
        const { data: newContact, error: contactError } = await supabase
          .from('contacts')
          .insert({
            name: eventData.organizer,
            email: `${eventData.organizer.toLowerCase().replace(/\s+/g, '.')}@example.com`
          })
          .select()
          .single()

        if (!contactError && newContact) {
          organizerId = newContact.id
        }
      }
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        name: eventData.title || '',
        description: eventData.description || '',
        event_date: eventData.date || new Date().toISOString(),
        location: eventData.location || 'TBD',
        source: (eventData.source as any) || 'community',
        source_url: eventData.url,
        organizer_id: organizerId,
        organizer_name: eventData.organizer,
        tags: eventData.tags || [],
        status: 'draft', // All public submissions start as draft
        scraped_date: new Date().toISOString(),
        image_url: eventData.image,
        price: eventData.cost,
        registration_link: eventData.url
      })
      .select()
      .single()

    if (error) throw error

    // Transform back to legacy format
    return {
      id: data.id,
      title: data.name,
      description: data.description,
      date: data.event_date,
      location: typeof data.location === 'string' ? data.location : JSON.stringify(data.location),
      url: data.source_url || data.registration_link,
      source: data.source,
      status: this.mapSupabaseStatus(data.status),
      cost: data.price || 'Free',
      organizer: data.organizer_name || 'Unknown Organizer',
      image: data.image_url || undefined,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  // Admin methods for CRUD operations
  async updateEventStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> {
    if (!this.useSupabase || !this.supabaseConnected) {
      throw new Error('Event status updates require Supabase connection')
    }
    
    // Map legacy status to Supabase status
    const supabaseStatus = status === 'approved' ? 'published' : 
                          status === 'rejected' ? 'archived' : 'draft'
    
    const { error } = await supabase
      .from('events')
      .update({ 
        status: supabaseStatus,
        listed_date: status === 'approved' ? new Date().toISOString() : null
      })
      .eq('id', id)

    return !error
  }

  async deleteEvent(id: string): Promise<boolean> {
    if (!this.useSupabase || !this.supabaseConnected) {
      throw new Error('Event deletion requires Supabase connection')
    }
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    return !error
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    if (!this.useSupabase || !this.supabaseConnected) {
      throw new Error('Event updates require Supabase connection')
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({
        name: updates.title,
        description: updates.description,
        event_date: updates.date,
        location: updates.location,
        organizer_name: updates.organizer,
        tags: updates.tags,
        price: updates.cost,
        image_url: updates.image,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data ? this.transformSupabaseEvent(data) : null
  }

  private transformSupabaseEvent(event: any): Event {
    return {
      id: event.id,
      title: event.name,
      description: event.description,
      date: event.event_date,
      startTime: this.extractTimeFromDate(event.event_date),
      location: typeof event.location === 'string' ? event.location : JSON.stringify(event.location),
      url: event.source_url || event.registration_link,
      source: event.source,
      status: this.mapSupabaseStatus(event.status),
      cost: event.price || 'Free',
      organizer: event.organizer_name || 'Unknown Organizer',
      image: event.image_url || undefined,
      tags: event.tags || [],
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }
  }

  // Check if events backend is available
  async checkBackendHealth(): Promise<{ available: boolean; url: string; source: string }> {
    // Check Supabase first
    if (this.useSupabase) {
      await this.checkSupabaseConnection()
      if (this.supabaseConnected) {
        return {
          available: true,
          url: 'supabase',
          source: 'supabase'
        }
      }
    }

    // Check legacy backend
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      })
      
      return {
        available: response.ok,
        url: this.baseUrl,
        source: 'legacy'
      }
    } catch (error) {
      return {
        available: false,
        url: this.baseUrl,
        source: 'fallback'
      }
    }
  }

  // Real-time subscription for event updates
  subscribeToEventUpdates(callback: (event: SupabaseEvent) => void) {
    if (!this.useSupabase || !this.supabaseConnected) {
      console.warn('Real-time subscriptions require Supabase connection')
      return null
    }
    
    return supabaseHelpers.subscribeToEvents(callback)
  }

  // Connection status methods
  getConnectionStatus(): { supabase: boolean; legacy: boolean; primary: string } {
    return {
      supabase: this.supabaseConnected,
      legacy: this.isConnected,
      primary: this.supabaseConnected ? 'supabase' : this.isConnected ? 'legacy' : 'fallback'
    }
  }

  // Toggle data source preference
  setPreferSupabase(prefer: boolean) {
    this.useSupabase = prefer
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
export type { Event, EventStats, EventsResponse }