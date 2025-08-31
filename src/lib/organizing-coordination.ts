// IVOR Organizing & Democratic Coordination Engine
// Stream D: Community project management, resource allocation, and democratic governance

import { createClient } from '@supabase/supabase-js';
import { journeyEngine } from './journey-recognition';
import { communityIntelligence } from './community-intelligence';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface OrganizingProject {
  id?: string;
  title: string;
  description: string;
  project_type: 'housing' | 'healthcare' | 'safety' | 'economic' | 'education' | 'policy';
  journey_stage: string;
  community_need_areas: string[];
  organizing_stage: 'awareness' | 'education' | 'action' | 'leadership' | 'system_change';
  collaboration_requirements: Record<string, any>;
  resource_needs: Record<string, any>;
  skills_needed: string[];
  community_impact_goals: string[];
  liberation_objectives: string[];
  democratic_validation_score: number;
  community_support_level: number;
  success_metrics: Record<string, any>;
  coordinator_info: Record<string, any>;
  status: 'proposed' | 'validated' | 'active' | 'completed' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface ResourceAllocation {
  id?: string;
  resource_type: string;
  availability_status: 'available' | 'limited' | 'unavailable' | 'requested';
  geographic_coverage: string[];
  journey_stage_relevance: string[];
  community_access_requirements: Record<string, any>;
  cultural_competency_level: number;
  liberation_alignment_score: number;
  community_validation: Record<string, any>;
  contact_information: Record<string, any>;
  accessibility_features: string[];
  language_support: string[];
  cost_accessibility: 'free' | 'sliding_scale' | 'low_cost' | 'standard';
  community_feedback: Record<string, any>;
}

export interface CommunityValidation {
  validator_session_id: string;
  validation_type: 'peer_review' | 'community_consensus' | 'expert_validation' | 'lived_experience';
  validation_criteria: string[];
  cultural_authenticity_score: number;
  liberation_alignment_score: number;
  community_impact_assessment: Record<string, any>;
  feedback_text: string;
  validation_status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  created_at: string;
}

export interface OrganizingOpportunity {
  opportunity_type: 'campaign_launch' | 'coalition_building' | 'resource_mobilization' | 'skill_sharing' | 'community_education';
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  geographic_area: string;
  community_readiness_score: number;
  required_skills: string[];
  expected_impact: Record<string, any>;
  collaboration_potential: number;
  liberation_relevance: number;
  timeline_estimate: string;
  resource_requirements: Record<string, any>;
}

class OrganizingCoordination {
  private redis: any = null; // Will implement Redis pub/sub integration

  /**
   * Initialize democratic organizing system
   */
  async initialize(): Promise<void> {
    console.log('🏛️ Initializing Democratic Organizing & Coordination System...');
    // Initialize Redis connection for real-time coordination
    // await this.initializeRedis();
  }

  /**
   * Create new organizing project with community validation
   */
  async createProject(
    projectData: Omit<OrganizingProject, 'id' | 'created_at' | 'updated_at'>,
    proposer_context: { session_id: string; empowerment_goals: string[]; location?: string }
  ): Promise<{ success: boolean; project_id?: string; validation_needed?: boolean; error?: string }> {
    try {
      console.log(`📋 Creating organizing project: ${projectData.title}`);

      // Validate project against liberation values and community needs
      const validationResult = await this.validateProjectProposal(projectData, proposer_context);
      
      if (!validationResult.passes_initial_validation) {
        return {
          success: false,
          error: `Project needs refinement: ${validationResult.feedback.join(', ')}`
        };
      }

      // Calculate initial community support score
      const supportScore = await this.calculateCommunitySupport(projectData);

      // Insert project into database
      const { data, error } = await supabase
        .from('organizing_projects')
        .insert({
          ...projectData,
          democratic_validation_score: validationResult.initial_score,
          community_support_level: supportScore,
          status: supportScore > 60 ? 'validated' : 'proposed'
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger community notification for peer review
      await this.notifyCommunityOfNewProject(data.id, projectData);

      // Create cross-domain event for coordination
      await this.createCrossDomainEvent({
        event_type: 'ProjectUpdate',
        source_domain: 'organizing',
        target_domains: ['community', 'core', 'social'],
        event_data: {
          project_id: data.id,
          project_type: projectData.project_type,
          organizing_stage: projectData.organizing_stage,
          community_impact_goals: projectData.community_impact_goals
        },
        journey_context: {
          stage: projectData.journey_stage,
          liberation_objectives: projectData.liberation_objectives
        },
        liberation_relevance_score: validationResult.initial_score
      });

      console.log(`✅ Project created successfully: ${data.id}`);
      return {
        success: true,
        project_id: data.id,
        validation_needed: supportScore <= 60
      };

    } catch (error) {
      console.error('❌ Error creating organizing project:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Validate project proposal against community values and needs
   */
  private async validateProjectProposal(
    project: Omit<OrganizingProject, 'id' | 'created_at' | 'updated_at'>,
    context: { session_id: string; empowerment_goals: string[]; location?: string }
  ): Promise<{
    passes_initial_validation: boolean;
    initial_score: number;
    feedback: string[];
  }> {
    const feedback: string[] = [];
    let score = 50;

    // Check liberation alignment
    const liberationKeywords = ['empowerment', 'liberation', 'justice', 'equality', 'community', 'collective'];
    const descriptionWords = project.description.toLowerCase();
    const liberationAlignment = liberationKeywords.filter(keyword => 
      descriptionWords.includes(keyword) || 
      project.liberation_objectives.some(obj => obj.toLowerCase().includes(keyword))
    ).length;

    if (liberationAlignment >= 3) {
      score += 20;
    } else {
      feedback.push("Consider strengthening liberation and empowerment focus");
      score -= 10;
    }

    // Check community impact specificity
    if (project.community_impact_goals.length >= 3) {
      score += 15;
    } else {
      feedback.push("Define more specific community impact goals");
    }

    // Validate resource feasibility
    const resourceTypes = Object.keys(project.resource_needs);
    if (resourceTypes.length > 0 && resourceTypes.length <= 5) {
      score += 10;
    } else {
      feedback.push("Specify realistic resource needs (1-5 categories)");
    }

    // Check for democratic participation elements
    if (project.collaboration_requirements.includes_community_input === true ||
        project.skills_needed.some(skill => skill.includes('organizing') || skill.includes('leadership'))) {
      score += 15;
    } else {
      feedback.push("Include community participation and democratic decision-making");
    }

    // Geographic and cultural relevance
    if (context.location && project.community_need_areas.length > 0) {
      score += 10;
    }

    return {
      passes_initial_validation: score >= 60,
      initial_score: Math.min(100, Math.max(0, score)),
      feedback
    };
  }

  /**
   * Calculate initial community support score
   */
  private async calculateCommunitySupport(project: Omit<OrganizingProject, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    let supportScore = 50;

    try {
      // Check against existing community insights for similar needs
      const { data: insights } = await supabase
        .from('community_insights')
        .select('pattern_data, confidence_score, organizing_opportunities')
        .eq('insight_type', 'pattern')
        .contains('organizing_opportunities', [project.project_type]);

      if (insights && insights.length > 0) {
        const avgConfidence = insights.reduce((sum, insight) => sum + insight.confidence_score, 0) / insights.length;
        supportScore += Math.round(avgConfidence * 30);
      }

      // Factor in urgency and community readiness
      const urgentTypes = ['housing', 'healthcare', 'safety'];
      if (urgentTypes.includes(project.project_type)) {
        supportScore += 20;
      }

      // Check for skills availability in community
      if (project.skills_needed.length <= 3) {
        supportScore += 10; // More feasible with fewer skill requirements
      }

    } catch (error) {
      console.error('Error calculating community support:', error);
    }

    return Math.min(100, Math.max(0, supportScore));
  }

  /**
   * Submit community validation for projects
   */
  async submitCommunityValidation(
    project_id: string,
    validation: Omit<CommunityValidation, 'created_at'>
  ): Promise<{ success: boolean; updated_score?: number; error?: string }> {
    try {
      // Insert validation record
      const { error: validationError } = await supabase
        .from('community_validations')
        .insert({
          ...validation,
          project_id,
          created_at: new Date().toISOString()
        });

      if (validationError) throw validationError;

      // Recalculate project validation score
      const updatedScore = await this.recalculateProjectValidation(project_id);

      // Update project status if validation threshold is met
      if (updatedScore >= 75) {
        await supabase
          .from('organizing_projects')
          .update({ 
            status: 'validated',
            democratic_validation_score: updatedScore
          })
          .eq('id', project_id);

        // Notify community of project validation
        await this.notifyProjectValidated(project_id);
      }

      console.log(`📊 Community validation submitted for project ${project_id}`);
      return { success: true, updated_score: updatedScore };

    } catch (error) {
      console.error('❌ Error submitting community validation:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Recalculate project validation score based on community feedback
   */
  private async recalculateProjectValidation(project_id: string): Promise<number> {
    try {
      const { data: validations } = await supabase
        .from('community_validations')
        .select('cultural_authenticity_score, liberation_alignment_score, validation_status')
        .eq('project_id', project_id);

      if (!validations || validations.length === 0) return 50;

      // Calculate weighted average of validations
      const approvedValidations = validations.filter(v => v.validation_status === 'approved');
      
      if (approvedValidations.length === 0) return 40; // Penalty for no approvals

      const totalAuthenticityScore = approvedValidations.reduce((sum, v) => sum + v.cultural_authenticity_score, 0);
      const totalLiberationScore = approvedValidations.reduce((sum, v) => sum + v.liberation_alignment_score, 0);

      const avgAuthenticity = totalAuthenticityScore / approvedValidations.length;
      const avgLiberation = totalLiberationScore / approvedValidations.length;

      // Weighted score: 40% authenticity, 40% liberation alignment, 20% validation count
      const validationCountBonus = Math.min(20, approvedValidations.length * 5);
      const finalScore = Math.round(
        (avgAuthenticity * 0.4) + (avgLiberation * 0.4) + validationCountBonus
      );

      return Math.min(100, Math.max(0, finalScore));

    } catch (error) {
      console.error('Error recalculating project validation:', error);
      return 50;
    }
  }

  /**
   * Identify organizing opportunities based on community patterns
   */
  async identifyOrganizingOpportunities(
    geographic_area?: string,
    focus_areas?: string[]
  ): Promise<OrganizingOpportunity[]> {
    try {
      console.log('🔍 Identifying community organizing opportunities...');

      // Get community insights that suggest organizing needs
      let insightsQuery = supabase
        .from('community_insights')
        .select('insight_type, pattern_data, organizing_opportunities, geographic_area, confidence_score')
        .in('insight_type', ['pattern', 'gap', 'opportunity'])
        .gte('confidence_score', 0.6);

      if (geographic_area) {
        insightsQuery = insightsQuery.eq('geographic_area', geographic_area);
      }

      const { data: insights, error } = await insightsQuery.limit(20);
      if (error) throw error;

      const opportunities: OrganizingOpportunity[] = [];

      for (const insight of insights || []) {
        // Extract organizing opportunities from community patterns
        const patternOpportunities = await this.extractOpportunitiesFromPattern(insight);
        opportunities.push(...patternOpportunities);
      }

      // Get active projects to avoid duplication
      const { data: activeProjects } = await supabase
        .from('organizing_projects')
        .select('project_type, community_need_areas, geographic_area')
        .in('status', ['validated', 'active']);

      // Filter out opportunities that are already being addressed
      const filteredOpportunities = opportunities.filter(opp => {
        return !activeProjects?.some(project => 
          project.project_type === this.mapOpportunityToProjectType(opp.opportunity_type) &&
          project.community_need_areas?.some(area => 
            opp.geographic_area?.includes(area) || area.includes(opp.geographic_area)
          )
        );
      });

      // Sort by urgency and community readiness
      filteredOpportunities.sort((a, b) => {
        const urgencyWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        const aScore = urgencyWeight[a.urgency_level] * 10 + a.community_readiness_score;
        const bScore = urgencyWeight[b.urgency_level] * 10 + b.community_readiness_score;
        return bScore - aScore;
      });

      console.log(`✅ Found ${filteredOpportunities.length} organizing opportunities`);
      return filteredOpportunities.slice(0, 10); // Return top 10

    } catch (error) {
      console.error('❌ Error identifying organizing opportunities:', error);
      return [];
    }
  }

  /**
   * Extract organizing opportunities from community insight patterns
   */
  private async extractOpportunitiesFromPattern(insight: any): Promise<OrganizingOpportunity[]> {
    const opportunities: OrganizingOpportunity[] = [];

    try {
      const patternData = insight.pattern_data;
      const organizingOpps = insight.organizing_opportunities || [];

      for (const oppType of organizingOpps) {
        const opportunity: OrganizingOpportunity = {
          opportunity_type: this.categorizeOpportunityType(oppType, patternData),
          urgency_level: this.assessUrgency(patternData, oppType),
          geographic_area: insight.geographic_area || 'local',
          community_readiness_score: Math.round(insight.confidence_score * 100),
          required_skills: this.identifyRequiredSkills(oppType, patternData),
          expected_impact: {
            community_reach: patternData.affected_population_estimate || 100,
            timeline: this.estimateImpactTimeline(oppType),
            liberation_outcomes: this.identifyLiberationOutcomes(oppType)
          },
          collaboration_potential: this.assessCollaborationPotential(patternData),
          liberation_relevance: Math.min(100, insight.confidence_score * 100 + 20),
          timeline_estimate: this.estimateTimelineForOpportunity(oppType, patternData),
          resource_requirements: this.estimateResourceNeeds(oppType, patternData)
        };

        opportunities.push(opportunity);
      }

    } catch (error) {
      console.error('Error extracting opportunities from pattern:', error);
    }

    return opportunities;
  }

  /**
   * Allocate resources to validated organizing projects
   */
  async allocateResources(
    project_id: string,
    resource_requests: { resource_type: string; quantity_needed: number; priority: 'low' | 'medium' | 'high' }[]
  ): Promise<{ success: boolean; allocations: any[]; error?: string }> {
    try {
      console.log(`📦 Allocating resources for project ${project_id}`);

      const allocations = [];

      for (const request of resource_requests) {
        // Find available resources matching the request
        const { data: availableResources } = await supabase
          .from('resource_coordination')
          .select('*')
          .eq('resource_type', request.resource_type)
          .in('availability_status', ['available', 'limited'])
          .order('liberation_alignment_score', { ascending: false })
          .limit(5);

        if (availableResources && availableResources.length > 0) {
          // Select best matching resource based on cultural competency and liberation alignment
          const selectedResource = availableResources[0];

          // Create allocation record
          const allocation = {
            project_id,
            resource_id: selectedResource.id,
            resource_type: request.resource_type,
            quantity_allocated: Math.min(request.quantity_needed, selectedResource.available_quantity || 1),
            allocation_status: 'allocated',
            priority_level: request.priority,
            community_validation_required: selectedResource.cultural_competency_level < 70,
            created_at: new Date().toISOString()
          };

          allocations.push(allocation);

          // Update resource availability
          await supabase
            .from('resource_coordination')
            .update({
              availability_status: request.quantity_needed >= (selectedResource.available_quantity || 1) 
                ? 'unavailable' 
                : 'limited'
            })
            .eq('id', selectedResource.id);
        }
      }

      console.log(`✅ Allocated ${allocations.length} resources`);
      return { success: true, allocations };

    } catch (error) {
      console.error('❌ Error allocating resources:', error);
      return { success: false, allocations: [], error: (error as Error).message };
    }
  }

  /**
   * Create cross-domain coordination event
   */
  private async createCrossDomainEvent(eventData: {
    event_type: string;
    source_domain: string;
    target_domains: string[];
    event_data: Record<string, any>;
    journey_context?: Record<string, any>;
    liberation_relevance_score?: number;
  }): Promise<void> {
    try {
      await supabase
        .from('cross_domain_events')
        .insert({
          ...eventData,
          processing_status: 'pending',
          liberation_relevance_score: eventData.liberation_relevance_score || 50,
          cultural_sensitivity_check: true,
          community_consent_verified: true,
          created_at: new Date().toISOString()
        });

      // TODO: Publish to Redis for real-time coordination
      // await this.publishToRedis(eventData);

    } catch (error) {
      console.error('Error creating cross-domain event:', error);
    }
  }

  /**
   * Notify community of new project for peer review
   */
  private async notifyCommunityOfNewProject(project_id: string, project: any): Promise<void> {
    console.log(`📢 Notifying community of new project: ${project.title}`);
    // TODO: Implement notification system (email, in-app, push notifications)
    
    // Create notification event for community members
    await this.createCrossDomainEvent({
      event_type: 'CommunityNotification',
      source_domain: 'organizing',
      target_domains: ['community', 'social'],
      event_data: {
        notification_type: 'new_project_review',
        project_id,
        project_title: project.title,
        project_type: project.project_type,
        review_needed: true
      },
      liberation_relevance_score: 80
    });
  }

  /**
   * Notify community when project is validated
   */
  private async notifyProjectValidated(project_id: string): Promise<void> {
    console.log(`🎉 Project ${project_id} validated by community`);
    
    await this.createCrossDomainEvent({
      event_type: 'ProjectUpdate',
      source_domain: 'organizing',
      target_domains: ['community', 'social', 'core'],
      event_data: {
        update_type: 'project_validated',
        project_id,
        status: 'validated',
        call_to_action: true
      },
      liberation_relevance_score: 90
    });
  }

  // Helper methods for opportunity analysis
  private categorizeOpportunityType(oppType: string, patternData: any): OrganizingOpportunity['opportunity_type'] {
    const typeMap = {
      'housing': 'campaign_launch',
      'healthcare': 'campaign_launch',
      'safety': 'coalition_building',
      'economic': 'resource_mobilization',
      'education': 'community_education',
      'policy': 'campaign_launch'
    };
    return typeMap[oppType as keyof typeof typeMap] || 'coalition_building';
  }

  private assessUrgency(patternData: any, oppType: string): OrganizingOpportunity['urgency_level'] {
    const urgentTypes = ['housing', 'safety', 'healthcare'];
    if (urgentTypes.includes(oppType)) return 'high';
    
    const severity = patternData.severity_level || 'medium';
    const urgencyMap = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };
    return urgencyMap[severity as keyof typeof urgencyMap] || 'medium';
  }

  private identifyRequiredSkills(oppType: string, patternData: any): string[] {
    const skillMap = {
      'housing': ['tenant_organizing', 'legal_advocacy', 'community_outreach'],
      'healthcare': ['healthcare_advocacy', 'policy_research', 'community_education'],
      'safety': ['safety_planning', 'crisis_intervention', 'community_defense'],
      'economic': ['financial_literacy', 'cooperative_development', 'resource_coordination'],
      'education': ['popular_education', 'curriculum_development', 'peer_facilitation'],
      'policy': ['policy_analysis', 'legislative_advocacy', 'campaign_strategy']
    };
    return skillMap[oppType as keyof typeof skillMap] || ['community_organizing', 'leadership_development'];
  }

  private estimateImpactTimeline(oppType: string): string {
    const timelineMap = {
      'campaign_launch': '3-6 months',
      'coalition_building': '6-12 months',
      'resource_mobilization': '1-3 months',
      'community_education': '2-4 months',
      'skill_sharing': '1-2 months'
    };
    return timelineMap[oppType as keyof typeof timelineMap] || '3-6 months';
  }

  private identifyLiberationOutcomes(oppType: string): string[] {
    const outcomeMap = {
      'housing': ['housing_security', 'tenant_empowerment', 'gentrification_resistance'],
      'healthcare': ['healthcare_access', 'community_wellness', 'health_sovereignty'],
      'safety': ['community_safety', 'police_accountability', 'transformative_justice'],
      'economic': ['economic_empowerment', 'cooperative_ownership', 'wealth_building'],
      'education': ['educational_justice', 'cultural_curriculum', 'leadership_development']
    };
    return outcomeMap[oppType as keyof typeof outcomeMap] || ['community_empowerment', 'collective_liberation'];
  }

  private assessCollaborationPotential(patternData: any): number {
    // Calculate based on community connections and existing organizing capacity
    const baseScore = 60;
    const communitySize = patternData.affected_population_estimate || 100;
    const sizeBonus = Math.min(20, Math.log10(communitySize) * 5);
    const existingOrgs = patternData.existing_organizations?.length || 0;
    const orgBonus = Math.min(20, existingOrgs * 5);
    
    return Math.round(baseScore + sizeBonus + orgBonus);
  }

  private estimateTimelineForOpportunity(oppType: string, patternData: any): string {
    const complexity = patternData.complexity_level || 'medium';
    const baseTimeMap = {
      'campaign_launch': { low: '2-3 months', medium: '3-6 months', high: '6-12 months' },
      'coalition_building': { low: '3-6 months', medium: '6-12 months', high: '12-18 months' },
      'resource_mobilization': { low: '1-2 months', medium: '2-4 months', high: '4-8 months' },
      'community_education': { low: '1-3 months', medium: '3-6 months', high: '6-9 months' },
      'skill_sharing': { low: '2-4 weeks', medium: '1-2 months', high: '2-4 months' }
    };
    
    return baseTimeMap[oppType as keyof typeof baseTimeMap]?.[complexity as keyof typeof baseTimeMap[typeof oppType]] || '3-6 months';
  }

  private estimateResourceNeeds(oppType: string, patternData: any): Record<string, any> {
    const baseNeeds = {
      'campaign_launch': { funding: 'medium', volunteers: 'high', expertise: 'medium', materials: 'medium' },
      'coalition_building': { funding: 'low', volunteers: 'medium', expertise: 'high', materials: 'low' },
      'resource_mobilization': { funding: 'high', volunteers: 'medium', expertise: 'medium', materials: 'high' },
      'community_education': { funding: 'low', volunteers: 'high', expertise: 'high', materials: 'medium' },
      'skill_sharing': { funding: 'low', volunteers: 'medium', expertise: 'high', materials: 'low' }
    };
    
    return baseNeeds[oppType as keyof typeof baseNeeds] || { funding: 'medium', volunteers: 'medium', expertise: 'medium', materials: 'medium' };
  }

  private mapOpportunityToProjectType(oppType: OrganizingOpportunity['opportunity_type']): OrganizingProject['project_type'] {
    const typeMap = {
      'campaign_launch': 'policy',
      'coalition_building': 'safety',
      'resource_mobilization': 'economic',
      'skill_sharing': 'education',
      'community_education': 'education'
    };
    return typeMap[oppType] || 'policy';
  }

  /**
   * Get active organizing projects with community engagement metrics
   */
  async getActiveProjects(filters?: {
    project_type?: OrganizingProject['project_type'];
    geographic_area?: string;
    organizing_stage?: OrganizingProject['organizing_stage'];
  }): Promise<OrganizingProject[]> {
    try {
      let query = supabase
        .from('organizing_projects')
        .select('*')
        .in('status', ['validated', 'active'])
        .order('community_support_level', { ascending: false });

      if (filters?.project_type) {
        query = query.eq('project_type', filters.project_type);
      }

      if (filters?.organizing_stage) {
        query = query.eq('organizing_stage', filters.organizing_stage);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;

      return data || [];

    } catch (error) {
      console.error('❌ Error getting active projects:', error);
      return [];
    }
  }
}

// Export singleton instance
export const organizingCoordination = new OrganizingCoordination();