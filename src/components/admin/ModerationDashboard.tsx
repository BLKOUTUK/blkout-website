/**
 * BLKOUT Moderation Dashboard - Comprehensive Content Management
 * Parallel moderation system for newsroom and events calendar
 */

import React, { useState, useEffect } from 'react';
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
}

const ModerationDashboard: React.FC = () => {
  const [stats, setStats] = useState<ModerationStats>({
    pendingCount: 12,
    todayActions: 47,
    activeModerators: 3,
    newsroomQueue: 8,
    eventsQueue: 4,
    communityQueue: 0
  });

  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockQueue: ModerationItem[] = [
      {
        id: '1',
        type: 'newsroom_article',
        title: 'New QTIPOC+ Housing Initiative Launches',
        content: { excerpt: 'Community-led housing cooperative provides safe, affordable homes...' },
        submittedBy: 'marcus.johnson@example.com',
        submittedAt: new Date('2025-08-04T08:30:00'),
        status: 'pending',
        flags: ['auto-detected', 'high-relevance'],
        priority: 'high'
      },
      {
        id: '2',
        type: 'event',
        title: 'Birmingham Black Pride 2025 Planning Meeting',
        content: { 
          date: '2025-08-15T19:00:00',
          location: 'Birmingham Community Center',
          description: 'Community planning meeting for Birmingham Black Pride 2025...'
        },
        submittedBy: 'jordan.clarke@example.com',
        submittedAt: new Date('2025-08-04T07:15:00'),
        status: 'pending',
        flags: ['community-submitted'],
        priority: 'medium'
      },
      {
        id: '3',
        type: 'newsroom_article',
        title: 'Mental Health Resources Network Launch',
        content: { excerpt: 'New directory of Black QTIPOC+-affirming mental health professionals...' },
        submittedBy: 'dr.williams@example.com',
        submittedAt: new Date('2025-08-04T06:45:00'),
        status: 'flagged',
        flags: ['needs-verification', 'medical-content'],
        priority: 'high'
      }
    ];

    setModerationQueue(mockQueue);
    setLoading(false);
  }, []);

  const handleModerationAction = async (itemId: string, action: string, notes?: string) => {
    try {
      // In real implementation, this would call the moderation API
      console.log(`Taking action ${action} on item ${itemId}`, { notes });
      
      // Update local state
      setModerationQueue(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                status: action as any,
                moderatorNotes: notes,
                moderatedAt: new Date(),
                moderatedBy: 'current-moderator'
              }
            : item
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingCount: prev.pendingCount - 1,
        todayActions: prev.todayActions + 1,
        newsroomQueue: action === 'approved' ? prev.newsroomQueue - 1 : prev.newsroomQueue,
        eventsQueue: action === 'approved' ? prev.eventsQueue - 1 : prev.eventsQueue
      }));

    } catch (error) {
      console.error('Moderation action failed:', error);
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

  const filteredQueue = moderationQueue.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && item.status === 'pending';
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  );
};

export default ModerationDashboard;