'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Menu, User } from 'lucide-react'

interface MagazineLayoutProps {
  children: React.ReactNode
  showBackButton?: boolean
  onBack?: () => void
  title?: string
  subtitle?: string
}

export default function MagazineLayout({ 
  children, 
  showBackButton = false, 
  onBack,
  title,
  subtitle 
}: MagazineLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Magazine Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button or Logo */}
            <div className="flex items-center space-x-4">
              {showBackButton ? (
                <motion.button
                  onClick={onBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-electric-magenta transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-magenta to-electric-cyan rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">BLKOUT</div>
                    <div className="text-xs text-gray-500 -mt-1">Stories</div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Center: Section Title (if provided) */}
            {title && (
              <div className="hidden md:block text-center">
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            )}

            {/* Right: Search and Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-electric-magenta transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-electric-magenta transition-colors"
              >
                <User className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-electric-magenta transition-colors md:hidden"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-electric-magenta to-electric-cyan rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="font-bold text-gray-900">BLKOUT Stories</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Authentic narratives and analysis from Black QTIPOC+ voices building cooperative power.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Sections</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Personal Stories</a></li>
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Analysis</a></li>
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Movement</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Community Hub</a></li>
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-electric-magenta transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; 2025 BLKOUT. Building cooperative power through authentic storytelling.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}