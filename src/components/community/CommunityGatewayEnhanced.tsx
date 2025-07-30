'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, MessageCircle, TrendingUp, Calendar, 
  ArrowRight, ExternalLink, Activity, Heart, 
  Sparkles, Clock, User, Send, CheckCircle,
  Shield, Target, Zap, Globe, ChevronDown
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'

// Community Hero Section  
const CommunityHero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-8 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-indigo-300 text-xl font-mono uppercase tracking-widest mb-6"
        >
          COMMUNITY GATEWAY
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black heading-block leading-none mb-8"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            CONNECT
          </span>
          <br />
          <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ORGANIZE
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            LIBERATE
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-12"
        >
          Join authentic community spaces where Black queer men build liberation together 
          through radical imagination, mutual aid, and collective action.
        </motion.p>

        {/* Community CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center"
          >
            <Users className="w-6 h-6 mr-3" />
            JOIN BLKOUTHUB
          </motion.button>
          <Link
            to="/discussions"
            className="px-12 py-4 border-2 border-indigo-400 text-indigo-100 font-black text-lg hover:bg-indigo-400 hover:text-indigo-900 transition-all duration-300 heading-block uppercase tracking-wide flex items-center"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            START DISCUSSION
          </Link>
        </motion.div>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { label: 'ACTIVE MEMBERS', value: '3,890' },
            { label: 'DISCUSSIONS TODAY', value: '127' },
            { label: 'RESOURCES SHARED', value: '567' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white heading-block mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-indigo-300 font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-indigo-300"
        >
          <span className="text-sm font-mono uppercase tracking-wider mb-2">EXPLORE</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// Community Spaces Section
const CommunitySpaces = () => (
  <section className="py-24 bg-indigo-50/5 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            COMMUNITY
          </span>
          <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent ml-4">
            SPACES
          </span>
        </motion.h2>
        <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-3xl mx-auto">
          Discover authentic spaces for connection, support, and collective action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: 'BLKOUTHUB ACCESS',
            description: 'Private community platform for authentic discussions, peer support, and resource sharing.',
            icon: Shield,
            gradient: 'from-emerald-500 to-indigo-600',
            features: ['Private messaging', 'Support groups', 'Resource library', 'Event coordination']
          },
          {
            title: 'PUBLIC DISCUSSIONS',
            description: 'Open conversations about liberation, justice, and community building for all to join.',
            icon: Globe,
            gradient: 'from-indigo-500 to-violet-600',
            features: ['Open forums', 'Topic threads', 'Community polls', 'Guest speakers']
          },
          {
            title: 'DIRECT ACTION',
            description: 'Organize and coordinate community actions, mutual aid, and liberation campaigns.',
            icon: Target,
            gradient: 'from-violet-500 to-emerald-600',
            features: ['Action planning', 'Mutual aid', 'Campaign tools', 'Skill sharing']
          }
        ].map((space, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8 hover:bg-indigo-900/50 transition-all duration-500 group"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${space.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <space.icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-black heading-block mb-4 uppercase">
              <span className={`bg-gradient-to-r ${space.gradient} bg-clip-text text-transparent`}>
                {space.title}
              </span>
            </h3>
            
            <p className="text-indigo-100 mb-6 leading-relaxed font-light">
              {space.description}
            </p>
            
            <ul className="space-y-2 mb-8">
              {space.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-indigo-200 text-sm">
                  <div className={`w-2 h-2 bg-gradient-to-r ${space.gradient} mr-3`}></div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              className={`w-full px-6 py-3 bg-gradient-to-r ${space.gradient} text-white font-bold hover:shadow-lg transition-all heading-block uppercase flex items-center justify-center`}
            >
              EXPLORE SPACE
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

// Enhanced Story Submission Form
interface StorySubmissionFormProps {
  backendStatus: 'checking' | 'connected' | 'offline'
}

function EnhancedStorySubmissionForm({ backendStatus }: StorySubmissionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Community Response',
    author: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'Original Commentary',
    'Community Response', 
    'Event Coverage',
    'Curated Content',
    'Video/Audio/Photo'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/newsroom/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitted(true)
        setFormData({ title: '', content: '', category: 'Community Response', author: '' })
        console.log('✅ Story submitted:', result)
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      setError('Unable to submit story. Please try again later.')
      console.error('❌ Submission error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8"
      >
        <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white heading-block mb-4 uppercase">
          STORY SUBMITTED!
        </h3>
        <p className="text-indigo-100 mb-6 font-light leading-relaxed">
          Thank you for sharing with our community. Your story has been received and will be reviewed by our editorial team.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold hover:from-emerald-500 hover:to-indigo-500 transition-all heading-block uppercase"
        >
          SUBMIT ANOTHER STORY
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8"
    >
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white heading-block mb-4 uppercase">
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            SHARE YOUR STORY
          </span>
        </h3>
        <p className="text-indigo-100 font-light">
          Your voice matters. Share your experiences, insights, and perspectives with the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-indigo-200 mb-3 heading-block uppercase">
              Story Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light"
              placeholder="Share the title of your story..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-indigo-200 mb-3 heading-block uppercase">
              Your Name
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light"
              placeholder="How should we credit you?"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-200 mb-3 heading-block uppercase">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-indigo-950/50 border border-indigo-700/50 text-white focus:outline-none focus:border-indigo-500 font-light"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-indigo-950">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-200 mb-3 heading-block uppercase">
            Your Story *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light resize-none"
            placeholder="Share your experience, insights, or perspective..."
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 text-red-200 font-light">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={submitting || backendStatus === 'offline'}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className={`w-full px-8 py-4 font-black text-lg transition-all heading-block uppercase flex items-center justify-center ${
            submitting || backendStatus === 'offline'
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white hover:from-emerald-500 hover:to-indigo-500 shadow-lg hover:shadow-xl'
          }`}
        >
          {submitting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
              SUBMITTING...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-3" />
              SUBMIT STORY
            </>
          )}
        </motion.button>

        {backendStatus === 'offline' && (
          <p className="text-sm text-indigo-300 text-center font-light">
            Story submission is currently unavailable. Please try again later.
          </p>
        )}
      </form>
    </motion.div>
  )
}

// Story Submission Section
const StorySubmissionSection = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')

  useEffect(() => {
    // Check backend status
    fetch('http://localhost:8000/health/')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
          >
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              AMPLIFY
            </span>
            <span className="bg-gradient-to-r from-indigo-400 to-slate-400 bg-clip-text text-transparent ml-4">
              VOICES
            </span>
          </motion.h2>
          <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-2xl mx-auto">
            Every story matters. Share your truth and connect with community members who understand your journey.
          </p>
        </div>

        <EnhancedStorySubmissionForm backendStatus={backendStatus} />
      </div>
    </section>
  )
}

export default function CommunityGatewayEnhanced() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* Community Hero */}
      <CommunityHero />
      
      {/* Community Spaces */}
      <CommunitySpaces />
      
      {/* Story Submission */}
      <StorySubmissionSection />
    </div>
  )
}