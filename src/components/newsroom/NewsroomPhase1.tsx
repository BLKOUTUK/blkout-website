import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Newspaper, Clock, ArrowRight, Globe, Plus, Archive, Loader, AlertCircle, Users } from 'lucide-react'
import { newsroomService } from '../../services/newsroomService'
import { moderationService } from '../../services/moderationService'
import StorySubmissionForm from './StorySubmissionForm'

interface Article {
  id: string
  title: string
  excerpt: string
  content?: string
  author: {
    name: string
    avatar?: string
  } | string
  publishedAt: string
  readTime: number
  category: string
  featured: boolean
  tags: string[]
  status: 'published' | 'breaking' | 'updated'
  source?: string
}

interface SubmissionStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

const NewsroomPhase1 = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [submissionStats, setSubmissionStats] = useState<SubmissionStats>({
    total: 0, pending: 0, approved: 0, rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNewsroomData()
    // Listen for Chrome extension messages
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.data.type === 'BLKOUT_STORY_SUBMISSION') {
        handleExtensionSubmission(event.data)
      }
    }
    window.addEventListener('message', handleExtensionMessage)
    return () => window.removeEventListener('message', handleExtensionMessage)
  }, [])

  const loadNewsroomData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Load published articles
      const articlesResponse = await newsroomService.getArticles({ 
        status: 'published',
        limit: 20 
      })
      
      if (articlesResponse.success && articlesResponse.data) {
        setArticles(articlesResponse.data.articles || [])
      }

      // Load submission statistics
      const queueResponse = await moderationService.getQueue({
        type: 'newsroom_article',
        limit: 100
      })
      
      if (queueResponse.success && queueResponse.data) {
        const items = queueResponse.data.items || []
        setSubmissionStats({
          total: items.length,
          pending: items.filter((item: any) => item.status === 'pending').length,
          approved: items.filter((item: any) => item.status === 'approved').length,
          rejected: items.filter((item: any) => item.status === 'rejected').length
        })
      }
    } catch (error) {
      console.error('Error loading newsroom data:', error)
      setError('Unable to load newsroom content. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleExtensionSubmission = async (data: any) => {
    try {
      await moderationService.submitForModeration({
        type: 'newsroom_article',
        title: data.title,
        content: data.content,
        author: data.author || 'Community Member',
        category: data.category || 'Community News',
        metadata: {
          source: 'chrome_extension',
          url: data.url
        }
      })
      // Refresh stats after submission
      loadNewsroomData()
    } catch (error) {
      console.error('Error handling extension submission:', error)
    }
  }

  const handleSubmissionSuccess = () => {
    // Refresh data after successful submission
    loadNewsroomData()
  }

  const categoryColors: Record<string, string> = {
    "Community Organizing": "bg-emerald-600 text-emerald-100",
    "Economic Justice": "bg-amber-600 text-amber-100",
    "Legal Victory": "bg-blue-600 text-blue-100",
    "Community News": "bg-purple-600 text-purple-100",
    "Technology": "bg-cyan-600 text-cyan-100",
    "Community": "bg-green-600 text-green-100"
  }

  const getAuthorName = (author: string | { name: string; avatar?: string }) => {
    return typeof author === 'string' ? author : author.name
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading community newsroom...</span>
        </div>
      </div>
    )
  }

  const featuredArticles = articles.filter(article => article.featured)
  const regularArticles = articles.filter(article => !article.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-6 mb-6">
            <img 
              src="/images/squared/BLKOUTiconWHITE.png"
              alt="BLKOUT"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none'
              }}
            />
            <h1 className="text-5xl font-black text-white uppercase tracking-wide">
              COMMUNITY <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">NEWSROOM</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stories from the liberation movement. Amplifying Black queer voices, culture, and community organizing victories across the UK.
          </p>
          
          {/* Story Submission Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Submit Story
            </button>
            <Link
              to="/newsroom/archive"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300"
            >
              <Archive className="w-5 h-5" />
              Story Archive
            </Link>
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg">
              <Archive className="w-5 h-5" />
              Submissions ({submissionStats.total})
            </div>
            {submissionStats.pending > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-600/20 text-orange-300 border border-orange-500/30 rounded-lg text-sm">
                <Clock className="w-4 h-4" />
                {submissionStats.pending} pending review
              </div>
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Stories</h2>
            <div className="space-y-8">
              {featuredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                  className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 rounded-2xl p-8 border border-blue-500/20"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[article.category] || 'bg-gray-600 text-gray-100'}`}>
                      {article.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-red-100">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {getAuthorName(article.author)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} min read
                      </span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Read Full Story
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Latest Stories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[article.category] || 'bg-gray-600 text-gray-100'}`}>
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {getAuthorName(article.author)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} min
                      </span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ) : !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Stories Published Yet</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Be the first to share your community story! Stories go through a moderation process before publication to ensure community safety and quality.
            </p>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Submit First Story
            </button>
          </motion.div>
        )}

        {/* Community Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/20 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Editorial Values</h2>
            <p className="text-gray-300 text-lg">Community-centered journalism for liberation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Globe className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Community First</h3>
              <p className="text-gray-300">Stories by and for our community, centering lived experiences</p>
            </div>
            <div className="text-center">
              <ArrowRight className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Action-Oriented</h3>
              <p className="text-gray-300">Journalism that builds power and supports organizing</p>
            </div>
            <div className="text-center">
              <Newspaper className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Truth-Telling</h3>
              <p className="text-gray-300">Honest reporting that challenges systems of oppression</p>
            </div>
          </div>
        </motion.div>

        {/* Back to Platform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-full transition-colors font-medium"
          >
            ← Back to Community Platform
          </Link>
        </motion.div>
      </div>

      {/* Story Submission Form */}
      <StorySubmissionForm
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        onSubmitSuccess={handleSubmissionSuccess}
      />
    </div>
  )
}

export default NewsroomPhase1