'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, MessageCircle, ArrowRight, Clock, User, Play, Star, TrendingUp, Heart, Share2, BookOpen, Sparkles, Target, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArticleGrid from './ArticleGrid'
import PrimaryNavigation from '../layout/PrimaryNavigation'
import { CONTENT_CATEGORIES, getCategoryIndicator } from '../../lib/constants'
import { liveStoryArchive } from '../../data/liveStoryArchive'

// Import liveStoryArchive types
type StoryArchiveItem = typeof liveStoryArchive[0]

// Enhanced article card for recent stories
const EnhancedArticleCard = ({ article }: { article: StoryArchiveItem }) => {
  const categoryData = getCategoryIndicator(article.category)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-center mb-3">
        <div className={`w-3 h-3 rounded-full ${categoryData.color} mr-3`}></div>
        <span className={`text-sm font-semibold ${categoryData.textColor}`}>
          {article.category}
        </span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-sm text-gray-500">{article.publishedAt}</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 ${categoryData.color} rounded-full flex items-center justify-center`}>
            <span className="text-white text-xs font-medium">
              {article.author.avatar}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {article.author.name}
            </p>
            <p className="text-xs text-gray-500">
              {article.readTime} min read
            </p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          className={`px-4 py-2 ${categoryData.color} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all flex items-center`}
        >
          Read
          <ArrowRight className="w-3 h-3 ml-1" />
        </motion.button>
      </div>
    </motion.div>
  )
}


// Enhanced widgets with sophisticated styling
const EventsWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Upcoming Events</h3>
          <p className="text-sm text-gray-600">Community gatherings & activities</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { title: 'Community Healing Circle', date: 'Feb 2', time: '7:00 PM', attendees: 23 },
          { title: 'Digital Rights Workshop', date: 'Feb 5', time: '6:30 PM', attendees: 45 },
          { title: 'Black Joy Celebration', date: 'Feb 8', time: '3:00 PM', attendees: 67 }
        ].map((event, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02, x: 4 }}
            className="flex justify-between items-start p-3 rounded-xl hover:bg-white/60 transition-all cursor-pointer group"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-blkout-primary transition-colors">{event.title}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                <span>{event.time}</span>
                <span>•</span>
                <span className="text-green-600">{event.attendees} attending</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">{event.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
      >
        <span className="flex items-center justify-center">
          View All Events
          <ArrowRight className="w-4 h-4 ml-2" />
        </span>
      </motion.button>
    </div>
  </motion.div>
)

const IVORWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="relative bg-gradient-to-br from-blue-50 to-indigo-100/80 rounded-2xl border border-blue-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">I.V.O.R. Resources</h3>
          <p className="text-sm text-blue-700">AI-powered community support</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <p className="text-gray-700 mb-6 leading-relaxed">
        Get personalized support and community resources tailored to your needs through our AI assistant.
      </p>
      
      <div className="space-y-3 mb-6">
        {[
          { label: 'Mental Health Support', color: 'bg-green-500', count: '47 resources' },
          { label: 'Housing Resources', color: 'bg-orange-500', count: '23 resources' },
          { label: 'Legal Assistance', color: 'bg-purple-500', count: '15 resources' }
        ].map((item, index) => (
          <motion.div 
            key={index}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-all cursor-pointer"
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
            <span className="text-xs text-gray-500">{item.count}</span>
          </motion.div>
        ))}
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
      >
        <span className="flex items-center justify-center">
          <Target className="w-4 h-4 mr-2" />
          Get Help Now
        </span>
      </motion.button>
    </div>
  </motion.div>
)

const CommunityActivityWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="relative bg-gradient-to-br from-white to-emerald-50/80 rounded-2xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-2xl"></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Community Pulse</h3>
          <p className="text-sm text-gray-600">Real-time engagement</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {[
          { label: 'Active discussions', value: '127', trend: '+12', icon: MessageCircle, color: 'text-blkout-primary' },
          { label: 'New members this week', value: '23', trend: '+5', icon: Users, color: 'text-green-600' },
          { label: 'Stories shared', value: '45', trend: '+8', icon: BookOpen, color: 'text-purple-600' }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-all"
          >
            <div className="flex items-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mr-3`} />
              <span className="text-gray-700">{stat.label}</span>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-emerald-600 ml-2">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/60">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-orange-600 mr-2" />
          <p className="text-sm text-orange-800 font-medium">
            💡 HUB members discovered 7 new resources this week
          </p>
        </div>
      </div>
    </div>
  </motion.div>
)

const MembershipWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="relative bg-gradient-to-br from-blkout-primary/5 to-blkout-warm/10 rounded-2xl border border-blkout-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blkout-primary/20 to-blkout-warm/20 rounded-full -translate-y-12 translate-x-12"></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Join the Discussion</h3>
          <p className="text-sm text-blkout-primary">Connect with community</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blkout-primary to-blkout-warm rounded-xl flex items-center justify-center shadow-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <p className="text-gray-700 mb-6 leading-relaxed">
        Connect with Black queer men building liberation together through authentic community spaces.
      </p>
      
      <div className="space-y-3 mb-6">
        {[
          { icon: MessageCircle, label: 'Private community spaces', color: 'text-blkout-primary' },
          { icon: Users, label: 'Peer support networks', color: 'text-blkout-primary' },
          { icon: Star, label: 'Exclusive member content', color: 'text-blkout-primary' }
        ].map((item, index) => (
          <motion.div 
            key={index}
            whileHover={{ x: 4 }}
            className="flex items-center p-2 rounded-lg hover:bg-white/60 transition-all"
          >
            <item.icon className={`w-5 h-5 ${item.color} mr-3`} />
            <span className="text-gray-700">{item.label}</span>
          </motion.div>
        ))}
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-gradient-to-r from-blkout-primary to-blkout-warm text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
      >
        <span className="flex items-center justify-center">
          Request Access
          <ArrowRight className="w-4 h-4 ml-2" />
        </span>
      </motion.button>
    </div>
  </motion.div>
)

const ContentCategoryKey = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-gray-900 mb-6">Content Types</h3>
    <div className="space-y-4">
      {Object.entries(CONTENT_CATEGORIES).map(([category, { gradient, glowColor }]) => (
        <motion.div 
          key={category}
          whileHover={{ scale: 1.02, x: 4 }}
          className="flex items-center p-3 rounded-lg hover:bg-white/80 transition-all cursor-pointer group"
        >
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradient} mr-4 shadow-lg ${glowColor} group-hover:shadow-xl transition-all`}></div>
          <span className="text-gray-700 group-hover:text-gray-900 font-medium transition-colors">{category}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

// Enhanced featured article component
const FeaturedArticleCard = ({ article }: { article: StoryArchiveItem }) => {
  const categoryData = getCategoryIndicator(article.category)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60 hover:shadow-3xl transition-all duration-500 group"
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryData.gradient} opacity-5`}></div>
      
      {/* Featured badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${categoryData.gradient} mr-2`}></div>
          <span className="text-sm font-semibold text-gray-700">Featured Story</span>
        </div>
      </div>
      
      {/* Image section */}
      {article.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}
      
      {/* Content section */}
      <div className="relative p-8">
        {/* Category and meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryData.gradient} mr-3 shadow-lg`}></div>
            <span className={`text-sm font-semibold ${categoryData.textColor}`}>
              {article.category}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {article.likes}
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {article.comments}
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors">
          {article.title}
        </h1>
        
        {/* Excerpt */}
        <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${categoryData.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                <categoryData.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{article.author}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to={`/article/${article.id}`}
              className={`px-6 py-3 bg-gradient-to-r ${categoryData.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center`}
            >
              Read Story
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <button
              className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Helper function for date formatting  
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

// Main component
export default function MagazineHomepageEnhanced() {
  const [currentFeatured, setCurrentFeatured] = useState(0)

  // Get featured articles from real liveStoryArchive data
  const featuredArticles = liveStoryArchive.filter(article => article.featured)
  const recentArticles = liveStoryArchive.slice(0, 12) // Get 12 most recent

  // Auto-rotate featured articles every 10 seconds
  useEffect(() => {
    if (featuredArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeatured((prev) => (prev + 1) % featuredArticles.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [featuredArticles.length])

  const featuredArticle = featuredArticles[currentFeatured] || featuredArticles[0]

  if (!featuredArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-4">Loading Magazine...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Primary Navigation */}
      <PrimaryNavigation />
      
      {/* Hero section with curved background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50"></div>
        <div className="absolute top-0 left-0 w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-b-[50px] sm:rounded-b-[100px]"></div>
        
        {/* Main Container - Enhanced mobile spacing */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Main Content Area - 8 columns */}
            <main className="lg:col-span-8">
              
              {/* Featured Story Hero - Mobile optimized */}
              <section className="mb-8 sm:mb-12 lg:mb-16">
                <div className="mb-6 sm:mb-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center lg:text-left"
                  >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black heading-block mb-3 sm:mb-4 uppercase tracking-tight leading-tight">
                      BLKOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">STORIES</span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-light max-w-2xl leading-relaxed">
                      Authentic voices from the Black queer liberation movement
                    </p>
                  </motion.div>
                  
                  {/* Featured Article Carousel Indicators - Mobile friendly */}
                  <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                    {featuredArticles.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                          index === currentFeatured 
                            ? 'bg-purple-600 scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        onClick={() => setCurrentFeatured(index)}
                        aria-label={`View featured article ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Articles Grid - Mobile optimized */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black heading-block uppercase">
                    Latest Stories
                  </h2>
                  <Link 
                    to="/stories"
                    className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
                  >
                    View All
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>
                
                {/* Grid Layout - Mobile first responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {recentArticles.map((article, index) => (
                    <EnhancedArticleCard 
                      key={`${article.id}-${index}`} 
                      article={article}
                    />
                  ))}
                </div>
              </section>
            </main>
            
            {/* Sidebar - 4 columns - Mobile optimized */}
            <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
              
              {/* Community Stats - Mobile friendly */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Community Impact</h2>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { label: 'Stories Published', value: liveStoryArchive.length.toString(), trend: '+5', color: 'text-purple-600' },
                    { label: 'Community Voices', value: '89', trend: '+12', color: 'text-blue-600' },
                    { label: 'Stories This Week', value: '8', trend: '+3', color: 'text-green-600' },
                    { label: 'Featured Authors', value: '23', trend: '+2', color: 'text-orange-600' }
                  ].map((stat, index) => (
                    <div key={stat.label} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`text-xs sm:text-sm font-semibold ${stat.color} flex items-center`}>
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {stat.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget Grid - Stack on mobile */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <EventsWidget />
                <IVORWidget />
                <CommunityActivityWidget />
                <MembershipWidget />
              </div>
            </aside>
          </div>
        </div>

        {/* Featured Article Card - Mobile optimized */}
        <FeaturedArticleCard article={featuredArticle} />
        
        {/* Category Navigation */}
        <ContentCategoryKey />
      </div>
    </div>
  )
}