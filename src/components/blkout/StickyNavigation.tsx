'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Layout } from 'lucide-react'
import { NAVIGATION_ITEMS } from '@/lib/constants'

interface StickyNavigationProps {
  onToggleLayout?: () => void
}

export default function StickyNavigation({ onToggleLayout }: StickyNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  const { scrollYProgress } = useScroll()
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1, 0.3, 0.6, 0.9],
    [
      'rgba(10, 10, 10, 0.1)',      // Slightly visible at top
      'rgba(10, 10, 10, 0.9)',      // blkout-deep
      'rgba(0, 255, 255, 0.9)',     // electric-cyan
      'rgba(255, 0, 85, 0.9)',      // electric-magenta
      'rgba(123, 104, 238, 0.9)'    // electric-indigo
    ]
  )

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', element: document.getElementById('hero') },
        { id: 'values', element: document.getElementById('values') },
        { id: 'principles', element: document.getElementById('principles') },
        { id: 'community', element: document.getElementById('community') }
      ]

      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        if (section.element) {
          const top = section.element.offsetTop
          const bottom = top + section.element.offsetHeight

          if (scrollPosition >= top && scrollPosition <= bottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.replace('/', ''))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        style={{ backgroundColor }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-bold text-xl text-white cursor-pointer"
            >
              <span className="bg-gradient-to-r from-blkout-secondary to-blkout-warm bg-clip-text text-transparent">
                BLKOUT
              </span>
              <span className="text-white">UK</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.href.replace('/', '') || 
                    (item.href === '/' && activeSection === 'home')
                      ? 'text-blkout-secondary'
                      : 'text-white/80 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Layout Toggle */}
              {onToggleLayout && (
                <motion.button
                  onClick={onToggleLayout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
                  title="Switch to Direct Access"
                >
                  <Layout className="w-4 h-4" />
                  <span className="text-xs">Direct</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/20">
          <motion.div
            style={{ width: progressWidth }}
            className="h-full bg-gradient-to-r from-blkout-secondary via-blkout-warm to-blkout-primary"
          />
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          y: isMenuOpen ? 0 : -100
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-40 bg-blkout-deep/95 backdrop-blur-lg border-b border-white/10 ${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden`}
      >
        <div className="px-6 py-4 space-y-4">
          {NAVIGATION_ITEMS.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className={`block w-full text-left py-2 text-lg font-medium transition-colors duration-200 ${
                activeSection === item.href.replace('/', '') || 
                (item.href === '/' && activeSection === 'home')
                  ? 'text-blkout-secondary'
                  : 'text-white/80'
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Floating Section Indicators */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
      >
        <div className="space-y-4">
          {[
            { id: 'pre-engagement', label: 'Welcome' },
            { id: 'hero', label: 'Hero' },
            { id: 'values', label: 'Values' },
            { id: 'complexity', label: 'Complexity' },
            { id: 'principles', label: 'Principles' },
            { id: 'community', label: 'Community' }
          ].map((section) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Dot indicator */}
              <motion.div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blkout-secondary border-blkout-secondary scale-125'
                    : 'border-white/50 bg-transparent hover:border-white'
                }`}
                animate={{
                  scale: activeSection === section.id ? 1.25 : 1,
                  backgroundColor: activeSection === section.id ? '#F4A261' : 'transparent'
                }}
              />
              
              {/* Label tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                whileHover={{ opacity: 1, x: 0, scale: 1 }}
                className="absolute right-6 px-3 py-1 bg-blkout-deep/90 text-white text-sm rounded-md backdrop-blur-sm border border-white/20 whitespace-nowrap"
              >
                {section.label}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Scroll to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 w-12 h-12 bg-blkout-primary text-white rounded-full shadow-lg z-40 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: scrollYProgress.get() > 0.2 ? 1 : 0,
          scale: scrollYProgress.get() > 0.2 ? 1 : 0
        }}
        whileHover={{ scale: 1.1, backgroundColor: '#E76F51' }}
        whileTap={{ scale: 0.9 }}
      >
        ↑
      </motion.button>
    </>
  )
}