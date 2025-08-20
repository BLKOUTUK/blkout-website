// Enhanced Newsroom Admin Dashboard with full Supabase integration
// Maintains BLKOUTNXT community values and democratic content management

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Newspaper, Plus, Edit3, Trash2, Eye, Users, Globe, 
  Clock, Filter, Search, CheckCircle, XCircle, AlertCircle,
  Download, Upload, Settings, BarChart3, TrendingUp, Heart,
  Wifi, WifiOff, RefreshCw, Save, ArrowLeft, ExternalLink,
  FileText, Image, Calendar, Tag
} from 'lucide-react'
import { useArticles, useCommunityStats, useFileUpload, useAuth } from '../../hooks/useSupabase'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import type { NewsArticle } from '../../types/supabase'

interface ArticleFormData {
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  image_url?: string
  read_time?: number
  priority: 'low' | 'medium' | 'high'
  source_url?: string
}

const initialFormData: ArticleFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'Community News',
  tags: [],
  featured: false,
  status: 'draft',
  priority: 'medium'
}

const articleCategories = [
  'Breaking News', 'Community News', 'Analysis', 'Policy Update',
  'International', 'Health & Wellness', 'Arts & Culture', 'Opinion',
  'Liberation Stories', 'Community Spotlight', 'Resources', 'Events'
]

const articleTags = [
  'Black QTIPOC', 'Liberation', 'Community', 'Activism', 'Health',
  'Education', 'Arts', 'Policy', 'International', 'UK News',
  'Mental Health', 'Housing', 'Employment', 'Healthcare', 'Legal'
]

const priorityLevels = [
  { value: 'low', label: 'Low Priority', color: 'text-gray-400' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-400' },
  { value: 'high', label: 'High Priority', color: 'text-red-400' }
]

export default function SupabaseNewsroomAdmin() {
  const { user, isAuthenticated } = useAuth()
  const { articles, loading, error, refetch, createArticle, updateArticle, deleteArticle } = useArticles()
  const { stats, loading: statsLoading } = useCommunityStats()
  const { uploadFile, uploading } = useFileUpload()
  
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'published_at' | 'created_at' | 'title'>('published_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return article.title.toLowerCase().includes(query) ||
               article.excerpt?.toLowerCase().includes(query) ||
               article.author.toLowerCase().includes(query)
      }
      return true
    })
    .filter(article => statusFilter === 'all' || article.status === statusFilter)
    .filter(article => categoryFilter === 'all' || article.category === categoryFilter)
    .sort((a, b) => {
      const aVal = a[sortBy] || ''
      const bVal = b[sortBy] || ''
      const comparison = aVal.localeCompare(bVal)
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Calculate read time based on content length
      const words = formData.content.split(/\s+/).length
      const readTime = Math.max(1, Math.ceil(words / 200)) // Average reading speed

      const articleData = {
        ...formData,
        read_time: readTime,
        published_at: formData.status === 'published' ? new Date().toISOString() : undefined,
        tags: Array.isArray(formData.tags) ? formData.tags : []
      }

      if (editingArticle) {
        await updateArticle(editingArticle.id, articleData)
      } else {
        await createArticle(articleData)
      }

      setFormData(initialFormData)
      setEditingArticle(null)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to save article:', error)
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      author: article.author,
      category: article.category,
      tags: article.tags || [],
      featured: article.featured,
      status: article.status,
      image_url: article.image_url || '',
      read_time: article.read_time || undefined,
      priority: article.priority,
      source_url: article.source_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (articleId: string) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await deleteArticle(articleId)
      } catch (error) {
        console.error('Failed to delete article:', error)
      }
    }
  }

  const handleBulkStatusUpdate = async (newStatus: NewsArticle['status']) => {
    try {
      await Promise.all(
        selectedArticles.map(id => {
          const article = articles.find(a => a.id === id)
          return article ? updateArticle(id, { status: newStatus }) : Promise.resolve()
        })
      )
      setSelectedArticles([])
    } catch (error) {
      console.error('Failed to update articles:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, 'articles')
      setFormData(prev => ({ ...prev, image_url: result.url }))
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const getStatusColor = (status: NewsArticle['status']) => {
    switch (status) {
      case 'published': return 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30'
      case 'draft': return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'archived': return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    return priorityLevels.find(p => p.value === priority)?.color || 'text-gray-400'
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-indigo-200">Please sign in to access the newsroom admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="indigo" text="Loading Newsroom Dashboard" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        {/* Header */}
        <div className="bg-indigo-900/50 backdrop-blur-sm border-b border-indigo-700/30">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white heading-block uppercase">
                    Community Newsroom Dashboard
                  </h1>
                  <p className="text-indigo-200 flex items-center mt-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Democratic media • Community-owned journalism
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Connection Status */}
                <div className="flex items-center space-x-2 text-sm">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Supabase Connected</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold hover:from-emerald-500 hover:to-indigo-500 transition-all heading-block uppercase flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Article
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Community Stats */}
          {!statsLoading && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">Total Articles</p>
                    <p className="text-3xl font-black text-white">{stats.articles?.total || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              
              <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-200 text-sm font-medium">Published</p>
                    <p className="text-3xl font-black text-white">{stats.articles?.published || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-medium">Categories</p>
                    <p className="text-3xl font-black text-white">
                      {Object.keys(stats.articles?.byCategory || {}).length}
                    </p>
                  </div>
                  <Tag className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-200 text-sm font-medium">Community Contributors</p>
                    <p className="text-3xl font-black text-white">{stats.community?.verifiedContacts || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-violet-400" />
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {articleCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as any)
                  setSortOrder(order as any)
                }}
                className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="published_at-desc">Recently Published</option>
                <option value="created_at-desc">Recently Created</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              
              <div className="flex gap-2">
                <button 
                  onClick={refetch}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedArticles.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 font-medium">
                    {selectedArticles.length} article(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate('published')}
                      className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-500"
                    >
                      Publish All
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('archived')}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Archive All
                    </button>
                    <button
                      onClick={() => setSelectedArticles([])}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Articles Table */}
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-lg overflow-hidden">
            {error && (
              <div className="p-4 bg-red-900/30 border-b border-red-700/30">
                <div className="flex items-center text-red-300">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-800/50">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedArticles(filteredArticles.map(article => article.id))
                          } else {
                            setSelectedArticles([])
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Article</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Published</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-700/30">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-indigo-800/20 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedArticles(prev => [...prev, article.id])
                            } else {
                              setSelectedArticles(prev => prev.filter(id => id !== article.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {article.image_url ? (
                              <img 
                                src={article.image_url} 
                                alt={article.title}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-white line-clamp-1">{article.title}</div>
                            <div className="text-sm text-indigo-200 line-clamp-1">{article.excerpt}</div>
                            <div className="flex items-center mt-1 space-x-2">
                              {article.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/30 text-yellow-400">
                                  Featured
                                </span>
                              )}
                              <span className={`text-xs ${getPriorityColor(article.priority)}`}>
                                {priorityLevels.find(p => p.value === article.priority)?.label}
                              </span>
                              {article.read_time && (
                                <span className="text-xs text-indigo-400">
                                  {article.read_time} min read
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{article.author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-indigo-200">{article.category}</div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-800/50 text-indigo-300">
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 2 && (
                              <span className="text-xs text-indigo-400">+{article.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Not published'}
                        </div>
                        <div className="text-xs text-indigo-300">
                          Created {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Edit article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {article.source_url && (
                            <a
                              href={article.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 transition-colors"
                              title="View source"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No articles found</h3>
                <p className="text-indigo-200">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'Create your first community article to get started.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Article Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-indigo-900 border border-indigo-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-white heading-block uppercase">
                      {editingArticle ? 'Edit Community Article' : 'Create Community Article'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setEditingArticle(null)
                        setFormData(initialFormData)
                      }}
                      className="text-indigo-400 hover:text-white transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Article Header */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Article Header
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Article Title</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Community Liberation Update: Breaking News..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Article Excerpt</label>
                        <textarea
                          required
                          value={formData.excerpt}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="A brief summary of the article that will appear in previews..."
                        />
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Article Content
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Full Article Content</label>
                        <textarea
                          required
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          rows={12}
                          className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Write your article content here... Support community journalism with thoughtful, liberation-focused reporting."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Author</label>
                          <input
                            type="text"
                            required
                            value={formData.author}
                            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="BLKOUT Community Team"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Source URL (if applicable)</label>
                          <input
                            type="url"
                            value={formData.source_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://original-source.com/article"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Article Categorization */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Categorization & Tags
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {articleCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Priority</label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {priorityLevels.map(level => (
                              <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Article Tags</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {articleTags.map(tag => (
                            <label key={tag} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.tags.includes(tag)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
                                  } else {
                                    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
                                  }
                                }}
                                className="mr-2 rounded"
                              />
                              <span className="text-indigo-200 text-sm">{tag}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Publication Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Publication Settings
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.featured}
                              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                              className="mr-2 rounded"
                            />
                            <span className="text-indigo-200">Featured Article</span>
                          </label>
                        </div>
                      </div>

                      {formData.image_url && (
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Featured Image URL</label>
                          <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-indigo-700">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false)
                          setEditingArticle(null)
                          setFormData(initialFormData)
                        }}
                        className="px-6 py-2 border border-indigo-600 text-indigo-200 rounded hover:bg-indigo-800/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded hover:from-emerald-500 hover:to-indigo-500 transition-all flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingArticle ? 'Update Article' : 'Create Article'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}