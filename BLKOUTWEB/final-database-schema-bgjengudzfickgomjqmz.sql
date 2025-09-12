-- Final Database Schema for Project: bgjengudzfickgomjqmz
-- URL: https://bgjengudzfickgomjqmz.supabase.co
-- Purpose: Enable moderation → publication pipeline for Chrome extension content

-- =====================================================
-- STEP 1: UPDATE EXISTING TABLES FOR MODERATION SUPPORT
-- =====================================================

-- Add moderation columns to existing events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'chrome_extension';

-- Add moderation columns to existing newsroom_articles table
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published'));
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
ALTER TABLE newsroom_articles ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'chrome_extension';

-- =====================================================
-- STEP 2: CREATE PUBLISHED CONTENT TABLES
-- =====================================================

-- Published events for approved community events
CREATE TABLE IF NOT EXISTS published_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_event_id UUID REFERENCES events(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Published news articles for approved news content  
CREATE TABLE IF NOT EXISTS published_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_article_id UUID REFERENCES newsroom_articles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- General published articles for other Chrome extension content
CREATE TABLE IF NOT EXISTS published_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_content_id UUID, -- Generic reference for other content
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- =====================================================
-- STEP 3: CREATE AUDIT AND LOGGING TABLES
-- =====================================================

-- Moderation action audit log
CREATE TABLE IF NOT EXISTS moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_table TEXT NOT NULL, -- 'events' or 'newsroom_articles'
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'edited', 'archived')),
  moderator_id UUID REFERENCES auth.users(id),
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Publication tracking log
CREATE TABLE IF NOT EXISTS publication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  published_id UUID NOT NULL,
  published_table TEXT NOT NULL, -- 'published_events', 'published_news', 'published_articles'
  original_id UUID NOT NULL,
  original_table TEXT NOT NULL, -- 'events' or 'newsroom_articles'
  approved_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- =====================================================
-- STEP 4: CREATE CURATOR INTEREST TABLE (Google Slides)
-- =====================================================

CREATE TABLE IF NOT EXISTS curator_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'onboarded', 'declined')),
  contacted_at TIMESTAMPTZ,
  onboarded_at TIMESTAMPTZ,
  metadata JSONB
);

-- =====================================================
-- STEP 5: CREATE PERFORMANCE INDEXES
-- =====================================================

-- Indexes for existing tables
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_approved_by ON events(approved_by);
CREATE INDEX IF NOT EXISTS idx_newsroom_articles_status ON newsroom_articles(status);
CREATE INDEX IF NOT EXISTS idx_newsroom_articles_approved_by ON newsroom_articles(approved_by);

-- Indexes for published content tables
CREATE INDEX IF NOT EXISTS idx_published_events_published_at ON published_events(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_events_event_date ON published_events(event_date);
CREATE INDEX IF NOT EXISTS idx_published_events_status ON published_events(status);
CREATE INDEX IF NOT EXISTS idx_published_news_published_at ON published_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_news_status ON published_news(status);
CREATE INDEX IF NOT EXISTS idx_published_articles_published_at ON published_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_articles_status ON published_articles(status);

-- Indexes for audit tables
CREATE INDEX IF NOT EXISTS idx_moderation_log_content_id ON moderation_log(content_id);
CREATE INDEX IF NOT EXISTS idx_moderation_log_content_table ON moderation_log(content_table);
CREATE INDEX IF NOT EXISTS idx_publication_log_published_id ON publication_log(published_id);
CREATE INDEX IF NOT EXISTS idx_publication_log_original_id ON publication_log(original_id);

-- Indexes for curator interest
CREATE INDEX IF NOT EXISTS idx_curator_interest_email ON curator_interest(email);
CREATE INDEX IF NOT EXISTS idx_curator_interest_status ON curator_interest(status);
CREATE INDEX IF NOT EXISTS idx_curator_interest_created_at ON curator_interest(created_at DESC);

-- =====================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE published_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE curator_interest ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 7: CREATE RLS POLICIES
-- =====================================================

-- Published content: Public can read published, authenticated can manage
CREATE POLICY "Public can view published events" ON published_events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published news" ON published_news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published articles" ON published_articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage published events" ON published_events
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage published news" ON published_news
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage published articles" ON published_articles
  FOR ALL USING (auth.role() = 'authenticated');

-- Moderation and publication logs: Authenticated users only
CREATE POLICY "Moderators can view moderation log" ON moderation_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert moderation log" ON moderation_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Moderators can view publication log" ON publication_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert publication log" ON publication_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Curator interest: Public can signup, authenticated can view
CREATE POLICY "Anyone can express curator interest" ON curator_interest
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view curator interest" ON curator_interest
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update curator interest" ON curator_interest
  FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 8: CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to published content tables
CREATE TRIGGER update_published_events_updated_at 
  BEFORE UPDATE ON published_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_news_updated_at 
  BEFORE UPDATE ON published_news 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_articles_updated_at 
  BEFORE UPDATE ON published_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 9: GRANT PERMISSIONS
-- =====================================================

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT SELECT ON events, newsroom_articles TO anon;
GRANT SELECT ON published_events, published_news, published_articles TO anon;
GRANT ALL ON events, newsroom_articles TO authenticated;
GRANT ALL ON published_events, published_news, published_articles TO authenticated;
GRANT ALL ON moderation_log, publication_log, curator_interest TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- STEP 10: SUCCESS VERIFICATION
-- =====================================================

-- Verify tables exist and show success message
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('events', 'newsroom_articles', 'published_events', 'published_news', 'published_articles', 'moderation_log', 'publication_log', 'curator_interest');
    
    RAISE NOTICE 'Publication pipeline setup complete for project bgjengudzfickgomjqmz!';
    RAISE NOTICE 'Tables configured: % of 8 required tables', table_count;
    RAISE NOTICE 'Chrome extension content can now flow: events/newsroom_articles → moderation → publication → community display';
    RAISE NOTICE 'Next step: Update your publication service to use "events" and "newsroom_articles" as source tables';
END $$;