import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlatformHomepage from './components/PlatformHomepage'
import AdminAuth from './components/admin/AdminAuth'
import AdminDashboard from './components/AdminDashboard'
import ModerationDashboard from './components/admin/ModerationDashboard'
import ContentSubmissionForm from './components/ContentSubmissionForm'
import NewsroomPage from './components/NewsroomPage'
import StoryArchivePage from './components/StoryArchivePage'
import EventsPage from './components/EventsPage'
import GovernancePage from './components/GovernancePage'

const IvorRedirect = () => {
  React.useEffect(() => {
    window.location.href = 'https://ivor-beta.vercel.app/'
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to I.V.O.R. AI...</h1>
        <p className="text-gray-400">You'll be redirected to our AI assistant in a moment</p>
      </div>
    </div>
  )
}

const MovementRedirect = () => {
  React.useEffect(() => {
    window.location.href = 'https://blkout-scrollytelling.vercel.app/'
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to Liberation Journey...</h1>
        <p className="text-gray-400">Experience our interactive scrollytelling movement narrative</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<PlatformHomepage />} />
          <Route path="/platform" element={<PlatformHomepage />} />
          <Route path="/stories" element={<StoryArchivePage />} />
          <Route path="/newsroom" element={<NewsroomPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/ivor" element={<IvorRedirect />} />
          <Route path="/community" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-4xl">Community</h1></div>} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/movement" element={<MovementRedirect />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuth><AdminDashboard /></AdminAuth>} />
          <Route path="/admin/moderation" element={<AdminAuth><ModerationDashboard /></AdminAuth>} />
          <Route path="/submit" element={<ContentSubmissionForm />} />
        </Routes>
    </Router>
  )
}

export default App