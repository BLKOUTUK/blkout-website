/**
 * Newsroom Population Service
 * Populates the newsroom with comprehensive UK Black queer community stories
 * Ensures geographic diversity, category balance, and authentic community voices
 */

import { supabase } from '../utils/supabaseClient'
import { allNewsroomStories, type NewsroomStory } from '../data/sampleNewsroomStories'

interface PopulationResult {
  success: boolean
  stories_added: number
  categories_covered: string[]
  locations_covered: string[]
  total_community_voices: number
  avg_validation_score: number
  errors: string[]
}

interface PopulationStats {
  by_category: Record<string, number>
  by_location: Record<string, number>
  by_impact_level: Record<string, number>
  validation_scores: number[]
  total_engagement: {
    views: number
    shares: number
    responses: number
  }
}

class NewsroomPopulationService {

  /**
   * Populate newsroom with comprehensive UK Black queer community stories
   */
  async populateNewsroom(options: {
    clear_existing?: boolean
    batch_size?: number
    include_sample_data?: boolean
  } = {}): Promise<PopulationResult> {
    const {
      clear_existing = false,
      batch_size = 10,
      include_sample_data = true
    } = options

    console.log('📰 Starting newsroom population with UK Black queer community stories...')
    
    const result: PopulationResult = {
      success: false,
      stories_added: 0,
      categories_covered: [],
      locations_covered: [],
      total_community_voices: 0,
      avg_validation_score: 0,
      errors: []
    }

    try {
      // Clear existing stories if requested
      if (clear_existing) {
        await this.clearExistingStories()
        console.log('🧹 Cleared existing newsroom stories')
      }

      // Check for existing stories to avoid duplicates
      const existingStories = await this.getExistingStoryIds()
      const storiesToAdd = allNewsroomStories.filter(story => 
        !existingStories.includes(story.id)
      )

      console.log(`📊 Found ${storiesToAdd.length} new stories to add (${existingStories.length} already exist)`)

      if (storiesToAdd.length === 0) {
        result.success = true
        result.stories_added = 0
        console.log('✅ No new stories to add - newsroom already populated')
        return result
      }

      // Process stories in batches to avoid overwhelming the database
      const batches = this.createBatches(storiesToAdd, batch_size)
      let totalAdded = 0
      const stats = this.initializeStats()

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        console.log(`📝 Processing batch ${i + 1}/${batches.length} (${batch.length} stories)`)

        try {
          const batchResult = await this.addStoriesBatch(batch)
          totalAdded += batchResult.added
          this.updateStats(stats, batch)
          
          console.log(`✅ Batch ${i + 1} complete: ${batchResult.added} stories added`)
          
          // Small delay between batches to be gentle on the database
          if (i < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        } catch (error) {
          console.error(`❌ Error processing batch ${i + 1}:`, error)
          result.errors.push(`Batch ${i + 1}: ${error.message}`)
        }
      }

      // Calculate final results
      result.success = totalAdded > 0
      result.stories_added = totalAdded
      result.categories_covered = Object.keys(stats.by_category)
      result.locations_covered = Object.keys(stats.by_location)
      result.total_community_voices = stats.total_community_voices
      result.avg_validation_score = stats.validation_scores.reduce((sum, score) => sum + score, 0) / stats.validation_scores.length

      console.log(`🎉 Newsroom population complete:`)
      console.log(`   📈 ${totalAdded} stories added`)
      console.log(`   🏷️  ${result.categories_covered.length} categories covered`)
      console.log(`   🗺️  ${result.locations_covered.length} locations covered`)
      console.log(`   💬 ${result.total_community_voices} community voices`)
      console.log(`   ⭐ ${result.avg_validation_score.toFixed(1)} average validation score`)

      // Update newsroom metadata
      await this.updateNewsroomMetadata({
        last_populated: new Date().toISOString(),
        total_stories: totalAdded + existingStories.length,
        categories: result.categories_covered,
        locations: result.locations_covered,
        community_voices: result.total_community_voices
      })

      return result

    } catch (error) {
      console.error('❌ Error populating newsroom:', error)
      result.errors.push(`General error: ${error.message}`)
      return result
    }
  }

  /**
   * Clear existing stories from the newsroom
   */
  private async clearExistingStories(): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .neq('id', 'impossible-id') // Delete all rows

    if (error) {
      throw new Error(`Failed to clear existing stories: ${error.message}`)
    }
  }

  /**
   * Get existing story IDs to avoid duplicates
   */
  private async getExistingStoryIds(): Promise<string[]> {
    const { data: stories, error } = await supabase
      .from('articles')
      .select('id')

    if (error) {
      console.warn('Warning: Could not check existing stories:', error)
      return []
    }

    return stories?.map(story => story.id) || []
  }

  /**
   * Create batches of stories for processing
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  /**
   * Initialize statistics tracking
   */
  private initializeStats(): PopulationStats {
    return {
      by_category: {},
      by_location: {},
      by_impact_level: {},
      validation_scores: [],
      total_community_voices: 0,
      total_engagement: {
        views: 0,
        shares: 0,
        responses: 0
      }
    }
  }

  /**
   * Update statistics with batch data
   */
  private updateStats(stats: PopulationStats, stories: NewsroomStory[]): void {
    stories.forEach(story => {
      // Category stats
      stats.by_category[story.category] = (stats.by_category[story.category] || 0) + 1
      
      // Location stats
      stats.by_location[story.location] = (stats.by_location[story.location] || 0) + 1
      
      // Impact level stats
      stats.by_impact_level[story.impact_level] = (stats.by_impact_level[story.impact_level] || 0) + 1
      
      // Validation scores
      stats.validation_scores.push(story.validation_score)
      
      // Community voices
      stats.total_community_voices += story.community_voices.length
      
      // Engagement metrics
      stats.total_engagement.views += story.engagement_metrics.views
      stats.total_engagement.shares += story.engagement_metrics.shares
      stats.total_engagement.responses += story.engagement_metrics.community_responses
    })
  }

  /**
   * Add a batch of stories to the database
   */
  private async addStoriesBatch(stories: NewsroomStory[]): Promise<{ added: number; errors: string[] }> {
    const result = { added: 0, errors: [] }

    // Transform stories to match database schema
    const dbStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      content: story.content,
      author: story.author,
      category: story.category,
      tags: story.tags,
      location: story.location,
      impact_level: story.impact_level,
      published_date: story.published_date,
      featured_image: story.featured_image || null,
      organization: story.organization || null,
      validation_score: story.validation_score,
      metadata: {
        community_voices: story.community_voices,
        engagement_metrics: story.engagement_metrics,
        original_source: 'newsroom_population_service'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('articles')
      .insert(dbStories)
      .select()

    if (error) {
      console.error('Database error adding stories:', error)
      throw error
    }

    result.added = data?.length || 0
    return result
  }

  /**
   * Update newsroom metadata with population information
   */
  private async updateNewsroomMetadata(metadata: Record<string, any>): Promise<void> {
    try {
      // Store metadata in a dedicated table or in application state
      // For now, we'll log it and could store in a metadata table
      console.log('📊 Newsroom metadata updated:', metadata)
      
      // Could store in dedicated metadata table:
      // await supabase.from('newsroom_metadata').upsert({
      //   id: 'population_info',
      //   ...metadata
      // })
    } catch (error) {
      console.warn('Warning: Could not update newsroom metadata:', error)
    }
  }

  /**
   * Get newsroom population statistics
   */
  async getPopulationStatistics(): Promise<{
    total_stories: number
    by_category: Record<string, number>
    by_location: Record<string, number>
    by_impact_level: Record<string, number>
    avg_validation_score: number
    total_community_voices: number
    total_engagement: { views: number; shares: number; responses: number }
    last_populated?: string
  }> {
    try {
      const { data: stories, error } = await supabase
        .from('articles')
        .select('category, location, impact_level, validation_score, metadata')

      if (error) throw error

      const stats = {
        total_stories: stories?.length || 0,
        by_category: {} as Record<string, number>,
        by_location: {} as Record<string, number>,
        by_impact_level: {} as Record<string, number>,
        avg_validation_score: 0,
        total_community_voices: 0,
        total_engagement: { views: 0, shares: 0, responses: 0 }
      }

      if (!stories || stories.length === 0) return stats

      let totalValidationScore = 0
      
      stories.forEach(story => {
        // Category breakdown
        stats.by_category[story.category] = (stats.by_category[story.category] || 0) + 1
        
        // Location breakdown
        stats.by_location[story.location] = (stats.by_location[story.location] || 0) + 1
        
        // Impact level breakdown
        stats.by_impact_level[story.impact_level] = (stats.by_impact_level[story.impact_level] || 0) + 1
        
        // Validation scores
        totalValidationScore += story.validation_score || 0
        
        // Community voices and engagement from metadata
        if (story.metadata) {
          const metadata = typeof story.metadata === 'string' 
            ? JSON.parse(story.metadata) 
            : story.metadata
            
          if (metadata.community_voices) {
            stats.total_community_voices += metadata.community_voices.length || 0
          }
          
          if (metadata.engagement_metrics) {
            stats.total_engagement.views += metadata.engagement_metrics.views || 0
            stats.total_engagement.shares += metadata.engagement_metrics.shares || 0
            stats.total_engagement.responses += metadata.engagement_metrics.community_responses || 0
          }
        }
      })

      stats.avg_validation_score = totalValidationScore / stories.length

      return stats

    } catch (error) {
      console.error('Error getting population statistics:', error)
      throw error
    }
  }

  /**
   * Validate newsroom population quality
   */
  async validateNewsroomQuality(): Promise<{
    is_valid: boolean
    quality_score: number
    issues: string[]
    recommendations: string[]
  }> {
    try {
      const stats = await this.getPopulationStatistics()
      
      const validation = {
        is_valid: true,
        quality_score: 0,
        issues: [] as string[],
        recommendations: [] as string[]
      }

      // Check minimum story count
      if (stats.total_stories < 25) {
        validation.issues.push(`Only ${stats.total_stories} stories (minimum 25 recommended)`)
        validation.is_valid = false
      }

      // Check category diversity
      const categoryCount = Object.keys(stats.by_category).length
      if (categoryCount < 4) {
        validation.issues.push(`Only ${categoryCount} categories covered (minimum 4 recommended)`)
        validation.is_valid = false
      }

      // Check geographic diversity
      const locationCount = Object.keys(stats.by_location).length
      if (locationCount < 5) {
        validation.issues.push(`Only ${locationCount} locations covered (minimum 5 recommended)`)
        validation.recommendations.push('Add stories from more UK regions')
      }

      // Check validation score quality
      if (stats.avg_validation_score < 4.0) {
        validation.issues.push(`Average validation score ${stats.avg_validation_score.toFixed(1)} too low`)
        validation.recommendations.push('Review story quality and community validation')
      }

      // Calculate quality score (0-100)
      let qualityScore = 0
      qualityScore += Math.min(stats.total_stories / 25, 1) * 25 // Story count (25 points)
      qualityScore += Math.min(categoryCount / 5, 1) * 20 // Category diversity (20 points)
      qualityScore += Math.min(locationCount / 8, 1) * 20 // Location diversity (20 points)
      qualityScore += Math.min(stats.avg_validation_score / 5, 1) * 25 // Validation quality (25 points)
      qualityScore += Math.min(stats.total_community_voices / 100, 1) * 10 // Community voices (10 points)

      validation.quality_score = Math.round(qualityScore)

      return validation

    } catch (error) {
      console.error('Error validating newsroom quality:', error)
      return {
        is_valid: false,
        quality_score: 0,
        issues: [`Validation error: ${error.message}`],
        recommendations: ['Fix database connection and retry validation']
      }
    }
  }
}

export default new NewsroomPopulationService()