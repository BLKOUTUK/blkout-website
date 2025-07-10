import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, TrendingUp, Archive } from 'lucide-react'

/**
 * MovementPage - Movement reports, analysis, and cooperative ownership content
 * Designed for quarterly updates and movement building insights
 */

// Sub-components for different movement content types
const MovementReports = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Movement Reports</h2>
    
    {/* Featured Report */}
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <span className="inline-block bg-blkout-secondary text-white text-xs px-3 py-1 rounded-full mb-4">
        LATEST REPORT
      </span>
      <h3 className="text-2xl font-bold text-white mb-4">Q4 2024: Community Building Progress</h3>
      <p className="text-gray-200 mb-6">
        Our quarterly analysis of cooperative ownership initiatives, community growth, and movement building efforts across the UK Black queer community.
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">Published: December 2024</span>
        <Link 
          to="/movement/reports/q4-2024"
          className="bg-white text-blkout-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Read Report
        </Link>
      </div>
    </div>

    {/* Report Archive */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
        <h4 className="font-semibold text-white mb-2">Q3 2024: Digital Sovereignty</h4>
        <p className="text-gray-300 text-sm mb-4">
          Analysis of community-owned digital infrastructure and platform cooperatives.
        </p>
        <Link to="/movement/reports/q3-2024" className="text-blkout-secondary hover:underline text-sm">
          Read Report →
        </Link>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
        <h4 className="font-semibold text-white mb-2">Q2 2024: Mutual Aid Networks</h4>
        <p className="text-gray-300 text-sm mb-4">
          How cooperative principles strengthen community support systems.
        </p>
        <Link to="/movement/reports/q2-2024" className="text-blkout-secondary hover:underline text-sm">
          Read Report →
        </Link>
      </div>
    </div>
  </div>
)

const MovementAnalysis = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Movement Analysis</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <TrendingUp className="h-8 w-8 text-blkout-secondary mb-4" />
        <h3 className="text-xl font-semibold text-white mb-4">Community Growth Trends</h3>
        <p className="text-gray-200 mb-4">
          Analyzing patterns in community engagement and cooperative ownership adoption.
        </p>
        <Link to="/movement/analysis/growth-trends" className="text-blkout-secondary hover:underline">
          View Analysis →
        </Link>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <BookOpen className="h-8 w-8 text-blkout-secondary mb-4" />
        <h3 className="text-xl font-semibold text-white mb-4">Cooperative Models</h3>
        <p className="text-gray-200 mb-4">
          Exploring different approaches to community ownership and democratic governance.
        </p>
        <Link to="/movement/analysis/cooperative-models" className="text-blkout-secondary hover:underline">
          Explore Models →
        </Link>
      </div>
    </div>
  </div>
)

const MovementArchive = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Movement Archive</h2>
    
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <Archive className="h-12 w-12 text-blkout-secondary mb-6" />
      <h3 className="text-2xl font-semibold text-white mb-4">Historical Movement Documents</h3>
      <p className="text-gray-200 mb-6">
        Access to our complete archive of movement reports, strategic documents, and community decisions dating back to BLKOUT's founding.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">2024 Reports</h4>
          <p className="text-gray-300 text-sm">4 quarterly reports</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">2023 Archive</h4>
          <p className="text-gray-300 text-sm">Founding documents</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Strategic Plans</h4>
          <p className="text-gray-300 text-sm">Multi-year frameworks</p>
        </div>
      </div>
    </div>
  </div>
)

// Main Movement Page Component
export default function MovementPage() {
  const location = useLocation()
  const isMainPage = location.pathname === '/movement'

  if (isMainPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-white hover:text-blkout-secondary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-white font-bold text-xl">Movement</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our Movement
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Reports, analysis, and strategic insights on Black queer liberation and cooperative ownership.
            </p>
          </motion.div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Link 
                to="/movement/reports"
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all group"
              >
                <BookOpen className="h-12 w-12 text-blkout-secondary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-2xl mb-4">Reports</h3>
                <p className="text-gray-300 mb-6">
                  Quarterly movement reports and community progress updates
                </p>
                <div className="flex items-center text-blkout-secondary">
                  View Reports <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link 
                to="/movement/analysis"
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all group"
              >
                <TrendingUp className="h-12 w-12 text-blkout-secondary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-2xl mb-4">Analysis</h3>
                <p className="text-gray-300 mb-6">
                  Strategic analysis and cooperative ownership insights
                </p>
                <div className="flex items-center text-blkout-secondary">
                  Explore Analysis <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link 
                to="/movement/archive"
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all group"
              >
                <Archive className="h-12 w-12 text-blkout-secondary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-2xl mb-4">Archive</h3>
                <p className="text-gray-300 mb-6">
                  Historical documents and movement evolution
                </p>
                <div className="flex items-center text-blkout-secondary">
                  Browse Archive <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/movement" className="text-white hover:text-blkout-secondary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <nav className="flex items-center space-x-4 text-sm">
              <Link to="/movement" className="text-gray-300 hover:text-white transition-colors">
                Movement
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-white capitalize">
                {location.pathname.split('/').pop()}
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Sub-page Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Routes>
          <Route path="reports/*" element={<MovementReports />} />
          <Route path="analysis/*" element={<MovementAnalysis />} />
          <Route path="archive" element={<MovementArchive />} />
        </Routes>
      </main>
    </div>
  )
}