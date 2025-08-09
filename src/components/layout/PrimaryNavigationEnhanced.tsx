'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Search, Home, ChevronDown } from 'lucide-react'

const navigationItems = [
  { name: 'Latest Issue', href: '/platform', description: 'Current stories and featured content' },
  { name: 'Story Archive', href: '/stories', description: 'Complete archive of stories and analysis' },
  { 
    name: 'Media', 
    href: '/media', 
    description: 'Community media platforms',
    submenu: [
      { name: 'Channel BLKOUT', href: '/media/channel', description: 'Video content and live streaming' },
      { name: 'Storylab', href: '/media/storylab', description: 'Community storytelling platform' },
      { name: 'Newsroom', href: '/media/newsroom', description: 'News aggregation and analysis' }
    ]
  },
  { name: 'I.V.O.R.', href: '/ivor', description: 'AI assistant and resource finder' },
  { name: 'Events', href: '/events', description: 'Community events calendar' },
  { name: 'Chrome Extension', href: '/extension', description: 'Download our content submission extension' },
  { name: 'Our Movement', href: '/movement', description: 'Movement principles and community values' },
  { name: 'Join Discussion', href: '/discussions', description: 'Community discussions and conversations' }
]

interface PrimaryNavigationProps {
  className?: string
}

export default function PrimaryNavigationEnhanced({ className = '' }: PrimaryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to stories page with search query
      window.location.href = `/stories?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/platform') {
      return location.pathname === '/platform'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      className={`bg-indigo-950 border-b border-indigo-800/30 sticky top-0 z-50 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          
          {/* Logo - Mobile optimized */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white font-bold text-lg sm:text-xl lg:text-2xl hover:text-indigo-200 transition-colors focus-enhanced"
              aria-label="BLKOUT Home"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-electric-cyan to-electric-magenta rounded-lg flex items-center justify-center">
                <span className="text-xs sm:text-sm font-black text-white">B</span>
              </div>
              <span className="hidden sm:inline">BLKOUT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 focus-enhanced ${
                    isActive(item.href)
                      ? 'text-white bg-indigo-800/50 rounded-md'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30 rounded-md'
                  }`}
                >
                  {item.name}
                </Link>
                
                {/* Dropdown menu for desktop */}
                {item.children && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.children.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-enhanced"
                          target={subItem.external ? '_blank' : undefined}
                          rel={subItem.external ? 'noopener noreferrer' : undefined}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 text-sm bg-indigo-900/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-indigo-300 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile menu button - Enhanced touch target */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="touch-target text-indigo-200 hover:text-white focus-enhanced rounded-md"
              aria-expanded={isOpen}
              aria-label="Toggle main menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Enhanced mobile UX */}
        {isOpen && (
          <div className="lg:hidden border-t border-indigo-800/30">
            <div className="py-4 space-y-1">
              
              {/* Mobile Search */}
              <div className="px-2 pb-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-indigo-900/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button type="submit" className="absolute right-3 top-3.5 text-indigo-300 hover:text-white transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Mobile Navigation Links */}
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`block px-4 py-3 text-base font-medium transition-colors duration-200 touch-target focus-enhanced ${
                      isActive(item.href)
                        ? 'text-white bg-indigo-800/50 border-l-4 border-electric-cyan'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  
                  {/* Mobile submenu */}
                  {item.children && (
                    <div className="pl-6 space-y-1">
                      {item.children.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-800/20 transition-colors touch-target focus-enhanced"
                          target={subItem.external ? '_blank' : undefined}
                          rel={subItem.external ? 'noopener noreferrer' : undefined}
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA */}
              <div className="px-4 pt-4 border-t border-indigo-800/30">
                <Link
                  to="/community"
                  className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-gradient-to-r from-electric-cyan to-electric-magenta rounded-lg hover:opacity-90 transition-opacity touch-target focus-enhanced"
                  onClick={() => setIsOpen(false)}
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}