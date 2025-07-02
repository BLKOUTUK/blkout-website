'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import RetroVideo from './RetroVideo'
import { getAssetsBySection } from '../../lib/mediaAssets'

interface CarouselSlide {
  id: string
  video: {
    webmSrc?: string
    mp4Src: string
    vcrIntensity: 'light' | 'medium' | 'heavy'
  }
  overlay: {
    title: string
    subtitle: string
    description: string
    cta?: string
  }
}

const heroSlides: CarouselSlide[] = [
  {
    id: 'transformation',
    video: {
      mp4Src: '/src/assets/videos/cube intro.mp4',
      vcrIntensity: 'light'
    },
    overlay: {
      title: 'Building Cooperative Power',
      subtitle: 'Through Technology & Community',
      description: 'Where Black QTIPOC+ voices shape the digital future we all deserve to live in.',
      cta: 'Join Our Movement'
    }
  },
  {
    id: 'joy',
    video: {
      mp4Src: '/src/assets/videos/goldsmile  intro.mp4',
      vcrIntensity: 'medium'
    },
    overlay: {
      title: 'Joy Through Complexity',
      subtitle: 'Celebrating Our Resilience',
      description: 'Every challenge becomes a doorway when we face it together with love and determination.',
      cta: 'Discover Community'
    }
  },
  {
    id: 'journey',
    video: {
      mp4Src: '/src/assets/videos/travel intro.mp4',
      vcrIntensity: 'heavy'
    },
    overlay: {
      title: 'Collective Liberation',
      subtitle: 'Moving Forward Together',
      description: 'Our individual journeys become collective power when we travel the path of justice together.',
      cta: 'Start Your Journey'
    }
  },
  {
    id: 'momentum',
    video: {
      mp4Src: '/src/assets/videos/roller intro.mp4',
      vcrIntensity: 'medium'
    },
    overlay: {
      title: 'Unstoppable Momentum',
      subtitle: 'Building Generational Change',
      description: 'Each action ripples forward, creating the cooperative economy our ancestors dreamed of.',
      cta: 'Take Action'
    }
  },
  {
    id: 'perspectives',
    video: {
      mp4Src: '/src/assets/videos/cube2 intro.mp4',
      vcrIntensity: 'light'
    },
    overlay: {
      title: 'Multiple Perspectives',
      subtitle: 'Infinite Possibilities',
      description: 'Every angle reveals new ways to build power, create change, and love fiercely.',
      cta: 'Explore More'
    }
  }
]

export default function HeroVideoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 8000) // 8 seconds per slide

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <RetroVideo
              webmSrc={currentSlideData.video.webmSrc || ''}
              mp4Src={currentSlideData.video.mp4Src}
              autoplay={isPlaying}
              loop={true}
              muted={true}
              vcrIntensity={currentSlideData.video.vcrIntensity}
              className="w-full h-full object-cover"
              scrollTriggered={false}
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Title */}
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
                style={{
                  textShadow: '0 0 30px rgba(0, 0, 0, 0.8), 0 0 60px rgba(255, 0, 64, 0.3)'
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {currentSlideData.overlay.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-electric-cyan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  textShadow: '0 0 20px rgba(0, 230, 255, 0.5)'
                }}
              >
                {currentSlideData.overlay.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  textShadow: '0 0 15px rgba(0, 0, 0, 0.8)'
                }}
              >
                {currentSlideData.overlay.description}
              </motion.p>

              {/* CTA Button */}
              {currentSlideData.overlay.cta && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="pt-6"
                >
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-electric-magenta to-electric-cyan text-white text-lg font-bold rounded-lg border-2 border-white/20 backdrop-blur-sm"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(255, 0, 64, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      textShadow: '0 0 10px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {currentSlideData.overlay.cta}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
          {/* Previous Button */}
          <motion.button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-electric-cyan scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>

          {/* Play/Pause Toggle */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-1" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Auto-play Indicator */}
      {isAutoPlaying && (
        <div className="absolute top-8 right-8 z-30">
          <motion.div
            className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
            <span className="text-white text-sm">Auto-playing</span>
          </motion.div>
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-8 left-8 z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <span className="text-white text-sm font-mono">
            {currentSlide + 1} / {heroSlides.length}
          </span>
        </div>
      </div>
    </div>
  )
}