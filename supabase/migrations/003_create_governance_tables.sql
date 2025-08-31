-- Community Governance Tables
-- Democratic decision-making and story validation system

-- Governance Decisions Table
CREATE TABLE IF NOT EXISTS governance_decisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('story_validation', 'story_curation', 'event_endorsement', 'platform_policy')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposed_by TEXT NOT NULL, -- Will be user_id when auth is implemented
    status VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'voting', 'approved', 'rejected', 'implemented')),
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    voting_ends_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Indexes for performance
    CONSTRAINT governance_decisions_votes_check CHECK (votes_for >= 0 AND votes_against >= 0 AND votes_abstain >= 0)
);

-- Governance Votes Table
CREATE TABLE IF NOT EXISTS governance_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    decision_id UUID NOT NULL REFERENCES governance_decisions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Will be proper user reference when auth is implemented
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('for', 'against', 'abstain')),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one vote per user per decision
    UNIQUE(decision_id, user_id)
);

-- Story Validation Requests Table
CREATE TABLE IF NOT EXISTS story_validation_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id TEXT NOT NULL, -- References articles table
    decision_id UUID REFERENCES governance_decisions(id) ON DELETE SET NULL,
    submission_type VARCHAR(30) NOT NULL CHECK (submission_type IN ('community', 'ivor_conversation', 'external')),
    submitted_by TEXT NOT NULL,
    validation_criteria JSONB DEFAULT '{
        "community_relevance": 0,
        "factual_accuracy": 0,
        "cultural_sensitivity": 0,
        "liberation_alignment": 0
    }'::jsonb,
    auto_validation_score NUMERIC(3,1) CHECK (auto_validation_score >= 0 AND auto_validation_score <= 5),
    moderator_notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for story lookups
    UNIQUE(story_id)
);

-- Community Feedback Table
CREATE TABLE IF NOT EXISTS community_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    validation_request_id UUID NOT NULL REFERENCES story_validation_requests(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('approve', 'request_changes', 'reject')),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One feedback per user per validation request
    UNIQUE(validation_request_id, user_id)
);

-- Curation Analytics Table
CREATE TABLE IF NOT EXISTS curation_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    stories_submitted INTEGER DEFAULT 0,
    stories_validated INTEGER DEFAULT 0,
    stories_featured INTEGER DEFAULT 0,
    community_votes_cast INTEGER DEFAULT 0,
    unique_voters INTEGER DEFAULT 0,
    auto_validation_accuracy NUMERIC(5,2), -- Percentage
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- One record per date
    UNIQUE(date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_governance_decisions_type_status ON governance_decisions(type, status);
CREATE INDEX IF NOT EXISTS idx_governance_decisions_created_at ON governance_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_governance_votes_decision_id ON governance_votes(decision_id);
CREATE INDEX IF NOT EXISTS idx_governance_votes_user_id ON governance_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_story_validation_story_id ON story_validation_requests(story_id);
CREATE INDEX IF NOT EXISTS idx_story_validation_status ON story_validation_requests(status);
CREATE INDEX IF NOT EXISTS idx_community_feedback_validation_id ON community_feedback(validation_request_id);
CREATE INDEX IF NOT EXISTS idx_curation_analytics_date ON curation_analytics(date DESC);

-- Functions for vote counting
CREATE OR REPLACE FUNCTION increment_vote_count(decision_id UUID, vote_field TEXT)
RETURNS VOID AS $$
BEGIN
    IF vote_field = 'votes_for' THEN
        UPDATE governance_decisions SET votes_for = votes_for + 1 WHERE id = decision_id;
    ELSIF vote_field = 'votes_against' THEN
        UPDATE governance_decisions SET votes_against = votes_against + 1 WHERE id = decision_id;
    ELSIF vote_field = 'votes_abstain' THEN
        UPDATE governance_decisions SET votes_abstain = votes_abstain + 1 WHERE id = decision_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_governance_decisions_updated_at
    BEFORE UPDATE ON governance_decisions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_validation_updated_at  
    BEFORE UPDATE ON story_validation_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample governance decisions for demo
INSERT INTO governance_decisions (type, title, description, proposed_by, status, votes_for, votes_against, votes_abstain, metadata) VALUES
('story_validation', 'Validate: Manchester Housing Cooperative Launch', 'Community validation requested for story about new QTIPOC+ housing initiative in Manchester. Auto-validation score: 4.2/5.0', 'community-admin', 'approved', 5, 0, 1, '{"story_id": "sample-housing-story", "impact_level": "local", "community_tags": ["Housing", "Manchester", "Organizing"]}'),
('story_validation', 'Validate: Birmingham Pride Planning Update', 'Story validation for Birmingham Black Pride 2025 organizing update submitted by community member. Auto-validation score: 3.8/5.0', 'community-member-1', 'voting', 2, 0, 0, '{"story_id": "sample-pride-story", "impact_level": "local", "community_tags": ["Pride", "Birmingham", "Events"]}'),
('story_curation', 'Feature Stories: Community Liberation Week', 'Proposal to create special featured collection for Community Liberation Week highlighting organizing wins across the UK.', 'editorial-team', 'voting', 3, 1, 0, '{"theme": "liberation", "duration": "week", "geographic_scope": "uk-wide"}');

-- Insert sample validation requests
INSERT INTO story_validation_requests (story_id, submission_type, submitted_by, validation_criteria, auto_validation_score, status) VALUES
('sample-housing-story', 'community', 'community-admin', '{"community_relevance": 5, "factual_accuracy": 4, "cultural_sensitivity": 4, "liberation_alignment": 5}', 4.2, 'approved'),
('sample-pride-story', 'community', 'community-member-1', '{"community_relevance": 4, "factual_accuracy": 4, "cultural_sensitivity": 4, "liberation_alignment": 3}', 3.8, 'pending');

-- Insert sample votes
INSERT INTO governance_votes (decision_id, user_id, vote_type, comments) VALUES
((SELECT id FROM governance_decisions WHERE title LIKE 'Validate: Manchester Housing%' LIMIT 1), 'voter-1', 'for', 'Great community organizing story'),
((SELECT id FROM governance_decisions WHERE title LIKE 'Validate: Manchester Housing%' LIMIT 1), 'voter-2', 'for', 'Important housing justice work'),
((SELECT id FROM governance_decisions WHERE title LIKE 'Validate: Birmingham Pride%' LIMIT 1), 'voter-3', 'for', 'Supporting community events'),
((SELECT id FROM governance_decisions WHERE title LIKE 'Feature Stories%' LIMIT 1), 'voter-4', 'for', 'Love the thematic approach');

-- Insert sample analytics
INSERT INTO curation_analytics (date, stories_submitted, stories_validated, stories_featured, community_votes_cast, unique_voters) VALUES
(CURRENT_DATE - INTERVAL '1 day', 8, 6, 3, 12, 8),
(CURRENT_DATE - INTERVAL '2 days', 5, 4, 2, 15, 10),
(CURRENT_DATE - INTERVAL '3 days', 12, 9, 4, 18, 12);

-- Row Level Security (RLS) Policies
ALTER TABLE governance_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_validation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;

-- Public read access for governance decisions (democratic transparency)
CREATE POLICY "Public read access for governance decisions" ON governance_decisions
    FOR SELECT USING (true);

-- Public read access for governance votes (vote transparency)  
CREATE POLICY "Public read access for governance votes" ON governance_votes
    FOR SELECT USING (true);

-- Public read access for validation requests
CREATE POLICY "Public read access for validation requests" ON story_validation_requests
    FOR SELECT USING (true);

-- Allow authenticated users to vote (will be updated when auth is implemented)
CREATE POLICY "Allow voting on governance decisions" ON governance_votes
    FOR INSERT WITH CHECK (true);

-- Allow community story validation submissions
CREATE POLICY "Allow story validation submissions" ON story_validation_requests
    FOR INSERT WITH CHECK (true);

-- Allow community feedback submission
CREATE POLICY "Allow community feedback" ON community_feedback
    FOR INSERT WITH CHECK (true);

-- Grant permissions for the service role
GRANT ALL ON governance_decisions TO service_role;
GRANT ALL ON governance_votes TO service_role;
GRANT ALL ON story_validation_requests TO service_role;
GRANT ALL ON community_feedback TO service_role;
GRANT ALL ON curation_analytics TO service_role;