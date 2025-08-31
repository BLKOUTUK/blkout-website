// IVOR Event-Driven Coordination System
// Cross-stream real-time coordination with Redis pub/sub architecture

import { Redis } from 'ioredis';
import { createClient } from '@supabase/supabase-js';

// Initialize connections
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Redis connection for pub/sub coordination
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const redisSubscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export interface CrossDomainEvent {
  id: string;
  event_type: 'PersonalAchievement' | 'CommunityInsight' | 'ProjectUpdate' | 'SocialShare' | 'ResourceRequest' | 'CommunityNotification';
  source_domain: 'core' | 'community' | 'organizing' | 'social';
  target_domains: string[];
  event_data: Record<string, any>;
  journey_context?: Record<string, any>;
  community_impact_data?: Record<string, any>;
  processing_status: 'pending' | 'processed' | 'failed';
  liberation_relevance_score: number;
  cultural_sensitivity_check: boolean;
  community_consent_verified: boolean;
  created_at: string;
  processed_at?: string;
}

export interface EventHandler {
  domain: string;
  event_types: string[];
  handler: (event: CrossDomainEvent) => Promise<void>;
  priority: number;
}

export interface CoordinationMetrics {
  events_processed_24h: number;
  average_processing_time: number;
  cross_domain_efficiency: number;
  community_engagement_rate: number;
  liberation_impact_score: number;
}

class EventCoordination {
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private isInitialized = false;
  private coordinationMetrics: CoordinationMetrics = {
    events_processed_24h: 0,
    average_processing_time: 0,
    cross_domain_efficiency: 0,
    community_engagement_rate: 0,
    liberation_impact_score: 0
  };

  /**
   * Initialize event-driven coordination system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🔄 Initializing Event-Driven Coordination System...');

    try {
      // Set up Redis pub/sub channels
      await this.setupRedisChannels();

      // Register default event handlers for each domain
      this.registerDefaultHandlers();

      // Start event processing loop
      this.startEventProcessing();

      // Initialize coordination metrics
      await this.initializeMetrics();

      this.isInitialized = true;
      console.log('✅ Event coordination system initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing event coordination:', error);
      throw error;
    }
  }

  /**
   * Set up Redis pub/sub channels for real-time coordination
   */
  private async setupRedisChannels(): Promise<void> {
    const channels = [
      'ivor:core:events',
      'ivor:community:events', 
      'ivor:organizing:events',
      'ivor:social:events',
      'ivor:coordination:broadcast'
    ];

    // Subscribe to all domain channels
    await redisSubscriber.subscribe(...channels);

    // Set up message handlers
    redisSubscriber.on('message', async (channel, message) => {
      try {
        const event: CrossDomainEvent = JSON.parse(message);
        await this.processIncomingEvent(event, channel);
      } catch (error) {
        console.error(`❌ Error processing Redis message from ${channel}:`, error);
      }
    });

    console.log(`📡 Subscribed to ${channels.length} Redis channels`);
  }

  /**
   * Register default event handlers for each domain
   */
  private registerDefaultHandlers(): void {
    // Core domain handlers
    this.registerHandler({
      domain: 'core',
      event_types: ['CommunityInsight', 'ResourceRequest', 'ProjectUpdate'],
      handler: this.handleCoreEvents.bind(this),
      priority: 1
    });

    // Community domain handlers
    this.registerHandler({
      domain: 'community',
      event_types: ['PersonalAchievement', 'ProjectUpdate', 'SocialShare'],
      handler: this.handleCommunityEvents.bind(this),
      priority: 1
    });

    // Organizing domain handlers
    this.registerHandler({
      domain: 'organizing',
      event_types: ['CommunityInsight', 'PersonalAchievement', 'ResourceRequest'],
      handler: this.handleOrganizingEvents.bind(this),
      priority: 1
    });

    // Social domain handlers
    this.registerHandler({
      domain: 'social',
      event_types: ['ProjectUpdate', 'PersonalAchievement', 'CommunityInsight'],
      handler: this.handleSocialEvents.bind(this),
      priority: 1
    });

    console.log('📝 Default event handlers registered for all domains');
  }

  /**
   * Register custom event handler
   */
  registerHandler(handler: EventHandler): void {
    for (const eventType of handler.event_types) {
      if (!this.eventHandlers.has(eventType)) {
        this.eventHandlers.set(eventType, []);
      }
      
      const handlers = this.eventHandlers.get(eventType)!;
      handlers.push(handler);
      
      // Sort by priority (higher priority first)
      handlers.sort((a, b) => b.priority - a.priority);
    }

    console.log(`🔧 Registered handler for ${handler.domain} domain: ${handler.event_types.join(', ')}`);
  }

  /**
   * Publish cross-domain event
   */
  async publishEvent(event: Omit<CrossDomainEvent, 'id' | 'created_at' | 'processing_status'>): Promise<string> {
    try {
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const fullEvent: CrossDomainEvent = {
        ...event,
        id: eventId,
        created_at: new Date().toISOString(),
        processing_status: 'pending'
      };

      // Store event in database for persistence
      await supabase
        .from('cross_domain_events')
        .insert(fullEvent);

      // Publish to Redis for real-time processing
      const sourceChannel = `ivor:${event.source_domain}:events`;
      await redis.publish(sourceChannel, JSON.stringify(fullEvent));

      // Publish to target domain channels
      for (const targetDomain of event.target_domains) {
        const targetChannel = `ivor:${targetDomain}:events`;
        await redis.publish(targetChannel, JSON.stringify(fullEvent));
      }

      // Broadcast to coordination channel for system-wide visibility
      await redis.publish('ivor:coordination:broadcast', JSON.stringify({
        ...fullEvent,
        broadcast_type: 'cross_domain_event'
      }));

      console.log(`📤 Published event ${eventId} from ${event.source_domain} to [${event.target_domains.join(', ')}]`);
      return eventId;

    } catch (error) {
      console.error('❌ Error publishing event:', error);
      throw error;
    }
  }

  /**
   * Process incoming event from Redis
   */
  private async processIncomingEvent(event: CrossDomainEvent, channel: string): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Get relevant handlers for this event type
      const handlers = this.eventHandlers.get(event.event_type) || [];
      
      if (handlers.length === 0) {
        console.warn(`⚠️ No handlers found for event type: ${event.event_type}`);
        return;
      }

      // Process event with all registered handlers
      const processingPromises = handlers.map(handler => 
        this.executeHandler(handler, event).catch(error => {
          console.error(`❌ Handler error for ${handler.domain}:`, error);
          return null; // Don't fail entire event processing
        })
      );

      await Promise.all(processingPromises);

      // Update event status in database
      await supabase
        .from('cross_domain_events')
        .update({
          processing_status: 'processed',
          processed_at: new Date().toISOString()
        })
        .eq('id', event.id);

      // Update coordination metrics
      const processingTime = Date.now() - startTime;
      await this.updateMetrics(processingTime, event);

      console.log(`✅ Processed event ${event.id} in ${processingTime}ms`);

    } catch (error) {
      console.error(`❌ Error processing event ${event.id}:`, error);
      
      // Mark event as failed
      await supabase
        .from('cross_domain_events')
        .update({ processing_status: 'failed' })
        .eq('id', event.id);
    }
  }

  /**
   * Execute event handler with error recovery
   */
  private async executeHandler(handler: EventHandler, event: CrossDomainEvent): Promise<void> {
    try {
      await handler.handler(event);
    } catch (error) {
      console.error(`❌ Handler execution failed for ${handler.domain}:`, error);
      
      // Implement retry logic for critical events
      if (event.liberation_relevance_score >= 80) {
        console.log(`🔄 Retrying critical event ${event.id} for ${handler.domain}`);
        setTimeout(() => this.executeHandler(handler, event), 5000);
      }
      
      throw error;
    }
  }

  /**
   * Handle events for Core domain (personal AI)
   */
  private async handleCoreEvents(event: CrossDomainEvent): Promise<void> {
    try {
      switch (event.event_type) {
        case 'CommunityInsight':
          // Update personal journey context with community insights
          await this.updatePersonalContext(event);
          break;

        case 'ResourceRequest':
          // Connect personal needs with available resources
          await this.matchPersonalResources(event);
          break;

        case 'ProjectUpdate':
          // Notify relevant users about project opportunities
          await this.notifyPersonalOpportunities(event);
          break;
      }

      console.log(`🧠 Core domain processed ${event.event_type}`);

    } catch (error) {
      console.error('❌ Error in Core event handler:', error);
      throw error;
    }
  }

  /**
   * Handle events for Community domain (intelligence)
   */
  private async handleCommunityEvents(event: CrossDomainEvent): Promise<void> {
    try {
      switch (event.event_type) {
        case 'PersonalAchievement':
          // Aggregate personal achievements into community patterns
          await this.aggregateAchievementPatterns(event);
          break;

        case 'ProjectUpdate':
          // Analyze project impact on community intelligence
          await this.analyzeProjectCommunityImpact(event);
          break;

        case 'SocialShare':
          // Track viral content impact on community engagement
          await this.trackCommunityEngagement(event);
          break;
      }

      console.log(`🏘️ Community domain processed ${event.event_type}`);

    } catch (error) {
      console.error('❌ Error in Community event handler:', error);
      throw error;
    }
  }

  /**
   * Handle events for Organizing domain (mobilization)
   */
  private async handleOrganizingEvents(event: CrossDomainEvent): Promise<void> {
    try {
      switch (event.event_type) {
        case 'CommunityInsight':
          // Convert insights into organizing opportunities
          await this.createOrganizingOpportunities(event);
          break;

        case 'PersonalAchievement':
          // Identify potential community leaders and organizers
          await this.identifyOrganizingPotential(event);
          break;

        case 'ResourceRequest':
          // Mobilize community resources for organizing efforts
          await this.mobilizeOrganizingResources(event);
          break;
      }

      console.log(`✊ Organizing domain processed ${event.event_type}`);

    } catch (error) {
      console.error('❌ Error in Organizing event handler:', error);
      throw error;
    }
  }

  /**
   * Handle events for Social domain (viral growth)
   */
  private async handleSocialEvents(event: CrossDomainEvent): Promise<void> {
    try {
      switch (event.event_type) {
        case 'ProjectUpdate':
          // Generate social content for project promotion
          await this.generateProjectSocialContent(event);
          break;

        case 'PersonalAchievement':
          // Create shareable achievement content
          await this.createAchievementContent(event);
          break;

        case 'CommunityInsight':
          // Transform insights into viral social content
          await this.createInsightBasedContent(event);
          break;
      }

      console.log(`📱 Social domain processed ${event.event_type}`);

    } catch (error) {
      console.error('❌ Error in Social event handler:', error);
      throw error;
    }
  }

  /**
   * Start continuous event processing loop
   */
  private startEventProcessing(): void {
    // Process pending events from database every 30 seconds
    setInterval(async () => {
      try {
        await this.processPendingEvents();
      } catch (error) {
        console.error('❌ Error in event processing loop:', error);
      }
    }, 30000);

    // Update coordination metrics every 5 minutes
    setInterval(async () => {
      try {
        await this.calculateCoordinationMetrics();
      } catch (error) {
        console.error('❌ Error updating coordination metrics:', error);
      }
    }, 300000);

    console.log('⏰ Event processing loops started');
  }

  /**
   * Process any pending events from database
   */
  private async processPendingEvents(): Promise<void> {
    try {
      const { data: pendingEvents } = await supabase
        .from('cross_domain_events')
        .select('*')
        .eq('processing_status', 'pending')
        .lt('created_at', new Date(Date.now() - 60000).toISOString()) // Older than 1 minute
        .limit(50);

      if (pendingEvents && pendingEvents.length > 0) {
        console.log(`🔄 Processing ${pendingEvents.length} pending events`);

        for (const event of pendingEvents) {
          await this.processIncomingEvent(event, 'database_recovery');
        }
      }

    } catch (error) {
      console.error('❌ Error processing pending events:', error);
    }
  }

  /**
   * Initialize coordination metrics
   */
  private async initializeMetrics(): Promise<void> {
    await this.calculateCoordinationMetrics();
    console.log('📊 Coordination metrics initialized');
  }

  /**
   * Update processing metrics
   */
  private async updateMetrics(processingTime: number, event: CrossDomainEvent): Promise<void> {
    this.coordinationMetrics.events_processed_24h++;
    
    // Update average processing time (exponential moving average)
    this.coordinationMetrics.average_processing_time = 
      (this.coordinationMetrics.average_processing_time * 0.9) + (processingTime * 0.1);

    // Store metrics update in Redis for real-time monitoring
    await redis.setex(
      'ivor:coordination:metrics', 
      300, // 5 minute TTL
      JSON.stringify(this.coordinationMetrics)
    );
  }

  /**
   * Calculate comprehensive coordination metrics
   */
  private async calculateCoordinationMetrics(): Promise<CoordinationMetrics> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Get events processed in last 24 hours
      const { data: recentEvents, error } = await supabase
        .from('cross_domain_events')
        .select('processing_status, liberation_relevance_score, created_at, processed_at')
        .gte('created_at', twentyFourHoursAgo);

      if (error) throw error;

      const processedEvents = recentEvents?.filter(e => e.processing_status === 'processed') || [];
      const totalEvents = recentEvents?.length || 0;

      // Calculate metrics
      this.coordinationMetrics = {
        events_processed_24h: processedEvents.length,
        average_processing_time: processedEvents.length > 0 
          ? processedEvents.reduce((sum, event) => {
              const processingTime = new Date(event.processed_at).getTime() - new Date(event.created_at).getTime();
              return sum + processingTime;
            }, 0) / processedEvents.length
          : 0,
        cross_domain_efficiency: totalEvents > 0 ? (processedEvents.length / totalEvents) * 100 : 0,
        community_engagement_rate: this.calculateEngagementRate(processedEvents),
        liberation_impact_score: processedEvents.length > 0
          ? processedEvents.reduce((sum, event) => sum + event.liberation_relevance_score, 0) / processedEvents.length
          : 0
      };

      return this.coordinationMetrics;

    } catch (error) {
      console.error('❌ Error calculating coordination metrics:', error);
      return this.coordinationMetrics;
    }
  }

  /**
   * Calculate community engagement rate from processed events
   */
  private calculateEngagementRate(events: any[]): number {
    if (events.length === 0) return 0;
    
    const engagementEvents = events.filter(event => 
      ['PersonalAchievement', 'SocialShare', 'CommunityNotification'].includes(event.event_type)
    );
    
    return (engagementEvents.length / events.length) * 100;
  }

  /**
   * Get real-time coordination metrics
   */
  async getCoordinationMetrics(): Promise<CoordinationMetrics> {
    try {
      // Try to get cached metrics from Redis first
      const cached = await redis.get('ivor:coordination:metrics');
      if (cached) {
        return JSON.parse(cached);
      }

      // Calculate fresh metrics if not cached
      return await this.calculateCoordinationMetrics();

    } catch (error) {
      console.error('❌ Error getting coordination metrics:', error);
      return this.coordinationMetrics;
    }
  }

  // Event handler implementation methods (simplified for brevity)
  private async updatePersonalContext(event: CrossDomainEvent): Promise<void> {
    // Implementation for updating personal AI context with community insights
    console.log(`🧠 Updating personal context with community insight: ${event.id}`);
  }

  private async matchPersonalResources(event: CrossDomainEvent): Promise<void> {
    // Implementation for matching personal needs with available resources
    console.log(`🔗 Matching personal resources for event: ${event.id}`);
  }

  private async notifyPersonalOpportunities(event: CrossDomainEvent): Promise<void> {
    // Implementation for notifying users of relevant opportunities
    console.log(`📢 Notifying personal opportunities for event: ${event.id}`);
  }

  private async aggregateAchievementPatterns(event: CrossDomainEvent): Promise<void> {
    // Implementation for aggregating achievement patterns
    console.log(`📊 Aggregating achievement patterns from event: ${event.id}`);
  }

  private async analyzeProjectCommunityImpact(event: CrossDomainEvent): Promise<void> {
    // Implementation for analyzing project community impact
    console.log(`🏘️ Analyzing community impact for event: ${event.id}`);
  }

  private async trackCommunityEngagement(event: CrossDomainEvent): Promise<void> {
    // Implementation for tracking community engagement
    console.log(`📈 Tracking community engagement for event: ${event.id}`);
  }

  private async createOrganizingOpportunities(event: CrossDomainEvent): Promise<void> {
    // Implementation for creating organizing opportunities
    console.log(`✊ Creating organizing opportunities from event: ${event.id}`);
  }

  private async identifyOrganizingPotential(event: CrossDomainEvent): Promise<void> {
    // Implementation for identifying organizing potential
    console.log(`👥 Identifying organizing potential from event: ${event.id}`);
  }

  private async mobilizeOrganizingResources(event: CrossDomainEvent): Promise<void> {
    // Implementation for mobilizing organizing resources
    console.log(`📦 Mobilizing organizing resources for event: ${event.id}`);
  }

  private async generateProjectSocialContent(event: CrossDomainEvent): Promise<void> {
    // Implementation for generating project social content
    console.log(`📱 Generating social content for project event: ${event.id}`);
  }

  private async createAchievementContent(event: CrossDomainEvent): Promise<void> {
    // Implementation for creating achievement content
    console.log(`🎉 Creating achievement content for event: ${event.id}`);
  }

  private async createInsightBasedContent(event: CrossDomainEvent): Promise<void> {
    // Implementation for creating insight-based content
    console.log(`💡 Creating insight-based content for event: ${event.id}`);
  }
}

// Export singleton instance
export const eventCoordination = new EventCoordination();