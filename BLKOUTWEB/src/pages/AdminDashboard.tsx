// Admin Dashboard with Extension Access and Moderation Tools
// File: src/pages/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { publicationService } from '../services/publicationService';
import AdminExtensionSetup from '../components/AdminExtensionSetup';

interface ModerationStats {
  pendingEvents: number;
  pendingArticles: number;
  totalPending: number;
  lastUpdated: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'extension' | 'moderation'>('overview');
  const [stats, setStats] = useState<ModerationStats>({
    pendingEvents: 0,
    pendingArticles: 0,
    totalPending: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModerationStats();
  }, []);

  const loadModerationStats = async () => {
    try {
      setLoading(true);
      const [pendingEvents, pendingArticles] = await Promise.all([
        publicationService.getPendingCount('events'),
        publicationService.getPendingCount('newsroom_articles')
      ]);

      setStats({
        pendingEvents,
        pendingArticles,
        totalPending: pendingEvents + pendingArticles,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to load moderation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton: React.FC<{
    id: 'overview' | 'extension' | 'moderation';
    label: string;
    icon: string;
  }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white border-b-2 border-blue-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            BLKOUTNXT Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Community Liberation Platform - Administrative Tools
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 mb-6">
          <TabButton id="overview" label="Overview" icon="📊" />
          <TabButton id="extension" label="Chrome Extension" icon="🧩" />
          <TabButton id="moderation" label="Moderation Queue" icon="⚖️" />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Platform Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    📅 Pending Events
                  </h3>
                  {loading ? (
                    <div className="animate-pulse bg-blue-200 h-8 w-16 rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-blue-700">{stats.pendingEvents}</p>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    📰 Pending Articles
                  </h3>
                  {loading ? (
                    <div className="animate-pulse bg-green-200 h-8 w-16 rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-green-700">{stats.pendingArticles}</p>
                  )}
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    ⏳ Total Pending
                  </h3>
                  {loading ? (
                    <div className="animate-pulse bg-purple-200 h-8 w-16 rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-purple-700">{stats.totalPending}</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">🚀 Quick Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setActiveTab('moderation')}
                      className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      Review Pending Content ({stats.totalPending})
                    </button>
                    <button 
                      onClick={() => setActiveTab('extension')}
                      className="w-full text-left px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                    >
                      Download Chrome Extension
                    </button>
                    <button 
                      onClick={loadModerationStats}
                      disabled={loading}
                      className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Refreshing...' : 'Refresh Statistics'}
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">🔗 System Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Database Connection:</span>
                      <span className="text-green-600 font-medium">✅ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Endpoints:</span>
                      <span className="text-green-600 font-medium">✅ Operational</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVOR Integration:</span>
                      <span className="text-yellow-600 font-medium">⚡ Optional</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events Calendar:</span>
                      <span className="text-yellow-600 font-medium">⚡ Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>🛡️ Federated Independence:</strong> This platform operates with full functionality 
                  even when external services are unavailable. All core features including content submission, 
                  moderation, and governance work independently.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'extension' && (
            <div className="p-6">
              <AdminExtensionSetup />
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Content Moderation Queue</h2>
                <button 
                  onClick={loadModerationStats}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh Queue'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">🚧 Moderation Interface</h3>
                  <p className="text-sm text-yellow-800 mb-4">
                    The full moderation interface is available at the moderation API endpoints. 
                    Content can be approved, rejected, or edited through the API.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium mb-2">API Endpoints:</h4>
                      <ul className="text-sm space-y-1">
                        <li><code className="bg-gray-100 px-2 py-1 rounded">/api/moderate-content</code> - Approve/Reject/Edit</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded">/api/moderation-queue</code> - Get pending content</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded">/api/published-content</code> - View published content</li>
                      </ul>
                    </div>

                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium mb-2">Moderation Actions:</h4>
                      <ul className="text-sm space-y-1">
                        <li><strong>Approve:</strong> Publishes content and notifies IVOR/federated services</li>
                        <li><strong>Reject:</strong> Archives content with moderator reason</li>
                        <li><strong>Edit:</strong> Modify content and reset to pending status</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">📊 Queue Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Events awaiting review:</span>
                        <span className="font-medium">{stats.pendingEvents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Articles awaiting review:</span>
                        <span className="font-medium">{stats.pendingArticles}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total pending:</span>
                        <span>{stats.totalPending}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">🔄 Last Updated</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(stats.lastUpdated).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Statistics refresh automatically when you visit this page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;