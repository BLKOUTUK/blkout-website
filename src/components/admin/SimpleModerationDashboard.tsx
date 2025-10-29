import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface ModerationItem {
  id: string
  type: 'news' | 'event'
  title: string
  content?: string
  description?: string
  author?: string
  organizer?: string
  source_url?: string
  created_at: string
  status: string
}

const SimpleModerationDashboard = () => {
  const [queue, setQueue] = useState<{ news: ModerationItem[], events: ModerationItem[] }>({ news: [], events: [] })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadQueue = async () => {
    try {
      setLoading(true)
      
      // Fetch pending items from news_articles and events tables
      const [newsResult, eventsResult] = await Promise.all([
        supabase.from('news_articles').select('*').eq('status', 'review').order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('status', 'pending').order('created_at', { ascending: false })
      ])

      const newsData = newsResult.data || []
      const eventsData = eventsResult.data || []

      setQueue({ 
        news: newsData.map(item => ({ ...item, type: 'news' as const })), 
        events: eventsData.map(item => ({ ...item, type: 'event' as const })) 
      })
    } catch (error) {
      setMessage(`Error loading queue: ${error}`)
      console.error('Error loading moderation queue:', error)
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
      const table = type === 'news' ? 'news_articles' : 'events'
      const status = action === 'approved' ? 'published' : 'rejected'
      
      const { error } = await supabase
        .from(table)
        .update({ 
          status,
          moderated_at: new Date().toISOString(),
          moderated_by: 'admin'
        })
        .eq('id', id)

      if (error) throw error

      setMessage(`${type === 'news' ? 'News item' : 'Event'} ${action} successfully!`)
      loadQueue() // Reload the queue
    } catch (error) {
      setMessage(`Error moderating ${type}: ${error}`)
      console.error('Moderation error:', error)
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
                    <p className="text-gray-300 mb-3 line-clamp-3">{item.content || item.description}</p>
                    
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
                    <p className="text-gray-300 mb-3 line-clamp-3">{item.description || item.content}</p>
                    
                    <div className="text-sm text-gray-400 mb-3 space-y-1">
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

export default SimpleModerationDashboard