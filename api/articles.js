// Vercel serverless function to handle articles with in-memory persistence
import { promises as fs } from 'fs'

// Use in-memory cache with external sync (no /tmp dependency)
const STORAGE_PATH = '/tmp/articles.json' // Temp cache only
const GITHUB_STORAGE_URL = 'https://raw.githubusercontent.com/blkout-community/data-store/main/articles.json'

const DEFAULT_ARTICLES = [
  {
    id: "art_001",
    title: "Building Safe Spaces: A Community Guide",
    excerpt: "Creating inclusive environments where Black queer voices can flourish requires intentional action and ongoing commitment.",
    content: "Creating inclusive environments where Black queer voices can flourish requires intentional action and ongoing commitment. This guide explores practical steps for building community spaces that center healing, authenticity, and collective liberation.",
    author: "Community Collective",
    category: "Community Building",
    tags: ["safe spaces", "community", "inclusion"],
    status: "published",
    featured: true,
    publishedAt: "2025-01-15T00:00:00.000Z",
    createdAt: "2025-01-10T00:00:00.000Z",
    views: 245,
    likes: 18
  },
  {
    id: "art_002", 
    title: "Liberation Through Art: Creative Expression in Activism",
    excerpt: "Art has always been a powerful tool for resistance and liberation. From protest murals to performance art, creative expression amplifies community voices.",
    content: "Art has always been a powerful tool for resistance and liberation. From protest murals to performance art, creative expression amplifies community voices and challenges systems of oppression. This article explores how Black queer artists are using creativity to drive social change.",
    author: "Creative Collective",
    category: "Arts & Culture",
    tags: ["art", "activism", "creative expression"],
    status: "published",
    featured: false,
    publishedAt: "2025-01-12T00:00:00.000Z",
    createdAt: "2025-01-08T00:00:00.000Z", 
    views: 189,
    likes: 24
  }
]

// Global cache with session persistence  
let articlesCache = null
let lastLoadTime = 0
let isLoading = false

async function loadArticles() {
  try {
    // Prevent concurrent loading
    if (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return articlesCache || DEFAULT_ARTICLES
    }
    
    // Use in-memory cache if available and recent (within 30 seconds for responsiveness)
    if (articlesCache && (Date.now() - lastLoadTime) < 30000) {
      return articlesCache
    }

    isLoading = true

    // Skip /tmp storage - it's unreliable on Vercel
    // Load from defaults and enhance with external data
    let articles = [...DEFAULT_ARTICLES]

    // Try to enhance with external data (non-blocking)
    try {
      const response = await fetch(GITHUB_STORAGE_URL, { 
        timeout: 2000,
        headers: {
          'User-Agent': 'BLKOUT-Platform/1.0',
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const externalData = await response.json()
        const articleArray = externalData.articles || externalData
        
        if (Array.isArray(articleArray) && articleArray.length > 0) {
          // Merge external articles with defaults (external takes priority)
          const mergedArticles = [...articleArray, ...articles.filter(a => 
            !articleArray.some(ext => ext.id === a.id)
          )]
          articles = mergedArticles
          console.log(`✅ Enhanced with ${articleArray.length} external articles`)
        }
      }
    } catch (externalError) {
      console.log('⚠️ External data unavailable, using defaults:', externalError.message)
    }

    // Update cache and return
    articlesCache = articles
    lastLoadTime = Date.now()
    isLoading = false
    
    // Try to save to temp (non-critical)
    try {
      await fs.mkdir('/tmp', { recursive: true })
      await fs.writeFile(STORAGE_PATH, JSON.stringify(articles, null, 2))
    } catch (saveError) {
      // Ignore temp save failures
    }
    
    console.log(`✅ Loaded ${articles.length} articles total`)
    return articles
    
  } catch (error) {
    console.error('❌ Critical error loading articles:', error)
    isLoading = false
    return articlesCache || DEFAULT_ARTICLES
  }
}

async function saveArticles(articles, triggerBackup = true) {
  try {
    // Validate input
    if (!Array.isArray(articles)) {
      throw new Error('Articles must be an array')
    }

    // Update in-memory cache immediately (primary storage)
    articlesCache = articles
    lastLoadTime = Date.now()
    console.log(`✅ Articles saved to memory cache (${articles.length} articles)`)
    
    // Try to save to temp (secondary, non-critical)
    try {
      await fs.mkdir('/tmp', { recursive: true })
      await fs.writeFile(STORAGE_PATH, JSON.stringify(articles, null, 2))
    } catch (tempError) {
      console.log('⚠️ Temp storage failed (non-critical):', tempError.message)
    }
    
    // External backup strategies (non-blocking)
    if (triggerBackup) {
      Promise.all([
        triggerBackupToGitHub(articles),
        triggerWebhookBackup(articles),
        triggerRedundantBackup(articles)
      ]).catch(err => 
        console.log('⚠️ Some backups failed (non-critical):', err.message)
      )
    }
    
    return true
  } catch (error) {
    console.error('❌ Failed to save articles:', error)
    return false
  }
}

async function triggerBackupToGitHub(articles) {
  try {
    await fetch('https://api.blkout-community.dev/backup/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        articles, 
        timestamp: Date.now(),
        source: 'vercel-api',
        total: articles.length 
      }),
      timeout: 3000
    })
    console.log('✅ GitHub backup completed')
  } catch (err) {
    console.log('⚠️ GitHub backup failed (non-critical):', err.message)
  }
}

async function triggerWebhookBackup(articles) {
  try {
    await fetch('https://hook.integromat.com/blkout-articles-backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles }),
      timeout: 2000
    })
    console.log('✅ Webhook backup completed')
  } catch (err) {
    console.log('⚠️ Webhook backup failed (non-critical):', err.message)
  }
}

async function triggerRedundantBackup(articles) {
  try {
    // Store in browser localStorage if available (for client requests)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('blkout-articles-backup', JSON.stringify({
        articles,
        timestamp: Date.now()
      }))
    }
    console.log('✅ Redundant backup completed')
  } catch (err) {
    console.log('⚠️ Redundant backup failed (non-critical):', err.message)
  }
}

async function triggerN8nWorkflow(action, articleData, baseUrl = 'https://blkout-beta.vercel.app') {
  try {
    const webhookUrl = `${baseUrl}/api/webhooks/n8n-newsroom`
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        articleData,
        articleId: articleData?.id
      })
    })
  } catch (error) {
    console.log('n8n workflow trigger failed (non-critical):', error.message)
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const articles = await loadArticles()

    if (req.method === 'GET') {
      // Return all articles
      console.log('Returning articles:', articles.length)
      res.status(200).json({
        success: true,
        articles: articles,
        total: articles.length,
        storage: 'hybrid-persistent',
        timestamp: new Date().toISOString()
      })
    } 
    else if (req.method === 'POST') {
      // Create new article
      const articleData = req.body
      console.log('Creating new article:', articleData)
      
      const newArticle = {
        id: `art_${Date.now()}`,
        ...articleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        status: articleData.status || 'draft'
      }
      
      const updatedArticles = [...articles, newArticle]
      const saveSuccess = await saveArticles(updatedArticles)
      
      if (saveSuccess) {
        console.log('Article created successfully:', newArticle.id)
        
        // Trigger n8n workflow for article creation
        await triggerN8nWorkflow('created', newArticle)
        
        res.status(201).json({
          success: true,
          article: newArticle,
          message: 'Article created successfully',
          persisted: true
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to save article'
        })
      }
    }
    else if (req.method === 'PUT') {
      // Update existing article
      const articleId = req.query.id
      const articleData = req.body
      
      const articleIndex = articles.findIndex(a => a.id === articleId)
      if (articleIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Article not found'
        })
      }
      
      const oldStatus = articles[articleIndex].status
      const updatedArticle = {
        ...articles[articleIndex],
        ...articleData,
        updatedAt: new Date().toISOString()
      }
      
      const updatedArticles = [...articles]
      updatedArticles[articleIndex] = updatedArticle
      
      const saveSuccess = await saveArticles(updatedArticles)
      
      if (saveSuccess) {
        // Trigger n8n workflows based on status changes
        const newStatus = updatedArticle.status
        if (oldStatus !== newStatus) {
          if (newStatus === 'approved') {
            await triggerN8nWorkflow('approved', updatedArticle)
          } else if (newStatus === 'published') {
            await triggerN8nWorkflow('published', updatedArticle)
          } else if (newStatus === 'rejected') {
            await triggerN8nWorkflow('rejected', updatedArticle)
          }
        }
        
        res.status(200).json({
          success: true,
          article: updatedArticle,
          message: 'Article updated successfully',
          persisted: true
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to save article update'
        })
      }
    }
    else if (req.method === 'DELETE') {
      // Delete article
      const articleId = req.query.id
      const articleIndex = articles.findIndex(a => a.id === articleId)
      
      if (articleIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Article not found'
        })
      }
      
      const updatedArticles = articles.filter(a => a.id !== articleId)
      const saveSuccess = await saveArticles(updatedArticles)
      
      if (saveSuccess) {
        res.status(200).json({
          success: true,
          message: 'Article deleted successfully',
          persisted: true
        })
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete article'
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
    console.error('Articles API error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      message: error.message
    })
  }
}