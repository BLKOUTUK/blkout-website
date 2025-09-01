// Moderation Service for BLKOUT Phase 1
// Interfaces with existing moderation backend API

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
  private baseUrl: string
  private isConnected: boolean = false

  constructor() {
    // Use the working moderation backend URL
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://blkout-moderation-backend.vercel.app'
      : 'http://localhost:3001'
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      this.isConnected = response.ok
      return this.isConnected
    } catch (error) {
      console.warn('Moderation service unavailable:', error)
      this.isConnected = false
      return false
    }
  }

  // Get moderation queue with filters
  async getQueue(filters?: {
    type?: string
    status?: string
    priority?: string
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

      const response = await fetch(`${this.baseUrl}/api/queue?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching moderation queue:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { items: [], total: 0 } // Fallback empty data
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

  // Moderate content (approve/reject)
  async moderateContent(id: string, action: 'approve' | 'reject', reason?: string): Promise<ModerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/moderate/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { 
        success: true, 
        data, 
        message: `Content ${action === 'approve' ? 'approved' : 'rejected'} successfully` 
      }
    } catch (error) {
      console.error('Error moderating content:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get moderation statistics
  async getStats(): Promise<ModerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
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
      service: 'moderation',
      baseUrl: this.baseUrl
    }
  }
}

export const moderationService = new ModerationService()
export type { ModerationItem, ModerationStats, ModerationResponse }