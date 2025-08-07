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
      {/* Hero Welcome Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              Welcome to BLKOUT
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              A digital platform for liberation movements, community organizing, and collective action. 
              Connect, learn, and build power together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center">
                Explore Stories
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border border-purple-500 hover:bg-purple-500/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Join Community
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
        </div>
      </section>

      {/* Platform Features Overview */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Makes BLKOUT Different</h2>
            <p className="text-gray-400 text-lg">Community-first tools for liberation movements</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-750 transition-colors"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Stories</h3>
              <p className="text-gray-400">
                Amplify voices from the movement. Share experiences, analysis, and calls to action with our community.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-750 transition-colors"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Movement Events</h3>
              <p className="text-gray-400">
                Discover protests, workshops, meetings, and community gatherings. Stay connected to local organizing.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-750 transition-colors"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Collective Intelligence</h3>
              <p className="text-gray-400">
                Access I.V.O.R., our AI assistant trained on liberation theory and organizing strategies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Dashboard */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Quick Actions */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Jump Right In</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <a href="/stories" className="group bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Latest Stories</h3>
                    <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Read community perspectives, original analysis, and movement updates
                  </p>
                  <div className="text-emerald-400 text-sm font-medium">
                    Browse all stories →
                  </div>
                </a>
                
                <a href="/events" className="group bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Upcoming Events</h3>
                    <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Find local organizing events, workshops, and community gatherings
                  </p>
                  <div className="text-purple-400 text-sm font-medium">
                    View calendar →
                  </div>
                </a>
                
                <a href="/community" className="group bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Community Hub</h3>
                    <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Connect with organizers, join discussions, and build solidarity
                  </p>
                  <div className="text-blue-400 text-sm font-medium">
                    Join discussions →
                  </div>
                </a>
                
                <a href="/ivor" className="group bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Ask I.V.O.R.</h3>
                    <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Get guidance on organizing strategies, theory, and movement history
                  </p>
                  <div className="text-orange-400 text-sm font-medium">
                    Start conversation →
                  </div>
                </a>
              </div>
            </div>

            {/* Sidebar with Activity Feed */}
            <div className="space-y-6">
              
              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                  Recent Activity
                </h3>
                
                <div className="space-y-4">
                  {communityActivity.map((activity) => (
                    <div key={activity.id} className="text-sm border-l-2 border-gray-700 pl-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-emerald-400">{activity.user}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{activity.title}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {activity.engagement} responses
                      </div>
                    </div>
                  ))}
                </div>
                
                <a href="/community" className="block text-center text-emerald-400 hover:text-emerald-300 text-sm mt-4 font-medium">
                  View all activity →
                </a>
              </div>

              {/* Upcoming Events Preview */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  This Week
                </h3>
                
                <div className="space-y-3">
                  {events.slice(0, 2).map((event) => (
                    <div key={event.id} className="border-l-4 border-purple-500 pl-3 py-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="text-xs text-gray-400 space-y-1 mt-1">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
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
                
                <a href="/events" className="block text-center text-purple-400 hover:text-purple-300 text-sm mt-4 font-medium">
                  View full calendar →
                </a>
              </div>

              {/* Get Involved CTA */}
              <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-xl p-6 border border-emerald-500/30">
                <h3 className="text-lg font-semibold mb-2">Get Involved</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Ready to take action? Join our community and help build the movement.
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Join BLKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PlatformHomepage

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