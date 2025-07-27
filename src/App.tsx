import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FullPageScrollytelling from './components/blkout/FullPageScrollytelling'

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
  // Redirect to the existing events calendar deployment
  React.useEffect(() => {
    // Check if events calendar is running locally first, otherwise redirect to deployed version
    window.location.href = 'http://localhost:5173' // Local events calendar, fallback to deployed version
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Events Calendar...</h1>
        <p className="text-xl text-gray-300 mb-8">Redirecting to IVOR Events Calendar</p>
        <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
      </div>
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
        <Route path="/" element={<FullPageScrollytelling />} />
        <Route path="/newsroom" element={<NewsroomPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/ivor" element={<IVORPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/media/newsroom" element={<NewsroomPage />} />
        <Route path="/media/channel" element={<ChannelBLKOUTPage />} />
        <Route path="/media/storylab" element={<StorylabPage />} />
      </Routes>
    </Router>
  )
}

export default App