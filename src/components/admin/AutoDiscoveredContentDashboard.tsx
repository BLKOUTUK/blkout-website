// Auto-Discovered Content Moderation Dashboard
// Priority 1 Task: T016 - Community organisation onboarding experience
// Builds on existing moderation capabilities with liberation focus

import React, { useState, useEffect } from 'react';
import { contentDiscoveryService, CuratedContent, DigestedContent } from '../../services/contentDiscoveryService';
import { supabase } from '../../lib/supabase';

interface AutoDiscoveredContentProps {
  className?: string;
}

interface QuickApprovalActions {
  approve: () => void;
  editAndApprove: () => void;
  reject: () => void;
  scheduleForVote: () => void;
}

interface CommunityModerationStats {
  pendingApproval: number;
  autoApproved: number;
  communityVoting: number;
  totalDiscovered: number;
  communityEngagement: number;
  liberationRelevanceAvg: number;
}

const AutoDiscoveredContentDashboard: React.FC<AutoDiscoveredContentProps> = ({ className = '' }) => {
  const [discoveredContent, setDiscoveredContent] = useState<CuratedContent[]>([]);
  const [moderationStats, setModerationStats] = useState<CommunityModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<CuratedContent | null>(null);
  const [communityNotes, setCommunityNotes] = useState('');

  useEffect(() => {
    loadDiscoveredContent();
    loadModerationStats();
  }, []);

  const loadDiscoveredContent = async () => {
    try {
      const content = await contentDiscoveryService.getContentPendingApproval();
      setDiscoveredContent(content);
    } catch (error) {
      console.error('Failed to load discovered content:', error);
    }
  };

  const loadModerationStats = async () => {
    try {
      // Calculate community moderation statistics
      const { data: allContent } = await supabase
        .from('auto_discovered_content')
        .select('status, relevance_score');

      if (allContent) {
        const stats: CommunityModerationStats = {
          pendingApproval: allContent.filter(c => c.status === 'auto_discovered').length,
          autoApproved: allContent.filter(c => c.status === 'community_approved').length,
          communityVoting: allContent.filter(c => c.status === 'community_voting').length,
          totalDiscovered: allContent.length,
          communityEngagement: 0.85, // Placeholder - would calculate from actual engagement
          liberationRelevanceAvg: allContent.reduce((avg, c) => avg + (c.relevance_score || 0), 0) / allContent.length
        };
        setModerationStats(stats);
      }
    } catch (error) {
      console.error('Failed to load moderation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const runContentDiscovery = async () => {
    setProcessing(true);
    try {
      console.log('🚀 Starting community content discovery automation...');
      
      // Run RSS/webscraping automation
      const [blkoutContent, rssContent, eventContent] = await Promise.all([
        contentDiscoveryService.scrapeBLKOUTUKContent(),
        contentDiscoveryService.processRelevantRSSFeeds(),
        contentDiscoveryService.aggregateQueerEvents()
      ]);

      // Combine and store all discovered content
      const allContent = [...blkoutContent, ...rssContent, ...eventContent];
      
      if (allContent.length > 0) {
        await contentDiscoveryService.storeDiscoveredContent(allContent);
        await loadDiscoveredContent();
        await loadModerationStats();
        
        console.log(`✅ Discovered and stored ${allContent.length} community-relevant items`);
      }
    } catch (error) {
      console.error('❌ Content discovery failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const createQuickApprovalActions = (content: CuratedContent): QuickApprovalActions => ({
    approve: async () => {
      try {
        await contentDiscoveryService.approveContent(content.id);
        await loadDiscoveredContent();
        await loadModerationStats();
        console.log(`✅ Content approved: ${content.title}`);
      } catch (error) {
        console.error('Failed to approve content:', error);
      }
    },

    editAndApprove: () => {
      setSelectedContent(content);
    },

    reject: async () => {
      try {
        await supabase
          .from('auto_discovered_content')
          .update({ status: 'rejected', rejected_at: new Date().toISOString() })
          .eq('id', content.id);
        
        await loadDiscoveredContent();
        await loadModerationStats();
        console.log(`❌ Content rejected: ${content.title}`);
      } catch (error) {
        console.error('Failed to reject content:', error);
      }
    },

    scheduleForVote: async () => {
      try {
        await supabase
          .from('auto_discovered_content')
          .update({ status: 'community_voting', voting_scheduled_at: new Date().toISOString() })
          .eq('id', content.id);
        
        await loadDiscoveredContent();
        await loadModerationStats();
        console.log(`🗳️ Content scheduled for community vote: ${content.title}`);
      } catch (error) {
        console.error('Failed to schedule content for vote:', error);
      }
    }
  });

  const handleEditAndApprove = async () => {
    if (!selectedContent) return;

    try {
      // Update content with community notes before approval
      await supabase
        .from('auto_discovered_content')
        .update({ 
          community_notes: communityNotes,
          status: 'community_approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', selectedContent.id);

      setSelectedContent(null);
      setCommunityNotes('');
      await loadDiscoveredContent();
      await loadModerationStats();
      console.log(`✅ Content edited and approved: ${selectedContent.title}`);
    } catch (error) {
      console.error('Failed to edit and approve content:', error);
    }
  };

  const bulkApproveFromSource = async (source: string) => {
    try {
      const sourceContent = discoveredContent.filter(c => c.source === source);
      
      for (const content of sourceContent) {
        await contentDiscoveryService.approveContent(content.id, 'Bulk approved - trusted source');
      }
      
      await loadDiscoveredContent();
      await loadModerationStats();
      console.log(`✅ Bulk approved ${sourceContent.length} items from ${source}`);
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    }
  };

  const LiberationRelevanceIndicator: React.FC<{ score: number }> = ({ score }) => {
    const getColor = (score: number) => {
      if (score >= 0.8) return 'bg-green-500';
      if (score >= 0.6) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getColor(score)}`}></div>
        <span className="text-sm font-medium">
          {(score * 100).toFixed(0)}% Liberation Relevance
        </span>
      </div>
    );
  };

  const ContentCard: React.FC<{ content: CuratedContent }> = ({ content }) => {
    const actions = createQuickApprovalActions(content);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{content.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                {content.source}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {content.content_type}
              </span>
              {content.auto_categories.map(cat => (
                <span key={cat} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {cat}
                </span>
              ))}
            </div>

            <LiberationRelevanceIndicator score={content.relevance_score} />
            
            {content.accessibility_notes && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <strong>Accessibility:</strong> {content.accessibility_notes}
              </div>
            )}
          </div>
          
          <div className="ml-4 text-xs text-gray-500">
            {new Date(content.scraped_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={actions.approve}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            ✓ Approve
          </button>
          <button
            onClick={actions.editAndApprove}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            ✏️ Edit & Approve
          </button>
          <button
            onClick={actions.reject}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            ✗ Reject
          </button>
          <button
            onClick={actions.scheduleForVote}
            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
          >
            🗳️ Community Vote
          </button>
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <a href={content.url} target="_blank" rel="noopener noreferrer" 
             className="text-blue-500 hover:text-blue-700">
            View Original →
          </a>
          <span>Source: {content.source_url}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Community Liberation Content Discovery Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Community Content Discovery Engine</h2>
        <p className="text-purple-100">
          Auto-discovering community-relevant content for Black queer liberation
        </p>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {moderationStats && (
            <>
              <div>
                <div className="text-2xl font-bold">{moderationStats.pendingApproval}</div>
                <div className="text-sm text-purple-200">Pending Approval</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{moderationStats.autoApproved}</div>
                <div className="text-sm text-purple-200">Community Approved</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{moderationStats.totalDiscovered}</div>
                <div className="text-sm text-purple-200">Total Discovered</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(moderationStats.liberationRelevanceAvg * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-purple-200">Avg Relevance</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Discovery Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Content Discovery Automation
            </h3>
            <p className="text-gray-600">
              Automatically discover events, news, and content from community organisations
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={runContentDiscovery}
              disabled={processing}
              className={`px-4 py-2 rounded-lg font-medium ${
                processing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {processing ? '🔄 Discovering...' : '🚀 Run Discovery'}
            </button>
          </div>
        </div>

        {/* Trusted Sources Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <h4 className="w-full text-sm font-medium text-gray-700 mb-2">
            Bulk Approve from Trusted Sources:
          </h4>
          {['Stonewall UK', 'Black Pride UK', 'Mermaids UK', 'blkout_uk'].map(source => (
            <button
              key={source}
              onClick={() => bulkApproveFromSource(source)}
              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200"
            >
              ✓ Approve all from {source}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Discovered Content Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Content Awaiting Community Review ({discoveredContent.length})
        </h3>
        
        {discoveredContent.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No content pending approval</p>
            <button
              onClick={runContentDiscovery}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Run Content Discovery
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discoveredContent.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Content Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit & Approve Content</h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900">{selectedContent.title}</h4>
              <p className="text-gray-600 text-sm">{selectedContent.description}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Community Notes:
              </label>
              <textarea
                value={communityNotes}
                onChange={(e) => setCommunityNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Add community context, edits, or notes..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleEditAndApprove}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save & Approve
              </button>
              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoDiscoveredContentDashboard;