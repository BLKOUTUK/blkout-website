/**
 * Stakeholder Demo Environment
 * Complete ecosystem demonstration for stakeholders
 * Interactive guided tours showing full platform potential
 * 
 * ⚠️  DEMONSTRATION ENVIRONMENT - Fictional data for showcasing workflow capabilities
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DemoScenario {
  id: string
  title: string
  description: string
  duration: string
  stakeholder_group: 'community_leaders' | 'funders' | 'media' | 'tech_partners' | 'government'
  components_showcased: string[]
  key_features: string[]
  user_journey_steps: {
    step: number
    component: string
    action: string
    outcome: string
    metrics_shown?: string[]
  }[]
  success_metrics: {
    metric: string
    target_value: string
    demonstration_value: string
  }[]
  questions_addressed: string[]
}

interface DemoMetrics {
  ecosystem_health: number
  user_engagement: number
  community_impact: number
  technical_performance: number
  democratic_participation: number
  story_amplification: number
}

interface LiveDemoState {
  current_scenario: string | null
  current_step: number
  demo_running: boolean
  metrics_updating: boolean
  stakeholder_feedback: {
    engagement_score: number
    questions_asked: number
    concerns_raised: string[]
    positive_reactions: string[]
  }
}

const StakeholderDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'guided-tour' | 'metrics' | 'feedback'>('overview')
  const [demoScenarios, setDemoScenarios] = useState<DemoScenario[]>([])
  const [demoMetrics, setDemoMetrics] = useState<DemoMetrics | null>(null)
  const [liveDemoState, setLiveDemoState] = useState<LiveDemoState>({
    current_scenario: null,
    current_step: 0,
    demo_running: false,
    metrics_updating: false,
    stakeholder_feedback: {
      engagement_score: 0,
      questions_asked: 0,
      concerns_raised: [],
      positive_reactions: []
    }
  })

  useEffect(() => {
    // Comprehensive demo scenarios for different stakeholder groups
    const scenarios: DemoScenario[] = [
      {
        id: 'community-leader-journey',
        title: 'Community Leader: End-to-End Organizing Journey',
        description: 'Follow Maya from Trans Housing Network as she uses BLKOUT ecosystem to coordinate a housing campaign, from IVOR consultation to story amplification.',
        duration: '15 minutes',
        stakeholder_group: 'community_leaders',
        components_showcased: [
          'IVOR AI Consultation', 'Community Dashboard', 'Events Calendar', 
          'Newsroom Integration', 'Story Amplification', 'Democratic Governance'
        ],
        key_features: [
          'AI-powered organizing advice',
          'Real-time community coordination',
          'Democratic story validation',
          'Cross-platform amplification',
          'Impact measurement'
        ],
        user_journey_steps: [
          {
            step: 1,
            component: 'IVOR AI',
            action: 'Maya asks IVOR for housing campaign strategy advice',
            outcome: 'IVOR provides UK-specific tactics and connects to successful campaigns',
            metrics_shown: ['AI response accuracy', 'UK context integration']
          },
          {
            step: 2,
            component: 'Events Calendar',
            action: 'Schedule community meeting through integrated calendar',
            outcome: 'Event automatically shared across partner networks',
            metrics_shown: ['Event reach', 'Partner engagement']
          },
          {
            step: 3,
            component: 'Community Dashboard',
            action: 'Track campaign progress and community engagement',
            outcome: 'Real-time metrics show growing support and identify key supporters',
            metrics_shown: ['Community growth', 'Engagement rates']
          },
          {
            step: 4,
            component: 'Newsroom',
            action: 'Document organizing victory through community journalism',
            outcome: 'Story captures tactics and celebrates community power',
            metrics_shown: ['Story reach', 'Community verification']
          },
          {
            step: 5,
            component: 'Story Amplification',
            action: 'IVOR generates personalized content for different platforms',
            outcome: 'Democratic community approval process validates amplification',
            metrics_shown: ['Amplification reach', 'Community approval rate']
          },
          {
            step: 6,
            component: 'Democratic Governance',
            action: 'Community votes on platform improvements based on campaign learnings',
            outcome: 'Platform evolves based on real organizing needs',
            metrics_shown: ['Governance participation', 'Platform adaptation']
          }
        ],
        success_metrics: [
          { metric: 'Campaign Success Rate', target_value: '75%', demonstration_value: '89%' },
          { metric: 'Community Engagement', target_value: '60%', demonstration_value: '84%' },
          { metric: 'Story Amplification', target_value: '500 reach', demonstration_value: '1,420 reach' },
          { metric: 'Democratic Participation', target_value: '40%', demonstration_value: '67%' }
        ],
        questions_addressed: [
          'How does IVOR provide UK-specific organizing advice?',
          'How do we ensure community data sovereignty?',
          'What prevents surveillance and co-optation?',
          'How does democratic governance actually work?',
          'Can this scale while maintaining community control?'
        ]
      },
      {
        id: 'funder-impact-demo',
        title: 'Funder: Community Impact & Sustainability Demonstration',
        description: 'Comprehensive view of how BLKOUT creates measurable community impact, financial sustainability, and democratic accountability.',
        duration: '12 minutes',
        stakeholder_group: 'funders',
        components_showcased: [
          'Impact Metrics Dashboard', 'Financial Transparency', 'Community Ownership Model',
          'Democratic Governance', 'Sustainability Planning'
        ],
        key_features: [
          'Transparent impact measurement',
          'Community-controlled funding',
          'Democratic decision-making',
          'Cooperative ownership model',
          'Long-term sustainability'
        ],
        user_journey_steps: [
          {
            step: 1,
            component: 'Impact Dashboard',
            action: 'Review comprehensive community impact metrics',
            outcome: 'Clear evidence of organizing victories, community growth, liberation outcomes',
            metrics_shown: ['Community size growth', 'Organizing victories', 'Lives improved']
          },
          {
            step: 2,
            component: 'Financial Transparency',
            action: 'Examine cooperative financial model and community ownership',
            outcome: 'Transparent budgeting, community-controlled resources, sustainable revenue',
            metrics_shown: ['Revenue streams', 'Community investment', 'Financial health']
          },
          {
            step: 3,
            component: 'Democratic Governance',
            action: 'Observe community decision-making processes in action',
            outcome: 'Community members directly control platform development and priorities',
            metrics_shown: ['Voter participation', 'Decision implementation', 'Community satisfaction']
          }
        ],
        success_metrics: [
          { metric: 'Community Impact Score', target_value: '70%', demonstration_value: '89%' },
          { metric: 'Financial Sustainability', target_value: '80%', demonstration_value: '94%' },
          { metric: 'Democratic Participation', target_value: '50%', demonstration_value: '67%' }
        ],
        questions_addressed: [
          'How do you measure liberation impact?',
          'What is the cooperative ownership model?',
          'How do you ensure long-term sustainability?',
          'How does community control actually work?',
          'What are the accountability mechanisms?'
        ]
      },
      {
        id: 'media-journalism-demo',
        title: 'Media: Community Journalism & Story Verification',
        description: 'Deep dive into ethical community journalism practices, story verification, and amplification without exploitation.',
        duration: '10 minutes',
        stakeholder_group: 'media',
        components_showcased: [
          'Community Newsroom', 'Story Verification', 'Consent Protocols',
          'Editorial Independence', 'Amplification Ethics'
        ],
        key_features: [
          'Community-controlled journalism',
          'Rigorous verification processes',
          'Consent-based storytelling',
          'Editorial independence',
          'Ethical amplification'
        ],
        user_journey_steps: [
          {
            step: 1,
            component: 'Community Newsroom',
            action: 'Review community journalism standards and editorial processes',
            outcome: 'Stories center community voice, follow ethical guidelines, maintain independence',
            metrics_shown: ['Editorial standards compliance', 'Community satisfaction']
          },
          {
            step: 2,
            component: 'Verification System',
            action: 'Examine story verification and fact-checking processes',
            outcome: 'Multi-layer verification ensures accuracy while protecting community privacy',
            metrics_shown: ['Verification accuracy', 'Community safety']
          },
          {
            step: 3,
            component: 'Consent Protocols',
            action: 'Review consent collection and community approval workflows',
            outcome: 'Stories only published with explicit community consent and ongoing control',
            metrics_shown: ['Consent compliance', 'Community control']
          }
        ],
        success_metrics: [
          { metric: 'Story Accuracy Rate', target_value: '95%', demonstration_value: '98%' },
          { metric: 'Community Consent', target_value: '100%', demonstration_value: '100%' },
          { metric: 'Editorial Independence', target_value: '90%', demonstration_value: '96%' }
        ],
        questions_addressed: [
          'How do you verify community stories?',
          'What are the consent protocols?',
          'How do you maintain editorial independence?',
          'How do you prevent extractive journalism?',
          'What ethical standards do you follow?'
        ]
      },
      {
        id: 'tech-architecture-demo',
        title: 'Tech Partners: Platform Architecture & Security',
        description: 'Technical deep dive into BLKOUT architecture, security measures, privacy protection, and community data sovereignty.',
        duration: '18 minutes',
        stakeholder_group: 'tech_partners',
        components_showcased: [
          'System Architecture', 'Security Protocols', 'Privacy Protection',
          'Data Sovereignty', 'AI Transparency', 'Performance Metrics'
        ],
        key_features: [
          'Community-controlled infrastructure',
          'End-to-end encryption',
          'Local data storage options',
          'AI transparency and bias prevention',
          'Open source components'
        ],
        user_journey_steps: [
          {
            step: 1,
            component: 'System Architecture',
            action: 'Review distributed architecture and community control mechanisms',
            outcome: 'Decentralized design prevents single points of control or failure',
            metrics_shown: ['System uptime', 'Decentralization metrics']
          },
          {
            step: 2,
            component: 'Security & Privacy',
            action: 'Examine encryption, data protection, and privacy measures',
            outcome: 'Military-grade security with community-controlled data sovereignty',
            metrics_shown: ['Security audit scores', 'Privacy compliance']
          },
          {
            step: 3,
            component: 'AI Transparency',
            action: 'Review IVOR AI training, bias prevention, and community oversight',
            outcome: 'Transparent AI with community oversight and bias detection systems',
            metrics_shown: ['Bias detection scores', 'Community AI oversight']
          }
        ],
        success_metrics: [
          { metric: 'Security Score', target_value: '95%', demonstration_value: '98%' },
          { metric: 'Privacy Compliance', target_value: '100%', demonstration_value: '100%' },
          { metric: 'AI Transparency', target_value: '90%', demonstration_value: '94%' }
        ],
        questions_addressed: [
          'How is community data protected?',
          'What are the security protocols?',
          'How do you prevent AI bias?',
          'What is the technical architecture?',
          'How do you ensure data sovereignty?'
        ]
      }
    ]

    const metrics: DemoMetrics = {
      ecosystem_health: 94,
      user_engagement: 87,
      community_impact: 91,
      technical_performance: 96,
      democratic_participation: 78,
      story_amplification: 89
    }

    setDemoScenarios(scenarios)
    setDemoMetrics(metrics)
  }, [])

  const startDemo = (scenarioId: string) => {
    setLiveDemoState(prev => ({
      ...prev,
      current_scenario: scenarioId,
      current_step: 0,
      demo_running: true,
      metrics_updating: true
    }))
  }

  const nextDemoStep = () => {
    const currentScenario = demoScenarios.find(s => s.id === liveDemoState.current_scenario)
    if (currentScenario && liveDemoState.current_step < currentScenario.user_journey_steps.length - 1) {
      setLiveDemoState(prev => ({
        ...prev,
        current_step: prev.current_step + 1
      }))
    }
  }

  const stopDemo = () => {
    setLiveDemoState(prev => ({
      ...prev,
      current_scenario: null,
      current_step: 0,
      demo_running: false,
      metrics_updating: false
    }))
  }

  const getStakeholderColor = (group: DemoScenario['stakeholder_group']) => {
    const colors = {
      community_leaders: 'bg-red-100 text-red-800',
      funders: 'bg-green-100 text-green-800',
      media: 'bg-blue-100 text-blue-800',
      tech_partners: 'bg-purple-100 text-purple-800',
      government: 'bg-orange-100 text-orange-800'
    }
    return colors[group]
  }

  const getStakeholderIcon = (group: DemoScenario['stakeholder_group']) => {
    const icons = {
      community_leaders: '✊🏿',
      funders: '💰',
      media: '📰',
      tech_partners: '⚙️',
      government: '🏛️'
    }
    return icons[group]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              🎯 Stakeholder Demo Environment
            </h1>
            <p className="text-indigo-100 text-lg mt-2">
              Interactive ecosystem demonstrations for investors, partners, and community leaders
            </p>
            <p className="text-indigo-200 text-sm mt-1">
              ⚠️ Demonstration environment with fictional scenarios showcasing platform capabilities
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {liveDemoState.demo_running ? '🔴 LIVE DEMO' : '⚪ READY'}
            </div>
            <div className="text-sm text-indigo-200">
              {demoScenarios.length} scenarios available
            </div>
          </div>
        </div>

        {/* Live Demo Status */}
        {liveDemoState.demo_running && (
          <div className="mt-4 p-4 bg-indigo-700/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>
                🎬 Running: {demoScenarios.find(s => s.id === liveDemoState.current_scenario)?.title}
              </span>
              <span>
                Step {liveDemoState.current_step + 1} of {demoScenarios.find(s => s.id === liveDemoState.current_scenario)?.user_journey_steps.length}
              </span>
              <button 
                onClick={stopDemo}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-all"
              >
                Stop Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'overview', label: 'Overview', icon: '🏠' },
          { key: 'scenarios', label: 'Demo Scenarios', icon: '🎬' },
          { key: 'guided-tour', label: 'Guided Tour', icon: '🎯' },
          { key: 'metrics', label: 'Live Metrics', icon: '📊' },
          { key: 'feedback', label: 'Feedback', icon: '💬' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all
              ${activeTab === tab.key
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Ecosystem Demonstration</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Platform Components Showcased</h3>
                    <div className="space-y-2">
                      {[
                        '🤖 IVOR AI Assistant (6 integrated services)',
                        '🏠 BLKOUT Community Website',
                        '📰 Community Newsroom & Stories',
                        '📅 Events Calendar & Coordination',
                        '🏛️ Democratic Governance System',
                        '📡 Story Amplification Network',
                        '👥 Live Community Showcase',
                        '🚀 Launch Coordination Tools',
                        '📊 Performance & Impact Analytics',
                        '🔗 Chrome Extension for Real Events',
                        '🛡️ Privacy & Security Protocols',
                        '💚 Community Onboarding Flow',
                        '🎯 User Journey Visualization'
                      ].map((component, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm">{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Key Value Propositions</h3>
                    <div className="space-y-3">
                      {[
                        {
                          title: 'Liberation Through Technology',
                          desc: 'AI and platform designed specifically for Black queer liberation organizing'
                        },
                        {
                          title: 'Community Sovereignty',
                          desc: 'Democratic governance ensures community control over technology and data'
                        },
                        {
                          title: 'Cooperative Economics',
                          desc: 'Community-owned platform with transparent, sustainable financial model'
                        },
                        {
                          title: 'Intersectional Approach',
                          desc: 'Centering most marginalized voices while building broad coalition power'
                        },
                        {
                          title: 'Measurable Impact',
                          desc: 'Clear metrics showing organizing victories and community empowerment'
                        }
                      ].map((value, index) => (
                        <div key={index} className="p-3 border-l-4 border-indigo-500 bg-indigo-50">
                          <div className="font-medium text-indigo-900">{value.title}</div>
                          <div className="text-sm text-indigo-700">{value.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Demo Options */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Choose Your Demonstration Path</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { type: 'community_leaders', title: 'Community Leaders', desc: '15-min organizing journey', color: 'red' },
                      { type: 'funders', title: 'Funders & Investors', desc: '12-min impact demo', color: 'green' },
                      { type: 'media', title: 'Media & Journalists', desc: '10-min journalism ethics', color: 'blue' },
                      { type: 'tech_partners', title: 'Tech Partners', desc: '18-min architecture deep dive', color: 'purple' }
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setActiveTab('scenarios')}
                        className={`p-4 rounded-lg border-2 border-${option.color}-200 hover:border-${option.color}-400 bg-${option.color}-50 hover:bg-${option.color}-100 transition-all text-left`}
                      >
                        <div className="font-bold text-gray-900">{option.title}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Demo Scenarios</h2>
              
              {demoScenarios.map((scenario) => (
                <div key={scenario.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getStakeholderIcon(scenario.stakeholder_group)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{scenario.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStakeholderColor(scenario.stakeholder_group)}`}>
                            {scenario.stakeholder_group.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{scenario.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span>⏱️ {scenario.duration}</span>
                          <span>📱 {scenario.components_showcased.length} components</span>
                          <span>🎯 {scenario.user_journey_steps.length} steps</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => startDemo(scenario.id)}
                        disabled={liveDemoState.demo_running}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {liveDemoState.current_scenario === scenario.id ? '🔴 Running' : '▶️ Start Demo'}
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all">
                        📋 View Details
                      </button>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Key Features Demonstrated:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scenario.key_features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Success Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    {scenario.success_metrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="font-bold text-lg text-indigo-600">{metric.demonstration_value}</div>
                        <div className="text-xs text-gray-500">{metric.metric}</div>
                        <div className="text-xs text-green-600">Target: {metric.target_value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'guided-tour' && liveDemoState.demo_running && (
            <motion.div
              key="guided-tour"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {(() => {
                const currentScenario = demoScenarios.find(s => s.id === liveDemoState.current_scenario)
                const currentStep = currentScenario?.user_journey_steps[liveDemoState.current_step]
                
                if (!currentScenario || !currentStep) return null

                return (
                  <div className="bg-white border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{currentScenario.title}</h2>
                        <p className="text-gray-600">Step {currentStep.step} of {currentScenario.user_journey_steps.length}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={nextDemoStep}
                          disabled={liveDemoState.current_step >= currentScenario.user_journey_steps.length - 1}
                          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                          Next Step →
                        </button>
                        <button
                          onClick={stopDemo}
                          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all"
                        >
                          End Demo
                        </button>
                      </div>
                    </div>

                    {/* Current Step Display */}
                    <div className="space-y-6">
                      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
                        <h3 className="font-bold text-lg text-indigo-900 mb-2">
                          {currentStep.component}: {currentStep.action}
                        </h3>
                        <p className="text-indigo-800 mb-4">{currentStep.outcome}</p>
                        
                        {currentStep.metrics_shown && (
                          <div className="flex gap-4">
                            {currentStep.metrics_shown.map((metric, index) => (
                              <div key={index} className="bg-white px-3 py-2 rounded-lg">
                                <div className="text-sm font-medium text-indigo-900">{metric}</div>
                                <div className="text-lg font-bold text-indigo-600">
                                  {Math.floor(Math.random() * 40) + 60}%
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Progress Visualization */}
                      <div className="flex items-center justify-between">
                        {currentScenario.user_journey_steps.map((step, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                              ${index <= liveDemoState.current_step 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-300 text-gray-600'
                              }
                            `}>
                              {step.step}
                            </div>
                            <div className="text-xs text-center text-gray-600 mt-2 max-w-20">
                              {step.component}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}

          {activeTab === 'metrics' && demoMetrics && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live Demo Metrics</h2>
              
              {/* Real-time Metrics */}
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(demoMetrics).map(([key, value]) => (
                  <div key={key} className="bg-white border rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{value}%</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stakeholder Engagement */}
              <div className="bg-white border rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Real-time Stakeholder Engagement</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">Engagement Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">Questions Asked</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-gray-600">Positive Reactions</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Concerns Raised</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Stakeholder Feedback & Next Steps</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 text-green-700">Positive Feedback Themes</h3>
                  <div className="space-y-3">
                    {[
                      'Community-centered approach is genuinely innovative',
                      'Democratic governance model addresses key concerns',
                      'Technical architecture prioritizes community sovereignty',
                      'Clear impact metrics demonstrate measurable liberation',
                      'Cooperative economic model is financially sustainable',
                      'AI integration serves community organizing effectively'
                    ].map((feedback, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-green-600 text-lg">✓</span>
                        <span className="text-gray-700 text-sm">{feedback}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 text-orange-700">Key Questions & Concerns</h3>
                  <div className="space-y-3">
                    {[
                      'How do you ensure long-term financial sustainability?',
                      'What prevents platform from being co-opted or surveilled?',
                      'How does democratic governance scale with growth?',
                      'What are the accountability mechanisms for AI decisions?',
                      'How do you balance transparency with community safety?',
                      'What evidence exists for organizing effectiveness?'
                    ].map((concern, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-orange-600 text-lg">?</span>
                        <span className="text-gray-700 text-sm">{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-indigo-900">Recommended Next Steps</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-indigo-800 mb-3">For Community Leaders:</h4>
                    <ul className="space-y-1 text-sm text-indigo-700">
                      <li>• Schedule 1:1 demonstration with your organizing team</li>
                      <li>• Beta test IVOR with real campaign questions</li>
                      <li>• Join governance working group discussions</li>
                      <li>• Connect with other partner organizations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800 mb-3">For Funders & Partners:</h4>
                    <ul className="space-y-1 text-sm text-indigo-700">
                      <li>• Review cooperative investment model details</li>
                      <li>• Examine impact measurement methodologies</li>
                      <li>• Connect with community accountability board</li>
                      <li>• Discuss alignment with liberation funding priorities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StakeholderDemo