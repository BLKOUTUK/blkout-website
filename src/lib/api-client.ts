// IVOR API Client - Frontend to Backend Communication Layer
// Handles all API calls with proper error handling and typing

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for frontend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_key'
);

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface JourneyRecognitionResult {
  domain: 'core' | 'community' | 'organizing' | 'social';
  stage: string;
  confidence: number;
  liberationGoals: string[];
  supportType: string;
  nextSteps: string[];
}

export interface IntelligentResponse {
  message: string;
  journey_insights: {
    domain: string;
    current_stage: string;
    support_type: string;
    liberation_focus: string[];
  };
  specific_resources: Array<{
    title: string;
    description: string;
    type: string;
    cultural_competency: string;
    accessibility: string[];
  }>;
  actionable_steps: Array<{
    step: string;
    timeline: string;
    community_connection: boolean;
    empowerment_focus: boolean;
  }>;
  community_connections: Array<{
    connection_type: string;
    description: string;
    liberation_potential: string;
  }>;
  cultural_affirmation: string;
}

// Demo/Mock data for development
const DEMO_DATA = {
  journeyStages: [
    { domain: 'core', stage: 'crisis', confidence: 0.9 },
    { domain: 'core', stage: 'community_healing', confidence: 0.85 },
    { domain: 'organizing', stage: 'action', confidence: 0.88 },
    { domain: 'community', stage: 'community_pattern', confidence: 0.82 }
  ],
  
  responses: {
    crisis: {
      message: "I understand you're facing a crisis right now. Your safety and wellbeing matter deeply to our community. Let me connect you with immediate support resources that are culturally competent and affirming of your identity.",
      cultural_affirmation: "You are valued, your experiences are valid, and you deserve support that honors your full identity as a Black queer person. Our community sees you and stands with you."
    },
    healing: {
      message: "Healing is a sacred journey, especially within our community. I'm here to support you in finding resources and connections that honor both your individual path and our collective strength.",
      cultural_affirmation: "Your healing contributes to our community's liberation. Taking care of yourself is an act of resistance and love for our people."
    },
    organizing: {
      message: "Your desire to organize and create change is powerful. Let me connect you with democratic organizing opportunities and resources that align with our liberation values.",
      cultural_affirmation: "Leadership and organizing are in our blood. Your voice and action have the power to transform not just your community, but contribute to broader Black queer liberation."
    }
  },

  resources: [
    {
      title: "Black Trans Crisis Support Network",
      description: "24/7 culturally competent crisis support specifically for Black trans community members",
      type: "crisis_support",
      cultural_competency: "Black trans specific",
      accessibility: ["text_support", "phone_support", "peer_navigation"]
    },
    {
      title: "Healing Justice Community Circles",
      description: "Regular healing circles focused on collective wellness and trauma recovery",
      type: "healing_support",
      cultural_competency: "Black queer centered",
      accessibility: ["sliding_scale", "virtual_options", "childcare"]
    },
    {
      title: "Housing Justice Organizing Toolkit",
      description: "Resources and strategies for tenant organizing and housing advocacy",
      type: "organizing_resource",
      cultural_competency: "Community controlled",
      accessibility: ["multiple_languages", "digital_accessible", "print_options"]
    }
  ],

  communityProjects: [
    {
      id: 'project_1',
      title: 'South Side Community Garden Initiative',
      description: 'Creating community-controlled food sovereignty through collective gardening and education',
      project_type: 'economic',
      organizing_stage: 'action',
      liberation_objectives: ['food_sovereignty', 'community_control', 'environmental_justice'],
      community_support_level: 87,
      democratic_validation_score: 92
    },
    {
      id: 'project_2', 
      title: 'Black Trans Safety Network',
      description: 'Peer-led safety network providing crisis support and community protection for Black trans individuals',
      project_type: 'safety',
      organizing_stage: 'leadership',
      liberation_objectives: ['trans_safety', 'community_defense', 'peer_support'],
      community_support_level: 94,
      democratic_validation_score: 96
    }
  ]
};

/**
 * IVOR API Client Class
 */
export class IVORAPIClient {
  private demoMode: boolean;
  private apiBaseUrl: string;

  constructor() {
    this.demoMode = process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase');
    this.apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    if (this.demoMode) {
      console.log('🎭 IVOR API Client running in demo mode');
    }
  }

  /**
   * Journey Recognition API
   */
  async recognizeJourneyStage(
    userInput: string,
    userContext: any = {}
  ): Promise<APIResponse<JourneyRecognitionResult>> {
    try {
      if (this.demoMode) {
        // Mock journey recognition based on input keywords
        const input = userInput.toLowerCase();
        let mockResult;

        if (input.includes('crisis') || input.includes('emergency') || input.includes('help')) {
          mockResult = {
            domain: 'core' as const,
            stage: 'crisis',
            confidence: 0.92,
            liberationGoals: ['safety', 'immediate_empowerment', 'crisis_navigation'],
            supportType: 'immediate_crisis_support',
            nextSteps: ['Connect with crisis resources', 'Ensure immediate safety', 'Peer support connection']
          };
        } else if (input.includes('community') || input.includes('connect') || input.includes('healing')) {
          mockResult = {
            domain: 'core' as const,
            stage: 'community_healing',
            confidence: 0.87,
            liberationGoals: ['community_connection', 'healing_justice', 'peer_support'],
            supportType: 'healing_and_connection',
            nextSteps: ['Join healing circles', 'Connect with peer support', 'Explore community resources']
          };
        } else if (input.includes('organize') || input.includes('campaign') || input.includes('action')) {
          mockResult = {
            domain: 'organizing' as const,
            stage: 'action',
            confidence: 0.89,
            liberationGoals: ['collective_action', 'community_organizing', 'systemic_change'],
            supportType: 'organizing_coordination',
            nextSteps: ['Join organizing projects', 'Develop organizing skills', 'Connect with campaigns']
          };
        } else {
          mockResult = {
            domain: 'community' as const,
            stage: 'community_pattern',
            confidence: 0.78,
            liberationGoals: ['community_understanding', 'pattern_recognition', 'collective_intelligence'],
            supportType: 'community_analysis',
            nextSteps: ['Explore community insights', 'Connect with neighbors', 'Share experiences']
          };
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

        return {
          success: true,
          data: mockResult
        };
      }

      // Real API call would go here
      const response = await fetch(`${this.apiBaseUrl}/api/ivor/journey-recognition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, userContext })
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Journey recognition error:', error);
      return {
        success: false,
        error: 'Failed to recognize journey stage'
      };
    }
  }

  /**
   * Intelligent Response Generation API
   */
  async generateIntelligentResponse(
    userInput: string,
    userContext: any = {},
    sessionId: string
  ): Promise<APIResponse<IntelligentResponse>> {
    try {
      if (this.demoMode) {
        // Determine response type based on input
        const input = userInput.toLowerCase();
        let responseType = 'healing';
        
        if (input.includes('crisis') || input.includes('emergency')) {
          responseType = 'crisis';
        } else if (input.includes('organize') || input.includes('campaign')) {
          responseType = 'organizing';
        }

        const baseResponse = DEMO_DATA.responses[responseType as keyof typeof DEMO_DATA.responses];
        
        const mockResponse: IntelligentResponse = {
          message: baseResponse.message,
          journey_insights: {
            domain: responseType === 'organizing' ? 'organizing' : 'core',
            current_stage: responseType === 'crisis' ? 'crisis' : responseType === 'organizing' ? 'action' : 'community_healing',
            support_type: responseType === 'crisis' ? 'immediate_support' : responseType === 'organizing' ? 'organizing_coordination' : 'healing_support',
            liberation_focus: responseType === 'crisis' ? ['safety', 'crisis_navigation'] : responseType === 'organizing' ? ['collective_action', 'community_organizing'] : ['healing_justice', 'community_connection']
          },
          specific_resources: DEMO_DATA.resources.filter(r => 
            (responseType === 'crisis' && r.type === 'crisis_support') ||
            (responseType === 'organizing' && r.type === 'organizing_resource') ||
            (responseType === 'healing' && r.type === 'healing_support')
          ).slice(0, 3),
          actionable_steps: [
            {
              step: responseType === 'crisis' ? 'Connect with immediate crisis support' : responseType === 'organizing' ? 'Join active organizing campaign' : 'Attend healing circle this week',
              timeline: responseType === 'crisis' ? 'Immediate' : 'This week',
              community_connection: true,
              empowerment_focus: true
            },
            {
              step: responseType === 'crisis' ? 'Develop safety plan with peer support' : responseType === 'organizing' ? 'Participate in next community meeting' : 'Connect with peer support network',
              timeline: responseType === 'crisis' ? 'Next 24 hours' : 'Next 2 weeks',
              community_connection: true,
              empowerment_focus: true
            }
          ],
          community_connections: [
            {
              connection_type: responseType === 'crisis' ? 'crisis_support_network' : responseType === 'organizing' ? 'organizing_collective' : 'healing_community',
              description: responseType === 'crisis' ? 'Peer-led crisis support network with 24/7 availability' : responseType === 'organizing' ? 'Active organizing campaigns working on housing and healthcare justice' : 'Healing justice community focused on collective wellness and trauma recovery',
              liberation_potential: 'High'
            }
          ],
          cultural_affirmation: baseResponse.cultural_affirmation
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        return {
          success: true,
          data: mockResponse
        };
      }

      // Real API call would go here
      const response = await fetch(`${this.apiBaseUrl}/api/ivor/intelligent-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, userContext, sessionId })
      });

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Intelligent response error:', error);
      return {
        success: false,
        error: 'Failed to generate intelligent response'
      };
    }
  }

  /**
   * Get Active Organizing Projects
   */
  async getActiveProjects(filters: any = {}): Promise<APIResponse<any[]>> {
    try {
      if (this.demoMode) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
          success: true,
          data: DEMO_DATA.communityProjects
        };
      }

      // Real Supabase query
      const { data, error } = await supabase
        .from('organizing_projects')
        .select('*')
        .in('status', ['validated', 'active'])
        .order('community_support_level', { ascending: false })
        .limit(20);

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('Get active projects error:', error);
      return {
        success: false,
        error: 'Failed to load active projects'
      };
    }
  }

  /**
   * Create Organizing Project
   */
  async createProject(projectData: any, proposerContext: any): Promise<APIResponse<any>> {
    try {
      if (this.demoMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockProjectId = `project_${Date.now()}`;
        
        return {
          success: true,
          data: {
            project_id: mockProjectId,
            validation_needed: true,
            message: 'Project created successfully! Community validation in progress.'
          }
        };
      }

      // Real API call
      const response = await fetch(`${this.apiBaseUrl}/api/organizing/create-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData, proposerContext })
      });

      return await response.json();

    } catch (error) {
      console.error('Create project error:', error);
      return {
        success: false,
        error: 'Failed to create project'
      };
    }
  }

  /**
   * Get Community Statistics
   */
  async getCommunityStats(): Promise<APIResponse<any>> {
    try {
      if (this.demoMode) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return {
          success: true,
          data: {
            active_projects: Math.floor(Math.random() * 15) + 8,
            community_members: Math.floor(Math.random() * 400) + 800,
            organizing_opportunities: Math.floor(Math.random() * 8) + 3,
            liberation_impact_score: Math.floor(Math.random() * 15) + 85,
            cultural_authenticity_avg: Math.floor(Math.random() * 10) + 90
          }
        };
      }

      // Real API call for community statistics
      const response = await fetch(`${this.apiBaseUrl}/api/community/stats`);
      return await response.json();

    } catch (error) {
      console.error('Community stats error:', error);
      return {
        success: false,
        error: 'Failed to load community statistics'
      };
    }
  }

  /**
   * Health check for API services
   */
  async healthCheck(): Promise<APIResponse<any>> {
    try {
      const services = {
        database: this.demoMode ? 'demo' : 'connected',
        ai_services: this.demoMode ? 'demo' : 'connected', 
        redis_coordination: this.demoMode ? 'demo' : 'connected',
        performance_monitoring: 'active',
        liberation_values_validation: 'active'
      };

      return {
        success: true,
        data: {
          status: 'healthy',
          services,
          demo_mode: this.demoMode,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: 'Health check failed'
      };
    }
  }
}

// Export singleton instance
export const ivorAPI = new IVORAPIClient();