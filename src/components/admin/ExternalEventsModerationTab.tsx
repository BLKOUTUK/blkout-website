import React, { useState, useEffect } from 'react'
import { eventsIntegration, ExternalEvent } from '../../services/eventsIntegration'
import { showSuccess, showError } from '../../utils/notifications'
import { CheckCircle, XCircle, ExternalLink, Calendar, MapPin, User } from 'lucide-react'

const ExternalEventsModerationTab = () => {
  const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [moderating, setModerating] = useState<string | null>(null)

  const loadExternalEvents = async () => {
    try {
      setLoading(true)
      const events = await eventsIntegration.fetchExternalEvents({ status: 'pending' })
      setExternalEvents(events)
    } catch (error) {
      console.error('Error loading external events:', error)
      showError('Error', 'Failed to load external events for moderation')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExternalEvents()
  }, [])

  const handleModeration = async (eventId: string, action: 'approve' | 'reject') => {
    try {
      setModerating(eventId)
      const success = await eventsIntegration.moderateExternalEvent(eventId, action)
      
      if (success) {
        showSuccess(`Event ${action}ed successfully`, `The external event has been ${action}ed`)
        // Remove from pending list
        setExternalEvents(prev => prev.filter(event => event.id !== eventId))
      } else {
        showError('Moderation Failed', `Failed to ${action} external event`)
      }
    } catch (error) {
      console.error(`Error ${action}ing external event:`, error)
      showError('Moderation Error', `Error occurred while ${action}ing event`)
    } finally {
      setModerating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading external events for moderation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">External Events Moderation</h3>
            <p className="text-gray-600">Events from events-blkout.vercel.app awaiting approval</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {externalEvents.length} pending events
            </span>
            <button
              onClick={loadExternalEvents}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {externalEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No pending external events</h4>
            <p className="text-gray-600">All external events have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {externalEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                      {event.original_url && (
                        <a 
                          href={event.original_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-700">{event.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.organizer && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{event.organizer}</span>
                        </div>
                      )}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Submitted: {new Date(event.created_at).toLocaleString()}
                      {event.source && ` • Source: ${event.source}`}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleModeration(event.id, 'approve')}
                      disabled={moderating === event.id}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{moderating === event.id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleModeration(event.id, 'reject')}
                      disabled={moderating === event.id}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{moderating === event.id ? 'Processing...' : 'Reject'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900">External Events Integration</h4>
            <p className="text-sm text-blue-800 mt-1">
              Events are pulled from <strong>events-blkout.vercel.app</strong> and require approval before appearing in the platform calendar.
              Approved events will be synced back to the external site and visible to the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExternalEventsModerationTab