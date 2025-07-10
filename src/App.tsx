import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import SimpleScrollytelling from './components/blkout/SimpleScrollytelling'
import IvorChatbot from './components/blkout/IvorChatbot'

// Import future page components
import HomePage from './pages/HomePage'
import MovementPage from './pages/MovementPage' 
import MediaPage from './pages/MediaPage'
import EventsPage from './pages/EventsPage'
import ResourcesPage from './pages/ResourcesPage'

function App() {
  return (
    <div className="min-h-screen">
      {/* Routes */}
      <Routes>
        {/* Landing page - Scrollytelling introduction */}
        <Route path="/" element={<SimpleScrollytelling />} />
        
        {/* Traditional homepage for returning visitors */}
        <Route path="/home" element={<HomePage />} />
        
        {/* Content areas */}
        <Route path="/movement/*" element={<MovementPage />} />
        <Route path="/media/*" element={<MediaPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources/*" element={<ResourcesPage />} />
      </Routes>
      
      {/* IVOR Chatbot - Available on all pages */}
      <IvorChatbot />
    </div>
  )
}

export default App