-- ==============================================================================
-- ZENTREVO TRAVEL CO. - BLOGS & JOURNAL STORIES SCHEMA (SUPABASE POSTGRESQL)
-- Run this in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blogs (
  id BIGINT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  title TEXT NOT NULL,
  destination TEXT,
  category TEXT,
  date TEXT,
  read_time TEXT,
  author JSONB,
  image TEXT,
  image_alt TEXT,
  pull_quote TEXT,
  excerpt TEXT,
  content JSONB,
  highlights JSONB,
  translations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.blogs;
DROP POLICY IF EXISTS "Allow service role full access to blogs" ON public.blogs;

-- Allow public read access to all visitors worldwide
CREATE POLICY "Allow public read access to blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (true);

-- Allow full write, update, delete for service role and admin
CREATE POLICY "Allow full access to authenticated users" 
  ON public.blogs 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
