/**
 * IvorAvatar - Animated avatar component for IVOR
 * 
 * @purpose Visual representation of IVOR with state-based animations
 * @values Community-focused design with BLKOUT branding
 */

import { motion } from 'framer-motion'
import { Bot, Circle } from 'lucide-react'

interface IvorAvatarProps {
  state?: 'idle' | 'thinking' | 'speaking' | 'error'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function IvorAvatar({ 
  state = 'idle', 
  size = 'medium', 
  className = '' 
}: IvorAvatarProps) {
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }
  
  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32
  }
  
  const getStateColors = () => {
    switch (state) {
      case 'thinking':
        return 'bg-gradient-to-br from-blkout-secondary to-blkout-primary'
      case 'speaking':
        return 'bg-gradient-to-br from-blkout-primary to-blkout-warm'
      case 'error':
        return 'bg-gradient-to-br from-red-500 to-red-600'
      default:
        return 'bg-gradient-to-br from-blkout-primary to-blkout-secondary'
    }
  }
  
  const getAnimationVariants = () => {
    switch (state) {
      case 'thinking':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      case 'speaking':
        return {
          scale: [1, 1.05, 1],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      case 'error':
        return {
          x: [-2, 2, -2, 2, 0],
          transition: {
            duration: 0.5,
            repeat: 2
          }
        }
      default:
        return {
          scale: [1, 1.02, 1],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
    }
  }
  
  return (
    <div className={`relative ${className}`}>
      {/* Main avatar container */}
      <motion.div
        className={`${sizeClasses[size]} ${getStateColors()} rounded-full 
          flex items-center justify-center shadow-lg relative overflow-hidden`}
        animate={getAnimationVariants()}
      >
        {/* Bot icon */}
        <Bot 
          size={iconSizes[size]} 
          className="text-white relative z-10" 
        />
        
        {/* Thinking animation overlay */}
        {state === 'thinking' && (
          <motion.div
            className="absolute inset-0 bg-white opacity-20 rounded-full"
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
        
        {/* Speaking animation overlay */}
        {state === 'speaking' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-white rounded-full"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.6, 0.3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
      
      {/* Status indicator */}
      <motion.div
        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          state === 'error' ? 'bg-red-400' : 'bg-green-400'
        }`}
        animate={{
          scale: state === 'speaking' ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 0.5,
          repeat: state === 'speaking' ? Infinity : 0
        }}
      />
      
      {/* Floating particles for idle state */}
      {state === 'idle' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blkout-neon rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}