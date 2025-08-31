// Story Capture Service
// Production-scale IVOR conversations → Newsroom articles pipeline

import { storyTellingIntegration, type IVORConversation, type StoryCapture } from './storyTellingIntegration'
import { newsroomService, type NewsArticle } from './newsroomService'
import { governanceIntegration } from './governanceIntegration'
import { supabase } from '../lib/supabase'

interface StoryCaptureQueue {
  id: string
  conversation_data: IVORConversation
  story_analysis: {
    hasStoryPotential: boolean
    storyType?: string
    suggestedTitle?: string
    keyElements?: string[]
  }
  status: 'pending' | 'processing' | 'captured' | 'published' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  auto_validation_score: number
  user_consent: boolean
  created_at: string
  processed_at?: string
  newsroom_article_id?: string
  governance_decision_id?: string
  metadata: {
    user_location?: string
    community_impact?: 'individual' | 'local' | 'national'
    keywords: string[]
    confidence_score: number
  }
}

interface CaptureMetrics {
  total_conversations_analyzed: number
  stories_detected: number
  stories_captured: number
  stories_published: number
  detection_accuracy: number
  processing_time_avg_ms: number
  community_consent_rate: number
}

interface CaptureConfiguration {
  auto_capture_threshold: number // Minimum score for automatic capture
  auto_publish_threshold: number // Minimum score for automatic publishing
  require_user_consent: boolean
  batch_processing_size: number
  processing_interval_minutes: number
  max_queue_size: number
}

class StoryCaptureServiceClass {
  private readonly configuration: CaptureConfiguration = {
    auto_capture_threshold: 3.5,
    auto_publish_threshold: 4.0,
    require_user_consent: true,
    batch_processing_size: 10,
    processing_interval_minutes: 5,
    max_queue_size: 1000
  }

  private processingInterval: NodeJS.Timeout | null = null
  private isProcessing = false

  constructor() {
    console.log('📰 Story Capture Service initialized')
    this.startProcessingLoop()
  }

  // Add IVOR conversation to capture queue
  async queueConversationForAnalysis(
    conversation: IVORConversation,
    userConsent: boolean = false
  ): Promise<{ queued: boolean; queueId?: string; reason?: string }> {
    try {
      // Analyze conversation for story potential
      const analysis = storyTellingIntegration.analyzeConversationForStory(conversation)
      
      if (!analysis.hasStoryPotential) {
        return {
          queued: false,
          reason: 'No story potential detected'
        }
      }

      // Calculate auto-validation score
      const autoValidationScore = await this.calculateConversationScore(conversation, analysis)
      
      // Determine priority
      const priority = this.determinePriority(autoValidationScore, analysis)

      // Create queue entry
      const queueEntry: Omit<StoryCaptureQueue, 'id'> = {
        conversation_data: conversation,
        story_analysis: analysis,
        status: 'pending',
        priority,
        auto_validation_score: autoValidationScore,
        user_consent: userConsent,
        created_at: new Date().toISOString(),
        metadata: {
          user_location: this.extractUserLocation(conversation),
          community_impact: this.assessCommunityImpact(conversation),
          keywords: this.extractKeywords(conversation),
          confidence_score: autoValidationScore
        }
      }

      // Store in database
      const { data, error } = await supabase
        .from('story_capture_queue')
        .insert(queueEntry)
        .select()
        .single()

      if (error) throw error

      console.log(`📝 Conversation queued for story capture: ${data.id}`)
      
      return {
        queued: true,
        queueId: data.id
      }

    } catch (error) {
      console.error('❌ Failed to queue conversation:', error)
      return {
        queued: false,
        reason: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Process story capture queue (batch processing)
  async processCaptureQueue(): Promise<{
    processed: number
    captured: number
    published: number
    errors: number
  }> {
    if (this.isProcessing) {
      return { processed: 0, captured: 0, published: 0, errors: 0 }
    }

    this.isProcessing = true
    console.log('🔄 Processing story capture queue...')

    try {
      // Get pending items ordered by priority and creation time
      const { data: queueItems, error } = await supabase
        .from('story_capture_queue')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(this.configuration.batch_processing_size)

      if (error) throw error
      if (!queueItems || queueItems.length === 0) {
        return { processed: 0, captured: 0, published: 0, errors: 0 }
      }

      const results = {
        processed: 0,
        captured: 0,
        published: 0,
        errors: 0
      }

      // Process each item
      for (const item of queueItems) {
        try {
          await this.processQueueItem(item)
          results.processed++
          
          // Check if it was captured or published
          const { data: updatedItem } = await supabase
            .from('story_capture_queue')
            .select('status')
            .eq('id', item.id)
            .single()

          if (updatedItem?.status === 'captured') results.captured++
          if (updatedItem?.status === 'published') results.published++

        } catch (error) {
          console.error(`❌ Failed to process queue item ${item.id}:`, error)
          results.errors++
          
          // Mark as failed but don't remove from queue for retry
          await supabase
            .from('story_capture_queue')
            .update({ 
              status: 'pending', // Keep for retry
              processed_at: new Date().toISOString()
            })
            .eq('id', item.id)
        }
      }

      console.log(`✅ Queue processing complete: ${results.processed} processed, ${results.captured} captured, ${results.published} published`)
      return results

    } catch (error) {
      console.error('❌ Queue processing failed:', error)
      return { processed: 0, captured: 0, published: 0, errors: 1 }
    } finally {
      this.isProcessing = false
    }
  }

  // Process individual queue item
  private async processQueueItem(item: StoryCaptureQueue): Promise<void> {
    const startTime = Date.now()

    // Update status to processing
    await supabase
      .from('story_capture_queue')
      .update({ status: 'processing' })
      .eq('id', item.id)

    // Check if user consent is required and available
    if (this.configuration.require_user_consent && !item.user_consent && 
        item.auto_validation_score < this.configuration.auto_publish_threshold) {
      
      // Keep in queue waiting for consent
      await supabase
        .from('story_capture_queue')
        .update({ status: 'pending' })
        .eq('id', item.id)
      
      console.log(`⏳ Story ${item.id} waiting for user consent`)
      return
    }

    // Capture the story
    const storyCapture = await storyTellingIntegration.captureStoryFromConversation(
      item.conversation_data,
      true // We've already checked consent above
    )

    if (!storyCapture) {
      throw new Error('Story capture failed')
    }

    // Create newsroom article
    const newsroomArticle = await this.createNewsroomArticle(storyCapture, item)
    
    if (!newsroomArticle) {
      throw new Error('Newsroom article creation failed')
    }

    // Determine if automatic publishing or governance review needed
    let finalStatus: 'captured' | 'published' = 'captured'
    let governanceDecisionId: string | undefined

    if (item.auto_validation_score >= this.configuration.auto_publish_threshold) {
      // Auto-publish high-quality stories
      await newsroomService.updateArticle(newsroomArticle.id, {
        status: 'published',
        featured: item.auto_validation_score >= 4.5 // Feature very high quality
      })
      finalStatus = 'published'
    } else {
      // Submit to community governance
      const governanceDecision = await governanceIntegration.submitStoryForValidation(
        newsroomArticle.id,
        'ivor_conversation',
        `story-capture-${item.id}`
      )
      
      if (governanceDecision) {
        governanceDecisionId = governanceDecision.id
      }
    }

    // Update queue item with results
    const processingTime = Date.now() - startTime
    
    await supabase
      .from('story_capture_queue')
      .update({
        status: finalStatus,
        processed_at: new Date().toISOString(),
        newsroom_article_id: newsroomArticle.id,
        governance_decision_id: governanceDecisionId,
        metadata: {
          ...item.metadata,
          processing_time_ms: processingTime
        }
      })
      .eq('id', item.id)

    console.log(`✅ Story captured: ${storyCapture.title} (${processingTime}ms)`)
  }

  // Create newsroom article from story capture
  private async createNewsroomArticle(
    storyCapture: StoryCapture,
    queueItem: StoryCaptureQueue
  ): Promise<NewsArticle | null> {
    const article = await newsroomService.createArticle({
      title: storyCapture.title,
      content: storyCapture.content,
      excerpt: this.generateExcerpt(storyCapture.content),
      author: 'Community Stories',
      category: this.mapCategoryToNewsroom(storyCapture.category),
      status: 'draft', // Start as draft
      featured: false, // Will be set later based on validation
      tags: this.generateArticleTags(storyCapture, queueItem),
      source_url: undefined, // Internal story
      submitted_via: `ivor-${storyCapture.source}`,
      priority: queueItem.priority === 'urgent' ? 'high' : 'medium'
    })

    return article
  }

  // Calculate conversation quality score
  private async calculateConversationScore(
    conversation: IVORConversation,
    analysis: any
  ): Promise<number> {
    let score = 0

    // Story potential base score
    if (analysis.hasStoryPotential) score += 1.0

    // Story type scoring
    const typeScores = {
      'achievement': 1.5,
      'organizing': 2.0,
      'health': 1.5,
      'cultural': 1.0,
      'mixed': 1.8
    }
    score += typeScores[analysis.storyType as keyof typeof typeScores] || 0.5

    // Content quality
    const contentLength = `${conversation.message} ${conversation.response}`.length
    if (contentLength > 200) score += 0.5
    if (contentLength > 500) score += 0.5

    // Community keywords
    const content = `${conversation.message} ${conversation.response}`.toLowerCase()
    const communityKeywords = [
      'community', 'organizing', 'mutual aid', 'liberation', 'collective',
      'black', 'queer', 'qtipoc', 'trans', 'solidarity'
    ]
    const keywordMatches = communityKeywords.filter(keyword => content.includes(keyword)).length
    score += keywordMatches * 0.2

    // UK location relevance
    const ukKeywords = ['uk', 'britain', 'london', 'manchester', 'birmingham', 'glasgow']
    const hasUkLocation = ukKeywords.some(keyword => content.includes(keyword))
    if (hasUkLocation) score += 0.5

    return Math.min(Math.round(score * 10) / 10, 5.0)
  }

  // Determine processing priority
  private determinePriority(score: number, analysis: any): 'low' | 'medium' | 'high' | 'urgent' {
    if (score >= 4.5) return 'urgent'
    if (score >= 4.0) return 'high'
    if (score >= 3.0) return 'medium'
    return 'low'
  }

  // Extract user location from conversation
  private extractUserLocation(conversation: IVORConversation): string | undefined {
    const content = `${conversation.message} ${conversation.response}`.toLowerCase()
    const ukLocations = [
      'london', 'manchester', 'birmingham', 'glasgow', 'cardiff', 'bristol',
      'leeds', 'sheffield', 'liverpool', 'newcastle', 'brighton', 'nottingham'
    ]
    
    return ukLocations.find(location => content.includes(location))
  }

  // Assess community impact
  private assessCommunityImpact(conversation: IVORConversation): 'individual' | 'local' | 'national' {
    const content = `${conversation.message} ${conversation.response}`.toLowerCase()
    
    if (content.includes('national') || content.includes('uk-wide') || content.includes('britain')) {
      return 'national'
    }
    
    if (content.includes('community') || content.includes('local') || content.includes('campaign')) {
      return 'local'
    }
    
    return 'individual'
  }

  // Extract keywords from conversation
  private extractKeywords(conversation: IVORConversation): string[] {
    const content = `${conversation.message} ${conversation.response}`.toLowerCase()
    const keywords = []

    // Community keywords
    const communityTerms = ['organizing', 'mutual aid', 'collective action', 'community', 'liberation']
    keywords.push(...communityTerms.filter(term => content.includes(term)))

    // Identity keywords
    const identityTerms = ['black', 'queer', 'trans', 'qtipoc', 'lgbtq']
    keywords.push(...identityTerms.filter(term => content.includes(term)))

    // Activity keywords
    const activityTerms = ['housing', 'healthcare', 'education', 'arts', 'culture', 'protest', 'campaign']
    keywords.push(...activityTerms.filter(term => content.includes(term)))

    return [...new Set(keywords)] // Remove duplicates
  }

  // Generate article excerpt
  private generateExcerpt(content: string): string {
    // Remove markdown and get first meaningful sentence
    const plainContent = content.replace(/\*\*/g, '').replace(/\n/g, ' ')
    const sentences = plainContent.split('. ')
    const firstSentence = sentences.find(s => s.trim().length > 30)
    
    return firstSentence ? firstSentence.trim() + '.' : plainContent.substring(0, 150) + '...'
  }

  // Map story category to newsroom category
  private mapCategoryToNewsroom(category: StoryCapture['category']): string {
    const mapping = {
      'achievement': 'Community News',
      'organizing': 'Organizing',
      'mutual-aid': 'Community News',
      'cultural': 'Culture & Arts',
      'health': 'Health & Wellness',
      'housing': 'Housing Justice'
    }
    
    return mapping[category] || 'Community News'
  }

  // Generate article tags
  private generateArticleTags(storyCapture: StoryCapture, queueItem: StoryCaptureQueue): string[] {
    const tags = ['Community Stories', 'IVOR Generated']
    
    // Add category tags
    tags.push(storyCapture.category.charAt(0).toUpperCase() + storyCapture.category.slice(1))
    
    // Add location tags
    if (storyCapture.location) {
      tags.push(storyCapture.location)
    }
    
    // Add impact tags
    if (storyCapture.impact === 'national') {
      tags.push('National Impact')
    } else if (storyCapture.impact === 'local') {
      tags.push('Local Community')
    }
    
    // Add keywords from metadata
    tags.push(...queueItem.metadata.keywords.slice(0, 3))
    
    return [...new Set(tags)].slice(0, 8) // Max 8 unique tags
  }

  // Get capture metrics
  async getCaptureMetrics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<CaptureMetrics> {
    try {
      const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

      const { data, error } = await supabase
        .from('story_capture_queue')
        .select('*')
        .gte('created_at', since)

      if (error) throw error
      if (!data) return this.getDefaultMetrics()

      const totalAnalyzed = data.length
      const storiesDetected = data.filter(item => item.story_analysis.hasStoryPotential).length
      const storiesCaptured = data.filter(item => ['captured', 'published'].includes(item.status)).length
      const storiesPublished = data.filter(item => item.status === 'published').length
      
      const withConsent = data.filter(item => item.user_consent).length
      const consentRate = totalAnalyzed > 0 ? (withConsent / totalAnalyzed) * 100 : 0
      
      const processingTimes = data
        .filter(item => item.metadata?.processing_time_ms)
        .map(item => item.metadata.processing_time_ms)
      
      const avgProcessingTime = processingTimes.length > 0 
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
        : 0

      return {
        total_conversations_analyzed: totalAnalyzed,
        stories_detected: storiesDetected,
        stories_captured: storiesCaptured,
        stories_published: storiesPublished,
        detection_accuracy: totalAnalyzed > 0 ? (storiesDetected / totalAnalyzed) * 100 : 0,
        processing_time_avg_ms: avgProcessingTime,
        community_consent_rate: consentRate
      }

    } catch (error) {
      console.error('❌ Failed to get capture metrics:', error)
      return this.getDefaultMetrics()
    }
  }

  // Get queue status
  async getQueueStatus(): Promise<{
    pending: number
    processing: number
    captured: number
    published: number
    total: number
    oldest_pending: string | null
  }> {
    try {
      const { data, error } = await supabase
        .from('story_capture_queue')
        .select('status, created_at')
        .order('created_at', { ascending: true })

      if (error) throw error
      if (!data) return {
        pending: 0, processing: 0, captured: 0, published: 0, total: 0, oldest_pending: null
      }

      const statusCounts = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const oldestPending = data.find(item => item.status === 'pending')?.created_at || null

      return {
        pending: statusCounts.pending || 0,
        processing: statusCounts.processing || 0,
        captured: statusCounts.captured || 0,
        published: statusCounts.published || 0,
        total: data.length,
        oldest_pending: oldestPending
      }

    } catch (error) {
      console.error('❌ Failed to get queue status:', error)
      return {
        pending: 0, processing: 0, captured: 0, published: 0, total: 0, oldest_pending: null
      }
    }
  }

  // Start automated processing loop
  private startProcessingLoop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
    }

    this.processingInterval = setInterval(async () => {
      await this.processCaptureQueue()
    }, this.configuration.processing_interval_minutes * 60 * 1000)

    console.log(`⚡ Story capture processing loop started (${this.configuration.processing_interval_minutes} min intervals)`)
  }

  // Stop processing loop
  stopProcessingLoop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
      console.log('⏹️ Story capture processing loop stopped')
    }
  }

  // Default metrics for error cases
  private getDefaultMetrics(): CaptureMetrics {
    return {
      total_conversations_analyzed: 0,
      stories_detected: 0,
      stories_captured: 0,
      stories_published: 0,
      detection_accuracy: 0,
      processing_time_avg_ms: 0,
      community_consent_rate: 0
    }
  }
}

export const storyCaptureService = new StoryCaptureServiceClass()
export type { StoryCaptureQueue, CaptureMetrics, CaptureConfiguration }