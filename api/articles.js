// Vercel serverless function to handle articles with real storage
let articles = [
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
    if (req.method === 'GET') {
      // Return all articles
      console.log('Returning articles:', articles.length)
      res.status(200).json({
        success: true,
        articles: articles,
        total: articles.length
      })
    }
    else if (req.method === 'POST') {
      // Create new article
      const articleData = req.body
      console.log('Creating new article:', articleData)
      
      const newArticle = {
        id: `art_${Date.now()}`,
        ...articleData,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        status: articleData.status || 'draft'
      }
      
      articles.push(newArticle)
      console.log('Article created successfully:', newArticle.id)
      
      res.status(201).json({
        success: true,
        article: newArticle,
        message: 'Article created successfully'
      })
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
      
      articles[articleIndex] = {
        ...articles[articleIndex],
        ...articleData,
        updatedAt: new Date().toISOString()
      }
      
      res.status(200).json({
        success: true,
        article: articles[articleIndex],
        message: 'Article updated successfully'
      })
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
      
      articles.splice(articleIndex, 1)
      
      res.status(200).json({
        success: true,
        message: 'Article deleted successfully'
      })
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