// Community Governance Dashboard
// Democratic story validation and curation interface

import { useState, useEffect } from 'react'
import { governanceIntegration, type GovernanceDecision } from '../services/governanceIntegration'
import { newsroomService } from '../services/newsroomService'

interface GovernanceDashboardData {
  active_decisions: GovernanceDecision[]
  validation_queue: number
  community_participation: {
    total_voters: number
    recent_activity: number
    engagement_rate: number
  }
  curation_stats: {
    stories_validated: number
    featured_this_week: number
    rejection_rate: number
  }
}

export default function GovernanceDashboard() {
  const [dashboardData, setDashboardData] = useState<GovernanceDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [votingOnDecision, setVotingOnDecision] = useState<string | null>(null)
  const [userHasVoted, setUserHasVoted] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadDashboardData()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await governanceIntegration.getGovernanceDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load governance dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (decisionId: string, vote: 'for' | 'against' | 'abstain', comments?: string) => {
    try {
      setVotingOnDecision(decisionId)
      
      // In real implementation, get actual user ID from auth
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const success = await governanceIntegration.voteOnStoryValidation(decisionId, userId, vote, comments)
      
      if (success) {
        setUserHasVoted(prev => new Set([...prev, decisionId]))
        await loadDashboardData() // Refresh data
        alert(`Vote recorded: ${vote.toUpperCase()}`)
      } else {
        alert('Failed to record vote. You may have already voted on this decision.')
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Error recording vote')
    } finally {
      setVotingOnDecision(null)
    }
  }

  const runCuration = async () => {
    try {
      const result = await governanceIntegration.curateStoriesForFeaturing()
      await loadDashboardData()
      
      alert(`Curation complete! ${result.curation_report.featured_count} stories featured from ${result.curation_report.total_reviewed} reviewed.`)
    } catch (error) {
      console.error('Error running curation:', error)
      alert('Error running story curation')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-8 bg-gray-300 rounded w-12 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Governance</h1>
          <p className="text-gray-600">Unable to load governance dashboard. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Governance</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Democratic story validation and curation by our community. Your voice shapes what gets featured and amplified.
          </p>
          
          <button
            onClick={runCuration}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Run Story Curation
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{dashboardData.validation_queue}</div>
            <div className="text-gray-600">Stories in Queue</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{dashboardData.community_participation.total_voters}</div>
            <div className="text-gray-600">Active Voters</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{dashboardData.curation_stats.featured_this_week}</div>
            <div className="text-gray-600">Featured This Week</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(dashboardData.community_participation.engagement_rate)}%
            </div>
            <div className="text-gray-600">Engagement Rate</div>
          </div>
        </div>

        {/* Active Decisions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Community Decisions</h2>
            <div className="text-sm text-gray-500">
              Decisions require minimum 3 votes or expire after 7 days
            </div>
          </div>

          {dashboardData.active_decisions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Decisions</h3>
              <p className="text-gray-600">
                All community decisions have been resolved. New stories will appear here for validation.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {dashboardData.active_decisions.map((decision) => (
                <div key={decision.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          decision.type === 'story_validation' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {decision.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          decision.status === 'voting' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {decision.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{decision.title}</h3>
                      <p className="text-gray-600 mb-4">{decision.description}</p>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Proposed by {decision.proposed_by} on{' '}
                        {new Date(decision.created_at).toLocaleDateString('en-UK')}
                        {decision.voting_ends_at && (
                          <span className="ml-2">
                            • Voting ends {new Date(decision.voting_ends_at).toLocaleDateString('en-UK')}
                          </span>
                        )}
                      </div>

                      {/* Story metadata */}
                      {decision.metadata && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {decision.metadata.impact_level && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              decision.metadata.impact_level === 'national' 
                                ? 'bg-red-100 text-red-800'
                                : decision.metadata.impact_level === 'local'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {decision.metadata.impact_level.toUpperCase()} Impact
                            </span>
                          )}
                          {decision.metadata.community_tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voting Results */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{decision.votes_for}</div>
                        <div className="text-sm text-gray-600">For</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{decision.votes_against}</div>
                        <div className="text-sm text-gray-600">Against</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">{decision.votes_abstain}</div>
                        <div className="text-sm text-gray-600">Abstain</div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((decision.votes_for / Math.max(decision.votes_for + decision.votes_against + decision.votes_abstain, 1)) * 100),
                              100
                            )}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {decision.status === 'voting' && !userHasVoted.has(decision.id) && (
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleVote(decision.id, 'for')}
                        disabled={votingOnDecision === decision.id}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {votingOnDecision === decision.id ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Vote For
                      </button>
                      
                      <button
                        onClick={() => handleVote(decision.id, 'against')}
                        disabled={votingOnDecision === decision.id}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Vote Against
                      </button>
                      
                      <button
                        onClick={() => handleVote(decision.id, 'abstain')}
                        disabled={votingOnDecision === decision.id}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Abstain
                      </button>
                    </div>
                  )}

                  {userHasVoted.has(decision.id) && (
                    <div className="text-center text-sm text-gray-600 bg-gray-50 py-2 rounded-lg">
                      ✅ You have voted on this decision
                    </div>
                  )}

                  {decision.metadata?.story_id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a
                        href={`/newsroom/article/${decision.metadata.story_id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View Full Story →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Curation Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Curation Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {dashboardData.curation_stats.stories_validated}
              </div>
              <div className="text-gray-600">Stories Validated This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {dashboardData.curation_stats.featured_this_week}
              </div>
              <div className="text-gray-600">Stories Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {Math.round(dashboardData.curation_stats.rejection_rate)}%
              </div>
              <div className="text-gray-600">Rejection Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Shape Our Community Stories</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Your participation in community governance ensures our platform amplifies the right voices 
            and centers Black queer liberation. Every vote matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/newsroom/submit" 
              className="inline-flex items-center px-6 py-3 bg-white text-base font-medium rounded-md text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              Submit Community Story
            </a>
            <a 
              href="/community/showcase" 
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              View Community Showcase
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}