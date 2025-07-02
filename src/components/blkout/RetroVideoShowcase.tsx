'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import RetroVideo from './RetroVideo'
import { getAssetsBySection } from '../../lib/mediaAssets'

interface RetroVideoShowcaseProps {
  section?: 'hero' | 'values' | 'principles' | 'community'
  autoRotate?: boolean
  className?: string
}

export default function RetroVideoShowcase({ 
  section = 'community',
  autoRotate = true,
  className = ''
}: RetroVideoShowcaseProps) {
  const videoAssets = getAssetsBySection(section).filter(asset => asset.type === 'video')
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videoAssets.length)
  }

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videoAssets.length) % videoAssets.length)
  }

  if (videoAssets.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 bg-black/20 rounded-xl ${className}`}>
        <p className="text-white/60">No videos available for this section</p>
      </div>
    )
  }

  const currentAsset = videoAssets[currentVideo]

  return (
    <div className={`relative ${className}`}>
      {/* Main Video Display */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <RetroVideo
              webmSrc={currentAsset.webmSrc || ''}
              mp4Src={currentAsset.mp4Src || currentAsset.src}
              autoplay={isPlaying}
              loop={true}
              muted={true}
              vcrIntensity={currentAsset.vcrIntensity}
              className="w-full h-full"
              overlayContent={
                <motion.div
                  className="text-center p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {currentAsset.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {currentAsset.description}
                  </p>
                  <div className="mt-3 px-3 py-1 bg-gradient-to-r from-electric-magenta/20 to-electric-cyan/20 rounded-full border border-white/20">
                    <span className="text-xs text-electric-cyan font-semibold uppercase tracking-wide">
                      {currentAsset.theme}
                    </span>
                  </div>
                </motion.div>
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-3 z-50">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/80 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
          </motion.button>

          <motion.button
            onClick={nextVideo}
            className="flex items-center justify-center w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/80 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-white text-xs font-mono">
              {currentVideo + 1} / {videoAssets.length}
            </span>
          </div>
        </div>

        {/* Theme Badge */}
        <div className="absolute top-4 right-4 z-50">
          <motion.div
            className="px-3 py-1 bg-gradient-to-r from-electric-magenta/80 to-electric-cyan/80 backdrop-blur-sm rounded-full border border-white/30"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white text-xs font-bold uppercase tracking-wide">
              {currentAsset.theme}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Video Navigation Thumbnails */}
      <div className="mt-6 flex space-x-4 overflow-x-auto pb-2">
        {videoAssets.map((asset, index) => (
          <motion.button
            key={asset.id}
            onClick={() => setCurrentVideo(index)}
            className={`flex-shrink-0 relative aspect-video w-24 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentVideo 
                ? 'border-electric-cyan shadow-lg shadow-electric-cyan/20' 
                : 'border-white/20 hover:border-white/40'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            
            {/* Thumbnail info */}
            <div className="absolute bottom-1 left-1 right-1">
              <div className="text-xs text-white font-semibold truncate">
                {asset.title}
              </div>
            </div>

            {/* Active indicator */}
            {index === currentVideo && (
              <motion.div
                className="absolute -bottom-1 left-1/2 w-2 h-2 bg-electric-cyan rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ transform: 'translateX(-50%)' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Auto-rotate indicator */}
      {autoRotate && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-white/60 text-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.div>
          <span>Auto-cycling through {currentAsset.theme} themes</span>
        </div>
      )}
    </div>
  )
}