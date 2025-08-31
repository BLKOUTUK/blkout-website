// Curated Stories Service
// Community governance → Featured stories implementation

import { governanceIntegration, type GovernanceDecision } from './governanceIntegration'
import { newsroomService, type NewsArticle } from './newsroomService'
import { storyCaptureService } from './storyCaptureService'
import { supabase } from '../lib/supabase'

interface CurationRule {
  id: string
  name: string
  description: string
  criteria: {
    min_community_votes?: number
    min_validation_score?: number
    required_impact_level?: 'individual' | 'local' | 'national'
    required_categories?: string[]
    geographic_diversity?: boolean
    recency_weight?: number // 0-1, how much to weight recent stories
  }
  priority: number // Higher numbers = higher priority
  active: boolean
  created_by: string
  created_at: string
}

interface CurationResult {
  story_id: string
  article: NewsArticle
  curation_score: number
  applied_rules: string[]
  featured_reason: string
  community_votes: number
  validation_score: number
  geographic_location?: string
  impact_level: 'individual' | 'local' | 'national'
  curation_timestamp: string
}

interface CurationSession {
  id: string
  session_name: string
  started_at: string
  completed_at?: string
  status: 'running' | 'completed' | 'failed'
  stories_reviewed: number
  stories_featured: number
  applied_rules: string[]
  success_rate: number
  metadata: {
    geographic_distribution: Record<string, number>
    category_distribution: Record<string, number>
    impact_distribution: Record<string, number>
  }
}

interface CurationMetrics {
  total_sessions_run: number
  total_stories_curated: number
  avg_curation_score: number
  geographic_diversity_score: number
  community_satisfaction_rate: number
  featured_retention_rate: number // How long stories stay featured
}

class CuratedStoriesService {
  private defaultCurationRules: Omit<CurationRule, 'id' | 'created_at'>[] = [
    {
      name: 'Community Consensus Priority',
      description: 'Stories with strong community validation get priority featuring',
      criteria: {
        min_community_votes: 5,
        min_validation_score: 4.0
      },
      priority: 10,
      active: true,
      created_by: 'system'
    },
    {
      name: 'National Impact Stories',
      description: 'Stories with national significance get automatic featuring',
      criteria: {
        required_impact_level: 'national',
        min_validation_score: 3.5
      },
      priority: 9,
      active: true,
      created_by: 'system'
    },
    {
      name: 'Organizing Wins Priority',
      description: 'Community organizing victories get priority placement',
      criteria: {
        required_categories: ['Organizing', 'Community News'],
        min_community_votes: 3,
        min_validation_score: 3.8
      },
      priority: 8,
      active: true,
      created_by: 'system'
    },
    {
      name: 'Geographic Diversity',
      description: 'Ensure featured stories represent different UK regions',
      criteria: {
        geographic_diversity: true,
        min_validation_score: 3.5
      },
      priority: 7,
      active: true,
      created_by: 'system'
    },
    {
      name: 'Recent Community Wins',
      description: 'Recent community achievements get boosted visibility',
      criteria: {
        required_categories: ['Community News'],
        recency_weight: 0.8,
        min_validation_score: 3.7
      },
      priority: 6,
      active: true,
      created_by: 'system'
    }
  ]

  constructor() {
    console.log('🎯 Curated Stories Service initialized')
    this.ensureDefaultRules()
  }

  // Run comprehensive story curation session
  async runCurationSession(options: {
    session_name?: string
    max_featured_stories?: number
    force_geographic_diversity?: boolean
    custom_rules?: string[]
  } = {}): Promise<CurationSession> {
    const sessionId = `curation-${Date.now()}`
    const sessionName = options.session_name || `Automated Curation ${new Date().toISOString()}`
    const maxFeatured = options.max_featured_stories || 8
    
    console.log(`🎯 Starting curation session: ${sessionName}`)

    const session: Omit<CurationSession, 'id'> = {
      session_name: sessionName,
      started_at: new Date().toISOString(),
      status: 'running',
      stories_reviewed: 0,
      stories_featured: 0,
      applied_rules: [],
      success_rate: 0,
      metadata: {
        geographic_distribution: {},
        category_distribution: {},
        impact_distribution: {}
      }
    }

    try {
      // Get approved stories from governance system
      const governanceCuration = await governanceIntegration.curateStoriesForFeaturing()
      const approvedStories = governanceCuration.featured_stories

      if (approvedStories.length === 0) {
        console.log('⚠️ No approved stories found for curation')
        return this.completeCurationSession(sessionId, session, [], 'No stories available')
      }

      // Get active curation rules
      const activeRules = await this.getActiveCurationRules()
      
      // Evaluate each story against curation rules
      const evaluatedStories: CurationResult[] = []
      
      for (const story of approvedStories) {
        const evaluation = await this.evaluateStoryForCuration(story, activeRules)
        if (evaluation) {
          evaluatedStories.push(evaluation)
        }
        session.stories_reviewed++
      }

      // Sort by curation score and apply diversity constraints
      let curatedStories = evaluatedStories.sort((a, b) => b.curation_score - a.curation_score)

      // Apply geographic diversity if required
      if (options.force_geographic_diversity) {
        curatedStories = this.applyGeographicDiversity(curatedStories, maxFeatured)
      }

      // Select top stories up to maxFeatured limit
      const featuredStories = curatedStories.slice(0, maxFeatured)

      // Apply featured status to selected stories
      for (const story of featuredStories) {
        await newsroomService.updateArticle(story.story_id, {
          featured: true,
          priority: story.impact_level === 'national' ? 'high' : 'medium'
        })
        
        // Update session metadata
        const location = story.geographic_location || 'Unknown'
        const category = story.article.category
        const impact = story.impact_level
        
        session.metadata.geographic_distribution[location] = (session.metadata.geographic_distribution[location] || 0) + 1
        session.metadata.category_distribution[category] = (session.metadata.category_distribution[category] || 0) + 1
        session.metadata.impact_distribution[impact] = (session.metadata.impact_distribution[impact] || 0) + 1
        
        session.stories_featured++
      }

      // Store curation results
      await this.storeCurationResults(sessionId, featuredStories)

      session.applied_rules = [...new Set(featuredStories.flatMap(s => s.applied_rules))]
      session.success_rate = session.stories_reviewed > 0 ? (session.stories_featured / session.stories_reviewed) * 100 : 0

      console.log(`✅ Curation session complete: ${session.stories_featured} stories featured from ${session.stories_reviewed} reviewed`)

      return this.completeCurationSession(sessionId, session, featuredStories, 'Success')

    } catch (error) {
      console.error('❌ Curation session failed:', error)
      session.status = 'failed'
      return this.completeCurationSession(sessionId, session, [], `Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Evaluate individual story against curation rules
  private async evaluateStoryForCuration(
    article: NewsArticle, 
    rules: CurationRule[]
  ): Promise<CurationResult | null> {
    try {
      let curationScore = 0
      const appliedRules: string[] = []
      let featuredReason = 'Community curation'

      // Get community validation data
      const governanceDashboard = await governanceIntegration.getGovernanceDashboard()
      const storyDecision = governanceDashboard.active_decisions.find(
        d => d.metadata?.story_id === article.id
      )

      const communityVotes = storyDecision ? 
        storyDecision.votes_for + storyDecision.votes_against + storyDecision.votes_abstain : 0
      
      // Calculate base validation score
      const validationScore = await this.calculateStoryValidationScore(article)

      // Extract geographic location and impact level
      const geographicLocation = this.extractGeographicLocation(article)
      const impactLevel = this.assessStoryImpactLevel(article)

      // Apply each rule
      for (const rule of rules.filter(r => r.active).sort((a, b) => b.priority - a.priority)) {
        const ruleScore = await this.applyRule(rule, {
          article,
          communityVotes,
          validationScore,
          geographicLocation,
          impactLevel
        })

        if (ruleScore > 0) {
          curationScore += ruleScore * (rule.priority / 10)
          appliedRules.push(rule.name)
          
          if (rule.priority >= 9) {
            featuredReason = rule.description
          }
        }
      }

      // Minimum threshold check
      if (curationScore < 5.0) {
        return null
      }

      return {
        story_id: article.id,
        article,
        curation_score: Math.round(curationScore * 10) / 10,
        applied_rules: appliedRules,
        featured_reason: featuredReason,
        community_votes: communityVotes,
        validation_score: validationScore,
        geographic_location: geographicLocation,
        impact_level: impactLevel,
        curation_timestamp: new Date().toISOString()
      }

    } catch (error) {
      console.error(`❌ Failed to evaluate story ${article.id}:`, error)
      return null
    }
  }

  // Apply individual curation rule
  private async applyRule(rule: CurationRule, context: {
    article: NewsArticle
    communityVotes: number
    validationScore: number
    geographicLocation?: string
    impactLevel: 'individual' | 'local' | 'national'
  }): Promise<number> {
    let score = 0
    const { criteria } = rule
    const { article, communityVotes, validationScore, geographicLocation, impactLevel } = context

    // Community votes check
    if (criteria.min_community_votes && communityVotes >= criteria.min_community_votes) {
      score += 2.0
    }

    // Validation score check
    if (criteria.min_validation_score && validationScore >= criteria.min_validation_score) {
      score += 1.5
    }

    // Impact level check
    if (criteria.required_impact_level && impactLevel === criteria.required_impact_level) {
      score += criteria.required_impact_level === 'national' ? 3.0 : 
              criteria.required_impact_level === 'local' ? 2.0 : 1.0
    }

    // Category check
    if (criteria.required_categories && criteria.required_categories.includes(article.category)) {
      score += 1.5
    }

    // Geographic diversity (bonus for underrepresented regions)
    if (criteria.geographic_diversity && geographicLocation) {
      const diversityBonus = await this.calculateGeographicDiversityBonus(geographicLocation)
      score += diversityBonus
    }

    // Recency weight
    if (criteria.recency_weight && article.publishedAt) {
      const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
      const recencyScore = Math.max(0, (7 - daysSincePublished) / 7) * criteria.recency_weight * 1.0
      score += recencyScore
    }

    return score
  }

  // Apply geographic diversity constraints
  private applyGeographicDiversity(stories: CurationResult[], maxStories: number): CurationResult[] {
    const diverseStories: CurationResult[] = []
    const locationCounts: Record<string, number> = {}
    const maxPerLocation = Math.max(1, Math.floor(maxStories / 4)) // Max 25% from any region

    for (const story of stories) {
      const location = story.geographic_location || 'Unknown'
      const currentCount = locationCounts[location] || 0

      if (currentCount < maxPerLocation || diverseStories.length < maxStories) {
        diverseStories.push(story)
        locationCounts[location] = currentCount + 1
        
        if (diverseStories.length >= maxStories) break
      }
    }

    return diverseStories
  }

  // Calculate story validation score
  private async calculateStoryValidationScore(article: NewsArticle): Promise<number> {
    let score = 3.0 // Base score

    // Content quality indicators
    if (article.content && article.content.length > 500) score += 0.5
    if (article.tags.length >= 3) score += 0.3
    if (article.excerpt && article.excerpt.length > 50) score += 0.2

    // Community keywords
    const content = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase()
    const communityKeywords = [
      'community', 'organizing', 'liberation', 'mutual aid', 'collective',
      'black', 'queer', 'qtipoc', 'trans', 'solidarity'
    ]
    const keywordMatches = communityKeywords.filter(keyword => content.includes(keyword)).length
    score += Math.min(keywordMatches * 0.1, 1.0)

    // UK relevance
    const ukKeywords = ['uk', 'britain', 'london', 'manchester', 'birmingham', 'glasgow']
    if (ukKeywords.some(keyword => content.includes(keyword))) {
      score += 0.5
    }

    return Math.min(Math.round(score * 10) / 10, 5.0)
  }

  // Extract geographic location from article
  private extractGeographicLocation(article: NewsArticle): string | undefined {
    const content = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase()
    const ukLocations = [
      'london', 'manchester', 'birmingham', 'glasgow', 'cardiff', 'bristol',
      'leeds', 'sheffield', 'liverpool', 'newcastle', 'brighton', 'nottingham'
    ]
    
    return ukLocations.find(location => content.includes(location))
  }

  // Assess story impact level
  private assessStoryImpactLevel(article: NewsArticle): 'individual' | 'local' | 'national' {
    const content = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase()
    
    if (content.includes('national') || content.includes('uk-wide') || content.includes('britain')) {
      return 'national'
    }
    
    if (content.includes('community') || content.includes('local') || content.includes('campaign')) {
      return 'local'
    }
    
    return 'individual'
  }

  // Calculate geographic diversity bonus
  private async calculateGeographicDiversityBonus(location: string): Promise<number> {
    // Get recent featured stories to check geographic distribution
    try {
      const recentStories = await newsroomService.getArticles({
        featured: true,
        limit: 20,
        status: 'published'
      })

      const locationCounts: Record<string, number> = {}
      let total = 0

      for (const story of recentStories.articles) {
        const storyLocation = this.extractGeographicLocation(story) || 'Unknown'
        locationCounts[storyLocation] = (locationCounts[storyLocation] || 0) + 1
        total++
      }

      if (total === 0) return 1.0 // Full bonus for first story

      const locationCount = locationCounts[location] || 0
      const locationPercentage = locationCount / total

      // Give bonus for underrepresented locations
      if (locationPercentage < 0.1) return 1.0      // Very underrepresented
      if (locationPercentage < 0.2) return 0.5      // Underrepresented  
      if (locationPercentage < 0.3) return 0.2      // Slightly underrepresented
      return 0                                      // Well represented

    } catch (error) {
      console.error('Failed to calculate diversity bonus:', error)
      return 0.5 // Default moderate bonus
    }
  }

  // Get active curation rules
  private async getActiveCurationRules(): Promise<CurationRule[]> {
    try {
      const { data, error } = await supabase
        .from('curation_rules')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get curation rules, using defaults:', error)
      return this.defaultCurationRules.map(rule => ({
        ...rule,
        id: `default-${rule.name.toLowerCase().replace(/\s+/g, '-')}`,
        created_at: new Date().toISOString()
      }))
    }
  }

  // Store curation results
  private async storeCurationResults(sessionId: string, results: CurationResult[]): Promise<void> {
    try {
      const curationData = results.map(result => ({
        session_id: sessionId,
        story_id: result.story_id,
        curation_score: result.curation_score,
        applied_rules: result.applied_rules,
        featured_reason: result.featured_reason,
        community_votes: result.community_votes,
        validation_score: result.validation_score,
        geographic_location: result.geographic_location,
        impact_level: result.impact_level,
        created_at: result.curation_timestamp
      }))

      const { error } = await supabase
        .from('curation_results')
        .insert(curationData)

      if (error) throw error
    } catch (error) {
      console.error('Failed to store curation results:', error)
    }
  }

  // Complete curation session
  private async completeCurationSession(
    sessionId: string, 
    session: Omit<CurationSession, 'id'>, 
    results: CurationResult[],
    result: string
  ): Promise<CurationSession> {
    const completedSession: CurationSession = {
      id: sessionId,
      ...session,
      status: session.status === 'failed' ? 'failed' : 'completed',
      completed_at: new Date().toISOString()
    }

    try {
      // Store session record
      const { error } = await supabase
        .from('curation_sessions')
        .insert({
          id: sessionId,
          session_name: session.session_name,
          started_at: session.started_at,
          completed_at: completedSession.completed_at,
          status: completedSession.status,
          stories_reviewed: session.stories_reviewed,
          stories_featured: session.stories_featured,
          applied_rules: session.applied_rules,
          success_rate: session.success_rate,
          metadata: session.metadata
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to store curation session:', error)
    }

    return completedSession
  }

  // Ensure default curation rules exist
  private async ensureDefaultRules(): Promise<void> {
    try {
      const { data: existingRules } = await supabase
        .from('curation_rules')
        .select('name')

      const existingRuleNames = new Set(existingRules?.map(r => r.name) || [])

      const rulesToCreate = this.defaultCurationRules.filter(
        rule => !existingRuleNames.has(rule.name)
      )

      if (rulesToCreate.length > 0) {
        const { error } = await supabase
          .from('curation_rules')
          .insert(rulesToCreate.map(rule => ({
            ...rule,
            created_at: new Date().toISOString()
          })))

        if (error) throw error
        console.log(`✅ Created ${rulesToCreate.length} default curation rules`)
      }
    } catch (error) {
      console.error('Failed to ensure default rules:', error)
    }
  }

  // Get curation metrics
  async getCurationMetrics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<CurationMetrics> {
    try {
      const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

      const [sessionsData, resultsData, feedbackData] = await Promise.all([
        supabase.from('curation_sessions').select('*').gte('started_at', since),
        supabase.from('curation_results').select('*').gte('created_at', since),
        supabase.from('community_story_feedback').select('*').gte('created_at', since)
      ])

      const sessions = sessionsData.data || []
      const results = resultsData.data || []
      const feedback = feedbackData.data || []

      const totalSessions = sessions.length
      const totalStories = results.length
      const avgCurationScore = results.length > 0 ? 
        results.reduce((sum, r) => sum + r.curation_score, 0) / results.length : 0

      // Calculate geographic diversity score
      const locations = new Set(results.map(r => r.geographic_location).filter(Boolean))
      const geographicDiversityScore = Math.min((locations.size / 6) * 100, 100) // Max 6 major UK regions

      // Calculate community satisfaction
      const positiveRatings = feedback.filter(f => f.rating && f.rating >= 4).length
      const totalRatings = feedback.filter(f => f.rating).length
      const satisfactionRate = totalRatings > 0 ? (positiveRatings / totalRatings) * 100 : 0

      return {
        total_sessions_run: totalSessions,
        total_stories_curated: totalStories,
        avg_curation_score: Math.round(avgCurationScore * 10) / 10,
        geographic_diversity_score: Math.round(geographicDiversityScore),
        community_satisfaction_rate: Math.round(satisfactionRate),
        featured_retention_rate: 85 // Placeholder - would need more complex calculation
      }
    } catch (error) {
      console.error('Failed to get curation metrics:', error)
      return {
        total_sessions_run: 0,
        total_stories_curated: 0,
        avg_curation_score: 0,
        geographic_diversity_score: 0,
        community_satisfaction_rate: 0,
        featured_retention_rate: 0
      }
    }
  }
}

export const curatedStoriesService = new CuratedStoriesService()
export type { CurationRule, CurationResult, CurationSession, CurationMetrics }