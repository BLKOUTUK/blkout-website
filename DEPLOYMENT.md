# 🚀 BLKOUT Website Deployment Guide

## Overview
This guide covers deploying the BLKOUT Website with Priority 1 features: RSS Content Automation and Instagram Discovery for grassroots Black LGBT organizations.

## 🗄️ Database Setup (Supabase)

### 1. Apply Database Migrations
Run these migrations in your Supabase SQL editor:

```bash
# Apply RSS automation schema
migrations/001_auto_discovered_content_schema.sql

# Apply Instagram discovery schema  
migrations/002_instagram_sources_schema.sql
```

### 2. Set up Row Level Security
Both migrations include RLS policies for:
- Community data sovereignty
- Democratic content moderation
- Public transparency with privacy protection

## 🌐 Environment Configuration

### Required Environment Variables
```env
# Basic Configuration
NEXT_PUBLIC_SITE_URL=https://blkoutuk.com
NEXT_PUBLIC_SITE_NAME=BLKOUTUK

# Community Features
NEXT_PUBLIC_HUB_ACCESS_ENABLED=true
NEXT_PUBLIC_COOPERATIVE_MODE=true

# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Content Discovery
VITE_RSS_DISCOVERY_ENABLED=true
VITE_INSTAGRAM_DISCOVERY_ENABLED=true
VITE_CONTENT_INTEGRATION_ENABLED=true

# Priority 1 Feature Flags
VITE_FEATURE_INSTAGRAM_SOURCES=true
VITE_FEATURE_COMMUNITY_ONBOARDING=true
VITE_FEATURE_AUTO_DISCOVERED_CONTENT=true
VITE_FEATURE_LIBERATION_SCORING=true

# Instagram Discovery Settings
VITE_INSTAGRAM_RATE_LIMIT_MS=2000
VITE_LIBERATION_RELEVANCE_THRESHOLD=0.6

# Analytics (Community-Focused)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=blkoutuk.com
```

## 🔧 Vercel Deployment

### 1. Deploy Database First
Ensure Supabase migrations are applied before deploying frontend.

### 2. Configure Vercel Project
- **Framework**: Vite (detected automatically)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

### 3. Set Environment Variables
Copy all variables from `.env.example` to Vercel environment settings.

### 4. Deploy
```bash
vercel --prod
```

## 🧪 Post-Deployment Testing

### 1. Test Content Discovery Services
```typescript
// Available in browser console after deployment
await testContentDiscovery();
await testSupabaseConnection();
await testDatabaseMigrations();
```

### 2. Verify New Routes
- ✅ `/community-org-demo` - Community organisation demo
- ✅ `/onboarding` - 4-step onboarding experience  
- ✅ `/dashboard` - Auto-discovered content dashboard
- ✅ `/instagram-sources` - Instagram source manager

### 3. Test Key Features
1. **RSS Content Discovery**: Check automatic content aggregation
2. **Instagram Discovery**: Verify grassroots organization detection
3. **Community Onboarding**: Test 4-step flow with immediate value
4. **Content Moderation**: Test community approval workflows
5. **Instagram Source Management**: Test community verification system

## 🎯 Priority 1 Features Live Checklist

### RSS Content Automation (T015, T049)
- ✅ BLKOUT UK content scraping
- ✅ Relevant RSS feed processing
- ✅ Queer event aggregation
- ✅ Liberation relevance scoring
- ✅ Community moderation dashboard
- ✅ One-click approval workflows

### Instagram Discovery (User-Requested)
- ✅ Grassroots Black LGBT organization discovery
- ✅ Community verification system
- ✅ Liberation hashtag mining
- ✅ AI-powered event detection
- ✅ Democratic source management
- ✅ Respectful scraping with rate limiting

### Community Organisation Onboarding (T016, T050)
- ✅ 4-step liberation-focused flow
- ✅ Immediate value demonstration
- ✅ Community Benefit Society education
- ✅ Competitive advantage showcase
- ✅ Auto-populated content preview

## 🔍 Monitoring & Analytics

### Content Discovery Performance
Monitor through Supabase dashboard:
- `content_discovery_logs` - RSS automation tracking
- `instagram_discovery_logs` - Instagram discovery performance
- `auto_discovered_content` - Content approval rates
- `community_org_sources` - Organization onboarding success

### Community Engagement Metrics
- New organization onboarding completion rates
- Content discovery vs manual submission ratios  
- Community verification participation
- Liberation relevance score improvements

## 🚨 Post-Launch Actions

### 1. Community Outreach
- Notify grassroots Black LGBT organizations about Instagram inclusion
- Share hashtag best practices for maximum discovery
- Educate on community verification benefits

### 2. Content Quality Monitoring
- Review liberation relevance scoring accuracy
- Adjust hashtag performance based on community feedback
- Monitor Instagram rate limiting and adjust as needed

### 3. Performance Optimization
- Monitor Vercel build times and bundle sizes
- Optimize Instagram discovery frequency based on usage
- Scale Supabase plan based on content volume

## 🔒 Security & Privacy

### Data Protection
- All Instagram discovery respects public content only
- Community data sovereignty through RLS policies
- Transparent logging for community audit
- Democratic control over discovery algorithms

### Rate Limiting
- Instagram discovery: 2000ms between requests
- RSS feeds: Respectful crawling with user-agent identification
- Supabase: Row Level Security prevents unauthorized access

---

**🎉 Result: Complete community-owned platform with grassroots discovery capabilities covering the full spectrum of Black LGBT civil society organizations.**