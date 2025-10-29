import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const ContentSubmissionForm = () => {
  const [formData, setFormData] = useState({
    type: 'news',
    title: '',
    content: '',
    description: '',
    author: '',
    source_url: '',
    event_date: '',
    location: '',
    organizer: '',
    tags: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) {
      setMessage('Title is required')
      return
    }

    if (formData.type === 'news' && !formData.content) {
      setMessage('Content is required for news articles')
      return
    }

    if (formData.type === 'event' && (!formData.description || !formData.event_date)) {
      setMessage('Description and event date are required for events')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData: any = {
        title: formData.title,
        status: 'pending',
        created_at: new Date().toISOString(),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      }

      if (formData.source_url) {
        submitData.source_url = formData.source_url
      }

      if (formData.type === 'news') {
        submitData.content = formData.content
        if (formData.author) submitData.author = formData.author

        // Try both possible news tables
        let result = await supabase
          .from('news_articles')
          .insert([submitData])
          .select()

        if (result.error) throw result.error
      } else {
        submitData.description = formData.description
        submitData.event_date = new Date(formData.event_date).toISOString()
        if (formData.location) submitData.location = formData.location
        if (formData.organizer) submitData.organizer = formData.organizer

        const { error } = await supabase
          .from('events')
          .insert([submitData])

        if (error) throw error
      }

      setMessage(`${formData.type === 'news' ? 'Article' : 'Event'} submitted successfully! It will be reviewed by moderators.`)
      
      // Reset form
      setFormData({
        type: 'news',
        title: '',
        content: '',
        description: '',
        author: '',
        source_url: '',
        event_date: '',
        location: '',
        organizer: '',
        tags: ''
      })
    } catch (error) {
      console.error('Submission error:', error)
      setMessage('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Submit Content</h1>
            <p className="text-gray-300">
              Submit news articles or events for community review and publication
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                  Content Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="news">News Article</option>
                  <option value="event">Event</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              {/* Content for News */}
              {formData.type === 'news' && (
                <>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-2">
                      Article Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={8}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </>
              )}

              {/* Event-specific fields */}
              {formData.type === 'event' && (
                <>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      Event Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium mb-2">
                      Event Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="event_date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Address, venue, or 'Online'"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizer" className="block text-sm font-medium mb-2">
                      Organizer
                    </label>
                    <input
                      type="text"
                      id="organizer"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </>
              )}

              {/* Common fields */}
              <div>
                <label htmlFor="source_url" className="block text-sm font-medium mb-2">
                  Source URL
                </label>
                <input
                  type="url"
                  id="source_url"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="activism, community, liberation (comma-separated)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
                <p className="text-sm text-gray-400 mt-1">Separate multiple tags with commas</p>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded ${message.includes('successfully') ? 'bg-green-600' : 'bg-red-600'}`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting 
                  ? 'Submitting...' 
                  : `Submit ${formData.type === 'news' ? 'Article' : 'Event'} for Review`
                }
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Platform</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentSubmissionForm