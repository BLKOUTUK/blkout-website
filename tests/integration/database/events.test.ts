import { describe, it, expect, beforeEach } from 'vitest'
import { testSupabase, waitForDatabase } from '../setup'
import { createMockEvent } from '../../utils/test-utils'
import type { Database } from '../../../src/types/supabase'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']

describe('Events Database Integration', () => {
  let testEventId: string

  beforeEach(async () => {
    // Clean up any existing test events
    await testSupabase.from('events').delete().ilike('name', 'Test%')
    await waitForDatabase()
  })

  describe('CRUD Operations', () => {
    it('should create a new event', async () => {
      const eventData: EventInsert = {
        name: 'Test Integration Event',
        description: 'Integration test event',
        event_date: '2025-09-01',
        location: { address: 'Test Location', city: 'London' },
        source: 'manual',
        status: 'draft'
      }

      const { data, error } = await testSupabase
        .from('events')
        .insert(eventData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.name).toBe(eventData.name)
      expect(data.description).toBe(eventData.description)
      expect(data.source).toBe(eventData.source)
      expect(data.status).toBe(eventData.status)
      expect(data.id).toBeDefined()
      expect(data.created_at).toBeDefined()
      expect(data.updated_at).toBeDefined()

      testEventId = data.id
    })

    it('should read an existing event', async () => {
      // First create an event
      const eventData = createMockEvent({
        name: 'Test Read Event',
        description: 'Event for read test',
        source: 'manual',
        status: 'published'
      })

      const { data: insertData } = await testSupabase
        .from('events')
        .insert(eventData)
        .select()
        .single()

      // Then read it
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .eq('id', insertData.id)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBe(insertData.id)
      expect(data.name).toBe(eventData.name)
    })

    it('should update an existing event', async () => {
      // Create an event first
      const { data: insertData } = await testSupabase
        .from('events')
        .insert({
          name: 'Test Update Event',
          description: 'Original description',
          event_date: '2025-09-01',
          location: { address: 'Original Location' },
          source: 'manual',
          status: 'draft'
        })
        .select()
        .single()

      // Update the event
      const updateData = {
        name: 'Test Updated Event',
        description: 'Updated description',
        status: 'published' as const
      }

      const { data, error } = await testSupabase
        .from('events')
        .update(updateData)
        .eq('id', insertData.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.name).toBe(updateData.name)
      expect(data.description).toBe(updateData.description)
      expect(data.status).toBe(updateData.status)
      expect(data.updated_at).not.toBe(data.created_at)
    })

    it('should delete an event', async () => {
      // Create an event first
      const { data: insertData } = await testSupabase
        .from('events')
        .insert({
          name: 'Test Delete Event',
          description: 'Event to be deleted',
          event_date: '2025-09-01',
          location: { address: 'Delete Location' },
          source: 'manual'
        })
        .select()
        .single()

      // Delete the event
      const { error: deleteError } = await testSupabase
        .from('events')
        .delete()
        .eq('id', insertData.id)

      expect(deleteError).toBeNull()

      // Verify it's deleted
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .eq('id', insertData.id)
        .single()

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })
  })

  describe('Query Operations', () => {
    beforeEach(async () => {
      // Insert test events for querying
      const testEvents = [
        {
          name: 'Test Community Event',
          description: 'Community test event',
          event_date: '2025-09-01',
          location: { address: 'Community Center' },
          source: 'community' as const,
          status: 'published' as const,
          tags: ['community', 'social']
        },
        {
          name: 'Test Education Event',
          description: 'Education test event',
          event_date: '2025-09-15',
          location: { address: 'Library' },
          source: 'eventbrite' as const,
          status: 'published' as const,
          tags: ['education', 'workshop']
        },
        {
          name: 'Test Draft Event',
          description: 'Draft test event',
          event_date: '2025-10-01',
          location: { address: 'TBD' },
          source: 'manual' as const,
          status: 'draft' as const,
          tags: ['draft']
        }
      ]

      await testSupabase.from('events').insert(testEvents)
      await waitForDatabase()
    })

    it('should filter events by status', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .ilike('name', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(2)
      expect(data.every(event => event.status === 'published')).toBe(true)
    })

    it('should filter events by source', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .eq('source', 'community')
        .ilike('name', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(1)
      expect(data[0].source).toBe('community')
    })

    it('should filter events by date range', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .gte('event_date', '2025-09-01')
        .lt('event_date', '2025-10-01')
        .ilike('name', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(2)
    })

    it('should search events by text', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .or('name.ilike.%Education%,description.ilike.%Education%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
      expect(data.some(event => 
        event.name.includes('Education') || 
        event.description.includes('Education')
      )).toBe(true)
    })

    it('should order events by date', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .ilike('name', 'Test%')
        .order('event_date', { ascending: true })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(1)
      
      // Verify ascending order
      for (let i = 1; i < data.length; i++) {
        expect(new Date(data[i].event_date).getTime())
          .toBeGreaterThanOrEqual(new Date(data[i - 1].event_date).getTime())
      }
    })

    it('should paginate events', async () => {
      const pageSize = 2
      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .ilike('name', 'Test%')
        .order('event_date')
        .range(0, pageSize - 1)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeLessThanOrEqual(pageSize)
    })
  })

  describe('JSON Field Operations', () => {
    it('should handle location JSON field', async () => {
      const locationData = {
        address: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK',
        coordinates: { lat: 51.5074, lng: -0.1278 }
      }

      const { data, error } = await testSupabase
        .from('events')
        .insert({
          name: 'Test JSON Location Event',
          description: 'Testing JSON location field',
          event_date: '2025-09-01',
          location: locationData,
          source: 'manual'
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.location).toEqual(locationData)
    })

    it('should query by JSON field properties', async () => {
      await testSupabase
        .from('events')
        .insert({
          name: 'Test London Event',
          description: 'Event in London',
          event_date: '2025-09-01',
          location: { city: 'London', address: 'London Event Space' },
          source: 'manual'
        })

      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .eq('location->>city', 'London')
        .ilike('name', 'Test London%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].location).toHaveProperty('city', 'London')
    })
  })

  describe('Array Field Operations', () => {
    it('should handle tags array field', async () => {
      const tags = ['community', 'education', 'liberation', 'black-qtipoc']

      const { data, error } = await testSupabase
        .from('events')
        .insert({
          name: 'Test Tags Event',
          description: 'Testing tags array field',
          event_date: '2025-09-01',
          location: { address: 'Test Location' },
          source: 'manual',
          tags: tags
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.tags).toEqual(tags)
    })

    it('should query by array field contains', async () => {
      await testSupabase
        .from('events')
        .insert({
          name: 'Test Community Tagged Event',
          description: 'Event tagged with community',
          event_date: '2025-09-01',
          location: { address: 'Community Space' },
          source: 'community',
          tags: ['community', 'networking']
        })

      const { data, error } = await testSupabase
        .from('events')
        .select('*')
        .contains('tags', ['community'])
        .ilike('name', 'Test Community Tagged%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].tags).toContain('community')
    })
  })

  describe('Constraints and Validation', () => {
    it('should enforce required fields', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .insert({
          // Missing required fields: name, description, event_date, source
          location: { address: 'Test Location' }
        } as any)

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })

    it('should validate enum values', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .insert({
          name: 'Test Invalid Source Event',
          description: 'Testing invalid source value',
          event_date: '2025-09-01',
          location: { address: 'Test Location' },
          source: 'invalid_source' as any
        })

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })

    it('should validate date format', async () => {
      const { data, error } = await testSupabase
        .from('events')
        .insert({
          name: 'Test Invalid Date Event',
          description: 'Testing invalid date format',
          event_date: 'invalid-date',
          location: { address: 'Test Location' },
          source: 'manual'
        })

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })
  })
})