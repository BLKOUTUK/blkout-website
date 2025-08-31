-- Story Curation System Tables
-- Community governance → Featured stories implementation

-- Curation Rules Table
CREATE TABLE IF NOT EXISTS curation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    active BOOLEAN NOT NULL DEFAULT true,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for performance
    INDEX (active, priority DESC),
    INDEX (created_at DESC)
);

-- Curation Sessions Table
CREATE TABLE IF NOT EXISTS curation_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_name TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
    stories_reviewed INTEGER DEFAULT 0,
    stories_featured INTEGER DEFAULT 0,
    applied_rules TEXT[] DEFAULT ARRAY[]::TEXT[],
    success_rate NUMERIC(5,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Index for monitoring
    INDEX (status, started_at DESC),
    INDEX (completed_at DESC)
);

-- Curation Results Table
CREATE TABLE IF NOT EXISTS curation_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES curation_sessions(id) ON DELETE CASCADE,
    story_id TEXT NOT NULL, -- References articles table
    curation_score NUMERIC(4,1) NOT NULL CHECK (curation_score >= 0),
    applied_rules TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured_reason TEXT NOT NULL,
    community_votes INTEGER DEFAULT 0,
    validation_score NUMERIC(3,1) DEFAULT 0,
    geographic_location TEXT,
    impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('individual', 'local', 'national')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent duplicate curation of same story in session
    UNIQUE(session_id, story_id),
    -- Indexes
    INDEX (session_id, created_at DESC),
    INDEX (story_id),
    INDEX (curation_score DESC),
    INDEX (impact_level, geographic_location)
);

-- Curation Metrics Table (daily aggregation)
CREATE TABLE IF NOT EXISTS curation_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    sessions_run INTEGER DEFAULT 0,
    stories_reviewed INTEGER DEFAULT 0,
    stories_featured INTEGER DEFAULT 0,
    avg_curation_score NUMERIC(4,1),
    geographic_diversity_score INTEGER, -- 0-100
    category_distribution JSONB DEFAULT '{}'::jsonb,
    impact_distribution JSONB DEFAULT '{}'::jsonb,
    top_applied_rules TEXT[] DEFAULT ARRAY[]::TEXT[],
    community_satisfaction_rate NUMERIC(5,2), -- From feedback
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- One record per date
    UNIQUE(date)
);

-- Featured Stories History (tracking what was featured when)
CREATE TABLE IF NOT EXISTS featured_stories_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id TEXT NOT NULL,
    curation_session_id UUID REFERENCES curation_sessions(id) ON DELETE SET NULL,
    featured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unfeatured_at TIMESTAMP WITH TIME ZONE,
    featured_duration_hours INTEGER, -- Calculated when unfeatured
    curation_score NUMERIC(4,1),
    featured_reason TEXT,
    view_count INTEGER DEFAULT 0,
    engagement_score NUMERIC(5,2), -- Likes, shares, comments
    community_rating NUMERIC(3,1), -- Average community feedback rating
    
    -- Index for tracking
    INDEX (story_id, featured_at DESC),
    INDEX (featured_at DESC),
    INDEX (curation_score DESC)
);

-- Rule Performance Tracking
CREATE TABLE IF NOT EXISTS rule_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID NOT NULL REFERENCES curation_rules(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES curation_sessions(id) ON DELETE CASCADE,
    applications_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0, -- Stories that got featured after this rule applied
    avg_score_contribution NUMERIC(4,1),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Track rule performance per session
    UNIQUE(rule_id, session_id),
    INDEX (rule_id, date DESC),
    INDEX (session_id)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_curation_rules_active ON curation_rules(active, priority DESC) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_curation_sessions_status ON curation_sessions(status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_curation_results_score ON curation_results(curation_score DESC, impact_level);
CREATE INDEX IF NOT EXISTS idx_curation_results_location ON curation_results(geographic_location, created_at DESC) WHERE geographic_location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_featured_history_active ON featured_stories_history(story_id, featured_at DESC) WHERE unfeatured_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_curation_metrics_date ON curation_metrics(date DESC);

-- Functions for curation automation

-- Function to update daily metrics
CREATE OR REPLACE FUNCTION update_curation_metrics()
RETURNS VOID AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    sessions_count INTEGER;
    stories_reviewed INTEGER;
    stories_featured INTEGER;
    avg_score NUMERIC(4,1);
    diversity_score INTEGER;
    category_dist JSONB;
    impact_dist JSONB;
    top_rules TEXT[];
BEGIN
    -- Get today's session metrics
    SELECT 
        COUNT(*),
        COALESCE(SUM(stories_reviewed), 0),
        COALESCE(SUM(stories_featured), 0)
    INTO sessions_count, stories_reviewed, stories_featured
    FROM curation_sessions 
    WHERE started_at::date = current_date;
    
    -- Calculate average curation score
    SELECT COALESCE(AVG(curation_score), 0)
    INTO avg_score
    FROM curation_results cr
    JOIN curation_sessions cs ON cr.session_id = cs.id
    WHERE cs.started_at::date = current_date;
    
    -- Calculate geographic diversity score (unique locations / 6 major regions * 100)
    SELECT COALESCE(COUNT(DISTINCT geographic_location) * 100 / 6, 0)
    INTO diversity_score
    FROM curation_results cr
    JOIN curation_sessions cs ON cr.session_id = cs.id
    WHERE cs.started_at::date = current_date AND cr.geographic_location IS NOT NULL;
    
    -- Get category distribution
    WITH category_counts AS (
        SELECT 
            COALESCE((cr.metadata->>'category'), 'Unknown') as category,
            COUNT(*) as count
        FROM curation_results cr
        JOIN curation_sessions cs ON cr.session_id = cs.id
        WHERE cs.started_at::date = current_date
        GROUP BY COALESCE((cr.metadata->>'category'), 'Unknown')
    )
    SELECT COALESCE(jsonb_object_agg(category, count), '{}'::jsonb)
    INTO category_dist
    FROM category_counts;
    
    -- Get impact distribution
    WITH impact_counts AS (
        SELECT impact_level, COUNT(*) as count
        FROM curation_results cr
        JOIN curation_sessions cs ON cr.session_id = cs.id
        WHERE cs.started_at::date = current_date
        GROUP BY impact_level
    )
    SELECT COALESCE(jsonb_object_agg(impact_level, count), '{}'::jsonb)
    INTO impact_dist
    FROM impact_counts;
    
    -- Get top applied rules
    WITH rule_counts AS (
        SELECT UNNEST(applied_rules) as rule_name, COUNT(*) as count
        FROM curation_results cr
        JOIN curation_sessions cs ON cr.session_id = cs.id
        WHERE cs.started_at::date = current_date
        GROUP BY UNNEST(applied_rules)
        ORDER BY count DESC
        LIMIT 5
    )
    SELECT COALESCE(array_agg(rule_name), ARRAY[]::TEXT[])
    INTO top_rules
    FROM rule_counts;
    
    -- Insert or update metrics
    INSERT INTO curation_metrics (
        date, sessions_run, stories_reviewed, stories_featured, avg_curation_score,
        geographic_diversity_score, category_distribution, impact_distribution, top_applied_rules
    ) VALUES (
        current_date, sessions_count, stories_reviewed, stories_featured, avg_score,
        diversity_score, category_dist, impact_dist, top_rules
    )
    ON CONFLICT (date) DO UPDATE SET
        sessions_run = EXCLUDED.sessions_run,
        stories_reviewed = EXCLUDED.stories_reviewed,
        stories_featured = EXCLUDED.stories_featured,
        avg_curation_score = EXCLUDED.avg_curation_score,
        geographic_diversity_score = EXCLUDED.geographic_diversity_score,
        category_distribution = EXCLUDED.category_distribution,
        impact_distribution = EXCLUDED.impact_distribution,
        top_applied_rules = EXCLUDED.top_applied_rules;
END;
$$ LANGUAGE plpgsql;

-- Function to track featured story lifecycle
CREATE OR REPLACE FUNCTION track_featured_story(story_id TEXT, curation_session_id UUID, curation_score NUMERIC, featured_reason TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO featured_stories_history (
        story_id, curation_session_id, curation_score, featured_reason
    ) VALUES (
        story_id, curation_session_id, curation_score, featured_reason
    );
END;
$$ LANGUAGE plpgsql;

-- Function to unfeature story
CREATE OR REPLACE FUNCTION unfeature_story(story_id TEXT)
RETURNS VOID AS $$
DECLARE
    featured_record RECORD;
BEGIN
    -- Get the current featured record
    SELECT * INTO featured_record
    FROM featured_stories_history 
    WHERE story_id = unfeature_story.story_id AND unfeatured_at IS NULL
    ORDER BY featured_at DESC 
    LIMIT 1;
    
    IF FOUND THEN
        -- Calculate duration and update record
        UPDATE featured_stories_history 
        SET 
            unfeatured_at = CURRENT_TIMESTAMP,
            featured_duration_hours = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - featured_record.featured_at)) / 3600
        WHERE id = featured_record.id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_curation_rules_updated_at
    BEFORE UPDATE ON curation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample curation rules
INSERT INTO curation_rules (name, description, criteria, priority, active, created_by) VALUES
('Community Consensus Priority', 'Stories with strong community validation get priority featuring', 
 '{"min_community_votes": 5, "min_validation_score": 4.0}', 10, true, 'system'),

('National Impact Stories', 'Stories with national significance get automatic featuring',
 '{"required_impact_level": "national", "min_validation_score": 3.5}', 9, true, 'system'),

('Organizing Wins Priority', 'Community organizing victories get priority placement',
 '{"required_categories": ["Organizing", "Community News"], "min_community_votes": 3, "min_validation_score": 3.8}', 8, true, 'system'),

('Geographic Diversity', 'Ensure featured stories represent different UK regions',
 '{"geographic_diversity": true, "min_validation_score": 3.5}', 7, true, 'system'),

('Recent Community Wins', 'Recent community achievements get boosted visibility',
 '{"required_categories": ["Community News"], "recency_weight": 0.8, "min_validation_score": 3.7}', 6, true, 'system'),

('Health & Wellness Focus', 'Health-related community stories get special attention',
 '{"required_categories": ["Health & Wellness"], "min_validation_score": 3.6}', 5, true, 'system'),

('Cultural Celebrations', 'Community cultural events and celebrations',
 '{"required_categories": ["Culture & Arts"], "min_validation_score": 3.4}', 4, true, 'system');

-- Sample curation session
INSERT INTO curation_sessions (session_name, completed_at, status, stories_reviewed, stories_featured, applied_rules, success_rate, metadata) VALUES
('Initial Community Curation', CURRENT_TIMESTAMP, 'completed', 12, 6, 
 ARRAY['Community Consensus Priority', 'Geographic Diversity', 'Organizing Wins Priority'], 50.0,
 '{"geographic_distribution": {"London": 2, "Manchester": 2, "Birmingham": 2}, "category_distribution": {"Community News": 3, "Organizing": 2, "Culture & Arts": 1}, "impact_distribution": {"local": 4, "national": 2}}');

-- Sample curation results
WITH session_id AS (SELECT id FROM curation_sessions WHERE session_name = 'Initial Community Curation' LIMIT 1)
INSERT INTO curation_results (session_id, story_id, curation_score, applied_rules, featured_reason, community_votes, validation_score, geographic_location, impact_level) VALUES
((SELECT id FROM session_id), 'story-housing-manchester', 8.5, ARRAY['Community Consensus Priority', 'Geographic Diversity'], 'Strong community validation and geographic diversity', 7, 4.2, 'Manchester', 'local'),
((SELECT id FROM session_id), 'story-healthcare-campaign', 9.2, ARRAY['National Impact Stories', 'Organizing Wins Priority'], 'National impact organizing victory', 12, 4.8, 'London', 'national'),
((SELECT id FROM session_id), 'story-pride-birmingham', 7.1, ARRAY['Geographic Diversity', 'Cultural Celebrations'], 'Geographic diversity and cultural celebration', 4, 3.8, 'Birmingham', 'local'),
((SELECT id FROM session_id), 'story-mutual-aid-leeds', 6.9, ARRAY['Recent Community Wins', 'Community Consensus Priority'], 'Recent community organizing success', 5, 3.9, 'Leeds', 'local');

-- Sample featured stories history
INSERT INTO featured_stories_history (story_id, curation_score, featured_reason, view_count, engagement_score, community_rating) VALUES
('story-housing-manchester', 8.5, 'Strong community validation and geographic diversity', 245, 4.2, 4.1),
('story-healthcare-campaign', 9.2, 'National impact organizing victory', 512, 4.7, 4.6),
('story-pride-birmingham', 7.1, 'Geographic diversity and cultural celebration', 189, 3.8, 4.0);

-- Sample daily metrics
INSERT INTO curation_metrics (
    date, sessions_run, stories_reviewed, stories_featured, avg_curation_score, 
    geographic_diversity_score, category_distribution, impact_distribution, top_applied_rules
) VALUES (
    CURRENT_DATE - INTERVAL '1 day', 1, 12, 6, 7.95, 50,
    '{"Community News": 3, "Organizing": 2, "Culture & Arts": 1}',
    '{"local": 4, "national": 2}',
    ARRAY['Community Consensus Priority', 'Geographic Diversity', 'Organizing Wins Priority']
);

-- Row Level Security (RLS) Policies
ALTER TABLE curation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_stories_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_performance ENABLE ROW LEVEL SECURITY;

-- Public read access for transparency
CREATE POLICY "Public read access for curation rules" ON curation_rules
    FOR SELECT USING (true);
CREATE POLICY "Public read access for curation metrics" ON curation_metrics
    FOR SELECT USING (true);
CREATE POLICY "Public read access for featured history" ON featured_stories_history
    FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role full access curation_rules" ON curation_rules FOR ALL USING (true);
CREATE POLICY "Service role full access curation_sessions" ON curation_sessions FOR ALL USING (true);
CREATE POLICY "Service role full access curation_results" ON curation_results FOR ALL USING (true);
CREATE POLICY "Service role full access curation_metrics" ON curation_metrics FOR ALL USING (true);
CREATE POLICY "Service role full access featured_history" ON featured_stories_history FOR ALL USING (true);
CREATE POLICY "Service role full access rule_performance" ON rule_performance FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON curation_rules TO service_role;
GRANT ALL ON curation_sessions TO service_role;
GRANT ALL ON curation_results TO service_role;
GRANT ALL ON curation_metrics TO service_role;
GRANT ALL ON featured_stories_history TO service_role;
GRANT ALL ON rule_performance TO service_role;