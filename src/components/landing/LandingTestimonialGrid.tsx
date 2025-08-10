'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Check } from 'lucide-react'

interface TestimonialItem {
  url?: string
  text: string
  imageSrc: string
  name: string
  handle?: string
  featured?: boolean
  verified?: boolean
}

interface LandingTestimonialGridProps {
  title?: string
  description?: string
  testimonialItems: TestimonialItem[]
  withBackground?: boolean
  withBackgroundGlow?: boolean
  className?: string
}

export const LandingTestimonialGrid: React.FC<LandingTestimonialGridProps> = ({
  title,
  description,
  testimonialItems,
  withBackground = false,
  withBackgroundGlow = false,
  className = ''
}) => {
  const backgroundClass = withBackground ? 'bg-gray-800/30' : ''
  const glowClass = withBackgroundGlow ? 'relative overflow-hidden' : ''

  return (
    <section className={`py-20 ${backgroundClass} ${glowClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
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

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonialItems.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`break-inside-avoid bg-gray-800/50 rounded-2xl p-6 border transition-all duration-300 hover:bg-gray-800/70 hover:shadow-xl hover:shadow-emerald-500/10 ${
                testimonial.featured 
                  ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-gray-800/50' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Quote Text */}
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.imageSrc}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  {testimonial.handle && (
                    <p className="text-sm text-gray-500">
                      {testimonial.handle}
                    </p>
                  )}
                </div>

                {/* Featured Badge */}
                {testimonial.featured && (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Glow Effects */}
      {withBackgroundGlow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      )}
    </section>
  )
}