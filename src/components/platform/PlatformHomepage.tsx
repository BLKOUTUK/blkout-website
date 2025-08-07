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
  const [liveStats, setLiveStats] = useState({
    activeUsers: 47,
    ongoingDiscussions: 12,
    upcomingEvents: 8,
    newStories: 5
  })

  // Load real data and simulate live activity
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
        },
        {
          id: '3',
          title: 'Protest Planning Meeting',
          date: '2025-01-25',
          time: '19:30',
          location: 'South London Community Hub',
          category: 'Organizing',
          featured: true
        }
      ])

      setCommunityActivity([
        {
          id: '1',
          type: 'discussion',
          title: 'Housing justice strategy session starting now',
          user: 'TenantOrganizer',
          timestamp: '2025-01-15T14:30:00Z',
          engagement: 23
        },
        {
          id: '2',
          type: 'event',
          title: 'Live: Community safety patrol forming',
          user: 'SafetyCoordinator',
          timestamp: '2025-01-15T12:00:00Z',
          engagement: 31
        },
        {
          id: '3',
          type: 'story',
          title: 'Breaking: New community space secured in Hackney',
          user: 'CommunityReporter',
          timestamp: '2025-01-15T10:15:00Z',
          engagement: 18
        }
      ])

      setLoading(false)
    }, 1000)

    // Update live stats every 30 seconds
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 6) - 3,
        ongoingDiscussions: Math.max(8, prev.ongoingDiscussions + Math.floor(Math.random() * 4) - 2),
        upcomingEvents: prev.upcomingEvents,
        newStories: prev.newStories + Math.floor(Math.random() * 2)
      }))
    }, 30000)

    return () => clearInterval(statsInterval)
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
              Your hub for liberation movements, community organizing, and collective action. 
              <br />
              <span className="text-emerald-400 font-semibold">Connect • Organize • Build Power • Take Action</span>
            </p>
            
            {/* Live Activity Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <div className="flex items-center space-x-2 bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 text-sm">{liveStats.activeUsers} active now</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm">{liveStats.ongoingDiscussions} live discussions</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-900/30 px-4 py-2 rounded-full border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm">{liveStats.upcomingEvents} events this week</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center">
                Start Exploring
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border border-purple-500 hover:bg-purple-500/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Join Community
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* What's Happening Now Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              What's Happening Right Now
            </h2>
            <p className="text-gray-400 text-lg">Live community activity and urgent actions</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {communityActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border-l-4 border-red-500 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">
                    {activity.type === 'discussion' ? 'LIVE' : activity.type === 'event' ? 'HAPPENING' : 'BREAKING'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{activity.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-400">@{activity.user}</span>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-3 h-3 mr-1" />
                    {activity.engagement}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exploration Dashboard */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Exploration Actions */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Dive Into Liberation Work</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <a href="/ivor" className="group bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Ask I.V.O.R. AI</h3>
                    <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Get instant guidance on organizing strategies, liberation theory, and movement history
                  </p>
                  <div className="text-orange-400 text-sm font-medium">
                    Start conversation →
                  </div>
                </a>
                
                <a href="/events" className="group bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Join Live Events</h3>
                    <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Protests, workshops, community meetings - find your place in the movement
                  </p>
                  <div className="text-purple-400 text-sm font-medium">
                    See what's happening →
                  </div>
                </a>
                
                <a href="/community" className="group bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Build Community</h3>
                    <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Connect with organizers, start discussions, and coordinate collective action
                  </p>
                  <div className="text-blue-400 text-sm font-medium">
                    Join the conversation →
                  </div>
                </a>
                
                <a href="/stories" className="group bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Stories & Analysis</h3>
                    <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Read community perspectives, original analysis, and liberation narratives
                  </p>
                  <div className="text-emerald-400 text-sm font-medium">
                    Explore archive →
                  </div>
                </a>
              </div>
            </div>

            {/* Activity Sidebar */}
            <div className="space-y-6">
              
              {/* Urgent Actions */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  Urgent Actions
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-red-800/30 rounded-lg p-3">
                    <h4 className="font-medium text-sm text-red-200">Stop Eviction Notice</h4>
                    <p className="text-xs text-gray-400 mt-1">Family in Croydon needs immediate support</p>
                    <button className="text-red-400 text-xs mt-2 hover:text-red-300">Take Action →</button>
                  </div>
                  <div className="bg-orange-800/30 rounded-lg p-3">
                    <h4 className="font-medium text-sm text-orange-200">Community Safety Alert</h4>
                    <p className="text-xs text-gray-400 mt-1">Increased police activity in Tottenham</p>
                    <button className="text-orange-400 text-xs mt-2 hover:text-orange-300">Get Updates →</button>
                  </div>
                </div>
              </div>

              {/* This Week's Events */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  This Week's Events
                </h3>
                
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
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
                <h3 className="text-lg font-semibold mb-2">Ready to Organize?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Join {liveStats.activeUsers}+ community members building liberation movements across the UK.
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Start Your Journey
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