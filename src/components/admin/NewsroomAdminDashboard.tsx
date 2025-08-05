'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Newspaper, Plus, Edit3, Trash2, Eye, Share2, Filter, Search,
  CheckCircle, XCircle, AlertCircle, Clock, TrendingUp, Users,
  Globe, Link2, Image, FileText, Video, Mic, Tag, Calendar
} from 'lucide-react'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'archived' | 'pending_review'
  category: string
  tags: string[]
  featured: boolean
  image?: string
  source?: string
  sourceUrl?: string
  submittedVia?: string
  views: number
  shares: number
  comments: number
  type: 'original' | 'curated' | 'community_response'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface ArticleFormData {
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string
  featured: boolean
  image: string
  source: string
  sourceUrl: string
  type: 'original' | 'curated' | 'community_response'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

const initialFormData: ArticleFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: 'Breaking News',
  tags: '',
  featured: false,
  image: '',
  source: '',
  sourceUrl: '',
  type: 'original',
  priority: 'medium'
}

const categories = [
  'Breaking News', 'Analysis', 'Community News', 'Policy Update', 
  'International', 'Local Events', 'Opinion', 'Investigation'
]

const contentTypes = [
  { value: 'original', label: 'Original Reporting', icon: FileText },
  { value: 'curated', label: 'Curated Content', icon: Link2 },
  { value: 'community_response', label: 'Community Response', icon: Users }
]

export default function NewsroomAdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Load articles from backend
  useEffect(() => {
    loadArticles()
  }, [])

  // Filter articles based on search and filters
  useEffect(() => {
    let filtered = articles

    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => article.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(article => article.type === typeFilter)
    }

    setFilteredArticles(filtered)
  }, [articles, searchQuery, statusFilter, categoryFilter, typeFilter])

  const loadArticles = async () => {
    try {
      const response = await fetch('https://newsroom-deploy.vercel.app/api/articles')
      const data = await response.json()
      if (data.success) {
        setArticles(data.articles)
      }
    } catch (error) {
      console.error('Failed to load articles:', error)
      // Use sample data for demo
      setArticles([
        {
          id: '1',
          title: 'UK Government Announces New LGBTQ+ Rights Protections',
          excerpt: 'Historic legislation provides stronger workplace protections and healthcare access for QTIPOC+ communities.',
          content: 'Full article content would go here...',
          author: 'BLKOUT News Team',
          publishedAt: '2025-01-30T10:30:00Z',
          updatedAt: '2025-01-30T10:30:00Z',
          status: 'published',
          category: 'Breaking News',
          tags: ['LGBTQ+', 'Policy', 'Rights'],
          featured: true,
          image: '/images/squared/WELLDEF_SQUARED.png',
          views: 1250,
          shares: 89,
          comments: 23,
          type: 'curated',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Community Response: Mental Health Resources Launch',
          excerpt: 'Local community members share their experiences with new peer support networks.',
          content: 'Community article content...',
          author: 'Community Correspondent',
          publishedAt: '2025-01-29T15:45:00Z',
          updatedAt: '2025-01-29T15:45:00Z',
          status: 'published',
          category: 'Community News',
          tags: ['Mental Health', 'Community', 'Resources'],
          featured: false,
          views: 876,
          shares: 34,
          comments: 12,
          type: 'community_response',
          priority: 'medium'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const articleData: Article = {
        ...formData,
        id: editingArticle?.id || `art_${Date.now()}`,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        publishedAt: editingArticle?.publishedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        views: editingArticle?.views || 0,
        shares: editingArticle?.shares || 0,
        comments: editingArticle?.comments || 0
      }

      if (editingArticle) {
        setArticles(prev => prev.map(article => 
          article.id === editingArticle.id ? { ...articleData, status: article.status } : article
        ))
      } else {
        setArticles(prev => [...prev, articleData])
      }

      setFormData(initialFormData)
      setEditingArticle(null)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to save article:', error)
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      tags: article.tags.join(', '),
      featured: article.featured,
      image: article.image || '',
      source: article.source || '',
      sourceUrl: article.sourceUrl || '',
      type: article.type,
      priority: article.priority
    })
    setShowForm(true)
  }

  const handleDelete = async (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(article => article.id !== articleId))
    }
  }

  const handleStatusChange = async (articleId: string, newStatus: Article['status']) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId ? { 
        ...article, 
        status: newStatus, 
        updatedAt: new Date().toISOString(),
        publishedAt: newStatus === 'published' ? new Date().toISOString() : article.publishedAt
      } : article
    ))
  }

  const getStatusColor = (status: Article['status']) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-900/20'
      case 'draft': return 'text-yellow-400 bg-yellow-900/20'
      case 'archived': return 'text-gray-400 bg-gray-900/20'
      case 'pending_review': return 'text-orange-400 bg-orange-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getPriorityColor = (priority: Article['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-900/20'
      case 'high': return 'text-orange-400 bg-orange-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'low': return 'text-blue-400 bg-blue-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getTypeIcon = (type: Article['type']) => {
    switch (type) {
      case 'original': return FileText
      case 'curated': return Link2
      case 'community_response': return Users
      default: return FileText
    }
  }

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    pending: articles.filter(a => a.status === 'pending_review').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    totalShares: articles.reduce((sum, a) => sum + a.shares, 0)
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
              <p className="text-indigo-200 mt-2">Manage articles, news, and community content</p>
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
                <p className="text-2xl font-black text-white">{stats.drafts}</p>
              </div>
              <Edit3 className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-orange-900/30 backdrop-blur-sm border border-orange-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Pending</p>
                <p className="text-2xl font-black text-white">{stats.pending}</p>
              </div>
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-200 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-black text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          
          <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Total Shares</p>
                <p className="text-2xl font-black text-white">{stats.totalShares}</p>
              </div>
              <Share2 className="w-6 h-6 text-emerald-400" />
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
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="original">Original</option>
              <option value="curated">Curated</option>
              <option value="community_response">Community Response</option>
            </select>
            
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
                        <div className="text-sm text-white">{article.author}</div>
                        <div className="text-sm text-indigo-200">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <TypeIcon className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-indigo-200 capitalize">
                            {article.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {article.submittedVia === 'chrome-extension' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400">📤 Extension</span>
                              {article.sourceUrl && (
                                <a 
                                  href={article.sourceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-indigo-300 hover:text-indigo-200 truncate max-w-20"
                                  title={article.sourceUrl}
                                >
                                  {new URL(article.sourceUrl).hostname}
                                </a>
                              )}
                            </div>
                          ) : article.submittedVia === 'bulk-test' ? (
                            <span className="text-yellow-400">🧪 Bulk Test</span>
                          ) : (
                            <span className="text-indigo-300">✍️ Manual</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-indigo-400 mr-1" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <Share2 className="w-4 h-4 text-indigo-400 mr-1" />
                            {article.shares}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(article.priority)}`}>
                          {article.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={article.status}
                          onChange={(e) => handleStatusChange(article.id, e.target.value as Article['status'])}
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
                        value={formData.sourceUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
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
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
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