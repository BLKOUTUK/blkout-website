// API endpoint for Chrome extension submissions - events
import { supabase } from '../lib/supabase'

export interface EventSubmission {
  title: string
  description?: string
  date: string
  time?: string
  location?: any
  organizer?: string
  category?: string
  capacity?: number
  sourceUrl?: string
  submittedVia?: string
  moreInfoUrl?: string
  ticketInfo?: string
  attendeeCount?: string
  registrationLink?: string
  tags?: string[]
  status?: string
}

export async function handleEventSubmission(data: EventSubmission) {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      capacity,
      sourceUrl,
      submittedVia,
      moreInfoUrl,
      ticketInfo,
      attendeeCount,
      registrationLink,
      tags,
      status = 'draft'
    } = data

    // Validate required fields
    if (!title || !date) {
      throw new Error('Title and date are required')
    }

    // Create event record
    const { data: event, error } = await supabase
      .from('events')
      .insert([{
        title,
        description: description || '',
        date,
        time: time || '18:00',
        location: typeof location === 'string' ? { type: 'physical', address: location } : location,
        organizer: organizer || 'Community Submitted',
        category: category || 'Community',
        capacity: capacity || 50,
        source_url: sourceUrl,
        submitted_via: submittedVia || 'chrome-extension',
        more_info_url: moreInfoUrl,
        ticket_info: ticketInfo,
        attendee_count: attendeeCount,
        registration_link: registrationLink,
        tags: tags || ['community-submitted'],
        status: status,
        featured: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      message: 'Event created successfully',
      event
    }
  } catch (error: any) {
    console.error('Event submission error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create event'
    }
  }
}

export async function getEvents() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      events: events || []
    }
  } catch (error: any) {
    console.error('Events fetch error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch events'
    }
  }
}