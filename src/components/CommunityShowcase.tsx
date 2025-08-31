/**
 * Community Showcase Component
 * Displays community highlights generated from events calendar
 * Shows the breadth and depth of UK Black queer community activity
 */

import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import storyShowcaseService, { CommunityHighlight, ShowcaseMetrics } from '../services/storyShowcaseService'

interface CommunityShowcaseProps {
  maxHighlights?: number
  showMetrics?: boolean
  autoRefresh?: boolean
}

const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  maxHighlights = 5,
  showMetrics = true,
  autoRefresh = true
}) => {
  const [highlights, setHighlights] = useState<CommunityHighlight[]>([])
  const [metrics, setMetrics] = useState<ShowcaseMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadHighlights()
    if (autoRefresh) {
      const interval = setInterval(loadHighlights, 300000) // Refresh every 5 minutes
      return () => clearInterval(interval)
    }
  }, [maxHighlights, autoRefresh])

  const loadHighlights = async () => {
    try {
      setError(null)
      const [highlightsData, metricsData] = await Promise.all([
        storyShowcaseService.getFeaturedHighlights(maxHighlights),
        showMetrics ? storyShowcaseService.getShowcaseMetrics() : null
      ])
      
      setHighlights(highlightsData)
      if (metricsData) setMetrics(metricsData)
    } catch (err) {
      console.error('Error loading community highlights:', err)
      setError('Failed to load community highlights')
    } finally {
      setLoading(false)
    }
  }

  const generateNewHighlights = async () => {
    setIsGenerating(true)
    try {
      const result = await storyShowcaseService.generateCommunityHighlights({
        max_highlights: maxHighlights,
        prioritize_categories: ['Organizing', 'Community News', 'Health & Wellness', 'Culture & Arts']
      })
      
      setHighlights(result.highlights)
      setMetrics(result.metrics)
      setError(null)
    } catch (err) {
      console.error('Error generating highlights:', err)
      setError('Failed to generate new highlights')
    } finally {
      setIsGenerating(false)
    }
  }

  const getHighlightIcon = (type: string): string => {
    const icons = {
      achievement: '🏆',
      milestone: '🎯', 
      celebration: '🎉',
      impact: '💝',
      participation: '🤝'
    }
    return icons[type as keyof typeof icons] || '🌟'
  }

  const getHighlightColor = (type: string): string => {
    const colors = {
      achievement: 'border-l-yellow-500 bg-yellow-50',
      milestone: 'border-l-blue-500 bg-blue-50',
      celebration: 'border-l-purple-500 bg-purple-50',
      impact: 'border-l-green-500 bg-green-50',
      participation: 'border-l-indigo-500 bg-indigo-50'
    }
    return colors[type as keyof typeof colors] || 'border-l-gray-500 bg-gray-50'
  }

  if (loading && highlights.length === 0) {
    return (
      <div className="community-showcase p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community Highlights</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="community-showcase p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Highlights</h2>
          <p className="text-gray-600 mt-1">
            Celebrating the breadth and depth of Black queer community activity across the UK
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={loadHighlights}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          
          <button
            onClick={generateNewHighlights}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="text-red-600 mr-2">⚠️</div>
            <div className="text-red-700">
              <p className="font-medium">Unable to load highlights</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Overview */}
      {showMetrics && metrics && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {metrics.highlights_generated}
            </div>
            <div className="text-sm text-gray-600">Active Highlights</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.community_reach.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Community Members</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.geographic_coverage.length}
            </div>
            <div className="text-sm text-gray-600">UK Locations</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.engagement_stats.avg_engagement_score.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Impact Score</div>
          </div>
        </div>
      )}

      {/* Community Highlights */}
      <div className="space-y-6">
        {highlights.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">🌟</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No highlights yet</h3>
            <p className="text-gray-600 mb-4">
              Generate highlights from recent community events to showcase our collective activity
            </p>
            <button
              onClick={generateNewHighlights}
              disabled={isGenerating}
              className="px-6 py-3 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating Highlights...' : 'Generate Community Highlights'}
            </button>
          </div>
        ) : (
          highlights.map((highlight) => (
            <div
              key={highlight.id}
              className={`border-l-4 p-6 rounded-lg ${getHighlightColor(highlight.highlight_type)}`}
            >
              {/* Highlight Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label={highlight.highlight_type}>
                    {getHighlightIcon(highlight.highlight_type)}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{highlight.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>📍 {highlight.geographic_reach.join(', ')}</span>
                      <span>📊 {highlight.community_engagement_score}/5.0</span>
                      <span>📅 {format(parseISO(highlight.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    highlight.status === 'featured' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {highlight.status}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="prose prose-sm max-w-none mb-4">
                <div 
                  className="text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: highlight.story_text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              </div>

              {/* Impact Summary */}
              <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">💝 Community Impact</h4>
                <p className="text-sm text-gray-700">{highlight.impact_summary}</p>
              </div>

              {/* Participant Quotes */}
              {highlight.participant_quotes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">💬 Community Voices</h4>
                  <div className="space-y-2">
                    {highlight.participant_quotes.slice(0, 2).map((quote, index) => (
                      <blockquote key={index} className="text-sm italic text-gray-600 border-l-2 border-gray-300 pl-3">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags and Metadata */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-white bg-opacity-70 text-gray-600 rounded-md">
                  #{highlight.highlight_type}
                </span>
                {highlight.metadata?.event_category && (
                  <span className="px-2 py-1 bg-white bg-opacity-70 text-gray-600 rounded-md">
                    {highlight.metadata.event_category}
                  </span>
                )}
                {highlight.metadata?.impact_level && (
                  <span className="px-2 py-1 bg-white bg-opacity-70 text-gray-600 rounded-md">
                    {highlight.metadata.impact_level} impact
                  </span>
                )}
                {highlight.metadata?.participants_count && (
                  <span className="px-2 py-1 bg-white bg-opacity-70 text-gray-600 rounded-md">
                    {highlight.metadata.participants_count} participants
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Geographic Distribution */}
      {metrics && metrics.geographic_coverage.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">🗺️ UK Community Activity</h4>
          <div className="flex flex-wrap gap-2">
            {metrics.geographic_coverage.map((location) => (
              <span
                key={location}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full"
              >
                📍 {location}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          🌟 Community highlights automatically generated from events calendar • 
          <span className="font-medium"> Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')}</span>
        </p>
      </div>
    </div>
  )
}

export default CommunityShowcase