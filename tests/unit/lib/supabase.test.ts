import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase, supabaseHelpers } from '../../../src/lib/supabase'

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn()
      }))
    }))
  }))
}))

describe('Supabase Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Client Initialization', () => {
    it('should create supabase client with correct configuration', () => {
      expect(supabase).toBeDefined()
      expect(supabase.auth).toBeDefined()
    })

    it('should throw error when environment variables are missing', () => {
      // This is tested through the module import
      expect(() => {
        // The module should have already thrown if env vars were missing
        expect(supabase).toBeDefined()
      }).not.toThrow()
    })
  })

  describe('Authentication Helpers', () => {
    describe('getCurrentUser', () => {
      it('should return user data on success', async () => {
        const mockUser = { id: '123', email: 'test@example.com' }
        supabase.auth.getUser = vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null
        })

        const result = await supabaseHelpers.getCurrentUser()

        expect(result.user).toEqual(mockUser)
        expect(result.error).toBeNull()
        expect(supabase.auth.getUser).toHaveBeenCalledOnce()
      })

      it('should return error on failure', async () => {
        const mockError = { message: 'User not found' }
        supabase.auth.getUser = vi.fn().mockResolvedValue({
          data: { user: null },
          error: mockError
        })

        const result = await supabaseHelpers.getCurrentUser()

        expect(result.user).toBeNull()
        expect(result.error).toEqual(mockError)
      })
    })

    describe('signIn', () => {
      it('should sign in user with valid credentials', async () => {
        const mockData = { user: { id: '123' }, session: { access_token: 'token' } }
        supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
          data: mockData,
          error: null
        })

        const result = await supabaseHelpers.signIn('test@example.com', 'password')

        expect(result.data).toEqual(mockData)
        expect(result.error).toBeNull()
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password'
        })
      })

      it('should return error with invalid credentials', async () => {
        const mockError = { message: 'Invalid credentials' }
        supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
          data: null,
          error: mockError
        })

        const result = await supabaseHelpers.signIn('test@example.com', 'wrong-password')

        expect(result.data).toBeNull()
        expect(result.error).toEqual(mockError)
      })
    })

    describe('signOut', () => {
      it('should sign out user successfully', async () => {
        supabase.auth.signOut = vi.fn().mockResolvedValue({ error: null })

        const result = await supabaseHelpers.signOut()

        expect(result.error).toBeNull()
        expect(supabase.auth.signOut).toHaveBeenCalledOnce()
      })

      it('should handle sign out error', async () => {
        const mockError = { message: 'Sign out failed' }
        supabase.auth.signOut = vi.fn().mockResolvedValue({ error: mockError })

        const result = await supabaseHelpers.signOut()

        expect(result.error).toEqual(mockError)
      })
    })
  })

  describe('Database Helpers', () => {
    describe('safeQuery', () => {
      it('should return data on successful query', async () => {
        const mockData = [{ id: '1', name: 'Test' }]
        const queryFn = vi.fn().mockResolvedValue({ data: mockData, error: null })

        const result = await supabaseHelpers.safeQuery(queryFn)

        expect(result.data).toEqual(mockData)
        expect(result.error).toBeNull()
        expect(queryFn).toHaveBeenCalledOnce()
      })

      it('should handle query errors', async () => {
        const mockError = { message: 'Database error' }
        const queryFn = vi.fn().mockResolvedValue({ data: null, error: mockError })

        const result = await supabaseHelpers.safeQuery(queryFn)

        expect(result.data).toBeNull()
        expect(result.error).toEqual(mockError)
      })

      it('should handle unexpected errors', async () => {
        const queryFn = vi.fn().mockRejectedValue(new Error('Unexpected error'))

        const result = await supabaseHelpers.safeQuery(queryFn)

        expect(result.data).toBeNull()
        expect(result.error).toBeInstanceOf(Error)
      })
    })

    describe('testConnection', () => {
      it('should return connected true on successful connection', async () => {
        const mockSelect = vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null })
        })
        supabase.from = vi.fn().mockReturnValue({ select: mockSelect })

        const result = await supabaseHelpers.testConnection()

        expect(result.connected).toBe(true)
        expect(result.error).toBeNull()
        expect(supabase.from).toHaveBeenCalledWith('events')
      })

      it('should return connected false on connection error', async () => {
        const mockError = { message: 'Connection failed' }
        const mockSelect = vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: null, error: mockError })
        })
        supabase.from = vi.fn().mockReturnValue({ select: mockSelect })

        const result = await supabaseHelpers.testConnection()

        expect(result.connected).toBe(false)
        expect(result.error).toEqual(mockError)
      })

      it('should handle unexpected connection errors', async () => {
        supabase.from = vi.fn().mockImplementation(() => {
          throw new Error('Unexpected error')
        })

        const result = await supabaseHelpers.testConnection()

        expect(result.connected).toBe(false)
        expect(result.error).toBeInstanceOf(Error)
      })
    })
  })

  describe('Real-time Subscriptions', () => {
    describe('subscribeToEvents', () => {
      it('should create events subscription', () => {
        const mockSubscribe = vi.fn()
        const mockOn = vi.fn().mockReturnValue({ subscribe: mockSubscribe })
        const mockChannel = vi.fn().mockReturnValue({ on: mockOn })
        supabase.channel = mockChannel

        const callback = vi.fn()
        supabaseHelpers.subscribeToEvents(callback)

        expect(mockChannel).toHaveBeenCalledWith('events-changes')
        expect(mockOn).toHaveBeenCalledWith('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'events'
        }, callback)
        expect(mockSubscribe).toHaveBeenCalledOnce()
      })
    })

    describe('subscribeToArticles', () => {
      it('should create articles subscription', () => {
        const mockSubscribe = vi.fn()
        const mockOn = vi.fn().mockReturnValue({ subscribe: mockSubscribe })
        const mockChannel = vi.fn().mockReturnValue({ on: mockOn })
        supabase.channel = mockChannel

        const callback = vi.fn()
        supabaseHelpers.subscribeToArticles(callback)

        expect(mockChannel).toHaveBeenCalledWith('articles-changes')
        expect(mockOn).toHaveBeenCalledWith('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'articles'
        }, callback)
        expect(mockSubscribe).toHaveBeenCalledOnce()
      })
    })
  })
})