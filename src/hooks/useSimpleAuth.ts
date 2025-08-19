import { useState, useEffect, useCallback } from 'react'

export type AdminRole = 'admin' | 'moderator' | null

interface AuthState {
  role: AdminRole
  authenticated: boolean
  expires: number
  authenticatedAt: number
}

export const useSimpleAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    role: null,
    authenticated: false,
    expires: 0,
    authenticatedAt: 0
  })
  const [loading, setLoading] = useState(true)

  // Check authentication status
  const checkAuth = useCallback(() => {
    try {
      const stored = localStorage.getItem('blkout_admin_auth')
      if (!stored) {
        setAuthState({
          role: null,
          authenticated: false,
          expires: 0,
          authenticatedAt: 0
        })
        setLoading(false)
        return false
      }

      const authData: AuthState = JSON.parse(stored)
      const now = Date.now()

      // Check if auth has expired
      if (now > authData.expires) {
        localStorage.removeItem('blkout_admin_auth')
        setAuthState({
          role: null,
          authenticated: false,
          expires: 0,
          authenticatedAt: 0
        })
        setLoading(false)
        return false
      }

      // Check if session is older than 24 hours (auto-refresh daily)
      const dayInMs = 24 * 60 * 60 * 1000
      if (now - authData.authenticatedAt > dayInMs) {
        // Session expired, require re-auth
        localStorage.removeItem('blkout_admin_auth')
        setAuthState({
          role: null,
          authenticated: false,
          expires: 0,
          authenticatedAt: 0
        })
        setLoading(false)
        return false
      }

      setAuthState(authData)
      setLoading(false)
      return true
    } catch (error) {
      console.error('Error checking auth:', error)
      localStorage.removeItem('blkout_admin_auth')
      setAuthState({
        role: null,
        authenticated: false,
        expires: 0,
        authenticatedAt: 0
      })
      setLoading(false)
      return false
    }
  }, [])

  // Initialize auth check
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Authenticate user
  const authenticate = useCallback((role: 'admin' | 'moderator') => {
    const expiry = new Date('2025-11-17').getTime() // 90 days from August 19, 2025
    const authData: AuthState = {
      role,
      authenticated: true,
      expires: expiry,
      authenticatedAt: Date.now()
    }

    localStorage.setItem('blkout_admin_auth', JSON.stringify(authData))
    setAuthState(authData)
  }, [])

  // Sign out
  const signOut = useCallback(() => {
    localStorage.removeItem('blkout_admin_auth')
    setAuthState({
      role: null,
      authenticated: false,
      expires: 0,
      authenticatedAt: 0
    })
  }, [])

  // Check if user has specific role
  const hasRole = useCallback((requiredRole: 'admin' | 'moderator'): boolean => {
    if (!authState.authenticated) return false
    
    // Admin can access everything
    if (authState.role === 'admin') return true
    
    // Moderator can only access moderator features
    return authState.role === requiredRole
  }, [authState])

  // Get days remaining until expiry
  const daysRemaining = Math.ceil((authState.expires - Date.now()) / (1000 * 60 * 60 * 24))

  return {
    // State
    authenticated: authState.authenticated,
    role: authState.role,
    loading,
    daysRemaining: authState.authenticated ? Math.max(0, daysRemaining) : 0,
    
    // Methods
    authenticate,
    signOut,
    checkAuth,
    hasRole,
    
    // Helpers
    isAdmin: authState.role === 'admin',
    isModerator: authState.role === 'moderator' || authState.role === 'admin',
    expiresAt: new Date(authState.expires)
  }
}