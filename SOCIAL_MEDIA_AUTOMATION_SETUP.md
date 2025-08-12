# BLKOUT Social Media & Communication Automation Setup

## 🎯 Overview

BLKOUT now has comprehensive automation infrastructure for multi-platform communication distribution and partnership amplification. This system automatically shares events, newsroom content, and newsletters across social media platforms while creating strategic opportunities for maven and organizational partnerships.

## 🚀 Automation Infrastructure

### 1. Social Media Distribution
**File**: `/api/webhooks/social-media-automation.js`

**Platforms Supported:**
- LinkedIn (professional networking)
- Instagram (visual community building)
- Facebook (community engagement)
- YouTube (video content)
- Twitter (real-time updates)

**Content Types:**
- Events → Automated event promotion
- Articles → Analysis and news distribution
- Newsletters → Digest summaries
- Announcements → Community updates

### 2. BLKOUTHUB Integration  
**File**: `/api/webhooks/blkouthub-integration.js`

**Features:**
- Cross-posts events and articles to community platform
- Creates discussion threads for engagement
- Syncs community feedback back to main platform
- Tracks engagement metrics

### 3. Newsletter Digest System
**File**: `/api/webhooks/newsletter-digest.js`

**Features:**
- Combines events, newsroom, and community content
- Identifies strategic partnership opportunities
- Generates HTML newsletters automatically
- Tracks maven network for amplification

## ⚙️ Environment Configuration

### Required Environment Variables

Add these to your Vercel deployment settings:

```bash
# n8n Integration (existing)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# Zapier Integration (alternative to n8n)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-webhook-id

# Composio Integration (direct social media posting)
COMPOSIO_API_KEY=your-composio-api-key

# BLKOUTHUB Integration
BLKOUTHUB_API_URL=https://api.heartbeat.chat/v1
BLKOUTHUB_ACCESS_TOKEN=your-blkouthub-access-token
BLKOUTHUB_COMMUNITY_ID=your-community-id
BLKOUTHUB_WEBHOOK_SECRET=your-webhook-secret
```

### Optional Social Media Direct APIs

For direct posting (bypassing automation tools):

```bash
# LinkedIn
LINKEDIN_ACCESS_TOKEN=your-linkedin-token
LINKEDIN_COMPANY_ID=your-company-page-id

# Twitter  
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-token-secret

# Facebook
FACEBOOK_ACCESS_TOKEN=your-facebook-token
FACEBOOK_PAGE_ID=your-facebook-page-id

# Instagram
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-account-id
```

## 🔧 Setup Instructions

### Option 1: n8n Automation (Recommended)

1. **Setup n8n Instance**
   - Deploy n8n to cloud provider or use n8n.cloud
   - Configure webhook endpoints for social media posting
   - Create workflows for each platform

2. **n8n Workflow Examples**
   
   **Social Media Workflow:**
   - Trigger: Webhook from BLKOUT
   - Process: Content optimization for each platform
   - Actions: Post to LinkedIn, Twitter, Facebook, Instagram
   
   **Newsletter Distribution:**
   - Trigger: Weekly schedule or manual
   - Process: Gather recent content
   - Actions: Email distribution + social media summary

### Option 2: Zapier Integration

1. **Create Zapier Account**
   - Setup webhook triggers
   - Connect social media accounts
   - Create automation workflows

2. **Zapier Zap Structure:**
   - Trigger: Webhook from BLKOUT
   - Actions: Multi-step social media posting
   - Filters: Content type-based routing

### Option 3: Composio Direct Integration

1. **Setup Composio Account**
   - Get API key from Composio dashboard
   - Connect social media accounts
   - Configure posting permissions

2. **Direct API Benefits:**
   - Immediate posting (no workflow delays)
   - Better error handling
   - More granular control

## 📊 Usage Examples

### Auto-trigger from Events

When an event is published, the system automatically:

```javascript
// Event published → Automatic social media distribution
{
  "contentType": "event",
  "content": {
    "title": "Community Healing Circle",
    "description": "Safe space for collective healing...",
    "date": "2025-02-15",
    "location": {"address": "Community Center, London"},
    "registration_url": "https://events.blkoutuk.com/healing-circle"
  },
  "platforms": ["linkedin", "twitter", "facebook", "instagram"]
}
```

**Results in posts like:**
- **LinkedIn**: Professional event promotion with registration CTA
- **Twitter**: Concise event announcement with hashtags
- **Facebook**: Detailed community event post
- **Instagram**: Visual event card with story-style description

### Auto-trigger from Newsroom

When an article is published:

```javascript
// Article published → Multi-platform distribution
{
  "contentType": "article", 
  "content": {
    "title": "Building Safe Spaces: A Community Guide",
    "excerpt": "Analysis of community building approaches...",
    "author": "BLKOUT Editorial Collective",
    "url": "https://blkoutuk.com/newsroom/building-safe-spaces"
  },
  "platforms": ["linkedin", "twitter", "facebook"]
}
```

### Manual Newsletter Generation

```javascript
// Generate weekly digest
POST /api/webhooks/newsletter-digest
{
  "action": "generate",
  "frequency": "weekly",
  "sources": ["events", "newsroom", "community", "partnerships"],
  "distribute": true
}
```

## 🤝 Partnership Amplification Strategy

### Maven Network Categories

The system automatically identifies and tracks:

1. **Media Mavens** - Journalists, bloggers, podcasters
2. **Community Organizations** - NGOs, advocacy groups
3. **Academic Allies** - Researchers, universities
4. **Cultural Leaders** - Artists, influencers
5. **Policy Advocates** - Policy makers, advocacy orgs
6. **Funding Partners** - Funders, sponsors

### Partnership Opportunity Detection

The system analyzes content and suggests partnerships:

- **Events** → Community organization cross-promotion
- **Analysis Articles** → Academic collaboration opportunities  
- **Policy Content** → Advocacy group alignment
- **Breaking News** → Media amplification opportunities

### Amplification Workflows

When partnership opportunities are identified:

1. **Content Analysis**: System scans for relevant themes
2. **Network Matching**: Identifies appropriate maven contacts
3. **Outreach Preparation**: Generates partnership pitches
4. **Follow-up Tracking**: Monitors partnership development

## 🔄 Integration Flow

```
Event/Article Published
    ↓
Auto-trigger Social Media Automation
    ↓
Cross-post to BLKOUTHUB
    ↓
Add to Newsletter Digest Queue
    ↓
Identify Partnership Opportunities
    ↓
Maven Network Outreach
    ↓
Track Amplification & Engagement
```

## 📈 Analytics & Monitoring

### Available Metrics

**Social Media Performance:**
- Platform-specific engagement rates
- Reach and impressions
- Click-through rates to main site
- Hashtag performance

**BLKOUTHUB Engagement:**
- Community discussion quality
- Member participation rates
- Cross-platform traffic

**Newsletter Effectiveness:**
- Open and click rates
- Content preference analysis
- Partnership opportunity conversion

**Partnership Amplification:**
- Maven response rates
- Content sharing by partners
- Network reach multiplication

## 🚀 Activation Checklist

### Immediate Setup (Required)
- [ ] Configure n8n webhook URL in Vercel environment
- [ ] Test social media automation endpoint
- [ ] Verify BLKOUTHUB credentials
- [ ] Generate first newsletter digest

### Strategic Partnership Setup
- [ ] Review and update maven network contacts
- [ ] Create partnership outreach templates
- [ ] Setup tracking for partnership opportunities
- [ ] Establish follow-up workflows

### Advanced Features
- [ ] Setup direct social media API integrations
- [ ] Configure advanced analytics tracking
- [ ] Create custom content templates per platform
- [ ] Setup automated A/B testing for posts

## 🎯 Success Metrics

**Short-term (First Month):**
- 100% automation coverage (all events/articles auto-distributed)
- 5+ new partnership conversations initiated
- 25% increase in social media engagement

**Medium-term (3 Months):**
- 10+ active maven partnerships amplifying content
- 50% increase in newsletter subscriptions
- 3+ collaborative content pieces with partners

**Long-term (6 Months):**
- Self-sustaining partnership network
- Regular cross-promotion with 20+ organizations
- Measurable community growth through partnerships

---

This automation infrastructure transforms BLKOUT from a platform to a hub that actively builds and leverages community networks for liberation work. The system works automatically while creating strategic opportunities for authentic partnerships and community amplification.

**Built with love for collective liberation 🖤**