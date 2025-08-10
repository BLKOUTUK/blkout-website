'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useProductTour } from './LandingProductTourSection'

interface LandingProductTourTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const LandingProductTourTrigger: React.FC<LandingProductTourTriggerProps> = ({
  value,
  children,
  className = ''
}) => {
  const { activeValue, setActiveValue } = useProductTour()
  const isActive = activeValue === value

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveValue(value)}
      className={`relative px-6 py-4 rounded-xl border transition-all duration-300 text-left ${
        isActive 
          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/70'
      } ${className}`}
    >
      {children}
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )
}