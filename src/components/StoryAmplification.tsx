/**
 * Story Amplification System
 * Social sharing and amplification through IVOR integration
 * Connects newsroom stories to community engagement
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Story {
  id: string
  title: string
  summary: string
  author: string
  publication_date: Date
  category: 'organizing_victory' | 'community_care' | 'cultural_celebration' | 'mutual_aid' | 'political_action'
  location: string
  tags: string[]
  social_metrics: {
    shares: number
    amplifications: number
    community_reach: number
    ivor_engagements: number
  }
  amplification_suggestions: string[]
  democratic_score: number
  verified_by_community: boolean
}

interface AmplificationChannel {
  id: string
  name: string
  platform: 'twitter' | 'instagram' | 'tiktok' | 'whatsapp' | 'telegram' | 'ivor'
  icon: string
  status: 'active' | 'pending' | 'draft'
  reach_estimate: number
  engagement_rate: number
  community_approval: number
}

interface IVORAmplification {
  id: string
  story_id: string
  generated_content: string
  tone: 'celebratory' | 'educational' | 'mobilizing' | 'supportive'
  target_audience: string[]
  personalization_notes: string[]
  community_feedback_score: number
  approved_by_governance: boolean
}

const StoryAmplification: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [amplificationChannels, setAmplificationChannels] = useState<AmplificationChannel[]>([])
  const [ivorAmplifications, setIvorAmplifications] = useState<IVORAmplification[]>([])
  const [activeTab, setActiveTab] = useState<'stories' | 'channels' | 'ivor' | 'analytics'>('stories')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: '1',
        title: 'Trans Housing Victory: 50 Units Secured in Hackney',
        summary: 'After 8 months of organizing, Trans Housing Network successfully pressured Hackney Council to designate 50 social housing units specifically for trans people.',
        author: 'Maya Patel, Trans Housing Network',
        publication_date: new Date('2024-08-25'),
        category: 'organizing_victory',
        location: 'London, Hackney',
        tags: ['trans_rights', 'housing_justice', 'organizing_victory'],
        social_metrics: {
          shares: 247,
          amplifications: 89,
          community_reach: 1420,
          ivor_engagements: 156
        },
        amplification_suggestions: [
          'Share organizing tactics that worked',
          'Connect to other housing campaigns',
          'Celebrate trans liberation wins',
          'Offer replication support to other cities'
        ],
        democratic_score: 94,
        verified_by_community: true
      },
      {
        id: '2',
        title: 'Manchester Stop & Search: Know Your Rights Training Success',
        summary: 'Black Lives Matter Manchester trained 150+ community members in police accountability and legal rights following recent stop & search incidents.',
        author: 'Kwame Johnson, BLM Manchester',
        publication_date: new Date('2024-08-28'),
        category: 'community_care',
        location: 'Manchester, Moss Side',
        tags: ['police_accountability', 'community_defense', 'know_your_rights'],
        social_metrics: {
          shares: 189,
          amplifications: 67,
          community_reach: 980,
          ivor_engagements: 123
        },
        amplification_suggestions: [
          'Share know your rights resources',
          'Connect to legal support networks',
          'Offer training to other communities',
          'Document police accountability wins'
        ],
        democratic_score: 91,
        verified_by_community: true
      },
      {
        id: '3',
        title: 'Bristol Queer Joy: Healing Circle Reaches 200 Members',
        summary: 'Bristol Black Queer Collective\'s weekly healing circles have grown from 12 to 200+ regular participants, creating vital community mental health support.',
        author: 'Zuri Okafor, Bristol Black Queer Collective',
        publication_date: new Date('2024-08-26'),
        category: 'cultural_celebration',
        location: 'Bristol, St Paul\'s',
        tags: ['mental_health', 'healing_justice', 'queer_joy'],
        social_metrics: {
          shares: 156,
          amplifications: 78,
          community_reach: 756,
          ivor_engagements: 98
        },
        amplification_suggestions: [
          'Share healing practices and techniques',
          'Connect to other wellness initiatives',
          'Celebrate Black queer joy and resilience',
          'Offer healing circle guidance to new communities'
        ],
        democratic_score: 88,
        verified_by_community: true
      }
    ]

    const mockChannels: AmplificationChannel[] = [
      {
        id: '1',
        name: 'IVOR AI Assistant',
        platform: 'ivor',
        icon: '🤖',
        status: 'active',
        reach_estimate: 2500,
        engagement_rate: 87,
        community_approval: 94
      },
      {
        id: '2',
        name: 'Community Twitter',
        platform: 'twitter',
        icon: '🐦',
        status: 'active',
        reach_estimate: 1800,
        engagement_rate: 72,
        community_approval: 89
      },
      {
        id: '3',
        name: 'WhatsApp Networks',
        platform: 'whatsapp',
        icon: '💬',
        status: 'active',
        reach_estimate: 950,
        engagement_rate: 91,
        community_approval: 96
      },
      {
        id: '4',
        name: 'Instagram Stories',
        platform: 'instagram',
        icon: '📱',
        status: 'pending',
        reach_estimate: 1200,
        engagement_rate: 68,
        community_approval: 82
      }
    ]

    const mockIvorAmplifications: IVORAmplification[] = [
      {
        id: '1',
        story_id: '1',
        generated_content: 'Incredible organizing victory! Trans Housing Network\'s 8-month campaign just secured 50 social housing units specifically for trans people in Hackney. This shows what\'s possible when we organize with purpose and persistence. 🏳️‍⚧️✊🏿\n\nKey tactics that worked:\n• Direct action at council meetings\n• Community testimony from affected people\n• Coalition building with housing advocates\n• Media pressure through storytelling\n\nHow can we replicate this win in your city? IVOR can help connect you with organizing resources and successful campaign strategies. Let\'s build trans liberation everywhere! 💜',
        tone: 'celebratory',
        target_audience: ['trans_community', 'housing_organizers', 'UK_activists'],
        personalization_notes: [
          'Emphasizes tactical replication',
          'Celebrates trans liberation specifically',
          'Offers concrete IVOR support',
          'Connects to broader movement building'
        ],
        community_feedback_score: 92,
        approved_by_governance: true
      },
      {
        id: '2',
        story_id: '2',
        generated_content: 'Knowledge is power! Black Lives Matter Manchester just trained 150+ community members in police accountability and legal rights. In the face of continued stop & search harassment, our communities are getting organized. 📚✊🏿\n\nWhat you need to know:\n• You have the right to remain silent\n• You can ask if you\'re being detained\n• Film interactions when safe to do so\n• Get legal support numbers in your phone\n\nIVOR has comprehensive know your rights resources for UK communities. We can help connect your area with training, legal support, and community defense networks. Nobody should face police harassment alone. 🤝',
        tone: 'educational',
        target_audience: ['black_community', 'police_accountability_advocates', 'legal_observers'],
        personalization_notes: [
          'Provides actionable rights information',
          'Emphasizes community solidarity',
          'Offers IVOR resource connections',
          'Balances education with empowerment'
        ],
        community_feedback_score: 89,
        approved_by_governance: true
      }
    ]

    setAmplificationChannels(mockChannels)
    setIvorAmplifications(mockIvorAmplifications)
    setSelectedStory(mockStories[0])
  }, [])

  const generateIVORAmplification = async (story: Story) => {
    setIsGenerating(true)
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newAmplification: IVORAmplification = {
      id: Date.now().toString(),
      story_id: story.id,
      generated_content: `🌟 Liberation Story Alert! ${story.title}\n\n${story.summary}\n\nThis is exactly the kind of organizing victory that shows what's possible when Black queer communities come together with purpose and strategy.\n\nKey lessons:\n• Community-led organizing works\n• Persistence pays off\n• Every victory builds power for the next fight\n\nIVOR is here to help amplify these stories and connect organizers across the UK. Together, we're building the world we need! ✊🏿💜`,
      tone: 'celebratory',
      target_audience: ['community_organizers', 'liberation_movement', 'UK_activists'],
      personalization_notes: [
        'Celebrates specific community victory',
        'Extracts tactical lessons',
        'Connects to broader movement',
        'Offers IVOR support for replication'
      ],
      community_feedback_score: 0,
      approved_by_governance: false
    }
    
    setIvorAmplifications(prev => [newAmplification, ...prev])
    setIsGenerating(false)
  }

  const getCategoryIcon = (category: Story['category']) => {
    const icons = {
      organizing_victory: '✊🏿',
      community_care: '💚',
      cultural_celebration: '🎉',
      mutual_aid: '🤝',
      political_action: '🏛️'
    }
    return icons[category]
  }

  const getCategoryColor = (category: Story['category']) => {
    const colors = {
      organizing_victory: 'bg-red-100 text-red-800',
      community_care: 'bg-green-100 text-green-800',
      cultural_celebration: 'bg-purple-100 text-purple-800',
      mutual_aid: 'bg-blue-100 text-blue-800',
      political_action: 'bg-orange-100 text-orange-800'
    }
    return colors[category]
  }

  const getPlatformIcon = (platform: AmplificationChannel['platform']) => {
    const icons = {
      twitter: '🐦',
      instagram: '📱',
      tiktok: '🎵',
      whatsapp: '💬',
      telegram: '📨',
      ivor: '🤖'
    }
    return icons[platform]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          📡 Story Amplification System
        </h1>
        <p className="text-purple-100 text-lg mt-2">
          Democratic social sharing and community engagement through IVOR
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'stories', label: 'Stories', icon: '📰' },
          { key: 'channels', label: 'Channels', icon: '📡' },
          { key: 'ivor', label: 'IVOR Amplification', icon: '🤖' },
          { key: 'analytics', label: 'Analytics', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all
              ${activeTab === tab.key
                ? 'bg-white text-purple-600 shadow-sm'
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
          {activeTab === 'stories' && selectedStory && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Selected Story */}
              <div className="bg-white border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getCategoryIcon(selectedStory.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedStory.title}</h2>
                        {selectedStory.verified_by_community && (
                          <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded-full">
                            ✓ Community Verified
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-lg mb-4">{selectedStory.summary}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>✍️ {selectedStory.author}</span>
                        <span>📍 {selectedStory.location}</span>
                        <span>📅 {selectedStory.publication_date.toLocaleDateString()}</span>
                        <span className="text-purple-600 font-medium">
                          🏛️ Democratic Score: {selectedStory.democratic_score}%
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedStory.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedStory.category)}`}>
                    {selectedStory.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Social Metrics */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedStory.social_metrics.shares}</div>
                    <div className="text-xs text-gray-500">Shares</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedStory.social_metrics.amplifications}</div>
                    <div className="text-xs text-gray-500">Amplifications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedStory.social_metrics.community_reach}</div>
                    <div className="text-xs text-gray-500">Community Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{selectedStory.social_metrics.ivor_engagements}</div>
                    <div className="text-xs text-gray-500">IVOR Engagements</div>
                  </div>
                </div>

                {/* Amplification Suggestions */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">Community Amplification Suggestions</h3>
                  <div className="space-y-2">
                    {selectedStory.amplification_suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                        <span className="text-indigo-600">💡</span>
                        <span className="text-gray-800">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => generateIVORAmplification(selectedStory)}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating IVOR Amplification...
                      </span>
                    ) : (
                      '🤖 Generate IVOR Amplification'
                    )}
                  </button>
                  
                  <button className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all">
                    📋 Create Custom Amplification
                  </button>
                  
                  <button className="px-6 py-3 bg-white border-2 border-green-600 text-green-600 font-bold rounded-lg hover:bg-green-50 transition-all">
                    🗳️ Submit for Community Vote
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amplification Channels</h2>
              
              {amplificationChannels.map((channel) => (
                <div key={channel.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{channel.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{channel.name}</h3>
                        <p className="text-gray-600 capitalize">{channel.platform} platform</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-bold text-lg text-indigo-600">{channel.reach_estimate.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Estimated Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-green-600">{channel.engagement_rate}%</div>
                        <div className="text-xs text-gray-500">Engagement Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-purple-600">{channel.community_approval}%</div>
                        <div className="text-xs text-gray-500">Community Approval</div>
                      </div>
                      
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${channel.status === 'active' ? 'bg-green-100 text-green-800' :
                          channel.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {channel.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'ivor' && (
            <motion.div
              key="ivor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">IVOR Generated Amplifications</h2>
                <span className="text-sm text-gray-600">AI-powered community-approved content</span>
              </div>
              
              {ivorAmplifications.map((amplification, index) => (
                <motion.div
                  key={amplification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🤖</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">IVOR Amplification</h3>
                        <p className="text-gray-600">Generated for story #{amplification.story_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${amplification.approved_by_governance ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {amplification.approved_by_governance ? '✓ Approved' : '⏳ Pending Review'}
                      </span>
                      <span className="text-sm text-gray-600">
                        Community Score: {amplification.community_feedback_score}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Generated Content */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
                      {amplification.generated_content}
                    </pre>
                  </div>
                  
                  {/* Amplification Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                      <div className="flex flex-wrap gap-2">
                        {amplification.target_audience.map((audience) => (
                          <span key={audience} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {audience.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tone & Approach</h4>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full capitalize">
                        {amplification.tone}
                      </span>
                    </div>
                  </div>
                  
                  {/* Personalization Notes */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Personalization Strategy</h4>
                    <ul className="space-y-1">
                      {amplification.personalization_notes.map((note, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-green-600">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all">
                      ✓ Approve & Publish
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
                      ✏️ Edit Content
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all">
                      🗳️ Community Vote
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all">
                      📋 Request Revision
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amplification Analytics</h2>
              
              {/* Overview Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">567</div>
                  <div className="text-sm text-gray-600">Total Amplifications</div>
                  <div className="text-xs text-green-600 mt-1">↗️ +23% this week</div>
                </div>
                
                <div className="bg-white border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">12.5K</div>
                  <div className="text-sm text-gray-600">Community Reach</div>
                  <div className="text-xs text-green-600 mt-1">↗️ +18% this week</div>
                </div>
                
                <div className="bg-white border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                  <div className="text-sm text-gray-600">Community Approval</div>
                  <div className="text-xs text-green-600 mt-1">↗️ +2% this week</div>
                </div>
                
                <div className="bg-white border rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">234</div>
                  <div className="text-sm text-gray-600">IVOR Engagements</div>
                  <div className="text-xs text-green-600 mt-1">↗️ +31% this week</div>
                </div>
              </div>
              
              {/* Top Performing Stories */}
              <div className="bg-white border rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Top Performing Stories This Week</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Trans Housing Victory: 50 Units Secured', amplifications: 89, reach: 1420 },
                    { title: 'Manchester Stop & Search Training Success', amplifications: 67, reach: 980 },
                    { title: 'Bristol Healing Circle Reaches 200 Members', amplifications: 78, reach: 756 }
                  ].map((story, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{story.title}</div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-purple-600">{story.amplifications} amplifications</span>
                        <span className="text-blue-600">{story.reach.toLocaleString()} reach</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StoryAmplification