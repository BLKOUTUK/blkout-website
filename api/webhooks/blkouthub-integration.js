// BLKOUTHUB Integration Service
// Connects Events and Newsroom content to the community platform
// Enables cross-posting and community engagement amplification

const BLKOUTHUB_CONFIG = {
  apiUrl: process.env.BLKOUTHUB_API_URL || 'https://api.heartbeat.chat/v1',
  accessToken: process.env.BLKOUTHUB_ACCESS_TOKEN,
  communityId: process.env.BLKOUTHUB_COMMUNITY_ID,
  webhookSecret: process.env.BLKOUTHUB_WEBHOOK_SECRET
}

const CONTENT_MAPPING = {
  EVENT: {
    category: 'community-events',
    channel: 'events',
    tags: ['events', 'community', 'gathering']
  },
  ARTICLE: {
    category: 'analysis-news', 
    channel: 'newsroom',
    tags: ['analysis', 'news', 'discussion']
  },
  ANNOUNCEMENT: {
    category: 'announcements',
    channel: 'general',
    tags: ['announcement', 'community']
  }
}

// Format content for BLKOUTHUB posting
function formatForBLKOUTHUB(contentType, content) {
  const mapping = CONTENT_MAPPING[contentType.toUpperCase()]
  
  if (contentType.toLowerCase() === 'event') {
    return {
      type: 'event_post',
      title: `🎯 Community Event: ${content.title}`,
      content: `
**${content.title}**

📅 **When:** ${new Date(content.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })}${content.time ? ` at ${content.time}` : ''}

📍 **Where:** ${content.location?.address || 'Online'}

👥 **Organizer:** ${content.organizer || 'BLKOUT Community'}

**About this event:**
${content.description}

This event serves our community's liberation by providing space for connection, growth, and collective action.

${content.registration_url ? `**Register:** ${content.registration_url}` : ''}

---
*Cross-posted from BLKOUT Events Calendar*
      `.trim(),
      category: mapping.category,
      channel: mapping.channel,
      tags: [...mapping.tags, ...(content.tags || [])],
      metadata: {
        source: 'blkout-events',
        original_id: content.id,
        event_date: content.date,
        location_type: content.location?.type || 'unknown'
      }
    }
  }
  
  if (contentType.toLowerCase() === 'article') {
    return {
      type: 'article_post',
      title: `📰 Analysis: ${content.title}`,
      content: `
**${content.title}**

✍️ **Author:** ${content.author || 'BLKOUT Editorial Collective'}
📂 **Category:** ${content.category || 'Community Analysis'}

**Summary:**
${content.excerpt || content.description}

This analysis contributes to our collective understanding of liberation strategies and community building approaches.

**Join the discussion:** What connections do you see between this analysis and our community's current work?

${content.url ? `**Read full article:** ${content.url}` : ''}

---
*Cross-posted from BLKOUT Newsroom*
      `.trim(),
      category: mapping.category,
      channel: mapping.channel,
      tags: [...mapping.tags, ...(content.tags || [])],
      metadata: {
        source: 'blkout-newsroom',
        original_id: content.id,
        author: content.author,
        published_date: content.publishedAt
      }
    }
  }
  
  // Default formatting
  return {
    type: 'general_post',
    title: content.title,
    content: content.description || content.excerpt || '',
    category: 'general',
    channel: 'general',
    tags: ['community'],
    metadata: {
      source: 'blkout-platform',
      original_id: content.id
    }
  }
}

// Post content to BLKOUTHUB
async function postToBLKOUTHUB(formattedContent) {
  if (!BLKOUTHUB_CONFIG.accessToken || !BLKOUTHUB_CONFIG.communityId) {
    console.log('BLKOUTHUB credentials not configured')
    return { success: false, reason: 'not_configured' }
  }

  try {
    // Using Heartbeat.chat API structure
    const postData = {
      community_id: BLKOUTHUB_CONFIG.communityId,
      title: formattedContent.title,
      content: formattedContent.content,
      category: formattedContent.category,
      tags: formattedContent.tags,
      metadata: formattedContent.metadata,
      published: true,
      allow_comments: true
    }

    const response = await fetch(`${BLKOUTHUB_CONFIG.apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLKOUTHUB_CONFIG.accessToken}`,
        'Content-Type': 'application/json',
        'X-Community-ID': BLKOUTHUB_CONFIG.communityId
      },
      body: JSON.stringify(postData)
    })

    if (response.ok) {
      const result = await response.json()
      return {
        success: true,
        post_id: result.id,
        url: result.url,
        community_id: BLKOUTHUB_CONFIG.communityId
      }
    } else {
      const error = await response.text()
      return {
        success: false,
        status: response.status,
        error: error
      }
    }
  } catch (error) {
    console.error('BLKOUTHUB posting error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Create discussion thread for community engagement
async function createDiscussionThread(contentType, content, blkouthubPostId) {
  if (!blkouthubPostId) return { success: false, reason: 'no_post_id' }

  try {
    let discussionPrompt = ''
    
    if (contentType.toLowerCase() === 'event') {
      discussionPrompt = `
**Discussion Prompt for ${content.title}:**

• Who else is planning to attend this event?
• What questions do you have for the organizers?
• How does this event connect to your personal liberation work?
• What similar events have you found valuable in the past?

Share your thoughts and help build community around this gathering! 👇
      `.trim()
    } else if (contentType.toLowerCase() === 'article') {
      discussionPrompt = `
**Discussion Prompt for ${content.title}:**

• What resonates with you most from this analysis?
• How does this connect to challenges you're seeing in your community?
• What additional perspectives or experiences should we consider?
• How might we turn this analysis into collective action?

Join the discussion and help build our collective understanding! 👇
      `.trim()
    }

    const commentData = {
      post_id: blkouthubPostId,
      content: discussionPrompt,
      metadata: {
        type: 'discussion_starter',
        automated: true,
        source: 'blkout-platform'
      }
    }

    const response = await fetch(`${BLKOUTHUB_CONFIG.apiUrl}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLKOUTHUB_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    })

    return {
      success: response.ok,
      comment_id: response.ok ? (await response.json()).id : null
    }
  } catch (error) {
    console.error('Discussion thread creation error:', error)
    return { success: false, error: error.message }
  }
}

// Get community engagement metrics
async function getCommunityEngagement(postId) {
  if (!BLKOUTHUB_CONFIG.accessToken || !postId) {
    return { success: false, reason: 'insufficient_config' }
  }

  try {
    const response = await fetch(`${BLKOUTHUB_CONFIG.apiUrl}/posts/${postId}/metrics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BLKOUTHUB_CONFIG.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const metrics = await response.json()
      return {
        success: true,
        engagement: {
          views: metrics.views || 0,
          comments: metrics.comments_count || 0,
          likes: metrics.likes_count || 0,
          shares: metrics.shares_count || 0,
          discussion_quality: metrics.discussion_quality || 'unknown'
        }
      }
    }

    return { success: false, status: response.status }
  } catch (error) {
    console.error('Engagement metrics error:', error)
    return { success: false, error: error.message }
  }
}

// Sync community feedback back to main platform
async function syncCommunityFeedback(postId, originalContentId, contentType) {
  try {
    const engagement = await getCommunityEngagement(postId)
    
    if (engagement.success) {
      // Could trigger workflows to update original content with community insights
      const feedbackData = {
        original_id: originalContentId,
        content_type: contentType,
        community_engagement: engagement.engagement,
        blkouthub_post_id: postId,
        sync_timestamp: new Date().toISOString()
      }

      // This could trigger n8n workflows to update content metadata
      if (process.env.N8N_WEBHOOK_URL) {
        await fetch(`${process.env.N8N_WEBHOOK_URL}/community-feedback-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackData)
        })
      }

      return { success: true, feedback_synced: true }
    }

    return { success: false, reason: 'no_engagement_data' }
  } catch (error) {
    console.error('Feedback sync error:', error)
    return { success: false, error: error.message }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const { action, contentType, content, postId } = req.body

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required'
        })
      }

      switch (action) {
        case 'post':
          if (!contentType || !content) {
            return res.status(400).json({
              success: false,
              error: 'contentType and content are required for posting'
            })
          }

          // Format content for BLKOUTHUB
          const formattedContent = formatForBLKOUTHUB(contentType, content)
          
          // Post to BLKOUTHUB
          const postResult = await postToBLKOUTHUB(formattedContent)
          
          if (postResult.success) {
            // Create discussion thread
            const discussionResult = await createDiscussionThread(
              contentType, 
              content, 
              postResult.post_id
            )

            return res.status(200).json({
              success: true,
              blkouthub: {
                post_created: true,
                post_id: postResult.post_id,
                post_url: postResult.url,
                discussion_thread: discussionResult.success
              },
              content_type: contentType,
              original_content_id: content.id
            })
          } else {
            return res.status(422).json({
              success: false,
              error: 'Failed to post to BLKOUTHUB',
              details: postResult
            })
          }

        case 'sync_feedback':
          if (!postId || !content?.id || !contentType) {
            return res.status(400).json({
              success: false,
              error: 'postId, content.id, and contentType are required for feedback sync'
            })
          }

          const syncResult = await syncCommunityFeedback(postId, content.id, contentType)
          
          return res.status(200).json({
            success: syncResult.success,
            feedback_sync: syncResult,
            timestamp: new Date().toISOString()
          })

        case 'get_engagement':
          if (!postId) {
            return res.status(400).json({
              success: false,
              error: 'postId is required for engagement metrics'
            })
          }

          const engagementResult = await getCommunityEngagement(postId)
          
          return res.status(200).json({
            success: engagementResult.success,
            engagement: engagementResult.engagement || null,
            post_id: postId
          })

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid action. Use: post, sync_feedback, get_engagement'
          })
      }
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        blkouthub_integration: {
          configured: !!(BLKOUTHUB_CONFIG.accessToken && BLKOUTHUB_CONFIG.communityId),
          community_id: BLKOUTHUB_CONFIG.communityId || null,
          api_url: BLKOUTHUB_CONFIG.apiUrl,
          content_mapping: CONTENT_MAPPING
        },
        usage: {
          post_content: {
            method: 'POST',
            body: {
              action: 'post',
              contentType: 'event',
              content: {
                id: 'evt_123',
                title: 'Community Healing Circle',
                description: 'A safe space for collective healing...',
                date: '2025-02-15',
                location: { address: 'Community Center, London' }
              }
            }
          },
          sync_feedback: {
            method: 'POST',
            body: {
              action: 'sync_feedback',
              postId: 'blkouthub_post_id',
              contentType: 'event',
              content: { id: 'evt_123' }
            }
          }
        }
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('BLKOUTHUB integration error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}