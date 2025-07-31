import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import FullPageScrollytellingOptimized from './components/blkout/FullPageScrollytellingOptimized'
import ProjectHub from './components/blkout/ProjectHub'
import IntegrationDashboard from './components/blkout/IntegrationDashboard'
import CommunityGatewayEnhanced from './components/community/CommunityGatewayEnhanced'
import MagazineLayout from './components/magazine/MagazineLayout'
import PlatformHomepage from './components/magazine/PlatformHomepage'
import StoriesPageEnhanced from './components/magazine/StoriesPageEnhanced'
import MovementIntroEnhanced from './components/movement/MovementIntroEnhanced'
import JoinDiscussionEnhanced from './components/community/JoinDiscussionEnhanced'
import HubReports from './components/community/HubReports'
import IVORInterfaceEnhanced from './components/ivor/IVORInterfaceEnhanced'
import NewsroomEnhanced from './components/newsroom/NewsroomEnhanced'
import EventsPageIntegrated from './components/events/EventsPageIntegrated'
import PrimaryNavigationEnhanced from './components/layout/PrimaryNavigationEnhanced'
import PlatformFooter from './components/layout/PlatformFooter'

// Connect to actual backend services
const NewsroomPage = () => {
  const [articles, setArticles] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [backendStatus, setBackendStatus] = React.useState('checking')
  
  React.useEffect(() => {
    // Check if newsroom backend is running and fetch articles
    fetch('http://localhost:3001/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || [])
        setBackendStatus('running')
      })
      .catch(() => {
        setBackendStatus('offline')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">BLKOUT Newsroom</h1>
          <p className="text-xl text-gray-300 mb-8">Community news and liberation analysis</p>
        </div>
        
        {backendStatus === 'checking' && loading && (
          <div className="text-center">
            <p className="text-xl text-gray-300">Connecting to newsroom backend...</p>
          </div>
        )}
        
        {backendStatus === 'offline' && (
          <div className="text-center">
            <p className="text-xl text-gray-300 mb-4">Newsroom backend is currently offline</p>
            <p className="text-sm text-gray-400 mb-8">
              To start newsroom: cd newsroom/blkout-newsroom-backend && npm run dev
            </p>
          </div>
        )}
        
        {backendStatus === 'running' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? articles.map((article: any, index: number) => (
              <div key={index} className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all">
                <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{article.source}</span>
                  <span>{new Date(article.published_date).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center">
                <p className="text-xl text-gray-300">No articles available yet</p>
                <p className="text-sm text-gray-400">Articles will appear here as they are aggregated</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}

const EventsPage = () => {
  const [backendStatus, setBackendStatus] = React.useState<'checking' | 'connected' | 'offline'>('checking')
  const [shouldRedirect, setShouldRedirect] = React.useState(false)
  
  React.useEffect(() => {
    // First try to connect to events backend
    fetch('http://localhost:5173/api/events')
      .then(response => {
        if (response.ok) {
          setBackendStatus('connected')
          // If backend is running, redirect to the existing calendar
          setShouldRedirect(true)
          setTimeout(() => {
            window.location.href = 'http://localhost:5173'
          }, 2000)
        } else {
          throw new Error('Events backend not responding')
        }
      })
      .catch(() => {
        setBackendStatus('offline')
      })
  }, [])
  
  if (shouldRedirect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-black heading-block mb-4 uppercase">
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              LOADING EVENTS
            </span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 font-light">Redirecting to IVOR Events Calendar...</p>
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-bold heading-block text-sm uppercase">EVENTS BACKEND CONNECTED</span>
          </div>
          <a href="/" className="text-indigo-400 hover:text-white transition-colors font-medium">
            ← Back to Platform
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
      <PrimaryNavigationEnhanced />
      
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-2xl mx-auto px-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-black heading-block mb-6 uppercase">
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              COMMUNITY
            </span>
            <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent ml-2">
              EVENTS
            </span>
          </h1>
          
          {backendStatus === 'checking' && (
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
                <span className="text-indigo-400 font-bold heading-block text-sm uppercase">
                  CONNECTING TO EVENTS BACKEND
                </span>
              </div>
              <p className="text-indigo-200 font-light">
                Checking if IVOR Events Calendar is running...
              </p>
            </div>
          )}
          
          {backendStatus === 'offline' && (
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                <span className="text-amber-400 font-bold heading-block text-sm uppercase">
                  EVENTS BACKEND OFFLINE
                </span>
              </div>
              <p className="text-indigo-200 font-light mb-6">
                The events calendar backend is currently offline. Please start it to access community events.
              </p>
              <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 text-left">
                <p className="text-sm text-indigo-300 mb-2 font-mono">To start the events calendar:</p>
                <code className="text-emerald-400 font-mono text-sm bg-indigo-950/50 px-3 py-2 block">
                  cd events-calendar && npm run dev
                </code>
                <p className="text-xs text-indigo-400 mt-2">
                  The events calendar should run on http://localhost:5173
                </p>
              </div>
            </div>
          )}
          
          <a href="/" className="text-indigo-400 hover:text-white transition-colors font-medium">
            ← Back to Platform
          </a>
        </div>
      </div>
      
      <PlatformFooter />
    </div>
  )
}

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
const ChannelBLKOUTPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Channel BLKOUT</h1>
      <p className="text-xl text-gray-300 mb-4">Community video content and live streaming</p>
      <p className="text-lg text-gray-400 mb-8">Video platform for liberation stories, educational content, and community events</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

const StorylabPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Storylab</h1>
      <p className="text-xl text-gray-300 mb-4">Community storytelling platform</p>
      <p className="text-lg text-gray-400 mb-8">Share your stories: realness, voices, creative expression, and community analysis</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FullPageScrollytellingOptimized />} />
        <Route path="/platform" element={<PlatformHomepage />} />
        <Route path="/dashboard" element={<ProjectHub />} />
        <Route path="/admin" element={<IntegrationDashboard />} />
        <Route path="/community" element={<CommunityGatewayEnhanced />} />
        <Route path="/stories" element={<StoriesPageEnhanced />} />
        <Route path="/movement" element={<MovementIntroEnhanced />} />
        <Route path="/discussions" element={<JoinDiscussionEnhanced />} />
        <Route path="/reports" element={<HubReports />} />
        <Route path="/newsroom" element={<NewsroomEnhanced />} />
        <Route path="/events" element={<EventsPageIntegrated />} />
        <Route path="/ivor" element={<IVORInterfaceEnhanced />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/media/newsroom" element={<NewsroomPage />} />
        <Route path="/media/channel" element={<ChannelBLKOUTPage />} />
        <Route path="/media/storylab" element={<StorylabPage />} />
      </Routes>
    </Router>
  )
}

export default App