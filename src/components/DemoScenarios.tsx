/**
 * Demo Scenarios Component
 * Interactive demonstrations showing full user journeys through BLKOUT ecosystem
 * Showcases real-world community organizing and liberation scenarios
 */

import React, { useState, useEffect } from 'react'
import { useIntegration } from './CrossComponentIntegration'
import StoryDisclaimerBanner from './StoryDisclaimerBanner'

interface DemoScenario {
  id: string
  title: string
  description: string
  category: 'organizing' | 'health' | 'culture' | 'solidarity' | 'education'
  persona: DemoPersona
  journey_steps: JourneyStep[]
  expected_outcomes: string[]
  community_impact: string
  duration_minutes: number
}

interface DemoPersona {
  name: string
  location: string
  background: string
  goals: string[]
  challenges: string[]
  identity: string
}

interface JourneyStep {
  step: number
  component: string
  action: string
  description: string
  expected_result: string
  demo_data?: any
  timeline: string
}

const DemoScenarios: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scenarioProgress, setScenarioProgress] = useState<{ [key: string]: number }>({})
  
  const { addNotification, addActivity } = useIntegration()

  const demoScenarios: DemoScenario[] = [
    {
      id: 'trans_housing_organizing',
      title: 'Trans Housing Rights Campaign Victory',
      description: 'Follow Kai as they organize a successful campaign for trans-inclusive social housing policies in Manchester',
      category: 'organizing',
      persona: {
        name: 'Kai (they/them)',
        location: 'Manchester',
        background: 'Black trans community organizer, experienced in housing advocacy',
        goals: ['Secure trans-inclusive housing policies', 'Build coalition of supporters', 'Document organizing victory'],
        challenges: ['Navigating council bureaucracy', 'Building cross-community support', 'Maintaining momentum'],
        identity: 'Black trans organizer, 28, community college graduate'
      },
      journey_steps: [
        {
          step: 1,
          component: 'IVOR AI',
          action: 'Research housing discrimination patterns',
          description: 'Kai asks IVOR about trans housing discrimination in Manchester and gets specific local data, relevant policies, and organizing strategies',
          expected_result: 'Comprehensive brief on Manchester housing issues, contact info for local advocates, specific policy recommendations',
          timeline: '15 minutes'
        },
        {
          step: 2,
          component: 'Events Calendar',
          action: 'Find allies and build coalition',
          description: 'Kai searches Manchester events for housing justice groups, LGBTQ+ organizations, and community meetings to build support',
          expected_result: 'Contact with 3 local groups, 15 individual supporters identified, coalition meeting scheduled',
          timeline: '2 weeks'
        },
        {
          step: 3,
          component: 'IVOR AI',
          action: 'Develop campaign strategy',
          description: 'Kai works with IVOR to create campaign timeline, talking points, and petition language based on successful trans housing campaigns',
          expected_result: 'Complete campaign strategy, petition with 200+ signatures, media messaging framework',
          timeline: '1 week'
        },
        {
          step: 4,
          component: 'Community Governance',
          action: 'Build democratic campaign structure',
          description: 'Coalition uses BLKOUT governance tools to make decisions democratically about campaign priorities and tactics',
          expected_result: 'Consensus-based decision making process, transparent campaign governance, broader community buy-in',
          timeline: '3 weeks'
        },
        {
          step: 5,
          component: 'Chrome Extension',
          action: 'Document campaign victory',
          description: 'After successful council vote, Kai reports the victory through community journalism, with coalition consent for publication',
          expected_result: 'Manchester City Council adopts trans-inclusive housing policy, victory story published with community consent',
          timeline: '1 day'
        },
        {
          step: 6,
          component: 'Newsroom',
          action: 'Share organizing knowledge',
          description: 'Victory story goes through democratic editorial review and gets published, inspiring similar campaigns in other cities',
          expected_result: 'Story published, shared across UK organizing networks, template created for other cities',
          timeline: '1 week'
        }
      ],
      expected_outcomes: [
        'Manchester adopts trans-inclusive social housing policy',
        '£50k emergency housing fund established for QTIPOC+ residents',
        'Coalition of 8 organizations formed for future campaigns',
        'Organizing template shared with advocates in Birmingham, Leeds, Brighton',
        'Media coverage amplifies trans housing justice across UK'
      ],
      community_impact: 'Policy victory protects 200+ trans people from housing discrimination, creates £50k emergency fund, establishes organizing model replicated in 4 other cities',
      duration_minutes: 25
    },
    
    {
      id: 'health_resource_launch',
      title: 'Community Health Hub Launch',
      description: 'Follow Maya as they coordinate the launch of a Black queer community health resource in South London',
      category: 'health',
      persona: {
        name: 'Maya (she/her)',
        location: 'South London',
        background: 'Black lesbian nurse, community health advocate, experienced in grassroots organizing',
        goals: ['Launch community-controlled health hub', 'Address healthcare barriers for Black queer people', 'Create sustainable funding model'],
        challenges: ['NHS bureaucracy', 'Securing sustainable funding', 'Building trust with community'],
        identity: 'Black lesbian nurse, 34, masters in public health'
      },
      journey_steps: [
        {
          step: 1,
          component: 'IVOR AI',
          action: 'Research community health needs',
          description: 'Maya asks IVOR about health disparities affecting Black queer communities in South London, gets data on service gaps',
          expected_result: 'Comprehensive needs assessment, identification of key health barriers, contact info for community health advocates',
          timeline: '1 week'
        },
        {
          step: 2,
          component: 'Events Calendar',
          action: 'Community listening sessions',
          description: 'Maya organizes and promotes community meetings through events calendar to gather input on health priorities',
          expected_result: '4 listening sessions with 80+ community members, clear priorities identified: mental health, sexual health, trans healthcare',
          timeline: '3 weeks'
        },
        {
          step: 3,
          component: 'Community Governance',
          action: 'Democratic resource planning',
          description: 'Community uses governance tools to democratically decide on health hub priorities, services, and governance structure',
          expected_result: 'Community-controlled health hub model, democratic advisory board, service priorities set by community vote',
          timeline: '2 weeks'
        },
        {
          step: 4,
          component: 'IVOR AI',
          action: 'Navigate NHS partnership',
          description: 'Maya works with IVOR to understand NHS commissioning process and develop partnership proposal that maintains community control',
          expected_result: 'NHS partnership secured, £120k annual funding committed, community autonomy protected in agreements',
          timeline: '6 weeks'
        },
        {
          step: 5,
          component: 'Events Calendar',
          action: 'Launch celebration',
          description: 'Health hub launch event coordinated through events calendar, celebrating community ownership and accessibility',
          expected_result: '200+ people attend launch, strong media coverage, community ownership model highlighted',
          timeline: '1 day'
        },
        {
          step: 6,
          component: 'Chrome Extension',
          action: 'Document community victory',
          description: 'Maya reports the successful launch through community journalism, with community consent and editorial input',
          expected_result: 'Launch story published, NHS partnership model shared with other communities, replication toolkit created',
          timeline: '1 week'
        }
      ],
      expected_outcomes: [
        'Community-controlled health hub opens in South London',
        '£120k annual NHS partnership funding secured',
        '300+ Black queer people access culturally competent healthcare',
        'Democratic governance model protects community control',
        'Model replicated in Manchester and Birmingham'
      ],
      community_impact: 'Addresses healthcare barriers for 300+ Black queer people, creates community-controlled healthcare model, secures £120k sustainable funding, influences NHS policy on community partnerships',
      duration_minutes: 20
    },

    {
      id: 'cultural_celebration_organizing',
      title: 'Black Queer Joy Festival',
      description: 'Follow Alex as they organize a celebration of Black queer culture and resistance in Birmingham',
      category: 'culture',
      persona: {
        name: 'Alex (xe/xem)',
        location: 'Birmingham',
        background: 'Black queer artist and cultural worker, experienced in event organizing and community arts',
        goals: ['Center Black queer joy and celebration', 'Create intergenerational community space', 'Showcase local Black queer artists'],
        challenges: ['Securing venues and funding', 'Ensuring accessibility and safety', 'Building diverse programming'],
        identity: 'Black queer non-binary artist, 26, community arts background'
      },
      journey_steps: [
        {
          step: 1,
          component: 'IVOR AI',
          action: 'Research cultural organizing strategies',
          description: 'Alex asks IVOR about successful Black queer cultural events, accessibility best practices, and funding opportunities',
          expected_result: 'Event planning framework, accessibility checklist, 15+ funding opportunities identified, best practice examples',
          timeline: '2 weeks'
        },
        {
          step: 2,
          component: 'Events Calendar',
          action: 'Connect with local artists and venues',
          description: 'Alex uses events calendar to identify Black queer artists, community spaces, and potential collaborators in Birmingham',
          expected_result: '25+ local artists contacted, 3 community venues secured, planning committee of 8 people formed',
          timeline: '3 weeks'
        },
        {
          step: 3,
          component: 'Community Governance',
          action: 'Democratic festival planning',
          description: 'Planning committee uses governance tools to make collective decisions about programming, accessibility, and community agreements',
          expected_result: 'Consensus-based programming decisions, comprehensive accessibility plan, community agreements for safer space',
          timeline: '4 weeks'
        },
        {
          step: 4,
          component: 'Events Calendar',
          action: 'Promote festival across UK',
          description: 'Festival promoted through integrated events calendar, reaching Black queer communities across UK cities',
          expected_result: '500+ people registered, attendees from 12 UK cities, strong social media engagement, community excitement',
          timeline: '6 weeks'
        },
        {
          step: 5,
          component: 'Live Events Feed',
          action: 'Festival day coordination',
          description: 'Real-time coordination during festival through live events feed, ensuring accessibility and celebrating achievements',
          expected_result: '400+ people attend, 30+ artists perform, fully accessible, zero safety incidents, overwhelming community joy',
          timeline: '2 days'
        },
        {
          step: 6,
          component: 'Chrome Extension',
          action: 'Document cultural celebration',
          description: 'Community journalists document festival impact and community responses, with participant consent for publication',
          expected_result: 'Celebration documented and shared, cultural organizing model template created, inspiration for other cities',
          timeline: '1 week'
        }
      ],
      expected_outcomes: [
        'Black Queer Joy Festival brings together 400+ people',
        '30+ local Black queer artists showcased and paid fairly',
        'Fully accessible event with BSL interpretation, childcare, sensory-friendly spaces',
        'Intergenerational community connections strengthened',
        'Annual festival model established with democratic governance'
      ],
      community_impact: 'Celebrates and centers Black queer joy, provides paid opportunities for 30+ artists, creates annual tradition, strengthens intergenerational community bonds, inspires similar festivals in other cities',
      duration_minutes: 15
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isPlaying && activeScenario && currentStep < activeScenario.journey_steps.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
        
        const currentStepData = activeScenario.journey_steps[currentStep]
        if (currentStepData) {
          addActivity({
            type: 'ivor_conversation', // Simplified for demo
            title: `Demo: ${currentStepData.action}`,
            component: currentStepData.component.toLowerCase().replace(' ', '_'),
            user: activeScenario.persona.name
          })
        }
        
        if (currentStep >= activeScenario.journey_steps.length - 1) {
          setIsPlaying(false)
          addNotification({
            type: 'success',
            title: 'Demo Scenario Complete',
            message: `${activeScenario.title} demonstration finished successfully!`,
            component: 'demo_scenarios'
          })
        }
      }, 3000) // 3 seconds per step for demo
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentStep, activeScenario])

  const startScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario)
    setCurrentStep(0)
    setIsPlaying(true)
    
    addNotification({
      type: 'info',
      title: 'Demo Scenario Started',
      message: `Following ${scenario.persona.name} through ${scenario.title}`,
      component: 'demo_scenarios'
    })
  }

  const pauseScenario = () => {
    setIsPlaying(false)
  }

  const resumeScenario = () => {
    setIsPlaying(true)
  }

  const resetScenario = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'organizing': return '✊🏿'
      case 'health': return '🏥'
      case 'culture': return '🎭'
      case 'solidarity': return '🤝'
      case 'education': return '📚'
      default: return '🌟'
    }
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'organizing': return 'bg-red-50 text-red-700 border-red-200'
      case 'health': return 'bg-green-50 text-green-700 border-green-200'
      case 'culture': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'solidarity': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'education': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="demo-scenarios p-6 bg-white rounded-lg shadow-sm">
      {/* Disclaimer Banner */}
      <StoryDisclaimerBanner persistent={true} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            Demo Scenarios
          </h2>
          <p className="text-gray-600 mt-1">
            Interactive demonstrations of full user journeys through BLKOUT ecosystem
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          {demoScenarios.length} scenarios • Real community organizing examples
        </div>
      </div>

      {/* Scenario Selection */}
      {!activeScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {demoScenarios.map((scenario) => (
            <div key={scenario.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(scenario.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded border ${getCategoryColor(scenario.category)}`}>
                      {scenario.category}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {scenario.duration_minutes} min
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{scenario.description}</p>
              
              {/* Persona Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Following:</h4>
                <div className="text-sm text-gray-600">
                  <div><strong>{scenario.persona.name}</strong> • {scenario.persona.location}</div>
                  <div className="mt-1">{scenario.persona.identity}</div>
                  <div className="mt-2">
                    <strong>Goals:</strong> {scenario.persona.goals.slice(0, 2).join(', ')}
                    {scenario.persona.goals.length > 2 && '...'}
                  </div>
                </div>
              </div>
              
              {/* Journey Preview */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Journey ({scenario.journey_steps.length} steps):</h4>
                <div className="flex flex-wrap gap-1">
                  {scenario.journey_steps.map((step, index) => (
                    <span key={index} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {step.component}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => startScenario(scenario)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Start Demo Journey
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Scenario Player */}
      {activeScenario && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
          {/* Scenario Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                {getCategoryIcon(activeScenario.category)}
                {activeScenario.title}
              </h3>
              <div className="mt-2 text-indigo-700">
                Following <strong>{activeScenario.persona.name}</strong> in {activeScenario.persona.location}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-indigo-600">
                Step {currentStep + 1} of {activeScenario.journey_steps.length}
              </div>
              <button
                onClick={() => setActiveScenario(null)}
                className="text-indigo-400 hover:text-indigo-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-600">Progress</span>
              <span className="text-sm text-indigo-600">
                {Math.round(((currentStep + 1) / activeScenario.journey_steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / activeScenario.journey_steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Display */}
          {activeScenario.journey_steps[currentStep] && (
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Step {currentStep + 1}: {activeScenario.journey_steps[currentStep].action}
                </h4>
                <div className="text-sm text-gray-500">
                  {activeScenario.journey_steps[currentStep].component}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                {activeScenario.journey_steps[currentStep].description}
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">Expected Result:</h5>
                <p className="text-green-700 text-sm">
                  {activeScenario.journey_steps[currentStep].expected_result}
                </p>
                <div className="text-xs text-green-600 mt-2">
                  Timeline: {activeScenario.journey_steps[currentStep].timeline}
                </div>
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {!isPlaying ? (
              <button
                onClick={resumeScenario}
                disabled={currentStep >= activeScenario.journey_steps.length}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {currentStep === 0 ? '▶️ Start' : '▶️ Continue'}
              </button>
            ) : (
              <button
                onClick={pauseScenario}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                ⏸️ Pause
              </button>
            )}
            
            <button
              onClick={resetScenario}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              🔄 Reset
            </button>
          </div>

          {/* Scenario Complete */}
          {currentStep >= activeScenario.journey_steps.length && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-800 mb-3">🎉 Scenario Complete!</h4>
              
              <div className="mb-4">
                <h5 className="font-medium text-green-800 mb-2">Community Impact:</h5>
                <p className="text-green-700 text-sm mb-3">{activeScenario.community_impact}</p>
                
                <h5 className="font-medium text-green-800 mb-2">Key Outcomes:</h5>
                <ul className="text-green-700 text-sm space-y-1">
                  {activeScenario.expected_outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveScenario(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Choose Another Scenario
                </button>
                <button
                  onClick={resetScenario}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Watch Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          🎬 Interactive demo scenarios • Real community organizing examples • 
          Showcasing BLKOUT ecosystem potential for liberation work
        </p>
      </div>
    </div>
  )
}

export default DemoScenarios