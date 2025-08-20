// Enhanced Newsroom Admin Component with Supabase CRUD Operations
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit3, Trash2, Eye, Save, X, AlertCircle, CheckCircle,
  FileText, Calendar, User, Tags, Image as ImageIcon,
  Filter, Search, RefreshCw, Upload, ExternalLink
} from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import type { 
  ApiArticle, 
  CreateArticleRequest, 
  UpdateArticleRequest,
  ArticleQuery,
  LoadingState
} from '../../types/api'
import LoadingSpinner from '../common/LoadingSpinner'

interface AdminArticle extends ApiArticle {
  isEditing?: boolean
  isNew?: boolean
}

const NewsroomAdminEnhanced: React.FC = () => {
  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loading: true,
    error: null,
    success: false
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Categories matching the API schema
  const categories = [
    'community', 'politics', 'culture', 'health', 
    'education', 'business', 'technology'
  ]

  // Load articles
  const loadArticles = async () => {
    setLoadingState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const query: ArticleQuery = {
        limit: 50,
        sort: 'updated_at',
        order: 'desc'
      }

      if (selectedCategory !== 'all') {
        query.category = selectedCategory
      }

      if (selectedStatus !== 'all') {
        query.status = selectedStatus as any
      }

      if (searchTerm) {
        query.search = searchTerm
      }

      const response = await apiClient.getArticles(query)
      
      if (response.success && response.data) {
        setArticles(response.data.map(article => ({ ...article, isEditing: false, isNew: false })))
        setLoadingState({ loading: false, error: null, success: true })
      } else {
        throw new Error(response.error || 'Failed to load articles')
      }
    } catch (error) {
      setLoadingState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load articles',
        success: false
      })
    }
  }

  useEffect(() => {
    loadArticles()
  }, [selectedCategory, selectedStatus, searchTerm])

  // Create article
  const createArticle = async (data: CreateArticleRequest) => {
    try {
      const response = await apiClient.createArticle(data)
      
      if (response.success && response.data) {
        setArticles(prev => [{ ...response.data, isEditing: false, isNew: true }, ...prev])
        setShowCreateForm(false)
        return true
      } else {
        throw new Error(response.error || 'Failed to create article')
      }
    } catch (error) {
      console.error('Create article error:', error)
      return false
    }
  }

  // Update article
  const updateArticle = async (id: string, data: UpdateArticleRequest) => {
    try {
      const response = await apiClient.updateArticle(id, data)
      
      if (response.success && response.data) {
        setArticles(prev => prev.map(article => 
          article.id === id 
            ? { ...response.data, isEditing: false, isNew: false }
            : article
        ))
        return true
      } else {
        throw new Error(response.error || 'Failed to update article')
      }
    } catch (error) {
      console.error('Update article error:', error)
      return false
    }
  }

  // Delete article
  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await apiClient.deleteArticle(id)
      
      if (response.success) {
        setArticles(prev => prev.filter(article => article.id !== id))
        return true
      } else {
        throw new Error(response.error || 'Failed to delete article')
      }
    } catch (error) {
      console.error('Delete article error:', error)
      return false
    }
  }

  // Toggle editing mode
  const toggleEdit = (id: string) => {
    setArticles(prev => prev.map(article =>
      article.id === id
        ? { ...article, isEditing: !article.isEditing }
        : article
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Newsroom Admin
              </h1>
              <p className="text-indigo-300">Manage articles and community news</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Article</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft" className="bg-slate-800">Draft</option>
              <option value="published" className="bg-slate-800">Published</option>
              <option value="archived" className="bg-slate-800">Archived</option>
            </select>

            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadArticles}
              disabled={loadingState.loading}
              className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loadingState.loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loadingState.loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="xl" color="indigo" text="Loading articles..." />
          </div>
        )}

        {/* Error State */}
        {loadingState.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-red-400 font-semibold">Error Loading Articles</h3>
                <p className="text-red-300">{loadingState.error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles List */}
        {!loadingState.loading && !loadingState.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Articles Found</h3>
                <p className="text-indigo-300">Try adjusting your filters or create a new article.</p>
              </div>
            ) : (
              articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onEdit={toggleEdit}
                  onUpdate={updateArticle}
                  onDelete={deleteArticle}
                  categories={categories}
                />
              ))
            )}
          </motion.div>
        )}

        {/* Create Article Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <CreateArticleModal
              onClose={() => setShowCreateForm(false)}
              onCreate={createArticle}
              categories={categories}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Article Card Component
const ArticleCard: React.FC<{
  article: AdminArticle
  onEdit: (id: string) => void
  onUpdate: (id: string, data: UpdateArticleRequest) => Promise<boolean>
  onDelete: (id: string) => Promise<boolean>
  categories: string[]
}> = ({ article, onEdit, onUpdate, onDelete, categories }) => {
  const [editData, setEditData] = useState<UpdateArticleRequest>({
    title: article.title,
    content: article.content || '',
    excerpt: article.excerpt || '',
    category: article.category,
    tags: article.tags,
    status: article.status,
    featured_image: article.featured_image || ''
  })
  const [updating, setUpdating] = useState(false)

  const handleSave = async () => {
    setUpdating(true)
    const success = await onUpdate(article.id, editData)
    if (success) {
      onEdit(article.id) // Exit edit mode
    }
    setUpdating(false)
  }

  const handleCancel = () => {
    setEditData({
      title: article.title,
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category,
      tags: article.tags,
      status: article.status,
      featured_image: article.featured_image || ''
    })
    onEdit(article.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 ${
        article.isNew ? 'ring-2 ring-emerald-500/50' : ''
      }`}
    >
      {article.isEditing ? (
        // Edit Mode
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Category</label>
              <select
                value={editData.category}
                onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={editData.excerpt}
              onChange={(e) => setEditData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-medium mb-2">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Status</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="draft" className="bg-slate-800">Draft</option>
                <option value="published" className="bg-slate-800">Published</option>
                <option value="archived" className="bg-slate-800">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Featured Image URL</label>
              <input
                type="url"
                value={editData.featured_image}
                onChange={(e) => setEditData(prev => ({ ...prev, featured_image: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-indigo-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={updating}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {updating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{updating ? 'Saving...' : 'Save'}</span>
            </motion.button>
          </div>
        </div>
      ) : (
        // View Mode
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
              <p className="text-indigo-300 mb-3">{article.excerpt}</p>
              
              <div className="flex items-center space-x-4 text-sm text-indigo-400">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {article.profiles?.full_name || 'Unknown Author'}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(article.updated_at).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                  article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(article.id)}
                className="p-2 text-indigo-400 hover:text-white transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(article.id)}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Create Article Modal Component
const CreateArticleModal: React.FC<{
  onClose: () => void
  onCreate: (data: CreateArticleRequest) => Promise<boolean>
  categories: string[]
}> = ({ onClose, onCreate, categories }) => {
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    content: '',
    excerpt: '',
    category: categories[0],
    tags: [],
    status: 'draft'
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    
    const success = await onCreate(formData)
    if (success) {
      onClose()
    }
    
    setCreating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Article</h2>
          <button
            onClick={onClose}
            className="p-2 text-indigo-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-indigo-300 text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-indigo-300 text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="draft" className="bg-slate-800">Draft</option>
                <option value="published" className="bg-slate-800">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              placeholder="Brief description of the article..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-medium mb-2">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              placeholder="Write your article content here..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-indigo-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={creating}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {creating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{creating ? 'Creating...' : 'Create Article'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default NewsroomAdminEnhanced