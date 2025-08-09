import React from 'react'
import { motion } from 'framer-motion'
import { Download, Chrome, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

export default function ExtensionDownloadSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Chrome className="w-12 h-12 text-indigo-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">BLKOUT Chrome Extension</h1>
          </div>
          <p className="text-lg text-indigo-200">
            Submit content directly from news sites to our community moderation queue
          </p>
        </motion.div>

        {/* Direct Download Links */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Download className="w-6 h-6 mr-3 text-indigo-400" />
            Download Extension (WSL2/Windows Compatible)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-indigo-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Complete Extension Archive</h3>
              <p className="text-indigo-200 mb-4">Download the full extension as a compressed archive (recommended)</p>
              
              <div className="grid gap-3">
                <a 
                  href={`${window.location.origin}/downloads/blkout-extension-v1.0.1.tar.gz`}
                  download
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download v1.0.1 (229KB) - Direct Link
                </a>
                
                <p className="text-sm text-indigo-300">
                  ⚠️ If the above link doesn't work due to routing issues, try these alternatives:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <a 
                    href="/public/downloads/blkout-extension-v1.0.1.tar.gz"
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Alternative Link 1
                  </a>
                  <a 
                    href="https://blkout-beta.vercel.app/downloads/blkout-extension-v1.0.1.tar.gz"
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Direct HTTPS Link
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Individual Extension Files</h3>
              <p className="text-slate-300 mb-4">Access each file separately if extraction fails</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  'manifest.json',
                  'background.js', 
                  'popup.html',
                  'popup.js',
                  'popup.css',
                  'detector.js',
                  'form-injector.js',
                  'icon16.png',
                  'icon48.png',
                  'icon128.png'
                ].map(filename => (
                  <a 
                    key={filename}
                    href={`/downloads/extension-files/${filename.includes('/') ? filename : filename}`}
                    className="text-indigo-400 hover:text-indigo-300 block"
                  >
                    → {filename}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🔧 Installation Steps</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span className="text-emerald-100">Download & extract the extension files</span>
              </div>
              <div className="flex items-start">
                <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span className="text-emerald-100">Open Chrome → chrome://extensions/</span>
              </div>
              <div className="flex items-start">
                <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span className="text-emerald-100">Enable "Developer mode" (top-right toggle)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <span className="text-emerald-100">Click "Load unpacked" button</span>
              </div>
              <div className="flex items-start">
                <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                <span className="text-emerald-100">Select the extracted extension folder</span>
              </div>
              <div className="flex items-start">
                <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">6</span>
                <span className="text-emerald-100">Pin BLKOUT icon to your Chrome toolbar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Curator Info */}
        <div className="bg-amber-900/30 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            👥 Community Curator Access
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                Admin Credentials
              </h3>
              <p className="text-amber-100 mb-2">
                <strong>Password:</strong> <code className="bg-amber-900/50 px-2 py-1 rounded font-mono">BLKOUT2025!</code>
              </p>
              <div className="space-y-2">
                <a href="/admin/moderation" className="block text-amber-400 hover:text-amber-300">
                  → Moderation Dashboard
                </a>
                <a href="/admin/newsroom" className="block text-amber-400 hover:text-amber-300">
                  → Newsroom Admin
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                What's Working
              </h3>
              <ul className="text-amber-100 text-sm space-y-1">
                <li>✅ Real data persistence (no mock data)</li>
                <li>✅ Extension → Moderation → Publishing pipeline</li>
                <li>✅ Admin dashboards with live data</li>
                <li>✅ Community submissions working</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-slate-400">
          <p><strong>Version:</strong> 1.0.1 | <strong>Size:</strong> 229KB | <strong>Updated:</strong> August 2025</p>
          <p className="flex items-center justify-center mt-2">
            <AlertCircle className="w-4 h-4 mr-1" />
            WSL2/Windows compatible - uses direct HTTPS downloads
          </p>
        </div>
      </div>
    </div>
  )
}