# PRD-002: BLKOUTHUB Cross-Posting Integration

## Status
🔴 Not Started

## Priority
**P1 - High** - Critical for community engagement loop

## Overview
Automatically cross-post BLKOUT website content (events, articles) to the BLKOUTHUB community platform (Heartbeat.chat) to drive discussion and gather community feedback.

## Problem Statement
Content published on blkoutuk.com exists separately from the BLKOUTHUB community platform. Community members must visit two different places, reducing engagement and fragmenting discussions.

## Goals
1. **Unified content distribution** - Publish once, appear everywhere
2. **Community discussion threads** - Every article/event gets a discussion space
3. **Feedback loop** - Capture community responses and sync back
4. **Engagement metrics** - Track how community interacts with content

## Success Metrics
- 100% of published content appears on BLKOUTHUB within 5 minutes
- 30%+ of content generates community discussion
- 10+ community comments per article on average
- Community feedback visible to content creators

## Technical Requirements

### API Integration
**Heartbeat.chat API Documentation:**
- Base URL: `https://api.heartbeat.chat/v1`
- Authentication: Bearer token
- Endpoints needed:
  - `POST /posts` - Create discussion post
  - `GET /posts/:id/comments` - Fetch comments
  - `POST /posts/:id/comments` - Add comment
  - `GET /community/members` - List members

### Environment Variables
```bash
BLKOUTHUB_API_URL=https://api.heartbeat.chat/v1
BLKOUTHUB_ACCESS_TOKEN=your-access-token
BLKOUTHUB_COMMUNITY_ID=your-community-id
BLKOUTHUB_WEBHOOK_SECRET=your-webhook-secret
```

### Content Type Mapping

**Events → BLKOUTHUB Posts:**
```json
{
  "type": "event_announcement",
  "title": "Event: {event.title}",
  "content": "{event.description}\n\n📅 {event.date}\n📍 {event.location}\n🎟️ {event.registration_url}",
  "tags": event.tags,
  "metadata": {
    "source": "blkoutuk.com",
    "event_id": event.id,
    "rsvp_url": event.registration_url
  }
}
```

**Articles → BLKOUTHUB Posts:**
```json
{
  "type": "article_discussion",
  "title": "{article.title}",
  "content": "{article.excerpt}\n\nRead full article: {article.url}",
  "tags": article.tags,
  "metadata": {
    "source": "blkoutuk.com",
    "article_id": article.id,
    "author": article.author,
    "read_time": article.readTime
  }
}
```

### Bi-Directional Sync

**Website → BLKOUTHUB:**
1. Content published on website
2. Auto-create discussion post on BLKOUTHUB
3. Store `blkouthub_post_id` in website database

**BLKOUTHUB → Website:**
1. Community member comments on post
2. Webhook notification to website
3. Display comment count on website
4. (Optional) Show top comments on article page

## Implementation Steps

### Phase 1: BLKOUTHUB Account Setup (Week 1)
- [ ] Create/verify BLKOUTHUB account
- [ ] Generate API access token
- [ ] Get community ID
- [ ] Configure webhook endpoint
- [ ] Test API connection

### Phase 2: Webhook Development (Week 1-2)
- [ ] Build POST `/api/webhooks/blkouthub-integration`
- [ ] Implement event cross-posting
- [ ] Implement article cross-posting
- [ ] Add error handling & retries
- [ ] Store `blkouthub_post_id` mapping

### Phase 3: Database Schema (Week 2)
```sql
-- Add column to events table
ALTER TABLE events
ADD COLUMN blkouthub_post_id TEXT,
ADD COLUMN blkouthub_synced_at TIMESTAMPTZ;

-- Add column to articles table
ALTER TABLE articles
ADD COLUMN blkouthub_post_id TEXT,
ADD COLUMN blkouthub_synced_at TIMESTAMPTZ;

-- Create sync log table
CREATE TABLE blkouthub_sync_log (
  id UUID PRIMARY KEY,
  content_type TEXT, -- 'event' or 'article'
  content_id TEXT,
  blkouthub_post_id TEXT,
  status TEXT, -- 'success' | 'failed'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 4: Comment Sync (Week 2-3)
- [ ] Create webhook receiver for BLKOUTHUB comments
- [ ] Store comments in website database
- [ ] Display comment count on articles/events
- [ ] (Optional) Display comments on website

### Phase 5: Testing & Monitoring (Week 3)
- [ ] Test event cross-posting
- [ ] Test article cross-posting
- [ ] Test comment webhook
- [ ] Monitor first 20 synced posts
- [ ] Set up error alerting

## Files Involved
```
✅ /src/pages/api/webhooks/blkouthub-integration.ts - Main webhook
📝 /src/lib/blkouthub-client.ts - API client (needs creation)
📝 /supabase/migrations/007_blkouthub_integration.sql - Schema (needs creation)
✅ /SOCIAL_MEDIA_AUTOMATION_SETUP.md - Documentation updated
```

## API Client Example
```typescript
// /src/lib/blkouthub-client.ts
export class BLKOUTHUBClient {
  constructor(
    private apiUrl: string,
    private accessToken: string,
    private communityId: string
  ) {}

  async createPost(data: {
    title: string
    content: string
    type: string
    tags?: string[]
    metadata?: Record<string, any>
  }) {
    const response = await fetch(`${this.apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        community_id: this.communityId,
        ...data
      })
    })

    if (!response.ok) {
      throw new Error(`BLKOUTHUB API error: ${response.status}`)
    }

    return response.json()
  }

  async getComments(postId: string) {
    const response = await fetch(
      `${this.apiUrl}/posts/${postId}/comments`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`)
    }

    return response.json()
  }
}
```

## Dependencies
- BLKOUTHUB community account & admin access
- Heartbeat.chat API access token
- PRD-001 completion (social media automation provides pattern)
- Supabase database access for schema changes

## Risks & Mitigation

**Risk 1: BLKOUTHUB API Downtime**
- Mitigation: Queue failed syncs, retry with exponential backoff

**Risk 2: Duplicate Posts**
- Mitigation: Check `blkouthub_post_id` before creating, idempotency keys

**Risk 3: Comment Spam**
- Mitigation: Implement moderation queue, rate limiting

**Risk 4: Data Loss**
- Mitigation: Comprehensive logging, sync status tracking

## Cost Estimates
**BLKOUTHUB Platform:**
- Community platform costs (existing)
- API usage (typically included in platform fee)
- No additional costs expected

## Acceptance Criteria
- [ ] Event published → appears on BLKOUTHUB within 5 minutes
- [ ] Article published → appears on BLKOUTHUB within 5 minutes
- [ ] Community comments sync back to website
- [ ] Comment count displayed on website
- [ ] Error logging and monitoring active
- [ ] Successfully synced 20 consecutive posts

## Next PRD Dependencies
- PRD-003: Newsletter Automation (can aggregate BLKOUTHUB discussions)
- PRD-004: Partnership Amplification (BLKOUTHUB engagement data)

---

**Owner:** Community Platform Team
**Created:** 2025-11-14
**Est. Completion:** 3 weeks from start
**Depends On:** PRD-001 (pattern established)
