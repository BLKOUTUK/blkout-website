import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Import ALL original components systematically
import FullPageScrollytellingOptimized from './components/blkout/FullPageScrollytellingOptimized'
import ProjectHub from './components/blkout/ProjectHub'
import IntegrationDashboard from './components/blkout/IntegrationDashboard'
import ModerationDashboard from './components/admin/ModerationDashboard'
import EventsAdminDashboard from './components/admin/EventsAdminDashboard'
import NewsroomAdminDashboard from './components/admin/NewsroomAdminDashboard'
import AdminAuth from './components/admin/AdminAuth'
import CommunityGatewayEnhanced from './components/community/CommunityGatewayEnhanced'
import CommunityGovernanceDashboard from './components/community/CommunityGovernanceDashboard'
import MagazineLayout from './components/magazine/MagazineLayout'
import PlatformHomepage from './components/platform/PlatformHomepage'
import PrimaryNavigation from './components/layout/PrimaryNavigation'
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
import ExtensionDownloadSimple from './components/extension/ExtensionDownloadSimple'
import ArticleDetail from './components/stories/ArticleDetail'
import PhotoCompetition from './components/community/PhotoCompetition'
import PartnershipProposal from './components/partnerships/PartnershipProposal'
import PhotoCompetitionTest from './components/community/PhotoCompetitionTest'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

// Platform Layout Component - wraps platform routes with navigation
const PlatformLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <PrimaryNavigation />
    {children}
  </>
)

// IVOR Page with backend check
const IVORPage = () => {
  const [backendStatus, setBackendStatus] = React.useState('checking')
  
  React.useEffect(() => {
    // Check if IVOR backend is running
    fetch('https://blkout-ivor-fresh-jklmotmfs-robs-projects-54d653d3.vercel.app/health')
      .then(res => res.json())
      .then(() => {
        setBackendStatus('running')
        // Redirect to IVOR interface
        window.location.href = 'https://blkout-ivor-fresh-jklmotmfs-robs-projects-54d653d3.vercel.app'
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

const GovernancePage = () => <CommunityGovernanceDashboard />

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

// Movement page
const MovementPage = () => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f0f23',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '3.5rem',
            margin: '0 0 20px 0',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🤝 Our Movement
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#cbd5e1', margin: 0 }}>
            Building community power through cooperative democracy
          </p>
        </header>

        <section style={{
          backgroundColor: '#1a1a2e',
          padding: '40px',
          borderRadius: '15px',
          marginBottom: '40px',
          border: '1px solid #16213e'
        }}>
          <h2 style={{ color: '#10b981', margin: '0 0 20px 0' }}>Movement Principles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div>
              <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>🏳️‍🌈 Liberation First</h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                We center Black queer liberation in all our work and decisions.
              </p>
            </div>
            <div>
              <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>🤝 Community Ownership</h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                Our platform belongs to the community, not to corporations.
              </p>
            </div>
            <div>
              <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>🗳️ Democratic Power</h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                Every community member has a voice in our governance.
              </p>
            </div>
          </div>
        </section>

        <div style={{ textAlign: 'center' }}>
          <a
            href="/governance"
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'inline-block',
              marginRight: '15px',
              boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)'
            }}
          >
            🏛️ JOIN GOVERNANCE
          </a>
          <a
            href="/"
            style={{
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [error, setError] = React.useState<string | null>(null)
  
  // Global error handler
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error)
      setError(`JavaScript Error: ${event.error?.message || 'Unknown error'}`)
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      setError(`Promise Rejection: ${event.reason}`)
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
  
  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>⚠️ Application Error</h1>
          <p style={{ color: '#cbd5e1', marginBottom: '20px', maxWidth: '600px' }}>{error}</p>
          <button
            onClick={() => {
              setError(null)
              window.location.reload()
            }}
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Reload Application
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <Router>
      <SkipNavigation />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<FullPageScrollytellingOptimized />} />
        <Route path="/platform" element={<PlatformLayout><PlatformHomepage /></PlatformLayout>} />
        <Route path="/magazine" element={<MagazineHomepageEnhanced />} />
        <Route path="/home" element={<MagazineHomepageEnhanced />} />
        <Route path="/dashboard" element={<ProjectHub />} />
        <Route path="/admin" element={<AdminAuth><IntegrationDashboard /></AdminAuth>} />
        <Route path="/admin/moderation" element={<AdminAuth><ModerationDashboard /></AdminAuth>} />
        <Route path="/admin/events" element={<AdminAuth><EventsAdminDashboard /></AdminAuth>} />
        <Route path="/admin/newsroom" element={<AdminAuth><NewsroomAdminDashboard /></AdminAuth>} />
        <Route path="/admin/governance" element={<AdminAuth><GovernanceDocumentsAdmin /></AdminAuth>} />
        <Route path="/community" element={<PlatformLayout><CommunityGatewayEnhanced /></PlatformLayout>} />
        <Route path="/photo-competition" element={<PhotoCompetition />} />
        <Route path="/partnerships" element={<PartnershipProposal />} />
        <Route path="/photo-test" element={<PhotoCompetitionTest />} />
        <Route path="/stories" element={<PlatformLayout><StoriesPageEnhanced /></PlatformLayout>} />
        <Route path="/stories/:slug" element={<ArticleDetail />} />
        <Route path="/movement" element={<PlatformLayout><MovementIntroEnhanced /></PlatformLayout>} />
        <Route path="/discussions" element={<BLKOUTHUBPromoPage />} />
        <Route path="/reports" element={<HubReports />} />
        <Route path="/newsroom" element={<PlatformLayout><NewsroomEnhanced /></PlatformLayout>} />
        <Route path="/media" element={<ChannelBLKOUTPage />} />
        <Route path="/events" element={<PlatformLayout><EventsPageIntegrated /></PlatformLayout>} />
        <Route path="/ivor" element={<PlatformLayout><IVORInterfaceEnhanced /></PlatformLayout>} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/media/newsroom" element={<NewsroomEnhanced />} />
        <Route path="/media/channel" element={<ChannelBLKOUTPage />} />
        <Route path="/media/storylab" element={<StorylabPage />} />
        
        {/* Extension Downloads */}
        <Route path="/extension" element={<ExtensionDownloadSimple />} />
        <Route path="/downloads" element={<ExtensionDownloadSimple />} />
        <Route path="/chrome-extension" element={<ExtensionDownloadSimple />} />
      </Routes>
    </Router>
  )
}

export default App