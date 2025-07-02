'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VCREffects from './VCREffects'

gsap.registerPlugin(ScrollTrigger)

interface RetroVideoProps {
  webmSrc: string
  mp4Src: string
  posterImage?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  scrollTriggered?: boolean
  vcrIntensity?: 'light' | 'medium' | 'heavy'
  className?: string
  overlayContent?: React.ReactNode
}

export default function RetroVideo({
  webmSrc,
  mp4Src,
  posterImage,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  scrollTriggered = false,
  vcrIntensity = 'medium',
  className = '',
  overlayContent
}: RetroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current

    if (!video || !container) return

    // Handle video loading
    const handleLoadedData = () => setIsLoaded(true)
    video.addEventListener('loadeddata', handleLoadedData)

    // Scroll-triggered video control
    if (scrollTriggered && isLoaded) {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            video.play().catch(console.error)
          },
          onLeave: () => {
            video.pause()
          },
          onEnterBack: () => {
            video.play().catch(console.error)
          },
          onLeaveBack: () => {
            video.pause()
          }
        })
      })

      return () => {
        ctx.revert()
        video.removeEventListener('loadeddata', handleLoadedData)
      }
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [scrollTriggered, isLoaded])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <VCREffects 
        intensity={vcrIntensity}
        enableScanlines={true}
        enableGlitch={true}
        enableColorShift={true}
        className="w-full h-full"
      >
        <motion.video
          ref={videoRef}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          poster={posterImage}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.1
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
          <p className="text-white text-center p-4">
            Your browser doesn't support video playback. 
            <br />
            <a href={mp4Src} className="text-electric-cyan hover:underline">
              Download the video instead
            </a>
          </p>
        </motion.video>
      </VCREffects>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-mono">Loading retro experience...</p>
          </motion.div>
        </div>
      )}

      {/* Overlay Content */}
      {overlayContent && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center text-white p-6"
          >
            {overlayContent}
          </motion.div>
        </div>
      )}

      {/* Retro TV Border Effect */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute inset-2 border-2 border-white/10 rounded-lg" />
        <div className="absolute inset-4 border border-white/5 rounded" />
      </div>
    </div>
  )
}