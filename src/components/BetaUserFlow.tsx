/**
 * Beta User Flow Designer
 * Interactive visualization showing full ecosystem potential through user journeys
 * Demonstrates liberation platform capabilities and community impact
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

interface UserPersona {
  id: string
  name: string
  pronouns: string
  location: string
  background: string
  needs: string[]
  goals: string[]
  current_challenges: string[]
  liberation_priorities: string[]
}

interface FlowStep {
  id: string
  title: string
  component: string
  action: string
  user_experience: string
  ecosystem_value: string
  liberation_impact: string
  next_actions: string[]
  time_estimate: string
}

interface EcosystemPotential {
  community_organizing: string[]
  democratic_governance: string[]
  mutual_aid_coordination: string[]
  cultural_celebration: string[]
  health_advocacy: string[]
  liberation_strategy: string[]
}

const BetaUserFlow: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('alex_organizer')
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [showPotentialView, setShowPotentialView] = useState(false)
  const [flowProgress, setFlowProgress] = useState<number>(0)

  const userPersonas: UserPersona[] = [
    {
      id: 'alex_organizer',
      name: 'Alex',
      pronouns: 'they/them',
      location: 'Manchester',
      background: 'Experienced community organizer, works with trans housing rights, looking to expand network and coordinate with other UK cities',
      needs: ['Cross-city coordination', 'Resource sharing', 'Campaign amplification', 'Community connections'],
      goals: ['Scale housing rights campaign UK-wide', 'Connect with similar organizers', 'Share successful strategies'],
      current_challenges: ['Isolated organizing', 'Limited resources', 'Need for broader platform'],
      liberation_priorities: ['Trans liberation', 'Housing justice', 'Community self-determination']
    },
    {
      id: 'maya_newcomer',
      name: 'Maya',
      pronouns: 'she/her',
      location: 'Bristol',
      background: 'New to community organizing, recently moved to UK, wants to get involved in Black queer liberation work',
      needs: ['Community introduction', 'Skill building', 'Local connections', 'Guidance on involvement'],
      goals: ['Find community', 'Learn organizing skills', 'Contribute meaningfully'],
      current_challenges: ['New to area', 'Limited connections', 'Uncertainty about how to help'],
      liberation_priorities: ['Black power', 'Community building', 'Solidarity']
    },
    {
      id: 'jordan_artist',
      name: 'Jordan',
      pronouns: 'he/him',
      location: 'Birmingham',
      background: 'Creative activist using art for liberation, organizes cultural events, seeks platform for community expression',
      needs: ['Event promotion', 'Artist collaboration', 'Community engagement', 'Cultural space'],
      goals: ['Create liberation art', 'Build cultural movement', 'Support community joy'],
      current_challenges: ['Limited reach', 'Resource constraints', 'Need for community platform'],
      liberation_priorities: ['Cultural liberation', 'Creative expression', 'Community joy']
    },
    {
      id: 'sage_health_advocate',
      name: 'Sage',
      pronouns: 'they/them',
      location: 'Edinburgh',
      background: 'Health advocate focused on QTIPOC+ community health, works with NHS and community orgs',
      needs: ['Health resource distribution', 'Community education', 'Policy advocacy', 'Service coordination'],
      goals: ['Improve health access', 'Share resources', 'Advocate for policy change'],
      current_challenges: ['Resource gaps', 'Limited community reach', 'Policy barriers'],
      liberation_priorities: ['Health justice', 'Community care', 'Policy change']
    }
  ]

  const betaUserFlows: Record<string, FlowStep[]> = {
    alex_organizer: [
      {
        id: 'discover_platform',
        title: 'Discover Liberation Platform',
        component: 'Homepage',
        action: 'Lands on BLKOUT homepage, sees "Get Started" prominently',
        user_experience: 'Immediately understands this is community-owned platform for Black queer liberation',
        ecosystem_value: 'Clear value proposition connects to organizing experience',
        liberation_impact: 'Recognizes platform aligns with liberation values',
        next_actions: ['Click Get Started', 'Explore community stories', 'Check events calendar'],
        time_estimate: '2 minutes'
      },
      {
        id: 'onboarding_journey',
        title: 'Progressive Community Onboarding',
        component: 'Onboarding Flow',
        action: 'Goes through 6-step onboarding: Community → IVOR → Events → Stories → Reporter → Governance',
        user_experience: 'Guided introduction builds understanding of ecosystem connections',
        ecosystem_value: 'Each step reveals new collaboration possibilities',
        liberation_impact: 'Sees democratic governance and community ownership in action',
        next_actions: ['Complete onboarding steps', 'Chat with IVOR', 'Explore events'],
        time_estimate: '15 minutes'
      },
      {
        id: 'ivor_organizing_consultation',
        title: 'AI Liberation Assistant',
        component: 'IVOR Chat',
        action: 'Asks IVOR about scaling trans housing campaign across UK cities',
        user_experience: 'Gets specific advice on multi-city organizing, contact info for similar campaigns',
        ecosystem_value: 'IVOR connects Alex to existing organizing network and resources',
        liberation_impact: 'AI supports grassroots strategy rather than replacing community decision-making',
        next_actions: ['Get organizing contacts', 'Find similar campaigns', 'Access resources'],
        time_estimate: '10 minutes'
      },
      {
        id: 'discover_uk_network',
        title: 'UK Community Network',
        component: 'Events Calendar',
        action: 'Explores events across UK cities, filters by housing rights and trans organizing',
        user_experience: 'Discovers 15+ related events across Manchester, London, Birmingham, Bristol',
        ecosystem_value: 'Sees breadth of UK organizing, identifies collaboration opportunities',
        liberation_impact: 'Realizes scale of Black queer organizing across UK',
        next_actions: ['Contact event organizers', 'Plan collaboration', 'Share resources'],
        time_estimate: '8 minutes'
      },
      {
        id: 'read_victory_stories',
        title: 'Learn from Community Victories',
        component: 'Newsroom',
        action: 'Reads stories about housing victories in other UK cities, democratic editorial process',
        user_experience: 'Learns specific strategies, sees community journalism process',
        ecosystem_value: 'Gains tactical knowledge and understands platform transparency',
        liberation_impact: 'Inspired by grassroots victories, understands collective power',
        next_actions: ['Adapt strategies', 'Connect with featured organizers', 'Plan story sharing'],
        time_estimate: '12 minutes'
      },
      {
        id: 'coordinate_campaign',
        title: 'Multi-City Campaign Coordination',
        component: 'Partnership System',
        action: 'Connects with verified UK organizations, proposes coordinated housing rights campaign',
        user_experience: 'Finds 5 organizations working on housing, initiates collaboration',
        ecosystem_value: 'Platform facilitates real organizing coordination across UK',
        liberation_impact: 'Enables scaling of liberation work through authentic partnerships',
        next_actions: ['Plan joint actions', 'Share resources', 'Coordinate strategies'],
        time_estimate: '20 minutes'
      },
      {
        id: 'democratic_participation',
        title: 'Community Governance',
        component: 'Governance System',
        action: 'Participates in platform decisions, votes on story features, proposes policy',
        user_experience: 'Has real voice in platform direction, sees democratic process',
        ecosystem_value: 'Community ownership creates accountability and responsiveness',
        liberation_impact: 'Practices democracy that models liberation values',
        next_actions: ['Engage in governance', 'Propose improvements', 'Vote on decisions'],
        time_estimate: '15 minutes'
      }
    ],
    maya_newcomer: [
      {
        id: 'welcome_discovery',
        title: 'Find Liberation Community',
        component: 'Homepage',
        action: 'Arrives seeking Black queer community, sees welcoming liberation platform',
        user_experience: 'Feels immediate sense of belonging and community values',
        ecosystem_value: 'Platform provides entry point to broader liberation ecosystem',
        liberation_impact: 'Connects to movement rather than just individual resources',
        next_actions: ['Start onboarding', 'Explore stories', 'Find local events'],
        time_estimate: '3 minutes'
      },
      {
        id: 'guided_introduction',
        title: 'Supportive Onboarding',
        component: 'Onboarding Flow',
        action: 'Progressive introduction builds confidence and understanding',
        user_experience: 'Doesn\'t feel overwhelmed, guided step-by-step through ecosystem',
        ecosystem_value: 'Onboarding creates informed, engaged community members',
        liberation_impact: 'Inclusive process centers newcomer needs and pace',
        next_actions: ['Complete each step', 'Ask questions', 'Explore interests'],
        time_estimate: '20 minutes'
      },
      {
        id: 'personalized_guidance',
        title: 'AI Mentorship',
        component: 'IVOR Chat',
        action: 'Asks about getting involved in Bristol organizing as newcomer',
        user_experience: 'Gets specific local resources, beginner-friendly opportunities',
        ecosystem_value: 'AI provides personalized pathway based on location and experience',
        liberation_impact: 'Support system helps build confident organizers',
        next_actions: ['Join beginner events', 'Connect locally', 'Build skills'],
        time_estimate: '12 minutes'
      },
      {
        id: 'local_community_discovery',
        title: 'Bristol Community Connection',
        component: 'Events Calendar',
        action: 'Finds beginner-friendly events in Bristol, sees diversity of activities',
        user_experience: 'Discovers multiple entry points: social, educational, organizing, cultural',
        ecosystem_value: 'Platform makes local organizing accessible to newcomers',
        liberation_impact: 'Multiple pathways honor different ways of contributing',
        next_actions: ['Attend events', 'Meet organizers', 'Find niche'],
        time_estimate: '10 minutes'
      },
      {
        id: 'learning_through_stories',
        title: 'Liberation Education',
        component: 'Newsroom',
        action: 'Reads beginner-focused stories, learns organizing principles and victories',
        user_experience: 'Stories provide education without being patronizing',
        ecosystem_value: 'Democratic journalism serves educational function',
        liberation_impact: 'Learns liberation history and current victories',
        next_actions: ['Continue learning', 'Find role models', 'Understand strategy'],
        time_estimate: '15 minutes'
      },
      {
        id: 'first_contribution',
        title: 'Community Reporter',
        component: 'Chrome Extension',
        action: 'Reports first community event she attends, learns ethical journalism',
        user_experience: 'Contributes meaningfully while learning consent and ethics',
        ecosystem_value: 'Newcomers become community journalists with proper training',
        liberation_impact: 'Storytelling becomes tool for community building',
        next_actions: ['Report events', 'Interview organizers', 'Build skills'],
        time_estimate: '25 minutes'
      },
      {
        id: 'growing_leadership',
        title: 'Democratic Participation',
        component: 'Governance System',
        action: 'Starts participating in community decisions, proposing newcomer support',
        user_experience: 'Voice is valued, sees impact of participation',
        ecosystem_value: 'New perspectives strengthen community decision-making',
        liberation_impact: 'Democratic practice builds liberation leadership',
        next_actions: ['Continue governance', 'Mentor others', 'Propose initiatives'],
        time_estimate: '18 minutes'
      }
    ],
    jordan_artist: [
      {
        id: 'creative_liberation_discovery',
        title: 'Art Meets Liberation',
        component: 'Homepage',
        action: 'Discovers platform that values cultural work as liberation strategy',
        user_experience: 'Sees art and culture prominently featured alongside organizing',
        ecosystem_value: 'Platform recognizes cultural work as essential to liberation',
        liberation_impact: 'Art is positioned as core liberation practice, not add-on',
        next_actions: ['Explore cultural events', 'Check artist features', 'Start onboarding'],
        time_estimate: '4 minutes'
      },
      {
        id: 'artist_focused_onboarding',
        title: 'Creative Pathway Introduction',
        component: 'Onboarding Flow',
        action: 'Onboarding highlights cultural celebration and artist support features',
        user_experience: 'Sees how platform supports and amplifies creative liberation work',
        ecosystem_value: 'Artists understand their role in broader liberation ecosystem',
        liberation_impact: 'Culture recognized as central to community self-determination',
        next_actions: ['Focus on cultural sections', 'Connect with artists', 'Plan events'],
        time_estimate: '18 minutes'
      },
      {
        id: 'creative_strategy_consultation',
        title: 'Liberation Art Strategy',
        component: 'IVOR Chat',
        action: 'Discusses using art for housing rights campaign, community engagement strategies',
        user_experience: 'Gets specific advice on art activism and community cultural organizing',
        ecosystem_value: 'AI understands intersection of creativity and organizing',
        liberation_impact: 'Cultural strategy valued as essential organizing tool',
        next_actions: ['Plan art actions', 'Coordinate with organizers', 'Build cultural campaign'],
        time_estimate: '14 minutes'
      },
      {
        id: 'cultural_event_ecosystem',
        title: 'UK Cultural Liberation Network',
        component: 'Events Calendar',
        action: 'Explores cultural events, art actions, performances across UK cities',
        user_experience: 'Discovers thriving cultural liberation movement nationwide',
        ecosystem_value: 'Sees opportunities for collaboration and cross-pollination',
        liberation_impact: 'Understands scale and diversity of cultural organizing',
        next_actions: ['Connect with artists', 'Plan collaborations', 'Share events'],
        time_estimate: '12 minutes'
      },
      {
        id: 'cultural_journalism',
        title: 'Art and Story Integration',
        component: 'Newsroom',
        action: 'Reads stories about cultural victories, sees art prominently featured',
        user_experience: 'Artistic work is treated seriously as organizing and liberation',
        ecosystem_value: 'Cultural work gets same recognition as traditional organizing',
        liberation_impact: 'Art is documented and celebrated as liberation victory',
        next_actions: ['Document art actions', 'Share creative strategies', 'Inspire others'],
        time_estimate: '16 minutes'
      },
      {
        id: 'artist_partnership',
        title: 'Cultural Organization Collaboration',
        component: 'Partnership System',
        action: 'Connects with cultural collectives, proposes collaborative art festival',
        user_experience: 'Finds other artists and cultural workers for big collaborative project',
        ecosystem_value: 'Platform enables large-scale cultural organizing coordination',
        liberation_impact: 'Collective cultural work amplifies liberation message',
        next_actions: ['Plan festival', 'Coordinate resources', 'Build cultural movement'],
        time_estimate: '22 minutes'
      },
      {
        id: 'cultural_governance',
        title: 'Artist Voice in Democracy',
        component: 'Governance System',
        action: 'Advocates for cultural resource allocation, proposes artist support policies',
        user_experience: 'Has meaningful voice in how platform supports cultural work',
        ecosystem_value: 'Artists shape platform to better serve cultural liberation',
        liberation_impact: 'Democratic governance includes cultural worker perspectives',
        next_actions: ['Advocate for artists', 'Shape cultural policy', 'Build representation'],
        time_estimate: '20 minutes'
      }
    ],
    sage_health_advocate: [
      {
        id: 'health_justice_discovery',
        title: 'Liberation Health Platform',
        component: 'Homepage',
        action: 'Finds platform that centers health justice as liberation work',
        user_experience: 'Sees health advocacy positioned alongside organizing and culture',
        ecosystem_value: 'Platform recognizes health advocacy as core liberation strategy',
        liberation_impact: 'Health justice connected to broader liberation framework',
        next_actions: ['Explore health resources', 'Check policy advocacy', 'Start journey'],
        time_estimate: '3 minutes'
      },
      {
        id: 'health_focused_introduction',
        title: 'Health Advocacy Pathway',
        component: 'Onboarding Flow',
        action: 'Onboarding emphasizes health resources, policy advocacy, community care',
        user_experience: 'Sees comprehensive approach to health justice and community care',
        ecosystem_value: 'Health advocacy integrated throughout platform experience',
        liberation_impact: 'Community care positioned as liberation practice',
        next_actions: ['Focus on health sections', 'Connect with advocates', 'Share resources'],
        time_estimate: '17 minutes'
      },
      {
        id: 'health_resource_coordination',
        title: 'AI Health Resource Navigator',
        component: 'IVOR Chat',
        action: 'Discusses coordinating QTIPOC+ health resources across Scotland',
        user_experience: 'Gets specific NHS navigation help and community health coordination advice',
        ecosystem_value: 'AI provides health-specific resource coordination and policy navigation',
        liberation_impact: 'Health advocacy supported by community-trained AI',
        next_actions: ['Map resources', 'Coordinate services', 'Plan advocacy'],
        time_estimate: '16 minutes'
      },
      {
        id: 'health_events_network',
        title: 'UK Health Justice Network',
        component: 'Events Calendar',
        action: 'Explores health-focused events, policy actions, community care across UK',
        user_experience: 'Discovers robust network of health justice organizing nationwide',
        ecosystem_value: 'Health advocacy gets same platform prominence as other organizing',
        liberation_impact: 'Sees scale of community health organizing and policy work',
        next_actions: ['Connect with advocates', 'Share resources', 'Plan actions'],
        time_estimate: '13 minutes'
      },
      {
        id: 'health_victory_stories',
        title: 'Community Health Victories',
        component: 'Newsroom',
        action: 'Reads stories about health policy victories, community care successes',
        user_experience: 'Learns from successful health advocacy strategies across UK',
        ecosystem_value: 'Health victories documented and shared for movement learning',
        liberation_impact: 'Health justice victories inspire and inform broader movement',
        next_actions: ['Learn strategies', 'Connect with advocates', 'Plan campaigns'],
        time_estimate: '14 minutes'
      },
      {
        id: 'health_organization_collaboration',
        title: 'NHS and Community Partnership',
        component: 'Partnership System',
        action: 'Coordinates with NHS-connected orgs and community health groups',
        user_experience: 'Finds balance between institutional and community health advocacy',
        ecosystem_value: 'Platform bridges institutional and grassroots health work',
        liberation_impact: 'Health justice work spans system change and community care',
        next_actions: ['Build partnerships', 'Coordinate resources', 'Advance policy'],
        time_estimate: '25 minutes'
      },
      {
        id: 'health_policy_governance',
        title: 'Health Justice Democracy',
        component: 'Governance System',
        action: 'Advocates for platform health resource allocation and policy positions',
        user_experience: 'Shapes platform to better support health justice organizing',
        ecosystem_value: 'Health advocates influence platform development and priorities',
        liberation_impact: 'Democratic governance includes health justice perspectives',
        next_actions: ['Shape health policy', 'Advocate resources', 'Build influence'],
        time_estimate: '19 minutes'
      }
    ]
  }

  const ecosystemPotential: EcosystemPotential = {
    community_organizing: [
      'Multi-city campaign coordination across UK',
      'Resource sharing between experienced and new organizers',
      'Strategic planning support through AI consultation',
      'Democratic decision-making for movement priorities',
      'Cross-movement solidarity and mutual support'
    ],
    democratic_governance: [
      'Community-owned platform with transparent decision-making',
      'Inclusive governance that centers marginalized voices',
      'Democratic curation of stories and events',
      'Participatory resource allocation and priority setting',
      'Accountability systems for platform and community leaders'
    ],
    mutual_aid_coordination: [
      'UK-wide mutual aid network coordination',
      'Resource sharing and emergency response systems',
      'Community care infrastructure and support networks',
      'Skill sharing and capacity building programs',
      'Collective resource mobilization for community needs'
    ],
    cultural_celebration: [
      'Platform for Black queer joy and creative expression',
      'Cultural events coordination across UK cities',
      'Artist collaboration and creative liberation projects',
      'Community storytelling and narrative sovereignty',
      'Cultural preservation and innovation through community control'
    ],
    health_advocacy: [
      'Community health resource coordination and advocacy',
      'NHS navigation support and policy advocacy',
      'QTIPOC+ health community education and outreach',
      'Mental health support and community care networks',
      'Health justice campaigns and policy change efforts'
    ],
    liberation_strategy: [
      'Integrated approach connecting organizing, culture, and care',
      'Community self-determination through platform ownership',
      'Trans liberation centered in all platform decisions',
      'Black power building through collective action and resources',
      'Long-term movement sustainability and growth strategies'
    ]
  }

  const currentPersona = userPersonas.find(p => p.id === selectedPersona)!
  const currentFlow = betaUserFlows[selectedPersona]
  const currentFlowStep = currentFlow[currentStep]

  useEffect(() => {
    const progress = ((currentStep + 1) / currentFlow.length) * 100
    setFlowProgress(progress)
  }, [currentStep, currentFlow.length])

  const nextStep = () => {
    if (currentStep < currentFlow.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetFlow = () => {
    setCurrentStep(0)
    setFlowProgress(0)
  }

  return (
    <div className="beta-user-flow max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Beta User Flow: Ecosystem Potential</h1>
        <p className="text-lg text-gray-600 mb-6">
          Interactive visualization of how different community members experience the full liberation platform
        </p>
        
        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowPotentialView(false)}
            className={`px-6 py-2 font-medium rounded-full transition-colors ${
              !showPotentialView 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            User Journey Flow
          </button>
          <button
            onClick={() => setShowPotentialView(true)}
            className={`px-6 py-2 font-medium rounded-full transition-colors ${
              showPotentialView 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ecosystem Potential
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showPotentialView ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Persona Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose User Persona:</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userPersonas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersona(persona.id)
                      setCurrentStep(0)
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      selectedPersona === persona.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{persona.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{persona.pronouns} • {persona.location}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{persona.background}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Persona Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentPersona.name} ({currentPersona.pronouns})</h2>
                  <p className="text-gray-600">{currentPersona.location}</p>
                </div>
                <button
                  onClick={resetFlow}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset Flow
                </button>
              </div>
              
              <p className="text-gray-700 mb-4">{currentPersona.background}</p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Current Needs:</h4>
                  <ul className="space-y-1">
                    {currentPersona.needs.map((need, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">●</span>
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Liberation Priorities:</h4>
                  <ul className="space-y-1">
                    {currentPersona.liberation_priorities.map((priority, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">✊</span>
                        {priority}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Flow Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">User Journey Progress</h3>
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {currentFlow.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${flowProgress}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <motion.div
              key={`${selectedPersona}_${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6 mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{currentFlowStep.title}</h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                  {currentFlowStep.time_estimate}
                </span>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Platform Component:</h4>
                    <p className="text-indigo-600 font-medium">{currentFlowStep.component}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">User Action:</h4>
                    <p className="text-gray-700">{currentFlowStep.action}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">User Experience:</h4>
                    <p className="text-gray-700">{currentFlowStep.user_experience}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ecosystem Value:</h4>
                    <p className="text-green-700">{currentFlowStep.ecosystem_value}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Liberation Impact:</h4>
                    <p className="text-purple-700">{currentFlowStep.liberation_impact}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Next Actions:</h4>
                    <ul className="space-y-1">
                      {currentFlowStep.next_actions.map((action, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">→</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous Step
              </button>

              <div className="flex gap-2">
                {currentFlow.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-indigo-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === currentFlow.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step →
              </button>
            </div>

            {currentStep === currentFlow.length - 1 && (
              <div className="mt-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">Journey Complete!</h3>
                <p className="text-green-700 mb-4">
                  {currentPersona.name} has experienced the full liberation platform potential
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetFlow}
                    className="px-6 py-2 bg-white text-green-700 font-semibold rounded-lg border border-green-300 hover:bg-green-50"
                  >
                    Restart Journey
                  </button>
                  <button
                    onClick={() => setShowPotentialView(true)}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                  >
                    See Ecosystem Potential
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Ecosystem Potential View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Ecosystem Liberation Potential</h2>
              <p className="text-lg text-gray-600">
                When all components work together, the platform enables comprehensive community liberation
              </p>
            </div>

            {Object.entries(ecosystemPotential).map(([category, potentials]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {category === 'community_organizing' && <span className="text-2xl">✊🏿</span>}
                  {category === 'democratic_governance' && <span className="text-2xl">🏛️</span>}
                  {category === 'mutual_aid_coordination' && <span className="text-2xl">🤝</span>}
                  {category === 'cultural_celebration' && <span className="text-2xl">🎨</span>}
                  {category === 'health_advocacy' && <span className="text-2xl">🏥</span>}
                  {category === 'liberation_strategy' && <span className="text-2xl">🌟</span>}
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <ul className="space-y-3">
                  {potentials.map((potential, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-indigo-500 mt-1">●</span>
                      <span className="text-gray-700">{potential}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Integration Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Liberation Platform Integration</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Platform Components Working Together:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Community onboarding → IVOR AI consultation → Event discovery → Story sharing</li>
                    <li>• Democratic governance → Community curation → Verified partnerships → Real organizing</li>
                    <li>• Mutual aid coordination → Health advocacy → Cultural celebration → Liberation strategy</li>
                    <li>• Chrome extension reporting → Newsroom publishing → Community voting → Platform evolution</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Liberation Impact Multipliers:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Individual support → Community organizing → Movement coordination → Liberation</li>
                    <li>• Local events → UK-wide network → Cross-city campaigns → Policy victories</li>
                    <li>• Personal stories → Community journalism → Movement narrative → Cultural shift</li>
                    <li>• Platform participation → Democratic practice → Community ownership → Self-determination</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Experience the Liberation Platform?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/onboarding"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/demo"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-full hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  See Demo Scenarios
                </Link>
                <Link
                  to="/launch"
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-full hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  View Launch Materials
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BetaUserFlow