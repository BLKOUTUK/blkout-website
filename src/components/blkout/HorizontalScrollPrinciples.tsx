'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DEVELOPMENT_PRINCIPLES } from '../../lib/constants'
import RetroImage from './RetroImage'

gsap.registerPlugin(ScrollTrigger)

// Extended content for carousel pages
const carouselPages = [
  {
    title: "Our Development Philosophy",
    subtitle: "Principles that guide how we build together",
    content: "Every line of code, every feature, every decision is guided by our commitment to cooperative ownership and Black queer liberation.",
    icon: "🎯"
  },
  {
    title: "Community-Driven Development", 
    subtitle: "Building with, not for",
    content: "We believe the best technology emerges from authentic community engagement. Our development process centers the voices of those most impacted.",
    icon: "👥"
  },
  {
    title: "Trust-Based Technology",
    subtitle: "Moving at the speed of trust",
    content: "We reject the move-fast-and-break-things mentality. Instead, we build deliberately, with care, ensuring our technology serves liberation.",
    icon: "🤝"
  },
  {
    title: "Iterative Excellence",
    subtitle: "Small is good, small is all", 
    content: "Rather than massive overhauls, we believe in incremental improvements that compound into transformative change over time.",
    icon: "🔄"
  }
]

export default function HorizontalScrollPrinciples() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollContent = scrollContentRef.current
      const container = containerRef.current
      const progress = progressRef.current

      if (!scrollContent || !container) return

      // Calculate scroll distance: content width + principles cards width
      const principlesWidth = DEVELOPMENT_PRINCIPLES.length * 400 + 400 // Include CTA card
      const carouselWidth = carouselPages.length * window.innerWidth
      const totalScrollDistance = carouselWidth + principlesWidth

      // Create main horizontal scroll animation
      const horizontalTL = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${totalScrollDistance}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update progress bar
            if (progress) {
              progress.style.width = `${self.progress * 100}%`
            }
          }
        }
      })

      // Animate the scroll content
      horizontalTL.to(scrollContent, {
        x: -totalScrollDistance,
        ease: "none",
        duration: 1
      })

      // Animate individual carousel pages
      const pages = scrollContent.querySelectorAll('.carousel-page')
      pages.forEach((page, index) => {
        gsap.fromTo(page.querySelector('.page-content'),
          {
            opacity: 0,
            y: 100,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: page,
              start: "left 90%",
              end: "left 10%",
              containerAnimation: horizontalTL,
              toggleActions: "play none none reverse"
            }
          }
        )
      })

      // Animate principle cards
      const principleCards = scrollContent.querySelectorAll('.principle-card')
      principleCards.forEach((card, index) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotationY: -15
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out",
            scrollTrigger: {
              trigger: card,
              start: "left 80%",
              end: "left 20%",
              containerAnimation: horizontalTL,
              toggleActions: "play none none reverse"
            }
          }
        )
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-gradient-to-r from-blkout-deep via-blkout-accent to-blkout-primary"
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blkout-secondary to-blkout-warm transition-all duration-100"
          style={{ width: '0%' }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute top-8 right-8 z-20 text-white/60 text-sm">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2"
        >
          <span>Scroll to explore</span>
          <span>→</span>
        </motion.div>
      </div>

      {/* Horizontal Scroll Content */}
      <div 
        ref={scrollContentRef}
        className="flex h-full"
        style={{ width: 'max-content' }}
      >
        {/* Carousel Pages */}
        {carouselPages.map((page, index) => (
          <div
            key={`page-${index}`}
            className="carousel-page flex-shrink-0 flex items-center justify-center"
            style={{ width: '100vw', height: '100vh' }}
          >
            <div className="page-content text-center px-8 max-w-4xl">
              <motion.div
                className="text-8xl mb-8"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
              >
                {page.icon}
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {page.title}
              </h2>
              
              <h3 className="text-2xl md:text-3xl text-blkout-secondary mb-8 font-semibold">
                {page.subtitle}
              </h3>
              
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                {page.content}
              </p>

              {/* Page indicator */}
              <div className="flex justify-center mt-12 space-x-2">
                {carouselPages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === index ? 'bg-blkout-secondary scale-125' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Resilience Imagery Section */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '100vw', height: '100vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-6xl w-full">
            
            {/* John Henry - Breaking Through Systems */}
            <motion.div 
              className="aspect-[4/3] rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <RetroImage
                src="/src/assets/images/John Henry.png"
                alt="John Henry figure against brick wall with systemic challenges"
                vcrIntensity="heavy"
                className="w-full h-full"
                overlayContent={
                  <motion.div 
                    className="p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-electric-magenta/40"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <h3 className="text-2xl font-bold text-electric-magenta mb-3">
                      Breaking Through Systems
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      Like John Henry, we face systemic barriers with determination and collective strength. 
                      Every wall becomes a doorway when we build together.
                    </p>
                  </motion.div>
                }
              />
            </motion.div>

            {/* Baldwin - Voices That Matter */}
            <motion.div 
              className="aspect-[4/3] rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <RetroImage
                src="/src/assets/images/seat with baldwin.png"
                alt="James Baldwin sitting among empty chairs on red background"
                vcrIntensity="medium"
                className="w-full h-full"
                overlayContent={
                  <motion.div 
                    className="p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-electric-cyan/40"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <h3 className="text-2xl font-bold text-electric-cyan mb-3">
                      Every Voice Matters
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      In the table we're building together, every voice has a seat. 
                      Our principles create space for all who dare to dream liberation.
                    </p>
                  </motion.div>
                }
              />
            </motion.div>
          </div>
        </div>

        {/* Development Principles Cards */}
        <div className="flex items-center h-full py-20" style={{ minWidth: 'max-content' }}>
          {/* Section divider */}
          <div className="w-px h-32 bg-white/20 mx-16" />
          
          {DEVELOPMENT_PRINCIPLES.map((principle, index) => {
            const [quote, description] = principle.split(' - ')
            
            return (
              <motion.div
                key={index}
                className="principle-card flex-shrink-0 w-80 md:w-96 mx-8 p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20"
                style={{
                  perspective: 1000,
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="text-6xl font-bold text-blkout-secondary/30 mb-4">
                  0{index + 1}
                </div>

                <motion.h3
                  className="text-2xl font-bold text-white mb-6 leading-tight"
                  whileHover={{ scale: 1.05 }}
                >
                  {quote}
                </motion.h3>

                <motion.p
                  className="text-gray-200 text-lg leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {description}
                </motion.p>

                <div className="absolute top-4 right-4 w-12 h-1 bg-gradient-to-r from-blkout-secondary to-blkout-warm rounded-full" />
                <div className="absolute bottom-4 left-4 w-8 h-1 bg-gradient-to-r from-blkout-warm to-blkout-secondary rounded-full" />

                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-blkout-secondary to-blkout-warm rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                >
                  {index === 0 && '🤝'}
                  {index === 1 && '🏗️'}
                  {index === 2 && '👥'}
                  {index === 3 && '🌉'}
                </motion.div>
              </motion.div>
            )
          })}

          {/* Final CTA Card */}
          <motion.div
            className="principle-card flex-shrink-0 w-80 md:w-96 mx-8 p-8 rounded-2xl bg-gradient-to-br from-blkout-secondary via-blkout-warm to-blkout-primary text-white"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                ✊🏿
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">
                Ready for Real Dialogue?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join conversations that shape our collective future
              </p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-white rounded-full font-semibold transition-all"
              >
                Join the Journey
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-blkout-secondary/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -30, 0],
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-blkout-warm/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  )
}