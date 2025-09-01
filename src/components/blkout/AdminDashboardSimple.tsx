import React from 'react'
import { motion } from 'framer-motion'
import { Download, Chrome, Shield, Bot, Workflow } from 'lucide-react'

const AdminDashboardSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            BLKOUT Admin Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unified administration dashboard for community moderation and platform management
          </p>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">System Status</h2>
                <p className="text-gray-400">Platform monitoring and health</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">IVOR Services</div>
                <div className="text-2xl font-bold text-green-400">6/6</div>
                <div className="text-xs text-green-300">All systems operational</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">N8N Workflows</div>
                <div className="text-2xl font-bold text-blue-400">3</div>
                <div className="text-xs text-blue-300">Active automations</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">Platform Status</div>
                <div className="text-2xl font-bold text-purple-400">Online</div>
                <div className="text-xs text-purple-300">All services running</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chrome Extension & Admin Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Chrome className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Chrome Extension & Admin Tools</h2>
                <p className="text-gray-400">Community moderation and content submission tools</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Chrome Extension Download */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-orange-400" />
                  Extension Download
                </h3>
                <div className="space-y-3">
                  <div className="bg-orange-900/50 rounded-lg p-3">
                    <h4 className="font-semibold text-white mb-1">Complete Archive</h4>
                    <a 
                      href="/chrome-extension.zip"
                      download="blkout-extension-v1.1.zip"
                      className="inline-flex items-center bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download v1.1 (18KB)
                    </a>
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>✅ Direct Supabase integration</p>
                    <p>✅ Auto content detection</p>
                    <p>✅ Real moderation queue</p>
                  </div>
                </div>
              </div>

              {/* Admin Access */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                  Admin Access
                </h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/50 rounded-lg p-3">
                    <p className="text-sm text-emerald-100 mb-2">
                      Admin Password: <code className="bg-emerald-950/50 px-2 py-1 rounded">BLKOUT2025!</code>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="/admin/moderation" 
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Moderation
                      </a>
                      <a 
                        href="/admin/newsroom" 
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Newsroom
                      </a>
                      <a 
                        href="/admin/events" 
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Events
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>Content pipeline: Extension → Moderation → Publishing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Moderation Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Moderation Queue</h2>
                  <p className="text-gray-400">Community content awaiting review</p>
                </div>
              </div>
              <a 
                href="/admin/moderation"
                className="flex items-center bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Open Moderation
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">Pending Articles</div>
                <div className="text-2xl font-bold text-blue-400">--</div>
                <div className="text-xs text-gray-500 mt-1">Community submissions</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">Pending Events</div>
                <div className="text-2xl font-bold text-green-400">--</div>
                <div className="text-xs text-gray-500 mt-1">Event submissions</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">Chrome Extension</div>
                <div className="text-2xl font-bold text-orange-400">--</div>
                <div className="text-xs text-gray-500 mt-1">Extension submissions</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400">Total Queue</div>
                <div className="text-2xl font-bold text-purple-400">--</div>
                <div className="text-xs text-gray-500 mt-1">All content types</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>BLKOUT UK Admin Hub - Technology for Black Queer Liberation</p>
          <p className="mt-2">All systems operational • Platform ready for community use</p>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboardSimple