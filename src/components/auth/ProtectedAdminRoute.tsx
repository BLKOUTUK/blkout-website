'use client'

import React, { useState } from 'react'
import { useSimpleAuth } from '../../hooks/useSimpleAuth'
import SimpleAdminAuth from './SimpleAdminAuth'
import { motion } from 'framer-motion'
import { Shield, Clock, LogOut, Crown, Users } from 'lucide-react'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'moderator'
  title?: string
}

export default function ProtectedAdminRoute({ 
  children, 
  requiredRole = 'moderator',
  title = 'Admin Dashboard'
}: ProtectedAdminRouteProps) {
  const { authenticated, role, loading, hasRole, signOut, authenticate, daysRemaining } = useSimpleAuth()
  const [showAuth, setShowAuth] = useState(false)

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-indigo-200">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!authenticated || !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
        <SimpleAdminAuth 
          onAuthenticated={authenticate}
        />
      </div>
    )
  }

  // Render protected content with auth header
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Auth Status Header */}
      <div className="bg-indigo-900/30 backdrop-blur-sm border-b border-indigo-700/30">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">{title}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-800/50 rounded-full">
                {role === 'admin' ? (
                  <Crown className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Users className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-indigo-200 text-sm capitalize font-medium">
                  {role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Expiry Warning */}
              {daysRemaining <= 30 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200 text-sm">
                    {daysRemaining} days left
                  </span>
                </div>
              )}

              {/* Sign Out Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-1 text-indigo-300 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Protected Content */}
      <div className="relative">
        {children}
      </div>

      {/* Expiry Warning Banner */}
      {daysRemaining <= 7 && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-700 rounded-lg p-4 max-w-sm shadow-2xl backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium text-sm">
                Temporary Access Expiring Soon
              </p>
              <p className="text-red-300 text-xs mt-1">
                {daysRemaining} days remaining. Contact administrators for permanent access setup.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}