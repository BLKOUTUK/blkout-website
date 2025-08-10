'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LandingPrimaryImageCtaSectionProps {
  titleComponent?: ReactNode
  description?: string
  imageSrc?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right' | 'center'
  imageShadow?: 'soft' | 'hard' | 'none'
  textPosition?: 'left' | 'center' | 'right'
  leadingComponent?: ReactNode
  effectComponent?: ReactNode
  children?: ReactNode
  className?: string
}

export const LandingPrimaryImageCtaSection: React.FC<LandingPrimaryImageCtaSectionProps> = ({
  titleComponent,
  description,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  imageShadow = 'soft',
  textPosition = 'left',
  leadingComponent,
  effectComponent,
  children,
  className = ''
}) => {
  const isImageLeft = imagePosition === 'left'
  const isImageCenter = imagePosition === 'center'
  
  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[textPosition]

  const shadowClass = {
    soft: 'shadow-2xl',
    hard: 'shadow-xl',
    none: ''
  }[imageShadow]

  return (
    <section className={`relative py-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden ${className}`}>
      {/* Background Effects */}
      {effectComponent && (
        <div className="absolute inset-0 pointer-events-none">
          {effectComponent}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${isImageCenter ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-12 items-center`}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'} ${textAlignClass} ${isImageCenter ? 'mx-auto max-w-4xl' : ''}`}
          >
            {leadingComponent && (
              <div className="mb-6">
                {leadingComponent}
              </div>
            )}
            
            <div className="mb-6">
              {titleComponent}
            </div>
            
            {description && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {children}
            </div>
          </motion.div>

          {/* Image Content */}
          {imageSrc && !isImageCenter && (
            <motion.div
              initial={{ opacity: 0, x: isImageLeft ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
            >
              <div className={`relative rounded-2xl overflow-hidden ${shadowClass}`}>
                <img
                  src={imageSrc}
                  alt={imageAlt || 'Hero image'}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          )}

          {/* Center Image Layout */}
          {imageSrc && isImageCenter && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <div className={`relative rounded-2xl overflow-hidden mx-auto max-w-4xl ${shadowClass}`}>
                <img
                  src={imageSrc}
                  alt={imageAlt || 'Hero image'}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </section>
  )
}