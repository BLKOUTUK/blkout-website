'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LandingSaleCtaSectionProps {
  title?: string
  description?: string
  withBackground?: boolean
  variant?: 'primary' | 'secondary' | 'accent'
  children?: ReactNode
  className?: string
}

export const LandingSaleCtaSection: React.FC<LandingSaleCtaSectionProps> = ({
  title,
  description,
  withBackground = false,
  variant = 'primary',
  children,
  className = ''
}) => {
  const backgroundClass = withBackground ? 'bg-gray-800/30' : ''
  const gradientClass = {
    primary: 'from-emerald-900/20 via-gray-900 to-emerald-900/20',
    secondary: 'from-purple-900/20 via-gray-900 to-purple-900/20',
    accent: 'from-blue-900/20 via-gray-900 to-blue-900/20'
  }[variant]

  return (
    <section className={`relative py-20 bg-gradient-to-r ${gradientClass} ${backgroundClass} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          {children && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {children}
            </div>
          )}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
          variant === 'primary' ? 'bg-emerald-500' :
          variant === 'secondary' ? 'bg-purple-500' : 'bg-blue-500'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
          variant === 'primary' ? 'bg-emerald-600' :
          variant === 'secondary' ? 'bg-purple-600' : 'bg-blue-600'
        }`}></div>
      </div>
    </section>
  )
}