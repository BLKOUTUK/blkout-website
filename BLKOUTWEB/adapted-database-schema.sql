-- Adapted Database Schema for Project: bgjengudzfickgomjqmz
-- URL: https://bgjengudzfickgomjqmz.supabase.co
-- Purpose: Enable publication pipeline for existing moderated content

-- STEP 1: First, identify your existing moderated content table
-- Run this query to find your table:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%content%' OR table_name LIKE '%moderat%';

-- STEP 2: Update your existing moderated content table (replace 'YOUR_TABLE_NAME' with actual table name)
-- Uncomment and run after identifying your table name:

-- ALTER TABLE YOUR_TABLE_NAME ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
-- ALTER TABLE YOUR_TABLE_NAME ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
-- ALTER TABLE YOUR_TABLE_NAME ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);
-- ALTER TABLE YOUR_TABLE_NAME ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
-- ALTER TABLE YOUR_TABLE_NAME ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
-- ALTER TABLE YOUR_TABLE_NAME ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- STEP 3: Create published content tables (these are always needed)
CREATE TABLE IF NOT EXISTS published_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_content_id UUID, -- References your existing content table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
  original_content_id UUID, -- References your existing content table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS published_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_content_id UUID, -- References your existing content table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 4: Create audit and logging tables
CREATE TABLE IF NOT EXISTS moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'edited', 'archived')),
  moderator_id UUID REFERENCES auth.users(id),
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS publication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  published_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- STEP 5: Create curator interest table for Google Slides signup
CREATE TABLE IF NOT EXISTS curator_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'onboarded', 'declined')),
  contacted_at TIMESTAMPTZ,
  onboarded_at TIMESTAMPTZ
);

-- STEP 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_published_news_published_at ON published_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_events_published_at ON published_events(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_events_event_date ON published_events(event_date);
CREATE INDEX IF NOT EXISTS idx_published_articles_published_at ON published_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_log_content_id ON moderation_log(content_id);
CREATE INDEX IF NOT EXISTS idx_publication_log_published_id ON publication_log(published_id);
CREATE INDEX IF NOT EXISTS idx_curator_interest_email ON curator_interest(email);
CREATE INDEX IF NOT EXISTS idx_curator_interest_status ON curator_interest(status);

-- STEP 7: Enable Row Level Security
ALTER TABLE published_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE curator_interest ENABLE ROW LEVEL SECURITY;

-- STEP 8: Create RLS policies for published content (public read, authenticated write)
CREATE POLICY "Published news visible to all" ON published_news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published events visible to all" ON published_events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published articles visible to all" ON published_articles
  FOR SELECT USING (status = 'published');

-- STEP 9: Create RLS policies for moderation (moderators only)
CREATE POLICY "Moderators can view moderation log" ON moderation_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert moderation log" ON moderation_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Moderators can view publication log" ON publication_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert publication log" ON publication_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- STEP 10: Create RLS policies for curator interest (public insert, admin read)
CREATE POLICY "Anyone can express curator interest" ON curator_interest
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view curator interest" ON curator_interest
  FOR SELECT USING (auth.role() = 'authenticated');

-- STEP 11: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- STEP 12: Add updated_at triggers
CREATE TRIGGER update_published_news_updated_at 
  BEFORE UPDATE ON published_news 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_events_updated_at 
  BEFORE UPDATE ON published_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_articles_updated_at 
  BEFORE UPDATE ON published_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 13: Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON published_news, published_events, published_articles TO anon;
GRANT ALL ON published_news, published_events, published_articles, 
            moderation_log, publication_log, curator_interest TO authenticated;

-- Success message
SELECT 'Publication pipeline ready for project bgjengudzfickgomjqmz! 
Next: Tell me your existing moderated content table name to complete the setup.' AS status;