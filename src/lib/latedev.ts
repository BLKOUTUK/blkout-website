/**
 * Late.dev API Client
 * Social media scheduling and automation
 * https://getlate.dev/docs
 */

const LATE_API_BASE_URL = 'https://getlate.dev/api/v1'

export interface LatePost {
  content: string
  platforms: Array<{
    platform: 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'tiktok' | 'pinterest' | 'reddit' | 'threads' | 'bluesky'
    accountId: string
  }>
  scheduledFor?: string // ISO datetime
  timezone?: string // IANA timezone
  publishNow?: boolean
  media?: Array<{
    url: string
    type: 'image' | 'video'
  }>
}

export interface LatePostResponse {
  id: string
  status: 'scheduled' | 'published' | 'failed'
  content: string
  scheduledFor: string
  platforms: Array<{
    platform: string
    accountId: string
    status: string
  }>
}

export interface LateAccount {
  id: string
  platform: string
  username: string
  profilePicture?: string
  isActive: boolean
}

class LateDevClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.LATE_API_KEY || ''
    this.baseUrl = LATE_API_BASE_URL

    if (!this.apiKey) {
      console.warn('⚠️ LATE_API_KEY not found in environment variables')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(
          `Late.dev API error: ${response.status} ${response.statusText} - ${JSON.stringify(error)}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error('Late.dev API request failed:', error)
      throw error
    }
  }

  /**
   * Get all connected social media accounts
   */
  async getAccounts(): Promise<LateAccount[]> {
    return this.request<LateAccount[]>('/accounts')
  }

  /**
   * Create and schedule a post
   */
  async createPost(post: LatePost): Promise<LatePostResponse> {
    return this.request<LatePostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    })
  }

  /**
   * Get post by ID
   */
  async getPost(postId: string): Promise<LatePostResponse> {
    return this.request<LatePostResponse>(`/posts/${postId}`)
  }

  /**
   * List all posts with optional filters
   */
  async listPosts(params?: {
    status?: 'scheduled' | 'published' | 'failed'
    limit?: number
    offset?: number
  }): Promise<{ posts: LatePostResponse[]; total: number }> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.set('status', params.status)
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.offset) queryParams.set('offset', params.offset.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''
    return this.request(`/posts${query}`)
  }

  /**
   * Upload media file
   */
  async uploadMedia(file: File | Blob): Promise<{ url: string; id: string }> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request('/media', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      } as any,
      body: formData,
    })
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{
    postsScheduled: number
    postsPublished: number
    limit: number
    resetDate: string
  }> {
    return this.request('/usage-stats')
  }

  /**
   * Get next available queue slot
   */
  async getNextQueueSlot(platform: string): Promise<{
    nextSlot: string
    timezone: string
  }> {
    return this.request(`/queue/next-slot?platform=${platform}`)
  }
}

// Export singleton instance
export const lateClient = new LateDevClient()

// Export class for custom instances
export default LateDevClient
