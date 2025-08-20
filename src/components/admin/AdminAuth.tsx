'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Shield, Eye, EyeOff, Calendar, Crown, Users, LogOut } from 'lucide-react'

interface AdminAuthProps {
  children: React.ReactNode
}

// 90-day temporary authentication system
const ADMIN_PASSWORD = 'BLKOUT2025!Admin'
const MODERATOR_PASSWORD = 'BLKOUT2025!Mod'
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
    
    let role: 'admin' | 'moderator' | null = null
    
    if (password === ADMIN_PASSWORD) {
      role = 'admin'
    } else if (password === MODERATOR_PASSWORD) {
      role = 'moderator'  
    } else {
      setError('Invalid password. Contact administrators if you need access.')
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
              Enter admin or moderator password to access the dashboard
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
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-indigo-800/50 border border-indigo-600 rounded text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-900/30 border border-red-700/50 rounded p-3 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded hover:from-emerald-500 hover:to-indigo-500 transition-all uppercase"
            >
              Access Admin Panel
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Admin Header with Logout */}
      <div className="bg-indigo-900/50 backdrop-blur-sm border-b border-indigo-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">BLKOUT Admin Panel</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-indigo-800/50 rounded">
                    {userRole === 'admin' ? (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    ) : (
                      <Users className="w-3 h-3 text-blue-400" />
                    )}
                    <span className="text-xs text-indigo-200 capitalize font-medium">
                      {userRole}
                    </span>
                  </div>
                  {daysRemaining <= 30 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-900/30 border border-yellow-700/50 rounded">
                      <Calendar className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-200">
                        {daysRemaining} days left
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <a href="/admin" className="text-indigo-200 hover:text-white transition-colors text-sm">
                  Dashboard
                </a>
                <a href="/admin/events" className="text-indigo-200 hover:text-white transition-colors text-sm">
                  Events
                </a>
                <a href="/admin/newsroom" className="text-indigo-200 hover:text-white transition-colors text-sm">
                  Newsroom
                </a>
                <a href="/admin/governance" className="text-indigo-200 hover:text-white transition-colors text-sm">
                  Governance
                </a>
                <a href="/admin/moderation" className="text-indigo-200 hover:text-white transition-colors text-sm">
                  Moderation
                </a>
              </nav>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/30 text-red-200 rounded hover:bg-red-600/30 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  )
}