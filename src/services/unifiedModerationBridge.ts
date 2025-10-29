// Unified Content Moderation Bridge - Option 3 Implementation
// Webhook/API bridge system for cross-platform moderation synchronization

import { moderationService } from './moderationService'
import { supabase } from '../lib/supabase'

interface ModerationAction {
  id: string
  contentType: 'event' | 'newsroom_article' | 'community_story'
  action: 'approve' | 'reject'
  reason?: string
  moderatorId?: string
  sourceSystem: 'platform-admin' | 'events-admin' | 'chrome-extension'
  timestamp: string
}

interface WebhookPayload {
  type: 'moderation_action'
  data: ModerationAction
  signature?: string
}

interface SyncTarget {
  url: string
  name: string
  active: boolean
}

class UnifiedModerationBridge {
  private syncTargets: SyncTarget[] = [
    {
      url: 'https://events-blkout.vercel.app/api/webhook/moderation',
      name: 'events-calendar',
      active: true
    }
  ]
  
  private webhookSecret = 'blkout-moderation-sync-2025' // In production, use env var

  constructor() {
    this.setupRealtimeListener()
  }

  /**
   * Set up real-time listener for Supabase changes
   * This detects when moderation actions occur in the database
   */
  private setupRealtimeListener() {
    // Listen for events table changes
    supabase
      .channel('events_moderation')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'events',
          filter: 'status=in.(published,archived,rejected)'
        }, 
        (payload) => this.handleDatabaseChange('event', payload)
      )
      .subscribe()

    // Listen for news_articles table changes
    supabase
      .channel('articles_moderation')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'news_articles',
          filter: 'status=in.(published,archived,rejected)'
        }, 
        (payload) => this.handleDatabaseChange('newsroom_article', payload)
      )
      .subscribe()
  }

  /**
   * Handle database change events and sync to other platforms
   */
  private async handleDatabaseChange(contentType: 'event' | 'newsroom_article', payload: any) {
    console.log(`🔄 Database change detected for ${contentType}:`, payload)
    
    const { new: newRecord, old: oldRecord } = payload
    
    // Check if this is actually a moderation action (status change)
    if (newRecord.status !== oldRecord?.status) {
      const action: ModerationAction = {
        id: newRecord.id,
        contentType,
        action: newRecord.status === 'published' ? 'approve' : 'reject',
        reason: newRecord.moderation_reason || 'Moderated via admin interface',
        sourceSystem: 'platform-admin',
        timestamp: new Date().toISOString()
      }

      // Broadcast to all sync targets
      await this.broadcastModerationAction(action)
    }
  }

  /**
   * Manually trigger moderation action and sync
   */
  async triggerModerationAction(
    id: string, 
    contentType: 'event' | 'newsroom_article',
    action: 'approve' | 'reject',
    reason?: string,
    sourceSystem: 'platform-admin' | 'events-admin' | 'chrome-extension' = 'platform-admin'
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log(`🎯 Triggering moderation action:`, { id, contentType, action, sourceSystem })

      // First, perform the moderation action locally
      const result = await moderationService.moderateContent(id, action, reason)
      
      if (!result.success) {
        return { success: false, error: result.error }
      }

      // Create moderation action record
      const moderationAction: ModerationAction = {
        id,
        contentType,
        action,
        reason,
        sourceSystem,
        timestamp: new Date().toISOString()
      }

      // Broadcast to sync targets (other systems)
      await this.broadcastModerationAction(moderationAction)

      return { 
        success: true, 
        message: `Content ${action}ed and synced across platforms`
      }
    } catch (error) {
      console.error('Error in triggerModerationAction:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Broadcast moderation action to all sync targets via webhooks
   */
  private async broadcastModerationAction(action: ModerationAction) {
    const payload: WebhookPayload = {
      type: 'moderation_action',
      data: action,
      signature: this.generateSignature(action)
    }

    console.log(`📡 Broadcasting moderation action to ${this.syncTargets.length} targets:`, payload)

    const promises = this.syncTargets
      .filter(target => target.active)
      .map(target => this.sendWebhook(target, payload))

    const results = await Promise.allSettled(promises)
    
    // Log results
    results.forEach((result, index) => {
      const target = this.syncTargets[index]
      if (result.status === 'fulfilled') {
        console.log(`✅ Successfully synced to ${target.name}`)
      } else {
        console.error(`❌ Failed to sync to ${target.name}:`, result.reason)
      }
    })
  }

  /**
   * Send webhook to individual target
   */
  private async sendWebhook(target: SyncTarget, payload: WebhookPayload): Promise<void> {
    const response = await fetch(target.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': payload.signature || '',
        'User-Agent': 'BLKOUT-Moderation-Bridge/1.0'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  /**
   * Generate webhook signature for security
   */
  private generateSignature(action: ModerationAction): string {
    // Simple signature based on content + secret
    const content = JSON.stringify(action)
    const signature = btoa(`${this.webhookSecret}:${content}`).substring(0, 32)
    return signature
  }

  /**
   * Handle incoming webhook from other systems
   */
  async handleIncomingWebhook(payload: WebhookPayload): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log(`📥 Received webhook:`, payload)

      // Verify signature (basic security)
      const expectedSignature = this.generateSignature(payload.data)
      if (payload.signature !== expectedSignature) {
        return { success: false, error: 'Invalid webhook signature' }
      }

      const { data: action } = payload

      // Avoid circular updates - don't sync back to the same system that sent the update
      if (action.sourceSystem === 'platform-admin') {
        console.log(`⚠️  Ignoring webhook from same system (${action.sourceSystem})`)
        return { success: true, message: 'Ignored - same source system' }
      }

      // Apply the moderation action locally without triggering another broadcast
      const result = await this.applyModerationActionLocally(action)
      
      return result
    } catch (error) {
      console.error('Error handling incoming webhook:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Apply moderation action locally without broadcasting (to prevent loops)
   */
  private async applyModerationActionLocally(action: ModerationAction): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log(`🔧 Applying moderation action locally:`, action)

    try {
      // Update the database directly without triggering the realtime listener
      const tableName = action.contentType === 'event' ? 'events' : 'news_articles'
      const newStatus = action.action === 'approve' ? 'published' : 'archived'

      const { data, error } = await supabase
        .from(tableName)
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          moderation_reason: action.reason || `Synced from ${action.sourceSystem}`,
          synced_from: action.sourceSystem
        })
        .eq('id', action.id)
        .select()

      if (error) {
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        message: `Successfully synced ${action.action} action for ${action.contentType} ${action.id}`
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get sync status and statistics
   */
  getSyncStatus() {
    return {
      targets: this.syncTargets,
      activeTargets: this.syncTargets.filter(t => t.active).length,
      status: 'active'
    }
  }

  /**
   * Add or update sync target
   */
  updateSyncTarget(name: string, url: string, active: boolean = true) {
    const existingIndex = this.syncTargets.findIndex(t => t.name === name)
    if (existingIndex >= 0) {
      this.syncTargets[existingIndex] = { name, url, active }
    } else {
      this.syncTargets.push({ name, url, active })
    }
  }
}

export const unifiedModerationBridge = new UnifiedModerationBridge()
export type { ModerationAction, WebhookPayload }