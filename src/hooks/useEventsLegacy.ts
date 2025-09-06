// Custom React Hook for Events API Integration
// Provides unified access to Supabase and legacy events endpoints

import { useState, useEffect, useCallback } from 'react'
import { eventsService } from '../services/eventsService'
import type { Event, EventStats, EventsResponse } from '../services/eventsService'

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  stats: EventStats
  refreshEvents: () => Promise<void>
  submitEvent: (event: Partial<Event>) => Promise<Event>
  updateEventStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<boolean>
  updateEvent: (id: string, updates: Partial<Event>) => Promise<Event | null>
  deleteEvent: (id: string) => Promise<boolean>
  connectionStatus: ReturnType<typeof eventsService.getConnectionStatus>
  backendHealth: { available: boolean; url: string; source: string } | null
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<EventStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })
  const [backendHealth, setBackendHealth] = useState<{ available: boolean; url: string; source: string } | null>(null)

  // Get connection status
  const connectionStatus = eventsService.getConnectionStatus()

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const allEvents = await eventsService.getAllEvents()
      setEvents(allEvents)
      
      console.log(`✅ Loaded ${allEvents.length} events`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events'
      setError(errorMessage)
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      const eventStats = await eventsService.getEventStats()
      setStats(eventStats)
    } catch (err) {
      console.error('Failed to load event stats:', err)
    }
  }, [])

  const checkBackendHealth = useCallback(async () => {
    try {
      const health = await eventsService.checkBackendHealth()
      setBackendHealth(health)
    } catch (err) {
      console.error('Failed to check backend health:', err)
      setBackendHealth({ available: false, url: 'unknown', source: 'error' })
    }
  }, [])

  const refreshEvents = useCallback(async () => {
    await Promise.all([loadEvents(), loadStats(), checkBackendHealth()])
  }, [loadEvents, loadStats, checkBackendHealth])

  // CRUD operations
  const submitEvent = useCallback(async (eventData: Partial<Event>): Promise<Event> => {
    try {
      const newEvent = await eventsService.submitEvent(eventData)
      await refreshEvents()
      return newEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit event'
      setError(errorMessage)
      throw err
    }
  }, [refreshEvents])

  const updateEventStatus = useCallback(async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
    try {
      const updated = await eventsService.updateEventStatus(id, status)
      if (updated) {
        await refreshEvents()
      }
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event status'
      setError(errorMessage)
      throw err
    }
  }, [refreshEvents])

  const updateEvent = useCallback(async (id: string, updates: Partial<Event>): Promise<Event | null> => {
    try {
      const updatedEvent = await eventsService.updateEvent(id, updates)
      if (updatedEvent) {
        await refreshEvents()
      }
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      setError(errorMessage)
      throw err
    }
  }, [refreshEvents])

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      const deleted = await eventsService.deleteEvent(id)
      if (deleted) {
        await refreshEvents()
      }
      return deleted
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      setError(errorMessage)
      throw err
    }
  }, [refreshEvents])

  // Load data on mount
  useEffect(() => {
    refreshEvents()
  }, [refreshEvents])

  // Real-time subscription for event updates (Supabase only)
  useEffect(() => {
    const subscription = eventsService.subscribeToEventUpdates?.((event) => {
      console.log('Real-time event update:', event)
      // Refresh events when we get updates
      refreshEvents()
    })

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [refreshEvents])

  return {
    events,
    loading,
    error,
    stats,
    refreshEvents,
    submitEvent,
    updateEventStatus,
    updateEvent,
    deleteEvent,
    connectionStatus,
    backendHealth
  }
}

export default useEvents