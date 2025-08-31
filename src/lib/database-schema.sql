-- IVOR Community Liberation Platform - Database Schema Evolution
-- Journey-Aware Knowledge Architecture for Community Empowerment

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enhanced knowledge content table with journey awareness
CREATE TABLE IF NOT EXISTS knowledge_content (
    id SERIAL PRIMARY KEY,
    source_url VARCHAR(500),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    domain VARCHAR(50) NOT NULL CHECK (domain IN ('core', 'community', 'organizing', 'social')),
    journey_stage VARCHAR(100) NOT NULL,
    outcome_objectives TEXT[] DEFAULT '{}',
    context_requirements JSONB DEFAULT '{}',
    next_stage_pathways TEXT[] DEFAULT '{}',
    embedding_vector VECTOR(1536), -- OpenAI embedding dimensions
    authority_score INTEGER DEFAULT 50 CHECK (authority_score >= 0 AND authority_score <= 100),
    community_validation JSONB DEFAULT '{}',
    cultural_context VARCHAR(100),
    liberation_goals TEXT[] DEFAULT '{}',
    accessibility_features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User journey tracking with privacy protection
CREATE TABLE IF NOT EXISTS user_journeys (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    domain VARCHAR(50) NOT NULL CHECK (domain IN ('core', 'community', 'organizing', 'social')),
    current_stage VARCHAR(100) NOT NULL,
    context_variables JSONB DEFAULT '{}',
    journey_history TEXT[] DEFAULT '{}',
    outcomes_achieved TEXT[] DEFAULT '{}',
    next_stage_readiness FLOAT DEFAULT 0.5 CHECK (next_stage_readiness >= 0 AND next_stage_readiness <= 1),
    empowerment_metrics JSONB DEFAULT '{}',
    community_connections TEXT[] DEFAULT '{}',
    resource_access_history TEXT[] DEFAULT '{}',
    liberation_progress_indicators JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community intelligence analytics with anonymization
CREATE TABLE IF NOT EXISTS community_insights (
    id SERIAL PRIMARY KEY,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('pattern', 'trend', 'gap', 'opportunity')),
    domain VARCHAR(50) NOT NULL,
    geographic_area VARCHAR(100),
    demographic_context JSONB DEFAULT '{}',
    pattern_data JSONB NOT NULL,
    confidence_score FLOAT DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    community_impact_assessment JSONB DEFAULT '{}',
    resource_implications TEXT[] DEFAULT '{}',
    organizing_opportunities TEXT[] DEFAULT '{}',
    liberation_relevance INTEGER DEFAULT 50 CHECK (liberation_relevance >= 0 AND liberation_relevance <= 100),
    privacy_protection_level VARCHAR(20) DEFAULT 'high' CHECK (privacy_protection_level IN ('low', 'medium', 'high')),
    community_validation_status VARCHAR(20) DEFAULT 'pending' CHECK (community_validation_status IN ('pending', 'validated', 'disputed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social platform growth and viral tracking
CREATE TABLE IF NOT EXISTS social_growth_metrics (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'instagram', 'facebook', 'linkedin', 'tiktok')),
    content_type VARCHAR(50) NOT NULL,
    journey_stage VARCHAR(100),
    content_id VARCHAR(100),
    engagement_metrics JSONB DEFAULT '{}', -- likes, shares, comments, reach
    viral_coefficient FLOAT DEFAULT 0.0,
    community_impact_score INTEGER DEFAULT 0,
    cultural_authenticity_rating INTEGER DEFAULT 50 CHECK (cultural_authenticity_rating >= 0 AND cultural_authenticity_rating <= 100),
    liberation_message_alignment INTEGER DEFAULT 50 CHECK (liberation_message_alignment >= 0 AND liberation_message_alignment <= 100),
    referral_attributions TEXT[] DEFAULT '{}',
    network_effects_data JSONB DEFAULT '{}',
    content_performance_indicators JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community organizing projects and mobilization
CREATE TABLE IF NOT EXISTS organizing_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    project_type VARCHAR(50) NOT NULL CHECK (project_type IN ('housing', 'healthcare', 'safety', 'economic', 'education', 'policy')),
    journey_stage VARCHAR(100) NOT NULL,
    community_need_areas TEXT[] DEFAULT '{}',
    organizing_stage VARCHAR(50) DEFAULT 'awareness' CHECK (organizing_stage IN ('awareness', 'education', 'action', 'leadership', 'system_change')),
    collaboration_requirements JSONB DEFAULT '{}',
    resource_needs JSONB DEFAULT '{}',
    skills_needed TEXT[] DEFAULT '{}',
    community_impact_goals TEXT[] DEFAULT '{}',
    liberation_objectives TEXT[] DEFAULT '{}',
    democratic_validation_score INTEGER DEFAULT 0,
    community_support_level INTEGER DEFAULT 0,
    success_metrics JSONB DEFAULT '{}',
    coordinator_info JSONB DEFAULT '{}', -- Anonymous coordination data
    status VARCHAR(20) DEFAULT 'proposed' CHECK (status IN ('proposed', 'validated', 'active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-domain event tracking for coordination
CREATE TABLE IF NOT EXISTS cross_domain_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('PersonalAchievement', 'CommunityInsight', 'ProjectUpdate', 'SocialShare', 'ResourceRequest')),
    source_domain VARCHAR(50) NOT NULL,
    target_domains TEXT[] DEFAULT '{}',
    event_data JSONB NOT NULL,
    journey_context JSONB DEFAULT '{}',
    community_impact_data JSONB DEFAULT '{}',
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed')),
    liberation_relevance_score INTEGER DEFAULT 50,
    cultural_sensitivity_check BOOLEAN DEFAULT false,
    community_consent_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Resource allocation and community coordination
CREATE TABLE IF NOT EXISTS resource_coordination (
    id SERIAL PRIMARY KEY,
    resource_type VARCHAR(50) NOT NULL,
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'limited', 'unavailable', 'requested')),
    geographic_coverage TEXT[] DEFAULT '{}',
    journey_stage_relevance TEXT[] DEFAULT '{}',
    community_access_requirements JSONB DEFAULT '{}',
    cultural_competency_level INTEGER DEFAULT 50 CHECK (cultural_competency_level >= 0 AND cultural_competency_level <= 100),
    liberation_alignment_score INTEGER DEFAULT 50,
    community_validation JSONB DEFAULT '{}',
    contact_information JSONB DEFAULT '{}', -- Privacy-protected contact methods
    accessibility_features TEXT[] DEFAULT '{}',
    language_support TEXT[] DEFAULT '{}',
    cost_accessibility VARCHAR(20) DEFAULT 'free' CHECK (cost_accessibility IN ('free', 'sliding_scale', 'low_cost', 'standard')),
    community_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement and milestone tracking
CREATE TABLE IF NOT EXISTS achievement_milestones (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    journey_stage VARCHAR(100) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_description TEXT NOT NULL,
    empowerment_impact_score INTEGER DEFAULT 50 CHECK (empowerment_impact_score >= 0 AND empowerment_impact_score <= 100),
    community_sharing_triggered BOOLEAN DEFAULT false,
    liberation_progress_indicators JSONB DEFAULT '{}',
    peer_support_connections TEXT[] DEFAULT '{}',
    resource_utilization_data JSONB DEFAULT '{}',
    next_stage_preparation_status JSONB DEFAULT '{}',
    cultural_celebration_elements TEXT[] DEFAULT '{}',
    community_recognition JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_knowledge_content_embedding ON knowledge_content USING ivfflat (embedding_vector vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_content_domain_stage ON knowledge_content(domain, journey_stage);
CREATE INDEX IF NOT EXISTS idx_user_journeys_session ON user_journeys(session_id);
CREATE INDEX IF NOT EXISTS idx_user_journeys_domain_stage ON user_journeys(domain, current_stage);
CREATE INDEX IF NOT EXISTS idx_community_insights_type_domain ON community_insights(insight_type, domain);
CREATE INDEX IF NOT EXISTS idx_social_growth_platform_stage ON social_growth_metrics(platform, journey_stage);
CREATE INDEX IF NOT EXISTS idx_organizing_projects_type_stage ON organizing_projects(project_type, organizing_stage);
CREATE INDEX IF NOT EXISTS idx_cross_domain_events_type_status ON cross_domain_events(event_type, processing_status);
CREATE INDEX IF NOT EXISTS idx_resource_coordination_type_status ON resource_coordination(resource_type, availability_status);
CREATE INDEX IF NOT EXISTS idx_achievement_milestones_session_domain ON achievement_milestones(session_id, domain);

-- Row Level Security (RLS) policies for community data sovereignty
ALTER TABLE knowledge_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_growth_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_milestones ENABLE ROW LEVEL SECURITY;

-- Anonymous access for knowledge content (public liberation resources)
CREATE POLICY "Allow anonymous read access to knowledge content" ON knowledge_content
    FOR SELECT TO anon
    USING (true);

-- Anonymous journey tracking for privacy-protected analytics
CREATE POLICY "Allow anonymous journey tracking" ON user_journeys
    FOR INSERT TO anon
    WITH CHECK (true);

-- Community read access to validated insights
CREATE POLICY "Allow community read access to validated insights" ON community_insights
    FOR SELECT TO anon
    USING (community_validation_status = 'validated');

-- Public read access to organizing projects
CREATE POLICY "Allow public read access to organizing projects" ON organizing_projects
    FOR SELECT TO anon
    USING (status IN ('validated', 'active'));

-- Anonymous access to resource coordination
CREATE POLICY "Allow anonymous read access to resources" ON resource_coordination
    FOR SELECT TO anon
    USING (availability_status IN ('available', 'limited'));

-- Anonymous achievement sharing (optional, user-controlled)
CREATE POLICY "Allow anonymous achievement sharing" ON achievement_milestones
    FOR INSERT TO anon
    WITH CHECK (community_sharing_triggered = true);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_content_updated_at BEFORE UPDATE ON knowledge_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_journeys_updated_at BEFORE UPDATE ON user_journeys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_insights_updated_at BEFORE UPDATE ON community_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_growth_metrics_updated_at BEFORE UPDATE ON social_growth_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizing_projects_updated_at BEFORE UPDATE ON organizing_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_coordination_updated_at BEFORE UPDATE ON resource_coordination
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Community data sovereignty and validation functions
CREATE OR REPLACE FUNCTION validate_community_content(content_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Implement community-defined validation criteria
    -- Check for cultural authenticity, liberation alignment, accessibility
    RETURN true; -- Placeholder - implement community validation logic
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_liberation_impact_score(
    domain VARCHAR(50),
    stage VARCHAR(100),
    outcomes TEXT[],
    community_feedback JSONB
)
RETURNS INTEGER AS $$
DECLARE
    impact_score INTEGER := 50;
BEGIN
    -- Calculate impact based on liberation goals achievement
    -- Increase score for community empowerment outcomes
    IF array_length(outcomes, 1) > 0 THEN
        impact_score := impact_score + (array_length(outcomes, 1) * 10);
    END IF;
    
    -- Adjust based on community feedback
    IF community_feedback ? 'liberation_alignment' THEN
        impact_score := impact_score + ((community_feedback->>'liberation_alignment')::INTEGER - 50);
    END IF;
    
    -- Ensure score stays within bounds
    impact_score := GREATEST(0, LEAST(100, impact_score));
    
    RETURN impact_score;
END;
$$ LANGUAGE plpgsql;

-- Seed data for journey stages and initial knowledge content
INSERT INTO knowledge_content (title, content, domain, journey_stage, outcome_objectives, cultural_context, liberation_goals) VALUES
(
    'Crisis Support Resources for Black QTIPOC',
    'Comprehensive directory of culturally competent crisis support resources specifically serving Black queer, trans, and intersex people of color. Includes 24/7 hotlines, emergency housing, healthcare access, and peer support networks.',
    'core',
    'crisis',
    ARRAY['immediate_safety', 'emergency_resources', 'peer_connection'],
    'trauma_informed_care',
    ARRAY['safety', 'immediate_empowerment', 'crisis_navigation']
),
(
    'Community Health Pattern Recognition Guide',
    'Framework for identifying and analyzing health disparities and community wellness patterns affecting Black QTIPOC communities. Includes data collection methods, privacy protection strategies, and community-controlled research approaches.',
    'community',
    'community_pattern',
    ARRAY['pattern_analysis', 'community_research', 'health_advocacy'],
    'collective_intelligence',
    ARRAY['community_connection', 'trend_recognition', 'shared_analysis']
),
(
    'Housing Justice Organizing Toolkit',
    'Comprehensive guide for organizing around housing justice issues in Black QTIPOC communities. Includes tenant rights, eviction defense strategies, community land trust development, and coalition building approaches.',
    'organizing',
    'action',
    ARRAY['campaign_participation', 'housing_rights', 'collective_action'],
    'grassroots_organizing',
    ARRAY['campaign_participation', 'leadership_development', 'collective_action']
),
(
    'Social Media Strategy for Community Liberation',
    'Guide for using social media platforms to amplify Black QTIPOC voices and experiences while building authentic community connections. Focuses on cultural authenticity, viral mechanics, and platform growth strategies.',
    'social',
    'network_activation',
    ARRAY['network_growth', 'community_promotion', 'platform_expansion'],
    'community_network_building',
    ARRAY['network_growth', 'community_promotion', 'peer_recruitment']
);

COMMENT ON DATABASE postgres IS 'IVOR Community Liberation Platform - Journey-Aware Knowledge Architecture serving Black queer community empowerment and liberation goals';