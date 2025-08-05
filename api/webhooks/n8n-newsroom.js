// n8n Webhook Integration for Newsroom
// Handles automated workflows for article processing

import fs from 'fs/promises'
import path from 'path'

const STORAGE_PATH = '/tmp/articles.json'
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || null

// n8n workflow triggers
const N8N_WORKFLOWS = {
  ARTICLE_CREATED: 'article-created',
  ARTICLE_APPROVED: 'article-approved',
  ARTICLE_PUBLISHED: 'article-published', 
  ARTICLE_REJECTED: 'article-rejected',
  ARTICLE_UPDATED: 'article-updated',
  ARTICLE_ARCHIVED: 'article-archived'
}

async function loadArticles() {
  try {
    const data = await fs.readFile(STORAGE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveArticles(articles) {
  try {
    await fs.writeFile(STORAGE_PATH, JSON.stringify(articles, null, 2))
  } catch (error) {
    console.error('Error saving articles:', error)
  }
}

async function triggerN8nWorkflow(workflowType, articleData) {
  if (!N8N_WEBHOOK_URL) {
    console.log('n8n webhook URL not configured')
    return
  }

  try {
    const webhookUrl = `${N8N_WEBHOOK_URL}/${workflowType}`
    
    const payload = {
      workflow: workflowType,
      timestamp: new Date().toISOString(),
      article: articleData,
      source: 'blkout-newsroom-api'
    }

    console.log(`Triggering n8n workflow: ${workflowType}`)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Source': 'blkout-newsroom'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log(`n8n workflow ${workflowType} triggered successfully`)
    } else {
      console.error(`n8n workflow ${workflowType} failed:`, response.status)
    }
  } catch (error) {
    console.error(`Error triggering n8n workflow ${workflowType}:`, error)
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const { action, articleId, articleData } = req.body

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required'
        })
      }

      const articles = await loadArticles()
      let targetArticle = null
      
      if (articleId) {
        targetArticle = articles.find(a => a.id === articleId)
        if (!targetArticle) {
          return res.status(404).json({
            success: false,
            error: 'Article not found'
          })
        }
      }

      // Handle different n8n workflow triggers
      switch (action) {
        case 'created':
          if (articleData) {
            // New article created - trigger creation workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.ARTICLE_CREATED, articleData)
            
            // Auto-workflows that could run:
            // - Content analysis and categorization
            // - Fact-checking initiation
            // - SEO optimization
            // - Related articles detection
            // - Social media preparation
          }
          break

        case 'approved':
          if (targetArticle) {
            targetArticle.status = 'approved'
            targetArticle.approvedAt = new Date().toISOString()
            await saveArticles(articles)
            
            // Trigger approval workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.ARTICLE_APPROVED, targetArticle)
            
            // Could trigger:
            // - Editorial review completion
            // - SEO meta tags generation
            // - Social media post preparation
            // - Newsletter queue addition
            // - Author notification
          }
          break

        case 'published':
          if (targetArticle) {
            targetArticle.status = 'published'
            targetArticle.publishedAt = new Date().toISOString()
            await saveArticles(articles)
            
            // Trigger publication workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.ARTICLE_PUBLISHED, targetArticle)
            
            // Could trigger:
            // - Website cache invalidation
            // - Social media cross-posting
            // - Newsletter inclusion
            // - RSS feed update
            // - Search engine indexing
            // - Community notifications
            // - Analytics tracking setup
          }
          break

        case 'updated':
          if (targetArticle && articleData) {
            // Merge updates
            Object.assign(targetArticle, articleData, {
              updatedAt: new Date().toISOString()
            })
            await saveArticles(articles)
            
            // Trigger update workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.ARTICLE_UPDATED, targetArticle)
            
            // Could trigger:
            // - Change tracking
            // - Re-indexing for search
            // - Social media update posts
            // - Subscriber notifications for major updates
          }
          break

        case 'rejected':
          if (targetArticle) {
            targetArticle.status = 'rejected'
            targetArticle.rejectedAt = new Date().toISOString()
            await saveArticles(articles)
            
            // Trigger rejection workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.ARTICLE_REJECTED, targetArticle)
            
            // Could trigger:
            // - Author feedback email
            // - Editorial comments compilation
            // - Resubmission guidelines
            // - Alternative content suggestions
          }
          break

        case 'archived':
          if (targetArticle) {
            targetArticle.status = 'archived'
            targetArticle.archivedAt = new Date().toISOString()
            await saveArticles(articles)
            
            // Trigger archival workflow
            await triggerN8nWorkflow(N8N_WORKFLOWS.ARTICLE_ARCHIVED, targetArticle)
            
            // Could trigger:
            // - Search index removal
            // - Social media post deletion
            // - Backup to long-term storage
            // - Analytics data preservation
          }
          break

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid action'
          })
      }

      return res.status(200).json({
        success: true,
        message: `Article ${action} workflow triggered`,
        article: targetArticle || articleData,
        workflows: {
          triggered: action,
          available: Object.values(N8N_WORKFLOWS)
        }
      })
    }

    if (req.method === 'GET') {
      // Get workflow status and configuration
      return res.status(200).json({
        success: true,
        n8n: {
          configured: !!N8N_WEBHOOK_URL,
          webhookUrl: N8N_WEBHOOK_URL ? `${N8N_WEBHOOK_URL.split('/').slice(0, -1).join('/')}/***` : null,
          workflows: N8N_WORKFLOWS
        },
        usage: {
          description: 'Send POST requests with action and articleId/articleData to trigger n8n workflows',
          actions: ['created', 'approved', 'published', 'updated', 'rejected', 'archived'],
          example: {
            action: 'published',
            articleId: 'article-123'
          }
        }
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('n8n newsroom webhook error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}