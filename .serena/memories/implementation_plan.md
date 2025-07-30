# BLKOUT Website UI Restoration - Implementation Plan

## Phase 1: Core Magazine Layout (Week 1)

### 1.1 Create Magazine Homepage Component
**File**: `src/components/magazine/MagazineHomepage.tsx`
- Replace scrollytelling-only homepage with magazine-style layout
- Two-column layout: main content (8 cols) + sidebar (4 cols)
- Magazine-style hero section with rotating featured content
- Clean, professional layout matching PageAI design reference

### 1.2 Implement Primary Navigation Header
**File**: `src/components/layout/PrimaryNavigation.tsx`
- Primary nav: "Latest Issue | Story Archive | I.V.O.R. | Events | Our Movement | Join Discussion"
- Mobile-friendly collapsible navigation
- Breadcrumb navigation component
- Search functionality integration
- Clean header design with BLKOUT branding

### 1.3 Enhanced Content Categorization System
**File**: `src/lib/contentCategories.ts` & updates to ArticleGrid
- 5 content categories with standardized visual indicators:
  - **Original Commentary** (purple indicator)
  - **Curated Content** (pink indicator) 
  - **Event Coverage** (orange indicator)
  - **Community Response** (green indicator)
  - **Video/Audio/Photo** (blue indicator)
- Color-coded dots, tags, or borders for each category
- Hashtag system integration (#BlackJoy, #Liberation, #Community)

## Phase 2: Sidebar & Widgets (Week 2)

### 2.1 Events Calendar Widget
**File**: `src/components/widgets/EventsCalendarWidget.tsx`
- Next 5-7 upcoming events display
- Integration with events calendar backend
- Clean, compact widget design
- Click-through to full events page

### 2.2 I.V.O.R. Resource Widget
**File**: `src/components/widgets/IVORWidget.tsx`
- Quick access to I.V.O.R. resources
- Resource finder functionality
- Integration with I.V.O.R. backend
- "Get Help Now" CTA

### 2.3 Community Activity & Engagement Widgets
**Files**: 
- `src/components/widgets/CommunityActivityWidget.tsx`
- `src/components/widgets/MembershipWidget.tsx`
- Community activity feed (placeholder for HUB integration)
- Membership CTA with engagement metrics
- Color-coded content type key
- Recent discussions widget

### 2.4 Sidebar Layout Component
**File**: `src/components/layout/Sidebar.tsx`
- Responsive sidebar container
- Widget management and organization
- Mobile collapsible functionality

## Phase 3: Enhanced Features (Week 3)

### 3.1 Featured Stories Carousel
**File**: `src/components/magazine/FeaturedCarousel.tsx`
- Rotating featured content showcase
- Different content categories highlighting
- Auto-play with manual controls
- Mobile swipe support

### 3.2 Community Engagement Elements
**Updates to existing components**:
- "Go Deeper" CTAs on every content piece
- Discussion counters showing community engagement
- Member activity indicators ("127 members discussing")
- FOMO elements ("HUB members saw this first")
- Community spotlight sections

### 3.3 Mobile Experience Enhancements
**Files**: Various component updates
- Touch-friendly navigation elements
- Swipe gestures for content navigation
- Collapsible content sections
- App-like interaction patterns
- Improved mobile loading and performance

## Phase 4: Integration & Polish (Week 4)

### 4.1 Backend Integration Improvements
- Enhanced newsroom backend integration
- I.V.O.R. API integration for widgets
- Events calendar API integration
- Community HUB API preparation

### 4.2 Content Management Enhancements
- Pin system for featured content (1-month auto-expiry)
- Content scheduling capabilities
- Editorial workflow improvements
- SEO optimization fields

### 4.3 Performance & Accessibility
- Page load optimization (target: <3 seconds)
- WCAG 2.1 AA compliance verification
- Screen reader compatibility testing
- Mobile performance optimization
- Cross-browser compatibility testing

## File Structure Changes

```
src/
├── components/
│   ├── layout/
│   │   ├── PrimaryNavigation.tsx          # NEW
│   │   ├── Sidebar.tsx                    # NEW
│   │   └── Breadcrumbs.tsx               # NEW
│   ├── magazine/
│   │   ├── MagazineHomepage.tsx          # NEW (main homepage)
│   │   ├── FeaturedCarousel.tsx          # NEW
│   │   ├── ArticleGrid.tsx               # ENHANCED
│   │   └── StoriesPage.tsx               # ENHANCED
│   ├── widgets/
│   │   ├── EventsCalendarWidget.tsx      # NEW
│   │   ├── IVORWidget.tsx                # NEW
│   │   ├── CommunityActivityWidget.tsx   # NEW
│   │   └── MembershipWidget.tsx          # NEW
│   └── ui/
│       ├── CategoryIndicator.tsx         # NEW
│       ├── EngagementCTA.tsx            # NEW
│       └── SearchBar.tsx                # NEW
├── lib/
│   ├── contentCategories.ts             # NEW
│   └── engagementHelpers.ts             # NEW
└── hooks/
    ├── useContentCategories.ts          # NEW
    └── useEngagementTracking.ts         # NEW
```

## Success Metrics

### Design Quality
- [ ] Magazine-style layout matches PageAI reference
- [ ] Clean, professional appearance
- [ ] Consistent BLKOUT branding throughout
- [ ] Visual hierarchy guides content discovery

### Functionality
- [ ] All 5 content categories properly color-coded
- [ ] Sidebar widgets functional and informative  
- [ ] Navigation intuitive and comprehensive
- [ ] Mobile experience optimized for touch

### Performance
- [ ] Page load < 3 seconds on mobile
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Cross-browser compatibility verified
- [ ] SEO optimization implemented

### Community Engagement
- [ ] Clear pathways to deeper community engagement
- [ ] Engagement metrics visible throughout
- [ ] "Go Deeper" CTAs on all content
- [ ] FOMO elements encourage membership

This plan restores the magazine-style design quality while maintaining the community-focused values and technical architecture already established.