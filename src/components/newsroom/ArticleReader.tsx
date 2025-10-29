import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Calendar, User, Tag } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
)

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  source_url: string
  published_at: string
  created_at: string
  featured_image?: string
  moderation_reason?: string
}

export default function ArticleReader() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      loadArticle(slug)
    }
  }, [slug])

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📖 Loading article:', articleSlug)
      
      const { data, error: queryError } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', articleSlug)
        .single()
      
      if (queryError) {
        throw queryError
      }
      
      if (!data) {
        throw new Error('Article not found')
      }
      
      console.log('✅ Article loaded:', data.title)
      setArticle(data)
      
    } catch (err) {
      console.error('❌ Error loading article:', err)
      setError(err instanceof Error ? err.message : 'Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link 
            to="/newsroom/archive" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive
          </Link>
          
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Article Not Found</h1>
            <p className="text-red-300 mb-6">
              {error || 'The requested article could not be found.'}
            </p>
            <Link 
              to="/newsroom/archive"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Archive
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isBlkoutukArticle = article.source_url?.includes('blkoutuk.com')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <Link 
          to="/newsroom/archive" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </Link>
        
        {/* Article Header */}
        <article className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="p-8">
            {/* Legacy Badge */}
            {isBlkoutukArticle && (
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <span>🏛️</span>
                  BLKOUTUK Legacy Article
                </span>
                {article.source_url && (
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Original
                  </a>
                )}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.published_at || article.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>BLKOUTUK</span>
              </div>
              
              {article.moderation_reason && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs bg-blue-500/20 px-2 py-1 rounded">
                    {article.moderation_reason}
                  </span>
                </div>
              )}
            </div>
            
            {/* Excerpt */}
            {article.excerpt && (
              <div className="bg-white/10 rounded-lg p-6 mb-8">
                <p className="text-lg text-blue-100 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            )}
            
            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-200 prose-p:leading-relaxed
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
                prose-strong:text-white prose-em:text-blue-200
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-white/5 prose-blockquote:pl-6
                prose-ul:text-gray-200 prose-ol:text-gray-200
                prose-li:text-gray-200 prose-li:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
        
        {/* Back Navigation */}
        <div className="text-center mt-12">
          <Link 
            to="/newsroom/archive"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Browse More Articles
          </Link>
        </div>
      </div>
    </div>
  )
}