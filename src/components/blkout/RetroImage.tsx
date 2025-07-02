'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VCREffects from './VCREffects'

gsap.registerPlugin(ScrollTrigger)

interface RetroImageProps {
  src: string
  alt: string
  vcrIntensity?: 'light' | 'medium' | 'heavy'
  parallaxStrength?: number
  className?: string
  overlayContent?: React.ReactNode
  scrollReveal?: boolean
}

export default function RetroImage({
  src,
  alt,
  vcrIntensity = 'medium',
  parallaxStrength = 0.5,
  className = '',
  overlayContent,
  scrollReveal = true
}: RetroImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current

    if (!container || !image || !isLoaded) return

    // Parallax effect
    const ctx = gsap.context(() => {
      gsap.to(image, {
        yPercent: -100 * parallaxStrength,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })

      // Scroll reveal animation
      if (scrollReveal) {
        gsap.fromTo(container, 
          {
            opacity: 0,
            scale: 0.8,
            y: 50
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }
    })

    return () => ctx.revert()
  }, [isLoaded, parallaxStrength, scrollReveal])

  if (hasError) {
    return (
      <div className={`relative bg-black/50 flex items-center justify-center ${className}`}>
        <div className="text-white text-center p-8">
          <div className="w-16 h-16 border-2 border-electric-cyan rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">📷</span>
          </div>
          <p className="text-sm font-mono">Image could not be loaded</p>
          <p className="text-xs text-gray-400 mt-2">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <VCREffects 
        intensity={vcrIntensity}
        enableScanlines={true}
        enableGlitch={true}
        enableColorShift={true}
        className="w-full h-full"
      >
        <motion.img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.1
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </VCREffects>

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-6 h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono">Loading...</p>
          </motion.div>
        </div>
      )}

      {/* Overlay Content */}
      {overlayContent && isLoaded && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-white p-6"
          >
            {overlayContent}
          </motion.div>
        </div>
      )}

      {/* Retro Photo Frame Effect */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute inset-1 border border-white/20 rounded-sm" />
        <div className="absolute inset-3 border border-white/10 rounded-sm" />
        
        {/* Photo corner highlights */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/30" />
      </div>
    </div>
  )
}