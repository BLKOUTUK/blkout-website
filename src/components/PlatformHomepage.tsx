import React from 'react'
import { Link } from 'react-router-dom'

const PlatformHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            BLKOUT
          </h1>
          <h2 className="text-2xl mb-8 text-gray-300">
            Community Platform for Black Queer Liberation
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Building community power through cooperative democracy, storytelling, and collective action.
          </p>
        </div>

        {/* Core Ecosystem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link to="/stories" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Story Archive</h3>
              <p className="text-gray-400">Complete archive of community stories and analysis</p>
            </div>
          </Link>

          <Link to="/newsroom" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-xl font-bold mb-2">Newsroom</h3>
              <p className="text-gray-400">Latest news, updates and community journalism</p>
            </div>
          </Link>

          <Link to="/events" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">Events</h3>
              <p className="text-gray-400">Community events and activism calendar</p>
            </div>
          </Link>

          <Link to="/ivor" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">I.V.O.R.</h3>
              <p className="text-gray-400">AI assistant and resource finder</p>
            </div>
          </Link>

          <Link to="/community" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-400">Connect with community members and discussions</p>
            </div>
          </Link>

          <Link to="/governance" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-2">Governance</h3>
              <p className="text-gray-400">Democratic decision-making and cooperative ownership</p>
            </div>
          </Link>

          <Link to="/movement" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">✊</div>
              <h3 className="text-xl font-bold mb-2">Movement</h3>
              <p className="text-gray-400">Our principles and community values</p>
            </div>
          </Link>

          <a href="https://blkoutnxtchannel.carrd.co" target="_blank" rel="noopener noreferrer" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold mb-2">Media Hub</h3>
              <p className="text-gray-400">Video content and community media</p>
            </div>
          </a>
        </div>

        {/* Social Media Links */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://twitter.com/blkoutuk" target="_blank" rel="noopener noreferrer" 
               className="text-blue-400 hover:text-blue-300 text-2xl transition-colors">
              🐦 Twitter
            </a>
            <a href="https://instagram.com/blkoutuk" target="_blank" rel="noopener noreferrer"
               className="text-pink-400 hover:text-pink-300 text-2xl transition-colors">
              📸 Instagram
            </a>
            <a href="https://linkedin.com/company/blkoutuk" target="_blank" rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-500 text-2xl transition-colors">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformHomepage