// Newsroom Admin Panel with Supabase CRUD Operations
// Allows admin users to manage articles, view stats, and moderate content

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit3, Trash2, Eye, EyeOff, AlertCircle, CheckCircle, 
  Clock, TrendingUp, Users, FileText, Search, Filter,
  Save, X, Upload, Link, Tag, Calendar, User
} from 'lucide-react'
import { newsroomService, type NewsArticle, type NewsroomStats } from '../../services/newsroomService'
import { supabaseHelpers } from '../../lib/supabase'

interface AdminPanelProps {
  onClose?: () => void
}

interface ArticleFormData {
  id?: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  featured: boolean
  tags: string[]
  image_url?: string
  source_url?: string
  status: 'draft' | 'published' | 'archived'
  priority: 'low' | 'medium' | 'high'
}

const CATEGORIES = [
  'Breaking News',
  'Analysis', 
  'Community News',
  'Policy Update',
  'International',
  'Health',
  'Education',
  'Arts & Culture',
  'Technology',
  'Sports'
]

const NewsroomAdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [stats, setStats] = useState<NewsroomStats & { connectionStatus: string }>({
    published: 0,
    draft: 0,
    total: 0,
    todayCount: 0,
    connectionStatus: 'disconnected'
  })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState({ supabase: false, legacy: false, primary: 'fallback' })

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Community News',
    featured: false,
    tags: [],
    status: 'draft',
    priority: 'medium'
  })

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await supabaseHelpers.getCurrentUser()
      setIsAuthenticated(!!user)
      
      if (!user) {
        console.warn('Admin panel requires authentication')
        return
      }

      await loadData()
    }

    checkAuth()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Get connection status
      const connStatus = newsroomService.getConnectionStatus()
      setConnectionStatus(connStatus)
      
      // Load articles and stats
      const [articlesResponse, statsResponse] = await Promise.all([
        newsroomService.getArticles({ 
          status: filterStatus === 'all' ? 'all' : filterStatus,
          limit: 50 
        }),
        newsroomService.getNewsroomStats()
      ])
      
      setArticles(articlesResponse.articles)
      setStats(statsResponse)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateArticle = async () => {
    if (!connectionStatus.supabase) {
      alert('Article creation requires Supabase connection')
      return
    }

    try {
      await newsroomService.createArticle({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        featured: formData.featured,
        tags: formData.tags,
        image_url: formData.image_url,
        source_url: formData.source_url,
        status: formData.status,
        priority: formData.priority
      })
      
      resetForm()
      await loadData()
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article')
    }
  }

  const handleUpdateArticle = async () => {
    if (!editingArticle || !connectionStatus.supabase) {
      alert('Article updates require Supabase connection')
      return
    }

    try {
      await newsroomService.updateArticle(editingArticle.id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        featured: formData.featured,
        tags: formData.tags,
        image_url: formData.image_url,
        source_url: formData.source_url,
        status: formData.status,
        priority: formData.priority
      })
      
      resetForm()
      await loadData()
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Failed to update article')
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!connectionStatus.supabase) {
      alert('Article deletion requires Supabase connection')
      return
    }

    if (!confirm('Are you sure you want to delete this article?')) {
      return
    }

    try {
      await newsroomService.deleteArticle(articleId)
      await loadData()
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      author: typeof article.author === 'string' ? article.author : article.author.name,
      category: article.category,
      featured: article.featured,
      tags: article.tags,
      image_url: article.imageUrl,
      source_url: article.externalUrl,
      status: article.status === 'breaking' ? 'published' : 'draft',
      priority: article.status === 'breaking' ? 'high' : 'medium'
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Community News',
      featured: false,
      tags: [],
      status: 'draft',
      priority: 'medium'
    })
    setEditingArticle(null)
    setShowForm(false)
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && article.status === 'published') ||
                         (filterStatus === 'draft' && article.status !== 'published')
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-2xl p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white text-center mb-4">Authentication Required</h2>
          <p className="text-indigo-200 text-center mb-6">
            Please sign in to access the newsroom admin panel.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black heading-block text-white mb-2 uppercase">
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Newsroom Admin
              </span>
            </h1>
            <p className="text-indigo-200">Manage articles, view analytics, and moderate content</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus.supabase ? 'bg-emerald-400' :
                  connectionStatus.legacy ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs text-indigo-200 uppercase">
                  {connectionStatus.primary} Connection
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Article
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-300 text-sm uppercase tracking-wider">Total Articles</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          
          <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm uppercase tracking-wider">Published</p>
                <p className="text-3xl font-bold text-white">{stats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm uppercase tracking-wider">Drafts</p>
                <p className="text-3xl font-bold text-white">{stats.draft}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-300 text-sm uppercase tracking-wider">Today</p>
                <p className="text-3xl font-bold text-white">{stats.todayCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Articles</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-indigo-200">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-indigo-200">No articles found</p>
            </div>
          ) : (
            <div className="divide-y divide-indigo-700/30">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-indigo-800/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{article.title}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          article.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' :
                          article.status === 'breaking' ? 'bg-red-500/20 text-red-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {article.status}
                        </span>
                        {article.featured && (
                          <span className="px-2 py-1 text-xs bg-violet-500/20 text-violet-300 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <p className="text-indigo-200 mb-3">{article.excerpt}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-indigo-300">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {typeof article.author === 'string' ? article.author : article.author.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          {article.category}
                        </div>
                      </div>
                      
                      {article.tags && article.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-indigo-600/30 text-indigo-200 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600/30 rounded-lg transition-colors"
                        title="Edit article"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-600/30 rounded-lg transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-indigo-900/90 backdrop-blur-sm border border-indigo-700/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    {editingArticle ? 'Edit Article' : 'Create New Article'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-indigo-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Article title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        placeholder="Brief description..."
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Author name"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">
                          Category
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        >
                          {CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">
                          Status
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">
                          Priority
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          value={formData.priority}
                          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High (Breaking)</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center text-indigo-200 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-400"
                            checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          />
                          Featured Article
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Content *
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        placeholder="Article content (Markdown supported)"
                        rows={8}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Source URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="https://example.com/source"
                        value={formData.source_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-indigo-800/30 border border-indigo-600/40 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Press Enter or comma to add tags"
                        onKeyDown={handleTagInput}
                      />
                      {formData.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 bg-indigo-600/30 text-indigo-200 rounded-full text-sm"
                            >
                              #{tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-indigo-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-indigo-700/30">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 text-indigo-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingArticle ? handleUpdateArticle : handleCreateArticle}
                    disabled={!formData.title || !formData.content || !formData.author}
                    className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingArticle ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NewsroomAdminPanel