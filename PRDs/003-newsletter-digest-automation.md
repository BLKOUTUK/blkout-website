# PRD-003: Newsletter Digest Automation

## Status
🔴 Not Started

## Priority
**P1 - High** - Regular communication with community

## Overview
Automate weekly/monthly newsletter generation that aggregates events, articles, community discussions, and partnership opportunities into a digestible email format.

## Problem Statement
Currently:
- Newsletters created manually (time-consuming)
- Content scattered across events, newsroom, BLKOUTHUB
- No systematic partnership opportunity identification
- Irregular publishing schedule

## Goals
1. **Automated content aggregation** from all sources
2. **Smart partnership detection** using maven network
3. **Scheduled generation** (weekly/monthly)
4. **Email distribution** via Kit (ConvertKit)
5. **Engagement tracking** and optimization

## Success Metrics
- Weekly newsletter sent 100% on schedule
- 25%+ open rate
- 10%+ click-through rate
- 5+ partnership opportunities identified per month
- 2 hours/week saved in manual curation

## Technical Requirements

### API Endpoint
**Already Built:**
- `POST /api/webhooks/newsletter-digest`
- `GET /api/webhooks/newsletter-digest` (status)

### Content Sources

**1. Events (Past Week)**
```sql
SELECT * FROM events
WHERE published_at >= NOW() - INTERVAL '7 days'
  AND status = 'published'
ORDER BY date ASC
LIMIT 5
```

**2. Articles (Past Week)**
```sql
SELECT * FROM articles
WHERE published_at >= NOW() - INTERVAL '7 days'
  AND status = 'published'
ORDER BY views DESC
LIMIT 3
```

**3. BLKOUTHUB Discussions (Top Engagement)**
```sql
SELECT * FROM blkouthub_sync_log
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY engagement_score DESC
LIMIT 5
```

**4. Partnership Opportunities**
- AI analysis of content themes
- Maven network matching
- Suggested collaborations

### Maven Network Categories
```typescript
interface MavenCategory {
  media: string[]           // Journalists, bloggers, podcasters
  community_orgs: string[]  // NGOs, advocacy groups
  academic: string[]        // Researchers, universities
  cultural: string[]        // Artists, influencers
  policy: string[]          // Policy makers, advocates
  funding: string[]         // Funders, sponsors
}
```

### Newsletter Template Structure
```
Subject: BLKOUT Weekly - {Week of Month Day, Year}

1. Opening Message (Brief)
2. Featured Article of the Week
3. Upcoming Events (3-5)
4. Community Highlights from BLKOUTHUB
5. Partnership Spotlight (if applicable)
6. Quick Links Section
7. Call to Action
```

### Email Service Integration
**Kit (ConvertKit) API:**
```typescript
interface KitIntegration {
  apiKey: string
  formId: string // Subscriber list
  tags: string[] // For segmentation
}

// Send newsletter
POST https://api.convertkit.com/v3/broadcasts
{
  "email_template_id": "template_123",
  "subject": "BLKOUT Weekly",
  "content": newsletterHTML,
  "send_at": "2025-01-15T10:00:00Z"
}
```

## Implementation Steps

### Phase 1: Content Aggregation Logic (Week 1)
- [ ] Build database queries for each content source
- [ ] Create content scoring algorithm (views, engagement)
- [ ] Implement deduplication logic
- [ ] Test with past week's data

### Phase 2: Partnership Detection (Week 1-2)
- [ ] Define maven network structure
- [ ] Build content theme analysis (keywords, topics)
- [ ] Implement maven matching algorithm
- [ ] Generate partnership opportunity descriptions

### Phase 3: Newsletter Generation (Week 2)
- [ ] Create HTML email template
- [ ] Build content insertion logic
- [ ] Implement A/B test capability (subject lines)
- [ ] Generate preview functionality

### Phase 4: Kit Integration (Week 2-3)
- [ ] Setup Kit account & API key
- [ ] Create subscriber list/form
- [ ] Test email sending
- [ ] Implement scheduling
- [ ] Setup tracking/analytics

### Phase 5: Automation & Monitoring (Week 3)
- [ ] Create cron job/scheduled function
- [ ] Set up error notifications
- [ ] Build admin preview dashboard
- [ ] Implement manual override capability

## Database Schema
```sql
-- Newsletter generation history
CREATE TABLE newsletter_digests (
  id UUID PRIMARY KEY,
  frequency TEXT, -- 'weekly' | 'monthly'
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  status TEXT, -- 'draft' | 'sent' | 'failed'

  -- Content included
  content_summary JSONB, -- {events: 5, articles: 3, discussions: 5}
  featured_article_id TEXT,
  events_included TEXT[], -- Array of event IDs
  articles_included TEXT[], -- Array of article IDs

  -- Engagement
  recipients_count INTEGER,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),

  -- Partnership
  partnership_opportunities JSONB,
  maven_contacts_suggested TEXT[],

  -- Distribution
  kit_broadcast_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maven network contacts
CREATE TABLE maven_network (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  organization TEXT,
  category TEXT, -- 'media' | 'community_orgs' | 'academic' | etc.
  contact_email TEXT,
  social_handles JSONB, -- {twitter: '@handle', linkedin: 'url'}
  areas_of_interest TEXT[],
  collaboration_history TEXT[], -- Past partnerships
  last_contacted TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partnership opportunities log
CREATE TABLE partnership_opportunities (
  id UUID PRIMARY KEY,
  newsletter_digest_id UUID REFERENCES newsletter_digests(id),
  content_id TEXT, -- event or article ID
  content_type TEXT,
  maven_id UUID REFERENCES maven_network(id),
  opportunity_description TEXT,
  status TEXT DEFAULT 'identified', -- 'identified' | 'contacted' | 'in_progress' | 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Environment Variables
```bash
# Kit (ConvertKit)
KIT_API_KEY=your-kit-api-key
KIT_FORM_ID=your-subscriber-form-id
KIT_FROM_EMAIL=hello@blkoutuk.com
KIT_FROM_NAME=BLKOUT UK

# Newsletter Settings
NEWSLETTER_SCHEDULE_CRON=0 10 * * 1  # Every Monday 10am
NEWSLETTER_PREVIEW_MODE=false
```

## Files Involved
```
✅ /src/pages/api/webhooks/newsletter-digest.ts - Main webhook
📝 /src/lib/kit-client.ts - Kit API client (needs creation)
📝 /src/lib/newsletter-generator.ts - Content aggregation (needs creation)
📝 /src/templates/newsletter-weekly.html - Email template (needs creation)
📝 /supabase/migrations/008_newsletter_automation.sql - Schema (needs creation)
```

## Partnership Detection Algorithm
```typescript
function identifyPartnershipOpportunities(
  content: Article | Event,
  mavenNetwork: Maven[]
): PartnershipOpportunity[] {

  // 1. Extract themes from content
  const themes = extractThemes(content.tags, content.description)

  // 2. Match with maven interests
  const matchedMavens = mavenNetwork.filter(maven =>
    maven.areas_of_interest.some(interest =>
      themes.includes(interest)
    )
  )

  // 3. Score and rank opportunities
  return matchedMavens.map(maven => ({
    maven_id: maven.id,
    content_id: content.id,
    score: calculateMatchScore(themes, maven.areas_of_interest),
    suggested_approach: generateOutreach Template(content, maven)
  })).sort((a, b) => b.score - a.score)
}
```

## Dependencies
- Kit (ConvertKit) account
- Supabase database access
- PRD-001 completion (content being published)
- PRD-002 completion (BLKOUTHUB discussions available)

## Risks & Mitigation

**Risk 1: Low Engagement**
- Mitigation: A/B test subject lines, optimize send times, segment audience

**Risk 2: Content Drought**
- Mitigation: Curate evergreen content, highlight community discussions

**Risk 3: Email Deliverability**
- Mitigation: Proper DNS/SPF/DKIM setup, monitor bounce rates

**Risk 4: Maven Outreach Fatigue**
- Mitigation: Rate limit contacts, personalize outreach, track responses

## Cost Estimates
**Kit (ConvertKit):**
- Free tier: 0-1,000 subscribers
- Creator plan: $25/month (1,000-3,000 subscribers)
- Creator Pro: $50/month (3,000+ subscribers)

**Recommendation:** Start with free tier, upgrade as list grows

## Acceptance Criteria
- [ ] Weekly newsletter generates automatically every Monday
- [ ] Includes 3-5 upcoming events
- [ ] Features 1 highlighted article
- [ ] Shows 3-5 BLKOUTHUB discussions
- [ ] Identifies 2+ partnership opportunities
- [ ] Sends via Kit with 25%+ open rate
- [ ] Admin can preview before sending
- [ ] Engagement metrics tracked

## Next PRD Dependencies
- PRD-004: Partnership Amplification (uses maven network)
- PRD-006: Content Moderation (newsletter content needs moderation)

---

**Owner:** Content & Community Team
**Created:** 2025-11-14
**Est. Completion:** 3 weeks from start
**Depends On:** PRD-001, PRD-002
