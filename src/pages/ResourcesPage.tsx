import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Book, Tool, Guide } from 'lucide-react'

/**
 * ResourcesPage - Knowledge base, toolkit, and community guides
 */

const KnowledgeBase = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Knowledge Base</h2>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <h3 className="text-xl font-semibold text-white mb-4">Community Knowledge Library</h3>
      <p className="text-gray-200 mb-6">
        Curated resources on cooperative ownership, community organizing, and Black queer liberation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Cooperative Basics</h4>
          <p className="text-gray-300 text-sm">Understanding cooperative principles and structures</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Organizing Strategies</h4>
          <p className="text-gray-300 text-sm">Community organizing tools and methodologies</p>
        </div>
      </div>
    </div>
  </div>
)

const Toolkit = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Community Toolkit</h2>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <h3 className="text-xl font-semibold text-white mb-4">Practical Tools & Templates</h3>
      <p className="text-gray-200 mb-6">
        Ready-to-use resources for community building and cooperative development.
      </p>
    </div>
  </div>
)

const Guides = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Community Guides</h2>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <h3 className="text-xl font-semibold text-white mb-4">Step-by-Step Guides</h3>
      <p className="text-gray-200 mb-6">
        Comprehensive guides for community members at all experience levels.
      </p>
    </div>
  </div>
)

export default function ResourcesPage() {
  const location = useLocation()
  const isMainPage = location.pathname === '/resources'

  if (isMainPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-white hover:text-blkout-secondary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-white font-bold text-xl">Resources</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Resources
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Knowledge base, toolkit, and guides for community building and cooperative ownership.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Link 
                to="/resources/knowledge-base"
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all group"
              >
                <Book className="h-12 w-12 text-blkout-secondary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-2xl mb-4">Knowledge Base</h3>
                <p className="text-gray-300">
                  Curated library of community knowledge and resources
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link 
                to="/resources/toolkit"
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all group"
              >
                <Tool className="h-12 w-12 text-blkout-secondary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-2xl mb-4">Toolkit</h3>
                <p className="text-gray-300">
                  Practical tools and templates for organizing
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link 
                to="/resources/guides"
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all group"
              >
                <Guide className="h-12 w-12 text-blkout-secondary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-2xl mb-4">Guides</h3>
                <p className="text-gray-300">
                  Step-by-step community building guides
                </p>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/resources" className="text-white hover:text-blkout-secondary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <nav className="flex items-center space-x-4 text-sm">
              <Link to="/resources" className="text-gray-300 hover:text-white transition-colors">
                Resources
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-white capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ')}
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Routes>
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="toolkit" element={<Toolkit />} />
          <Route path="guides" element={<Guides />} />
        </Routes>
      </main>
    </div>
  )
}