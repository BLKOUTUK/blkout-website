'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LandingProductCardProps {
  title: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  topComponent?: ReactNode
  actionComponent?: ReactNode
  featured?: boolean
  className?: string
}

export const LandingProductCard: React.FC<LandingProductCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  topComponent,
  actionComponent,
  featured = false,
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`group bg-gray-800/50 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl ${
        featured 
          ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-gray-800/50 hover:shadow-emerald-500/20' 
          : 'border-gray-700 hover:border-gray-600 hover:shadow-gray-500/20'
      } ${className}`}
    >
      {/* Image */}
      {imageSrc && (
        <div className="aspect-video overflow-hidden relative">
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {topComponent && (
            <div className="absolute top-4 right-4">
              {topComponent}
            </div>
          )}
          {featured && (
            <div className="absolute top-4 left-4">
              <div className="px-2 py-1 bg-emerald-600 text-white text-xs font-bold rounded">
                Featured
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Top Component (if no image) */}
        {!imageSrc && topComponent && (
          <div className="mb-4 flex justify-end">
            {topComponent}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-3">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-400 mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Component */}
        {actionComponent && (
          <div className="mt-auto">
            {actionComponent}
          </div>
        )}
      </div>
    </motion.div>
  )
}