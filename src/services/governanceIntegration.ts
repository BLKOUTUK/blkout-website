// Governance Integration Service
// Connects community governance tools to story validation and curation process

import { newsroomService, type NewsArticle } from './newsroomService'
import { eventsCalendarIntegration } from './eventsCalendarIntegration'
import { supabase } from '../lib/supabase'

interface GovernanceDecision {
  id: string
  type: 'story_validation' | 'story_curation' | 'event_endorsement' | 'platform_policy'
  title: string
  description: string
  proposed_by: string
  status: 'proposed' | 'voting' | 'approved' | 'rejected' | 'implemented'
  votes_for: number
  votes_against: number
  votes_abstain: number
  created_at: string
  voting_ends_at?: string
  metadata?: {
    story_id?: string
    event_id?: string
    impact_level?: 'individual' | 'local' | 'national'
    community_tags?: string[]
  }
}

interface StoryValidationRequest {
  story_id: string
  submission_type: 'community' | 'ivor_conversation' | 'external'
  validation_criteria: {
    community_relevance: number // 1-5 score
    factual_accuracy: number
    cultural_sensitivity: number
    liberation_alignment: number
  }
  community_feedback: {
    user_id: string
    feedback_type: 'approve' | 'request_changes' | 'reject'
    comments?: string
    timestamp: string
  }[]
  moderator_notes?: string
  auto_validation_score?: number
}

interface CurationCriteria {
  featured_story_requirements: {
    min_community_votes: number
    min_validation_score: number
    required_tags: string[]
    geographic_diversity: boolean
  }
  editorial_standards: {
    liberation_focus: boolean
    community_centered: boolean
    accessible_language: boolean
    actionable_content: boolean
  }
  amplification_thresholds: {
    local_impact: number
    national_impact: number
    urgent_response: number
  }
}

class GovernanceIntegrationService {
  private readonly curationCriteria: CurationCriteria = {
    featured_story_requirements: {
      min_community_votes: 3,
      min_validation_score: 4.0,
      required_tags: ['BlackQueer', 'CommunityPower'],
      geographic_diversity: true
    },
    editorial_standards: {
      liberation_focus: true,
      community_centered: true,
      accessible_language: true,
      actionable_content: true
    },
    amplification_thresholds: {
      local_impact: 2,
      national_impact: 5,
      urgent_response: 10
    }
  }

  constructor() {
    console.log('🏛️ Governance Integration Service initialized')
  }

  // Submit story for community validation
  async submitStoryForValidation(
    storyId: string,
    submissionType: StoryValidationRequest['submission_type'],
    submittedBy: string
  ): Promise<GovernanceDecision | null> {
    try {
      // Get the story details
      const story = await newsroomService.getArticle(storyId)
      if (!story) {
        throw new Error('Story not found')
      }

      // Calculate auto-validation score
      const autoScore = await this.calculateAutoValidationScore(story)
      
      // Create governance decision for validation
      const validationDecision: Omit<GovernanceDecision, 'id'> = {
        type: 'story_validation',
        title: `Validate Community Story: "${story.title}"`,
        description: `Community validation requested for story submitted via ${submissionType}. Auto-validation score: ${autoScore}/5.0`,
        proposed_by: submittedBy,
        status: autoScore >= 4.0 ? 'approved' : 'voting',
        votes_for: autoScore >= 4.0 ? 1 : 0,
        votes_against: 0,
        votes_abstain: 0,
        created_at: new Date().toISOString(),
        voting_ends_at: autoScore < 4.0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        metadata: {
          story_id: storyId,
          impact_level: this.assessStoryImpact(story),
          community_tags: story.tags
        }
      }

      // Store in governance system
      const { data, error } = await supabase
        .from('governance_decisions')
        .insert(validationDecision)
        .select()
        .single()

      if (error) throw error

      console.log(`📝 Story validation submitted: ${story.title}`)
      return data

    } catch (error) {
      console.error('❌ Failed to submit story for validation:', error)
      return null
    }
  }

  // Community voting on story validation
  async voteOnStoryValidation(
    decisionId: string,
    userId: string,
    vote: 'for' | 'against' | 'abstain',
    comments?: string
  ): Promise<boolean> {
    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('governance_votes')
        .select('*')
        .eq('decision_id', decisionId)
        .eq('user_id', userId)
        .single()

      if (existingVote) {
        console.log('User has already voted on this decision')
        return false
      }

      // Record the vote
      const { error: voteError } = await supabase
        .from('governance_votes')
        .insert({
          decision_id: decisionId,
          user_id: userId,
          vote_type: vote,
          comments,
          created_at: new Date().toISOString()
        })

      if (voteError) throw voteError

      // Update vote counts
      const voteField = vote === 'for' ? 'votes_for' : vote === 'against' ? 'votes_against' : 'votes_abstain'
      
      const { error: updateError } = await supabase.rpc('increment_vote_count', {
        decision_id: decisionId,
        vote_field: voteField
      })

      if (updateError) throw updateError

      // Check if voting is complete
      await this.checkVotingCompletion(decisionId)

      console.log(`🗳️ Vote recorded for decision ${decisionId}: ${vote}`)
      return true

    } catch (error) {
      console.error('❌ Failed to record vote:', error)
      return false
    }
  }

  // Curate stories based on community validation and editorial standards
  async curateStoriesForFeaturing(): Promise<{
    featured_stories: NewsArticle[]
    curation_report: {
      total_reviewed: number
      featured_count: number
      criteria_met: string[]
      community_input: number
    }
  }> {
    try {
      // Get validated stories
      const { data: approvedDecisions, error } = await supabase
        .from('governance_decisions')
        .select('*, metadata')
        .eq('type', 'story_validation')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      const featuredStories: NewsArticle[] = []
      const curationStats = {
        total_reviewed: approvedDecisions?.length || 0,
        featured_count: 0,
        criteria_met: [] as string[],
        community_input: 0
      }

      if (!approvedDecisions || approvedDecisions.length === 0) {
        return {
          featured_stories: await this.getFallbackFeaturedStories(),
          curation_report: curationStats
        }
      }

      // Process each approved story
      for (const decision of approvedDecisions) {
        if (!decision.metadata?.story_id) continue

        const story = await newsroomService.getArticle(decision.metadata.story_id)
        if (!story) continue

        // Check curation criteria
        const meetsRequirements = await this.evaluateForFeaturing(story, decision)
        
        if (meetsRequirements.qualifies) {
          // Update story to featured
          await newsroomService.updateArticle(decision.metadata.story_id, {
            featured: true,
            priority: decision.metadata.impact_level === 'national' ? 'high' : 'medium'
          })

          featuredStories.push({
            ...story,
            featured: true
          })

          curationStats.featured_count++
          curationStats.criteria_met.push(...meetsRequirements.criteria_met)
        }

        curationStats.community_input += decision.votes_for + decision.votes_against + decision.votes_abstain
      }

      console.log(`📋 Story curation complete: ${curationStats.featured_count} featured from ${curationStats.total_reviewed}`)

      return {
        featured_stories: featuredStories,
        curation_report: curationStats
      }

    } catch (error) {
      console.error('❌ Story curation failed:', error)
      return {
        featured_stories: await this.getFallbackFeaturedStories(),
        curation_report: {
          total_reviewed: 0,
          featured_count: 0,
          criteria_met: [],
          community_input: 0
        }
      }
    }
  }

  // Get community governance dashboard data
  async getGovernanceDashboard(): Promise<{
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
  }> {
    try {
      // Get active decisions
      const { data: activeDecisions } = await supabase
        .from('governance_decisions')
        .select('*')
        .in('status', ['proposed', 'voting'])
        .order('created_at', { ascending: false })
        .limit(10)

      // Get validation queue
      const { data: validationQueue } = await supabase
        .from('governance_decisions')
        .select('id')
        .eq('type', 'story_validation')
        .eq('status', 'voting')

      // Get community participation stats
      const { data: recentVotes } = await supabase
        .from('governance_votes')
        .select('user_id, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      const uniqueVoters = new Set(recentVotes?.map(v => v.user_id) || []).size
      const totalVotes = recentVotes?.length || 0

      // Get curation stats
      const { data: validatedStories } = await supabase
        .from('governance_decisions')
        .select('status, created_at')
        .eq('type', 'story_validation')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      const approved = validatedStories?.filter(s => s.status === 'approved').length || 0
      const rejected = validatedStories?.filter(s => s.status === 'rejected').length || 0
      const total = validatedStories?.length || 0

      return {
        active_decisions: activeDecisions || [],
        validation_queue: validationQueue?.length || 0,
        community_participation: {
          total_voters: uniqueVoters,
          recent_activity: totalVotes,
          engagement_rate: total > 0 ? (totalVotes / total) * 100 : 0
        },
        curation_stats: {
          stories_validated: total,
          featured_this_week: approved,
          rejection_rate: total > 0 ? (rejected / total) * 100 : 0
        }
      }

    } catch (error) {
      console.error('❌ Failed to load governance dashboard:', error)
      return {
        active_decisions: [],
        validation_queue: 0,
        community_participation: {
          total_voters: 0,
          recent_activity: 0,
          engagement_rate: 0
        },
        curation_stats: {
          stories_validated: 0,
          featured_this_week: 0,
          rejection_rate: 0
        }
      }
    }
  }

  // Auto-validate stories based on AI scoring
  private async calculateAutoValidationScore(story: NewsArticle): Promise<number> {
    let score = 0

    // Community relevance (0-1.5 points)
    const communityKeywords = [
      'black', 'queer', 'qtipoc', 'lgbtq', 'trans', 'community',
      'organizing', 'liberation', 'mutual aid', 'solidarity'
    ]
    const content = `${story.title} ${story.excerpt}`.toLowerCase()
    const keywordMatches = communityKeywords.filter(keyword => content.includes(keyword)).length
    score += Math.min(keywordMatches * 0.15, 1.5)

    // Geographic relevance (0-1.0 points)
    const ukLocations = ['uk', 'britain', 'london', 'manchester', 'birmingham', 'glasgow', 'cardiff', 'bristol']
    const hasUkLocation = ukLocations.some(location => content.includes(location))
    if (hasUkLocation) score += 1.0

    // Source credibility (0-1.0 points)
    if (story.source === 'community-submission') score += 1.0
    else if (story.source === 'partner-organization') score += 0.8
    else if (story.source === 'ivor-conversation') score += 0.6

    // Content quality (0-1.5 points)
    if (story.content && story.content.length > 500) score += 0.5
    if (story.tags && story.tags.length >= 3) score += 0.5
    if (story.featured) score += 0.5

    return Math.min(Math.round(score * 10) / 10, 5.0)
  }

  // Assess story impact level
  private assessStoryImpact(story: NewsArticle): 'individual' | 'local' | 'national' {
    const content = `${story.title} ${story.excerpt} ${story.content}`.toLowerCase()
    
    if (content.includes('national') || content.includes('uk-wide') || content.includes('britain')) {
      return 'national'
    }
    
    if (content.includes('community') || content.includes('local') || content.includes('city')) {
      return 'local'
    }
    
    return 'individual'
  }

  // Check if voting is complete and update status
  private async checkVotingCompletion(decisionId: string): Promise<void> {
    try {
      const { data: decision } = await supabase
        .from('governance_decisions')
        .select('*')
        .eq('id', decisionId)
        .single()

      if (!decision || decision.status !== 'voting') return

      const totalVotes = decision.votes_for + decision.votes_against + decision.votes_abstain
      const votingEnded = decision.voting_ends_at && new Date() > new Date(decision.voting_ends_at)
      
      // Require minimum 3 votes or voting period ended
      if (totalVotes >= 3 || votingEnded) {
        const newStatus = decision.votes_for > decision.votes_against ? 'approved' : 'rejected'
        
        await supabase
          .from('governance_decisions')
          .update({ status: newStatus })
          .eq('id', decisionId)

        console.log(`✅ Voting completed for decision ${decisionId}: ${newStatus}`)
      }

    } catch (error) {
      console.error('❌ Failed to check voting completion:', error)
    }
  }

  // Evaluate story for featuring
  private async evaluateForFeaturing(
    story: NewsArticle, 
    decision: GovernanceDecision
  ): Promise<{ qualifies: boolean; criteria_met: string[] }> {
    const criteriaMet: string[] = []
    
    // Community votes check
    if (decision.votes_for >= this.curationCriteria.featured_story_requirements.min_community_votes) {
      criteriaMet.push('community_approval')
    }

    // Auto-validation score check
    const autoScore = await this.calculateAutoValidationScore(story)
    if (autoScore >= this.curationCriteria.featured_story_requirements.min_validation_score) {
      criteriaMet.push('validation_score')
    }

    // Required tags check
    const hasRequiredTags = this.curationCriteria.featured_story_requirements.required_tags
      .some(tag => story.tags.includes(tag))
    if (hasRequiredTags) {
      criteriaMet.push('required_tags')
    }

    // Editorial standards check
    if (this.meetsEditorialStandards(story)) {
      criteriaMet.push('editorial_standards')
    }

    return {
      qualifies: criteriaMet.length >= 3, // Must meet at least 3 criteria
      criteria_met: criteriaMet
    }
  }

  // Check editorial standards
  private meetsEditorialStandards(story: NewsArticle): boolean {
    const content = `${story.title} ${story.excerpt}`.toLowerCase()
    
    // Liberation focus check
    const liberationKeywords = ['liberation', 'freedom', 'justice', 'organizing', 'community power']
    const hasLiberationFocus = liberationKeywords.some(keyword => content.includes(keyword))

    // Community-centered check
    const communityKeywords = ['community', 'collective', 'mutual aid', 'solidarity', 'grassroots']
    const isCommunityCenter = communityKeywords.some(keyword => content.includes(keyword))

    // Accessible language check (basic readability)
    const averageWordLength = content.split(' ').reduce((acc, word) => acc + word.length, 0) / content.split(' ').length
    const isAccessible = averageWordLength <= 6

    return hasLiberationFocus && isCommunityCenter && isAccessible
  }

  // Fallback featured stories when governance system is unavailable
  private async getFallbackFeaturedStories(): Promise<NewsArticle[]> {
    const { articles } = await newsroomService.getArticles({ 
      featured: true, 
      limit: 5,
      status: 'published' 
    })
    
    return articles || []
  }
}

export const governanceIntegration = new GovernanceIntegrationService()
export type { GovernanceDecision, StoryValidationRequest, CurationCriteria }