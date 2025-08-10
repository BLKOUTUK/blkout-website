'use client'

import React, { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductTour } from './LandingProductTourSection'

interface LandingProductTourContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const LandingProductTourContent: React.FC<LandingProductTourContentProps> = ({
  value,
  children,
  className = ''
}) => {
  const { activeValue } = useProductTour()
  const isActive = activeValue === value

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`w-full ${className}`}
        >
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}