import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SharedLayout from './layout/SharedLayout'

interface ArchiveStory {
  id: string
  title: string
  content: string
  excerpt?: string
  author: string
  published_date: string
  original_url?: string
  category?: string
  tags?: string[]
  migrated_from: 'blkoutuk.com'
}

const StoryArchivePage = () => {
  const [stories, setStories] = useState<ArchiveStory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 12

  const loadArchiveStories = async (query = '', category = 'all', page = 0, append = false) => {
    try {
      if (!append) {
        setLoading(true)
        setCurrentPage(0)
      } else {
        setLoadingMore(true)
      }
      
      // Query for migrated articles from blkoutuk.com in legacy_articles table
      let supabaseQuery = supabase
        .from('legacy_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)

      if (category !== 'all') {
        supabaseQuery = supabaseQuery.eq('category', category)
      }

      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      }

      const { data, error } = await supabaseQuery
      
      if (error) {
        console.error('Error loading archive stories:', error)
        if (!append) setStories([])
      } else {
        // Transform data to match ArchiveStory interface
        const transformedStories = (data || []).map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || article.excerpt || '',
          excerpt: article.excerpt,
          author: article.author || 'BLKOUTUK',
          published_date: article.published_at,
          original_url: article.source_url,
          category: article.category,
          tags: article.tags || [],
          migrated_from: 'blkoutuk.com' as const
        }))
        
        if (append) {
          setStories(prev => [...prev, ...transformedStories])
        } else {
          setStories(transformedStories)
        }
        
        setHasMore(transformedStories.length === ITEMS_PER_PAGE)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error loading archive stories:', error)
      if (!append) setStories([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreStories = () => {
    if (!loadingMore && hasMore) {
      loadArchiveStories(searchQuery, selectedCategory, currentPage + 1, true)
    }
  }

  useEffect(() => {
    loadArchiveStories(searchQuery, selectedCategory)
  }, [searchQuery, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadArchiveStories(searchQuery, selectedCategory)
  }

  return (
    <SharedLayout>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            📚 STORY ARCHIVE
          </h1>
          <h2 className="text-2xl mb-8 text-white font-bold uppercase tracking-wide">
            280+ ARTICLES FROM BLKOUTUK.COM (2016-2025)
          </h2>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 p-6 bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive stories..."
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="analysis">Analysis</option>
              <option value="commentary">Commentary</option>
              <option value="community">Community</option>
              <option value="politics">Politics</option>
              <option value="culture">Culture</option>
            </select>
            <button 
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-xl text-gray-400">
            Loading archive stories...
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-4 text-white">Archive Migration In Progress</h2>
            <p className="text-gray-400 mb-8">
              We're currently migrating stories from blkoutuk.com to the archive. 
              Check back soon for the complete collection.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400">
                Showing {stories.length} stories from the archive
              </p>
            </div>
            
            <div className="grid gap-6">
              {stories.map((story) => (
                <article key={story.id} className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {story.category && (
                        <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs rounded-full mb-2">
                          {story.category}
                        </span>
                      )}
                      <h2 className="text-2xl font-bold mb-2 text-white">{story.title}</h2>
                      <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <span>By {story.author}</span>
                        <span>•</span>
                        <span>{new Date(story.published_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Archived from blkoutuk.com</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-4">
                    {story.excerpt ? (
                      <p className="text-gray-300">{story.excerpt}</p>
                    ) : (
                      <p className="text-gray-300">
                        {story.content.substring(0, 300)}...
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {story.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/20 text-gray-300 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-4">
                      {story.original_url && (
                        <a 
                          href={story.original_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          Original Article →
                        </a>
                      )}
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Read Full Story →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreStories}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More Stories'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </SharedLayout>
  )
}

export default StoryArchivePage