import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface Slide {
  id: string
  type: string
  title?: string
  subtitle?: string
  content?: string
  videoUrl?: string
  bgImage?: string
  font?: string
}

// Essential BLKOUT slides with proper image paths
const slides: Slide[] = [
  {
    id: 'welcome',
    type: 'video',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    title: 'Welcome to BLKOUT',
    font: 'font-mono'
  },
  {
    id: 'value-proposition',
    type: 'prose',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK',
    content: 'We exist to create systemic change through digital tech, storytelling, and community ownership.',
    font: 'font-sans'
  },
  {
    id: 'well-defined',
    type: 'image-slide',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: 'WELLDEF_SQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'black',
    type: 'image-slide',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: 'BlackSQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'queer',
    type: 'image-slide', 
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    bgImage: 'queerSQUARED.PNG',
    font: 'font-sans'
  },
  {
    id: 'blkouthub-cta',
    type: 'connect',
    title: 'READY TO JOIN?',
    subtitle: 'YOUR LIBERATION JOURNEY STARTS HERE',
    content: 'Join the movement for real community support and collective liberation action.',
    bgImage: 'facecard SQUARED.png',
    font: 'font-sans'
  }
]

const FixedLayoutScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simple scroll detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideIndex = parseInt(entry.target.getAttribute('data-slide-index') || '0')
            setCurrentSlide(slideIndex)
          }
        })
      },
      { threshold: 0.6 }
    )

    const slideElements = document.querySelectorAll('.scroll-slide')
    slideElements.forEach(slide => observer.observe(slide))

    return () => observer.disconnect()
  }, [])

  const scrollToSlide = useCallback((slideIndex: number) => {
    const slideElement = document.querySelector(`[data-slide-index="${slideIndex}"]`)
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'video':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="w-80 h-80 mx-auto">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover rounded-lg"
                src={slide.videoUrl}
              />
            </div>
          </div>
        )

      case 'prose':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-4xl space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-gray-300">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-base text-gray-400">
                  {slide.content}
                </p>
              )}
            </div>
          </div>
        )

      case 'image-slide':
        return (
          <div className="flex items-end justify-center h-full p-8">
            <div className="text-center max-w-2xl mb-16">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg text-gray-200 bg-black/40 backdrop-blur-sm rounded-lg p-3">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        )

      case 'connect':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-2xl space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl text-gray-300">{slide.subtitle}</p>
              )}
              {slide.content && (
                <p className="text-lg text-gray-400 mb-8">{slide.content}</p>
              )}
              <a 
                href="https://blkouthub.com/invitation?code=BE862C" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Join BLKOUTHUB
              </a>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-white">{slide.title}</h1>
          </div>
        )
    }
  }

  return (
    <div className="w-full bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm py-3 z-50 border-b border-gray-700">
        <div className="flex justify-center">
          <div className="text-xl font-bold text-white">BLKOUT</div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="pt-16">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide-index={index}
            className="scroll-slide w-full relative"
            style={{ height: '100vh' }}
          >
            {/* Background Layer */}
            <div className="absolute inset-0">
              {slide.bgImage ? (
                <>
                  {/* Direct img tag for testing */}
                  <img 
                    src={`/images/squared/${slide.bgImage}`}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`Image loaded: ${slide.bgImage}`)}
                    onError={(e) => {
                      console.log(`Image failed: ${slide.bgImage}`)
                      console.log('Error:', e)
                    }}
                  />
                  
                  {/* Backup: CSS background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url('/images/squared/${slide.bgImage}')`,
                      opacity: 0.5
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900" />
              )}
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full">
              {renderSlideContent(slide)}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-gray-800 z-40">
        <div 
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 space-y-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => scrollToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all ${
              slideIndex === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Debug Info */}
      <div className="fixed bottom-4 left-4 z-40 text-white text-sm">
        <div>Slide {currentSlide + 1} of {slides.length}</div>
        <div>Current: {slides[currentSlide]?.id}</div>
        {slides[currentSlide]?.bgImage && (
          <div>Image: {slides[currentSlide].bgImage}</div>
        )}
      </div>
    </div>
  )
}

export default FixedLayoutScrollytelling