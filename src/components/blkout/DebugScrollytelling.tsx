import React from 'react'
import { motion } from 'framer-motion'

const DebugScrollytelling: React.FC = () => {
  const slides = [
    {
      id: 'welcome-video',
      type: 'video',
      videoSrc: '/images/welcomevidfinal.webm'
    },
    {
      id: 'who',
      type: 'image',
      imageSrc: '/images/WHO.png',
      title: 'WHO'
    },
    {
      id: 'well-defined',
      type: 'image',
      imageSrc: '/images/welldef2.png',
      title: 'WELL DEFINED'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* BLKOUT Pride 2025 Logo Header */}
      <header className="bg-black py-8 relative z-50">
        <div className="flex justify-center">
          <img 
            src="/images/BLKOUTpride2025.png" 
            alt="BLKOUT Pride 2025" 
            className="w-1/3 max-w-md h-auto"
          />
        </div>
      </header>

      {/* Debug: Simple visible slides first */}
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative min-h-screen w-full flex items-center justify-center bg-black border-2 border-red-500"
          >
            <div className="text-white text-4xl mb-4">SLIDE {index + 1}: {slide.id}</div>
            
            {slide.type === 'video' ? (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={slide.videoSrc} type="video/webm" />
                  <div className="text-white">Video: {slide.videoSrc}</div>
                </video>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                <img
                  src={slide.imageSrc}
                  alt={slide.title}
                  className="max-w-full max-h-full object-contain"
                  onError={() => console.log(`Failed to load: ${slide.imageSrc}`)}
                  onLoad={() => console.log(`Successfully loaded: ${slide.imageSrc}`)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DebugScrollytelling