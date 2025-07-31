import React, { useState, useEffect } from 'react'
import { Plus, Settings, Heart, Shield, Mail, LogIn, LogOut, User, Zap, Users, Globe, Rss, BarChart3, Calendar } from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// Use Event type from service
type Event = EventType

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month'
  source: 'all' | string
  location: string
  searchTerm: string
}

import { eventsService, Event as EventType, EventStats } from '../../services/eventsService'

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {event.image && (
        <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            event.status === 'approved' ? 'bg-green-100 text-green-800' :
            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {event.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.date)}</span>
            {event.startTime && (
              <span className="ml-2">at {formatTime(event.startTime)}</span>
            )}
          </div>
          
          {event.location && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
          
          {event.organizer && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{event.organizer}</span>
            </div>
          )}
        </div>
        
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
              >
                {tag}
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
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Learn More
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// Filter Bar Component
const FilterBar: React.FC<{
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}> = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Events
          </label>
          <input
            type="text"
            placeholder="Search by title or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Filter by location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
    </div>
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
    <div className="min-h-screen bg-gray-50">
      <PrimaryNavigationEnhanced />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Community Events
              </h1>
              <p className="text-xl text-gray-600">
                Discover and connect with Black QTIPOC community events
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Backend Status Indicator */}
              <div className="bg-white rounded-lg shadow-md px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    backendStatus === 'connected' ? 'bg-green-500' :
                    backendStatus === 'offline' ? 'bg-red-500' :
                    'bg-yellow-500 animate-pulse'
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {backendStatus === 'connected' ? 'Live Data' :
                     backendStatus === 'offline' ? 'Mock Data' :
                     'Connecting...'}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md px-6 py-4">
                <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Events</div>
              </div>
              <div className="bg-white rounded-lg shadow-md px-6 py-4">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              {filters.searchTerm || filters.location || filters.source !== 'all' || filters.dateRange !== 'all'
                ? 'Try adjusting your filters to see more events.'
                : 'Check back soon for upcoming community events.'
              }
            </p>
          </div>
        )}

        {/* Community Notice */}
        <div className="mt-12 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Building Community Together
            </h3>
            <p className="text-lg text-indigo-100 mb-6">
              These events are curated to support and celebrate Black QTIPOC communities. 
              Join us in creating spaces of liberation, joy, and mutual support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Submit an Event
              </button>
              <button className="bg-transparent border-2 border-indigo-300 hover:bg-indigo-800 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Join Our Community
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <PlatformFooter />
    </div>
  )
}

export default EventsPageIntegrated