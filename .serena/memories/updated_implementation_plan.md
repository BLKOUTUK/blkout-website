# Updated Implementation Plan - Two-Homepage Structure

## Revised Focus: Build Secondary Magazine Homepage

### Phase 1: Magazine Homepage Foundation

#### 1.1 Create Magazine Homepage Route & Component
**New Route**: `/home` (or `/magazine`)
**File**: `src/components/magazine/MagazineHomepage.tsx`

```tsx
// New magazine-style homepage layout
- Magazine-style hero section with rotating featured content
- Two-column layout: main content (8 cols) + sidebar (4 cols)  
- Clean, professional design matching PageAI reference
- Integration with existing ArticleGrid component
```

#### 1.2 Update Scrollytelling CTAs
**File**: `src/components/blkout/FullPageScrollytelling.tsx`
- Update existing CTAs to direct users to `/home` 
- "Enter Platform" or "Explore Stories" buttons
- Maintain current landing page functionality

#### 1.3 Create Primary Navigation for Magazine Homepage
**File**: `src/components/layout/PrimaryNavigation.tsx`
- Navigation: "Latest Issue | Story Archive | I.V.O.R. | Events | Our Movement | Join Discussion"
- Only appears on magazine homepage and deeper pages (not landing)
- Mobile-friendly collapsible design
- Breadcrumb integration

### Phase 2: Magazine Homepage Content

#### 2.1 Featured Stories Carousel (Hero Section)
**File**: `src/components/magazine/FeaturedCarousel.tsx`
- Rotating showcase of featured content  
- Auto-play with manual controls
- Different content categories highlighting
- Mobile swipe support

#### 2.2 Recent Stories Feed
**Enhancement to**: `src/components/magazine/ArticleGrid.tsx`
- 10-15 most recent stories display
- Manual pinning system integration
- Clean grid layout for magazine homepage
- Category-based filtering options

#### 2.3 Sidebar Widgets Container
**File**: `src/components/layout/MagazineSidebar.tsx`
- Container for all sidebar widgets
- Responsive behavior (collapses on mobile)
- Proper spacing and visual hierarchy

### Phase 3: Sidebar Widgets

#### 3.1 Events Calendar Widget
**File**: `src/components/widgets/EventsCalendarWidget.tsx`
- Next 5-7 upcoming events
- Integration with events backend
- "View All Events" CTA

#### 3.2 I.V.O.R. Resource Widget  
**File**: `src/components/widgets/IVORWidget.tsx`
- Quick resource finder
- "Get Help Now" CTA
- Integration with I.V.O.R. backend

#### 3.3 Community Activity Widget
**File**: `src/components/widgets/CommunityActivityWidget.tsx`
- Recent community activity feed
- Member engagement indicators
- HUB integration preparation

#### 3.4 Membership CTA Widget
**File**: `src/components/widgets/MembershipWidget.tsx`
- Community membership call-to-action
- Engagement metrics display
- "Join Discussion" pathway

### Phase 4: Enhanced Content Features

#### 4.1 Content Categorization System
**File**: `src/lib/contentCategories.ts`
- 5 content categories with visual indicators:
  - Original Commentary (purple)
  - Curated Content (pink) 
  - Event Coverage (orange)
  - Community Response (green)
  - Video/Audio/Photo (blue)

#### 4.2 Community Engagement Elements
- "Go Deeper" CTAs on content
- Discussion counters
- Member activity indicators
- FOMO elements for member benefits

## Updated Route Structure

```
/ (landing)          → FullPageScrollytelling (keep current)
/home (magazine)     → MagazineHomepage (NEW - main focus)
/stories            → StoriesPage (existing)
/newsroom           → NewsroomPage (existing)  
/events             → EventsPage (existing)
/ivor               → IVORPage (existing)
/community          → CommunityGateway (existing)
```

## User Journey Flow

```
1. Visitor lands on scrollytelling intro (/)
2. Learns about BLKOUT organization and values  
3. CTAs lead to magazine homepage (/home)
4. Magazine homepage becomes main platform interface
5. Navigation provides access to all platform features
```

This approach preserves the valuable scrollytelling introduction while building the magazine platform interface that matches your wireframe specifications.