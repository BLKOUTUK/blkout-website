import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import FullPageScrollytelling from './FullPageScrollytelling'
import IntegrationDashboard from './IntegrationDashboard'

const HomeSelector: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'selector' | 'scrollytelling' | 'integrations'>('selector')

  if (selectedView === 'scrollytelling') {
    return (
      <div>
        <button 
          onClick={() => setSelectedView('selector')}
          className="fixed top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
        >
          ← Back to Menu
        </button>
        <FullPageScrollytelling />
      </div>
    )
  }

  if (selectedView === 'integrations') {
    return (
      <div>
        <button 
          onClick={() => setSelectedView('selector')}
          className="fixed top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
        >
          ← Back to Menu
        </button>
        <IntegrationDashboard />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            BLKOUT UK
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Black Queer Men's Liberation Through Technology
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose your entry point into our liberation technology ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setSelectedView('scrollytelling')}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Liberation Journey</h2>
              <p className="text-gray-300 mb-6">
                Experience our interactive scrollytelling with questioning slides, IVOR AI integration, and community pathways
              </p>
              <div className="text-sm text-blue-400 space-y-1">
                <div>✨ Logo → Video → Black? Queer? Male? slides</div>
                <div>🤖 IVOR AI showcase and interaction</div>
                <div>🎯 Personalized pathway discovery</div>
                <div>🔗 BLKOUTHUB community access</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setSelectedView('integrations')}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Integration Hub</h2>
              <p className="text-gray-300 mb-6">
                Real-time dashboard for N8N automation workflows, Composio platform integrations, and community analytics
              </p>
              <div className="text-sm text-purple-400 space-y-1">
                <div>⚡ N8N workflow monitoring</div>
                <div>🔧 Composio 250+ tool integrations</div>
                <div>📊 Community liberation metrics</div>
                <div>🚀 IVOR system status</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-500 text-sm">
            Both experiences showcase the full week of development work and sophisticated BLKOUT ecosystem
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default HomeSelector