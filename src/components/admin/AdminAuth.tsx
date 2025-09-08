import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Shield, Eye, EyeOff, Calendar, Crown, Users, LogOut } from 'lucide-react'

interface AdminAuthProps {
  children: React.ReactNode
}

// 90-day temporary authentication system - Unified Password with Role Differentiation
const UNIFIED_PASSWORD = 'BLKOUT2025!'
const ADMIN_SUFFIX = 'admin'
const MODERATOR_SUFFIX = 'mod' 
const EXPIRY_DATE = new Date('2025-11-17') // 90 days from August 19, 2025

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'moderator' | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated and not expired
    try {
      const stored = localStorage.getItem('blkout_admin_auth')
      if (stored) {
        const authData = JSON.parse(stored)
        const now = Date.now()
        
        // Check if auth has expired (90 days or 24 hours session)
        if (now > authData.expires || now - authData.authenticatedAt > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('blkout_admin_auth')
        } else {
          setIsAuthenticated(true)
          setUserRole(authData.role)
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      localStorage.removeItem('blkout_admin_auth')
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if temporary auth period has expired
    const now = new Date()
    if (now > EXPIRY_DATE) {
      setError('Temporary authentication has expired. Please contact administrators for updated access.')
      return
    }
    
    // Unified password system with role differentiation
    let role: 'admin' | 'moderator' | null = null
    
    if (password === `${UNIFIED_PASSWORD}${ADMIN_SUFFIX}`) {
      role = 'admin'
    } else if (password === `${UNIFIED_PASSWORD}${MODERATOR_SUFFIX}`) {
      role = 'moderator'
    } else if (password === UNIFIED_PASSWORD) {
      // Default to admin for base password
      role = 'admin'
    } else {
      setError('Invalid password. Use BLKOUT2025! (admin) or BLKOUT2025!mod (moderator)')
      setPassword('')
      return
    }

    // Store auth with expiry
    const authData = {
      role,
      authenticated: true,
      expires: EXPIRY_DATE.getTime(),
      authenticatedAt: Date.now()
    }
    
    localStorage.setItem('blkout_admin_auth', JSON.stringify(authData))
    setIsAuthenticated(true)
    setUserRole(role)
    setError('')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    localStorage.removeItem('blkout_admin_auth')
    setPassword('')
  }

  const daysRemaining = Math.ceil((EXPIRY_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-200">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-900/50 backdrop-blur-sm border border-indigo-700/30 rounded-lg p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white heading-block uppercase mb-2">
              Admin Access Required
            </h1>
            <p className="text-indigo-200">
              Enter BLKOUT2025! for admin access, or BLKOUT2025!mod for moderator access
            </p>
            
            {/* 90-Day Notice */}
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="text-yellow-200 text-xs font-medium">Temporary Access Period</p>
                  <p className="text-yellow-300 text-xs">
                    {daysRemaining} days remaining • Expires November 17, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">
                BLKOUT Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-indigo-950/50 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="BLKOUT2025! or BLKOUT2025!mod"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-indigo-400 hover:text-indigo-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-emerald-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* User info bar */}
      <div className="bg-indigo-900/30 backdrop-blur-sm border-b border-indigo-700/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userRole === 'admin' ? <Crown className="w-5 h-5 text-yellow-400" /> : <Users className="w-5 h-5 text-indigo-400" />}
            <span className="text-white font-medium">
              {userRole === 'admin' ? 'Administrator' : 'Moderator'} Access
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
      
      {children}
    </div>
  )
}