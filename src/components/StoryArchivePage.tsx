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
  const [selectedCategory, setSelectedCategory] = useState('all')

  const loadArchiveStories = async (query = '', category = 'all') => {
    try {
      setLoading(true)
      
      // Query for migrated articles from blkoutuk.com in news_articles table
      let supabaseQuery = supabase
        .from('news_articles')
        .select('*')
        .eq('submitted_via', 'blkoutuk-migration')
        .order('published_at', { ascending: false })

      if (category !== 'all') {
        supabaseQuery = supabaseQuery.eq('category', category)
      }

      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      }

      const { data, error } = await supabaseQuery
      
      if (error) {
        console.error('Error loading archive stories:', error)
        setStories([])
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
        setStories(transformedStories)
      }
    } catch (error) {
      console.error('Error loading archive stories:', error)
      setStories([])
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-4">📚 Story Archive</h1>
          <p className="text-xl text-gray-300 text-center mb-8">
            Complete archive of community stories and analysis from blkoutuk.com
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive stories..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
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
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center text-xl text-gray-400">
            Loading archive stories...
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-4">Archive Migration In Progress</h2>
            <p className="text-gray-400 mb-8">
              We're currently migrating stories from blkoutuk.com to the archive. 
              Check back soon for the complete collection of community stories and analysis.
            </p>
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">What's Coming:</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Historical community analysis</li>
                <li>• Editorial archive</li>
                <li>• Commentary pieces</li>
                <li>• Community stories</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="text-center mb-8">
              <p className="text-gray-400">
                Showing {stories.length} stories from the archive
              </p>
            </div>
            
            {stories.map((story) => (
              <article key={story.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {story.category && (
                      <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded mb-2">
                        {story.category}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
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
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
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
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center space-x-8">
            <a href="/newsroom" className="text-blue-400 hover:text-blue-300">
              📰 Current Newsroom
            </a>
            <a href="/events" className="text-green-400 hover:text-green-300">
              📅 Community Events
            </a>
            <a href="/" className="text-gray-400 hover:text-gray-300">
              ← Back to Platform
            </a>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            Story Archive contains migrated content from blkoutuk.com • 
            Newsroom features current community journalism
          </p>
        </div>
      </div>
    </div>
  )
}

export default StoryArchivePage