// Community Governance Dashboard for BLKOUT's Cooperative Democracy
// Enables transparent decision-making, community proposals, and democratic participation

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Vote, Users, Scale, Heart, MessageSquare, TrendingUp, 
  CheckCircle, Clock, AlertCircle, Eye, ThumbsUp, ThumbsDown,
  Plus, Filter, Calendar, Bell, Activity, Gavel, 
  PieChart, BarChart3, GitBranch, Target, Shield,
  Award, Coffee, Sparkles, Megaphone, HandHeart,
  UserCheck, FileText, Archive, ChevronDown, ChevronRight
} from 'lucide-react'
import { useGovernanceProposals, useGovernanceStats, useCommunityMembers } from '../../hooks/useSupabase'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBoundary from '../common/ErrorBoundary'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import { COMMUNITY_VALUES, getCategoryColor } from '../../lib/constants'

interface GovernanceProposal {
  id: string
  title: string
  description: string
  category: 'policy' | 'budget' | 'platform' | 'community' | 'values'
  status: 'draft' | 'discussion' | 'voting' | 'approved' | 'rejected' | 'implemented'
  proposer: string
  created_at: string
  voting_deadline?: string
  votes_for: number
  votes_against: number
  votes_abstain: number
  total_eligible: number
  participation_rate: number
  discussion_count: number
  community_impact: 'low' | 'medium' | 'high' | 'critical'
}

interface CommunityMember {
  id: string
  name: string
  role: 'member' | 'moderator' | 'council' | 'founder'
  verified: boolean
  contribution_score: number
  voting_power: number
  last_active: string
}

interface DecisionRecord {
  id: string
  title: string
  decision: string
  implemented_date: string
  impact_assessment: string
  follow_up_required: boolean
}

const CommunityGovernanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'voting' | 'decisions' | 'participation'>('proposals')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showNewProposal, setShowNewProposal] = useState(false)
  
  // Use real data from Supabase
  const { 
    proposals, 
    loading: proposalsLoading, 
    error: proposalsError,
    createProposal,
    voteOnProposal 
  } = useGovernanceProposals({ 
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 50 
  })
  
  const { 
    stats: governanceStats, 
    loading: statsLoading 
  } = useGovernanceStats()
  
  const { 
    members: communityMembers, 
    loading: membersLoading 
  } = useCommunityMembers({ 
    verified: true, 
    limit: 20 
  })

  // Loading state
  if (proposalsLoading || statsLoading || membersLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
          <LoadingSpinner size="lg" color="purple" text="Loading governance dashboard..." />
        </div>
      </ErrorBoundary>
    )
  }

  // Error state
  if (proposalsError) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Governance Data</h2>
            <p className="text-indigo-300">{proposalsError}</p>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-900/20'
      case 'discussion': return 'text-blue-400 bg-blue-900/20'
      case 'voting': return 'text-amber-400 bg-amber-900/20'
      case 'approved': return 'text-emerald-400 bg-emerald-900/20'
      case 'rejected': return 'text-red-400 bg-red-900/20'
      case 'implemented': return 'text-purple-400 bg-purple-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'policy': return Scale
      case 'budget': return BarChart3
      case 'platform': return GitBranch
      case 'community': return Users
      case 'values': return Heart
      default: return FileText
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        <PrimaryNavigationEnhanced />
        
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-purple-950 via-indigo-950 to-emerald-950 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center mr-6">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-black heading-block uppercase">
                    <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                      Community
                    </span>
                    <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent ml-2">
                      Governance
                    </span>
                  </h1>
                  <p className="text-purple-300 font-mono uppercase tracking-wider text-sm">
                    COOPERATIVE DEMOCRACY IN ACTION
                  </p>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-8">
                Our community makes decisions together. Every voice matters, every vote counts, and every decision is transparent.
                This is cooperative democracy built on trust, liberation, and collective power.
              </p>

              {/* Governance Stats - Using Real Data */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/30 p-4">
                  <div className="text-2xl font-bold text-white">
                    {governanceStats?.proposals?.active_proposals || 0}
                  </div>
                  <div className="text-sm text-purple-300">Active Proposals</div>
                </div>
                <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-4">
                  <div className="text-2xl font-bold text-white">
                    {governanceStats?.members?.verified || 0}
                  </div>
                  <div className="text-sm text-emerald-300">Verified Members</div>
                </div>
                <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-700/30 p-4">
                  <div className="text-2xl font-bold text-white">
                    {governanceStats?.proposals?.average_participation?.toFixed(1) || '0'}%
                  </div>
                  <div className="text-sm text-amber-300">Participation Rate</div>
                </div>
                <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-4">
                  <div className="text-2xl font-bold text-white">
                    {((governanceStats?.documents?.public || 0) / Math.max(governanceStats?.documents?.total || 1, 1) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-indigo-300">Decision Transparency</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Navigation Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <nav className="flex space-x-1 bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-2">
              {[
                { id: 'proposals', label: 'Active Proposals', icon: FileText },
                { id: 'voting', label: 'Current Votes', icon: Vote },
                { id: 'decisions', label: 'Past Decisions', icon: Archive },
                { id: 'participation', label: 'Member Participation', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Active Proposals Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'proposals' && (
              <motion.div
                key="proposals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black heading-block uppercase">
                    <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      Community Proposals
                    </span>
                  </h2>
                  <button 
                    onClick={() => setShowNewProposal(true)}
                    className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Proposal</span>
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {['all', 'policy', 'budget', 'platform', 'community', 'values'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-indigo-900/30 text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Proposals Grid - Using Real Data */}
                <div className="space-y-6">
                  {proposals && proposals.length > 0 ? (
                    proposals
                      .filter(proposal => selectedCategory === 'all' || proposal.category === selectedCategory)
                      .map((proposal, index) => {
                        const CategoryIcon = getCategoryIcon(proposal.category)
                        return (
                          <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 hover:bg-indigo-800/30 transition-all duration-300 group"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-purple-600/20 flex items-center justify-center">
                                  <CategoryIcon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                                    {proposal.title}
                                  </h3>
                                  <div className="flex items-center space-x-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                                      {proposal.status.toUpperCase()}
                                    </span>
                                    <span className="text-indigo-300">by {proposal.proposer_name || proposal.proposer}</span>
                                    <span className={`${getImpactColor(proposal.community_impact)} font-medium`}>
                                      {proposal.community_impact.toUpperCase()} IMPACT
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-indigo-300 mb-1">
                                  {new Date(proposal.created_at).toLocaleDateString()}
                                </div>
                                {proposal.voting_deadline && (
                                  <div className="text-xs text-amber-400 font-medium">
                                    Voting ends: {new Date(proposal.voting_deadline).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-indigo-100 mb-4 line-clamp-2">
                              {proposal.description}
                            </p>

                            {/* Voting Progress */}
                            {proposal.status === 'voting' && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-indigo-300">Voting Progress</span>
                                  <span className="text-sm text-indigo-300">
                                    {proposal.participation_rate?.toFixed(1) || '0'}% participation
                                  </span>
                                </div>
                                <div className="w-full bg-indigo-900/50 rounded-full h-2 mb-3">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${proposal.participation_rate || 0}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <ThumbsUp className="w-4 h-4 text-emerald-400" />
                                      <span className="text-emerald-400 font-medium">{proposal.votes_for || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <ThumbsDown className="w-4 h-4 text-red-400" />
                                      <span className="text-red-400 font-medium">{proposal.votes_against || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-400 font-medium">{proposal.votes_abstain || 0}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                                    <span className="text-indigo-400">{proposal.discussion_count || 0} comments</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-3">
                                <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                                  <Eye className="w-4 h-4" />
                                  <span>View Details</span>
                                </button>
                                <button className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Join Discussion</span>
                                </button>
                              </div>
                              {proposal.status === 'voting' && (
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => voteOnProposal(proposal.id, 'for')}
                                    className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    Support
                                  </button>
                                  <button 
                                    onClick={() => voteOnProposal(proposal.id, 'against')}
                                    className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    Oppose
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No proposals found</h3>
                      <p className="text-indigo-300 mb-4">
                        Be the first to submit a proposal to help shape our community's future.
                      </p>
                      <button
                        onClick={() => setShowNewProposal(true)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Submit First Proposal
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Member Participation Tab */}
            {activeTab === 'participation' && (
              <motion.div
                key="participation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-black heading-block uppercase mb-8">
                  <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                    Community Participation
                  </span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Participation Metrics */}
                  <div className="lg:col-span-2">
                    <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 mb-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
                        Participation Metrics
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-400">
                            {governanceStats?.proposals?.average_participation?.toFixed(1) || '0'}%
                          </div>
                          <div className="text-sm text-indigo-300">Average Participation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-400">
                            {governanceStats?.members?.verified || 0}
                          </div>
                          <div className="text-sm text-indigo-300">Active Members</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-indigo-300">Policy Decisions</span>
                            <span className="text-white font-medium">84%</span>
                          </div>
                          <div className="w-full bg-indigo-900/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-500 to-purple-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-indigo-300">Budget Votes</span>
                            <span className="text-white font-medium">67%</span>
                          </div>
                          <div className="w-full bg-indigo-900/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-500 to-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-indigo-300">Community Proposals</span>
                            <span className="text-white font-medium">91%</span>
                          </div>
                          <div className="w-full bg-indigo-900/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-500 to-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Community Values Alignment */}
                    <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-700/30 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Heart className="w-6 h-6 text-emerald-400 mr-3" />
                        Community Values in Action
                      </h3>
                      <div className="space-y-3">
                        {COMMUNITY_VALUES.map((value, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-100 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Members */}
                  <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <UserCheck className="w-6 h-6 text-indigo-400 mr-3" />
                      Community Leaders
                    </h3>
                    <div className="space-y-4">
                      {communityMembers.map((member) => (
                        <div key={member.id} className="border border-indigo-700/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{member.name}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              member.role === 'council' ? 'bg-purple-600/20 text-purple-300' :
                              member.role === 'moderator' ? 'bg-emerald-600/20 text-emerald-300' :
                              'bg-indigo-600/20 text-indigo-300'
                            }`}>
                              {member.role.toUpperCase()}
                            </div>
                          </div>
                          <div className="text-sm text-indigo-300 mb-2">
                            Contribution Score: {member.contribution_score}
                          </div>
                          <div className="text-xs text-indigo-400">
                            Last active: {new Date(member.last_active).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Community Values Banner */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-emerald-900 p-8 border border-purple-600/30"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Gavel className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-3xl font-black heading-block mb-6 uppercase">
                <span className="bg-gradient-to-r from-purple-300 to-emerald-300 bg-clip-text text-transparent">
                  Democracy is a Practice, Not a Theory
                </span>
              </h3>
              <p className="text-lg text-indigo-100 mb-8 font-light leading-relaxed">
                Our governance model is rooted in liberation, trust, and collective decision-making. 
                We don't just talk about democracy - we practice it every day through transparent processes,
                inclusive participation, and accountable leadership.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Become a Member
                </button>
                <button className="bg-transparent border-2 border-purple-400 hover:bg-purple-400/10 text-purple-100 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Learn About Governance
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        <PlatformFooter />
      </div>
    </ErrorBoundary>
  )
}

export default CommunityGovernanceDashboard