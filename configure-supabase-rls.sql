-- Configure Supabase RLS policies to allow Chrome extension submissions
-- Run this in the Supabase SQL editor

-- Allow anonymous users to insert draft events
CREATE POLICY "Allow anonymous draft event submissions" 
ON events 
FOR INSERT 
TO anon 
WITH CHECK (status IN ('draft', 'pending'));

-- Allow anonymous users to insert draft articles  
CREATE POLICY "Allow anonymous draft article submissions"
ON newsroom_articles
FOR INSERT
TO anon
WITH CHECK (status IN ('draft', 'pending'));

-- Allow anonymous users to read their own submissions (optional - for extension feedback)
CREATE POLICY "Allow anonymous to read draft events"
ON events
FOR SELECT
TO anon
USING (status IN ('draft', 'pending'));

CREATE POLICY "Allow anonymous to read draft articles"
ON newsroom_articles
FOR SELECT
TO anon
USING (status IN ('draft', 'pending'));

-- Enable RLS on both tables (if not already enabled)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsroom_articles ENABLE ROW LEVEL SECURITY;