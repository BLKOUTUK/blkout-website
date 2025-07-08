import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, ChevronUp } from 'lucide-react'
import StickyNavigation from './StickyNavigation'
import RemoteControl from './RemoteControl'
import WelcomeVideo from './WelcomeVideo'

gsap.registerPlugin(ScrollTrigger)

// Helper function to calculate fist formation positions
const getFistPosition = (cardIndex: number) => {
  // Positions to form a raised fist shape (6 cards)
  const positions = [
    // Card 0: Thumb (left side)
    { x: -200, y: 100, rotation: -15 },
    // Card 1: Index finger (top)
    { x: -50, y: -150, rotation: 10 },
    // Card 2: Middle finger (top center)
    { x: 50, y: -180, rotation: -5 },
    // Card 3: Ring finger (top right)
    { x: 150, y: -150, rotation: 15 },
    // Card 4: Pinky (right side)
    { x: 200, y: -100, rotation: 25 },
    // Card 5: Palm/wrist (bottom center)
    { x: 0, y: 150, rotation: 0 }
  ]
  
  return positions[cardIndex] || { x: 0, y: 0, rotation: 0 }
}

// Quiz Component
const QuizComponent: React.FC<{ slide: any }> = ({ slide }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    
    // Auto-advance after a brief delay
    setTimeout(() => {
      if (currentQuestion < slide.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResults(true)
      }
    }, 800)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setIsStarted(false)
  }

  if (!isStarted) {
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
          {slide.content}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsStarted(true)}
          className="bg-gradient-to-r from-blkout-primary to-blkout-warm px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Start Quiz
        </motion.button>
        
        <p className="text-sm text-gray-400 font-mono mt-4">
          *Spoiler alert: Everyone's welcome here
        </p>
      </motion.div>
    )
  }

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {slide.results.welcome.title}
        </h2>
        
        <div className="bg-gradient-to-r from-blkout-deep/80 to-blkout-accent/80 backdrop-blur-sm rounded-lg p-8 border border-white/30">
          <p className="text-lg md:text-xl text-white leading-relaxed mb-8">
            {slide.results.welcome.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blkout-primary hover:bg-blkout-warm px-6 py-3 rounded-lg text-white font-semibold transition-all"
            >
              Join BLKOUTHUB
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blkout-secondary hover:bg-blkout-accent px-6 py-3 rounded-lg text-white font-semibold transition-all"
            >
              Newsletter Signup
            </motion.button>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetQuiz}
          className="text-gray-400 hover:text-white font-mono text-sm underline transition-all"
        >
          Take Quiz Again
        </motion.button>
      </motion.div>
    )
  }

  const question = slide.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / slide.questions.length) * 100

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
        <motion.div
          className="bg-gradient-to-r from-blkout-primary to-blkout-warm h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Question */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-400 font-mono mb-2">
          Question {currentQuestion + 1} of {slide.questions.length}
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          {question.question}
        </h2>
      </div>
      
      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, x: 10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(index)}
            className={`p-6 text-left bg-gray-900/50 hover:bg-gray-800/70 border border-white/20 hover:border-white/40 rounded-lg transition-all group ${
              selectedAnswers[currentQuestion] === index ? 'border-blkout-primary bg-blkout-primary/20' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-6 h-6 rounded-full border-2 border-white/40 group-hover:border-white flex items-center justify-center ${
                selectedAnswers[currentQuestion] === index ? 'bg-blkout-primary border-blkout-primary' : ''
              }`}>
                {selectedAnswers[currentQuestion] === index && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>
              <p className="text-white text-lg group-hover:text-gray-100 transition-colors">
                {option}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

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
    content: [
      { text: 'Like all the boys in the gym, at times we\'d like to be well defined.', style: 'text-2xl text-white/90 italic' },
      { text: 'Sometimes commonsense definitions aren\'t enough.', style: 'text-xl text-gray-300 mt-4' },
      { text: 'Sometimes complexity is all we have', style: 'glitch-text text-3xl mt-6' },
      { text: 'Our identities don\'t have to be convenient for your survey, nor static for the sake of the stats.', style: 'broken-box p-4 text-yellow-300 text-lg mt-8' },
      { text: 'Our identities are busy helping us to navigate relationships in a complex society', style: 'pixel-text text-xl mt-6 text-blkout-secondary' }
    ],
    bgImage: '/images/WELLDEF2 (Youtube Banner).png',
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
    id: 'prose',
    type: 'prose',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    content: `In the words of Stuart Hall, "The question is not who we are, but who we are becoming." Our work disrupts the singular narrative that has contained us. We refuse the limitation of being defined by what we are not. Instead, we embrace the complexity of our becoming - Black, queer, male, out - each identity a site of possibility rather than constraint.

Through dialogue we share the burden of meaning-making. No longer isolated in our difference, we build bridges between our experiences. Our stories become resources for liberation, not just for ourselves but for all who recognize themselves in our struggle. This is the power of collective storytelling: it transforms individual pain into shared understanding, personal truth into political action.

The resistance is not about anger alone, but about the audacity to imagine otherwise. To create spaces where difference is not just tolerated but celebrated as the source of our collective strength.`,
    bgImage: '/images/blkoutrainbowbackground.png',
    font: 'font-serif'
  },
  {
    id: 'fist-formation',
    type: 'fist-formation',
    title: 'COLLECTIVE ACTION',
    subtitle: 'MEMBERS AT THE CENTRE',
    content: 'Six stories, one powerful movement',
    cards: [
      { id: 'card1', color: '#FF0000', project: 'Co-op', story: 'Building cooperative ownership together' },
      { id: 'card2', color: '#FF8C00', project: 'Channel', story: 'Broadcasting Black queer liberation' },
      { id: 'card3', color: '#FFD700', project: 'StoryLab', story: 'Collaborative storytelling workshops' },
      { id: 'card4', color: '#00FF00', project: 'IVOR', story: 'AI assistant for community guidance' },
      { id: 'card5', color: '#0000FF', project: 'BLKOUTHUB', story: 'Digital community platform' },
      { id: 'card6', color: '#8B00FF', project: 'Community', story: 'Events, gatherings, connections' }
    ],
    bgVideo: '/images/realnessnxt.mp4',
    font: 'font-sans'
  },
  {
    id: 'lesson1',
    type: 'lesson',
    title: 'HEALING AS INNOVATION',
    subtitle: 'TURNING WOUNDS INTO WISDOM',
    quote: 'The trauma is not your fault, the healing is your responsibility.',
    content: `We understand that you've carried burdens that weren't yours to bear. Our innovation lies in creating new pathways to healing—not just individual therapy, but collective care systems that honor both struggle and triumph. 

The reward? You become the ancestor you needed, breaking cycles and building bridges for others who follow your path.`,
    bgImage: '/images/blkoutrainbowbackground.png',
    font: 'font-serif'
  },
  {
    id: 'lesson2',
    type: 'lesson',
    title: 'BUILDING NEW TOOLS',
    subtitle: 'BEYOND THE MASTER\'S BLUEPRINT',
    quote: 'The master\'s tools will never dismantle the master\'s house.',
    content: `We know you've tried to succeed within systems that were never designed for your liberation. Our innovation is creating entirely new frameworks—cooperative ownership, community-led decision making, mutual aid networks.

The reward? Freedom from systems that demand you diminish yourself to participate.`,
    bgImage: '/images/blkoutrainbowbackground.png',
    font: 'font-sans'
  },
  {
    id: 'lesson3',
    type: 'lesson',
    title: 'AUTHENTIC CONNECTION',
    subtitle: 'LOVE BEHIND THE MASKS',
    quote: 'Love removes the masks that we fear we cannot live without and know we cannot live within.',
    content: `We recognize how exhausting it is to perform versions of yourself for survival. Our innovation is creating spaces where your full humanity is not just welcomed but necessary.

The reward? The profound relief of being known and loved for exactly who you are, not who you pretend to be.`,
    bgImage: '/images/blkoutrainbowbackground.png',
    font: 'font-mono'
  },
  {
    id: 'lesson4',
    type: 'lesson',
    title: 'UNAPOLOGETIC BECOMING',
    subtitle: 'TEMPLES FOR TOMORROW',
    quote: 'We now intend to express our dark-skinned selves without fear or shame... we build our temples for tomorrow, strong as we know how, and we stand on top of the mountain, free within ourselves.',
    content: `We see you claiming your space, your voice, your right to exist boldly. Our innovation is amplifying that courage through collective power and shared resources.

The reward? A legacy of liberation that extends far beyond your individual journey, creating mountains of freedom for generations to come.`,
    bgImage: '/images/blkoutrainbowbackground.png',
    font: 'font-serif'
  },
  {
    id: 'engagement',
    type: 'engagement',
    title: 'DEEP ENGAGEMENT',
    subtitle: 'AN INVITATION FOR LIFE',
    content: `This is not a moment, but a movement. Not a destination, but a journey that asks everything of us and gives even more in return.

We invite you to move beyond consumption to contribution. Beyond watching to participating. Beyond agreement to action.

Deep engagement means showing up when it's difficult, staying when it's challenging, and growing when it's uncomfortable. It means bringing your whole self—your gifts, your questions, your commitment to becoming.

This is an invitation to join not just our community, but the larger work of liberation that spans generations. To add your voice to the chorus, your hands to the building, your heart to the healing.

The door is open. The work is waiting. The future is calling.

Will you answer?`,
    bgImage: '/images/6.png',
    font: 'font-sans'
  },
  {
    id: 'futures',
    type: 'futures',
    title: 'NEW POSSIBLE',
    subtitle: 'WHAT IF WE OWNED OUR STORIES?',
    content: 'Not just told them. Or sold them to the highest bidder?',
    bgImage: '/images/6.png',
    font: 'font-mono'
  },
  {
    id: 'quiz',
    type: 'quiz',
    title: 'ARE YOU READY?',
    subtitle: 'TAKE OUR COMPLETELY SCIENTIFIC TEST',
    content: 'Are you Black enough, queer enough, out enough?',
    questions: [
      {
        question: "How do you prefer to start your mornings?",
        options: [
          "With meditation and intention setting",
          "Coffee and checking the group chat", 
          "Already been up for hours plotting liberation",
          "What morning? Time is a construct"
        ]
      },
      {
        question: "Your ideal Friday night involves:",
        options: [
          "Deep conversations about systemic change",
          "Drag bingo with chosen family",
          "Reading theory while rage-tweeting",
          "All of the above, simultaneously"
        ]
      },
      {
        question: "When someone says 'that's not how we do things here':",
        options: [
          "You smile and do it your way anyway",
          "You question why that's 'the way'",
          "You build a better system entirely",
          "You're already three steps ahead"
        ]
      }
    ],
    results: {
      welcome: {
        title: "WELCOME HOME",
        message: "You're exactly who we've been waiting for. Your journey, your questions, your readiness to grow - it all belongs here. Black queer men are invited to join BLKOUTHUB. Everyone is welcome to sign up for our newsletter and join the conversation."
      }
    },
    bgImage: '/images/BLKOUT25.png',
    font: 'font-serif'
  },
  {
    id: 'connect',
    type: 'connect',
    title: 'ALL ARE WELCOME',
    subtitle: 'MULTIPLE WAYS TO ENGAGE',
    content: 'Your journey starts here, wherever you are',
    sections: [
      {
        title: 'BLKOUTHUB',
        subtitle: 'For Black Queer Men',
        description: 'A dedicated space for deep connection, mutual support, and collective action. Join our core community platform.',
        action: 'Join BLKOUTHUB',
        highlight: true
      },
      {
        title: 'NEWSLETTER',
        subtitle: 'For Everyone',
        description: 'Stay connected with our latest projects, events, and community stories. No commitment required.',
        action: 'Subscribe',
        highlight: false
      },
      {
        title: 'EXPLORE',
        subtitle: 'Discover More',
        description: 'Browse our full range of projects, resources, and ways to get involved through our comprehensive platform.',
        action: 'Browse All',
        highlight: false
      }
    ],
    bgImage: '/images/blkoutrainbowbackground.png',
    font: 'font-sans'
  }
]

const FullPageScrollytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')

  // Map slides to sections for header
  const getSectionFromSlide = (slideIndex: number) => {
    if (slideIndex === 0) return 'home'
    if (slideIndex >= 1 && slideIndex <= 5) return 'definitions'  // WELL DEFINED, BLACK, QUEER, MALE, OUT
    if (slideIndex === 6) return 'lessons'  // prose section
    if (slideIndex === 7) return 'projects'
    if (slideIndex >= 8 && slideIndex <= 11) return 'lessons' // lesson slides
    if (slideIndex === 12) return 'lessons' // engagement
    if (slideIndex === 13) return 'lessons' // futures
    if (slideIndex === 14) return 'quiz'
    if (slideIndex === 15) return 'quiz' // connect
    return 'home'
  }

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Full page snap scrolling
      slides.forEach((slide, index) => {
        const slideElement = `.slide-${index}`
        
        ScrollTrigger.create({
          trigger: slideElement,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => {
            setCurrentSlide(index)
            setCurrentSection(getSectionFromSlide(index))
            // Trigger slide-specific animations
            triggerSlideAnimations(index)
          },
          onEnterBack: () => {
            setCurrentSlide(index)
            setCurrentSection(getSectionFromSlide(index))
            triggerSlideAnimations(index)
          }
        })

        // Parallax background effects - only if slide has background image
        if (slide.bgImage) {
          gsap.to(`${slideElement} .bg-image`, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: slideElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const triggerSlideAnimations = (slideIndex: number) => {
    const slide = slides[slideIndex]
    const slideElement = `.slide-${slideIndex}`

    // Subtle glitch effect that preserves legibility
    if (slideIndex === 2 || slideIndex === 4) { // BLACK and MALE slides
      gsap.to(`${slideElement} .glitch-text`, {
        textShadow: '2px 0 #ff0000, -2px 0 #00ff00',
        duration: 0.05,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        delay: 0.5
      })
    }

    // Text overflow effects - only animate if elements exist
    const overflowElements = document.querySelectorAll(`${slideElement} .overflow-text`)
    if (overflowElements.length > 0) {
      gsap.from(`${slideElement} .overflow-text`, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      })
    }
  }

  const scrollToSlide = (slideIndex: number) => {
    if (isScrolling) return
    
    setIsScrolling(true)
    const slideElement = document.querySelector(`.slide-${slideIndex}`)
    
    if (slideElement) {
      gsap.to(window, {
        scrollTo: { y: slideElement, offsetY: 0 },
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => setIsScrolling(false)
      })
    }
  }

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length
    scrollToSlide(next)
  }

  const prevSlide = () => {
    const prev = (currentSlide - 1 + slides.length) % slides.length
    scrollToSlide(prev)
  }

  return (
    <>
      <StickyNavigation />
      
      <RemoteControl 
        onNavigate={scrollToSlide}
        currentSlide={currentSlide}
        totalSlides={slides.length}
      />
      
      {/* BLKOUT Pride 2025 Logo Header */}
      <div className="bg-black py-8 relative z-50">
        <div className="flex justify-center">
          <img 
            src="/images/BLKOUTpride2025.png" 
            alt="BLKOUT Pride 2025" 
            className="w-1/3 max-w-md h-auto"
          />
        </div>
      </div>

      <div ref={containerRef} className="relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-${index} relative h-screen flex items-center justify-center overflow-hidden glitch-trigger`}
            style={{
              backgroundColor: '#000000'
            }}
          >
            
            {/* Background Image */}
            {slide.bgImage && (
              <div 
                className="bg-image absolute inset-0"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  backgroundSize: slide.type === 'definition' ? 'contain' : 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: slide.type === 'definition' 
                    ? 'brightness(1.0) contrast(1.05) saturate(1.1)' 
                    : 'contrast(1.3) brightness(1.1) saturate(1.4)',
                  opacity: slide.type === 'definition' ? 1.0 : 0.95,
                  mixBlendMode: slide.type === 'definition' ? 'normal' : 'multiply',
                  border: 'none'
                }}
              />
            )}



            {/* Reduced overlay for better image visibility - skip for definition slides */}
            {slide.bgImage && slide.type !== 'definition' && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
            )}
            
            {/* Additional Image Overlay for Eclectic Effect - skip for definition slides */}
            {slide.bgImage && index > 3 && slide.type !== 'definition' && (
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url(/images/blkoutrainbowbackground.png)`,
                  backgroundSize: '50%',
                  backgroundRepeat: 'repeat',
                  mixBlendMode: 'screen',
                  animation: 'drift 15s linear infinite'
                }}
              />
            )}

            {/* VHS Overlay - skip for definition slides */}
            {slide.type !== 'definition' && (
              <div className="vhs-lines absolute inset-0 opacity-20" />
            )}

            {/* Video Slide - Full Width */}
            {slide.type === 'video' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 z-10"
              >

                {/* Full-width Welcome Video */}
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    filter: 'brightness(1.0) contrast(1.05) saturate(1.1)'
                  }}
                >
                  <source src="/images/Welcome Vid Final.webm" type="video/webm" />
                  <source src="/Welcomevid.webm" type="video/webm" />
                  <source src="/FIST RETURNS.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Hidden text for accessibility */}
                <div className="sr-only">
                  <h1>Welcome Video</h1>
                </div>
              </motion.div>
            )}

            {/* Definition Slide - Pure Image Display */}
            {slide.type === 'definition' && (
              <div className="sr-only">
                <span>{slide.title}</span>
              </div>
            )}

            {/* Fist Formation Slide - Cards to Fist Animation */}
            {slide.type === 'fist-formation' && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: false }}
                className="absolute inset-0 z-10"
              >
                {/* Background Video */}
                {slide.bgVideo && (
                  <video
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={slide.bgVideo} type="video/mp4" />
                  </video>
                )}

                {/* Cards Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Initial: Horizontal Scroll Layout */}
                  <div className="cards-container flex space-x-8 overflow-x-auto no-scrollbar">
                    {slide.cards?.map((card: any, cardIndex: number) => (
                      <motion.div
                        key={card.id}
                        className="card flex-shrink-0 w-64 h-80 rounded-lg p-6 text-white relative overflow-hidden"
                        style={{ backgroundColor: card.color }}
                        initial={{ x: 0, y: 0, rotate: 0 }}
                        whileInView={{
                          x: getFistPosition(cardIndex).x,
                          y: getFistPosition(cardIndex).y,
                          rotate: getFistPosition(cardIndex).rotation,
                          scale: 0.8
                        }}
                        transition={{
                          delay: cardIndex * 0.3,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                        viewport={{ once: false }}
                      >
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold mb-4">{card.project}</h3>
                          <p className="text-sm opacity-90">{card.story}</p>
                        </div>
                        
                        {/* Card gradient overlay */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `linear-gradient(135deg, ${card.color}, transparent)`
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hidden text for accessibility */}
                <div className="sr-only">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                </div>
              </motion.div>
            )}

            {/* Content - Skip for definition slides as they're pure images */}
            {slide.type !== 'definition' && slide.type !== 'video' && slide.type !== 'fist-formation' && (
              <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 text-center ${slide.font}`}>
              {slide.type === 'prose' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                      {typeof slide.content === 'string' && slide.content.split('\n\n').map((paragraph: string, index: number) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: index * 0.3 }}
                          viewport={{ once: false }}
                          className="text-base md:text-lg text-gray-100 leading-relaxed mb-6 last:mb-0"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : slide.type === 'projects' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="space-y-8"
                >
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  {/* Horizontal scrolling projects */}
                  <div className="relative">
                    <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6 px-6" style={{ scrollSnapType: 'x mandatory' }}>
                      {slide.projects?.map((project: any, projectIndex: number) => (
                        <motion.div
                          key={project.name}
                          initial={{ opacity: 0, x: 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: projectIndex * 0.1 }}
                          viewport={{ once: false }}
                          className="flex-shrink-0 w-72 h-40 bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 border border-white/20 backdrop-blur-sm"
                          style={{ scrollSnapAlign: 'center' }}
                        >
                          <h3 className="text-xl font-bold text-white mb-3 font-mono uppercase tracking-wider">
                            {project.name}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {project.description}
                          </p>
                          <div className="mt-4 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-400 font-mono">ACTIVE</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Scroll indicator */}
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-400 font-mono">← SCROLL TO EXPLORE →</p>
                    </div>
                  </div>
                </motion.div>
              ) : slide.type === 'lesson' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  {/* Ancestor Quote */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: false }}
                    className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-lg p-8 border border-white/30 mb-8"
                  >
                    <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed mb-4">
                      "{slide.quote}"
                    </p>
                    <div className="text-right">
                      <span className="text-sm text-gray-300 font-mono uppercase tracking-wider">
                        — Our Ancestors
                      </span>
                    </div>
                  </motion.div>

                  {/* Lesson Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: false }}
                    className="bg-black/60 backdrop-blur-sm rounded-lg p-8 border border-white/20"
                  >
                    {typeof slide.content === 'string' && slide.content.split('\n\n').map((paragraph: string, index: number) => (
                      <p
                        key={index}
                        className="text-base md:text-lg text-gray-100 leading-relaxed mb-4 last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                </motion.div>
              ) : slide.type === 'engagement' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-gradient-to-br from-blkout-deep/80 to-blkout-accent/80 backdrop-blur-sm rounded-lg p-8 border border-white/30">
                      {typeof slide.content === 'string' && slide.content.split('\n\n').map((paragraph: string, index: number) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: index * 0.3 }}
                          viewport={{ once: false }}
                          className="text-base md:text-lg text-white leading-relaxed mb-6 last:mb-0 font-medium"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : slide.type === 'quiz' ? (
                <QuizComponent slide={slide} />
              ) : slide.type === 'connect' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="max-w-6xl mx-auto space-y-12"
                >
                  <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono mb-4">
                      {slide.subtitle}
                    </p>
                    <p className="text-xl text-gray-200 italic">
                      {typeof slide.content === 'string' ? slide.content : ''}
                    </p>
                  </div>
                  
                  {/* Connection Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {slide.sections?.map((section: any, index: number) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        viewport={{ once: false }}
                        className={`relative p-8 rounded-lg border backdrop-blur-sm transition-all hover:scale-105 ${
                          section.highlight 
                            ? 'bg-gradient-to-br from-blkout-primary/20 to-blkout-warm/20 border-blkout-primary/50 shadow-lg shadow-blkout-primary/20' 
                            : 'bg-gray-900/40 border-white/20 hover:border-white/40'
                        }`}
                      >
                        {section.highlight && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blkout-primary text-white px-4 py-1 rounded-full text-sm font-mono uppercase tracking-wider">
                              Priority Access
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center space-y-4">
                          <h3 className="text-2xl font-bold text-white">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-300 uppercase tracking-wider font-mono">
                            {section.subtitle}
                          </p>
                          <p className="text-gray-200 leading-relaxed">
                            {section.description}
                          </p>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold transition-all ${
                              section.highlight
                                ? 'bg-blkout-primary hover:bg-blkout-warm text-white shadow-lg'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                            }`}
                          >
                            {section.action}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Footer Message */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: false }}
                    className="text-center mt-16"
                  >
                    <p className="text-gray-300 italic">
                      "The door is open. The work is waiting. The future is calling."
                    </p>
                    <p className="text-sm text-gray-400 font-mono mt-2 uppercase tracking-wider">
                      Choose your path forward
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="space-y-8"
                >
                  <h1 className="glitch-text text-6xl md:text-8xl font-bold text-white" data-text={slide.title}>
                    {slide.title}
                  </h1>
                  <p className="pixel-text text-2xl md:text-3xl text-green-400">
                    {slide.subtitle}
                  </p>
                  <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                    {typeof slide.content === 'string' ? slide.content : ''}
                  </p>
                </motion.div>
              )}
              </div>
            )}

            {/* Slide Navigation */}
            {index < slides.length - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                onClick={nextSlide}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-20"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </motion.button>
            )}
          </div>
        ))}

        {/* Slide Indicator */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations for Effects */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: scale(1.05) rotate(-1.5deg) translateY(0px); }
          50% { transform: scale(1.08) rotate(-2deg) translateY(-10px); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: scale(1.07) rotate(1deg) translateX(0px); }
          50% { transform: scale(1.04) rotate(1.5deg) translateX(5px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: scale(1.06) rotate(-0.5deg) translateY(0px) translateX(0px); }
          33% { transform: scale(1.09) rotate(0deg) translateY(-5px) translateX(3px); }
          66% { transform: scale(1.03) rotate(-1deg) translateY(5px) translateX(-3px); }
        }
        
        @keyframes drift {
          0% { transform: translateX(-100%) translateY(0%); }
          25% { transform: translateX(100%) translateY(-20%); }
          50% { transform: translateX(-50%) translateY(20%); }
          75% { transform: translateX(80%) translateY(-10%); }
          100% { transform: translateX(-100%) translateY(0%); }
        }

        /* Subtle glitch effect that preserves legibility */
        .glitch-text {
          position: relative;
        }
        
        .glitch-text::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: #ff0000;
          opacity: 0;
          animation: glitch-1 0.3s ease-in-out infinite alternate;
        }
        
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: #00ff00;
          opacity: 0;
          animation: glitch-2 0.3s ease-in-out infinite alternate;
        }
        
        @keyframes glitch-1 {
          0% { transform: translateX(0); opacity: 0; }
          10% { transform: translateX(-2px); opacity: 0.1; }
          20% { transform: translateX(2px); opacity: 0; }
          100% { transform: translateX(0); opacity: 0; }
        }
        
        @keyframes glitch-2 {
          0% { transform: translateX(0); opacity: 0; }
          15% { transform: translateX(2px); opacity: 0.1; }
          25% { transform: translateX(-2px); opacity: 0; }
          100% { transform: translateX(0); opacity: 0; }
        }

        /* Pixel text effect */
        .pixel-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Broken box effect */
        .broken-box {
          border: 2px solid #fff;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .broken-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.1) 10px,
            rgba(255, 255, 255, 0.1) 20px
          );
        }

        /* VHS lines effect */
        .vhs-lines {
          position: relative;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          );
        }

        /* Hide scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

export default FullPageScrollytelling