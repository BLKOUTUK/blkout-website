// API Client for BLKOUTNXT Supabase Integration
// Centralized HTTP client for the new /home/robbe/blkoutnxt-api backend

import type { 
  ApiResponse, 
  ApiConfig, 
  ApiError,
  ArticleQuery,
  EventQuery,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateEventRequest,
  UpdateEventRequest,
  ApiArticle,
  ApiEvent,
  LoadingState
} from '../types/api'

class ApiClient {
  private baseUrl: string
  private timeout: number
  private retries: number
  private defaultHeaders: Record<string, string>
  private authToken: string | null = null

  constructor(config: Partial<ApiConfig> = {}) {
    this.baseUrl = config.baseUrl || this.detectApiUrl()
    this.timeout = config.timeout || 10000
    this.retries = config.retries || 3
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers
    }

    // Try to load auth token from localStorage
    this.loadAuthToken()
  }

  private detectApiUrl(): string {
    // Development vs Production API detection
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    
    if (isDevelopment || isLocalhost) {
      // Check if local API is running, fallback to production API
      return window.location.port === '5173' || window.location.port === '3000' 
        ? 'http://localhost:3000/api'  // Development API
        : 'https://blkout-newsroom-backend-ptfjb4krx-robs-projects-54d653d3.vercel.app/api'  // Direct backend
    }
    
    // Production: use direct backend URL to avoid proxy complexity
    return 'https://blkout-newsroom-backend-ptfjb4krx-robs-projects-54d653d3.vercel.app/api'
  }

  private loadAuthToken(): void {
    try {
      const token = localStorage.getItem('blkout_auth_token')
      if (token) {
        this.authToken = token
        this.defaultHeaders['Authorization'] = `Bearer ${token}`
      }
    } catch (error) {
      console.warn('Failed to load auth token:', error)
    }
  }

  setAuthToken(token: string | null): void {
    this.authToken = token
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`
      localStorage.setItem('blkout_auth_token', token)
    } else {
      delete this.defaultHeaders['Authorization']
      localStorage.removeItem('blkout_auth_token')
    }
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      signal: AbortSignal.timeout(this.timeout)
    }

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
      
      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          this.setAuthToken(null) // Clear invalid token
          throw new Error('Authentication required')
        }
        
        if (response.status === 403) {
          throw new Error('Access denied')
        }

        if (response.status === 404) {
          throw new Error('Resource not found')
        }

        if (response.status >= 500) {
          throw new Error('Server error')
        }

        // Try to parse error response
        try {
          const errorData = await response.json()
          throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`)
      
      return data as ApiResponse<T>
    } catch (error) {
      console.error(`❌ API Error: ${options.method || 'GET'} ${url}`, error)

      // Retry logic for network errors
      if (retryCount < this.retries && this.isRetryableError(error)) {
        console.log(`🔄 Retrying request (${retryCount + 1}/${this.retries})`)
        await this.delay(Math.pow(2, retryCount) * 1000) // Exponential backoff
        return this.makeRequest<T>(endpoint, options, retryCount + 1)
      }

      // Return error in ApiResponse format
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: undefined
      }
    }
  }

  private isRetryableError(error: any): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true // Network errors
    }
    if (error.name === 'AbortError') {
      return false // Don't retry timeouts
    }
    return false
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Utility method to build query strings
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()))
        } else {
          searchParams.append(key, value.toString())
        }
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
  }

  // Health check
  async checkHealth(): Promise<{ healthy: boolean; backend: string; timestamp: string }> {
    try {
      const response = await this.makeRequest<{ status: string; timestamp: string }>('/health')
      return {
        healthy: response.success,
        backend: this.baseUrl,
        timestamp: response.data?.timestamp || new Date().toISOString()
      }
    } catch (error) {
      return {
        healthy: false,
        backend: this.baseUrl,
        timestamp: new Date().toISOString()
      }
    }
  }

  // Articles API
  async getArticles(query: ArticleQuery = {}): Promise<ApiResponse<ApiArticle[]>> {
    const queryString = this.buildQueryString({
      page: query.page || 1,
      limit: query.limit || 20,
      category: query.category,
      status: query.status,
      author_id: query.author_id,
      search: query.search,
      sort: query.sort || 'published_at',
      order: query.order || 'desc'
    })

    return this.makeRequest<ApiArticle[]>(`/newsroom/articles${queryString}`)
  }

  async getArticle(id: string): Promise<ApiResponse<ApiArticle>> {
    return this.makeRequest<ApiArticle>(`/newsroom/articles/${id}`)
  }

  async createArticle(data: CreateArticleRequest): Promise<ApiResponse<ApiArticle>> {
    return this.makeRequest<ApiArticle>('/newsroom/articles', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateArticle(id: string, data: UpdateArticleRequest): Promise<ApiResponse<ApiArticle>> {
    return this.makeRequest<ApiArticle>(`/newsroom/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/newsroom/articles/${id}`, {
      method: 'DELETE'
    })
  }

  // Events API
  async getEvents(query: EventQuery = {}): Promise<ApiResponse<ApiEvent[]>> {
    const queryString = this.buildQueryString({
      page: query.page || 1,
      limit: query.limit || 20,
      start_date: query.start_date,
      end_date: query.end_date,
      event_type: query.event_type,
      location: query.location,
      status: query.status,
      organizer_id: query.organizer_id,
      search: query.search,
      sort: query.sort || 'start_date',
      order: query.order || 'asc'
    })

    return this.makeRequest<ApiEvent[]>(`/events${queryString}`)
  }

  async getEvent(id: string): Promise<ApiResponse<ApiEvent>> {
    return this.makeRequest<ApiEvent>(`/events/${id}`)
  }

  async createEvent(data: CreateEventRequest): Promise<ApiResponse<ApiEvent>> {
    return this.makeRequest<ApiEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<ApiResponse<ApiEvent>> {
    return this.makeRequest<ApiEvent>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/events/${id}`, {
      method: 'DELETE'
    })
  }

  // Authentication (Note: This might need to be handled differently depending on your auth setup)
  async signIn(email: string, password: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async signOut(): Promise<ApiResponse<void>> {
    const response = await this.makeRequest<void>('/auth/logout', {
      method: 'POST'
    })
    
    if (response.success) {
      this.setAuthToken(null)
    }
    
    return response
  }

  // Community API
  async getCommunityStats(): Promise<ApiResponse<any>> {
    return this.makeRequest('/community/stats')
  }

  async getCommunityDocumentation(): Promise<ApiResponse<any>> {
    return this.makeRequest('/documentation')
  }

  // File upload (if needed)
  async uploadFile(file: File, type: 'image' | 'document' = 'image'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const headers = { ...this.defaultHeaders }
    delete headers['Content-Type'] // Let browser set content-type for FormData

    return this.makeRequest<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export loading state utilities
export const createLoadingState = (): LoadingState => ({
  loading: false,
  error: null,
  success: false
})

export const setLoading = (state: LoadingState, loading: boolean): LoadingState => ({
  ...state,
  loading,
  error: loading ? null : state.error
})

export const setError = (state: LoadingState, error: string): LoadingState => ({
  ...state,
  loading: false,
  error,
  success: false
})

export const setSuccess = (state: LoadingState): LoadingState => ({
  ...state,
  loading: false,
  error: null,
  success: true
})

// Custom hook for API requests (React-style)
export const useApiRequest = <T = any>() => {
  const [state, setState] = React.useState<LoadingState & { data: T | null }>({
    loading: false,
    error: null,
    success: false,
    data: null
  })

  const execute = async (request: Promise<ApiResponse<T>>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await request
      
      if (response.success) {
        setState({
          loading: false,
          error: null,
          success: true,
          data: response.data || null
        })
      } else {
        setState({
          loading: false,
          error: response.error || 'Request failed',
          success: false,
          data: null
        })
      }
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        data: null
      })
    }
  }

  const reset = () => {
    setState({
      loading: false,
      error: null,
      success: false,
      data: null
    })
  }

  return { ...state, execute, reset }
}

// React import for the hook (only if React is available)
let React: any
try {
  React = require('react')
} catch {
  // React not available, skip hook export
}

export default apiClient