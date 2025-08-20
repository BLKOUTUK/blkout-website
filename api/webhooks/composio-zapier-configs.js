// Composio & Zapier Integration Configurations
// Complete setup guides and implementation examples for both approaches

// ======================
// COMPOSIO INTEGRATION  
// ======================

export const ComposioConfig = {
  // Base configuration
  API_BASE: 'https://api.composio.dev/v1',
  
  // Required environment variables
  requiredEnvVars: [
    'COMPOSIO_API_KEY',
    // Platform-specific credentials still needed for OAuth
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET', 
    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET',
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'INSTAGRAM_APP_ID',
    'YOUTUBE_CLIENT_ID'
  ],

  // Composio Action Mappings
  actions: {
    linkedin: {
      post: 'linkedin_create_post',
      share: 'linkedin_share_content',
      comment: 'linkedin_add_comment'
    },
    facebook: {
      post: 'facebook_create_post',
      page_post: 'facebook_create_page_post',
      event: 'facebook_create_event'
    },
    instagram: {
      post: 'instagram_create_post',
      story: 'instagram_create_story',
      reel: 'instagram_create_reel'
    },
    twitter: {
      tweet: 'twitter_create_tweet',
      thread: 'twitter_create_thread',
      retweet: 'twitter_retweet'
    },
    youtube: {
      community_post: 'youtube_create_community_post',
      upload: 'youtube_upload_video',
      comment: 'youtube_add_comment'
    }
  }
}

// Composio Authentication Setup
export class ComposioAuthManager {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = ComposioConfig.API_BASE
  }

  // Initialize platform connections
  async initializePlatformAuth(platform, credentials) {
    try {
      const authResponse = await fetch(`${this.baseUrl}/integrations/${platform}/auth`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          redirect_uri: credentials.redirect_uri || `${process.env.VERCEL_URL}/api/webhooks/composio-callback`
        })
      })

      if (authResponse.ok) {
        const result = await authResponse.json()
        return {
          success: true,
          auth_url: result.authorization_url,
          state: result.state
        }
      }

      return {
        success: false,
        error: await authResponse.text()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Handle OAuth callback
  async handleAuthCallback(platform, authCode, state) {
    try {
      const tokenResponse = await fetch(`${this.baseUrl}/integrations/${platform}/token`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: authCode,
          state: state
        })
      })

      if (tokenResponse.ok) {
        const tokens = await tokenResponse.json()
        return {
          success: true,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at
        }
      }

      return {
        success: false,
        error: await tokenResponse.text()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Composio Action Executor
export class ComposioActionExecutor {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = ComposioConfig.API_BASE
  }

  async executeAction(platform, action, params, integrationId) {
    try {
      const actionKey = ComposioConfig.actions[platform]?.[action]
      if (!actionKey) {
        throw new Error(`Action ${action} not supported for platform ${platform}`)
      }

      const response = await fetch(`${this.baseUrl}/actions/execute`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: actionKey,
          params: params,
          integration_id: integrationId
        })
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          data: result,
          platform: platform,
          action: action
        }
      }

      return {
        success: false,
        error: await response.text(),
        platform: platform
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        platform: platform
      }
    }
  }

  // Multi-platform post execution
  async postToMultiplePlatforms(contentType, content, platforms, integrationIds) {
    const results = []
    
    for (const platform of platforms) {
      try {
        const params = this.formatContentForPlatform(content, contentType, platform)
        const integrationId = integrationIds[platform]
        
        if (!integrationId) {
          results.push({
            success: false,
            platform: platform,
            error: 'No integration ID provided'
          })
          continue
        }

        const result = await this.executeAction(platform, 'post', params, integrationId)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          platform: platform,
          error: error.message
        })
      }
    }

    return {
      success: results.some(r => r.success),
      results: results,
      posted_to: results.filter(r => r.success).map(r => r.platform)
    }
  }

  formatContentForPlatform(content, contentType, platform) {
    // Use existing template logic from social-media-automation.js
    const templates = {
      linkedin: this.formatForLinkedIn(content, contentType),
      facebook: this.formatForFacebook(content, contentType),
      instagram: this.formatForInstagram(content, contentType),
      twitter: this.formatForTwitter(content, contentType),
      youtube: this.formatForYouTube(content, contentType)
    }

    return {
      content: templates[platform] || content.description,
      title: content.title,
      image_url: content.image_url || null,
      link: content.url || content.registration_url || null
    }
  }

  formatForLinkedIn(content, contentType) {
    if (contentType === 'event') {
      return `🎯 Community Event Alert!

${content.title}

📅 ${new Date(content.date).toLocaleDateString()}
📍 ${content.location?.address || 'Online'}
🎪 ${content.organizer || 'BLKOUT Community'}

${content.description?.slice(0, 300)}...

Join us and be part of the liberation we're building together.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT

${content.registration_url || ''}`
    }
    return `${content.title}\n\n${content.description || content.excerpt || ''}`
  }

  formatForFacebook(content, contentType) {
    return `${content.title}\n\n${content.description || content.excerpt || ''}\n\n#BlackQueerMen #Liberation #BLKOUT`
  }

  formatForInstagram(content, contentType) {
    return `🎯 ${content.title}\n\n${content.description?.slice(0, 200)}...\n\n#BlackQueerMen #Community #Liberation #BLKOUT`
  }

  formatForTwitter(content, contentType) {
    return `🔥 ${content.title}\n\n${content.description?.slice(0, 150)}...\n\n#BlackQueerMen #Liberation`.slice(0, 280)
  }

  formatForYouTube(content, contentType) {
    return `${content.title}\n\n${content.description || content.excerpt || ''}\n\n#BlackQueerMen #Liberation #BLKOUT`
  }
}

// ======================
// ZAPIER INTEGRATION
// ======================

export const ZapierConfig = {
  // Zapier webhook endpoints structure
  webhookStructure: {
    // Primary webhook for all social media posting
    socialMediaPost: {
      url: process.env.ZAPIER_WEBHOOK_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    
    // Platform-specific webhooks (optional)
    platformSpecific: {
      linkedin: process.env.ZAPIER_LINKEDIN_WEBHOOK,
      facebook: process.env.ZAPIER_FACEBOOK_WEBHOOK,
      instagram: process.env.ZAPIER_INSTAGRAM_WEBHOOK,
      twitter: process.env.ZAPIER_TWITTER_WEBHOOK,
      youtube: process.env.ZAPIER_YOUTUBE_WEBHOOK
    }
  },

  // Zapier workflow templates
  workflowTemplates: {
    eventPromotion: {
      trigger: 'webhook',
      actions: [
        'linkedin_create_post',
        'facebook_create_post', 
        'instagram_create_post',
        'twitter_create_tweet'
      ]
    },
    articleSharing: {
      trigger: 'webhook',
      actions: [
        'linkedin_create_post',
        'facebook_create_post',
        'twitter_create_tweet'
      ]
    },
    newsletterDigest: {
      trigger: 'webhook', 
      actions: [
        'linkedin_create_post',
        'twitter_create_tweet',
        'facebook_create_post'
      ]
    }
  }
}

// Zapier Webhook Manager
export class ZapierWebhookManager {
  constructor() {
    this.baseWebhookUrl = process.env.ZAPIER_WEBHOOK_URL
    this.platformWebhooks = ZapierConfig.webhookStructure.platformSpecific
  }

  // Format data for Zapier consumption
  formatDataForZapier(contentType, content, platforms = []) {
    const zapierData = {
      // Zapier-friendly field names
      content_type: contentType,
      title: content.title || '',
      description: content.description || content.excerpt || '',
      url: content.url || content.registration_url || '',
      
      // Event-specific fields
      event_date: content.date || '',
      event_location: content.location?.address || '',
      event_organizer: content.organizer || '',
      registration_url: content.registration_url || '',
      
      // Article-specific fields
      article_excerpt: content.excerpt || '',
      article_author: content.author || '',
      article_category: content.category || '',
      
      // Media and links
      image_url: content.image_url || '',
      
      // Platform targeting
      platforms: platforms.join(','),
      target_linkedin: platforms.includes('linkedin'),
      target_facebook: platforms.includes('facebook'),
      target_instagram: platforms.includes('instagram'),
      target_twitter: platforms.includes('twitter'),
      target_youtube: platforms.includes('youtube'),
      
      // Metadata
      source: 'blkout-automation',
      timestamp: new Date().toISOString(),
      urgent: content.urgent || false,
      
      // Pre-formatted content for each platform
      linkedin_content: this.formatForLinkedIn(content, contentType),
      facebook_content: this.formatForFacebook(content, contentType),
      instagram_content: this.formatForInstagram(content, contentType), 
      twitter_content: this.formatForTwitter(content, contentType),
      youtube_content: this.formatForYouTube(content, contentType),
      
      // Hashtags
      hashtags: this.generateHashtags(content, contentType).join(' ')
    }

    return zapierData
  }

  // Send to primary Zapier webhook
  async triggerZapierWorkflow(contentType, content, platforms = []) {
    if (!this.baseWebhookUrl) {
      return {
        success: false,
        error: 'Zapier webhook URL not configured'
      }
    }

    try {
      const zapierData = this.formatDataForZapier(contentType, content, platforms)
      
      const response = await fetch(this.baseWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(zapierData)
      })

      if (response.ok) {
        return {
          success: true,
          zapier_triggered: true,
          platforms_targeted: platforms,
          webhook_response: response.status
        }
      }

      return {
        success: false,
        error: `Zapier webhook failed with status ${response.status}`,
        response_text: await response.text()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Send to platform-specific webhooks (if configured)
  async triggerPlatformSpecificWebhooks(contentType, content, platforms = []) {
    const results = []

    for (const platform of platforms) {
      const webhookUrl = this.platformWebhooks[platform]
      
      if (!webhookUrl) {
        results.push({
          platform: platform,
          success: false,
          error: 'Platform webhook not configured'
        })
        continue
      }

      try {
        const platformData = {
          ...this.formatDataForZapier(contentType, content, [platform]),
          platform: platform
        }

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(platformData)
        })

        results.push({
          platform: platform,
          success: response.ok,
          status: response.status
        })
      } catch (error) {
        results.push({
          platform: platform,
          success: false,
          error: error.message
        })
      }
    }

    return {
      success: results.some(r => r.success),
      results: results,
      triggered_platforms: results.filter(r => r.success).map(r => r.platform)
    }
  }

  // Helper methods for content formatting (reusing logic)
  formatForLinkedIn(content, contentType) {
    return `🎯 ${content.title}\n\n${content.description?.slice(0, 300)}...\n\n#BlackQueerMen #Liberation #BLKOUT`
  }

  formatForFacebook(content, contentType) {
    return `${content.title}\n\n${content.description || content.excerpt || ''}\n\n#BlackQueerMen #Liberation #BLKOUT`
  }

  formatForInstagram(content, contentType) {
    return `🎯 ${content.title}\n\n${content.description?.slice(0, 200)}...\n\n#BlackQueerMen #Community #Liberation #BLKOUT`
  }

  formatForTwitter(content, contentType) {
    return `🔥 ${content.title}\n\n${content.description?.slice(0, 120)}...\n\n#BlackQueerMen #Liberation`.slice(0, 280)
  }

  formatForYouTube(content, contentType) {
    return `${content.title}\n\n${content.description || content.excerpt || ''}\n\n#BlackQueerMen #Liberation #BLKOUT`
  }

  generateHashtags(content, contentType) {
    const baseHashtags = ['#BlackQueerMen', '#Liberation', '#BLKOUT']
    const contentHashtags = []
    
    if (contentType === 'event') {
      contentHashtags.push('#CommunityEvents', '#Community')
    } else if (contentType === 'article') {
      contentHashtags.push('#Analysis', '#Newsroom')
    }
    
    return [...baseHashtags, ...contentHashtags].slice(0, 8)
  }
}

// ======================
// IMPLEMENTATION EXAMPLES
// ======================

// Example: Composio Setup and Usage
export const ComposioExample = {
  // Step 1: Initialize Composio
  async setup() {
    const authManager = new ComposioAuthManager(process.env.COMPOSIO_API_KEY)
    
    // Initialize platform connections
    const linkedinAuth = await authManager.initializePlatformAuth('linkedin', {
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET
    })
    
    console.log('LinkedIn auth URL:', linkedinAuth.auth_url)
    // User visits auth URL and grants permissions
    // Callback handled by /api/webhooks/composio-callback
  },

  // Step 2: Post to multiple platforms
  async postContent() {
    const executor = new ComposioActionExecutor(process.env.COMPOSIO_API_KEY)
    
    const content = {
      title: 'Community Healing Circle',
      description: 'Join us for a safe space of collective healing...',
      date: '2025-02-15',
      location: { address: 'Community Center, London' },
      registration_url: 'https://events.blkoutuk.com/healing-circle'
    }

    const integrationIds = {
      linkedin: 'integration_linkedin_123',
      facebook: 'integration_facebook_456',
      twitter: 'integration_twitter_789'
    }

    const result = await executor.postToMultiplePlatforms(
      'event',
      content,
      ['linkedin', 'facebook', 'twitter'],
      integrationIds
    )

    return result
  }
}

// Example: Zapier Setup and Usage  
export const ZapierExample = {
  // Step 1: Zapier Zap Configuration
  zapConfiguration: {
    trigger: {
      type: 'Webhook by Zapier',
      url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef',
      method: 'POST'
    },
    actions: [
      {
        app: 'LinkedIn',
        action: 'Create Share Update',
        fields: {
          'Text': '{{linkedin_content}}',
          'URL': '{{url}}'
        }
      },
      {
        app: 'Facebook Pages',
        action: 'Create Post',
        fields: {
          'Message': '{{facebook_content}}',
          'Link': '{{url}}'
        }
      },
      {
        app: 'Twitter',
        action: 'Create Tweet',
        fields: {
          'Text': '{{twitter_content}}'
        }
      }
    ]
  },

  // Step 2: Trigger Zapier workflow
  async postContent() {
    const zapierManager = new ZapierWebhookManager()
    
    const content = {
      title: 'New Analysis: Community Power Building',
      excerpt: 'Exploring how collective action transforms individual struggle into liberation...',
      author: 'BLKOUT Editorial Collective',
      url: 'https://blkoutuk.com/newsroom/community-power-building'
    }

    const result = await zapierManager.triggerZapierWorkflow(
      'article',
      content, 
      ['linkedin', 'facebook', 'twitter']
    )

    return result
  }
}

// ======================
// CONFIGURATION VALIDATOR
// ======================

export class ConfigurationValidator {
  static validateComposioSetup() {
    const required = ComposioConfig.requiredEnvVars
    const missing = required.filter(envVar => !process.env[envVar])
    
    return {
      valid: missing.length === 0,
      missing_vars: missing,
      recommendations: missing.map(envVar => `Set ${envVar} in environment variables`)
    }
  }

  static validateZapierSetup() {
    const requiredZapier = [
      'ZAPIER_WEBHOOK_URL'
    ]
    
    const missing = requiredZapier.filter(envVar => !process.env[envVar])
    
    return {
      valid: missing.length === 0,
      missing_vars: missing,
      webhook_configured: !!process.env.ZAPIER_WEBHOOK_URL,
      recommendations: [
        'Create Zapier account',
        'Set up webhook trigger',
        'Configure social media app connections',
        'Test workflow with sample data'
      ]
    }
  }

  static getRecommendedApproach() {
    const composioValid = this.validateComposioSetup().valid
    const zapierValid = this.validateZapierSetup().valid
    
    if (composioValid && zapierValid) {
      return {
        primary: 'composio',
        fallback: 'zapier',
        reason: 'Composio for direct control, Zapier as backup'
      }
    }
    
    if (zapierValid) {
      return {
        primary: 'zapier',
        fallback: null,
        reason: 'Zapier ready, easier setup'
      }
    }
    
    return {
      primary: 'composio',
      fallback: null,
      reason: 'Most cost-effective and flexible long-term'
    }
  }
}