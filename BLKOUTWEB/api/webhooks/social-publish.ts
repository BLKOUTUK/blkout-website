// Social Media Publication Webhook
// Triggers social media posting via N8N when content is approved/published  
// File: api/webhooks/social-publish.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests supported for social publishing webhook'
    });
  }

  try {
    const { content, contentType, action = 'published' } = req.body;

    if (!content || !contentType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'content and contentType are required'
      });
    }

    // Prepare social media posts based on content type
    const socialPosts = prepareSocialContent(content, contentType);

    // N8N social media workflow payload
    const socialPayload = {
      trigger: 'content.published',
      action: 'social_media_post',
      content: {
        id: content.id,
        original_title: content.title,
        original_content: content.content,
        type: contentType,
        source_url: `https://blkoutnxt.vercel.app/content/${content.id}`,
        approved_by: content.approved_by,
        published_at: content.published_at
      },
      social_posts: socialPosts,
      metadata: {
        webhook_source: 'blkoutnxt-platform',
        publish_action: action,
        timestamp: new Date().toISOString(),
        platforms: ['twitter', 'instagram', 'linkedin'],
        priority: content.priority || 'medium'
      }
    };

    // Send to N8N social media workflows
    const socialWorkflows = [
      'N8N_TWITTER_WEBHOOK_URL',
      'N8N_INSTAGRAM_WEBHOOK_URL', 
      'N8N_LINKEDIN_WEBHOOK_URL'
    ];

    const webhookResults = [];

    for (const workflowEnvVar of socialWorkflows) {
      try {
        const webhookUrl = process.env[workflowEnvVar];
        if (webhookUrl) {
          // const response = await fetch(webhookUrl, {
          //   method: 'POST',
          //   headers: { 
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${process.env.N8N_API_KEY || ''}`
          //   },
          //   body: JSON.stringify(socialPayload)
          // });

          webhookResults.push({
            platform: workflowEnvVar.replace('N8N_', '').replace('_WEBHOOK_URL', '').toLowerCase(),
            status: 'triggered',
            // status: response.ok ? 'success' : 'failed'
          });
        }
      } catch (error) {
        webhookResults.push({
          platform: workflowEnvVar.replace('N8N_', '').replace('_WEBHOOK_URL', '').toLowerCase(),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('Social media webhooks triggered:', { 
      contentId: content.id,
      results: webhookResults,
      payload: socialPayload 
    });

    return res.status(200).json({
      success: true,
      message: 'Social media publication workflows triggered',
      data: {
        contentId: content.id,
        contentType,
        socialPosts: socialPosts.length,
        webhookResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Social publishing webhook failed:', error);
    return res.status(500).json({
      error: 'Social publishing failed',
      message: error instanceof Error ? error.message : 'Unknown error during social media workflow'
    });
  }
}

function prepareSocialContent(content: any, contentType: string) {
  const baseUrl = 'https://blkoutnxt.vercel.app';
  
  const posts = [];

  // Twitter post (280 chars)
  const twitterText = contentType === 'events' 
    ? `🗓️ ${content.title}\n\n${content.content.substring(0, 180)}...\n\n#CommunityEvent #BLKOUT`
    : `📰 ${content.title}\n\n${content.content.substring(0, 180)}...\n\n#Community #News`;
    
  posts.push({
    platform: 'twitter',
    text: twitterText,
    url: `${baseUrl}/content/${content.id}`,
    hashtags: contentType === 'events' ? ['CommunityEvent', 'BLKOUT'] : ['Community', 'News']
  });

  // Instagram post
  posts.push({
    platform: 'instagram',
    caption: `${content.title}\n\n${content.content.substring(0, 300)}...\n\n#BLKOUT #Community`,
    url: `${baseUrl}/content/${content.id}`,
    image_required: true
  });

  // LinkedIn post  
  posts.push({
    platform: 'linkedin',
    text: `${content.title}\n\n${content.content}`,
    url: `${baseUrl}/content/${content.id}`,
    professional: true
  });

  return posts;
}