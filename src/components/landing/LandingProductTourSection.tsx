'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'

interface ProductTourContextType {
  activeValue: string
  setActiveValue: (value: string) => void
}

const ProductTourContext = createContext<ProductTourContextType | null>(null)

interface LandingProductTourSectionProps {
  title?: string
  description?: string
  defaultValue?: string
  withBackground?: boolean
  withBackgroundGlow?: boolean
  variant?: 'primary' | 'secondary' | 'accent'
  backgroundGlowVariant?: 'primary' | 'secondary' | 'accent'
  children: ReactNode
  className?: string
}

export const LandingProductTourSection: React.FC<LandingProductTourSectionProps> = ({
  title,
  description,
  defaultValue = 'default',
  withBackground = false,
  withBackgroundGlow = false,
  variant = 'primary',
  backgroundGlowVariant = 'primary',
  children,
  className = ''
}) => {
  const [activeValue, setActiveValue] = useState(defaultValue)

  const backgroundClass = withBackground ? 'bg-gray-800/30' : ''
  const glowClass = withBackgroundGlow ? {
    primary: 'bg-gradient-to-br from-emerald-900/10 via-transparent to-emerald-900/10',
    secondary: 'bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/10',
    accent: 'bg-gradient-to-br from-blue-900/10 via-transparent to-blue-900/10'
  }[backgroundGlowVariant] : ''

  return (
    <ProductTourContext.Provider value={{ activeValue, setActiveValue }}>
      <section className={`relative py-20 ${backgroundClass} ${glowClass} ${className}`}>
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

          {/* Content */}
          <div className="space-y-12">
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
    </ProductTourContext.Provider>
  )
}

export const useProductTour = () => {
  const context = useContext(ProductTourContext)
  if (!context) {
    throw new Error('Product tour components must be used within LandingProductTourSection')
  }
  return context
}