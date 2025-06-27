# BLKOUT Website Cursor Rules

Based on PageAI Cursor Rules with BLKOUT community values integration.

## Core Development Principles

### 1. Community-First Development
- Every component should serve Black queer liberation
- Prioritize accessibility and inclusive design
- Build for cooperative ownership, not extraction
- Trust-based development with community accountability

### 2. Technical Standards
- TypeScript for all components
- Tailwind CSS with BLKOUT brand system
- Mobile-first responsive design
- Performance-optimized (Core Web Vitals)
- Semantic HTML with proper ARIA labels

### 3. PageAI Component Integration
When using PageAI components:
- Always customize with BLKOUT brand colors
- Adapt copy to reflect community values
- Ensure components work with our cooperative mission
- Test on mobile devices primarily

### 4. File Structure
```
src/components/
├── landing/          # PageAI/Shipixen components
│   ├── LandingHeader.tsx
│   ├── LandingPrimaryTextCtaSection.tsx
│   └── ...
├── blkout/          # Custom BLKOUT components  
│   ├── IvorChatbot.tsx
│   ├── RealnessGallery.tsx
│   └── ...
└── ui/              # Shadcn UI components
```

### 5. Naming Conventions
- Components: PascalCase (e.g., `CommunityPulse`)
- Files: kebab-case (e.g., `community-pulse.tsx`)
- Classes: BLKOUT values (e.g., `realness-amber`, `blkout-primary`)
- Functions: camelCase with community context

### 6. Content Guidelines
- Use inclusive language always
- Center Black queer experiences
- Avoid corporate jargon
- Write for community members, not investors
- Include accessibility descriptions

### 7. Performance Requirements
- Components must load < 2s on mobile
- Images optimized with Next.js Image
- Lazy loading for below-fold content
- Minimal JavaScript bundle size
- Progressive enhancement

### 8. Brand Integration
Always use BLKOUT constants:
```typescript
import { BLKOUT_COLORS, REALNESS_PALETTE } from '@/lib/constants'
```

Colors:
- Primary actions: `blkout-primary` (#D4261A)
- Secondary: `blkout-secondary` (#F4A261)
- Accent: `blkout-accent` (#2A9D8F)
- Warm touches: `blkout-warm` (#E76F51)

### 9. Community Accountability
Before committing:
- Does this serve Black queer liberation?
- Is it accessible to community members?
- Does it strengthen cooperative ownership?
- Would this make the community proud?

### 10. Component Documentation
Each component should include:
```typescript
/**
 * CommunityPulse - Shows real-time community engagement
 * 
 * @purpose Building authentic connection
 * @values Transparency, community ownership
 * @accessibility Full screen reader support
 * @mobile Optimized for mobile-first experience
 */
```

## PageAI-Specific Rules

### Landing Components
When adapting PageAI landing components:
1. Replace placeholder text with BLKOUT community messaging
2. Update color schemes to BLKOUT brand
3. Ensure CTAs point to community actions (join, engage, support)
4. Add BLKOUT-specific props for customization

### Example PageAI Adaptation:
```typescript
// Before (PageAI default)
<LandingPrimaryTextCtaSection
  title="Generic SaaS Title"
  description="Generic description"
  primaryButton="Sign Up"
/>

// After (BLKOUT community)
<LandingPrimaryTextCtaSection
  title="Building Cooperative Ownership Together"
  description="Join BLKOUTUK's movement for Black queer liberation through community-owned platforms"
  primaryButton="Join Our Community"
  className="bg-blkout-primary"
/>
```

## Development Workflow

1. **Start with PageAI**: Use Shipixen components as foundation
2. **Community customization**: Adapt for BLKOUT values and brand
3. **Community review**: Share with community for feedback
4. **Iterative improvement**: Refine based on community input
5. **Trust-based deployment**: Release when community-ready

Remember: We're building the world we want to live in, one component at a time. 🏳️‍🌈✊🏿