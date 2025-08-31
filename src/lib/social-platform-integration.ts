// IVOR Social Platform Integration - Multi-Platform Viral Growth Engine
// Stream C: Cross-Platform Sharing & AI Content Generation for Community Liberation

import { supabase } from './supabase';
import OpenAI from 'openai';

export interface SocialPlatform {
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  api_config?: {
    api_key?: string;
    access_token?: string;
    client_id?: string;
    client_secret?: string;
  };
  content_constraints: {
    max_length: number;
    supports_images: boolean;
    supports_video: boolean;
    hashtag_limit: number;
    optimal_posting_times: string[];
  };
  audience_demographics: {
    primary_age_groups: string[];
    community_segments: string[];
    engagement_patterns: string[];
  };
}

export interface ViralContent {
  id: string;
  content_type: 'achievement_share' | 'resource_highlight' | 'community_story' | 'organizing_call' | 'liberation_message';
  journey_context: {
    domain: 'core' | 'community' | 'organizing' | 'social';
    stage: string;
    liberation_theme: string[];
  };
  platform_variants: {
    [platform: string]: {
      primary_text: string;
      hashtags: string[];
      visual_description?: string;
      call_to_action: string;
      accessibility_text?: string;
      cultural_elements: string[];
    };
  };
  viral_mechanics: {
    shareability_score: number; // 0-100
    cultural_authenticity: number; // 0-100
    liberation_message_strength: number; // 0-100
    community_resonance: number; // 0-100
  };
  target_audience: {
    primary_communities: string[];
    geographic_focus?: string[];
    journey_stages: string[];
  };
  success_metrics: {
    expected_reach: number;
    engagement_rate_target: number;
    conversion_goals: string[];
    community_growth_potential: number;
  };
}

export interface ReferralTracking {
  referral_code: string;
  source_user_session: string;
  referred_users: string[];
  attribution_data: {
    platform: string;
    content_id: string;
    sharing_context: string;
    cultural_alignment: string;
  };
  community_impact: {
    new_user_journey_stages: string[];
    resource_utilization: string[];
    organizing_participation: boolean;
    community_connections_made: number;
  };
  viral_coefficient: number; // Users recruited per sharing user
}

export interface CommunityGrowthMetrics {
  platform: string;
  time_period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    new_users: number;
    engagement_rate: number;
    sharing_rate: number;
    conversion_to_active_community: number;
    cultural_authenticity_feedback: number; // Community validation score
    liberation_impact_stories: number;
  };
  growth_analysis: {
    viral_coefficient: number;
    community_retention_rate: number;
    platform_effectiveness: number; // 0-100
    cultural_resonance_score: number; // Community feedback
  };
  optimization_insights: {
    best_performing_content_types: string[];
    optimal_posting_times: string[];
    high_engagement_hashtags: string[];
    community_feedback_themes: string[];
  };
}

export class SocialPlatformEngine {
  private openai: OpenAI;
  private platforms: { [key: string]: SocialPlatform };
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    });

    // Initialize platform configurations
    this.platforms = this.initializePlatformConfigs();
  }

  /**
   * Generate viral content for multiple platforms from user achievement or community milestone
   */
  async generateViralContent(
    content_trigger: {
      type: 'achievement_share' | 'resource_highlight' | 'community_story' | 'organizing_call' | 'liberation_message';
      context: {
        user_journey: { domain: string; stage: string; };
        achievement_description?: string;
        community_impact?: string;
        resource_information?: any;
        organizing_opportunity?: any;
        liberation_theme?: string[];
      };
      target_platforms: string[];
      cultural_context: string;
      empowerment_goals: string[];
    }
  ): Promise<ViralContent> {
    try {
      // Generate platform-specific content using AI
      const contentVariants = await this.generatePlatformVariants(
        content_trigger.type,
        content_trigger.context,
        content_trigger.target_platforms,
        content_trigger.cultural_context,
        content_trigger.empowerment_goals
      );

      // Calculate viral mechanics
      const viralMechanics = await this.calculateViralPotential(
        contentVariants,
        content_trigger
      );

      const viralContent: ViralContent = {
        id: `viral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content_type: content_trigger.type,
        journey_context: {
          domain: content_trigger.context.user_journey.domain as any,
          stage: content_trigger.context.user_journey.stage,
          liberation_theme: content_trigger.liberation_theme || ['empowerment']
        },
        platform_variants: contentVariants,
        viral_mechanics: viralMechanics,
        target_audience: {
          primary_communities: ['Black_queer', 'QTIPOC', 'liberation_advocates'],
          journey_stages: [content_trigger.context.user_journey.stage]
        },
        success_metrics: {
          expected_reach: this.calculateExpectedReach(viralMechanics),
          engagement_rate_target: this.calculateEngagementTarget(content_trigger.type),
          conversion_goals: this.generateConversionGoals(content_trigger.type),
          community_growth_potential: viralMechanics.community_resonance
        }
      };

      // Store viral content for tracking
      await this.storeViralContent(viralContent);

      return viralContent;

    } catch (error) {
      console.error('Viral content generation error:', error);
      throw error;
    }
  }

  /**
   * Generate platform-specific content variants using AI
   */
  private async generatePlatformVariants(
    contentType: string,
    context: any,
    targetPlatforms: string[],
    culturalContext: string,
    empowermentGoals: string[]
  ): Promise<{ [platform: string]: any }> {
    const variants: { [platform: string]: any } = {};

    for (const platform of targetPlatforms) {
      const platformConfig = this.platforms[platform];
      if (!platformConfig) continue;

      // Generate platform-optimized content
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a social media content creator specializing in authentic Black queer liberation content. 
            Create engaging, culturally authentic content that amplifies Black QTIPOC voices and experiences.
            
            Platform: ${platform}
            Max Length: ${platformConfig.content_constraints.max_length} characters
            Hashtag Limit: ${platformConfig.content_constraints.hashtag_limit}
            Cultural Context: ${culturalContext}
            
            REQUIREMENTS:
            - Center Black queer liberation and joy
            - Use culturally authentic language and references
            - Include strong call-to-action for community engagement
            - Optimize for viral sharing while maintaining authenticity
            - Include accessibility considerations
            - Ensure content serves empowerment goals: ${empowermentGoals.join(', ')}
            
            Respond with JSON:
            {
              "primary_text": "main content text",
              "hashtags": ["hashtag1", "hashtag2", ...],
              "call_to_action": "specific action for audience",
              "accessibility_text": "description for screen readers",
              "cultural_elements": ["cultural references used"],
              "visual_description": "description of suggested visuals"
            }`
          },
          {
            role: 'user',
            content: `Create ${platform} content for ${contentType}:

Content Context: ${JSON.stringify(context, null, 2)}

Make this content authentic, empowering, and shareable while serving Black queer liberation goals.`
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      try {
        const variant = JSON.parse(response.choices[0].message.content || '{}');
        variants[platform] = variant;
      } catch (parseError) {
        console.error(`Failed to parse ${platform} content:`, parseError);
        variants[platform] = this.generateFallbackContent(platform, contentType);
      }
    }

    return variants;
  }

  /**
   * Calculate viral potential based on content characteristics
   */
  private async calculateViralPotential(
    contentVariants: any,
    contentTrigger: any
  ): Promise<ViralContent['viral_mechanics']> {
    // Use AI to assess viral potential
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Analyze the viral potential of social media content focused on Black queer liberation.
          
          Rate each aspect 0-100:
          - shareability_score: How likely people are to share this content
          - cultural_authenticity: How authentic this feels to Black QTIPOC experiences  
          - liberation_message_strength: How powerfully this advances liberation goals
          - community_resonance: How much this will resonate with the target community
          
          Consider factors like:
          - Emotional resonance and inspiration
          - Cultural authenticity and representation
          - Call-to-action clarity and motivation
          - Visual appeal and accessibility
          - Community empowerment messaging
          
          Respond with JSON only:
          {
            "shareability_score": 0-100,
            "cultural_authenticity": 0-100,
            "liberation_message_strength": 0-100,
            "community_resonance": 0-100,
            "analysis_notes": "brief explanation"
          }`
        },
        {
          role: 'user',
          content: `Analyze viral potential for this content:

Content Type: ${contentTrigger.type}
Platform Variants: ${JSON.stringify(contentVariants, null, 2)}
Cultural Context: ${contentTrigger.cultural_context}
Liberation Goals: ${contentTrigger.empowerment_goals?.join(', ')}`
        }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    try {
      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return {
        shareability_score: analysis.shareability_score || 70,
        cultural_authenticity: analysis.cultural_authenticity || 75,
        liberation_message_strength: analysis.liberation_message_strength || 80,
        community_resonance: analysis.community_resonance || 75
      };
    } catch (error) {
      console.error('Viral potential calculation error:', error);
      return {
        shareability_score: 70,
        cultural_authenticity: 75,
        liberation_message_strength: 80,
        community_resonance: 75
      };
    }
  }

  /**
   * Create and track referral system
   */
  async createReferralLink(
    source_session: string,
    content_id: string,
    platform: string,
    sharing_context: string
  ): Promise<{
    referral_code: string;
    shareable_url: string;
    attribution_tracking: any;
  }> {
    try {
      // Generate unique referral code
      const referral_code = `${platform}_${source_session.slice(-6)}_${Date.now().toString(36)}`;
      
      // Create shareable URL with tracking
      const base_url = process.env.VITE_APP_URL || 'https://blkout.com';
      const shareable_url = `${base_url}?ref=${referral_code}&src=${platform}&content=${content_id}`;

      // Store referral tracking
      const referralTracking: Partial<ReferralTracking> = {
        referral_code,
        source_user_session: source_session,
        referred_users: [],
        attribution_data: {
          platform,
          content_id,
          sharing_context,
          cultural_alignment: 'Black_QTIPOC_liberation'
        },
        community_impact: {
          new_user_journey_stages: [],
          resource_utilization: [],
          organizing_participation: false,
          community_connections_made: 0
        },
        viral_coefficient: 0
      };

      // Store in database
      const { error } = await supabase
        .from('referral_tracking')
        .insert(referralTracking);

      if (error) {
        console.error('Referral tracking storage error:', error);
      }

      return {
        referral_code,
        shareable_url,
        attribution_tracking: referralTracking.attribution_data
      };

    } catch (error) {
      console.error('Referral link creation error:', error);
      throw error;
    }
  }

  /**
   * Track referral conversion and community impact
   */
  async trackReferralConversion(
    referral_code: string,
    new_user_session: string,
    conversion_data: {
      journey_stage: string;
      resources_accessed: string[];
      community_connections: number;
      organizing_participation: boolean;
    }
  ): Promise<boolean> {
    try {
      // Update referral tracking
      const { data: existingReferral, error: fetchError } = await supabase
        .from('referral_tracking')
        .select('*')
        .eq('referral_code', referral_code)
        .single();

      if (fetchError || !existingReferral) {
        console.error('Referral not found:', fetchError);
        return false;
      }

      // Update referral with conversion data
      const updatedReferredUsers = [...existingReferral.referred_users, new_user_session];
      const updatedCommunityImpact = {
        ...existingReferral.community_impact,
        new_user_journey_stages: [
          ...existingReferral.community_impact.new_user_journey_stages,
          conversion_data.journey_stage
        ],
        resource_utilization: [
          ...existingReferral.community_impact.resource_utilization,
          ...conversion_data.resources_accessed
        ],
        organizing_participation: existingReferral.community_impact.organizing_participation || conversion_data.organizing_participation,
        community_connections_made: existingReferral.community_impact.community_connections_made + conversion_data.community_connections
      };

      // Calculate viral coefficient
      const viral_coefficient = updatedReferredUsers.length; // Simple calculation

      const { error: updateError } = await supabase
        .from('referral_tracking')
        .update({
          referred_users: updatedReferredUsers,
          community_impact: updatedCommunityImpact,
          viral_coefficient
        })
        .eq('referral_code', referral_code);

      if (updateError) {
        console.error('Referral update error:', updateError);
        return false;
      }

      // Record social growth metrics
      await this.recordGrowthMetric(
        existingReferral.attribution_data.platform,
        {
          new_user: true,
          referral_source: referral_code,
          community_engagement: conversion_data.community_connections > 0,
          organizing_participation: conversion_data.organizing_participation
        }
      );

      return true;

    } catch (error) {
      console.error('Referral conversion tracking error:', error);
      return false;
    }
  }

  /**
   * Get viral campaign analytics
   */
  async getViralCampaignAnalytics(
    time_period: 'daily' | 'weekly' | 'monthly' = 'weekly',
    platform?: string
  ): Promise<{
    overall_metrics: CommunityGrowthMetrics;
    top_performing_content: Array<{
      content_id: string;
      content_type: string;
      viral_score: number;
      community_impact: any;
      platforms: string[];
    }>;
    referral_performance: {
      total_referrals: number;
      conversion_rate: number;
      viral_coefficient: number;
      community_growth: number;
    };
    cultural_authenticity_feedback: {
      average_score: number;
      community_validation: string[];
      improvement_suggestions: string[];
    };
  }> {
    try {
      // Get growth metrics
      const growthMetrics = await this.getGrowthMetrics(time_period, platform);
      
      // Get top performing content
      const topContent = await this.getTopPerformingContent(time_period, platform);
      
      // Get referral performance
      const referralPerformance = await this.getReferralPerformance(time_period);
      
      // Get community feedback
      const communityFeedback = await this.getCommunityAuthenticityFeedback(time_period);

      return {
        overall_metrics: growthMetrics,
        top_performing_content: topContent,
        referral_performance: referralPerformance,
        cultural_authenticity_feedback: communityFeedback
      };

    } catch (error) {
      console.error('Viral campaign analytics error:', error);
      throw error;
    }
  }

  /**
   * Optimize content strategy based on performance data
   */
  async optimizeContentStrategy(
    analytics_period: 'weekly' | 'monthly' = 'weekly'
  ): Promise<{
    recommendations: Array<{
      area: string;
      suggestion: string;
      expected_impact: string;
      implementation_priority: 'high' | 'medium' | 'low';
    }>;
    best_practices: {
      optimal_posting_times: { [platform: string]: string[] };
      high_performing_hashtags: { [platform: string]: string[] };
      successful_content_themes: string[];
      effective_call_to_actions: string[];
    };
  }> {
    // Use AI to analyze performance and generate recommendations
    const analytics = await this.getViralCampaignAnalytics(analytics_period);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a social media strategist focused on authentic Black queer liberation content.
          Analyze performance data and provide optimization recommendations that maintain cultural authenticity while improving community reach and engagement.
          
          Focus on:
          - Content themes that resonate with Black QTIPOC communities
          - Optimal timing and platform strategies
          - Hashtag optimization for maximum reach
          - Call-to-action effectiveness for community building
          - Cultural authenticity maintenance
          
          Respond with JSON:
          {
            "recommendations": [
              {
                "area": "content_theme",
                "suggestion": "specific recommendation",
                "expected_impact": "predicted outcome",
                "implementation_priority": "high|medium|low"
              }
            ],
            "best_practices": {
              "successful_content_themes": ["theme1", "theme2"],
              "effective_call_to_actions": ["cta1", "cta2"],
              "cultural_authenticity_tips": ["tip1", "tip2"]
            }
          }`
        },
        {
          role: 'user',
          content: `Analyze this performance data and provide optimization recommendations:

Analytics: ${JSON.stringify(analytics, null, 2)}

Focus on maintaining cultural authenticity while improving community growth and engagement.`
        }
      ],
      temperature: 0.4,
      max_tokens: 1000
    });

    try {
      const optimization = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        recommendations: optimization.recommendations || [],
        best_practices: {
          optimal_posting_times: { 'all': ['6pm-8pm', '12pm-2pm'] }, // Default times
          high_performing_hashtags: { 'all': ['#BlackJoy', '#QTPOCPower', '#Liberation'] },
          successful_content_themes: optimization.best_practices?.successful_content_themes || ['empowerment', 'community_celebration'],
          effective_call_to_actions: optimization.best_practices?.effective_call_to_actions || ['Join our community', 'Share your story']
        }
      };

    } catch (error) {
      console.error('Content strategy optimization error:', error);
      return this.getDefaultOptimizationRecommendations();
    }
  }

  // Helper methods

  private initializePlatformConfigs(): { [key: string]: SocialPlatform } {
    return {
      twitter: {
        platform: 'twitter',
        content_constraints: {
          max_length: 280,
          supports_images: true,
          supports_video: true,
          hashtag_limit: 5,
          optimal_posting_times: ['12pm-2pm', '5pm-7pm']
        },
        audience_demographics: {
          primary_age_groups: ['18-34', '35-49'],
          community_segments: ['Black_queer', 'activists', 'community_organizers'],
          engagement_patterns: ['hashtag_discovery', 'retweet_amplification']
        }
      },
      instagram: {
        platform: 'instagram',
        content_constraints: {
          max_length: 2200,
          supports_images: true,
          supports_video: true,
          hashtag_limit: 30,
          optimal_posting_times: ['11am-1pm', '7pm-9pm']
        },
        audience_demographics: {
          primary_age_groups: ['18-34'],
          community_segments: ['Black_queer', 'visual_storytellers', 'community_builders'],
          engagement_patterns: ['visual_content', 'story_sharing', 'community_tags']
        }
      },
      facebook: {
        platform: 'facebook',
        content_constraints: {
          max_length: 63206,
          supports_images: true,
          supports_video: true,
          hashtag_limit: 10,
          optimal_posting_times: ['1pm-3pm', '6pm-8pm']
        },
        audience_demographics: {
          primary_age_groups: ['25-54'],
          community_segments: ['Black_queer', 'community_leaders', 'family_networks'],
          engagement_patterns: ['community_groups', 'event_sharing', 'resource_sharing']
        }
      },
      linkedin: {
        platform: 'linkedin',
        content_constraints: {
          max_length: 3000,
          supports_images: true,
          supports_video: true,
          hashtag_limit: 5,
          optimal_posting_times: ['8am-10am', '12pm-2pm']
        },
        audience_demographics: {
          primary_age_groups: ['25-54'],
          community_segments: ['Black_professionals', 'workplace_advocates', 'career_focused'],
          engagement_patterns: ['professional_networking', 'workplace_advocacy', 'career_support']
        }
      }
    };
  }

  private generateFallbackContent(platform: string, contentType: string): any {
    return {
      primary_text: `Celebrating Black queer liberation and community empowerment! 🌈✊ #BlackJoy #QTPOCPower`,
      hashtags: ['#BlackJoy', '#QTPOCPower', '#Liberation', '#Community'],
      call_to_action: 'Join our community and share your story!',
      accessibility_text: 'Social media post celebrating Black queer liberation',
      cultural_elements: ['Black_queer_celebration', 'liberation_messaging'],
      visual_description: 'Vibrant community celebration imagery with rainbow and empowerment symbols'
    };
  }

  private calculateExpectedReach(viralMechanics: any): number {
    const baseReach = 100;
    const multiplier = (viralMechanics.shareability_score + viralMechanics.community_resonance) / 200;
    return Math.round(baseReach * (1 + multiplier * 10));
  }

  private calculateEngagementTarget(contentType: string): number {
    const engagementMap: { [key: string]: number } = {
      'achievement_share': 0.08,
      'community_story': 0.12,
      'organizing_call': 0.15,
      'liberation_message': 0.10,
      'resource_highlight': 0.06
    };
    return engagementMap[contentType] || 0.08;
  }

  private generateConversionGoals(contentType: string): string[] {
    const goalMap: { [key: string]: string[] } = {
      'achievement_share': ['platform_signup', 'peer_connection', 'resource_access'],
      'community_story': ['story_sharing', 'community_joining', 'empowerment_resource_access'],
      'organizing_call': ['campaign_participation', 'event_attendance', 'organizing_skill_building'],
      'liberation_message': ['community_engagement', 'value_alignment', 'platform_advocacy'],
      'resource_highlight': ['resource_utilization', 'community_connection', 'needs_assessment']
    };
    return goalMap[contentType] || ['community_engagement'];
  }

  private async storeViralContent(content: ViralContent): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_growth_metrics')
        .insert({
          platform: 'multi_platform',
          content_type: content.content_type,
          journey_stage: content.journey_context.stage,
          content_id: content.id,
          engagement_metrics: content.viral_mechanics,
          viral_coefficient: 0, // Will be updated as shares occur
          community_impact_score: content.viral_mechanics.community_resonance,
          cultural_authenticity_rating: content.viral_mechanics.cultural_authenticity,
          liberation_message_alignment: content.viral_mechanics.liberation_message_strength,
          referral_attributions: [],
          network_effects_data: content.target_audience,
          content_performance_indicators: content.success_metrics
        });

      if (error) {
        console.error('Viral content storage error:', error);
      }
    } catch (error) {
      console.error('Store viral content error:', error);
    }
  }

  // Placeholder methods for analytics (implement based on actual data structure)
  private async getGrowthMetrics(timePeriod: string, platform?: string): Promise<CommunityGrowthMetrics> {
    // Implementation would query actual metrics from database
    return {
      platform: platform || 'all',
      time_period: timePeriod as any,
      metrics: {
        new_users: 150,
        engagement_rate: 0.085,
        sharing_rate: 0.12,
        conversion_to_active_community: 0.65,
        cultural_authenticity_feedback: 85,
        liberation_impact_stories: 12
      },
      growth_analysis: {
        viral_coefficient: 1.8,
        community_retention_rate: 0.78,
        platform_effectiveness: 82,
        cultural_resonance_score: 88
      },
      optimization_insights: {
        best_performing_content_types: ['achievement_share', 'community_story'],
        optimal_posting_times: ['6pm-8pm', '12pm-2pm'],
        high_engagement_hashtags: ['#BlackJoy', '#QTPOCPower', '#Liberation'],
        community_feedback_themes: ['authenticity', 'empowerment', 'community_connection']
      }
    };
  }

  private async getTopPerformingContent(timePeriod: string, platform?: string): Promise<any[]> {
    // Implementation would query actual performance data
    return [
      {
        content_id: 'viral_123',
        content_type: 'achievement_share',
        viral_score: 92,
        community_impact: { connections_made: 45, resources_accessed: 12 },
        platforms: ['twitter', 'instagram']
      }
    ];
  }

  private async getReferralPerformance(timePeriod: string): Promise<any> {
    // Implementation would calculate actual referral metrics
    return {
      total_referrals: 89,
      conversion_rate: 0.73,
      viral_coefficient: 1.8,
      community_growth: 127
    };
  }

  private async getCommunityAuthenticityFeedback(timePeriod: string): Promise<any> {
    // Implementation would gather actual community feedback
    return {
      average_score: 87,
      community_validation: ['authentic', 'empowering', 'culturally_relevant'],
      improvement_suggestions: ['more_local_content', 'diverse_voices', 'accessibility_focus']
    };
  }

  private async recordGrowthMetric(platform: string, metricData: any): Promise<void> {
    // Implementation would record growth metrics
    console.log('Recording growth metric:', platform, metricData);
  }

  private getDefaultOptimizationRecommendations(): any {
    return {
      recommendations: [
        {
          area: 'content_authenticity',
          suggestion: 'Increase community-generated content and personal stories',
          expected_impact: 'Higher cultural authenticity scores and community engagement',
          implementation_priority: 'high' as const
        },
        {
          area: 'posting_optimization',
          suggestion: 'Focus posting during peak engagement hours (6pm-8pm)',
          expected_impact: 'Increased reach and engagement rates',
          implementation_priority: 'medium' as const
        }
      ],
      best_practices: {
        optimal_posting_times: { 'all': ['6pm-8pm', '12pm-2pm'] },
        high_performing_hashtags: { 'all': ['#BlackJoy', '#QTPOCPower', '#Liberation', '#Community'] },
        successful_content_themes: ['empowerment', 'community_celebration', 'organizing_success'],
        effective_call_to_actions: ['Join our community', 'Share your story', 'Connect with peers']
      }
    };
  }
}

// Export social platform engine instance
export const socialPlatform = new SocialPlatformEngine();