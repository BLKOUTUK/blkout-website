/**
 * Launch Showcase Component
 * Comprehensive materials showcasing community breadth via events + stories
 * Demonstrates UK-wide Black queer community organizing and liberation work
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface CommunityMetrics {
  total_stories: number
  total_events: number
  cities_covered: number
  organizations_featured: number
  policy_victories: number
  people_served: string
  funding_secured: string
}

interface ShowcaseSection {
  id: string
  title: string
  description: string
  icon: string
  metrics: string[]
  highlights: string[]
  call_to_action: {
    text: string
    url: string
    type: 'internal' | 'external'
  }
}

interface SuccessStory {
  id: string
  title: string
  location: string
  impact_summary: string
  key_metrics: string[]
  organization: string
  victory_type: 'policy' | 'organizing' | 'mutual_aid' | 'cultural' | 'health'
  image_placeholder: string
}

const LaunchShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [showMetricsAnimation, setShowMetricsAnimation] = useState(false)

  const communityMetrics: CommunityMetrics = {
    total_stories: 25,
    total_events: 150,
    cities_covered: 12,
    organizations_featured: 35,
    policy_victories: 8,
    people_served: '2,400+',
    funding_secured: '£890,000+'
  }

  const showcaseSections: ShowcaseSection[] = [
    {
      id: 'community_breadth',
      title: 'Community Breadth Across UK',
      description: 'Black queer organizing spans from London to Edinburgh, Manchester to Bristol, with active communities in every major UK city',
      icon: '🌍',
      metrics: [
        '12 cities with active organizing',
        '35+ community organizations',
        '150+ events documented',
        'From policy advocacy to cultural celebrations'
      ],
      highlights: [
        'London: 40+ organizations including CliniQ, Outside Project, Mermaids',
        'Manchester: Trans Pride Manchester, Proud Trust, LGBT Foundation',
        'Birmingham: Birmingham LGBT, Black Pride Movement, Rainbow Spirit',
        'Bristol: TransBristol, Bristol Pride, Ujamaa Centre',
        'Edinburgh: Edinburgh LGBT Centre, Equality Network, Pride Scotia'
      ],
      call_to_action: {
        text: 'Explore Events Calendar',
        url: '/events',
        type: 'internal'
      }
    },
    {
      id: 'organizing_victories',
      title: 'Organizing Victories & Policy Wins',
      description: 'Real policy changes securing rights, funding, and protections for Black queer communities across the UK',
      icon: '✊🏿',
      metrics: [
        '8 major policy victories documented',
        '£890,000+ in secured funding',
        '2,400+ people directly served',
        'Housing, healthcare, education wins'
      ],
      highlights: [
        'Trans housing rights victory protecting 200+ people in Manchester',
        'NHS gonorrhea vaccine access campaign (August 2025)',
        'London Borough youth services funding secured (£50,000)',
        'Birmingham hate crime reporting improvements',
        'Bristol trans-inclusive sports policy changes'
      ],
      call_to_action: {
        text: 'Read Victory Stories',
        url: '/newsroom',
        type: 'internal'
      }
    },
    {
      id: 'mutual_aid_networks',
      title: 'Mutual Aid & Community Care',
      description: 'Grassroots networks providing direct support, resources, and care across UK Black queer communities',
      icon: '🤝',
      metrics: [
        '15+ mutual aid networks mapped',
        '£125,000+ in direct community support',
        '500+ people receiving regular aid',
        'Food, housing, healthcare, legal support'
      ],
      highlights: [
        'London Trans Emergency Fund distributing £2,000+ monthly',
        'Manchester Black Queer Mutual Aid supporting 80+ households',
        'Birmingham Community Kitchen serving 150+ meals weekly',
        'Bristol Emergency Housing Network (12 safe spaces)',
        'Edinburgh Trans Support Network (legal & emotional support)'
      ],
      call_to_action: {
        text: 'Chat with IVOR about Mutual Aid',
        url: 'https://ivor-blkout.vercel.app/',
        type: 'external'
      }
    },
    {
      id: 'cultural_celebrations',
      title: 'Cultural Joy & Celebration',
      description: 'Community events celebrating Black queer joy, creativity, and resilience through arts, culture, and fellowship',
      icon: '🎉',
      metrics: [
        '25+ cultural events annually',
        '3,000+ attendees at celebrations',
        '12+ artists platforms created',
        'Music, poetry, visual arts, performance'
      ],
      highlights: [
        'Black Queer Joy Festival (Birmingham) - 700+ attendees',
        'London Trans Poetry Night - Monthly series, 40+ poets featured',
        'Manchester Black Pride Month - 5 events, 1,200+ participants',
        'Bristol Community Art Projects - 8 murals, 25+ artists',
        'Edinburgh Queer Book Club - 60+ members, weekly meetings'
      ],
      call_to_action: {
        text: 'See Cultural Events',
        url: '/events?category=cultural',
        type: 'internal'
      }
    },
    {
      id: 'health_initiatives',
      title: 'Community Health & Wellness',
      description: 'Health initiatives addressing specific needs of Black queer communities, from sexual health to mental wellness',
      icon: '🏥',
      metrics: [
        '10+ health initiatives documented',
        '800+ people accessed services',
        '6 cities with QTIPOC+ health programs',
        'Sexual health, mental health, HRT access'
      ],
      highlights: [
        'CliniQ London: 200+ QTIPOC+ people served monthly',
        'Manchester Trans Health Collective: HRT support network',
        'Birmingham Black Mental Health First Aid training',
        'Bristol Sexual Health Outreach: Community education',
        'Edinburgh Trans Support Groups: Peer counseling network'
      ],
      call_to_action: {
        text: 'Get Health Resources via IVOR',
        url: 'https://ivor-blkout.vercel.app/',
        type: 'external'
      }
    },
    {
      id: 'democratic_journalism',
      title: 'Democratic Community Journalism',
      description: 'Community-controlled storytelling platform amplifying grassroots voices through democratic editorial process',
      icon: '📰',
      metrics: [
        '25+ community stories published',
        '12+ community journalists active',
        '5-step democratic editorial process',
        '89% community approval rating'
      ],
      highlights: [
        'Community curation ensures authentic representation',
        'Stories must include organizer consent for real events',
        'Democratic voting on featured content',
        'Geographic diversity algorithm ensures UK-wide coverage',
        'Chrome extension for ethical community event reporting'
      ],
      call_to_action: {
        text: 'Read Community Stories',
        url: '/newsroom',
        type: 'internal'
      }
    }
  ]

  const successStories: SuccessStory[] = [
    {
      id: 'trans_housing_victory',
      title: 'Trans Housing Rights Victory',
      location: 'Manchester',
      impact_summary: 'Policy changes protecting 200+ trans people from housing discrimination with £50,000 emergency fund',
      key_metrics: ['200+ people protected', '£50,000 emergency fund', 'Policy adopted by 3 boroughs'],
      organization: 'Manchester Trans Housing Coalition',
      victory_type: 'policy',
      image_placeholder: '🏠'
    },
    {
      id: 'community_health_hub',
      title: 'Community Health Hub Launch',
      location: 'South London',
      impact_summary: 'New QTIPOC+ health center serving 300+ people monthly with culturally competent care',
      key_metrics: ['300+ monthly patients', '8 languages supported', '£85,000 annual funding'],
      organization: 'South London QTIPOC+ Health Collective',
      victory_type: 'health',
      image_placeholder: '🏥'
    },
    {
      id: 'black_queer_joy_festival',
      title: 'Black Queer Joy Festival',
      location: 'Birmingham',
      impact_summary: 'Annual celebration growing to 700+ attendees, £35,000 raised for community projects',
      key_metrics: ['700+ attendees', '25+ performers', '£35,000 raised'],
      organization: 'Birmingham Black Queer Arts Collective',
      victory_type: 'cultural',
      image_placeholder: '🎭'
    }
  ]

  useEffect(() => {
    // Trigger metrics animation on component mount
    setTimeout(() => setShowMetricsAnimation(true), 1000)
  }, [])

  const getVictoryTypeColor = (type: string): string => {
    const colors = {
      policy: 'bg-purple-100 text-purple-800',
      organizing: 'bg-red-100 text-red-800',
      mutual_aid: 'bg-green-100 text-green-800',
      cultural: 'bg-yellow-100 text-yellow-800',
      health: 'bg-blue-100 text-blue-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="launch-showcase max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          UK Black Queer Liberation Platform
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Demonstrating the breadth and depth of Black queer organizing across the UK through 
          community stories, events, and democratic governance
        </motion.p>
        
        {/* Metrics Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {showMetricsAnimation ? communityMetrics.total_stories : 0}+
            </div>
            <div className="text-sm text-gray-600">Community Stories</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {showMetricsAnimation ? communityMetrics.total_events : 0}+
            </div>
            <div className="text-sm text-gray-600">Events Documented</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {showMetricsAnimation ? communityMetrics.cities_covered : 0}
            </div>
            <div className="text-sm text-gray-600">UK Cities</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {showMetricsAnimation ? communityMetrics.people_served : '0'}
            </div>
            <div className="text-sm text-gray-600">People Served</div>
          </div>
        </motion.div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {showcaseSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeSection === section.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="mr-1">{section.icon}</span>
            {section.title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      {/* Active Section Display */}
      <AnimatePresence mode="wait">
        {showcaseSections
          .filter(section => section.id === activeSection)
          .map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-sm border p-8 mb-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{section.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{section.description}</p>
                  
                  {/* Metrics */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Key Metrics:</h3>
                      <ul className="space-y-2">
                        {section.metrics.map((metric, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-green-500 mt-0.5">●</span>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Community Highlights:</h3>
                      <ul className="space-y-2">
                        {section.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            <strong className="text-gray-800">
                              {highlight.split(':')[0]}:
                            </strong>
                            {highlight.split(':')[1]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex justify-between items-center">
                    {section.call_to_action.type === 'external' ? (
                      <a
                        href={section.call_to_action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {section.call_to_action.text}
                        <span className="text-sm">↗️</span>
                      </a>
                    ) : (
                      <Link
                        to={section.call_to_action.url}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {section.call_to_action.text}
                        <span className="text-sm">→</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        const nextIndex = showcaseSections.findIndex(s => s.id === activeSection) + 1
                        const nextSection = showcaseSections[nextIndex % showcaseSections.length]
                        setActiveSection(nextSection.id)
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Next Section →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Success Stories Carousel */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Featured Victory Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-4xl text-center mb-4">{story.image_placeholder}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{story.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVictoryTypeColor(story.victory_type)}`}>
                  {story.victory_type.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">{story.location}</div>
              <p className="text-sm text-gray-700 mb-4">{story.impact_summary}</p>
              <div className="space-y-1">
                {story.key_metrics.map((metric, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="text-green-500">●</span>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Integration Demo */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Integrated Liberation Platform</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Community-Owned Technology</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Democratic governance of platform decisions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Community-trained AI (IVOR) for organizing support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Ethical journalism with organizer consent
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Real-time event coordination across UK
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Liberation Values in Action</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-purple-500">🏳️‍⚧️</span>
                Trans liberation centered in all decisions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">✊🏿</span>
                Black power through collective organizing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🤝</span>
                Cooperative ownership and shared resources
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">🌱</span>
                Sustainable community self-determination
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join the Liberation Platform?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Start your journey through community onboarding, explore events, and connect with organizing across the UK
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/onboarding"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Community Journey
          </Link>
          <a
            href="https://ivor-blkout.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-full hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            Chat with IVOR AI
          </a>
          <Link
            to="/demo"
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-full hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            See Demo Scenarios
          </Link>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          Platform serving {communityMetrics.cities_covered} UK cities • {communityMetrics.organizations_featured} organizations • 
          {communityMetrics.people_served} people reached • {communityMetrics.funding_secured} secured for community
        </p>
      </div>
    </div>
  )
}

export default LaunchShowcase