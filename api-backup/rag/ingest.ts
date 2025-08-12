import { NextApiRequest, NextApiResponse } from 'next'
import { BlkoutRAGService } from '../../lib/rag/core'

const ragService = new BlkoutRAGService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    await ragService.initialize()

    if (req.method === 'POST') {
      const { sources, content } = req.body

      if (sources) {
        // Batch content discovery from multiple sources
        const results = []
        
        for (const source of sources) {
          try {
            console.log(`Processing source: ${source.url}`)
            
            // Discover content from source
            const rawContent = await ragService.discoverContent(source)
            
            // Process each piece of content
            for (const item of rawContent) {
              try {
                // Generate unique ID
                item.id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                item.sourceId = source.id
                
                // Classify content
                const classified = await ragService.classifyContent(item)
                
                // Validate content
                const validation = await ragService.validateContent(classified)
                
                if (validation.isValid) {
                  // Store content
                  await ragService.storeContent(classified)
                  
                  // Process for auto-approval
                  const autoApproved = await ragService.processForAutoApproval(classified, validation)
                  
                  results.push({
                    id: item.id,
                    title: item.title,
                    category: classified.category,
                    relevanceScore: classified.relevanceScore,
                    validationScore: validation.score,
                    autoApproved,
                    issues: validation.issues,
                    status: autoApproved ? 'published' : 'pending_review'
                  })
                  
                  console.log(`Successfully processed: ${item.title}`)
                } else {
                  console.log(`Content failed validation: ${item.title}`, validation.issues)
                  results.push({
                    id: item.id,
                    title: item.title,
                    status: 'rejected',
                    issues: validation.issues
                  })
                }
              } catch (error) {
                console.error(`Error processing content item: ${item.title}`, error)
                results.push({
                  id: item.id || 'unknown',
                  title: item.title || 'Unknown',
                  status: 'error',
                  error: error.message
                })
              }
            }
            
            console.log(`Completed processing source: ${source.url}`)
          } catch (error) {
            console.error(`Error processing source: ${source.url}`, error)
            results.push({
              source: source.url,
              status: 'source_error',
              error: error.message
            })
          }
        }
        
        res.status(200).json({
          success: true,
          message: `Processed ${results.length} content items`,
          results,
          summary: {
            total: results.length,
            published: results.filter(r => r.status === 'published').length,
            pending: results.filter(r => r.status === 'pending_review').length,
            rejected: results.filter(r => r.status === 'rejected').length,
            errors: results.filter(r => r.status === 'error').length
          }
        })
      } 
      else if (content) {
        // Single content item processing
        try {
          // Generate unique ID
          content.id = content.id || `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          // Classify content
          const classified = await ragService.classifyContent(content)
          
          // Validate content
          const validation = await ragService.validateContent(classified)
          
          if (validation.isValid) {
            // Store content
            await ragService.storeContent(classified)
            
            // Process for auto-approval
            const autoApproved = await ragService.processForAutoApproval(classified, validation)
            
            res.status(200).json({
              success: true,
              content: {
                id: content.id,
                title: content.title,
                category: classified.category,
                subcategory: classified.subcategory,
                relevanceScore: classified.relevanceScore,
                confidenceScore: classified.confidenceScore,
                aiTags: classified.aiTags,
                validationScore: validation.score,
                autoApproved,
                status: autoApproved ? 'published' : 'pending_review',
                issues: validation.issues,
                recommendations: validation.recommendations
              }
            })
          } else {
            res.status(400).json({
              success: false,
              error: 'Content failed validation',
              issues: validation.issues,
              recommendations: validation.recommendations,
              score: validation.score
            })
          }
        } catch (error) {
          console.error('Error processing single content item:', error)
          res.status(500).json({
            success: false,
            error: 'Error processing content',
            message: error.message
          })
        }
      } else {
        res.status(400).json({
          success: false,
          error: 'Missing content or sources in request body'
        })
      }
    }
    else if (req.method === 'GET') {
      // Get processing status/statistics
      try {
        // This would typically query the database for statistics
        // For now, return basic service status
        res.status(200).json({
          success: true,
          service: 'BLKOUT Agentic RAG System',
          status: 'operational',
          version: '1.0.0',
          capabilities: [
            'Content Discovery',
            'AI Classification', 
            'Quality Validation',
            'Auto-Approval',
            'Semantic Search',
            'Community Relevance Scoring'
          ]
        })
      } catch (error) {
        console.error('Error getting service status:', error)
        res.status(500).json({
          success: false,
          error: 'Error retrieving service status',
          message: error.message
        })
      }
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('RAG ingestion API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}