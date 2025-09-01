// Moderation Service for BLKOUT Phase 1
// Directly interfaces with Supabase database where Chrome extension writes

import { supabase, supabaseHelpers } from '../lib/supabase'

interface ModerationItem {
  id: string
  type: 'newsroom_article' | 'event' | 'community_story' | 'comment'
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  content: {
    id: string
    title: string
    content?: string
    author: string
    category: string
    [key: string]: any
  }
  submittedBy: string
  submittedAt: string
  assignedTo?: string
  reviewedAt?: string
  reviewedBy?: string
  reason?: string
  flags: string[]
  metadata?: {
    source: string
    word_count?: number
    estimated_read_time?: number
    [key: string]: any
  }
}

interface ModerationStats {
  pendingCount: number
  todayActions: number
  activeModerators: number
  newsroomQueue: number
  eventsQueue: number
  communityQueue: number
}

interface ModerationResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

class ModerationService {
  private isConnected: boolean = false

  constructor() {
    // Direct Supabase connection - no external API needed
    this.checkConnection()
  }

  async checkConnection(): Promise<boolean> {
    try {
      const result = await supabaseHelpers.testConnection()
      this.isConnected = result.connected
      return this.isConnected
    } catch (error) {
      console.warn('Supabase connection unavailable:', error)
      this.isConnected = false
      return false
    }
  }

  // Get moderation queue with filters - reads directly from Supabase
  async getQueue(filters?: {
    type?: string
    status?: string
    priority?: string
    limit?: number
    offset?: number
  }): Promise<ModerationResponse> {
    try {
      // Get both events and articles from Supabase
      const [eventsResult, articlesResult] = await Promise.all([
        supabaseHelpers.getEvents({
          status: filters?.status === 'pending' ? 'reviewing' : filters?.status,
          limit: filters?.limit || 50,
          offset: filters?.offset
        }),
        supabaseHelpers.getArticles({
          status: filters?.status === 'pending' ? 'draft' : filters?.status,
          limit: filters?.limit || 50,
          offset: filters?.offset
        })
      ])

      const items: ModerationItem[] = []

      // Convert events to moderation items
      if (eventsResult.data) {
        eventsResult.data.forEach(event => {
          items.push({
            id: event.id,
            type: 'event',
            status: event.status === 'reviewing' ? 'pending' : (event.status === 'published' ? 'approved' : 'rejected'),
            priority: 'medium',
            content: {
              id: event.id,
              title: event.name,
              content: event.description,
              author: event.organizer_name || 'Unknown',
              category: event.tags?.[0] || 'community'
            },
            submittedBy: event.organizer_name || 'Chrome Extension',
            submittedAt: event.created_at,
            flags: [],
            metadata: {
              source: event.source,
              location: typeof event.location === 'object' ? event.location.address : event.location
            }
          })
        })
      }

      // Convert articles to moderation items  
      if (articlesResult.data) {
        articlesResult.data.forEach(article => {
          items.push({
            id: article.id,
            type: 'newsroom_article',
            status: article.status === 'draft' ? 'pending' : (article.status === 'published' ? 'approved' : 'rejected'),
            priority: article.priority === 'high' ? 'high' : 'medium',
            content: {
              id: article.id,
              title: article.title,
              content: article.content || article.excerpt || '',
              author: article.author,
              category: article.category
            },
            submittedBy: article.author || 'Chrome Extension',
            submittedAt: article.created_at,
            flags: [],
            metadata: {
              source: article.submitted_via || 'chrome_extension',
              word_count: article.content?.split(' ').length || 0,
              estimated_read_time: article.read_time || 0
            }
          })
        })
      }

      // Apply additional filters
      let filteredItems = items
      if (filters?.type) {
        filteredItems = items.filter(item => item.type === filters.type)
      }

      return { 
        success: true, 
        data: { 
          items: filteredItems,
          total: filteredItems.length 
        }
      }
    } catch (error) {
      console.error('Error fetching moderation queue:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { items: [], total: 0 }
      }
    }
  }

  // Get specific moderation item
  async getItem(id: string): Promise<ModerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/queue/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching moderation item:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Submit content for moderation
  async submitForModeration(content: {
    type: 'newsroom_article' | 'event' | 'community_story'
    title: string
    content: string
    author: string
    category: string
    metadata?: any
  }): Promise<ModerationResponse> {
    try {
      const submissionData = {
        type: content.type,
        content: {
          title: content.title,
          content: content.content,
          author: content.author,
          category: content.category
        },
        submittedBy: content.author,
        metadata: {
          source: 'user_submission',
          word_count: content.content.split(' ').length,
          estimated_read_time: Math.ceil(content.content.split(' ').length / 200),
          ...content.metadata
        }
      }

      const response = await fetch(`${this.baseUrl}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data, message: 'Story submitted for moderation' }
    } catch (error) {
      console.error('Error submitting for moderation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Moderate content (approve/reject) - updates Supabase directly
  async moderateContent(id: string, action: 'approve' | 'reject', reason?: string): Promise<ModerationResponse> {
    try {
      // Try to update as event first
      const eventResult = await supabaseHelpers.updateEvent(id, {
        status: action === 'approve' ? 'published' : 'archived'
      })

      if (eventResult.data) {
        return { 
          success: true, 
          data: eventResult.data,
          message: `Event ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
        }
      }

      // If not found as event, try as article
      const articleResult = await supabaseHelpers.updateArticle(id, {
        status: action === 'approve' ? 'published' : 'archived'
      })

      if (articleResult.data) {
        return { 
          success: true, 
          data: articleResult.data,
          message: `Article ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
        }
      }

      return {
        success: false,
        error: 'Content not found'
      }
    } catch (error) {
      console.error('Error moderating content:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get moderation statistics from Supabase
  async getStats(): Promise<ModerationResponse> {
    try {
      const stats = await supabaseHelpers.getCommunityStats()
      
      return { 
        success: true, 
        data: {
          pendingCount: (stats.events?.total || 0) + (stats.articles?.total || 0) - 
                       (stats.events?.published || 0) - (stats.articles?.published || 0),
          todayActions: 0, // Could be calculated from updated_at timestamps
          activeModerators: 1,
          newsroomQueue: (stats.articles?.total || 0) - (stats.articles?.published || 0),
          eventsQueue: (stats.events?.total || 0) - (stats.events?.published || 0),
          communityQueue: 0
        }
      }
    } catch (error) {
      console.error('Error fetching moderation stats:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {
          pendingCount: 0,
          todayActions: 0,
          activeModerators: 1,
          newsroomQueue: 0,
          eventsQueue: 0,
          communityQueue: 0
        }
      }
    }
  }

  // Get moderation history
  async getHistory(filters?: {
    moderatorId?: string
    action?: string
    limit?: number
    offset?: number
  }): Promise<ModerationResponse> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString())
        })
      }

      const response = await fetch(`${this.baseUrl}/api/history?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching moderation history:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { history: [], total: 0 }
      }
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      service: 'supabase-moderation',
      baseUrl: 'direct-supabase-connection'
    }
  }
}

export const moderationService = new ModerationService()
export type { ModerationItem, ModerationStats, ModerationResponse }