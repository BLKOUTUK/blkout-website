// Custom React Hook for Newsroom API Integration
// Provides unified access to Supabase and legacy newsroom endpoints

import { useState, useEffect, useCallback } from 'react'
import { newsroomService } from '../services/newsroomService'
import type { NewsArticle, NewsroomResponse, NewsroomStats } from '../services/newsroomService'

interface UseNewsroomReturn {
  articles: NewsArticle[]
  loading: boolean
  error: string | null
  stats: NewsroomStats & { connectionStatus: string }
  totalPages: number
  currentPage: number
  hasMore: boolean
  refreshArticles: () => Promise<void>
  createArticle: (article: Partial<NewsArticle>) => Promise<NewsArticle | null>
  updateArticle: (id: string, updates: Partial<NewsArticle>) => Promise<NewsArticle | null>
  deleteArticle: (id: string) => Promise<boolean>
  setFilters: (filters: NewsroomFilters) => void
  connectionStatus: ReturnType<typeof newsroomService.getConnectionStatus>
}

interface NewsroomFilters {
  category?: string
  featured?: boolean
  limit?: number
  page?: number
  status?: 'all' | 'published' | 'draft'
}

export function useNewsroom(initialFilters: NewsroomFilters = {}): UseNewsroomReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<NewsroomStats & { connectionStatus: string }>({
    published: 0,
    draft: 0,
    total: 0,
    todayCount: 0,
    connectionStatus: 'disconnected'
  })
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFiltersState] = useState<NewsroomFilters>(initialFilters)

  // Get connection status
  const connectionStatus = newsroomService.getConnectionStatus()

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: NewsroomResponse = await newsroomService.getArticles(filters)
      
      setArticles(response.articles)
      setCurrentPage(response.page)
      setHasMore(response.hasMore)
      setTotalPages(Math.ceil(response.total / (filters.limit || 20)))
      
      console.log(`✅ Loaded ${response.articles.length} articles from ${response.source}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load articles'
      setError(errorMessage)
      console.error('Failed to load articles:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const loadStats = useCallback(async () => {
    try {
      const newsroomStats = await newsroomService.getNewsroomStats()
      setStats(newsroomStats)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }, [])

  const refreshArticles = useCallback(async () => {
    await Promise.all([loadArticles(), loadStats()])
  }, [loadArticles, loadStats])

  // CRUD operations
  const createArticle = useCallback(async (article: Partial<NewsArticle>): Promise<NewsArticle | null> => {
    try {
      const newArticle = await newsroomService.createArticle(article)
      if (newArticle) {
        await refreshArticles()
      }
      return newArticle
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create article'
      setError(errorMessage)
      throw err
    }
  }, [refreshArticles])

  const updateArticle = useCallback(async (id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> => {
    try {
      const updatedArticle = await newsroomService.updateArticle(id, updates)
      if (updatedArticle) {
        await refreshArticles()
      }
      return updatedArticle
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update article'
      setError(errorMessage)
      throw err
    }
  }, [refreshArticles])

  const deleteArticle = useCallback(async (id: string): Promise<boolean> => {
    try {
      const deleted = await newsroomService.deleteArticle(id)
      if (deleted) {
        await refreshArticles()
      }
      return deleted
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article'
      setError(errorMessage)
      throw err
    }
  }, [refreshArticles])

  const setFilters = useCallback((newFilters: NewsroomFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Load data on mount and when filters change
  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  // Real-time subscription for article updates (Supabase only)
  useEffect(() => {
    const subscription = newsroomService.subscribeToArticleUpdates?.((article) => {
      console.log('Real-time article update:', article)
      // Refresh articles when we get updates
      refreshArticles()
    })

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [refreshArticles])

  return {
    articles,
    loading,
    error,
    stats,
    totalPages,
    currentPage,
    hasMore,
    refreshArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    setFilters,
    connectionStatus
  }
}

export default useNewsroom