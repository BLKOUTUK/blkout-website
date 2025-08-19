'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Shield, Calendar, Users } from 'lucide-react'
import { showSuccess, showError } from '../../utils/notifications'

interface SimpleAdminAuthProps {
  onAuthenticated: (role: 'admin' | 'moderator') => void
  onClose?: () => void
}

export default function SimpleAdminAuth({ onAuthenticated, onClose }: SimpleAdminAuthProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Simple password system for 90-day temporary access
  // In production, replace with proper Supabase auth
  const ADMIN_PASSWORD = 'BLKOUT2025!Admin'
  const MODERATOR_PASSWORD = 'BLKOUT2025!Mod'
  const EXPIRY_DATE = new Date('2025-11-17') // 90 days from August 19, 2025

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if temporary auth period has expired
      const now = new Date()
      if (now > EXPIRY_DATE) {
        showError('Access Expired', 'Temporary authentication has expired. Please contact administrators for updated access.')
        setLoading(false)
        return
      }

      // Simple password validation
      if (password === ADMIN_PASSWORD) {
        // Store auth in localStorage with expiry
        const authData = {
          role: 'admin',
          authenticated: true,
          expires: EXPIRY_DATE.getTime(),
          authenticatedAt: Date.now()
        }
        localStorage.setItem('blkout_admin_auth', JSON.stringify(authData))
        
        showSuccess('Admin Access Granted', 'Welcome to BLKOUTNXT Admin Dashboard')
        onAuthenticated('admin')
      } else if (password === MODERATOR_PASSWORD) {
        // Store auth in localStorage with expiry
        const authData = {
          role: 'moderator',
          authenticated: true,
          expires: EXPIRY_DATE.getTime(),
          authenticatedAt: Date.now()
        }
        localStorage.setItem('blkout_admin_auth', JSON.stringify(authData))
        
        showSuccess('Moderator Access Granted', 'Welcome to BLKOUTNXT Moderation Dashboard')
        onAuthenticated('moderator')
      } else {
        showError('Access Denied', 'Invalid password. Contact administrators if you need access.')
      }
    } catch (error) {
      console.error('Auth error:', error)
      showError('Authentication Error', 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const daysRemaining = Math.ceil((EXPIRY_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-700/50 rounded-xl max-w-md w-full p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white heading-block uppercase mb-2">
            Admin Access
          </h2>
          <p className="text-indigo-200 text-sm">
            Community moderation and administration
          </p>
        </div>

        {/* Temporary Access Notice */}
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-yellow-200 font-medium text-sm">Temporary Access Period</p>
              <p className="text-yellow-300 text-xs">
                {daysRemaining} days remaining • Expires November 17, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-indigo-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter admin/moderator password"
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

          {/* Role Information */}
          <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-lg p-4">
            <h3 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Available Roles
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-indigo-200">Admin</span>
                <span className="text-emerald-400">Full Dashboard Access</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-200">Moderator</span>
                <span className="text-yellow-400">Content Moderation</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !password.trim()}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded-lg hover:from-emerald-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Authenticating...
              </div>
            ) : (
              'Access Dashboard'
            )}
          </motion.button>

          {/* Cancel Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-indigo-300 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-indigo-700/30">
          <p className="text-xs text-indigo-400 text-center">
            🔒 Temporary authentication system for community launch
          </p>
          <p className="text-xs text-indigo-500 text-center mt-1">
            Transitioning to full Supabase auth in 90 days
          </p>
        </div>
      </motion.div>
    </div>
  )
}