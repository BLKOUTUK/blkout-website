import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, BookOpen, Users, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '../lib/constants'

/**
 * HomePage - Bento box layout with lots of whitespace
 * Clean, minimal design for returning visitors
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-black font-bold text-xl">
              {SITE_CONFIG.name}
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/movement" className="text-gray-600 hover:text-black transition-colors font-medium">
                Movement
              </Link>
              <Link to="/media" className="text-gray-600 hover:text-black transition-colors font-medium">
                Media
              </Link>
              <Link to="/events" className="text-gray-600 hover:text-black transition-colors font-medium">
                Events
              </Link>
              <Link to="/resources" className="text-gray-600 hover:text-black transition-colors font-medium">
                Resources
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Bento Layout */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
            Welcome Back
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Your hub for community connection, movement building, and collective liberation.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8 mb-20">
          {/* Large Movement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="col-span-12 lg:col-span-8"
          >
            <Link 
              to="/movement"
              className="block bg-gray-50 rounded-2xl p-12 hover:bg-gray-100 transition-all group h-full"
            >
              <BookOpen className="h-12 w-12 text-blkout-primary mb-8 group-hover:scale-105 transition-transform" />
              <h2 className="text-3xl font-bold text-black mb-4">Movement Reports</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Quarterly analysis, strategic insights, and community building progress across the UK Black queer liberation movement.
              </p>
              <div className="flex items-center text-blkout-primary font-medium">
                View Latest Reports <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </Link>
          </motion.div>

          {/* Media Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="col-span-12 lg:col-span-4"
          >
            <Link 
              to="/media"
              className="block bg-blkout-secondary/10 rounded-2xl p-8 hover:bg-blkout-secondary/20 transition-all group h-full"
            >
              <MessageCircle className="h-10 w-10 text-blkout-secondary mb-6 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold text-black mb-3">Media Hub</h3>
              <p className="text-gray-600 mb-6">
                Stories, newsroom, and community media
              </p>
              <div className="flex items-center text-blkout-secondary font-medium">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </motion.div>

          {/* Events Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="col-span-12 md:col-span-6"
          >
            <Link 
              to="/events"
              className="block bg-blkout-accent/10 rounded-2xl p-8 hover:bg-blkout-accent/20 transition-all group h-full"
            >
              <Calendar className="h-10 w-10 text-blkout-accent mb-6 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold text-black mb-3">Community Events</h3>
              <p className="text-gray-600 mb-6">
                Workshops, gatherings, and collective actions
              </p>
              <div className="flex items-center text-blkout-accent font-medium">
                See Calendar <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </motion.div>

          {/* Resources Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="col-span-12 md:col-span-6"
          >
            <Link 
              to="/resources"
              className="block bg-blkout-warm/10 rounded-2xl p-8 hover:bg-blkout-warm/20 transition-all group h-full"
            >
              <Users className="h-10 w-10 text-blkout-warm mb-6 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold text-black mb-3">Resources</h3>
              <p className="text-gray-600 mb-6">
                Knowledge base and community toolkit
              </p>
              <div className="flex items-center text-blkout-warm font-medium">
                Browse Tools <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Recent Activity Bento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-12 gap-8 mb-20"
        >
          {/* Latest Report */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-gray-50 rounded-2xl p-10">
              <h2 className="text-2xl font-bold text-black mb-8">Latest Movement Report</h2>
              <div className="bg-white rounded-xl p-6">
                <span className="inline-block bg-blkout-primary text-white text-xs px-3 py-1 rounded-full mb-4 font-medium">
                  Q4 2024
                </span>
                <h4 className="text-lg font-semibold text-black mb-3">Community Building Progress</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Quarterly analysis of cooperative ownership initiatives and community growth across the UK Black queer liberation movement.
                </p>
                <Link 
                  to="/movement/reports/q4-2024"
                  className="inline-flex items-center text-blkout-primary font-medium hover:underline"
                >
                  Read Full Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-black mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blkout-secondary pl-4">
                  <h4 className="font-medium text-black text-sm">Community Workshop</h4>
                  <p className="text-gray-500 text-xs">Jan 15 • Cooperative ownership basics</p>
                </div>
                <div className="border-l-4 border-blkout-accent pl-4">
                  <h4 className="font-medium text-black text-sm">Movement Strategy</h4>
                  <p className="text-gray-500 text-xs">Jan 20 • Monthly planning session</p>
                </div>
                <div className="border-l-4 border-blkout-warm pl-4">
                  <h4 className="font-medium text-black text-sm">Digital Security</h4>
                  <p className="text-gray-500 text-xs">Feb 1 • Online safety workshop</p>
                </div>
              </div>
              <Link 
                to="/events"
                className="inline-flex items-center text-blkout-primary font-medium mt-6 hover:underline"
              >
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* BLKOUTHUB Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-black rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Deeper Engagement?</h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            UK-based Black Queer Men can access our digital community platform for deeper connection and collaboration.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Access BLKOUTHUB
          </button>
        </motion.div>
      </main>
    </div>
  )
}