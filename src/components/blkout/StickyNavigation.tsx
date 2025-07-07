import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const StickyNavigation: React.FC = () => {
  const navRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'definitions', label: 'Definitions' },
    { id: 'projects', label: 'Projects' },
    { id: 'possibilities', label: 'Future' },
    { id: 'quiz', label: 'Quiz' }
  ]

  useEffect(() => {
    if (!progressRef.current) return

    // Scroll progress indicator
    gsap.to(progressRef.current, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    })

    // Section tracking
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index)
      })
    })

    return () => ScrollTrigger.getAll().forEach(st => st.kill())
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      gsap.to(window, {
        scrollTo: { y: element, offsetY: 80 },
        duration: 1.5,
        ease: 'power2.inOut'
      })
    }
  }

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10"
    >
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blkout-secondary to-blkout-warm">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blkout-primary to-blkout-accent"
          style={{ width: '0%' }}
        />
      </div>

      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <img 
              src="/images/BLKOUTpride2025.png" 
              alt="BLKOUT Pride 2025" 
              className="h-8 w-auto"
            />
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  activeSection === index
                    ? 'text-blkout-secondary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {section.label}
                {activeSection === index && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blkout-secondary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default StickyNavigation