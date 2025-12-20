'use client'

import { motion } from 'framer-motion'
import { Mail, Twitter, Instagram, Youtube, Github, ExternalLink, Home, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

// Platform Footer Component
export default function PlatformFooter() {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setNewsletterStatus('submitting')

    try {
      const response = await fetch('https://crm.blkoutuk.cloud/api/community/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subscriptions: {
            newsletter: true,
            events: false,
            blkouthub: false,
            volunteer: false,
          },
          consentGiven: true,
          source: 'blkoutuk_website',
          sourceUrl: window.location.href,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewsletterStatus('success')
        setEmail('')
        setTimeout(() => setNewsletterStatus('idle'), 3000)
      } else {
        throw new Error(data.message || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setNewsletterStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 border-t border-indigo-800/30">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-violet-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-black text-white heading-block mb-4 uppercase">
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  BLKOUT
                </span>
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent ml-2">
                  PLATFORM
                </span>
              </h3>
              <p className="text-lg text-indigo-200 mb-8 leading-relaxed font-light max-w-md">
                Building liberation together through authentic community spaces, 
                radical storytelling, and collective action for Black queer men.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/blkoutuk' },
                  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/blkoutuk' },
                  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@blkoutuk' },
                  { icon: Github, label: 'GitHub', href: 'https://github.com/blkoutuk' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 bg-indigo-800/50 hover:bg-indigo-700/70 border border-indigo-600/30 flex items-center justify-center transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-indigo-300" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Platform Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-black text-white heading-block mb-6 uppercase">
                <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
                  PLATFORM
                </span>
              </h4>
              <ul className="space-y-4">
                {[
                  { label: 'Stories', href: '/stories' },
                  { label: 'Community', href: '/community' },
                  { label: 'Events', href: '/events' },
                  { label: 'I.V.O.R. Resources', href: '/ivor' },
                  { label: 'Media Hub', href: '/media' },
                { label: 'Movement', href: '/movement' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-indigo-200 hover:text-white font-medium transition-colors duration-300 flex items-center group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Community Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-black text-white heading-block mb-6 uppercase">
                <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                  COMMUNITY
                </span>
              </h4>
              <ul className="space-y-4">
                {[
                  { label: 'Join BLKOUTHUB', href: '/community' },
                  { label: 'Discussions', href: '/discussions' },
                  { label: 'Newsletter', href: '#newsletter' },
                  { label: 'Support', href: '#support' },
                  { label: 'Governance', href: '/governance' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-indigo-200 hover:text-white font-medium transition-colors duration-300 flex items-center group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
                {/* About BLKOUT Link */}
                <li>
                  <Link
                    to="/"
                    className="text-indigo-200 hover:text-white font-medium transition-colors duration-300 flex items-center group"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    About BLKOUT
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Media Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <h4 className="text-lg font-black text-white heading-block mb-6 uppercase">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MEDIA
                </span>
              </h4>
              <ul className="space-y-4">
                {[
                  { label: 'Channel BLKOUT', href: '/media/channel' },
                  { label: 'Storylab', href: '/media/storylab' },
                  { label: 'Newsroom', href: '/media/newsroom' },
                  { label: 'Media Hub', href: '/media' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-indigo-200 hover:text-white font-medium transition-colors duration-300 flex items-center group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-indigo-800/30 pt-12 mb-12"
          id="newsletter"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-black text-white heading-block mb-4 uppercase">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                STAY CONNECTED
              </span>
            </h4>
            <p className="text-indigo-200 mb-8 font-light">
              Get the latest stories, resources, and community updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 bg-indigo-900/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light disabled:opacity-50"
                disabled={newsletterStatus === 'submitting'}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: newsletterStatus === 'submitting' ? 1 : 1.02 }}
                whileTap={{ scale: newsletterStatus === 'submitting' ? 1 : 0.98 }}
                disabled={newsletterStatus === 'submitting'}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:from-indigo-500 hover:to-violet-500 transition-all heading-block uppercase flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterStatus === 'submitting' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    SUBSCRIBING
                  </>
                ) : newsletterStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    SUBSCRIBED!
                  </>
                ) : newsletterStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    TRY AGAIN
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    SUBSCRIBE
                  </>
                )}
              </motion.button>
            </form>
            
            {/* Newsletter Status Messages */}
            {newsletterStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-300 text-sm text-center mt-3 font-light"
              >
                ✅ Successfully subscribed to BLKOUT updates!
              </motion.div>
            )}
            {newsletterStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 text-sm text-center mt-3 font-light"
              >
                ❌ {errorMessage}
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-indigo-800/30 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-indigo-300 text-sm font-light mb-4 md:mb-0">
            © 2025 BLKOUT Platform. Building liberation together.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            {[
              { label: 'Terms', href: '#terms' },
              { label: 'Privacy', href: '#privacy' },
              { label: 'Accessibility', href: '#accessibility' },
              { label: 'Contact', href: '#contact' }
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-indigo-300 hover:text-white transition-colors font-light"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}