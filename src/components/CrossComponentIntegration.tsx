/**
 * Cross-Component Integration
 * Manages real-time data flow and communication between BLKOUT ecosystem components
 * Handles notifications, shared state, and component coordination
 */

import React, { useState, useEffect, useContext, createContext } from 'react'

interface IntegrationState {
  // Component status tracking
  ivorOnline: boolean
  eventsLoaded: boolean
  newsroomSynced: boolean
  governanceActive: boolean
  extensionConnected: boolean
  
  // Cross-component notifications
  notifications: IntegrationNotification[]
  
  // Shared data
  recentActivity: ActivityItem[]
  communityMetrics: CommunityMetrics
  userJourneyState: UserJourneyState
}

interface IntegrationNotification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  component: string
  timestamp: Date
  actions?: NotificationAction[]
}

interface NotificationAction {
  label: string
  action: () => void
  style: 'primary' | 'secondary'
}

interface ActivityItem {
  id: string
  type: 'story_published' | 'event_added' | 'governance_vote' | 'ivor_conversation' | 'extension_report'
  title: string
  component: string
  timestamp: Date
  user?: string
  metadata?: any
}

interface CommunityMetrics {
  activeUsers: number
  storiesPublished: number
  eventsListed: number
  ivorConversations: number
  governanceVotes: number
  extensionReports: number
  lastUpdated: Date
}

interface UserJourneyState {
  currentStep: number
  completedComponents: string[]
  suggestedNextActions: string[]
  engagementLevel: 'new' | 'exploring' | 'active' | 'contributor'
}

// Create context for cross-component integration
const IntegrationContext = createContext<{
  state: IntegrationState
  addNotification: (notification: Omit<IntegrationNotification, 'id' | 'timestamp'>) => void
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void
  updateComponentStatus: (component: string, status: boolean) => void
  updateUserJourney: (step: number, component: string) => void
} | null>(null)

export const useIntegration = () => {
  const context = useContext(IntegrationContext)
  if (!context) {
    throw new Error('useIntegration must be used within IntegrationProvider')
  }
  return context
}

export const IntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IntegrationState>({
    ivorOnline: true,
    eventsLoaded: true,
    newsroomSynced: true,
    governanceActive: true,
    extensionConnected: false,
    notifications: [],
    recentActivity: [],
    communityMetrics: {
      activeUsers: 147,
      storiesPublished: 28,
      eventsListed: 45,
      ivorConversations: 342,
      governanceVotes: 89,
      extensionReports: 12,
      lastUpdated: new Date()
    },
    userJourneyState: {
      currentStep: 1,
      completedComponents: [],
      suggestedNextActions: ['Explore newsroom', 'Chat with IVOR', 'Find local events'],
      engagementLevel: 'exploring'
    }
  })

  useEffect(() => {
    // Simulate component status monitoring
    const statusInterval = setInterval(() => {
      // Check IVOR status
      fetch('https://ivor-blkout.vercel.app/health')
        .then(() => updateComponentStatus('ivor', true))
        .catch(() => updateComponentStatus('ivor', false))
      
      // Simulate other component checks
      setState(prev => ({
        ...prev,
        eventsLoaded: true,
        newsroomSynced: true,
        governanceActive: true
      }))
    }, 30000) // Check every 30 seconds

    // Simulate community metrics updates
    const metricsInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        communityMetrics: {
          ...prev.communityMetrics,
          activeUsers: prev.communityMetrics.activeUsers + Math.floor(Math.random() * 3),
          ivorConversations: prev.communityMetrics.ivorConversations + Math.floor(Math.random() * 2),
          lastUpdated: new Date()
        }
      }))
    }, 60000) // Update every minute

    // Add initial activity
    addActivity({
      type: 'story_published',
      title: 'Manchester Black Trans Collective Wins Housing Victory',
      component: 'newsroom'
    })

    return () => {
      clearInterval(statusInterval)
      clearInterval(metricsInterval)
    }
  }, [])

  const addNotification = (notification: Omit<IntegrationNotification, 'id' | 'timestamp'>) => {
    const newNotification: IntegrationNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 10) // Keep last 10
    }))

    // Auto-remove after 5 seconds unless it's an error
    if (notification.type !== 'error') {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== newNotification.id)
        }))
      }, 5000)
    }
  }

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setState(prev => ({
      ...prev,
      recentActivity: [newActivity, ...prev.recentActivity].slice(0, 20) // Keep last 20
    }))
  }

  const updateComponentStatus = (component: string, status: boolean) => {
    setState(prev => ({
      ...prev,
      [`${component}Online`]: status
    }))

    if (!status) {
      addNotification({
        type: 'warning',
        title: 'Component Offline',
        message: `${component.toUpperCase()} is currently unavailable. Retrying connection...`,
        component
      })
    }
  }

  const updateUserJourney = (step: number, component: string) => {
    setState(prev => {
      const completedComponents = [...prev.userJourneyState.completedComponents]
      if (!completedComponents.includes(component)) {
        completedComponents.push(component)
      }

      let engagementLevel: UserJourneyState['engagementLevel'] = 'new'
      if (completedComponents.length >= 5) engagementLevel = 'contributor'
      else if (completedComponents.length >= 3) engagementLevel = 'active'
      else if (completedComponents.length >= 1) engagementLevel = 'exploring'

      return {
        ...prev,
        userJourneyState: {
          currentStep: Math.max(step, prev.userJourneyState.currentStep),
          completedComponents,
          suggestedNextActions: getSuggestedActions(completedComponents),
          engagementLevel
        }
      }
    })
  }

  const getSuggestedActions = (completed: string[]): string[] => {
    const allActions = [
      'Read community stories',
      'Chat with IVOR AI',
      'Find local events',
      'Install community reporter',
      'Participate in governance',
      'Share organizing victory',
      'Join discussion forum'
    ]

    const componentMap: { [key: string]: string } = {
      'newsroom': 'Read community stories',
      'ivor': 'Chat with IVOR AI',
      'events': 'Find local events',
      'extension': 'Install community reporter',
      'governance': 'Participate in governance'
    }

    const completedActions = completed.map(comp => componentMap[comp]).filter(Boolean)
    return allActions.filter(action => !completedActions.includes(action)).slice(0, 3)
  }

  const contextValue = {
    state,
    addNotification,
    addActivity,
    updateComponentStatus,
    updateUserJourney
  }

  return (
    <IntegrationContext.Provider value={contextValue}>
      {children}
      <IntegrationNotificationCenter />
    </IntegrationContext.Provider>
  )
}

const IntegrationNotificationCenter: React.FC = () => {
  const { state } = useIntegration()

  if (state.notifications.length === 0) return null

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      <div className="space-y-2">
        {state.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              p-4 rounded-lg shadow-lg border-l-4 bg-white
              ${notification.type === 'success' && 'border-green-500'}
              ${notification.type === 'info' && 'border-blue-500'}
              ${notification.type === 'warning' && 'border-yellow-500'}
              ${notification.type === 'error' && 'border-red-500'}
              transform transition-all duration-300 animate-slide-in-left
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                text-lg flex-shrink-0
                ${notification.type === 'success' && 'text-green-600'}
                ${notification.type === 'info' && 'text-blue-600'}
                ${notification.type === 'warning' && 'text-yellow-600'}
                ${notification.type === 'error' && 'text-red-600'}
              `}>
                {notification.type === 'success' && '✅'}
                {notification.type === 'info' && 'ℹ️'}
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'error' && '❌'}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">
                  {notification.title}
                </h4>
                <p className="text-gray-600 text-xs mt-1">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {notification.component}
                  </span>
                  <span className="text-xs text-gray-400">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {notification.actions && (
                  <div className="flex gap-2 mt-2">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`
                          px-2 py-1 text-xs rounded
                          ${action.style === 'primary' 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CrossComponentIntegration