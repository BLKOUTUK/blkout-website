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
            
            <a
              href="https://events-blkout.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📅 Events
            </a>
            
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
            
            <a
              href="https://journey-blkout.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-full hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📖 Liberation Journey
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
            <Route path="/newsroom" element={
              <div className="text-white min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl font-bold mb-8">📰 Community Newsroom</h1>
                  <div className="bg-white/10 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Stories from the Liberation Movement</h2>
                    <p className="text-gray-300 mb-4">
                      Our newsroom amplifies Black queer voices and community organizing victories across the UK.
                      Real stories, real people, real change.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded p-4">
                        <h3 className="font-bold text-lg">Manchester Trans Collective Wins Housing Victory</h3>
                        <p className="text-gray-400 text-sm">Community organizing secures affordable trans-friendly housing</p>
                      </div>
                      <div className="bg-white/5 rounded p-4">
                        <h3 className="font-bold text-lg">Bristol Cooperative Cafe Launch</h3>
                        <p className="text-gray-400 text-sm">Worker-owned space centering Black queer community</p>
                      </div>
                    </div>
                    <Link to="/" className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      ← Back to Main Platform
                    </Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/events" element={
              <div className="text-white min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950 p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl font-bold mb-8">📅 Community Events</h1>
                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="text-gray-300 mb-4">
                      This page redirects to our live events calendar. 
                      <a href="https://events-blkout.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline ml-1">
                        Visit Events Calendar →
                      </a>
                    </p>
                    <Link to="/" className="inline-block mt-6 px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                      ← Back to Main Platform
                    </Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/governance" element={
              <div className="text-white min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950 p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl font-bold mb-8">🏛️ Democratic Governance</h1>
                  <div className="bg-white/10 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Community-Owned Decision Making</h2>
                    <p className="text-gray-300 mb-6">
                      BLKOUT operates on principles of cooperative ownership and democratic governance. 
                      Every community member has a voice in platform decisions.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white/5 rounded p-4">
                        <h3 className="font-bold text-lg mb-2">🗳️ Current Votes</h3>
                        <p className="text-gray-400 text-sm">Platform feature priorities, content guidelines, partnership decisions</p>
                      </div>
                      <div className="bg-white/5 rounded p-4">
                        <h3 className="font-bold text-lg mb-2">📋 Proposals</h3>
                        <p className="text-gray-400 text-sm">Submit ideas for platform improvements and community initiatives</p>
                      </div>
                      <div className="bg-white/5 rounded p-4">
                        <h3 className="font-bold text-lg mb-2">👥 Committees</h3>
                        <p className="text-gray-400 text-sm">Safety, Content, Tech, and Community Organizing working groups</p>
                      </div>
                      <div className="bg-white/5 rounded p-4">
                        <h3 className="font-bold text-lg mb-2">📊 Transparency</h3>
                        <p className="text-gray-400 text-sm">Open budget, decision logs, and community impact reports</p>
                      </div>
                    </div>
                    <Link to="/" className="inline-block mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                      ← Back to Main Platform
                    </Link>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App