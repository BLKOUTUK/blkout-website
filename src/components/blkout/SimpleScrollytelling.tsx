import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import WelcomeVideo from './WelcomeVideo'
import BLKOUTHUBAccessRequest from './BLKOUTHUBAccessRequest'
import IVORShowcase from './IVORShowcase'
import CommunityEmailCapture from './CommunityEmailCapture'

const slides = [
  {
    id: 'intro',
    title: 'BLKOUT',
    subtitle: 'Black Queer Liberation',
    content: 'Welcome to our community platform',
    bgImage: '/images/logo.png'
  },
  {
    id: 'video',
    title: 'Watch Our Story',
    subtitle: 'Understanding the Vision',
    content: 'video',
    bgImage: '/images/video-bg.png'
  },
  {
    id: 'well-defined',
    title: 'WELL DEFINED?',
    subtitle: 'Question Everything',
    content: 'What does it mean to be well defined in a world that refuses to see us clearly?',
    bgImage: '/images/question-bg.png'
  },
  {
    id: 'black',
    title: 'BLACK?',
    subtitle: 'Identity & Power',
    content: 'How do we hold our Blackness as power in spaces that diminish us?',
    bgImage: '/images/black-bg.png'
  },
  {
    id: 'queer',
    title: 'QUEER?',
    subtitle: 'Liberation & Love',
    content: 'What does queer liberation look like when we center Black joy?',
    bgImage: '/images/queer-bg.png'
  },
  {
    id: 'male',
    title: 'MALE?',
    subtitle: 'Redefining Masculinity',
    content: 'How do we reimagine masculinity through tenderness and truth?',
    bgImage: '/images/male-bg.png'
  },
  {
    id: 'ivor-intro',
    title: 'MEET IVOR',
    subtitle: 'Your Community Intelligence',
    content: 'ivor',
    bgImage: '/images/ivor-bg.png'
  },
  {
    id: 'connect',
    title: 'JOIN THE MOVEMENT',
    subtitle: 'Ready to Build Together?',
    content: 'connect',
    bgImage: '/images/connect-bg.png'
  }
]

const SimpleScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-primary to-blkout-accent">
      <div className="min-h-screen flex flex-col justify-center items-center relative px-6">
        
        {/* Logo */}
        {slide.id === 'intro' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">🏳️‍🌈</span>
            </div>
          </motion.div>
        )}

        {/* Video */}
        {slide.id === 'video' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <WelcomeVideo />
          </motion.div>
        )}

        {/* IVOR Showcase */}
        {slide.id === 'ivor-intro' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <IVORShowcase 
              userPathway="questioning"
              onSignupPrompt={() => setCurrentSlide(slides.length - 1)}
            />
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {slide.title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-blkout-secondary mb-8 uppercase tracking-wider font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {slide.subtitle}
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {slide.content}
          </motion.p>
        </motion.div>

        {/* Enhanced Connection Options on Last Slide */}
        {slide.id === 'connect' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 space-y-8"
          >
            {/* Primary CTA */}
            <BLKOUTHUBAccessRequest
              onSuccess={(data) => {
                console.log('BLKOUTHUB access request submitted:', data)
              }}
            />
            
            {/* Secondary Newsletter Signup */}
            <div className="max-w-xl mx-auto">
              <CommunityEmailCapture
                source="scrollytelling-connect"
                variant="compact"
                preselectedInterests={['newsletter', 'events', 'community']}
                onSuccess={(trackingId) => {
                  console.log('Email signup successful:', trackingId)
                }}
              />
            </div>

            {/* Quick Links to Other Parts of Ecosystem */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <motion.a 
                href="/events" 
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/20 rounded-lg text-center hover:bg-black/30 transition-all"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm text-white">Events</div>
              </motion.a>
              
              <motion.a 
                href="/newsroom" 
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/20 rounded-lg text-center hover:bg-black/30 transition-all"
              >
                <div className="text-2xl mb-2">📰</div>
                <div className="text-sm text-white">Newsroom</div>
              </motion.a>
              
              <motion.a 
                href="/ivor" 
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/20 rounded-lg text-center hover:bg-black/30 transition-all"
              >
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-sm text-white">IVOR AI</div>
              </motion.a>
              
              <motion.a 
                href="/governance" 
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/20 rounded-lg text-center hover:bg-black/30 transition-all"
              >
                <div className="text-2xl mb-2">⚖️</div>
                <div className="text-sm text-white">Governance</div>
              </motion.a>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        {currentSlide < slides.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            onClick={nextSlide}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            aria-label="Go to next slide"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {/* Slide Indicator */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 space-y-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SimpleScrollytelling