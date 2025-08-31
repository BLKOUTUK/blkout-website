/**
 * Newsroom Population Dashboard
 * Interface for populating newsroom with comprehensive UK Black queer community stories
 * Shows population statistics, quality metrics, and story breakdown
 */

import React, { useState, useEffect } from 'react'
import newsroomPopulationService from '../services/newsroomPopulationService'
import StoryDisclaimerBanner from './StoryDisclaimerBanner'

interface PopulationState {
  is_populating: boolean
  last_result: any
  statistics: any
  quality_validation: any
  loading: boolean
  error: string | null
}

const NewsroomPopulationDashboard: React.FC = () => {
  const [state, setState] = useState<PopulationState>({
    is_populating: false,
    last_result: null,
    statistics: null,
    quality_validation: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const [stats, quality] = await Promise.all([
        newsroomPopulationService.getPopulationStatistics(),
        newsroomPopulationService.validateNewsroomQuality()
      ])

      setState(prev => ({
        ...prev,
        statistics: stats,
        quality_validation: quality,
        loading: false
      }))

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setState(prev => ({
        ...prev,
        error: `Failed to load dashboard data: ${error.message}`,
        loading: false
      }))
    }
  }

  const handlePopulateNewsroom = async (clearExisting: boolean = false) => {
    try {
      setState(prev => ({ ...prev, is_populating: true, error: null }))

      const result = await newsroomPopulationService.populateNewsroom({
        clear_existing: clearExisting,
        batch_size: 10,
        include_sample_data: true
      })

      setState(prev => ({ ...prev, last_result: result, is_populating: false }))
      
      // Reload dashboard data
      await loadDashboardData()

    } catch (error) {
      console.error('Error populating newsroom:', error)
      setState(prev => ({
        ...prev,
        error: `Failed to populate newsroom: ${error.message}`,
        is_populating: false
      }))
    }
  }

  const getQualityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQualityBadge = (score: number): string => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (state.loading) {
    return (
      <div className="newsroom-population-dashboard p-6 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="h-8 bg-gray-300 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="newsroom-population-dashboard p-6 bg-white rounded-lg shadow-sm">
      {/* Disclaimer Banner */}
      <StoryDisclaimerBanner persistent={true} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsroom Population</h2>
          <p className="text-gray-600 mt-1">
            Manage UK Black queer community stories in the newsroom
          </p>
        </div>
        
        <button
          onClick={loadDashboardData}
          disabled={state.loading}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          {state.loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="text-red-600 mr-2">⚠️</div>
            <div className="text-red-700">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quality Validation */}
      {state.quality_validation && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Quality Score</span>
                <span className={`text-2xl font-bold ${getQualityColor(state.quality_validation.quality_score)}`}>
                  {state.quality_validation.quality_score}%
                </span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getQualityBadge(state.quality_validation.quality_score)}`}>
                {state.quality_validation.is_valid ? 'Valid' : 'Needs Improvement'}
              </span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Issues & Recommendations</h4>
              {state.quality_validation.issues.length > 0 ? (
                <ul className="text-sm text-red-600 mb-2">
                  {state.quality_validation.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-600 mb-2">✅ No issues found</p>
              )}
              
              {state.quality_validation.recommendations.length > 0 && (
                <ul className="text-sm text-yellow-600">
                  {state.quality_validation.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Overview */}
      {state.statistics && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Newsroom Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{state.statistics.total_stories}</div>
              <div className="text-sm text-gray-600">Total Stories</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Object.keys(state.statistics.by_category).length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(state.statistics.by_location).length}</div>
              <div className="text-sm text-gray-600">UK Locations</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{state.statistics.avg_validation_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Quality</div>
            </div>
          </div>

          {/* Detailed Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Breakdown */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">By Category</h4>
              <div className="space-y-2">
                {Object.entries(state.statistics.by_category).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Breakdown */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">By Location</h4>
              <div className="space-y-2">
                {Object.entries(state.statistics.by_location).map(([location, count]) => (
                  <div key={location} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{location}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Level Breakdown */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">By Impact Level</h4>
              <div className="space-y-2">
                {Object.entries(state.statistics.by_impact_level).map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{level}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Engagement Metrics */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Community Engagement</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{state.statistics.total_community_voices}</div>
                <div className="text-xs text-gray-600">Community Voices</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{state.statistics.total_engagement.views.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Total Views</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{state.statistics.total_engagement.shares.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Shares</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{state.statistics.total_engagement.responses.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Community Responses</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Population Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Population Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Add New Stories</h4>
            <p className="text-sm text-gray-600 mb-3">
              Add new UK Black queer community stories to the newsroom without removing existing content.
            </p>
            <button
              onClick={() => handlePopulateNewsroom(false)}
              disabled={state.is_populating}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {state.is_populating ? 'Adding Stories...' : 'Add New Stories'}
            </button>
          </div>

          <div className="p-4 border border-red-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Complete Repopulation</h4>
            <p className="text-sm text-gray-600 mb-3">
              Clear existing stories and repopulate with fresh content. Use with caution.
            </p>
            <button
              onClick={() => handlePopulateNewsroom(true)}
              disabled={state.is_populating}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {state.is_populating ? 'Repopulating...' : 'Complete Repopulation'}
            </button>
          </div>
        </div>
      </div>

      {/* Last Population Result */}
      {state.last_result && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Last Population Result</h3>
          <div className={`p-4 rounded-lg ${state.last_result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start justify-between mb-2">
              <span className={`text-sm font-medium ${state.last_result.success ? 'text-green-800' : 'text-red-800'}`}>
                {state.last_result.success ? '✅ Population Successful' : '❌ Population Failed'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            
            <div className={`text-sm ${state.last_result.success ? 'text-green-700' : 'text-red-700'}`}>
              <p><strong>Stories Added:</strong> {state.last_result.stories_added}</p>
              <p><strong>Categories:</strong> {state.last_result.categories_covered.join(', ')}</p>
              <p><strong>Locations:</strong> {state.last_result.locations_covered.join(', ')}</p>
              <p><strong>Community Voices:</strong> {state.last_result.total_community_voices}</p>
              <p><strong>Avg Validation Score:</strong> {state.last_result.avg_validation_score?.toFixed(1)}</p>
            </div>

            {state.last_result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-800">Errors:</p>
                <ul className="text-sm text-red-700">
                  {state.last_result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          📰 Newsroom population system for UK Black queer community storytelling • 
          Stories feature authentic community voices, organizing victories, and cultural celebrations
        </p>
      </div>
    </div>
  )
}

export default NewsroomPopulationDashboard