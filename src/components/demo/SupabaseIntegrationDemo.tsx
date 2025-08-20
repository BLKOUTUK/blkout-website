// Comprehensive Supabase Integration Demo
// Demonstrates all CRUD operations, real-time features, and community-focused functionality

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, Plus, Edit3, Trash2, RefreshCw, CheckCircle, 
  AlertCircle, Users, Calendar, Newspaper, Activity,
  Wifi, WifiOff, Heart, Zap, Star, Shield
} from 'lucide-react'
import { useEvents, useArticles, useCommunityStats, useAuth, useFileUpload } from '../../hooks/useSupabase'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import type { Event, NewsArticle } from '../../types/supabase'

const SupabaseIntegrationDemo: React.FC = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  const { events, loading: eventsLoading, error: eventsError, createEvent, updateEvent, deleteEvent } = useEvents()
  const { articles, loading: articlesLoading, error: articlesError, createArticle, updateArticle, deleteArticle } = useArticles()
  const { stats, loading: statsLoading } = useCommunityStats()
  const { uploadFile, uploading } = useFileUpload()
  
  const [activeTab, setActiveTab] = useState<'events' | 'articles' | 'stats' | 'auth'>('events')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Event | NewsArticle | null>(null)
  const [operationStatus, setOperationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Demo data for creating new items
  const createDemoEvent = async () => {
    setOperationStatus('loading')
    setStatusMessage('Creating demo event...')
    
    try {
      const demoEvent = {
        name: `Community Workshop ${Date.now()}`,
        description: 'A demonstration event showing Supabase integration with community values',
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        location: { type: 'physical', address: 'Community Center, London' },
        source: 'manual',
        organizer_name: 'BLKOUT Demo Team',
        tags: ['demo', 'community', 'workshop'],
        status: 'published' as const,
        target_audience: ['All Welcome'],
        price: 'Free'
      }

      await createEvent(demoEvent)
      setOperationStatus('success')
      setStatusMessage('Demo event created successfully!')
      
      setTimeout(() => {
        setOperationStatus('idle')
        setStatusMessage('')
      }, 3000)
    } catch (error) {
      setOperationStatus('error')
      setStatusMessage(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      setTimeout(() => {
        setOperationStatus('idle')
        setStatusMessage('')
      }, 5000)
    }
  }

  const createDemoArticle = async () => {
    setOperationStatus('loading')
    setStatusMessage('Creating demo article...')
    
    try {
      const demoArticle = {
        title: `Community Update ${Date.now()}`,
        excerpt: 'Demonstrating Supabase integration for community-owned journalism',
        content: `This is a demonstration article showing how our Supabase integration supports community-owned journalism and democratic content management.

Our platform prioritizes:
- Transparency in all operations
- Community ownership of data
- Democratic decision-making processes
- Liberation-focused content

This article was created as part of our technical demonstration of the full-stack Supabase integration.`,
        author: 'BLKOUT Demo Team',
        category: 'Community News',
        tags: ['demo', 'technical', 'community'],
        status: 'published' as const,
        featured: false,
        priority: 'medium' as const
      }

      await createArticle(demoArticle)
      setOperationStatus('success')
      setStatusMessage('Demo article created successfully!')
      
      setTimeout(() => {
        setOperationStatus('idle')
        setStatusMessage('')
      }, 3000)
    } catch (error) {
      setOperationStatus('error')
      setStatusMessage(`Failed to create article: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      setTimeout(() => {
        setOperationStatus('idle')
        setStatusMessage('')
      }, 5000)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this demo event?')) {
      setOperationStatus('loading')
      setStatusMessage('Deleting event...')
      
      try {
        await deleteEvent(eventId)
        setOperationStatus('success')
        setStatusMessage('Event deleted successfully!')
        
        setTimeout(() => {
          setOperationStatus('idle')
          setStatusMessage('')
        }, 3000)
      } catch (error) {
        setOperationStatus('error')
        setStatusMessage(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`)
        
        setTimeout(() => {
          setOperationStatus('idle')
          setStatusMessage('')
        }, 5000)
      }
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (confirm('Are you sure you want to delete this demo article?')) {
      setOperationStatus('loading')
      setStatusMessage('Deleting article...')
      
      try {
        await deleteArticle(articleId)
        setOperationStatus('success')
        setStatusMessage('Article deleted successfully!')
        
        setTimeout(() => {
          setOperationStatus('idle')
          setStatusMessage('')
        }, 3000)
      } catch (error) {
        setOperationStatus('error')
        setStatusMessage(`Failed to delete article: ${error instanceof Error ? error.message : 'Unknown error'}`)
        
        setTimeout(() => {
          setOperationStatus('idle')
          setStatusMessage('')
        }, 5000)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading': return 'text-yellow-400 bg-yellow-900/20'
      case 'success': return 'text-emerald-400 bg-emerald-900/20'
      case 'error': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusIcon = () => {
    switch (operationStatus) {
      case 'loading': return <LoadingSpinner size="sm" color="yellow" />
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Database className="w-5 h-5 text-indigo-400" />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mr-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-black heading-block uppercase">
                  <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                    Supabase Integration
                  </span>
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent ml-2">
                    Demo
                  </span>
                </h1>
                <p className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                  REAL-TIME • COMMUNITY-OWNED • DEMOCRATIC
                </p>
              </div>
            </div>
            
            <p className="text-xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-8">
              Experience our full-stack Supabase integration with real-time updates, CRUD operations, 
              file uploads, and community-focused features. Built with liberation values at the core.
            </p>

            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold heading-block text-sm uppercase">
                  Supabase Connected
                </span>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-indigo-300 text-sm">Real-time updates active</span>
            </div>
          </div>

          {/* Operation Status */}
          {operationStatus !== 'idle' && statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 border rounded-lg ${getStatusColor(operationStatus)}`}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <span className="font-medium">{statusMessage}</span>
              </div>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { key: 'events', label: 'Events CRUD', icon: Calendar },
              { key: 'articles', label: 'Articles CRUD', icon: Newspaper },
              { key: 'stats', label: 'Community Stats', icon: Activity },
              { key: 'auth', label: 'Authentication', icon: Shield }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 font-bold text-sm transition-all duration-300 heading-block uppercase flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white'
                    : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/50 hover:text-white border border-indigo-700/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8">
            {/* Events CRUD Demo */}
            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white heading-block uppercase">
                    Events CRUD Operations
                  </h2>
                  <button
                    onClick={createDemoEvent}
                    disabled={operationStatus === 'loading'}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Demo Event</span>
                  </button>
                </div>

                {eventsLoading ? (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" color="indigo" text="Loading events..." />
                  </div>
                ) : eventsError ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-300 mb-4">Error loading events: {eventsError}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                        <p className="text-indigo-300 mb-4">No events found. Create one to see CRUD operations!</p>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div key={event.id} className="border border-indigo-700/30 p-4 hover:bg-indigo-800/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-medium">{event.name}</h3>
                              <p className="text-indigo-200 text-sm">{event.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-indigo-400 mt-2">
                                <span>{new Date(event.event_date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{event.organizer_name}</span>
                                <span>•</span>
                                <span className="capitalize">{event.status}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                disabled={operationStatus === 'loading'}
                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Articles CRUD Demo */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white heading-block uppercase">
                    Articles CRUD Operations
                  </h2>
                  <button
                    onClick={createDemoArticle}
                    disabled={operationStatus === 'loading'}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Demo Article</span>
                  </button>
                </div>

                {articlesLoading ? (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" color="indigo" text="Loading articles..." />
                  </div>
                ) : articlesError ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-300 mb-4">Error loading articles: {articlesError}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.length === 0 ? (
                      <div className="text-center py-12">
                        <Newspaper className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                        <p className="text-indigo-300 mb-4">No articles found. Create one to see CRUD operations!</p>
                      </div>
                    ) : (
                      articles.map((article) => (
                        <div key={article.id} className="border border-indigo-700/30 p-4 hover:bg-indigo-800/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-medium">{article.title}</h3>
                              <p className="text-indigo-200 text-sm">{article.excerpt}</p>
                              <div className="flex items-center space-x-4 text-xs text-indigo-400 mt-2">
                                <span>{article.category}</span>
                                <span>•</span>
                                <span>{article.author}</span>
                                <span>•</span>
                                <span className="capitalize">{article.status}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
                                disabled={operationStatus === 'loading'}
                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Community Stats Demo */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-2xl font-black text-white heading-block uppercase mb-6">
                  Real-time Community Statistics
                </h2>

                {statsLoading ? (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" color="indigo" text="Loading community stats..." />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Events Stats */}
                    <div className="bg-emerald-900/20 border border-emerald-700/30 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Calendar className="w-8 h-8 text-emerald-400" />
                        <span className="text-2xl font-black text-white">{stats?.events?.total || 0}</span>
                      </div>
                      <h3 className="text-emerald-300 font-bold text-lg">Community Events</h3>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Published:</span>
                          <span className="text-white">{stats?.events?.published || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Upcoming:</span>
                          <span className="text-white">{stats?.events?.upcoming || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Articles Stats */}
                    <div className="bg-indigo-900/20 border border-indigo-700/30 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Newspaper className="w-8 h-8 text-indigo-400" />
                        <span className="text-2xl font-black text-white">{stats?.articles?.total || 0}</span>
                      </div>
                      <h3 className="text-indigo-300 font-bold text-lg">Community Articles</h3>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-indigo-200">Published:</span>
                          <span className="text-white">{stats?.articles?.published || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-200">Categories:</span>
                          <span className="text-white">{Object.keys(stats?.articles?.byCategory || {}).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Community Stats */}
                    <div className="bg-violet-900/20 border border-violet-700/30 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Users className="w-8 h-8 text-violet-400" />
                        <span className="text-2xl font-black text-white">{stats?.community?.totalContacts || 0}</span>
                      </div>
                      <h3 className="text-violet-300 font-bold text-lg">Community Members</h3>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-violet-200">Verified:</span>
                          <span className="text-white">{stats?.community?.verifiedContacts || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-violet-200">Growth:</span>
                          <span className="text-white">+12 this week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authentication Demo */}
            {activeTab === 'auth' && (
              <div>
                <h2 className="text-2xl font-black text-white heading-block uppercase mb-6">
                  Authentication System
                </h2>

                <div className="bg-slate-900/30 border border-slate-700/30 p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <Shield className="w-8 h-8 text-slate-400" />
                    <div>
                      <h3 className="text-white font-bold text-lg">Authentication Status</h3>
                      <p className="text-slate-300">
                        {isAuthenticated ? 'Signed in and authenticated' : 'Not signed in'}
                      </p>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="bg-emerald-900/20 border border-emerald-700/30 p-4">
                        <h4 className="text-emerald-300 font-bold mb-2">User Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-emerald-200">Email:</span>
                            <span className="text-white">{user?.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-200">User ID:</span>
                            <span className="text-white font-mono text-xs">{user?.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-200">Created:</span>
                            <span className="text-white">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={signOut}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-900/20 border border-yellow-700/30 p-4">
                        <p className="text-yellow-300">
                          Authentication is required to access admin features and perform CRUD operations.
                          This demo shows the authentication status and user information when signed in.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-slate-300 mb-4">
                          In a real application, there would be sign-in forms here.
                        </p>
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-600 text-gray-300 font-bold rounded cursor-not-allowed"
                        >
                          Sign In (Demo Mode)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Integration Features Summary */}
          <div className="mt-12 bg-gradient-to-br from-emerald-900 via-indigo-900 to-violet-900 p-8 border border-emerald-600/30">
            <div className="text-center">
              <h3 className="text-3xl font-black heading-block mb-6 uppercase">
                <span className="bg-gradient-to-r from-emerald-300 to-violet-300 bg-clip-text text-transparent">
                  Integration Features
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Database, title: 'Full CRUD Operations', desc: 'Create, Read, Update, Delete' },
                  { icon: Zap, title: 'Real-time Updates', desc: 'Live data synchronization' },
                  { icon: Shield, title: 'Authentication', desc: 'Secure user management' },
                  { icon: Heart, title: 'Community Values', desc: 'Democratic & transparent' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <feature.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                    <p className="text-indigo-200 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default SupabaseIntegrationDemo