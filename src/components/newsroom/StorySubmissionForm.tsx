import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader, CheckCircle, AlertCircle, X } from 'lucide-react'
import { moderationService } from '../../services/moderationService'

interface StorySubmissionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: () => void
}

const StorySubmissionForm: React.FC<StorySubmissionFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmitSuccess 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Community News',
    author: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const categories = [
    'Community News',
    'Community Organizing', 
    'Economic Justice',
    'Legal Victory',
    'Healthcare',
    'Housing',
    'Cultural Events',
    'Education',
    'Safety & Security'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setSubmitStatus('error')
      setSubmitMessage('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await moderationService.submitForModeration({
        type: 'newsroom_article',
        title: formData.title,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        metadata: {
          source: 'user_submission',
          submission_timestamp: new Date().toISOString()
        }
      })

      if (response.success) {
        setSubmitStatus('success')
        setSubmitMessage('Story submitted successfully! It will be reviewed before publication.')
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          category: 'Community News',
          author: ''
        })

        // Call success callback if provided
        onSubmitSuccess?.()

        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose()
          setSubmitStatus('idle')
          setSubmitMessage('')
        }, 3000)
      } else {
        setSubmitStatus('error')
        setSubmitMessage(response.error || 'Submission failed. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Network error. Please check your connection and try again.')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error status when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle')
      setSubmitMessage('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Submit Your Story</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              submitStatus === 'success' 
                ? 'bg-green-900/20 text-green-400 border border-green-500/20' 
                : 'bg-red-900/20 text-red-400 border border-red-500/20'
            }`}
          >
            {submitStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{submitMessage}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
              placeholder="Your name or organization"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-white font-medium mb-2">
              Story Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
              placeholder="Your story headline..."
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-white font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
              disabled={isSubmitting}
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-900 text-white">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-white font-medium mb-2">
              Story Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:border-blue-400 focus:outline-none transition-colors h-40 resize-none"
              placeholder="Tell your story... What happened? How did it impact your community? What organizing or actions were involved?"
              disabled={isSubmitting}
              required
            />
            <div className="text-sm text-gray-400 mt-2">
              {formData.content.split(' ').length} words • ~{Math.ceil(formData.content.split(' ').length / 200)} min read
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">Community Guidelines</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Stories should center Black queer experiences and liberation</li>
              <li>• Focus on community organizing, victories, and positive impact</li>
              <li>• Be respectful of others' privacy and safety</li>
              <li>• All submissions are reviewed before publication</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.author.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Story
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default StorySubmissionForm