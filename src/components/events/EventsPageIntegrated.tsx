import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Settings, Heart, Shield, Mail, LogIn, LogOut, User, Zap, Users, Globe, Rss, BarChart3, Calendar, ArrowRight } from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import { eventsService, Event as EventType, EventStats } from '../../services/eventsService'

// Use Event type from service
type Event = EventType

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month'
  source: 'all' | string
  location: string
  searchTerm: string
}

// Event Card Component
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <motion.div 
      className="bg-yellow-800/20 backdrop-blur-sm border border-yellow-600/30 rounded-2xl overflow-hidden hover:bg-yellow-800/30 hover:border-yellow-500/50 transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {event.image && (
        <div className="h-48 bg-gradient-to-br from-yellow-600 to-amber-500"></div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-yellow-100 line-clamp-2 group-hover:text-yellow-50 transition-colors">
            {event.title}
          </h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            event.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            event.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
            'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {event.status}
          </span>
        </div>
        
        <p className="text-yellow-200 mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-yellow-300">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
            <span>{formatDate(event.date)}</span>
            {event.startTime && (
              <span className="ml-2">at {formatTime(event.startTime)}</span>
            )}
          </div>
          
          {event.location && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
          
          {event.organizer && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-yellow-400" />
              <span>{event.organizer}</span>
            </div>
          )}
          
          {event.cost && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{event.cost}</span>
            </div>
          )}
        </div>
        
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-yellow-600/30 text-yellow-200 rounded-full border border-yellow-500/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {event.url && (
          <div className="mt-4">
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors group"
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Filter Bar Component
const FilterBar: React.FC<{
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}> = ({ filters, onFiltersChange }) => {
  return (
    <motion.div 
      className="bg-yellow-800/20 backdrop-blur-sm border border-yellow-600/30 rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-yellow-200 mb-2">
            Search Events
          </label>
          <input
            type="text"
            placeholder="Search by title or description..."
            className="w-full px-4 py-3 bg-yellow-900/30 border border-yellow-600/40 rounded-lg text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-yellow-200 mb-2">
            Date Range
          </label>
          <select
            className="w-full px-4 py-3 bg-yellow-900/30 border border-yellow-600/40 rounded-lg text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={filters.dateRange}
            onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-yellow-200 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Filter by location..."
            className="w-full px-4 py-3 bg-yellow-900/30 border border-yellow-600/40 rounded-lg text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-yellow-200 mb-2">
            Source
          </label>
          <select
            className="w-full px-4 py-3 bg-yellow-900/30 border border-yellow-600/40 rounded-lg text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={filters.source}
            onChange={(e) => onFiltersChange({ ...filters, source: e.target.value })}
          >
            <option value="all">All Sources</option>
            <option value="community">Community</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="activism">Activism</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

// Main Events Page Component
const EventsPageIntegrated: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    source: 'all',
    location: '',
    searchTerm: ''
  })

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        
        // Check backend health first
        const healthCheck = await eventsService.checkBackendHealth()
        setBackendStatus(healthCheck.available ? 'connected' : 'offline')
        
        // Load events and stats
        const [eventsData, statsData] = await Promise.all([
          eventsService.getAllEvents(),
          eventsService.getEventStats()
        ])
        setEvents(eventsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading events:', error)
        setBackendStatus('offline')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Filter events when filters change
  useEffect(() => {
    let filtered = events.filter(event => event.status === 'approved')

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(locationLower)
      )
    }

    // Apply source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(event => event.source === filters.source)
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        
        switch (filters.dateRange) {
          case 'today':
            return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            return eventDate >= today && eventDate <= weekFromNow
          case 'month':
            const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
            return eventDate >= today && eventDate <= monthFromNow
          default:
            return true
        }
      })
    }

    setFilteredEvents(filtered)
  }, [events, filters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-yellow-900 to-amber-900">
      <PrimaryNavigationEnhanced />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-5xl font-black heading-block mb-4 uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                  Community Events
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-yellow-100 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Liberation through connection • Discover Black QTIPOC community events
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Backend Status Indicator */}
              <div className="bg-yellow-800/30 backdrop-blur-sm border border-yellow-600/30 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    backendStatus === 'connected' ? 'bg-emerald-400' :
                    backendStatus === 'offline' ? 'bg-red-400' :
                    'bg-yellow-400 animate-pulse'
                  }`}></div>
                  <span className="text-xs text-yellow-200">
                    {backendStatus === 'connected' ? 'Live Data' :
                     backendStatus === 'offline' ? 'Mock Data' :
                     'Connecting...'}
                  </span>
                </div>
              </div>
              
              <div className="bg-yellow-800/30 backdrop-blur-sm border border-yellow-600/30 rounded-lg px-6 py-4">
                <div className="text-2xl font-bold text-yellow-300">{stats.total}</div>
                <div className="text-sm text-yellow-200">Total Events</div>
              </div>
              <div className="bg-yellow-800/30 backdrop-blur-sm border border-yellow-600/30 rounded-lg px-6 py-4">
                <div className="text-2xl font-bold text-emerald-400">{stats.approved}</div>
                <div className="text-sm text-yellow-200">Approved</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-yellow-800/20 backdrop-blur-sm border border-yellow-600/30 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-yellow-700/30"></div>
                <div className="p-6">
                  <div className="h-6 bg-yellow-700/30 rounded mb-3"></div>
                  <div className="h-4 bg-yellow-700/30 rounded mb-2"></div>
                  <div className="h-4 bg-yellow-700/30 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-yellow-800/20 backdrop-blur-sm border border-yellow-600/30 rounded-2xl p-12 max-w-md mx-auto">
              <Calendar className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-yellow-100 mb-4">No events found</h3>
              <p className="text-yellow-200">
                {filters.searchTerm || filters.location || filters.source !== 'all' || filters.dateRange !== 'all'
                  ? 'Try adjusting your filters to discover more community events.'
                  : 'Check back soon for upcoming Black QTIPOC community events.'
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Community Notice */}
        <motion.div 
          className="mt-16 bg-gradient-to-br from-amber-900 via-yellow-900 to-yellow-800 rounded-2xl p-8 border border-yellow-600/30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Heart className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            </motion.div>
            <motion.h3 
              className="text-3xl font-black heading-block mb-6 uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <span className="bg-gradient-to-r from-yellow-300 to-amber-200 bg-clip-text text-transparent">
                Building Community Together
              </span>
            </motion.h3>
            <motion.p 
              className="text-lg text-yellow-100 mb-8 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              These events are curated to support and celebrate Black QTIPOC communities. 
              Join us in creating spaces of liberation, joy, and collective power.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-yellow-950 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Submit an Event
              </button>
              <button className="bg-transparent border-2 border-yellow-400 hover:bg-yellow-400/10 text-yellow-100 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                Join Our Community
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <PlatformFooter />
    </div>
  )
}

export default EventsPageIntegrated