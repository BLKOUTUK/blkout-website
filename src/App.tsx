import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { IntegrationProvider } from './components/CrossComponentIntegration'
import EcosystemNavigationHub from './components/EcosystemNavigationHub'
import { motion } from 'framer-motion'

// Core application components
import CommunityGovernanceDashboard from './components/community/CommunityGovernanceDashboard'
import PrimaryNavigationEnhanced from './components/layout/PrimaryNavigationEnhanced'
import MovementIntroEnhanced from './components/movement/MovementIntroEnhanced'
import AdminAuth from './components/admin/AdminAuth'
import IntegrationDashboard from './components/blkout/IntegrationDashboard'
import EventsAdminDashboard from './components/admin/EventsAdminDashboard'
import NewsroomAdminDashboard from './components/admin/NewsroomAdminDashboard'
import GovernanceDocumentsAdmin from './components/admin/GovernanceDocumentsAdmin'
import ModerationDashboard from './components/admin/ModerationDashboard'
import BlkoutUKMigrationPanel from './components/admin/BlkoutUKMigrationPanel'
import NewsroomEnhanced from './components/newsroom/NewsroomEnhanced'
import EventsPageIntegrated from './components/events/EventsPageIntegrated'
import IvorChatbot from './components/blkout/IvorChatbot'
import StoryArchive from './components/newsroom/StoryArchive'
import CrossModuleNavigation from './components/layout/CrossModuleNavigation'

// IVOR Community Liberation Platform
import IVOR from './pages/IVOR'
import LiveEventsPage from './pages/LiveEventsPage'
import UnifiedExperiencePage from './pages/UnifiedExperiencePage'
import ChromeExtensionPage from './pages/ChromeExtensionPage'
import DemoScenariosPage from './pages/DemoScenariosPage'
import OnboardingPage from './pages/OnboardingPage'
import LaunchShowcasePage from './pages/LaunchShowcasePage'
import OrganizationContributionsPage from './pages/OrganizationContributionsPage'
import BetaUserFlowPage from './pages/BetaUserFlowPage'
import LiveCommunityShowcasePage from './pages/LiveCommunityShowcasePage'
import StoryAmplificationPage from './pages/StoryAmplificationPage'
import LaunchPreparationPage from './pages/LaunchPreparationPage'
import StakeholderDemoPage from './pages/StakeholderDemoPage'
import DemonstrationBanner from './components/DemonstrationBanner'

// Import Extension API to make it available globally
import './services/extensionApi'

// Note: FullPageScrollytellingOptimized is implemented as separate module at:
// https://blkout-scrollytelling.vercel.app

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

// Scrollytelling Link Component
const ScrollytellingLink = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="mb-8">
          <img 
            src="/images/blkout_logo_roundel_colour.png" 
            alt="BLKOUT Logo" 
            className="w-32 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">Liberation Journey</h1>
          <p className="text-gray-300 text-lg">Experience our immersive storytelling journey</p>
        </div>
        
        <a 
          href="https://journey-blkout.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Your Journey
        </a>
        
        <div className="text-sm text-gray-400">
          <p>This experience opens in a new window</p>
        </div>
      </div>
    </div>
  )
}

// Main Homepage Component
const Homepage = () => (
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
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight uppercase">
            <span className="bg-gradient-to-r from-amber-400 to-purple-600 bg-clip-text text-transparent">
              BLKOUT
            </span>
            <br />
            <span className="text-4xl md:text-6xl">Community Platform</span>
          </h1>
          
          <p className="text-xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            🚨 DEMONSTRATION SITE: Speculative platform capabilities showcase.
            NOT a real community platform - built to show potential technical architecture.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/onboarding"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/movement"
                className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Our Movement
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/newsroom"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Newsroom
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/events"
                className="inline-block px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-full hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Events
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Cross-Module Navigation */}
        <div className="mt-16">
          <CrossModuleNavigation />
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section className="py-16 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide uppercase text-white text-center mb-12">Our Values</h2>
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
      <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
    </div>
  </div>
)

function App() {
  return (
    <IntegrationProvider>
      <Router>
        <SkipNavigation />
        <ScrollToTop />
        <DemonstrationBanner />
        <EcosystemNavigationHub />
        
        <Routes>
        {/* Main routes */}
        <Route path="/" element={<Homepage />} />
        
        {/* Community and governance */}
        <Route path="/governance" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><GovernancePage /></div>} />
        <Route path="/movement" element={<div className="min-h-screen bg-gradient-to-br from-red-950 via-yellow-950 to-green-950"><PlatformLayout><MovementIntroEnhanced /></PlatformLayout></div>} />
        
        {/* Content pages */}
        <Route path="/newsroom" element={<div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950"><PlatformLayout><NewsroomEnhanced /></PlatformLayout></div>} />
        <Route path="/events" element={<div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950"><PlatformLayout><EventsPageIntegrated /></PlatformLayout></div>} />
        
        {/* IVOR Community Liberation Platform - AI/Tech sections */}
        <Route path="/ivor" element={<div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-950"><IVOR /></div>} />
        
        {/* New ecosystem pages - Community/Events sections */}
        <Route path="/live-events" element={<div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950"><PlatformLayout><LiveEventsPage /></PlatformLayout></div>} />
        <Route path="/dashboard" element={<div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950"><PlatformLayout><LiveCommunityShowcasePage /></PlatformLayout></div>} />
        <Route path="/ecosystem" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><UnifiedExperiencePage /></PlatformLayout></div>} />
        <Route path="/extension" element={<div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-950"><PlatformLayout><ChromeExtensionPage /></PlatformLayout></div>} />
        <Route path="/demo" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><DemoScenariosPage /></PlatformLayout></div>} />
        <Route path="/onboarding" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><OnboardingPage /></PlatformLayout></div>} />
        <Route path="/launch" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><LaunchShowcasePage /></PlatformLayout></div>} />
        <Route path="/partnerships" element={<div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950"><PlatformLayout><OrganizationContributionsPage /></PlatformLayout></div>} />
        <Route path="/beta-flow" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><BetaUserFlowPage /></PlatformLayout></div>} />
        <Route path="/amplification" element={<div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950"><PlatformLayout><StoryAmplificationPage /></PlatformLayout></div>} />
        <Route path="/launch-prep" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><LaunchPreparationPage /></PlatformLayout></div>} />
        <Route path="/stakeholder-demo" element={<div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"><PlatformLayout><StakeholderDemoPage /></PlatformLayout></div>} />

        {/* Admin routes - Governance/purple theme for administrative functions */}
        <Route path="/admin" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><AdminAuth><IntegrationDashboard /></AdminAuth></div>} />
        <Route path="/admin/moderation" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><AdminAuth><ModerationDashboard /></AdminAuth></div>} />
        <Route path="/admin/events" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><AdminAuth><EventsAdminDashboard /></AdminAuth></div>} />
        <Route path="/admin/newsroom" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><AdminAuth><NewsroomAdminDashboard /></AdminAuth></div>} />
        <Route path="/admin/governance" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><AdminAuth><GovernanceDocumentsAdmin /></AdminAuth></div>} />
        <Route path="/admin/migration" element={<div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950"><AdminAuth><BlkoutUKMigrationPanel /></AdminAuth></div>} />
        
        {/* Story Archive */}
        <Route path="/newsroom/archive" element={<div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950"><StoryArchive /></div>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        {/* IVOR Chatbot - Available on all pages */}
        <IvorChatbot />
      </Router>
    </IntegrationProvider>
  )
}

export default App