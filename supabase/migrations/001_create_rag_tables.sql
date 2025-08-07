-- Enable vector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Content sources table
CREATE TABLE IF NOT EXISTS content_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('rss', 'website', 'api', 'social')),
  url TEXT NOT NULL UNIQUE,
  name VARCHAR(255),
  credibility_score DECIMAL(3,2) DEFAULT 0.5 CHECK (credibility_score >= 0 AND credibility_score <= 1),
  check_interval INTEGER DEFAULT 3600 CHECK (check_interval >= 300), -- Minimum 5 minutes
  last_checked TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  community_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content items table with vector embeddings
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES content_sources(id) ON DELETE SET NULL,
  original_url TEXT,
  title TEXT NOT NULL CHECK (length(title) >= 5),
  description TEXT,
  content TEXT,
  author VARCHAR(255),
  category VARCHAR(50),
  subcategory VARCHAR(100),
  relevance_score DECIMAL(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'rejected', 'archived')),
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Content tags table (both AI and community generated)
CREATE TABLE IF NOT EXISTS content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  tag_type VARCHAR(50) DEFAULT 'general',
  confidence DECIMAL(3,2) DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
  source VARCHAR(20) DEFAULT 'ai' CHECK (source IN ('ai', 'community', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, tag)
);

-- Approval queue for manual review
CREATE TABLE IF NOT EXISTS approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  assigned_to UUID, -- Reference to user/admin
  issues JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community feedback and ratings
CREATE TABLE IF NOT EXISTS content_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  user_id UUID, -- Reference to user
  feedback_type VARCHAR(20) CHECK (feedback_type IN ('like', 'dislike', 'report', 'improve')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_community_member BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content analytics and metrics
CREATE TABLE IF NOT EXISTS content_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, metric_type, date)
);

-- Search queries log for improving recommendations
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  user_id UUID, -- Reference to user (optional)
  results_count INTEGER DEFAULT 0,
  clicked_results JSONB DEFAULT '[]'::jsonb,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_content_sources_active ON content_sources(is_active, last_checked);
CREATE INDEX IF NOT EXISTS idx_content_sources_type ON content_sources(type);

CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_content_items_created ON content_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_relevance ON content_items(relevance_score DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_content_items_source ON content_items(source_id);

-- Vector similarity index for semantic search
CREATE INDEX IF NOT EXISTS idx_content_embedding ON content_items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_content_tags_content ON content_tags(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag ON content_tags(tag);
CREATE INDEX IF NOT EXISTS idx_content_tags_type ON content_tags(tag_type);

CREATE INDEX IF NOT EXISTS idx_approval_queue_status ON approval_queue(status, priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_approval_queue_content ON approval_queue(content_id);

CREATE INDEX IF NOT EXISTS idx_content_feedback_content ON content_feedback(content_id);
CREATE INDEX IF NOT EXISTS idx_content_feedback_type ON content_feedback(feedback_type);

CREATE INDEX IF NOT EXISTS idx_content_metrics_content ON content_metrics(content_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_content_metrics_type ON content_metrics(metric_type, date DESC);

CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_content_items_fts ON content_items USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')));

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_sources_updated_at 
  BEFORE UPDATE ON content_sources 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at 
  BEFORE UPDATE ON content_items 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_approval_queue_updated_at 
  BEFORE UPDATE ON approval_queue 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Views for common queries
CREATE OR REPLACE VIEW content_with_tags AS
SELECT 
  ci.*,
  COALESCE(
    json_agg(
      json_build_object(
        'tag', ct.tag,
        'type', ct.tag_type,
        'confidence', ct.confidence,
        'source', ct.source
      )
    ) FILTER (WHERE ct.tag IS NOT NULL), 
    '[]'::json
  ) AS tags
FROM content_items ci
LEFT JOIN content_tags ct ON ci.id = ct.content_id
GROUP BY ci.id;

CREATE OR REPLACE VIEW published_content AS
SELECT * FROM content_with_tags 
WHERE status = 'published' 
ORDER BY published_at DESC;

CREATE OR REPLACE VIEW high_quality_content AS
SELECT * FROM content_with_tags 
WHERE status = 'published' 
  AND relevance_score >= 0.7 
  AND quality_score >= 0.8
ORDER BY relevance_score DESC, quality_score DESC;

-- Functions for content management
CREATE OR REPLACE FUNCTION get_similar_content(target_embedding vector(1536), similarity_threshold decimal DEFAULT 0.7, max_results integer DEFAULT 10)
RETURNS TABLE(
  id UUID,
  title TEXT,
  category VARCHAR(50),
  similarity DECIMAL(3,2),
  published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.title,
    ci.category,
    (1 - (ci.embedding <=> target_embedding))::decimal(3,2) AS similarity,
    ci.published_at
  FROM content_items ci
  WHERE ci.status = 'published'
    AND ci.embedding IS NOT NULL
    AND (1 - (ci.embedding <=> target_embedding)) >= similarity_threshold
  ORDER BY ci.embedding <=> target_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function to update content metrics
CREATE OR REPLACE FUNCTION update_content_metric(
  p_content_id UUID,
  p_metric_type VARCHAR(50),
  p_metric_value DECIMAL(10,2),
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO content_metrics (content_id, metric_type, metric_value, date)
  VALUES (p_content_id, p_metric_type, p_metric_value, p_date)
  ON CONFLICT (content_id, metric_type, date)
  DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert some community-verified default sources
INSERT INTO content_sources (type, url, name, credibility_score, check_interval, is_active, community_verified) VALUES
('rss', 'https://feeds.theguardian.com/theguardian/world/rss', 'The Guardian - World News', 0.85, 1800, true, true),
('rss', 'https://www.advocate.com/feeds/all.rss', 'The Advocate - LGBTQ News', 0.90, 3600, true, true),
('website', 'https://www.blacklivesmatter.com', 'Black Lives Matter', 0.95, 7200, true, true),
('rss', 'https://rss.cnn.com/rss/edition.rss', 'CNN - Latest News', 0.75, 3600, true, false),
('website', 'https://www.eventbrite.co.uk/d/united-kingdom--london/lgbtq/', 'Eventbrite - LGBTQ Events London', 0.70, 7200, true, false)
ON CONFLICT (url) DO NOTHING;

-- Permissions (assuming RLS is enabled)
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access for published content" ON content_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for content tags" ON content_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_items ci 
      WHERE ci.id = content_tags.content_id 
      AND ci.status = 'published'
    )
  );

CREATE POLICY "Public read access for content sources" ON content_sources
  FOR SELECT USING (is_active = true);

-- Admin access (you'll need to customize based on your auth system)
CREATE POLICY "Admin full access" ON content_sources FOR ALL USING (true);
CREATE POLICY "Admin full access" ON content_items FOR ALL USING (true);
CREATE POLICY "Admin full access" ON content_tags FOR ALL USING (true);
CREATE POLICY "Admin full access" ON approval_queue FOR ALL USING (true);
CREATE POLICY "Admin full access" ON content_feedback FOR ALL USING (true);
CREATE POLICY "Admin full access" ON content_metrics FOR ALL USING (true);
CREATE POLICY "Admin full access" ON search_queries FOR ALL USING (true);

COMMENT ON TABLE content_sources IS 'Sources from which content is automatically discovered and scraped';
COMMENT ON TABLE content_items IS 'All content items with vector embeddings for semantic search';
COMMENT ON TABLE content_tags IS 'Tags for content items, generated by AI or community';
COMMENT ON TABLE approval_queue IS 'Queue for manual review of content that requires human oversight';
COMMENT ON TABLE content_feedback IS 'Community feedback and ratings on content quality and relevance';
COMMENT ON TABLE content_metrics IS 'Analytics and performance metrics for content items';
COMMENT ON TABLE search_queries IS 'Log of search queries for improving content recommendations';

COMMENT ON COLUMN content_items.embedding IS 'Vector embedding for semantic similarity search using OpenAI text-embedding-3-small';
COMMENT ON COLUMN content_items.relevance_score IS 'AI-calculated relevance to BLKOUT community interests (0-1)';
COMMENT ON COLUMN content_items.confidence_score IS 'AI confidence in classification and analysis (0-1)';
COMMENT ON COLUMN content_items.quality_score IS 'Overall quality score based on multiple factors (0-1)';

COMMENT ON INDEX idx_content_embedding IS 'IVFFlat index for fast approximate nearest neighbor search on embeddings';
COMMENT ON FUNCTION get_similar_content IS 'Find content similar to a given embedding vector using cosine similarity';
COMMENT ON FUNCTION update_content_metric IS 'Upsert content metrics with automatic timestamp handling';