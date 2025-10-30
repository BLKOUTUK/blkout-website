/**
 * Social Media Automation Webhook
 * Receives BLKOUT content (events, articles, announcements) and posts to Late.dev
 *
 * Endpoint: POST /api/webhooks/social-media-automation
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { lateClient } from '../../../lib/latedev'

interface BLKOUTEvent {
  id: string
  title: string
  description: string
  date: string
  location: {
    address: string
    city?: string
  }
  organizer: string
  registration_url?: string
  tags?: string[]
  image_url?: string
}

interface BLKOUTArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  url: string
  featured_image?: string
  tags?: string[]
  published_at: string
}

interface BLKOUTAnnouncement {
  id: string
  title: string
  message: string
  url?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface WebhookRequest {
  contentType: 'event' | 'article' | 'announcement'
  content: BLKOUTEvent | BLKOUTArticle | BLKOUTAnnouncement
  platforms: string[] // e.g., ['instagram', 'linkedin', 'twitter']
  accountIds?: Record<string, string> // e.g., { instagram: 'acc_123', linkedin: 'acc_456' }
  scheduledFor?: string // ISO datetime, or omit for immediate posting
  timezone?: string
}

/**
 * Format event for social media posting
 */
function formatEventPost(event: BLKOUTEvent): string {
  const emoji = '🎉'
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })

  let post = `${emoji} ${event.title}\n\n`
  post += `${event.description}\n\n`
  post += `📅 ${formattedDate} at ${formattedTime}\n`
  post += `📍 ${event.location.address}\n`

  if (event.organizer) {
    post += `👥 Organized by ${event.organizer}\n`
  }

  if (event.registration_url) {
    post += `\n🔗 Register: ${event.registration_url}\n`
  }

  // Add hashtags
  const hashtags = event.tags?.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || ''
  post += `\n#BLKOUT #CommunityEvent #BlackQueer ${hashtags}`

  return post
}

/**
 * Format article for social media posting
 */
function formatArticlePost(article: BLKOUTArticle): string {
  const emoji = '📰'

  let post = `${emoji} ${article.title}\n\n`
  post += `${article.excerpt}\n\n`
  post += `✍️ By ${article.author}\n`
  post += `\n🔗 Read more: ${article.url}\n`

  // Add hashtags
  const hashtags = article.tags?.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || ''
  post += `\n#BLKOUT #News #Analysis ${hashtags}`

  return post
}

/**
 * Format announcement for social media posting
 */
function formatAnnouncementPost(announcement: BLKOUTAnnouncement): string {
  const emojis = {
    low: 'ℹ️',
    medium: '📢',
    high: '⚡',
    urgent: '🚨'
  }
  const emoji = emojis[announcement.priority] || '📢'

  let post = `${emoji} ${announcement.title}\n\n`
  post += `${announcement.message}\n`

  if (announcement.url) {
    post += `\n🔗 ${announcement.url}\n`
  }

  post += `\n#BLKOUT #CommunityUpdate`

  return post
}

/**
 * Get account IDs for requested platforms
 */
async function getPlatformAccounts(
  requestedPlatforms: string[],
  providedAccountIds?: Record<string, string>
): Promise<Array<{ platform: string; accountId: string }>> {

  // If account IDs are provided, use those
  if (providedAccountIds) {
    return requestedPlatforms.map(platform => ({
      platform,
      accountId: providedAccountIds[platform] || ''
    })).filter(p => p.accountId)
  }

  // Otherwise, fetch connected accounts from Late.dev
  try {
    const accounts = await lateClient.getAccounts()

    return requestedPlatforms.map(platform => {
      const account = accounts.find(acc =>
        acc.platform.toLowerCase() === platform.toLowerCase() && acc.isActive
      )

      if (!account) {
        console.warn(`No active account found for platform: ${platform}`)
        return null
      }

      return {
        platform: account.platform,
        accountId: account.id
      }
    }).filter(Boolean) as Array<{ platform: string; accountId: string }>
  } catch (error) {
    console.error('Failed to fetch Late.dev accounts:', error)
    return []
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request - return configuration info
  if (req.method === 'GET') {
    try {
      const accounts = await lateClient.getAccounts()
      const usageStats = await lateClient.getUsageStats()

      return res.status(200).json({
        status: 'active',
        service: 'Late.dev Social Media Automation',
        connectedAccounts: accounts.length,
        platforms: accounts.map(acc => ({
          platform: acc.platform,
          username: acc.username,
          active: acc.isActive
        })),
        usage: usageStats,
        endpoints: {
          post: 'POST /api/webhooks/social-media-automation',
          config: 'GET /api/webhooks/social-media-automation'
        }
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // POST request - schedule social media post
  if (req.method === 'POST') {
    try {
      const {
        contentType,
        content,
        platforms,
        accountIds,
        scheduledFor,
        timezone = 'Europe/London'
      } = req.body as WebhookRequest

      // Validate input
      if (!contentType || !content || !platforms || platforms.length === 0) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['contentType', 'content', 'platforms']
        })
      }

      // Format content based on type
      let postContent: string
      let mediaUrl: string | undefined

      switch (contentType) {
        case 'event':
          postContent = formatEventPost(content as BLKOUTEvent)
          mediaUrl = (content as BLKOUTEvent).image_url
          break

        case 'article':
          postContent = formatArticlePost(content as BLKOUTArticle)
          mediaUrl = (content as BLKOUTArticle).featured_image
          break

        case 'announcement':
          postContent = formatAnnouncementPost(content as BLKOUTAnnouncement)
          break

        default:
          return res.status(400).json({
            error: 'Invalid content type',
            allowed: ['event', 'article', 'announcement']
          })
      }

      // Get platform accounts
      const platformAccounts = await getPlatformAccounts(platforms, accountIds)

      if (platformAccounts.length === 0) {
        return res.status(400).json({
          error: 'No valid platform accounts found',
          message: 'Please connect your social media accounts in Late.dev dashboard'
        })
      }

      // Prepare media if available
      const media = mediaUrl ? [{ url: mediaUrl, type: 'image' as const }] : undefined

      // Create post in Late.dev
      const latePost = {
        content: postContent,
        platforms: platformAccounts.map(p => ({
          platform: p.platform as any,
          accountId: p.accountId
        })),
        timezone,
        ...(scheduledFor ? { scheduledFor } : { publishNow: true }),
        ...(media ? { media } : {})
      }

      const result = await lateClient.createPost(latePost)

      return res.status(200).json({
        success: true,
        postId: result.id,
        status: result.status,
        platforms: result.platforms,
        scheduledFor: result.scheduledFor,
        content: postContent
      })

    } catch (error) {
      console.error('Social media automation error:', error)

      return res.status(500).json({
        error: 'Failed to create social media post',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' })
}
