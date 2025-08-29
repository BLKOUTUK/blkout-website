// Chrome Extension API Service
// Handles submissions from the Chrome extension to Supabase
import { supabase } from '../lib/supabase'

export interface ExtensionEventSubmission {
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

export interface ExtensionArticleSubmission {
  title: string
  excerpt: string
  content?: string
  category?: string
  author?: string
  priority?: string
  sourceUrl?: string
  submittedVia?: string
  moreInfoUrl?: string
  publishDate?: string
  section?: string
  tags?: string[]
  status?: string
}

export class ExtensionApiService {
  static async submitEvent(data: ExtensionEventSubmission) {
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

      // Create event record with minimal required fields
      const { data: event, error } = await supabase
        .from('events')
        .insert([{
          title,
          description: description || '',
          location: typeof location === 'string' ? location : location?.address || 'TBD',
          status: status || 'draft',
          date: date,
          start_time: time || '18:00',
          source: 'manual',
          url: sourceUrl,
          tags: tags || ['community-submitted']
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
      throw new Error(error.message || 'Failed to create event')
    }
  }

  static async submitArticle(data: ExtensionArticleSubmission) {
    try {
      const {
        title,
        excerpt,
        content,
        category,
        author,
        priority,
        sourceUrl,
        submittedVia,
        moreInfoUrl,
        publishDate,
        section,
        tags,
        status = 'draft'
      } = data

      // Validate required fields
      if (!title || !excerpt) {
        throw new Error('Title and excerpt are required')
      }

      // Create article record with minimal required fields
      const { data: article, error } = await supabase
        .from('newsroom_articles')
        .insert([{
          title,
          excerpt,
          content: content || excerpt,
          status: status || 'draft',
          source_url: sourceUrl
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        message: 'Article created successfully',
        article
      }
    } catch (error: any) {
      console.error('Article submission error:', error)
      throw new Error(error.message || 'Failed to create article')
    }
  }

  static async getEvents() {
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
      throw new Error(error.message || 'Failed to fetch events')
    }
  }

  static async getArticles() {
    try {
      const { data: articles, error } = await supabase
        .from('newsroom_articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        articles: articles || []
      }
    } catch (error: any) {
      console.error('Articles fetch error:', error)
      throw new Error(error.message || 'Failed to fetch articles')
    }
  }
}

// Expose to window for Chrome extension access
declare global {
  interface Window {
    BlkoutExtensionApi: typeof ExtensionApiService;
  }
}

// Make available globally for Chrome extension
if (typeof window !== 'undefined') {
  window.BlkoutExtensionApi = ExtensionApiService;
}