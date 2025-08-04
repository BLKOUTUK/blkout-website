import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}
import { Calendar } from 'lucide-react'
import FullPageScrollytellingOptimized from './components/blkout/FullPageScrollytellingOptimized'
import ProjectHub from './components/blkout/ProjectHub'
import IntegrationDashboard from './components/blkout/IntegrationDashboard'
import ModerationDashboard from './components/admin/ModerationDashboard'
import CommunityGatewayEnhanced from './components/community/CommunityGatewayEnhanced'
import MagazineLayout from './components/magazine/MagazineLayout'
import PlatformHomepage from './components/magazine/PlatformHomepage'
import MagazineHomepageEnhanced from './components/magazine/MagazineHomepageEnhanced'
import StoriesPageEnhanced from './components/magazine/StoriesPageEnhanced'
import MovementIntroEnhanced from './components/movement/MovementIntroEnhanced'
import BLKOUTHUBPromoPage from './components/community/BLKOUTHUBPromoPage'
import HubReports from './components/community/HubReports'
import IVORInterfaceEnhanced from './components/ivor/IVORInterfaceEnhanced'
import NewsroomEnhanced from './components/newsroom/NewsroomEnhanced'
import EventsPageIntegrated from './components/events/EventsPageIntegrated'
import PrimaryNavigationEnhanced from './components/layout/PrimaryNavigationEnhanced'
import PlatformFooter from './components/layout/PlatformFooter'
import SkipNavigation from './components/layout/SkipNavigation'

// Old EventsPage removed - using EventsPageIntegrated directly in routing

const IVORPage = () => {
  const [backendStatus, setBackendStatus] = React.useState('checking')
  
  React.useEffect(() => {
    // Check if IVOR backend is running
    fetch('http://localhost:8000/health/')
      .then(res => res.json())
      .then(() => {
        setBackendStatus('running')
        // Redirect to IVOR interface
        window.location.href = 'http://localhost:8000'
      })
      .catch(() => {
        setBackendStatus('offline')
      })
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">IVOR AI Assistant</h1>
        {backendStatus === 'checking' && (
          <p className="text-xl text-gray-300 mb-8">Connecting to IVOR backend...</p>
        )}
        {backendStatus === 'running' && (
          <p className="text-xl text-gray-300 mb-8">Redirecting to IVOR interface...</p>
        )}
        {backendStatus === 'offline' && (
          <div>
            <p className="text-xl text-gray-300 mb-4">IVOR backend is currently offline</p>
            <p className="text-sm text-gray-400 mb-8">
              To start IVOR: cd ivor/ivor/backend && ./start.sh
            </p>
          </div>
        )}
        <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
      </div>
    </div>
  )
}

const GovernancePage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Community Governance</h1>
      <p className="text-xl text-gray-300 mb-8">Democratic decision-making tools</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

// Media platform components from PRD
const ChannelBLKOUTPage = () => {
  React.useEffect(() => {
    window.location.href = 'https://blkoutnxtchannel.carrd.co'
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to Channel BLKOUT...</h1>
        <p className="text-xl text-gray-300 mb-8">Taking you to our video platform</p>
        <a href="https://blkoutnxtchannel.carrd.co" className="text-blue-400 hover:text-blue-300">Click here if not redirected</a>
      </div>
    </div>
  )
}

const StorylabPage = () => {
  React.useEffect(() => {
    window.location.href = 'https://blkoutnxtstory.carrd.co'
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to Storylab...</h1>
        <p className="text-xl text-gray-300 mb-8">Taking you to our storytelling platform</p>
        <a href="https://blkoutnxtstory.carrd.co" className="text-blue-400 hover:text-blue-300">Click here if not redirected</a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <SkipNavigation />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<FullPageScrollytellingOptimized />} />
        <Route path="/platform" element={<PlatformHomepage />} />
        <Route path="/magazine" element={<MagazineHomepageEnhanced />} />
        <Route path="/home" element={<MagazineHomepageEnhanced />} />
        <Route path="/dashboard" element={<ProjectHub />} />
        <Route path="/admin" element={<IntegrationDashboard />} />
        <Route path="/admin/moderation" element={<ModerationDashboard />} />
        <Route path="/community" element={<CommunityGatewayEnhanced />} />
        <Route path="/stories" element={<StoriesPageEnhanced />} />
        <Route path="/movement" element={<MovementIntroEnhanced />} />
        <Route path="/discussions" element={<BLKOUTHUBPromoPage />} />
        <Route path="/reports" element={<HubReports />} />
        <Route path="/newsroom" element={<NewsroomEnhanced />} />
        <Route path="/media" element={<ChannelBLKOUTPage />} />
        <Route path="/events" element={<EventsPageIntegrated />} />
        <Route path="/ivor" element={<IVORInterfaceEnhanced />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/media/newsroom" element={<NewsroomEnhanced />} />
        <Route path="/media/channel" element={<ChannelBLKOUTPage />} />
        <Route path="/media/storylab" element={<StorylabPage />} />
      </Routes>
    </Router>
  )
}

export default App