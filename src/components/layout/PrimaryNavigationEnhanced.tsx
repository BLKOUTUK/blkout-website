'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Search, Home } from 'lucide-react'

const navigationItems = [
  { name: 'Latest Issue', href: '/platform', description: 'Current stories and featured content' },
  { name: 'Story Archive', href: '/stories', description: 'Complete archive of stories and analysis' },
  { name: 'I.V.O.R.', href: '/ivor', description: 'AI assistant and resource finder' },
  { name: 'Events', href: '/events', description: 'Community events calendar' },
  { name: 'Our Movement', href: '/movement', description: 'Movement principles and community values' },
  { name: 'Join Discussion', href: '/community', description: 'Community engagement and HUB access' }
]

interface PrimaryNavigationProps {
  className?: string
}

export default function PrimaryNavigationEnhanced({ className = '' }: PrimaryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/platform') {
      return location.pathname === '/platform'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <nav className={`bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 border-b border-indigo-800/30 sticky top-0 z-50 backdrop-blur-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/platform" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg heading-block">B</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white heading-block uppercase">
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    BLKOUT
                  </span>
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent ml-1">
                    UK
                  </span>
                </span>
                <div className="text-xs text-indigo-300 font-mono uppercase tracking-wider -mt-1">
                  PLATFORM
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-6 py-3 text-sm font-bold transition-all duration-300 relative group heading-block uppercase tracking-wide ${
                  isActive(item.href)
                    ? 'text-white bg-indigo-700/50 backdrop-blur-sm'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-violet-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Enhanced Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 p-4 bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-700/50 text-indigo-100 text-sm rounded-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-sm">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-950 rotate-45 border-t border-l border-indigo-700/50"></div>
                  <p className="font-light leading-relaxed">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Enhanced Search Bar */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 pl-12 pr-4 py-3 bg-indigo-900/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:bg-indigo-900/70 transition-all backdrop-blur-sm font-light"
                />
              </div>
            </div>

            {/* Back to Landing */}
            <Link
              to="/"
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-indigo-300 hover:text-white transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-mono uppercase tracking-wider">About</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 text-indigo-300 hover:text-white hover:bg-indigo-800/30 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-indigo-800/30 bg-indigo-950/50 backdrop-blur-sm"
          >
            <div className="py-6 space-y-3">
              
              {/* Mobile Search */}
              <div className="px-4 pb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-indigo-900/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light"
                  />
                </div>
              </div>

              {/* Enhanced Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-4 text-sm font-bold transition-all heading-block uppercase tracking-wide ${
                    isActive(item.href)
                      ? 'text-white bg-indigo-700/50 border-r-4 border-indigo-400'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                  }`}
                >
                  <div>
                    <div className="font-black mb-1">{item.name}</div>
                    <div className="text-xs text-indigo-400 font-light normal-case tracking-normal">{item.description}</div>
                  </div>
                </Link>
              ))}

              {/* Enhanced Mobile Back to Landing */}
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 text-sm text-indigo-300 hover:text-white border-t border-indigo-800/30 mt-4 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5" />
                  <span className="font-mono uppercase tracking-wider">Back to About BLKOUT</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}