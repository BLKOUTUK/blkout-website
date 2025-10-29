import React, { useState, useEffect } from 'react'
import { supabase, NewsroomItem } from '../lib/supabase'
import SharedLayout from './layout/SharedLayout'

const NewsroomPage = () => {
  const [articles, setArticles] = useState<NewsroomItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const loadArticles = async (query = '') => {
    try {
      setLoading(true)
      
      // Query news_articles for community-curated content
      let newsQuery = supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (query) {
        newsQuery = newsQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      }

      const { data, error } = await newsQuery

      if (error) {
        console.error('Error loading articles:', error)
        setArticles([])
      } else {
        // Transform to NewsroomItem format
        const transformedArticles = (data || []).map(article => ({
          id: article.id,
          title: article.title,
          content: article.excerpt || article.content || '',
          author: article.author,
          published_at: article.published_at,
          source_url: article.source_url,
          tags: article.tags || [],
          category: article.category,
          status: article.status as 'published' | 'breaking' | 'updated'
        }))
        setArticles(transformedArticles)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadArticles(searchQuery)
  }

  return (
    <SharedLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            📰 Newsroom
          </h1>
          <h2 className="text-2xl mb-8 text-white font-bold uppercase tracking-wide">
            COMMUNITY-CURATED ARTICLES FROM EXTERNAL SOURCES
          </h2>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 max-w-3xl mx-auto mb-8">
            <p className="text-blue-200 text-sm">
              📰 <strong>Newsroom Purpose:</strong> Community-curated articles that link to external websites and sources. 
              For our complete historical archive from blkoutuk.com, visit <a href="/stories" className="text-blue-300 hover:text-blue-100 underline">Story Archive</a>.
            </p>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Articles */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center">
            <div className="text-xl">Loading articles...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center">
            <div className="text-xl text-gray-400">
              {searchQuery ? `No articles found for "${searchQuery}"` : 'No articles published yet'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{article.content}</p>
                  
                  <div className="text-sm text-gray-400 space-y-2">
                    {article.author && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">By:</span>
                        <span>{article.author}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Published:</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                    
                    {article.source_url && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Source:</span>
                        <a 
                          href={article.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 truncate"
                        >
                          View Original
                        </a>
                      </div>
                    )}
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Platform</a>
        </div>
      </div>
    </SharedLayout>
  )
}

export default NewsroomPage