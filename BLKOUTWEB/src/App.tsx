// Enhanced BLKOUTNXT App with Federated Independence Architecture
// Demonstrates module excellence alone with optional service enhancements
// File: src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedGovernancePage from './pages/EnhancedGovernancePage';
import FederationStatusDashboard from './components/FederationStatusDashboard';
import ModerationDashboard from './components/ModerationDashboard';
import ContentSubmissionForm from './components/ContentSubmissionForm';
import { performanceMonitor } from './services/PerformanceMonitoring';
import { blkoutModule } from './services/IndependentModuleCore';
import { useServiceHealth } from './hooks/useFederatedModule';

// Enhanced Navigation with Federation Status
const Navigation: React.FC<{ showFederationStatus: boolean; onToggleStatus: () => void }> = ({
  showFederationStatus,
  onToggleStatus
}) => {
  const { services, overallHealth } = useServiceHealth();
  const availableServices = services.filter(s => s.available).length;

  const getHealthColor = (health: number) => {
    if (health >= 0.8) return 'bg-green-400';
    if (health >= 0.5) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                BLKOUTNXT
              </h1>
              <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full">
                Independent
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </a>
              <a href="/governance" className="text-gray-300 hover:text-white transition-colors">
                Governance
              </a>
              <a href="/moderation" className="text-gray-300 hover:text-white transition-colors">
                Moderation
              </a>
              <a href="/submit" className="text-gray-300 hover:text-white transition-colors">
                Submit Content
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Federation Status Indicator */}
            <button
              onClick={onToggleStatus}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${getHealthColor(overallHealth)}`}></div>
              <span className="text-sm text-gray-300">
                {availableServices}/{services.length} services
              </span>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${showFederationStatus ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="text-xs text-gray-400">
              v1.0.0-fed
            </div>
          </div>
        </div>

        {/* Federation Status Dropdown */}
        {showFederationStatus && (
          <div className="mt-4 border-t border-gray-800 pt-4">
            <FederationStatusDashboard compact={true} showPerformance={false} />
          </div>
        )}
      </div>
    </nav>
  );
};

// Enhanced Home Page with Independence Focus
const HomePage: React.FC = () => {
  const { services } = useServiceHealth();
  const [moduleHealth, setModuleHealth] = useState<any>(null);
  const availableServices = services.filter(s => s.available).length;

  useEffect(() => {
    const loadModuleHealth = async () => {
      try {
        const health = await blkoutModule.getHealthStatus();
        setModuleHealth(health);
      } catch (error) {
        console.error('Failed to load module health:', error);
      }
    };

    loadModuleHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            BLKOUT Community Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Democratic governance and liberation platform built on federated independence architecture. 
            Full functionality guaranteed, enhanced when connected.
          </p>

          {/* Independence Status */}
          <div className="flex justify-center items-center space-x-6 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/30 border border-green-400/30 rounded-lg">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-300 font-medium">Fully Independent</span>
            </div>
            
            {availableServices > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-violet-900/30 border border-violet-400/30 rounded-lg">
                <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-violet-300 font-medium">
                  Enhanced by {availableServices} service{availableServices !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Democratic Governance</h3>
            <p className="text-gray-300 mb-4">
              Community-driven decision making with optional AI wisdom and federated insights.
            </p>
            <a 
              href="/governance" 
              className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
            >
              Participate
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 110 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 11-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13V12z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Content Moderation</h3>
            <p className="text-gray-300 mb-4">
              Community-driven content review with transparent moderation and democratic oversight.
            </p>
            <a 
              href="/moderation" 
              className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors"
            >
              Moderate
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Performance</h3>
            <p className="text-gray-300 mb-4">
              Sub-2s load times, 99.9% uptime, and graceful degradation under any conditions.
            </p>
            <div className="inline-flex items-center text-green-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Optimized
            </div>
          </div>
        </div>

        {/* Architecture Principles */}
        <div className="bg-violet-900/20 border border-violet-400/30 rounded-xl p-8 mb-16 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Federated Independence Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600/20 border border-violet-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-violet-300">Independence First</h3>
              <p className="text-gray-300 text-sm">Every module excels completely alone</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600/20 border border-pink-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-pink-300">Optional Enhancement</h3>
              <p className="text-gray-300 text-sm">Services add value but aren't required</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-green-300">Graceful Degradation</h3>
              <p className="text-gray-300 text-sm">Always work, sometimes enhanced</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 border border-blue-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-blue-300">Circuit Breakers</h3>
              <p className="text-gray-300 text-sm">Prevent cascading failures</p>
            </div>
          </div>
        </div>

        {/* Module Health Display */}
        {moduleHealth && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Platform Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {moduleHealth.fullyFunctional ? '✓' : '✗'}
                </div>
                <div className="text-gray-300 text-sm">Fully Functional</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {moduleHealth.localStateSize}
                </div>
                <div className="text-gray-300 text-sm">Local State Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-400 mb-1">
                  {moduleHealth.availableEnhancements}
                </div>
                <div className="text-gray-300 text-sm">Available Enhancements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400 mb-1">
                  {moduleHealth.connectedServices.length}
                </div>
                <div className="text-gray-300 text-sm">Connected Services</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showFederationStatus, setShowFederationStatus] = useState(false);
  const [pageLoadStartTime] = useState(Date.now());

  useEffect(() => {
    // Track page load performance
    const handleLoad = () => {
      performanceMonitor.trackPageLoad(
        window.location.pathname,
        pageLoadStartTime,
        [], // Services used (would be populated by actual usage)
        []  // Fallbacks used
      );
    };

    // Track on initial load
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Initialize module enhancements
    const initializeEnhancements = async () => {
      try {
        const health = await blkoutModule.getHealthStatus();
        console.log('Platform initialized:', health);
      } catch (error) {
        console.error('Platform initialization error (non-critical):', error);
      }
    };

    initializeEnhancements();

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [pageLoadStartTime]);

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-black">
        <Navigation 
          showFederationStatus={showFederationStatus}
          onToggleStatus={() => setShowFederationStatus(!showFederationStatus)}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/governance" element={<EnhancedGovernancePage />} />
            <Route path="/moderation" element={<ModerationDashboard moderatorId="current_user" />} />
            <Route path="/submit" element={
              <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-black py-12">
                <div className="container mx-auto px-8">
                  <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Submit Content to Community
                  </h1>
                  <ContentSubmissionForm />
                </div>
              </div>
            } />
            <Route path="/federation" element={
              <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-black py-12">
                <div className="container mx-auto px-8">
                  <FederationStatusDashboard compact={false} showPerformance={true} />
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                BLKOUT Community Liberation Platform
              </p>
              <p className="text-gray-500 text-sm">
                🏳️‍🌈 Democratic • Transparent • Community-Led • Liberation-Focused • Independent 🗳️✊🏿
              </p>
              <div className="mt-4 text-xs text-gray-500">
                Federated Independence Architecture v1.0.0 | 
                Built for resilience, enhanced by connection
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;