// Story Archive Display Component
// Shows migrated articles from BLKOUTUK.com with original context preserved

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, Tag, ExternalLink, Archive, Clock, User, ArrowLeft } from 'lucide-react'
import { useArticles } from '../../hooks/useSupabase'
import type { NewsArticle } from '../../types/supabase'

interface ArchiveFilters {
  searchTerm: string
  category: string
  dateRange: 'all' | 'this_month' | 'last_3_months' | 'last_year' | 'custom'
  tags: string[]
  migrationSource: 'all' | 'blkoutuk' | 'community' | 'extension'
}

interface StoryArchiveProps {
  showMigrationContext?: boolean
}

export default function StoryArchive({ showMigrationContext = true }: StoryArchiveProps) {
  const [filters, setFilters] = useState<ArchiveFilters>({
    searchTerm: '',
    category: 'all',
    dateRange: 'all',
    tags: [],
    migrationSource: 'all'
  })
  
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch articles with filters
  const { articles, loading } = useArticles({
    status: 'published',
    limit: 100,
    ...(filters.category !== 'all' && { category: filters.category })
  })

  // Filter articles based on search and migration source
  const filteredArticles = articles.filter(article => {
    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matches = 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.author?.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      
      if (!matches) return false
    }

    // Migration source filter
    if (filters.migrationSource !== 'all') {
      if (filters.migrationSource === 'blkoutuk' && article.submitted_via !== 'blkoutuk-migration') return false
      if (filters.migrationSource === 'community' && article.submitted_via !== 'community-form') return false
      if (filters.migrationSource === 'extension' && article.submitted_via !== 'chrome-extension') return false
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const articleDate = new Date(article.published_at)
      const now = new Date()
      
      switch (filters.dateRange) {
        case 'this_month':
          if (articleDate.getMonth() !== now.getMonth() || articleDate.getFullYear() !== now.getFullYear()) return false
          break
        case 'last_3_months':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          if (articleDate < threeMonthsAgo) return false
          break
        case 'last_year':
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          if (articleDate < oneYearAgo) return false
          break
      }
    }

    return true
  })

  // Get unique categories and tags for filter options
  const availableCategories = [...new Set(articles.map(article => article.category))]
  const availableTags = [...new Set(articles.flatMap(article => article.tags))]

  const getMigrationBadge = (article: NewsArticle) => {
    if (!showMigrationContext) return null

    const badges = {
      'blkoutuk-migration': { label: 'BLKOUTUK Legacy', color: 'bg-purple-100 text-purple-800', icon: '🏛️' },
      'chrome-extension': { label: 'Community Report', color: 'bg-blue-100 text-blue-800', icon: '📰' },
      'community-form': { label: 'Community Story', color: 'bg-green-100 text-green-800', icon: '✍️' }
    }

    const badge = badges[article.submitted_via as keyof typeof badges]
    if (!badge) return null

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (selectedArticle) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-950"
      >
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive
          </button>

          <article className="bg-white rounded-lg shadow-xl overflow-hidden">
            {selectedArticle.featured_image && (
              <img
                src={selectedArticle.featured_image}
                alt=""
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                {getMigrationBadge(selectedArticle)}
                <span className="text-sm text-gray-500">
                  {formatDate(selectedArticle.published_at)}
                </span>
                {selectedArticle.source_url && (
                  <a
                    href={selectedArticle.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Original
                  </a>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedArticle.title}
              </h1>

              {selectedArticle.excerpt && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {selectedArticle.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedArticle.author}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {selectedArticle.category}
                </div>
              </div>

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />

              {selectedArticle.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Archive className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Story Archive</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our complete collection of community stories, including the preserved legacy of BLKOUTUK.com
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filter Stories</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories, authors, or tags..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                  ))}
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="all">All Time</option>
                  <option value="this_month">This Month</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="last_year">Last Year</option>
                </select>

                <select
                  value={filters.migrationSource}
                  onChange={(e) => setFilters(prev => ({ ...prev, migrationSource: e.target.value as any }))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="all">All Sources</option>
                  <option value="blkoutuk">BLKOUTUK Legacy</option>
                  <option value="community">Community Stories</option>
                  <option value="extension">Community Reports</option>
                </select>

                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {filteredArticles.length} stories found
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="text-gray-300 mt-4">Loading stories...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No stories found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedArticle(article)}
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              >
                {article.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {getMigrationBadge(article)}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.published_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{article.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}