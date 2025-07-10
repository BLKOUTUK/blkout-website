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
    <div className="min-h-screen bg-indigo-950">
      {/* Luxe Header */}
      <header className="border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/BLKOUTpride2025.png" 
                alt="BLKOUT UK" 
                className="h-20 w-auto opacity-90"
              />
              <Link to="/" className="text-white font-bold text-xl tracking-wide">
                {SITE_CONFIG.name}
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/movement" className="text-indigo-200 hover:text-white transition-colors font-medium tracking-wide">
                Movement
              </Link>
              <Link to="/media" className="text-indigo-200 hover:text-white transition-colors font-medium tracking-wide">
                Media
              </Link>
              <Link to="/events" className="text-indigo-200 hover:text-white transition-colors font-medium tracking-wide">
                Events
              </Link>
              <Link to="/resources" className="text-indigo-200 hover:text-white transition-colors font-medium tracking-wide">
                Resources
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Bento Layout */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Welcome Section - Oversized Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-none tracking-tight">
            WELCOME
            <span className="block text-pink-400">BACK</span>
          </h1>
          <p className="text-2xl text-indigo-200 max-w-3xl leading-relaxed font-light">
            Your hub for community connection, movement building, and collective liberation.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8 mb-20">
          {/* Large Media Card - Cyan Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="col-span-12 lg:col-span-8"
          >
            <Link 
              to="/media"
              className="block bg-indigo-900 rounded-2xl p-12 hover:bg-indigo-800 transition-all group h-full border-l-8 border-cyan-400 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400 rounded-full -translate-y-6 translate-x-6"></div>
              <MessageCircle className="h-12 w-12 text-cyan-400 mb-8 group-hover:scale-105 transition-transform" />
              <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">What's Fresh</h2>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                Your daily dose of stories, breaking news, and community voices. Because staying informed never felt this good.
              </p>
              <div className="flex items-center text-cyan-400 font-medium">
                Check What's New <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </Link>
          </motion.div>

          {/* Movement Card - Yellow Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="col-span-12 lg:col-span-4"
          >
            <Link 
              to="/movement"
              className="block bg-indigo-900 rounded-2xl p-8 hover:bg-indigo-800 transition-all group h-full border-t-4 border-yellow-400"
            >
              <BookOpen className="h-10 w-10 text-yellow-400 mb-6 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Movement Intel</h3>
              <p className="text-indigo-200 mb-6">
                The strategic insights you need to stay ahead
              </p>
              <div className="flex items-center text-yellow-400 font-medium">
                Get Briefed <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </motion.div>

          {/* Events Card - Tennis Ball Green Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="col-span-12 md:col-span-6"
          >
            <Link 
              to="/events"
              className="block bg-indigo-900 rounded-2xl p-8 hover:bg-indigo-800 transition-all group h-full border-t-4 border-lime-400"
            >
              <Calendar className="h-10 w-10 text-lime-400 mb-6 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Where We Connect</h3>
              <p className="text-indigo-200 mb-6">
                Real spaces, real faces. The gatherings that actually matter.
              </p>
              <div className="flex items-center text-lime-400 font-medium">
                See What's On <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </motion.div>

          {/* Resources Card - Electric Pink Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="col-span-12 md:col-span-6"
          >
            <Link 
              to="/resources"
              className="block bg-indigo-900 rounded-2xl p-8 hover:bg-indigo-800 transition-all group h-full relative"
            >
              <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-400"></div>
              <Users className="h-10 w-10 text-pink-400 mb-6 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Your Toolkit</h3>
              <p className="text-indigo-200 mb-6">
                Everything you need to level up. We've got you covered.
              </p>
              <div className="flex items-center text-pink-400 font-medium">
                Get Equipped <ArrowRight className="ml-2 h-4 w-4" />
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
            <div className="bg-indigo-900 rounded-2xl p-10 border-l-4 border-yellow-400">
              <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">Latest Movement Report</h2>
              <div className="bg-indigo-800 rounded-xl p-6">
                <span className="inline-block bg-yellow-400 text-indigo-950 text-xs px-3 py-1 rounded-full mb-4 font-medium">
                  Q4 2024
                </span>
                <h4 className="text-lg font-semibold text-white mb-3">Community Building Progress</h4>
                <p className="text-indigo-200 mb-6 leading-relaxed">
                  Quarterly analysis of cooperative ownership initiatives and community growth across the UK Black queer liberation movement.
                </p>
                <Link 
                  to="/movement/reports/q4-2024"
                  className="inline-flex items-center text-yellow-400 font-medium hover:underline"
                >
                  Read Full Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-indigo-900 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-lime-400 rounded-full -translate-y-6 translate-x-6"></div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-cyan-400 pl-4">
                  <h4 className="font-medium text-white text-sm">Community Workshop</h4>
                  <p className="text-indigo-200 text-xs">Jan 15 • Cooperative ownership basics</p>
                </div>
                <div className="border-l-4 border-pink-400 pl-4">
                  <h4 className="font-medium text-white text-sm">Movement Strategy</h4>
                  <p className="text-indigo-200 text-xs">Jan 20 • Monthly planning session</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-medium text-white text-sm">Digital Security</h4>
                  <p className="text-indigo-200 text-xs">Feb 1 • Online safety workshop</p>
                </div>
              </div>
              <Link 
                to="/events"
                className="inline-flex items-center text-lime-400 font-medium mt-6 hover:underline"
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
          className="bg-black rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-pink-400 rounded-full -translate-y-16 -translate-x-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-400 rounded-full translate-y-12 translate-x-12"></div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">Ready for Deeper Engagement?</h2>
          <p className="text-indigo-200 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            UK-based Black Queer Men can access our digital community platform for deeper connection and collaboration.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-cyan-400 hover:text-white transition-colors">
            Access BLKOUTHUB
          </button>
        </motion.div>
      </main>
    </div>
  )
}