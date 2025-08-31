import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: '📖' },
    { path: '/events', label: 'Events', icon: '📅' },
    { path: '/community', label: 'Community', icon: '🏘️' },
    { path: '/ivor', label: 'IVOR AI', icon: '🧠', special: true }
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">BLKOUT</div>
            <div className="text-sm text-gray-200">Community Liberation</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isIVOR = item.special;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  } ${
                    isIVOR 
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 shadow-md' 
                      : ''
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isIVOR && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold ml-1"
                    >
                      AI
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isIVOR = item.special;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                    } ${
                      isIVOR 
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30' 
                        : ''
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {isIVOR && (
                      <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold">
                        AI PLATFORM
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};