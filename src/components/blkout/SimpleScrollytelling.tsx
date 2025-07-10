import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import HorizontalProjects from './HorizontalProjects'

const SimpleScrollytelling: React.FC = () => {
  const slides = [
    {
      id: 'welcome-video',
      type: 'video',
      videoSrc: '/images/welcomevidfinal.webm',
      height: '100vh'
    },
    {
      id: 'who',
      type: 'image',
      imageSrc: '/images/WHO.png',
      title: 'WHO',
      height: '40vh'
    },
    {
      id: 'well-defined',
      type: 'image',
      imageSrc: '/images/welldef2.png',
      title: 'WELL DEFINED',
      height: '100vh'
    },
    {
      id: 'black',
      type: 'image',
      imageSrc: '/images/black2.png',
      title: 'BLACK?',
      height: '100vh'
    },
    {
      id: 'queer',
      type: 'image',
      imageSrc: '/images/queer2.png',
      title: 'QUEER',
      height: '100vh'
    },
    {
      id: 'male',
      type: 'image',
      imageSrc: '/images/men2.png',
      title: 'MALE*',
      height: '100vh'
    },
    {
      id: 'out',
      type: 'image',
      imageSrc: '/images/out2.png',
      title: 'OUT',
      height: '100vh'
    },
    {
      id: 'work',
      type: 'image',
      imageSrc: '/images/the work.png',
      title: 'THE WORK',
      height: '40vh'
    },
    {
      id: 'liberation',
      type: 'image',
      imageSrc: '/images/liberation.png',
      title: 'LIBERATION',
      height: '100vh'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* BLKOUT Pride 2025 Logo Header */}
      <header className="bg-black py-8 relative z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <img 
            src="/images/BLKOUTpride2025.png" 
            alt="BLKOUT Pride 2025" 
            className="w-1/3 max-w-md h-auto"
          />
          
          {/* Skip to Main Site */}
          <Link 
            to="/home"
            className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center"
          >
            Skip to Main Site
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Landing Actions - First thing users see */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              BLKOUT UK
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Building Black queer liberation through cooperative ownership. 
              Join our movement for community power and collective action.
            </p>
            
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <div className="w-full sm:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email to stay connected"
                  className="w-full sm:w-80 px-6 py-4 rounded-xl text-black font-medium mb-4 sm:mb-0 sm:mr-4"
                />
                <button className="w-full sm:w-auto bg-blkout-secondary text-black px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors">
                  Stay in Touch
                </button>
              </div>
            </div>

            {/* Clear Navigation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <Link 
                to="/home"
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all group"
              >
                <div className="text-center">
                  <div className="text-3xl mb-4">🌐</div>
                  <h3 className="text-xl font-bold mb-3">Explore Website</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Stories, movement reports, events, and community resources open to everyone.
                  </p>
                  <div className="flex items-center justify-center text-blkout-secondary mt-4 font-medium">
                    Browse Content <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-3xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold mb-3">BLKOUTHUB</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Private digital community for UK-based Black queer men. Deep engagement and mutual support.
                  </p>
                  <button className="bg-blkout-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                    Request Access
                  </button>
                </div>
              </div>
            </div>

            {/* Continue to Story */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">Want to learn more about our movement?</p>
              <button 
                onClick={() => {
                  const nextSection = document.querySelector('#scrollytelling-content');
                  nextSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/60 hover:text-white transition-colors flex items-center mx-auto"
              >
                Discover Our Story
                <div className="ml-2 animate-bounce">↓</div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrollytelling Content */}
      <div id="scrollytelling-content" className="relative">
        {slides.map((slide, index) => (
          <motion.section
            key={slide.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-10%", amount: 0.3 }}
            className="relative w-full flex items-center justify-center bg-black"
            style={{ minHeight: slide.height || '100vh' }}
          >
            {slide.type === 'video' ? (
              <div className="w-full h-screen relative">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={slide.videoSrc} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Rising text animations during welcome video */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <motion.img 
                    src="/images/USALL.png"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ 
                      y: ["100%", "0%", "0%", "-100%"],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      times: [0, 0.4, 0.7, 1],
                      delay: 15,
                      ease: "easeOut"
                    }}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-md"
                  />
                  <motion.img 
                    src="/images/ALLOFUS.png" 
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ 
                      y: ["100%", "0%", "0%", "-100%"],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      times: [0, 0.4, 0.7, 1],
                      delay: 20,
                      ease: "easeOut"
                    }}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-md"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full relative flex items-center justify-center" style={{ height: slide.height || '100vh' }}>
                <img
                  src={slide.imageSrc}
                  alt={slide.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            
            {/* Screen reader accessibility */}
            <div className="sr-only">
              <h2>{slide.title || 'Welcome Video'}</h2>
            </div>
          </motion.section>
        ))}
        
        {/* Horizontal Projects Section */}
        <HorizontalProjects />
        
        {/* Navigation to Homepage - Clean transition */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: false, margin: "-10%", amount: 0.3 }}
          className="relative w-full min-h-screen flex items-center justify-center bg-white"
        >
          <div className="text-center max-w-4xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: false }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-black mb-8 leading-tight">
                Ready to explore?
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                Continue your journey into the BLKOUT community platform. Discover stories, events, resources, and movement building.
              </p>
              
              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <Link 
                  to="/home"
                  className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Enter Community Hub
                </Link>
                
                <Link 
                  to="/media"
                  className="bg-gray-100 text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center"
                >
                  Explore Stories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              
              {/* Quick Navigation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <Link 
                  to="/movement" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">Movement</div>
                  <div className="text-xs text-gray-500">Reports & Analysis</div>
                </Link>
                
                <Link 
                  to="/media" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">Media</div>
                  <div className="text-xs text-gray-500">Stories & News</div>
                </Link>
                
                <Link 
                  to="/events" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">Events</div>
                  <div className="text-xs text-gray-500">Community Gatherings</div>
                </Link>
                
                <Link 
                  to="/resources" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">Resources</div>
                  <div className="text-xs text-gray-500">Tools & Guides</div>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default SimpleScrollytelling