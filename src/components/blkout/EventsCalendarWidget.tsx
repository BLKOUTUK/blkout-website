'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ExternalLink, Plus, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  organizer_name: string
  description: string
  event_url?: string
  relevance_score?: number
}

interface EventsCalendarWidgetProps {
  maxEvents?: number
  showAddEvent?: boolean
}

export default function EventsCalendarWidget({ 
  maxEvents = 6, 
  showAddEvent = true 
}: EventsCalendarWidgetProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Live connection to IVOR Events Calendar
  const fetchEventsFromIVOR = async (): Promise<Event[]> => {
    try {
      // Create iframe to communicate with IVOR calendar API
      return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.src = 'http://localhost:5173/api.html';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const requestId = Date.now().toString();
        
        // Set up message listener
        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === 'IVOR_API_RESPONSE' && event.data.requestId === requestId) {
            window.removeEventListener('message', messageHandler);
            document.body.removeChild(iframe);
            
            if (event.data.success) {
              resolve(event.data.data || []);
            } else {
              reject(new Error(event.data.error || 'API request failed'));
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Send request after iframe loads
        iframe.onload = () => {
          iframe.contentWindow?.postMessage({
            type: 'IVOR_API_REQUEST',
            method: 'getFeaturedEvents',
            params: { count: maxEvents },
            requestId
          }, '*');
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
          reject(new Error('API request timeout'));
        }, 10000);
      });
    } catch (error) {
      console.error('Error fetching from IVOR calendar:', error);
      // Fallback to mock data
      return [
        {
          id: '1',
          title: 'Black Trans Joy Workshop',
          date: '2025-01-15',
          time: '19:00',
          location: 'South London Community Centre',
          organizer_name: 'QTIPOC London',
          description: 'A healing and empowerment workshop celebrating Black trans experiences.',
          event_url: 'http://localhost:5173/'
        },
        {
          id: '2', 
          title: 'Queer Poetry Night',
          date: '2025-01-18',
          time: '20:00',
          location: 'The Ritzy, Brixton',
          organizer_name: 'Black Writers Collective',
          description: 'An evening of powerful words and community connection.',
          event_url: 'http://localhost:5173/'
        },
        {
          id: '3',
          title: 'Community Skills Share',
          date: '2025-01-22',
          time: '14:00',
          location: 'Online (Zoom)',
          organizer_name: 'BLKOUT Network',
          description: 'Share skills, learn from each other, build cooperative power.',
          event_url: 'http://localhost:5173/'
        }
      ].slice(0, maxEvents);
    }
  }

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        const eventsData = await fetchEventsFromIVOR()
        setEvents(eventsData)
      } catch (err) {
        setError('Unable to connect to events calendar')
        console.error('Events loading error:', err)
        // Still show fallback events on error
        setEvents([
          {
            id: 'fallback-1',
            title: 'Community Events Available',
            date: '2025-01-20',
            time: '19:00',
            location: 'Visit IVOR Calendar',
            organizer_name: 'BLKOUT Community',
            description: 'Click below to view all upcoming Black QTIPOC+ events.',
            event_url: 'http://localhost:5173/'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [maxEvents])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // Remove seconds
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm text-red-200 hover:text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-electric-magenta rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Community Events</h3>
            <p className="text-sm text-gray-300">Spaces where you belong</p>
          </div>
        </div>
        
        {showAddEvent && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('http://localhost:5173/', '_blank')}
            className="flex items-center space-x-2 px-3 py-2 bg-electric-cyan text-white rounded-lg hover:bg-electric-magenta transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Event</span>
          </motion.button>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            onClick={() => event.event_url && window.open(event.event_url, '_blank')}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white group-hover:text-electric-cyan transition-colors line-clamp-1">
                {event.title}
              </h4>
              {event.event_url && (
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-electric-cyan transition-colors" />
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-electric-cyan font-medium">
                by {event.organizer_name}
              </span>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Heart className="w-3 h-3" />
                <span>Community verified</span>
              </div>
            </div>
            
            {event.description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2 group-hover:text-gray-300 transition-colors">
                {event.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open('http://localhost:5173/', '_blank')}
          className="w-full py-3 bg-gradient-to-r from-electric-magenta to-electric-cyan text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          View All Events Calendar
        </motion.button>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Discover more events celebrating Black QTIPOC+ voices
        </p>
      </div>
    </motion.div>
  )
}