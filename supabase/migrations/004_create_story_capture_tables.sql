-- Story Capture Pipeline Tables
-- Production-scale IVOR conversation → Newsroom article pipeline

-- Story Capture Queue Table
CREATE TABLE IF NOT EXISTS story_capture_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_data JSONB NOT NULL, -- Full IVOR conversation
    story_analysis JSONB NOT NULL, -- Story analysis results
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'captured', 'published', 'rejected')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    auto_validation_score NUMERIC(3,1) NOT NULL CHECK (auto_validation_score >= 0 AND auto_validation_score <= 5),
    user_consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    newsroom_article_id TEXT, -- References articles table when created
    governance_decision_id UUID REFERENCES governance_decisions(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Indexes for performance
    INDEX (status, priority, created_at),
    INDEX (auto_validation_score DESC),
    INDEX (created_at DESC)
);

-- Story Capture Metrics Table (for analytics)
CREATE TABLE IF NOT EXISTS story_capture_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    conversations_analyzed INTEGER DEFAULT 0,
    stories_detected INTEGER DEFAULT 0,
    stories_captured INTEGER DEFAULT 0,
    stories_published INTEGER DEFAULT 0,
    detection_accuracy NUMERIC(5,2), -- Percentage
    avg_processing_time_ms NUMERIC(10,2),
    community_consent_rate NUMERIC(5,2), -- Percentage
    queue_size_avg INTEGER DEFAULT 0,
    queue_processing_rate NUMERIC(5,2), -- Items per hour
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- One record per date
    UNIQUE(date)
);

-- User Consent Tracking Table
CREATE TABLE IF NOT EXISTS story_consent_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Will be proper user reference when auth is implemented
    conversation_id TEXT NOT NULL, -- Session or conversation identifier
    consent_given BOOLEAN NOT NULL,
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('story_capture', 'story_publish', 'story_amplify')),
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    consent_withdrawn_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Track consent per user per conversation type
    UNIQUE(user_id, conversation_id, consent_type)
);

-- Story Processing Logs Table (for debugging and monitoring)
CREATE TABLE IF NOT EXISTS story_processing_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    queue_item_id UUID NOT NULL REFERENCES story_capture_queue(id) ON DELETE CASCADE,
    processing_step VARCHAR(50) NOT NULL, -- 'analysis', 'capture', 'validation', 'publish'
    status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    processing_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for monitoring
    INDEX (queue_item_id, processing_step),
    INDEX (created_at DESC),
    INDEX (status, processing_step)
);

-- Community Feedback on Generated Stories
CREATE TABLE IF NOT EXISTS community_story_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    newsroom_article_id TEXT NOT NULL, -- References articles table
    queue_item_id UUID REFERENCES story_capture_queue(id) ON DELETE SET NULL,
    user_id TEXT NOT NULL,
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('helpful', 'accurate', 'relevant', 'needs_improvement', 'inappropriate')),
    feedback_text TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One feedback per user per article
    UNIQUE(newsroom_article_id, user_id)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_story_queue_processing ON story_capture_queue(status, priority, created_at) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_story_queue_user_consent ON story_capture_queue(user_consent, auto_validation_score);
CREATE INDEX IF NOT EXISTS idx_story_queue_newsroom_article ON story_capture_queue(newsroom_article_id) WHERE newsroom_article_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_story_metrics_date ON story_capture_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_consent_tracking_user ON story_consent_tracking(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_processing_logs_queue_item ON story_processing_logs(queue_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_feedback_article ON community_story_feedback(newsroom_article_id);

-- Functions for queue management
CREATE OR REPLACE FUNCTION update_queue_metrics()
RETURNS VOID AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    conversations_analyzed INTEGER;
    stories_detected INTEGER;
    stories_captured INTEGER;
    stories_published INTEGER;
    detection_rate NUMERIC(5,2);
    avg_processing NUMERIC(10,2);
    consent_rate NUMERIC(5,2);
    queue_size INTEGER;
BEGIN
    -- Get today's metrics
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE (story_analysis->>'hasStoryPotential')::boolean = true),
        COUNT(*) FILTER (WHERE status IN ('captured', 'published')),
        COUNT(*) FILTER (WHERE status = 'published')
    INTO conversations_analyzed, stories_detected, stories_captured, stories_published
    FROM story_capture_queue 
    WHERE created_at::date = current_date;
    
    -- Calculate rates
    detection_rate := CASE WHEN conversations_analyzed > 0 THEN (stories_detected::numeric / conversations_analyzed) * 100 ELSE 0 END;
    consent_rate := CASE WHEN conversations_analyzed > 0 THEN (SELECT COUNT(*) FILTER (WHERE user_consent = true)::numeric / conversations_analyzed * 100 FROM story_capture_queue WHERE created_at::date = current_date) ELSE 0 END;
    
    -- Get average processing time
    SELECT COALESCE(AVG((metadata->>'processing_time_ms')::numeric), 0)
    INTO avg_processing
    FROM story_capture_queue 
    WHERE created_at::date = current_date AND metadata->>'processing_time_ms' IS NOT NULL;
    
    -- Get current queue size
    SELECT COUNT(*) INTO queue_size FROM story_capture_queue WHERE status = 'pending';
    
    -- Insert or update metrics
    INSERT INTO story_capture_metrics (
        date, conversations_analyzed, stories_detected, stories_captured, stories_published,
        detection_accuracy, avg_processing_time_ms, community_consent_rate, queue_size_avg
    ) VALUES (
        current_date, conversations_analyzed, stories_detected, stories_captured, stories_published,
        detection_rate, avg_processing, consent_rate, queue_size
    )
    ON CONFLICT (date) DO UPDATE SET
        conversations_analyzed = EXCLUDED.conversations_analyzed,
        stories_detected = EXCLUDED.stories_detected,
        stories_captured = EXCLUDED.stories_captured,
        stories_published = EXCLUDED.stories_published,
        detection_accuracy = EXCLUDED.detection_accuracy,
        avg_processing_time_ms = EXCLUDED.avg_processing_time_ms,
        community_consent_rate = EXCLUDED.community_consent_rate,
        queue_size_avg = EXCLUDED.queue_size_avg;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log processing steps
CREATE OR REPLACE FUNCTION log_queue_processing()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO story_processing_logs (queue_item_id, processing_step, status, processing_time_ms, metadata)
        VALUES (
            NEW.id,
            NEW.status,
            'completed',
            CASE WHEN NEW.processed_at IS NOT NULL AND OLD.processed_at IS NULL 
                 THEN EXTRACT(EPOCH FROM (NEW.processed_at - NEW.created_at)) * 1000
                 ELSE NULL END,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER story_queue_processing_log
    AFTER UPDATE ON story_capture_queue
    FOR EACH ROW EXECUTE FUNCTION log_queue_processing();

-- Function to clean old queue items (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_queue_items(retention_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM story_capture_queue 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * retention_days
    AND status IN ('published', 'rejected');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO story_capture_queue (
    conversation_data, 
    story_analysis, 
    status, 
    priority, 
    auto_validation_score, 
    user_consent,
    metadata
) VALUES 
(
    '{"message": "Just got accepted into the community housing cooperative in Manchester! After months of applying and waiting, we finally have a safe, affordable place where other Black queer folks can feel at home.", "response": "That\'s incredible news! Community-led housing initiatives like yours are such powerful examples of mutual aid and collective organizing. Having safe, affirming spaces is fundamental to our liberation. This sounds like it could inspire other communities.", "service": "ivor-core", "timestamp": "2025-08-30T10:00:00Z", "userId": "user-housing-success", "sessionId": "housing-session-1"}',
    '{"hasStoryPotential": true, "storyType": "achievement", "suggestedTitle": "Manchester Community Housing Cooperative Success Story", "keyElements": ["housing justice", "community organizing", "Black queer space"]}',
    'pending',
    'high',
    4.2,
    true,
    '{"user_location": "manchester", "community_impact": "local", "keywords": ["housing", "cooperative", "manchester", "community"], "confidence_score": 4.2}'
),
(
    '{"message": "Our campaign for better NHS trans healthcare just got the local clinic to extend hours and hire more culturally competent staff. Six months of organizing paid off!", "response": "What an incredible organizing victory! This shows exactly how persistent community advocacy can create real change in healthcare access. Your campaign is going to help so many people get the affirming care they deserve. This kind of grassroots organizing is how we build liberation.", "service": "ivor-organizing", "timestamp": "2025-08-30T11:30:00Z", "userId": "user-healthcare-organizer", "sessionId": "healthcare-campaign-1"}',
    '{"hasStoryPotential": true, "storyType": "organizing", "suggestedTitle": "NHS Trans Healthcare Campaign Achieves Major Victory", "keyElements": ["healthcare organizing", "trans healthcare", "community advocacy", "NHS improvement"]}',
    'captured',
    'urgent',
    4.8,
    true,
    '{"user_location": "uk", "community_impact": "local", "keywords": ["healthcare", "organizing", "nhs", "trans", "campaign"], "confidence_score": 4.8, "processing_time_ms": 2340}'
),
(
    '{"message": "Had an amazing time at the Black Pride planning meeting. So much energy and ideas for this year\'s celebration in Birmingham!", "response": "That sounds wonderful! Community celebrations like Black Pride are so important for joy, visibility, and bringing people together. The planning process itself builds community connections. What kind of programming are you all thinking about?", "service": "ivor-community", "timestamp": "2025-08-30T14:15:00Z", "userId": "user-pride-volunteer", "sessionId": "pride-planning-1"}',
    '{"hasStoryPotential": true, "storyType": "cultural", "suggestedTitle": "Birmingham Black Pride 2025 Planning Underway", "keyElements": ["Black Pride", "Birmingham", "community celebration", "event planning"]}',
    'pending',
    'medium',
    3.4,
    false,
    '{"user_location": "birmingham", "community_impact": "local", "keywords": ["pride", "birmingham", "celebration", "planning"], "confidence_score": 3.4}'
);

-- Sample metrics data
INSERT INTO story_capture_metrics (
    date, conversations_analyzed, stories_detected, stories_captured, stories_published,
    detection_accuracy, avg_processing_time_ms, community_consent_rate, queue_size_avg
) VALUES 
(CURRENT_DATE - INTERVAL '1 day', 45, 28, 18, 12, 62.2, 2150.5, 78.5, 8),
(CURRENT_DATE - INTERVAL '2 days', 38, 22, 15, 10, 57.9, 2890.2, 82.1, 12),
(CURRENT_DATE - INTERVAL '3 days', 52, 35, 25, 18, 67.3, 1950.8, 75.0, 6);

-- Sample consent tracking
INSERT INTO story_consent_tracking (user_id, conversation_id, consent_given, consent_type) VALUES
('user-housing-success', 'housing-session-1', true, 'story_capture'),
('user-healthcare-organizer', 'healthcare-campaign-1', true, 'story_capture'),
('user-healthcare-organizer', 'healthcare-campaign-1', true, 'story_publish'),
('user-pride-volunteer', 'pride-planning-1', false, 'story_capture');

-- Row Level Security (RLS) Policies
ALTER TABLE story_capture_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_capture_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_consent_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_story_feedback ENABLE ROW LEVEL SECURITY;

-- Public read access for queue status (transparency)
CREATE POLICY "Public read access for queue metrics" ON story_capture_metrics
    FOR SELECT USING (true);

-- Allow service role full access for processing
CREATE POLICY "Service role full access" ON story_capture_queue
    FOR ALL USING (true);
CREATE POLICY "Service role metrics access" ON story_capture_metrics  
    FOR ALL USING (true);
CREATE POLICY "Service role consent access" ON story_consent_tracking
    FOR ALL USING (true);
CREATE POLICY "Service role logs access" ON story_processing_logs
    FOR ALL USING (true);

-- Allow community feedback
CREATE POLICY "Allow community story feedback" ON community_story_feedback
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read story feedback" ON community_story_feedback
    FOR SELECT USING (true);

-- Grant permissions for the service role
GRANT ALL ON story_capture_queue TO service_role;
GRANT ALL ON story_capture_metrics TO service_role;
GRANT ALL ON story_consent_tracking TO service_role;
GRANT ALL ON story_processing_logs TO service_role;
GRANT ALL ON community_story_feedback TO service_role;