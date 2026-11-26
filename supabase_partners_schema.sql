-- ==============================================================================
-- ZENTREVO TRAVEL CO. - PARTNERS SCHEMA (SUPABASE POSTGRESQL)
-- Run this in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.partners (
  id BIGINT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  name TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  website TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant table access to Supabase API roles (fixes: permission denied for table partners)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.partners TO anon, authenticated, service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to partners" ON public.partners;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON public.partners;
DROP POLICY IF EXISTS "Allow service role full access to partners" ON public.partners;

-- Allow public read access to all visitors
CREATE POLICY "Allow public read access to partners"
  ON public.partners
  FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

-- Allow full write, update, delete for API roles (admin sync via service/anon key)
CREATE POLICY "Allow full access to authenticated users"
  ON public.partners
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Seed dummy partners (safe to re-run: only inserts when table is empty)
INSERT INTO public.partners (id, sort_order, name, tagline, logo, website, active)
SELECT * FROM (VALUES
  (1001::bigint, 0, 'Taj Hotels', 'Heritage Luxury Stays', 'https://logo.clearbit.com/tajhotels.com', 'https://www.tajhotels.com', true),
  (1002::bigint, 1, 'Emirates', 'Premium Global Flights', 'https://logo.clearbit.com/emirates.com', 'https://www.emirates.com', true),
  (1003::bigint, 2, 'IndiGo', 'Pan-India Connectivity', 'https://logo.clearbit.com/goindigo.in', 'https://www.goindigo.in', true),
  (1004::bigint, 3, 'Booking.com', 'Worldwide Stays Network', 'https://logo.clearbit.com/booking.com', 'https://www.booking.com', true),
  (1005::bigint, 4, 'Agoda', 'Asia Stay Partners', 'https://logo.clearbit.com/agoda.com', 'https://www.agoda.com', true),
  (1006::bigint, 5, 'Hertz', 'Private Fleet Transfers', 'https://logo.clearbit.com/hertz.com', 'https://www.hertz.com', true),
  (1007::bigint, 6, 'MakeMyTrip', 'India Travel Network', 'https://logo.clearbit.com/makemytrip.com', 'https://www.makemytrip.com', true),
  (1008::bigint, 7, 'Airbnb', 'Boutique Homes & Villas', 'https://logo.clearbit.com/airbnb.com', 'https://www.airbnb.com', true)
) AS seed(id, sort_order, name, tagline, logo, website, active)
WHERE NOT EXISTS (SELECT 1 FROM public.partners LIMIT 1);
