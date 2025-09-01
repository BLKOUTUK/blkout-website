/**
 * Community Onboarding Flow
 * Guided journey: BLKOUTHUB → IVOR → Events → Storytelling
 * Progressive introduction to the liberation platform ecosystem
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: string
  icon: string
  action: {
    type: 'internal' | 'external' | 'demo'
    url: string
    label: string
  }
  benefits: string[]
  next_step_hint: string
  completion_criteria: string
}

interface UserProgress {
  current_step: number
  completed_steps: string[]
  engagement_level: 'newcomer' | 'exploring' | 'engaged' | 'community_member'
  preferred_interests: string[]
}

const CommunityOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    current_step: 1,
    completed_steps: [],
    engagement_level: 'newcomer',
    preferred_interests: []
  })
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome_blkouthub',
      title: 'Welcome to BLKOUT Community',
      description: 'Start your liberation journey by exploring our community-owned platform built by and for Black queer people across the UK',
      component: 'website',
      icon: '🏠',
      action: {
        type: 'internal',
        url: '/dashboard',
        label: 'Explore Community Hub'
      },
      benefits: [
        'Discover cooperative ownership model',
        'Learn about democratic governance',
        'See community values in action',
        'Browse recent community highlights'
      ],
      next_step_hint: 'Ready to get personalized support? Chat with IVOR AI',
      completion_criteria: 'Spend 2+ minutes exploring dashboard sections'
    },
    {
      id: 'meet_ivor_ai',
      title: 'Meet IVOR - Your AI Liberation Assistant',
      description: 'Get personalized support for organizing, health resources, and community connections from our community-trained AI',
      component: 'ivor',
      icon: '🤖',
      action: {
        type: 'external',
        url: 'https://ivor-blkout.vercel.app/',
        label: 'Chat with IVOR'
      },
      benefits: [
        'Ask questions about organizing strategies',
        'Get UK-specific health resources (NHS, QTIPOC+ services)',
        'Find local community connections',
        'Access liberation resources and mutual aid info'
      ],
      next_step_hint: 'Want to connect with people near you? Discover local events',
      completion_criteria: 'Have meaningful conversation about organizing or health'
    },
    {
      id: 'discover_local_events',
      title: 'Find Your Local Community',
      description: 'Connect with Black queer organizing, celebrations, and mutual aid activities across UK cities',
      component: 'events',
      icon: '📅',
      action: {
        type: 'internal',
        url: '/events',
        label: 'Browse Events Calendar'
      },
      benefits: [
        'Find events in your city (London, Manchester, Birmingham, Bristol, etc.)',
        'Join organizing meetings and advocacy campaigns',
        'Attend cultural celebrations and social events',
        'Connect with local mutual aid networks'
      ],
      next_step_hint: 'Inspired by community activity? Share stories and victories',
      completion_criteria: 'Explore events in your location or save events of interest'
    },
    {
      id: 'join_storytelling',
      title: 'Contribute Community Stories',
      description: 'Share organizing victories, community celebrations, and mutual aid successes through democratic journalism',
      component: 'newsroom',
      icon: '📰',
      action: {
        type: 'internal',
        url: '/newsroom',
        label: 'Read Community Stories'
      },
      benefits: [
        'Read community journalism from across the UK',
        'See organizing victories and policy wins',
        'Learn from community health initiatives',
        'Understand community curation process'
      ],
      next_step_hint: 'Ready to report real events? Install the Community Reporter extension',
      completion_criteria: 'Read 3+ community stories and understand curation process'
    },
    {
      id: 'become_community_reporter',
      title: 'Become a Community Reporter',
      description: 'Install the Chrome extension to report real community events with organizer consent and democratic editorial process',
      component: 'extension',
      icon: '🔗',
      action: {
        type: 'internal',
        url: '/extension',
        label: 'Get Reporter Extension'
      },
      benefits: [
        'Report organizing victories and celebrations',
        'Ensure organizer consent for all submissions',
        'Participate in community editorial decisions',
        'Amplify grassroots victories across UK'
      ],
      next_step_hint: 'Want decision-making power? Join community governance',
      completion_criteria: 'Install extension or understand reporting ethics'
    },
    {
      id: 'join_governance',
      title: 'Shape Our Community Platform',
      description: 'Participate in democratic governance, vote on platform decisions, and help curate community content',
      component: 'governance',
      icon: '🏛️',
      action: {
        type: 'internal',
        url: '/governance',
        label: 'Community Governance'
      },
      benefits: [
        'Vote on story features and platform changes',
        'Participate in content curation decisions',
        'Shape community guidelines and values',
        'Influence resource allocation and priorities'
      ],
      next_step_hint: 'You\'re now a full community member! Continue organizing',
      completion_criteria: 'Participate in voting or review governance documents'
    }
  ]

  useEffect(() => {
    // Check if user is new (no localStorage data)
    const savedProgress = localStorage.getItem('blkout_onboarding_progress')
    if (!savedProgress) {
      setShowWelcomeModal(true)
    } else {
      const progress = JSON.parse(savedProgress)
      setUserProgress(progress)
      setCurrentStep(progress.current_step)
    }
  }, [])

  const saveProgress = (progress: UserProgress) => {
    setUserProgress(progress)
    localStorage.setItem('blkout_onboarding_progress', JSON.stringify(progress))
  }

  const startOnboarding = () => {
    setIsOnboardingActive(true)
    setShowWelcomeModal(false)
    const initialProgress: UserProgress = {
      current_step: 1,
      completed_steps: [],
      engagement_level: 'exploring',
      preferred_interests: []
    }
    saveProgress(initialProgress)
  }

  const completeStep = (stepId: string) => {
    const newCompletedSteps = [...userProgress.completed_steps, stepId]
    const newEngagementLevel = newCompletedSteps.length >= 4 
      ? 'community_member' 
      : newCompletedSteps.length >= 2 
      ? 'engaged' 
      : 'exploring'

    const newProgress: UserProgress = {
      ...userProgress,
      current_step: Math.min(currentStep + 1, onboardingSteps.length),
      completed_steps: newCompletedSteps,
      engagement_level: newEngagementLevel
    }
    
    saveProgress(newProgress)
    setCurrentStep(newProgress.current_step)
  }

  const resetOnboarding = () => {
    localStorage.removeItem('blkout_onboarding_progress')
    setUserProgress({
      current_step: 1,
      completed_steps: [],
      engagement_level: 'newcomer',
      preferred_interests: []
    })
    setCurrentStep(1)
    setIsOnboardingActive(false)
    setShowWelcomeModal(true)
  }

  const currentStepData = onboardingSteps[currentStep - 1]
  const progressPercentage = (userProgress.completed_steps.length / onboardingSteps.length) * 100

  const getEngagementBadge = (level: string) => {
    const badges = {
      'newcomer': { icon: '👋', text: 'Welcome!', color: 'bg-blue-100 text-blue-800' },
      'exploring': { icon: '🌱', text: 'Exploring', color: 'bg-green-100 text-green-800' },
      'engaged': { icon: '⚡', text: 'Getting Involved', color: 'bg-yellow-100 text-yellow-800' },
      'community_member': { icon: '🌟', text: 'Community Member', color: 'bg-purple-100 text-purple-800' }
    }
    return badges[level] || badges.newcomer
  }

  return (
    <div className="community-onboarding max-w-4xl mx-auto p-6">
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full text-center"
            >
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to BLKOUT!</h2>
              <p className="text-gray-600 mb-6">
                We're a community-owned liberation platform for Black queer people across the UK. 
                Ready to start your journey?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={startOnboarding}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Start Community Journey
                </button>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  I'll explore on my own
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Community Onboarding</h1>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementBadge(userProgress.engagement_level).color}`}>
              <span className="mr-1">{getEngagementBadge(userProgress.engagement_level).icon}</span>
              {getEngagementBadge(userProgress.engagement_level).text}
            </div>
            <button
              onClick={resetOnboarding}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Progress: {userProgress.completed_steps.length} of {onboardingSteps.length} steps
            </span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {userProgress.completed_steps.length === onboardingSteps.length && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-green-800">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-semibold">Welcome to the community!</h3>
                <p className="text-sm">You've completed your liberation journey introduction. Ready to organize!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Step */}
      {currentStepData && (
        <motion.div
          key={currentStepData.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border-2 border-indigo-200 p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{currentStepData.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  Step {currentStep} of {onboardingSteps.length}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{currentStepData.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">You'll be able to:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {currentStepData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {currentStepData.action.type === 'external' ? (
                    <a
                      href={currentStepData.action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTimeout(() => completeStep(currentStepData.id), 5000)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {currentStepData.action.label}
                      <span className="text-sm">↗️</span>
                    </a>
                  ) : (
                    <Link
                      to={currentStepData.action.url}
                      onClick={() => setTimeout(() => completeStep(currentStepData.id), 3000)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {currentStepData.action.label}
                      <span className="text-sm">→</span>
                    </Link>
                  )}
                </div>

                <button
                  onClick={() => completeStep(currentStepData.id)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Mark Complete & Continue
                </button>
              </div>

              {currentStep < onboardingSteps.length && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Next:</strong> {currentStepData.next_step_hint}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onboardingSteps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = userProgress.completed_steps.includes(step.id)
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <motion.div
              key={step.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isCompleted 
                  ? 'border-green-500 bg-green-50' 
                  : isCurrent 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => !isUpcoming && setCurrentStep(stepNumber)}
              whileHover={{ scale: isUpcoming ? 1 : 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{step.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                  <p className="text-xs text-gray-600">{step.component}</p>
                </div>
                {isCompleted && <span className="text-green-500 text-xl">✓</span>}
                {isCurrent && <span className="text-indigo-500 text-xl">→</span>}
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2">{step.description}</p>
              
              <div className="mt-2">
                {isCompleted ? (
                  <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                ) : isCurrent ? (
                  <span className="text-xs text-indigo-600 font-medium">→ Current Step</span>
                ) : isUpcoming ? (
                  <span className="text-xs text-gray-400">Coming Up</span>
                ) : (
                  <span className="text-xs text-gray-600">Available</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Community Values Footer */}
      <div className="mt-12 text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Liberation Values</h3>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
          <span>🏳️‍⚧️ Trans Liberation</span>
          <span>✊🏿 Black Power</span>
          <span>🤝 Cooperative Ownership</span>
          <span>🏛️ Democratic Governance</span>
          <span>📰 Community Journalism</span>
          <span>🌍 Solidarity</span>
        </div>
      </div>
    </div>
  )
}

export default CommunityOnboarding