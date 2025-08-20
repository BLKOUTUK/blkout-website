// Platform-Specific Social Media Handlers
// Enhanced direct API integrations for each social media platform
// Supports both Composio and direct API approaches

// LinkedIn API Integration
export class LinkedInHandler {
  constructor(credentials) {
    this.clientId = credentials.LINKEDIN_CLIENT_ID
    this.clientSecret = credentials.LINKEDIN_CLIENT_SECRET  
    this.accessToken = credentials.LINKEDIN_ACCESS_TOKEN
    this.organizationId = credentials.LINKEDIN_ORGANIZATION_ID
    this.apiBase = 'https://api.linkedin.com/v2'
  }

  async createPost(content, contentType) {
    try {
      const postData = {
        author: `urn:li:organization:${this.organizationId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: this.formatContentForLinkedIn(content, contentType)
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      }

      // Add media if available
      if (content.image_url) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE'
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          description: {
            text: content.title
          },
          media: content.image_url,
          title: {
            text: content.title
          }
        }]
      }

      const response = await fetch(`${this.apiBase}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          platform: 'linkedin',
          post_id: result.id,
          url: `https://linkedin.com/feed/update/${result.id}`
        }
      }

      return {
        success: false,
        platform: 'linkedin', 
        error: await response.text(),
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        platform: 'linkedin',
        error: error.message
      }
    }
  }

  formatContentForLinkedIn(content, contentType) {
    if (contentType === 'event') {
      return `🎯 Community Event Alert!

${content.title}

📅 ${new Date(content.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      })}
📍 ${content.location?.address || 'Online'}
🎪 ${content.organizer || 'BLKOUT Community'}

${content.description?.slice(0, 300)}...

This is exactly the kind of community building that transforms individual struggle into collective power.

Join us and be part of the liberation we're building together.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT

${content.registration_url ? `Register: ${content.registration_url}` : ''}`
    }

    if (contentType === 'article') {
      return `📰 New from BLKOUT Newsroom:

${content.title}

${content.excerpt}

This analysis contributes to our collective understanding of liberation strategies and community building approaches.

Read the full article and join the conversation about how we move from individual awareness to collective action.

#BlackQueerMen #Analysis #Liberation #BLKOUT #Community

${content.url ? `Read: ${content.url}` : ''}`
    }

    return `${content.title}\n\n${content.description || content.excerpt || ''}`
  }
}

// Instagram API Integration  
export class InstagramHandler {
  constructor(credentials) {
    this.accessToken = credentials.INSTAGRAM_ACCESS_TOKEN
    this.userId = credentials.INSTAGRAM_USER_ID
    this.apiBase = 'https://graph.instagram.com'
  }

  async createPost(content, contentType) {
    try {
      // Instagram requires images for posts
      if (!content.image_url) {
        return {
          success: false,
          platform: 'instagram',
          error: 'Instagram posts require an image URL'
        }
      }

      const caption = this.formatContentForInstagram(content, contentType)

      const postData = {
        image_url: content.image_url,
        caption: caption,
        access_token: this.accessToken
      }

      const response = await fetch(`${this.apiBase}/${this.userId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        
        // Publish the media
        const publishResponse = await fetch(`${this.apiBase}/${this.userId}/media_publish`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            creation_id: result.id,
            access_token: this.accessToken
          })
        })

        if (publishResponse.ok) {
          const publishResult = await publishResponse.json()
          return {
            success: true,
            platform: 'instagram',
            post_id: publishResult.id
          }
        }
      }

      return {
        success: false,
        platform: 'instagram',
        error: await response.text(),
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        platform: 'instagram', 
        error: error.message
      }
    }
  }

  formatContentForInstagram(content, contentType) {
    const baseContent = `🎯 ${content.title}

${content.description?.slice(0, 200)}...

This is liberation work in practice. Join us and be part of the community we're building.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT #Community`

    if (contentType === 'event') {
      return `${baseContent}

📅 ${new Date(content.date).toLocaleDateString()}
📍 ${content.location?.address || 'Online'}

Link in bio to register 👆`
    }

    return baseContent
  }
}

// Facebook API Integration
export class FacebookHandler {
  constructor(credentials) {
    this.pageAccessToken = credentials.FACEBOOK_PAGE_ACCESS_TOKEN
    this.pageId = credentials.FACEBOOK_PAGE_ID
    this.apiBase = 'https://graph.facebook.com/v18.0'
  }

  async createPost(content, contentType) {
    try {
      const message = this.formatContentForFacebook(content, contentType)

      const postData = {
        message: message,
        access_token: this.pageAccessToken
      }

      // Add image if available
      if (content.image_url) {
        postData.link = content.image_url
      }

      const response = await fetch(`${this.apiBase}/${this.pageId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          platform: 'facebook',
          post_id: result.id,
          url: `https://facebook.com/${result.id}`
        }
      }

      return {
        success: false,
        platform: 'facebook',
        error: await response.text(),
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        platform: 'facebook',
        error: error.message
      }
    }
  }

  formatContentForFacebook(content, contentType) {
    if (contentType === 'event') {
      return `${content.title}

Date: ${new Date(content.date).toLocaleDateString()}
Location: ${content.location?.address || 'Online'} 
Organizer: ${content.organizer || 'BLKOUT Community'}

${content.description}

This event serves our community's liberation by providing space for connection, growth, and collective action.

Join us and contribute to the movement we're building together.

#BlackQueerMen #CommunityEvents #Liberation #BLKOUT

${content.registration_url ? `Register: ${content.registration_url}` : ''}`
    }

    if (contentType === 'article') {
      return `📰 New Analysis from BLKOUT Newsroom

${content.title}

${content.excerpt}

Our newsroom exists to provide analysis that serves Black queer liberation - not just information, but understanding that leads to collective action.

Read the full article and share your thoughts on how this connects to our community's work.

#BlackQueerMen #Analysis #Liberation #BLKOUT #Community

${content.url || ''}`
    }

    return `${content.title}\n\n${content.description || content.excerpt || ''}`
  }
}

// YouTube API Integration  
export class YouTubeHandler {
  constructor(credentials) {
    this.accessToken = credentials.YOUTUBE_ACCESS_TOKEN
    this.channelId = credentials.YOUTUBE_CHANNEL_ID
    this.apiBase = 'https://www.googleapis.com/youtube/v3'
  }

  async createPost(content, contentType) {
    try {
      // YouTube requires video uploads or community posts
      // For now, create community post
      const postData = {
        snippet: {
          channelId: this.channelId,
          description: this.formatContentForYouTube(content, contentType)
        }
      }

      const response = await fetch(`${this.apiBase}/activities?part=snippet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          platform: 'youtube',
          post_id: result.id
        }
      }

      return {
        success: false,
        platform: 'youtube',
        error: await response.text(),
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        platform: 'youtube',
        error: error.message
      }
    }
  }

  formatContentForYouTube(content, contentType) {
    return `🎯 ${content.title}

${content.description || content.excerpt || ''}

Join the BLKOUT community for liberation through collective action.

#BlackQueerMen #Liberation #BLKOUT #Community

${content.url || content.registration_url || ''}`
  }
}

// Twitter/X API Integration
export class TwitterHandler {
  constructor(credentials) {
    this.bearerToken = credentials.TWITTER_BEARER_TOKEN
    this.apiKey = credentials.TWITTER_API_KEY
    this.apiSecret = credentials.TWITTER_API_SECRET
    this.accessToken = credentials.TWITTER_ACCESS_TOKEN
    this.accessSecret = credentials.TWITTER_ACCESS_SECRET
    this.apiBase = 'https://api.twitter.com/2'
  }

  async createPost(content, contentType) {
    try {
      const tweetText = this.formatContentForTwitter(content, contentType)

      const postData = {
        text: tweetText
      }

      const response = await fetch(`${this.apiBase}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          platform: 'twitter',
          post_id: result.data.id,
          url: `https://twitter.com/blkoutuk/status/${result.data.id}`
        }
      }

      return {
        success: false,
        platform: 'twitter',
        error: await response.text(), 
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        platform: 'twitter',
        error: error.message
      }
    }
  }

  formatContentForTwitter(content, contentType) {
    if (contentType === 'event') {
      return `🔥 ${content.title}

📅 ${new Date(content.date).toLocaleDateString()}
📍 ${content.location?.address || 'Online'}

${content.description?.slice(0, 100)}...

#BlackQueerMen #CommunityEvents #Liberation

${content.registration_url || ''}`.slice(0, 280)
    }

    if (contentType === 'article') {
      return `📰 ${content.title}

${content.excerpt?.slice(0, 120)}...

#BlackQueerMen #Analysis #Liberation

${content.url || ''}`.slice(0, 280)
    }

    return `${content.title}\n\n${content.description || content.excerpt || ''}`.slice(0, 280)
  }
}

// Platform Handler Factory
export class PlatformHandlerFactory {
  static create(platform, credentials) {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return new LinkedInHandler(credentials)
      case 'instagram': 
        return new InstagramHandler(credentials)
      case 'facebook':
        return new FacebookHandler(credentials)
      case 'youtube':
        return new YouTubeHandler(credentials)
      case 'twitter':
        return new TwitterHandler(credentials)
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  static getSupportedPlatforms() {
    return ['linkedin', 'instagram', 'facebook', 'youtube', 'twitter']
  }
}

// Enhanced Direct API Posting Function
export async function postDirectToSocialMedia(contentType, content, platforms = []) {
  const credentials = {
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_ORGANIZATION_ID: process.env.LINKEDIN_ORGANIZATION_ID,
    
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_USER_ID: process.env.INSTAGRAM_USER_ID,
    
    FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    FACEBOOK_PAGE_ID: process.env.FACEBOOK_PAGE_ID,
    
    YOUTUBE_ACCESS_TOKEN: process.env.YOUTUBE_ACCESS_TOKEN,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET
  }

  const results = []

  for (const platform of platforms) {
    try {
      const handler = PlatformHandlerFactory.create(platform, credentials)
      const result = await handler.createPost(content, contentType)
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
    posted_to: results.filter(r => r.success).map(r => r.platform),
    failed_platforms: results.filter(r => !r.success).map(r => r.platform)
  }
}