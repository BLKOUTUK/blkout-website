import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import components from conversation logs
import CommunityEmailCapture from './CommunityEmailCapture'
import BLKOUTHUBAccessRequest from './BLKOUTHUBAccessRequest'
import EnhancedQuiz from './EnhancedQuiz'
import IVORShowcase from './IVORShowcase'
import InteractiveRevelation from './InteractiveRevelation'

gsap.registerPlugin(ScrollTrigger)

interface Slide {
  id: string
  title: string
  subtitle?: string
  content?: string | React.ReactNode
  type: 'video' | 'prose' | 'lesson' | 'engagement' | 'lessons-horizontal' | 'fake-quiz-trigger' | 'pathway-quiz' | 'visioning-bridge' | 'ivor-introduction' | 'ivor-demo' | 'revelation' | 'connect' | 'definition' | 'fist-formation'
  backgroundImage?: string
  font?: string
  videoUrl?: string
  questions?: any[]
  lessons?: any[]
}

// Slide data reconstructed from conversation logs
const slides: Slide[] = [
  {
    id: 'logo-intro',
    title: 'BLKOUT UK',
    subtitle: 'Black Queer Men\'s Liberation Through Technology',
    content: 'Building collective power through cooperative ownership',
    type: 'prose',
    font: 'font-mono'
  },
  {
    id: 'video-intro',
    title: '',
    subtitle: '',
    content: '',
    type: 'video',
    videoUrl: '/blkout-intro-video.mp4'
  },
  {
    id: 'black-question',
    title: 'Black?',
    subtitle: 'What does Blackness mean in our liberation journey?',
    content: 'We center Blackness as both identity and politic - a source of power, resilience, and revolutionary potential.',
    type: 'prose',
    font: 'font-bold'
  },
  {
    id: 'queer-question', 
    title: 'Queer?',
    subtitle: 'How does queerness amplify our collective power?',
    content: 'Queerness isn\'t just sexuality - it\'s a rejection of systems that would diminish us, a celebration of authentic self-expression.',
    type: 'prose',
    font: 'font-bold'
  },
  {
    id: 'male-question',
    title: 'Male?',
    subtitle: 'What kind of masculinity serves liberation?',
    content: 'We reimagine masculinity beyond toxic stereotypes - embracing vulnerability, community care, and collective healing.',
    type: 'prose', 
    font: 'font-bold'
  },
  {
    id: 'pathway-quiz',
    title: 'Discover Your Liberation Pathway',
    subtitle: 'Every journey is unique',
    content: '',
    type: 'pathway-quiz',
    questions: [
      {
        question: "What draws you most to community work?",
        options: [
          { text: "Direct mutual aid and support", pathway: "community-organizer" },
          { text: "Creative expression and storytelling", pathway: "creative-catalyst" },
          { text: "Technology and digital liberation", pathway: "tech-liberator" },
          { text: "Policy and systemic change", pathway: "policy-advocate" }
        ]
      }
    ]
  },
  {
    id: 'ivor-introduction',
    title: 'Meet IVOR',
    subtitle: 'Your AI Community Assistant',
    content: 'IVOR (Intelligent Virtual Organizer for Revolution) helps coordinate our collective liberation work.',
    type: 'ivor-introduction'
  },
  {
    id: 'ivor-demo',
    title: 'IVOR in Action',
    subtitle: 'Experience the future of community organizing',
    content: '',
    type: 'ivor-demo'
  },
  {
    id: 'revelation',
    title: 'Your Liberation Journey',
    subtitle: 'Personalized insights for your pathway',
    content: '',
    type: 'revelation'
  },
  {
    id: 'connect',
    title: 'Join the Movement',
    subtitle: 'Ready to build together?',
    content: 'Connect with BLKOUT HUB and turn your vision into collective action.',
    type: 'connect'
  }
]

interface UserData {
  pathway?: string
  interests?: string[]
  visions?: string[]
  quiz_responses?: any[]
}

const FullPageScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [allUserData, setAllUserData] = useState<UserData>({})
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP ScrollTrigger setup from conversation logs
    const slides = document.querySelectorAll('.slide')
    
    slides.forEach((slide, index) => {
      gsap.fromTo(slide, 
        { 
          opacity: 0,
          y: 100 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: slide,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const renderSlideContent = (slide: Slide, index: number): React.ReactNode => {
    switch (slide.type) {
      case 'video':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
              src={slide.videoUrl}
            >
              <source src={slide.videoUrl} type="video/mp4" />
            </video>
          </div>
        )

      case 'prose':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className={`text-6xl md:text-8xl font-bold text-white ${slide.font || ''}`}>
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-2xl md:text-3xl text-gray-300">
                {slide.subtitle}
              </p>
            )}
            {slide.content && (
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                {typeof slide.content === 'string' ? slide.content : slide.content}
              </p>
            )}
          </motion.div>
        )

      case 'pathway-quiz':
        return (
          <EnhancedQuiz 
            slide={slide} 
            onComplete={(responses) => {
              const pathway = responses[0]?.selectedOption?.pathway || 'community-organizer'
              setAllUserData(prev => ({
                ...prev,
                pathway,
                quiz_responses: responses
              }))
            }}
          />
        )

      case 'ivor-introduction':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto space-y-8 text-center"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8">
              <span className="text-4xl font-bold text-white">IVOR</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              {slide.title}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300">
              {slide.subtitle}
            </p>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {slide.content}
            </p>
          </motion.div>
        )

      case 'ivor-demo':
        return (
          <IVORShowcase 
            userPathway={allUserData.pathway}
            onInteraction={(data) => {
              console.log('IVOR interaction:', data)
            }}
          />
        )

      case 'revelation':
        return (
          <InteractiveRevelation 
            slide={slide as any} 
            userPathway={allUserData.pathway || 'community-organizer'}
            onVisionSelection={(selections) => {
              const newVisions = selections.map(s => s.id)
              setAllUserData(prev => ({
                ...prev,
                visions: newVisions
              }))
            }}
          />
        )

      case 'connect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="w-full max-w-4xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex flex-col justify-center"
          >
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-6 py-2 mb-6">
                  <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                    The Journey Continues Here
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
                  Ready to Build<br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Together?
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  You've explored the vision, discovered your pathway, met IVOR. 
                  <strong className="text-white"> Now join the movement.</strong>
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Join BLKOUT HUB
                </h2>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  Get full access to IVOR, connect with Black queer men across the UK, 
                  and turn your vision into collective action.
                </p>
                
                <BLKOUTHUBAccessRequest
                  onSuccess={(data) => {
                    console.log('BLKOUTHUB access request submitted:', data)
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center"
            >
              <p className="text-gray-400 text-sm mb-4">
                Not ready to join? Stay connected with our newsletter.
              </p>
              <div className="max-w-xl mx-auto">
                <CommunityEmailCapture
                  source="scrollytelling"
                  variant="compact"
                  preselectedInterests={['newsletter']}
                  onSuccess={(trackingId) => {
                    console.log('Email signup successful:', trackingId)
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              {slide.title}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300">
              {slide.subtitle}
            </p>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {typeof slide.content === 'string' ? slide.content : ''}
            </p>
          </motion.div>
        )
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 ${
            slide.backgroundImage ? 'bg-cover bg-center bg-no-repeat' : ''
          }`}
          style={{
            backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
          }}
        >
          {slide.backgroundImage && (
            <div className="absolute inset-0 bg-black/50 z-0" />
          )}
          
          {slide.type !== 'definition' && slide.type !== 'video' && slide.type !== 'fist-formation' && (
            <div className={`relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 py-8 text-center ${slide.font}`}>
              {renderSlideContent(slide, index)}
            </div>
          )}

          {slide.type === 'video' && renderSlideContent(slide, index)}

          {/* Slide Navigation */}
          {index < slides.length - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              onClick={nextSlide}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-20"
              aria-label="Go to next slide"
              title="Continue to next section"
            >
              <ChevronDown className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.button>
          )}
        </div>
      ))}

      {/* Slide Indicator */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default FullPageScrollytelling