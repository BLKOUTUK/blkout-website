// Enhanced Moderation & Publishing Workflow
// Addresses the challenging aspects of content moderation and publishing
// Integrates Chrome extension submissions with IVOR knowledge base training

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  url: string;
  content_type: 'event' | 'news' | 'organization' | 'resource';
  source_type: 'rss' | 'instagram' | 'chrome-extension' | 'manual';
  liberation_relevance: number;
  liberation_focus: string[];
  status: 'pending' | 'approved' | 'published' | 'rejected' | 'needs_review';
  auto_moderation_flags: string[];
  community_votes: number;
  trusted_source: boolean;
  submitter_reputation: number;
  ai_confidence: number;
  created_at: string;
  moderated_at?: string;
  published_at?: string;
}

interface ModerationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: 'auto_approve' | 'auto_reject' | 'require_review' | 'flag_for_community';
  enabled: boolean;
  success_rate: number;
}

interface PublishingQueue {
  scheduled: ContentItem[];
  ready: ContentItem[];
  published: ContentItem[];
  failed: ContentItem[];
}

const EnhancedModerationWorkflow: React.FC = () => {
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [publishingQueue, setPublishingQueue] = useState<PublishingQueue>({
    scheduled: [],
    ready: [],
    published: [],
    failed: []
  });
  const [moderationRules, setModerationRules] = useState<ModerationRule[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'rules' | 'publishing' | 'analytics'>('queue');
  const [batchMode, setBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    loadContentQueue();
    loadModerationRules();
    loadPublishingQueue();
  }, []);

  const loadContentQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('auto_discovered_content')
        .select(`
          *,
          submitter_profile:submitted_by(reputation_score, trusted_status)
        `)
        .in('status', ['pending', 'needs_review'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentQueue(data || []);
    } catch (error) {
      console.error('Error loading content queue:', error);
    }
  };

  const loadModerationRules = async () => {
    try {
      const { data, error } = await supabase
        .from('moderation_rules')
        .select('*')
        .eq('enabled', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      setModerationRules(data || []);
    } catch (error) {
      console.error('Error loading moderation rules:', error);
    }
  };

  const loadPublishingQueue = async () => {
    try {
      const [scheduled, ready, published, failed] = await Promise.all([
        supabase.from('publishing_queue').select('*, content:content_id(*)').eq('status', 'scheduled'),
        supabase.from('publishing_queue').select('*, content:content_id(*)').eq('status', 'ready'),
        supabase.from('publishing_queue').select('*, content:content_id(*)').eq('status', 'published').limit(20),
        supabase.from('publishing_queue').select('*, content:content_id(*)').eq('status', 'failed')
      ]);

      setPublishingQueue({
        scheduled: scheduled.data || [],
        ready: ready.data || [],
        published: published.data || [],
        failed: failed.data || []
      });
    } catch (error) {
      console.error('Error loading publishing queue:', error);
    }
  };

  // Smart Auto-Moderation with IVOR Integration
  const applySmartModeration = async (contentId: string) => {
    try {
      const { data: content } = await supabase
        .from('auto_discovered_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (!content) return;

      // Apply moderation rules in priority order
      let moderationAction = 'require_review'; // default
      let confidence = 0;

      for (const rule of moderationRules) {
        const ruleResult = await evaluateModerationRule(rule, content);
        if (ruleResult.matches) {
          moderationAction = rule.action;
          confidence = ruleResult.confidence;
          break;
        }
      }

      // High-confidence decisions can be automated
      if (confidence > 0.9) {
        if (moderationAction === 'auto_approve') {
          await approveContent(contentId, 'smart_moderation', confidence);
        } else if (moderationAction === 'auto_reject') {
          await rejectContent(contentId, 'smart_moderation', 'Automated rejection based on moderation rules');
        }
      }

      // Train IVOR with moderation decisions
      await trainIVORWithModerationDecision(contentId, moderationAction, confidence);

    } catch (error) {
      console.error('Error applying smart moderation:', error);
    }
  };

  const evaluateModerationRule = async (rule: ModerationRule, content: ContentItem): Promise<{matches: boolean, confidence: number}> => {
    // Implement rule evaluation logic
    // This would be enhanced with actual AI/ML models
    
    let matches = false;
    let confidence = 0;

    // Example rule evaluations
    if (rule.name === 'Trusted Source Auto-Approve') {
      matches = content.trusted_source && content.liberation_relevance > 0.8;
      confidence = content.trusted_source ? 0.95 : 0.3;
    } else if (rule.name === 'Chrome Extension High Quality') {
      matches = content.source_type === 'chrome-extension' && content.submitter_reputation > 7;
      confidence = 0.85;
    } else if (rule.name === 'Community Verified') {
      matches = content.community_votes >= 3 && content.liberation_relevance > 0.7;
      confidence = Math.min(0.9, content.community_votes / 5);
    }

    return { matches, confidence };
  };

  const trainIVORWithModerationDecision = async (contentId: string, decision: string, confidence: number) => {
    try {
      await supabase
        .from('ivor_training_queue')
        .insert({
          content_id: contentId,
          training_type: 'moderation_decision',
          decision: decision,
          confidence: confidence,
          added_at: new Date().toISOString(),
          priority: confidence > 0.8 ? 'high' : 'medium'
        });
    } catch (error) {
      console.error('Error training IVOR:', error);
    }
  };

  const approveContent = async (contentId: string, moderator: string = 'manual', confidence?: number) => {
    try {
      await supabase
        .from('auto_discovered_content')
        .update({
          status: 'approved',
          moderated_at: new Date().toISOString(),
          moderated_by: moderator,
          ai_confidence: confidence
        })
        .eq('id', contentId);

      // Add to publishing queue
      await supabase
        .from('publishing_queue')
        .insert({
          content_id: contentId,
          status: 'ready',
          scheduled_for: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      loadContentQueue();
      loadPublishingQueue();
    } catch (error) {
      console.error('Error approving content:', error);
    }
  };

  const rejectContent = async (contentId: string, moderator: string = 'manual', reason?: string) => {
    try {
      await supabase
        .from('auto_discovered_content')
        .update({
          status: 'rejected',
          moderated_at: new Date().toISOString(),
          moderated_by: moderator,
          rejection_reason: reason
        })
        .eq('id', contentId);

      loadContentQueue();
    } catch (error) {
      console.error('Error rejecting content:', error);
    }
  };

  const batchApprove = async () => {
    for (const contentId of selectedItems) {
      await approveContent(contentId, 'batch_approval');
    }
    setSelectedItems([]);
    setBatchMode(false);
  };

  const publishContent = async (contentId: string) => {
    try {
      // Update publishing status
      await supabase
        .from('publishing_queue')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('content_id', contentId);

      // Update main content status
      await supabase
        .from('auto_discovered_content')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', contentId);

      loadPublishingQueue();
      loadContentQueue();
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  const renderModerationQueue = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Content Moderation Queue ({contentQueue.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`px-4 py-2 rounded-lg ${batchMode ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            {batchMode ? 'Exit Batch Mode' : 'Batch Mode'}
          </button>
          {batchMode && selectedItems.length > 0 && (
            <button
              onClick={batchApprove}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Approve Selected ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {contentQueue.map(item => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {batchMode && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id]);
                    } else {
                      setSelectedItems(selectedItems.filter(id => id !== item.id));
                    }
                  }}
                  className="mr-3"
                />
              )}
              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-gray-700 mb-3">{item.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.content_type === 'event' ? 'bg-blue-100 text-blue-700' :
                  item.content_type === 'news' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {item.content_type}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.source_type === 'chrome-extension' ? 'bg-orange-100 text-orange-700' :
                  item.source_type === 'instagram' ? 'bg-pink-100 text-pink-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.source_type}
                </span>
                {item.trusted_source && (
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    ✅ Trusted Source
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Liberation Relevance:</strong> {(item.liberation_relevance * 100).toFixed(0)}%
                </div>
                <div>
                  <strong>Community Votes:</strong> {item.community_votes}
                </div>
                <div>
                  <strong>AI Confidence:</strong> {(item.ai_confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => approveContent(item.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => applySmartModeration(item.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                🤖 Smart Review
              </button>
              <button
                onClick={() => rejectContent(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPublishingQueue = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800">Scheduled</h4>
          <div className="text-2xl font-bold text-yellow-600">{publishingQueue.scheduled.length}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800">Ready to Publish</h4>
          <div className="text-2xl font-bold text-blue-600">{publishingQueue.ready.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800">Published</h4>
          <div className="text-2xl font-bold text-green-600">{publishingQueue.published.length}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800">Failed</h4>
          <div className="text-2xl font-bold text-red-600">{publishingQueue.failed.length}</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4">Ready to Publish</h4>
        {publishingQueue.ready.map(item => (
          <div key={item.content_id} className="border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-center">
            <div>
              <h5 className="font-semibold">{item.content?.title}</h5>
              <p className="text-gray-600 text-sm">{item.content?.description}</p>
            </div>
            <button
              onClick={() => publishContent(item.content_id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              📢 Publish Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModerationRules = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Smart Moderation Rules</h3>
      <p className="text-gray-600 mb-4">
        These rules help automate content moderation and reduce manual review workload.
      </p>
      
      {moderationRules.map(rule => (
        <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{rule.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{rule.description}</p>
              <div className="text-sm text-gray-500">
                Success Rate: {(rule.success_rate * 100).toFixed(1)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${
                rule.action === 'auto_approve' ? 'bg-green-100 text-green-700' :
                rule.action === 'auto_reject' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {rule.action}
              </span>
              <button className={`w-12 h-6 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  rule.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🛡️ Enhanced Moderation & Publishing</h1>
        <p className="text-gray-600">
          Streamlined workflows for content moderation and publishing with Chrome extension integration and IVOR AI assistance.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'queue' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          📋 Moderation Queue ({contentQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('publishing')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'publishing' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          📢 Publishing Queue ({publishingQueue.ready.length})
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'rules' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          🤖 Smart Rules ({moderationRules.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'queue' && renderModerationQueue()}
      {activeTab === 'publishing' && renderPublishingQueue()}
      {activeTab === 'rules' && renderModerationRules()}
    </div>
  );
};

export default EnhancedModerationWorkflow;