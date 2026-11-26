-- ==============================================================================
-- ZENTREVO TRAVEL CO. - PWA APP INSTALL TRACKING SCHEMA (SUPABASE POSTGRESQL)
-- Run this in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pwa_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  platform TEXT,
  user_agent TEXT,
  client_id TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One tracked install per device/browser client_id
CREATE UNIQUE INDEX IF NOT EXISTS pwa_installs_client_id_uidx
  ON public.pwa_installs (client_id)
  WHERE client_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS pwa_installs_installed_at_idx
  ON public.pwa_installs (installed_at DESC);

ALTER TABLE public.pwa_installs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert pwa installs" ON public.pwa_installs;
DROP POLICY IF EXISTS "Allow public read pwa installs" ON public.pwa_installs;
DROP POLICY IF EXISTS "Allow full access pwa installs" ON public.pwa_installs;

-- Public insert so the install prompt can record events
CREATE POLICY "Allow public insert pwa installs"
  ON public.pwa_installs
  FOR INSERT
  WITH CHECK (true);

-- Public read for admin dashboard (same pattern as other Zentrevo tables)
CREATE POLICY "Allow public read pwa installs"
  ON public.pwa_installs
  FOR SELECT
  USING (true);
