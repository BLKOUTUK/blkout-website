/**
 * BLKOUT Moderation Dashboard - Comprehensive Content Management
 * Parallel moderation system for newsroom and events calendar
 */

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/notifications';
import SocialModerationQueue from './SocialModerationQueue';
import ExternalEventsModerationTab from './ExternalEventsModerationTab';
import { supabase } from '../../lib/supabase';
import { unifiedModerationBridge } from '../../services/unifiedModerationBridge';
import { articles, getDraftArticles } from '../../data/articles';
import { events, getDraftEvents } from '../../data/events';
import { 
  CheckCircle, XCircle, Clock, Flag, Edit3, Eye, 
  Filter, Search, Calendar, FileText, Users, 
  TrendingUp, AlertTriangle, MessageCircle 
} from 'lucide-react';

interface ModerationItem {
  id: string;
  type: 'newsroom_article' | 'event' | 'community_story' | 'comment';
  title: string;
  content: any;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderatorNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  flags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ModerationStats {
  pendingCount: number;
  todayActions: number;
  activeModerators: number;
  newsroomQueue: number;
  eventsQueue: number;
  communityQueue: number;
  socialQueue: number;
}

const ModerationDashboard: React.FC = () => {
  const [stats, setStats] = useState<ModerationStats>({
    pendingCount: 0,
    todayActions: 0,
    activeModerators: 1,
    newsroomQueue: 0,
    eventsQueue: 0,
    communityQueue: 0,
    socialQueue: 0
  });

  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('traditional');

  // Load real data from API endpoints
  useEffect(() => {
    loadModerationQueue();
  }, []);

  const loadModerationQueue = async () => {
    try {
      setLoading(true);
      let combinedQueue: ModerationItem[] = [];

      try {
        // Fetch events and articles directly from Supabase
        console.log('Fetching data from Supabase...');
        const [eventsResult, articlesResult] = await Promise.all([
          supabase.from('events').select('*').in('status', ['draft', 'pending']),
          supabase.from('newsroom_articles').select('*').in('status', ['draft', 'pending'])
        ]);
        
        console.log('Events result:', eventsResult);
        console.log('Articles result:', articlesResult);

        // Add events to moderation queue
        if (eventsResult.data) {
          console.log('Processing events:', eventsResult.data);
          eventsResult.data.forEach((event: any) => {
            console.log('Adding event to queue:', event.title);
            combinedQueue.push({
              id: event.id,
              type: 'event',
              title: event.title,
              content: {
                description: event.description,
                date: event.date,
                time: event.start_time,
                location: event.location || 'TBD'
              },
              submittedBy: event.source === 'manual' ? 'Chrome Extension' : event.organizer || 'Unknown',
              submittedAt: new Date(event.created_at),
              status: 'pending',
              flags: event.tags?.includes('community-submitted') ? ['community-submitted'] : [],
              priority: 'medium'
            });
          });
        } else {
          console.log('No events data found');
        }

        // Add articles to moderation queue
        if (articlesResult.data) {
          console.log('Processing articles:', articlesResult.data);
          articlesResult.data.forEach((article: any) => {
            console.log('Adding article to queue:', article.title);
            combinedQueue.push({
              id: article.id,
              type: 'newsroom_article',
              title: article.title,
              content: { excerpt: article.excerpt || article.content },
              submittedBy: article.source_url ? 'Chrome Extension' : 'Unknown',
              submittedAt: new Date(article.created_at),
              status: 'pending', // All items in moderation should show as pending
              flags: ['community-submitted'],
              priority: 'medium'
            });
          });
        } else {
          console.log('No articles data found');
        }
      } catch (apiError) {
        console.error('Supabase error:', apiError);
        console.log('ERROR - Skipping fallback to focus on Supabase data only');
        // Temporarily disabled fallback to debug Supabase issue
      }

      // Sort by submission date (newest first)
      combinedQueue.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

      console.log('🎯 SETTING MODERATION QUEUE:', combinedQueue);
      console.log('🎯 QUEUE LENGTH:', combinedQueue.length);
      setModerationQueue(combinedQueue);
      
      // Update stats
      const eventsCount = combinedQueue.filter(item => item.type === 'event').length;
      const articlesCount = combinedQueue.filter(item => item.type === 'newsroom_article').length;
      
      console.log('📊 STATS UPDATE:', {
        total: combinedQueue.length,
        events: eventsCount,
        articles: articlesCount
      });
      
      setStats({
        pendingCount: combinedQueue.length,
        todayActions: 0, // Would need to track this separately
        activeModerators: 1,
        newsroomQueue: articlesCount,
        eventsQueue: eventsCount,
        communityQueue: 0,
        socialQueue: 0
      });

    } catch (error) {
      console.error('Failed to load moderation queue:', error);
      // Fall back to empty queue on error
      setModerationQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (itemId: string, action: string, notes?: string) => {
    try {
      // Find the item to determine its type
      const item = moderationQueue.find(i => i.id === itemId);
      if (!item) return;

      console.log(`🔨 Moderating ${item.type} "${item.title}" - Action: ${action}`);

      // Update directly in Supabase
      if (item.type === 'event') {
        const { error } = await supabase
          .from('events')
          .update({
            status: action === 'approved' ? 'published' : 'rejected', // approved events become published
            moderated_at: new Date().toISOString(),
            moderated_by: 'admin',
            moderation_reason: notes || null
          })
          .eq('id', itemId);
        
        if (error) {
          console.error('Supabase event update error:', error);
          throw new Error('Failed to update event: ' + error.message);
        }
      } else if (item.type === 'newsroom_article') {
        const { error } = await supabase
          .from('newsroom_articles')
          .update({
            status: action === 'approved' ? 'published' : 'rejected', // approved articles become published
            moderated_at: new Date().toISOString(),
            moderated_by: 'admin',
            moderation_reason: notes || null,
            published_at: action === 'approved' ? new Date().toISOString() : null
          })
          .eq('id', itemId);
        
        if (error) {
          console.error('Supabase article update error:', error);
          throw new Error('Failed to update article: ' + error.message);
        }
      }

      // Remove from moderation queue (since it's no longer pending)
      setModerationQueue(prev => prev.filter(i => i.id !== itemId));

      // Show success message
      console.log(`✅ Successfully ${action} ${item.type}: "${item.title}"`);
      showSuccess(`Successfully ${action} ${item.type}: "${item.title}"`);

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingCount: prev.pendingCount - 1,
        todayActions: prev.todayActions + 1,
        newsroomQueue: item.type === 'newsroom_article' ? prev.newsroomQueue - 1 : prev.newsroomQueue,
        eventsQueue: item.type === 'event' ? prev.eventsQueue - 1 : prev.eventsQueue
      }));

      // Show success message
      showSuccess(`${item.type === 'event' ? 'Event' : 'Article'} ${action}`, `The ${item.type} has been ${action} successfully`);

    } catch (error) {
      console.error('Moderation action failed:', error);
      showError('Moderation Failed', 'Failed to process moderation action. Please try again.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsroom_article': return <FileText className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      case 'community_story': return <Users className="w-5 h-5" />;
      case 'comment': return <MessageCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  console.log('🔍 FILTERING QUEUE:', {
    moderationQueueLength: moderationQueue.length,
    selectedFilter,
    searchQuery,
    moderationQueue
  });

  const filteredQueue = moderationQueue.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const shouldShow = matchesFilter && matchesSearch;
    console.log('🔍 FILTERING ITEM:', item.title, 'Status:', item.status, 'Filter:', selectedFilter, 'Matches Filter:', matchesFilter, 'Matches Search:', matchesSearch, 'WILL SHOW:', shouldShow);
    return shouldShow;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading moderation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">BLKOUT Moderation Dashboard</h1>
            <p className="text-gray-600 mt-1">Community content management and safety</p>
            
            {/* Moderation Tabs */}
            <div className="flex space-x-1 mt-6">
              <button
                onClick={() => setActiveTab('traditional')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'traditional'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Traditional Content
                </div>
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'social'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Social Media
                </div>
              </button>
              <button
                onClick={() => setActiveTab('external-events')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'external-events'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  External Events
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'social' ? (
          <SocialModerationQueue />
        ) : activeTab === 'external-events' ? (
          <ExternalEventsModerationTab />
        ) : (
          <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Actions</p>
                <p className="text-3xl font-bold text-green-600">{stats.todayActions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Moderators</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeModerators}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Items</p>
                <p className="text-3xl font-bold text-red-600">
                  {moderationQueue.filter(item => item.status === 'flagged').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Queue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Newsroom Queue</h3>
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">{stats.newsroomQueue}</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Review Articles
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Events Queue</h3>
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.eventsQueue}</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Review Events
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Community Queue</h3>
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.communityQueue}</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Review Stories
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Content</option>
                  <option value="newsroom_article">Newsroom Articles</option>
                  <option value="event">Events</option>
                  <option value="community_story">Community Stories</option>
                  <option value="comment">Comments</option>
                </select>
              </div>
              
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-80"
                />
              </div>
            </div>
          </div>

          {/* Moderation Queue */}
          <div className="divide-y divide-gray-200">
            {filteredQueue.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items in queue</h3>
                <p className="text-gray-600">All content has been reviewed. Great work!</p>
              </div>
            ) : (
              filteredQueue.map((item) => (
                <div key={item.id} className="px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(item.type)}
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {item.type === 'newsroom_article' && item.content.excerpt}
                        {item.type === 'event' && `${new Date(item.content.date).toLocaleDateString()} - ${item.content.location}`}
                        {item.type === 'community_story' && item.content.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.flags.map((flag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {flag}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        Submitted by {item.submittedBy} • {new Date(item.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      <button
                        onClick={() => handleModerationAction(item.id, 'approved')}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      
                      <button
                        onClick={() => {
                          const notes = prompt('Reason for rejection:');
                          if (notes) handleModerationAction(item.id, 'rejected', notes);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      
                      <button
                        onClick={() => handleModerationAction(item.id, 'flagged')}
                        className="flex items-center gap-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Flag className="w-4 h-4" />
                        Flag
                      </button>
                      
                      <button className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModerationDashboard;