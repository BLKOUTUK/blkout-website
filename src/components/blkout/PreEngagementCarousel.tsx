'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowDown, Play, Pause } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const carouselSlides = [
  {
    id: 'community',
    title: 'WE ARE POWER',
    subtitle: 'BLACK QUEER MEN BUILDING TOGETHER',
    description: 'Not customers. Not users. WE ARE THE COMMUNITY. Every voice commands respect. Every story shapes our revolution.',
    visual: '⚡',
    bgGradient: 'from-zones-community-bg via-zones-community-primary to-electric-magenta',
    callToAction: 'CLAIM YOUR POWER',
    stats: '1,200+ WARRIORS BUILDING',
    zone: 'community'
  },
  {
    id: 'cooperative',
    title: 'OWNERSHIP IS POWER',
    subtitle: 'WE OWN WHAT WE BUILD',
    description: 'No venture vultures. No distant masters. Just BLACK QUEER MEN building technology that serves OUR liberation.',
    visual: '🔥',
    bgGradient: 'from-zones-technology-bg via-zones-technology-primary to-electric-cyan',
    callToAction: 'SEIZE OWNERSHIP',
    stats: 'FULLY COMMUNITY-OWNED',
    zone: 'technology'
  },
  {
    id: 'liberation',
    title: 'TECH FOR FREEDOM',
    subtitle: 'LIBERATION THROUGH CODE',
    description: 'Every line of code serves BLACK QUEER liberation. Technology as warfare against oppression.',
    visual: '💥',
    bgGradient: 'from-zones-liberation-bg via-zones-liberation-primary to-electric-indigo',
    callToAction: 'JOIN THE FIGHT',
    stats: '15+ LIBERATION TOOLS DEPLOYED',
    zone: 'liberation'
  },
  {
    id: 'complexity',
    title: 'COMPLEX & POWERFUL',
    subtitle: 'YOUR WHOLE SELF IS STRENGTH',
    description: 'We embrace the full spectrum of BLACK QUEER experience. Messy, beautiful, complex, POWERFUL.',
    visual: '💎',
    bgGradient: 'from-zones-disruption-bg via-zones-disruption-primary to-electric-green',
    callToAction: 'UNLEASH COMPLEXITY',
    stats: 'INFINITE WAYS TO BE POWERFUL',
    zone: 'disruption'
  },
  {
    id: 'ready',
    title: 'READY FOR BATTLE?',
    subtitle: 'DIVE INTO THE REVOLUTION',
    description: 'Experience our values, principles, and vision. See how we build power differently.',
    visual: '🚀',
    bgGradient: 'from-electric-magenta via-electric-cyan to-electric-indigo',
    callToAction: 'BEGIN REVOLUTION',
    stats: 'FULL POWER AWAITS BELOW',
    zone: 'all'
  }
]

export default function PreEngagementCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Auto-advance slides (with scroll detection)
  useEffect(() => {
    if (!isAutoPlaying || hasUserInteracted) return

    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = () => {
      setIsAutoPlaying(false)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (!hasUserInteracted) {
          setIsAutoPlaying(true)
        }
      }, 3000)
    }

    window.addEventListener('scroll', handleScroll)

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 5000) // Slower auto-advance

    return () => {
      clearInterval(interval)
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isAutoPlaying, hasUserInteracted])

  // GSAP animations for slide transitions
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate in new slide content
      gsap.fromTo('.slide-content',
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [currentSlide])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setHasUserInteracted(true)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    setHasUserInteracted(true)
  }

  const scrollToContent = () => {
    const heroSection = document.getElementById('hero')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const slide = carouselSlides[currentSlide]

  return (
    <div 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Dynamic Background */}
      <motion.div
        key={`bg-${currentSlide}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}
      />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`float-${currentSlide}-${i}`}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [0, -30, 0],
              scale: [0.5, 1, 0.5],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute text-4xl"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
            }}
          >
            {slide.visual}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="slide-content text-center px-8 max-w-5xl">
          {/* Main Visual */}
          <motion.div
            key={`visual-${currentSlide}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="text-9xl md:text-[12rem] mb-8"
          >
            {slide.visual}
          </motion.div>

          {/* Title */}
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold text-white mb-6"
          >
            {slide.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-4xl text-white/90 mb-8 font-semibold"
          >
            {slide.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            {slide.description}
          </motion.p>

          {/* Stats */}
          <motion.div
            key={`stats-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="inline-block px-6 py-3 bg-white/10 rounded-full text-white font-semibold mb-8 backdrop-blur-sm"
          >
            {slide.stats}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            key={`cta-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg transition-all"
            >
              {slide.callToAction}
              <ArrowRight className="ml-2 inline w-5 h-5" />
            </motion.button>

            {currentSlide === carouselSlides.length - 1 && (
              <motion.button
                onClick={scrollToContent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg transition-all hover:bg-white hover:text-black"
              >
                Explore Full Experience
                <ArrowDown className="ml-2 inline w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-6">
          {/* Play/Pause */}
          <motion.button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/10 rounded-full text-white backdrop-blur-sm"
          >
            {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>

          {/* Slide Indicators */}
          <div className="flex space-x-3">
            {carouselSlides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/40'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/10 rounded-full text-white backdrop-blur-sm"
          >
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Scroll Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-20 right-8 text-white/60 text-sm"
      >
        <div className="flex flex-col items-center space-y-2">
          <span>Scroll for full experience</span>
          <ArrowDown size={20} />
        </div>
      </motion.div>

      {/* Skip to Content */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute top-8 right-8 px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-sm hover:bg-white/20 transition-all"
      >
        Skip to Experience →
      </motion.button>
    </div>
  )
}