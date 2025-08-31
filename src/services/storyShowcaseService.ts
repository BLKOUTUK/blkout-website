/**
 * Story Showcase Service
 * Transforms events calendar data into community highlights and success stories
 * Connects events system with storytelling pipeline for community celebration
 */

import { supabase } from '../utils/supabaseClient'
import { format, parseISO, startOfWeek, endOfWeek, subDays } from 'date-fns'

// Types
export interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizer: string
  category: string
  status: 'upcoming' | 'ongoing' | 'completed'
  impact_level: 'local' | 'regional' | 'national'
  participants_count?: number
  metadata?: Record<string, any>
}

export interface CommunityHighlight {
  id: string
  event_id: string
  highlight_type: 'achievement' | 'milestone' | 'participation' | 'impact' | 'celebration'
  title: string
  description: string
  story_text: string
  impact_summary: string
  participant_quotes: string[]
  media_urls: string[]
  geographic_reach: string[]
  community_engagement_score: number
  created_at: string
  featured_until?: string
  status: 'draft' | 'featured' | 'archived'
  metadata: Record<string, any>
}

export interface ShowcaseMetrics {
  total_events_analyzed: number
  highlights_generated: number
  community_reach: number
  geographic_coverage: string[]
  engagement_stats: {
    total_participants: number
    avg_engagement_score: number
    category_distribution: Record<string, number>
    impact_distribution: Record<string, number>
  }
  generated_at: string
}

class StoryShowcaseService {
  
  /**
   * Generate community highlights from recent events
   */
  async generateCommunityHighlights(options: {
    timeframe_days?: number
    max_highlights?: number
    min_engagement_score?: number
    prioritize_categories?: string[]
  } = {}): Promise<{
    highlights: CommunityHighlight[]
    metrics: ShowcaseMetrics
  }> {
    const {
      timeframe_days = 14,
      max_highlights = 10,
      min_engagement_score = 3.0,
      prioritize_categories = ['Organizing', 'Community News', 'Culture & Arts', 'Health & Wellness']
    } = options

    console.log('🎯 Generating community highlights from events...')

    try {
      // Fetch recent events from events calendar
      const cutoffDate = subDays(new Date(), timeframe_days)
      const eventsData = await this.fetchRecentEvents(cutoffDate)
      
      const highlights: CommunityHighlight[] = []
      const processedEvents: string[] = []
      let totalParticipants = 0
      const categoryStats: Record<string, number> = {}
      const impactStats: Record<string, number> = {}
      const geographicReach = new Set<string>()

      for (const event of eventsData) {
        // Skip if already processed
        if (processedEvents.includes(event.id)) continue

        // Analyze event for highlight potential
        const highlightPotential = await this.analyzeEventForHighlight(event, min_engagement_score)
        
        if (highlightPotential.shouldHighlight) {
          const highlight = await this.createHighlightFromEvent(event, highlightPotential)
          highlights.push(highlight)
          processedEvents.push(event.id)

          // Update metrics
          totalParticipants += event.participants_count || 0
          categoryStats[event.category] = (categoryStats[event.category] || 0) + 1
          impactStats[event.impact_level] = (impactStats[event.impact_level] || 0) + 1
          if (event.location) geographicReach.add(event.location)
        }

        if (highlights.length >= max_highlights) break
      }

      // Sort highlights by engagement score and category priority
      highlights.sort((a, b) => {
        const aPriority = prioritize_categories.includes(a.metadata.category) ? 10 : 0
        const bPriority = prioritize_categories.includes(b.metadata.category) ? 10 : 0
        return (b.community_engagement_score + bPriority) - (a.community_engagement_score + aPriority)
      })

      // Save highlights to database
      await this.saveHighlightsToDatabase(highlights.slice(0, max_highlights))

      const metrics: ShowcaseMetrics = {
        total_events_analyzed: eventsData.length,
        highlights_generated: highlights.length,
        community_reach: totalParticipants,
        geographic_coverage: Array.from(geographicReach),
        engagement_stats: {
          total_participants: totalParticipants,
          avg_engagement_score: highlights.reduce((sum, h) => sum + h.community_engagement_score, 0) / highlights.length || 0,
          category_distribution: categoryStats,
          impact_distribution: impactStats
        },
        generated_at: new Date().toISOString()
      }

      console.log(`✅ Generated ${highlights.length} community highlights from ${eventsData.length} events`)
      return { highlights: highlights.slice(0, max_highlights), metrics }

    } catch (error) {
      console.error('❌ Error generating community highlights:', error)
      throw error
    }
  }

  /**
   * Fetch recent events from the events calendar
   */
  private async fetchRecentEvents(cutoffDate: Date): Promise<CommunityEvent[]> {
    // This would integrate with your actual events calendar system
    // For now, returning sample data structure
    const sampleEvents: CommunityEvent[] = [
      {
        id: 'event-housing-victory',
        title: 'Community Housing Victory Celebration',
        description: 'Celebrating the approval of our community housing cooperative application in Manchester',
        date: new Date().toISOString(),
        location: 'Manchester',
        organizer: 'Manchester Black Queer Housing Collective',
        category: 'Organizing',
        status: 'completed',
        impact_level: 'local',
        participants_count: 45,
        metadata: {
          achievement_type: 'housing_success',
          campaign_duration: '8 months',
          media_coverage: 'local_news',
          follow_up_planned: true
        }
      },
      {
        id: 'event-pride-planning',
        title: 'Black Pride Birmingham 2025 Planning Meeting',
        description: 'Community planning session for Birmingham Black Pride celebration',
        date: new Date().toISOString(),
        location: 'Birmingham',
        organizer: 'Birmingham Black Pride Collective',
        category: 'Culture & Arts',
        status: 'completed',
        impact_level: 'regional',
        participants_count: 32,
        metadata: {
          event_planning: true,
          volunteer_recruitment: 'successful',
          program_themes: ['joy', 'resistance', 'community']
        }
      },
      {
        id: 'event-healthcare-campaign',
        title: 'NHS Trans Healthcare Organizing Victory',
        description: 'Campaign success: Local clinic extends hours and improves trans healthcare access',
        date: new Date().toISOString(),
        location: 'Leeds',
        organizer: 'Yorkshire Trans Healthcare Coalition',
        category: 'Health & Wellness',
        status: 'completed',
        impact_level: 'regional',
        participants_count: 23,
        metadata: {
          campaign_victory: true,
          healthcare_improvement: 'extended_hours',
          policy_change: 'staff_training',
          impact_measure: 'accessibility_improved'
        }
      }
    ]

    return sampleEvents.filter(event => new Date(event.date) >= cutoffDate)
  }

  /**
   * Analyze event for highlight potential
   */
  private async analyzeEventForHighlight(event: CommunityEvent, minScore: number): Promise<{
    shouldHighlight: boolean
    highlight_type: CommunityHighlight['highlight_type']
    engagement_score: number
    reasoning: string
    story_angle: string
  }> {
    let score = 0
    let highlight_type: CommunityHighlight['highlight_type'] = 'participation'
    let story_angle = ''

    // Score based on impact level
    switch (event.impact_level) {
      case 'national': score += 3; break
      case 'regional': score += 2; break
      case 'local': score += 1; break
    }

    // Score based on category priority
    const priorityCategories = ['Organizing', 'Community News', 'Health & Wellness']
    if (priorityCategories.includes(event.category)) {
      score += 2
    }

    // Score based on participation
    if (event.participants_count) {
      if (event.participants_count > 50) score += 2
      else if (event.participants_count > 20) score += 1
    }

    // Determine highlight type and story angle based on metadata
    if (event.metadata?.achievement_type || event.metadata?.campaign_victory) {
      highlight_type = 'achievement'
      story_angle = 'Community organizing victory creates lasting change'
      score += 2
    } else if (event.metadata?.event_planning) {
      highlight_type = 'milestone'
      story_angle = 'Community comes together to plan celebration of joy and resistance'
      score += 1
    } else if (event.category === 'Culture & Arts') {
      highlight_type = 'celebration'
      story_angle = 'Cultural celebration strengthens community bonds'
      score += 1
    } else if (event.category === 'Health & Wellness') {
      highlight_type = 'impact'
      story_angle = 'Community organizing improves health access for all'
      score += 1.5
    }

    const reasoning = `Event scored ${score} points. Impact: ${event.impact_level}, Category: ${event.category}, Participants: ${event.participants_count || 0}`

    return {
      shouldHighlight: score >= minScore,
      highlight_type,
      engagement_score: score,
      reasoning,
      story_angle
    }
  }

  /**
   * Create community highlight from event
   */
  private async createHighlightFromEvent(
    event: CommunityEvent,
    potential: Awaited<ReturnType<typeof this.analyzeEventForHighlight>>
  ): Promise<CommunityHighlight> {
    
    // Generate story text based on event and highlight type
    const storyText = this.generateStoryText(event, potential)
    
    // Generate impact summary
    const impactSummary = this.generateImpactSummary(event)
    
    // Generate participant quotes (would be real quotes in production)
    const participantQuotes = this.generateParticipantQuotes(event, potential.highlight_type)

    const highlight: CommunityHighlight = {
      id: `highlight-${event.id}-${Date.now()}`,
      event_id: event.id,
      highlight_type: potential.highlight_type,
      title: this.generateHighlightTitle(event, potential.highlight_type),
      description: event.description,
      story_text: storyText,
      impact_summary: impactSummary,
      participant_quotes: participantQuotes,
      media_urls: [], // Would be populated with actual media
      geographic_reach: [event.location],
      community_engagement_score: potential.engagement_score,
      created_at: new Date().toISOString(),
      status: 'featured',
      featured_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      metadata: {
        event_category: event.category,
        story_angle: potential.story_angle,
        auto_generated: true,
        processing_timestamp: new Date().toISOString(),
        ...event.metadata
      }
    }

    return highlight
  }

  /**
   * Generate compelling story text
   */
  private generateStoryText(event: CommunityEvent, potential: any): string {
    const templates = {
      achievement: `🏆 **Community Victory**: ${event.title}\n\n${event.description}\n\nAfter persistent community organizing, this ${event.impact_level} campaign has achieved real change that will benefit Black queer communities across ${event.location}. With ${event.participants_count || 'community members'} involved, this victory shows the power of collective action.\n\n💪 **What This Means**: Real change happens when we organize together. This success creates a template for similar campaigns across the UK.`,
      
      milestone: `🎯 **Community Milestone**: ${event.title}\n\n${event.description}\n\nThis important community gathering brought together ${event.participants_count || 'members'} from across ${event.location} to plan and organize for our collective liberation. These planning moments are where community power is built.\n\n🌟 **Building Together**: Every planning meeting, every conversation, every moment we spend building community is an act of resistance and love.`,
      
      celebration: `🎉 **Community Celebration**: ${event.title}\n\n${event.description}\n\nJoy is resistance! ${event.participants_count || 'Community members'} came together in ${event.location} to celebrate our culture, our resilience, and our shared commitment to liberation.\n\n✨ **Why This Matters**: Cultural celebrations aren't just fun - they're how we maintain our connections, pass down our wisdom, and fuel the organizing that creates change.`,
      
      impact: `💝 **Community Impact**: ${event.title}\n\n${event.description}\n\nThis ${event.category.toLowerCase()} initiative demonstrates how community organizing creates lasting change. With ${event.participants_count || 'participants'} involved in ${event.location}, real improvements are happening.\n\n🎯 **Ripple Effects**: When we organize for our communities, the benefits extend far beyond the immediate win - we're building the infrastructure for liberation.`,
      
      participation: `🤝 **Community Action**: ${event.title}\n\n${event.description}\n\nCommunity members in ${event.location} are taking action to build the world we need. With ${event.participants_count || 'people'} participating, this ${event.category.toLowerCase()} work shows our collective commitment to change.\n\n💪 **Every Action Counts**: Each time we show up for our communities, we're contributing to a larger movement for Black queer liberation across the UK.`
    }

    return templates[potential.highlight_type] || templates.participation
  }

  /**
   * Generate impact summary
   */
  private generateImpactSummary(event: CommunityEvent): string {
    const impactPhrases = {
      local: `Direct impact on Black queer communities in ${event.location}`,
      regional: `Regional influence across multiple communities in ${event.location} area`,
      national: `National significance for Black queer liberation organizing`
    }

    const categoryImpacts = {
      'Organizing': 'Building community power and collective action capacity',
      'Community News': 'Sharing stories that connect and inspire our communities',
      'Culture & Arts': 'Celebrating our culture and creating spaces for joy and connection',
      'Health & Wellness': 'Improving health access and wellbeing for our communities'
    }

    return `${impactPhrases[event.impact_level]}. ${categoryImpacts[event.category] || 'Contributing to community resilience and liberation organizing.'} ${event.participants_count ? `Directly involved ${event.participants_count} community members.` : ''}`
  }

  /**
   * Generate participant quotes
   */
  private generateParticipantQuotes(event: CommunityEvent, highlightType: string): string[] {
    // In production, these would be real quotes from participants
    const quoteTemplates = {
      achievement: [
        "This victory shows what's possible when we organize together for our communities.",
        "After months of hard work, seeing real change happen feels incredible.",
        "This is just the beginning - we're building power for bigger changes to come."
      ],
      milestone: [
        "These planning moments are where community power is built.",
        "Coming together like this reminds me why organizing work matters so much.",
        "Every voice in the room makes our work stronger and more connected to community needs."
      ],
      celebration: [
        "Joy is resistance. Celebrating our culture feeds the organizing work.",
        "These moments of connection keep us going through the hard times.",
        "Community celebration is how we remember what we're fighting for."
      ],
      impact: [
        "Seeing real improvements in our community makes all the organizing worth it.",
        "This change will benefit so many people beyond just those of us here today.",
        "Community organizing creates the changes we need to see in the world."
      ],
      participation: [
        "Every time we show up for our communities, we're building something bigger.",
        "This work connects me to the broader movement for liberation.",
        "Small actions add up to big changes when we do them together."
      ]
    }

    return quoteTemplates[highlightType] || quoteTemplates.participation
  }

  /**
   * Generate highlight title
   */
  private generateHighlightTitle(event: CommunityEvent, highlightType: string): string {
    const location = event.location ? ` in ${event.location}` : ''
    
    switch (highlightType) {
      case 'achievement': return `🏆 Community Victory: ${event.title.replace('Celebration', '').trim()}`
      case 'milestone': return `🎯 Planning Power: ${event.title}`
      case 'celebration': return `🎉 Community Joy: ${event.title}`
      case 'impact': return `💝 Real Change: ${event.title}`
      case 'participation': return `🤝 Community Action: ${event.title}`
      default: return event.title
    }
  }

  /**
   * Save highlights to database
   */
  private async saveHighlightsToDatabase(highlights: CommunityHighlight[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('community_highlights')
        .upsert(highlights, { onConflict: 'id' })

      if (error) {
        console.error('Database error saving highlights:', error)
        throw error
      }

      console.log(`💾 Saved ${highlights.length} community highlights to database`)
    } catch (error) {
      console.error('Error saving highlights to database:', error)
      throw error
    }
  }

  /**
   * Get featured community highlights
   */
  async getFeaturedHighlights(limit: number = 5): Promise<CommunityHighlight[]> {
    try {
      const { data: highlights, error } = await supabase
        .from('community_highlights')
        .select('*')
        .eq('status', 'featured')
        .gte('featured_until', new Date().toISOString())
        .order('community_engagement_score', { ascending: false })
        .limit(limit)

      if (error) throw error

      return highlights || []
    } catch (error) {
      console.error('Error fetching featured highlights:', error)
      return []
    }
  }

  /**
   * Get showcase metrics
   */
  async getShowcaseMetrics(days: number = 30): Promise<ShowcaseMetrics> {
    const cutoffDate = subDays(new Date(), days)
    
    try {
      const { data: highlights, error } = await supabase
        .from('community_highlights')
        .select('*')
        .gte('created_at', cutoffDate.toISOString())

      if (error) throw error

      const totalHighlights = highlights?.length || 0
      const geographicReach = new Set(highlights?.flatMap(h => h.geographic_reach) || [])
      const categoryStats: Record<string, number> = {}
      const impactStats: Record<string, number> = {}
      let totalParticipants = 0
      let totalEngagement = 0

      highlights?.forEach(highlight => {
        const category = highlight.metadata?.event_category || 'Unknown'
        categoryStats[category] = (categoryStats[category] || 0) + 1
        
        // Extract impact level from metadata
        const impactLevel = highlight.metadata?.impact_level || 'local'
        impactStats[impactLevel] = (impactStats[impactLevel] || 0) + 1
        
        totalEngagement += highlight.community_engagement_score || 0
        totalParticipants += highlight.metadata?.participants_count || 0
      })

      return {
        total_events_analyzed: totalHighlights,
        highlights_generated: totalHighlights,
        community_reach: totalParticipants,
        geographic_coverage: Array.from(geographicReach),
        engagement_stats: {
          total_participants: totalParticipants,
          avg_engagement_score: totalHighlights > 0 ? totalEngagement / totalHighlights : 0,
          category_distribution: categoryStats,
          impact_distribution: impactStats
        },
        generated_at: new Date().toISOString()
      }

    } catch (error) {
      console.error('Error calculating showcase metrics:', error)
      throw error
    }
  }

  /**
   * Archive old highlights
   */
  async archiveExpiredHighlights(): Promise<number> {
    try {
      const { data: expired, error } = await supabase
        .from('community_highlights')
        .update({ status: 'archived' })
        .eq('status', 'featured')
        .lt('featured_until', new Date().toISOString())
        .select()

      if (error) throw error

      const archivedCount = expired?.length || 0
      console.log(`📦 Archived ${archivedCount} expired highlights`)
      return archivedCount

    } catch (error) {
      console.error('Error archiving expired highlights:', error)
      throw error
    }
  }
}

export default new StoryShowcaseService()