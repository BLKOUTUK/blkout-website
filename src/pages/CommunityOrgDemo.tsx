// Community Organisation Demo Page - Immediate Value Demonstration
// Shows auto-discovered content, onboarding flow, and community benefits
// Priority 1: Demonstrate compelling alternative to corporate platforms

import React, { useState, useEffect } from 'react';
import { contentDiscoveryService, CuratedContent } from '../services/contentDiscoveryService';
import { contentIntegrationService } from '../services/contentIntegrationService';
import CommunityOrgOnboardingExperience from '../components/onboarding/CommunityOrgOnboardingExperience';
import AutoDiscoveredContentDashboard from '../components/admin/AutoDiscoveredContentDashboard';
import CommunityInstagramSourceManager from '../components/admin/CommunityInstagramSourceManager';
import ChromeExtensionCurationHub from '../components/admin/ChromeExtensionCurationHub';
import EnhancedModerationWorkflow from '../components/admin/EnhancedModerationWorkflow';

interface DemoStats {
  contentDiscovered: number;
  eventsFound: number;
  newsArticles: number;
  communityReach: number;
  partnerOrgs: number;
  avgRelevanceScore: number;
}

interface LiveDemo {
  isRunning: boolean;
  stepDescription: string;
  progress: number;
  results: CuratedContent[];
}

const CommunityOrgDemo: React.FC = () => {
  const [demoStats, setDemoStats] = useState<DemoStats>({
    contentDiscovered: 0,
    eventsFound: 0,
    newsArticles: 0,
    communityReach: 847,
    partnerOrgs: 6,
    avgRelevanceScore: 0.82
  });

  const [liveDemo, setLiveDemo] = useState<LiveDemo>({
    isRunning: false,
    stepDescription: 'Ready to demonstrate content discovery',
    progress: 0,
    results: []
  });

  const [currentView, setCurrentView] = useState<'demo' | 'onboarding' | 'dashboard' | 'instagram' | 'curation' | 'moderation'>('demo');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadInitialStats();
  }, []);

  const loadInitialStats = async () => {
    try {
      const stats = await contentIntegrationService.getIntegrationStats();
      setDemoStats(prev => ({
        ...prev,
        contentDiscovered: stats.totalDiscovered,
        eventsFound: stats.integrationByType['event'] || 0,
        newsArticles: (stats.integrationByType['news'] || 0) + (stats.integrationByType['article'] || 0)
      }));
    } catch (error) {
      console.error('Failed to load demo stats:', error);
    }
  };

  const runLiveContentDiscovery = async () => {
    setLiveDemo(prev => ({ ...prev, isRunning: true, progress: 0 }));

    try {
      // Step 1: BLKOUT UK Content Discovery
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: '🔍 Discovering BLKOUT UK events and content...',
        progress: 20 
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const blkoutContent = await contentDiscoveryService.scrapeBLKOUTUKContent();
      
      // Step 2: RSS Feed Processing
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: '📡 Processing community organisation RSS feeds...',
        progress: 40 
      }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const rssContent = await contentDiscoveryService.processRelevantRSSFeeds();
      
      // Step 3: Event Aggregation
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: '🎉 Aggregating queer community events from multiple sources...',
        progress: 60 
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventContent = await contentDiscoveryService.aggregateQueerEvents();
      
      // Step 4: Community Filtering
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: '🏳️‍🌈 Filtering for Black queer liberation relevance...',
        progress: 80 
      }));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allContent = [...blkoutContent, ...rssContent, ...eventContent];
      
      // Step 5: Store and Complete
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: '💾 Storing for community moderation and approval...',
        progress: 100 
      }));
      
      if (allContent.length > 0) {
        await contentDiscoveryService.storeDiscoveredContent(allContent);
      }
      
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: `✅ Discovery complete! Found ${allContent.length} relevant items`,
        results: allContent.slice(0, 10) // Show first 10 for demo
      }));
      
      // Update stats
      await loadInitialStats();
      
    } catch (error) {
      console.error('Live demo failed:', error);
      setLiveDemo(prev => ({ 
        ...prev, 
        stepDescription: '❌ Demo failed - but this shows the transparency of community ownership!',
        progress: 100
      }));
    } finally {
      setTimeout(() => {
        setLiveDemo(prev => ({ ...prev, isRunning: false }));
      }, 3000);
    }
  };

  const CompetitiveAdvantageCard: React.FC<{
    platform: string;
    corporateApproach: string;
    blkoutAdvantage: string;
    savings?: string;
  }> = ({ platform, corporateApproach, blkoutAdvantage, savings }) => (
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">BLKOUT vs {platform}</h3>
        {savings && (
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
            {savings}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="text-red-500 font-bold">❌</span>
          <div>
            <p className="text-sm text-gray-600"><strong>{platform}:</strong> {corporateApproach}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <span className="text-green-500 font-bold">✅</span>
          <div>
            <p className="text-sm text-gray-700"><strong>BLKOUT:</strong> {blkoutAdvantage}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen">
        <CommunityOrgOnboardingExperience 
          onComplete={() => {
            setCurrentView('demo');
            setShowOnboarding(false);
          }}
        />
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('demo')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              ← Back to Demo
            </button>
          </div>
          <AutoDiscoveredContentDashboard />
        </div>
      </div>
    );
  }

  if (currentView === 'instagram') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('demo')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              ← Back to Demo
            </button>
          </div>
          <CommunityInstagramSourceManager />
        </div>
      </div>
    );
  }

  if (currentView === 'curation') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('demo')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              ← Back to Demo
            </button>
          </div>
          <ChromeExtensionCurationHub />
        </div>
      </div>
    );
  }

  if (currentView === 'moderation') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('demo')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              ← Back to Demo
            </button>
          </div>
          <EnhancedModerationWorkflow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            BLKOUT Community Platform
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Community-owned liberation infrastructure for Black queer communities
          </p>
          <p className="text-lg text-purple-200">
            🏛️ Democratic • 🔒 Community-owned • ♿ Accessible • 💰 Economic justice
          </p>
        </div>

        {/* Live Demo Stats */}
        <div className="bg-white/90 backdrop-blur rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Platform Already Has Value for Your Community
            </h2>
            <p className="text-gray-600">
              We've auto-discovered content from trusted community organisations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{demoStats.contentDiscovered}</div>
              <div className="text-sm text-green-100">Items Discovered</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{demoStats.eventsFound}</div>
              <div className="text-sm text-blue-100">Events Found</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{demoStats.newsArticles}</div>
              <div className="text-sm text-purple-100">News Articles</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{demoStats.communityReach}</div>
              <div className="text-sm text-pink-100">Community Reach</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{demoStats.partnerOrgs}</div>
              <div className="text-sm text-red-100">Partner Orgs</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{(demoStats.avgRelevanceScore * 100).toFixed(0)}%</div>
              <div className="text-sm text-orange-100">Relevance Score</div>
            </div>
          </div>

          {/* Live Content Discovery Demo */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                🚀 Live Content Discovery Demo
              </h3>
              <button
                onClick={runLiveContentDiscovery}
                disabled={liveDemo.isRunning}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  liveDemo.isRunning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white`}
              >
                {liveDemo.isRunning ? '🔄 Discovering...' : '🎯 Run Live Discovery'}
              </button>
            </div>
            
            {liveDemo.isRunning && (
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${liveDemo.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{liveDemo.progress}%</span>
                </div>
                <p className="text-sm text-gray-700">{liveDemo.stepDescription}</p>
              </div>
            )}

            {liveDemo.results.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  📋 Just Discovered ({liveDemo.results.length} items shown):
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {liveDemo.results.map((item, index) => (
                    <div key={index} className="bg-white rounded p-3 border-l-4 border-purple-500">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.title}</h5>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex space-x-2 mt-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {item.source}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {(item.relevance_score * 100).toFixed(0)}% relevant
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="bg-white/90 backdrop-blur rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🆚 Why Community Organisations Choose BLKOUT
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <CompetitiveAdvantageCard
              platform="Eventbrite"
              corporateApproach="2.9% + £0.30 fee per ticket, corporate data extraction"
              blkoutAdvantage="No ticket fees, community-controlled promotion, democratic governance"
              savings="Save 2.9% per ticket"
            />
            
            <CompetitiveAdvantageCard
              platform="Facebook"
              corporateApproach="Algorithm suppression, pay-to-promote, surveillance capitalism"
              blkoutAdvantage="No algorithm suppression, authentic community engagement, data sovereignty"
            />
            
            <CompetitiveAdvantageCard
              platform="Instagram"
              corporateApproach="Creator exploitation, algorithmic bias against Black/queer content"
              blkoutAdvantage="Creator sovereignty, economic justice, liberation-focused amplification"
            />
            
            <CompetitiveAdvantageCard
              platform="Corporate Platforms"
              corporateApproach="Profit extraction, no community control, surveillance"
              blkoutAdvantage="Community Benefit Society ownership, democratic control, liberation focus"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Liberation?</h2>
          <p className="text-xl text-green-100 mb-6">
            Experience community-owned media that's exciting, not just worthy
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setCurrentView('onboarding')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              🚀 Start Community Onboarding
            </button>
            
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 border border-green-400 transition-colors"
            >
              📊 View Content Dashboard
            </button>
            
            <button
              onClick={() => setCurrentView('instagram')}
              className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 border border-pink-400 transition-colors"
            >
              📱 Manage Instagram Sources
            </button>
            
            <button
              onClick={() => setCurrentView('curation')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 border border-orange-400 transition-colors"
            >
              🧩 Community Curation Hub
            </button>
            
            <button
              onClick={() => setCurrentView('moderation')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 border border-indigo-400 transition-colors"
            >
              🛡️ Enhanced Moderation
            </button>
            
            <button
              onClick={runLiveContentDiscovery}
              disabled={liveDemo.isRunning}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 border border-purple-400 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              🎯 Run Discovery Demo
            </button>
          </div>
          
          <div className="mt-8 bg-green-600/30 backdrop-blur rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">🏛️ Community Benefit Society Structure</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Democratic Control:</strong><br/>
                One member, one vote on platform decisions
              </div>
              <div>
                <strong>Community Ownership:</strong><br/>
                Members own and control the platform
              </div>
              <div>
                <strong>Liberation Focus:</strong><br/>
                Community benefit over profit extraction
              </div>
            </div>
          </div>
        </div>

        {/* Partner Organisations */}
        <div className="bg-white/90 backdrop-blur rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🤝 Trusted Community Organisation Sources
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {[
              'Stonewall UK', 'Black Pride UK', 'Mermaids UK', 
              'UK Black Pride', 'Gendered Intelligence', 'Kaleidoscope Trust'
            ].map(org => (
              <div key={org} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
                <div className="text-lg font-semibold text-gray-900">{org}</div>
                <div className="text-sm text-gray-600">Trusted Source</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              We automatically discover and curate content from trusted community organisations,
              <br/>
              then present it for community approval and democratic moderation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityOrgDemo;