-- Enhanced Moderation & Publishing Workflow with IVOR Training Integration
-- Addresses challenging aspects of content moderation and publishing
-- Supports Chrome extension submissions feeding into IVOR knowledge base

-- =============================================
-- MODERATION RULES ENGINE
-- =============================================

CREATE TABLE moderation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    condition JSONB NOT NULL, -- Rule conditions as JSON
    action TEXT NOT NULL CHECK (action IN ('auto_approve', 'auto_reject', 'require_review', 'flag_for_community')),
    priority INTEGER DEFAULT 0, -- Higher priority rules run first
    enabled BOOLEAN DEFAULT true,
    success_rate DECIMAL(3,2) DEFAULT 0.0, -- Track rule performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT NOT NULL
);

-- Sample moderation rules for grassroots discovery
INSERT INTO moderation_rules (name, description, condition, action, priority, success_rate, created_by) VALUES
('Trusted Source Auto-Approve', 'Auto-approve content from verified trusted sources', 
 '{"trusted_source": true, "liberation_relevance": {"min": 0.8}}', 'auto_approve', 10, 0.95, 'system'),
 
('Chrome Extension High Quality', 'Auto-approve high-quality Chrome extension submissions', 
 '{"source_type": "chrome-extension", "submitter_reputation": {"min": 7}}', 'auto_approve', 9, 0.88, 'system'),
 
('Community Verified', 'Auto-approve community-verified content', 
 '{"community_votes": {"min": 3}, "liberation_relevance": {"min": 0.7}}', 'auto_approve', 8, 0.92, 'system'),
 
('Low Liberation Relevance', 'Flag low relevance content for review', 
 '{"liberation_relevance": {"max": 0.3}}', 'require_review', 3, 0.85, 'system'),
 
('Spam Indicators', 'Reject likely spam content', 
 '{"spam_indicators": {"min": 3}}', 'auto_reject', 15, 0.78, 'system');

-- =============================================
-- PUBLISHING QUEUE SYSTEM
-- =============================================

CREATE TABLE publishing_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES auto_discovered_content(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ready', 'published', 'failed')),
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for efficient publishing queue queries
CREATE INDEX idx_publishing_queue_status_scheduled ON publishing_queue(status, scheduled_for);
CREATE INDEX idx_publishing_queue_content ON publishing_queue(content_id);

-- =============================================
-- IVOR AI TRAINING INTEGRATION
-- =============================================

CREATE TABLE ivor_training_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES auto_discovered_content(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL, -- 'manual_submission', 'moderation_decision', 'community_feedback'
    training_type TEXT NOT NULL, -- 'content_quality', 'moderation_decision', 'liberation_relevance'
    training_data JSONB NOT NULL, -- The actual training data for IVOR
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_result JSONB,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days')
);

CREATE INDEX idx_ivor_training_unprocessed ON ivor_training_queue(processed, priority, added_at) WHERE NOT processed;
CREATE INDEX idx_ivor_training_expiry ON ivor_training_queue(expires_at) WHERE NOT processed;

-- =============================================
-- MANUAL CONTENT SUBMISSIONS (Chrome Extension)
-- =============================================

CREATE TABLE manual_content_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('event', 'news', 'organization', 'resource')),
    submitted_by UUID NOT NULL, -- Would reference users table
    submitter_reputation INTEGER DEFAULT 5, -- 1-10 reputation score
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    location TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    organization_name TEXT,
    liberation_relevance DECIMAL(3,2) DEFAULT 0.5,
    liberation_focus TEXT[] DEFAULT '{}',
    source_type TEXT NOT NULL DEFAULT 'manual-form' CHECK (source_type IN ('chrome-extension', 'manual-form', 'community-suggestion')),
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'needs-review', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by TEXT,
    rejection_reason TEXT,
    ivor_training_value INTEGER DEFAULT 5, -- 1-10 how valuable for IVOR training
    community_votes INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- Indexes for efficient querying of submissions
CREATE INDEX idx_manual_submissions_status ON manual_content_submissions(verification_status);
CREATE INDEX idx_manual_submissions_submitter ON manual_content_submissions(submitted_by);
CREATE INDEX idx_manual_submissions_type ON manual_content_submissions(submission_type);
CREATE INDEX idx_manual_submissions_date ON manual_content_submissions(submission_date DESC);

-- =============================================
-- ENHANCED AUTO_DISCOVERED_CONTENT TABLE
-- =============================================

-- Add new columns to existing auto_discovered_content table
ALTER TABLE auto_discovered_content 
ADD COLUMN IF NOT EXISTS auto_moderation_flags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS community_votes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trusted_source BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS submitter_reputation INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS moderated_by TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Update existing content to mark known trusted sources
UPDATE auto_discovered_content 
SET trusted_source = true 
WHERE source_url ILIKE '%blackpride%' 
   OR source_url ILIKE '%stonewall%' 
   OR source_url ILIKE '%blkout%'
   OR source_organization IN ('Black Pride UK', 'Stonewall UK', 'BLKOUT UK');

-- =============================================
-- COMMUNITY CURATION STATISTICS
-- =============================================

CREATE TABLE curation_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_submissions INTEGER DEFAULT 0,
    verified_submissions INTEGER DEFAULT 0,
    rejected_submissions INTEGER DEFAULT 0,
    chrome_extension_submissions INTEGER DEFAULT 0,
    manual_form_submissions INTEGER DEFAULT 0,
    ivor_training_integrations INTEGER DEFAULT 0,
    community_contributors INTEGER DEFAULT 0,
    new_sources_identified INTEGER DEFAULT 0,
    average_liberation_relevance DECIMAL(3,2) DEFAULT 0.5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(date)
);

-- =============================================
-- ROW LEVEL SECURITY FOR COMMUNITY GOVERNANCE
-- =============================================

-- Enable RLS on all new tables
ALTER TABLE moderation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ivor_training_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_statistics ENABLE ROW LEVEL SECURITY;

-- Public read access for transparency (excluding sensitive training data)
CREATE POLICY "Public read access for moderation rules" ON moderation_rules
    FOR SELECT USING (true);

CREATE POLICY "Public read access for publishing queue" ON publishing_queue
    FOR SELECT USING (true);

CREATE POLICY "Community read access for manual submissions" ON manual_content_submissions
    FOR SELECT USING (true);

CREATE POLICY "Public read access for curation statistics" ON curation_statistics
    FOR SELECT USING (true);

-- Restricted access for IVOR training data (community sovereignty)
CREATE POLICY "Community member access for IVOR training" ON ivor_training_queue
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- AUTOMATED STATISTICS UPDATES
-- =============================================

-- Function to update daily curation statistics
CREATE OR REPLACE FUNCTION update_curation_statistics()
RETURNS void AS $$
BEGIN
    INSERT INTO curation_statistics (
        date,
        total_submissions,
        verified_submissions,
        rejected_submissions,
        chrome_extension_submissions,
        manual_form_submissions,
        ivor_training_integrations,
        community_contributors,
        new_sources_identified,
        average_liberation_relevance
    )
    SELECT
        CURRENT_DATE,
        COUNT(*) as total_submissions,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_submissions,
        COUNT(*) FILTER (WHERE verification_status = 'rejected') as rejected_submissions,
        COUNT(*) FILTER (WHERE source_type = 'chrome-extension') as chrome_extension_submissions,
        COUNT(*) FILTER (WHERE source_type = 'manual-form') as manual_form_submissions,
        (SELECT COUNT(*) FROM ivor_training_queue WHERE DATE(added_at) = CURRENT_DATE) as ivor_training_integrations,
        COUNT(DISTINCT submitted_by) as community_contributors,
        COUNT(DISTINCT organization_name) as new_sources_identified,
        AVG(liberation_relevance) as average_liberation_relevance
    FROM manual_content_submissions
    WHERE DATE(submission_date) = CURRENT_DATE
    ON CONFLICT (date) DO UPDATE SET
        total_submissions = EXCLUDED.total_submissions,
        verified_submissions = EXCLUDED.verified_submissions,
        rejected_submissions = EXCLUDED.rejected_submissions,
        chrome_extension_submissions = EXCLUDED.chrome_extension_submissions,
        manual_form_submissions = EXCLUDED.manual_form_submissions,
        ivor_training_integrations = EXCLUDED.ivor_training_integrations,
        community_contributors = EXCLUDED.community_contributors,
        new_sources_identified = EXCLUDED.new_sources_identified,
        average_liberation_relevance = EXCLUDED.average_liberation_relevance,
        updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS FOR AUTOMATION
-- =============================================

-- Trigger to automatically add approved content to publishing queue
CREATE OR REPLACE FUNCTION auto_queue_approved_content()
RETURNS trigger AS $$
BEGIN
    -- If content was approved, add to publishing queue
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO publishing_queue (content_id, status, scheduled_for)
        VALUES (NEW.id, 'ready', now());
    END IF;
    
    -- If moderation decision was made, add to IVOR training
    IF NEW.moderated_at IS NOT NULL AND OLD.moderated_at IS NULL THEN
        INSERT INTO ivor_training_queue (content_id, source_type, training_type, training_data, priority)
        VALUES (
            NEW.id, 
            'moderation_decision', 
            'content_quality',
            jsonb_build_object(
                'decision', NEW.status,
                'liberation_relevance', NEW.liberation_relevance,
                'community_votes', NEW.community_votes,
                'ai_confidence', NEW.ai_confidence
            ),
            CASE 
                WHEN NEW.ai_confidence > 0.8 THEN 'high'
                WHEN NEW.ai_confidence > 0.5 THEN 'medium'
                ELSE 'low'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_queue_approved_content
    AFTER UPDATE ON auto_discovered_content
    FOR EACH ROW
    EXECUTE FUNCTION auto_queue_approved_content();

-- Trigger to add verified manual submissions to IVOR training
CREATE OR REPLACE FUNCTION auto_train_ivor_from_submissions()
RETURNS trigger AS $$
BEGIN
    -- If submission was verified, add to IVOR training with high priority
    IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
        INSERT INTO ivor_training_queue (content_id, source_type, training_type, training_data, priority)
        VALUES (
            NEW.id,
            'manual_submission',
            'grassroots_discovery',
            jsonb_build_object(
                'title', NEW.title,
                'description', NEW.description,
                'liberation_focus', NEW.liberation_focus,
                'organization_name', NEW.organization_name,
                'liberation_relevance', NEW.liberation_relevance,
                'submission_type', NEW.submission_type,
                'training_value', NEW.ivor_training_value
            ),
            CASE 
                WHEN NEW.ivor_training_value >= 8 THEN 'high'
                WHEN NEW.ivor_training_value >= 6 THEN 'medium'
                ELSE 'low'
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_train_ivor_from_submissions
    AFTER UPDATE ON manual_content_submissions
    FOR EACH ROW
    EXECUTE FUNCTION auto_train_ivor_from_submissions();

-- =============================================
-- VIEWS FOR ENHANCED REPORTING
-- =============================================

-- Moderation performance view
CREATE VIEW moderation_performance AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_content,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_content,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_content,
    COUNT(*) FILTER (WHERE moderated_by LIKE '%smart%') as auto_moderated,
    AVG(EXTRACT(EPOCH FROM (moderated_at - created_at))/60) as avg_moderation_time_minutes
FROM auto_discovered_content
WHERE moderated_at IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Community contribution summary
CREATE VIEW community_contribution_summary AS
SELECT
    DATE(submission_date) as date,
    COUNT(*) as total_submissions,
    COUNT(DISTINCT submitted_by) as unique_contributors,
    COUNT(*) FILTER (WHERE source_type = 'chrome-extension') as chrome_extension_submissions,
    COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_submissions,
    AVG(liberation_relevance) as avg_liberation_relevance,
    COUNT(DISTINCT organization_name) as new_organizations_discovered
FROM manual_content_submissions
GROUP BY DATE(submission_date)
ORDER BY date DESC;

-- IVOR training progress view
CREATE VIEW ivor_training_progress AS
SELECT
    DATE(added_at) as date,
    COUNT(*) as training_items_added,
    COUNT(*) FILTER (WHERE processed = true) as training_items_processed,
    COUNT(*) FILTER (WHERE priority = 'high') as high_priority_items,
    COUNT(*) FILTER (WHERE training_type = 'grassroots_discovery') as grassroots_training_items,
    AVG(EXTRACT(EPOCH FROM (processed_at - added_at))/60) as avg_processing_time_minutes
FROM ivor_training_queue
GROUP BY DATE(added_at)
ORDER BY date DESC;

-- =============================================
-- COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON TABLE moderation_rules IS 'AI-powered moderation rules for automated content approval/rejection';
COMMENT ON TABLE publishing_queue IS 'Queue system for publishing approved content to various channels';
COMMENT ON TABLE ivor_training_queue IS 'Queue for training IVOR AI with community-curated content';
COMMENT ON TABLE manual_content_submissions IS 'Content manually submitted via Chrome extension or web forms';
COMMENT ON TABLE curation_statistics IS 'Daily statistics tracking community curation performance';

COMMENT ON COLUMN moderation_rules.condition IS 'JSON conditions that must be met for rule to trigger';
COMMENT ON COLUMN moderation_rules.success_rate IS 'Historical success rate of this rule (0.0-1.0)';
COMMENT ON COLUMN ivor_training_queue.training_data IS 'Training data structure for IVOR AI improvement';
COMMENT ON COLUMN manual_content_submissions.ivor_training_value IS 'How valuable this submission is for training IVOR (1-10)';

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Enhanced Moderation & IVOR Training schema created successfully!';
    RAISE NOTICE '📊 Features enabled:';
    RAISE NOTICE '   - Smart moderation rules with auto-approval/rejection';
    RAISE NOTICE '   - Publishing queue for approved content';
    RAISE NOTICE '   - IVOR AI training integration from community submissions';
    RAISE NOTICE '   - Chrome extension manual submission support';
    RAISE NOTICE '   - Community curation statistics and performance tracking';
    RAISE NOTICE '   - Democratic governance through Row Level Security';
    RAISE NOTICE '🚀 Ready to streamline moderation and enhance IVOR with community knowledge!';
END $$;