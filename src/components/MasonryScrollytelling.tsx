import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { slides } from '../data/slides';
import { RevealCard } from './RevealCard';
import { QuizCard } from './QuizCard';
import { PathwayCard } from './PathwayCard';
import { CTACard } from './CTACard';
import { LessonCard } from './LessonCard';
import { VideoCard } from './VideoCard';
import { HeroVideo } from './HeroVideo';

export const MasonryScrollytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Separate slides into sections: hero, hero-video (breaks), and grid content
  const heroSlide = slides.find(s => s.type === 'hero');
  const heroVideoSlides = slides.filter(s => s.type === 'hero-video');
  const gridSlides = slides.filter(s => s.type !== 'hero' && s.type !== 'hero-video');

  // Split grid slides into sections broken by hero videos
  // Section 1: Identity cards + value prop + liberation + quiz + lessons (before first hero video)
  // Section 2: Vision + revelations (between first and second hero video)
  // Section 3: Projects + pathway (between second and third hero video)
  // Section 4: Infographic + CTAs (after third hero video)

  const section1Ids = ['black', 'queer', 'male', 'out', 'value-proposition', 'liberation-image', 'fake-quiz', 'lesson-healing', 'lesson-tools', 'lesson-connection', 'lesson-collective'];
  const section2Ids = ['future-visioning', 'own-stories', 'build-wealth'];
  const section3Ids = ['project-intro', 'pathway-discovery'];
  const section4Ids = ['realness-unleashed-infographic', 'blkouthub-cta', 'newsletter-cta', 'explore-platform-cta'];

  const section1 = gridSlides.filter(s => section1Ids.includes(s.id));
  const section2 = gridSlides.filter(s => section2Ids.includes(s.id));
  const section3 = gridSlides.filter(s => section3Ids.includes(s.id));
  const section4 = gridSlides.filter(s => section4Ids.includes(s.id));

  // Render the appropriate card type for grid items
  const renderCard = (slide: typeof slides[0], index: number) => {
    switch (slide.type) {
      case 'video':
        return <VideoCard key={slide.id} slide={slide} index={index} />;
      case 'quiz':
        return <QuizCard key={slide.id} slide={slide} index={index} />;
      case 'pathway':
        return <PathwayCard key={slide.id} slide={slide} index={index} />;
      case 'cta':
        return <CTACard key={slide.id} slide={slide} index={index} />;
      case 'lesson':
        return <LessonCard key={slide.id} slide={slide} index={index} />;
      default:
        return <RevealCard key={slide.id} slide={slide} index={index} />;
    }
  };

  // Render a masonry grid section
  const renderGridSection = (sectionSlides: typeof slides, startIndex: number = 0) => (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
        {sectionSlides.map((slide, index) => renderCard(slide, startIndex + index))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Ticker Header */}
      <div className="fixed top-1 left-0 right-0 z-40 overflow-hidden bg-black/80 backdrop-blur-sm">
        <motion.div
          className="flex whitespace-nowrap py-2"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs font-mono uppercase tracking-widest text-gray-400 mx-8">
              LIBERATION • COMMUNITY • POWER • HEALING • INNOVATION • CONNECTION • COLLECTIVE •
            </span>
          ))}
        </motion.div>
      </div>

      {/* Header */}
      <header className="fixed top-8 left-0 right-0 z-40 bg-gradient-to-b from-black/90 to-transparent pt-4 pb-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="https://blkoutuk.com" className="text-white font-bold text-xl tracking-tight">
            BLKOUT
          </a>
          <nav className="flex gap-6 text-sm">
            <a href="https://events.blkoutuk.cloud" className="text-gray-300 hover:text-white transition-colors">
              Events
            </a>
            <a href="https://news.blkoutuk.cloud" className="text-gray-300 hover:text-white transition-colors">
              News
            </a>
            <a href="https://blog.blkoutuk.cloud" className="text-gray-300 hover:text-white transition-colors">
              Voices
            </a>
            <a href="https://blkoutuk.com" className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
              Join
            </a>
          </nav>
        </div>
      </header>

      {/* Main content with interleaved hero videos */}
      <main ref={containerRef} className="relative">
        {/* Hero Section - Full viewport */}
        {heroSlide && <HeroSection slide={heroSlide} />}

        {/* Section 1: Identity & Foundation */}
        {renderGridSection(section1, 0)}

        {/* Hero Video Break 1: Welcome */}
        {heroVideoSlides[0] && <HeroVideo slide={heroVideoSlides[0]} />}

        {/* Section 2: Vision & Revelations */}
        {renderGridSection(section2, section1.length)}

        {/* Hero Video Break 2: Story Powered */}
        {heroVideoSlides[1] && <HeroVideo slide={heroVideoSlides[1]} />}

        {/* Section 3: Projects & Pathway */}
        {renderGridSection(section3, section1.length + section2.length)}

        {/* Hero Video Break 3: Community */}
        {heroVideoSlides[2] && <HeroVideo slide={heroVideoSlides[2]} />}

        {/* Section 4: CTAs & Closing */}
        {renderGridSection(section4, section1.length + section2.length + section3.length)}

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-white font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="https://events.blkoutuk.cloud" className="hover:text-white transition-colors">Events</a></li>
                  <li><a href="https://news.blkoutuk.cloud" className="hover:text-white transition-colors">News</a></li>
                  <li><a href="https://blog.blkoutuk.cloud" className="hover:text-white transition-colors">Voices Blog</a></li>
                  <li><a href="https://comms.blkoutuk.cloud" className="hover:text-white transition-colors">SocialSync</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Community</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="https://blkoutuk.com" className="hover:text-white transition-colors">Join BLKOUT</a></li>
                  <li><a href="https://blkoutuk.com/newsletter" className="hover:text-white transition-colors">Newsletter</a></li>
                  <li><a href="https://ivor.blkoutuk.cloud" className="hover:text-white transition-colors">Ask IVOR</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Connect</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="https://instagram.com/blkoutuk" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="https://twitter.com/blkoutuk" className="hover:text-white transition-colors">Twitter/X</a></li>
                  <li><a href="https://linkedin.com/company/blkoutuk" className="hover:text-white transition-colors">LinkedIn</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">BLKOUT UK</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A community-owned liberation platform for and by Black queer men in the UK.
                </p>
                <p className="text-gray-500 text-xs mt-4">
                  © 2025 BLKOUT UK Cooperative
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Hero Section Component
const HeroSection: React.FC<{ slide: typeof slides[0] }> = ({ slide }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {slide.bgImage && (
        <div className="absolute inset-0">
          <motion.img
            src={slide.bgImage}
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 pt-20">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight"
        >
          {slide.title}
        </motion.h1>

        {slide.subtitle && (
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto font-mono uppercase tracking-wider"
          >
            {slide.subtitle}
          </motion.p>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-sm font-mono">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasonryScrollytelling;
