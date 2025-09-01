import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, XCircle, Clock, Eye, FileText, User, Calendar, 
  Filter, RefreshCw, MessageSquare, AlertTriangle, Loader, Edit3, Save, X
} from 'lucide-react'
import { moderationService, type ModerationItem, type ModerationStats } from '../../../services/moderationService'

const SimpleModeration: React.FC = () => {
  const [queue, setQueue] = useState<ModerationItem[]>([])
  const [stats, setStats] = useState<ModerationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'high-priority'>('pending')
  const [moderating, setModerating] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState<{
    title: string
    content: string
    author: string
    category: string
  }>({ title: '', content: '', author: '', category: '' })

  useEffect(() => {
    loadModerationData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadModerationData, 30000)
    return () => clearInterval(interval)
  }, [filter])

  const loadModerationData = async () => {
    setLoading(true)
    try {
      // Load queue with filters
      const queueFilters = {
        ...(filter === 'pending' && { status: 'pending' }),
        ...(filter === 'high-priority' && { priority: 'high' }),
        limit: 50
      }

      const [queueResponse, statsResponse] = await Promise.all([
        moderationService.getQueue(queueFilters),
        moderationService.getStats()
      ])

      if (queueResponse.success) {
        setQueue(queueResponse.data?.items || [])
      }

      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
    } catch (error) {
      console.error('Error loading moderation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerate = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    setModerating(id)
    try {
      const response = await moderationService.moderateContent(id, action, reason)
      
      if (response.success) {
        // Remove item from queue or update its status
        setQueue(prev => prev.filter(item => item.id !== id))
        setSelectedItem(null)
        setEditing(false)
        
        // Refresh stats
        await loadModerationData()
        
        // Show success message (could integrate with notification system)
        console.log(`Item ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      } else {
        console.error('Moderation failed:', response.error)
      }
    } catch (error) {
      console.error('Error moderating content:', error)
    } finally {
      setModerating(null)
    }
  }

  const handleStartEditing = (item: ModerationItem) => {
    setEditedContent({
      title: item.content.title,
      content: item.content.content || '',
      author: item.content.author,
      category: item.content.category
    })
    setEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedItem) return
    
    try {
      // Here we would update the content in the database
      // For now, we'll update the local state to show the edited content
      const updatedItem = {
        ...selectedItem,
        content: {
          ...selectedItem.content,
          ...editedContent
        }
      }
      
      // Update the selected item
      setSelectedItem(updatedItem)
      
      // Update the queue
      setQueue(prev => prev.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      ))
      
      setEditing(false)
      console.log('Content updated successfully')
    } catch (error) {
      console.error('Error updating content:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditing(false)
    if (selectedItem) {
      setEditedContent({
        title: selectedItem.content.title,
        content: selectedItem.content.content || '',
        author: selectedItem.content.author,
        category: selectedItem.content.category
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-900/20'
      case 'high': return 'text-orange-400 bg-orange-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/20'
      case 'rejected': return 'text-red-400 bg-red-900/20'
      case 'flagged': return 'text-orange-400 bg-orange-900/20'
      default: return 'text-blue-400 bg-blue-900/20'
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading moderation panel...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Content Moderation</h1>
              <p className="text-gray-400">Review and moderate community-submitted content (articles, events, and more)</p>
            </div>
            <button
              onClick={loadModerationData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.pendingCount}</div>
                  <div className="text-gray-400 text-sm">Pending Review</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.newsroomQueue}</div>
                  <div className="text-gray-400 text-sm">Newsroom Queue</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.todayActions}</div>
                  <div className="text-gray-400 text-sm">Actions Today</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.activeModerators}</div>
                  <div className="text-gray-400 text-sm">Active Moderators</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Filter:</span>
          </div>
          {(['all', 'pending', 'high-priority'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filterOption.replace('-', ' ')}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Queue List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-6">Moderation Queue</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
                <div className="text-gray-400">Loading queue...</div>
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <div className="text-gray-400">No items pending moderation</div>
                <div className="text-sm text-gray-500 mt-1">Great job keeping up!</div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-900/20 border-blue-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-white text-sm leading-tight">
                        {item.content.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.submittedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </span>
                      {item.flags.length > 0 && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <AlertTriangle className="w-3 h-3" />
                          {item.flags.length} flag{item.flags.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Item Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-6">Content Preview</h2>
            
            {selectedItem ? (
              <div className="space-y-6">
                {/* Edit Controls */}
                {!editing && selectedItem.status === 'pending' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleStartEditing(selectedItem)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Content
                    </button>
                  </div>
                )}

                {/* Item Details */}
                <div>
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={editedContent.title}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                          <input
                            type="text"
                            value={editedContent.author}
                            onChange={(e) => setEditedContent(prev => ({ ...prev, author: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                          <input
                            type="text"
                            value={editedContent.category}
                            onChange={(e) => setEditedContent(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {selectedItem.content.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {selectedItem.content.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          By {selectedItem.content.author}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  {editing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                      <textarea
                        value={editedContent.content}
                        onChange={(e) => setEditedContent(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                        placeholder="Content preview..."
                      />
                    </div>
                  ) : (
                    <p className="text-gray-300 leading-relaxed">
                      {selectedItem.content.content || 'No content preview available'}
                    </p>
                  )}
                </div>

                {/* Metadata */}
                {selectedItem.metadata && (
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Submission Details</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Source: {selectedItem.metadata.source}</div>
                      {selectedItem.metadata.word_count && (
                        <div>Word count: {selectedItem.metadata.word_count}</div>
                      )}
                      {selectedItem.metadata.estimated_read_time && (
                        <div>Est. reading time: {selectedItem.metadata.estimated_read_time} min</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Flags */}
                {selectedItem.flags.length > 0 && (
                  <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="text-orange-400 font-medium mb-2">Flags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.flags.map((flag, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-600 text-orange-100 rounded text-sm">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Moderation Actions */}
                {selectedItem.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    {editing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleModerate(selectedItem.id, 'approve')}
                          disabled={moderating === selectedItem.id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {moderating === selectedItem.id ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerate(selectedItem.id, 'reject', 'Does not meet community guidelines')}
                          disabled={moderating === selectedItem.id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {moderating === selectedItem.id ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <div className="text-gray-400">Select an item to preview</div>
                <div className="text-sm text-gray-500 mt-1">Click any item from the queue to review</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SimpleModeration