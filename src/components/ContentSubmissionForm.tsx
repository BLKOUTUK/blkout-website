import React, { useState } from 'react'
import { addNewsItem, addEvent } from '../lib/supabase'

const ContentSubmissionForm = () => {
  const [type, setType] = useState<'news' | 'event'>('news')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    event_date: '',
    location: '',
    source_url: '',
    author: '',
    organizer: '',
    tags: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      if (type === 'news') {
        await addNewsItem({
          title: formData.title,
          content: formData.content,
          source_url: formData.source_url || undefined,
          author: formData.author || undefined,
          status: 'pending',
          tags: formData.tags,
          published_at: ''
        })
      } else {
        await addEvent({
          title: formData.title,
          description: formData.description,
          event_date: formData.event_date,
          location: formData.location || undefined,
          source_url: formData.source_url || undefined,
          organizer: formData.organizer || undefined,
          status: 'pending',
          tags: formData.tags
        })
      }

      setMessage(`${type === 'news' ? 'News item' : 'Event'} submitted for moderation!`)
      setFormData({
        title: '',
        content: '',
        description: '',
        event_date: '',
        location: '',
        source_url: '',
        author: '',
        organizer: '',
        tags: []
      })
    } catch (error) {
      setMessage(`Error submitting ${type}: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Submit Content</h1>
        
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setType('news')}
              className={`px-4 py-2 rounded ${type === 'news' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              News Item
            </button>
            <button
              onClick={() => setType('event')}
              className={`px-4 py-2 rounded ${type === 'event' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              Event
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              required
            />
          </div>

          {type === 'news' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event Date</label>
                <input
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Organizer</label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Source URL</label>
            <input
              type="url"
              value={formData.source_url}
              onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              placeholder="https://original-source.com/article"
            />
          </div>

          {message && (
            <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-medium"
          >
            {isSubmitting ? 'Submitting...' : `Submit ${type === 'news' ? 'News Item' : 'Event'}`}
          </button>
        </form>

        <div className="mt-8">
          <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Platform</a>
        </div>
      </div>
    </div>
  )
}

export default ContentSubmissionForm