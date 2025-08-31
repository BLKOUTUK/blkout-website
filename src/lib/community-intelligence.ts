// IVOR Community Intelligence Engine - Anonymous Analytics & Pattern Recognition
// Stream B: Building Community Insights for Liberation Strategy

import { supabase } from './supabase';
import OpenAI from 'openai';

export interface CommunityPattern {
  id: number;
  pattern_type: 'health_disparity' | 'housing_crisis' | 'resource_gap' | 'organizing_opportunity' | 'community_strength';
  geographic_area: string;
  demographic_context: {
    age_groups?: string[];
    community_segments?: string[];
    intersectional_identities?: string[];
  };
  pattern_data: {
    frequency: number;
    trend_direction: 'increasing' | 'stable' | 'decreasing';
    severity_level: 'low' | 'medium' | 'high' | 'critical';
    affected_population_estimate: number;
    temporal_patterns?: string[];
    correlation_factors?: string[];
  };
  liberation_implications: {
    empowerment_opportunities: string[];
    organizing_potential: string[];
    resource_mobilization_needs: string[];
    community_strengths_to_leverage: string[];
    systemic_barriers_identified: string[];
  };
  confidence_score: number;
  community_validation_status: 'pending' | 'validated' | 'disputed';
  privacy_protection_level: 'high' | 'medium' | 'low';
  created_at: Date;
}

export interface CommunityInsight {
  insight_type: 'trend' | 'gap' | 'opportunity' | 'strength';
  domain: 'core' | 'community' | 'organizing' | 'social';
  title: string;
  description: string;
  evidence: string[];
  community_impact_assessment: {
    empowerment_potential: number; // 0-100
    organizing_readiness: number; // 0-100
    resource_requirements: string[];
    timeline_for_action: 'immediate' | 'short_term' | 'long_term';
  };
  recommended_actions: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    responsible_parties: string[];
    resource_needs: string[];
    success_indicators: string[];
  }>;
  liberation_relevance: number; // 0-100
}

export interface AnonymousDataPoint {
  session_id_hash: string; // Hashed for privacy
  domain: string;
  journey_stage: string;
  interaction_type: 'crisis_support' | 'resource_request' | 'community_question' | 'organizing_inquiry';
  geographic_region?: string; // Broad region, not specific location
  temporal_context: Date;
  outcome_indicators?: string[];
  community_connections_made?: number;
  resource_utilization?: string[];
  empowerment_progress?: 'positive' | 'neutral' | 'needs_support';
}

export class CommunityIntelligenceEngine {
  private openai: OpenAI;
  private pattern_recognition_threshold = 0.75;
  private minimum_data_points = 10; // Minimum for pattern recognition

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    });
  }

  /**
   * Collect anonymous interaction data for pattern recognition
   */
  async collectAnonymousData(
    session_id: string,
    interaction_data: {
      domain: string;
      journey_stage: string;
      interaction_type: 'crisis_support' | 'resource_request' | 'community_question' | 'organizing_inquiry';
      user_context?: {
        location?: string;
        resources?: string[];
        empowerment_goals?: string[];
        community_connections?: string[];
      };
      outcome_indicators?: string[];
      community_connections_made?: number;
      resource_utilization?: string[];
      empowerment_progress?: 'positive' | 'neutral' | 'needs_support';
    }
  ): Promise<boolean> {
    try {
      // Create privacy-protected data point
      const anonymousData: Partial<AnonymousDataPoint> = {
        session_id_hash: await this.hashSessionId(session_id),
        domain: interaction_data.domain,
        journey_stage: interaction_data.journey_stage,
        interaction_type: interaction_data.interaction_type,
        geographic_region: this.anonymizeLocation(interaction_data.user_context?.location),
        temporal_context: new Date(),
        outcome_indicators: interaction_data.outcome_indicators,
        community_connections_made: interaction_data.community_connections_made || 0,
        resource_utilization: interaction_data.resource_utilization,
        empowerment_progress: interaction_data.empowerment_progress
      };

      // Store anonymized data
      const { error } = await supabase
        .from('anonymous_interaction_data')
        .insert(anonymousData);

      if (error) {
        console.error('Anonymous data collection error:', error);
        return false;
      }

      // Trigger pattern recognition if enough data points exist
      await this.checkForPatternRecognitionTrigger(interaction_data.domain);

      return true;
    } catch (error) {
      console.error('Community intelligence data collection error:', error);
      return false;
    }
  }

  /**
   * Recognize patterns in community interactions
   */
  async recognizeCommunityPatterns(
    domain?: string,
    geographic_area?: string,
    time_window_days: number = 30
  ): Promise<CommunityPattern[]> {
    try {
      // Query anonymous interaction data for patterns
      let query = supabase
        .from('anonymous_interaction_data')
        .select('*')
        .gte('temporal_context', new Date(Date.now() - (time_window_days * 24 * 60 * 60 * 1000)).toISOString());

      if (domain) {
        query = query.eq('domain', domain);
      }

      if (geographic_area) {
        query = query.eq('geographic_region', geographic_area);
      }

      const { data: interactionData, error } = await query;

      if (error || !interactionData || interactionData.length < this.minimum_data_points) {
        return [];
      }

      // Analyze patterns using AI
      const patterns = await this.analyzeInteractionPatterns(interactionData);

      // Store validated patterns
      for (const pattern of patterns) {
        await this.storeCommunityPattern(pattern);
      }

      return patterns;
    } catch (error) {
      console.error('Pattern recognition error:', error);
      return [];
    }
  }

  /**
   * Analyze interaction data for meaningful patterns using AI
   */
  private async analyzeInteractionPatterns(interactionData: any[]): Promise<CommunityPattern[]> {
    try {
      // Prepare data for AI analysis
      const dataForAnalysis = this.prepareDataForAnalysis(interactionData);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a community intelligence analyst focused on Black queer liberation and empowerment. 
            Analyze anonymous interaction data to identify meaningful patterns that can inform community organizing and resource allocation.
            
            Focus on:
            - Community needs and resource gaps
            - Emerging organizing opportunities
            - Systemic barriers affecting community empowerment
            - Community strengths and resilience patterns
            - Geographic and temporal trends
            
            IMPORTANT: All analysis must serve liberation goals and community empowerment. 
            Identify patterns that can help communities organize more effectively and access needed resources.
            
            Respond with JSON array of patterns found:
            [{
              "pattern_type": "health_disparity|housing_crisis|resource_gap|organizing_opportunity|community_strength",
              "description": "clear description of pattern",
              "evidence": ["data points supporting pattern"],
              "geographic_scope": "geographic area affected",
              "severity_level": "low|medium|high|critical",
              "liberation_implications": {
                "empowerment_opportunities": ["list of opportunities"],
                "organizing_potential": ["organizing strategies"],
                "resource_mobilization_needs": ["resource needs"],
                "systemic_barriers_identified": ["barriers to address"]
              },
              "confidence_score": 0.0-1.0
            }]`
          },
          {
            role: 'user',
            content: `Analyze this community interaction data for patterns:\n\n${JSON.stringify(dataForAnalysis, null, 2)}\n\nIdentify patterns that can inform community liberation strategies and resource allocation.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const patternAnalysis = JSON.parse(response.choices[0].message.content || '[]');

      // Convert AI analysis to CommunityPattern format
      return patternAnalysis.map((analysis: any, index: number) => ({
        id: Date.now() + index, // Temporary ID
        pattern_type: analysis.pattern_type,
        geographic_area: analysis.geographic_scope || 'unknown',
        demographic_context: this.extractDemographicContext(interactionData),
        pattern_data: {
          frequency: this.calculatePatternFrequency(interactionData, analysis.pattern_type),
          trend_direction: this.determineTrendDirection(interactionData),
          severity_level: analysis.severity_level,
          affected_population_estimate: this.estimateAffectedPopulation(interactionData),
          temporal_patterns: this.identifyTemporalPatterns(interactionData),
          correlation_factors: analysis.evidence || []
        },
        liberation_implications: analysis.liberation_implications,
        confidence_score: analysis.confidence_score || 0.7,
        community_validation_status: 'pending' as const,
        privacy_protection_level: 'high' as const,
        created_at: new Date()
      }));

    } catch (error) {
      console.error('AI pattern analysis error:', error);
      return [];
    }
  }

  /**
   * Generate community insights from patterns
   */
  async generateCommunityInsights(
    patterns: CommunityPattern[],
    domain?: string
  ): Promise<CommunityInsight[]> {
    const insights: CommunityInsight[] = [];

    for (const pattern of patterns) {
      // Skip patterns that don't match domain filter
      if (domain && this.getPatternDomain(pattern.pattern_type) !== domain) {
        continue;
      }

      const insight: CommunityInsight = {
        insight_type: this.determineInsightType(pattern.pattern_type),
        domain: this.getPatternDomain(pattern.pattern_type),
        title: this.generateInsightTitle(pattern),
        description: this.generateInsightDescription(pattern),
        evidence: pattern.pattern_data.correlation_factors || [],
        community_impact_assessment: {
          empowerment_potential: this.assessEmpowermentPotential(pattern),
          organizing_readiness: this.assessOrganizingReadiness(pattern),
          resource_requirements: pattern.liberation_implications.resource_mobilization_needs,
          timeline_for_action: this.determineActionTimeline(pattern.pattern_data.severity_level)
        },
        recommended_actions: this.generateRecommendedActions(pattern),
        liberation_relevance: this.calculateLiberationRelevance(pattern)
      };

      insights.push(insight);
    }

    return insights;
  }

  /**
   * Store community pattern in database
   */
  private async storeCommunityPattern(pattern: CommunityPattern): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_insights')
        .insert({
          insight_type: 'pattern',
          domain: this.getPatternDomain(pattern.pattern_type),
          geographic_area: pattern.geographic_area,
          demographic_context: pattern.demographic_context,
          pattern_data: pattern.pattern_data,
          confidence_score: pattern.confidence_score,
          community_impact_assessment: pattern.liberation_implications,
          resource_implications: pattern.liberation_implications.resource_mobilization_needs,
          organizing_opportunities: pattern.liberation_implications.organizing_potential,
          liberation_relevance: Math.round(pattern.confidence_score * 100),
          privacy_protection_level: pattern.privacy_protection_level,
          community_validation_status: pattern.community_validation_status
        });

      return !error;
    } catch (error) {
      console.error('Pattern storage error:', error);
      return false;
    }
  }

  /**
   * Get community intelligence dashboard data
   */
  async getCommunityDashboardData(
    geographic_area?: string,
    domain?: string
  ): Promise<{
    patterns: CommunityPattern[];
    insights: CommunityInsight[];
    trend_summary: {
      total_patterns: number;
      critical_issues: number;
      organizing_opportunities: number;
      community_strengths: number;
      resource_gaps: number;
    };
    geographic_hotspots: Array<{
      area: string;
      pattern_count: number;
      priority_level: 'high' | 'medium' | 'low';
    }>;
  }> {
    try {
      // Get validated patterns
      let query = supabase
        .from('community_insights')
        .select('*')
        .eq('community_validation_status', 'validated')
        .order('created_at', { ascending: false });

      if (geographic_area) {
        query = query.eq('geographic_area', geographic_area);
      }

      if (domain) {
        query = query.eq('domain', domain);
      }

      const { data: rawInsights, error } = await query;

      if (error || !rawInsights) {
        return this.getEmptyDashboardData();
      }

      // Convert database records to patterns
      const patterns = this.convertDbRecordsToPatterns(rawInsights);
      const insights = await this.generateCommunityInsights(patterns, domain);

      // Generate trend summary
      const trend_summary = this.generateTrendSummary(patterns);

      // Identify geographic hotspots
      const geographic_hotspots = this.identifyGeographicHotspots(patterns);

      return {
        patterns,
        insights,
        trend_summary,
        geographic_hotspots
      };

    } catch (error) {
      console.error('Dashboard data generation error:', error);
      return this.getEmptyDashboardData();
    }
  }

  /**
   * Predict community needs based on patterns
   */
  async predictCommunityNeeds(
    geographic_area?: string,
    prediction_window_days: number = 30
  ): Promise<Array<{
    need_type: string;
    predicted_intensity: 'low' | 'medium' | 'high';
    confidence: number;
    recommended_preparation: string[];
    timeline: Date;
  }>> {
    try {
      // Get recent patterns for prediction
      const recentPatterns = await this.recognizeCommunityPatterns(
        undefined,
        geographic_area,
        60 // Look back 60 days for prediction
      );

      // Use AI to predict future needs
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a community needs prediction analyst focused on Black queer liberation and empowerment.
            Based on recent community patterns, predict future community needs and resource requirements.
            
            Focus on:
            - Anticipating resource gaps before they become critical
            - Identifying emerging organizing opportunities
            - Predicting community support needs
            - Forecasting potential community empowerment moments
            
            Respond with JSON array of predictions:
            [{
              "need_type": "specific community need",
              "predicted_intensity": "low|medium|high",
              "confidence": 0.0-1.0,
              "recommended_preparation": ["preparation actions"],
              "timeline_days": number_of_days
            }]`
          },
          {
            role: 'user',
            content: `Based on these community patterns, predict future community needs for the next ${prediction_window_days} days:\n\n${JSON.stringify(recentPatterns.slice(0, 10), null, 2)}`
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      const predictions = JSON.parse(response.choices[0].message.content || '[]');

      return predictions.map((pred: any) => ({
        need_type: pred.need_type,
        predicted_intensity: pred.predicted_intensity,
        confidence: pred.confidence,
        recommended_preparation: pred.recommended_preparation,
        timeline: new Date(Date.now() + (pred.timeline_days * 24 * 60 * 60 * 1000))
      }));

    } catch (error) {
      console.error('Community needs prediction error:', error);
      return [];
    }
  }

  // Helper methods

  private async hashSessionId(session_id: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(session_id);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private anonymizeLocation(location?: string): string | undefined {
    if (!location) return undefined;
    
    // Return broad geographic region instead of specific location
    const regions: { [key: string]: string } = {
      'new york': 'northeast',
      'brooklyn': 'northeast',
      'manhattan': 'northeast',
      'chicago': 'midwest',
      'detroit': 'midwest',
      'atlanta': 'southeast',
      'miami': 'southeast',
      'los angeles': 'west',
      'san francisco': 'west',
      'seattle': 'west'
    };

    const lowerLocation = location.toLowerCase();
    for (const [city, region] of Object.entries(regions)) {
      if (lowerLocation.includes(city)) {
        return region;
      }
    }

    return 'unknown';
  }

  private prepareDataForAnalysis(interactionData: any[]): any {
    return {
      total_interactions: interactionData.length,
      domain_breakdown: this.groupBy(interactionData, 'domain'),
      journey_stage_distribution: this.groupBy(interactionData, 'journey_stage'),
      interaction_type_frequency: this.groupBy(interactionData, 'interaction_type'),
      geographic_distribution: this.groupBy(interactionData, 'geographic_region'),
      temporal_patterns: this.analyzeTemporalDistribution(interactionData),
      empowerment_progress_trends: this.groupBy(interactionData.filter(d => d.empowerment_progress), 'empowerment_progress'),
      resource_utilization_patterns: this.analyzeResourceUtilization(interactionData)
    };
  }

  private groupBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((result, item) => {
      const group = item[key] || 'unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  private analyzeTemporalDistribution(data: any[]): any {
    const hourlyDistribution = data.reduce((result, item) => {
      const hour = new Date(item.temporal_context).getHours();
      result[hour] = (result[hour] || 0) + 1;
      return result;
    }, {});

    const dailyDistribution = data.reduce((result, item) => {
      const day = new Date(item.temporal_context).getDay();
      result[day] = (result[day] || 0) + 1;
      return result;
    }, {});

    return { hourly: hourlyDistribution, daily: dailyDistribution };
  }

  private analyzeResourceUtilization(data: any[]): any {
    const resourceCounts: { [key: string]: number } = {};
    
    data.forEach(item => {
      if (item.resource_utilization && Array.isArray(item.resource_utilization)) {
        item.resource_utilization.forEach((resource: string) => {
          resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
        });
      }
    });

    return resourceCounts;
  }

  private async checkForPatternRecognitionTrigger(domain: string): Promise<void> {
    // Trigger pattern recognition when we have enough new data points
    const { count } = await supabase
      .from('anonymous_interaction_data')
      .select('*', { count: 'exact', head: true })
      .eq('domain', domain)
      .gte('temporal_context', new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString());

    if (count && count >= this.minimum_data_points) {
      // Trigger async pattern recognition
      this.recognizeCommunityPatterns(domain, undefined, 7); // Last 7 days
    }
  }

  private extractDemographicContext(data: any[]): any {
    return {
      community_segments: ['Black_queer', 'Black_trans', 'QTIPOC'],
      intersectional_identities: ['LGBTQ+', 'BIPOC', 'marginalized_communities']
    };
  }

  private calculatePatternFrequency(data: any[], patternType: string): number {
    return data.length / 30; // Average per day over 30 days
  }

  private determineTrendDirection(data: any[]): 'increasing' | 'stable' | 'decreasing' {
    // Simple trend analysis - compare first half to second half
    const midpoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midpoint).length;
    const secondHalf = data.slice(midpoint).length;

    if (secondHalf > firstHalf * 1.1) return 'increasing';
    if (secondHalf < firstHalf * 0.9) return 'decreasing';
    return 'stable';
  }

  private estimateAffectedPopulation(data: any[]): number {
    // Conservative estimate based on unique sessions
    const uniqueSessions = new Set(data.map(d => d.session_id_hash)).size;
    return uniqueSessions * 2; // Estimate multiplier for community reach
  }

  private identifyTemporalPatterns(data: any[]): string[] {
    const patterns: string[] = [];
    const hourlyData = this.groupBy(data, 'hour');
    
    // Identify peak hours
    const maxHour = Object.entries(hourlyData).reduce((a, b) => 
      hourlyData[a[0]] > hourlyData[b[0]] ? a : b
    );
    
    patterns.push(`Peak activity at ${maxHour[0]}:00`);
    
    return patterns;
  }

  private getPatternDomain(patternType: string): 'core' | 'community' | 'organizing' | 'social' {
    const domainMap: { [key: string]: 'core' | 'community' | 'organizing' | 'social' } = {
      'health_disparity': 'core',
      'housing_crisis': 'organizing',
      'resource_gap': 'community',
      'organizing_opportunity': 'organizing',
      'community_strength': 'social'
    };
    return domainMap[patternType] || 'community';
  }

  private determineInsightType(patternType: string): 'trend' | 'gap' | 'opportunity' | 'strength' {
    const typeMap: { [key: string]: 'trend' | 'gap' | 'opportunity' | 'strength' } = {
      'health_disparity': 'gap',
      'housing_crisis': 'trend',
      'resource_gap': 'gap',
      'organizing_opportunity': 'opportunity',
      'community_strength': 'strength'
    };
    return typeMap[patternType] || 'trend';
  }

  private generateInsightTitle(pattern: CommunityPattern): string {
    const titles: { [key: string]: string } = {
      'health_disparity': 'Health Access Barriers in Community',
      'housing_crisis': 'Housing Justice Organizing Opportunity',
      'resource_gap': 'Community Resource Gap Identified',
      'organizing_opportunity': 'Emerging Organizing Momentum',
      'community_strength': 'Community Resilience Pattern'
    };
    return titles[pattern.pattern_type] || 'Community Pattern Identified';
  }

  private generateInsightDescription(pattern: CommunityPattern): string {
    return `Analysis of community interactions reveals ${pattern.pattern_type.replace('_', ' ')} patterns affecting approximately ${pattern.pattern_data.affected_population_estimate} community members in ${pattern.geographic_area}. Confidence level: ${Math.round(pattern.confidence_score * 100)}%`;
  }

  private assessEmpowermentPotential(pattern: CommunityPattern): number {
    return Math.min(100, Math.round(pattern.confidence_score * 100 * 0.8));
  }

  private assessOrganizingReadiness(pattern: CommunityPattern): number {
    const readinessMap: { [key: string]: number } = {
      'organizing_opportunity': 85,
      'community_strength': 75,
      'resource_gap': 60,
      'housing_crisis': 70,
      'health_disparity': 50
    };
    return readinessMap[pattern.pattern_type] || 50;
  }

  private determineActionTimeline(severity: string): 'immediate' | 'short_term' | 'long_term' {
    const timelineMap: { [key: string]: 'immediate' | 'short_term' | 'long_term' } = {
      'critical': 'immediate',
      'high': 'short_term',
      'medium': 'short_term',
      'low': 'long_term'
    };
    return timelineMap[severity] || 'short_term';
  }

  private generateRecommendedActions(pattern: CommunityPattern): CommunityInsight['recommended_actions'] {
    return pattern.liberation_implications.empowerment_opportunities.slice(0, 3).map(opportunity => ({
      action: opportunity,
      priority: pattern.pattern_data.severity_level === 'critical' ? 'high' as const : 'medium' as const,
      responsible_parties: ['community_organizers', 'resource_coordinators'],
      resource_needs: pattern.liberation_implications.resource_mobilization_needs.slice(0, 2),
      success_indicators: ['increased_community_engagement', 'resource_access_improvement']
    }));
  }

  private calculateLiberationRelevance(pattern: CommunityPattern): number {
    return Math.round(pattern.confidence_score * 100);
  }

  private generateTrendSummary(patterns: CommunityPattern[]): any {
    return {
      total_patterns: patterns.length,
      critical_issues: patterns.filter(p => p.pattern_data.severity_level === 'critical').length,
      organizing_opportunities: patterns.filter(p => p.pattern_type === 'organizing_opportunity').length,
      community_strengths: patterns.filter(p => p.pattern_type === 'community_strength').length,
      resource_gaps: patterns.filter(p => p.pattern_type === 'resource_gap').length
    };
  }

  private identifyGeographicHotspots(patterns: CommunityPattern[]): any[] {
    const areaCount = this.groupBy(patterns, 'geographic_area');
    return Object.entries(areaCount)
      .map(([area, count]) => ({
        area,
        pattern_count: count,
        priority_level: count > 5 ? 'high' as const : count > 2 ? 'medium' as const : 'low' as const
      }))
      .sort((a, b) => b.pattern_count - a.pattern_count)
      .slice(0, 10);
  }

  private convertDbRecordsToPatterns(records: any[]): CommunityPattern[] {
    return records.map(record => ({
      id: record.id,
      pattern_type: record.insight_type === 'pattern' ? 'community_strength' : 'resource_gap',
      geographic_area: record.geographic_area || 'unknown',
      demographic_context: record.demographic_context || {},
      pattern_data: record.pattern_data || {
        frequency: 1,
        trend_direction: 'stable' as const,
        severity_level: 'medium' as const,
        affected_population_estimate: 10
      },
      liberation_implications: record.community_impact_assessment || {
        empowerment_opportunities: [],
        organizing_potential: record.organizing_opportunities || [],
        resource_mobilization_needs: record.resource_implications || [],
        community_strengths_to_leverage: [],
        systemic_barriers_identified: []
      },
      confidence_score: record.confidence_score || 0.5,
      community_validation_status: record.community_validation_status || 'pending',
      privacy_protection_level: record.privacy_protection_level || 'high',
      created_at: new Date(record.created_at)
    }));
  }

  private getEmptyDashboardData(): any {
    return {
      patterns: [],
      insights: [],
      trend_summary: {
        total_patterns: 0,
        critical_issues: 0,
        organizing_opportunities: 0,
        community_strengths: 0,
        resource_gaps: 0
      },
      geographic_hotspots: []
    };
  }
}

// Export community intelligence engine instance
export const communityIntelligence = new CommunityIntelligenceEngine();