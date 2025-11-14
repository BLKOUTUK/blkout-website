# PRD-001: Social Media Automation Platform Integration

## Status
🔴 Not Started

## Priority
**P0 - Critical** - Foundation for all content distribution

## Overview
Integrate Late.dev (or alternative: n8n/Zapier/Composio) to enable automated multi-platform social media posting for events, articles, and community content.

## Problem Statement
BLKOUT currently has:
- 5 social media platforms (LinkedIn, Instagram, Facebook, Twitter, YouTube)
- Content being published (events, articles, newsletters)
- Manual posting process creating bottlenecks
- No automated cross-posting infrastructure

## Goals
1. **Automate 100% of content distribution** across all 5 platforms
2. **Zero manual intervention** for standard content types
3. **Platform-optimized formatting** (character limits, image sizes, hashtags)
4. **Scheduled posting** capability
5. **Error handling and retry logic**

## Success Metrics
- 100% automation coverage (all events/articles auto-posted)
- <5 minute delay from publish to social media
- 95%+ successful post rate
- 0 manual posts per week

## Technical Requirements

### API Endpoints
**Already Built:**
- `POST /api/webhooks/social-media-automation` ✅
- `GET /api/webhooks/social-media-automation` (status check) ✅

### Integration Options
**Option A: Late.dev** (Recommended)
- Direct API integration
- Per-post pricing model
- Multi-platform support
- Status: Code exists, needs API key

**Option B: n8n** (Self-hosted)
- Open source workflow automation
- No per-post costs
- Requires hosting
- Status: Documentation exists

**Option C: Zapier**
- Visual workflow builder
- Easy setup
- Higher cost at scale
- Status: Webhooks ready

**Option D: Composio**
- Developer-first API
- Multi-platform support
- Status: Client code exists

### Environment Variables Needed
```bash
# Choose ONE integration method:

# Late.dev
LATE_API_KEY=your-late-api-key

# OR n8n
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# OR Zapier
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID

# OR Composio
COMPOSIO_API_KEY=your-composio-api-key
```

### Content Type Mapping
1. **Events** → Instagram (visual card) + LinkedIn (professional) + Facebook (community) + Twitter (concise)
2. **Articles** → LinkedIn (long-form) + Twitter (thread) + Facebook (detailed)
3. **Newsletters** → LinkedIn (summary) + Twitter (highlights)
4. **Announcements** → All platforms (broadcast)

### Platform-Specific Formatting
**Instagram:**
- Square images (1080x1080)
- 30 hashtags max
- Emojis encouraged
- Stories support (future)

**LinkedIn:**
- Professional tone
- 3000 character limit
- Industry hashtags
- Organization tagging

**Twitter:**
- 280 character limit
- Thread creation for longer content
- 1-3 hashtags
- Media optimization

**Facebook:**
- Native video priority
- Community-focused language
- Event cross-posting
- Long-form support

**YouTube:**
- Video content only
- SEO-optimized titles/descriptions
- Playlist organization

## Implementation Steps

### Phase 1: Choose & Setup Integration (Week 1)
- [ ] Evaluate pricing for Late.dev vs n8n self-hosting
- [ ] Create account with chosen platform
- [ ] Generate API keys
- [ ] Add environment variables to Vercel
- [ ] Test connection with activation script

### Phase 2: Connect Social Accounts (Week 1)
- [ ] Connect LinkedIn company page
- [ ] Connect Instagram business account
- [ ] Connect Facebook page
- [ ] Connect Twitter account
- [ ] Connect YouTube channel
- [ ] Verify all OAuth tokens valid

### Phase 3: Testing (Week 2)
- [ ] Run `node scripts/activate-social-automation.js test`
- [ ] Manually trigger test event post
- [ ] Verify posts appear on all platforms
- [ ] Check formatting on each platform
- [ ] Test error handling (invalid tokens)
- [ ] Test scheduling functionality

### Phase 4: Production Integration (Week 2)
- [ ] Add triggers to Supabase (events table)
- [ ] Add triggers to newsroom publishing flow
- [ ] Monitor first 10 automated posts
- [ ] Set up error alerting (email/Slack)
- [ ] Document troubleshooting procedures

### Phase 5: Optimization (Week 3)
- [ ] A/B test posting times
- [ ] Optimize hashtag selection
- [ ] Refine platform-specific templates
- [ ] Add media/image optimization
- [ ] Implement retry logic improvements

## Files Involved
```
✅ /src/lib/latedev.ts - Late.dev client
✅ /src/pages/api/webhooks/social-media-automation.ts - Main webhook
✅ /scripts/activate-social-automation.js - Testing script
✅ /SOCIAL_MEDIA_AUTOMATION_SETUP.md - Documentation
✅ /LATE_DEV_USAGE_EXAMPLES.md - Usage guide
```

## Dependencies
- Chosen automation platform account (Late.dev/n8n/Zapier/Composio)
- Social media account admin access (all 5 platforms)
- Vercel environment variable access
- Supabase database trigger permissions

## Risks & Mitigation

**Risk 1: API Rate Limits**
- Mitigation: Implement queuing, respect platform limits, add delays

**Risk 2: OAuth Token Expiry**
- Mitigation: Monitor token validity, auto-refresh, alert on expiry

**Risk 3: Platform API Changes**
- Mitigation: Version pin APIs, test in staging, maintain fallbacks

**Risk 4: Cost at Scale**
- Mitigation: Track per-post costs, set budgets, consider self-hosted n8n

## Cost Estimates

**Late.dev:**
- ~$0.10-0.50 per post
- 100 posts/month = $10-50/month

**n8n:**
- Self-hosted: $20-40/month (VPS)
- n8n Cloud: $20+/month

**Zapier:**
- ~$20-50/month for volume needed

**Composio:**
- ~$29+/month depending on volume

**Recommendation:** Start with Late.dev for speed, migrate to self-hosted n8n if costs scale.

## Acceptance Criteria
- [ ] All 5 social platforms connected
- [ ] Event published → auto-posts to 4 platforms within 5 minutes
- [ ] Article published → auto-posts to 3 platforms within 5 minutes
- [ ] Platform-specific formatting correct (verified manually)
- [ ] Scheduled posts working
- [ ] Error notifications setup
- [ ] 95%+ success rate for first 50 posts

## Next PRD Dependencies
- PRD-002: BLKOUTHUB Cross-posting (requires this)
- PRD-003: Newsletter Automation (requires this)
- PRD-004: Partnership Amplification (requires this)

---

**Owner:** Infrastructure Team
**Created:** 2025-11-14
**Est. Completion:** 3 weeks from start
