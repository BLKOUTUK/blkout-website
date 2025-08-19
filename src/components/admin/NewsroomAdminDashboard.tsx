'use client'

import React, { useState } from 'react'
import ProtectedAdminRoute from '../auth/ProtectedAdminRoute'
import { showSuccess, showError } from '../../utils/notifications'
import { motion } from 'framer-motion'
import { 
  Newspaper, Plus, Edit3, Trash2, Eye, Share2, Filter, Search,
  CheckCircle, XCircle, AlertCircle, Clock, TrendingUp, Users,
  Globe, Link2, Image, FileText, Video, Mic, Tag, Calendar, Wifi, WifiOff, Database
} from 'lucide-react'
import { useArticles } from '../../hooks/useSupabase'
import type { NewsArticle } from '../../types/supabase'

// Using NewsArticle type from service

interface ArticleFormData {
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string
  featured: boolean
  imageUrl: string
  source: string
  externalUrl: string
  type: string
  priority: string
}

const initialFormData: ArticleFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'community',
  tags: '',
  featured: false,
  imageUrl: '',
  source: '',
  externalUrl: '',
  type: 'original',
  priority: 'medium'
}

const categories = [
  'community', 'politics', 'culture', 'health', 
  'education', 'business', 'technology'
]

const contentTypes = [
  { value: 'original', label: 'Original Reporting', icon: FileText },
  { value: 'curated', label: 'Curated Content', icon: Link2 },
  { value: 'community_response', label: 'Community Response', icon: Users }
]

function NewsroomAdminDashboardContent() {
  const { articles, loading, error, refetch: refreshArticles, createArticle, updateArticle, deleteArticle } = useArticles()
  
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Filter articles based on search and filters
  React.useEffect(() => {
    let filtered = articles

    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getAuthorName(article.author).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => article.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter)
    }

    setFilteredArticles(filtered)
  }, [articles, searchQuery, statusFilter, categoryFilter])

  // Articles are now loaded via the useNewsroom hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        featured: formData.featured,
        image_url: formData.imageUrl,
        source_url: formData.externalUrl,
        type: formData.type,
        priority: formData.priority,
        status: editingArticle?.status || 'draft'
      }

      if (editingArticle) {
        // Update existing article
        await updateArticle(editingArticle.id, articleData)
        showSuccess('Article Updated', 'Article updated successfully!')
      } else {
        // Create new article
        await createArticle(articleData)
        showSuccess('Article Created', 'Article created successfully!')
      }
      
      setFormData(initialFormData)
      setEditingArticle(null)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to save article:', error)
      showError('Save Failed', 'Failed to save article. Please try again.')
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || '',
      author: getAuthorName(article.author),
      category: article.category,
      tags: (article.tags || []).join(', '),
      featured: article.featured || false,
      imageUrl: article.image_url || '',
      source: article.source || '',
      externalUrl: article.source_url || '',
      type: article.type || 'original',
      priority: article.priority || 'medium'
    })
    setShowForm(true)
  }

  const handleDelete = async (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(articleId)
        showSuccess('Article Deleted', 'Article deleted successfully!')
      } catch (error) {
        console.error('Failed to delete article:', error)
        showError('Delete Failed', 'Failed to delete article. Please try again.')
      }
    }
  }

  const handleStatusChange = async (articleId: string, newStatus: NewsArticle['status']) => {
    try {
      await updateArticle(articleId, {
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : undefined
      })

      showSuccess(`Article ${newStatus}`, `Article ${newStatus} successfully!`)
    } catch (error) {
      console.error('Failed to update article status:', error)
      showError('Update Failed', 'Failed to update article status. Please try again.')
    }
  }

  const getStatusColor = (status: NewsArticle['status']) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-900/20'
      case 'draft': return 'text-yellow-400 bg-yellow-900/20'
      case 'archived': return 'text-gray-400 bg-gray-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getAuthorName = (author: NewsArticle['author']) => {
    return typeof author === 'string' ? author : author.name
  }

  const getConnectionIcon = () => {
    return <Database className="w-4 h-4 text-green-400" />
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'original': return FileText
      case 'curated': return Link2
      case 'community_response': return Users
      default: return FileText
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-900/20'
      case 'high': return 'text-orange-400 bg-orange-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'low': return 'text-green-400 bg-green-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  // Calculate stats from articles
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    todayCount: articles.filter(a => {
      const today = new Date().toISOString().split('T')[0]
      const articleDate = new Date(a.published_at || a.created_at).toISOString().split('T')[0]
      return articleDate === today
    }).length,
    connectionStatus: 'supabase'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-200">Loading Newsroom Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="bg-indigo-900/50 backdrop-blur-sm border-b border-indigo-700/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white heading-block uppercase">
                Newsroom Admin Dashboard
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-indigo-200">Manage articles, news, and community content</p>
                <div className="flex items-center gap-2 text-sm">
                  {getConnectionIcon()}
                  <span className="text-indigo-300">
                    Connected to Supabase
                    {error && <span className="text-red-400 ml-2">• {error}</span>}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold hover:from-emerald-500 hover:to-indigo-500 transition-all heading-block uppercase flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Article
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Total Articles</p>
                <p className="text-2xl font-black text-white">{stats.total}</p>
              </div>
              <Newspaper className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          
          <div className="bg-green-900/30 backdrop-blur-sm border border-green-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Published</p>
                <p className="text-2xl font-black text-white">{stats.published}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          
          <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Drafts</p>
                <p className="text-2xl font-black text-white">{stats.draft}</p>
              </div>
              <Edit3 className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-200 text-sm font-medium">Today's Articles</p>
                <p className="text-2xl font-black text-white">{stats.todayCount}</p>
              </div>
              <Calendar className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          
          <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Data Source</p>
                <p className="text-lg font-black text-white capitalize">{stats.connectionStatus}</p>
              </div>
              {getConnectionIcon()}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
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
              <option value="pending_review">Pending Review</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button 
              onClick={refreshArticles}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors flex items-center"
              disabled={loading}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Article</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-700/30">
                {filteredArticles.map((article) => {
                  const TypeIcon = getTypeIcon(article.type)
                  
                  return (
                    <tr key={article.id} className="hover:bg-indigo-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center">
                              <Newspaper className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-white line-clamp-2">{article.title}</div>
                            <div className="text-sm text-indigo-200 mt-1">{article.category}</div>
                            <div className="flex items-center mt-2">
                              {article.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/30 text-yellow-400 mr-2">
                                  Featured
                                </span>
                              )}
                              <div className="flex space-x-1">
                                {article.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-800/30 text-indigo-200">
                                    {tag}
                                  </span>
                                ))}
                                {article.tags.length > 2 && (
                                  <span className="text-xs text-indigo-400">+{article.tags.length - 2}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{getAuthorName(article.author)}</div>
                        <div className="text-sm text-indigo-200">
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <TypeIcon className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-indigo-200 capitalize">
                            {(article.type || 'original').replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {article.source_url ? (
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400">🔗 External</span>
                              <a 
                                href={article.source_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-300 hover:text-indigo-200 truncate max-w-20"
                                title={article.source_url}
                              >
                                {new URL(article.source_url).hostname}
                              </a>
                            </div>
                          ) : (
                            <span className="text-indigo-300">✍️ Original</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-indigo-400 mr-1" />
                            {article.views || 0}
                          </div>
                          <div className="flex items-center">
                            <Share2 className="w-4 h-4 text-indigo-400 mr-1" />
                            {article.shares || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(article.priority || 'medium')}`}>
                          {(article.priority || 'medium').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={article.status}
                          onChange={(e) => handleStatusChange(article.id, e.target.value as NewsArticle['status'])}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(article.status)}`}
                        >
                          <option value="draft">Draft</option>
                          <option value="pending_review">Pending Review</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No articles found</h3>
              <p className="text-indigo-200">Create your first article to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-indigo-900 border border-indigo-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white heading-block uppercase">
                  {editingArticle ? 'Edit Article' : 'Create New Article'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Article Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter article title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Content Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Excerpt</label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief excerpt or summary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Full article content"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Author</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Article author"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'curated' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">Source</label>
                      <input
                        type="text"
                        value={formData.source}
                        onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                        className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Original source name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">Source URL</label>
                      <input
                        type="url"
                        value={formData.externalUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                        className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="policy, rights, community"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Featured Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-indigo-200">Featured Article</label>
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
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded hover:from-emerald-500 hover:to-indigo-500 transition-all"
                  >
                    {editingArticle ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NewsroomAdminDashboard() {
  return (
    <ProtectedAdminRoute requiredRole="moderator" title="Newsroom Admin Dashboard">
      <NewsroomAdminDashboardContent />
    </ProtectedAdminRoute>
  )
}