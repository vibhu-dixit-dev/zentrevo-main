import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const SETTINGS_FILE = 'newsletter-settings.json';

export const DEFAULT_NEWSLETTER_SETTINGS = {
  schedule: {
    day: 'Monday',
    time: '10:00',
    label: 'Every Monday at 10:00 UTC'
  },
  sentCount: 1,
  lastSentSlot: '',
  updatedAt: null
};

function isMissingTableError(error) {
  if (!error) return false;
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    String(error.message || '').includes('Could not find the table')
  );
}

async function ensureCatalogBucket() {
  if (!supabase) return false;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = Array.isArray(buckets) && buckets.some((b) => b.name === STORAGE_BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(STORAGE_BUCKET, { public: false });
    }
    return true;
  } catch {
    return false;
  }
}

export async function readNewsletterSettings() {
  if (!supabase) {
    return { cloudConfigured: false, source: 'default', settings: { ...DEFAULT_NEWSLETTER_SETTINGS } };
  }

  // 1. Try native newsletter_settings table
  try {
    const { data, error } = await supabase
      .from('newsletter_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error) {
      if (data) {
        return {
          cloudConfigured: true,
          source: 'table',
          settings: {
            schedule: data.schedule || DEFAULT_NEWSLETTER_SETTINGS.schedule,
            sentCount: typeof data.sent_count === 'number' ? data.sent_count : DEFAULT_NEWSLETTER_SETTINGS.sentCount,
            lastSentSlot: data.last_sent_slot || '',
            updatedAt: data.updated_at || null
          }
        };
      }
    } else if (!isMissingTableError(error)) {
      console.warn('newsletter_settings table read notice:', error.message);
    }
  } catch (err) {
    console.warn('newsletter_settings table read exception:', err?.message);
  }

  // 2. Fallback to Supabase Storage snapshot
  try {
    const { data: fileData, error: dlErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(SETTINGS_FILE);

    if (!dlErr && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      return {
        cloudConfigured: true,
        source: 'storage',
        settings: {
          schedule: parsed.schedule || DEFAULT_NEWSLETTER_SETTINGS.schedule,
          sentCount: typeof parsed.sentCount === 'number' ? parsed.sentCount : DEFAULT_NEWSLETTER_SETTINGS.sentCount,
          lastSentSlot: parsed.lastSentSlot || '',
          updatedAt: parsed.updatedAt || null
        }
      };
    }
  } catch {}

  return {
    cloudConfigured: true,
    source: 'default',
    settings: { ...DEFAULT_NEWSLETTER_SETTINGS }
  };
}

export async function writeNewsletterSettings(patch = {}) {
  const currentRes = await readNewsletterSettings();
  const nextSettings = {
    schedule: patch.schedule || currentRes.settings.schedule || DEFAULT_NEWSLETTER_SETTINGS.schedule,
    sentCount:
      typeof patch.sentCount === 'number'
        ? Math.max(0, patch.sentCount)
        : currentRes.settings.sentCount,
    lastSentSlot:
      typeof patch.lastSentSlot === 'string'
        ? patch.lastSentSlot
        : currentRes.settings.lastSentSlot || '',
    updatedAt: new Date().toISOString()
  };

  if (!supabase) {
    return { cloudSaved: false, source: 'none', settings: nextSettings };
  }

  // 1. Try native newsletter_settings table first
  try {
    const { error } = await supabase.from('newsletter_settings').upsert([
      {
        id: 'default',
        schedule: nextSettings.schedule,
        sent_count: nextSettings.sentCount,
        last_sent_slot: nextSettings.lastSentSlot,
        updated_at: nextSettings.updatedAt
      }
    ]);
    if (!error) {
      return { cloudSaved: true, source: 'table', settings: nextSettings };
    }
    if (!isMissingTableError(error)) {
      console.warn('newsletter_settings table upsert notice:', error.message);
    }
  } catch (err) {
    console.warn('newsletter_settings table upsert exception:', err?.message);
  }

  // 2. Fallback to Supabase Storage snapshot
  try {
    await ensureCatalogBucket();
    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(SETTINGS_FILE, Buffer.from(JSON.stringify(nextSettings), 'utf8'), {
        contentType: 'application/json',
        upsert: true,
        cacheControl: '0'
      });
    if (!uploadErr) {
      return { cloudSaved: true, source: 'storage', settings: nextSettings };
    }
  } catch (err) {
    console.warn('newsletter_settings storage upload exception:', err?.message);
  }

  return { cloudSaved: false, source: 'error', settings: nextSettings };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const result = await readNewsletterSettings();
    return res.status(200).json({
      success: true,
      ...result
    });
  }

  if (req.method === 'POST') {
    try {
      const { schedule, sentCount, lastSentSlot } = req.body || {};
      const patch = {};
      if (schedule && typeof schedule === 'object') {
        const day = String(schedule.day || 'Monday');
        const time = String(schedule.time || '10:00');
        patch.schedule = {
          day,
          time,
          label: schedule.label || `Every ${day} at ${time} UTC`
        };
      }
      if (typeof sentCount === 'number' && !Number.isNaN(sentCount)) {
        patch.sentCount = sentCount;
      }
      if (typeof lastSentSlot === 'string') {
        patch.lastSentSlot = lastSentSlot;
      }

      const result = await writeNewsletterSettings(patch);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to update newsletter settings.'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
