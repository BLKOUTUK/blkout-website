import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, ChevronUp } from 'lucide-react'
import StickyNavigation from './StickyNavigation'
import RemoteControl from './RemoteControl'
import WelcomeVideo from './WelcomeVideo'
import CommunityEmailCapture from './CommunityEmailCapture'
import BLKOUTHUBAccessRequest from './BLKOUTHUBAccessRequest'
import InteractiveRevelation from './InteractiveRevelation'
import EnhancedQuiz from './EnhancedQuiz'
import FakeQuizPopup from './FakeQuizPopup'
import IVORShowcase from './IVORShowcase'

gsap.registerPlugin(ScrollTrigger)

// Lesson Card Component
const LessonCard: React.FC<{ lesson: any; index: number; totalLessons: number }> = ({ lesson, index, totalLessons }) => {
  const [showResponse, setShowResponse] = React.useState(false);
  const [hasBeenRevealed, setHasBeenRevealed] = React.useState(false);

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: false, margin: "-100px" }}
      className="flex-shrink-0 w-80 md:w-96"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Lesson Card */}
      <div className={`relative h-full bg-gradient-to-br ${lesson.colorTheme} rounded-2xl overflow-hidden shadow-2xl`}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-black/20 via-transparent to-white/20" />
        
        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Lesson Header */}
          <div className="mb-6">
            <h3 className={`text-2xl md:text-3xl font-bold ${lesson.textColor} mb-2`}>
              {lesson.title}
            </h3>
            <p className={`text-sm ${lesson.textColor} opacity-80 uppercase tracking-wider font-mono`}>
              {lesson.subtitle}
            </p>
          </div>

          {/* Quote Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl opacity-60">❝</div>
              <div className="flex-1">
                <p className={`text-lg ${lesson.textColor} font-serif italic leading-relaxed mb-4`}>
                  {lesson.quote}
                </p>
                <div className="text-right">
                  <span className={`text-sm ${lesson.textColor} opacity-80 font-mono uppercase tracking-wider`}>
                    — {lesson.author}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Response Reveal Interface */}
          <div className="flex-1 relative">
            {!showResponse ? (
              /* Reveal Trigger */
              <motion.div
                className="h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl border border-white/30 cursor-pointer"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowResponse(true);
                  setHasBeenRevealed(true);
                }}
              >
                <div className="text-center p-8">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`text-4xl ${lesson.textColor} mb-4`}
                  >
                    💭
                  </motion.div>
                  <p className={`text-lg ${lesson.textColor} font-medium mb-2`}>
                    Our Response
                  </p>
                  <p className={`text-sm ${lesson.textColor} opacity-70 font-mono uppercase tracking-wider`}>
                    Tap to Reveal
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Revealed Response Content */
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="h-full bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/30 relative overflow-hidden"
              >
                {/* Success animation overlay */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-white rounded-xl"
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm ${lesson.textColor} opacity-80 font-mono uppercase tracking-wider`}>
                      Community Response
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowResponse(false)}
                      className={`text-xs ${lesson.textColor} opacity-60 hover:opacity-100 transition-opacity`}
                    >
                      ✕
                    </motion.button>
                  </div>
                  
                  <div className="space-y-4">
                    {lesson.content.split('\n\n').map((paragraph: string, pIndex: number) => (
                      <motion.p
                        key={pIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5,
                          delay: pIndex * 0.2
                        }}
                        className={`text-base ${lesson.textColor} leading-relaxed`}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Progress Indicator with Reveal Status */}
          <div className="mt-6 flex justify-center items-center gap-3">
            <div className={`w-8 h-1 bg-white/30 rounded-full`}>
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
  );
};

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
          *Spoiler alert: Everyone&apos;s welcome here
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
    bgImage: '/images/black2.png',
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
    bgImage: '/images/queer2.png',
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
    bgImage: '/images/men2.png',
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
    bgImage: '/images/out2.png',
    font: 'font-serif'
  },
  {
    id: 'liberation-image',
    type: 'definition',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    bgImage: '/images/LIBERATION.png',
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
        options: [
          "☀️ Sunny",
          "⛈️ Stormy", 
          "🌧️ Rainy",
          "🤷🏾‍♂️ Don't notice"
        ]
      },
      {
        question: "Dream dinner guest?",
        options: [
          "👵🏾 Grandmother",
          "👑 Beyoncé",
          "✍🏾 James Baldwin",
          "💙 Rhyeim"
        ]
      },
      {
        question: "Ideal Friday night?",
        options: [
          "🏠 House party",
          "🛋️ Musical theatre",
          "💃🏾 Sex party",
          "🎨 Cross-stitch"
        ]
      }
    ],
    results: {
      welcome: {
        title: "CONGRATULATIONS! You passed!",
        message: "Plot twist: There was never a test. Identity is liberation, not prison. Difference creates dialogue, not division. Black queer men belong here. You are ready to build power."
      }
    },
    bgImage: null,
    font: 'font-serif'
  },
  {
    id: 'story-powered-video',
    type: 'video',
    videoUrl: '/images/projectsnxt.webm',
    autoplay: true,
    font: 'font-sans'
  },
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
        content: `We understand that you've carried burdens that weren't yours to bear. Our innovation lies in creating new pathways to healing—not just individual therapy, but collective care systems that honor both struggle and triumph. 

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
        content: `We know you've tried to succeed within systems that were never designed for your liberation. Our innovation is creating entirely new frameworks—cooperative ownership, community-led decision making, mutual aid networks.

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

The reward? The profound relief of being known and loved for exactly who you are, not who you pretend to be.`,
        colorTheme: 'from-yellow-500 to-yellow-700',
        textColor: 'text-yellow-100'
      },
      {
        id: 'lesson4',
        title: 'UNAPOLOGETIC BECOMING',
        subtitle: 'TEMPLES FOR TOMORROW',
        quote: 'We now intend to express our dark-skinned selves without fear or shame... we build our temples for tomorrow, strong as we know how, and we stand on top of the mountain, free within ourselves.',
        author: 'Langston Hughes',
        content: `We see you claiming your space, your voice, your right to exist boldly. Our innovation is amplifying that courage through collective power and shared resources.

The reward? A legacy of liberation that extends far beyond your individual journey, creating mountains of freedom for generations to come.`,
        colorTheme: 'from-green-500 to-green-700',
        textColor: 'text-green-100'
      }
    ],
    font: 'font-sans'
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
    colorTheme: 'from-blue-500 to-blue-700',
    textColor: 'text-blue-100',
    font: 'font-sans'
  },
  {
    id: 'future-visioning',
    type: 'visioning-bridge',
    title: 'CLOSE YOUR EYES. IMAGINE...',
    subtitle: 'WHAT COULD WE BUILD TOGETHER?',
    content: 'In your mind, step into a future where Black queer men have everything we need to thrive. What do you see? What feels possible when we work together?',
    bgImage: '/images/imagine.png',
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
    bgImage: '/images/welldef2.png',
    font: 'font-serif'
  },
  {
    id: 'build-wealth',
    type: 'revelation',
    title: 'WHAT IF WE BUILT WEALTH TOGETHER?',
    subtitle: '',
    content: [
      { text: 'Community ownership, cooperative economics.', style: 'text-3xl text-white mb-8' },
      { text: 'Resources controlled by us. From health to culture, housing to tech.', style: 'text-2xl text-gray-300 mb-12' },
      { text: 'Liberation plus financial independence.', style: 'text-4xl text-blkout-secondary font-bold' }
    ],
    bgImage: '/images/cooperative-wealth.png',
    font: 'font-serif'
  },
  {
    id: 'liberation-legacy',
    type: 'revelation',
    title: 'WHAT IF WE MOVED BEYOND VISIBILITY TO SOLIDARITY?',
    subtitle: '',
    content: [
      { text: 'Building what we need over time.', style: 'text-3xl text-white mb-8' },
      { text: 'Cathedral-building legacy. Trusting each other not to blow it all on a one-day party.', style: 'text-2xl text-gray-300 mb-12' },
      { text: 'The revolution is cooperative. Raise your voice.', style: 'text-4xl text-blkout-accent font-bold' }
    ],
    bgImage: '/images/liberation.png',
    font: 'font-serif'
  },
  {
    id: 'pathway-discovery',
    type: 'pathway-quiz',
    title: 'DISCOVER YOUR LIBERATION PATHWAY',
    subtitle: 'FIND YOUR ROLE IN THE MOVEMENT',
    content: 'Now that you\'ve explored what\'s possible, let\'s get curious about how you want to contribute to our collective liberation.',
    bgImage: '/images/BLKOUTpride2025.png',
    font: 'font-serif'
  },
  {
    id: 'meet-ivor',
    type: 'ivor-introduction',
    title: 'MEET IVOR',
    subtitle: 'YOUR COMMUNITY INTELLIGENCE',
    content: 'Based on your vision choices and pathway, I\'ve been preparing personalized support for your liberation journey.',
    bgImage: '/images/projects%20name%20morph%204.png',
    font: 'font-serif'
  },
  {
    id: 'ivor-showcase',
    type: 'ivor-demo',
    title: 'IVOR IN ACTION',
    subtitle: 'PERSONALIZED COMMUNITY INTELLIGENCE',
    content: 'Here\'s what I found for you this week, based on your interests and pathway.',
    bgImage: '/images/projects%20name%20morph%204.png',
    font: 'font-serif'
  },
  {
    id: 'connect',
    type: 'connect',
    title: 'READY FOR FULL ACCESS?',
    subtitle: 'JOIN THE MOVEMENT',
    content: 'You&apos;ve seen what IVOR can do. Want weekly personalized intelligence, real community support, and collective action opportunities?',
    sections: [
      {
        title: 'BLKOUTHUB',
        subtitle: 'For Black Queer Men',
        description: 'Full access to IVOR, community support, and collective action. Your liberation journey starts here.',
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
    bgImage: '/images/welldef2.png',
    font: 'font-sans'
  }
]

const FullPageScrollytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
  const [showFakeQuiz, setShowFakeQuiz] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [slowConnection, setSlowConnection] = useState(false)
  const [userPathway, setUserPathway] = useState<string>('connector')
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userVisions, setUserVisions] = useState<string[]>([])
  const [allUserData, setAllUserData] = useState<{
    visions: string[]
    pathway: string
    quizCompleted: boolean
  }>({
    visions: [],
    pathway: 'connector',
    quizCompleted: false
  })

  // Detect user preferences for reduced motion and slow connections
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(prefersReducedMotion.matches)

    // Detect slow connection
    const connection = (navigator as any).connection
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
      setSlowConnection(isSlowConnection)
    }
  }, [])

  // Map slides to sections for header
  const getSectionFromSlide = (slideIndex: number) => {
    if (slideIndex === 0) return 'home'
    if (slideIndex >= 1 && slideIndex <= 5) return 'definitions'  // WELL DEFINED, BLACK, QUEER, MALE, OUT
    if (slideIndex === 6) return 'lessons'  // liberation-image 
    if (slideIndex === 7) return 'lessons'  // fake-quiz-trigger
    if (slideIndex === 8) return 'lessons'  // story-powered-video
    if (slideIndex === 9) return 'lessons'  // lessons-horizontal
    if (slideIndex === 10) return 'lessons' // engagement
    if (slideIndex === 11) return 'lessons' // future-visioning bridge
    if (slideIndex >= 12 && slideIndex <= 14) return 'visions' // revelation trilogy
    if (slideIndex === 15) return 'quiz' // pathway-discovery
    if (slideIndex === 16) return 'ivor' // meet-ivor
    if (slideIndex === 17) return 'ivor' // ivor-showcase
    if (slideIndex === 18) return 'connect' // connect
    return 'home'
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Spacebar
          e.preventDefault()
          nextSlide()
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          prevSlide()
          break
        case 'Home':
          e.preventDefault()
          scrollToSlide(0)
          break
        case 'End':
          e.preventDefault()
          scrollToSlide(slides.length - 1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

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

    return () => {
      ctx.revert()
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSlide])

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
    <div className="w-full overflow-x-hidden">
      <StickyNavigation />
      
      <RemoteControl 
        onNavigate={scrollToSlide}
        currentSlide={currentSlide}
        totalSlides={slides.length}
      />
      
      {/* BLKOUT Pride 2025 Logo Header */}
      <div className="bg-black py-8 relative z-50 w-full">
        <div className="flex justify-center px-4">
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
            className={`slide-${index} relative w-full h-screen flex items-center justify-center overflow-hidden glitch-trigger`}
            style={{
              backgroundColor: '#000000',
              minHeight: '100vh'
            }}
          >
            
            {/* Enhanced Progress Indicator with Section Context */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 left-4 z-50 bg-gradient-to-r from-black/90 to-black/70 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30 shadow-lg"
              role="status"
              aria-label={`Slide ${index + 1} of ${slides.length}: ${getSectionFromSlide(index)}`}
            >
              <div className="text-white text-sm font-mono flex items-center gap-3">
                {/* Slide counter with visual emphasis */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blkout-primary to-blkout-secondary flex items-center justify-center">
                    <span className="text-black font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className="text-gray-400 text-xs">of {slides.length}</span>
                </div>
                
                {/* Section labels with icons and descriptions */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                  <span className="text-xs">
                    {index === 0 && "🏠"}
                    {index >= 1 && index <= 6 && "📖"}
                    {index === 7 && "❓"}
                    {index === 8 && "🎬"}
                    {index >= 9 && index <= 13 && "📚"}
                    {index >= 14 && index <= 18 && "💡"}
                    {index >= 19 && index <= 21 && "🔮"}
                    {index >= 22 && index <= 25 && "🤝"}
                  </span>
                  <span className="text-xs text-blkout-accent font-semibold uppercase tracking-wider">
                    {index === 0 && "Welcome"}
                    {index >= 1 && index <= 6 && "Definitions"}
                    {index === 7 && "Entry Quiz"}
                    {index === 8 && "Our Projects"}
                    {index >= 9 && index <= 13 && "Liberation Lessons"}
                    {index >= 14 && index <= 18 && "Future Visions"}
                    {index >= 19 && index <= 21 && "Community Future"}
                    {index >= 22 && index <= 25 && "Join Movement"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Journey Progress Bar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 z-50 w-56 bg-gradient-to-r from-black/90 to-black/70 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg"
              role="progressbar"
              aria-valuenow={index}
              aria-valuemin={0}
              aria-valuemax={slides.length - 1}
              aria-label={`Liberation journey progress: ${Math.round((index / (slides.length - 1)) * 100)}% complete`}
            >
              <div className="flex justify-between text-xs text-gray-300 mb-3">
                <span className="font-medium">Liberation Journey</span>
                <div className="flex items-center gap-2">
                  <span className="text-blkout-accent font-bold">{Math.round((index / (slides.length - 1)) * 100)}%</span>
                  <span className="text-[10px] opacity-60">COMPLETE</span>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full" />
                
                {/* Progress gradient with animation */}
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blkout-primary via-blkout-secondary to-blkout-accent rounded-full shadow-md"
                  initial={{ width: 0 }}
                  animate={{ width: `${(index / (slides.length - 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-30" />
              </div>
              
              {/* Milestone indicators */}
              <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                <span className={index >= 0 ? "text-blkout-primary" : ""}>START</span>
                <span className={index >= slides.length * 0.25 ? "text-blkout-secondary" : ""}>¼</span>
                <span className={index >= slides.length * 0.5 ? "text-blkout-accent" : ""}>½</span>
                <span className={index >= slides.length * 0.75 ? "text-blkout-warm" : ""}>¾</span>
                <span className={index >= slides.length - 1 ? "text-blkout-primary font-bold" : ""}>CONNECT</span>
              </div>
            </motion.div>
            
            {/* Background Image */}
            {slide.bgImage && (
              <div 
                className={`bg-image absolute ${slide.type === 'definition' ? 'inset-4 sm:inset-8 lg:inset-12' : 'inset-0'}`}
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  backgroundSize: slide.type === 'definition' ? 'contain' : 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'brightness(1.0) contrast(1.05) saturate(1.1)',
                  opacity: 1.0,
                  mixBlendMode: 'normal',
                  border: 'none'
                }}
              />
            )}



            {/* Reduced overlay for better image visibility */}
            {slide.bgImage && slide.type !== 'video' && slide.type !== 'definition' && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
            )}
            
            {/* Additional Image Overlay for Eclectic Effect */}
            {slide.bgImage && index > 3 && slide.type !== 'video' && slide.type !== 'definition' && (
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url(/images/blkoutrainbowbackground.png)`,
                  backgroundSize: '50%',
                  backgroundRepeat: 'repeat',
                  mixBlendMode: 'screen'
                }}
              />
            )}

            {/* VHS Overlay */}
            {slide.type !== 'video' && slide.type !== 'definition' && (
              <div className="vhs-lines absolute inset-0 opacity-20" />
            )}

            {/* Video Slide - Full Width */}
            {slide.type === 'video' && (
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={reducedMotion ? { duration: 0.2 } : { duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 z-10"
              >

                {/* Full-width Welcome Video */}
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay={!slowConnection}
                  muted
                  loop={!slowConnection}
                  playsInline
                  style={{
                    filter: 'brightness(1.0) contrast(1.05) saturate(1.1)'
                  }}
                  aria-label="Welcome video showcasing BLKOUT community"
                  preload={slowConnection ? "none" : "metadata"}
                  controls={slowConnection}
                >
                  <source src={slide.videoUrl || "/images/welcomevidfinal.webm"} type="video/webm" />
                  <p>Your browser does not support the video tag. This video shows the welcome message for the BLKOUT UK community platform.</p>
                </video>
                
                {/* Low bandwidth fallback */}
                {slowConnection && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                    <div className="text-center text-white p-8">
                      <h2 className="text-2xl font-bold mb-4">Welcome to BLKOUT UK</h2>
                      <p className="text-lg mb-4">Building Black queer liberation through community power</p>
                      <button 
                        onClick={(e) => {
                          const video = e.currentTarget.parentElement?.parentElement?.querySelector('video')
                          if (video) {
                            video.play()
                            e.currentTarget.parentElement!.style.display = 'none'
                          }
                        }}
                        className="bg-blkout-primary px-6 py-3 rounded-lg font-semibold"
                      >
                        Play Video
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Hidden text for accessibility */}
                <div className="sr-only">
                  <h1>Welcome Video</h1>
                </div>
              </motion.div>
            )}

            {/* Definition Slides - Enhanced Image Display with Better UX */}
            {slide.type === 'definition' && slide.bgImage && (
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={reducedMotion ? { duration: 0.2 } : { duration: 1.2, ease: "easeOut" }}
                viewport={{ once: false }}
                className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-8 lg:p-12"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={slide.bgImage} 
                    alt={`${slide.title}: Visual representation of the concept with artistic typography and design elements`}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    style={{ 
                      filter: 'brightness(1.05) contrast(1.1) saturate(1.15)',
                      minHeight: '70vh',
                      maxHeight: '85vh'
                    }}
                    loading={index <= currentSlide + 1 ? "eager" : "lazy"}
                    onError={(e) => {
                      console.error(`Failed to load definition image: ${slide.bgImage}`);
                      // Show fallback text instead of hiding
                      const fallback = document.createElement('div')
                      fallback.className = 'text-white text-4xl font-bold text-center p-8'
                      fallback.textContent = slide.title || 'Content Loading...'
                      e.currentTarget.parentElement?.appendChild(fallback)
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Subtle title overlay for context */}
                  <div className="absolute bottom-8 left-8 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <h2 className="text-white text-sm font-mono uppercase tracking-wider opacity-80">
                      {slide.title}
                    </h2>
                  </div>
                </div>
                
                <div className="sr-only">
                  <span>{slide.title}: {slide.subtitle}</span>
                </div>
              </motion.div>
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
                {/* Note: Background video and cards features removed for type safety */}
                
                {/* Cards Container - Disabled for type safety */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-lg">{slide.subtitle}</p>
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
              <div className={`relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 py-8 text-center ${slide.font}`}>
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
              ) : slide.type === 'lesson' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  viewport={{ once: false }}
                  className="max-w-6xl mx-auto space-y-16 px-4"
                >
                  {/* Enhanced Header Section */}
                  <div className="text-center mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: false }}
                      className="mb-6"
                    >
                      <div className="inline-block bg-gradient-to-r from-blkout-primary to-blkout-secondary rounded-full px-6 py-2 mb-4">
                        <span className="text-black font-mono text-sm uppercase tracking-widest font-bold">
                          Liberation Lesson
                        </span>
                      </div>
                    </motion.div>
                    
                    <motion.h1 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.4 }}
                      viewport={{ once: false }}
                      className="text-4xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blkout-accent to-white bg-clip-text text-transparent"
                    >
                      {slide.title}
                    </motion.h1>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: false }}
                      className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono"
                    >
                      {slide.subtitle}
                    </motion.p>
                  </div>
                  
                  {/* Interactive Ancestor Quote */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: false }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl rounded-2xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative bg-gradient-to-r from-purple-900/70 to-blue-900/70 backdrop-blur-sm rounded-2xl p-10 border border-white/30 group-hover:border-white/50 transition-all duration-300">
                      <div className="flex items-start gap-6">
                        <div className="text-6xl opacity-30">❝</div>
                        <div className="flex-1">
                          <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed mb-6">
                            {('quote' in slide && typeof slide.quote === 'string') ? slide.quote : ''}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-right">
                              <span className="text-sm text-gray-300 font-mono uppercase tracking-wider">
                                — Our Ancestors
                              </span>
                            </div>
                            <div className="text-blkout-accent opacity-60 group-hover:opacity-100 transition-opacity">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Lesson Content with Reading Progress */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: false }}
                    className="relative"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-10 border border-white/20 relative overflow-hidden">
                      {/* Reading Progress Indicator */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blkout-primary via-blkout-secondary to-blkout-accent opacity-30" />
                      
                      <div className="space-y-6">
                        {typeof slide.content === 'string' && slide.content.split('\n\n').map((paragraph: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: false, margin: "-50px" }}
                            className="group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-2 h-2 rounded-full bg-blkout-accent mt-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                              <p className="text-base md:text-lg text-gray-100 leading-relaxed group-hover:text-white transition-colors">
                                {paragraph}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Subtle decoration */}
                      <div className="absolute bottom-4 right-6 opacity-10">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : slide.type === 'engagement' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="w-full h-full min-h-screen flex flex-col justify-center max-w-5xl mx-auto space-y-12 px-4 pt-32 pb-12"
                >
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: false }}
                      className="mb-6"
                    >
                      <div className="inline-block bg-gradient-to-r from-blue-400 to-blue-600 rounded-full px-8 py-3 mb-6">
                        <span className="text-white font-mono text-sm uppercase tracking-widest font-bold">
                          The Call to Action
                        </span>
                      </div>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-200 uppercase tracking-wider font-mono">
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className={`relative bg-gradient-to-br ${'colorTheme' in slide ? slide.colorTheme : 'from-blue-500 to-blue-700'} backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-300/30 shadow-2xl`}>
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-black/20 via-transparent to-white/20 rounded-2xl" />
                      
                      <div className="relative z-10 space-y-6">
                        {typeof slide.content === 'string' && slide.content.split('\n\n').map((paragraph: string, index: number) => (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: false }}
                            className={`text-lg md:text-xl ${'textColor' in slide ? slide.textColor : 'text-blue-100'} leading-relaxed font-medium`}
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                        
                        {/* Call to Action Enhancement */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          viewport={{ once: false }}
                          className="mt-8 pt-8 border-t border-blue-300/30"
                        >
                          <div className="text-center">
                            <motion.div
                              animate={{ 
                                y: [0, -5, 0],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="text-4xl mb-4"
                            >
                              🤝
                            </motion.div>
                            <p className={`text-sm ${'textColor' in slide ? slide.textColor : 'text-blue-100'} opacity-80 font-mono uppercase tracking-wider`}>
                              Ready to Answer the Call?
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : slide.type === 'lessons-horizontal' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="w-full h-full relative"
                >
                  {/* Section Header */}
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: false }}
                      className="mb-6"
                    >
                      <div className="inline-block bg-gradient-to-r from-white to-gray-300 rounded-full px-8 py-3 mb-6">
                        <span className="text-black font-mono text-sm uppercase tracking-widest font-bold">
                          Ancestral Wisdom
                        </span>
                      </div>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Horizontal Scrolling Cards */}
                  <div className="relative w-full overflow-hidden">
                    <motion.div
                      className="flex gap-8 pb-8 px-4 overflow-x-auto no-scrollbar"
                      style={{ scrollSnapType: 'x mandatory' }}
                    >
                      {'lessons' in slide && Array.isArray(slide.lessons) && slide.lessons.map((lesson: any, index: number) => (
                        <LessonCard 
                          key={lesson.id}
                          lesson={lesson}
                          index={index}
                          totalLessons={('lessons' in slide && Array.isArray(slide.lessons)) ? slide.lessons.length : 1}
                        />
                      ))}
                    </motion.div>
                    
                    {/* Enhanced Interactive Hints */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2, duration: 1 }}
                      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-xl px-6 py-4 text-white text-center border border-white/20"
                    >
                      <div className="space-y-3">
                        <motion.div 
                          animate={{ x: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center justify-center gap-2 text-sm"
                        >
                          <span className="font-medium">Scroll horizontally</span>
                          <span className="text-lg">👉</span>
                        </motion.div>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="flex items-center justify-center gap-2 text-xs text-gray-300"
                        >
                          <span>Tap cards to reveal responses</span>
                          <span>💭</span>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    {/* Scroll indicator dots */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {Array.from({ length: ('lessons' in slide && Array.isArray(slide.lessons)) ? slide.lessons.length : 4 }).map((_, index) => (
                        <motion.div
                          key={index}
                          animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            delay: index * 0.2,
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-2 h-2 bg-white/40 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : slide.type === 'fake-quiz-trigger' ? (
                <>
                  {/* Floating Joker Animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 0.3, scale: 1, rotate: 0 }}
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 1 }
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      backgroundImage: `url(/images/joker.png)`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '200px',
                      height: '300px',
                      zIndex: 1
                    }}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false }}
                    className="max-w-4xl mx-auto space-y-8 text-center relative z-10"
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
                    onClick={() => setShowFakeQuiz(true)}
                    className="bg-gradient-to-r from-blkout-primary to-blkout-warm px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Take The Test
                  </motion.button>
                  
                  <p className="text-sm text-gray-400 font-mono mt-4">
                    *This will only take a moment
                  </p>
                  </motion.div>
                </>
              ) : slide.type === 'pathway-quiz' ? (
                <EnhancedQuiz 
                  slide={slide} 
                  onComplete={(result) => {
                    setUserPathway(result.pathway)
                    setQuizCompleted(true)
                    setAllUserData(prev => ({
                      ...prev,
                      pathway: result.pathway,
                      quizCompleted: true
                    }))
                    console.log('Pathway discovered:', result.pathway)
                    console.log('Combined user data:', { visions: userVisions, pathway: result.pathway })
                  }}
                />
              ) : slide.type === 'visioning-bridge' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col items-center justify-center min-h-screen text-center px-4"
                >
                  {/* Text container with backdrop for legibility */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-5xl">
                    <motion.h1 
                      className="text-4xl md:text-6xl font-bold text-white mb-8"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p 
                      className="text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.p 
                      className="text-lg text-gray-200 max-w-3xl leading-relaxed mx-auto"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      {typeof slide.content === 'string' ? slide.content : ''}
                    </motion.p>
                    <motion.div 
                      className="mt-12 text-6xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.div>
                  </div>
                </motion.div>
              ) : slide.type === 'ivor-introduction' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center justify-center min-h-screen text-center px-4"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <img 
                      src="/images/Ask Ivorsolo.png" 
                      alt="IVOR"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-blkout-primary shadow-xl mx-auto mb-4"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full border-2 border-white mx-auto"
                    />
                  </motion.div>
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-300 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.p 
                    className="text-lg text-gray-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    {typeof slide.content === 'string' ? slide.content : ''}
                  </motion.p>
                  {userVisions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="mt-8 text-sm text-blkout-secondary"
                    >
                      I noticed you&apos;re interested in: {userVisions.join(', ')}
                    </motion.div>
                  )}
                </motion.div>
              ) : slide.type === 'ivor-demo' ? (
                <IVORShowcase 
                  userPathway={allUserData.pathway}
                  onSignupPrompt={() => {
                    // Scroll to community signup section
                    const element = document.querySelector('[data-slide="connect"]')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                />
              ) : slide.type === 'revelation' ? (
                <InteractiveRevelation 
                  slide={slide as any} 
                  onComplete={(selections) => {
                    const newVisions = [...userVisions, ...selections]
                    setUserVisions(newVisions)
                    setAllUserData(prev => ({
                      ...prev,
                      visions: newVisions
                    }))
                    console.log('Vision selections:', selections)
                  }}
                />
              ) : slide.type === 'connect' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: false }}
                  className="w-full max-w-4xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex flex-col justify-center"
                >
                  {/* Powerful Conversion Header */}
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
                        You&apos;ve explored the vision, discovered your pathway, met IVOR. 
                        <strong className="text-white"> Now join the movement.</strong>
                      </p>
                    </motion.div>
                  </div>

                  {/* Single Clear CTA */}
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

                  {/* Secondary Newsletter Option */}
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
              ) : (
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
        /* Hide scrollbars for horizontal scroll */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
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
      
      {/* Fake Quiz Popup */}
      <FakeQuizPopup 
        isOpen={showFakeQuiz} 
        onClose={() => setShowFakeQuiz(false)} 
      />
    </div>
  )
}

export default FullPageScrollytelling