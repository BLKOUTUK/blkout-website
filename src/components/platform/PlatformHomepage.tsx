'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, Users, MessageCircle, ChevronRight, 
  Star, TrendingUp, Eye, Share2, Bookmark, Search,
  Filter, Grid, List, Globe, MapPin
} from 'lucide-react'

// Import real articles data and UI components
import { articles, getFeaturedArticles, getRecentArticles, type Article } from '../../data/articles'
import { ArticleImageGenerator } from '../../utils/imageGenerator'
import ArticleImage from '../ui/ArticleImage'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: string
  featured: boolean
}

interface CommunityActivity {
  id: string
  type: 'discussion' | 'story' | 'event' | 'member'
  title: string
  user: string
  timestamp: string
  engagement: number
}

const PlatformHomepage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [communityActivity, setCommunityActivity] = useState<CommunityActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Load real article data and mock events/community data
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {

      setEvents([
        {
          id: '1',
          title: 'Digital Security Workshop',
          date: '2025-01-20',
          time: '18:00',
          location: 'Community Center, Brixton',
          category: 'Education',
          featured: true
        },
        {
          id: '2', 
          title: 'Community Healing Circle',
          date: '2025-01-22',
          time: '19:00',
          location: 'Online',
          category: 'Wellness',
          featured: false
        }
      ])

      setCommunityActivity([
        {
          id: '1',
          type: 'discussion',
          title: 'How do we build sustainable community tech?',
          user: 'TechOrganizer',
          timestamp: '2025-01-15T14:30:00Z',
          engagement: 23
        },
        {
          id: '2',
          type: 'story',
          title: 'New story: Cooperative Housing Models',
          user: 'CommunityReporter',
          timestamp: '2025-01-15T12:00:00Z',
          engagement: 15
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryColor = (category: Article['category']) => {
    return ArticleImageGenerator.getCategoryClasses(category)
  }

  const getCategoryLabel = (category: Article['category']) => {
    switch (category) {
      case 'original': return 'Original Commentary'
      case 'curated': return 'Curated Content'
      case 'event-coverage': return 'Event Coverage'
      case 'community-response': return 'Community Response'
      case 'multimedia': return 'Video/Audio/Photo'
      default: return 'Uncategorized'
    }
  }

  const featuredArticles = getFeaturedArticles()
  const recentArticles = getRecentArticles(6)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Featured Stories Carousel */}
      <section className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {featuredArticles[0] && (
              <>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(featuredArticles[0].category)}`}>
                      {getCategoryLabel(featuredArticles[0].category)}
                    </span>
                    <span className="text-yellow-400 flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold leading-tight">
                    {featuredArticles[0].title}
                  </h1>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {featuredArticles[0].excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span>By {featuredArticles[0].author}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredArticles[0].readTime} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {featuredArticles[0].views.toLocaleString()}
                    </span>
                  </div>
                  
                  <button className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                    Read Story
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
                
                <div className="relative">
                  <ArticleImage 
                    article={featuredArticles[0]} 
                    size="hero"
                    className="rounded-xl"
                    showGradientFallback={true}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Content Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Stories</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Recent Articles Grid */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {recentArticles.map((article) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group cursor-pointer ${viewMode === 'grid' 
                    ? 'bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors' 
                    : 'bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors flex items-center space-x-4'
                  }`}
                >
                  {viewMode === 'list' && (
                    <ArticleImage 
                      article={article} 
                      size="thumbnail"
                      className="w-16 h-16 rounded-lg flex-shrink-0"
                      showGradientFallback={true}
                    />
                  )}
                  
                  {viewMode === 'grid' && (
                    <ArticleImage 
                      article={article} 
                      size="medium"
                      className="w-full h-48 rounded-lg mb-4"
                      showGradientFallback={true}
                    />
                  )}
                  
                  <div className={viewMode === 'grid' ? 'space-y-4' : 'flex-1 space-y-2'}>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(article.category)}`}>
                        {getCategoryLabel(article.category)}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Eye className="w-3 h-3" />
                        <span>{article.views}</span>
                        <Share2 className="w-3 h-3" />
                        <span>{article.shares}</span>
                      </div>
                    </div>
                    
                    <h3 className={`font-semibold group-hover:text-emerald-400 transition-colors ${
                      viewMode === 'grid' ? 'text-lg' : 'text-base'
                    }`}>
                      {article.title}
                    </h3>
                    
                    {viewMode === 'grid' && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>By {article.author}</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime} min</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors">
                Load More Stories
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Search */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search stories, events..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Upcoming Events Widget */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
                  Upcoming Events
                </h3>
                <a href="/events" className="text-emerald-400 hover:text-emerald-300 text-sm">
                  View All
                </a>
              </div>
              
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-emerald-500 pl-3 py-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* I.V.O.R. Widget */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <h3 className="text-lg font-semibold">I.V.O.R. Assistant</h3>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">
                Get instant answers about liberation movements, organizing strategies, and community resources.
              </p>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Ask I.V.O.R.
              </button>
            </div>

            {/* Community Activity Feed */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  Community Activity
                </h3>
                <a href="/community" className="text-emerald-400 hover:text-emerald-300 text-sm">
                  Join Discussion
                </a>
              </div>
              
              <div className="space-y-3">
                {communityActivity.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{activity.title}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {activity.engagement} responses
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership CTA */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-xl p-6 border border-emerald-500/30">
              <h3 className="text-lg font-semibold mb-2">Join Our Community</h3>
              <p className="text-sm text-gray-300 mb-4">
                Become part of the liberation movement. Access exclusive content and connect with organizers.
              </p>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Become a Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformHomepage