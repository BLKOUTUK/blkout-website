// IVOR Journey Recognition Engine - Community Liberation Platform
// Transforms topic-aware to journey-stage-aware AI for Black queer empowerment

import { supabase } from './supabase';
import OpenAI from 'openai';

// Journey stages across all IVOR domains
export interface JourneyStage {
  domain: 'core' | 'community' | 'organizing' | 'social';
  stage: string;
  description: string;
  supportType: string;
  nextStages: string[];
  prerequisites?: string[];
  culturalContext: string;
  liberationGoals: string[];
}

// IVOR Core - Personal Wellness Journey Stages
export const CORE_JOURNEY_STAGES: JourneyStage[] = [
  {
    domain: 'core',
    stage: 'crisis',
    description: 'Immediate safety and emergency support needs',
    supportType: 'immediate_resources',
    nextStages: ['stabilization'],
    culturalContext: 'trauma_informed_care',
    liberationGoals: ['safety', 'immediate_empowerment', 'crisis_navigation']
  },
  {
    domain: 'core',
    stage: 'stabilization', 
    description: 'Ongoing support and community resource connection',
    supportType: 'continuous_care',
    nextStages: ['growth', 'community_healing'],
    prerequisites: ['crisis'],
    culturalContext: 'community_supported_healing',
    liberationGoals: ['sustained_wellness', 'resource_connection', 'peer_support']
  },
  {
    domain: 'core',
    stage: 'growth',
    description: 'Personal development and empowerment tool building',
    supportType: 'skill_development',
    nextStages: ['community_healing', 'advocacy'],
    prerequisites: ['stabilization'],
    culturalContext: 'strength_based_development',
    liberationGoals: ['personal_empowerment', 'skill_building', 'self_advocacy']
  },
  {
    domain: 'core',
    stage: 'community_healing',
    description: 'Peer support facilitation and healing circle participation',
    supportType: 'collective_healing',
    nextStages: ['advocacy'],
    prerequisites: ['growth'],
    culturalContext: 'community_healing_traditions',
    liberationGoals: ['collective_wellness', 'peer_leadership', 'healing_justice']
  },
  {
    domain: 'core',
    stage: 'advocacy',
    description: 'Community leadership and system change mobilization',
    supportType: 'leadership_development',
    nextStages: [],
    prerequisites: ['community_healing'],
    culturalContext: 'liberation_leadership',
    liberationGoals: ['movement_building', 'system_change', 'community_liberation']
  }
];

// IVOR Community - Intelligence Journey Stages
export const COMMUNITY_JOURNEY_STAGES: JourneyStage[] = [
  {
    domain: 'community',
    stage: 'individual_problem',
    description: 'Personal challenge identification and initial analysis',
    supportType: 'problem_recognition',
    nextStages: ['community_pattern'],
    culturalContext: 'systemic_awareness_building',
    liberationGoals: ['issue_identification', 'personal_analysis', 'system_awareness']
  },
  {
    domain: 'community',
    stage: 'community_pattern',
    description: 'Connecting personal experience to community trends',
    supportType: 'pattern_analysis',
    nextStages: ['strategic_analysis'],
    prerequisites: ['individual_problem'],
    culturalContext: 'collective_intelligence',
    liberationGoals: ['community_connection', 'trend_recognition', 'shared_analysis']
  },
  {
    domain: 'community',
    stage: 'strategic_analysis',
    description: 'Data-driven understanding of systemic issues',
    supportType: 'strategic_planning',
    nextStages: ['collective_action'],
    prerequisites: ['community_pattern'],
    culturalContext: 'liberation_strategy',
    liberationGoals: ['systemic_understanding', 'strategic_planning', 'data_sovereignty']
  },
  {
    domain: 'community',
    stage: 'collective_action',
    description: 'Community-wide response coordination and implementation',
    supportType: 'coordinated_response',
    nextStages: [],
    prerequisites: ['strategic_analysis'],
    culturalContext: 'collective_liberation',
    liberationGoals: ['community_mobilization', 'systemic_change', 'collective_power']
  }
];

// IVOR Organizing - Mobilization Journey Stages
export const ORGANIZING_JOURNEY_STAGES: JourneyStage[] = [
  {
    domain: 'organizing',
    stage: 'awareness',
    description: 'Understanding systemic issues and personal impact analysis',
    supportType: 'education_resources',
    nextStages: ['education'],
    culturalContext: 'critical_consciousness',
    liberationGoals: ['systemic_awareness', 'personal_impact_understanding', 'issue_education']
  },
  {
    domain: 'organizing',
    stage: 'education',
    description: 'Learning organizing principles and community analysis tools',
    supportType: 'skill_building',
    nextStages: ['action'],
    prerequisites: ['awareness'],
    culturalContext: 'popular_education',
    liberationGoals: ['organizing_skills', 'analysis_tools', 'community_education']
  },
  {
    domain: 'organizing',
    stage: 'action',
    description: 'Campaign participation and leadership role development',
    supportType: 'campaign_involvement',
    nextStages: ['leadership'],
    prerequisites: ['education'],
    culturalContext: 'grassroots_organizing',
    liberationGoals: ['campaign_participation', 'leadership_development', 'collective_action']
  },
  {
    domain: 'organizing',
    stage: 'leadership',
    description: 'Campaign management and coalition building facilitation',
    supportType: 'leadership_coordination',
    nextStages: ['system_change'],
    prerequisites: ['action'],
    culturalContext: 'community_leadership',
    liberationGoals: ['campaign_leadership', 'coalition_building', 'strategic_coordination']
  },
  {
    domain: 'organizing',
    stage: 'system_change',
    description: 'Policy influence and institutional transformation',
    supportType: 'systemic_intervention',
    nextStages: [],
    prerequisites: ['leadership'],
    culturalContext: 'liberation_transformation',
    liberationGoals: ['policy_change', 'institutional_transformation', 'movement_scaling']
  }
];

// IVOR Social - Community Growth Journey Stages
export const SOCIAL_JOURNEY_STAGES: JourneyStage[] = [
  {
    domain: 'social',
    stage: 'individual_engagement',
    description: 'User discovers IVOR value and wants to share with community',
    supportType: 'platform_orientation',
    nextStages: ['network_activation'],
    culturalContext: 'community_introduction',
    liberationGoals: ['platform_adoption', 'value_recognition', 'sharing_motivation']
  },
  {
    domain: 'social',
    stage: 'network_activation',
    description: 'User promotes IVOR within existing networks and communities',
    supportType: 'network_expansion',
    nextStages: ['service_gap_recognition'],
    prerequisites: ['individual_engagement'],
    culturalContext: 'community_network_building',
    liberationGoals: ['network_growth', 'community_promotion', 'peer_recruitment']
  },
  {
    domain: 'social',
    stage: 'service_gap_recognition',
    description: 'User identifies missing services and creates intervention proposals',
    supportType: 'gap_analysis',
    nextStages: ['community_mobilization'],
    prerequisites: ['network_activation'],
    culturalContext: 'community_needs_assessment',
    liberationGoals: ['gap_identification', 'solution_development', 'intervention_planning']
  },
  {
    domain: 'social',
    stage: 'community_mobilization',
    description: 'User recruits others to collaborate on community solutions',
    supportType: 'mobilization_coordination',
    nextStages: [],
    prerequisites: ['service_gap_recognition'],
    culturalContext: 'collective_solution_building',
    liberationGoals: ['community_mobilization', 'collaborative_solutions', 'collective_action']
  }
];

// Journey Recognition Context Analysis
export interface UserContext {
  location?: string;
  resources?: string[];
  community_connections?: string[];
  current_challenges?: string[];
  empowerment_goals?: string[];
  previous_journey_stages?: string[];
  cultural_background?: string;
  support_needs?: string[];
}

// Journey Recognition Engine
export class JourneyRecognitionEngine {
  private openai: OpenAI;
  private allJourneyStages: JourneyStage[];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    });
    
    this.allJourneyStages = [
      ...CORE_JOURNEY_STAGES,
      ...COMMUNITY_JOURNEY_STAGES,
      ...ORGANIZING_JOURNEY_STAGES,
      ...SOCIAL_JOURNEY_STAGES
    ];
  }

  /**
   * Analyze user input to identify journey stage and domain
   */
  async recognizeJourneyStage(
    userInput: string, 
    userContext?: UserContext
  ): Promise<{
    domain: string;
    stage: string;
    confidence: number;
    supportType: string;
    nextStages: string[];
    culturalContext: string;
    liberationGoals: string[];
  }> {
    try {
      // Create context-aware prompt for journey recognition
      const contextPrompt = this.buildJourneyRecognitionPrompt(userInput, userContext);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert in Black queer liberation and community empowerment. 
            Analyze user input to identify where they are in their liberation journey.
            Focus on empowerment, community connection, and systemic change goals.
            
            Journey domains:
            - core: Personal wellness and individual empowerment
            - community: Intelligence gathering and community analysis  
            - organizing: Mobilization and collective action
            - social: Platform growth and network expansion
            
            Respond with JSON only: {
              "domain": "core|community|organizing|social",
              "stage": "specific_stage_name", 
              "confidence": 0.0-1.0,
              "reasoning": "brief explanation"
            }`
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const matchedStage = this.allJourneyStages.find(
        s => s.domain === result.domain && s.stage === result.stage
      );

      if (!matchedStage) {
        // Default to crisis stage if no match found
        const defaultStage = CORE_JOURNEY_STAGES[0];
        return {
          domain: defaultStage.domain,
          stage: defaultStage.stage,
          confidence: 0.5,
          supportType: defaultStage.supportType,
          nextStages: defaultStage.nextStages,
          culturalContext: defaultStage.culturalContext,
          liberationGoals: defaultStage.liberationGoals
        };
      }

      return {
        domain: matchedStage.domain,
        stage: matchedStage.stage,
        confidence: result.confidence || 0.7,
        supportType: matchedStage.supportType,
        nextStages: matchedStage.nextStages,
        culturalContext: matchedStage.culturalContext,
        liberationGoals: matchedStage.liberationGoals
      };

    } catch (error) {
      console.error('Journey recognition error:', error);
      
      // Fallback to crisis stage
      const fallbackStage = CORE_JOURNEY_STAGES[0];
      return {
        domain: fallbackStage.domain,
        stage: fallbackStage.stage,
        confidence: 0.3,
        supportType: fallbackStage.supportType,
        nextStages: fallbackStage.nextStages,
        culturalContext: fallbackStage.culturalContext,
        liberationGoals: fallbackStage.liberationGoals
      };
    }
  }

  /**
   * Build context-aware prompt for journey recognition
   */
  private buildJourneyRecognitionPrompt(userInput: string, context?: UserContext): string {
    let prompt = `User Input: "${userInput}"\n\n`;
    
    if (context) {
      if (context.current_challenges?.length) {
        prompt += `Current Challenges: ${context.current_challenges.join(', ')}\n`;
      }
      if (context.empowerment_goals?.length) {
        prompt += `Empowerment Goals: ${context.empowerment_goals.join(', ')}\n`;
      }
      if (context.community_connections?.length) {
        prompt += `Community Connections: ${context.community_connections.join(', ')}\n`;
      }
      if (context.previous_journey_stages?.length) {
        prompt += `Previous Journey Progress: ${context.previous_journey_stages.join(' → ')}\n`;
      }
      if (context.support_needs?.length) {
        prompt += `Support Needs: ${context.support_needs.join(', ')}\n`;
      }
    }

    prompt += `\nAnalyze this input to identify the user's liberation journey stage.
    Consider their empowerment needs, community connection level, and readiness for action.
    Focus on serving Black queer liberation goals through appropriate support matching.`;

    return prompt;
  }

  /**
   * Get stage-specific support recommendations
   */
  async getStageRecommendations(
    domain: string, 
    stage: string, 
    userContext?: UserContext
  ): Promise<{
    resources: string[];
    actions: string[];
    connections: string[];
    next_steps: string[];
  }> {
    const journeyStage = this.allJourneyStages.find(
      s => s.domain === domain && s.stage === stage
    );

    if (!journeyStage) {
      return {
        resources: ['Crisis support hotlines', 'Community resource directory'],
        actions: ['Connect with peer support', 'Access immediate resources'],
        connections: ['Local LGBTQ+ center', 'Community support groups'],
        next_steps: ['Stabilize immediate needs', 'Build support network']
      };
    }

    // Generate context-specific recommendations
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are providing liberation-focused support recommendations for Black queer community members.
            
            Current stage: ${stage} in ${domain} domain
            Support type: ${journeyStage.supportType}
            Cultural context: ${journeyStage.culturalContext}
            Liberation goals: ${journeyStage.liberationGoals.join(', ')}
            
            Provide specific, actionable recommendations focused on empowerment and community connection.
            
            Respond with JSON: {
              "resources": ["specific resource 1", "specific resource 2", ...],
              "actions": ["actionable step 1", "actionable step 2", ...], 
              "connections": ["community connection 1", "community connection 2", ...],
              "next_steps": ["next stage preparation 1", "next stage preparation 2", ...]
            }`
          },
          {
            role: 'user',
            content: `Generate recommendations for user at ${stage} stage with context: ${JSON.stringify(userContext || {})}`
          }
        ],
        temperature: 0.4,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content || '{}');

    } catch (error) {
      console.error('Recommendation generation error:', error);
      return {
        resources: [`${journeyStage.supportType} resources`, 'Community directory'],
        actions: ['Connect with community', 'Access relevant support'],
        connections: ['Peer support network', 'Local organizations'],
        next_steps: journeyStage.nextStages.map(stage => `Prepare for ${stage} stage`)
      };
    }
  }

  /**
   * Track user journey progress
   */
  async trackJourneyProgress(
    sessionId: string,
    domain: string,
    stage: string,
    context: UserContext,
    outcomes?: string[]
  ): Promise<void> {
    try {
      await supabase.from('user_journeys').upsert({
        session_id: sessionId,
        domain,
        current_stage: stage,
        context_variables: context,
        journey_history: context.previous_journey_stages || [],
        outcomes_achieved: outcomes || [],
        next_stage_readiness: this.calculateStageReadiness(domain, stage, context),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Journey tracking error:', error);
    }
  }

  /**
   * Calculate readiness for next journey stage
   */
  private calculateStageReadiness(domain: string, stage: string, context: UserContext): number {
    const currentStage = this.allJourneyStages.find(s => s.domain === domain && s.stage === stage);
    if (!currentStage) return 0.3;

    let readiness = 0.5; // Base readiness

    // Increase readiness based on context factors
    if (context.community_connections?.length) {
      readiness += 0.1 * Math.min(context.community_connections.length / 3, 1);
    }

    if (context.resources?.length) {
      readiness += 0.1 * Math.min(context.resources.length / 5, 1);
    }

    if (context.empowerment_goals?.length) {
      readiness += 0.1 * Math.min(context.empowerment_goals.length / 3, 1);
    }

    if (context.previous_journey_stages?.length) {
      readiness += 0.1 * Math.min(context.previous_journey_stages.length / 2, 1);
    }

    return Math.min(readiness, 1.0);
  }
}

// Export journey recognition engine instance
export const journeyEngine = new JourneyRecognitionEngine();