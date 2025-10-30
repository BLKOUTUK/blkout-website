# Late.dev Integration - Usage Examples

## 🚀 Now LIVE and Ready to Use!

The Late.dev integration is fully built and deployed. Here's how to use it:

## 📡 API Endpoint

**Base URL**: `https://your-domain.vercel.app/api/webhooks/social-media-automation`

## 🎯 Quick Start

### 1. Post an Event to Social Media

```javascript
const response = await fetch('/api/webhooks/social-media-automation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: 'event',
    content: {
      id: 'evt_001',
      title: 'Community Healing Circle',
      description: 'Join us for a safe space of collective healing and support. Open to all Black queer community members.',
      date: '2025-12-15T18:00:00Z',
      location: {
        address: 'Community Center, 123 Liberation Street',
        city: 'London'
      },
      organizer: 'BLKOUT Community Collective',
      registration_url: 'https://events.blkoutuk.com/healing-circle',
      tags: ['healing', 'community', 'support'],
      image_url: 'https://blkoutuk.com/images/healing-circle.jpg'
    },
    platforms: ['instagram', 'linkedin', 'twitter', 'facebook']
  })
})

const result = await response.json()
console.log('Posted to social media:', result)
```

**Response:**
```json
{
  "success": true,
  "postId": "post_abc123",
  "status": "published",
  "platforms": [
    {"platform": "instagram", "accountId": "acc_123", "status": "success"},
    {"platform": "linkedin", "accountId": "acc_456", "status": "success"},
    {"platform": "twitter", "accountId": "acc_789", "status": "success"},
    {"platform": "facebook", "accountId": "acc_012", "status": "success"}
  ],
  "content": "🎉 Community Healing Circle\n\nJoin us for a safe space..."
}
```

### 2. Post an Article to Social Media

```javascript
const response = await fetch('/api/webhooks/social-media-automation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: 'article',
    content: {
      id: 'art_001',
      title: 'Building Safe Spaces: A Community Guide',
      excerpt: 'An in-depth analysis of creating and maintaining safe spaces for Black queer communities in the UK.',
      content: 'Full article content...',
      author: 'BLKOUT Editorial Collective',
      url: 'https://blkoutuk.com/newsroom/building-safe-spaces',
      featured_image: 'https://blkoutuk.com/images/safe-spaces.jpg',
      tags: ['community', 'safespaces', 'organizing'],
      published_at: '2025-12-01T10:00:00Z'
    },
    platforms: ['linkedin', 'twitter', 'facebook']
  })
})
```

### 3. Schedule a Post for Later

```javascript
const response = await fetch('/api/webhooks/social-media-automation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: 'announcement',
    content: {
      id: 'ann_001',
      title: 'Platform Maintenance Notice',
      message: 'We\'ll be performing scheduled maintenance tonight from 11pm-2am GMT. The platform may be temporarily unavailable.',
      url: 'https://blkoutuk.com/status',
      priority: 'medium'
    },
    platforms: ['twitter', 'instagram'],
    scheduledFor: '2025-12-14T20:00:00Z', // Schedule for 8pm
    timezone: 'Europe/London'
  })
})
```

### 4. Provide Specific Account IDs

If you want to post to specific social media accounts:

```javascript
const response = await fetch('/api/webhooks/social-media-automation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentType: 'event',
    content: { /* event data */ },
    platforms: ['instagram', 'linkedin'],
    accountIds: {
      instagram: 'acc_instagram_123',
      linkedin: 'acc_linkedin_456'
    }
  })
})
```

## 🔄 Automatic Integration Examples

### Supabase Database Trigger

Add this to your Supabase database triggers to auto-post when content is published:

```sql
-- Create function to call webhook when event is published
CREATE OR REPLACE FUNCTION notify_social_media_event()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://your-domain.vercel.app/api/webhooks/social-media-automation';
  payload JSONB;
BEGIN
  -- Only trigger when status changes to 'published'
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    payload := jsonb_build_object(
      'contentType', 'event',
      'content', row_to_json(NEW),
      'platforms', ARRAY['instagram', 'linkedin', 'twitter', 'facebook']
    );

    -- Call webhook (requires pg_net extension)
    PERFORM net.http_post(
      url := webhook_url,
      body := payload::text
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to events table
CREATE TRIGGER events_social_media_trigger
AFTER UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION notify_social_media_event();
```

### React Component Integration

```typescript
// components/admin/PublishEventButton.tsx
import { useState } from 'react'

export function PublishEventButton({ event }) {
  const [posting, setPosting] = useState(false)

  const publishToSocialMedia = async () => {
    setPosting(true)

    try {
      // Publish event to social media
      const response = await fetch('/api/webhooks/social-media-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'event',
          content: event,
          platforms: ['instagram', 'linkedin', 'twitter', 'facebook']
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`Posted to ${result.platforms.length} platforms!`)
      } else {
        alert('Failed to post: ' + result.error)
      }
    } catch (error) {
      console.error('Error posting to social media:', error)
      alert('Error posting to social media')
    } finally {
      setPosting(false)
    }
  }

  return (
    <button
      onClick={publishToSocialMedia}
      disabled={posting}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {posting ? 'Posting...' : 'Post to Social Media'}
    </button>
  )
}
```

## 🔍 Check Integration Status

```javascript
// GET request to check configuration
const response = await fetch('/api/webhooks/social-media-automation')
const config = await response.json()

console.log(config)
// {
//   status: 'active',
//   service: 'Late.dev Social Media Automation',
//   connectedAccounts: 4,
//   platforms: [
//     { platform: 'instagram', username: '@blkoutuk', active: true },
//     { platform: 'linkedin', username: 'BLKOUT', active: true },
//     { platform: 'twitter', username: '@blkoutuk', active: true },
//     { platform: 'facebook', username: 'BLKOUTUK', active: true }
//   ],
//   usage: {
//     postsScheduled: 15,
//     postsPublished: 42,
//     limit: 120,
//     resetDate: '2025-12-01T00:00:00Z'
//   }
// }
```

## 📊 Platform-Specific Content Tips

### Instagram
- Square images (1080x1080) work best
- Use emojis and engaging captions
- Include hashtags (up to 30)
- Stories feature coming soon

### LinkedIn
- Professional tone
- Longer posts perform well
- Tag people/organizations when relevant
- Include industry hashtags

### Twitter/X
- Keep it concise
- Use threads for longer content
- 1-3 relevant hashtags
- Include media for better engagement

### Facebook
- Longer posts work well
- Native video gets priority
- Community-focused content
- Event cross-posting

## 🛠️ Testing

Run the activation script to test your setup:

```bash
node scripts/activate-social-automation.js
```

Or test manually:

```bash
curl -X POST https://your-domain.vercel.app/api/webhooks/social-media-automation \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "event",
    "content": {
      "id": "test_001",
      "title": "Test Event",
      "description": "Testing social media automation",
      "date": "2025-12-20T18:00:00Z",
      "location": {"address": "Test Location"},
      "organizer": "BLKOUT"
    },
    "platforms": ["twitter"]
  }'
```

## 🚨 Troubleshooting

### "No valid platform accounts found"
- Go to https://app.getlate.dev/ and connect your social media accounts
- Make sure accounts are set to "Active"

### "Late.dev API error: 401"
- Check that `LATE_API_KEY` is set in Vercel environment variables
- Verify the API key is valid in Late.dev dashboard

### "Failed to create social media post"
- Check the error message for details
- Verify content format matches expected structure
- Check Late.dev dashboard for any account issues

## 📚 Additional Resources

- **Late.dev Dashboard**: https://app.getlate.dev/
- **API Docs**: https://getlate.dev/docs
- **BLKOUT Integration Files**:
  - Client: `/src/lib/latedev.ts`
  - Webhook: `/src/pages/api/webhooks/social-media-automation.ts`
  - Docs: `/LATE_DEV_INTEGRATION.md`

---

**Status**: ✅ Fully Integrated and Ready to Use
**Built with love for collective liberation 🖤**
