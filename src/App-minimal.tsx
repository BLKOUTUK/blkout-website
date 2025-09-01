import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'

// Import extension API first (this was in original)
import './services/extensionApi'

// Import safe components
import EcosystemNavigationHub from './components/EcosystemNavigationHub'

// Simple skip navigation component
const SkipNavigation = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-blue-600 text-white px-4 py-2"
  >
    Skip to main content
  </a>
)

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation()
  
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}
function App() {
  return (
    <Router>
      <SkipNavigation />
      <ScrollToTop />
      <EcosystemNavigationHub />
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-emerald-950">
        <div className="max-w-6xl mx-auto px-8 py-20 text-center">
          <h1 className="text-6xl font-black text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
              BLKOUT
            </span>
            <br />
            Community Platform
          </h1>
          
          <p className="text-xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            A community-owned platform for Black queer liberation, cooperative ownership, and democratic governance.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link
              to="/newsroom"
              className="px-8 py-4 bg-gradient-to-r from-slate-600 to-blue-600 text-white font-bold rounded-full hover:from-slate-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📰 Newsroom
            </Link>
            
            <Link
              to="/events"
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📅 Events
            </Link>
            
            <Link
              to="/governance"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🏛️ Governance
            </Link>
            
            <a
              href="https://ivor-blkout.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🤖 Chat with IVOR
            </a>
          </div>

          <Routes>
            <Route path="/" element={
              <div className="text-white mt-8">
                <h2 className="text-2xl font-bold mb-4">Our Values</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <div className="text-4xl mb-4">🏳️‍⚧️</div>
                    <h3 className="text-xl font-bold text-white mb-2">Trans Liberation</h3>
                    <p className="text-gray-300">Centering trans joy and safety in all we do</p>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-xl font-bold text-white mb-2">Cooperative Ownership</h3>
                    <p className="text-gray-300">Community-owned, democratically governed</p>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-lg">
                    <div className="text-4xl mb-4">✊🏿</div>
                    <h3 className="text-xl font-bold text-white mb-2">Black Power</h3>
                    <p className="text-gray-300">Liberation through collective action</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="/newsroom" element={<div className="text-white">Newsroom page placeholder</div>} />
            <Route path="/events" element={<div className="text-white">Events page placeholder</div>} />
            <Route path="/governance" element={<div className="text-white">Governance page placeholder</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App