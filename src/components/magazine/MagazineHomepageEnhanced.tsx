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
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          {article.excerpt}
        </p>
        
        {/* Author and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${categoryData.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-white text-sm font-semibold">
                  {article.author.avatar}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {article.author.name}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span>{article.publishedAt}</span>
                  <span>•</span>
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 bg-gradient-to-r ${categoryData.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center`}
            >
              Read Story
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Loading Magazine...</h2>
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
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-b-[100px]"></div>
        
        {/* Main Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content Area - 8 columns */}
            <main className="lg:col-span-8">
              
              {/* Featured Story Hero */}
              <section className="mb-16">
                <div className="mb-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center lg:text-left"
                  >
                    <h1 className="text-5xl lg:text-6xl font-black heading-block mb-4 uppercase tracking-tight">
                      <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                        BLKOUT
                      </span>
                      <span className="text-gray-800 ml-2">MAGAZINE</span>
                    </h1>
                    <p className="text-xl text-gray-600 font-light max-w-2xl">
                      Authentic stories, radical imagination, and community voices from Black queer liberation movements.
                    </p>
                  </motion.div>
                </div>

                {/* Featured Article Card */}
                <FeaturedArticleCard article={featuredArticle} />

                {/* Featured Navigation Dots */}
                {featuredArticles.length > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    {featuredArticles.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeatured(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentFeatured 
                            ? 'bg-purple-600 scale-110' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to featured article ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Stories Grid */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 heading-block uppercase">
                    Latest Stories
                  </h2>
                  <Link 
                    to="/stories" 
                    className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 transition-colors"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentArticles.slice(0, 6).map((article) => (
                    <EnhancedArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>

              {/* Content Category Key */}
              <ContentCategoryKey />
              
            </main>

            {/* Sidebar - 4 columns */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Community Stats Widget */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 heading-block uppercase">
                  Community Impact
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Stories Published', value: liveStoryArchive.length.toString(), trend: '+5', color: 'text-purple-600' },
                    { label: 'Community Voices', value: '89', trend: '+12', color: 'text-emerald-600' },
                    { label: 'Categories Covered', value: Object.keys(CONTENT_CATEGORIES).length.toString(), trend: '+2', color: 'text-blue-600' },
                    { label: 'Active Contributors', value: '47', trend: '+8', color: 'text-orange-600' }
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-emerald-500 font-medium">+{stat.trend} this week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events Widget */}
              <EventsWidget />

              {/* I.V.O.R. Widget */}
              <IVORWidget />

              {/* Community Activity Widget */}
              <CommunityActivityWidget />

              {/* Membership Widget */}
              <MembershipWidget />
              
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}