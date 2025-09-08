import React, { useState, useEffect } from 'react'
import { searchContent, EventItem } from '../lib/supabase'
import { eventsIntegration, ExternalEvent } from '../services/eventsIntegration'
import SharedLayout from './layout/SharedLayout'

const EventsPage = () => {
  const [events, setEvents] = useState<(EventItem | ExternalEvent)[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showExternal, setShowExternal] = useState(true)
  const [eventSource, setEventSource] = useState<'all' | 'platform' | 'external'>('all')

  const loadEvents = async (query = '') => {
    try {
      setLoading(true)
      let allEvents: (EventItem | ExternalEvent)[] = []

      // Load platform events if requested
      if (eventSource === 'all' || eventSource === 'platform') {
        const platformResults = await searchContent(query, 'event')
        allEvents.push(...platformResults.events.map(event => ({ ...event, source: 'platform' as const })))
      }

      // Load external events if requested
      if ((eventSource === 'all' || eventSource === 'external') && showExternal) {
        const externalEvents = await eventsIntegration.getCombinedEvents({
          search: query,
          includeExternal: true
        })
        allEvents.push(...externalEvents.map(event => ({ ...event, source: 'external' as const })))
      }

      // Sort by date
      allEvents.sort((a, b) => {
        const dateA = new Date(a.date || a.event_date || '').getTime()
        const dateB = new Date(b.date || b.event_date || '').getTime()
        return dateA - dateB
      })

      setEvents(allEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents(searchQuery)
  }, [eventSource])

  useEffect(() => {
    loadEvents()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadEvents(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-4">📅 Community Events</h1>
          <p className="text-xl text-gray-300 text-center mb-8">
            Activism, community gatherings, and liberation events
          </p>
          
          {/* Event Source Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-700 rounded-lg p-1 flex space-x-1">
              <button
                onClick={() => setEventSource('all')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  eventSource === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setEventSource('platform')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  eventSource === 'platform' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Platform Events
              </button>
              <button
                onClick={() => setEventSource('external')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  eventSource === 'external' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Community Calendar
              </button>
            </div>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Events */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center">
            <div className="text-xl">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center">
            <div className="text-xl text-gray-400">
              {searchQuery ? `No events found for "${searchQuery}"` : 'No events published yet'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold line-clamp-2 flex-1">{event.title}</h2>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-gray-400">
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.event_date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="text-sm text-gray-400 space-y-2">
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">📍 Location:</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.organizer && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Organized by:</span>
                        <span>{event.organizer}</span>
                      </div>
                    )}
                    
                    {event.source_url && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">More info:</span>
                        <a 
                          href={event.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 truncate"
                        >
                          View Original
                        </a>
                      </div>
                    )}
                    
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Event status indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Published {new Date(event.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        new Date(event.event_date) > new Date() 
                          ? 'bg-green-600 text-green-100' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Past Event'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Platform</a>
        </div>
      </div>
    </div>
  )
}

export default EventsPage