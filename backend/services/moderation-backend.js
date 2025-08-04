/**
 * BLKOUT Moderation Backend - Production Ready
 * Unified content moderation system for newsroom and events
 */

const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://blkout-website-9stqi5sck-robs-projects-54d653d3.vercel.app',
    'https://blkoutuk.com',
    'https://www.blkoutuk.com',
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// In-memory store (in production, use a database)
let moderationQueue = [
  {
    id: 'mod_001',
    type: 'newsroom_article',
    status: 'pending',
    priority: 'medium',
    content: {
      id: 'art_pending_001',
      title: 'Community Voices: Stories of Resilience',
      content: 'A collection of powerful stories from community members about overcoming challenges...',
      author: 'Community Contributors',
      category: 'Community Stories'
    },
    submittedBy: 'Community Contributors',
    submittedAt: new Date('2025-01-20T10:30:00Z').toISOString(),
    assignedTo: null,
    reviewedAt: null,
    reviewedBy: null,
    reason: null,
    flags: ['community-generated'],
    metadata: {
      source: 'community_submission',
      word_count: 1200,
      estimated_read_time: 5
    }
  },
  {
    id: 'mod_002',
    type: 'event',
    status: 'pending',
    priority: 'high',
    content: {
      id: 'evt_pending_001',
      title: 'Pride Month Community Celebration',
      description: 'Join us for a month-long celebration of Pride with community events, workshops, and celebration.',
      date: '2025-06-15',
      organizer: 'Pride Collective UK',
      location: { type: 'physical', address: 'Hyde Park, London' }
    },
    submittedBy: 'Pride Collective UK',
    submittedAt: new Date('2025-01-18T15:45:00Z').toISOString(),
    assignedTo: null,
    reviewedAt: null,
    reviewedBy: null,
    reason: null,
    flags: ['time-sensitive'],
    metadata: {
      source: 'organization_submission',
      expected_attendance: 500,
      event_type: 'celebration'
    }
  }
];

let moderationHistory = [];
let moderators = [
  {
    id: 'mod_admin_001',
    name: 'Content Review Team',
    email: 'moderation@blkoutuk.com',
    role: 'lead_moderator',
    permissions: ['approve', 'reject', 'escalate', 'assign'],
    active: true,
    specializations: ['newsroom', 'events', 'community_safety']
  }
];

let moderationRules = {
  auto_approve_keywords: ['community', 'healing', 'celebration', 'support'],
  auto_flag_keywords: ['hate', 'discriminat', 'violence'],
  priority_rules: {
    urgent: ['safety', 'harassment', 'hate'],
    high: ['time-sensitive', 'large-event'],
    medium: ['community-generated', 'standard'],
    low: ['minor-edit', 'update']
  },
  review_time_limits: {
    urgent: 2, // hours
    high: 24, // hours
    medium: 48, // hours
    low: 72 // hours
  }
};

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Moderation Backend',
    status: 'healthy',
    version: '1.0.0',
    features: ['unified_moderation', 'parallel_workflows', 'automated_screening'],
    timestamp: new Date().toISOString()
  });
});

// Get moderation queue
app.get('/api/queue', (req, res) => {
  try {
    const { type, status, priority, assignedTo, limit = 20, offset = 0 } = req.query;
    
    let filteredQueue = [...moderationQueue];
    
    if (type) {
      filteredQueue = filteredQueue.filter(item => item.type === type);
    }
    
    if (status) {
      filteredQueue = filteredQueue.filter(item => item.status === status);
    }
    
    if (priority) {
      filteredQueue = filteredQueue.filter(item => item.priority === priority);
    }
    
    if (assignedTo) {
      filteredQueue = filteredQueue.filter(item => item.assignedTo === assignedTo);
    }
    
    // Sort by priority and submission date
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    filteredQueue.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });
    
    const paginatedQueue = filteredQueue.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      success: true,
      queue: paginatedQueue,
      total: filteredQueue.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < filteredQueue.length,
      summary: {
        pending: filteredQueue.filter(item => item.status === 'pending').length,
        in_review: filteredQueue.filter(item => item.status === 'in_review').length,
        approved: filteredQueue.filter(item => item.status === 'approved').length,
        rejected: filteredQueue.filter(item => item.status === 'rejected').length
      }
    });
    
  } catch (error) {
    console.error('Queue fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderation queue'
    });
  }
});

// Get single moderation item
app.get('/api/queue/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = moderationQueue.find(q => q.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Moderation item not found'
      });
    }
    
    // Add time-based information
    const now = new Date();
    const submittedTime = new Date(item.submittedAt);
    const hoursWaiting = Math.floor((now - submittedTime) / (1000 * 60 * 60));
    const reviewTimeLimit = moderationRules.review_time_limits[item.priority];
    
    res.json({
      success: true,
      item: {
        ...item,
        waitTime: {
          hours: hoursWaiting,
          isOverdue: hoursWaiting > reviewTimeLimit,
          timeLimit: reviewTimeLimit
        }
      }
    });
    
  } catch (error) {
    console.error('Item fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderation item'
    });
  }
});

// Submit content for moderation
app.post('/api/submit', (req, res) => {
  try {
    const { type, content, submittedBy, metadata } = req.body;
    
    if (!type || !content || !submittedBy) {
      return res.status(400).json({
        success: false,
        error: 'Type, content, and submittedBy are required'
      });
    }
    
    // Auto-screening for priority and flags
    const flags = [];
    let priority = 'medium';
    
    const contentText = JSON.stringify(content).toLowerCase();
    
    // Check for auto-flag keywords
    moderationRules.auto_flag_keywords.forEach(keyword => {
      if (contentText.includes(keyword)) {
        flags.push('requires_review');
        priority = 'urgent';
      }
    });
    
    // Check for time-sensitive content
    if (type === 'event') {
      const eventDate = new Date(content.date);
      const now = new Date();
      const daysUntilEvent = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEvent <= 14) {
        flags.push('time-sensitive');
        priority = 'high';
      }
    }
    
    // Check for large events
    if (type === 'event' && metadata?.expected_attendance > 100) {
      flags.push('large-event');
      if (priority === 'medium') priority = 'high';
    }
    
    const newItem = {
      id: `mod_${Date.now()}`,
      type,
      status: 'pending',
      priority,
      content,
      submittedBy,
      submittedAt: new Date().toISOString(),
      assignedTo: null,
      reviewedAt: null,
      reviewedBy: null,
      reason: null,
      flags,
      metadata: metadata || {}
    };
    
    moderationQueue.push(newItem);
    
    res.json({
      success: true,
      message: 'Content submitted for moderation',
      moderationId: newItem.id,
      priority: priority,
      estimatedReviewTime: `${moderationRules.review_time_limits[priority]} hours`,
      flags: flags
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit content for moderation'
    });
  }
});

// Moderate content (approve/reject/escalate)
app.post('/api/moderate/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason, moderatorId, notes } = req.body;
    
    if (!action || !moderatorId) {
      return res.status(400).json({
        success: false,
        error: 'Action and moderatorId are required'
      });
    }
    
    const itemIndex = moderationQueue.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Moderation item not found'
      });
    }
    
    const item = moderationQueue[itemIndex];
    const moderator = moderators.find(m => m.id === moderatorId);
    
    if (!moderator) {
      return res.status(400).json({
        success: false,
        error: 'Invalid moderator ID'
      });
    }
    
    const now = new Date().toISOString();
    
    // Create history record
    const historyRecord = {
      id: `hist_${Date.now()}`,
      moderationId: id,
      action,
      moderatorId,
      moderatorName: moderator.name,
      reason,
      notes,
      timestamp: now,
      previousStatus: item.status,
      newStatus: action
    };
    
    switch (action) {
      case 'approve':
        item.status = 'approved';
        item.reviewedAt = now;
        item.reviewedBy = moderatorId;
        item.reason = reason;
        
        // Remove from queue
        moderationQueue.splice(itemIndex, 1);
        moderationHistory.push(historyRecord);
        
        res.json({
          success: true,
          message: 'Content approved',
          item: item
        });
        break;
        
      case 'reject':
        if (!reason) {
          return res.status(400).json({
            success: false,
            error: 'Reason is required for rejection'
          });
        }
        
        item.status = 'rejected';
        item.reviewedAt = now;
        item.reviewedBy = moderatorId;
        item.reason = reason;
        
        moderationHistory.push(historyRecord);
        
        res.json({
          success: true,
          message: 'Content rejected',
          reason: reason
        });
        break;
        
      case 'escalate':
        item.status = 'escalated';
        item.priority = 'urgent';
        item.assignedTo = null; // Unassign for escalation
        item.flags.push('escalated');
        
        moderationHistory.push(historyRecord);
        
        res.json({
          success: true,
          message: 'Content escalated for senior review'
        });
        break;
        
      case 'assign':
        item.assignedTo = moderatorId;
        item.status = 'in_review';
        
        moderationHistory.push(historyRecord);
        
        res.json({
          success: true,
          message: 'Content assigned for review'
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Use: approve, reject, escalate, or assign'
        });
    }
    
  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to moderate content'
    });
  }
});

// Get moderation history
app.get('/api/history', (req, res) => {
  try {
    const { moderatorId, action, limit = 50, offset = 0 } = req.query;
    
    let filteredHistory = [...moderationHistory];
    
    if (moderatorId) {
      filteredHistory = filteredHistory.filter(record => record.moderatorId === moderatorId);
    }
    
    if (action) {
      filteredHistory = filteredHistory.filter(record => record.action === action);
    }
    
    // Sort by timestamp (newest first)
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const paginatedHistory = filteredHistory.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      success: true,
      history: paginatedHistory,
      total: filteredHistory.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < filteredHistory.length
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderation history'
    });
  }
});

// Get moderation statistics
app.get('/api/stats', (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const recentHistory = moderationHistory.filter(record => 
      new Date(record.timestamp) >= startDate
    );
    
    const stats = {
      queue: {
        total: moderationQueue.length,
        pending: moderationQueue.filter(item => item.status === 'pending').length,
        in_review: moderationQueue.filter(item => item.status === 'in_review').length,
        escalated: moderationQueue.filter(item => item.status === 'escalated').length,
        overdue: moderationQueue.filter(item => {
          const hoursWaiting = Math.floor((new Date() - new Date(item.submittedAt)) / (1000 * 60 * 60));
          return hoursWaiting > moderationRules.review_time_limits[item.priority];
        }).length
      },
      activity: {
        period: period,
        approved: recentHistory.filter(record => record.action === 'approve').length,
        rejected: recentHistory.filter(record => record.action === 'reject').length,
        escalated: recentHistory.filter(record => record.action === 'escalate').length,
        total_actions: recentHistory.length
      },
      types: {
        newsroom_articles: moderationQueue.filter(item => item.type === 'newsroom_article').length,
        events: moderationQueue.filter(item => item.type === 'event').length,
        community_stories: moderationQueue.filter(item => item.type === 'community_story').length,
        comments: moderationQueue.filter(item => item.type === 'comment').length
      },
      priorities: {
        urgent: moderationQueue.filter(item => item.priority === 'urgent').length,
        high: moderationQueue.filter(item => item.priority === 'high').length,
        medium: moderationQueue.filter(item => item.priority === 'medium').length,
        low: moderationQueue.filter(item => item.priority === 'low').length
      }
    };
    
    res.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderation statistics'
    });
  }
});

// Get moderators list
app.get('/api/moderators', (req, res) => {
  try {
    const activeModerators = moderators.filter(mod => mod.active);
    
    res.json({
      success: true,
      moderators: activeModerators.map(mod => ({
        id: mod.id,
        name: mod.name,
        role: mod.role,
        specializations: mod.specializations,
        permissions: mod.permissions
      }))
    });
    
  } catch (error) {
    console.error('Moderators fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderators'
    });
  }
});

// Get moderation rules
app.get('/api/rules', (req, res) => {
  try {
    res.json({
      success: true,
      rules: moderationRules
    });
    
  } catch (error) {
    console.error('Rules fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch moderation rules'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'This endpoint does not exist on the Moderation backend',
    available_endpoints: ['/health', '/api/queue', '/api/submit', '/api/moderate', '/api/stats']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Moderation Backend Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Moderation backend encountered an unexpected error'
  });
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`🛡️ Moderation Backend running on port ${port}`);
  console.log(`⚖️ Supporting unified content moderation and community safety`);
});

module.exports = app;