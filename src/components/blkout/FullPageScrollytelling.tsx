import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import components from conversation logs
import CommunityEmailCapture from './CommunityEmailCapture'
import BLKOUTHUBAccessRequest from './BLKOUTHUBAccessRequest'
import EnhancedQuiz from './EnhancedQuiz'
import IVORShowcase from './IVORShowcase'
import InteractiveRevelation from './InteractiveRevelation'

gsap.registerPlugin(ScrollTrigger)

// Lesson Card Component for horizontal scrolling
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
      <div className={`relative h-full bg-gradient-to-br ${lesson.colorTheme} rounded-2xl overflow-hidden shadow-2xl`}>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-black/20 via-transparent to-white/20" />
        
        <div className="relative z-10 p-8 h-full flex flex-col">
          <div className="mb-6">
            <h3 className={`text-2xl md:text-3xl font-bold ${lesson.textColor} mb-2 heading-block`}>
              {lesson.title}
            </h3>
            <p className={`text-sm ${lesson.textColor} opacity-80 uppercase tracking-wider font-mono`}>
              {lesson.subtitle}
            </p>
          </div>

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

          <div className="flex-1 relative">
            {!showResponse ? (
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
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="h-full bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/30 relative overflow-hidden"
              >
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

interface Slide {
  id: string
  title: string
  subtitle?: string
  content?: string | React.ReactNode
  type: 'video' | 'prose' | 'lesson' | 'engagement' | 'lessons-horizontal' | 'fake-quiz-trigger' | 'pathway-quiz' | 'visioning-bridge' | 'ivor-introduction' | 'ivor-demo' | 'revelation' | 'connect' | 'definition' | 'fist-formation'
  backgroundImage?: string
  bgImage?: string
  font?: string
  videoUrl?: string
  questions?: any[]
  lessons?: any[]
}

// Perfect liberation story flow as requested
const slides = [
  // 1. Welcome video
  {
    id: 'welcome',
    type: 'video',
    title: null,
    subtitle: null,
    content: null,
    bgImage: null,
    videoUrl: '/images/squared/Finalfinalwelcome SQUARED.mp4',
    font: 'font-mono'
  },
  
  // Value Proposition Opening
  {
    id: 'value-proposition',
    type: 'prose',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'TECHNOLOGY FOR LIBERATION, NOT EXTRACTION',
    content: 'BLKOUT creates cooperative platforms where Black queer men control their stories, resources, and future. We build technology that serves community liberation over corporate profits. Join us in reimagining what digital solidarity looks like.',
    font: 'font-sans'
  },
  
  // 2-6. Definitions (Well Defined + BLACK/QUEER/MALE/OUT)
  {
    id: 'well-defined',
    type: 'definition',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: 'WELLDEF_SQUARED.png',
    font: 'font-serif'
  },
  
  // Chapter 1
  {
    id: 'chapter-1',
    type: 'chapter',
    title: '1. LIBERATION DIALOGUE: UNITY DOESN\'T MEAN UNIFORMITY',
    font: 'font-sans'
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
    bgImage: 'BlackSQUARED.png',
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
    bgImage: 'queerSQUARED.PNG',
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
    bgImage: 'menSQUARED.png',
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
    bgImage: 'outSQUARED.png',
    font: 'font-serif'
  },
  
  // 7. Liberation dialogues
  {
    id: 'liberation-image',
    type: 'definition',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    bgImage: 'liberationSQUARED.png',
    font: 'font-serif'
  },
  
  // 8. Joker quiz
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
      },
      {
        question: "Ideal Friday night?",
        options: ["🏠 House party", "🛋️ Musical theatre", "💃🏾 Sex party", "🎨 Cross-stitch"]
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
  
  // Chapter 2
  {
    id: 'chapter-2',
    type: 'chapter',
    title: '2. GOING TOGETHER: SHARING EXPERIENCES, SHARING AMBITIONS',
    font: 'font-sans'
  },
  
  // 9. Quiz response - remove duplicate, handled by fake-quiz-trigger component
  // {
  //   id: 'quiz-response',
  //   type: 'prose',
  //   title: 'CONGRATULATIONS! You passed!',
  //   subtitle: 'Plot twist: There was never a test.',
  //   content: 'Identity is liberation, not prison. Difference creates dialogue, not division. Black queer men belong here. You are ready to build power.',
  //   bgImage: '/images/joker.png',
  //   font: 'font-serif'
  // },
  
  // 10. Ancestral wisdom
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
  
  // 11. Imagine different - first of 4 revelation slides
  {
    id: 'future-visioning',
    type: 'visioning-bridge',
    title: 'IMAGINE',
    subtitle: 'WHAT COULD WE BUILD TOGETHER?',
    content: 'In your mind, step into a future where Black queer men have everything we need to thrive. What do you see? What feels possible when we work together?',
    bgImage: 'sunrise SQUARED.png',
    font: 'font-serif'
  },
  
  // 12. Second revelation slide
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
    bgImage: 'seat with baldwin SQUARED.png',
    font: 'font-serif'
  },
  
  // 13. Third revelation slide
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
    bgImage: 'capacitySQUARED.png',
    font: 'font-serif'
  },
  
  // 14. Fourth revelation slide
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
    bgImage: 'imagine SQUARED.png',
    font: 'font-serif'
  },
  
  // 15. Story powered video
  {
    id: 'story-powered-video',
    type: 'video',
    videoUrl: '/images/squared/story powered SQUARED).mp4',
    autoplay: true,
    font: 'font-sans'
  },
  
  // 16. Project intro (using projects.png)
  {
    id: 'project-intro',
    type: 'definition',
    title: 'OUR PROJECTS',
    subtitle: 'BUILDING LIBERATION TOGETHER',
    bgImage: 'projects SQUAREDpng.png',
    font: 'font-sans'
  },
  
  // 17. Deep engagement before second quiz
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
  
  // Chapter 3
  {
    id: 'chapter-3',
    type: 'chapter',
    title: '3. AMPLIFYING INFLUENCE: YOUR VOICE MATTERS HERE',
    font: 'font-sans'
  },
  
  // 18. Second Quiz
  {
    id: 'pathway-discovery',
    type: 'pathway-quiz',
    title: 'DISCOVER YOUR LIBERATION PATHWAY',
    subtitle: 'FIND YOUR ROLE IN THE MOVEMENT',
    content: 'Now that you\'ve explored what\'s possible, let\'s get curious about how you want to contribute to our collective liberation.',
    introduction: 'This isn\'t about putting you in a box - it\'s about IVOR understanding your gifts so we can connect you with opportunities that energize rather than drain you. Your pathway can evolve as you do.',
    questions: [
      {
        question: "What draws you most to community work?",
        options: [
          { text: "Direct mutual aid and support", pathway: "community-healer" },
          { text: "Creative expression and storytelling", pathway: "creative-catalyst" }, 
          { text: "Technology and digital liberation", pathway: "tech-liberator" },
          { text: "Policy and systemic change", pathway: "systems-transformer" }
        ]
      },
      {
        question: "When you imagine your ideal contribution, you see yourself:",
        options: [
          { text: "Building deep, lasting relationships that heal trauma", pathway: "community-healer" },
          { text: "Creating powerful stories that shift culture", pathway: "creative-catalyst" },
          { text: "Developing tools that democratize power", pathway: "tech-liberator" },
          { text: "Challenging institutions that perpetuate harm", pathway: "systems-transformer" }
        ]
      },
      {
        question: "What would feel like the biggest success to you?",
        options: [
          { text: "Someone saying 'You helped me survive and thrive'", pathway: "community-healer" },
          { text: "Seeing your work inspire others to tell their truth", pathway: "creative-catalyst" },
          { text: "Communities using your tools to organize themselves", pathway: "tech-liberator" },
          { text: "Policies changing because of research you contributed", pathway: "systems-transformer" }
        ]
      }
    ],
    pathwayResponses: {
      "community-healer": {
        title: "COMMUNITY HEALER",
        subtitle: "The medicine our people need",
        description: "You're drawn to the deep work of healing - both individual and collective. Your superpower is creating brave spaces where Black queer men can process trauma, celebrate joy, and build resilience together.",
        opportunities: [
          "📅 THIS WEEK: 'Healing Circle' - Thursdays 7pm, Peckham Community Centre. Join 12 other Black queer men for guided healing sessions with Marcus (trained somatic therapist).",
          "🎯 OPPORTUNITY: Become a peer support coordinator for our Manchester chapter. Training provided. £200/month stipend available.",
          "📚 RESOURCE: Free 8-week 'Trauma-Informed Community Care' certification starting March 15. Only 2 spots left for London cohort.",
          "🤝 CONNECT: James in Birmingham is looking for co-facilitators for monthly men's group. He's also a healer - IVOR thinks you'd work well together."
        ],
        ivorCapability: "IVOR tracks mental health resources, finds healing practitioners offering sliding-scale support, and connects you with others doing this sacred work across the UK."
      },
      "creative-catalyst": {
        title: "CREATIVE CATALYST", 
        subtitle: "Storytelling as liberation practice",
        description: "You understand that representation matters, but authentic representation controlled by us matters more. Your gift is creating culture that centers Black queer male experiences without apology.",
        opportunities: [
          "📝 SUBMISSION CALL: 'Black Futures' digital magazine accepting poetry, essays, art until Feb 28. £150 per published piece. Your voice needed!",
          "🎬 COLLABORATION: Kwame (documentary filmmaker) seeking co-creator for oral history project on Black queer elders. Grant funding secured.",
          "📱 CAMPAIGN: Lead social media strategy for Pride response challenging pinkwashing. Budget: £2,500. Creative freedom: 100%.",
          "🎪 EVENT: 'Realness Stories' monthly showcase needs curator. Paid role £300/event + travel. Next: Cardiff, March 20."
        ],
        ivorCapability: "IVOR curates submission calls, funding opportunities, collaboration requests, and connects you with other creators building authentic narratives."
      },
      "tech-liberator": {
        title: "TECH LIBERATOR",
        subtitle: "Code as cooperative power",
        description: "You see technology as a tool for collective liberation, not individual accumulation. Your calling is building digital infrastructure that serves community needs over corporate profits.",
        opportunities: [
          "💻 PROJECT: Contribute to our platform development (this very site!). We need someone who understands React/TypeScript. Remote work, cooperative ownership model.",
          "🔧 BUILD: Design IVOR's notification system - how should it alert community to urgent actions? User research needed. £500 developer fee.",
          "🏫 TEACH: Run 'Code for Liberation' workshop at Hackney Community College. £250/session + materials. March weekends available.",
          "🌐 NETWORK: 'Tech for Social Justice' meetup happens first Tuesday monthly, London Bridge. 15 other developers building liberation tools."
        ],
        ivorCapability: "IVOR connects you with open-source justice projects, paid development opportunities, and other developers building tools that serve communities over corporations."
      },
      "systems-transformer": {
        title: "SYSTEMS TRANSFORMER",
        subtitle: "Policy as collective power building",
        description: "You're committed to changing the rules of the game, not just playing it better. Your strength is understanding how systems work and strategically intervening to create lasting change.",
        opportunities: [
          "📊 RESEARCH: Stonewall Housing needs data analyst for 'Black LGBTQ+ Homelessness' report. 3-month contract, £2,800/month. Deadline: Feb 20.",
          "⚡ URGENT: Government consultation on conversion therapy ban closes March 1. We're coordinating community response - need policy researcher.",
          "🤝 COALITION: Join 'Housing Justice Alliance' strategy meeting Feb 24. We're building cross-movement power for rent control campaign.",
          "🎓 TRAINING: 'Policy Advocacy Intensive' - 6 weeks starting March 10. Full scholarship available. Connect theory to action."
        ],
        ivorCapability: "IVOR monitors policy changes affecting our communities, tracks consultation deadlines, finds research opportunities, and connects you with coalition partners."
      }
    },
    bgImage: null,
    font: 'font-serif'
  },
  
  // 19. Skip - IVOR introduction now integrated into quiz response
  
  // 20. Bespoke pathway
  {
    id: 'ivor-showcase',
    type: 'ivor-demo',
    title: 'IVOR IN ACTION',
    subtitle: 'PERSONALIZED COMMUNITY INTELLIGENCE',
    content: 'Here\'s what I found for you this week, based on your interests and pathway.',
    bgImage: 'photo collage Video.mp4',
    font: 'font-serif'
  },
  
  // 21. Ready to join?
  {
    id: 'connect',
    type: 'connect',
    title: 'READY TO JOIN?',
    subtitle: 'YOUR LIBERATION JOURNEY CONTINUES',
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
    bgImage: 'facecard SQUARED.png',
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
  const [allUserData, setAllUserData] = useState<UserData>({})
  const [showFakeQuizResults, setShowFakeQuizResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Enhanced GSAP ScrollTrigger setup with navigation
    const slideElements = document.querySelectorAll('.slide')
    
    slideElements.forEach((slide, index) => {
      // Entrance animation
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
            toggleActions: "play none none reverse",
            onEnter: () => setCurrentSlide(index),
            onEnterBack: () => setCurrentSlide(index)
          }
        }
      )

      // Create scroll-based navigation
      ScrollTrigger.create({
        trigger: slide,
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
          if (self.isActive) {
            setCurrentSlide(index)
          }
        }
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Smooth scroll to slide function
  const scrollToSlide = (slideIndex: number) => {
    const slideElement = document.querySelector(`[data-slide-index="${slideIndex}"]`)
    if (slideElement) {
      slideElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const renderSlideContent = (slide: Slide, index: number): React.ReactNode => {
    switch (slide.type) {
      case 'chapter':
        return (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 max-w-4xl mx-auto text-center border border-gray-200"
            >
              <div className="flex flex-col items-center space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black leading-tight"
                    style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                  {slide.title}
                </h1>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <img 
                    src="/images/favicon2.png" 
                    alt="BLKOUT" 
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-80"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )
      case 'video':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
              src={slide.videoUrl || "/images/squared/Finalfinalwelcome SQUARED.mp4"}
            >
              <source src={slide.videoUrl || "/images/squared/Finalfinalwelcome SQUARED.mp4"} type="video/mp4" />
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
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 heading-block">{slide.title}</h1>
                  <p className="text-xl md:text-2xl lg:text-3xl text-gray-300">{slide.subtitle}</p>
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
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white heading-block ${slide.font || ''}`}>
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-300">
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
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 heading-block">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {slide.subtitle}
            </p>
            
            {(slide as any).videoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    className="w-full h-auto"
                    src={(slide as any).videoUrl}
                  >
                    <source src={(slide as any).videoUrl} type="video/mp4" />
                  </video>
                </div>
              </motion.div>
            )}
            
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
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

      case 'lessons-horizontal':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="w-full h-full relative"
          >
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
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent heading-block">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono">
                {slide.subtitle}
              </p>
            </div>

            <div className="relative w-full overflow-hidden">
              <motion.div
                className="flex gap-8 pb-8 px-4 overflow-x-auto no-scrollbar"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {Array.isArray(slide.lessons) && slide.lessons.map((lesson: any, index: number) => (
                  <LessonCard 
                    key={lesson.id}
                    lesson={lesson}
                    index={index}
                    totalLessons={slide.lessons.length}
                  />
                ))}
              </motion.div>
              
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
            </div>
          </motion.div>
        )

      case 'fake-quiz-trigger':
        
        if (showFakeQuizResults) {
          const results = (slide as any).results?.welcome
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto space-y-8 text-center relative"
            >
              {/* Joker Image - visible for the punchline reveal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                  src="/images/joker.png"
                  alt="Joker"
                  className="w-[25%] h-auto opacity-30"
                />
              </div>
              
              <div className="relative z-10 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 heading-block">
                    {results?.title}
                  </h1>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto"
                >
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                    {results?.message}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center"
                >
                  <div className="inline-block bg-gradient-to-r from-blkout-primary to-blkout-warm rounded-full px-6 py-2">
                    <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                      Welcome to the Journey
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        }
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto space-y-8 text-center relative"
          >
            {/* No joker image in initial state - preserve the surprise! */}
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 heading-block">
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
                onClick={() => setShowFakeQuizResults(true)}
                className="bg-gradient-to-r from-blkout-primary to-blkout-warm px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all heading-block"
              >
                Take The Test
              </motion.button>
              
              <p className="text-sm text-gray-400 font-mono mt-4">
                *This will only take a moment
              </p>
            </div>
          </motion.div>
        )

      case 'engagement':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto space-y-8 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 heading-block">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 uppercase tracking-wider font-mono mb-8">
              {slide.subtitle}
            </p>
            <div className="text-left max-w-3xl mx-auto space-y-6">
              {typeof slide.content === 'string' && slide.content.split('\n\n').map((paragraph: string, index: number) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-lg text-gray-200 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )

      case 'visioning-bridge':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto space-y-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight heading-block">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 font-mono uppercase tracking-wider">
                {slide.subtitle}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
            >
              <p className="text-lg text-gray-200 leading-relaxed italic">
                {slide.content}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
              className="mt-12"
            >
              <div className="flex justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )

      case 'connect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="w-full max-w-6xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex flex-col justify-center"
          >
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="inline-block bg-gradient-to-r from-blkout-primary to-blkout-warm rounded-full px-6 py-2 mb-6">
                  <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                    Your Liberation Journey Continues
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight heading-block">
                  {slide.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  {slide.content}
                </p>
              </motion.div>
            </div>

            {Array.isArray((slide as any).sections) && (
              <div className="grid md:grid-cols-3 gap-8">
                {(slide as any).sections.map((section: any, index: number) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                    className={`text-center ${section.highlight ? 'transform scale-105' : ''}`}
                  >
                    <div className={`${
                      section.highlight 
                        ? 'bg-gradient-to-br from-blkout-primary/80 to-blkout-warm/80 border-blkout-primary/50' 
                        : 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-600/30'
                    } backdrop-blur-sm rounded-2xl p-6 border h-full flex flex-col`}>
                      <h2 className={`text-2xl font-bold mb-2 heading-block ${
                        section.highlight ? 'text-white' : 'text-gray-100'
                      }`}>
                        {section.title}
                      </h2>
                      <p className={`text-sm font-mono uppercase tracking-wider mb-4 ${
                        section.highlight ? 'text-blkout-light' : 'text-gray-400'
                      }`}>
                        {section.subtitle}
                      </p>
                      <p className={`mb-6 leading-relaxed flex-1 ${
                        section.highlight ? 'text-gray-200' : 'text-gray-300'
                      }`}>
                        {section.description}
                      </p>
                      
                      {section.title === 'BLKOUTHUB' ? (
                        <a href="https://blkouthub.com/invitation?code=BE862C" target="_blank" rel="noopener noreferrer">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-electric-magenta text-white hover:bg-electric-cyan px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
                          >
                            Join BLKOUTHUB
                          </motion.button>
                        </a>
                      ) : section.title === 'NEWSLETTER' ? (
                        <div className="newsletter-signup">
                          <form 
                            method="post" 
                            action="https://sendfox.com/form/3zpwee/1wj276" 
                            className="sendfox-form space-y-4" 
                            id="1wj276" 
                            data-async="true" 
                            data-recaptcha="true"
                          >
                            <div>
                              <label htmlFor="sendfox_form_name" className="block text-sm font-medium text-gray-200 mb-2">
                                First Name:
                              </label>
                              <input 
                                type="text" 
                                id="sendfox_form_name" 
                                placeholder="First Name" 
                                name="first_name" 
                                required 
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-magenta focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label htmlFor="sendfox_form_email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email:
                              </label>
                              <input 
                                type="email" 
                                id="sendfox_form_email" 
                                placeholder="Email" 
                                name="email" 
                                required 
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-electric-magenta focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-start space-x-2">
                              <input 
                                type="checkbox" 
                                name="gdpr" 
                                value="1" 
                                required 
                                className="mt-1 h-4 w-4 text-electric-magenta focus:ring-electric-magenta border-gray-600 rounded bg-gray-800"
                              />
                              <label className="text-sm text-gray-300">
                                I agree to receive email updates and promotions.
                              </label>
                            </div>
                            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                              <input type="text" name="a_password" tabIndex={-1} defaultValue="" autoComplete="off" />
                            </div>
                            <motion.button 
                              type="submit"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full bg-electric-magenta text-white hover:bg-electric-cyan px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
                            >
                              Subscribe
                            </motion.button>
                          </form>
                          <script src="https://cdn.sendfox.com/js/form.js" charSet="utf-8"></script>
                        </div>
                      ) : section.title === 'EXPLORE' ? (
                        <div className="space-y-3">
                          <Link to="/stories">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full bg-electric-magenta text-white hover:bg-electric-cyan px-4 py-2 rounded-lg font-medium transition-all shadow-lg mb-2"
                            >
                              Newsroom & Stories
                            </motion.button>
                          </Link>
                          <Link to="/community">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full bg-electric-cyan text-white hover:bg-electric-indigo px-4 py-2 rounded-lg font-medium transition-all shadow-lg mb-2"
                            >
                              Community Hub
                            </motion.button>
                          </Link>
                          <a href="https://black-qtipoc-events-calendar.vercel.app/" target="_blank" rel="noopener noreferrer">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full bg-electric-indigo text-white hover:bg-electric-green px-4 py-2 rounded-lg font-medium transition-all shadow-lg"
                            >
                              Events Calendar
                            </motion.button>
                          </a>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`${
                            section.highlight
                              ? 'bg-white text-blkout-primary hover:bg-gray-100'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          } px-6 py-3 rounded-lg font-bold transition-all shadow-lg`}
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
            <h1 className="text-6xl md:text-8xl font-bold text-white heading-block">
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
    <div className="w-full overflow-x-hidden">
      {/* BLKOUT Pride 2025 Logo Header */}
      <div className="bg-black py-8 relative z-50 w-full">
        <div className="flex justify-center px-4">
          <img 
            src="/images/blkout_logo_roundel_colour.png" 
            alt="BLKOUT Logo" 
            className="w-1/3 max-w-md h-auto"
          />
        </div>
      </div>

      <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-x-hidden">
        {slides.map((slide, index) => (
        <div
          key={slide.id}
          data-slide-index={index}
          className="slide relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-black"
        >
          {/* Square container for slide content */}
          <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            {/* 1:1 aspect ratio container */}
            <div className="aspect-square w-full relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Background */}
              <div 
                className={`absolute inset-0 ${
                  (slide as any).bgImage 
                    ? 'bg-cover bg-center bg-no-repeat' 
                    : 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
                }`}
                style={{
                  backgroundImage: (slide as any).bgImage ? `url(/images/squared/${(slide as any).bgImage})` : undefined
                }}
              />
              
              {/* Content container */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className={`w-full text-center ${slide.font || ''}`}>
          {(slide as any).bgImage && slide.type !== 'fake-quiz-trigger' && slide.type !== 'pathway-quiz' && slide.type !== 'revelation' && slide.type !== 'definition' && (
            <div className="absolute inset-0 bg-black/60 z-0" />
          )}
          
          {(slide as any).bgImage && (slide.type === 'fake-quiz-trigger' || slide.type === 'pathway-quiz') && (
            <div className="absolute inset-0 bg-black/30 z-0" />
          )}
          
          {slide.type !== 'definition' && slide.type !== 'video' && slide.type !== 'fist-formation' && slide.type !== 'revelation' && (
            <div className={`relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 py-8 text-center ${slide.font}`}>
              {renderSlideContent(slide, index)}
            </div>
          )}

          {(slide.type === 'video' || slide.type === 'definition' || slide.type === 'revelation') && renderSlideContent(slide, index)}
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation - outside square container */}
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

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-40">
        <div 
          className="h-full bg-gradient-to-r from-blkout-primary to-blkout-warm transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide Indicator */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all hover:scale-125 ${
              currentSlide === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Instructions */}
      <div className="fixed bottom-6 left-6 z-30 text-white/60 text-sm font-mono">
        <div className="space-y-1">
          <div>↓ Scroll or click arrows to continue</div>
          <div>→ Use dots to navigate sections</div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default FullPageScrollytelling