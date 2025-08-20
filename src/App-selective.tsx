import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// Import ONLY the components we know work from progressive testing
import CommunityGovernanceDashboard from './components/community/CommunityGovernanceDashboard'
import PrimaryNavigationEnhanced from './components/layout/PrimaryNavigationEnhanced'
import MovementIntroEnhanced from './components/movement/MovementIntroEnhanced'
import AdminAuth from './components/admin/AdminAuth'
import IntegrationDashboard from './components/blkout/IntegrationDashboard'
import EventsAdminDashboard from './components/admin/EventsAdminDashboard'
import NewsroomAdminDashboard from './components/admin/NewsroomAdminDashboard'
import GovernanceDocumentsAdmin from './components/admin/GovernanceDocumentsAdmin'
import ModerationDashboard from './components/admin/ModerationDashboard'
import NewsroomEnhanced from './components/newsroom/NewsroomEnhanced'
import EventsPageIntegrated from './components/events/EventsPageIntegrated'

// EXCLUDE potentially problematic heavy components:
// - FullPageScrollytellingOptimized (most likely culprit - heavy animations)
// - Complex animation components
// - Memory-intensive components

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation()
  
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

// Simple navigation component
const SkipNavigation = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-blue-600 text-white px-4 py-2"
  >
    Skip to main content
  </a>
)

// Platform Layout Component
const PlatformLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <PrimaryNavigationEnhanced />
    {children}
  </>
)

// Simple Homepage (instead of heavy FullPageScrollytellingOptimized)
const SimpleHomepage = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
    <PrimaryNavigationEnhanced />
    
    {/* Hero Section */}
    <section className="relative py-20 bg-gradient-to-br from-purple-950 via-indigo-950 to-emerald-950 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
              BLKOUT
            </span>
            <br />
            Community Platform
          </h1>
          
          <p className="text-xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Liberation through collective action and cooperative ownership. 
            Building power, sharing resources, and centering Black queer joy.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <motion.a
              href="/governance"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Community Governance
            </motion.a>
            
            <motion.a
              href="/movement"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Our Movement
            </motion.a>
            
            <motion.a
              href="/newsroom"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Newsroom
            </motion.a>
            
            <motion.a
              href="/events"
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-full hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Events
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Values Section */}
    <section className="py-16 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="text-center p-6 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl mb-4">🏳️‍⚧️</div>
            <h3 className="text-xl font-bold text-white mb-2">Trans Liberation</h3>
            <p className="text-gray-300">Centering trans joy and safety in all we do</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-white mb-2">Cooperative Ownership</h3>
            <p className="text-gray-300">Community-owned, democratically governed</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-white/5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-4xl mb-4">✊🏿</div>
            <h3 className="text-xl font-bold text-white mb-2">Black Power</h3>
            <p className="text-gray-300">Liberation through collective action</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <p className="text-gray-400">&copy; 2024 BLKOUT - Community Platform | Liberation through Cooperation</p>
      </div>
    </footer>
  </div>
)

const GovernancePage = () => <CommunityGovernanceDashboard />

// Simple 404 page
const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <SkipNavigation />
      <ScrollToTop />
      
      {/* Debug indicator */}
      <div className="fixed top-0 right-0 bg-green-600 text-white px-3 py-1 text-sm z-50">
        SELECTIVE MODE: Heavy components excluded
      </div>
      
      <Routes>
        {/* Main routes - using simple homepage instead of FullPageScrollytellingOptimized */}
        <Route path="/" element={<SimpleHomepage />} />
        
        {/* Community and governance */}
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/movement" element={<PlatformLayout><MovementIntroEnhanced /></PlatformLayout>} />
        
        {/* Content pages */}
        <Route path="/newsroom" element={<PlatformLayout><NewsroomEnhanced /></PlatformLayout>} />
        <Route path="/events" element={<PlatformLayout><EventsPageIntegrated /></PlatformLayout>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminAuth><IntegrationDashboard /></AdminAuth>} />
        <Route path="/admin/moderation" element={<AdminAuth><ModerationDashboard /></AdminAuth>} />
        <Route path="/admin/events" element={<AdminAuth><EventsAdminDashboard /></AdminAuth>} />
        <Route path="/admin/newsroom" element={<AdminAuth><NewsroomAdminDashboard /></AdminAuth>} />
        <Route path="/admin/governance" element={<AdminAuth><GovernanceDocumentsAdmin /></AdminAuth>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App