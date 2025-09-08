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
      {/* BLKOUTHUB Community Video */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">🌟 BLKOUTHUB - Community for Black Queer Men</h3>
        <div className="aspect-video mb-4">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/7fUP1Zbjvxw?si=DZpSyc-dgyVQAC8F"
            title="BLKOUTHUB Community Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
        <div className="text-gray-700 mb-4">
          <p className="mb-3">
            <strong>Join BLKOUTHUB</strong> - Our bespoke online community app designed specifically for Black queer men. 
            Connect with brothers across the UK, share experiences, find support, and build lasting friendships in a safe, affirming space.
          </p>
          <div className="flex flex-col gap-4">
            <a 
              href="https://blkouthub.com/invitation?code=BE862C"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              🎯 JOIN BLKOUTHUB NOW - EXCLUSIVE INVITATION
            </a>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-600 font-semibold">🔐 Exclusive Access Code:</span>
                <code className="bg-blue-100 px-2 py-1 rounded font-mono text-blue-800">BE862C</code>
              </div>
              <p className="text-sm text-blue-700">
                ✨ <strong>Limited invitation:</strong> Join our private community for Black queer men with this exclusive access code. 
                Safe spaces • Real connections • Black queer brotherhood
              </p>
            </div>
            <div className="flex justify-center">
              <a 
                href="https://blkouthub.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Learn more about BLKOUTHUB →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/10 to-pink-900/10 rounded-lg border border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">📧 Monthly Newsletter</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              Stay connected with our monthly newsletter featuring community updates, upcoming events, 
              liberation resources, and highlights from across the Black queer community.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ✨ We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Co-Curation Opportunity - Limited Time */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-900/10 to-teal-900/10 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            🎯 Co-Curate Our Website - Content Moderator Opportunity
          </h3>
          <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-sm font-semibold">
            Until Sept 20
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-4">
              <strong>Help shape our community platform!</strong> We're inviting community members to become content moderators 
              and co-curators, working directly with our team to ensure our website reflects authentic Black queer voices and values.
            </p>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>• Review and moderate community-submitted content</div>
              <div>• Co-curate featured stories and highlights</div>
              <div>• Ensure content aligns with our liberation values</div>
              <div>• Shape community guidelines and policies</div>
              <div>• Work collaboratively with the core team</div>
            </div>

            <div className="bg-white/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong className="text-green-700">Time commitment:</strong> 2-4 hours per week<br />
                <strong className="text-green-700">Duration:</strong> 3-month initial commitment<br />
                <strong className="text-green-700">Compensation:</strong> Volunteer role with recognition and future opportunities
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white/70 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Learn More About This Opportunity</h4>
              <div className="aspect-video mb-3">
                <iframe
                  src="https://docs.google.com/presentation/d/1cNtPoAN1boT8wNjkKPCO1n4jof2E-eTt4NTBxZNnOuk/embed?start=false&loop=false&delayms=3000"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg"
                  title="Content Moderator Opportunity Presentation"
                ></iframe>
              </div>
              <a 
                href="https://docs.google.com/presentation/d/1cNtPoAN1boT8wNjkKPCO1n4jof2E-eTt4NTBxZNnOuk/edit?usp=sharing"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                View Full Presentation
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <form 
              action="mailto:rob@blkoutuk.com" 
              method="post" 
              encType="text/plain"
              className="space-y-3"
            >
              <input type="hidden" name="subject" value="Content Moderator Application" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <textarea
                name="message"
                placeholder="Tell us why you're interested in becoming a content moderator and what experience you bring..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-colors text-sm"
              >
                Apply to Be a Content Moderator
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-2">
              ⏰ Applications close September 20th • Opens your email client
            </p>
          </div>
        </div>
      </div>

      {/* In Development Projects */}
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-900/10 to-orange-900/10 rounded-lg border border-amber-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          🚧 In Development - Expanding Our Platform
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Channel BLKOUT */}
          <div className="bg-white/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">📺</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Channel BLKOUT</h4>
            </div>
            
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              Our community-driven media platform amplifying Black queer voices through podcasts, video content, 
              and live streaming. Channel BLKOUT will feature community conversations, educational content, 
              cultural programming, and direct activism coverage - all created by and for our community.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Community-produced podcasts and video series
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Live streaming events and discussions
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Educational content and skill-sharing
              </div>
            </div>
            
            <div className="mt-4">
              <a 
                href="https://blkoutnxtchannel.carrd.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-sm"
              >
                Learn More About Channel BLKOUT
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* BLKOUT Storylab */}
          <div className="bg-white/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">✍️</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900">BLKOUT Storylab</h4>
            </div>
            
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              A creative writing and storytelling platform where Black queer writers can develop their craft, 
              share their stories, and connect with audiences. Storylab will feature workshops, mentorship programs, 
              publishing opportunities, and a digital magazine showcasing community narratives.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Creative writing workshops and mentorship
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Digital magazine and publishing platform
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Community story archives and oral history project
              </div>
            </div>
            
            <div className="mt-4">
              <a 
                href="https://blkoutnxtstory.carrd.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Learn More About BLKOUT Storylab
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Development Partners Expression of Interest */}
        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            🤝 Development Partners Wanted
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-4 text-sm">
                We're seeking development partners, content creators, technical specialists, and community organizations 
                to help bring Channel BLKOUT and BLKOUT Storylab to life. Whether you're interested in content creation, 
                technical development, funding partnerships, or community outreach - we'd love to hear from you.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>Content creators</strong> - podcasters, video producers, writers</div>
                <div>• <strong>Technical partners</strong> - developers, designers, platform specialists</div>
                <div>• <strong>Funding partners</strong> - grants, sponsorship, cooperative investment</div>
                <div>• <strong>Community partners</strong> - organizations, collectives, networks</div>
              </div>
            </div>
            
            <div>
              <form 
                action="mailto:rob@blkoutuk.com" 
                method="post" 
                encType="text/plain"
                className="space-y-4"
              >
                <input type="hidden" name="subject" value="Development Partnership Interest" />
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <select
                    name="interest"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Your Interest</option>
                    <option value="Channel BLKOUT - Content Creation">Channel BLKOUT - Content Creation</option>
                    <option value="Channel BLKOUT - Technical Development">Channel BLKOUT - Technical Development</option>
                    <option value="BLKOUT Storylab - Writing/Editorial">BLKOUT Storylab - Writing/Editorial</option>
                    <option value="BLKOUT Storylab - Platform Development">BLKOUT Storylab - Platform Development</option>
                    <option value="Both Projects - Funding Partner">Both Projects - Funding Partner</option>
                    <option value="Both Projects - Community Partner">Both Projects - Community Partner</option>
                    <option value="Other Partnership Opportunity">Other Partnership Opportunity</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your interest and how you'd like to contribute..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-colors text-sm"
                >
                  Express Interest in Partnership
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-2">
                ✨ This will open your email client with a pre-filled message to rob@blkoutuk.com
              </p>
            </div>
          </div>
        </div>
      </div>

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