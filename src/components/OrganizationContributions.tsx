/**
 * Organization Contributions Coordinator
 * System for UK organizations to contribute events and stories to the platform
 * Facilitates authentic community representation and partnership coordination
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Organization {
  id: string
  name: string
  location: string
  type: 'community_org' | 'advocacy_group' | 'mutual_aid' | 'cultural_collective' | 'health_service' | 'support_group'
  contact_email: string
  website?: string
  focus_areas: string[]
  contribution_capacity: 'events_only' | 'stories_only' | 'both' | 'partnership'
  verification_status: 'pending' | 'verified' | 'partner'
  last_contribution?: string
  total_contributions: number
}

interface ContributionRequest {
  id: string
  organization_id: string
  type: 'event_submission' | 'story_pitch' | 'partnership_inquiry' | 'resource_sharing'
  title: string
  description: string
  proposed_date?: string
  location?: string
  estimated_reach: number
  community_consent: boolean
  contact_provided: boolean
  submission_date: string
  status: 'pending_review' | 'approved' | 'published' | 'needs_revision'
}

interface ContributionGuidelines {
  events: string[]
  stories: string[]
  partnerships: string[]
  community_standards: string[]
}

const OrganizationContributions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'requests' | 'guidelines'>('overview')
  const [showContributionForm, setShowContributionForm] = useState(false)
  const [selectedOrganizationType, setSelectedOrganizationType] = useState<string>('all')

  const partnerOrganizations: Organization[] = [
    {
      id: 'cliniq_london',
      name: 'CliniQ',
      location: 'London',
      type: 'health_service',
      contact_email: 'info@cliniq.org.uk',
      website: 'https://cliniq.org.uk',
      focus_areas: ['Sexual health', 'Trans healthcare', 'QTIPOC+ support', 'Community education'],
      contribution_capacity: 'both',
      verification_status: 'partner',
      last_contribution: '2025-08-25',
      total_contributions: 12
    },
    {
      id: 'lgbt_foundation_manchester',
      name: 'LGBT Foundation',
      location: 'Manchester',
      type: 'advocacy_group',
      contact_email: 'info@lgbt.foundation',
      website: 'https://lgbt.foundation',
      focus_areas: ['Advocacy', 'Support services', 'Community development', 'Policy change'],
      contribution_capacity: 'both',
      verification_status: 'partner',
      last_contribution: '2025-08-20',
      total_contributions: 8
    },
    {
      id: 'outside_project',
      name: 'Outside Project',
      location: 'London',
      type: 'support_group',
      contact_email: 'info@lgbtiqoutside.org',
      website: 'https://lgbtiqoutside.org',
      focus_areas: ['Crisis support', 'Housing', 'Mental health', 'Community safety'],
      contribution_capacity: 'both',
      verification_status: 'partner',
      last_contribution: '2025-08-22',
      total_contributions: 15
    },
    {
      id: 'proud_trust_manchester',
      name: 'Proud Trust',
      location: 'Manchester',
      type: 'community_org',
      contact_email: 'info@theproudtrust.org',
      website: 'https://theproudtrust.org',
      focus_areas: ['Youth support', 'Education', 'Community groups', 'Peer support'],
      contribution_capacity: 'events_only',
      verification_status: 'verified',
      last_contribution: '2025-08-15',
      total_contributions: 6
    },
    {
      id: 'birmingham_lgbt',
      name: 'Birmingham LGBT',
      location: 'Birmingham',
      type: 'community_org',
      contact_email: 'info@blgbt.org',
      website: 'https://blgbt.org',
      focus_areas: ['Community center', 'Social events', 'Support groups', 'Advocacy'],
      contribution_capacity: 'both',
      verification_status: 'verified',
      last_contribution: '2025-08-18',
      total_contributions: 10
    },
    {
      id: 'trans_bristol',
      name: 'TransBristol',
      location: 'Bristol',
      type: 'support_group',
      contact_email: 'info@transbristol.org.uk',
      focus_areas: ['Trans support', 'Peer groups', 'Advocacy', 'Community education'],
      contribution_capacity: 'stories_only',
      verification_status: 'verified',
      last_contribution: '2025-08-12',
      total_contributions: 4
    },
    {
      id: 'edinburgh_lgbt_centre',
      name: 'Edinburgh LGBT Centre',
      location: 'Edinburgh',
      type: 'community_org',
      contact_email: 'info@lgbthealth.org.uk',
      website: 'https://lgbthealth.org.uk',
      focus_areas: ['Community center', 'Health services', 'Social groups', 'Training'],
      contribution_capacity: 'both',
      verification_status: 'partner',
      last_contribution: '2025-08-28',
      total_contributions: 9
    },
    {
      id: 'rainbow_spirit_birmingham',
      name: 'Rainbow Spirit',
      location: 'Birmingham',
      type: 'mutual_aid',
      contact_email: 'info@rainbowspirit.org.uk',
      focus_areas: ['Mutual aid', 'Food security', 'Community support', 'Emergency assistance'],
      contribution_capacity: 'both',
      verification_status: 'verified',
      last_contribution: '2025-08-20',
      total_contributions: 7
    }
  ]

  const recentRequests: ContributionRequest[] = [
    {
      id: 'req_001',
      organization_id: 'cliniq_london',
      type: 'event_submission',
      title: 'QTIPOC+ Sexual Health Workshop',
      description: 'Community education workshop focusing on sexual health resources for QTIPOC+ communities',
      proposed_date: '2025-09-15',
      location: 'London',
      estimated_reach: 40,
      community_consent: true,
      contact_provided: true,
      submission_date: '2025-08-28',
      status: 'approved'
    },
    {
      id: 'req_002',
      organization_id: 'lgbt_foundation_manchester',
      type: 'story_pitch',
      title: 'Trans Housing Rights Victory in Manchester',
      description: 'Story documenting successful campaign for trans-inclusive housing policy changes',
      estimated_reach: 200,
      community_consent: true,
      contact_provided: true,
      submission_date: '2025-08-25',
      status: 'published'
    },
    {
      id: 'req_003',
      organization_id: 'birmingham_lgbt',
      type: 'partnership_inquiry',
      title: 'Black Pride Month Collaboration',
      description: 'Partnership proposal for coordinated Black Pride Month events across UK cities',
      estimated_reach: 1000,
      community_consent: true,
      contact_provided: true,
      submission_date: '2025-08-22',
      status: 'pending_review'
    }
  ]

  const contributionGuidelines: ContributionGuidelines = {
    events: [
      'Events must be real, scheduled community activities',
      'Organizer contact information required for verification',
      'Community consent needed for all promotional materials',
      'Focus on grassroots organizing, celebration, or mutual aid',
      'Clear accessibility information and inclusive practices'
    ],
    stories: [
      'Stories must document real organizing victories or community celebrations',
      'Interview consent required from all quoted community members',
      'Organizer approval needed before publication',
      'Stories should highlight community agency and self-determination',
      'Democratic editorial process through community governance'
    ],
    partnerships: [
      'Partnership opportunities for resource sharing and coordination',
      'Collaborative event planning and cross-promotion',
      'Shared advocacy campaigns and policy work',
      'Mutual aid network coordination and support',
      'Training and capacity building exchanges'
    ],
    community_standards: [
      'All contributions must center Black queer voices and leadership',
      'Trans liberation and safety prioritized in all activities',
      'Community consent and self-determination respected',
      'Democratic decision-making and community governance upheld',
      'Mutual aid principles and cooperative ownership values'
    ]
  }

  const getOrganizationTypeColor = (type: string): string => {
    const colors = {
      community_org: 'bg-blue-100 text-blue-800',
      advocacy_group: 'bg-purple-100 text-purple-800',
      mutual_aid: 'bg-green-100 text-green-800',
      cultural_collective: 'bg-yellow-100 text-yellow-800',
      health_service: 'bg-red-100 text-red-800',
      support_group: 'bg-indigo-100 text-indigo-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      partner: 'bg-purple-100 text-purple-800',
      pending_review: 'bg-orange-100 text-orange-800',
      approved: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      needs_revision: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrganizations = selectedOrganizationType === 'all' 
    ? partnerOrganizations 
    : partnerOrganizations.filter(org => org.type === selectedOrganizationType)

  return (
    <div className="organization-contributions max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">UK Organization Contributions</h1>
        <p className="text-lg text-gray-600 mb-6">
          Coordinating authentic community representation through verified UK Black queer organizations
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{partnerOrganizations.length}</div>
            <div className="text-sm text-gray-600">Partner Organizations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {partnerOrganizations.reduce((sum, org) => sum + org.total_contributions, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Contributions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-purple-600">
              {partnerOrganizations.filter(org => org.verification_status === 'partner').length}
            </div>
            <div className="text-sm text-gray-600">Strategic Partners</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-orange-600">{recentRequests.length}</div>
            <div className="text-sm text-gray-600">Recent Requests</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'organizations', label: 'Organizations', icon: '🏢' },
          { id: 'requests', label: 'Requests', icon: '📝' },
          { id: 'guidelines', label: 'Guidelines', icon: '📋' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Partnership Model */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Partnership Model</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Authentic Representation</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Verified UK Black queer organizations contribute real events
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Community consent required for all submissions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Democratic editorial process through community governance
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      Geographic diversity ensures UK-wide representation
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Collaboration Benefits</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">●</span>
                      Cross-promotion of community events and initiatives
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">●</span>
                      Resource sharing and mutual aid coordination
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">●</span>
                      Collaborative advocacy campaigns and policy work
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">●</span>
                      Platform amplification of grassroots victories
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Partnership Activity</h2>
              <div className="space-y-4">
                {recentRequests.slice(0, 3).map((request) => {
                  const org = partnerOrganizations.find(o => o.id === request.organization_id)
                  return (
                    <div key={request.id} className="border-l-4 border-indigo-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{org?.name} • {org?.location}</p>
                          <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Partner with BLKOUT</h2>
              <p className="text-gray-600 mb-4">
                UK Black queer organizations: contribute events and stories to build community power
              </p>
              <button
                onClick={() => setShowContributionForm(true)}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Contribution
              </button>
            </div>
          </motion.div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Filters */}
            <div className="mb-6">
              <select
                value={selectedOrganizationType}
                onChange={(e) => setSelectedOrganizationType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Organization Types</option>
                <option value="community_org">Community Organizations</option>
                <option value="advocacy_group">Advocacy Groups</option>
                <option value="mutual_aid">Mutual Aid Networks</option>
                <option value="health_service">Health Services</option>
                <option value="support_group">Support Groups</option>
                <option value="cultural_collective">Cultural Collectives</option>
              </select>
            </div>

            {/* Organizations Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredOrganizations.map((org) => (
                <div key={org.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{org.name}</h3>
                      <p className="text-sm text-gray-600">{org.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrganizationTypeColor(org.type)}`}>
                        {org.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(org.verification_status)}`}>
                        {org.verification_status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Focus Areas:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {org.focus_areas.slice(0, 3).map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {area}
                          </span>
                        ))}
                        {org.focus_areas.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{org.focus_areas.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Contributions: {org.total_contributions}</span>
                      <span>Capacity: {org.contribution_capacity.replace('_', ' ')}</span>
                    </div>

                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Visit website →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-6">
              {recentRequests.map((request) => {
                const org = partnerOrganizations.find(o => o.id === request.organization_id)
                return (
                  <div key={request.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{request.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{org?.name} • {org?.location}</p>
                        <p className="text-gray-700">{request.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Type:</strong> {request.type.replace('_', ' ')}
                      </div>
                      {request.proposed_date && (
                        <div>
                          <strong>Proposed Date:</strong> {request.proposed_date}
                        </div>
                      )}
                      <div>
                        <strong>Estimated Reach:</strong> {request.estimated_reach} people
                      </div>
                      <div>
                        <strong>Submitted:</strong> {request.submission_date}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${request.community_consent ? 'text-green-600' : 'text-red-600'}`}>
                        {request.community_consent ? '✓' : '✗'} Community Consent
                      </span>
                      <span className={`flex items-center gap-1 ${request.contact_provided ? 'text-green-600' : 'text-red-600'}`}>
                        {request.contact_provided ? '✓' : '✗'} Contact Provided
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {[
              { key: 'events', title: 'Event Contributions', icon: '📅' },
              { key: 'stories', title: 'Story Contributions', icon: '📰' },
              { key: 'partnerships', title: 'Partnership Opportunities', icon: '🤝' },
              { key: 'community_standards', title: 'Community Standards', icon: '⭐' }
            ].map(({ key, title, icon }) => (
              <div key={key} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  {title}
                </h2>
                <ul className="space-y-3">
                  {contributionGuidelines[key].map((guideline, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-indigo-500 mt-1">●</span>
                      <span className="text-gray-700">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contribution Form Modal */}
      <AnimatePresence>
        {showContributionForm && (
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
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Contribution</h2>
              <p className="text-gray-600 mb-6">
                UK Black queer organizations can submit events and stories through our democratic process.
              </p>
              <div className="space-y-4">
                <div>
                  <strong>Next Steps:</strong>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Contact us at partnerships@blkout.org.uk</li>
                    <li>• Provide organization verification documents</li>
                    <li>• Review community guidelines and standards</li>
                    <li>• Submit events/stories through verified process</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => window.open('mailto:partnerships@blkout.org.uk', '_blank')}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => setShowContributionForm(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrganizationContributions