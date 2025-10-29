'use client'

import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Calendar, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import { liveStoryArchive } from '../../data/liveStoryArchive'


export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create Supabase client
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
  )

  useEffect(() => {
    if (!slug) return

    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch article from Supabase
        const { data, error: queryError } = await supabase
          .from('legacy_articles')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .eq('status', 'published')
          .single()

        if (queryError) {
          throw queryError
        }

        if (!data) {
          throw new Error('Article not found')
        }

        // Transform data to match component expectations
        const transformedArticle = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || data.content?.substring(0, 200) || '',
          author: {
            name: 'BLKOUT Community',
            avatar: 'BC',
            bio: 'Stories from our community archive, preserving the voices and experiences of Black queer liberation.'
          },
          publishedAt: data.published_at || data.created_at,
          readTime: Math.ceil((data.content?.length || 0) / 1000) || 5,
          category: 'Community Story',
          tags: ['Archive', 'Community', 'BLKOUT'],
          featured_image: data.featured_image,
          source_url: data.source_url
        }

        setArticle(transformedArticle)
      } catch (err) {
        console.error('Error fetching article:', err)
        setError(err instanceof Error ? err.message : 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  // Extract images from HTML content
  const extractImagesFromContent = (htmlContent: string) => {
    if (!htmlContent) return []
    const imgRegex = /<img[^>]+src="([^">]+)"/g
    const images = []
    let match
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      images.push(match[1])
    }
    return images
  }

  // Clean HTML content for display
  const cleanHtmlContent = (htmlContent: string) => {
    if (!htmlContent) return ''
    
    // Remove WordPress classes and inline styles while preserving structure
    return htmlContent
      .replace(/class="[^"]*"/g, '')
      .replace(/style="[^"]*"/g, '')
      .replace(/data-[^=]*="[^"]*"/g, '')
      // Convert WordPress blocks to standard HTML
      .replace(/<figure[^>]*>/g, '<div>')
      .replace(/<\/figure>/g, '</div>')
      // Ensure videos and iframes are responsive
      .replace(/<iframe/g, '<iframe style="max-width: 100%; height: 400px;"')
      .replace(/<video/g, '<video style="max-width: 100%; height: auto;" controls')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-300 mb-8">{error || 'The requested article could not be found.'}</p>
          <Link
            to="/newsroom/archive"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive
          </Link>
        </div>
      </div>
    )
  }

  const contentImages = extractImagesFromContent(article.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 text-white">
      <PrimaryNavigationEnhanced />
      
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Back to Archive */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/newsroom/archive" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Story Archive
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          {/* Featured Image */}
          {(article.featured_image || contentImages.length > 0) && (
            <div className="aspect-video mb-8 overflow-hidden rounded-lg">
              <img
                src={article.featured_image || contentImages[0]}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Source Badge */}
          {article.source_url?.includes('blkoutuk.com') && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <span>🏛️</span>
                BLKOUTUK Legacy Archive
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
              {article.title}
            </span>
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 border-t border-gray-700 pt-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{article.readTime} min read</span>
            </div>
            {article.source_url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                <a 
                  href={article.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Original Source
                </a>
              </div>
            )}
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none mb-16"
        >
          <div 
            className="article-content text-gray-100 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ 
              __html: cleanHtmlContent(article.content)
            }}
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          />
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-lg mb-16"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center rounded-lg text-white font-bold text-xl">
              {article.author.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {article.author.name}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {article.author.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link
            to="/newsroom/archive"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Explore More Stories
          </Link>
        </motion.div>
      </article>

      <PlatformFooter />
      
      <style jsx>{`
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .article-content blockquote {
          border-left: 4px solid rgb(59, 130, 246);
          padding-left: 1.5rem;
          margin: 2rem 0;
          background: rgba(59, 130, 246, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 4px;
        }
        
        .article-content ul, .article-content ol {
          padding-left: 2rem;
          margin: 1.5rem 0;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content iframe {
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .article-content video {
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .article-content h1, .article-content h2, .article-content h3, .article-content h4 {
          color: white;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
        }
        
        .article-content h1 { font-size: 2rem; }
        .article-content h2 { font-size: 1.75rem; }
        .article-content h3 { font-size: 1.5rem; }
        .article-content h4 { font-size: 1.25rem; }
        
        .article-content a {
          color: rgb(96, 165, 250);
          text-decoration: underline;
        }
        
        .article-content a:hover {
          color: rgb(147, 197, 253);
        }
      `}</style>
    </div>
  )
}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/stories" 
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-bold font-display uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          {/* Featured Image */}
          <div className="aspect-video mb-8 overflow-hidden rounded-2xl">
            <img
              src={getImageByCategory(article.category, article.id)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 border border-emerald-400/30 rounded-full text-emerald-300 font-bold font-display uppercase text-sm tracking-widest">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-display uppercase mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
              {article.title}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-8 font-light leading-relaxed">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-white/60 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {article.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="text-white/90 leading-relaxed text-lg space-y-6">
            {article.content?.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-6">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Author Bio */}
        {article.author.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 p-8 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 backdrop-blur-sm border border-white/10 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center rounded-2xl text-white font-bold text-xl">
                {article.author.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display uppercase text-white mb-2">
                  {article.author.name}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Articles CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link
            to="/stories"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-violet-600 text-white font-bold font-display uppercase tracking-wide hover:from-emerald-500 hover:to-violet-500 transition-all duration-300 rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Explore More Stories
          </Link>
        </motion.div>
      </article>

      <PlatformFooter />
    </div>
  )
}