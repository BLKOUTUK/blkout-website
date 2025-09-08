import React, { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Twitter, Linkedin } from 'lucide-react'

interface SharedLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showHero?: boolean
}

export const SharedLayout = ({ 
  children, 
  title = "BLKOUT", 
  subtitle = "COMMUNITY PLATFORM FOR BLACK QUEER LIBERATION",
  showHero = false 
}: SharedLayoutProps) => {
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Face-cycling gif in header */}
              <img 
                src="/images/face-square/face-cycling.gif"
                alt="Community members cycling"
                className="w-12 h-12 object-contain filter drop-shadow-lg rounded-lg"
                loading="lazy"
              />
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BLKOUT
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              {/* Ecosystem Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsEcosystemOpen(!isEcosystemOpen)}
                  className="flex items-center space-x-1 text-white hover:text-blue-300 transition-colors"
                >
                  <span>Core Ecosystem</span>
                  <svg className={`w-4 h-4 transform transition-transform ${isEcosystemOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isEcosystemOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 z-50">
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Link 
                          to="/stories" 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">📚</span>
                          <div>
                            <div className="font-semibold text-sm">Story Archive</div>
                            <div className="text-xs text-gray-400">Historical articles</div>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/newsroom" 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">📰</span>
                          <div>
                            <div className="font-semibold text-sm">Newsroom</div>
                            <div className="text-xs text-gray-400">Current articles</div>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/events" 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">📅</span>
                          <div>
                            <div className="font-semibold text-sm">Events</div>
                            <div className="text-xs text-gray-400">Community calendar</div>
                          </div>
                        </Link>
                        
                        <a 
                          href="https://ivor-beta.vercel.app/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">🤖</span>
                          <div>
                            <div className="font-semibold text-sm">I.V.O.R.</div>
                            <div className="text-xs text-gray-400">AI assistant</div>
                          </div>
                        </a>
                        
                        <Link 
                          to="/community" 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">🏘️</span>
                          <div>
                            <div className="font-semibold text-sm">Community</div>
                            <div className="text-xs text-gray-400">Connect & discuss</div>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/governance" 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">🏛️</span>
                          <div>
                            <div className="font-semibold text-sm">Governance</div>
                            <div className="text-xs text-gray-400">Democracy</div>
                          </div>
                        </Link>
                        
                        <a 
                          href="https://blkout-scrollytelling.vercel.app/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">✊</span>
                          <div>
                            <div className="font-semibold text-sm">Movement</div>
                            <div className="text-xs text-gray-400">Liberation journey</div>
                          </div>
                        </a>
                        
                        <a 
                          href="https://blkoutnxtchannel.carrd.co" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all"
                          onClick={() => setIsEcosystemOpen(false)}
                        >
                          <span className="text-2xl">📺</span>
                          <div>
                            <div className="font-semibold text-sm">Media Hub</div>
                            <div className="text-xs text-gray-400">Video content</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/admin" className="text-white hover:text-blue-300 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Optional Hero Section */}
      {showHero && (
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {title}
            </h1>
            <h2 className="text-3xl mb-8 text-white font-bold uppercase tracking-wide">
              {subtitle}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Building community power through cooperative democracy, storytelling, and collective action.
            </p>
          </div>
        </div>
      )}

      {/* Page Content */}
      {children}

      {/* Footer with Social Media Links */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-16">
          {/* Social Media Links */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
            <div className="flex justify-center items-center space-x-8 flex-wrap">
              <a href="https://instagram.com/blkoutuk" target="_blank" rel="noopener noreferrer" 
                 className="text-white hover:text-gray-300 transition-colors p-2"
                 title="Instagram">
                <Instagram size={28} />
              </a>
              <a href="https://facebook.com/blkoutuk" target="_blank" rel="noopener noreferrer"
                 className="text-white hover:text-gray-300 transition-colors p-2"
                 title="Facebook">
                <Facebook size={28} />
              </a>
              <a href="https://twitter.com/blkoutuk" target="_blank" rel="noopener noreferrer"
                 className="text-white hover:text-gray-300 transition-colors p-2"
                 title="Twitter/X">
                <Twitter size={28} />
              </a>
              <a href="https://linkedin.com/company/blkoutuk" target="_blank" rel="noopener noreferrer"
                 className="text-white hover:text-gray-300 transition-colors p-2"
                 title="LinkedIn">
                <Linkedin size={28} />
              </a>
              <a href="https://tiktok.com/@blkoutuk" target="_blank" rel="noopener noreferrer"
                 className="text-white hover:text-gray-300 transition-colors p-2"
                 title="TikTok">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@blkoutuk" target="_blank" rel="noopener noreferrer"
                 className="text-white hover:text-gray-300 transition-colors p-2"
                 title="YouTube">
                <Youtube size={28} />
              </a>
              <a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer"
                 className="text-white hover:text-gray-300 text-lg font-semibold transition-colors px-4 py-2 border border-white/20 rounded-lg ml-4">
                BLKOUTHUB
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SharedLayout