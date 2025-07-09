import React from 'react'
import { motion } from 'framer-motion'

const SimpleScrollytelling: React.FC = () => {
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
    },
    {
      id: 'black',
      type: 'image',
      imageSrc: '/images/black2.png',
      title: 'BLACK?'
    },
    {
      id: 'queer',
      type: 'image',
      imageSrc: '/images/queer2.png',
      title: 'QUEER'
    },
    {
      id: 'male',
      type: 'image',
      imageSrc: '/images/men2.png',
      title: 'MALE*'
    },
    {
      id: 'out',
      type: 'image',
      imageSrc: '/images/out2.png',
      title: 'OUT'
    },
    {
      id: 'work',
      type: 'image',
      imageSrc: '/images/the work.png',
      title: 'THE WORK'
    },
    {
      id: 'liberation',
      type: 'image',
      imageSrc: '/images/liberation.png',
      title: 'LIBERATION'
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
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-40%", amount: 0.5 }}
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
                
                {/* Rising text animations during welcome video */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.img 
                    src="/images/USALL.png"
                    initial={{ y: "100vh", opacity: 0 }}
                    animate={{ y: "50vh", opacity: 1 }}
                    transition={{ delay: 2, duration: 3, ease: "easeOut" }}
                    className="absolute left-1/4 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: "50%", left: "25%" }}
                  />
                  <motion.img 
                    src="/images/ALLOFUS.png" 
                    initial={{ y: "100vh", opacity: 0 }}
                    animate={{ y: "50vh", opacity: 1 }}
                    transition={{ delay: 4, duration: 3, ease: "easeOut" }}
                    className="absolute right-1/4 transform translate-x-1/2 -translate-y-1/2"
                    style={{ top: "50%", right: "25%" }}
                  />
                </div>
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