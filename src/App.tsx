import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlatformHomepage from './components/PlatformHomepage'
import AdminAuth from './components/admin/AdminAuth'
import AdminDashboard from './components/AdminDashboard'
import ModerationDashboard from './components/admin/ModerationDashboard'
import ContentSubmissionForm from './components/ContentSubmissionForm'
import NewsroomPage from './components/NewsroomPage'
import StoryArchivePage from './components/StoryArchivePage'
import GovernancePage from './components/GovernancePage'
import CommunityShowcasePage from './pages/CommunityShowcasePage'
import TheoryOfChange from './components/movement/TheoryOfChangeMasonry'

const IvorRedirect = () => {
  React.useEffect(() => {
    window.location.href = 'https://ivor.blkoutuk.cloud/'
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

// MovementRedirect removed - now using TheoryOfChange component

const EventsRedirect = () => {
  React.useEffect(() => {
    window.location.href = 'https://events.blkoutuk.cloud/'
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to BLKOUT Connect...</h1>
        <p className="text-gray-400">Where Black Queer Magic Happens</p>
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
          <Route path="/events" element={<EventsRedirect />} />
          <Route path="/ivor" element={<IvorRedirect />} />
          <Route path="/community" element={<CommunityShowcasePage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/movement" element={<TheoryOfChange />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuth><AdminDashboard /></AdminAuth>} />
          <Route path="/admin/moderation" element={<AdminAuth><ModerationDashboard /></AdminAuth>} />
          <Route path="/submit" element={<ContentSubmissionForm />} />
        </Routes>
    </Router>
  )
}

export default App