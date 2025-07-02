'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface VCREffectsProps {
  children: React.ReactNode
  intensity?: 'light' | 'medium' | 'heavy'
  enableScanlines?: boolean
  enableGlitch?: boolean
  enableColorShift?: boolean
  className?: string
}

export default function VCREffects({
  children,
  intensity = 'medium',
  enableScanlines = true,
  enableGlitch = true,
  enableColorShift = true,
  className = ''
}: VCREffectsProps) {
  const intensityConfig = {
    light: {
      blur: '0.5px',
      contrast: '110%',
      brightness: '95%',
      hue: '2deg',
      scanlineOpacity: '0.03',
      glitchIntensity: 1
    },
    medium: {
      blur: '1px',
      contrast: '115%',
      brightness: '90%',
      hue: '5deg',
      scanlineOpacity: '0.05',
      glitchIntensity: 2
    },
    heavy: {
      blur: '1.5px',
      contrast: '125%',
      brightness: '85%',
      hue: '8deg',
      scanlineOpacity: '0.08',
      glitchIntensity: 3
    }
  }

  const config = intensityConfig[intensity]

  const glitchAnimation = {
    x: [0, -2, 2, -1, 1, 0],
    y: [0, 1, -1, 0],
    scale: [1, 1.001, 0.999, 1],
    transition: {
      duration: 0.1,
      repeat: Infinity,
      repeatDelay: Math.random() * 5 + 3,
      ease: "easeInOut"
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main Content with VCR Filter */}
      <motion.div
        className="relative z-10"
        style={{
          filter: `
            blur(${config.blur})
            contrast(${config.contrast})
            brightness(${config.brightness})
            hue-rotate(${config.hue})
            saturate(120%)
          `
        }}
        animate={enableGlitch ? glitchAnimation : {}}
      >
        {children}
      </motion.div>

      {/* Scanlines Overlay */}
      {enableScanlines && (
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 0, ${config.scanlineOpacity}) 2px,
                rgba(0, 255, 0, ${config.scanlineOpacity}) 4px
              )
            `,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Color Shift Effect */}
      {enableColorShift && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30 mix-blend-multiply"
          style={{
            background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.02))'
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Random Glitch Lines */}
      {enableGlitch && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-50"
          animate={{
            background: [
              'transparent',
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
              'transparent'
            ]
          }}
          transition={{
            duration: 0.05,
            repeat: Infinity,
            repeatDelay: Math.random() * 8 + 2
          }}
        />
      )}
    </div>
  )
}