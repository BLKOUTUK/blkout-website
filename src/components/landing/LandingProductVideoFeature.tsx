'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface LandingProductVideoFeatureProps {
  title?: string
  description?: string
  videoSrc: string
  videoPoster?: string
  videoPosition?: 'left' | 'center' | 'right'
  autoPlay?: boolean
  controls?: boolean
  withBackground?: boolean
  withBackgroundGlow?: boolean
  variant?: 'primary' | 'secondary' | 'accent'
  backgroundGlowVariant?: 'primary' | 'secondary' | 'accent'
  textPosition?: 'left' | 'center' | 'right'
  className?: string
}

export const LandingProductVideoFeature: React.FC<LandingProductVideoFeatureProps> = ({
  title,
  description,
  videoSrc,
  videoPoster,
  videoPosition = 'center',
  autoPlay = false,
  controls = true,
  withBackground = false,
  withBackgroundGlow = false,
  variant = 'primary',
  backgroundGlowVariant = 'primary',
  textPosition = 'center',
  className = ''
}) => {
  const backgroundClass = withBackground ? 'bg-gray-800/30' : ''
  const glowClass = withBackgroundGlow ? {
    primary: 'bg-gradient-to-br from-emerald-900/10 via-transparent to-emerald-900/10',
    secondary: 'bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/10',
    accent: 'bg-gradient-to-br from-blue-900/10 via-transparent to-blue-900/10'
  }[backgroundGlowVariant] : ''

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[textPosition]

  return (
    <section className={`relative py-20 ${backgroundClass} ${glowClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`mb-16 ${textAlignClass}`}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        )}

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <video
              src={videoSrc}
              poster={videoPoster}
              autoPlay={autoPlay}
              controls={controls}
              muted={autoPlay}
              loop
              className="w-full h-full object-cover"
            />
            
            {/* Play Button Overlay (if not autoplay) */}
            {!autoPlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-colors cursor-pointer">
                  <Play className="w-8 h-8 text-gray-800 ml-1" />
                </div>
              </div>
            )}

            {/* Video Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none"></div>
          </div>

          {/* Video Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-2xl blur-sm -z-10"></div>
        </motion.div>
      </div>

      {/* Background Glow Effects */}
      {withBackgroundGlow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            backgroundGlowVariant === 'primary' ? 'bg-emerald-500' :
            backgroundGlowVariant === 'secondary' ? 'bg-purple-500' : 'bg-blue-500'
          }`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            backgroundGlowVariant === 'primary' ? 'bg-emerald-600' :
            backgroundGlowVariant === 'secondary' ? 'bg-purple-600' : 'bg-blue-600'
          }`}></div>
        </div>
      )}
    </section>
  )
}