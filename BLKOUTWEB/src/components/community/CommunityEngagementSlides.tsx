// Google Slides Embed Component for Community Engagement
// File: src/components/community/CommunityEngagementSlides.tsx
// Purpose: Embed IVOR Curators presentation to invite community participation

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunityEngagementSlidesProps {
  className?: string;
  showCallToAction?: boolean;
}

export const CommunityEngagementSlides: React.FC<CommunityEngagementSlidesProps> = ({ 
  className = '', 
  showCallToAction = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEngagementForm, setShowEngagementForm] = useState(false);

  // Google Slides embed URL (convert edit URL to embed URL)
  const slidesPresentationId = '1cNtPoAN1boT8wNjkKPCO1n4jof2E-eTt4NTBxZNnOuk';
  const embedUrl = `https://docs.google.com/presentation/d/${slidesPresentationId}/embed?start=false&loop=false&delayms=3000`;

  const handleEngageClick = () => {
    setShowEngagementForm(true);
  };

  const handleSignUpInterest = () => {
    // This would integrate with your existing community signup flow
    console.log('User interested in becoming a curator');
    // Could trigger modal, navigation, or form submission
  };

  return (
    <div className={`bg-gradient-to-br from-purple-950/50 via-indigo-950/50 to-blue-950/50 rounded-xl p-6 border border-purple-700/30 ${className}`}>
      {/* Header with Community Liberation Context */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            🏴‍☠️ Join Our Liberation Movement
          </h3>
          <p className="text-purple-200 text-sm mt-1">
            IVOR Curators Wanted - Help build community-owned media
          </p>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm font-medium
                   transition-all flex items-center gap-2"
        >
          {isExpanded ? '↗️ Open Full View' : '📊 View Presentation'}
        </button>
      </div>

      {/* Embedded Google Slides */}
      <div className="relative bg-white rounded-lg overflow-hidden mb-6 shadow-2xl">
        <iframe
          src={embedUrl}
          frameBorder="0"
          width="100%"
          height={isExpanded ? "600" : "400"}
          allowFullScreen={true}
          className="transition-all duration-300"
          title="IVOR Curators Wanted - Community Engagement Presentation"
        />
        
        {/* Overlay with engagement prompt */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-white text-sm hover:text-purple-300 transition-colors"
            >
              ↗️ Expand to see full presentation
            </button>
          </div>
        )}
      </div>

      {/* Community Engagement Call-to-Action */}
      {showCallToAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-black/20 rounded-lg p-4 border border-purple-700/20">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              ✊🏿 Ready to Shape Community-Owned Media?
            </h4>
            <p className="text-purple-200 text-sm mb-4">
              Join IVOR as a curator and help democratize content creation for Black LGBTQ+ liberation. 
              Your voice matters in building bridges, not walls.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEngageClick}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                         px-6 py-2 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-xl
                         flex items-center gap-2"
              >
                <span>🚀</span>
                <span>I Want to Be a Curator</span>
              </button>
              
              <button
                onClick={() => window.open(`https://docs.google.com/presentation/d/${slidesPresentationId}/edit`, '_blank')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                         px-4 py-2 rounded-lg text-white text-sm transition-all
                         flex items-center gap-2"
              >
                <span>📋</span>
                <span>View Full Presentation</span>
              </button>
              
              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                         px-4 py-2 rounded-lg text-white text-sm transition-all
                         flex items-center gap-2"
              >
                <span>💬</span>
                <span>Ask Questions</span>
              </button>
            </div>
          </div>

          {/* Community Liberation Values */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-red-900/30 to-yellow-900/30 rounded-lg p-3 border border-red-700/20">
              <h5 className="text-red-300 font-medium text-sm mb-1">🏴‍☠️ Democratic Control</h5>
              <p className="text-red-200 text-xs">Community owns and governs all platform decisions</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-3 border border-green-700/20">
              <h5 className="text-green-300 font-medium text-sm mb-1">💰 Creator Sovereignty</h5>
              <p className="text-green-200 text-xs">75% revenue to creators, 25% to community operations</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-3 border border-purple-700/20">
              <h5 className="text-purple-300 font-medium text-sm mb-1">🌍 Liberation Focus</h5>
              <p className="text-purple-200 text-xs">Centering Black LGBTQ+ voices and intersectional justice</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Engagement Form Modal */}
      <AnimatePresence>
        {showEngagementForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEngagementForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-xl p-6 max-w-md w-full
                       border border-purple-700/30"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🏴‍☠️ Join the Liberation Movement
              </h4>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white
                             focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What interests you most about being an IVOR curator?
                  </label>
                  <textarea
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white h-20
                             focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Share your passion for community-owned media..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSignUpInterest}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium
                           transition-all"
                >
                  Sign Me Up!
                </button>
                <button
                  onClick={() => setShowEngagementForm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityEngagementSlides;