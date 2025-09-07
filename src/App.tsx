import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FaceSquareOverlay } from './components/FaceSquareOverlay'
import PlatformHomepage from './components/PlatformHomepage'
import AdminAuth from './components/AdminAuth'
import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <>
      {/* Face-cycling gif overlay - displays on all pages */}
      <FaceSquareOverlay size="lg" position="center" enableLazyLoad={false} />
      
      <Router>
        <Routes>
          <Route path="/" element={<PlatformHomepage />} />
          <Route path="/platform" element={<PlatformHomepage />} />
          <Route path="/stories" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Story Archive</h1></div>} />
          <Route path="/newsroom" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Newsroom</h1></div>} />
          <Route path="/events" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Events</h1></div>} />
          <Route path="/ivor" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">I.V.O.R. AI</h1></div>} />
          <Route path="/community" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Community</h1></div>} />
          <Route path="/governance" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Governance</h1></div>} />
          <Route path="/movement" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Movement</h1></div>} />
          <Route path="/admin" element={<AdminAuth><AdminDashboard /></AdminAuth>} />
        </Routes>
      </Router>
    </>
  )
}

export default App