// Real-time Community Dashboard with full Supabase integration
// Showcases community activity, transparency, and democratic values

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Users, Calendar, Newspaper, TrendingUp, Activity,
  Bell, MessageCircle, Share2, Eye, Clock, MapPin,
  BarChart3, PieChart, Globe, Wifi, CheckCircle,
  ArrowRight, Zap, Star, Coffee, Sparkles
} from 'lucide-react'
import { useEvents, useArticles, useCommunityStats, useCommunityActivity } from '../../hooks/useSupabase'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

interface ActivityItem {
  id: string
  type: 'event' | 'article'
  action: string
  data: any
  timestamp: string
}

const CommunityDashboardEnhanced: React.FC = () => {
  const { events, loading: eventsLoading } = useEvents({ status: 'published', limit: 5 })
  const { articles, loading: articlesLoading } = useArticles({ status: 'published', limit: 5 })
  const { stats, loading: statsLoading } = useCommunityStats()
  const { activity, loading: activityLoading } = useCommunityActivity()
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h')
  const [showActivityFeed, setShowActivityFeed] = useState(true)

  // Format activity for display
  const formatActivity = (item: ActivityItem) => {
    const timeAgo = new Date(item.timestamp).toLocaleString()
    
    switch (item.type) {
      case 'event':
        return {
          icon: Calendar,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-900/20',
          title: item.action === 'INSERT' ? 'New Event Added' : 'Event Updated',
          description: item.data?.name || 'Community Event',
          time: timeAgo
        }
      case 'article':
        return {
          icon: Newspaper,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-900/20',
          title: item.action === 'INSERT' ? 'New Article Published' : 'Article Updated',
          description: item.data?.title || 'Community Article',
          time: timeAgo
        }
      default:
        return {
          icon: Activity,
          color: 'text-gray-400',
          bgColor: 'bg-gray-900/20',
          title: 'Community Activity',
          description: 'Updates happening',
          time: timeAgo
        }
    }
  }

  const communityMetrics = [
    {
      label: 'Active Community Members',
      value: stats?.community?.totalContacts || 0,
      change: '+12 this week',
      icon: Users,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20'
    },
    {
      label: 'Published Articles',
      value: stats?.articles?.published || 0,
      change: '+3 this week',
      icon: Newspaper,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-900/20'
    },
    {
      label: 'Upcoming Events',
      value: stats?.events?.upcoming || 0,
      change: '+2 this week',
      icon: Calendar,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    },
    {
      label: 'Liberation Stories',
      value: stats?.articles?.byCategory?.['Liberation Stories'] || 0,
      change: '+1 this week',
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20'
    }
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        <PrimaryNavigationEnhanced />
        
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-emerald-950 via-indigo-950 to-violet-950 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center mr-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-black heading-block uppercase">
                    <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                      Community
                    </span>
                    <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent ml-2">
                      Dashboard
                    </span>
                  </h1>
                  <p className="text-emerald-300 font-mono uppercase tracking-wider text-sm">
                    REAL-TIME LIBERATION ACTIVITY
                  </p>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-8">
                Transparency in action. Watch our community grow, contribute, and build liberation together.
                Every update reflects our collective power and democratic values.
              </p>

              {/* Real-time Status */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold heading-block text-sm uppercase">
                    Real-time Data Active
                  </span>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-300 text-sm">
                  {activity.length} updates in the last hour
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Community Metrics */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black heading-block mb-4 uppercase">
                <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                  Community Pulse
                </span>
              </h2>
              <p className="text-indigo-200 font-light">
                Real-time metrics showing our collective growth and impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`${metric.bgColor} backdrop-blur-sm border border-indigo-700/30 p-6 hover:scale-105 transition-transform duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    {statsLoading ? (
                      <LoadingSpinner size="sm" color="indigo" />
                    ) : (
                      <span className="text-3xl font-black text-white">{metric.value}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{metric.label}</h3>
                  <p className={`text-sm ${metric.color} font-medium`}>{metric.change}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 h-fit">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-black text-white heading-block uppercase">
                      Live Activity
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowActivityFeed(!showActivityFeed)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <AnimatePresence>
                  {showActivityFeed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {activityLoading ? (
                        <div className="text-center py-8">
                          <LoadingSpinner size="md" color="indigo" text="Loading activity..." />
                        </div>
                      ) : activity.length > 0 ? (
                        activity.slice(0, 10).map((item, index) => {
                          const activityInfo = formatActivity(item)
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className={`${activityInfo.bgColor} border border-indigo-700/20 p-4 hover:bg-indigo-800/30 transition-colors`}
                            >
                              <div className="flex items-start space-x-3">
                                <activityInfo.icon className={`w-5 h-5 ${activityInfo.color} mt-1`} />
                                <div className="flex-1">
                                  <h4 className="text-white font-medium text-sm">{activityInfo.title}</h4>
                                  <p className="text-indigo-200 text-sm line-clamp-2">{activityInfo.description}</p>
                                  <p className="text-indigo-400 text-xs mt-1">{activityInfo.time}</p>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8">
                          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                          <p className="text-indigo-300">Waiting for community activity...</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Latest Articles & Events */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="space-y-8">
                {/* Latest Articles */}
                <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Newspaper className="w-6 h-6 text-indigo-400" />
                      <h3 className="text-xl font-black text-white heading-block uppercase">
                        Latest Community Articles
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                  </div>

                  {articlesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-indigo-800/50 rounded mb-2"></div>
                          <div className="h-3 bg-indigo-800/30 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {articles.slice(0, 5).map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="border border-indigo-700/20 p-4 hover:bg-indigo-800/20 transition-colors cursor-pointer group"
                        >
                          <h4 className="text-white font-medium mb-2 group-hover:text-indigo-300 transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-indigo-200 text-sm line-clamp-2 mb-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-indigo-400">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Events */}
                <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-xl font-black text-white heading-block uppercase">
                        Upcoming Community Events
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                  </div>

                  {eventsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-emerald-800/50 rounded mb-2"></div>
                          <div className="h-3 bg-emerald-800/30 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="border border-emerald-700/20 p-4 hover:bg-emerald-800/20 transition-colors cursor-pointer group"
                        >
                          <h4 className="text-white font-medium mb-2 group-hover:text-emerald-300 transition-colors">
                            {event.name}
                          </h4>
                          <p className="text-emerald-200 text-sm line-clamp-2 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-emerald-400">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(event.event_date).toLocaleDateString()}
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {typeof event.location === 'object' && event.location.address 
                                ? event.location.address 
                                : 'Location TBD'
                              }
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Community Values Banner */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 bg-gradient-to-br from-violet-900 via-indigo-900 to-emerald-900 p-8 border border-violet-600/30"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Heart className="w-16 h-16 text-violet-400 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-3xl font-black heading-block mb-6 uppercase">
                <span className="bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-transparent">
                  Community-Owned, Democratic, Transparent
                </span>
              </h3>
              <p className="text-lg text-indigo-100 mb-8 font-light leading-relaxed">
                This dashboard represents our commitment to transparency and democratic governance. 
                Every metric, every update, every decision is visible to our community. 
                We build in the open, we grow together, and we govern collectively.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-400 hover:to-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Join Our Community
                </button>
                <button className="bg-transparent border-2 border-violet-400 hover:bg-violet-400/10 text-violet-100 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Learn About Our Values
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        <PlatformFooter />
      </div>
    </ErrorBoundary>
  )
}

export default CommunityDashboardEnhanced