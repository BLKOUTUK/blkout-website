import { ChromaClient } from 'chromadb-client'
import { createClient } from '@supabase/supabase-js'
import Redis from 'ioredis'
import OpenAI from 'openai'

// Core RAG Service Interface
export interface ContentSource {
  id: string
  type: 'rss' | 'website' | 'api' | 'social'
  url: string
  name?: string
  credibilityScore: number
  checkInterval: number
  lastChecked?: Date
  isActive: boolean
  communityVerified: boolean
}

export interface RawContent {
  id?: string
  sourceId: string
  originalUrl: string
  title: string
  description?: string
  content: string
  author?: string
  publishedAt?: Date
  imageUrl?: string
  tags?: string[]
}

export interface ClassifiedContent extends RawContent {
  category: 'event' | 'article' | 'resource' | 'news' | 'community'
  subcategory: string
  relevanceScore: number
  confidenceScore: number
  aiTags: string[]
  embedding: number[]
  metadata: Record<string, any>
}

export interface ValidationResult {
  isValid: boolean
  score: number
  issues: string[]
  recommendations: string[]
  autoApprovalEligible: boolean
}

// Main RAG Service Class
export class BlkoutRAGService {
  private chroma: ChromaClient
  private supabase: any
  private redis: Redis
  private openai: OpenAI
  private initialized = false

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    })
    
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
    
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    )
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Initialize ChromaDB client
      this.chroma = new ChromaClient({
        path: process.env.CHROMA_URL || 'http://localhost:8000'
      })

      // Create collections if they don't exist
      await this.setupCollections()
      
      this.initialized = true
      console.log('BlkoutRAGService initialized successfully')
    } catch (error) {
      console.error('Failed to initialize RAG service:', error)
      throw error
    }
  }

  private async setupCollections(): Promise<void> {
    try {
      await this.chroma.createCollection({
        name: 'blkout-content',
        metadata: { description: 'BLKOUT community content embeddings' }
      })
    } catch (error) {
      // Collection might already exist, which is fine
      if (!error.message.includes('already exists')) {
        throw error
      }
    }
  }

  // Content Discovery Agent
  async discoverContent(source: ContentSource): Promise<RawContent[]> {
    console.log(`Discovering content from source: ${source.url}`)
    
    try {
      switch (source.type) {
        case 'rss':
          return await this.scrapeRSSFeed(source)
        case 'website':
          return await this.scrapeWebsite(source)
        case 'api':
          return await this.fetchFromAPI(source)
        default:
          throw new Error(`Unsupported source type: ${source.type}`)
      }
    } catch (error) {
      console.error(`Error discovering content from ${source.url}:`, error)
      return []
    }
  }

  // Content Classification Agent
  async classifyContent(content: RawContent): Promise<ClassifiedContent> {
    console.log(`Classifying content: ${content.title}`)
    
    try {
      // Generate embedding
      const embedding = await this.generateEmbedding(content.title + ' ' + content.description)
      
      // Classify category and subcategory
      const classification = await this.classifyWithGPT(content)
      
      // Score relevance to BLKOUT community
      const relevanceScore = await this.scoreRelevance(content)
      
      // Generate AI tags
      const aiTags = await this.generateTags(content)
      
      return {
        ...content,
        category: classification.category,
        subcategory: classification.subcategory,
        relevanceScore,
        confidenceScore: classification.confidence,
        aiTags,
        embedding,
        metadata: {
          wordCount: content.content.split(' ').length,
          hasImage: !!content.imageUrl,
          classification: classification
        }
      }
    } catch (error) {
      console.error('Error classifying content:', error)
      throw error
    }
  }

  // Quality Assurance Agent
  async validateContent(content: ClassifiedContent): Promise<ValidationResult> {
    console.log(`Validating content: ${content.title}`)
    
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 1.0

    // Basic validation checks
    if (!content.title || content.title.length < 10) {
      issues.push('Title too short or missing')
      score -= 0.2
    }

    if (!content.description || content.description.length < 50) {
      issues.push('Description too short or missing')
      score -= 0.1
      recommendations.push('Add a more detailed description')
    }

    if (content.relevanceScore < 0.6) {
      issues.push('Low relevance to BLKOUT community')
      score -= 0.3
    }

    // Check for duplicates
    const isDuplicate = await this.checkForDuplicates(content)
    if (isDuplicate) {
      issues.push('Potential duplicate content detected')
      score -= 0.4
    }

    // Community safety check
    const safetyCheck = await this.performSafetyCheck(content)
    if (!safetyCheck.isSafe) {
      issues.push('Content flagged by safety check')
      score -= 0.5
    }

    const finalScore = Math.max(0, score)
    const autoApprovalEligible = finalScore >= 0.8 && issues.length === 0 && content.relevanceScore >= 0.8

    return {
      isValid: finalScore >= 0.5,
      score: finalScore,
      issues,
      recommendations,
      autoApprovalEligible
    }
  }

  // Auto-Approval Engine
  async processForAutoApproval(content: ClassifiedContent, validation: ValidationResult): Promise<boolean> {
    if (!validation.autoApprovalEligible) {
      await this.queueForManualReview(content, validation)
      return false
    }

    try {
      // Auto-approve and publish
      await this.publishContent(content)
      console.log(`Auto-approved and published: ${content.title}`)
      return true
    } catch (error) {
      console.error('Error in auto-approval process:', error)
      await this.queueForManualReview(content, validation)
      return false
    }
  }

  // Storage Operations
  async storeContent(content: ClassifiedContent): Promise<void> {
    try {
      // Store in vector database
      await this.chroma.upsert({
        collectionName: 'blkout-content',
        ids: [content.id!],
        embeddings: [content.embedding],
        metadatas: [{
          title: content.title,
          category: content.category,
          subcategory: content.subcategory,
          relevanceScore: content.relevanceScore,
          url: content.originalUrl,
          publishedAt: content.publishedAt?.toISOString(),
          tags: JSON.stringify(content.aiTags)
        }],
        documents: [content.title + ' ' + content.description]
      })

      // Store in relational database
      const { error } = await this.supabase
        .from('content_items')
        .upsert({
          id: content.id,
          source_id: content.sourceId,
          original_url: content.originalUrl,
          title: content.title,
          description: content.description,
          content: content.content,
          category: content.category,
          subcategory: content.subcategory,
          relevance_score: content.relevanceScore,
          confidence_score: content.confidenceScore,
          status: 'pending',
          metadata: content.metadata,
          published_at: content.publishedAt,
          embedding: content.embedding
        })

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      // Cache in Redis for real-time access
      await this.redis.setex(
        `content:${content.id}`,
        3600, // 1 hour TTL
        JSON.stringify(content)
      )

      console.log(`Stored content successfully: ${content.title}`)
    } catch (error) {
      console.error('Error storing content:', error)
      throw error
    }
  }

  // Semantic Search
  async searchContent(query: string, filters?: any): Promise<any[]> {
    try {
      const embedding = await this.generateEmbedding(query)
      
      const results = await this.chroma.query({
        collectionName: 'blkout-content',
        queryEmbeddings: [embedding],
        nResults: 10,
        where: filters
      })

      return results.ids[0].map((id, index) => ({
        id,
        title: results.metadatas[0][index].title,
        category: results.metadatas[0][index].category,
        relevanceScore: results.metadatas[0][index].relevanceScore,
        distance: results.distances[0][index],
        content: results.documents[0][index]
      }))
    } catch (error) {
      console.error('Error in semantic search:', error)
      return []
    }
  }

  // Helper Methods
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.slice(0, 8000) // Truncate to fit token limits
      })
      
      return response.data[0].embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  private async classifyWithGPT(content: RawContent): Promise<any> {
    try {
      const prompt = `
Classify this content for the BLKOUT platform, which focuses on Black queer liberation, community organizing, and social justice.

Title: ${content.title}
Description: ${content.description || ''}
Content: ${content.content.slice(0, 1000)}...

Classify into one of these categories:
- event: Community events, protests, workshops, meetings
- article: News articles, opinion pieces, analysis
- resource: Guides, tools, educational materials
- news: Breaking news, current events
- community: Community announcements, personal stories

Also provide a subcategory and confidence score (0-1).

Respond in JSON format:
{
  "category": "event|article|resource|news|community",
  "subcategory": "specific subcategory",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}
`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      })

      return JSON.parse(response.choices[0].message.content || '{}')
    } catch (error) {
      console.error('Error with GPT classification:', error)
      return { category: 'article', subcategory: 'general', confidence: 0.5 }
    }
  }

  private async scoreRelevance(content: RawContent): Promise<number> {
    // Community-specific relevance keywords
    const relevantKeywords = [
      'black', 'queer', 'lgbt', 'lgbtq', 'liberation', 'organizing', 'community',
      'activist', 'activism', 'social justice', 'equality', 'rights', 'protest',
      'movement', 'solidarity', 'intersectional', 'marginalized', 'oppression',
      'empowerment', 'collective', 'mutual aid', 'grassroots'
    ]

    const text = (content.title + ' ' + content.description + ' ' + content.content).toLowerCase()
    const matches = relevantKeywords.filter(keyword => text.includes(keyword)).length
    const maxMatches = relevantKeywords.length
    
    return Math.min(1.0, (matches / maxMatches) * 2) // Scale to 0-1, with bonus for multiple matches
  }

  private async generateTags(content: RawContent): Promise<string[]> {
    try {
      const prompt = `
Generate 3-7 relevant tags for this content for the BLKOUT community platform:

Title: ${content.title}
Description: ${content.description || ''}

Focus on tags related to Black queer liberation, community organizing, social justice, and specific topics covered.

Return only a JSON array of strings: ["tag1", "tag2", "tag3"]
`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })

      return JSON.parse(response.choices[0].message.content || '[]')
    } catch (error) {
      console.error('Error generating tags:', error)
      return []
    }
  }

  private async checkForDuplicates(content: ClassifiedContent): Promise<boolean> {
    try {
      // Search for similar content using embeddings
      const similarContent = await this.searchContent(content.title)
      
      // Check if any results have high similarity (low distance)
      return similarContent.some(item => item.distance < 0.3 && item.id !== content.id)
    } catch (error) {
      console.error('Error checking for duplicates:', error)
      return false
    }
  }

  private async performSafetyCheck(content: ClassifiedContent): Promise<{isSafe: boolean, reasons: string[]}> {
    // Basic safety checks - in production, use more sophisticated content moderation
    const unsafePatterns = [
      /spam/i,
      /scam/i,
      /violence/i,
      /harassment/i
    ]

    const text = content.title + ' ' + content.description + ' ' + content.content
    const flagged = unsafePatterns.filter(pattern => pattern.test(text))

    return {
      isSafe: flagged.length === 0,
      reasons: flagged.map(pattern => `Flagged pattern: ${pattern.source}`)
    }
  }

  private async queueForManualReview(content: ClassifiedContent, validation: ValidationResult): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('approval_queue')
        .insert({
          content_id: content.id,
          priority: validation.score < 0.6 ? 1 : 5, // Higher priority for lower scores
          issues: validation.issues,
          recommendations: validation.recommendations
        })

      if (error) {
        throw new Error(`Error queuing for review: ${error.message}`)
      }

      console.log(`Queued for manual review: ${content.title}`)
    } catch (error) {
      console.error('Error queuing for manual review:', error)
    }
  }

  private async publishContent(content: ClassifiedContent): Promise<void> {
    // Update content status to published
    const { error } = await this.supabase
      .from('content_items')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', content.id)

    if (error) {
      throw new Error(`Error publishing content: ${error.message}`)
    }

    // Trigger existing API endpoints to sync with legacy system
    await this.syncWithLegacyAPIs(content)
  }

  private async syncWithLegacyAPIs(content: ClassifiedContent): Promise<void> {
    try {
      const apiUrl = process.env.BLKOUT_API_BASE || 'https://blkout-beta.vercel.app/api'
      
      if (content.category === 'event') {
        await fetch(`${apiUrl}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: content.title,
            description: content.description,
            date: content.publishedAt,
            location: { type: 'online', address: 'Online' },
            category: content.subcategory,
            status: 'published'
          })
        })
      } else {
        await fetch(`${apiUrl}/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: content.title,
            excerpt: content.description,
            content: content.content,
            category: content.subcategory,
            status: 'published'
          })
        })
      }
    } catch (error) {
      console.error('Error syncing with legacy APIs:', error)
    }
  }

  // RSS/Website scraping methods (placeholder implementations)
  private async scrapeRSSFeed(source: ContentSource): Promise<RawContent[]> {
    // Implementation would use RSS parser library
    console.log(`Scraping RSS feed: ${source.url}`)
    return []
  }

  private async scrapeWebsite(source: ContentSource): Promise<RawContent[]> {
    // Implementation would use web scraping library like Puppeteer or Playwright
    console.log(`Scraping website: ${source.url}`)
    return []
  }

  private async fetchFromAPI(source: ContentSource): Promise<RawContent[]> {
    // Implementation would handle various API formats
    console.log(`Fetching from API: ${source.url}`)
    return []
  }
}