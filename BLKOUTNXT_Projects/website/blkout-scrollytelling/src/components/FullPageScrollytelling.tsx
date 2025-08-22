import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Import components
import EnhancedQuiz from './EnhancedQuiz'

// Performance: Lazy load GSAP only when needed
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

// Optimized lesson card with better performance
const LessonCard: React.FC<{ 
  lesson: any
  index: number
  totalLessons: number
  isVisible: boolean 
}> = React.memo(({ lesson, index, totalLessons, isVisible }) => {
  const [showResponse, setShowResponse] = useState(false)
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false)

  if (!isVisible) return null

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex-shrink-0 w-full h-full"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className={`relative h-full bg-gradient-to-br ${lesson.colorTheme} rounded-lg overflow-hidden shadow-lg`}>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-black/20 via-transparent to-white/20" />
        
        <div className="relative z-10 p-6 h-full flex flex-col">
          <div className="mb-4">
            <h3 className={`text-xl md:text-2xl font-bold ${lesson.textColor} mb-2 heading-block`}>
              {lesson.title}
            </h3>
            <p className={`text-xs ${lesson.textColor} opacity-80 uppercase tracking-wider font-mono`}>
              {lesson.subtitle}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl opacity-60">❝</div>
              <div className="flex-1">
                <p className={`text-sm ${lesson.textColor} font-serif italic leading-snug mb-3`}>
                  {lesson.quote}
                </p>
                <div className="text-right">
                  <span className={`text-xs ${lesson.textColor} opacity-80 font-mono uppercase tracking-wider`}>
                    — {lesson.author}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 relative">
            {!showResponse ? (
              <motion.div
                className="h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg border border-white/30 cursor-pointer"
                whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setShowResponse(true)
                  setHasBeenRevealed(true)
                }}
              >
                <div className="text-center p-4">
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`text-2xl ${lesson.textColor} mb-2`}
                  >
                    💭
                  </motion.div>
                  <p className={`text-sm ${lesson.textColor} font-medium mb-1`}>
                    Our Response
                  </p>
                  <p className={`text-xs ${lesson.textColor} opacity-70 font-mono uppercase tracking-wider`}>
                    Tap to Reveal
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/30 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs ${lesson.textColor} opacity-80 font-mono uppercase tracking-wider`}>
                      Community Response
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowResponse(false)}
                      className={`text-xs ${lesson.textColor} opacity-60 hover:opacity-100 transition-opacity`}
                    >
                      ✕
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3 max-h-32 overflow-y-auto">
                    {lesson.content.split('\n\n').slice(0, 2).map((paragraph: string, pIndex: number) => (
                      <motion.p
                        key={pIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: pIndex * 0.1 }}
                        className={`text-xs ${lesson.textColor} leading-relaxed`}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-4 flex justify-center items-center gap-2">
            <div className={`w-6 h-1 bg-white/30 rounded-full`}>
              <div 
                className={`h-full bg-white rounded-full transition-all duration-1000`}
                style={{ width: `${((index + 1) / totalLessons) * 100}%` }}
              />
            </div>
            {hasBeenRevealed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-xs ${lesson.textColor} opacity-60`}
              >
                ✓
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

interface Slide {
  id: string
  title: string
  subtitle?: string
  content?: string | React.ReactNode
  type: 'video' | 'prose' | 'lesson' | 'engagement' | 'lessons-horizontal' | 'fake-quiz-trigger' | 'pathway-quiz' | 'visioning-bridge' | 'ivor-introduction' | 'ivor-demo' | 'revelation' | 'connect' | 'definition' | 'image-only' | 'fist-formation' | 'chapter'
  backgroundImage?: string
  bgImage?: string
  font?: string
  videoUrl?: string
  questions?: any[]
  lessons?: any[]
  results?: any
  pathwayResponses?: any
  sections?: any[]
}

// Optimized slides with performance in mind
const slides: Slide[] = [
  // Welcome video - first slide after logo
  {
    id: 'welcome',
    type: 'video',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    title: '',
    subtitle: '',
    content: '',
    font: 'font-mono'
  },
  
  // Value Proposition - cleaner
  {
    id: 'value-proposition',
    type: 'prose',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK, shaping a future where our stories, culture, and leadership are central.',
    content: 'We exist to create systemic change. We connect, empower, and transform Black Queer men\'s lives through digital tech, storytelling, and community ownership.',
    font: 'font-sans'
  },
  
  // Well Defined - image only
  {
    id: 'well-defined',
    type: 'image-only',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: 'WELLDEF_SQUARED.png',
    font: 'font-serif'
  },
  
  // Unity Not Uniformity
  {
    id: 'unity-not-uniformity',
    type: 'chapter',
    title: 'UNITY NOT UNIFORMITY',
    subtitle: 'Our identities are complex and contested',
    content: '@BLKOUT this realness is a resource for building our community',
    font: 'font-sans'
  },
  
  // Definitions - image only slides without text overlays
  {
    id: 'black',
    type: 'image-only',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: 'BlackSQUARED.png',
    font: 'font-serif'
  },
  {
    id: 'queer',
    type: 'image-only', 
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    bgImage: 'queerSQUARED.PNG',
    font: 'font-sans'
  },
  {
    id: 'male',
    type: 'image-only',
    title: 'MALE*',
    subtitle: '*TERMS AND CONDITIONS APPLY',
    bgImage: 'menSQUARED.png',
    font: 'font-mono'
  },
  {
    id: 'out',
    type: 'image-only',
    title: 'OUT',
    subtitle: 'VISIBILITY ≠ LIBERATION',
    bgImage: 'outSQUARED.png',
    font: 'font-serif'
  },
  
  // Liberation image - image only
  {
    id: 'liberation-image',
    type: 'image-only',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    bgImage: 'liberationSQUARED.png',
    font: 'font-serif'
  },
  
  // Fake quiz - optimized
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
      }
    ],
    results: {
      welcome: {
        title: "CONGRATULATIONS! You passed!",
        message: "Plot twist: There was never a test. Identity is liberation, not prison. Difference creates dialogue, not division. Black queer men belong here."
      }
    },
    font: 'font-serif'
  },
  
  
  // Creating Shared Futures
  {
    id: 'creating-shared-futures',
    type: 'chapter',
    title: 'CREATING SHARED FUTURES',
    subtitle: 'we use wisdom from our ancestors',
    content: 'to inform our collective imagination',
    font: 'font-sans'
  },

  // Lessons horizontal - performance optimized
  {
    id: 'lessons-horizontal',
    type: 'lessons-horizontal',
    title: 'LIBERATION LESSONS',
    subtitle: 'WISDOM FROM OUR ANCESTORS',
    lessons: [
      {
        id: 'lesson1',
        title: 'HEALING AS INNOVATION',
        subtitle: 'TURNING WOUNDS INTO WISDOM',
        quote: 'The trauma is not your fault, the healing is your responsibility.',
        author: 'Erwin McManus',
        content: `We understand that you've carried burdens that weren't yours to bear. Our innovation lies in creating new pathways to healing—not just individual therapy, but collective care systems.

The reward? You become the ancestor you needed, breaking cycles and building bridges for others who follow your path.`,
        colorTheme: 'from-red-500 to-red-700',
        textColor: 'text-red-100'
      },
      {
        id: 'lesson2',
        title: 'BUILDING NEW TOOLS',
        subtitle: 'BEYOND THE MASTER\'S BLUEPRINT',
        quote: 'The master\'s tools will never dismantle the master\'s house.',
        author: 'Audre Lorde',
        content: `We know you've tried to succeed within systems that were never designed for your liberation. Our innovation is creating entirely new frameworks—cooperative ownership, community-led decision making.

The reward? Freedom from systems that demand you diminish yourself to participate.`,
        colorTheme: 'from-orange-500 to-orange-700',
        textColor: 'text-orange-100'
      },
      {
        id: 'lesson3',
        title: 'AUTHENTIC CONNECTION',
        subtitle: 'LOVE BEHIND THE MASKS',
        quote: 'Love removes the masks that we fear we cannot live without and know we cannot live within.',
        author: 'James Baldwin',
        content: `We recognize how exhausting it is to perform versions of yourself for survival. Our innovation is creating spaces where your full humanity is not just welcomed but necessary.

The reward? The profound relief of being known and loved for exactly who you are.`,
        colorTheme: 'from-yellow-500 to-yellow-700',
        textColor: 'text-yellow-100'
      },
      {
        id: 'lesson4',
        title: 'COLLECTIVE LIBERATION',
        subtitle: 'NONE OF US ARE FREE UNTIL ALL OF US ARE FREE',
        quote: 'Your liberation is bound up with mine.',
        author: 'Fannie Lou Hamer',
        content: `Individual success within oppressive systems is not liberation. True freedom requires collective action and community power.

The reward? Building movements that create lasting change for all Black queer men.`,
        colorTheme: 'from-green-500 to-green-700',
        textColor: 'text-green-100'
      }
    ],
    font: 'font-sans'
  },
  
  // Visioning bridge with picture
  {
    id: 'future-visioning',
    type: 'definition',
    title: 'IMAGINE',
    subtitle: 'WHAT WE COULD BUILD TOGETHER',
    bgImage: 'sunrise SQUARED.png',
    font: 'font-serif'
  },
  
  // Revelation slides - image optimized
  {
    id: 'own-stories',
    type: 'definition',
    title: 'WHAT IF OUR STORIES CREATED LIBERATION DIALOGUES?',
    subtitle: 'BRAVER SPACES. BOLDER STORYTELLING.',
    bgImage: 'seat with baldwin SQUARED.png',
    font: 'font-serif'
  },
  
  {
    id: 'build-wealth',
    type: 'definition',
    title: 'WHAT IF WE BUILT WEALTH TOGETHER?',
    subtitle: 'LIBERATION PLUS FINANCIAL INDEPENDENCE',
    bgImage: 'capacitySQUARED.png',
    font: 'font-serif'
  },
  
  {
    id: 'liberation-legacy',
    type: 'definition',
    title: 'WHAT IF WE MOVED BEYOND VISIBILITY TO SOLIDARITY?',
    subtitle: 'THE REVOLUTION IS COOPERATIVE',
    bgImage: 'imagine SQUARED.png',
    font: 'font-serif'
  },
  
  // Realness Unleashed - moved before video
  {
    id: 'realness-unleashed',
    type: 'chapter',
    title: 'REALNESS UNLEASHED',
    subtitle: 'Building the infrastructure for Black Queer community',
    font: 'font-sans'
  },
  
  // Story powered video - moved after chapter
  {
    id: 'story-powered-video',
    type: 'video',
    videoUrl: '/images/squared/story powered SQUARED).mp4',
    title: '',
    subtitle: '',
    content: '',
    font: 'font-sans'
  },

  // Project intro - image only
  {
    id: 'project-intro',
    type: 'image-only',
    title: 'OUR PROJECTS',
    subtitle: 'BUILDING LIBERATION TOGETHER',
    bgImage: 'projects SQUAREDpng.png',
    font: 'font-sans'
  },
  
  // Your Voice Matters
  {
    id: 'your-voice-matters',
    type: 'chapter',
    title: 'YOUR VOICE MATTERS',
    subtitle: 'we are informed and led by Black queer men',
    content: 'have your say',
    font: 'font-sans'
  },
  
  // Pathway quiz - optimized for square
  {
    id: 'pathway-discovery',
    type: 'pathway-quiz',
    title: 'DISCOVER YOUR LIBERATION PATHWAY',
    subtitle: 'FIND YOUR ROLE IN THE MOVEMENT',
    content: 'Now that you\'ve explored what\'s possible, let\'s get curious about how you want to contribute.',
    questions: [
      {
        question: "What draws you most to community work?",
        options: [
          { text: "Direct mutual aid and support", pathway: "community-healer" },
          { text: "Creative expression and storytelling", pathway: "creative-catalyst" }, 
          { text: "Technology and digital liberation", pathway: "tech-liberator" },
          { text: "Policy and systemic change", pathway: "systems-transformer" }
        ]
      }
    ],
    pathwayResponses: {
      "community-healer": {
        title: "COMMUNITY HEALER",
        subtitle: "The medicine our people need",
        description: "You're drawn to the deep work of healing - both individual and collective.",
        opportunities: [
          "📅 Healing Circle - Thursdays 7pm, Peckham Community Centre",
          "🎯 Peer support coordinator - Manchester chapter, £200/month",
          "📚 Trauma-Informed Community Care certification - March 15"
        ],
        cta: {
          text: "Get Support",
          action: "connect",
          pathwayContext: {
            pathway: "community-healer",
            initialMessage: "Hi! I just completed the liberation pathway quiz and my results show I'm drawn to community healing work. I'm interested in finding healing circles, peer support opportunities, and trauma-informed community care resources.",
            focus: "healing, trauma-informed care, peer support, community wellness"
          }
        }
      },
      "creative-catalyst": {
        title: "CREATIVE CATALYST", 
        subtitle: "Storytelling as liberation practice",
        description: "You understand that representation matters, but authentic representation controlled by us matters more.",
        opportunities: [
          "📝 'Black Futures' digital magazine - £150 per published piece",
          "🎬 Documentary collaboration with Kwame - grant funded",
          "🎪 'Realness Stories' curator - £300/event + travel"
        ],
        cta: {
          text: "Get Support",
          action: "connect",
          pathwayContext: {
            pathway: "creative-catalyst",
            initialMessage: "Hi! My liberation pathway results show I'm a creative catalyst focused on storytelling as liberation practice. I'm looking for opportunities in digital publishing, documentary work, and curating community stories.",
            focus: "storytelling, creative expression, media production, community narratives"
          }
        }
      },
      "tech-liberator": {
        title: "TECH LIBERATOR",
        subtitle: "Code as cooperative power",
        description: "You see technology as a tool for collective liberation, not individual accumulation.",
        opportunities: [
          "💻 Platform development - React/TypeScript, cooperative ownership",
          "🔧 Notification system design - £500 developer fee",
          "🏫 'Code for Liberation' workshop - £250/session"
        ],
        cta: {
          text: "Get Support",
          action: "connect",
          pathwayContext: {
            pathway: "tech-liberator",
            initialMessage: "Hi! I've completed the liberation pathway quiz and I'm identified as a tech liberator who sees technology as a tool for collective liberation. I'm interested in cooperative platform development, community tech projects, and sharing technical skills for liberation.",
            focus: "cooperative technology, platform development, community tech education, digital liberation"
          }
        }
      },
      "systems-transformer": {
        title: "SYSTEMS TRANSFORMER",
        subtitle: "Policy as collective power building",
        description: "You're committed to changing the rules of the game, not just playing it better.",
        opportunities: [
          "📊 Stonewall Housing data analyst - £2,800/month contract",
          "⚡ Government consultation response - conversion therapy ban",
          "🤝 Housing Justice Alliance strategy meeting - Feb 24"
        ],
        cta: {
          text: "Get Support",
          action: "connect",
          pathwayContext: {
            pathway: "systems-transformer",
            initialMessage: "Hi! My liberation pathway results identify me as a systems transformer focused on policy and systemic change. I'm interested in housing justice, policy analysis, government consultations, and strategic organizing work.",
            focus: "policy analysis, systemic change, housing justice, government relations, strategic organizing"
          }
        }
      }
    },
    font: 'font-serif'
  },
  
  // Photo collage video
  {
    id: 'photo-collage',
    type: 'video',
    title: '',
    subtitle: '',
    content: '',
    videoUrl: '/images/squared/photo collage Video.mp4',
    font: 'font-serif'
  },
  
  // Primary CTA - elegant landing page
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
        highlight: true
      }
    ],
    bgImage: 'facecard SQUARED.png',
    font: 'font-sans'
  },
  
  // Newsletter CTA - separate slide
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
  },
  
  // Explore Platform CTA - separate slide
  {
    id: 'explore-platform-cta',
    type: 'connect',
    title: 'EXPLORE THE PLATFORM',
    subtitle: 'DISCOVER MORE',
    content: 'Browse our full range of projects, resources, and ways to get involved in the movement.',
    sections: [
      {
        title: 'EXPLORE',
        subtitle: 'Discover More',
        description: 'Explore our full ecosystem: newsroom, events, community spaces, and liberation resources.',
        action: 'Visit Main Site',
        highlight: true,
        link: 'https://blkout.uk'
      }
    ],
    font: 'font-sans'
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
  const [, setAllUserData] = useState<UserData>({})
  const [showFakeQuizResults, setShowFakeQuizResults] = useState(false)
  const [gsapLoaded, setGsapLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Performance: Load GSAP only when component mounts
  useEffect(() => {
    loadGSAP().then(() => {
      setGsapLoaded(true)
    })
  }, [])

  // Performance: Optimized scroll trigger setup
  useEffect(() => {
    if (!gsapLoaded || !gsap || !ScrollTrigger) return

    const slideElements = document.querySelectorAll('.slide')
    const triggers: any[] = []
    
    slideElements.forEach((slide, index) => {
      // Simplified entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: slide,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onEnter: () => setCurrentSlide(index),
          onEnterBack: () => setCurrentSlide(index)
        }
      })

      tl.fromTo(slide, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )

      triggers.push(tl.scrollTrigger)
    })

    return () => {
      triggers.forEach(trigger => trigger?.kill())
    }
  }, [gsapLoaded])

  // Performance: Optimized slide navigation
  const scrollToSlide = useCallback((slideIndex: number) => {
    const slideElement = document.querySelector(`[data-slide-index="${slideIndex}"]`)
    if (slideElement) {
      slideElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  // Determine slide theme based on content and type
  const getSlideTheme = useCallback((slide: any): string => {
    // IVOR-related sections: dark orange
    if (slide.type === 'pathway-quiz' || 
        slide.id?.includes('ivor') || 
        slide.title?.includes('IVOR') ||
        slide.title?.includes('PATHWAY') ||
        slide.title?.includes('LIBERATION PATHWAY') ||
        slide.content?.includes('IVOR') ||
        slide.type === 'fake-quiz-trigger') {
      return 'bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900'
    }
    
    // Movement/collective action sections: dark green  
    if (slide.title?.includes('MOVEMENT') ||
        slide.title?.includes('COLLECTIVE') ||
        slide.title?.includes('LIBERATION') ||
        slide.title?.includes('POWER') ||
        slide.title?.includes('UNITY') ||
        slide.title?.includes('FUTURES') ||
        slide.title?.includes('REALNESS') ||
        slide.title?.includes('VOICE MATTERS') ||
        slide.content?.includes('movement') ||
        slide.content?.includes('collective') ||
        slide.subtitle?.includes('movement') ||
        slide.type === 'chapter') {
      return 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-900'
    }
    
    // Discussion/community sections: dark red
    if (slide.title?.includes('DISCUSSION') ||
        slide.title?.includes('COMMUNITY') ||
        slide.title?.includes('CONNECT') ||
        slide.title?.includes('VOICES') ||
        slide.title?.includes('CONVERSATION') ||
        slide.title?.includes('STAY CONNECTED') ||
        slide.title?.includes('READY TO JOIN') ||
        slide.content?.includes('discussion') ||
        slide.content?.includes('community') ||
        slide.type === 'connect') {
      return 'bg-gradient-to-br from-red-900 via-red-800 to-rose-900'
    }
    
    // Default theme for other sections
    return 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
  }, [])

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      scrollToSlide(currentSlide + 1)
    }
  }, [currentSlide, scrollToSlide])

  // Performance: Memoized slide content renderer
  const renderSlideContent = useCallback((slide: Slide): React.ReactNode => {
    switch (slide.type) {
      case 'chapter':
        return (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md text-center border border-gray-200"
            >
              <h1 className="text-xl md:text-2xl font-black text-black leading-tight mb-3"
                  style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-sm md:text-base text-gray-700 mb-3 font-medium">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-sm text-gray-600 mb-4 italic">
                  {slide.content}
                </p>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <img 
                  src="/images/favicon2.png" 
                  alt="BLKOUT" 
                  className="w-6 h-6 opacity-80"
                />
              </motion.div>
            </motion.div>
          </div>
        )

      case 'video':
        return (
          <div className="relative w-full h-full bg-black overflow-hidden">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              preload="auto"
              className="w-full h-full object-contain"
              src={slide.videoUrl}
              onLoadedData={() => {}}
              onError={(e) => {
                console.error('Video failed to load:', slide.videoUrl)
                console.error('Error details:', e)
              }}
              onCanPlay={() => {}}
            >
              <source src={slide.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )

      case 'definition':
        return (
          <div className="relative w-full h-full">
            {slide.bgImage ? (
              <>
                <img 
                  src={`/images/squared/${slide.bgImage}`}
                  alt={`${slide.title}: Visual representation`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ 
                    filter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
                    objectFit: 'cover'
                  }}
                />
                {/* Text overlay for definition slides - positioned in top third */}
                <div className="absolute top-0 left-0 right-0 flex justify-center pt-8">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 mx-4 text-center text-white max-w-sm">
                    <h1 className="text-lg md:text-xl font-bold mb-2 heading-block text-white">{slide.title}</h1>
                    {slide.subtitle && (
                      <p className="text-xs md:text-sm text-gray-100">{slide.subtitle}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-white p-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 heading-block">{slide.title}</h1>
                  <p className="text-lg md:text-xl text-gray-300">{slide.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'image-only':
        return (
          <div className="relative w-full h-full">
            {slide.bgImage ? (
              <img 
                src={`/images/squared/${slide.bgImage}`}
                alt={`${slide.title}: Visual representation`}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ 
                  filter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center text-white p-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 heading-block">{slide.title}</h1>
                  <p className="text-lg md:text-xl text-gray-300">{slide.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'prose':
        return (
          <div className="flex items-center justify-center h-full p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <h1 className={`text-2xl md:text-3xl font-bold text-white heading-block ${slide.font || ''}`}>
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-sm md:text-base text-gray-300 leading-relaxed text-center max-w-lg mx-auto">
                  {slide.subtitle}
                </p>
              )}
              {slide.content && (
                <p className="text-base text-gray-200 max-w-lg leading-relaxed text-center mx-auto">
                  {typeof slide.content === 'string' ? slide.content : slide.content}
                </p>
              )}
            </motion.div>
          </div>
        )

      case 'pathway-quiz':
        return (
          <div className="w-full h-full p-2 overflow-y-auto">
            <div className="w-full h-full max-w-full">
              <EnhancedQuiz 
                slide={slide} 
                onComplete={(responses) => {
                  const pathway = responses[0]?.selectedOption?.pathway || 'community-healer'
                  const pathwayData = {
                    pathway,
                    focus: responses[0]?.selectedOption?.text || '',
                    description: `Liberation pathway: ${pathway}`,
                    quiz_responses: responses,
                    userId: 'website-user',
                    timestamp: new Date().toISOString()
                  }
                  
                  // Store pathway context for future use
                  localStorage.setItem('pathwayContext', JSON.stringify(pathwayData))
                  
                  setAllUserData(prev => ({
                    ...prev,
                    pathway,
                    quiz_responses: responses
                  }))
                }}
              />
            </div>
          </div>
        )

      case 'lessons-horizontal':
        return (
          <div className="w-full h-full p-3 flex flex-col">
            <div className="text-center mb-4 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h1 className="text-lg md:text-2xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent heading-block">
                  {slide.title}
                </h1>
                <p className="text-xs md:text-sm text-gray-300 uppercase tracking-wider font-mono">
                  {slide.subtitle}
                </p>
              </motion.div>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <motion.div
                className="flex gap-3 h-full overflow-x-auto no-scrollbar"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {slide.lessons && Array.isArray(slide.lessons) && slide.lessons.map((lesson: any, lessonIndex: number) => (
                  <div key={lesson.id} className="flex-shrink-0 w-56 h-full">
                    <LessonCard 
                      lesson={lesson}
                      index={lessonIndex}
                      totalLessons={slide.lessons?.length || 0}
                      isVisible={true}
                    />
                  </div>
                ))}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-center border border-white/20"
              >
                <div className="flex items-center gap-2 text-xs">
                  <motion.span 
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Scroll →
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        )

      case 'fake-quiz-trigger':
        if (showFakeQuizResults) {
          const results = slide.results?.welcome
          return (
            <div className="flex items-center justify-center h-full p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img 
                    src="/images/joker.png"
                    alt="Joker"
                    className="w-24 h-auto opacity-20"
                  />
                </div>
                
                <div className="relative z-10 space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-white heading-block">
                    {results?.title}
                  </h1>
                  
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md">
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                      {results?.message}
                    </p>
                  </div>
                  
                  <div className="inline-block bg-gradient-to-r from-red-600 to-yellow-600 rounded-full px-4 py-2">
                    <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                      Welcome to the Journey
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        }
        
        return (
          <div className="flex items-center justify-center h-full p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white heading-block">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                {slide.subtitle}
              </p>
              <p className="text-base text-gray-200 italic">
                {typeof slide.content === 'string' ? slide.content : ''}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFakeQuizResults(true)}
                className="bg-gradient-to-r from-red-600 to-yellow-600 px-6 py-3 rounded-lg text-white font-bold shadow-lg hover:shadow-xl transition-all heading-block"
              >
                Take The Test
              </motion.button>
            </motion.div>
          </div>
        )

      case 'connect':
        return (
          <div className="w-full h-full p-4 flex items-center justify-center overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full max-w-sm space-y-6"
            >
              <div className="text-center space-y-3">
                <div className="inline-block bg-gradient-to-r from-red-600 to-yellow-600 rounded-full px-3 py-1">
                  <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                    Liberation Journey
                  </span>
                </div>
                
                <h1 className="text-xl md:text-2xl font-bold text-white leading-tight heading-block">
                  {slide.title}
                </h1>
                
                <p className="text-sm text-gray-300 leading-relaxed">
                  {slide.content}
                </p>
              </div>

              {Array.isArray(slide.sections) && slide.sections.length === 1 ? (
                // Single section - make it prominent
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-red-600 to-yellow-600 backdrop-blur-sm rounded-2xl p-6 border border-red-500/50 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-3 text-white heading-block">
                      {slide.sections[0].title}
                    </h2>
                    <p className="text-sm font-mono uppercase tracking-wider mb-4 text-yellow-100">
                      {slide.sections[0].subtitle}
                    </p>
                    <p className="text-sm mb-6 leading-relaxed text-gray-200">
                      {slide.sections[0].description}
                    </p>
                    
                    {slide.sections[0].title === 'BLKOUTHUB' ? (
                      <a href="https://blkouthub.com/invitation?code=BE862C" target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-lg"
                        >
                          {slide.sections[0].action}
                        </motion.button>
                      </a>
                    ) : slide.sections[0].link ? (
                      <a href={slide.sections[0].link} target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-lg"
                        >
                          {slide.sections[0].action}
                        </motion.button>
                      </a>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-lg"
                        onClick={() => {
                          // Handle other CTA actions
                          // CTA clicked
                        }}
                      >
                        {slide.sections[0].action}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : Array.isArray(slide.sections) && (
                // Multiple sections - compact layout
                <div className="space-y-3">
                  {slide.sections.map((section: any, sectionIndex: number) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                      className="text-center"
                    >
                      <div className={`${
                        section.highlight 
                          ? 'bg-gradient-to-br from-red-600/90 to-yellow-600/90 border-red-500/50' 
                          : 'bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-600/30'
                      } backdrop-blur-sm rounded-xl p-4 border`}>
                        <h2 className={`text-base font-bold mb-2 heading-block ${
                          section.highlight ? 'text-white' : 'text-gray-100'
                        }`}>
                          {section.title}
                        </h2>
                        <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                          section.highlight ? 'text-yellow-100' : 'text-gray-400'
                        }`}>
                          {section.subtitle}
                        </p>
                        <p className={`text-xs mb-3 leading-relaxed ${
                          section.highlight ? 'text-gray-200' : 'text-gray-300'
                        }`}>
                          {section.description}
                        </p>
                        
                        {section.title === 'NEWSLETTER' ? (
                          <div className="newsletter-signup">
                            <form 
                              method="post" 
                              action="https://sendfox.com/form/3zpwee/1wj276" 
                              className="sendfox-form space-y-2" 
                              id={`newsletter-${sectionIndex}`}
                              data-async="true" 
                              data-recaptcha="true"
                            >
                              <input 
                                type="text" 
                                placeholder="First Name" 
                                name="first_name" 
                                required 
                                className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                              />
                              <input 
                                type="email" 
                                placeholder="Email" 
                                name="email" 
                                required 
                                className="w-full px-2 py-1 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent text-xs"
                              />
                              <div className="flex items-start space-x-2">
                                <input 
                                  type="checkbox" 
                                  name="gdpr" 
                                  value="1" 
                                  required 
                                  className="mt-0.5 h-3 w-3 text-red-600 focus:ring-red-600 border-gray-600 rounded bg-gray-800"
                                />
                                <label className="text-xs text-gray-300 leading-tight">
                                  I agree to receive updates
                                </label>
                              </div>
                              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                                <input type="text" name="a_password" tabIndex={-1} defaultValue="" autoComplete="off" />
                              </div>
                              <motion.button 
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white text-red-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-bold transition-all shadow-lg text-sm"
                              >
                                Subscribe
                              </motion.button>
                            </form>
                          </div>
                        ) : section.link ? (
                          <a href={section.link} target="_blank" rel="noopener noreferrer">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full ${
                                section.highlight
                                  ? 'bg-white text-red-600 hover:bg-gray-100'
                                  : 'bg-gray-700 text-white hover:bg-gray-600'
                              } px-4 py-3 rounded-lg font-bold transition-all shadow-lg text-sm`}
                            >
                              {section.action}
                            </motion.button>
                          </a>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full ${
                              section.highlight
                                ? 'bg-white text-red-600 hover:bg-gray-100'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                            } px-4 py-3 rounded-lg font-bold transition-all shadow-lg text-sm`}
                          >
                            {section.action}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white heading-block">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                {slide.subtitle}
              </p>
              <p className="text-base text-gray-200">
                {typeof slide.content === 'string' ? slide.content : ''}
              </p>
            </motion.div>
          </div>
        )
    }
  }, [showFakeQuizResults])

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* BLKOUT Logo Header - Fixed position */}
      <div className="fixed top-0 left-0 right-0 bg-black py-4 z-50 border-b border-gray-800">
        <div className="flex justify-center px-4">
          <img 
            src="/images/blkout_logo_roundel_colour.png" 
            alt="BLKOUT Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      {/* Main scrollable container with proper spacing for fixed header */}
      <div ref={containerRef} className="relative bg-black text-white pt-24">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide-index={index}
            className="slide relative w-full bg-black"
            style={{ height: '100vh', minHeight: '600px' }}
          >
            {/* Simplified container - no forced aspect ratio */}
            <div className="w-full h-full relative">
                  {/* Background */}
                  <div 
                    className={`absolute inset-0 ${
                      slide.bgImage 
                        ? 'bg-cover bg-center bg-no-repeat' 
                        : getSlideTheme(slide)
                    }`}
                    style={{
                      backgroundImage: slide.bgImage ? `url(/images/squared/${slide.bgImage})` : undefined
                    }}
                  />
                  
                  {/* Overlay for readability */}
                  {slide.bgImage && slide.type !== 'definition' && slide.type !== 'video' && slide.type !== 'image-only' && (
                    <div className="absolute inset-0 bg-black/40 z-0" />
                  )}
                  
                  {/* Content container */}
              <div className="relative z-10 w-full h-full">
                <div className={`w-full h-full ${slide.font || ''}`}>
                  {renderSlideContent(slide)}
                </div>
              </div>
            </div>

            {/* Navigation arrow - properly positioned outside square container */}
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

        {/* Progress Bar - Fixed at top */}
        <div className="fixed top-20 left-0 w-full h-1 bg-black/20 z-40">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-yellow-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Slide Indicator - Fixed right side */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => scrollToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full transition-all hover:scale-125 ${
                currentSlide === slideIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>

        {/* Navigation Instructions - Fixed bottom left */}
        <div className="fixed bottom-4 left-4 z-30 text-white/60 text-xs font-mono">
          <div className="space-y-1">
            <div>↓ Scroll to continue</div>
            <div>→ Use dots to navigate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullPageScrollytelling