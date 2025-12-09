import React, { useState, useEffect } from 'react'

interface Slide {
  id: string
  title: string
  subtitle?: string
  content?: string
  type: 'video' | 'text' | 'image'
  videoUrl?: string
  bgImage?: string
}

const slides: Slide[] = [
  {
    id: 'welcome',
    type: 'video',
    title: 'Welcome to BLKOUT',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4'
  },
  {
    id: 'mission',
    type: 'text',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK',
    content: 'We exist to create systemic change through digital tech, storytelling, and community ownership.'
  },
  {
    id: 'community',
    type: 'text',
    title: 'UNITY NOT UNIFORMITY',
    subtitle: 'Our identities are complex and contested',
    content: '@BLKOUT this realness is a resource for building our community'
  }
]

const SimplifiedScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

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
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    const slideElements = document.querySelectorAll('.scroll-slide')
    slideElements.forEach(slide => observer.observe(slide))

    return () => observer.disconnect()
  }, [])

  const scrollToSlide = (index: number) => {
    const slideElement = document.querySelector(`[data-slide-index="${index}"]`)
    if (slideElement) {
      slideElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'video':
        return (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover max-w-lg max-h-lg"
              src={slide.videoUrl}
            >
              <source src={slide.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      
      case 'text':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-6 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-gray-300">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-lg text-gray-400">
                  {slide.content}
                </p>
              )}
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
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-black py-4 z-50 border-b border-gray-800">
        <div className="flex justify-center px-4">
          <div className="text-2xl font-bold text-white">BLKOUT</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide-index={index}
            className="scroll-slide w-full bg-black relative"
            style={{ height: '100vh', minHeight: '600px' }}
          >
            <div className="w-full h-full">
              {renderSlideContent(slide)}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`w-3 h-3 rounded-full border-2 transition-all hover:scale-125 ${
              index === currentSlide
                ? 'bg-white border-white'
                : 'bg-transparent border-white/40 hover:border-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Debug Info */}
      <div className="fixed bottom-4 left-4 z-40 text-white/60 text-xs">
        <div>Slide {currentSlide + 1} of {slides.length}</div>
        <div>Scroll to navigate</div>
      </div>
    </div>
  )
}

export default SimplifiedScrollytelling