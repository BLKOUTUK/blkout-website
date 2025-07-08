import React from 'react'
import { motion } from 'framer-motion'

const SimpleScrollytelling: React.FC = () => {
  const slides = [
    {
      id: 'welcome-video',
      type: 'video',
      videoSrc: '/images/Welcome Vid Final.webm'
    },
    {
      id: 'well-defined',
      type: 'image',
      imageSrc: '/images/WELLDEF2 (Youtube Banner).png',
      title: 'WELL DEFINED'
    },
    {
      id: 'black',
      type: 'image',
      imageSrc: '/images/BLACK.png',
      title: 'BLACK?'
    },
    {
      id: 'queer',
      type: 'image',
      imageSrc: '/images/queer -.png',
      title: 'QUEER'
    },
    {
      id: 'male',
      type: 'image',
      imageSrc: '/images/men-.png',
      title: 'MALE*'
    },
    {
      id: 'out',
      type: 'image',
      imageSrc: '/images/out -.png',
      title: 'OUT'
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

      {/* Slides Container */}
      <div className="relative">
        {slides.map((slide, index) => (
          <motion.section
            key={slide.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, margin: "-20%" }}
            className="relative min-h-screen w-full flex items-center justify-center bg-black"
          >
            {slide.type === 'video' ? (
              <div className="w-full h-screen relative">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={slide.videoSrc} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="w-full h-screen relative flex items-center justify-center">
                <img
                  src={slide.imageSrc}
                  alt={slide.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            
            {/* Screen reader accessibility */}
            <div className="sr-only">
              <h2>{slide.title || 'Welcome Video'}</h2>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}

export default SimpleScrollytelling