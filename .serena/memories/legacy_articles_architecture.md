# Legacy Articles (BLKOUTUK.com Archive) - Architecture Integration

## CRITICAL: 281 Published Articles from blkoutuk.com (2016-2025)

**Table**: `legacy_articles` (Supabase)
**Status**: ✅ ACTIVE - 299 total articles, 281 published  
**Date Range**: October 2016 - September 2025
**Purpose**: Archived articles migrated from original blkoutuk.com

## Database Schema

**Table**: `legacy_articles`
**Key Columns**:
- `id`, `title`, `slug`, `content`, `excerpt`
- `status` ('published' = 281 articles accessible)
- `published_at`, `source_url`
- `category_id`, `author_id`
- `liberation_score` (0-100)

## Routes & Access Points

### Primary: /stories
**Component**: `StoryArchivePage.tsx`
**Query**: `legacy_articles` WHERE `status = 'published'`
**Features**: Search, filter, pagination (12/page)

### Navigation Links (VERIFIED ✅)
- **PrimaryNavigationEnhanced**: "Story Archive" → `/stories`
- **PlatformHomepage**: Ecosystem dropdown + featured section → `/stories`

## Theory of Change Integration
- **Card 17**: "300+ articles by us, for us" → `/stories`
- **Card 24**: "Explore our stories" → `/stories`

## Discover Page Integration (PENDING)
**Location**: `/home/robbe/blkout-platform/apps/comms-blkout/src/pages/discover/DiscoverPage.tsx`
**Action Required**: Add Story Archive section to Discover page

## Related Tables
- `archived_articles` (278 rows) - check if duplicate
- `news_articles` (155 rows) - external curated news (separate from archive)
