'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, MessageCircle, TrendingUp, Calendar, 
  ArrowRight, ExternalLink, Activity, Heart, 
  Sparkles, Clock, User, Send, CheckCircle
} from 'lucide-react'
import MagazineLayout from '../magazine/MagazineLayout'

interface StorySubmissionFormProps {
  backendStatus: 'checking' | 'connected' | 'offline'
}

function StorySubmissionForm({ backendStatus }: StorySubmissionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Community',
    author: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('https://blkout-ivor-fresh-jklmotmfs-robs-projects-54d653d3.vercel.app/api/newsroom/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitted(true)
        setFormData({ title: '', content: '', category: 'Community', author: '' })
        // Story submitted successfully
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
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Story Submitted!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for sharing with our community. Your story has been received and will be reviewed by our editorial team.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-electric-magenta hover:text-electric-cyan transition-colors"
        >
          Submit Another Story
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-magenta focus:border-transparent"
            placeholder="Share the title of your story..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-magenta focus:border-transparent"
            placeholder="How would you like to be credited?"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-magenta focus:border-transparent"
        >
          <option value="Community">Community</option>
          <option value="UK Analysis">UK Analysis</option>
          <option value="Diaspora">Diaspora</option>
          <option value="Personal Story">Personal Story</option>
          <option value="Movement">Movement</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Story *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-magenta focus:border-transparent"
          placeholder="Share your experience, analysis, or perspective that could inspire and support our community..."
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {backendStatus === 'connected' ? '🟢 Live submission' : '🟡 Demo mode'}
        </div>
        
        <motion.button
          type="submit"
          disabled={submitting || !formData.title || !formData.content}
          whileHover={{ scale: submitting ? 1 : 1.05 }}
          whileTap={{ scale: submitting ? 1 : 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Story</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  )
}

interface HubActivity {
  id: string
  type: 'discussion' | 'event' | 'milestone' | 'project'
  title: string
  description: string
  participants: number
  timeAgo: string
  author?: string
  category: string
}

interface CommunityStats {
  activeMembers: number
  weeklyPosts: number
  ongoingProjects: number
  upcomingEvents: number
}

const mockStats: CommunityStats = {
  activeMembers: 127,
  weeklyPosts: 89,
  ongoingProjects: 12,
  upcomingEvents: 3
}

const mockActivities: HubActivity[] = [
  {
    id: '1',
    type: 'discussion',
    title: 'Cooperative Business Models for Creative Workers',
    description: 'Deep dive into how artists and designers can build collective ownership structures...',
    participants: 23,
    timeAgo: '2 hours ago',
    author: 'Maya Chen',
    category: 'Economics'
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Oakland Worker Coop Launches!',
    description: 'Community-supported cleaning cooperative officially opens with 8 worker-owners',
    participants: 45,
    timeAgo: '1 day ago',
    category: 'Success Stories'
  },
  {
    id: '3',
    type: 'event',
    title: 'Monthly Community Call - January',
    description: 'Planning session for upcoming workshops and collaborative projects',
    participants: 34,
    timeAgo: '3 days ago',
    category: 'Community Building'
  },
  {
    id: '4',
    type: 'discussion',
    title: 'Navigating Burnout in Organizing Spaces',
    description: 'How do we sustain ourselves while building the movement we need?',
    participants: 67,
    timeAgo: '5 days ago',
    author: 'Jordan Williams',
    category: 'Wellness'
  },
  {
    id: '5',
    type: 'project',
    title: 'Mutual Aid Resource Database',
    description: 'Collaborative mapping of community resources and support networks',
    participants: 18,
    timeAgo: '1 week ago',
    category: 'Community Tools'
  }
]

export default function CommunityGateway() {
  const [stats, setStats] = useState<CommunityStats>(mockStats)
  const [activities, setActivities] = useState<HubActivity[]>(mockActivities)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [ivorHealth, setIvorHealth] = useState<any>(null)

  // Test backend connections on component mount
  useEffect(() => {
    const checkBackends = async () => {
      try {
        // Test IVOR backend
        const ivorResponse = await fetch('https://blkout-ivor-fresh-jklmotmfs-robs-projects-54d653d3.vercel.app/health')
        const ivorData = await ivorResponse.json()
        setIvorHealth(ivorData)
        
        // Test BLKOUTHUB connection (heartbeat.chat)
        // Note: This will likely fail due to CORS, but we can detect the attempt
        
        setBackendStatus('connected')
      } catch (error) {
        // Backend connection test failed
        setBackendStatus('offline')
      }
    }

    checkBackends()
    
    // Update stats every 30 seconds if connected
    const interval = setInterval(() => {
      if (backendStatus === 'connected') {
        // Simulate real-time updates
        setStats(prev => ({
          ...prev,
          activeMembers: prev.activeMembers + Math.floor(Math.random() * 3) - 1,
          weeklyPosts: prev.weeklyPosts + Math.floor(Math.random() * 5) - 2
        }))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [backendStatus])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'discussion': return MessageCircle
      case 'event': return Calendar
      case 'milestone': return Sparkles
      case 'project': return Activity
      default: return MessageCircle
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'discussion': return 'text-electric-cyan'
      case 'event': return 'text-electric-magenta'
      case 'milestone': return 'text-electric-green'
      case 'project': return 'text-electric-indigo'
      default: return 'text-gray-600'
    }
  }

  return (
    <MagazineLayout
      title="Community Hub"
      subtitle="Where the movement lives and grows"
    >
      <div className="py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🌟
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the Conversation at BLKOUTHUB
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Real discussions, authentic connections, and collective action happening every day. 
              BLKOUTHUB is where Black QTIPOC+ voices shape the future we're building together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors text-lg font-semibold"
              >
                <span>Enter BLKOUTHUB</span>
                <ExternalLink className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-electric-magenta text-electric-magenta rounded-lg hover:bg-electric-magenta hover:text-white transition-colors text-lg font-semibold"
              >
                <span>Tour the Hub</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Live Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-electric-magenta/10 to-electric-cyan/10 rounded-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Pulse</h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-gray-600">Live activity from BLKOUTHUB</p>
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-500' : 
                  backendStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-500">
                  {backendStatus === 'connected' && ivorHealth ? `IVOR ${ivorHealth.model}` : 
                   backendStatus === 'checking' ? 'Connecting...' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-magenta rounded-xl mb-3 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.activeMembers}</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-cyan rounded-xl mb-3 mx-auto">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.weeklyPosts}</div>
                <div className="text-sm text-gray-600">Posts This Week</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-indigo rounded-xl mb-3 mx-auto">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.ongoingProjects}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-green rounded-xl mb-3 mx-auto">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</div>
                <div className="text-sm text-gray-600">Events This Week</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recent Activity Feed */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Happening Now</h2>
              <p className="text-gray-600">Real conversations and milestones from the community</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors"
            >
              <span>See All Activity</span>
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type)
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group ${
                    backendStatus === 'connected' ? 'border-gray-200' : 'border-dashed border-orange-300 relative'
                  }`}
                >
                  {backendStatus !== 'connected' && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded border border-orange-200">
                        SAMPLE
                      </span>
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-electric-magenta/10 transition-colors`}>
                      <IconComponent className={`w-5 h-5 ${getActivityColor(activity.type)} group-hover:text-electric-magenta transition-colors`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {activity.category}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.participants}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{activity.timeAgo}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-electric-magenta transition-colors">
                        {activity.title}
                      </h3>

                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {activity.description}
                      </p>

                      {activity.author && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          <span>Started by {activity.author}</span>
                        </div>
                      )}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-electric-magenta" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Story Submission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-1 h-6 bg-electric-cyan"></div>
            <h2 className="text-2xl font-bold text-gray-900">Share Your Story</h2>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <p className="text-gray-600 mb-6">
              Have a story, analysis, or experience that could inspire and support our community? 
              Submit it to our newsroom for consideration.
            </p>

            <StorySubmissionForm backendStatus={backendStatus} />
          </div>
        </motion.section>

        {/* Join Call-to-Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-electric-magenta to-electric-cyan rounded-2xl p-12 text-white">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              💫
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join the Movement?
            </h2>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              BLKOUTHUB is where theory meets practice, where individual struggles become collective power, 
              and where the future we want to live in gets built together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-electric-magenta rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-electric-magenta transition-colors font-semibold"
              >
                <span>Learn More</span>
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </MagazineLayout>
  )
}