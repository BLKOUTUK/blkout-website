/**
 * Ecosystem Navigation Hub
 * Central navigation component that appears on all pages
 * Provides quick access to all BLKOUT ecosystem components
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavigationItem {
  id: string
  label: string
  path: string
  external?: string
  icon: string
  description: string
  isActive?: boolean
}

const EcosystemNavigationHub: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
      description: 'Community hub overview'
    },
    {
      id: 'newsroom',
      label: 'Newsroom',
      path: '/newsroom',
      icon: '📰',
      description: 'Community stories & journalism'
    },
    {
      id: 'events',
      label: 'Events',
      path: '/events',
      icon: '📅',
      description: 'UK community events calendar'
    },
    {
      id: 'ivor',
      label: 'IVOR AI',
      path: '',
      external: 'https://blkoutnxt-ivor-frontend.vercel.app/',
      icon: '🤖',
      description: 'AI assistant for organizing'
    },
    {
      id: 'governance',
      label: 'Governance',
      path: '/governance',
      icon: '🏛️',
      description: 'Democratic community decisions'
    },
    {
      id: 'live-events',
      label: 'Live Feed',
      path: '/live-events',
      icon: '📡',
      description: 'Real-time community activity'
    },
    {
      id: 'extension',
      label: 'Reporter',
      path: '/extension',
      icon: '🔗',
      description: 'Community journalism extension'
    },
    {
      id: 'demo',
      label: 'Demo',
      path: '/demo',
      icon: '🎬',
      description: 'Interactive user journey demos'
    },
    {
      id: 'onboarding',
      label: 'Get Started',
      path: '/onboarding',
      icon: '👋',
      description: 'Community onboarding journey'
    },
    {
      id: 'launch',
      label: 'Launch Materials',
      path: '/launch',
      icon: '🚀',
      description: 'Community breadth showcase'
    },
    {
      id: 'partnerships',
      label: 'Partnerships',
      path: '/partnerships',
      icon: '🤝',
      description: 'UK organization coordination'
    },
    {
      id: 'beta-flow',
      label: 'Beta Flow',
      path: '/beta-flow',
      icon: '🚀',
      description: 'User journey visualization'
    },
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      path: '/ecosystem',
      icon: '🌍',
      description: 'Full platform overview'
    },
    {
      id: 'amplification',
      label: 'Story Amplification',
      path: '/amplification',
      icon: '📡',
      description: 'Social sharing through IVOR'
    },
    {
      id: 'launch-prep',
      label: 'Launch Preparation',
      path: '/launch-prep',
      icon: '🚀',
      description: 'Beta launch coordination'
    },
    {
      id: 'stakeholder-demo',
      label: 'Stakeholder Demo',
      path: '/stakeholder-demo',
      icon: '🎯',
      description: 'Interactive ecosystem demonstrations'
    }
  ]

  const activeItem = navigationItems.find(item => 
    item.path === location.pathname || 
    (item.path === '/dashboard' && location.pathname === '/')
  )

  const handleItemClick = (item: NavigationItem) => {
    if (item.external) {
      window.open(item.external, '_blank')
    }
    setIsExpanded(false)
  }

  return (
    <div className="ecosystem-navigation-hub fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-4 py-3 bg-white border-2 rounded-full shadow-lg
          transition-all duration-300 hover:shadow-xl
          ${isExpanded ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        <span className="text-lg">{activeItem?.icon || '🌍'}</span>
        <span className="font-medium text-gray-900">
          {activeItem?.label || 'BLKOUT'}
        </span>
        <span className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded Navigation */}
      <div className={`
        absolute top-16 right-0 bg-white border border-gray-200 rounded-xl shadow-xl
        transition-all duration-300 overflow-hidden
        ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        <div className="p-2 w-80">
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-100 mb-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🌍</span>
              BLKOUT Ecosystem
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Navigate the liberation platform
            </p>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isCurrentlyActive = item.path === location.pathname || 
                (item.path === '/dashboard' && location.pathname === '/')

              if (item.external) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                      transition-colors duration-200
                      ${isCurrentlyActive 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    <span className="text-gray-400 text-sm">↗️</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsExpanded(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    transition-colors duration-200
                    ${isCurrentlyActive 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  {isCurrentlyActive && (
                    <span className="text-indigo-600 text-sm">✓</span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Quick Status */}
          <div className="px-3 py-2 border-t border-gray-100 mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>🟢 14 Active Components</span>
              <span>📡 Live Community Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}

export default EcosystemNavigationHub