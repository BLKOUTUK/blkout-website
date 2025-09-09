-- Database Schema Updates for Publication Pipeline
-- Execute in Supabase SQL Editor to enable moderation → publication workflow

-- 1. Add new columns to existing moderation_queue table
ALTER TABLE moderation_queue ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE moderation_queue ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE moderation_queue ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);
ALTER TABLE moderation_queue ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE moderation_queue ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE moderation_queue ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. Create published_news table for approved news content
CREATE TABLE IF NOT EXISTS published_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_moderation_id UUID REFERENCES moderation_queue(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create published_events table for approved event content
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
  original_moderation_id UUID REFERENCES moderation_queue(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create published_articles table for approved article content
CREATE TABLE IF NOT EXISTS published_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  source TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  original_moderation_id UUID REFERENCES moderation_queue(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create moderation_log table for audit trail
CREATE TABLE IF NOT EXISTS moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'edited', 'archived')),
  moderator_id UUID REFERENCES auth.users(id),
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- 6. Create publication_log table for publication tracking
CREATE TABLE IF NOT EXISTS publication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  published_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- 7. Create curator_interest table for Google Slides signup
CREATE TABLE IF NOT EXISTS curator_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'onboarded', 'declined')),
  contacted_at TIMESTAMPTZ,
  onboarded_at TIMESTAMPTZ
);

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_approved_by ON moderation_queue(approved_by);
CREATE INDEX IF NOT EXISTS idx_published_news_published_at ON published_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_events_published_at ON published_events(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_events_event_date ON published_events(event_date);
CREATE INDEX IF NOT EXISTS idx_published_articles_published_at ON published_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_log_content_id ON moderation_log(content_id);
CREATE INDEX IF NOT EXISTS idx_publication_log_published_id ON publication_log(published_id);
CREATE INDEX IF NOT EXISTS idx_curator_interest_email ON curator_interest(email);
CREATE INDEX IF NOT EXISTS idx_curator_interest_status ON curator_interest(status);

-- 9. Enable Row Level Security (RLS) on new tables
ALTER TABLE published_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE curator_interest ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for published content (public read, authenticated write)
CREATE POLICY "Published news visible to all" ON published_news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published events visible to all" ON published_events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Published articles visible to all" ON published_articles
  FOR SELECT USING (status = 'published');

-- 11. Create RLS policies for moderation (moderators only)
CREATE POLICY "Moderators can view moderation log" ON moderation_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert moderation log" ON moderation_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Moderators can view publication log" ON publication_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators can insert publication log" ON publication_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 12. Create RLS policies for curator interest (public insert, admin read)
CREATE POLICY "Anyone can express curator interest" ON curator_interest
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view curator interest" ON curator_interest
  FOR SELECT USING (auth.role() = 'authenticated');

-- 13. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Add updated_at triggers to published content tables
CREATE TRIGGER update_published_news_updated_at 
  BEFORE UPDATE ON published_news 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_events_updated_at 
  BEFORE UPDATE ON published_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_articles_updated_at 
  BEFORE UPDATE ON published_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON published_news, published_events, published_articles TO anon;
GRANT ALL ON moderation_queue, published_news, published_events, published_articles, 
            moderation_log, publication_log, curator_interest TO authenticated;

-- Success message
SELECT 'Publication pipeline database schema updated successfully! 
Chrome extension content can now flow: moderation → publication → community display' AS status;