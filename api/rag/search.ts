import { NextApiRequest, NextApiResponse } from 'next'
import { BlkoutRAGService } from '../../lib/rag/core'

const ragService = new BlkoutRAGService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    await ragService.initialize()

    if (req.method === 'GET') {
      const { q, query, category, limit, threshold } = req.query
      
      const searchQuery = (q || query) as string
      if (!searchQuery) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter "q" or "query" is required'
        })
      }

      // Build filters
      const filters: any = {}
      if (category) {
        filters.category = category
      }

      // Perform semantic search
      const results = await ragService.searchContent(searchQuery, filters)
      
      // Filter by similarity threshold if specified
      const similarityThreshold = threshold ? parseFloat(threshold as string) : 0.7
      const filteredResults = results.filter(result => 
        (1 - result.distance) >= similarityThreshold
      )

      // Limit results
      const maxResults = limit ? parseInt(limit as string) : 10
      const limitedResults = filteredResults.slice(0, maxResults)

      // Enhance results with similarity scores and community relevance
      const enhancedResults = limitedResults.map(result => ({
        id: result.id,
        title: result.title,
        category: result.category,
        excerpt: result.content.slice(0, 200) + '...',
        similarity: Math.round((1 - result.distance) * 100) / 100,
        relevanceScore: result.relevanceScore,
        communityRelevant: result.relevanceScore >= 0.6,
        url: result.metadata?.url || null,
        publishedAt: result.metadata?.publishedAt || null,
        tags: result.metadata?.tags ? JSON.parse(result.metadata.tags) : []
      }))

      res.status(200).json({
        success: true,
        query: searchQuery,
        results: enhancedResults,
        total: enhancedResults.length,
        filters: filters,
        threshold: similarityThreshold
      })
    }
    else if (req.method === 'POST') {
      const { query, filters, options } = req.body

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required in request body'
        })
      }

      // Advanced search with multiple options
      const searchOptions = {
        limit: options?.limit || 20,
        threshold: options?.threshold || 0.6,
        includeContent: options?.includeContent || false,
        enhanceWithAI: options?.enhanceWithAI || false
      }

      const results = await ragService.searchContent(query, filters)
      
      // Filter by threshold
      const filteredResults = results.filter(result => 
        (1 - result.distance) >= searchOptions.threshold
      )

      // Limit results
      const limitedResults = filteredResults.slice(0, searchOptions.limit)

      // Enhanced processing
      const enhancedResults = await Promise.all(
        limitedResults.map(async (result) => {
          const enhanced: any = {
            id: result.id,
            title: result.title,
            category: result.category,
            excerpt: result.content.slice(0, 300) + '...',
            similarity: Math.round((1 - result.distance) * 100) / 100,
            relevanceScore: result.relevanceScore,
            communityRelevant: result.relevanceScore >= 0.6,
            url: result.metadata?.url || null,
            publishedAt: result.metadata?.publishedAt || null,
            tags: result.metadata?.tags ? JSON.parse(result.metadata.tags) : []
          }

          // Include full content if requested
          if (searchOptions.includeContent) {
            enhanced.fullContent = result.content
          }

          // AI enhancement (summary, key points, etc.)
          if (searchOptions.enhanceWithAI) {
            try {
              enhanced.aiSummary = await this.generateAISummary(result.content)
              enhanced.keyPoints = await this.extractKeyPoints(result.content)
            } catch (error) {
              console.error('Error in AI enhancement:', error)
            }
          }

          return enhanced
        })
      )

      res.status(200).json({
        success: true,
        query,
        results: enhancedResults,
        total: enhancedResults.length,
        filters: filters || {},
        options: searchOptions
      })
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('RAG search API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}

// Helper function to generate AI summary
async function generateAISummary(content: string): Promise<string> {
  try {
    const openai = new (await import('openai')).default({
      apiKey: process.env.OPENAI_API_KEY || ''
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Provide a concise 2-3 sentence summary of this content for the BLKOUT community:

${content.slice(0, 1500)}

Focus on key points relevant to Black queer liberation, community organizing, or social justice.`
      }],
      temperature: 0.3,
      max_tokens: 150
    })

    return response.choices[0].message.content || 'Unable to generate summary'
  } catch (error) {
    console.error('Error generating AI summary:', error)
    return 'Summary unavailable'
  }
}

// Helper function to extract key points
async function extractKeyPoints(content: string): Promise<string[]> {
  try {
    const openai = new (await import('openai')).default({
      apiKey: process.env.OPENAI_API_KEY || ''
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Extract 3-5 key points from this content for the BLKOUT community:

${content.slice(0, 1500)}

Return as a JSON array of strings: ["point1", "point2", "point3"]

Focus on actionable insights, important facts, or community-relevant information.`
      }],
      temperature: 0.2,
      max_tokens: 200
    })

    const points = JSON.parse(response.choices[0].message.content || '[]')
    return Array.isArray(points) ? points : []
  } catch (error) {
    console.error('Error extracting key points:', error)
    return []
  }
}