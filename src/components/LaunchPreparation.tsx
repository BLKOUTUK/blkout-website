/**
 * Launch Preparation & Partner Coordination
 * Comprehensive beta launch readiness dashboard
 * DEMONSTRATION TEMPLATE with fictional partner organizations for beta testing workflow
 * 
 * ⚠️  IMPORTANT: All partner organizations listed are FICTIONAL examples
 * Real launch coordination requires authentic community partnerships with proper consent
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PartnerOrganization {
  id: string
  name: string
  location: string
  contact_person: string
  contact_email: string
  contact_phone: string
  organization_type: 'grassroots' | 'established_charity' | 'community_group' | 'academic' | 'government'
  focus_areas: string[]
  commitment_level: 'beta_testing' | 'content_partner' | 'event_coordinator' | 'governance_participant' | 'full_ecosystem'
  readiness_status: 'ready' | 'training_needed' | 'technical_setup' | 'awaiting_confirmation'
  launch_contributions: {
    events_committed: number
    stories_committed: number
    community_size: number
    training_sessions_needed: number
  }
  verification_status: 'verified' | 'pending' | 'in_review'
  last_contact: Date
  notes: string
}

interface LaunchReadinessMetric {
  category: string
  component: string
  status: 'ready' | 'in_progress' | 'needs_attention' | 'blocked'
  completion_percentage: number
  blockers: string[]
  dependencies: string[]
  responsible_person: string
  target_date: Date
  critical_path: boolean
}

interface StakeholderGroup {
  id: string
  name: string
  type: 'community_leaders' | 'funders' | 'tech_partners' | 'media' | 'government' | 'academic'
  stakeholders: {
    name: string
    role: string
    organization: string
    contact_method: string
    engagement_status: 'highly_engaged' | 'supportive' | 'neutral' | 'skeptical' | 'hostile'
    demo_scheduled: boolean
    demo_date?: Date
  }[]
  collective_readiness: number
  key_concerns: string[]
  success_criteria: string[]
}

const LaunchPreparation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'readiness' | 'stakeholders' | 'timeline' | 'risk'>('partners')
  const [partnerOrgs, setPartnerOrgs] = useState<PartnerOrganization[]>([])
  const [readinessMetrics, setReadinessMetrics] = useState<LaunchReadinessMetric[]>([])
  const [stakeholderGroups, setStakeholderGroups] = useState<StakeholderGroup[]>([])
  const [launchDate, setLaunchDate] = useState<Date>(new Date('2024-09-02')) // Monday

  useEffect(() => {
    // FICTIONAL partner organizations for demonstration - NOT REAL ORGANIZATIONS
    // Real launch requires authentic community partnerships with proper consent
    const mockPartners: PartnerOrganization[] = [
      {
        id: '1',
        name: 'Trans Housing Network',
        location: 'London (Hackney)',
        contact_person: 'Maya Patel',
        contact_email: 'maya@transhousing.org.uk',
        contact_phone: '+44 7123 456789',
        organization_type: 'grassroots',
        focus_areas: ['housing_justice', 'trans_rights', 'emergency_support'],
        commitment_level: 'full_ecosystem',
        readiness_status: 'ready',
        launch_contributions: {
          events_committed: 8,
          stories_committed: 12,
          community_size: 234,
          training_sessions_needed: 0
        },
        verification_status: 'verified',
        last_contact: new Date('2024-08-29'),
        notes: 'Excellent preparedness. Already using IVOR for housing coordination. Ready to showcase successful organizing wins.'
      },
      {
        id: '2',
        name: 'Black Lives Matter Manchester',
        location: 'Manchester (Moss Side)',
        contact_person: 'Kwame Johnson',
        contact_email: 'kwame@blmmanchester.org.uk',
        contact_phone: '+44 7234 567890',
        organization_type: 'established_charity',
        focus_areas: ['police_accountability', 'racial_justice', 'community_organizing'],
        commitment_level: 'content_partner',
        readiness_status: 'training_needed',
        launch_contributions: {
          events_committed: 6,
          stories_committed: 15,
          community_size: 567,
          training_sessions_needed: 2
        },
        verification_status: 'verified',
        last_contact: new Date('2024-08-28'),
        notes: 'Strong organizing capacity. Need training on IVOR storytelling features. Committed to know your rights workshops.'
      },
      {
        id: '3',
        name: 'Bristol Black Queer Collective',
        location: 'Bristol (St Paul\'s)',
        contact_person: 'Zuri Okafor',
        contact_email: 'zuri@bristolbqc.org.uk',
        contact_phone: '+44 7345 678901',
        organization_type: 'community_group',
        focus_areas: ['queer_liberation', 'healing_justice', 'cultural_organizing'],
        commitment_level: 'beta_testing',
        readiness_status: 'technical_setup',
        launch_contributions: {
          events_committed: 4,
          stories_committed: 8,
          community_size: 189,
          training_sessions_needed: 1
        },
        verification_status: 'verified',
        last_contact: new Date('2024-08-27'),
        notes: 'Healing circles are growing rapidly. Need help with Chrome extension setup for community reporting.'
      },
      {
        id: '4',
        name: 'Edinburgh Tenants Union',
        location: 'Edinburgh (Southside)',
        contact_person: 'Aaliyah MacLeod',
        contact_email: 'aaliyah@edinburghtenants.scot',
        contact_phone: '+44 7456 789012',
        organization_type: 'grassroots',
        focus_areas: ['housing_justice', 'tenant_rights', 'collective_action'],
        commitment_level: 'event_coordinator',
        readiness_status: 'awaiting_confirmation',
        launch_contributions: {
          events_committed: 5,
          stories_committed: 6,
          community_size: 345,
          training_sessions_needed: 1
        },
        verification_status: 'pending',
        last_contact: new Date('2024-08-26'),
        notes: 'Rent strike campaign gaining momentum. Waiting for committee approval for platform participation.'
      },
      {
        id: '5',
        name: 'Mutual Aid Birmingham',
        location: 'Birmingham (Handsworth)',
        contact_person: 'Fatima Ali',
        contact_email: 'fatima@mutualadbirmingham.org.uk',
        contact_phone: '+44 7567 890123',
        organization_type: 'community_group',
        focus_areas: ['mutual_aid', 'food_justice', 'community_care'],
        commitment_level: 'governance_participant',
        readiness_status: 'ready',
        launch_contributions: {
          events_committed: 10,
          stories_committed: 20,
          community_size: 456,
          training_sessions_needed: 0
        },
        verification_status: 'verified',
        last_contact: new Date('2024-08-30'),
        notes: 'Food distribution network is exemplary. Eager to contribute to democratic governance processes.'
      }
    ]

    const mockReadinessMetrics: LaunchReadinessMetric[] = [
      {
        category: 'Technical Infrastructure',
        component: 'BLKOUT Website',
        status: 'ready',
        completion_percentage: 100,
        blockers: [],
        dependencies: [],
        responsible_person: 'Development Team',
        target_date: new Date('2024-08-30'),
        critical_path: true
      },
      {
        category: 'Technical Infrastructure',
        component: 'IVOR AI Services (6 services)',
        status: 'ready',
        completion_percentage: 100,
        blockers: [],
        dependencies: [],
        responsible_person: 'AI Team',
        target_date: new Date('2024-08-30'),
        critical_path: true
      },
      {
        category: 'Content & Community',
        component: 'Partner Organization Training',
        status: 'in_progress',
        completion_percentage: 75,
        blockers: ['Scheduling conflicts with BLM Manchester', 'Edinburgh committee approval pending'],
        dependencies: ['Partner commitment confirmations'],
        responsible_person: 'Community Coordination',
        target_date: new Date('2024-09-01'),
        critical_path: true
      },
      {
        category: 'Content & Community',
        component: 'Story Archive Population',
        status: 'ready',
        completion_percentage: 100,
        blockers: [],
        dependencies: [],
        responsible_person: 'Editorial Team',
        target_date: new Date('2024-08-29'),
        critical_path: false
      },
      {
        category: 'Governance & Operations',
        component: 'Democratic Decision-Making Protocols',
        status: 'ready',
        completion_percentage: 95,
        blockers: [],
        dependencies: ['Community governance training'],
        responsible_person: 'Governance Working Group',
        target_date: new Date('2024-08-31'),
        critical_path: false
      },
      {
        category: 'Legal & Compliance',
        component: 'Data Protection & Privacy Compliance',
        status: 'needs_attention',
        completion_percentage: 80,
        blockers: ['GDPR audit incomplete', 'Consent collection mechanisms need final review'],
        dependencies: ['Legal review completion'],
        responsible_person: 'Legal Team',
        target_date: new Date('2024-09-01'),
        critical_path: true
      },
      {
        category: 'Launch Communications',
        component: 'Stakeholder Demo Environment',
        status: 'in_progress',
        completion_percentage: 90,
        blockers: [],
        dependencies: ['Performance testing completion'],
        responsible_person: 'Launch Team',
        target_date: new Date('2024-09-01'),
        critical_path: true
      }
    ]

    const mockStakeholders: StakeholderGroup[] = [
      {
        id: '1',
        name: 'Community Leaders & Organizers',
        type: 'community_leaders',
        stakeholders: [
          {
            name: 'Maya Patel',
            role: 'Coordinator',
            organization: 'Trans Housing Network',
            contact_method: 'maya@transhousing.org.uk',
            engagement_status: 'highly_engaged',
            demo_scheduled: true,
            demo_date: new Date('2024-09-02')
          },
          {
            name: 'Kwame Johnson',
            role: 'Organizer',
            organization: 'BLM Manchester',
            contact_method: 'kwame@blmmanchester.org.uk',
            engagement_status: 'supportive',
            demo_scheduled: true,
            demo_date: new Date('2024-09-02')
          }
        ],
        collective_readiness: 92,
        key_concerns: ['Platform sustainability', 'Community data sovereignty', 'Avoiding surveillance'],
        success_criteria: ['100+ active community members within month', 'Verified organizing victories', 'Democratic participation']
      },
      {
        id: '2',
        name: 'UK Black & Queer Media',
        type: 'media',
        stakeholders: [
          {
            name: 'Journalist Network UK',
            role: 'Editorial',
            organization: 'Community Media Collective',
            contact_method: 'hello@journalistnetworkuk.org',
            engagement_status: 'highly_engaged',
            demo_scheduled: true,
            demo_date: new Date('2024-09-03')
          }
        ],
        collective_readiness: 85,
        key_concerns: ['Story verification processes', 'Editorial independence', 'Community consent'],
        success_criteria: ['Ethical journalism standards', 'Community voice amplification', 'Story authenticity']
      },
      {
        id: '3',
        name: 'Tech & Innovation Partners',
        type: 'tech_partners',
        stakeholders: [
          {
            name: 'Tech for Good Coalition',
            role: 'Technical Advisory',
            organization: 'UK Digital Rights',
            contact_method: 'tech@digitalrights.uk',
            engagement_status: 'supportive',
            demo_scheduled: false
          }
        ],
        collective_readiness: 78,
        key_concerns: ['AI bias prevention', 'Open source transparency', 'Data security'],
        success_criteria: ['Technical resilience', 'Community control of technology', 'Privacy protection']
      }
    ]

    setPartnerOrgs(mockPartners)
    setReadinessMetrics(mockReadinessMetrics)
    setStakeholderGroups(mockStakeholders)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      ready: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      needs_attention: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800',
      training_needed: 'bg-orange-100 text-orange-800',
      technical_setup: 'bg-purple-100 text-purple-800',
      awaiting_confirmation: 'bg-gray-100 text-gray-800',
      highly_engaged: 'bg-green-100 text-green-800',
      supportive: 'bg-blue-100 text-blue-800',
      neutral: 'bg-gray-100 text-gray-600',
      skeptical: 'bg-yellow-100 text-yellow-800',
      hostile: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const getCommitmentIcon = (commitment: PartnerOrganization['commitment_level']) => {
    const icons = {
      beta_testing: '🧪',
      content_partner: '📝',
      event_coordinator: '📅',
      governance_participant: '🗳️',
      full_ecosystem: '🌟'
    }
    return icons[commitment]
  }

  const calculateOverallReadiness = () => {
    const totalMetrics = readinessMetrics.length
    const completedMetrics = readinessMetrics.filter(m => m.status === 'ready').length
    const criticalPathReady = readinessMetrics.filter(m => m.critical_path && m.status === 'ready').length
    const criticalPathTotal = readinessMetrics.filter(m => m.critical_path).length
    
    return {
      overall: Math.round((completedMetrics / totalMetrics) * 100),
      criticalPath: Math.round((criticalPathReady / criticalPathTotal) * 100)
    }
  }

  const readiness = calculateOverallReadiness()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              🚀 Beta Launch Preparation
            </h1>
            <p className="text-emerald-100 text-lg mt-2">
              DEMONSTRATION: Launch coordination workflow template
            </p>
            <p className="text-emerald-200 text-sm mt-1">
              ⚠️ Fictional organizations - Real launch requires authentic community partnerships
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{readiness.overall}%</div>
            <div className="text-sm text-emerald-200">Launch Ready</div>
            <div className="text-sm text-emerald-300">Critical Path: {readiness.criticalPath}%</div>
          </div>
        </div>

        {/* Launch Timeline */}
        <div className="mt-6 p-4 bg-emerald-700/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>🗓️ Target Launch: {launchDate.toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span>📍 Launch Cities: London, Manchester, Bristol, Edinburgh, Birmingham</span>
            <span>👥 Partner Organizations: {partnerOrgs.length} confirmed</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'partners', label: 'Partner Orgs', icon: '🤝' },
          { key: 'readiness', label: 'Launch Readiness', icon: '✅' },
          { key: 'stakeholders', label: 'Stakeholders', icon: '👥' },
          { key: 'timeline', label: 'Timeline', icon: '📅' },
          { key: 'risk', label: 'Risk Assessment', icon: '⚠️' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all
              ${activeTab === tab.key
                ? 'bg-white text-emerald-600 shadow-sm'
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
          {activeTab === 'partners' && (
            <motion.div
              key="partners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">UK Partner Organizations</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>✅ {partnerOrgs.filter(p => p.readiness_status === 'ready').length} Ready</span>
                  <span>🔧 {partnerOrgs.filter(p => p.readiness_status === 'training_needed').length} Training Needed</span>
                  <span>⏳ {partnerOrgs.filter(p => p.readiness_status === 'awaiting_confirmation').length} Awaiting Confirmation</span>
                </div>
              </div>

              {partnerOrgs.map((partner) => (
                <div key={partner.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getCommitmentIcon(partner.commitment_level)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{partner.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.verification_status)}`}>
                            {partner.verification_status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>📍 {partner.location}</span>
                          <span>👤 {partner.contact_person}</span>
                          <span>📧 {partner.contact_email}</span>
                          <span>📞 {partner.contact_phone}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {partner.focus_areas.map((area) => (
                            <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {area.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        
                        {partner.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                            💬 {partner.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.readiness_status)}`}>
                        {partner.readiness_status.replace('_', ' ')}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Last contact: {partner.last_contact.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Launch Contributions */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{partner.launch_contributions.events_committed}</div>
                      <div className="text-xs text-gray-500">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{partner.launch_contributions.stories_committed}</div>
                      <div className="text-xs text-gray-500">Stories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{partner.launch_contributions.community_size}</div>
                      <div className="text-xs text-gray-500">Community</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{partner.launch_contributions.training_sessions_needed}</div>
                      <div className="text-xs text-gray-500">Training Needed</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all text-sm">
                      📞 Schedule Call
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all text-sm">
                      📧 Send Update
                    </button>
                    {partner.launch_contributions.training_sessions_needed > 0 && (
                      <button className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all text-sm">
                        🎓 Schedule Training
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'readiness' && (
            <motion.div
              key="readiness"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Launch Readiness Assessment</h2>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{readiness.overall}%</div>
                    <div className="text-xs text-gray-500">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{readiness.criticalPath}%</div>
                    <div className="text-xs text-gray-500">Critical Path</div>
                  </div>
                </div>
              </div>

              {/* Readiness by Category */}
              {Object.entries(
                readinessMetrics.reduce((acc, metric) => {
                  if (!acc[metric.category]) acc[metric.category] = []
                  acc[metric.category].push(metric)
                  return acc
                }, {} as Record<string, LaunchReadinessMetric[]>)
              ).map(([category, metrics]) => (
                <div key={category} className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4">{category}</h3>
                  <div className="space-y-4">
                    {metrics.map((metric, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">{metric.component}</h4>
                              {metric.critical_path && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                  Critical Path
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              👤 {metric.responsible_person} | 🎯 {metric.target_date.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{metric.completion_percentage}%</div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                                {metric.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                metric.status === 'ready' ? 'bg-green-500' :
                                metric.status === 'in_progress' ? 'bg-blue-500' :
                                metric.status === 'needs_attention' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${metric.completion_percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Blockers */}
                        {metric.blockers.length > 0 && (
                          <div className="mb-2">
                            <h5 className="font-medium text-red-700 text-sm mb-1">🚫 Blockers:</h5>
                            <ul className="text-sm text-red-600 space-y-1">
                              {metric.blockers.map((blocker, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span>•</span>
                                  {blocker}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Dependencies */}
                        {metric.dependencies.length > 0 && (
                          <div>
                            <h5 className="font-medium text-blue-700 text-sm mb-1">🔗 Dependencies:</h5>
                            <div className="flex flex-wrap gap-2">
                              {metric.dependencies.map((dep, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {dep}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'stakeholders' && (
            <motion.div
              key="stakeholders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Stakeholder Group Readiness</h2>
              
              {stakeholderGroups.map((group) => (
                <div key={group.id} className="bg-white border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{group.name}</h3>
                      <p className="text-gray-600 capitalize">{group.type.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{group.collective_readiness}%</div>
                      <div className="text-xs text-gray-500">Collective Readiness</div>
                    </div>
                  </div>

                  {/* Individual Stakeholders */}
                  <div className="space-y-3 mb-6">
                    {group.stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{stakeholder.name}</div>
                          <div className="text-sm text-gray-600">{stakeholder.role} at {stakeholder.organization}</div>
                          <div className="text-xs text-gray-500">{stakeholder.contact_method}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stakeholder.engagement_status)}`}>
                            {stakeholder.engagement_status.replace('_', ' ')}
                          </span>
                          {stakeholder.demo_scheduled ? (
                            <span className="text-green-600 text-sm">
                              📅 {stakeholder.demo_date?.toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">No demo scheduled</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Concerns & Success Criteria */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">⚠️ Key Concerns</h4>
                      <ul className="space-y-1">
                        {group.key_concerns.map((concern, i) => (
                          <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                            <span>•</span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">✅ Success Criteria</h4>
                      <ul className="space-y-1">
                        {group.success_criteria.map((criteria, i) => (
                          <li key={i} className="text-sm text-green-600 flex items-start gap-2">
                            <span>•</span>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Launch Timeline & Milestones</h2>
              
              <div className="space-y-6">
                {[
                  {
                    date: 'August 31, 2024',
                    title: 'Final Technical Review',
                    status: 'in_progress',
                    tasks: ['GDPR compliance audit', 'Performance optimization', 'Security review']
                  },
                  {
                    date: 'September 1, 2024',
                    title: 'Partner Training Completion',
                    status: 'in_progress',
                    tasks: ['BLM Manchester IVOR training', 'Bristol tech setup', 'Edinburgh confirmation']
                  },
                  {
                    date: 'September 2, 2024',
                    title: 'Beta Launch Day',
                    status: 'ready',
                    tasks: ['London launch event', 'Partner coordination', 'Media outreach', 'Community activation']
                  },
                  {
                    date: 'September 3-9, 2024',
                    title: 'Launch Week',
                    status: 'ready',
                    tasks: ['Daily community check-ins', 'Technical support', 'Story collection', 'Feedback integration']
                  },
                  {
                    date: 'September 10, 2024',
                    title: 'Week 1 Review',
                    status: 'ready',
                    tasks: ['Metrics analysis', 'Partner feedback', 'Technical adjustments', 'Community governance activation']
                  }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(milestone.status).includes('green') ? 'bg-green-500' : getStatusColor(milestone.status).includes('blue') ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      {index < 4 && <div className="w-0.5 h-16 bg-gray-300 mt-2" />}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{milestone.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{milestone.date}</div>
                      <ul className="space-y-1">
                        {milestone.tasks.map((task, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment & Mitigation</h2>
              
              {[
                {
                  risk: 'Partner Organization Availability',
                  severity: 'medium',
                  probability: 'low',
                  impact: 'Edinburgh Tenants Union committee approval still pending',
                  mitigation: 'Alternative partner organizations identified. Proceed with 4/5 confirmed partners.',
                  owner: 'Community Coordination'
                },
                {
                  risk: 'Technical Infrastructure Scaling',
                  severity: 'high',
                  probability: 'low',
                  impact: 'IVOR services may experience load issues with multiple simultaneous users',
                  mitigation: 'Load testing completed. Auto-scaling configured. 24/7 technical support on standby.',
                  owner: 'Technical Team'
                },
                {
                  risk: 'Community Data Privacy Concerns',
                  severity: 'high',
                  probability: 'medium',
                  impact: 'Community members may be hesitant to share stories due to surveillance concerns',
                  mitigation: 'Clear privacy policies. Local data storage options. Pseudonymization features. Transparency reports.',
                  owner: 'Legal & Community Team'
                },
                {
                  risk: 'Media Coverage Misrepresentation',
                  severity: 'medium',
                  probability: 'medium',
                  impact: 'Mainstream media may misrepresent platform purpose or community stories',
                  mitigation: 'Community media partnerships prioritized. Message discipline training. Spokesperson preparation.',
                  owner: 'Communications Team'
                }
              ].map((risk, index) => (
                <div key={index} className="bg-white border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{risk.risk}</h3>
                      <p className="text-gray-700 mb-3">{risk.impact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                        risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.severity} severity
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        risk.probability === 'high' ? 'bg-red-100 text-red-800' :
                        risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.probability} probability
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-3">
                    <h4 className="font-medium text-blue-800 mb-2">🛡️ Mitigation Strategy</h4>
                    <p className="text-blue-700 text-sm">{risk.mitigation}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    👤 Risk Owner: {risk.owner}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Launch Action Panel */}
      <div className="bg-white border-2 border-emerald-500 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Launch Readiness Status</h3>
            <p className="text-gray-600">
              {readiness.criticalPath >= 95 ? (
                <span className="text-green-600 font-medium">🟢 Go/No-Go: LAUNCH READY</span>
              ) : readiness.criticalPath >= 80 ? (
                <span className="text-yellow-600 font-medium">🟡 Go/No-Go: CAUTION - Address critical path items</span>
              ) : (
                <span className="text-red-600 font-medium">🔴 Go/No-Go: NOT READY - Critical blockers remain</span>
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
              📊 Generate Launch Report
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all">
              🚀 Execute Launch Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaunchPreparation