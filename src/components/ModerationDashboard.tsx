import React, { useState, useEffect } from 'react'
import { getModerationQueue, moderateItem, NewsroomItem, EventItem } from '../lib/supabase'

const ModerationDashboard = () => {
  const [queue, setQueue] = useState<{ news: NewsroomItem[], events: EventItem[] }>({ news: [], events: [] })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadQueue = async () => {
    try {
      setLoading(true)
      const data = await getModerationQueue()
      setQueue(data)
    } catch (error) {
      setMessage(`Error loading queue: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [])

  const handleModeration = async (
    type: 'news' | 'event',
    id: string,
    action: 'approved' | 'rejected'
  ) => {
    try {
      await moderateItem(type, id, action, 'admin')
      setMessage(`${type === 'news' ? 'News item' : 'Event'} ${action} successfully!`)
      loadQueue() // Reload the queue
    } catch (error) {
      setMessage(`Error moderating ${type}: ${error}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading moderation queue...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
          <button 
            onClick={loadQueue}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Refresh Queue
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* News Items */}
          <div>
            <h2 className="text-2xl font-bold mb-4">News Items ({queue.news.length})</h2>
            <div className="space-y-4">
              {queue.news.length === 0 ? (
                <p className="text-gray-400">No news items pending moderation</p>
              ) : (
                queue.news.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-300 mb-3 line-clamp-3">{item.content}</p>
                    
                    <div className="text-sm text-gray-400 mb-3 space-y-1">
                      {item.author && <div><strong>Author:</strong> {item.author}</div>}
                      {item.source_url && (
                        <div><strong>Source:</strong> <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{item.source_url}</a></div>
                      )}
                      <div><strong>Submitted:</strong> {new Date(item.created_at).toLocaleDateString()}</div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleModeration('news', item.id, 'approved')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleModeration('news', item.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Events */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Events ({queue.events.length})</h2>
            <div className="space-y-4">
              {queue.events.length === 0 ? (
                <p className="text-gray-400">No events pending moderation</p>
              ) : (
                queue.events.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-300 mb-3 line-clamp-3">{item.description}</p>
                    
                    <div className="text-sm text-gray-400 mb-3 space-y-1">
                      <div><strong>Date:</strong> {new Date(item.event_date).toLocaleDateString()}</div>
                      {item.location && <div><strong>Location:</strong> {item.location}</div>}
                      {item.organizer && <div><strong>Organizer:</strong> {item.organizer}</div>}
                      {item.source_url && (
                        <div><strong>Source:</strong> <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{item.source_url}</a></div>
                      )}
                      <div><strong>Submitted:</strong> {new Date(item.created_at).toLocaleDateString()}</div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleModeration('event', item.id, 'approved')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleModeration('event', item.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/admin" className="text-blue-400 hover:text-blue-300">← Back to Admin Dashboard</a>
        </div>
      </div>
    </div>
  )
}

export default ModerationDashboard