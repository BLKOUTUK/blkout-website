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

// Complete liberation slides array with all 19 sophisticated experiences
const slides = [
  {
    id: 'welcome',
    type: 'video',
    title: null,
    subtitle: null,
    content: null,
    bgImage: null,
    font: 'font-mono'
  },
  {
    id: 'well-defined',
    type: 'definition',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: '/images/WELL DEFINED FINAL -.png',
    font: 'font-serif'
  },
  {
    id: 'black',
    type: 'definition',
    title: 'BLACK?',
    subtitle: '',
    content: [
      { text: 'More than melanin.', style: 'glitch-text pixel-text' },
      { text: 'Not just heritage.', style: 'broken-box p-4 mt-4' },
      { text: "'Black British' remains a provocation to many,", style: 'vhs-lines p-2' },
      { text: 'often the same ones who aspire to colourblindness', style: 'text-red-400 line-through' }
    ],
    bgImage: '/images/BLACK.png',
    font: 'font-serif'
  },
  {
    id: 'queer',
    type: 'definition', 
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    content: [
      { text: 'the box for those who seek to reject boxes.', style: 'broken-box p-6 rotate-3' },
      { text: 'reclaiming a slur', style: 'glitch-text text-2xl' },
      { text: '(from the university library)', style: 'text-xs italic opacity-60 mt-2' }
    ],
    bgImage: '/images/queer -.png',
    font: 'font-sans'
  },
  {
    id: 'male',
    type: 'definition',
    title: 'MALE*',
    subtitle: '*TERMS AND CONDITIONS APPLY',
    content: [
      { text: 'The problem with masculinity *is* all men.', style: 'pixel-text text-3xl font-bold' },
      { text: 'despite the harms and nowhere near Stockholm,', style: 'vhs-lines italic' },
      { text: 'many of us find our jailers attractive', style: 'text-yellow-400 underline decoration-wavy' }
    ],
    bgImage: '/images/men-.png',
    font: 'font-mono'
  },
  {
    id: 'out',
    type: 'definition',
    title: 'OUT',
    subtitle: 'VISIBILITY ≠ LIBERATION',
    content: [
      { text: 'Visibility isn\'t liberation.', style: 'glitch-text text-4xl' },
      { text: '*visibility without power is surveillance', style: 'broken-box p-4 text-red-300 text-sm' },
      { text: 'Being NOT STRAIGHT is not STRAIGHTFORWARD.', style: 'pixel-text rotate-1' },
      { text: 'STRAIGHT can be over-rated', style: 'line-through opacity-70' }
    ],
    bgImage: '/images/out -.png',
    font: 'font-serif'
  },
  {
    id: 'fake-quiz-trigger',
    type: 'fake-quiz-trigger',
    title: 'BEFORE WE CONTINUE...',
    subtitle: 'A QUICK QUESTION',
    content: 'We want to know if you belong here. Are you ready?',
    questions: [
      {
        question: "Favorite weather?",
        options: ["☀️ Sunny", "⛈️ Stormy", "🌧️ Rainy", "🤷🏾‍♂️ Don't notice"]
      },
      {
        question: "Dream dinner guest?", 
        options: ["👵🏾 Grandmother", "👑 Beyoncé", "✍🏾 James Baldwin", "💙 Rhyeim"]
      }
    ],
    results: {
      welcome: {
        title: "CONGRATULATIONS! You passed!",
        message: "Plot twist: There was never a test. Identity is liberation, not prison. Difference creates dialogue, not division. Black queer men belong here. You are ready to build power."
      }
    },
    font: 'font-serif'
  },
  {
    id: 'pathway-discovery',
    type: 'pathway-quiz',
    title: 'DISCOVER YOUR LIBERATION PATHWAY',
    subtitle: 'FIND YOUR ROLE IN THE MOVEMENT',
    content: 'Now that you\'ve explored what\'s possible, let\'s get curious about how you want to contribute to our collective liberation.',
    font: 'font-serif'
  },
  {
    id: 'meet-ivor',
    type: 'ivor-introduction',
    title: 'MEET IVOR',
    subtitle: 'YOUR COMMUNITY INTELLIGENCE',
    content: 'Based on your vision choices and pathway, I\'ve been preparing personalized support for your liberation journey.',
    font: 'font-serif'
  },
  {
    id: 'ivor-showcase',
    type: 'ivor-demo',
    title: 'IVOR IN ACTION',
    subtitle: 'PERSONALIZED COMMUNITY INTELLIGENCE',
    content: 'Here\'s what I found for you this week, based on your interests and pathway.',
    font: 'font-serif'
  },
  {
    id: 'own-stories',
    type: 'revelation',
    title: 'WHAT IF OUR STORIES CREATED LIBERATION DIALOGUES?',
    subtitle: '',
    content: [
      { text: 'Not just told them and left.', style: 'text-3xl text-white mb-8' },
      { text: 'Or sold them to the highest bidder?', style: 'text-2xl text-gray-300 mb-12' },
      { text: 'Braver spaces. Bolder storytelling.', style: 'text-4xl text-blkout-primary font-bold mb-8' },
      { text: 'Lifted each other up. Created representation on our terms.', style: 'text-xl text-gray-200' }
    ],
    bgImage: null, // TODO: Add welldef2.png when available
    font: 'font-serif'
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
              src={slide.videoUrl || "/images/welcomevidfinal.webm"}
            >
              <source src={slide.videoUrl || "/images/welcomevidfinal.webm"} type="video/webm" />
            </video>
          </div>
        )

      case 'definition':
        return (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <div className="relative w-full h-full flex items-center justify-center">
              {slide.bgImage ? (
                <img 
                  src={slide.bgImage} 
                  alt={`${slide.title}: Visual representation with artistic typography`}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                  style={{ 
                    filter: 'brightness(1.05) contrast(1.1) saturate(1.15)',
                    minHeight: '70vh',
                    maxHeight: '85vh'
                  }}
                />
              ) : (
                <div className="text-center text-white">
                  <h1 className="text-6xl md:text-8xl font-bold mb-8">{slide.title}</h1>
                  <p className="text-2xl md:text-3xl text-gray-300">{slide.subtitle}</p>
                  {Array.isArray(slide.content) && slide.content.map((item: any, i: number) => (
                    <p key={i} className={`text-xl ${item.style || ''} mt-4`}>{item.text}</p>
                  ))}
                </div>
              )}
            </div>
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

      case 'fake-quiz-trigger':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto space-y-8 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono mb-6">
              {slide.subtitle}
            </p>
            <p className="text-xl text-gray-200 mb-8 italic">
              {typeof slide.content === 'string' ? slide.content : ''}
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blkout-primary to-blkout-warm px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Take The Test
            </motion.button>
            
            <p className="text-sm text-gray-400 font-mono mt-4">
              *This will only take a moment
            </p>
          </motion.div>
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
                <div className="inline-block bg-gradient-to-r from-blkout-primary to-blkout-warm rounded-full px-6 py-2 mb-6">
                  <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                    The Journey Continues Here
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
                  Ready to Build<br />
                  <span className="bg-gradient-to-r from-blkout-secondary to-blkout-accent bg-clip-text text-transparent">
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
              <div className="bg-gradient-to-br from-blkout-deep/80 to-blkout-primary/80 backdrop-blur-sm rounded-2xl p-8 border border-blkout-primary/30 max-w-2xl mx-auto">
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

          {(slide.type === 'video' || slide.type === 'definition') && renderSlideContent(slide, index)}

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