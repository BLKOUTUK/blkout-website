# PRD-004: External Events Calendar Integration

## Status
🔴 Not Started

## Priority
**P1 - High** - Listed in DEVELOPMENT_TODOS.md

## Overview
Integrate the external Black QTIPOC Events Calendar (https://black-qtipoc-events-calendar.vercel.app/) with the BLKOUT platform to display community events alongside BLKOUT-hosted events.

## Problem Statement
From DEVELOPMENT_TODOS.md:
> "Create operational Events Calendar integration - External calendar system ready for implementation. Integration endpoint: `https://black-qtipoc-events-calendar.vercel.app/`. Requires UI component development and data mapping."

Currently:
- External calendar exists but not integrated
- Users must visit separate site for full event listings
- BLKOUT events and community events shown separately
- No unified event discovery experience

## Goals
1. **Unified event listing** - BLKOUT + community events in one view
2. **Real-time sync** - External calendar updates reflected immediately
3. **Smart filtering** - By location, date, category, organizer
4. **Event submission** - Community can add events to external calendar
5. **Mobile-optimized** - Events calendar works perfectly on all devices

## Success Metrics
- 100% of external events displayed on BLKOUT within 5 minutes of publication
- Users can filter 200+ events easily
- 50+ community-submitted events per month
- <2 second page load time
- Mobile usage >60%

## Technical Requirements

### External Calendar API
**Endpoint:** `https://black-qtipoc-events-calendar.vercel.app/`

**Expected API Structure** (needs verification):
```typescript
// GET /api/events
interface ExternalEvent {
  id: string
  title: string
  description: string
  start_date: string // ISO 8601
  end_date?: string
  location: {
    address?: string
    city: string
    venue?: string
    virtual?: boolean
    url?: string
  }
  organizer: {
    name: string
    contact?: string
    website?: string
  }
  categories: string[]
  tags: string[]
  image_url?: string
  registration_url?: string
  accessibility_info?: string
  created_at: string
  updated_at: string
}
```

### Integration Architecture

**Option A: Client-Side Fetch (Simpler)**
```typescript
// Fetch directly from React component
const EventsCalendar = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('/api/events'), // BLKOUT events
      fetch('https://black-qtipoc-events-calendar.vercel.app/api/events') // External
    ]).then(([blkout, external]) => {
      setEvents([...blkout, ...external].sort(byDate))
    })
  }, [])
}
```

**Option B: Server-Side Proxy (Better for caching/filtering)**
```typescript
// API route: /api/events/all
export async function GET() {
  const [blkoutEvents, externalEvents] = await Promise.all([
    db.select().from('events'),
    fetch('https://black-qtipoc-events-calendar.vercel.app/api/events')
  ])

  return {
    events: mergeAndNormalize(blkoutEvents, externalEvents)
  }
}
```

**Recommendation:** Option B for better performance and control

### Event Schema Normalization
```typescript
interface UnifiedEvent {
  id: string
  source: 'blkout' | 'community' // Track origin
  title: string
  description: string
  start_date: Date
  end_date?: Date
  location: EventLocation
  organizer: EventOrganizer
  categories: string[]
  tags: string[]
  image_url?: string
  registration_url?: string
  accessibility_info?: string

  // BLKOUT-specific fields (only if source='blkout')
  blkouthub_post_id?: string
  social_media_posts?: object

  // Community-specific fields (only if source='community')
  community_verified?: boolean
  submission_date?: Date
}
```

### UI Components Needed

**1. EventsCalendarPage** `/events`
```typescript
<EventsCalendarPage>
  <EventsFilters /> // Location, date, category
  <EventsGrid events={filteredEvents} />
  <EventSubmissionCTA /> // Link to community calendar
</EventsCalendarPage>
```

**2. EventsFilters**
```typescript
<EventsFilters>
  <DateRangePicker />
  <LocationFilter /> // London, Manchester, Birmingham, etc.
  <CategoryFilter /> // Social, Educational, Health, etc.
  <SourceFilter /> // BLKOUT, Community, or Both
</EventsFilters>
```

**3. EventCard**
```typescript
<EventCard event={event}>
  {event.source === 'blkout' && <Badge>BLKOUT Event</Badge>}
  {event.source === 'community' && <Badge>Community Event</Badge>}
  <EventImage />
  <EventDetails />
  <RSVPButton />
</EventCard>
```

## Implementation Steps

### Phase 1: API Discovery (Week 1)
- [ ] Test external calendar endpoint
- [ ] Document actual API structure
- [ ] Verify CORS settings
- [ ] Test data volume (how many events?)
- [ ] Check update frequency

### Phase 2: Backend Integration (Week 1)
- [ ] Create `/api/events/all` proxy endpoint
- [ ] Implement caching (Redis or in-memory)
- [ ] Build event normalization logic
- [ ] Add error handling for external API downtime
- [ ] Test with real data

### Phase 3: UI Components (Week 2)
- [ ] Build EventsCalendarPage
- [ ] Build EventsFilters component
- [ ] Build EventCard component (reusable)
- [ ] Implement pagination or infinite scroll
- [ ] Mobile responsive design

### Phase 4: Features & Polish (Week 2-3)
- [ ] Add search functionality
- [ ] Implement calendar view (month/week/day)
- [ ] Add "Add to Calendar" buttons (.ics export)
- [ ] Show map view for events
- [ ] Add event sharing (social media)

### Phase 5: Community Submission (Week 3)
- [ ] Add "Submit Event" button
- [ ] Link to external calendar submission form
- [ ] (Optional) Embed submission form in modal
- [ ] Add guidance on what events to submit

## Files to Create
```
📝 /src/pages/api/events/all.ts - Unified events endpoint
📝 /src/lib/events-integration.ts - External calendar client
📝 /src/components/events/EventsCalendarPage.tsx - Main page
📝 /src/components/events/EventsFilters.tsx - Filtering UI
📝 /src/components/events/EventCard.tsx - Individual event
📝 /src/components/events/EventsGrid.tsx - Grid layout
📝 /src/components/events/CalendarView.tsx - Calendar UI
```

## Caching Strategy
```typescript
// Cache external events for 15 minutes
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

let cachedEvents = null
let cacheTimestamp = 0

export async function getUnifiedEvents() {
  const now = Date.now()

  // Return cached if fresh
  if (cachedEvents && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedEvents
  }

  // Fetch fresh data
  const [blkout, external] = await Promise.all([
    getBlkoutEvents(),
    getExternalEvents()
  ])

  cachedEvents = mergeEvents(blkout, external)
  cacheTimestamp = now

  return cachedEvents
}
```

## Dependencies
- External calendar API access
- Vercel/hosting for new API routes
- React components (already available)
- Map integration (optional - Google Maps/Mapbox)

## Risks & Mitigation

**Risk 1: External API Downtime**
- Mitigation: Cache events, show stale data with warning, graceful degradation

**Risk 2: Data Quality Issues**
- Mitigation: Schema validation, display warnings for missing fields

**Risk 3: CORS Issues**
- Mitigation: Use server-side proxy, configure CORS if we control external calendar

**Risk 4: Performance with 1000+ Events**
- Mitigation: Pagination, lazy loading, indexed search

## Cost Estimates
**Additional Infrastructure:**
- No additional costs (using existing Vercel deployment)
- Optional: Redis for caching (~$10/month if high traffic)
- Optional: Mapbox for maps (~$5/month at low volume)

## Acceptance Criteria
- [ ] External events display on `/events` page
- [ ] BLKOUT events and community events shown together
- [ ] Filtering works by date, location, category
- [ ] Events cached for performance
- [ ] Mobile-responsive design
- [ ] "Submit Event" link prominent
- [ ] Page loads in <2 seconds
- [ ] Graceful error handling if external API down

## Next PRD Dependencies
- PRD-005: Advanced Analytics (track which events get clicks)
- PRD-003: Newsletter Automation (include calendar events)

---

**Owner:** Events & Community Team
**Created:** 2025-11-14
**Est. Completion:** 3 weeks from start
**Depends On:** None (standalone integration)
