import { motion } from 'framer-motion'
import PreEngagementCarousel from './components/blkout/PreEngagementCarousel'
import ScrollytellingHero from './components/blkout/ScrollytellingHero'
import ParallaxCommunityValues from './components/blkout/ParallaxCommunityValues'
import ComplexityRhythm from './components/blkout/ComplexityRhythm'
import HorizontalScrollPrinciples from './components/blkout/HorizontalScrollPrinciples'
import StickyNavigation from './components/blkout/StickyNavigation'
import FloatingElements from './components/blkout/FloatingElements'
import IvorChatbot from './components/blkout/IvorChatbot'
import DirectAccessLayout from './components/blkout/DirectAccessLayout'
import { useLayoutPreference } from './hooks/useLayoutPreference'

function App() {
  const { layoutMode, toggleLayout } = useLayoutPreference()

  // Render direct access layout
  if (layoutMode === 'direct') {
    return (
      <>
        <DirectAccessLayout onToggleLayout={toggleLayout} />
        <IvorChatbot />
      </>
    )
  }

  // Render scrollytelling layout
  return (
    <main className="relative min-h-screen">
      {/* Sticky Navigation */}
      <StickyNavigation onToggleLayout={toggleLayout} />
      
      {/* Physics-based Floating Elements */}
      <FloatingElements />

      {/* PRE-ENGAGEMENT: Carousel at top for diverse audience touchpoints */}
      <section id="pre-engagement">
        <PreEngagementCarousel />
      </section>

      {/* VERTICAL 1: Hero Section with Scrollytelling */}
      <section id="hero">
        <ScrollytellingHero />
      </section>

      {/* VERTICAL 2: Community Values with Parallax */}
      <section id="values">
        <ParallaxCommunityValues />
      </section>

      {/* VERTICAL-HORIZONTAL RHYTHM: Complexity Celebration */}
      <section id="complexity">
        <ComplexityRhythm />
      </section>

      {/* HORIZONTAL: Development Principles */}
      <section id="principles">
        <HorizontalScrollPrinciples />
      </section>

      {/* VERTICAL 3: Final Community Call-to-Action */}
      <section id="community" className="relative min-h-screen bg-gradient-to-br from-blkout-primary via-blkout-warm to-blkout-secondary flex items-center justify-center">
        <div className="text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1, ease: [0.175, 0.885, 0.32, 1.275] }}
            viewport={{ once: true }}
            className="text-8xl mb-8"
          >
            🌍
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Ready for Real Conversation?
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join the journey with Black queer men building cooperative power through authentic dialogue and shared complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blkout-primary font-bold rounded-full text-lg transition-all"
            >
              Join the Journey
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-blkout-primary transition-all"
            >
              Explore Stories
            </motion.button>
          </div>

          {/* Complexity celebration */}
          <div className="mt-16 text-white/60">
            <p className="text-lg">We embrace complexity. We celebrate contradictions.</p>
            <p className="text-sm mt-2">Your whole self is welcome here.</p>
          </div>
        </div>
      </section>

      {/* IVOR Chatbot */}
      <IvorChatbot />
    </main>
  )
}

export default App