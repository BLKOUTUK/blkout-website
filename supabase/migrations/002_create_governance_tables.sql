-- BLKOUT Community Governance Database Schema
-- Enables transparent, cooperative democracy with community values integration

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Governance proposals table
CREATE TABLE IF NOT EXISTS governance_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL CHECK (length(title) >= 10),
  description TEXT NOT NULL CHECK (length(description) >= 100),
  category VARCHAR(20) NOT NULL CHECK (category IN ('policy', 'budget', 'platform', 'community', 'values')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'discussion', 'voting', 'approved', 'rejected', 'implemented')),
  
  -- Proposer information
  proposer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  proposer_name VARCHAR(255) NOT NULL,
  proposer_role VARCHAR(50) DEFAULT 'member' CHECK (proposer_role IN ('member', 'moderator', 'council', 'working-group', 'organization')),
  
  -- Proposal details
  justification TEXT NOT NULL,
  expected_impact TEXT NOT NULL,
  implementation_plan TEXT NOT NULL,
  resources_required TEXT,
  community_benefit TEXT,
  potential_concerns TEXT,
  urgency VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  estimated_timeframe VARCHAR(20) CHECK (estimated_timeframe IN ('immediate', 'short', 'medium', 'long', 'ongoing')),
  community_impact VARCHAR(20) DEFAULT 'medium' CHECK (community_impact IN ('low', 'medium', 'high', 'critical')),
  
  -- Supporting members
  supporting_members JSONB DEFAULT '[]'::jsonb,
  success_metrics JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- Voting information
  voting_deadline TIMESTAMP WITH TIME ZONE,
  discussion_period_days INTEGER DEFAULT 7 CHECK (discussion_period_days >= 1),
  min_participation_rate DECIMAL(5,2) DEFAULT 50.00 CHECK (min_participation_rate > 0 AND min_participation_rate <= 100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Community values alignment check
  values_alignment_verified BOOLEAN DEFAULT false,
  moderator_approved BOOLEAN DEFAULT false,
  moderator_notes TEXT
);

-- Proposal votes table
CREATE TABLE IF NOT EXISTS proposal_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote VARCHAR(10) NOT NULL CHECK (vote IN ('for', 'against', 'abstain')),
  voting_power DECIMAL(5,2) DEFAULT 1.00 CHECK (voting_power > 0),
  comment TEXT,
  anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(proposal_id, voter_id)
);

-- Proposal discussions table
CREATE TABLE IF NOT EXISTS proposal_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) DEFAULT 'member' CHECK (user_role IN ('member', 'moderator', 'council', 'founder')),
  content TEXT NOT NULL CHECK (length(content) >= 10),
  parent_id UUID REFERENCES proposal_discussions(id) ON DELETE CASCADE, -- For replies
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  is_pinned BOOLEAN DEFAULT false,
  is_moderated BOOLEAN DEFAULT false,
  moderation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community meetings table
CREATE TABLE IF NOT EXISTS community_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('council', 'community', 'working-group', 'special')),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  
  -- Meeting details
  location VARCHAR(255) NOT NULL,
  virtual_link TEXT,
  agenda_items JSONB DEFAULT '[]'::jsonb,
  attendees_count INTEGER,
  duration INTERVAL,
  
  -- Meeting records
  minutes_url TEXT,
  recording_url TEXT,
  summary TEXT,
  decisions_made JSONB DEFAULT '[]'::jsonb,
  action_items JSONB DEFAULT '[]'::jsonb,
  next_meeting_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Official documents table
CREATE TABLE IF NOT EXISTS governance_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('minutes', 'agenda', 'resolution', 'report', 'policy', 'financial', 'legal')),
  
  -- Document relationships
  meeting_id UUID REFERENCES community_meetings(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
  
  -- File information
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(20),
  file_type VARCHAR(100),
  description TEXT,
  
  -- Document metadata
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_by_name VARCHAR(255) NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  version INTEGER DEFAULT 1 CHECK (version >= 1),
  
  -- Timestamps
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community members profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  display_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'council', 'founder')),
  verified BOOLEAN DEFAULT false,
  
  -- Participation metrics
  contribution_score INTEGER DEFAULT 0 CHECK (contribution_score >= 0),
  voting_power DECIMAL(5,2) DEFAULT 1.00 CHECK (voting_power > 0),
  proposals_submitted INTEGER DEFAULT 0 CHECK (proposals_submitted >= 0),
  votes_cast INTEGER DEFAULT 0 CHECK (votes_cast >= 0),
  meetings_attended INTEGER DEFAULT 0 CHECK (meetings_attended >= 0),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Community engagement
  bio TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  availability TEXT,
  preferred_communication VARCHAR(50),
  
  -- Settings
  notifications_enabled BOOLEAN DEFAULT true,
  public_profile BOOLEAN DEFAULT true,
  show_voting_history BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Decision records table (for implemented proposals)
CREATE TABLE IF NOT EXISTS decision_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  decision TEXT NOT NULL,
  implemented_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  implementation_status VARCHAR(20) DEFAULT 'planned' CHECK (implementation_status IN ('planned', 'in-progress', 'completed', 'on-hold', 'cancelled')),
  
  -- Impact tracking
  impact_assessment TEXT,
  success_metrics JSONB DEFAULT '[]'::jsonb,
  actual_outcomes JSONB DEFAULT '[]'::jsonb,
  lessons_learned TEXT,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  follow_up_notes TEXT,
  
  -- Responsible parties
  implementation_team JSONB DEFAULT '[]'::jsonb,
  lead_implementer UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action items from meetings table
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES community_meetings(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
  
  task TEXT NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_name VARCHAR(255) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Progress tracking
  progress_notes TEXT,
  completion_date TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Governance metrics and analytics
CREATE TABLE IF NOT EXISTS governance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type VARCHAR(50) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  period VARCHAR(20) DEFAULT 'daily' CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(metric_type, metric_date, period)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_governance_proposals_status ON governance_proposals(status);
CREATE INDEX IF NOT EXISTS idx_governance_proposals_category ON governance_proposals(category);
CREATE INDEX IF NOT EXISTS idx_governance_proposals_created ON governance_proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_governance_proposals_voting_deadline ON governance_proposals(voting_deadline) WHERE status = 'voting';
CREATE INDEX IF NOT EXISTS idx_governance_proposals_proposer ON governance_proposals(proposer_id);

CREATE INDEX IF NOT EXISTS idx_proposal_votes_proposal ON proposal_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_voter ON proposal_votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_created ON proposal_votes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposal_discussions_proposal ON proposal_discussions(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_discussions_parent ON proposal_discussions(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_proposal_discussions_created ON proposal_discussions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_meetings_date ON community_meetings(date DESC);
CREATE INDEX IF NOT EXISTS idx_community_meetings_type ON community_meetings(type);
CREATE INDEX IF NOT EXISTS idx_community_meetings_status ON community_meetings(status);

CREATE INDEX IF NOT EXISTS idx_governance_documents_type ON governance_documents(type);
CREATE INDEX IF NOT EXISTS idx_governance_documents_status ON governance_documents(status);
CREATE INDEX IF NOT EXISTS idx_governance_documents_meeting ON governance_documents(meeting_id) WHERE meeting_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_governance_documents_proposal ON governance_documents(proposal_id) WHERE proposal_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_governance_documents_public ON governance_documents(is_public, status) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_community_members_role ON community_members(role);
CREATE INDEX IF NOT EXISTS idx_community_members_verified ON community_members(verified);
CREATE INDEX IF NOT EXISTS idx_community_members_contribution ON community_members(contribution_score DESC);
CREATE INDEX IF NOT EXISTS idx_community_members_active ON community_members(last_active DESC);

CREATE INDEX IF NOT EXISTS idx_decision_records_proposal ON decision_records(proposal_id);
CREATE INDEX IF NOT EXISTS idx_decision_records_status ON decision_records(implementation_status);
CREATE INDEX IF NOT EXISTS idx_decision_records_implemented ON decision_records(implemented_date DESC);

CREATE INDEX IF NOT EXISTS idx_action_items_meeting ON action_items(meeting_id) WHERE meeting_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_action_items_assignee ON action_items(assignee_id) WHERE assignee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_due ON action_items(due_date) WHERE due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_governance_metrics_type_date ON governance_metrics(metric_type, metric_date DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_governance_proposals_fts ON governance_proposals 
  USING gin(to_tsvector('english', title || ' ' || description || ' ' || justification));

CREATE INDEX IF NOT EXISTS idx_proposal_discussions_fts ON proposal_discussions 
  USING gin(to_tsvector('english', content));

-- Triggers for updating timestamps
CREATE TRIGGER update_governance_proposals_updated_at 
  BEFORE UPDATE ON governance_proposals 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_proposal_discussions_updated_at 
  BEFORE UPDATE ON proposal_discussions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_community_meetings_updated_at 
  BEFORE UPDATE ON community_meetings 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_governance_documents_updated_at 
  BEFORE UPDATE ON governance_documents 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_community_members_updated_at 
  BEFORE UPDATE ON community_members 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_decision_records_updated_at 
  BEFORE UPDATE ON decision_records 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at 
  BEFORE UPDATE ON action_items 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Views for common governance queries
CREATE OR REPLACE VIEW governance_proposals_with_votes AS
SELECT 
  gp.*,
  COALESCE(vote_counts.votes_for, 0) as votes_for,
  COALESCE(vote_counts.votes_against, 0) as votes_against,
  COALESCE(vote_counts.votes_abstain, 0) as votes_abstain,
  COALESCE(vote_counts.total_votes, 0) as total_votes,
  CASE 
    WHEN cm.total_eligible_voters > 0 
    THEN (COALESCE(vote_counts.total_votes, 0)::decimal / cm.total_eligible_voters * 100)
    ELSE 0 
  END as participation_rate,
  COALESCE(discussion_counts.discussion_count, 0) as discussion_count
FROM governance_proposals gp
LEFT JOIN (
  SELECT 
    proposal_id,
    COUNT(*) FILTER (WHERE vote = 'for') as votes_for,
    COUNT(*) FILTER (WHERE vote = 'against') as votes_against,
    COUNT(*) FILTER (WHERE vote = 'abstain') as votes_abstain,
    COUNT(*) as total_votes
  FROM proposal_votes
  GROUP BY proposal_id
) vote_counts ON gp.id = vote_counts.proposal_id
LEFT JOIN (
  SELECT 
    proposal_id,
    COUNT(*) as discussion_count
  FROM proposal_discussions
  GROUP BY proposal_id
) discussion_counts ON gp.id = discussion_counts.proposal_id
CROSS JOIN (
  SELECT COUNT(*) as total_eligible_voters 
  FROM community_members 
  WHERE verified = true AND role != 'founder'
) cm;

CREATE OR REPLACE VIEW active_proposals AS
SELECT * FROM governance_proposals_with_votes 
WHERE status IN ('discussion', 'voting')
ORDER BY 
  CASE status 
    WHEN 'voting' THEN 1 
    WHEN 'discussion' THEN 2 
    ELSE 3 
  END,
  voting_deadline ASC NULLS LAST,
  created_at DESC;

CREATE OR REPLACE VIEW upcoming_meetings AS
SELECT * FROM community_meetings 
WHERE date > NOW() AND status = 'scheduled'
ORDER BY date ASC;

CREATE OR REPLACE VIEW recent_decisions AS
SELECT 
  dr.*,
  gp.title as proposal_title,
  gp.category as proposal_category
FROM decision_records dr
JOIN governance_proposals gp ON dr.proposal_id = gp.id
ORDER BY dr.implemented_date DESC;

-- Functions for governance operations
CREATE OR REPLACE FUNCTION calculate_proposal_stats()
RETURNS TABLE(
  total_proposals BIGINT,
  active_proposals BIGINT,
  approved_proposals BIGINT,
  average_participation DECIMAL(5,2),
  total_eligible_voters BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_proposals,
    COUNT(*) FILTER (WHERE status IN ('discussion', 'voting')) as active_proposals,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_proposals,
    AVG(
      CASE 
        WHEN cm.total_eligible > 0 
        THEN (vote_counts.total_votes::decimal / cm.total_eligible * 100)
        ELSE 0 
      END
    )::decimal(5,2) as average_participation,
    MAX(cm.total_eligible) as total_eligible_voters
  FROM governance_proposals gp
  LEFT JOIN (
    SELECT proposal_id, COUNT(*) as total_votes
    FROM proposal_votes
    GROUP BY proposal_id
  ) vote_counts ON gp.id = vote_counts.proposal_id
  CROSS JOIN (
    SELECT COUNT(*) as total_eligible 
    FROM community_members 
    WHERE verified = true
  ) cm;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_member_participation_score(member_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  participation_score DECIMAL(5,2) := 0;
  total_proposals BIGINT;
  member_votes BIGINT;
  member_proposals BIGINT;
  member_discussions BIGINT;
BEGIN
  -- Get total number of proposals the member could have voted on
  SELECT COUNT(*) INTO total_proposals
  FROM governance_proposals
  WHERE status IN ('voting', 'approved', 'rejected')
    AND created_at >= (
      SELECT created_at FROM community_members WHERE id = member_id
    );

  -- Get member's voting participation
  SELECT COUNT(*) INTO member_votes
  FROM proposal_votes pv
  JOIN governance_proposals gp ON pv.proposal_id = gp.id
  WHERE pv.voter_id = member_id
    AND gp.status IN ('voting', 'approved', 'rejected');

  -- Get member's proposal submissions
  SELECT COUNT(*) INTO member_proposals
  FROM governance_proposals
  WHERE proposer_id = member_id;

  -- Get member's discussion participation
  SELECT COUNT(*) INTO member_discussions
  FROM proposal_discussions
  WHERE user_id = member_id;

  -- Calculate participation score (0-100)
  IF total_proposals > 0 THEN
    participation_score := (
      (member_votes::decimal / total_proposals * 40) +  -- 40% for voting
      (LEAST(member_proposals, 5) * 10) +               -- 10% per proposal (max 50%)
      (LEAST(member_discussions, 10) * 1)               -- 1% per discussion (max 10%)
    );
  END IF;

  RETURN LEAST(participation_score, 100.00);
END;
$$ LANGUAGE plpgsql;

-- Function to update member statistics
CREATE OR REPLACE FUNCTION update_member_stats()
RETURNS VOID AS $$
BEGIN
  UPDATE community_members SET
    proposals_submitted = (
      SELECT COUNT(*) FROM governance_proposals 
      WHERE proposer_id = community_members.id
    ),
    votes_cast = (
      SELECT COUNT(*) FROM proposal_votes 
      WHERE voter_id = community_members.id
    ),
    contribution_score = get_member_participation_score(community_members.id);
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update proposal status based on voting deadline
CREATE OR REPLACE FUNCTION update_proposal_statuses()
RETURNS VOID AS $$
BEGIN
  -- Move voting proposals past deadline to approved/rejected based on results
  UPDATE governance_proposals SET
    status = CASE
      WHEN (
        SELECT COUNT(*) FILTER (WHERE vote = 'for') * 1.0 / 
               NULLIF(COUNT(*), 0) 
        FROM proposal_votes 
        WHERE proposal_id = governance_proposals.id
      ) >= 0.5 THEN 'approved'
      ELSE 'rejected'
    END
  WHERE status = 'voting' 
    AND voting_deadline < NOW()
    AND (
      SELECT COUNT(*) FROM proposal_votes 
      WHERE proposal_id = governance_proposals.id
    ) >= (min_participation_rate / 100.0 * (
      SELECT COUNT(*) FROM community_members WHERE verified = true
    ));
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access for published/approved content
CREATE POLICY "Public read access for approved proposals" ON governance_proposals
  FOR SELECT USING (status IN ('approved', 'voting', 'discussion', 'implemented'));

CREATE POLICY "Public read access for proposal discussions" ON proposal_discussions
  FOR SELECT USING (NOT is_moderated);

CREATE POLICY "Public read access for completed meetings" ON community_meetings
  FOR SELECT USING (status = 'completed');

CREATE POLICY "Public read access for public documents" ON governance_documents
  FOR SELECT USING (is_public = true AND status = 'published');

CREATE POLICY "Public read access for member profiles" ON community_members
  FOR SELECT USING (public_profile = true);

CREATE POLICY "Public read access for decision records" ON decision_records
  FOR SELECT USING (true);

CREATE POLICY "Public read access for governance metrics" ON governance_metrics
  FOR SELECT USING (true);

-- Authenticated user policies
CREATE POLICY "Members can create proposals" ON governance_proposals
  FOR INSERT WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Members can vote on proposals" ON proposal_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Members can participate in discussions" ON proposal_discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update their own profile" ON community_members
  FOR UPDATE USING (auth.uid() = id);

-- Admin/Moderator policies (you'll need to customize based on your role system)
CREATE POLICY "Moderators can manage proposals" ON governance_proposals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM community_members 
      WHERE id = auth.uid() 
      AND role IN ('moderator', 'council', 'founder')
    )
  );

-- Insert some sample community values for reference
INSERT INTO governance_metrics (metric_type, metric_value, metadata) VALUES
('community_values_alignment', 95.0, '{"description": "Percentage of proposals aligned with community values"}'),
('democratic_participation', 73.5, '{"description": "Average participation rate in governance decisions"}'),
('transparency_score', 98.0, '{"description": "Transparency rating based on open processes"}'),
('member_satisfaction', 87.2, '{"description": "Community satisfaction with governance processes"}')
ON CONFLICT (metric_type, metric_date, period) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE governance_proposals IS 'Community governance proposals for democratic decision-making';
COMMENT ON TABLE proposal_votes IS 'Individual votes on governance proposals with transparency';
COMMENT ON TABLE proposal_discussions IS 'Community discussions on governance proposals';
COMMENT ON TABLE community_meetings IS 'Official community meetings and assemblies';
COMMENT ON TABLE governance_documents IS 'Official documents, meeting minutes, and governance records';
COMMENT ON TABLE community_members IS 'Extended community member profiles and participation metrics';
COMMENT ON TABLE decision_records IS 'Records of implemented governance decisions and their outcomes';
COMMENT ON TABLE action_items IS 'Action items from meetings and proposal implementations';
COMMENT ON TABLE governance_metrics IS 'Analytics and metrics for governance transparency';

COMMENT ON FUNCTION calculate_proposal_stats IS 'Calculate overall governance statistics for dashboard display';
COMMENT ON FUNCTION get_member_participation_score IS 'Calculate individual member participation score (0-100)';
COMMENT ON FUNCTION update_member_stats IS 'Update all member participation statistics';
COMMENT ON FUNCTION update_proposal_statuses IS 'Automatically update proposal statuses based on voting results';