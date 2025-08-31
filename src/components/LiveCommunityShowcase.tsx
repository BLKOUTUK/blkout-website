'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Users, Clock, Verified, TrendingUp, Activity } from 'lucide-react'

interface LiveEvent {
  id: string
  title: string
  location: string
  city: string
  region: string
  organization: string
  type: 'organizing' | 'mutual_aid' | 'cultural' | 'health' | 'political' | 'social'
  attendees: number
  verified: boolean
  timestamp: Date
  description: string
  tags: string[]
  impact_metrics?: {
    people_reached?: number
    funds_raised?: number
    resources_distributed?: number
    policies_influenced?: number
  }
}

interface OrganizationActivity {
  id: string
  name: string
  location: string
  recent_activities: number
  total_members: number
  last_active: Date
  verification_status: 'verified' | 'partner' | 'community'
  focus_areas: string[]
  impact_score: number
}

interface CommunityMetrics {
  total_active_events: number
  cities_represented: number
  organizations_active: number
  people_engaged_today: number
  collective_impact_score: number
  trending_topics: string[]
  geographic_spread: {
    england: number
    scotland: number
    wales: number
    northern_ireland: number
  }
}

export default function LiveCommunityShowcase() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([])
  const [organizations, setOrganizations] = useState<OrganizationActivity[]>([])
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLiveData()
  }, [])

  const loadLiveData = () => {
    // Phase 1: Show empty state - real data integration coming in Phase 2
    setIsLoading(false)
    setLiveEvents([])
    setOrganizations([])
    setMetrics({
      total_active_events: 0,
      cities_represented: 0,
      organizations_active: 0,
      people_engaged_today: 0,
      collective_impact_score: 0,
      trending_topics: [],
      geographic_spread: {
        england: 0,
        scotland: 0,
        wales: 0,
        northern_ireland: 0
      }
    })
  }

  const getTypeIcon = (type: LiveEvent['type']) => {
    const icons = {
      organizing: '✊🏿',
      mutual_aid: '🤝',
      cultural: '🎭',
      health: '💚',
      political: '🏛️',
      social: '🎉'
    }
    return icons[type]
  }

  const getTypeColor = (type: LiveEvent['type']) => {
    const colors = {
      organizing: 'bg-red-100 text-red-800',
      mutual_aid: 'bg-green-100 text-green-800',
      cultural: 'bg-purple-100 text-purple-800',
      health: 'bg-blue-100 text-blue-800',
      political: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800'
    }
    return colors[type]
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Live Community Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time view of community organizing, mutual aid, and liberation activities across the UK
          </p>
        </div>

        {/* Phase 1 Empty State */}
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Community Dashboard Coming Soon
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              This dashboard will show real-time community activities, organizing events, 
              and liberation initiatives once our community data integration is complete.
            </p>
            <div className="bg-white/5 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Planned Features:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Live community organizing events
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Mutual aid network activities
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Organization partnership status
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Impact metrics and community reach
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Geographic spread across UK regions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Metrics Overview - Empty State */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">0</div>
            <div className="text-sm text-gray-400">Active Events</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">0</div>
            <div className="text-sm text-gray-400">Cities</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">0</div>
            <div className="text-sm text-gray-400">Organizations</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">0</div>
            <div className="text-sm text-gray-400">People Engaged</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">0</div>
            <div className="text-sm text-gray-400">Impact Score</div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">0</div>
            <div className="text-sm text-gray-400">UK Regions</div>
          </div>
        </div>
      </div>
    </div>
  )
}