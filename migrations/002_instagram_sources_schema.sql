-- Instagram Sources Schema for Grassroots Black LGBT Community Discovery
-- Addresses critical gap: smaller organizations without websites/RSS feeds

-- Instagram sources table for community-driven discovery
CREATE TABLE IF NOT EXISTS instagram_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle TEXT NOT NULL UNIQUE, -- e.g., @blackpridelondon
    organization_name TEXT NOT NULL,
    
    -- Community verification and trust
    verified_community_org BOOLEAN DEFAULT false,
    trust_level TEXT CHECK (trust_level IN ('high', 'medium', 'low')) DEFAULT 'low',
    verified_by TEXT, -- User ID of community member who verified
    verified_at TIMESTAMPTZ,
    
    -- Organization details
    location TEXT NOT NULL,
    focus_areas TEXT[] DEFAULT '{}', -- e.g., ['trans-rights', 'black-liberation']
    description TEXT,
    website_url TEXT,
    
    -- Community metadata
    added_by_community TEXT, -- User ID of community member who suggested
    community_notes TEXT,
    follower_count_estimate TEXT CHECK (follower_count_estimate IN ('small', 'medium', 'large')),
    
    -- Discovery and scraping
    last_scraped TIMESTAMPTZ,
    scrape_frequency_hours INTEGER DEFAULT 24,
    active BOOLEAN DEFAULT false, -- Requires community approval
    
    -- Performance tracking
    events_discovered_count INTEGER DEFAULT 0,
    avg_relevance_score DECIMAL(3,2) DEFAULT 0.0,
    community_engagement_score DECIMAL(3,2) DEFAULT 0.0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instagram discovery logs for transparency
CREATE TABLE IF NOT EXISTS instagram_discovery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discovery_run_id TEXT NOT NULL, -- Groups related discoveries
    instagram_handle TEXT NOT NULL,
    
    -- Discovery method
    discovery_method TEXT CHECK (discovery_method IN ('profile_scrape', 'hashtag_discovery', 'community_suggestion')) NOT NULL,
    hashtag_used TEXT, -- If discovered via hashtag
    
    -- Results
    posts_found INTEGER DEFAULT 0,
    events_identified INTEGER DEFAULT 0,
    events_stored INTEGER DEFAULT 0,
    
    -- Processing details
    processing_time_ms INTEGER,
    status TEXT CHECK (status IN ('success', 'partial_success', 'failed', 'rate_limited')) DEFAULT 'success',
    error_message TEXT,
    rate_limit_hit BOOLEAN DEFAULT false,
    
    -- Community liberation metrics
    avg_liberation_score DECIMAL(3,2),
    grassroots_indicators_found TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instagram post cache for avoiding duplicate processing
CREATE TABLE IF NOT EXISTS instagram_posts_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instagram_post_id TEXT NOT NULL UNIQUE,
    instagram_handle TEXT NOT NULL,
    
    -- Post content
    caption TEXT,
    hashtags TEXT[] DEFAULT '{}',
    mentions TEXT[] DEFAULT '{}',
    post_date TIMESTAMPTZ,
    media_type TEXT CHECK (media_type IN ('image', 'video', 'carousel')),
    media_urls TEXT[] DEFAULT '{}',
    
    -- Analysis results
    is_event_post BOOLEAN DEFAULT false,
    relevance_score DECIMAL(3,2) DEFAULT 0.0,
    liberation_keywords TEXT[] DEFAULT '{}',
    grassroots_indicators TEXT[] DEFAULT '{}',
    
    -- Processing status
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    converted_to_event BOOLEAN DEFAULT false,
    
    -- Community oversight
    needs_community_review BOOLEAN DEFAULT false,
    community_flagged BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community suggestions for new Instagram sources
CREATE TABLE IF NOT EXISTS instagram_source_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suggested_handle TEXT NOT NULL,
    suggested_organization_name TEXT NOT NULL,
    location TEXT NOT NULL,
    focus_areas TEXT[] DEFAULT '{}',
    
    -- Community member who suggested
    suggested_by TEXT NOT NULL, -- User ID
    suggestion_reason TEXT,
    community_vouches INTEGER DEFAULT 1, -- Number of community members who vouch
    
    -- Review status
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'needs_more_info')) DEFAULT 'pending',
    reviewed_by TEXT, -- User ID of reviewer
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    -- If approved, links to created source
    created_source_id UUID REFERENCES instagram_sources(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hashtag performance tracking for optimization
CREATE TABLE IF NOT EXISTS liberation_hashtags_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hashtag TEXT NOT NULL UNIQUE,
    
    -- Discovery effectiveness
    times_searched INTEGER DEFAULT 0,
    events_discovered INTEGER DEFAULT 0,
    avg_relevance_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Community liberation metrics
    black_lgbt_relevance DECIMAL(3,2) DEFAULT 0.0,
    grassroots_organization_rate DECIMAL(3,2) DEFAULT 0.0,
    community_engagement_rate DECIMAL(3,2) DEFAULT 0.0,
    
    -- Performance optimization
    last_searched TIMESTAMPTZ,
    search_frequency_optimal INTEGER DEFAULT 7, -- Days between searches
    
    -- Community oversight
    community_verified BOOLEAN DEFAULT false,
    added_by_community TEXT, -- User ID
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extend auto_discovered_content table with Instagram-specific fields
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS instagram_post_id TEXT;
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT '{}';
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS mentions TEXT[] DEFAULT '{}';
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS estimated_engagement INTEGER DEFAULT 0;
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS grassroots_indicators TEXT[] DEFAULT '{}';
ALTER TABLE auto_discovered_content ADD COLUMN IF NOT EXISTS community_size_estimate TEXT CHECK (community_size_estimate IN ('small', 'medium', 'large'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_sources_active ON instagram_sources(active);
CREATE INDEX IF NOT EXISTS idx_instagram_sources_verified ON instagram_sources(verified_community_org);
CREATE INDEX IF NOT EXISTS idx_instagram_sources_trust_level ON instagram_sources(trust_level);
CREATE INDEX IF NOT EXISTS idx_instagram_sources_location ON instagram_sources(location);
CREATE INDEX IF NOT EXISTS idx_instagram_sources_focus_areas ON instagram_sources USING GIN(focus_areas);

CREATE INDEX IF NOT EXISTS idx_instagram_discovery_logs_run ON instagram_discovery_logs(discovery_run_id);
CREATE INDEX IF NOT EXISTS idx_instagram_discovery_logs_created ON instagram_discovery_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_discovery_logs_handle ON instagram_discovery_logs(instagram_handle);

CREATE INDEX IF NOT EXISTS idx_instagram_posts_cache_handle ON instagram_posts_cache(instagram_handle);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_cache_date ON instagram_posts_cache(post_date DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_cache_processed ON instagram_posts_cache(processed);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_cache_is_event ON instagram_posts_cache(is_event_post);

CREATE INDEX IF NOT EXISTS idx_instagram_source_suggestions_status ON instagram_source_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_instagram_source_suggestions_suggested_by ON instagram_source_suggestions(suggested_by);

-- Row Level Security for community data sovereignty
ALTER TABLE instagram_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_discovery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_source_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE liberation_hashtags_performance ENABLE ROW LEVEL SECURITY;

-- Public read access for transparency (approved sources only)
CREATE POLICY "Public can view approved Instagram sources" ON instagram_sources
    FOR SELECT USING (verified_community_org = true AND active = true);

-- Authenticated users can suggest new sources
CREATE POLICY "Authenticated users can suggest Instagram sources" ON instagram_source_suggestions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Public read access for discovery logs (transparency)
CREATE POLICY "Public can view Instagram discovery logs" ON instagram_discovery_logs
    FOR SELECT USING (true);

-- Community members can review suggestions
CREATE POLICY "Community members can review suggestions" ON instagram_source_suggestions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Public read access for hashtag performance (optimization transparency)
CREATE POLICY "Public can view hashtag performance" ON liberation_hashtags_performance
    FOR SELECT USING (true);

-- Functions for automated Instagram discovery statistics
CREATE OR REPLACE FUNCTION update_instagram_source_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update discovery stats for each Instagram source
    UPDATE instagram_sources 
    SET 
        events_discovered_count = subquery.event_count,
        avg_relevance_score = subquery.avg_score,
        updated_at = NOW()
    FROM (
        SELECT 
            instagram_handle,
            COUNT(*) as event_count,
            AVG(relevance_score) as avg_score
        FROM auto_discovered_content 
        WHERE instagram_handle IS NOT NULL
        GROUP BY instagram_handle
    ) AS subquery
    WHERE handle = subquery.instagram_handle;
END;
$$;

-- Trigger to automatically update timestamps
CREATE TRIGGER update_instagram_sources_updated_at 
    BEFORE UPDATE ON instagram_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_posts_cache_updated_at 
    BEFORE UPDATE ON instagram_posts_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_source_suggestions_updated_at 
    BEFORE UPDATE ON instagram_source_suggestions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liberation_hashtags_performance_updated_at 
    BEFORE UPDATE ON liberation_hashtags_performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial liberation hashtags for discovery optimization
INSERT INTO liberation_hashtags_performance (hashtag, community_verified, black_lgbt_relevance, grassroots_organization_rate) VALUES
('#BlackPrideLondon', true, 0.95, 0.80),
('#BlackLGBTUK', true, 0.90, 0.75),
('#QTBIPOCEvents', true, 0.85, 0.85),
('#BlackTransLivesMatter', true, 0.95, 0.70),
('#BlackQueerJoy', true, 0.90, 0.80),
('#LGBTQBlackHistory', true, 0.85, 0.60),
('#QueerBlackLondon', true, 0.90, 0.85),
('#BlackGayMen', true, 0.85, 0.75),
('#TransBlackPower', true, 0.90, 0.80),
('#QTPOCLondon', true, 0.85, 0.90),
('#BlackLesbianVisibility', true, 0.85, 0.70),
('#AfroQueerUK', true, 0.80, 0.75),
('#BlackNonBinary', true, 0.85, 0.80),
('#QueerAfricanDiaspora', true, 0.80, 0.70),
('#BlackLGBTActivism', true, 0.90, 0.85),
('#GrassrootsLGBT', true, 0.75, 0.95),
('#CommunityOrganizing', true, 0.70, 0.90),
('#MutualAidLGBT', true, 0.80, 0.85),
('#BlackQueerHealing', true, 0.85, 0.80)
ON CONFLICT (hashtag) DO NOTHING;

-- Comments for community transparency
COMMENT ON TABLE instagram_sources IS 'Community-verified Instagram accounts of Black LGBT grassroots organizations';
COMMENT ON TABLE instagram_discovery_logs IS 'Transparent logging of Instagram content discovery for community audit';
COMMENT ON TABLE instagram_posts_cache IS 'Cache of processed Instagram posts to avoid duplicate work and respect rate limits';
COMMENT ON TABLE instagram_source_suggestions IS 'Community-driven suggestions for new grassroots Instagram accounts to monitor';
COMMENT ON TABLE liberation_hashtags_performance IS 'Performance tracking of liberation-focused hashtags for discovery optimization';

COMMENT ON COLUMN instagram_sources.trust_level IS 'Community-assessed trust level affecting auto-approval: high=auto-approve, medium=community review, low=manual review';
COMMENT ON COLUMN instagram_sources.verified_community_org IS 'Community verification that this account represents a legitimate Black LGBT organization';
COMMENT ON COLUMN instagram_posts_cache.grassroots_indicators IS 'Indicators suggesting grassroots organization (small org, mutual aid, community-focused, etc.)';
COMMENT ON COLUMN liberation_hashtags_performance.black_lgbt_relevance IS 'Score 0.0-1.0 indicating how relevant this hashtag is to Black LGBT liberation content';