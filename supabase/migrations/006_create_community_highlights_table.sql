-- Community Highlights System Tables
-- Events calendar → Community highlights implementation

-- Community Highlights Table
CREATE TABLE IF NOT EXISTS community_highlights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL, -- References events from calendar system
    highlight_type VARCHAR(20) NOT NULL CHECK (highlight_type IN ('achievement', 'milestone', 'participation', 'impact', 'celebration')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    story_text TEXT NOT NULL, -- Rich story content
    impact_summary TEXT NOT NULL,
    participant_quotes TEXT[] DEFAULT ARRAY[]::TEXT[],
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    geographic_reach TEXT[] DEFAULT ARRAY[]::TEXT[], -- Locations impacted
    community_engagement_score NUMERIC(4,1) NOT NULL CHECK (community_engagement_score >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    featured_until TIMESTAMP WITH TIME ZONE, -- When to stop featuring
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'featured', 'archived')),
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Indexes for performance
    INDEX (status, community_engagement_score DESC),
    INDEX (featured_until DESC),
    INDEX (created_at DESC),
    INDEX (highlight_type, status)
);

-- Community Showcase Metrics Table (daily aggregation)
CREATE TABLE IF NOT EXISTS community_showcase_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    events_analyzed INTEGER DEFAULT 0,
    highlights_generated INTEGER DEFAULT 0,
    total_community_reach INTEGER DEFAULT 0, -- Total participants across all highlights
    geographic_coverage_count INTEGER DEFAULT 0, -- Number of unique locations
    avg_engagement_score NUMERIC(4,1),
    highlight_type_distribution JSONB DEFAULT '{}'::jsonb, -- Count by type
    category_distribution JSONB DEFAULT '{}'::jsonb, -- Count by event category
    impact_distribution JSONB DEFAULT '{}'::jsonb, -- Count by impact level
    featured_highlights_count INTEGER DEFAULT 0,
    archived_highlights_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- One record per date
    UNIQUE(date)
);

-- Event Highlight Mapping (track which events have been processed)
CREATE TABLE IF NOT EXISTS event_highlight_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL, -- From events calendar
    highlight_id UUID REFERENCES community_highlights(id) ON DELETE CASCADE,
    processing_date DATE NOT NULL DEFAULT CURRENT_DATE,
    highlight_score NUMERIC(4,1) NOT NULL,
    processing_reason TEXT, -- Why this event was selected for highlighting
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Prevent duplicate processing of same event
    UNIQUE(event_id),
    INDEX (event_id),
    INDEX (processing_date DESC),
    INDEX (highlight_score DESC)
);

-- Community Feedback on Highlights
CREATE TABLE IF NOT EXISTS highlight_community_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    highlight_id UUID NOT NULL REFERENCES community_highlights(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Will be proper user reference when auth is implemented
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('inspiring', 'accurate', 'representative', 'helpful', 'needs_improvement')),
    feedback_text TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One feedback per user per highlight
    UNIQUE(highlight_id, user_id),
    INDEX (highlight_id),
    INDEX (feedback_type, rating)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_highlights_featured_active ON community_highlights(status, featured_until DESC) WHERE status = 'featured' AND featured_until > CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_highlights_geographic ON community_highlights USING GIN(geographic_reach) WHERE status = 'featured';
CREATE INDEX IF NOT EXISTS idx_highlights_engagement_type ON community_highlights(highlight_type, community_engagement_score DESC) WHERE status = 'featured';
CREATE INDEX IF NOT EXISTS idx_showcase_metrics_date ON community_showcase_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_event_mapping_processing ON event_highlight_mapping(processing_date DESC, highlight_score DESC);
CREATE INDEX IF NOT EXISTS idx_highlight_feedback_rating ON highlight_community_feedback(highlight_id, rating DESC);

-- Functions for showcase management

-- Function to update daily showcase metrics
CREATE OR REPLACE FUNCTION update_showcase_metrics()
RETURNS VOID AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    events_analyzed INTEGER;
    highlights_generated INTEGER;
    total_reach INTEGER;
    geographic_count INTEGER;
    avg_score NUMERIC(4,1);
    type_dist JSONB;
    category_dist JSONB;
    impact_dist JSONB;
    featured_count INTEGER;
    archived_count INTEGER;
BEGIN
    -- Get today's metrics
    SELECT 
        COUNT(DISTINCT ehm.event_id),
        COUNT(ch.*),
        COALESCE(SUM((ch.metadata->>'participants_count')::INTEGER), 0),
        COUNT(DISTINCT unnest_val) FROM (SELECT unnest(ch.geographic_reach) as unnest_val FROM community_highlights ch WHERE ch.created_at::date = current_date) subq
    INTO events_analyzed, highlights_generated, total_reach, geographic_count
    FROM community_highlights ch
    LEFT JOIN event_highlight_mapping ehm ON ch.id = ehm.highlight_id
    WHERE ch.created_at::date = current_date;
    
    -- Calculate average engagement score
    SELECT COALESCE(AVG(community_engagement_score), 0)
    INTO avg_score
    FROM community_highlights
    WHERE created_at::date = current_date;
    
    -- Get highlight type distribution
    WITH type_counts AS (
        SELECT highlight_type, COUNT(*) as count
        FROM community_highlights
        WHERE created_at::date = current_date
        GROUP BY highlight_type
    )
    SELECT COALESCE(jsonb_object_agg(highlight_type, count), '{}'::jsonb)
    INTO type_dist
    FROM type_counts;
    
    -- Get category distribution
    WITH category_counts AS (
        SELECT 
            COALESCE((metadata->>'event_category'), 'Unknown') as category,
            COUNT(*) as count
        FROM community_highlights
        WHERE created_at::date = current_date
        GROUP BY COALESCE((metadata->>'event_category'), 'Unknown')
    )
    SELECT COALESCE(jsonb_object_agg(category, count), '{}'::jsonb)
    INTO category_dist
    FROM category_counts;
    
    -- Get impact distribution
    WITH impact_counts AS (
        SELECT 
            COALESCE((metadata->>'impact_level'), 'local') as impact_level,
            COUNT(*) as count
        FROM community_highlights
        WHERE created_at::date = current_date
        GROUP BY COALESCE((metadata->>'impact_level'), 'local')
    )
    SELECT COALESCE(jsonb_object_agg(impact_level, count), '{}'::jsonb)
    INTO impact_dist
    FROM impact_counts;
    
    -- Count featured and archived highlights
    SELECT 
        COUNT(*) FILTER (WHERE status = 'featured'),
        COUNT(*) FILTER (WHERE status = 'archived')
    INTO featured_count, archived_count
    FROM community_highlights
    WHERE created_at::date = current_date;
    
    -- Insert or update metrics
    INSERT INTO community_showcase_metrics (
        date, events_analyzed, highlights_generated, total_community_reach,
        geographic_coverage_count, avg_engagement_score, highlight_type_distribution,
        category_distribution, impact_distribution, featured_highlights_count, archived_highlights_count
    ) VALUES (
        current_date, events_analyzed, highlights_generated, total_reach,
        geographic_count, avg_score, type_dist, category_dist, impact_dist,
        featured_count, archived_count
    )
    ON CONFLICT (date) DO UPDATE SET
        events_analyzed = EXCLUDED.events_analyzed,
        highlights_generated = EXCLUDED.highlights_generated,
        total_community_reach = EXCLUDED.total_community_reach,
        geographic_coverage_count = EXCLUDED.geographic_coverage_count,
        avg_engagement_score = EXCLUDED.avg_engagement_score,
        highlight_type_distribution = EXCLUDED.highlight_type_distribution,
        category_distribution = EXCLUDED.category_distribution,
        impact_distribution = EXCLUDED.impact_distribution,
        featured_highlights_count = EXCLUDED.featured_highlights_count,
        archived_highlights_count = EXCLUDED.archived_highlights_count;
END;
$$ LANGUAGE plpgsql;

-- Function to track event-to-highlight mapping
CREATE OR REPLACE FUNCTION track_event_highlight_mapping(
    event_id TEXT,
    highlight_id UUID,
    highlight_score NUMERIC,
    processing_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO event_highlight_mapping (event_id, highlight_id, highlight_score, processing_reason)
    VALUES (event_id, highlight_id, highlight_score, processing_reason)
    ON CONFLICT (event_id) DO UPDATE SET
        highlight_id = EXCLUDED.highlight_id,
        highlight_score = EXCLUDED.highlight_score,
        processing_reason = EXCLUDED.processing_reason,
        processing_date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to get community impact summary
CREATE OR REPLACE FUNCTION get_community_impact_summary(days INTEGER DEFAULT 30)
RETURNS TABLE(
    total_highlights INTEGER,
    unique_locations INTEGER,
    avg_engagement_score NUMERIC,
    total_community_reach INTEGER,
    top_highlight_types TEXT[],
    geographic_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH highlights_data AS (
        SELECT 
            ch.*,
            unnest(ch.geographic_reach) as location
        FROM community_highlights ch
        WHERE ch.created_at >= CURRENT_DATE - INTERVAL '1 day' * days
        AND ch.status = 'featured'
    ),
    location_stats AS (
        SELECT 
            location,
            COUNT(*) as highlight_count,
            AVG(community_engagement_score) as avg_score
        FROM highlights_data
        GROUP BY location
    ),
    type_stats AS (
        SELECT 
            highlight_type,
            COUNT(*) as count
        FROM highlights_data
        GROUP BY highlight_type
        ORDER BY count DESC
        LIMIT 5
    )
    SELECT 
        (SELECT COUNT(DISTINCT ch.id) FROM community_highlights ch WHERE ch.created_at >= CURRENT_DATE - INTERVAL '1 day' * days AND ch.status = 'featured')::INTEGER,
        (SELECT COUNT(DISTINCT location) FROM highlights_data)::INTEGER,
        (SELECT AVG(community_engagement_score) FROM highlights_data),
        (SELECT COALESCE(SUM((metadata->>'participants_count')::INTEGER), 0) FROM highlights_data)::INTEGER,
        (SELECT array_agg(highlight_type) FROM type_stats),
        (SELECT jsonb_object_agg(location, jsonb_build_object('highlights', highlight_count, 'avg_engagement', avg_score)) FROM location_stats);
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

-- Sample data for testing
INSERT INTO community_highlights (
    event_id, highlight_type, title, description, story_text, impact_summary,
    participant_quotes, geographic_reach, community_engagement_score, status, featured_until, metadata
) VALUES 
(
    'event-housing-victory',
    'achievement',
    '🏆 Community Victory: Housing Cooperative Success in Manchester',
    'Celebrating the approval of our community housing cooperative application in Manchester',
    '🏆 **Community Victory**: Community Housing Victory Celebration

Celebrating the approval of our community housing cooperative application in Manchester

After persistent community organizing, this local campaign has achieved real change that will benefit Black queer communities across Manchester. With 45 community members involved, this victory shows the power of collective action.

💪 **What This Means**: Real change happens when we organize together. This success creates a template for similar campaigns across the UK.',
    'Direct impact on Black queer communities in Manchester. Building community power and collective action capacity. Directly involved 45 community members.',
    ARRAY['This victory shows what''s possible when we organize together for our communities.', 'After months of hard work, seeing real change happen feels incredible.', 'This is just the beginning - we''re building power for bigger changes to come.'],
    ARRAY['Manchester'],
    4.8,
    'featured',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    '{
        "event_category": "Organizing",
        "story_angle": "Community organizing victory creates lasting change",
        "auto_generated": true,
        "achievement_type": "housing_success",
        "campaign_duration": "8 months",
        "participants_count": 45,
        "impact_level": "local"
    }'
),
(
    'event-healthcare-campaign',
    'achievement',
    '🏆 Community Victory: NHS Trans Healthcare Campaign Success',
    'Campaign success: Local clinic extends hours and improves trans healthcare access',
    '🏆 **Community Victory**: NHS Trans Healthcare Organizing Victory

Campaign success: Local clinic extends hours and improves trans healthcare access

After persistent community organizing, this regional campaign has achieved real change that will benefit Black queer communities across Leeds. With 23 community members involved, this victory shows the power of collective action.

💪 **What This Means**: Real change happens when we organize together. This success creates a template for similar campaigns across the UK.',
    'Regional influence across multiple communities in Leeds area. Improving health access and wellbeing for our communities. Directly involved 23 community members.',
    ARRAY['This victory shows what''s possible when we organize together for our communities.', 'After months of hard work, seeing real change happen feels incredible.', 'This is just the beginning - we''re building power for bigger changes to come.'],
    ARRAY['Leeds', 'Yorkshire'],
    4.9,
    'featured',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    '{
        "event_category": "Health & Wellness",
        "story_angle": "Community organizing victory creates lasting change",
        "auto_generated": true,
        "campaign_victory": true,
        "healthcare_improvement": "extended_hours",
        "participants_count": 23,
        "impact_level": "regional"
    }'
),
(
    'event-pride-planning',
    'milestone',
    '🎯 Planning Power: Black Pride Birmingham 2025 Planning Meeting',
    'Community planning session for Birmingham Black Pride celebration',
    '🎯 **Community Milestone**: Black Pride Birmingham 2025 Planning Meeting

Community planning session for Birmingham Black Pride celebration

This important community gathering brought together 32 members from across Birmingham to plan and organize for our collective liberation. These planning moments are where community power is built.

🌟 **Building Together**: Every planning meeting, every conversation, every moment we spend building community is an act of resistance and love.',
    'Regional influence across multiple communities in Birmingham area. Celebrating our culture and creating spaces for joy and connection. Directly involved 32 community members.',
    ARRAY['These planning moments are where community power is built.', 'Coming together like this reminds me why organizing work matters so much.', 'Every voice in the room makes our work stronger and more connected to community needs.'],
    ARRAY['Birmingham'],
    4.2,
    'featured',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    '{
        "event_category": "Culture & Arts",
        "story_angle": "Community comes together to plan celebration of joy and resistance",
        "auto_generated": true,
        "event_planning": true,
        "volunteer_recruitment": "successful",
        "participants_count": 32,
        "impact_level": "regional"
    }'
);

-- Sample event-highlight mapping
INSERT INTO event_highlight_mapping (event_id, highlight_id, highlight_score, processing_reason) VALUES
('event-housing-victory', (SELECT id FROM community_highlights WHERE event_id = 'event-housing-victory' LIMIT 1), 4.8, 'High community impact achievement with significant organizing victory'),
('event-healthcare-campaign', (SELECT id FROM community_highlights WHERE event_id = 'event-healthcare-campaign' LIMIT 1), 4.9, 'Healthcare access improvement through community organizing'),
('event-pride-planning', (SELECT id FROM community_highlights WHERE event_id = 'event-pride-planning' LIMIT 1), 4.2, 'Important community milestone in cultural celebration planning');

-- Sample showcase metrics
INSERT INTO community_showcase_metrics (
    date, events_analyzed, highlights_generated, total_community_reach, geographic_coverage_count,
    avg_engagement_score, highlight_type_distribution, category_distribution, impact_distribution,
    featured_highlights_count, archived_highlights_count
) VALUES (
    CURRENT_DATE, 5, 3, 100, 3, 4.63,
    '{"achievement": 2, "milestone": 1}',
    '{"Organizing": 1, "Health & Wellness": 1, "Culture & Arts": 1}',
    '{"local": 1, "regional": 2}',
    3, 0
);

-- Row Level Security (RLS) Policies
ALTER TABLE community_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_showcase_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_highlight_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlight_community_feedback ENABLE ROW LEVEL SECURITY;

-- Public read access for community transparency
CREATE POLICY "Public read access for community highlights" ON community_highlights
    FOR SELECT USING (status = 'featured');
CREATE POLICY "Public read access for showcase metrics" ON community_showcase_metrics
    FOR SELECT USING (true);
CREATE POLICY "Public read access for event mapping" ON event_highlight_mapping
    FOR SELECT USING (true);

-- Allow community feedback
CREATE POLICY "Allow community highlight feedback" ON highlight_community_feedback
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read highlight feedback" ON highlight_community_feedback
    FOR SELECT USING (true);

-- Service role full access for processing
CREATE POLICY "Service role full access highlights" ON community_highlights FOR ALL USING (true);
CREATE POLICY "Service role full access showcase_metrics" ON community_showcase_metrics FOR ALL USING (true);
CREATE POLICY "Service role full access event_mapping" ON event_highlight_mapping FOR ALL USING (true);
CREATE POLICY "Service role full access highlight_feedback" ON highlight_community_feedback FOR ALL USING (true);

-- Grant permissions for the service role
GRANT ALL ON community_highlights TO service_role;
GRANT ALL ON community_showcase_metrics TO service_role;
GRANT ALL ON event_highlight_mapping TO service_role;
GRANT ALL ON highlight_community_feedback TO service_role;