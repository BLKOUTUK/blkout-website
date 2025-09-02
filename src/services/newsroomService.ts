// Newsroom Service with Supabase Integration
// Provides unified access to articles from both Supabase and legacy backend

import { supabase, supabaseHelpers } from '../lib/supabase'
import type { NewsArticle, NewsroomStats, Database } from '../types/supabase'
import type { SocialShareContent } from './ivorSocialIntegration'

// Legacy interface for backward compatibility
interface LegacyNewsArticle {
  id: string
  title: string
  excerpt: string
  content?: string
  author: {
    name: string
    avatar: string
    bio?: string
  } | string
  publishedAt: string
  readTime: number
  category: string
  featured: boolean
  tags: string[]
  imageUrl?: string
  source?: string
  externalUrl?: string
  status: 'published' | 'breaking' | 'updated'
}

interface NewsroomResponse {
  articles: LegacyNewsArticle[]
  total: number
  page: number
  hasMore: boolean
  stats?: NewsroomStats
  source: 'supabase' | 'legacy' | 'fallback'
}

class NewsroomService {
  private baseUrl: string
  private isConnected: boolean = false
  private supabaseConnected: boolean = false
  private useSupabase: boolean = true // Prefer Supabase over legacy backend
  
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/api'                                  // Vercel proxy to real backend
      : '/api'                                  // Production proxy
    
    // Test Supabase connection on initialization
    this.checkSupabaseConnection()
  }

  private async checkSupabaseConnection(): Promise<boolean> {
    try {
      const { connected } = await supabaseHelpers.testConnection()
      this.supabaseConnected = connected
      
      if (connected) {
        console.log('✅ Supabase newsroom connection established')
      } else {
        console.warn('⚠️ Supabase newsroom connection failed, falling back to legacy backend')
      }
      
      return connected
    } catch (error) {
      console.error('❌ Supabase connection test failed:', error)
      this.supabaseConnected = false
      return false
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
        method: 'GET',
        // @ts-ignore - timeout is supported
        timeout: 5000,
      })
      
      this.isConnected = response.ok
      return this.isConnected
    } catch (error) {
      console.warn('Newsroom backend not available:', error)
      this.isConnected = false
      return false
    }
  }

  async getArticles(filters?: {
    category?: string
    featured?: boolean
    limit?: number
    page?: number
    status?: 'all' | 'published' | 'draft'
  }): Promise<NewsroomResponse> {
    // Try Supabase first if enabled
    if (this.useSupabase && this.supabaseConnected) {
      try {
        return await this.getArticlesFromSupabase(filters)
      } catch (error) {
        console.warn('Supabase articles fetch failed, trying legacy backend:', error)
      }
    }
    
    // Fall back to legacy backend
    try {
      if (!this.isConnected) {
        await this.checkConnection()
      }

      if (!this.isConnected) {
        return this.getFallbackArticles(filters)
      }

      const queryParams = new URLSearchParams()
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.featured !== undefined) queryParams.append('featured', filters.featured.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.status) queryParams.append('status', filters.status)

      const response = await fetch(`${this.baseUrl}/articles?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const legacyData = await response.json()
      return {
        ...legacyData,
        source: 'legacy' as const
      }
    } catch (error) {
      console.error('Newsroom service error:', error)
      return this.getFallbackArticles(filters)
    }
  }

  private async getArticlesFromSupabase(filters?: {
    category?: string
    featured?: boolean
    limit?: number
    page?: number
    status?: 'all' | 'published' | 'draft'
  }): Promise<NewsroomResponse> {
    const limit = filters?.limit || 20
    const page = filters?.page || 1
    const offset = (page - 1) * limit
    const status = filters?.status || 'published'
    
    let query = supabase
      .from('newsroom_articles')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
      // Only include moderated/approved articles, exclude archived migrated content
      .neq('submitted_via', 'blkoutuk-migration')
    
    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      throw error
    }
    
    // Transform Supabase articles to legacy format
    const articles: LegacyNewsArticle[] = (data || []).map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || article.content?.substring(0, 200) || '',
      content: article.content,
      author: typeof article.author === 'string' ? {
        name: article.author,
        avatar: article.author.substring(0, 2).toUpperCase()
      } : article.author,
      publishedAt: article.published_at,
      readTime: article.read_time || Math.max(1, Math.ceil((article.content?.length || 0) / 1000)),
      category: article.category,
      featured: article.featured,
      tags: article.tags || [],
      imageUrl: article.image_url,
      source: article.submitted_via || 'Newsroom',
      externalUrl: article.source_url,
      status: article.priority === 'high' ? 'breaking' : 
              article.status === 'published' ? 'published' : 'updated'
    }))
    
    // Get stats
    const stats = await this.getStatsFromSupabase()
    
    return {
      articles,
      total: count || 0,
      page,
      hasMore: (count || 0) > offset + limit,
      stats,
      source: 'supabase' as const
    }
  }

  private async getStatsFromSupabase(): Promise<NewsroomStats> {
    const { data, error } = await supabase
      .from('articles')
      .select('status, published_at')
    
    if (error || !data) {
      return { published: 0, draft: 0, total: 0, todayCount: 0 }
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    const stats = data.reduce((acc, article) => {
      acc.total++
      if (article.status === 'published') acc.published++
      if (article.status === 'draft') acc.draft++
      if (article.published_at?.startsWith(today)) acc.todayCount++
      return acc
    }, { published: 0, draft: 0, total: 0, todayCount: 0 })
    
    return stats
  }

  async getArticle(id: string): Promise<LegacyNewsArticle | null> {
    // Try Supabase first
    if (this.useSupabase && this.supabaseConnected) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single()
        
        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            excerpt: data.excerpt || data.content?.substring(0, 200) || '',
            content: data.content,
            author: typeof data.author === 'string' ? {
              name: data.author,
              avatar: data.author.substring(0, 2).toUpperCase()
            } : data.author,
            publishedAt: data.published_at,
            readTime: data.read_time || Math.max(1, Math.ceil((data.content?.length || 0) / 1000)),
            category: data.category,
            featured: data.featured,
            tags: data.tags || [],
            imageUrl: data.image_url,
            source: data.submitted_via || 'Newsroom',
            externalUrl: data.source_url,
            status: data.priority === 'high' ? 'breaking' : 
                    data.status === 'published' ? 'published' : 'updated'
          }
        }
      } catch (error) {
        console.warn('Supabase article fetch failed, trying legacy backend:', error)
      }
    }
    
    // Fall back to legacy backend
    try {
      if (!this.isConnected) {
        await this.checkConnection()
      }

      if (!this.isConnected) {
        return this.getFallbackArticle(id)
      }

      const response = await fetch(`${this.baseUrl}/articles/${id}`, {
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
      console.error('Newsroom article fetch error:', error)
      return this.getFallbackArticle(id)
    }
  }

  // Admin methods for CRUD operations
  async createArticle(article: Partial<NewsArticle>): Promise<NewsArticle | null> {
    if (!this.useSupabase || !this.supabaseConnected) {
      throw new Error('Article creation requires Supabase connection')
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.title || '',
        excerpt: article.excerpt,
        content: article.content,
        author: typeof article.author === 'string' ? article.author : 'Anonymous',
        published_at: article.published_at || new Date().toISOString(),
        category: article.category || 'General',
        featured: article.featured || false,
        status: article.status || 'draft',
        tags: article.tags || [],
        image_url: article.image_url,
        source_url: article.source_url,
        read_time: article.read_time,
        priority: article.priority || 'medium',
        submitted_via: 'admin-panel'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
    if (!this.useSupabase || !this.supabaseConnected) {
      throw new Error('Article updates require Supabase connection')
    }
    
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteArticle(id: string): Promise<boolean> {
    if (!this.useSupabase || !this.supabaseConnected) {
      throw new Error('Article deletion requires Supabase connection')
    }
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    
    return !error
  }

  // Enhanced stats with connection info  
  async getNewsroomStats(): Promise<NewsroomStats & { connectionStatus: string }> {
    let stats: NewsroomStats = { published: 0, draft: 0, total: 0, todayCount: 0 }
    let connectionStatus = 'disconnected'
    
    if (this.useSupabase && this.supabaseConnected) {
      try {
        stats = await this.getStatsFromSupabase()
        connectionStatus = 'supabase'
      } catch (error) {
        console.warn('Failed to get Supabase stats:', error)
      }
    }
    
    // Fall back to legacy backend stats if needed
    if (connectionStatus === 'disconnected' && this.isConnected) {
      try {
        const response = await fetch(`${this.baseUrl}/articles/stats`)
        if (response.ok) {
          const legacyStats = await response.json()
          stats = { ...stats, ...legacyStats }
          connectionStatus = 'legacy'
        }
      } catch (error) {
        console.warn('Failed to get legacy stats:', error)
      }
    }
    
    return { ...stats, connectionStatus }
  }

  // Real-time subscription for article updates
  subscribeToArticleUpdates(callback: (article: NewsArticle) => void) {
    if (!this.useSupabase || !this.supabaseConnected) {
      console.warn('Real-time subscriptions require Supabase connection')
      return null
    }
    
    return supabaseHelpers.subscribeToArticles(callback)
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

  // Get ALL articles for archive (including migrated content)
  async getArchiveArticles(filters?: {
    category?: string
    featured?: boolean
    limit?: number
    page?: number
    status?: 'all' | 'published' | 'draft'
    submitted_via?: string
  }): Promise<NewsroomResponse> {
    console.log('🗄️ NewsroomService.getArchiveArticles called with filters:', filters)
    console.log('🗄️ useSupabase:', this.useSupabase, 'supabaseConnected:', this.supabaseConnected)
    
    if (!this.useSupabase || !this.supabaseConnected) {
      console.log('🗄️ Using fallback articles')
      return this.getFallbackArticles(filters)
    }

    const limit = filters?.limit || 50
    const page = filters?.page || 1
    const offset = (page - 1) * limit
    const status = filters?.status || 'published'
    
    console.log('🗄️ Query parameters:', { limit, page, offset, status })
    
    let query = supabase
      .from('newsroom_articles')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
      // DO NOT exclude migrated articles for archive
    
    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    if (filters?.submitted_via) {
      query = query.eq('submitted_via', filters.submitted_via)
    }

    console.log('🗄️ Executing Supabase query...')
    const { data, error, count } = await query
    
    console.log('🗄️ Query result - data:', data?.length, 'articles, error:', error, 'count:', count)
    
    if (error) {
      console.error('🗄️ Supabase query error:', error)
      throw error
    }

    const articles = (data || []).map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || article.content?.substring(0, 200) || '',
      content: article.content,
      author: typeof article.author === 'string' 
        ? { name: article.author, avatar: article.author.substring(0, 2).toUpperCase() }
        : article.author,
      publishedAt: article.published_at,
      readTime: article.read_time || Math.max(1, Math.ceil((article.content?.length || 0) / 1000)),
      category: article.category,
      featured: article.featured,
      tags: article.tags || [],
      imageUrl: article.image_url,
      source: article.submitted_via || 'Newsroom',
      externalUrl: article.source_url,
      status: article.priority === 'high' ? 'breaking' : (article.status === 'published' ? 'published' : 'updated'),
      // Add migration context
      submitted_via: article.submitted_via
    }))

    const response = {
      articles,
      total: count || 0,
      page,
      hasMore: (count || 0) > offset + limit,
      source: 'supabase' as const
    }
    
    console.log('🗄️ Returning response with', articles.length, 'articles')
    return response
  }

  // Fallback data when backend is unavailable
  private getFallbackArticles(filters?: any): NewsroomResponse {
    const fallbackArticles: LegacyNewsArticle[] = [
      {
        id: '1',
        title: 'BREAKING: New QTIPOC+ Housing Initiative Launched in Manchester',
        excerpt: 'Community-led housing cooperative provides safe, affordable homes for Black queer men in Greater Manchester area.',
        author: { name: 'Marcus Johnson', avatar: 'MJ' },
        publishedAt: '2025-08-01',
        readTime: 5,
        category: 'Breaking News',
        featured: true,
        tags: ['Housing', 'Community', 'Manchester'],
        status: 'breaking'
      },
      {
        id: '2',
        title: 'POLICY ANALYSIS: Impact of Recent Gender Recognition Changes',
        excerpt: 'Comprehensive analysis of new gender recognition legislation and its effects on Black trans and non-binary communities.',
        author: { name: 'Dr. Alex Thompson', avatar: 'AT' },
        publishedAt: '2025-07-30',
        readTime: 8,
        category: 'Analysis',
        featured: true,
        tags: ['Policy', 'Trans Rights', 'Legal'],
        status: 'published'
      },
      {
        id: '3',
        title: 'COMMUNITY SPOTLIGHT: Birmingham Pride Planning Update',
        excerpt: 'Local organizing committee shares plans for Birmingham Black Pride 2025 celebration.',
        author: { name: 'Jordan Clarke', avatar: 'JC' },
        publishedAt: '2025-07-28',
        readTime: 4,
        category: 'Community News',
        featured: false,
        tags: ['Pride', 'Birmingham', 'Events'],
        status: 'published'
      },
      {
        id: '4',
        title: 'MENTAL HEALTH: New Culturally Competent Therapy Network',
        excerpt: 'Directory of Black QTIPOC+-affirming mental health professionals launches across the UK.',
        author: { name: 'Dr. Sarah Williams', avatar: 'SW' },
        publishedAt: '2025-07-25',
        readTime: 6,
        category: 'Health',
        featured: false,
        tags: ['Mental Health', 'Therapy', 'Resources'],
        status: 'published'
      }
    ]

    // Apply filters
    let filteredArticles = fallbackArticles
    if (filters?.category) {
      filteredArticles = filteredArticles.filter(article => article.category === filters.category)
    }
    if (filters?.featured !== undefined) {
      filteredArticles = filteredArticles.filter(article => article.featured === filters.featured)
    }

    const limit = filters?.limit || 10
    const page = filters?.page || 1
    const startIndex = (page - 1) * limit
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + limit)

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
      page,
      hasMore: startIndex + limit < filteredArticles.length,
      source: 'fallback' as const
    }
  }

  private getFallbackArticle(id: string): LegacyNewsArticle | null {
    const fallbackArticles = this.getFallbackArticles().articles
    return fallbackArticles.find(article => article.id === id) || null
  }
}

export const newsroomService = new NewsroomService()
export type { LegacyNewsArticle as NewsArticle, NewsroomResponse, NewsroomStats }