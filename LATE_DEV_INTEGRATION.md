# Late.dev Social Media Automation Integration

## 🎯 Overview

Late.dev is our social media scheduling and automation platform, supporting cross-posting to:
- Instagram
- Facebook
- LinkedIn
- TikTok
- Twitter
- Pinterest

## ✅ Setup Complete

Your Late.dev API key has been configured in:
- ✅ Local `.env` file (for development/testing)
- ⚠️ Needs to be added to Vercel (for production)

**API Key**: `sk_512b54aac001c7b6c2df8695cebd23e8c6d3b7edaa678b7ad71ed8347d1e3a8d`

## 🚀 Vercel Deployment Setup

### Step 1: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

```
Name: LATE_API_KEY
Value: sk_512b54aac001c7b6c2df8695cebd23e8c6d3b7edaa678b7ad71ed8347d1e3a8d
Environment: Production, Preview, Development (select all)
```

4. Click **Save**
5. Redeploy your application

### Step 2: Connect Social Media Accounts in Late.dev

1. Log into your Late.dev dashboard: https://app.getlate.dev/
2. Connect your social media accounts:
   - **Instagram**: Business account required
   - **Facebook**: Connect your page
   - **LinkedIn**: Personal or company page
   - **Twitter**: Connect your account
   - **TikTok**: Business account
   - **Pinterest**: Business account

## 📡 API Integration

### Late.dev API Endpoints

**Base URL**: `https://api.getlate.dev/v1`

**Authentication**: Bearer token (your API key)

```javascript
const headers = {
  'Authorization': `Bearer ${process.env.LATE_API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Common Operations

#### 1. Schedule a Post

```javascript
POST https://api.getlate.dev/v1/posts

{
  "text": "Your post content here",
  "platforms": ["instagram", "facebook", "linkedin"],
  "scheduledAt": "2025-12-15T10:00:00Z",
  "media": [
    {
      "url": "https://yourdomain.com/image.jpg",
      "type": "image"
    }
  ]
}
```

#### 2. Get Post Status

```javascript
GET https://api.getlate.dev/v1/posts/{postId}
```

#### 3. List Scheduled Posts

```javascript
GET https://api.getlate.dev/v1/posts
```

## 🔄 BLKOUT Integration Workflow

### Auto-posting Events

When a new event is published on BLKOUT:

```javascript
// Automatically post to Late.dev
const response = await fetch('https://api.getlate.dev/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.LATE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: `🎉 New Community Event: ${event.title}

${event.description}

📅 ${event.date}
📍 ${event.location}

Register: ${event.registration_url}

#BLKOUT #CommunityEvent #BlackQueer`,
    platforms: ['instagram', 'facebook', 'linkedin', 'twitter'],
    scheduledAt: event.promotion_time || 'now'
  })
})
```

### Auto-posting Articles

When a newsroom article is published:

```javascript
const response = await fetch('https://api.getlate.dev/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.LATE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: `📰 ${article.title}

${article.excerpt}

Read more: ${article.url}

#BLKOUT #News #Analysis`,
    platforms: ['linkedin', 'twitter', 'facebook'],
    media: article.featured_image ? [{
      url: article.featured_image,
      type: 'image'
    }] : []
  })
})
```

## 📊 Analytics & Monitoring

Late.dev provides analytics for:
- Post performance across platforms
- Engagement metrics (likes, comments, shares)
- Best posting times
- Audience growth

Access analytics at: https://app.getlate.dev/analytics

## 🛠️ Next Steps

### Immediate Actions

1. **Add to Vercel** (see Step 1 above)
2. **Connect social accounts** in Late.dev dashboard
3. **Test posting** with a sample event or article
4. **Set up webhooks** (optional) for post status updates

### Integration Development

Create the following API endpoints in your BLKOUT platform:

```javascript
// pages/api/social/post.ts
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { content, platforms, scheduledAt } = req.body

    // Post to Late.dev
    const response = await fetch('https://api.getlate.dev/v1/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: content,
        platforms,
        scheduledAt
      })
    })

    const data = await response.json()
    res.status(200).json(data)
  }
}
```

## 🔐 Security Best Practices

- ✅ API key stored in environment variables (not in code)
- ✅ `.env` file in `.gitignore` (already configured)
- ⚠️ **Important**: Never commit API keys to git
- ⚠️ Consider rotating API key if it was exposed publicly

## 📚 Resources

- **Late.dev Dashboard**: https://app.getlate.dev/
- **Late.dev Documentation**: https://docs.getlate.dev/
- **API Reference**: https://docs.getlate.dev/api-reference
- **Support**: support@getlate.dev

## ✨ Platform-Specific Tips

### Instagram
- Use square images (1080x1080) for best results
- Include emojis and hashtags
- Maximum 2,200 characters
- Up to 30 hashtags

### LinkedIn
- Professional tone works best
- Articles perform better with images
- Maximum 3,000 characters
- Tag relevant people/organizations

### Twitter
- Keep it concise (280 characters)
- Use threads for longer content
- Include media for better engagement
- Use relevant hashtags (max 3)

### Facebook
- Longer posts work well (up to 63,206 characters)
- Videos get higher engagement
- Schedule for peak hours
- Use Facebook-native video when possible

---

**Status**: ✅ Local configuration complete | ⚠️ Needs Vercel deployment
**Built with love for collective liberation 🖤**
