// Loading Spinner Component with BLKOUTNXT Design System
// Provides consistent loading states across the platform

import React from 'react'
import { motion } from 'framer-motion'
import { Loader, Zap } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'pulse' | 'dots' | 'spinner'
  color?: 'indigo' | 'emerald' | 'yellow' | 'violet' | 'amber'
  text?: string
  fullScreen?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  indigo: 'text-indigo-400 border-indigo-400',
  emerald: 'text-emerald-400 border-emerald-400',
  yellow: 'text-yellow-400 border-yellow-400',
  violet: 'text-violet-400 border-violet-400',
  amber: 'text-amber-400 border-amber-400'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'indigo',
  text,
  fullScreen = false,
  className = ''
}) => {
  const renderSpinner = () => {
    const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`

    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            className={`${baseClasses} rounded-full bg-current`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 ${colorClasses[color].split(' ')[0]} rounded-full bg-current`}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case 'spinner':
        return (
          <motion.div
            className={`${baseClasses} border-2 border-current border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Loader className={baseClasses} />
          </motion.div>
        )
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {text && (
        <motion.p
          className={`text-sm font-medium ${colorClasses[color].split(' ')[0]} uppercase tracking-wider`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8">
          {content}
        </div>
      </motion.div>
    )
  }

  return content
}

export default LoadingSpinner