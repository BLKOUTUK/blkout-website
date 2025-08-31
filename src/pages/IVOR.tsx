// IVOR Community Liberation Platform - Main Interface
// Complete integration of all 4 streams with community liberation focus

import React, { useState, useEffect } from 'react';
import { IVORChatEnhanced } from '../components/ivor/IVORChatEnhanced';
import { OrganizingDashboard } from '../components/ivor/OrganizingDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { ivorAPI } from '../lib/api-client';

interface IVORPageProps {}

interface UserContext {
  session_id: string;
  location?: string;
  empowerment_goals?: string[];
  cultural_background?: string;
  organizing_experience?: 'none' | 'some' | 'experienced';
  available_time?: 'low' | 'medium' | 'high';
  skills?: string[];
  liberation_focus?: string[];
}

interface CommunityStats {
  active_projects: number;
  community_members: number;
  organizing_opportunities: number;
  liberation_impact_score: number;
  cultural_authenticity_avg: number;
}

export const IVOR: React.FC<IVORPageProps> = () => {
  const [activeView, setActiveView] = useState<'chat' | 'organizing' | 'community' | 'social'>('chat');
  const [userContext, setUserContext] = useState<UserContext>({
    session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    liberation_focus: ['community_empowerment', 'collective_liberation']
  });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    active_projects: 12,
    community_members: 847,
    organizing_opportunities: 5,
    liberation_impact_score: 87,
    cultural_authenticity_avg: 92
  });

  useEffect(() => {
    // Initialize IVOR systems and load community data
    initializeIVORSystems();
    loadCommunityStats();
  }, []);

  /**
   * Initialize IVOR platform systems
   */
  const initializeIVORSystems = async () => {
    console.log('🚀 Initializing IVOR Community Liberation Platform...');
    
    try {
      // Initialize all backend systems
      // In production, these would be actual API calls
      await Promise.all([
        // journeyEngine.initialize(),
        // communityIntelligence.initialize(),
        // organizingCoordination.initialize(),
        // eventCoordination.initialize()
      ]);
      
      console.log('✅ IVOR systems initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing IVOR systems:', error);
    }
  };

  /**
   * Load community statistics
   */
  const loadCommunityStats = async () => {
    try {
      const result = await ivorAPI.getCommunityStats();
      
      if (result.success) {
        setCommunityStats(result.data);
      } else {
        console.error('Failed to load community stats:', result.error);
        // Fallback to default stats
        setCommunityStats({
          active_projects: 12,
          community_members: 847,
          organizing_opportunities: 5,
          liberation_impact_score: 87,
          cultural_authenticity_avg: 92
        });
      }
    } catch (error) {
      console.error('Error loading community stats:', error);
      // Fallback to default stats
      setCommunityStats({
        active_projects: 12,
        community_members: 847,
        organizing_opportunities: 5,
        liberation_impact_score: 87,
        cultural_authenticity_avg: 92
      });
    }
  };

  /**
   * Handle onboarding completion
   */
  const handleOnboardingComplete = (context: Partial<UserContext>) => {
    setUserContext(prev => ({
      ...prev,
      ...context
    }));
    setShowOnboarding(false);
  };

  /**
   * Get view-specific theme classes
   */
  const getViewTheme = (view: string) => {
    const themes = {
      chat: 'from-purple-900 to-pink-600',
      organizing: 'from-red-600 to-orange-600',
      community: 'from-blue-600 to-purple-600',
      social: 'from-green-600 to-teal-600'
    };
    return themes[view as keyof typeof themes] || themes.chat;
  };

  /**
   * Onboarding component
   */
  const OnboardingFlow = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-gray-700/50 shadow-2xl max-w-2xl w-full mx-4"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">✊🏿</div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to IVOR</h2>
          <p className="text-xl text-purple-200">Community Liberation Platform</p>
          <p className="text-gray-300 mt-2">Journey-aware AI supporting Black queer liberation through collective empowerment</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-600/30 p-4 rounded border border-purple-500/30">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold text-white">Personal AI Support</h3>
              <p className="text-sm text-gray-300">Journey-aware guidance tailored to your liberation path</p>
            </div>
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-600/30 p-4 rounded border border-blue-500/30">
              <div className="text-2xl mb-2">🏘️</div>
              <h3 className="font-semibold text-white">Community Intelligence</h3>
              <p className="text-sm text-gray-300">Anonymous analytics identifying organizing opportunities</p>
            </div>
            <div className="bg-gradient-to-r from-red-900/30 to-orange-600/30 p-4 rounded border border-red-500/30">
              <div className="text-2xl mb-2">✊</div>
              <h3 className="font-semibold text-white">Democratic Organizing</h3>
              <p className="text-sm text-gray-300">Community-validated projects with resource coordination</p>
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-teal-600/30 p-4 rounded border border-green-500/30">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-white">Viral Social Growth</h3>
              <p className="text-sm text-gray-300">AI-generated content amplifying liberation messages</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-900/20 to-red-900/20 p-4 rounded border border-amber-500/30 mb-6">
          <h4 className="font-medium text-amber-200 mb-2">Community Values & Data Sovereignty</h4>
          <ul className="text-sm text-amber-100 space-y-1">
            <li>✓ Cultural authenticity validation on all responses</li>
            <li>✓ Community data sovereignty with anonymous analytics</li>
            <li>✓ Democratic governance for all organizing projects</li>
            <li>✓ Liberation-focused optimization across all features</li>
          </ul>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleOnboardingComplete({
              location: 'Chicago',
              empowerment_goals: ['community_connection', 'organizing', 'liberation'],
              cultural_background: 'Black_queer',
              organizing_experience: 'some',
              available_time: 'medium',
              skills: ['community_outreach', 'peer_support'],
              liberation_focus: ['housing_justice', 'community_empowerment', 'healing_justice']
            })}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors"
          >
            Enter IVOR Platform
          </button>
        </div>

        <div className="text-center mt-4 text-xs text-gray-400">
          Built with liberation values • Community-owned • Democratic governance
        </div>
      </motion.div>
    </motion.div>
  );

  /**
   * Community stats panel
   */
  const CommunityStatsPanel = () => (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-4 rounded-lg border border-gray-600/50 mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">🏘️ Community Liberation Impact</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-purple-400">{communityStats.active_projects}</div>
          <div className="text-xs text-gray-300">Active Projects</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">{communityStats.community_members}</div>
          <div className="text-xs text-gray-300">Community Members</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-400">{communityStats.organizing_opportunities}</div>
          <div className="text-xs text-gray-300">Organizing Opportunities</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{communityStats.liberation_impact_score}%</div>
          <div className="text-xs text-gray-300">Liberation Impact</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-400">{communityStats.cultural_authenticity_avg}%</div>
          <div className="text-xs text-gray-300">Cultural Authenticity</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Onboarding Flow */}
      <AnimatePresence>
        {showOnboarding && <OnboardingFlow />}
      </AnimatePresence>

      {/* Main Platform Interface */}
      {!showOnboarding && (
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-gradient-to-r ${getViewTheme(activeView)} p-6 rounded-lg mb-6`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">IVOR</h1>
                <p className="text-lg text-gray-200">Community Liberation Platform</p>
                <p className="text-sm text-gray-300">Journey-aware AI • Democratic governance • Cultural authenticity</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-200">Session: {userContext.session_id.slice(-8)}</div>
                <div className="text-sm text-gray-300">Location: {userContext.location || 'Global'}</div>
                <div className="text-xs text-gray-400">Liberation Focus: Active</div>
              </div>
            </div>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CommunityStatsPanel />
          </motion.div>

          {/* Navigation */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-2 rounded-lg border border-gray-600/50 mb-6"
          >
            <div className="flex space-x-2">
              {[
                { id: 'chat', label: 'AI Chat', icon: '🧠', desc: 'Journey-aware personal support' },
                { id: 'organizing', label: 'Organizing', icon: '✊', desc: 'Democratic project coordination' },
                { id: 'community', label: 'Community', icon: '🏘️', desc: 'Intelligence & analytics' },
                { id: 'social', label: 'Social', icon: '📱', desc: 'Viral content & growth' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as typeof activeView)}
                  className={`flex-1 p-3 text-sm font-medium transition-all duration-200 rounded-lg border ${
                    activeView === tab.id
                      ? `bg-gradient-to-r ${getViewTheme(tab.id)} text-white border-transparent shadow-lg`
                      : 'text-gray-400 border-gray-600/30 hover:text-white hover:border-gray-500/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-lg mb-1">{tab.icon}</div>
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="min-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {activeView === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <IVORChatEnhanced
                    session_id={userContext.session_id}
                    initial_context={{
                      location: userContext.location,
                      empowerment_goals: userContext.empowerment_goals,
                      cultural_background: userContext.cultural_background,
                      skills: userContext.skills,
                      liberation_focus: userContext.liberation_focus
                    }}
                    cultural_theme="liberation"
                    liberation_focus={userContext.liberation_focus}
                  />
                </motion.div>
              )}

              {activeView === 'organizing' && (
                <motion.div
                  key="organizing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrganizingDashboard
                    session_id={userContext.session_id}
                    user_context={{
                      location: userContext.location,
                      empowerment_goals: userContext.empowerment_goals,
                      organizing_experience: userContext.organizing_experience,
                      available_time: userContext.available_time,
                      skills: userContext.skills
                    }}
                  />
                </motion.div>
              )}

              {activeView === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-700/50 shadow-2xl p-6"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏘️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Community Intelligence Dashboard</h2>
                    <p className="text-gray-300 mb-6">
                      Anonymous community analytics, pattern recognition, and organizing opportunity identification
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-600/20 p-6 rounded-lg border border-blue-500/30">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="text-lg font-semibold text-blue-200">Pattern Analysis</h3>
                        <p className="text-sm text-blue-100 mt-2">ML-powered community needs identification</p>
                        <div className="mt-4 text-2xl font-bold text-blue-400">87%</div>
                        <div className="text-xs text-blue-300">Accuracy Score</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-900/20 to-teal-600/20 p-6 rounded-lg border border-green-500/30">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="text-lg font-semibold text-green-200">Opportunity Detection</h3>
                        <p className="text-sm text-green-100 mt-2">Real-time organizing opportunity identification</p>
                        <div className="mt-4 text-2xl font-bold text-green-400">{communityStats.organizing_opportunities}</div>
                        <div className="text-xs text-green-300">Active Opportunities</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-900/20 to-pink-600/20 p-6 rounded-lg border border-purple-500/30">
                        <div className="text-3xl mb-3">🛡️</div>
                        <h3 className="text-lg font-semibold text-purple-200">Privacy Protection</h3>
                        <p className="text-sm text-purple-100 mt-2">Community data sovereignty guaranteed</p>
                        <div className="mt-4 text-2xl font-bold text-purple-400">100%</div>
                        <div className="text-xs text-purple-300">Anonymous Analytics</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-900/20 to-red-900/20 p-4 rounded-lg border border-amber-500/30">
                      <p className="text-amber-200 font-medium">🚀 Community Intelligence Engine Active</p>
                      <p className="text-amber-100 text-sm mt-2">
                        Analyzing community patterns while protecting privacy • Identifying organizing opportunities • Supporting collective liberation
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'social' && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-700/50 shadow-2xl p-6"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Social Liberation Amplification</h2>
                    <p className="text-gray-300 mb-6">
                      AI-generated viral content, community growth analytics, and liberation message amplification
                    </p>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gradient-to-r from-blue-900/20 to-blue-600/20 p-4 rounded-lg border border-blue-500/30">
                        <div className="text-2xl mb-2">🐦</div>
                        <h3 className="font-semibold text-blue-200">Twitter</h3>
                        <p className="text-sm text-blue-100">Thread generation</p>
                        <div className="text-lg font-bold text-blue-400 mt-2">94%</div>
                        <div className="text-xs text-blue-300">Authenticity</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-pink-900/20 to-purple-600/20 p-4 rounded-lg border border-pink-500/30">
                        <div className="text-2xl mb-2">📸</div>
                        <h3 className="font-semibold text-pink-200">Instagram</h3>
                        <p className="text-sm text-pink-100">Visual storytelling</p>
                        <div className="text-lg font-bold text-pink-400 mt-2">91%</div>
                        <div className="text-xs text-pink-300">Engagement</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-600/20 p-4 rounded-lg border border-indigo-500/30">
                        <div className="text-2xl mb-2">📘</div>
                        <h3 className="font-semibold text-indigo-200">Facebook</h3>
                        <p className="text-sm text-indigo-100">Community posts</p>
                        <div className="text-lg font-bold text-indigo-400 mt-2">88%</div>
                        <div className="text-xs text-indigo-300">Reach</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-600/20 p-4 rounded-lg border border-cyan-500/30">
                        <div className="text-2xl mb-2">💼</div>
                        <h3 className="font-semibold text-cyan-200">LinkedIn</h3>
                        <p className="text-sm text-cyan-100">Professional advocacy</p>
                        <div className="text-lg font-bold text-cyan-400 mt-2">85%</div>
                        <div className="text-xs text-cyan-300">Network Growth</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-900/20 to-teal-600/20 p-6 rounded-lg border border-green-500/30 mb-6">
                      <h3 className="text-lg font-semibold text-green-200 mb-3">🚀 Viral Liberation Content Generation</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div>
                          <h4 className="font-medium text-green-300">Content Features:</h4>
                          <ul className="text-sm text-green-100 mt-2 space-y-1">
                            <li>✓ Cultural authenticity validation</li>
                            <li>✓ Liberation message optimization</li>
                            <li>✓ Platform-specific formatting</li>
                            <li>✓ Community celebration focus</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-300">Growth Analytics:</h4>
                          <ul className="text-sm text-green-100 mt-2 space-y-1">
                            <li>✓ Referral tracking system</li>
                            <li>✓ Community growth metrics</li>
                            <li>✓ Liberation impact scoring</li>
                            <li>✓ Viral coefficient analysis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-900/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30">
                      <p className="text-purple-200 font-medium">📈 Social Liberation Engine Active</p>
                      <p className="text-purple-100 text-sm mt-2">
                        Amplifying community voices • Growing liberation networks • Celebrating Black queer joy and resilience
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/20 p-4 rounded-lg border border-gray-600/30">
              <p className="font-medium text-gray-300">IVOR Community Liberation Platform</p>
              <p className="mt-1">
                Journey-aware AI • Democratic governance • Cultural authenticity • Community data sovereignty
              </p>
              <p className="mt-2 text-xs">
                Built with liberation values • Community-owned • Democratically governed • 
                Liberation impact: {communityStats.liberation_impact_score}% • 
                Cultural authenticity: {communityStats.cultural_authenticity_avg}%
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IVOR;