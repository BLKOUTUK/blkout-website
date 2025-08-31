import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-emerald-950">
      <div className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-6xl font-black text-white mb-8 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            BLKOUT
          </span>
          <br />
          Community Platform
        </h1>
        
        <p className="text-xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          🚨 DEMONSTRATION SITE: Speculative platform capabilities showcase.
          NOT a real community platform - built to show potential technical architecture.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <a
            href="/newsroom"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Newsroom
          </a>
          
          <a
            href="/events"
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Events
          </a>
          
          <a
            href="https://blkoutnxt-ivor-frontend.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Chat with IVOR
          </a>
        </div>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Phase 1 Complete</h2>
          <p className="text-gray-300">
            Functional color delineation system implemented with liberation-focused design
          </p>
        </div>
      </div>
    </div>
  )
}

export default App