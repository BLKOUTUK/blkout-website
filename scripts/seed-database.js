#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

// Database seeding script for testing
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key'
)

const seedData = {
  events: [
    {
      name: 'Community Gathering',
      description: 'Monthly community meetup for Black QTIPOC folks',
      event_date: '2025-09-15',
      location: { 
        address: 'Community Center',
        city: 'London',
        postcode: 'SW1A 1AA'
      },
      source: 'community',
      status: 'published',
      tags: ['community', 'networking', 'social'],
      organizer_name: 'BLKOUT Community',
      price: 'Free',
      contact_email: 'community@blkout.uk'
    },
    {
      name: 'Liberation Workshop Series',
      description: 'Educational workshop on liberation theory and practice',
      event_date: '2025-09-22',
      location: {
        address: 'Online via Zoom',
        city: 'Online'
      },
      source: 'education',
      status: 'published',
      tags: ['education', 'workshop', 'liberation'],
      organizer_name: 'Liberation Collective',
      price: 'Sliding scale £5-£25',
      contact_email: 'workshops@liberation.org'
    },
    {
      name: 'Black Trans Joy Celebration',
      description: 'Celebration of Black trans joy, resilience, and community',
      event_date: '2025-09-29',
      location: {
        address: 'South London Community Space',
        city: 'London'
      },
      source: 'celebration',
      status: 'published',
      tags: ['celebration', 'trans', 'joy', 'performance'],
      organizer_name: 'Black Trans Collective UK',
      price: 'Free with donations welcome',
      contact_email: 'events@blacktrans.org.uk'
    }
  ],
  
  articles: [
    {
      title: 'Building Liberation Through Technology',
      excerpt: 'How technology can serve community liberation when developed with values-first approach',
      content: 'Technology has the power to either oppress or liberate communities. When we center Black queer liberation in our development process, we create tools that serve our collective power rather than extract from it.',
      author: 'Tech Liberation Collective',
      category: 'Technology',
      featured: true,
      status: 'published',
      tags: ['technology', 'liberation', 'community'],
      read_time: 8,
      priority: 'high'
    },
    {
      title: 'Community Ownership Models in Practice',
      excerpt: 'Exploring successful models of community ownership and cooperative governance',
      content: 'From housing cooperatives to community-owned businesses, there are proven models for collective ownership that center community needs over profit.',
      author: 'Cooperative Futures',
      category: 'Economics',
      featured: true,
      status: 'published',
      tags: ['economics', 'cooperation', 'ownership'],
      read_time: 12,
      priority: 'high'
    },
    {
      title: 'Mental Health in Black QTIPOC Communities',
      excerpt: 'Addressing mental health through community care and healing justice',
      content: 'Mental health cannot be separated from the social conditions that impact our communities. Healing justice approaches recognize the collective nature of both trauma and healing.',
      author: 'Healing Justice Network',
      category: 'Health',
      featured: false,
      status: 'published',
      tags: ['health', 'healing', 'community-care'],
      read_time: 6,
      priority: 'medium'
    }
  ],

  contacts: [
    {
      name: 'BLKOUT Community',
      email: 'community@blkout.uk',
      organization: 'BLKOUT UK',
      website: 'https://blkout.uk',
      social_media: {
        twitter: '@BLKOUTUK',
        instagram: '@blkoutuk'
      },
      verified: true
    },
    {
      name: 'Liberation Collective',
      email: 'contact@liberation.org',
      organization: 'Liberation Collective',
      website: 'https://liberation.org',
      verified: true
    },
    {
      name: 'Black Trans Collective UK',
      email: 'hello@blacktrans.org.uk',
      organization: 'Black Trans Collective UK',
      website: 'https://blacktrans.org.uk',
      social_media: {
        twitter: '@BlackTransUK'
      },
      verified: true
    }
  ]
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed contacts first (may be referenced by events)
    console.log('📇 Seeding contacts...')
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(seedData.contacts)
      .select()

    if (contactsError) {
      console.warn('⚠️ Contacts seeding warning:', contactsError.message)
    } else {
      console.log(`✅ Seeded ${contacts.length} contacts`)
    }

    // Seed articles
    console.log('📰 Seeding articles...')
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .insert(seedData.articles)
      .select()

    if (articlesError) {
      console.warn('⚠️ Articles seeding warning:', articlesError.message)
    } else {
      console.log(`✅ Seeded ${articles.length} articles`)
    }

    // Seed events
    console.log('📅 Seeding events...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert(seedData.events)
      .select()

    if (eventsError) {
      console.warn('⚠️ Events seeding warning:', eventsError.message)
    } else {
      console.log(`✅ Seeded ${events.length} events`)
    }

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
}

export { seedDatabase }