import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

const WelcomeVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Auto-play muted (browser policy compliance)
    video.muted = true
    video.play().catch(() => {
      // Fallback if autoplay fails
      setIsPlaying(false)
    })

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* 1970s British-Caribbean Front Room */}
      <div 
        className="relative p-8 rounded-lg min-h-[80vh] overflow-hidden"
        style={{
          background: `
            linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23654321' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
            radial-gradient(ellipse at center, rgba(139, 69, 19, 0.2) 0%, rgba(34, 139, 34, 0.1) 100%)
          `,
          backgroundSize: '60px 60px, cover'
        }}
      >
        
        {/* Wallpaper Pattern Overlay - Floral */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b6b' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")
            `
          }}
        />

        {/* 1970s Front Room Elements */}
        <div className="absolute top-4 left-6 right-6 flex justify-between items-start">
          {/* Framed Family Photos */}
          <div className="space-y-2">
            <div className="w-24 h-18 bg-gradient-to-br from-amber-900/60 to-amber-700/40 border-4 border-amber-800/80 rounded-sm transform -rotate-2 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-sepia-100/30 to-transparent rounded-sm" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-br from-amber-900/60 to-amber-700/40 border-4 border-amber-800/80 rounded-sm transform rotate-3 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-sepia-100/30 to-transparent rounded-sm" />
            </div>
          </div>
          
          {/* Religious/Cultural Objects */}
          <div className="flex flex-col items-center space-y-3">
            {/* Grenada Snow Globe - Colonial Legacy */}
            <div className="relative">
              <div className="w-14 h-18 bg-gradient-to-b from-blue-200/50 to-blue-400/70 rounded-full shadow-lg border-3 border-gray-300/40">
                <div className="absolute bottom-1 w-full h-5 bg-amber-600/70 rounded-b-full" />
                <div className="absolute bottom-4 left-3 w-7 h-4 bg-green-800/50 rounded-sm transform rotate-15" />
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-amber-200 font-serif font-bold">
                  GRENADA
                </div>
              </div>
            </div>
            
            {/* Small religious marker/cross */}
            <div className="w-6 h-8 bg-amber-700/60 rounded-sm shadow-md" />
          </div>
          
          {/* More family photos */}
          <div className="space-y-2">
            <div className="w-22 h-16 bg-gradient-to-br from-amber-900/60 to-amber-700/40 border-4 border-amber-800/80 rounded-sm transform rotate-1 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-sepia-100/30 to-transparent rounded-sm" />
            </div>
          </div>
        </div>
        
        {/* CRT Television on Doily */}
        <div className="relative mx-auto max-w-4xl mt-20">
          {/* Multi-colored Crochet Doily */}
          <div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-16 opacity-70"
            style={{
              background: `
                radial-gradient(
                  circle,
                  rgba(255, 255, 255, 0.2) 0%,
                  rgba(255, 192, 203, 0.1) 20%,
                  rgba(255, 255, 0, 0.05) 40%,
                  transparent 60%
                ),
                radial-gradient(
                  circle at 30% 30%,
                  rgba(255, 255, 255, 0.1) 0%,
                  transparent 50%
                ),
                radial-gradient(
                  circle at 70% 30%,
                  rgba(255, 255, 255, 0.1) 0%,
                  transparent 50%
                )
              `,
              borderRadius: '50%',
              boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
            }}
          />

          {/* Wood-Grain CRT TV - Simplified SVG-inspired Design */}
          <div className="relative z-10 mx-auto max-w-3xl">
            <div 
              className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 p-8 rounded-xl shadow-2xl"
              style={{
                background: `
                  linear-gradient(145deg, #8B4513, #A0522D, #654321),
                  repeating-linear-gradient(90deg, rgba(139,69,19,0.8) 0px, rgba(160,82,45,0.6) 4px, rgba(139,69,19,0.8) 8px)
                `,
                boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)'
              }}
            >
            
            {/* TV Brand Label */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <span className="text-xs text-white font-black tracking-wider bg-black/30 px-2 py-1 rounded" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                BLKOUT VISION
              </span>
            </div>

            {/* CRT Screen Bezel */}
            <div 
              className="relative bg-black p-4 rounded-lg"
              style={{
                background: `
                  radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%)
                `,
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.9),
                  inset 0 0 40px rgba(0,0,0,0.7)
                `
              }}
            >
              {/* Screen with CRT Curve Effect */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded"
                style={{
                  background: '#000',
                  borderRadius: '8px',
                  transform: 'perspective(800px) rotateX(2deg)'
                }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  style={{
                    filter: 'contrast(1.1) brightness(0.95) saturate(1.2)'
                  }}
                >
                  <source src="/Welcomevid.webm" type="video/webm" />
                  <source src="/FIST RETURNS.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* CRT Scan Lines */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent 0px,
                      transparent 2px,
                      rgba(255, 255, 255, 0.05) 2px,
                      rgba(255, 255, 255, 0.05) 4px
                    )`
                  }}
                />

                {/* CRT Screen Glare */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: `
                      radial-gradient(
                        ellipse 60% 40% at 30% 20%,
                        rgba(255, 255, 255, 0.15) 0%,
                        transparent 50%
                      )
                    `
                  }}
                />

                {/* Controls Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showControls ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div className="flex items-center space-x-4 bg-black/80 backdrop-blur-sm rounded-lg p-4">
                    <button
                      onClick={togglePlay}
                      className="p-3 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="p-3 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* TV Controls */}
            <div className="flex justify-between items-center mt-4 px-2">
              <div className="flex items-center space-x-3">
                {/* Power Button */}
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                {/* Volume Knob */}
                <div className="w-6 h-6 bg-amber-600 rounded-full border-2 border-amber-800 relative">
                  <div className="absolute top-0.5 left-1/2 w-0.5 h-2 bg-amber-900 transform -translate-x-1/2" />
                </div>
                {/* Channel Knob */}
                <div className="w-6 h-6 bg-amber-600 rounded-full border-2 border-amber-800 relative">
                  <div className="absolute top-0.5 left-1/2 w-0.5 h-2 bg-amber-900 transform -translate-x-1/2 rotate-45" />
                </div>
              </div>
              
              {/* TV Brand */}
              <span className="text-xs text-amber-200 font-serif opacity-60">
                Est. 1985
              </span>
            </div>
          </div>
        </div>
        </div>

        {/* Additional Room Details */}
        <div className="absolute bottom-8 left-12">
          {/* Side table with items */}
          <div className="w-16 h-8 bg-amber-700/40 rounded transform rotate-3 shadow-lg" />
          {/* Ornament on side table */}
          <div className="absolute -top-2 left-2 w-3 h-4 bg-yellow-600/50 rounded-full" />
        </div>
        
        <div className="absolute bottom-6 right-16">
          {/* Another decorative element */}
          <div className="w-10 h-12 bg-green-800/30 rounded-sm transform -rotate-12 opacity-50" />
        </div>
        
        {/* Carpet edge */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-orange-900/20 via-green-900/20 to-amber-900/20 rounded-full blur-sm" />
      </div>
    </div>
  )
}

export default WelcomeVideo