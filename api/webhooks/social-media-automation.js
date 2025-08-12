// Social Media Automation Hub
// Handles multi-platform distribution for Events, Newsroom, and Newsletter content
// Supports both n8n and Zapier integrations

const PLATFORMS = {
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram', 
  FACEBOOK: 'facebook',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter'
}

const CONTENT_TYPES = {
  EVENT: 'event',
  ARTICLE: 'article', 
  NEWSLETTER: 'newsletter',
  ANNOUNCEMENT: 'announcement'
}

// Environment configuration
const AUTOMATION_CONFIG = {
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL,
    enabled: !!process.env.N8N_WEBHOOK_URL
  },
  zapier: {
    webhookUrl: process.env.ZAPIER_WEBHOOK_URL,
    enabled: !!process.env.ZAPIER_WEBHOOK_URL
  },
  composio: {
    apiKey: process.env.COMPOSIO_API_KEY,
    enabled: !!process.env.COMPOSIO_API_KEY
  }
}

// Social media post templates
const POST_TEMPLATES = {
  [CONTENT_TYPES.EVENT]: {
    [PLATFORMS.LINKEDIN]: (event) => `
🎯 Community Event Alert! 

${event.title}

📅 ${new Date(event.date).toLocaleDateString()}
📍 ${event.location?.address || 'Online'}
🎪 ${event.organizer}

${event.description?.slice(0, 200)}...

This is exactly the kind of community building that transforms individual struggle into collective power.

Join us and be part of the liberation we're building together.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT

Register: ${event.registration_url || 'Link in bio'}
    `.trim(),

    [PLATFORMS.TWITTER]: (event) => `
🔥 ${event.title}

📅 ${new Date(event.date).toLocaleDateString()}
📍 ${event.location?.address || 'Online'}

${event.description?.slice(0, 100)}...

#BlackQueerMen #CommunityEvents #Liberation

${event.registration_url || ''}
    `.trim(),

    [PLATFORMS.FACEBOOK]: (event) => `
${event.title}

Date: ${new Date(event.date).toLocaleDateString()}
Location: ${event.location?.address || 'Online'}
Organizer: ${event.organizer}

${event.description}

This event serves our community's liberation by providing space for connection, growth, and collective action. 

Join us and contribute to the movement we're building together.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT

Register: ${event.registration_url || 'Link in bio'}
    `.trim(),

    [PLATFORMS.INSTAGRAM]: (event) => `
🎯 Community Event Alert! 

${event.title}

📅 ${new Date(event.date).toLocaleDateString()}
📍 ${event.location?.address || 'Online'}

${event.description?.slice(0, 150)}...

This is liberation work in practice. Join us and be part of the community we're building.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT #Community

Link in bio to register 👆
    `.trim()
  },

  [CONTENT_TYPES.ARTICLE]: {
    [PLATFORMS.LINKEDIN]: (article) => `
📰 New from BLKOUT Newsroom:

${article.title}

${article.excerpt}

This analysis contributes to our collective understanding of liberation strategies and community building approaches.

Read the full article and join the conversation about how we move from individual awareness to collective action.

#BlackQueerMen #Analysis #Liberation #BLKOUT #Community

Read: ${article.url || 'Link in bio'}
    `.trim(),

    [PLATFORMS.TWITTER]: (article) => `
📰 ${article.title}

${article.excerpt?.slice(0, 120)}...

#BlackQueerMen #Analysis #Liberation

Read: ${article.url || ''}
    `.trim(),

    [PLATFORMS.FACEBOOK]: (article) => `
📰 New Analysis from BLKOUT Newsroom

${article.title}

${article.excerpt}

Our newsroom exists to provide analysis that serves Black queer liberation - not just information, but understanding that leads to collective action.

Read the full article and share your thoughts on how this connects to our community's work.

#BlackQueerMen #Analysis #Liberation #BLKOUT #Community

${article.url || 'Link in bio'}
    `.trim()
  }
}

// Content optimization for each platform
function optimizeContentForPlatform(content, platform, contentType) {
  const template = POST_TEMPLATES[contentType]?.[platform]
  if (!template) {
    return `New ${contentType}: ${content.title}\n\n${content.description || content.excerpt || ''}`
  }
  
  return template(content)
}

// Generate hashtags based on content
function generateHashtags(content, contentType) {
  const baseHashtags = ['#BlackQueerMen', '#Liberation', '#BLKOUT']
  const contentHashtags = []
  
  if (contentType === CONTENT_TYPES.EVENT) {
    contentHashtags.push('#CommunityEvents', '#Community')
    if (content.category) {
      contentHashtags.push(`#${content.category.replace(/\s+/g, '')}`)
    }
  } else if (contentType === CONTENT_TYPES.ARTICLE) {
    contentHashtags.push('#Analysis', '#Newsroom')
    if (content.category) {
      contentHashtags.push(`#${content.category.replace(/\s+/g, '')}`)
    }
  }
  
  // Add tags from content
  if (content.tags && Array.isArray(content.tags)) {
    content.tags.slice(0, 3).forEach(tag => {
      contentHashtags.push(`#${tag.replace(/\s+/g, '')}`)
    })
  }
  
  return [...baseHashtags, ...contentHashtags].slice(0, 10) // Limit hashtags
}

// Trigger n8n workflow for social media
async function triggerN8nSocialWorkflow(contentType, content, platforms = Object.values(PLATFORMS)) {
  if (!AUTOMATION_CONFIG.n8n.enabled) {
    console.log('n8n not configured for social media automation')
    return { success: false, reason: 'n8n not configured' }
  }

  try {
    const webhookUrl = `${AUTOMATION_CONFIG.n8n.webhookUrl}/social-media-post`
    
    const socialPosts = platforms.map(platform => ({
      platform,
      content: optimizeContentForPlatform(content, platform, contentType),
      hashtags: generateHashtags(content, contentType),
      scheduledTime: content.scheduledTime || null,
      urgent: content.urgent || false
    }))

    const payload = {
      workflow: 'social-media-distribution',
      contentType,
      originalContent: content,
      socialPosts,
      timestamp: new Date().toISOString(),
      source: 'blkout-social-automation'
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Source': 'blkout-social'
      },
      body: JSON.stringify(payload)
    })

    return {
      success: response.ok,
      status: response.status,
      platforms: platforms,
      postsCreated: socialPosts.length
    }
  } catch (error) {
    console.error('n8n social automation error:', error)
    return { success: false, error: error.message }
  }
}

// Trigger Zapier workflow for social media
async function triggerZapierSocialWorkflow(contentType, content, platforms = Object.values(PLATFORMS)) {
  if (!AUTOMATION_CONFIG.zapier.enabled) {
    console.log('Zapier not configured for social media automation')
    return { success: false, reason: 'Zapier not configured' }
  }

  try {
    const payload = {
      content_type: contentType,
      title: content.title,
      description: content.description || content.excerpt || '',
      url: content.url || content.registration_url || '',
      platforms: platforms.join(','),
      hashtags: generateHashtags(content, contentType).join(' '),
      scheduled_time: content.scheduledTime || null,
      urgent: content.urgent || false,
      source: 'blkout'
    }

    const response = await fetch(AUTOMATION_CONFIG.zapier.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    return {
      success: response.ok,
      status: response.status,
      platforms: platforms,
      zapTriggered: true
    }
  } catch (error) {
    console.error('Zapier social automation error:', error)
    return { success: false, error: error.message }
  }
}

// Trigger Composio API for social media
async function triggerComposioSocialWorkflow(contentType, content, platforms = Object.values(PLATFORMS)) {
  if (!AUTOMATION_CONFIG.composio.enabled) {
    console.log('Composio not configured for social media automation')
    return { success: false, reason: 'Composio not configured' }
  }

  try {
    // Composio API integration for direct social media posting
    const socialPosts = platforms.map(platform => ({
      platform,
      content: optimizeContentForPlatform(content, platform, contentType),
      hashtags: generateHashtags(content, contentType)
    }))

    const results = []
    
    for (const post of socialPosts) {
      try {
        const response = await fetch('https://api.composio.dev/v1/actions/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': AUTOMATION_CONFIG.composio.apiKey
          },
          body: JSON.stringify({
            action: `${post.platform}_create_post`,
            params: {
              content: post.content,
              hashtags: post.hashtags.join(' ')
            }
          })
        })
        
        results.push({
          platform: post.platform,
          success: response.ok,
          status: response.status
        })
      } catch (error) {
        results.push({
          platform: post.platform,
          success: false,
          error: error.message
        })
      }
    }

    return {
      success: results.some(r => r.success),
      results: results,
      composioUsed: true
    }
  } catch (error) {
    console.error('Composio social automation error:', error)
    return { success: false, error: error.message }
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
      const { contentType, content, platforms = Object.values(PLATFORMS), automationTool = 'auto' } = req.body

      if (!contentType || !content) {
        return res.status(400).json({
          success: false,
          error: 'contentType and content are required'
        })
      }

      if (!Object.values(CONTENT_TYPES).includes(contentType)) {
        return res.status(400).json({
          success: false,
          error: `Invalid contentType. Must be one of: ${Object.values(CONTENT_TYPES).join(', ')}`
        })
      }

      const results = {}

      // Determine which automation tools to use
      if (automationTool === 'auto' || automationTool === 'all') {
        // Try all available tools
        if (AUTOMATION_CONFIG.n8n.enabled) {
          results.n8n = await triggerN8nSocialWorkflow(contentType, content, platforms)
        }
        if (AUTOMATION_CONFIG.zapier.enabled) {
          results.zapier = await triggerZapierSocialWorkflow(contentType, content, platforms)
        }
        if (AUTOMATION_CONFIG.composio.enabled) {
          results.composio = await triggerComposioSocialWorkflow(contentType, content, platforms)
        }
      } else {
        // Use specific tool
        switch (automationTool) {
          case 'n8n':
            results.n8n = await triggerN8nSocialWorkflow(contentType, content, platforms)
            break
          case 'zapier':
            results.zapier = await triggerZapierSocialWorkflow(contentType, content, platforms)
            break
          case 'composio':
            results.composio = await triggerComposioSocialWorkflow(contentType, content, platforms)
            break
          default:
            return res.status(400).json({
              success: false,
              error: 'Invalid automationTool. Must be one of: auto, all, n8n, zapier, composio'
            })
        }
      }

      const overallSuccess = Object.values(results).some(result => result?.success)

      return res.status(200).json({
        success: overallSuccess,
        contentType,
        platforms,
        automationResults: results,
        socialPosts: {
          generated: platforms.length,
          platforms: platforms
        },
        timestamp: new Date().toISOString()
      })
    }

    if (req.method === 'GET') {
      // Get automation configuration and status
      return res.status(200).json({
        success: true,
        automation: {
          available: AUTOMATION_CONFIG,
          platforms: PLATFORMS,
          contentTypes: CONTENT_TYPES,
          templates: {
            available: Object.keys(POST_TEMPLATES),
            example: POST_TEMPLATES[CONTENT_TYPES.EVENT][PLATFORMS.LINKEDIN]({
              title: 'Example Community Event',
              description: 'An example of how our community comes together...',
              date: new Date(),
              location: { address: 'Community Center, London' },
              organizer: 'BLKOUT Community',
              registration_url: 'https://example.com'
            })
          }
        },
        usage: {
          description: 'Send POST requests with contentType, content, and optional platforms array',
          endpoints: {
            events: 'Content from events calendar',
            articles: 'Content from newsroom',
            newsletters: 'Digest and newsletter content',
            announcements: 'Community announcements'
          },
          example: {
            contentType: 'event',
            content: {
              title: 'Community Healing Circle',
              description: 'A safe space for collective healing and growth',
              date: '2025-02-15',
              location: { address: 'Community Center, London' },
              organizer: 'BLKOUT Healing Collective',
              registration_url: 'https://events.blkoutuk.com/healing-circle'
            },
            platforms: ['linkedin', 'twitter', 'facebook'],
            automationTool: 'auto'
          }
        }
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Social media automation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}