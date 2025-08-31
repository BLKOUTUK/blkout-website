/**
 * Unified User Experience Component
 * Main navigation hub connecting BLKOUT website → IVOR chat → Stories → Events
 * Creates seamless flow through the entire BLKOUT ecosystem
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface EcosystemComponent {
  id: string
  name: string
  description: string
  url: string
  status: 'active' | 'demo' | 'coming_soon'
  icon: string
  category: 'core' | 'community' | 'tools'
}

interface UserJourneyStep {
  step: number
  title: string
  description: string
  component: string
  action: string
  next_steps: string[]
}

const UnifiedUserExperience: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('website')
  const [journeyStep, setJourneyStep] = useState<number>(1)
  const [showJourneyGuide, setShowJourneyGuide] = useState(false)

  const ecosystemComponents: EcosystemComponent[] = [
    {
      id: 'website',
      name: 'BLKOUT Website',
      description: 'Community hub with newsroom, events, and governance tools',
      url: '/dashboard',
      status: 'active',
      icon: '🏠',
      category: 'core'
    },
    {
      id: 'ivor',
      name: 'IVOR AI Assistant',
      description: 'Community-aware AI for organizing, health, and liberation support',
      url: 'https://blkoutnxt-ivor-frontend.vercel.app/',
      status: 'active',
      icon: '🤖',
      category: 'core'
    },
    {
      id: 'newsroom',
      name: 'Community Newsroom',
      description: 'Democratic storytelling platform with community editorial control',
      url: '/newsroom',
      status: 'demo',
      icon: '📰',
      category: 'community'
    },
    {
      id: 'events',
      name: 'Events Calendar',
      description: 'UK-wide Black queer community events and organizing activities',
      url: '/events',
      status: 'active',
      icon: '📅',
      category: 'community'
    },
    {
      id: 'governance',
      name: 'Community Governance',
      description: 'Democratic decision-making and community curation tools',
      url: '/governance',
      status: 'demo',
      icon: '🏛️',
      category: 'community'
    },
    {
      id: 'extension',
      name: 'Chrome Reporter',
      description: 'Community journalism extension for real event reporting',
      url: '/extension',
      status: 'active',
      icon: '🔗',
      category: 'tools'
    },
    {
      id: 'live_events',
      name: 'Live Community Feed',
      description: 'Real-time community activity across UK cities',
      url: '/live-events',
      status: 'demo',
      icon: '📡',
      category: 'community'
    },
    {
      id: 'demo',
      name: 'Demo Scenarios',
      description: 'Interactive user journey demonstrations',
      url: '/demo',
      status: 'active',
      icon: '🎬',
      category: 'tools'
    }
  ]

  const userJourney: UserJourneyStep[] = [
    {
      step: 1,
      title: 'Discover Community',
      description: 'Start at BLKOUT website to explore UK Black queer community resources and stories',
      component: 'website',
      action: 'Browse newsroom, events calendar, and community highlights',
      next_steps: ['Chat with IVOR', 'Explore events', 'Read community stories']
    },
    {
      step: 2,
      title: 'Get AI Support',
      description: 'Chat with IVOR for organizing advice, health resources, and community connections',
      component: 'ivor',
      action: 'Ask questions about organizing, health, liberation, community resources',
      next_steps: ['Find local events', 'Get organizing advice', 'Access health resources']
    },
    {
      step: 3,
      title: 'Engage Locally',
      description: 'Find events in your city and connect with local Black queer organizing',
      component: 'events',
      action: 'Search events by location, join organizing meetings, attend celebrations',
      next_steps: ['Report community events', 'Share stories', 'Join governance']
    },
    {
      step: 4,
      title: 'Contribute Stories',
      description: 'Report real community events and victories through democratic editorial process',
      component: 'extension',
      action: 'Install Chrome extension, report organizing victories and community celebrations',
      next_steps: ['Participate in governance', 'Share on social', 'Organize locally']
    },
    {
      step: 5,
      title: 'Shape Community',
      description: 'Participate in democratic governance and community curation decisions',
      component: 'governance',
      action: 'Vote on story features, curate events, participate in platform decisions',
      next_steps: ['Mentor newcomers', 'Lead organizing', 'Build solidarity']
    }
  ]

  useEffect(() => {
    // Auto-advance journey guide every 10 seconds when active
    let interval: NodeJS.Timeout | null = null
    
    if (showJourneyGuide) {
      interval = setInterval(() => {
        setJourneyStep(prev => prev === userJourney.length ? 1 : prev + 1)
        setActiveComponent(userJourney[(journeyStep % userJourney.length)].component)
      }, 10000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showJourneyGuide, journeyStep, userJourney.length])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'demo': return 'text-blue-600 bg-blue-100'
      case 'coming_soon': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'core': return '⭐'
      case 'community': return '👥'
      case 'tools': return '🛠️'
      default: return '📦'
    }
  }

  const handleComponentClick = (component: EcosystemComponent) => {
    setActiveComponent(component.id)
    
    if (component.url.startsWith('http')) {
      // External link - open in new tab
      window.open(component.url, '_blank')
    }
    // Internal links handled by Link component
  }

  const currentJourneyStep = userJourney.find(step => step.step === journeyStep)

  return (
    <div className="unified-user-experience p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            BLKOUT Ecosystem
          </h2>
          <p className="text-gray-600 mt-1">
            Unified experience across community liberation platform
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowJourneyGuide(!showJourneyGuide)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showJourneyGuide 
                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
            }`}
          >
            {showJourneyGuide ? '⏸️ Pause Guide' : '▶️ User Journey Guide'}
          </button>
          
          <div className="text-sm text-gray-500">
            {ecosystemComponents.filter(c => c.status === 'active').length} Active • 
            {ecosystemComponents.filter(c => c.status === 'demo').length} Demo
          </div>
        </div>
      </div>

      {/* Journey Guide */}
      {showJourneyGuide && currentJourneyStep && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-indigo-900">
              Step {currentJourneyStep.step}: {currentJourneyStep.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-indigo-600">
                {journeyStep} of {userJourney.length}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: userJourney.length }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i + 1 === journeyStep ? 'bg-indigo-600' : 'bg-indigo-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-indigo-700 mb-2">{currentJourneyStep.description}</p>
          <div className="text-sm text-indigo-600 mb-3">
            <strong>Action:</strong> {currentJourneyStep.action}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-indigo-600 font-medium">Next steps:</span>
            {currentJourneyStep.next_steps.map((step, index) => (
              <span key={index} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ecosystem Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {ecosystemComponents.map((component) => (
          <div
            key={component.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              activeComponent === component.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleComponentClick(component)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{component.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{component.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {getCategoryIcon(component.category)} {component.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(component.status)}`}>
                      {component.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {component.url.startsWith('http') ? (
                <span className="text-gray-400 text-sm">↗️</span>
              ) : (
                <Link 
                  to={component.url}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  →
                </Link>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{component.description}</p>
            
            <div className="flex justify-between items-center">
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => handleComponentClick(component)}
              >
                {component.url.startsWith('http') ? 'Open External' : 'Navigate'}
              </button>
              
              {activeComponent === component.id && (
                <span className="text-sm text-green-600 font-medium">✓ Active</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Flow Visualization */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration Flow</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1 bg-white rounded-full border font-medium">🏠 Website</span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-white rounded-full border font-medium">🤖 IVOR Chat</span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-white rounded-full border font-medium">📅 Events</span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-white rounded-full border font-medium">📰 Stories</span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-white rounded-full border font-medium">🏛️ Governance</span>
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-white rounded-full border font-medium">👥 Community</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Seamless flow through liberation ecosystem
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          to="/newsroom"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          📰 Read Community Stories
        </Link>
        
        <a
          href="https://blkoutnxt-ivor-frontend.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
        >
          🤖 Chat with IVOR AI
        </a>
        
        <Link
          to="/events"
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
        >
          📅 Find Local Events
        </Link>
        
        <Link
          to="/live-events"
          className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
        >
          📡 Live Community Feed
        </Link>
        
        <Link
          to="/extension"
          className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
        >
          🔗 Community Reporter
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          🌍 Unified BLKOUT ecosystem • Community-owned liberation platform • 
          Democratic governance • UK Black queer community organizing
        </p>
      </div>
    </div>
  )
}

export default UnifiedUserExperience