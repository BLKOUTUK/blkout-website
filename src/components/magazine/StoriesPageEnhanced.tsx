'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, User, Clock, Heart, MessageCircle, ArrowRight, BookOpen, Sparkles, ChevronDown } from 'lucide-react'
import ArticleGrid from './ArticleGrid'
import ArticlePage from './ArticlePage'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// Content categories and real data
import { CONTENT_CATEGORIES, getCategoryIndicator } from '../../lib/constants'
import { liveStoryArchive } from '../../data/liveStoryArchive'

// Use real data from liveStoryArchive
const stories = liveStoryArchive.map(story => ({
  ...story,
  // Add missing fields for compatibility - removed fake engagement metrics
  image: story.category === 'Technology' ? '/images/squared/WELLDEF_SQUARED.png' :
         story.category === 'Community' ? '/images/squared/BlackSQUARED.png' :
         '/images/squared/BLKOUT25INV.png' // Placeholder images based on category
}))



// Stories Hero Section
const StoriesHero = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-8 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-indigo-300 text-lg font-mono uppercase tracking-widest mb-6"
        >
          STORY ARCHIVE
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black heading-block leading-none mb-8"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            AUTHENTIC
          </span>
          <br />
          <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            VOICES
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed font-light mb-12"
        >
          Discover powerful narratives, community analysis, and liberation stories 
          from Black queer voices across the UK.
        </motion.p>

        {/* Stories Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto"
        >
          {[
            { label: 'STORIES PUBLISHED', value: '247' },
            { label: 'COMMUNITY VOICES', value: '89' },
            { label: 'CATEGORIES COVERED', value: '5' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white heading-block mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-indigo-300 font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-indigo-300"
        >
          <span className="text-sm font-mono uppercase tracking-wider mb-2">EXPLORE</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// Enhanced Filter Bar
const FilterBar = ({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-indigo-900/30 backdrop-blur-sm border-y border-indigo-800/30 py-8"
  >
    <div className="max-w-6xl mx-auto px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm mr-2">
            FILTER:
          </span>
          <button
            onClick={() => onCategoryChange('All')}
            className={`px-4 py-2 font-bold text-sm transition-all heading-block uppercase ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-800/30 text-indigo-300 hover:bg-indigo-700/50 hover:text-white'
            }`}
          >
            ALL
          </button>
          {Object.entries(CONTENT_CATEGORIES).map(([category, { gradient }]) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 font-bold text-sm transition-all heading-block uppercase ${
                selectedCategory === category
                  ? `bg-gradient-to-r ${gradient} text-white`
                  : 'bg-indigo-800/30 text-indigo-300 hover:bg-indigo-700/50 hover:text-white'
              }`}
            >
              {category.replace(' ', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)

// Enhanced Article Card
const EnhancedArticleCard = ({ article, index }: { article: any, index: number }) => {
  const categoryData = CONTENT_CATEGORIES[article.category]
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 overflow-hidden hover:bg-indigo-900/40 transition-all duration-500 group cursor-pointer"
    >
      {article.image && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 bg-gradient-to-r ${categoryData.gradient} mr-4`}></div>
          <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
            {article.category}
          </span>
          <span className="mx-4 text-indigo-600">•</span>
          <span className="text-sm text-indigo-400">{article.publishedAt}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black heading-block mb-4 leading-tight">
          <span className={`bg-gradient-to-r ${categoryData.gradient} bg-clip-text text-transparent`}>
            {article.title}
          </span>
        </h2>
        
        <p className="text-indigo-100 mb-6 leading-relaxed font-light text-lg">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${categoryData.gradient} flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">
                  {article.author.avatar}
                </span>  
              </div>
              <div>
                <p className="font-bold text-white heading-block text-sm">
                  {article.author.name}
                </p>
                <div className="flex items-center text-xs text-indigo-400 space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-indigo-300">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{article.readTime} min read</span>
              </div>
            </div>
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center text-indigo-400 hover:text-white transition-colors font-bold heading-block uppercase text-sm"
            >
              READ
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function StoriesPageEnhanced() {
  const [currentView, setCurrentView] = useState<'grid' | 'article'>('grid')
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const handleBackToGrid = () => {
    setCurrentView('grid')
    setSelectedArticleId(null)
  }

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId)
    setCurrentView('article')
  }

  const filteredArticles = stories.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (currentView === 'article') {
    return <ArticlePage onBack={handleBackToGrid} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* Stories Hero */}
      <StoriesHero />
      
      {/* Filter Bar */}
      <FilterBar 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Stories Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black heading-block mb-4 uppercase"
            >
              <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
                {selectedCategory === 'All' ? 'ALL' : selectedCategory.toUpperCase()}
              </span>
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent ml-4">
                STORIES
              </span>
            </motion.h2>
            <p className="text-indigo-200 font-light text-lg">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'} found
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredArticles.map((article, index) => (
              <EnhancedArticleCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-white heading-block mb-4 uppercase">
                NO STORIES FOUND
              </h3>
              <p className="text-indigo-200 font-light">
                Try adjusting your search or category filter.
              </p>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Platform Footer */}
      <PlatformFooter />
    </div>
  )
}