import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const STORAGE_FILE = 'categories.json';

export const DEFAULT_CATEGORIES = [
  'Mediterranean',
  'Cultural',
  'Alpine Nature',
  'Luxury Escapes',
  'Trending',
  'Honeymoon',
  'Family Holidays',
  'Adventure',
  'Beach & Islands',
  'Wildlife & Safari',
  'Spiritual & Heritage',
  'Budget Friendly',
  'Group Tours',
  'Weekend Getaways',
  'Visa-Free / Easy Visa'
];

async function ensureBucket() {
  if (!supabase) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some(b => b.name === STORAGE_BUCKET)) {
      await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
    }
  } catch {}
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // GET: Fetch active package categories
  if (req.method === 'GET') {
    if (!supabase) {
      return res.status(200).json({ success: true, categories: DEFAULT_CATEGORIES, source: 'default' });
    }
    try {
      const { data: fileBlob, error: downloadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(STORAGE_FILE);

      if (fileBlob && !downloadErr) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : (parsed?.categories || null);
        if (Array.isArray(list) && list.length > 0) {
          return res.status(200).json({ success: true, categories: list, source: 'cloud' });
        }
      }
      return res.status(200).json({ success: true, categories: DEFAULT_CATEGORIES, source: 'default' });
    } catch (err) {
      return res.status(200).json({ success: true, categories: DEFAULT_CATEGORIES, source: 'default' });
    }
  }

  // POST: Save updated package categories
  if (req.method === 'POST') {
    const categories = req.body?.categories;
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid categories payload. Expected an array of category names.' });
    }

    if (!supabase) {
      return res.status(200).json({ success: true, categories, source: 'local-only' });
    }

    try {
      await ensureBucket();
      const jsonBody = JSON.stringify({
        updatedAt: new Date().toISOString(),
        categories
      });

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(STORAGE_FILE, Buffer.from(jsonBody, 'utf8'), {
          contentType: 'application/json',
          upsert: true,
          cacheControl: '0'
        });

      if (uploadErr) throw uploadErr;

      return res.status(200).json({ success: true, categories, source: 'cloud' });
    } catch (err) {
      console.error('Error saving categories to Supabase storage:', err);
      return res.status(500).json({ success: false, message: err.message || 'Failed to save categories.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
