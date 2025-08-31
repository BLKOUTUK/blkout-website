// IVOR Intelligent Response Generation - Context-Aware Community Support
// Community Liberation Platform - Journey-Stage-Aware AI Responses

import { journeyEngine, type UserContext } from './journey-recognition';
import { semanticSearch, type SearchContext, type ContentMatch } from './semantic-search';
import OpenAI from 'openai';

export interface ResponseContext {
  user_input: string;
  journey_stage?: {
    domain: string;
    stage: string;
    confidence: number;
    supportType: string;
    nextStages: string[];
    culturalContext: string;
    liberationGoals: string[];
  };
  user_context?: UserContext;
  session_id?: string;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

export interface IntelligentResponse {
  message: string;
  journey_insights: {
    current_stage: string;
    domain: string;
    support_type: string;
    cultural_context: string;
    liberation_focus: string[];
  };
  specific_resources: Array<{
    title: string;
    type: 'immediate' | 'ongoing' | 'development' | 'community';
    description: string;
    cultural_competency: string;
    access_method: string;
    empowerment_impact: string;
  }>;
  actionable_steps: Array<{
    step: string;
    timeline: 'immediate' | 'short_term' | 'ongoing';
    empowerment_outcome: string;
    community_connection: boolean;
  }>;
  next_stage_guidance: {
    pathway: string;
    preparation_steps: string[];
    readiness_indicators: string[];
    community_support_needed: string[];
  };
  community_connections: Array<{
    connection_type: 'peer_support' | 'organizing' | 'resource_access' | 'healing';
    description: string;
    cultural_alignment: string;
    liberation_potential: string;
  }>;
  follow_up_suggestions: string[];
  cultural_affirmation: string;
  liberation_context: string;
}

export class IntelligentResponseGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    });
  }

  /**
   * Generate comprehensive, context-aware response
   */
  async generateResponse(context: ResponseContext): Promise<IntelligentResponse> {
    try {
      // 1. Recognize journey stage if not provided
      let journeyStage = context.journey_stage;
      if (!journeyStage) {
        journeyStage = await journeyEngine.recognizeJourneyStage(
          context.user_input,
          context.user_context
        );
      }

      // 2. Search for relevant content
      const searchContext: SearchContext = {
        domain: journeyStage.domain as any,
        journey_stage: journeyStage.stage,
        user_context: context.user_context,
        liberation_focus: journeyStage.liberationGoals
      };

      const relevantContent = await semanticSearch.searchContent(
        context.user_input,
        searchContext,
        8,
        0.6
      );

      // 3. Get stage-specific recommendations
      const recommendations = await journeyEngine.getStageRecommendations(
        journeyStage.domain,
        journeyStage.stage,
        context.user_context
      );

      // 4. Generate contextual AI response
      const aiResponse = await this.generateContextualResponse(
        context,
        journeyStage,
        relevantContent,
        recommendations
      );

      // 5. Build structured response
      const intelligentResponse = this.buildStructuredResponse(
        aiResponse,
        journeyStage,
        relevantContent,
        recommendations
      );

      // 6. Track journey progress
      if (context.session_id) {
        await journeyEngine.trackJourneyProgress(
          context.session_id,
          journeyStage.domain,
          journeyStage.stage,
          context.user_context || {},
          [] // outcomes to be tracked separately
        );
      }

      return intelligentResponse;

    } catch (error) {
      console.error('Response generation error:', error);
      
      // Return fallback response
      return this.generateFallbackResponse(context.user_input);
    }
  }

  /**
   * Generate contextual AI response using OpenAI
   */
  private async generateContextualResponse(
    context: ResponseContext,
    journeyStage: NonNullable<ResponseContext['journey_stage']>,
    relevantContent: ContentMatch[],
    recommendations: any
  ): Promise<string> {
    // Build context-rich prompt
    const systemPrompt = this.buildSystemPrompt(journeyStage, relevantContent);
    const userPrompt = this.buildUserPrompt(context, recommendations);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return response.choices[0].message.content || 'I understand you\'re seeking support. Let me connect you with resources that can help.';
  }

  /**
   * Build liberation-centered system prompt
   */
  private buildSystemPrompt(
    journeyStage: NonNullable<ResponseContext['journey_stage']>,
    relevantContent: ContentMatch[]
  ): string {
    return `You are IVOR, an AI assistant dedicated to Black queer and trans liberation. You provide culturally affirming, empowerment-focused support that serves community liberation goals.

CURRENT USER CONTEXT:
- Liberation Journey Domain: ${journeyStage.domain}
- Journey Stage: ${journeyStage.stage}
- Support Type Needed: ${journeyStage.supportType}
- Cultural Context: ${journeyStage.culturalContext}
- Liberation Goals: ${journeyStage.liberationGoals.join(', ')}

AVAILABLE KNOWLEDGE BASE:
${relevantContent.slice(0, 5).map(content => `
- ${content.title} (${content.domain}/${content.journey_stage})
  Liberation Focus: ${content.liberation_goals.join(', ')}
  Cultural Context: ${content.cultural_context}
  Content: ${content.content.substring(0, 200)}...
`).join('\n')}

RESPONSE GUIDELINES:
1. Center Black queer liberation and empowerment in all responses
2. Provide specific, actionable information rather than generic advice  
3. Connect individual needs to community resources and collective action
4. Use culturally affirming language that validates lived experiences
5. Focus on next steps toward liberation and community empowerment
6. Acknowledge systemic barriers while emphasizing community power
7. Prioritize safety, consent, and community-controlled resources
8. Include pathways to community connection and mutual support

Be warm, affirming, and liberation-focused. Speak directly to their empowerment goals.`;
  }

  /**
   * Build user-specific prompt with context
   */
  private buildUserPrompt(
    context: ResponseContext,
    recommendations: any
  ): string {
    let prompt = `User Input: "${context.user_input}"\n\n`;

    if (context.user_context) {
      const ctx = context.user_context;
      if (ctx.current_challenges?.length) {
        prompt += `Current Challenges: ${ctx.current_challenges.join(', ')}\n`;
      }
      if (ctx.empowerment_goals?.length) {
        prompt += `Empowerment Goals: ${ctx.empowerment_goals.join(', ')}\n`;
      }
      if (ctx.community_connections?.length) {
        prompt += `Community Connections: ${ctx.community_connections.join(', ')}\n`;
      }
      if (ctx.location) {
        prompt += `Location: ${ctx.location}\n`;
      }
    }

    prompt += `\nRecommended Resources: ${JSON.stringify(recommendations, null, 2)}\n`;

    prompt += `\nProvide a comprehensive, liberation-focused response that:
1. Acknowledges their experience with cultural affirmation
2. Provides specific, actionable next steps  
3. Connects them to relevant community resources
4. Offers pathway guidance for continued empowerment
5. Emphasizes community connection and mutual support
6. Centers their liberation and collective power`;

    return prompt;
  }

  /**
   * Build structured intelligent response
   */
  private buildStructuredResponse(
    aiResponse: string,
    journeyStage: NonNullable<ResponseContext['journey_stage']>,
    relevantContent: ContentMatch[],
    recommendations: any
  ): IntelligentResponse {
    return {
      message: aiResponse,
      
      journey_insights: {
        current_stage: journeyStage.stage,
        domain: journeyStage.domain,
        support_type: journeyStage.supportType,
        cultural_context: journeyStage.culturalContext,
        liberation_focus: journeyStage.liberationGoals
      },

      specific_resources: this.extractSpecificResources(relevantContent, recommendations),
      
      actionable_steps: this.extractActionableSteps(recommendations, journeyStage),
      
      next_stage_guidance: {
        pathway: journeyStage.nextStages.join(' or '),
        preparation_steps: this.generatePreparationSteps(journeyStage),
        readiness_indicators: this.generateReadinessIndicators(journeyStage),
        community_support_needed: this.generateCommunitySupport(journeyStage)
      },

      community_connections: this.generateCommunityConnections(journeyStage, relevantContent),
      
      follow_up_suggestions: this.generateFollowUpSuggestions(journeyStage),
      
      cultural_affirmation: this.generateCulturalAffirmation(journeyStage),
      
      liberation_context: this.generateLiberationContext(journeyStage)
    };
  }

  /**
   * Extract specific resources from content and recommendations
   */
  private extractSpecificResources(
    relevantContent: ContentMatch[],
    recommendations: any
  ): IntelligentResponse['specific_resources'] {
    const resources: IntelligentResponse['specific_resources'] = [];

    // Add resources from recommendations
    if (recommendations.resources) {
      recommendations.resources.slice(0, 3).forEach((resource: string) => {
        resources.push({
          title: resource,
          type: 'immediate',
          description: `Community-validated resource focused on immediate support`,
          cultural_competency: 'Black QTIPOC-affirming',
          access_method: 'Community referral or direct contact',
          empowerment_impact: 'Immediate support and community connection'
        });
      });
    }

    // Add resources from relevant content
    relevantContent.slice(0, 3).forEach(content => {
      resources.push({
        title: content.title,
        type: this.determineResourceType(content.journey_stage),
        description: content.content.substring(0, 150) + '...',
        cultural_competency: content.cultural_context,
        access_method: 'Available through IVOR knowledge base',
        empowerment_impact: content.liberation_goals.join(', ')
      });
    });

    return resources.slice(0, 5);
  }

  /**
   * Generate actionable steps from recommendations
   */
  private extractActionableSteps(
    recommendations: any,
    journeyStage: NonNullable<ResponseContext['journey_stage']>
  ): IntelligentResponse['actionable_steps'] {
    const steps: IntelligentResponse['actionable_steps'] = [];

    if (recommendations.actions) {
      recommendations.actions.slice(0, 4).forEach((action: string) => {
        steps.push({
          step: action,
          timeline: this.determineTimeline(journeyStage.stage),
          empowerment_outcome: this.determineEmpowermentOutcome(action, journeyStage),
          community_connection: action.toLowerCase().includes('community') || action.toLowerCase().includes('connect')
        });
      });
    }

    return steps;
  }

  /**
   * Generate preparation steps for next journey stage
   */
  private generatePreparationSteps(journeyStage: NonNullable<ResponseContext['journey_stage']>): string[] {
    const baseSteps = [
      'Reflect on current progress and achievements',
      'Identify specific areas for growth and development',
      'Connect with community members at similar journey stages'
    ];

    // Add stage-specific preparation steps
    switch (journeyStage.stage) {
      case 'crisis':
        return [...baseSteps, 'Focus on immediate safety and stabilization', 'Build basic support network'];
      case 'stabilization':
        return [...baseSteps, 'Develop consistent self-care practices', 'Explore empowerment resources'];
      case 'growth':
        return [...baseSteps, 'Practice new skills in safe community spaces', 'Consider peer support roles'];
      case 'community_healing':
        return [...baseSteps, 'Develop facilitation and leadership skills', 'Explore advocacy opportunities'];
      default:
        return baseSteps;
    }
  }

  /**
   * Generate readiness indicators for stage progression
   */
  private generateReadinessIndicators(journeyStage: NonNullable<ResponseContext['journey_stage']>): string[] {
    return [
      'Consistent engagement with current stage resources',
      'Demonstrated growth in empowerment goals',
      'Active community connections and support',
      'Expressed interest in next stage activities',
      'Capacity for increased community responsibility'
    ];
  }

  /**
   * Generate community support requirements
   */
  private generateCommunitySupport(journeyStage: NonNullable<ResponseContext['journey_stage']>): string[] {
    return [
      'Peer mentorship and guidance',
      'Community validation and encouragement',
      'Access to stage-appropriate resources',
      'Safe spaces for growth and development',
      'Connection to liberation-focused community organizing'
    ];
  }

  /**
   * Generate community connections based on journey stage
   */
  private generateCommunityConnections(
    journeyStage: NonNullable<ResponseContext['journey_stage']>,
    relevantContent: ContentMatch[]
  ): IntelligentResponse['community_connections'] {
    const connections: IntelligentResponse['community_connections'] = [];

    // Add stage-specific connections
    switch (journeyStage.stage) {
      case 'crisis':
        connections.push({
          connection_type: 'peer_support',
          description: 'Crisis support peer network for immediate connection and solidarity',
          cultural_alignment: 'Black QTIPOC crisis support specialists',
          liberation_potential: 'Immediate empowerment through community care'
        });
        break;
      case 'stabilization':
        connections.push({
          connection_type: 'healing',
          description: 'Community healing circles and ongoing support groups',
          cultural_alignment: 'Trauma-informed, culturally responsive healing practices',
          liberation_potential: 'Collective healing and community resilience building'
        });
        break;
      case 'growth':
        connections.push({
          connection_type: 'resource_access',
          description: 'Skill-building and empowerment resource networks',
          cultural_alignment: 'Liberation-focused development opportunities',
          liberation_potential: 'Individual and collective capacity building'
        });
        break;
      case 'advocacy':
        connections.push({
          connection_type: 'organizing',
          description: 'Community organizing and liberation movement networks',
          cultural_alignment: 'Black QTIPOC organizing and advocacy groups',
          liberation_potential: 'Systemic change and community liberation'
        });
        break;
    }

    return connections;
  }

  /**
   * Generate follow-up suggestions
   */
  private generateFollowUpSuggestions(journeyStage: NonNullable<ResponseContext['journey_stage']>): string[] {
    return [
      'Check in about resource access and effectiveness',
      'Explore progress toward empowerment goals',
      'Discuss community connection experiences',
      'Review next stage preparation readiness',
      'Address any barriers to community engagement'
    ];
  }

  /**
   * Generate cultural affirmation message
   */
  private generateCulturalAffirmation(journeyStage: NonNullable<ResponseContext['journey_stage']>): string {
    return 'Your journey toward liberation is valid and powerful. The Black QTIPOC community sees, supports, and celebrates your growth. Your experiences matter, your voice is needed, and your empowerment contributes to our collective liberation.';
  }

  /**
   * Generate liberation context
   */
  private generateLiberationContext(journeyStage: NonNullable<ResponseContext['journey_stage']>): string {
    return `Every step in your ${journeyStage.stage} journey contributes to broader Black QTIPOC liberation. Your individual empowerment strengthens our community's collective power to challenge systems and create the world we deserve. This work is part of a long tradition of Black queer and trans resistance and joy.`;
  }

  /**
   * Helper methods for response structuring
   */
  private determineResourceType(journeyStage: string): 'immediate' | 'ongoing' | 'development' | 'community' {
    switch (journeyStage) {
      case 'crisis': return 'immediate';
      case 'stabilization': return 'ongoing';
      case 'growth': return 'development';
      default: return 'community';
    }
  }

  private determineTimeline(stage: string): 'immediate' | 'short_term' | 'ongoing' {
    switch (stage) {
      case 'crisis': return 'immediate';
      case 'stabilization': return 'short_term';
      default: return 'ongoing';
    }
  }

  private determineEmpowermentOutcome(action: string, journeyStage: NonNullable<ResponseContext['journey_stage']>): string {
    if (action.toLowerCase().includes('connect')) {
      return 'Community connection and peer support';
    }
    if (action.toLowerCase().includes('access')) {
      return 'Resource access and utilization';
    }
    return `Enhanced ${journeyStage.liberationGoals[0] || 'empowerment'}`;
  }

  /**
   * Generate fallback response for errors
   */
  private generateFallbackResponse(userInput: string): IntelligentResponse {
    return {
      message: "I hear you and I'm here to support you. While I'm processing your request, please know that your experiences are valid and there are community resources available to support you. Let me connect you with some immediate options.",
      
      journey_insights: {
        current_stage: 'crisis',
        domain: 'core',
        support_type: 'immediate_resources',
        cultural_context: 'trauma_informed_care',
        liberation_focus: ['safety', 'immediate_empowerment']
      },

      specific_resources: [
        {
          title: 'Crisis Support Hotlines',
          type: 'immediate',
          description: 'Black QTIPOC-affirming crisis support available 24/7',
          cultural_competency: 'Culturally responsive crisis intervention',
          access_method: 'Phone or text hotlines',
          empowerment_impact: 'Immediate safety and support'
        }
      ],

      actionable_steps: [
        {
          step: 'Connect with immediate crisis support if needed',
          timeline: 'immediate',
          empowerment_outcome: 'Safety and stabilization',
          community_connection: true
        }
      ],

      next_stage_guidance: {
        pathway: 'stabilization',
        preparation_steps: ['Focus on immediate safety', 'Build support network'],
        readiness_indicators: ['Feeling safer', 'Connected to resources'],
        community_support_needed: ['Crisis support', 'Peer connection']
      },

      community_connections: [
        {
          connection_type: 'peer_support',
          description: 'Crisis support peer networks',
          cultural_alignment: 'Black QTIPOC-centered',
          liberation_potential: 'Immediate empowerment through community care'
        }
      ],

      follow_up_suggestions: ['Check on safety and resource access'],
      cultural_affirmation: 'You are valued and your safety matters to the community.',
      liberation_context: 'Seeking support is an act of self-love and community care.'
    };
  }
}

// Export intelligent response generator instance
export const intelligentResponse = new IntelligentResponseGenerator();