-- Auto-Discovered Content Schema for Community Liberation Platform
-- Supports RSS/webscraping automation and community moderation
-- Designed for Community Benefit Society governance

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-discovered content table for RSS/scraping automation
CREATE TABLE IF NOT EXISTS auto_discovered_content (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    url TEXT NOT NULL,
    source TEXT NOT NULL, -- e.g., 'Stonewall UK', 'Black Pride UK', 'blkout_uk'
    source_url TEXT NOT NULL,
    published_date TIMESTAMPTZ,
    content_type TEXT CHECK (content_type IN ('event', 'news', 'article', 'announcement')) DEFAULT 'article',
    
    -- Community liberation scoring and categorization
    relevance_score DECIMAL(3,2) DEFAULT 0.0 CHECK (relevance_score >= 0.0 AND relevance_score <= 1.0),
    auto_categories TEXT[] DEFAULT '{}',
    community_tags TEXT[] DEFAULT '{}',
    liberation_focus TEXT[] DEFAULT '{}', -- e.g., ['racial-justice', 'queer-liberation', 'trans-rights']
    
    -- Community moderation workflow
    status TEXT CHECK (status IN ('auto_discovered', 'community_approved', 'rejected', 'community_voting')) DEFAULT 'auto_discovered',
    needs_community_approval BOOLEAN DEFAULT true,
    approved_by TEXT, -- User ID of community member who approved
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    community_notes TEXT,
    
    -- Accessibility and inclusion
    target_audience TEXT,
    accessibility_notes TEXT,
    
    -- AI processing and community engagement
    ai_summary TEXT,
    community_relevance TEXT,
    suggested_actions TEXT[] DEFAULT '{}',
    economic_justice_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Tracking and audit
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    voting_scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community organisation sources for trusted RSS feeds
CREATE TABLE IF NOT EXISTS community_org_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    rss_feed TEXT,
    scrape_pattern JSONB,
    trust_level TEXT CHECK (trust_level IN ('high', 'medium', 'low')) DEFAULT 'medium',
    community_verified BOOLEAN DEFAULT false,
    verified_by TEXT, -- User ID of community member who verified
    verified_at TIMESTAMPTZ,
    last_scraped TIMESTAMPTZ,
    scrape_frequency_hours INTEGER DEFAULT 24,
    active BOOLEAN DEFAULT true,
    
    -- Community oversight
    added_by TEXT, -- User ID of community member who added source
    liberation_focus TEXT[] DEFAULT '{}',
    community_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content discovery logs for transparency and debugging
CREATE TABLE IF NOT EXISTS content_discovery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discovery_run_id TEXT NOT NULL, -- Groups related discoveries
    source_type TEXT CHECK (source_type IN ('rss', 'webscrape', 'api')) NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    
    -- Discovery results
    items_found INTEGER DEFAULT 0,
    items_relevant INTEGER DEFAULT 0,
    items_stored INTEGER DEFAULT 0,
    
    -- Processing details
    processing_time_ms INTEGER,
    status TEXT CHECK (status IN ('success', 'partial_success', 'failed')) DEFAULT 'success',
    error_message TEXT,
    
    -- Community transparency
    liberation_relevance_avg DECIMAL(3,2),
    community_impact_score DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community moderation statistics for democratic oversight
CREATE TABLE IF NOT EXISTS content_moderation_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    
    -- Discovery metrics
    content_discovered INTEGER DEFAULT 0,
    content_approved INTEGER DEFAULT 0,
    content_rejected INTEGER DEFAULT 0,
    content_pending INTEGER DEFAULT 0,
    
    -- Community engagement
    community_moderators_active INTEGER DEFAULT 0,
    avg_approval_time_hours DECIMAL(5,2),
    community_voting_items INTEGER DEFAULT 0,
    
    -- Liberation focus tracking
    liberation_relevance_avg DECIMAL(3,2),
    economic_justice_content INTEGER DEFAULT 0,
    accessibility_compliant INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance with community-scale data
CREATE INDEX IF NOT EXISTS idx_auto_discovered_content_status ON auto_discovered_content(status);
CREATE INDEX IF NOT EXISTS idx_auto_discovered_content_source ON auto_discovered_content(source);
CREATE INDEX IF NOT EXISTS idx_auto_discovered_content_scraped_at ON auto_discovered_content(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_auto_discovered_content_relevance ON auto_discovered_content(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_auto_discovered_content_liberation_focus ON auto_discovered_content USING GIN(liberation_focus);

CREATE INDEX IF NOT EXISTS idx_community_org_sources_active ON community_org_sources(active);
CREATE INDEX IF NOT EXISTS idx_community_org_sources_trust ON community_org_sources(trust_level);
CREATE INDEX IF NOT EXISTS idx_community_org_sources_scraped ON community_org_sources(last_scraped);

CREATE INDEX IF NOT EXISTS idx_content_discovery_logs_run ON content_discovery_logs(discovery_run_id);
CREATE INDEX IF NOT EXISTS idx_content_discovery_logs_created ON content_discovery_logs(created_at DESC);

-- Row Level Security (RLS) for community data sovereignty
ALTER TABLE auto_discovered_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_org_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_discovery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for auto-discovered content (community transparency)
CREATE POLICY "Public can view approved content" ON auto_discovered_content
    FOR SELECT USING (status = 'community_approved');

-- Community members can moderate content (requires authentication)
CREATE POLICY "Community members can moderate" ON auto_discovered_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Public read access for community org sources (transparency)
CREATE POLICY "Public can view org sources" ON community_org_sources
    FOR SELECT USING (active = true);

-- Authenticated users can suggest new sources
CREATE POLICY "Authenticated can suggest sources" ON community_org_sources
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Public read access for discovery logs (transparency)
CREATE POLICY "Public can view discovery logs" ON content_discovery_logs
    FOR SELECT USING (true);

-- Public read access for moderation stats (democratic oversight)
CREATE POLICY "Public can view moderation stats" ON content_moderation_stats
    FOR SELECT USING (true);

-- Functions for automated community statistics
CREATE OR REPLACE FUNCTION update_daily_moderation_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO content_moderation_stats (
        date,
        content_discovered,
        content_approved,
        content_rejected,
        content_pending,
        liberation_relevance_avg,
        economic_justice_content,
        accessibility_compliant
    )
    SELECT 
        CURRENT_DATE,
        COUNT(*) FILTER (WHERE DATE(scraped_at) = CURRENT_DATE),
        COUNT(*) FILTER (WHERE status = 'community_approved' AND DATE(approved_at) = CURRENT_DATE),
        COUNT(*) FILTER (WHERE status = 'rejected' AND DATE(rejected_at) = CURRENT_DATE),
        COUNT(*) FILTER (WHERE status IN ('auto_discovered', 'community_voting')),
        AVG(relevance_score),
        COUNT(*) FILTER (WHERE economic_justice_score > 0.5),
        COUNT(*) FILTER (WHERE accessibility_notes IS NOT NULL)
    FROM auto_discovered_content
    ON CONFLICT (date) 
    DO UPDATE SET
        content_discovered = EXCLUDED.content_discovered,
        content_approved = EXCLUDED.content_approved,
        content_rejected = EXCLUDED.content_rejected,
        content_pending = EXCLUDED.content_pending,
        liberation_relevance_avg = EXCLUDED.liberation_relevance_avg,
        economic_justice_content = EXCLUDED.economic_justice_content,
        accessibility_compliant = EXCLUDED.accessibility_compliant,
        updated_at = NOW();
END;
$$;

-- Trigger to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_auto_discovered_content_updated_at 
    BEFORE UPDATE ON auto_discovered_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_org_sources_updated_at 
    BEFORE UPDATE ON community_org_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_moderation_stats_updated_at 
    BEFORE UPDATE ON content_moderation_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial trusted community organisation sources
INSERT INTO community_org_sources (name, url, rss_feed, trust_level, community_verified, liberation_focus) VALUES
('Stonewall UK', 'https://www.stonewall.org.uk', 'https://www.stonewall.org.uk/rss.xml', 'high', true, '{"queer-liberation", "lgbtq-rights"}'),
('Mermaids UK', 'https://www.mermaidsuk.org.uk', 'https://www.mermaidsuk.org.uk/feed/', 'high', true, '{"trans-rights", "youth-support"}'),
('Black Pride UK', 'https://www.blackpride.org.uk', 'https://www.blackpride.org.uk/feed/', 'high', true, '{"racial-justice", "black-queer-liberation"}'),
('UK Black Pride', 'https://www.ukblackpride.org.uk', 'https://www.ukblackpride.org.uk/feed/', 'high', true, '{"racial-justice", "black-pride", "community-celebration"}'),
('Gendered Intelligence', 'https://genderedintelligence.co.uk', 'https://genderedintelligence.co.uk/feed/', 'high', true, '{"trans-rights", "education", "community-support"}'),
('Kaleidoscope Trust', 'https://kaleidoscopetrust.com', 'https://kaleidoscopetrust.com/feed/', 'medium', true, '{"global-lgbtq", "human-rights"}')
ON CONFLICT (name) DO NOTHING;

-- Comments for community transparency
COMMENT ON TABLE auto_discovered_content IS 'Community-controlled auto-discovery of liberation-focused content from RSS feeds and web scraping';
COMMENT ON TABLE community_org_sources IS 'Trusted community organisation sources with democratic verification and oversight';
COMMENT ON TABLE content_discovery_logs IS 'Transparent logging of all content discovery operations for community audit';
COMMENT ON TABLE content_moderation_stats IS 'Daily statistics for democratic oversight of community content moderation';

COMMENT ON COLUMN auto_discovered_content.relevance_score IS 'AI-assessed relevance to Black queer liberation (0.0-1.0)';
COMMENT ON COLUMN auto_discovered_content.economic_justice_score IS 'Economic justice relevance for cooperative/community ownership focus (0.0-1.0)';
COMMENT ON COLUMN auto_discovered_content.liberation_focus IS 'Specific liberation movements this content supports';
COMMENT ON COLUMN community_org_sources.trust_level IS 'Community-assessed trust level affecting auto-approval workflow';