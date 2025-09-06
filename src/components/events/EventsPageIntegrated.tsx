import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Settings, Heart, Shield, Mail, LogIn, LogOut, User, Zap, Users, Globe, Rss, BarChart3, Calendar, ArrowRight, AlertCircle, RefreshCw, WifiOff, X, CheckCircle } from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import PageLoadingDebug from '../debug/PageLoadingDebug'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { useEvents } from '../../hooks/useSupabase'
import type { Event } from '../../types/supabase'

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month'
  source: 'all' | string
  location: string
  searchTerm: string
}

interface EventSubmissionFormData {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  email: string
  url: string
  tags: string
}

interface ContactFormData {
  name: string
  email: string
  message: string
  subject: string
}

// Event Detail Modal Component
const EventDetailModal: React.FC<{ 
  event: Event | null
  isOpen: boolean
  onClose: () => void 
}> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-yellow-900/90 backdrop-blur-sm border border-yellow-600/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-yellow-100">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-yellow-400 hover:text-yellow-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-yellow-200 mb-3">Event Details</h3>
            <p className="text-yellow-100 leading-relaxed">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-yellow-200">
                <Calendar className="w-5 h-5 mr-3 text-yellow-400" />
                <div>
                  <div className="font-semibold">{formatDate(event.date)}</div>
                  {event.startTime && (
                    <div className="text-sm">
                      {formatTime(event.startTime)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
                    </div>
                  )}
                </div>
              </div>

              {event.location && (
                <div className="flex items-center text-yellow-200">
                  <svg className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              )}

              {event.organizer && (
                <div className="flex items-center text-yellow-200">
                  <User className="w-5 h-5 mr-3 text-yellow-400" />
                  <span>{event.organizer}</span>
                </div>
              )}

              {event.cost && (
                <div className="flex items-center text-yellow-200">
                  <svg className="w-5 h-5 mr-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{event.cost}</span>
                </div>
              )}
            </div>

            <div>
              {event.tags && event.tags.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-yellow-200 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-yellow-600/40 text-yellow-100 rounded-full border border-yellow-500/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {event.url && (
            <div className="pt-4 border-t border-yellow-600/30">
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors group"
              >
                Visit Event Page
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Event Card Component
const EventCard: React.FC<{ 
  event: Event
  onClick: (event: Event) => void 
}> = ({ event, onClick }) => {
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
      className="bg-yellow-800/20 backdrop-blur-sm border border-yellow-600/30 rounded-2xl overflow-hidden hover:bg-yellow-800/30 hover:border-yellow-500/50 transition-all duration-300 group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={() => onClick(event)}
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
  // Use Supabase hook instead of eventsService
  const { events, loading, error } = useEvents({ status: 'approved' }) // Only show approved events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [retryCount, setRetryCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  const { error: handlerError, hasError, handleAPIError, clearError, retry } = useErrorHandler({
    showToast: true,
    retryable: true
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [eventSubmissionStatus, setEventSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    source: 'all',
    location: '',
    searchTerm: ''
  })
  const [eventFormData, setEventFormData] = useState<EventSubmissionFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    organizer: '',
    email: '',
    url: '',
    tags: ''
  })
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry'
  })

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleEventSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventFormData.title || !eventFormData.description || !eventFormData.date || !eventFormData.organizer || !eventFormData.email) return
    
    setEventSubmissionStatus('submitting')
    
    try {
      // Simulate API call - in production, this would call a real event submission endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validate email format
      if (!eventFormData.email.includes('@') || !eventFormData.email.includes('.')) {
        throw new Error('Please enter a valid email address')
      }
      
      setEventSubmissionStatus('success')
      setStatusMessage('Event submitted successfully! We\'ll review it and get back to you soon.')
      
      // Reset form
      setEventFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        organizer: '',
        email: '',
        url: '',
        tags: ''
      })
      
      setTimeout(() => {
        setShowEventForm(false)
        setEventSubmissionStatus('idle')
        setStatusMessage('')
      }, 3000)
    } catch (error) {
      setEventSubmissionStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Failed to submit event. Please try again.')
      setTimeout(() => setEventSubmissionStatus('idle'), 3000)
    }
  }

  const handleContactSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) return
    
    setContactStatus('submitting')
    
    try {
      // Simulate API call - in production, this would call a real contact endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validate email format
      if (!contactFormData.email.includes('@') || !contactFormData.email.includes('.')) {
        throw new Error('Please enter a valid email address')
      }
      
      setContactStatus('success')
      setStatusMessage('Message sent successfully! We\'ll get back to you soon.')
      
      // Reset form
      setContactFormData({
        name: '',
        email: '',
        message: '',
        subject: 'General Inquiry'
      })
      
      setTimeout(() => {
        setShowContactForm(false)
        setContactStatus('idle')
        setStatusMessage('')
      }, 3000)
    } catch (error) {
      setContactStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
      setTimeout(() => setContactStatus('idle'), 3000)
    }
  }

  // Calculate stats from loaded events (published events only)
  useEffect(() => {
    if (events) {
      setStats({
        pending: 0, // Not relevant for frontend
        approved: events.length, // All loaded events are published/approved
        rejected: 0, // Not relevant for frontend  
        total: events.length
      })
    }
  }, [events])

  
  const handleRetry = () => {
    // Hook will automatically retry on re-render
    clearError()
  }

  // Filter events when filters change
  useEffect(() => {
    let filtered = events // All events are already published

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
    <ErrorBoundary>
      <PageLoadingDebug 
        pageName="Events"
        dependencies={['Supabase', 'Events Service']}
      />
      <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-yellow-900 to-amber-900">
        <PrimaryNavigationEnhanced />

        {/* Community Faces Overlay */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 pointer-events-none z-10 border-4 border-yellow-400">
          <img 
            src="/face-cycling.gif"
            alt="Community faces cycling"
            className="w-full h-full object-contain filter drop-shadow-2xl opacity-95 border-2 border-red-500"
            loading="lazy"
            onError={(e) => {
              console.error('Events page: Failed to load face-cycling.gif:', e);
              e.currentTarget.style.border = '2px solid red';
              e.currentTarget.alt = 'GIF FAILED TO LOAD';
            }}
            onLoad={() => console.log('Events page: face-cycling.gif loaded successfully')}
          />
        </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pl-72">
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
                  {backendStatus === 'checking' ? (
                    <LoadingSpinner size="sm" color="yellow" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${
                      backendStatus === 'connected' ? 'bg-emerald-400' : 'bg-red-400'
                    }`}></div>
                  )}
                  <span className="text-xs text-yellow-200">
                    {backendStatus === 'connected' ? 'Live Data' :
                     backendStatus === 'offline' ? 'Mock Data' :
                     'Connecting...'}
                  </span>
                  {lastUpdated && backendStatus === 'connected' && (
                    <span className="text-xs text-yellow-300 ml-2">
                      • {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
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

        {/* Error Display */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/30 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-red-300 font-bold text-lg mb-2">Connection Error</h3>
                  <p className="text-red-200 mb-4">{error?.message}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleRetry}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Connection
                    </button>
                    <button
                      onClick={clearError}
                      className="text-red-300 hover:text-red-200 font-medium"
                    >
                      Dismiss
                    </button>
                    {retryCount > 0 && (
                      <span className="text-red-300 text-sm">
                        Retry attempts: {retryCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Mock Data Notice */}
        {backendStatus === 'offline' && !hasError && (
          <motion.div 
            className="bg-amber-900/40 backdrop-blur-sm border border-amber-600/40 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <WifiOff className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-bold heading-block text-sm uppercase">
                  SHOWING EXAMPLE COMMUNITY EVENTS
                </span>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry Connection
              </button>
            </div>
            <p className="text-amber-100 leading-relaxed">
              These are example events to demonstrate functionality. The community events backend is not currently connected. 
              Real community events will be displayed when the events API is available.
            </p>
          </motion.div>
        )}

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Events Grid */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <LoadingSpinner size="xl" color="yellow" text="Loading Events" />
            <p className="text-yellow-200 font-light mt-6">
              Fetching the latest community events and gatherings...
            </p>
          </motion.div>
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
                <EventCard event={event} onClick={handleEventClick} />
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
              <button 
                onClick={() => setShowEventForm(true)}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-yellow-950 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Submit an Event
              </button>
              <button 
                onClick={() => setShowContactForm(true)}
                className="bg-transparent border-2 border-yellow-400 hover:bg-yellow-400/10 text-yellow-100 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
        <PlatformFooter />

        {/* Event Detail Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <EventDetailModal
              event={selectedEvent}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          )}
        </AnimatePresence>

        {/* Event Submission Modal */}
        <AnimatePresence>
          {showEventForm && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEventForm(false)}
            >
              <motion.div
                className="bg-yellow-900/90 backdrop-blur-sm border border-yellow-600/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white heading-block uppercase">
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                      Submit Your Event
                    </span>
                  </h2>
                  <button
                    onClick={() => setShowEventForm(false)}
                    className="text-yellow-400 hover:text-yellow-300 text-2xl"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleEventSubmission} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={eventFormData.title}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Organizer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={eventFormData.organizer}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, organizer: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Your name or organization"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-200 mb-2">
                      Event Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Describe your event..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={eventFormData.date}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={eventFormData.startTime}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={eventFormData.endTime}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={eventFormData.location}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Event location or 'Online'"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={eventFormData.email}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Event URL
                      </label>
                      <input
                        type="url"
                        value={eventFormData.url}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="https://example.com/event"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-200 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={eventFormData.tags}
                        onChange={(e) => setEventFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="community, social, wellbeing"
                      />
                    </div>
                  </div>

                  {/* Status Messages */}
                  {eventSubmissionStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-900/40 border border-emerald-600/40 rounded-lg p-4 flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-emerald-200">{statusMessage}</span>
                    </motion.div>
                  )}
                  {eventSubmissionStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/40 border border-red-600/40 rounded-lg p-4 flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                      <span className="text-red-200">{statusMessage}</span>
                    </motion.div>
                  )}

                  <div className="flex justify-end space-x-4 pt-6 border-t border-yellow-600/30">
                    <button
                      type="button"
                      onClick={() => setShowEventForm(false)}
                      className="px-6 py-3 text-yellow-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={eventSubmissionStatus === 'submitting'}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold hover:from-yellow-500 hover:to-amber-500 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {eventSubmissionStatus === 'submitting' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Event'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Modal */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactForm(false)}
            >
              <motion.div
                className="bg-yellow-900/90 backdrop-blur-sm border border-yellow-600/40 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white heading-block uppercase">
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                      Contact Events Team
                    </span>
                  </h2>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-yellow-400 hover:text-yellow-300 text-2xl"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleContactSubmission} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-200 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-200 mb-2">
                      Subject
                    </label>
                    <select
                      value={contactFormData.subject}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Event Partnership">Event Partnership</option>
                      <option value="Venue Suggestion">Venue Suggestion</option>
                      <option value="Event Feedback">Event Feedback</option>
                      <option value="Technical Issue">Technical Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-200 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={contactFormData.message}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-yellow-800/30 border border-yellow-600/40 rounded-lg text-white placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Status Messages */}
                  {contactStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-900/40 border border-emerald-600/40 rounded-lg p-4 flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-emerald-200">{statusMessage}</span>
                    </motion.div>
                  )}
                  {contactStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/40 border border-red-600/40 rounded-lg p-4 flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                      <span className="text-red-200">{statusMessage}</span>
                    </motion.div>
                  )}

                  <div className="flex justify-end space-x-4 pt-6 border-t border-yellow-600/30">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-6 py-3 text-yellow-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={contactStatus === 'submitting'}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold hover:from-yellow-500 hover:to-amber-500 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {contactStatus === 'submitting' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-yellow-600/30">
                  <p className="text-yellow-200 text-sm text-center mb-4">
                    You can also reach us directly:
                  </p>
                  <div className="text-center space-y-2">
                    <a
                      href="mailto:events@blkoutuk.com"
                      className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center justify-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      events@blkoutuk.com
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

export default EventsPageIntegrated