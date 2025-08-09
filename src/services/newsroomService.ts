// Newsroom Service for connecting to newsroom backend
interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content?: string
  author: {
    name: string
    avatar: string
    bio?: string
  }
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
  articles: NewsArticle[]
  total: number
  page: number
  hasMore: boolean
}

class NewsroomService {
  private baseUrl: string
  private isConnected: boolean = false
  
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/api'                                  // Vercel proxy to real backend
      : '/api'                                  // Production proxy
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
        method: 'GET',
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
  }): Promise<NewsroomResponse> {
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

      const response = await fetch(`${this.baseUrl}/articles?${queryParams}`, {
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
      console.error('Newsroom service error:', error)
      return this.getFallbackArticles(filters)
    }
  }

  async getArticle(id: string): Promise<NewsArticle | null> {
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

  // Fallback data when backend is unavailable
  private getFallbackArticles(filters?: any): NewsroomResponse {
    const fallbackArticles: NewsArticle[] = [
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
      hasMore: startIndex + limit < filteredArticles.length
    }
  }

  private getFallbackArticle(id: string): NewsArticle | null {
    const fallbackArticles = this.getFallbackArticles().articles
    return fallbackArticles.find(article => article.id === id) || null
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export const newsroomService = new NewsroomService()
export type { NewsArticle, NewsroomResponse }