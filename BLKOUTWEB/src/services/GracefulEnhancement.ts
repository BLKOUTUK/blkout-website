// Graceful Enhancement Patterns for Optional Service Integration
// Ensures features work perfectly standalone and improve when services are available
// File: src/services/GracefulEnhancement.ts

import { blkoutModule } from './IndependentModuleCore';
import { connectionManager } from './FederatedConnectionManager';
import { serviceDiscovery } from './OptionalServiceDiscovery';

interface EnhancementResult<T> {
  baseData: T;
  enhancements: Record<string, any>;
  servicesUsed: string[];
  fallbacksUsed: string[];
  responseTime: number;
}

interface WisdomInsight {
  topic: string;
  insight: string;
  relevance: number;
  source: 'IVOR' | 'local';
  confidence: number;
}

interface EventContext {
  relatedEvents: any[];
  upcomingEvents: any[];
  communityGatherings: any[];
  source: 'EventsCalendar' | 'local';
}

interface MemberData {
  extendedProfile: any;
  contributions: any[];
  communityRoles: string[];
  source: 'BLKOUTHUB' | 'local';
}

export class GovernanceWithOptionalWisdom {
  constructor(private localGovernance = blkoutModule) {}

  async displayProposal(proposal: any): Promise<EnhancementResult<any>> {
    const startTime = Date.now();
    
    // Base functionality - ALWAYS works
    const baseProposalView = await this.createBaseProposalView(proposal);
    
    const enhancements: Record<string, any> = {};
    const servicesUsed: string[] = [];
    const fallbacksUsed: string[] = [];

    // Optional IVOR wisdom enhancement
    try {
      const wisdom = await this.getOptionalWisdom(proposal.topic);
      if (wisdom) {
        enhancements.wisdom = wisdom;
        servicesUsed.push('IVOR');
        baseProposalView.wisdomInsights = wisdom;
        baseProposalView.enhanced = true;
      } else {
        fallbacksUsed.push('IVOR-wisdom');
        enhancements.wisdom = this.getFallbackWisdom(proposal.topic);
      }
    } catch (error) {
      console.log('IVOR wisdom unavailable, using local governance only');
      fallbacksUsed.push('IVOR-wisdom');
      enhancements.wisdom = this.getFallbackWisdom(proposal.topic);
    }

    // Optional event context enhancement
    try {
      const eventContext = await this.getOptionalEventContext(proposal);
      if (eventContext) {
        enhancements.events = eventContext;
        servicesUsed.push('EventsCalendar');
        baseProposalView.relatedEvents = eventContext.relatedEvents;
      } else {
        fallbacksUsed.push('EventsCalendar-context');
      }
    } catch (error) {
      console.log('Events Calendar unavailable, continuing without event context');
      fallbacksUsed.push('EventsCalendar-context');
    }

    const responseTime = Date.now() - startTime;

    return {
      baseData: baseProposalView,
      enhancements,
      servicesUsed,
      fallbacksUsed,
      responseTime
    };
  }

  private async createBaseProposalView(proposal: any): Promise<any> {
    return {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      proposer: proposal.proposer,
      status: proposal.status,
      created_at: proposal.created_at,
      votes: proposal.votes || [],
      discussion: proposal.discussion || [],
      // Local governance features
      votingDeadline: this.calculateVotingDeadline(proposal.created_at),
      quorumRequired: this.calculateQuorum(),
      votingGuidelines: this.getLocalVotingGuidelines(),
      // Always functional
      canVote: true,
      canDiscuss: true,
      localGovernanceActive: true
    };
  }

  private async getOptionalWisdom(topic: string): Promise<WisdomInsight | null> {
    const wisdomData = await connectionManager.executeOptionalCall<any>(
      'IVOR',
      '/api/v1/wisdom',
      {
        timeout: 2000,
        fallbackValue: null
      }
    );

    if (!wisdomData) return null;

    return {
      topic,
      insight: wisdomData.insight || 'No specific wisdom available',
      relevance: wisdomData.relevance || 0.5,
      source: 'IVOR',
      confidence: wisdomData.confidence || 0.7
    };
  }

  private getFallbackWisdom(topic: string): WisdomInsight {
    // Local wisdom based on common governance principles
    const localWisdom = {
      'community-safety': 'Community safety is paramount. Consider all voices, especially those most affected.',
      'resource-allocation': 'Fair distribution requires understanding community needs and priorities.',
      'policy-change': 'Policy changes should be gradual, well-communicated, and reversible if needed.',
      'default': 'Democratic governance thrives on transparency, inclusion, and accountability.'
    };

    return {
      topic,
      insight: localWisdom[topic as keyof typeof localWisdom] || localWisdom.default,
      relevance: 0.6,
      source: 'local',
      confidence: 0.8
    };
  }

  private async getOptionalEventContext(proposal: any): Promise<EventContext | null> {
    const eventData = await connectionManager.executeOptionalCall<any>(
      'EventsCalendar',
      '/api/events/context',
      {
        timeout: 1500,
        fallbackValue: null
      }
    );

    if (!eventData) return null;

    return {
      relatedEvents: eventData.related || [],
      upcomingEvents: eventData.upcoming || [],
      communityGatherings: eventData.gatherings || [],
      source: 'EventsCalendar'
    };
  }

  private calculateVotingDeadline(createdAt: string): string {
    const created = new Date(createdAt);
    const deadline = new Date(created.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    return deadline.toISOString();
  }

  private calculateQuorum(): number {
    // Dynamic quorum based on active membership (fallback to 10%)
    return 0.1;
  }

  private getLocalVotingGuidelines(): string[] {
    return [
      'All community members can vote',
      'Voting is confidential and secure',
      'One vote per member per proposal',
      'Voting period is 7 days from proposal creation',
      'Simple majority required unless specified otherwise'
    ];
  }

  async conductVoting(proposal: any): Promise<EnhancementResult<any>> {
    const startTime = Date.now();
    
    // Core voting NEVER depends on external services
    const baseVotingResult = await this.conductLocalVoting(proposal);
    
    const enhancements: Record<string, any> = {};
    const servicesUsed: string[] = [];
    const fallbacksUsed: string[] = [];

    // Optional member data enhancement
    try {
      const memberData = await this.getOptionalMemberData(proposal);
      if (memberData) {
        enhancements.memberData = memberData;
        servicesUsed.push('BLKOUTHUB');
        baseVotingResult.voterProfiles = memberData.extendedProfile;
      }
    } catch (error) {
      console.log('BLKOUTHUB unavailable, using local member data');
      fallbacksUsed.push('BLKOUTHUB-members');
    }

    const responseTime = Date.now() - startTime;

    return {
      baseData: baseVotingResult,
      enhancements,
      servicesUsed,
      fallbacksUsed,
      responseTime
    };
  }

  private async conductLocalVoting(proposal: any): Promise<any> {
    // Always functional local voting
    return {
      proposalId: proposal.id,
      votingActive: true,
      votes: proposal.votes || [],
      totalVotes: proposal.votes?.length || 0,
      votingDeadline: this.calculateVotingDeadline(proposal.created_at),
      quorumMet: false, // Will be calculated based on actual votes
      result: null, // Will be determined when voting closes
      localVotingSystem: true
    };
  }

  private async getOptionalMemberData(proposal: any): Promise<MemberData | null> {
    const memberData = await connectionManager.executeOptionalCall<any>(
      'BLKOUTHUB',
      '/api/v1/members/data',
      {
        timeout: 2000,
        fallbackValue: null
      }
    );

    if (!memberData) return null;

    return {
      extendedProfile: memberData.profiles || {},
      contributions: memberData.contributions || [],
      communityRoles: memberData.roles || [],
      source: 'BLKOUTHUB'
    };
  }
}

export class ContentWithOptionalEnhancements {
  async submitContent(content: any): Promise<EnhancementResult<any>> {
    const startTime = Date.now();
    
    // Base content submission - always works
    const baseSubmission = await this.submitToLocalModeration(content);
    
    const enhancements: Record<string, any> = {};
    const servicesUsed: string[] = [];
    const fallbacksUsed: string[] = [];

    // Optional event enrichment
    if (content.type === 'event') {
      try {
        const eventEnrichment = await this.getOptionalEventEnrichment(content);
        if (eventEnrichment) {
          enhancements.eventData = eventEnrichment;
          servicesUsed.push('EventsCalendar');
          baseSubmission.eventContext = eventEnrichment;
        }
      } catch (error) {
        fallbacksUsed.push('EventsCalendar-enrichment');
      }
    }

    const responseTime = Date.now() - startTime;

    return {
      baseData: baseSubmission,
      enhancements,
      servicesUsed,
      fallbacksUsed,
      responseTime
    };
  }

  private async submitToLocalModeration(content: any): Promise<any> {
    // Use existing moderation system
    const submission = {
      id: 'content_' + Date.now(),
      ...content,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      moderation_queue: true,
      source: 'blkoutnxt_platform'
    };

    return submission;
  }

  private async getOptionalEventEnrichment(content: any): Promise<any | null> {
    return await connectionManager.executeOptionalCall<any>(
      'EventsCalendar',
      '/api/events/enrich',
      {
        timeout: 1500,
        fallbackValue: null
      }
    );
  }
}

// Export configured enhancement services
export const governanceEnhancement = new GovernanceWithOptionalWisdom();
export const contentEnhancement = new ContentWithOptionalEnhancements();