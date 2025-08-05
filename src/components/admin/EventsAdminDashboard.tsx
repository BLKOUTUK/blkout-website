'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Plus, Edit3, Trash2, Eye, Users, MapPin, 
  Clock, Filter, Search, CheckCircle, XCircle, AlertCircle,
  Download, Upload, Settings, BarChart3, TrendingUp
} from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  location: {
    type: 'physical' | 'virtual' | 'hybrid'
    address?: string
    url?: string
    coordinates?: { lat: number, lng: number }
  }
  organizer: string
  category: string
  tags: string[]
  capacity: number
  rsvps: number
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  featured: boolean
  image?: string
  createdAt: string
  updatedAt: string
  sourceUrl?: string
  submittedVia?: string
}

interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  duration: number
  locationType: 'physical' | 'virtual' | 'hybrid'
  address: string
  url: string
  organizer: string
  category: string
  tags: string
  capacity: number
  featured: boolean
  image: string
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  date: '',
  time: '',
  duration: 120,
  locationType: 'physical',
  address: '',
  url: '',
  organizer: '',
  category: 'Community',
  tags: '',
  capacity: 50,
  featured: false,
  image: ''
}

const eventCategories = [
  'Community', 'Wellness', 'Education', 'Arts & Culture', 
  'Activism', 'Social', 'Professional Development', 'Support Group'
]

export default function EventsAdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Load events from backend
  useEffect(() => {
    loadEvents()
  }, [])

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter)
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, statusFilter, categoryFilter])

  const loadEvents = async () => {
    try {
      const response = await fetch('https://events-deploy.vercel.app/api/events')
      const data = await response.json()
      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Failed to load events:', error)
      // Use sample data for demo
      setEvents([
        {
          id: '1',
          title: 'Community Healing Circle',
          description: 'A safe space for collective healing and support.',
          date: '2025-02-15',
          time: '18:00',
          duration: 120,
          location: { type: 'physical', address: 'Community Center, London' },
          organizer: 'BLKOUT Healing Collective',
          category: 'Wellness',
          tags: ['healing', 'community', 'support'],
          capacity: 25,
          rsvps: 18,
          status: 'published',
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        location: {
          type: formData.locationType,
          address: formData.address || undefined,
          url: formData.url || undefined
        },
        organizer: formData.organizer,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        capacity: formData.capacity,
        featured: formData.featured
      }

      console.log('Submitting event data:', eventData)

      if (editingEvent) {
        // Update existing event
        const response = await fetch(`/api/events?id=${editingEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Event updated:', result)
        
        // Refresh events list
        loadEvents()
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Event created:', result)
        
        // Refresh events list
        loadEvents()
      }

      // Reset form
      setFormData(initialFormData)
      setEditingEvent(null)
      setShowForm(false)
      
      alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
    } catch (error) {
      console.error('Failed to save event:', error)
      alert('Failed to save event. Please try again.')
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      locationType: event.location.type,
      address: event.location.address || '',
      url: event.location.url || '',
      organizer: event.organizer,
      category: event.category,
      tags: event.tags.join(', '),
      capacity: event.capacity,
      featured: event.featured,
      image: event.image || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId))
    }
  }

  const handleStatusChange = async (eventId: string, newStatus: Event['status']) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, status: newStatus, updatedAt: new Date().toISOString() } : event
    ))
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-900/20'
      case 'draft': return 'text-yellow-400 bg-yellow-900/20'
      case 'cancelled': return 'text-red-400 bg-red-900/20'
      case 'completed': return 'text-blue-400 bg-blue-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const stats = {
    total: events.length,
    published: events.filter(e => e.status === 'published').length,
    draft: events.filter(e => e.status === 'draft').length,
    totalRSVPs: events.reduce((sum, e) => sum + e.rsvps, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-200">Loading Events Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="bg-indigo-900/50 backdrop-blur-sm border-b border-indigo-700/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white heading-block uppercase">
                Events Admin Dashboard
              </h1>
              <p className="text-indigo-200 mt-2">Manage community events and gatherings</p>
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

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-black text-white">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          
          <div className="bg-green-900/30 backdrop-blur-sm border border-green-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Published</p>
                <p className="text-3xl font-black text-white">{stats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Drafts</p>
                <p className="text-3xl font-black text-white">{stats.draft}</p>
              </div>
              <Edit3 className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-violet-900/30 backdrop-blur-sm border border-violet-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-200 text-sm font-medium">Total RSVPs</p>
                <p className="text-3xl font-black text-white">{stats.totalRSVPs}</p>
              </div>
              <Users className="w-8 h-8 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
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
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
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
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">RSVPs</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-700/30">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-indigo-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{event.title}</div>
                          <div className="text-sm text-indigo-200">{event.category}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {event.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                                Featured
                              </span>
                            )}
                            {event.submittedVia === 'chrome-extension' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400">
                                📤 Extension
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-sm text-indigo-200">{event.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-indigo-200">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location.type === 'physical' ? 'In-person' : 
                         event.location.type === 'virtual' ? 'Virtual' : 'Hybrid'}
                      </div>
                      <div className="text-xs text-indigo-300">
                        {event.location.address || event.location.url || 'Location TBD'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {event.submittedVia === 'chrome-extension' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400">📤 Extension</span>
                            {event.sourceUrl && (
                              <a 
                                href={event.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-300 hover:text-indigo-200 truncate max-w-24"
                                title={event.sourceUrl}
                              >
                                {new URL(event.sourceUrl).hostname}
                              </a>
                            )}
                          </div>
                        ) : event.submittedVia === 'bulk-test' ? (
                          <span className="text-yellow-400">🧪 Bulk Test</span>
                        ) : (
                          <span className="text-indigo-300">✍️ Manual</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{event.rsvps}/{event.capacity}</div>
                      <div className="w-full bg-indigo-800 rounded-full h-2 mt-1">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${(event.rsvps / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={event.status}
                        onChange={(e) => handleStatusChange(event.id, e.target.value as Event['status'])}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(event.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
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
              <p className="text-indigo-200">Create your first event to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-indigo-900 border border-indigo-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white heading-block uppercase">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Event Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {eventCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
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
                    placeholder="Describe your event"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      required
                      min="30"
                      max="480"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Location Type</label>
                  <div className="flex gap-4 mb-4">
                    {['physical', 'virtual', 'hybrid'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="locationType"
                          value={type}
                          checked={formData.locationType === type}
                          onChange={(e) => setFormData(prev => ({ ...prev, locationType: e.target.value as any }))}
                          className="mr-2"
                        />
                        <span className="text-indigo-200 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                  
                  {(formData.locationType === 'physical' || formData.locationType === 'hybrid') && (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                      placeholder="Physical address"
                    />
                  )}
                  
                  {(formData.locationType === 'virtual' || formData.locationType === 'hybrid') && (
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Virtual meeting URL"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Organizer</label>
                    <input
                      type="text"
                      required
                      value={formData.organizer}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Event organizer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="1000"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="healing, community, support"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-indigo-200">Featured Event</label>
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
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded hover:from-emerald-500 hover:to-indigo-500 transition-all"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}