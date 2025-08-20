/**
 * Social Media Moderation Queue Component
 * Extends existing moderation dashboard with social media content approval
 */

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/notifications';
import { 
  CheckCircle, XCircle, Clock, Edit3, Eye, Calendar,
  Instagram, Twitter, Linkedin, Facebook, MessageSquare,
  Hash, Users, TrendingUp, AlertTriangle
} from 'lucide-react';

interface SocialContentItem {
  id: string;
  type: 'twitter' | 'instagram' | 'linkedin' | 'facebook';
  content_type: 'carnival' | 'recruitment' | 'alain_locke' | 'business_network' | 'website_launch';
  title: string;
  content: {
    text: string;
    hashtags?: string[];
    images?: string[];
    scheduled_date: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'partial_approval';
  moderation_result?: {
    issues: string[];
    recommendations: string[];
    approved_platforms: string[];
    rejected_platforms: string[];
  };
  workflow_run_id: string;
  generated_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

interface SocialModerationStats {
  pendingSocial: number;
  approvedToday: number;
  scheduledPosts: number;
  platforms: {
    twitter: number;
    instagram: number;
    linkedin: number;
    facebook: number;
  };
}

const SocialModerationQueue: React.FC = () => {
  const [socialQueue, setSocialQueue] = useState<SocialContentItem[]>([]);
  const [stats, setStats] = useState<SocialModerationStats>({
    pendingSocial: 0,
    approvedToday: 0,
    scheduledPosts: 0,
    platforms: { twitter: 0, instagram: 0, linkedin: 0, facebook: 0 }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContent, setSelectedContent] = useState<SocialContentItem | null>(null);

  useEffect(() => {
    loadSocialQueue();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadSocialQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSocialQueue = async () => {
    try {
      setLoading(true);
      
      // Fetch from your content calendar system
      const response = await fetch('/api/social-content');
      const data = await response.json();
      
      if (data.success && data.content_entries) {
        const socialItems: SocialContentItem[] = [];
        
        data.content_entries.forEach((entry: any) => {
          Object.entries(entry.content).forEach(([platform, content]: [string, any]) => {
            if (content.text && content.status === 'success') {
              socialItems.push({
                id: `${entry.id}_${platform}`,
                type: platform as any,
                content_type: entry.type,
                title: `${entry.type} - ${platform}`,
                content: {
                  text: content.text,
                  scheduled_date: entry.scheduled_date,
                  hashtags: extractHashtags(content.text)
                },
                status: entry.status || 'pending',
                moderation_result: entry.moderation_result,
                workflow_run_id: entry.workflow_runs[platform] || '',
                generated_at: content.generated_at,
                approved_at: entry.approved_at,
                rejected_at: entry.rejected_at,
                rejection_reason: entry.rejection_reason
              });
            }
          });
        });

        setSocialQueue(socialItems);
        updateStats(socialItems);
      }
    } catch (error) {
      console.error('Failed to load social media queue:', error);
      setSocialQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#[\w]+/g) || [];
    return hashtags.map(tag => tag.substring(1));
  };

  const updateStats = (items: SocialContentItem[]) => {
    const pending = items.filter(item => item.status === 'pending').length;
    const approvedToday = items.filter(item => 
      item.approved_at && 
      new Date(item.approved_at).toDateString() === new Date().toDateString()
    ).length;
    
    const platformCounts = {
      twitter: items.filter(item => item.type === 'twitter').length,
      instagram: items.filter(item => item.type === 'instagram').length,
      linkedin: items.filter(item => item.type === 'linkedin').length,
      facebook: items.filter(item => item.type === 'facebook').length
    };

    setStats({
      pendingSocial: pending,
      approvedToday,
      scheduledPosts: items.filter(item => item.status === 'approved').length,
      platforms: platformCounts
    });
  };

  const handleSocialApproval = async (itemId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const item = socialQueue.find(i => i.id === itemId);
      if (!item) return;

      // Extract the original content ID and platform
      const [contentId, platform] = itemId.split('_');
      
      const response = await fetch('/api/social-content/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: contentId,
          platform: platform,
          action: action,
          reason: reason,
          moderator: 'admin',
          moderated_at: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to update social content');

      // Update local state
      setSocialQueue(prev => prev.map(i => 
        i.id === itemId 
          ? { 
              ...i, 
              status: action === 'approve' ? 'approved' : 'rejected',
              approved_at: action === 'approve' ? new Date().toISOString() : undefined,
              rejected_at: action === 'reject' ? new Date().toISOString() : undefined,
              rejection_reason: reason
            }
          : i
      ));

      showSuccess(
        `Social Content ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        `${platform} content for ${item.content_type} has been ${action === 'approve' ? 'approved' : 'rejected'}`
      );

      // Refresh stats
      const updatedItems = socialQueue.map(i => 
        i.id === itemId 
          ? { ...i, status: action === 'approve' ? 'approved' : 'rejected' as any }
          : i
      );
      updateStats(updatedItems);

    } catch (error) {
      console.error('Social moderation failed:', error);
      showError('Moderation Failed', 'Failed to process social media moderation. Please try again.');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-800" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'carnival': return 'bg-purple-100 text-purple-800';
      case 'recruitment': return 'bg-blue-100 text-blue-800';
      case 'alain_locke': return 'bg-green-100 text-green-800';
      case 'business_network': return 'bg-orange-100 text-orange-800';
      case 'website_launch': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const pendingItems = socialQueue.filter(item => item.status === 'pending');
  const approvedItems = socialQueue.filter(item => item.status === 'approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading social media queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Social Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Social</p>
              <p className="text-3xl font-bold text-purple-600">{stats.pendingSocial}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
              <p className="text-3xl font-bold text-blue-600">{stats.scheduledPosts}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-3xl font-bold text-orange-600">{socialQueue.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.platforms).map(([platform, count]) => (
            <div key={platform} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getPlatformIcon(platform)}
              <div>
                <p className="font-medium text-gray-900 capitalize">{platform}</p>
                <p className="text-sm text-gray-600">{count} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Moderation Queue */}
      {pendingItems.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Social Media Content</h3>
            <p className="text-gray-600">Review and approve generated social media posts</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingItems.map((item) => (
              <div key={item.id} className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getPlatformIcon(item.type)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(item.content_type)}`}>
                        {item.content_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Scheduled: {formatDate(item.content.scheduled_date)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-900 whitespace-pre-wrap">{item.content.text}</p>
                    </div>
                    
                    {item.content.hashtags && item.content.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Hash className="w-4 h-4 text-gray-400 mt-1" />
                        {item.content.hashtags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {item.moderation_result?.issues && item.moderation_result.issues.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-red-600 mb-1">Issues:</h4>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {item.moderation_result.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.moderation_result?.recommendations && item.moderation_result.recommendations.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-yellow-600 mb-1">Recommendations:</h4>
                        <ul className="text-sm text-yellow-600 list-disc list-inside">
                          {item.moderation_result.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Generated: {formatDate(item.generated_at)} • {item.content.text.length} characters
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <button
                      onClick={() => handleSocialApproval(item.id, 'approve')}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) handleSocialApproval(item.id, 'reject', reason);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    
                    <button 
                      onClick={() => setSelectedContent(item)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Content (Recent) */}
      {approvedItems.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recently Approved Content</h3>
            <p className="text-gray-600">Content ready for publishing</p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {approvedItems.slice(0, 5).map((item) => (
              <div key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(item.type)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(item.content_type)}`}>
                      {item.content_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-900 truncate max-w-xs">
                      {item.content.text.substring(0, 60)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Approved</span>
                    <span className="text-xs text-gray-500">
                      {item.approved_at && formatDate(item.approved_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingItems.length === 0 && approvedItems.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Social Media Content</h3>
          <p className="text-gray-600">No social media content found. Generate some content first!</p>
        </div>
      )}
    </div>
  );
};

export default SocialModerationQueue;