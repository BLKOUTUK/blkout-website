import React, { useState, useEffect } from 'react';
import { publicationService } from '../services/publicationService';

interface ModeratedContent {
  id: string;
  title: string;
  content: string;
  author?: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  source: string;
  created_at: string;
  event_date?: string;
  location?: string;
}

interface ModerationDashboardProps {
  moderatorId: string;
  onContentModerated?: (contentId: string, action: string) => void;
}

export const ModerationDashboard: React.FC<ModerationDashboardProps> = ({
  moderatorId,
  onContentModerated
}) => {
  const [pendingContent, setPendingContent] = useState<ModeratedContent[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch pending content
  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const content = await publicationService.getModerationQueue();
      setPendingContent(content);
      
      const count = await publicationService.getPendingCount();
      setPendingCount(count);
    } catch (err) {
      setError('Failed to load pending content');
      console.error('Failed to fetch pending content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingContent();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPendingContent, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle single item moderation
  const handleSingleAction = async (
    contentId: string, 
    action: 'approve' | 'reject', 
    reason?: string
  ) => {
    try {
      setActionInProgress(contentId);
      
      const response = await fetch('/api/moderate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          contentId,
          moderatorId,
          reason
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} content`);
      }

      // Refresh content list
      await fetchPendingContent();
      
      // Notify parent component
      onContentModerated?.(contentId, action);
      
    } catch (err) {
      setError(`Failed to ${action} content`);
      console.error(`${action} failed:`, err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle batch operations
  const handleBatchAction = async (action: 'approve' | 'reject', reason?: string) => {
    if (selectedItems.length === 0) {
      setError('No items selected for batch operation');
      return;
    }

    try {
      setActionInProgress('batch');
      
      const results = await publicationService.batchModerationAction(
        selectedItems,
        action,
        moderatorId,
        reason
      );

      if (results.failed.length > 0) {
        setError(`${action} failed for ${results.failed.length} items`);
      }

      // Clear selections and refresh
      setSelectedItems([]);
      await fetchPendingContent();
      
    } catch (err) {
      setError(`Batch ${action} failed`);
      console.error(`Batch ${action} failed:`, err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle item selection
  const toggleSelection = (contentId: string) => {
    setSelectedItems(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const selectAll = () => {
    setSelectedItems(pendingContent.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading moderation queue...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Content Moderation Dashboard
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {pendingCount} items awaiting moderation
          </p>
          <button
            onClick={fetchPendingContent}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Batch Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedItems.length} items selected
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBatchAction('approve')}
                disabled={actionInProgress === 'batch'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Batch Approve
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason:');
                  if (reason) handleBatchAction('reject', reason);
                }}
                disabled={actionInProgress === 'batch'}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Batch Reject
              </button>
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {pendingContent.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No content awaiting moderation</p>
          </div>
        ) : (
          <>
            {/* Bulk Selection Header */}
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.length === pendingContent.length}
                  onChange={() => 
                    selectedItems.length === pendingContent.length 
                      ? clearSelection() 
                      : selectAll()
                  }
                  className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({pendingContent.length} items)
                </span>
              </div>
            </div>

            {/* Content Items */}
            <div className="divide-y divide-gray-200">
              {pendingContent.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-6 hover:bg-gray-50 ${
                    selectedItems.includes(item.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                    />

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 space-x-4 mb-3">
                        <span>Source: {item.source}</span>
                        {item.author && <span>Author: {item.author}</span>}
                        <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                        {item.event_date && (
                          <span>Event: {new Date(item.event_date).toLocaleDateString()}</span>
                        )}
                        {item.location && <span>Location: {item.location}</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSingleAction(item.id, 'approve')}
                        disabled={actionInProgress === item.id}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionInProgress === item.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) handleSingleAction(item.id, 'reject', reason);
                        }}
                        disabled={actionInProgress === item.id}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModerationDashboard;