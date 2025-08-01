// Magazine Service for connecting to magazine backend
import { liveStoryArchive, getFeaturedStories, getRecentStories, type StoryArchiveItem } from '../data/liveStoryArchive'

interface MagazineArticle {
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
  likes: number
  comments: number
  views?: number
}

interface MagazineResponse {
  articles: MagazineArticle[]
  total: number
  page: number
  hasMore: boolean
}

class MagazineService {
  private baseUrl: string
  private isConnected: boolean = false
  
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://magazine.blkoutuk.com/api'  // Production URL
      : 'http://localhost:3003/api'          // Local development
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000,
      })
      
      this.isConnected = response.ok
      return this.isConnected
    } catch (error) {
      console.warn('Magazine backend not available:', error)
      this.isConnected = false
      return false
    }
  }

  async getArticles(filters?: {
    category?: string
    featured?: boolean
    limit?: number
    page?: number
  }): Promise<MagazineResponse> {
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
      console.error('Magazine service error:', error)
      return this.getFallbackArticles(filters)
    }
  }

  async getArticle(id: string): Promise<MagazineArticle | null> {
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
      console.error('Magazine article fetch error:', error)
      return this.getFallbackArticle(id)
    }
  }

  // Fallback data when backend is unavailable - using live BLKOUT UK stories
  private getFallbackArticles(filters?: any): MagazineResponse {
    // Convert live story archive to magazine article format
    const fallbackArticles: MagazineArticle[] = liveStoryArchive.map(story => ({
      id: story.id,
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      author: story.author,
      publishedAt: story.publishedAt,
      readTime: story.readTime,
      category: story.category,
      featured: story.featured,
      tags: story.tags,
      imageUrl: story.imageUrl,
      likes: Math.floor(Math.random() * 400) + 50, // Random likes for engagement
      comments: Math.floor(Math.random() * 80) + 10 // Random comments
    }))

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

  private getFallbackArticle(id: string): MagazineArticle | null {
    // Find story in live archive first
    const story = liveStoryArchive.find(s => s.id === id)
    if (story) {
      return {
        id: story.id,
        title: story.title,
        excerpt: story.excerpt,
        content: story.content,
        author: story.author,
        publishedAt: story.publishedAt,
        readTime: story.readTime,
        category: story.category,
        featured: story.featured,
        tags: story.tags,
        imageUrl: story.imageUrl,
        likes: Math.floor(Math.random() * 400) + 50,
        comments: Math.floor(Math.random() * 80) + 10
      }
    }
    return null
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export const magazineService = new MagazineService()
export type { MagazineArticle, MagazineResponse }