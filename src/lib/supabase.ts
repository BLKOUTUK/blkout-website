// Supabase Client Configuration for BLKOUTNXT Platform
// Handles authentication and database connections

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file')
  throw new Error('Missing required Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper functions for common operations with community-owned values
export const supabaseHelpers = {
  // Authentication helpers
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Database helpers with error handling
  async safeQuery<T>(queryFn: () => Promise<{ data: T | null, error: any }>) {
    try {
      const result = await queryFn()
      if (result.error) {
        console.error('Supabase query error:', result.error)
        return { data: null, error: result.error }
      }
      return result
    } catch (error) {
      console.error('Unexpected error in Supabase query:', error)
      return { data: null, error }
    }
  },

  // Check connection status
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id')
        .limit(1)
      
      return { connected: !error, error }
    } catch (error) {
      return { connected: false, error }
    }
  },

  // Enhanced Events API
  async getEvents(filters: {
    status?: string
    category?: string
    location?: string
    limit?: number
    offset?: number
  } = {}) {
    let query = supabase
      .from('events')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .order('event_date', { ascending: true })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.category) {
      query = query.ilike('tags', `%${filters.category}%`)
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    return this.safeQuery(() => query)
  },

  async createEvent(eventData: any) {
    return this.safeQuery(() => 
      supabase
        .from('events')
        .insert(eventData)
        .select()
        .single()
    )
  },

  async updateEvent(id: string, updates: any) {
    return this.safeQuery(() =>
      supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    )
  },

  async deleteEvent(id: string) {
    return this.safeQuery(() =>
      supabase
        .from('events')
        .delete()
        .eq('id', id)
    )
  },

  // Enhanced Articles API
  async getArticles(filters: {
    status?: string
    category?: string
    featured?: boolean
    limit?: number
    offset?: number
  } = {}) {
    let query = supabase
      .from('newsroom_articles')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .order('published_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    return this.safeQuery(() => query)
  },

  async createArticle(articleData: any) {
    return this.safeQuery(() =>
      supabase
        .from('newsroom_articles')
        .insert(articleData)
        .select()
        .single()
    )
  },

  async updateArticle(id: string, updates: any) {
    return this.safeQuery(() =>
      supabase
        .from('newsroom_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    )
  },

  async deleteArticle(id: string) {
    return this.safeQuery(() =>
      supabase
        .from('newsroom_articles')
        .delete()
        .eq('id', id)
    )
  },

  // Contact management for community building
  async getContacts(filters: { verified?: boolean, limit?: number } = {}) {
    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.verified !== undefined) {
      query = query.eq('verified', filters.verified)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    return this.safeQuery(() => query)
  },

  async createContact(contactData: any) {
    return this.safeQuery(() =>
      supabase
        .from('contacts')
        .insert(contactData)
        .select()
        .single()
    )
  },

  // Real-time subscription helpers with community focus
  subscribeToEvents(callback: (payload: any) => void) {
    return supabase
      .channel('events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events'
      }, (payload) => {
        console.log('🔴 Event change detected:', payload)
        callback(payload)
      })
      .subscribe()
  },

  subscribeToArticles(callback: (payload: any) => void) {
    return supabase
      .channel('articles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'newsroom_articles'
      }, (payload) => {
        console.log('📰 Article change detected:', payload)
        callback(payload)
      })
      .subscribe()
  },

  // Community statistics for transparency
  async getCommunityStats() {
    const [eventsResult, articlesResult, contactsResult] = await Promise.all([
      this.safeQuery(() => 
        supabase
          .from('events')
          .select('status, event_date')
      ),
      this.safeQuery(() =>
        supabase
          .from('newsroom_articles')
          .select('status, category')
      ),
      this.safeQuery(() =>
        supabase
          .from('contacts')
          .select('verified')
      )
    ])

    const today = new Date().toISOString().split('T')[0]
    
    return {
      events: {
        total: eventsResult.data?.length || 0,
        published: eventsResult.data?.filter(e => e.status === 'published').length || 0,
        upcoming: eventsResult.data?.filter(e => e.status === 'published' && e.event_date >= today).length || 0
      },
      articles: {
        total: articlesResult.data?.length || 0,
        published: articlesResult.data?.filter(a => a.status === 'published').length || 0,
        byCategory: articlesResult.data?.reduce((acc, article) => {
          acc[article.category] = (acc[article.category] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}
      },
      community: {
        totalContacts: contactsResult.data?.length || 0,
        verifiedContacts: contactsResult.data?.filter(c => c.verified).length || 0
      }
    }
  },

  // File upload for community media
  async uploadFile(file: File, bucket: 'articles' | 'events' | 'profiles' = 'articles') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (error) {
      return { data: null, error }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return { data: { path: filePath, url: publicUrl }, error: null }
  }
}

export default supabase
