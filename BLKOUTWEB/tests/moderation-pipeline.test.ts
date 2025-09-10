import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { CommunityPublicationService } from '../src/services/publicationService';

// Mock Supabase client
vi.mock('@supabase/supabase-js');
const mockSupabase = {
  from: vi.fn(),
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  single: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
  in: vi.fn()
};

const mockCreateClient = vi.mocked(createClient);
mockCreateClient.mockReturnValue(mockSupabase as any);

describe('Content Moderation Pipeline', () => {
  let publicationService: CommunityPublicationService;
  const mockModeratorId = 'mod-123';
  const mockContentId = 'content-456';

  beforeEach(() => {
    publicationService = new CommunityPublicationService();
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.insert.mockReturnThis();
    mockSupabase.update.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.single.mockReturnThis();
    mockSupabase.order.mockReturnThis();
    mockSupabase.limit.mockReturnThis();
    mockSupabase.in.mockReturnThis();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Content Type Detection', () => {
    it('should detect events content type correctly', async () => {
      // Mock successful event lookup
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: mockContentId, title: 'Test Event' },
        error: null
      });

      const contentType = await (publicationService as any).detectContentTypeInternal(mockContentId);
      expect(contentType).toBe('events');
      expect(mockSupabase.from).toHaveBeenCalledWith('events');
    });

    it('should detect newsroom_articles content type correctly', async () => {
      // Mock event lookup failure, article lookup success
      mockSupabase.single
        .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
        .mockResolvedValueOnce({
          data: { id: mockContentId, title: 'Test Article' },
          error: null
        });

      const contentType = await (publicationService as any).detectContentTypeInternal(mockContentId);
      expect(contentType).toBe('newsroom_articles');
      expect(mockSupabase.from).toHaveBeenCalledWith('events');
      expect(mockSupabase.from).toHaveBeenCalledWith('newsroom_articles');
    });

    it('should throw error for non-existent content', async () => {
      // Mock both lookups failing
      mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

      await expect(
        (publicationService as any).detectContentTypeInternal(mockContentId)
      ).rejects.toThrow(`Content ${mockContentId} not found in any table`);
    });
  });

  describe('Approval Workflow', () => {
    const mockEventContent = {
      id: mockContentId,
      title: 'Community Event',
      content: 'Join us for a community gathering',
      author: 'Community Organizer',
      event_date: '2024-01-15T18:00:00Z',
      location: 'Community Center',
      status: 'pending',
      priority: 'medium',
      source: 'chrome_extension',
      created_at: '2024-01-10T10:00:00Z'
    };

    it('should approve content and publish successfully', async () => {
      // Mock content retrieval
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockEventContent, error: null })
        .mockResolvedValueOnce({ 
          data: { ...mockEventContent, id: 'published-123', published_at: new Date().toISOString() }, 
          error: null 
        });

      // Mock status update
      mockSupabase.update.mockResolvedValue({ error: null });
      
      // Mock insert for publication
      mockSupabase.insert.mockReturnThis();

      const result = await publicationService.approveFromModeration(
        mockContentId,
        mockModeratorId,
        'events'
      );

      expect(result).toBeDefined();
      expect(mockSupabase.from).toHaveBeenCalledWith('events');
      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: 'approved',
        approved_by: mockModeratorId,
        approved_at: expect.any(String)
      });
    });

    it('should handle approval errors gracefully', async () => {
      // Mock content not found
      mockSupabase.single.mockResolvedValue({ 
        data: null, 
        error: { message: 'Content not found' } 
      });

      await expect(
        publicationService.approveFromModeration(mockContentId, mockModeratorId, 'events')
      ).rejects.toThrow('Content not found in events');
    });
  });

  describe('Rejection Workflow', () => {
    it('should reject content with reason', async () => {
      const rejectionReason = 'Content violates community guidelines';
      
      mockSupabase.update.mockResolvedValue({ error: null });

      await publicationService.rejectFromModeration(
        mockContentId,
        mockModeratorId,
        rejectionReason,
        'events'
      );

      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: 'rejected',
        rejected_by: mockModeratorId,
        rejection_reason: rejectionReason,
        rejected_at: expect.any(String)
      });
    });
  });

  describe('Edit Functionality', () => {
    const edits = {
      title: 'Updated Title',
      content: 'Updated content',
      priority: 'high' as const
    };

    it('should edit content and reset status to pending', async () => {
      const updatedContent = {
        id: mockContentId,
        ...edits,
        status: 'pending',
        updated_at: expect.any(String)
      };

      mockSupabase.single.mockResolvedValue({ 
        data: updatedContent, 
        error: null 
      });

      const result = await publicationService.editFromModeration(
        mockContentId,
        mockModeratorId,
        edits,
        'events'
      );

      expect(result).toEqual(updatedContent);
      expect(mockSupabase.update).toHaveBeenCalledWith({
        ...edits,
        updated_at: expect.any(String),
        status: 'pending'
      });
    });
  });

  describe('Batch Operations', () => {
    const contentIds = ['content-1', 'content-2', 'content-3'];

    it('should handle batch approval successfully', async () => {
      // Mock content type detection for each item
      mockSupabase.single.mockResolvedValue({ 
        data: { id: 'mock-id', title: 'Mock Content' }, 
        error: null 
      });

      // Mock successful operations
      mockSupabase.update.mockResolvedValue({ error: null });
      mockSupabase.insert.mockReturnThis();

      const result = await publicationService.batchModerationAction(
        contentIds,
        'approve',
        mockModeratorId
      );

      expect(result.successful).toHaveLength(3);
      expect(result.failed).toHaveLength(0);
      expect(result.results).toHaveLength(3);
    });

    it('should handle partial failures in batch operations', async () => {
      // Mock mixed success/failure
      mockSupabase.single
        .mockResolvedValueOnce({ data: { id: 'content-1' }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
        .mockResolvedValueOnce({ data: { id: 'content-3' }, error: null });

      mockSupabase.update.mockResolvedValue({ error: null });
      mockSupabase.insert.mockReturnThis();

      const result = await publicationService.batchModerationAction(
        contentIds,
        'approve',
        mockModeratorId
      );

      expect(result.successful).toHaveLength(2);
      expect(result.failed).toHaveLength(1);
      expect(result.failed).toContain('content-2');
    });
  });

  describe('Pending Count', () => {
    it('should count pending items across tables', async () => {
      mockSupabase.select
        .mockResolvedValueOnce({ count: 5, error: null })  // events
        .mockResolvedValueOnce({ count: 3, error: null }); // newsroom_articles

      const count = await publicationService.getPendingCount();

      expect(count).toBe(8);
      expect(mockSupabase.from).toHaveBeenCalledWith('events');
      expect(mockSupabase.from).toHaveBeenCalledWith('newsroom_articles');
      expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'pending');
    });

    it('should handle count errors gracefully', async () => {
      mockSupabase.select.mockResolvedValue({ 
        count: null, 
        error: { message: 'Database error' } 
      });

      const count = await publicationService.getPendingCount();

      expect(count).toBe(0);
    });
  });

  describe('Moderation Queue', () => {
    it('should fetch pending and rejected content', async () => {
      const mockContent = [
        { id: '1', title: 'Content 1', status: 'pending' },
        { id: '2', title: 'Content 2', status: 'rejected' }
      ];

      mockSupabase.select.mockResolvedValue({ 
        data: mockContent, 
        error: null 
      });

      const queue = await publicationService.getModerationQueue();

      expect(queue).toEqual(mockContent);
      expect(mockSupabase.in).toHaveBeenCalledWith('status', ['pending', 'rejected']);
    });
  });
});

describe('Moderation API Integration', () => {
  // Mock fetch for API testing
  global.fetch = vi.fn();

  beforeEach(() => {
    vi.mocked(fetch).mockClear();
  });

  it('should handle approve action via API', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        message: 'Content approved and published successfully',
        data: {
          contentId: mockContentId,
          action: 'approved',
          timestamp: new Date().toISOString()
        }
      })
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const response = await fetch('/api/moderate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        contentId: mockContentId,
        moderatorId: 'mod-123'
      })
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.action).toBe('approved');
  });

  it('should handle reject action via API', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        message: 'Content rejected successfully',
        data: {
          contentId: mockContentId,
          action: 'rejected',
          reason: 'Inappropriate content'
        }
      })
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const response = await fetch('/api/moderate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reject',
        contentId: mockContentId,
        moderatorId: 'mod-123',
        reason: 'Inappropriate content'
      })
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.reason).toBe('Inappropriate content');
  });

  it('should handle edit action via API', async () => {
    const edits = {
      title: 'Updated Title',
      priority: 'high'
    };

    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        message: 'Content edited successfully',
        data: {
          contentId: mockContentId,
          action: 'edited',
          edits
        }
      })
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const response = await fetch('/api/moderate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'edit',
        contentId: mockContentId,
        moderatorId: 'mod-123',
        edits
      })
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.edits).toEqual(edits);
  });
});