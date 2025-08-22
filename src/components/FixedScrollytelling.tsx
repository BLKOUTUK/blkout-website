import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import EnhancedQuiz from './EnhancedQuiz'

// Load GSAP only when needed
let gsap: any = null
let ScrollTrigger: any = null

const loadGSAP = async () => {
  if (!gsap) {
    const [gsapModule, scrollTriggerModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ])
    gsap = gsapModule.gsap
    ScrollTrigger = scrollTriggerModule.ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)
  }
  return { gsap, ScrollTrigger }
}

interface Slide {
  id: string
  type: string
  title?: string
  subtitle?: string
  content?: string | any
  videoUrl?: string
  bgImage?: string
  font?: string
  sections?: any[]
  pathwayResponses?: any
}

// Full BLKOUT slides data
const slides: Slide[] = [
  {
    id: 'welcome',
    type: 'video',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    title: '',
    subtitle: '',
    content: '',
    font: 'font-mono'
  },
  {
    id: 'value-proposition',
    type: 'prose',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK, shaping a future where our stories, culture, and leadership are central.',
    content: 'We exist to create systemic change. We connect, empower, and transform Black Queer men\'s lives through digital tech, storytelling, and community ownership.',
    font: 'font-sans'
  },
  {
    id: 'well-defined',
    type: 'image-only',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: 'WELLDEF_SQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'unity-not-uniformity',
    type: 'chapter',
    title: 'UNITY NOT UNIFORMITY',
    subtitle: 'Our identities are complex and contested',
    content: '@BLKOUT this realness is a resource for building our community',
    font: 'font-sans'
  },
  {
    id: 'black',
    type: 'definition',
    title: 'BLACK',
    bgImage: 'black_SQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'queer',
    type: 'definition',
    title: 'QUEER',
    bgImage: 'queer SQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'men',
    type: 'definition',
    title: 'MEN',
    bgImage: 'men SQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'blkouthub-cta',
    type: 'connect',
    title: 'READY TO JOIN?',
    subtitle: 'YOUR LIBERATION JOURNEY STARTS HERE',
    content: 'You\'ve experienced our vision. Now join the movement for real community support, personalized AI assistance, and collective liberation action.',
    sections: [
      {
        title: 'BLKOUTHUB',
        subtitle: 'For Black Queer Men',
        description: 'Join our exclusive community with AI support, peer networks, and direct action opportunities. Limited to Black queer men only.',
        action: 'Join BLKOUTHUB',
        highlight: true,
        link: 'https://blkouthub.com/invitation?code=BE862C'
      }
    ],
    bgImage: 'facecard SQUARED.png',
    font: 'font-sans'
  },
  {
    id: 'newsletter-cta',
    type: 'connect',
    title: 'STAY CONNECTED',
    subtitle: 'JOIN OUR NEWSLETTER',
    content: 'Stay connected with our latest projects, events, and community stories.',
    sections: [
      {
        title: 'NEWSLETTER',
        subtitle: 'For Everyone',
        description: 'Stay informed with weekly liberation content, community events, and early access to new platform features.',
        action: 'Subscribe',
        highlight: true
      }
    ],
    font: 'font-sans'
  }
]

const FixedScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [gsapLoaded, setGsapLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load GSAP
  useEffect(() => {
    loadGSAP().then(() => {
      setGsapLoaded(true)
    })
  }, [])

  // Simplified scroll detection
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

  const scrollToSlide = useCallback((slideIndex: number) => {
    const slideElement = document.querySelector(`[data-slide-index="${slideIndex}"]`)
    if (slideElement) {
      slideElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      scrollToSlide(currentSlide + 1)
    }
  }, [currentSlide, scrollToSlide])

  const getSlideTheme = useCallback((slide: Slide): string => {
    if (slide.type === 'video' || slide.id?.includes('welcome')) {
      return 'bg-black'
    }
    if (slide.title?.includes('POWER') || slide.title?.includes('COLLECTIVE')) {
      return 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-900'
    }
    if (slide.type === 'connect' || slide.title?.includes('JOIN')) {
      return 'bg-gradient-to-br from-red-900 via-red-800 to-orange-900'
    }
    return 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900'
  }, [])

  const renderSlideContent = useCallback((slide: Slide) => {
    switch (slide.type) {
      case 'video':
        return (
          <div className="flex items-center justify-center h-full">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="auto"
              className="w-full h-full object-cover max-w-lg max-h-lg rounded-lg"
              src={slide.videoUrl}
            >
              <source src={slide.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )

      case 'prose':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-6 max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                  {slide.content}
                </p>
              )}
            </div>
          </div>
        )

      case 'image-only':
        return (
          <div className="flex items-center justify-center h-full">
            {slide.bgImage ? (
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-xl md:text-2xl text-gray-300">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
                {slide.title}
              </h1>
            )}
          </div>
        )

      case 'chapter':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-6 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-gray-300">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-lg md:text-xl text-gray-400">
                  {slide.content}
                </p>
              )}
            </div>
          </div>
        )

      case 'definition':
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-6xl md:text-8xl font-black text-white text-center">
              {slide.title}
            </h1>
          </div>
        )

      case 'connect':
        return (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center space-y-6 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-gray-300">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-lg text-gray-400 mb-8">
                  {slide.content}
                </p>
              )}
              
              {slide.sections && (
                <div className="space-y-4">
                  {slide.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                      <p className="text-sm text-gray-300 mb-2">{section.subtitle}</p>
                      <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                      
                      {section.title === 'NEWSLETTER' ? (
                        <form 
                          className="space-y-3"
                          action="https://buttondown.email/api/emails/embed-subscribe/blkoutuk"
                          method="post"
                          target="popupwindow"
                        >
                          <input 
                            type="email" 
                            placeholder="Email" 
                            name="email" 
                            required 
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                          <button 
                            type="submit"
                            className="w-full bg-white text-red-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-bold transition-all shadow-lg"
                          >
                            Subscribe
                          </button>
                        </form>
                      ) : section.link ? (
                        <a href={section.link} target="_blank" rel="noopener noreferrer">
                          <button className={`w-full ${
                            section.highlight
                              ? 'bg-white text-red-600 hover:bg-gray-100'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          } px-4 py-3 rounded-lg font-bold transition-all shadow-lg`}>
                            {section.action}
                          </button>
                        </a>
                      ) : (
                        <button className={`w-full ${
                          section.highlight
                            ? 'bg-white text-red-600 hover:bg-gray-100'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        } px-4 py-3 rounded-lg font-bold transition-all shadow-lg`}>
                          {section.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
  }, [])

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-black py-4 z-50 border-b border-gray-800">
        <div className="flex justify-center px-4">
          <img 
            src="/images/blkout_logo_roundel_colour.png" 
            alt="BLKOUT Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      {/* Main Content - Simple structure */}
      <div ref={containerRef} className="pt-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide-index={index}
            className="scroll-slide w-full relative"
            style={{ height: '100vh', minHeight: '600px' }}
          >
            {/* Background */}
            <div 
              className={`absolute inset-0 ${
                slide.bgImage 
                  ? 'bg-cover bg-center bg-no-repeat' 
                  : getSlideTheme(slide)
              }`}
              style={slide.bgImage ? { backgroundImage: `url(/images/squared/${slide.bgImage})` } : {}}
            />
            
            {/* Overlay for readability */}
            {slide.bgImage && slide.type !== 'definition' && (
              <div className="absolute inset-0 bg-black/40" />
            )}
            
            {/* Content */}
            <div className="relative z-10 w-full h-full">
              {renderSlideContent(slide)}
            </div>

            {/* Navigation arrow */}
            {index < slides.length - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                onClick={nextSlide}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-20"
                aria-label="Go to next slide"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-1 bg-black/20 z-40">
        <div 
          className="h-full bg-gradient-to-r from-red-600 to-yellow-600 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => scrollToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full border-2 transition-all hover:scale-125 ${
              slideIndex === currentSlide
                ? 'bg-white border-white'
                : 'bg-transparent border-white/40 hover:border-white/80'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>

      {/* Navigation Instructions */}
      <div className="fixed bottom-4 left-4 z-40 text-white/60 text-xs">
        <div>Slide {currentSlide + 1} of {slides.length}</div>
        <div>Scroll or use dots to navigate</div>
      </div>
    </div>
  )
}

export default FixedScrollytelling