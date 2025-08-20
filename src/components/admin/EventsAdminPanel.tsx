// Events Admin Panel with Supabase CRUD Operations
// Allows admin users to manage events, moderate submissions, and view analytics

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit3, Trash2, CheckCircle, XCircle, Clock, 
  Calendar, MapPin, Users, TrendingUp, Filter, Search,
  Save, X, Upload, Link, Tag, User, AlertCircle
} from 'lucide-react'
import { eventsService, type Event, type EventStats } from '../../services/eventsService'
import { supabaseHelpers } from '../../lib/supabase'

interface AdminPanelProps {
  onClose?: () => void
}

interface EventFormData {
  id?: string
  title: string
  description: string
  date: string
  startTime?: string
  endTime?: string
  location: string
  url?: string
  source: string
  organizer?: string
  cost?: string
  tags: string[]
  image?: string
  status: 'pending' | 'approved' | 'rejected'
}

const SOURCES = ['community', 'eventbrite', 'facebook', 'outsavvy', 'manual']

const EventsAdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<EventStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState({ supabase: false, legacy: false, primary: 'fallback' })

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    source: 'community',
    tags: [],
    status: 'pending'
  })

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await supabaseHelpers.getCurrentUser()
      setIsAuthenticated(!!user)
      
      if (!user) {
        console.warn('Admin panel requires authentication')
        return
      }

      await loadData()
    }

    checkAuth()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Get connection status
      const connStatus = eventsService.getConnectionStatus()
      setConnectionStatus(connStatus)
      
      // Load events and stats
      const [eventsData, statsData] = await Promise.all([
        eventsService.getAllEvents(),
        eventsService.getEventStats()
      ])
      
      setEvents(eventsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!connectionStatus.supabase) {
      alert('Event creation requires Supabase connection')
      return
    }

    try {
      await eventsService.submitEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        url: formData.url,
        source: formData.source,
        organizer: formData.organizer,
        cost: formData.cost,
        tags: formData.tags,
        image: formData.image
      })
      
      resetForm()
      await loadData()
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event')
    }
  }

  const handleUpdateEvent = async () => {
    if (!editingEvent || !connectionStatus.supabase) {
      alert('Event updates require Supabase connection')
      return
    }

    try {
      await eventsService.updateEvent(editingEvent.id, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        url: formData.url,
        organizer: formData.organizer,
        cost: formData.cost,
        tags: formData.tags,
        image: formData.image
      })
      
      resetForm()
      await loadData()
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!connectionStatus.supabase) {
      alert('Event deletion requires Supabase connection')
      return
    }

    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await eventsService.deleteEvent(eventId)
      await loadData()
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  const handleStatusChange = async (eventId: string, status: 'pending' | 'approved' | 'rejected') => {
    if (!connectionStatus.supabase) {
      alert('Status updates require Supabase connection')
      return
    }

    try {
      await eventsService.updateEventStatus(eventId, status)
      await loadData()
    } catch (error) {
      console.error('Error updating event status:', error)
      alert('Failed to update event status')
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      url: event.url,
      source: event.source,
      organizer: event.organizer,
      cost: event.cost,
      tags: event.tags || [],
      image: event.image,
      status: event.status as any
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      source: 'community',
      tags: [],
      status: 'pending'
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-yellow-900 to-amber-900 flex items-center justify-center">
        <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 rounded-2xl p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white text-center mb-4">Authentication Required</h2>
          <p className="text-yellow-200 text-center mb-6">
            Please sign in to access the events admin panel.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-yellow-900 to-amber-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black heading-block text-white mb-2 uppercase">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Events Admin
              </span>
            </h1>
            <p className="text-yellow-200">Manage community events and moderate submissions</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus.supabase ? 'bg-emerald-400' :
                  connectionStatus.legacy ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs text-yellow-200 uppercase">
                  {connectionStatus.primary} Connection
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Event
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 text-yellow-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm uppercase tracking-wider">Total Events</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm uppercase tracking-wider">Approved</p>
                <p className="text-3xl font-bold text-white">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm uppercase tracking-wider">Rejected</p>
                <p className="text-3xl font-bold text-white">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Events</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-yellow-200">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <p className="text-yellow-200">No events found</p>
            </div>
          ) : (
            <div className="divide-y divide-yellow-700/30">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-6 hover:bg-yellow-800/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          event.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                          event.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {event.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-yellow-600/30 text-yellow-200 rounded-full">
                          {event.source}
                        </span>
                      </div>
                      
                      <p className="text-yellow-200 mb-3">{event.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-yellow-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                          {event.startTime && ` at ${event.startTime}`}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                        {event.organizer && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {event.organizer}
                          </div>
                        )}
                        {event.cost && (
                          <div className="flex items-center">
                            <span className="w-4 h-4 mr-1">💰</span>
                            {event.cost}
                          </div>
                        )}
                      </div>
                      
                      {event.tags && event.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-yellow-600/30 text-yellow-200 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      {event.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(event.id, 'approved')}
                            className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600/30 rounded-lg transition-colors"
                            title="Approve event"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(event.id, 'rejected')}
                            className="p-2 text-red-400 hover:text-white hover:bg-red-600/30 rounded-lg transition-colors"
                            title="Reject event"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 text-yellow-400 hover:text-white hover:bg-yellow-600/30 rounded-lg transition-colors"
                        title="Edit event"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-600/30 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-yellow-900/90 backdrop-blur-sm border border-yellow-700/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-yellow-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Event title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Description *
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        placeholder="Event description..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Event location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-yellow-200 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-yellow-200 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          value={formData.startTime || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-yellow-200 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          value={formData.endTime || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-yellow-200 mb-2">
                          Source
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          value={formData.source}
                          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                        >
                          {SOURCES.map(source => (
                            <option key={source} value={source}>{source}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-yellow-200 mb-2">
                          Cost
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g., Free, £10, Sliding scale"
                          value={formData.cost || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Organizer
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Organizer name"
                        value={formData.organizer || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Event URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="https://example.com/event"
                        value={formData.url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Press Enter or comma to add tags"
                        onKeyDown={handleTagInput}
                      />
                      {formData.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-full text-sm"
                            >
                              #{tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-yellow-400 hover:text-white"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-yellow-700/30">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 text-yellow-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                    disabled={!formData.title || !formData.description || !formData.date || !formData.location}
                    className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EventsAdminPanel