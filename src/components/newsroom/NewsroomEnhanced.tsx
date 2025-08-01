'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Newspaper, Search, Filter, Calendar, Clock, User, 
  ArrowRight, ExternalLink, TrendingUp, Globe, 
  AlertCircle, CheckCircle, Loader, RefreshCw,
  BookOpen, FileText, Radio, Video
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// Content categories with masculine colors
const CONTENT_CATEGORIES = {
  'Breaking News': { 
    color: 'bg-red-600', 
    textColor: 'text-red-400',
    gradient: 'from-red-500 via-red-600 to-red-700',
    glowColor: 'shadow-red-500/25'
  },
  'Analysis': { 
    color: 'bg-indigo-600', 
    textColor: 'text-indigo-400',
    gradient: 'from-indigo-500 via-indigo-600 to-indigo-700',
    glowColor: 'shadow-indigo-500/25'
  },
  'Community News': { 
    color: 'bg-emerald-600', 
    textColor: 'text-emerald-400',
    gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
    glowColor: 'shadow-emerald-500/25'
  },
  'Policy Update': { 
    color: 'bg-slate-600', 
    textColor: 'text-slate-400',
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    glowColor: 'shadow-slate-500/25'
  },
  'International': { 
    color: 'bg-violet-600', 
    textColor: 'text-violet-400',
    gradient: 'from-violet-500 via-violet-600 to-violet-700',
    glowColor: 'shadow-violet-500/25'
  }
}

// Mock newsroom data
const mockArticles = [
  {
    id: '1',
    title: 'UK Government Announces New LGBTQ+ Rights Protections',
    excerpt: 'Historic legislation provides stronger workplace protections and healthcare access for QTIPOC+ communities across England and Wales.',
    category: 'Breaking News',
    source: 'BBC News',
    publishedAt: '2025-01-30T10:30:00Z',
    readTime: 4,
    author: 'BLKOUT News Team',
    isBreaking: true,
    image: '/images/squared/WELLDEF_SQUARED.png'
  },
  {
    id: '2',
    title: 'Manchester Black Pride 2025: Record Attendance Expected',
    excerpt: 'Community organizers report early registration numbers suggest this year\'s event will be the largest in the event\'s history.',
    category: 'Community News',
    source: 'Manchester Evening News',
    publishedAt: '2025-01-29T15:45:00Z',
    readTime: 3,
    author: 'Community Correspondent',
    isBreaking: false,
    image: '/images/squared/BlackSQUARED.png'
  },
  {
    id: '3',
    title: 'Housing Crisis Disproportionately Affects QTIPOC+ Youth',
    excerpt: 'New research reveals stark disparities in housing security and homelessness rates among Black queer young adults in major UK cities.',
    category: 'Analysis',
    source: 'Guardian Analysis',
    publishedAt: '2025-01-28T09:15:00Z',
    readTime: 8,
    author: 'Policy Research Team',
    isBreaking: false,
    image: '/images/squared/BLKOUT25INV.png'
  }
]

// Newsroom Hero Section
const NewsroomHero = ({ backendStatus }: { backendStatus: string }) => (
  <section className="relative py-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mr-6">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black heading-block uppercase">
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                BLKOUT
              </span>
              <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent ml-2">
                NEWSROOM
              </span>
            </h1>
            <p className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
              COMMUNITY NEWS & LIBERATION ANALYSIS
            </p>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-12"
        >
          Curated news, analysis, and community updates that matter to Black queer liberation. 
          Stay informed about policy changes, community events, and movement developments.
        </motion.p>

        {/* Backend Status */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center space-x-4 mb-12"
        >
          {backendStatus === 'checking' && (
            <div className="flex items-center space-x-3">
              <Loader className="w-5 h-5 text-indigo-400 animate-spin" />
              <span className="text-indigo-400 font-bold heading-block text-sm uppercase">
                CONNECTING TO NEWSROOM
              </span>
            </div>
          )}
          {backendStatus === 'connected' && (
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-bold heading-block text-sm uppercase">
                NEWSROOM LIVE
              </span>
              <span className="text-indigo-300 text-sm font-light">
                • Real-time updates active
              </span>
            </div>
          )}
          {backendStatus === 'offline' && (
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-bold heading-block text-sm uppercase">
                USING CACHED CONTENT
              </span>
              <span className="text-indigo-300 text-sm font-light">
                • Showing recent stories
              </span>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { label: 'STORIES TODAY', value: '12' },
            { label: 'SOURCES MONITORED', value: '47' },
            { label: 'COMMUNITY UPDATES', value: '8' }
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
    </div>
  </section>
)

// News Categories
const NewsCategories = ({ selectedCategory, onCategorySelect }: {
  selectedCategory: string
  onCategorySelect: (category: string) => void
}) => (
  <section className="py-16 bg-indigo-50/5 backdrop-blur-sm border-y border-indigo-800/30">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black heading-block mb-4 uppercase">
          <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
            NEWS
          </span>
          <span className="bg-gradient-to-r from-indigo-400 to-slate-400 bg-clip-text text-transparent ml-4">
            CATEGORIES
          </span>
        </h2>
        <p className="text-indigo-200 font-light text-lg">
          Stay informed across all areas that impact our community
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {['All', ...Object.keys(CONTENT_CATEGORIES)].map((category) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-bold text-sm transition-all duration-300 heading-block uppercase ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/50 hover:text-white border border-indigo-700/30'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  </section>
)

// News Articles Grid
const NewsArticlesGrid = ({ articles }: { articles: any[] }) => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-8">
      {articles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white heading-block mb-4 uppercase">
            NO ARTICLES AVAILABLE
          </h3>
          <p className="text-indigo-200 font-light mb-8">
            Newsroom backend is connecting. Articles will appear here as they are aggregated.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors heading-block uppercase flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-3" />
            REFRESH
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {articles.map((article, index) => {
            const categoryData = CONTENT_CATEGORIES[article.category] || CONTENT_CATEGORIES['Analysis']
            
            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 overflow-hidden hover:bg-indigo-900/40 transition-all duration-500 cursor-pointer group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Article Image */}
                  {article.image && (
                    <div className="lg:col-span-1 aspect-[4/3] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  
                  {/* Article Content */}
                  <div className={`${article.image ? 'lg:col-span-2' : 'lg:col-span-3'} p-8`}>
                    <div className="flex items-center mb-4">
                      {article.isBreaking && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold heading-block uppercase mr-4 animate-pulse">
                          BREAKING
                        </span>
                      )}
                      <div className={`w-3 h-3 bg-gradient-to-r ${categoryData.gradient} mr-3`}></div>
                      <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                        {article.category}
                      </span>
                      <span className="mx-3 text-indigo-600">•</span>
                      <span className="text-sm text-indigo-400">{article.source}</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black heading-block mb-4 leading-tight group-hover:text-white transition-colors">
                      <span className={`bg-gradient-to-r ${categoryData.gradient} bg-clip-text text-transparent group-hover:text-white`}>
                        {article.title}
                      </span>
                    </h2>
                    
                    <p className="text-indigo-100 mb-6 leading-relaxed font-light text-lg">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-indigo-300">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {article.readTime} min read
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center text-indigo-400 hover:text-white transition-colors font-bold heading-block uppercase text-sm"
                      >
                        READ FULL STORY
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </div>
  </section>
)

export default function NewsroomEnhanced() {
  const [articles, setArticles] = useState(mockArticles)
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  useEffect(() => {
    // Check if newsroom backend is running and fetch articles
    fetch('http://localhost:3001/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles)
        } else {
          // Keep mock articles if no real articles available
          setArticles(mockArticles)
        }
        setBackendStatus('connected')
      })
      .catch(() => {
        setBackendStatus('offline')
        setArticles(mockArticles) // Use mock data as fallback
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'All' || article.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* Newsroom Hero */}
      <NewsroomHero backendStatus={backendStatus} />
      
      {/* News Categories */}
      <NewsCategories 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {/* News Articles */}
      <NewsArticlesGrid articles={filteredArticles} />
      
      {/* Platform Footer */}
      <PlatformFooter />
    </div>
  )
}