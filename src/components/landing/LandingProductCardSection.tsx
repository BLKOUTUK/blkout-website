'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LandingProductCardSectionProps {
  title?: string
  description?: string
  withBackground?: boolean
  withBackgroundGlow?: boolean
  variant?: 'primary' | 'secondary' | 'accent'
  backgroundGlowVariant?: 'primary' | 'secondary' | 'accent'
  textPosition?: 'left' | 'center' | 'right'
  children: ReactNode
  className?: string
}

export const LandingProductCardSection: React.FC<LandingProductCardSectionProps> = ({
  title,
  description,
  withBackground = false,
  withBackgroundGlow = false,
  variant = 'primary',
  backgroundGlowVariant = 'primary',
  textPosition = 'center',
  children,
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

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children}
        </div>
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