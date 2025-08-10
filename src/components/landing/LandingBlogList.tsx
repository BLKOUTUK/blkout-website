'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LandingBlogListProps {
  title?: string
  description?: string
  display?: 'grid' | 'list'
  withBackground?: boolean
  children: ReactNode
  className?: string
}

export const LandingBlogList: React.FC<LandingBlogListProps> = ({
  title,
  description,
  display = 'grid',
  withBackground = false,
  children,
  className = ''
}) => {
  const backgroundClass = withBackground ? 'bg-gray-800/30' : ''
  const gridClass = display === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'

  return (
    <section className={`py-20 ${backgroundClass} ${className}`}>
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

        {/* Blog Posts Grid */}
        <div className={gridClass}>
          {children}
        </div>
      </div>
    </section>
  )
}