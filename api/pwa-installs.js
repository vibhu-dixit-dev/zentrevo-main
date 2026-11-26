import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function detectPlatform(userAgent = '') {
  const ua = String(userAgent || '');
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh|Mac OS/i.test(ua)) return 'macos';
  if (/Linux/i.test(ua)) return 'linux';
  return 'unknown';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!supabase) {
    return res.status(500).json({
      success: false,
      message: 'Supabase is not configured.'
    });
  }

  if (req.method === 'GET') {
    try {
      const { count, error: countError } = await supabase
        .from('pwa_installs')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return res.status(500).json({
          success: false,
          message: countError.message || 'Failed to load install count.',
          hint: 'Run supabase_pwa_installs_schema.sql in the Supabase SQL Editor.'
        });
      }

      const { data, error } = await supabase
        .from('pwa_installs')
        .select('id, installed_at, platform, source, user_agent, client_id')
        .order('installed_at', { ascending: false });

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Failed to load install history.'
        });
      }

      return res.status(200).json({
        success: true,
        count: typeof count === 'number' ? count : (data || []).length,
        installs: data || []
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Unexpected error loading PWA installs.'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const userAgent = String(body.userAgent || req.headers['user-agent'] || '').slice(0, 500);
      const platform = String(body.platform || detectPlatform(userAgent)).slice(0, 40);
      const source = String(body.source || 'unknown').slice(0, 60);
      const clientId = body.clientId ? String(body.clientId).slice(0, 120) : null;
      const installedAt = body.installedAt ? new Date(body.installedAt) : new Date();

      if (Number.isNaN(installedAt.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid installedAt timestamp.' });
      }

      const payload = {
        installed_at: installedAt.toISOString(),
        platform,
        user_agent: userAgent,
        client_id: clientId,
        source
      };

      const { data, error } = await supabase
        .from('pwa_installs')
        .insert([payload])
        .select('id, installed_at, platform, source')
        .maybeSingle();

      if (error) {
        // Duplicate client_id = already counted for this device
        if (error.code === '23505') {
          const { count } = await supabase
            .from('pwa_installs')
            .select('*', { count: 'exact', head: true });

          return res.status(200).json({
            success: true,
            duplicate: true,
            count: count || 0,
            message: 'Install already recorded for this device.'
          });
        }

        return res.status(500).json({
          success: false,
          message: error.message || 'Failed to record install.',
          hint: 'Run supabase_pwa_installs_schema.sql in the Supabase SQL Editor.'
        });
      }

      const { count } = await supabase
        .from('pwa_installs')
        .select('*', { count: 'exact', head: true });

      return res.status(200).json({
        success: true,
        duplicate: false,
        count: count || 0,
        install: data
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Unexpected error recording PWA install.'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
