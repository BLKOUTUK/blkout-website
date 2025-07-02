'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, MessageCircle, TrendingUp, Calendar, 
  ArrowRight, ExternalLink, Activity, Heart, 
  Sparkles, Clock, User
} from 'lucide-react'
import MagazineLayout from '../magazine/MagazineLayout'

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
              <p className="text-gray-600">Live activity from BLKOUTHUB</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-magenta rounded-xl mb-3 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{mockStats.activeMembers}</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-cyan rounded-xl mb-3 mx-auto">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{mockStats.weeklyPosts}</div>
                <div className="text-sm text-gray-600">Posts This Week</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-indigo rounded-xl mb-3 mx-auto">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{mockStats.ongoingProjects}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-electric-green rounded-xl mb-3 mx-auto">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{mockStats.upcomingEvents}</div>
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
            {mockActivities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type)
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
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