# Route and Navigation Mapping

## Primary Navigation Categories → Existing Routes

Based on wireframe specifications and existing routes, here's the mapping:

### Primary Navigation: "Latest Issue | Story Archive | I.V.O.R. | Events | Our Movement | Join Discussion"

#### 1. **Latest Issue** 
- **Route**: `/platform` (new magazine homepage)
- **Purpose**: Current/featured content, recent stories, main magazine interface
- **Components**: MagazineHomepage with featured carousel + recent stories

#### 2. **Story Archive**
- **Route**: `/stories` (existing StoriesPage)
- **Purpose**: Complete archive of all stories and analysis
- **Components**: Enhanced StoriesPage with better categorization

#### 3. **I.V.O.R.**
- **Route**: `/ivor` (existing IVORPage) 
- **Purpose**: AI assistant and resource finder
- **Components**: Current IVOR integration (redirects to backend)

#### 4. **Events**
- **Route**: `/events` (existing EventsPage)
- **Purpose**: Community events calendar
- **Components**: Current events integration (redirects to calendar)

#### 5. **Our Movement** 
- **Route**: `/movement` (existing MovementIntro)
- **Purpose**: Movement principles, philosophy, community values
- **Components**: Current MovementIntro component

#### 6. **Join Discussion**
- **Route**: `/community` (existing CommunityGateway)
- **Purpose**: Community engagement, HUB access, discussions
- **Components**: Current CommunityGateway

## Route Structure Overview

```
Landing & Platform:
/ (landing)          → FullPageScrollytelling 
/platform            → MagazineHomepage (NEW)

Primary Navigation Routes:
/platform            → Latest Issue (magazine homepage)
/stories             → Story Archive  
/ivor                → I.V.O.R.
/events              → Events
/movement            → Our Movement
/community           → Join Discussion

Additional Routes:
/newsroom            → Newsroom backend integration
/dashboard           → ProjectHub (admin/internal)
/admin               → IntegrationDashboard (admin)
/reports             → HubReports (admin)
/governance          → GovernancePage
/media/channel       → ChannelBLKOUTPage
/media/storylab      → StorylabPage
/media/newsroom      → NewsroomPage (duplicate)
```

## Navigation Implementation

### Primary Navigation Component
The PrimaryNavigation component should:
1. Only appear on `/platform` and deeper pages (not on landing `/`)
2. Highlight current active section
3. Mobile-friendly collapsible design
4. Include search functionality
5. Show breadcrumbs for deeper navigation

### User Journey Flow
```
1. Visitor lands on scrollytelling (/)
2. Introduction to BLKOUT values and mission
3. CTA: "Enter Platform" → /platform
4. Magazine homepage with primary navigation
5. Navigation provides access to all platform features
```

This mapping leverages all existing components while creating a cohesive navigation experience that matches the wireframe specifications.