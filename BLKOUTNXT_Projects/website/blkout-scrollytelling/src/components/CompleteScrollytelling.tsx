import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import EnhancedQuiz from './EnhancedQuiz'

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
  questions?: any[]
  results?: any
  pathwayResponses?: any
  lessons?: any[]
}

// Complete BLKOUT slides - all 29 sections
const slides: Slide[] = [
  // Welcome video - first slide
  {
    id: 'welcome',
    type: 'video',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    title: '',
    subtitle: '',
    content: '',
    font: 'font-mono'
  },
  
  // Value Proposition
  {
    id: 'value-proposition',
    type: 'prose',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK, shaping a future where our stories, culture, and leadership are central.',
    content: 'We exist to create systemic change. We connect, empower, and transform Black Queer men\'s lives through digital tech, storytelling, and community ownership.',
    font: 'font-sans'
  },
  
  // Well Defined
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
  
  // Definitions - BLACK
  {
    id: 'black',
    type: 'image-only',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: 'BlackSQUARED.png',
    font: 'font-serif'
  },
  
  // Definitions - QUEER
  {
    id: 'queer',
    type: 'image-only', 
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    bgImage: 'queerSQUARED.PNG',
    font: 'font-sans'
  },
  
  // Definitions - MALE
  {
    id: 'male',
    type: 'image-only',
    title: 'MALE*',
    subtitle: '*TERMS AND CONDITIONS APPLY',
    bgImage: 'menSQUARED.png',
    font: 'font-mono'
  },
  
  // Definitions - OUT
  {
    id: 'out',
    type: 'image-only',
    title: 'OUT',
    subtitle: 'VISIBILITY ≠ LIBERATION',
    bgImage: 'outSQUARED.png',
    font: 'font-serif'
  },
  
  // Liberation image
  {
    id: 'liberation-image',
    type: 'image-only',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    bgImage: 'liberationSQUARED.png',
    font: 'font-serif'
  },
  
  // Fake quiz
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

  // Lessons horizontal
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
  
  // Future visioning
  {
    id: 'future-visioning',
    type: 'definition',
    title: 'IMAGINE',
    subtitle: 'WHAT WE COULD BUILD TOGETHER',
    bgImage: 'sunrise SQUARED.png',
    font: 'font-serif'
  },
  
  // Own stories
  {
    id: 'own-stories',
    type: 'definition',
    title: 'WHAT IF OUR STORIES CREATED LIBERATION DIALOGUES?',
    subtitle: 'BRAVER SPACES. BOLDER STORYTELLING.',
    bgImage: 'seat with baldwin SQUARED.png',
    font: 'font-serif'
  },
  
  // Build wealth
  {
    id: 'build-wealth',
    type: 'definition',
    title: 'WHAT IF WE BUILT WEALTH TOGETHER?',
    subtitle: 'LIBERATION PLUS FINANCIAL INDEPENDENCE',
    bgImage: 'capacitySQUARED.png',
    font: 'font-serif'
  },
  
  // Liberation legacy
  {
    id: 'liberation-legacy',
    type: 'definition',
    title: 'WHAT IF WE MOVED BEYOND VISIBILITY TO SOLIDARITY?',
    subtitle: 'THE REVOLUTION IS COOPERATIVE',
    bgImage: 'imagine SQUARED.png',
    font: 'font-serif'
  },
  
  // Realness Unleashed
  {
    id: 'realness-unleashed',
    type: 'chapter',
    title: 'REALNESS UNLEASHED',
    subtitle: 'Building the infrastructure for Black Queer community',
    font: 'font-sans'
  },
  
  // Story powered video
  {
    id: 'story-powered-video',
    type: 'video',
    videoUrl: '/images/squared/story powered SQUARED).mp4',
    title: '',
    subtitle: '',
    content: '',
    font: 'font-sans'
  },

  // Project intro
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
  
  // Pathway quiz
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
          action: "connect"
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
          action: "connect"
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
          action: "connect"
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
          action: "connect"
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
  
  // BLKOUTHUB CTA
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
  
  // Newsletter CTA
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
  
  // Explore Platform CTA
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

const CompleteScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showFakeQuizResults, setShowFakeQuizResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll detection
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
    // Video slides
    if (slide.type === 'video') {
      return 'bg-black'
    }
    // Definition slides - let background image show
    if (slide.type === 'definition' || slide.type === 'image-only') {
      return 'bg-black'
    }
    // Chapter slides
    if (slide.type === 'chapter') {
      return 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900'
    }
    // Connect/CTA slides
    if (slide.type === 'connect') {
      return 'bg-gradient-to-br from-red-900 via-red-800 to-orange-900'
    }
    // Quiz slides
    if (slide.type === 'fake-quiz-trigger' || slide.type === 'pathway-quiz') {
      return 'bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900'
    }
    // Lessons slides
    if (slide.type === 'lessons-horizontal') {
      return 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-900'
    }
    // Default prose
    return 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'
  }, [])

  const renderSlideContent = useCallback((slide: Slide) => {
    switch (slide.type) {
      case 'video':
        return (
          <div className="flex items-center justify-center h-full p-6">
            <div className="w-full max-w-md aspect-square mx-auto">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                preload="auto"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src={slide.videoUrl}
              >
                <source src={slide.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
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
      case 'definition':
        return (
          <div className="flex items-end justify-center h-full p-4">
            <div className="text-center space-y-3 max-w-4xl mb-8">
              <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-2xl bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/20">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-sm md:text-base text-gray-100 drop-shadow-xl bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10">
                  {slide.subtitle}
                </p>
              )}
            </div>
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

      case 'fake-quiz-trigger':
        return (
          <div className="flex items-center justify-center h-full p-8">
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
              
              {!showFakeQuizResults && slide.questions && (
                <div className="space-y-4">
                  <h3 className="text-xl text-white">{slide.questions[0].question}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {slide.questions[0].options.map((option: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setShowFakeQuizResults(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {showFakeQuizResults && slide.results && (
                <div className="bg-green-600/20 border border-green-400 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-green-300 mb-4">
                    {slide.results.welcome.title}
                  </h3>
                  <p className="text-green-100 leading-relaxed">
                    {slide.results.welcome.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 'lessons-horizontal':
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg text-gray-300">{slide.subtitle}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
              {slide.lessons?.map((lesson: any, idx: number) => (
                <div key={lesson.id} className={`bg-gradient-to-br ${lesson.colorTheme} rounded-lg p-6 space-y-4`}>
                  <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                  <p className="text-sm text-gray-200">{lesson.subtitle}</p>
                  <blockquote className="text-sm italic text-gray-100 border-l-2 border-white/30 pl-3">
                    "{lesson.quote}" - {lesson.author}
                  </blockquote>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {lesson.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'pathway-quiz':
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
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
                }}
              />
            </div>
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
                  {slide.sections.map((section: any, sectionIndex: number) => (
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
  }, [showFakeQuizResults])

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Fixed Header - proper height */}
      <div className="fixed top-0 left-0 right-0 bg-black py-4 z-50 border-b border-gray-800">
        <div className="flex justify-center px-4">
          <img 
            src="/images/blkout_logo_roundel_colour.png" 
            alt="BLKOUT Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Main Content - proper header spacing */}
      <div ref={containerRef} className="pt-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide-index={index}
            className="scroll-slide w-full relative"
            style={{ height: '100vh', minHeight: '600px', maxHeight: '100vh' }}
          >
            {/* Background */}
            <div 
              className={`absolute inset-0 ${
                slide.bgImage 
                  ? 'bg-cover bg-center bg-no-repeat' 
                  : getSlideTheme(slide)
              }`}
              style={slide.bgImage ? { 
                backgroundImage: `url(/images/squared/${encodeURIComponent(slide.bgImage)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              } : {}}
            />
            
            {/* Light overlay only for readability on text-heavy slides, not definition/image-only slides */}
            {slide.bgImage && slide.type !== 'definition' && slide.type !== 'image-only' && (
              <div className="absolute inset-0 bg-black/30" />
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
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-2">
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

export default CompleteScrollytelling