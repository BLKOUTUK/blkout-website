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

export default function PrimaryNavigation({ className = '' }: PrimaryNavigationProps) {
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
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/platform" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blkout-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BLKOUTUK</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group ${
                  isActive(item.href)
                    ? 'text-blkout-primary bg-blkout-primary/10'
                    : 'text-gray-700 hover:text-blkout-primary hover:bg-gray-50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blkout-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Tooltip on hover */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  {item.description}
                </div>
              </Link>
            ))}
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-3">
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blkout-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Back to Landing */}
            <Link
              to="/"
              className="hidden md:flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>About</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200"
          >
            <div className="py-4 space-y-2">
              
              {/* Mobile Search */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blkout-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blkout-primary bg-blkout-primary/10 border-r-2 border-blkout-primary'
                      : 'text-gray-700 hover:text-blkout-primary hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </div>
                </Link>
              ))}

              {/* Mobile Back to Landing */}
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-gray-500 hover:text-gray-700 border-t border-gray-200 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Back to About BLKOUT</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}