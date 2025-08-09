import React from 'react'
import { motion } from 'framer-motion'
import { Download, Chrome, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react'

export default function ExtensionDownload() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Chrome className="w-16 h-16 text-indigo-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">BLKOUT Chrome Extension</h1>
          </div>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Submit content directly from news sites to the BLKOUT community moderation queue
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Download className="w-6 h-6 mr-3 text-indigo-400" />
              Download Options
            </h2>
            
            <div className="space-y-4">
              <div className="bg-indigo-900/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Complete Archive (Recommended)</h3>
                <a 
                  href="/downloads/blkout-extension-v1.0.1.tar.gz"
                  download
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download v1.0.1 (229KB)
                </a>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Individual Files</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Access individual extension files if extraction fails
                </p>
                <div className="space-y-2">
                  <a href="/downloads/extension-files/manifest.json" className="block text-indigo-400 hover:text-indigo-300 text-sm">
                    → manifest.json
                  </a>
                  <a href="/downloads/extension-files/popup/" className="block text-indigo-400 hover:text-indigo-300 text-sm">
                    → popup/ (HTML, JS, CSS)
                  </a>
                  <a href="/downloads/extension-files/background.js" className="block text-indigo-400 hover:text-indigo-300 text-sm">
                    → background.js
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-emerald-400" />
              Installation Steps
            </h2>
            
            <div className="space-y-4">
              {[
                'Download & extract the extension files',
                'Open Chrome → chrome://extensions/',
                'Enable "Developer mode" (top-right toggle)',
                'Click "Load unpacked" button',
                'Select the extracted extension folder',
                'Pin the BLKOUT icon to your toolbar'
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-emerald-400" />
            For Community Curators
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-950/50 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Admin Access</h3>
              <p className="text-emerald-100 text-sm mb-3">
                Password: <code className="bg-emerald-900/50 px-2 py-1 rounded">BLKOUT2025!</code>
              </p>
              <a 
                href="/admin/moderation" 
                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Moderation Dashboard <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            <div className="bg-emerald-950/50 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Content Pipeline</h3>
              <p className="text-emerald-100 text-sm mb-3">
                Extension → Moderation → Publishing
              </p>
              <a 
                href="/admin/newsroom" 
                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Newsroom Admin <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            <div className="bg-emerald-950/50 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Live Data</h3>
              <p className="text-emerald-100 text-sm">
                No more mock data - all submissions persist correctly with hybrid storage
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-300 mb-4">
              <strong>WSL2/Windows Firewall Note:</strong> If local file access is blocked, 
              use the web download links above or contact support.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <span>Version: 1.0.1</span>
              <span>•</span>
              <span>Size: 229KB</span>
              <span>•</span>
              <span>Updated: August 2025</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}