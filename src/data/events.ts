// Events data for BLKOUT community platform

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration?: number
  location: {
    type: 'physical' | 'online' | 'hybrid'
    address: string
    coordinates?: { lat: number; lng: number }
  }
  organizer: string
  category: 'Community' | 'Wellness' | 'Culture' | 'Education' | 'Activism'
  tags: string[]
  capacity?: number
  rsvps?: number
  status?: 'published' | 'draft' | 'pending' | 'approved' | 'rejected'
  featured: boolean
  created_at?: string
  updated_at?: string
  submitted_via?: string
  source_url?: string
  more_info_url?: string
  ticket_info?: string
  attendee_count?: number
  registration_link?: string
}

export const events: Event[] = [
  {
    id: "evt_001",
    title: "Community Healing Circle",
    description: "A safe space for collective healing and support, facilitated by experienced community healers.",
    date: "2025-02-15",
    time: "18:00",
    duration: 120,
    location: {
      type: "physical",
      address: "Community Center, London",
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    organizer: "BLKOUT Healing Collective",
    category: "Wellness",
    tags: ["healing", "community", "support"],
    capacity: 25,
    rsvps: 18,
    status: "published",
    featured: true,
    created_at: "2025-01-10T00:00:00.000Z",
    updated_at: "2025-01-10T00:00:00.000Z"
  },
  {
    id: "evt_002",
    title: "Black Queer Book Club - February Meet",
    description: "Monthly discussion of books by and for Black queer voices. This month we're reading 'Giovanni's Room' by James Baldwin.",
    date: "2025-02-22",
    time: "19:00",
    duration: 90,
    location: {
      type: "physical",
      address: "BLKOUT Space, Manchester",
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    organizer: "BLKOUT Literature Collective",
    category: "Culture",
    tags: ["books", "literature", "discussion", "Baldwin"],
    capacity: 15,
    rsvps: 12,
    status: "published",
    featured: false,
    created_at: "2025-01-15T00:00:00.000Z",
    updated_at: "2025-01-15T00:00:00.000Z"
  },
  {
    id: "evt_003",
    title: "Digital Privacy & Security Workshop",
    description: "Learn to protect your digital privacy and security. Covering encrypted messaging, secure browsing, and social media safety.",
    date: "2025-03-08",
    time: "14:00",
    duration: 180,
    location: {
      type: "online",
      address: "Zoom (link provided upon RSVP)",
    },
    organizer: "BLKOUT Tech Collective",
    category: "Education",
    tags: ["privacy", "security", "technology", "workshop"],
    capacity: 50,
    rsvps: 34,
    status: "published",
    featured: true,
    created_at: "2025-01-20T00:00:00.000Z",
    updated_at: "2025-01-20T00:00:00.000Z"
  },
  // Draft events for moderation testing
  {
    id: "draft_evt_001",
    title: "Test Draft Community Event",
    description: "Community organizing meetup for testing moderation queue functionality",
    date: "2024-12-15",
    time: "18:00",
    duration: 120,
    location: {
      type: "physical",
      address: "Community Center, Test Location"
    },
    organizer: "Test Community Group",
    category: "Community",
    tags: ["test", "moderation", "community"],
    capacity: 30,
    rsvps: 0,
    status: "draft",
    featured: false,
    created_at: "2024-08-29T11:45:00Z",
    updated_at: "2024-08-29T11:45:00Z",
    submitted_via: "chrome-extension"
  },
  {
    id: "draft_evt_002",
    title: "Community Art Workshop - Pending Review",
    description: "Creative workshop focused on community healing through art expression",
    date: "2024-12-20",
    time: "15:00",
    duration: 180,
    location: {
      type: "physical",
      address: "Local Arts Center"
    },
    organizer: "Community Artist",
    category: "Culture",
    tags: ["community-submitted", "art", "healing", "workshop"],
    capacity: 20,
    rsvps: 0,
    status: "pending",
    featured: false,
    created_at: "2024-08-29T11:30:00Z",
    updated_at: "2024-08-29T11:30:00Z",
    submitted_via: "community-form"
  }
]

// Export utility functions
export const getFeaturedEvents = () => events.filter(event => event.featured)
export const getUpcomingEvents = () => events.filter(event => new Date(event.date) > new Date() && (!event.status || event.status === 'published'))
export const getEventsByCategory = (category: Event['category']) => events.filter(event => event.category === category)
export const getEventById = (id: string) => events.find(event => event.id === id)
export const getDraftEvents = () => events.filter(event => event.status === 'draft' || event.status === 'pending')
export const getPublishedEvents = () => events.filter(event => !event.status || event.status === 'published')