import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FullPageScrollytelling from './components/blkout/FullPageScrollytelling'

// Placeholder components for existing navigation links
const NewsroomPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">BLKOUT Newsroom</h1>
      <p className="text-xl text-gray-300 mb-8">Community news and liberation analysis coming soon</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

const EventsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Community Events</h1>
      <p className="text-xl text-gray-300 mb-8">Black QTIPOC+ events calendar</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

const IVORPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">IVOR AI Assistant</h1>
      <p className="text-xl text-gray-300 mb-8">Community AI support system</p>
      <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</a>
    </div>
  </div>
)

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