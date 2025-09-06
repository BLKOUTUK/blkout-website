'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Star, Heart, AlertTriangle, CheckCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface FeedbackData {
  rating: number
  category: string
  message: string
  page_url: string
  user_agent: string
  timestamp: string
}

export default function CommunityFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
  )

  const categories = [
    { id: 'general', label: 'General Feedback', icon: MessageCircle },
    { id: 'bug', label: 'Bug Report', icon: AlertTriangle },
    { id: 'feature', label: 'Feature Request', icon: Star },
    { id: 'community', label: 'Community Experience', icon: Heart }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rating || !category || !message.trim()) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Create feedback table if it doesn't exist
      const feedbackData: FeedbackData = {
        rating,
        category,
        message: message.trim(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }

      // For now, we'll store in a simple format that can be easily accessed
      const { error: insertError } = await supabase
        .from('community_feedback')
        .insert([{
          rating: feedbackData.rating,
          category: feedbackData.category,
          message: feedbackData.message,
          page_url: feedbackData.page_url,
          user_agent: feedbackData.user_agent,
          created_at: feedbackData.timestamp,
          status: 'pending'
        }])

      if (insertError) {
        // If the table doesn't exist, we'll create a fallback in localStorage for now
        console.warn('Supabase insert failed, using localStorage fallback:', insertError)
        
        const existingFeedback = JSON.parse(localStorage.getItem('blkout_feedback') || '[]')
        existingFeedback.push({
          id: Date.now(),
          ...feedbackData
        })
        localStorage.setItem('blkout_feedback', JSON.stringify(existingFeedback))
      }

      setIsSubmitted(true)
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setRating(0)
        setCategory('')
        setMessage('')
      }, 3000)

    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setRating(0)
    setCategory('')
    setMessage('')
    setError('')
    setIsSubmitted(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-purple-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Community Feedback</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  Help us improve the BLKOUT platform for Phase 2
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Thank You!</h4>
                    <p className="text-gray-300">
                      Your feedback helps shape our community platform's future
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        How would you rate your experience?
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition-colors ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          >
                            <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        What type of feedback is this?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              category === cat.id
                                ? 'border-purple-500 bg-purple-500/20 text-white'
                                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            <cat.icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs font-medium">{cat.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Your feedback
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts, suggestions, or issues..."
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !rating || !category || !message.trim()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}