// Story Telling Integration Service
// Connects IVOR conversations to BLKOUT newsroom for community story capture

import { newsroomService } from './newsroomService'
import type { NewsArticle } from './newsroomService'

interface IVORConversation {
  message: string
  response: string
  service: string
  timestamp: string
  userId: string
  sessionId: string
  metadata?: {
    storyPotential?: boolean
    achievementDetected?: boolean
    communityImpact?: string
  }
}

interface StoryCapture {
  id: string
  title: string
  content: string
  source: 'ivor-conversation' | 'community-submission' | 'partner-organization'
  category: 'achievement' | 'organizing' | 'mutual-aid' | 'cultural' | 'health' | 'housing'
  location?: string
  impact: 'individual' | 'local' | 'national'
  status: 'captured' | 'reviewing' | 'published'
  original_conversation?: IVORConversation
}

class StoryTellingIntegrationService {
  private readonly ivorApiUrl = 'https://ivor-api.vercel.app'
  
  constructor() {
    console.log('🎭 StoryTelling Integration Service initialized')
  }

  // Analyze IVOR conversation for story potential
  analyzeConversationForStory(conversation: IVORConversation): {
    hasStoryPotential: boolean
    storyType?: string
    suggestedTitle?: string
    keyElements?: string[]
  } {
    const { message, response } = conversation
    const combined = `${message} ${response}`.toLowerCase()
    
    // Story detection patterns
    const achievementPatterns = [
      'got a job', 'found housing', 'started therapy', 'completed course',
      'organized', 'campaign successful', 'raised money', 'protest',
      'community project', 'mutual aid', 'helped someone', 'created'
    ]
    
    const organizingPatterns = [
      'organized', 'campaign', 'protest', 'mutual aid', 'collective action',
      'tenant organizing', 'housing campaign', 'community meeting', 'coalition'
    ]
    
    const healthPatterns = [
      'found therapist', 'NHS', 'clinic', 'support group', 'mental health',
      'healthcare access', 'medication', 'treatment'
    ]
    
    const culturalPatterns = [
      'pride event', 'community gathering', 'cultural celebration', 'art project',
      'performance', 'exhibition', 'festival', 'celebration'
    ]

    let storyType: string | undefined
    let hasStoryPotential = false
    let keyElements: string[] = []

    // Check for achievement indicators
    if (achievementPatterns.some(pattern => combined.includes(pattern))) {
      hasStoryPotential = true
      storyType = 'achievement'
      keyElements.push('personal achievement')
    }

    // Check for organizing stories
    if (organizingPatterns.some(pattern => combined.includes(pattern))) {
      hasStoryPotential = true
      storyType = storyType ? 'mixed' : 'organizing'
      keyElements.push('community organizing')
    }

    // Check for health stories
    if (healthPatterns.some(pattern => combined.includes(pattern))) {
      hasStoryPotential = true
      storyType = storyType ? 'mixed' : 'health'
      keyElements.push('healthcare access')
    }

    // Check for cultural stories
    if (culturalPatterns.some(pattern => combined.includes(pattern))) {
      hasStoryPotential = true
      storyType = storyType ? 'mixed' : 'cultural'
      keyElements.push('cultural celebration')
    }

    // Generate suggested title
    let suggestedTitle: string | undefined
    if (hasStoryPotential) {
      if (storyType === 'achievement') {
        suggestedTitle = 'Community Member Shares Recent Achievement'
      } else if (storyType === 'organizing') {
        suggestedTitle = 'Local Organizing Campaign Update'
      } else if (storyType === 'health') {
        suggestedTitle = 'Healthcare Access Success Story'
      } else if (storyType === 'cultural') {
        suggestedTitle = 'Community Cultural Celebration Highlight'
      } else {
        suggestedTitle = 'Community Story: Liberation in Action'
      }
    }

    return {
      hasStoryPotential,
      storyType,
      suggestedTitle,
      keyElements
    }
  }

  // Capture story from IVOR conversation
  async captureStoryFromConversation(
    conversation: IVORConversation,
    userConsent: boolean = false
  ): Promise<StoryCapture | null> {
    if (!userConsent) {
      console.log('📝 Story capture requires user consent')
      return null
    }

    const analysis = this.analyzeConversationForStory(conversation)
    
    if (!analysis.hasStoryPotential) {
      console.log('📝 No story potential detected in conversation')
      return null
    }

    // Extract location from conversation if possible
    const locationPatterns = [
      /in (\w+)/g,
      /(\w+) area/g,
      /greater (\w+)/g,
      /(london|manchester|birmingham|glasgow|cardiff|bristol|leeds|sheffield|liverpool|newcastle)/gi
    ]
    
    let location: string | undefined
    const combined = `${conversation.message} ${conversation.response}`
    
    for (const pattern of locationPatterns) {
      const matches = combined.match(pattern)
      if (matches && matches.length > 0) {
        location = matches[0].toLowerCase()
        break
      }
    }

    // Create story capture
    const storyCapture: StoryCapture = {
      id: `story-${Date.now()}-${conversation.sessionId}`,
      title: analysis.suggestedTitle || 'Community Story',
      content: this.extractStoryContent(conversation, analysis),
      source: 'ivor-conversation',
      category: this.mapStoryTypeToCategory(analysis.storyType || 'achievement'),
      location,
      impact: this.assessImpactLevel(conversation),
      status: 'captured',
      original_conversation: conversation
    }

    console.log('📝 Story captured:', storyCapture.title)
    return storyCapture
  }

  // Extract meaningful story content from conversation
  private extractStoryContent(
    conversation: IVORConversation, 
    analysis: { keyElements?: string[] }
  ): string {
    const { message, response } = conversation
    
    // Create a narrative from the conversation
    let content = `**Community Member Experience**\n\n`
    content += `A community member shared: "${message}"\n\n`
    content += `**Community Support Response**\n\n`
    content += `${response}\n\n`
    
    if (analysis.keyElements && analysis.keyElements.length > 0) {
      content += `**Key Themes**: ${analysis.keyElements.join(', ')}\n\n`
    }
    
    content += `*This story was captured from a community conversation and shared with permission to inspire and connect our community.*`
    
    return content
  }

  // Map story type to newsroom category
  private mapStoryTypeToCategory(storyType: string): StoryCapture['category'] {
    const mapping: Record<string, StoryCapture['category']> = {
      'achievement': 'achievement',
      'organizing': 'organizing', 
      'health': 'health',
      'cultural': 'cultural',
      'mixed': 'achievement' // Default for mixed types
    }
    
    return mapping[storyType] || 'achievement'
  }

  // Assess the impact level of the story
  private assessImpactLevel(conversation: IVORConversation): StoryCapture['impact'] {
    const combined = `${conversation.message} ${conversation.response}`.toLowerCase()
    
    // National impact indicators
    if (combined.includes('national') || combined.includes('uk-wide') || combined.includes('across britain')) {
      return 'national'
    }
    
    // Local impact indicators  
    if (combined.includes('community') || combined.includes('local') || combined.includes('neighborhood')) {
      return 'local'
    }
    
    // Default to individual
    return 'individual'
  }

  // Convert story capture to newsroom article
  async publishStoryToNewsroom(storyCapture: StoryCapture): Promise<NewsArticle | null> {
    try {
      const article = await newsroomService.createArticle({
        title: storyCapture.title,
        content: storyCapture.content,
        excerpt: this.generateExcerpt(storyCapture.content),
        category: this.mapCategoryToNewsroom(storyCapture.category),
        author: 'Community Stories',
        status: 'published',
        tags: this.generateTags(storyCapture),
        source_url: undefined, // Internal story
        submitted_via: `ivor-${storyCapture.source}`,
        featured: storyCapture.impact === 'national'
      })

      if (article) {
        console.log('📰 Story published to newsroom:', article.title)
      }

      return article
    } catch (error) {
      console.error('❌ Failed to publish story to newsroom:', error)
      return null
    }
  }

  // Generate excerpt from story content
  private generateExcerpt(content: string): string {
    // Remove markdown formatting and get first meaningful sentence
    const plainContent = content.replace(/\*\*/g, '').replace(/\n/g, ' ')
    const sentences = plainContent.split('. ')
    
    // Find first substantial sentence (more than 20 characters)
    const firstSentence = sentences.find(s => s.trim().length > 20)
    
    if (firstSentence) {
      return firstSentence.trim() + (firstSentence.endsWith('.') ? '' : '.')
    }
    
    // Fallback: first 150 characters
    return plainContent.substring(0, 150) + '...'
  }

  // Map story category to newsroom category
  private mapCategoryToNewsroom(category: StoryCapture['category']): string {
    const mapping: Record<StoryCapture['category'], string> = {
      'achievement': 'Community News',
      'organizing': 'Organizing',
      'mutual-aid': 'Community News',
      'cultural': 'Culture & Arts',
      'health': 'Health & Wellness',
      'housing': 'Housing Justice'
    }
    
    return mapping[category] || 'Community News'
  }

  // Generate relevant tags for the story
  private generateTags(storyCapture: StoryCapture): string[] {
    const baseTags = ['Community Stories', 'IVOR']
    
    // Add category-based tags
    if (storyCapture.category === 'achievement') {
      baseTags.push('Success Stories', 'Community Wins')
    } else if (storyCapture.category === 'organizing') {
      baseTags.push('Community Organizing', 'Collective Action')
    } else if (storyCapture.category === 'health') {
      baseTags.push('Health & Wellness', 'Healthcare Access')
    } else if (storyCapture.category === 'cultural') {
      baseTags.push('Culture & Arts', 'Community Events')
    }

    // Add location-based tag
    if (storyCapture.location) {
      baseTags.push(storyCapture.location.charAt(0).toUpperCase() + storyCapture.location.slice(1))
    }

    // Add impact-based tag
    if (storyCapture.impact === 'national') {
      baseTags.push('National Impact')
    } else if (storyCapture.impact === 'local') {
      baseTags.push('Local Impact')
    }

    return baseTags
  }

  // Enhanced IVOR conversation with story detection
  async enhancedIVORChat(
    message: string, 
    options: {
      userId?: string
      sessionId?: string
      services?: string[]
      detectStories?: boolean
    } = {}
  ): Promise<{
    response: any
    storyPotential?: {
      hasStory: boolean
      suggestedCapture?: StoryCapture
    }
  }> {
    try {
      // Send message to IVOR API
      const response = await fetch(`${this.ivorApiUrl}/api/chat/orchestrated`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: options.userId || 'anonymous',
          sessionId: options.sessionId || 'default',
          services: options.services
        })
      })

      if (!response.ok) {
        throw new Error(`IVOR API error: ${response.status}`)
      }

      const ivorResponse = await response.json()
      
      // Analyze for story potential if requested
      let storyPotential: any = undefined
      
      if (options.detectStories && ivorResponse.orchestratedResponse?.length > 0) {
        const firstResponse = ivorResponse.orchestratedResponse[0]
        const conversation: IVORConversation = {
          message,
          response: firstResponse.response,
          service: firstResponse.service,
          timestamp: firstResponse.timestamp,
          userId: options.userId || 'anonymous',
          sessionId: options.sessionId || 'default'
        }

        const analysis = this.analyzeConversationForStory(conversation)
        
        if (analysis.hasStoryPotential) {
          const suggestedCapture = await this.captureStoryFromConversation(conversation, false) // No auto-publish without consent
          
          storyPotential = {
            hasStory: true,
            analysis,
            suggestedCapture
          }
        } else {
          storyPotential = {
            hasStory: false
          }
        }
      }

      return {
        response: ivorResponse,
        storyPotential
      }

    } catch (error) {
      console.error('❌ Enhanced IVOR chat error:', error)
      throw error
    }
  }
}

export const storyTellingIntegration = new StoryTellingIntegrationService()
export type { IVORConversation, StoryCapture }