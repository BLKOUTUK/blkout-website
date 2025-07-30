# Two-Homepage Architecture

## Homepage Structure Clarification

### Primary Landing Page (Route: `/`)
- **Current**: `FullPageScrollytelling` component ✅
- **Purpose**: Initial landing page and introduction to BLKOUT organization
- **Status**: Already implemented and working
- **User Journey**: Introduces visitors → leads to secondary homepage

### Secondary Homepage (Route: `/home` or `/magazine`)
- **Current**: Does not exist ❌
- **Purpose**: Magazine-style community platform homepage
- **Required**: Two-column layout (main content + sidebar) per wireframe specs
- **User Journey**: Main platform interface after introduction

## Implementation Focus Shift

### What Needs Building
The wireframe specifications apply to the **secondary homepage**, not the landing page:

1. **Magazine-style hero section** with rotating featured content
2. **Two-column layout** (main content area + sidebar)  
3. **Primary navigation** (Latest Issue | Story Archive | I.V.O.R. | Events | Our Movement | Join Discussion)
4. **Featured stories carousel**
5. **Recent stories feed** (10-15 most recent + manually pinned)
6. **Sidebar widgets** (events calendar, I.V.O.R., community activity, membership CTA)

### User Flow
```
Visitor arrives → Scrollytelling Landing Page → CTA to enter platform → Magazine Homepage
     (/)                                                                  (/home)
```

### Route Planning
- Keep current `/` route for scrollytelling landing
- Add new route (suggest `/home` or `/magazine`) for magazine-style homepage
- Update CTAs in scrollytelling to direct to magazine homepage
- Update navigation to distinguish between "landing" and "platform" areas

This structure makes perfect sense for community onboarding - introduce the organization first, then provide the platform interface.