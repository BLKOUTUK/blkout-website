/**
 * Live Events Activity Feed Component
 * Shows real-time community activity across UK Black queer organizing
 * Displays breadth and depth of community events, actions, and celebrations
 */

import React, { useState, useEffect } from 'react'
import { format, parseISO, isToday, isTomorrow, isWithinInterval, addHours } from 'date-fns'
import liveEventsService, { LiveEvent, CommunityActivityMetrics } from '../services/liveEventsService'
import StoryDisclaimerBanner from './StoryDisclaimerBanner'

interface LiveEventsActivityFeedProps {
  maxEvents?: number
  showMetrics?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

const LiveEventsActivityFeed: React.FC<LiveEventsActivityFeedProps> = ({
  maxEvents = 15,
  showMetrics = true,
  autoRefresh = true,
  refreshInterval = 60000 // 1 minute
}) => {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [metrics, setMetrics] = useState<CommunityActivityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterLocation, setFilterLocation] = useState<string>('all')

  useEffect(() => {
    loadEventsFeed()
    
    if (autoRefresh) {
      const interval = setInterval(loadEventsFeed, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [maxEvents, autoRefresh, refreshInterval, filterType, filterLocation])

  const loadEventsFeed = async () => {
    try {
      setError(null)
      
      const options = {
        max_events: maxEvents,
        event_types: filterType !== 'all' ? [filterType] : [],
        locations: filterLocation !== 'all' ? [filterLocation] : [],
        include_live_updates: true,
        priority_order: 'chronological' as const
      }
      
      const feed = await liveEventsService.getLiveEventsFeed(options)
      
      setEvents(feed.events)
      setMetrics(feed.metrics)
      setLastUpdated(feed.last_updated)
      
    } catch (err) {
      console.error('Error loading events feed:', err)
      setError('Failed to load community events feed')
    } finally {
      setLoading(false)
    }
  }

  const getEventStatusColor = (status: string): string => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeIcon = (type: string): string => {
    const icons = {
      organizing: '✊',
      cultural: '🎨',
      social: '💬',
      educational: '📚',
      celebration: '🎉',
      mutual_aid: '🤝'
    }
    return icons[type as keyof typeof icons] || '📅'
  }

  const getTimeDescription = (startTime: string, status: string): string => {
    const start = parseISO(startTime)
    const now = new Date()

    if (status === 'live') {
      return 'Live Now'
    }

    if (status === 'completed') {
      const hoursAgo = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60))
      if (hoursAgo < 1) return 'Just finished'
      if (hoursAgo < 24) return `Ended ${hoursAgo}h ago`
      return `Ended ${format(start, 'MMM d')}`
    }

    if (isToday(start)) {
      return `Today ${format(start, 'HH:mm')}`
    }

    if (isTomorrow(start)) {
      return `Tomorrow ${format(start, 'HH:mm')}`
    }

    if (isWithinInterval(start, { start: now, end: addHours(now, 168) })) {
      return format(start, 'EEE HH:mm')
    }

    return format(start, 'MMM d, HH:mm')
  }

  if (loading) {
    return (
      <div className="live-events-feed p-6 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="live-events-feed p-6 bg-white rounded-lg shadow-sm">
      {/* Disclaimer Banner */}
      <StoryDisclaimerBanner />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            🔴 Live Community Activity
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time feed of UK Black queer organizing, culture, and community events
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadEventsFeed}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Feed'}
          </button>
          
          <div className="text-xs text-gray-500">
            Updated {lastUpdated ? format(parseISO(lastUpdated), 'HH:mm:ss') : 'now'}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="text-red-600 mr-2">⚠️</div>
            <div className="text-red-700">
              <p className="font-medium">Unable to load events feed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Community Activity Metrics */}
      {showMetrics && metrics && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.active_events_count}</div>
            <div className="text-sm text-gray-600">Live & Upcoming</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.cities_with_activity}</div>
            <div className="text-sm text-gray-600">UK Cities Active</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.total_participants_today}</div>
            <div className="text-sm text-gray-600">People Participating</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(metrics.event_type_breakdown).length}</div>
            <div className="text-sm text-gray-600">Event Types</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.engagement_stats.total_updates}</div>
            <div className="text-sm text-gray-600">Live Updates</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Events</option>
            <option value="organizing">✊ Organizing</option>
            <option value="cultural">🎨 Cultural</option>
            <option value="social">💬 Social</option>
            <option value="educational">📚 Educational</option>
            <option value="mutual_aid">🤝 Mutual Aid</option>
            <option value="celebration">🎉 Celebration</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Location:</label>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Locations</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Leeds">Leeds</option>
            <option value="Bristol">Bristol</option>
            <option value="Glasgow">Glasgow</option>
          </select>
        </div>

        {/* Trending Tags */}
        {metrics && metrics.engagement_stats.trending_tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Trending:</span>
            <div className="flex flex-wrap gap-1">
              {metrics.engagement_stats.trending_tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Events Feed */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events in feed</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for community activity
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                event.status === 'live' ? 'border-red-200 bg-red-50' : 
                event.status === 'upcoming' ? 'border-blue-200 bg-blue-50' : 
                'border-gray-200'
              }`}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl" role="img" aria-label={event.event_type}>
                    {getEventTypeIcon(event.event_type)}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <span>{event.title}</span>
                      {event.status === 'live' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          🔴 LIVE
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>📍 {event.location.city}</span>
                      <span>⏰ {getTimeDescription(event.start_time, event.status)}</span>
                      <span>👥 {event.organizer.name}</span>
                      {event.participant_count && (
                        <span>🙋‍♀️ {event.participant_count} attending</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              {/* Event Description */}
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">{event.description}</p>

              {/* Event Details */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                {event.location.venue && (
                  <span>🏢 {event.location.venue}</span>
                )}
                {event.location.online && (
                  <span>💻 Online available</span>
                )}
                {event.location.hybrid && (
                  <span>🔄 Hybrid event</span>
                )}
                {event.registration_info?.cost && (
                  <span>💰 {event.registration_info.cost}</span>
                )}
              </div>

              {/* Accessibility Features */}
              {event.accessibility_features.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {event.accessibility_features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                      >
                        ♿ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Live Updates */}
              {event.live_updates && event.live_updates.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">📢 Live Updates</h4>
                  <div className="space-y-2">
                    {event.live_updates.slice(0, 2).map((update) => (
                      <div key={update.id} className="text-sm">
                        <div className="text-gray-700">{update.content}</div>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                          <span>{format(parseISO(update.posted_at), 'HH:mm')}</span>
                          <span>👍 {update.engagement.likes}</span>
                          <span>↪️ {update.engagement.shares}</span>
                          <span>💬 {update.engagement.comments}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Link */}
              {event.registration_info?.url && event.status === 'upcoming' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <a
                    href={event.registration_info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Register for Event →
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Geographic Activity Summary */}
      {metrics && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">🗺️ UK Community Activity Right Now</h4>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2 text-center text-sm">
            {Object.entries(metrics.geographic_spread).map(([city, count]) => (
              <div key={city} className={count > 0 ? 'text-indigo-600 font-medium' : 'text-gray-400'}>
                <div className="text-lg">{count}</div>
                <div className="capitalize">{city}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          🔴 Live community events feed updates every minute • 
          <span className="font-medium"> Next refresh: {lastUpdated ? format(parseISO(lastUpdated), 'HH:mm:ss') : 'now'}</span>
        </p>
      </div>
    </div>
  )
}

export default LiveEventsActivityFeed