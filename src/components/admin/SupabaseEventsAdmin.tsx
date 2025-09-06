// Enhanced Events Admin Dashboard with full Supabase integration
// Maintains BLKOUTNXT community values and cooperative ownership principles

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Plus, Edit3, Trash2, Eye, Users, MapPin, 
  Clock, Filter, Search, CheckCircle, XCircle, AlertCircle,
  Download, Upload, Settings, BarChart3, TrendingUp, Heart,
  Wifi, WifiOff, RefreshCw, Save, ArrowLeft, ExternalLink
} from 'lucide-react'
import { useEvents, useCommunityStats, useFileUpload, useAuth } from '../../hooks/useSupabase'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import type { Event } from '../../types/supabase'

interface EventFormData {
  name: string
  description: string
  event_date: string
  location: any
  source: string
  source_url?: string
  organizer_name: string
  tags: string[]
  status: 'draft' | 'reviewing' | 'published' | 'archived'
  image_url?: string
  price?: string
  contact_email?: string
  registration_link?: string
  target_audience: string[]
}

const initialFormData: EventFormData = {
  name: '',
  description: '',
  event_date: '',
  location: { type: 'physical', address: '', coordinates: null },
  source: 'manual',
  organizer_name: '',
  tags: [],
  status: 'draft',
  target_audience: []
}

const eventCategories = [
  'community', 'wellness', 'education', 'arts-culture', 
  'activism', 'social', 'professional-development', 'support-group',
  'celebration', 'fundraising', 'protest', 'workshop'
]

const targetAudiences = [
  'Black QTIPOC', 'Youth (16-25)', 'Elders (50+)', 'Parents/Families',
  'Students', 'Professionals', 'Artists', 'Activists', 'All Welcome'
]

export default function SupabaseEventsAdmin() {
  const { user, isAuthenticated } = useAuth()
  const { events, loading, error, refetch, createEvent, updateEvent, deleteEvent } = useEvents()
  const { stats, loading: statsLoading } = useCommunityStats()
  const { uploadFile, uploading } = useFileUpload()
  
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'event_date' | 'created_at' | 'name'>('event_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return event.name.toLowerCase().includes(query) ||
               event.description.toLowerCase().includes(query) ||
               event.organizer_name?.toLowerCase().includes(query)
      }
      return true
    })
    .filter(event => statusFilter === 'all' || event.status === statusFilter)
    .filter(event => {
      if (categoryFilter === 'all') return true
      return event.tags?.some(tag => tag.toLowerCase().includes(categoryFilter.toLowerCase()))
    })
    .sort((a, b) => {
      const aVal = a[sortBy] || ''
      const bVal = b[sortBy] || ''
      const comparison = aVal.localeCompare(bVal)
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const eventData = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
        location: typeof formData.location === 'string' 
          ? { type: 'physical', address: formData.location }
          : formData.location,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        target_audience: Array.isArray(formData.target_audience) ? formData.target_audience : []
      }

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData)
      } else {
        await createEvent(eventData)
      }

      setFormData(initialFormData)
      setEditingEvent(null)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      description: event.description,
      event_date: event.event_date.split('T')[0],
      location: event.location,
      source: event.source,
      source_url: event.source_url || '',
      organizer_name: event.organizer_name || '',
      tags: event.tags || [],
      status: event.status,
      image_url: event.image_url || '',
      price: event.price || '',
      contact_email: event.contact_email || '',
      registration_link: event.registration_link || '',
      target_audience: event.target_audience || []
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(eventId)
      } catch (error) {
        console.error('Failed to delete event:', error)
      }
    }
  }

  const handleBulkStatusUpdate = async (newStatus: Event['status']) => {
    try {
      await Promise.all(
        selectedEvents.map(id => {
          const event = events.find(e => e.id === id)
          return event ? updateEvent(id, { status: newStatus }) : Promise.resolve()
        })
      )
      setSelectedEvents([])
      setShowBulkActions(false)
    } catch (error) {
      console.error('Failed to update events:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, 'events')
      setFormData(prev => ({ ...prev, image_url: result.url }))
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'published': return 'text-emerald-400 bg-emerald-900/20 border-emerald-500/30'
      case 'reviewing': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'draft': return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'archived': return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-indigo-200">Please sign in to access the events admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" color="indigo" text="Loading Events Dashboard" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        {/* Header */}
        <div className="bg-indigo-900/50 backdrop-blur-sm border-b border-indigo-700/30">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white heading-block uppercase">
                    Community Events Dashboard
                  </h1>
                  <p className="text-indigo-200 flex items-center mt-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Powered by community • Built for liberation
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Connection Status */}
                <div className="flex items-center space-x-2 text-sm">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Supabase Connected</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold hover:from-emerald-500 hover:to-indigo-500 transition-all heading-block uppercase flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Community Stats */}
          {!statsLoading && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">Total Events</p>
                    <p className="text-3xl font-black text-white">{stats.events?.total || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              
              <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-200 text-sm font-medium">Published</p>
                    <p className="text-3xl font-black text-white">{stats.events?.published || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-medium">Upcoming</p>
                    <p className="text-3xl font-black text-white">{stats.events?.upcoming || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-200 text-sm font-medium">Community Members</p>
                    <p className="text-3xl font-black text-white">{stats.community?.totalContacts || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-violet-400" />
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="reviewing">Reviewing</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {eventCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as any)
                  setSortOrder(order as any)
                }}
                className="px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="event_date-asc">Date (Earliest)</option>
                <option value="event_date-desc">Date (Latest)</option>
                <option value="created_at-desc">Recently Added</option>
                <option value="name-asc">Name (A-Z)</option>
              </select>
              
              <div className="flex gap-2">
                <button 
                  onClick={refetch}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedEvents.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 font-medium">
                    {selectedEvents.length} event(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate('published')}
                      className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-500"
                    >
                      Publish All
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('archived')}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Archive All
                    </button>
                    <button
                      onClick={() => setSelectedEvents([])}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Events Table */}
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-lg overflow-hidden">
            {error && (
              <div className="p-4 bg-red-900/30 border-b border-red-700/30">
                <div className="flex items-center text-red-300">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-800/50">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents(filteredEvents.map(event => event.id))
                          } else {
                            setSelectedEvents([])
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Organizer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-700/30">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-indigo-800/20 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvents(prev => [...prev, event.id])
                            } else {
                              setSelectedEvents(prev => prev.filter(id => id !== event.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {event.image_url ? (
                              <img 
                                src={event.image_url} 
                                alt={event.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{event.name}</div>
                            <div className="text-sm text-indigo-200 line-clamp-1">{event.description}</div>
                            {event.tags && event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-800/50 text-indigo-300">
                                    {tag}
                                  </span>
                                ))}
                                {event.tags.length > 3 && (
                                  <span className="text-xs text-indigo-400">+{event.tags.length - 3} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-indigo-200">
                          {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-indigo-200">
                          <MapPin className="w-4 h-4 mr-1" />
                          {typeof event.location === 'object' && event.location.address 
                            ? event.location.address 
                            : typeof event.location === 'string' 
                              ? event.location 
                              : 'Location TBD'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{event.organizer_name || 'BLKOUT Team'}</div>
                        <div className="text-xs text-indigo-300">{event.source}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Edit event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {event.source_url && (
                            <a
                              href={event.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 transition-colors"
                              title="View source"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
                <p className="text-indigo-200">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'Create your first community event to get started.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Event Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-indigo-900 border border-indigo-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-white heading-block uppercase">
                      {editingEvent ? 'Edit Community Event' : 'Create Community Event'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setEditingEvent(null)
                        setFormData(initialFormData)
                      }}
                      className="text-indigo-400 hover:text-white transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Event Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Event Name</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Community Healing Circle"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Event Date</label>
                          <input
                            type="date"
                            required
                            value={formData.event_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Description</label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Describe your community event..."
                        />
                      </div>
                    </div>

                    {/* Location & Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Location & Contact
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Organizer Name</label>
                          <input
                            type="text"
                            required
                            value={formData.organizer_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, organizer_name: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="BLKOUT Community"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Contact Email</label>
                          <input
                            type="email"
                            value={formData.contact_email}
                            onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="community@blkoutuk.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Location</label>
                        <input
                          type="text"
                          required
                          value={typeof formData.location === 'object' ? formData.location.address : formData.location}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            location: { type: 'physical', address: e.target.value }
                          }))}
                          className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Community Center, London"
                        />
                      </div>
                    </div>

                    {/* Tags & Categories */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Categories & Audience
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Event Tags</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {eventCategories.map(category => (
                            <label key={category} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.tags.includes(category)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({ ...prev, tags: [...prev.tags, category] }))
                                  } else {
                                    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== category) }))
                                  }
                                }}
                                className="mr-2 rounded"
                              />
                              <span className="text-indigo-200 text-sm capitalize">{category.replace('-', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Target Audience</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {targetAudiences.map(audience => (
                            <label key={audience} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.target_audience.includes(audience)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({ ...prev, target_audience: [...prev.target_audience, audience] }))
                                  } else {
                                    setFormData(prev => ({ ...prev, target_audience: prev.target_audience.filter(a => a !== audience) }))
                                  }
                                }}
                                className="mr-2 rounded"
                              />
                              <span className="text-indigo-200 text-sm">{audience}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-yellow-300 border-b border-yellow-600/30 pb-2">
                        Additional Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Price/Cost</label>
                          <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Free / £10 / Pay what you can"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="reviewing">Under Review</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-indigo-200 mb-2">Source</label>
                          <select
                            value={formData.source}
                            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                            className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="manual">Manual Entry</option>
                            <option value="community">Community Submission</option>
                            <option value="eventbrite">Eventbrite</option>
                            <option value="facebook">Facebook</option>
                            <option value="outsavvy">Outsavvy</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-2">Registration Link</label>
                        <input
                          type="url"
                          value={formData.registration_link}
                          onChange={(e) => setFormData(prev => ({ ...prev, registration_link: e.target.value }))}
                          className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://eventbrite.com/..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-indigo-700">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false)
                          setEditingEvent(null)
                          setFormData(initialFormData)
                        }}
                        className="px-6 py-2 border border-indigo-600 text-indigo-200 rounded hover:bg-indigo-800/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded hover:from-emerald-500 hover:to-indigo-500 transition-all flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}