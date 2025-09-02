import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Archive, Search, X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
)

export default function StoryArchive() {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [articles, setArticles] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  const ITEMS_PER_PAGE = 12 // Smaller chunks for better performance

  // Fetch articles with pagination and search
  const loadArticles = async (page: number = 0, append: boolean = false, search: string = '') => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError(null)
    }
    
    try {
      console.log(`🗃️ Fetching page ${page + 1} (${ITEMS_PER_PAGE} items)...${search ? ` Search: "${search}"` : ''}`)
      console.log('🗃️ Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'fallback')
      
      // Build query for BLKOUTUK published articles with optional search
      let query = supabase
        .from('newsroom_articles')
        .select('*', { count: 'exact' })
        .like('source_url', 'https://blkoutuk.com%')
        .eq('status', 'published')
      
      // Add search filter if provided
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
      }
      
      const { data, error: queryError, count } = await query
        .order('created_at', { ascending: false })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
      
      console.log('🗃️ Query result:', { 
        data: data?.length, 
        count, 
        page: page + 1,
        error: queryError,
        dataExists: !!data,
        dataArray: Array.isArray(data),
        firstTitle: data?.[0]?.title
      })
        
      if (queryError) {
        throw queryError
      }
      
      // Set total count on first load
      if (!append && count !== null) {
        setTotalCount(count)
      }
      
      if (data && data.length > 0) {
        // Transform the data to match our component format
        const transformedArticles = data.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || article.content?.substring(0, 200) || '',
          author: { 
            name: 'BLKOUTUK', // Default author for migrated articles
            avatar: 'BU'
          },
          published_at: article.published_at || article.created_at,
          category: 'Community', // Default category
          tags: [], // No tags in current schema
          status: article.status,
          source_url: article.source_url,
          featured_image: article.featured_image
        }))
        
        console.log('🗃️ Transformed articles:', transformedArticles.length)
        console.log('🗃️ BLKOUTUK articles:', transformedArticles.filter(a => a.source_url?.includes('blkoutuk.com')).length)
        
        if (append) {
          // Append to existing articles
          setArticles(prev => [...prev, ...transformedArticles])
        } else {
          // Replace articles (first load)
          setArticles(transformedArticles)
        }
        
        // Check if there are more pages
        const totalLoaded = (page + 1) * ITEMS_PER_PAGE
        setHasMore(totalLoaded < (count || 0))
        setCurrentPage(page)
        
      } else if (!append) {
        // No data found - this shouldn't happen with 268 BLKOUTUK articles
        console.log('🗃️ No articles found - this is unexpected!', { data, count, queryError })
        setArticles([])
        setHasMore(false)
      }
    } catch (err) {
      console.error('🗃️ Error fetching archive:', err)
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load archive'
      setError(errorMessage)
      
      // Don't set fallback articles - just show the error state
      if (!append) {
        setArticles([])
        setHasMore(false)
      }
    } finally {
      if (append) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }

  // Load more articles
  const loadMore = async () => {
    if (!loadingMore && hasMore) {
      await loadArticles(currentPage + 1, true, searchQuery)
    }
  }

  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsSearching(!!query.trim())
    await loadArticles(0, false, query)
  }

  const clearSearch = async () => {
    setSearchQuery('')
    setIsSearching(false)
    await loadArticles(0, false, '')
  }

  // Initial load
  useEffect(() => {
    loadArticles(0, false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading archive...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Archive className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Story Archive</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Our complete collection of community stories, including the preserved legacy of BLKOUTUK.com
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search 278 articles by title, content, or keywords..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {isSearching && (
              <div className="mt-2 text-sm text-blue-300">
                🔍 Searching for "{searchQuery}"...
              </div>
            )}
          </div>
        </div>

        {/* Archive Status */}
        {error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <h3 className="text-red-400 font-bold mb-2">⚠️ Database Connection Issue</h3>
            <p className="text-red-300 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={() => loadArticles(0, false)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        ) : (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-8">
            <h3 className="text-blue-400 font-bold mb-2">📊 Archive Status</h3>
            <div className="text-blue-300 text-sm space-y-1">
              <p>
                {isSearching ? (
                  <>
                    Found {articles.length} of {totalCount} articles matching "{searchQuery}" • 
                    Searching BLKOUTUK legacy archive
                  </>
                ) : (
                  <>
                    Showing {articles.length} of {totalCount} BLKOUTUK legacy articles • 
                    {totalCount} migrated from BLKOUTUK.com • 
                    Complete historical archive of community stories
                  </>
                )}
              </p>
              {hasMore && !isSearching && (
                <p>Loading in chunks of {ITEMS_PER_PAGE} for better performance</p>
              )}
              {isSearching && totalCount === 0 && (
                <p>Try different keywords or <button onClick={clearSearch} className="text-blue-400 hover:text-blue-300 underline">clear search</button> to browse all articles</p>
              )}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              to={`/newsroom/article/${article.slug || article.id}`}
              className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group block"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {article.source_url?.includes('blkoutuk.com') && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <span>🏛️</span>
                      BLKOUTUK Legacy
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(article.published_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short', 
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{article.author.name}</span>
                  <span>{article.category}</span>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading More...
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Load More Articles ({totalCount - articles.length} remaining)
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400">
            Archive loaded in {ITEMS_PER_PAGE}-article chunks for optimal performance • 
            {articles.length} of {totalCount} articles shown
          </p>
        </div>
      </div>
    </div>
  )
}