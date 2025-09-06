'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Newspaper, Search, Filter, Calendar, Clock, User, 
  ArrowRight, ExternalLink, TrendingUp, Globe, 
  AlertCircle, CheckCircle, Loader, RefreshCw,
  BookOpen, FileText, Radio, Video, WifiOff
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import PageLoadingDebug from '../debug/PageLoadingDebug'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { apiClient } from '../../services/apiClient'
import type { ApiArticle, ComputedArticle } from '../../types/api'

// Content categories with masculine colors
const CONTENT_CATEGORIES = {
  'Breaking News': { 
    color: 'bg-red-600', 
    textColor: 'text-red-400',
    gradient: 'from-red-500 via-red-600 to-red-700',
    glowColor: 'shadow-red-500/25'
  },
  'Analysis': { 
    color: 'bg-indigo-600', 
    textColor: 'text-indigo-400',
    gradient: 'from-indigo-500 via-indigo-600 to-indigo-700',
    glowColor: 'shadow-indigo-500/25'
  },
  'Community News': { 
    color: 'bg-emerald-600', 
    textColor: 'text-emerald-400',
    gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
    glowColor: 'shadow-emerald-500/25'
  },
  'Policy Update': { 
    color: 'bg-slate-600', 
    textColor: 'text-slate-400',
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    glowColor: 'shadow-slate-500/25'
  },
  'International': { 
    color: 'bg-violet-600', 
    textColor: 'text-violet-400',
    gradient: 'from-violet-500 via-violet-600 to-violet-700',
    glowColor: 'shadow-violet-500/25'
  }
}

// No fallback articles in Phase 1 - show empty state when no real data available

// Newsroom Hero Section
const NewsroomHero = ({ backendStatus }: { backendStatus: string }) => (
  <section className="relative py-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mr-6">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black heading-block uppercase">
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                BLKOUT
              </span>
              <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent ml-2">
                NEWSROOM
              </span>
            </h1>
            <p className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
              COMMUNITY NEWS & LIBERATION ANALYSIS
            </p>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-12"
        >
          Curated news, analysis, and community updates that matter to Black queer liberation. 
          Stay informed about policy changes, community events, and movement developments.
        </motion.p>

        {/* Backend Status */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center space-x-4 mb-12"
        >
          {backendStatus === 'checking' && (
            <div className="flex items-center space-x-3">
              <LoadingSpinner size="sm" color="indigo" />
              <span className="text-indigo-400 font-bold heading-block text-sm uppercase">
                CONNECTING TO NEWSROOM
              </span>
            </div>
          )}
          {backendStatus === 'connected' && (
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-bold heading-block text-sm uppercase">
                NEWSROOM LIVE
              </span>
              <div className="flex items-center text-indigo-300 text-sm font-light">
                <span>• Real-time updates active</span>
                {lastUpdated && (
                  <span className="ml-3 text-xs">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          )}
          {backendStatus === 'offline' && (
            <div className="flex items-center space-x-3">
              <WifiOff className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-bold heading-block text-sm uppercase">
                USING CACHED CONTENT
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-indigo-300 text-sm font-light">
                  • Showing recent stories
                </span>
                <button
                  onClick={handleRetry}
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Error Display */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/30 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-red-300 font-bold text-lg mb-2">Connection Error</h3>
                  <p className="text-red-200 mb-4">{error?.message}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleRetry}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Connection
                    </button>
                    <button
                      onClick={clearError}
                      className="text-red-300 hover:text-red-200 font-medium"
                    >
                      Dismiss
                    </button>
                    {retryCount > 0 && (
                      <span className="text-red-300 text-sm">
                        Retry attempts: {retryCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Newsroom Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-indigo-800/20 border border-indigo-700/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-indigo-200 mb-2">Phase 1 Development</h3>
            <p className="text-indigo-300 text-sm">
              Newsroom integration with community contributors and automated content aggregation 
              coming in Phase 2. Real articles will be displayed when content APIs are connected.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// News Categories
const NewsCategories = ({ selectedCategory, onCategorySelect }: {
  selectedCategory: string
  onCategorySelect: (category: string) => void
}) => (
  <section className="py-16 bg-indigo-50/5 backdrop-blur-sm border-y border-indigo-800/30">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black heading-block mb-4 uppercase">
          <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
            NEWS
          </span>
          <span className="bg-gradient-to-r from-indigo-400 to-slate-400 bg-clip-text text-transparent ml-4">
            CATEGORIES
          </span>
        </h2>
        <p className="text-indigo-200 font-light text-lg">
          Stay informed across all areas that impact our community
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {['All', ...Object.keys(CONTENT_CATEGORIES)].map((category) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-bold text-sm transition-all duration-300 heading-block uppercase ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/50 hover:text-white border border-indigo-700/30'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  </section>
)

// News Articles Grid
const NewsArticlesGrid = ({ articles, loading, onRefresh }: { 
  articles: any[]
  loading: boolean
  onRefresh: () => void
}) => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-8">
      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <LoadingSpinner size="xl" color="indigo" text="Loading Articles" />
          <p className="text-indigo-200 font-light mt-6">
            Fetching the latest community news and updates...
          </p>
        </motion.div>
      ) : articles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white heading-block mb-4 uppercase">
            NO ARTICLES AVAILABLE
          </h3>
          <p className="text-indigo-200 font-light mb-8">
            Newsroom backend is connecting. Articles will appear here as they are aggregated.
          </p>
          <motion.button
            onClick={onRefresh}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors heading-block uppercase flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-3" />
            REFRESH
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {articles.map((article, index) => {
            const categoryData = CONTENT_CATEGORIES[article.category] || CONTENT_CATEGORIES['Analysis']
            
            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 overflow-hidden hover:bg-indigo-900/40 transition-all duration-500 cursor-pointer group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Article Image */}
                  {article.image && (
                    <div className="lg:col-span-1 aspect-[4/3] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  
                  {/* Article Content */}
                  <div className={`${article.image ? 'lg:col-span-2' : 'lg:col-span-3'} p-8`}>
                    <div className="flex items-center mb-4">
                      {article.isBreaking && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold heading-block uppercase mr-4 animate-pulse">
                          BREAKING
                        </span>
                      )}
                      <div className={`w-3 h-3 bg-gradient-to-r ${categoryData.gradient} mr-3`}></div>
                      <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                        {article.category}
                      </span>
                      <span className="mx-3 text-indigo-600">•</span>
                      <span className="text-sm text-indigo-400">{article.source}</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black heading-block mb-4 leading-tight group-hover:text-white transition-colors">
                      <span className={`bg-gradient-to-r ${categoryData.gradient} bg-clip-text text-transparent group-hover:text-white`}>
                        {article.title}
                      </span>
                    </h2>
                    
                    <p className="text-indigo-100 mb-6 leading-relaxed font-light text-lg">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-indigo-300">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {article.readTime} min read
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {article.source_url ? (
                        <motion.a
                          href={article.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 5 }}
                          className="flex items-center text-indigo-400 hover:text-white transition-colors font-bold heading-block uppercase text-sm"
                        >
                          VIEW FULL ARTICLE
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </motion.a>
                      ) : (
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="flex items-center text-indigo-400 hover:text-white transition-colors font-bold heading-block uppercase text-sm"
                        >
                          READ FULL STORY
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </div>
  </section>
)

export default function NewsroomEnhanced() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [retryCount, setRetryCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  const { error, hasError, handleAPIError, clearError, retry } = useErrorHandler({
    showToast: true,
    retryable: true
  })
  
  // Transform API article to component format
  const transformApiArticle = (apiArticle: ApiArticle): ComputedArticle => {
    const authorName = apiArticle.profiles?.full_name || 'BLKOUT Team'
    const authorInitials = authorName.split(' ').map(name => name[0]).join('').toUpperCase()
    
    return {
      ...apiArticle,
      readTime: Math.max(1, Math.ceil((apiArticle.content?.length || 0) / 1000)),
      isBreaking: apiArticle.status === 'published' && apiArticle.featured_image !== null,
      publishedAtFormatted: new Date(apiArticle.published_at || apiArticle.created_at).toLocaleDateString(),
      authorName,
      authorInitials,
      
      // Legacy compatibility fields
      author: authorName,
      publishedAt: apiArticle.published_at || apiArticle.created_at,
      image: apiArticle.featured_image || '/images/squared/WELLDEF_SQUARED.png',
      featured: !!apiArticle.featured_image,
      priority: 'medium' as const,
      source: 'BLKOUT Newsroom'
    }
  }

  const fetchArticles = async () => {
    try {
      clearError()
      setLoading(true)
      setBackendStatus('checking')
      
      console.log('🔄 Fetching articles from Supabase API...')
      
      // Use the new API client
      const response = await apiClient.getArticles({
        status: 'published',
        sort: 'published_at',
        order: 'desc',
        limit: 20
      })
      
      console.log('📊 Articles API response:', response)
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Transform API data to match expected format
        const transformedArticles = response.data.map(transformApiArticle)
        
        console.log('✅ Articles transformed successfully:', transformedArticles.length)
        
        if (transformedArticles.length > 0) {
          setArticles(transformedArticles)
          setBackendStatus('connected')
        } else {
          console.log('📰 No published articles found, keeping fallback content')
          setBackendStatus('connected')
        }
        
        setLastUpdated(new Date())
      } else {
        throw new Error(response.error || 'Failed to fetch articles')
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error)
      handleAPIError(error, 'newsroom API')
      setBackendStatus('offline')
      // No fallback data - show empty state in Phase 1
      setArticles([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchArticles()
  }, [])
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    retry(() => fetchArticles())
  }

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'All' || article.category === selectedCategory
  )

  return (
    <ErrorBoundary>
      <PageLoadingDebug 
        pageName="Newsroom"
        dependencies={['Supabase', 'API Client']}
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        {/* Enhanced Navigation */}
        <PrimaryNavigationEnhanced />
      
      {/* Newsroom Hero */}
      <NewsroomHero backendStatus={backendStatus} />
      
      {/* News Categories */}
      <NewsCategories 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {/* News Articles */}
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('NewsArticlesGrid Error:', error, errorInfo)
          handleAPIError(error, 'NewsArticlesGrid')
        }}
      >
        <NewsArticlesGrid 
          articles={filteredArticles} 
          loading={loading}
          onRefresh={handleRetry}
        />
      </ErrorBoundary>
      
        {/* Platform Footer */}
        <PlatformFooter />
      </div>
    </ErrorBoundary>
  )
}