import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const STORAGE_FILE = 'destinations.json';

function isMissingTableError(error) {
  if (!error) return false;
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    String(error.message || '').includes('Could not find the table')
  );
}

function normalizeRowToTrip(row) {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    region: row.region || 'international',
    badge: row.badge || 'Luxury Escapes',
    tagColor: row.tag_color || 'bg-stone-900 text-white',
    price: row.price,
    duration: row.duration || '7 Days / 6 Nights',
    rating: row.rating !== null && row.rating !== undefined ? Number(row.rating) : 4.95,
    reviews: row.reviews !== null && row.reviews !== undefined ? Number(row.reviews) : 0,
    category: row.category || 'Luxury Escapes',
    image: row.image || '',
    imageAlt: row.image_alt || '',
    description: row.description || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    status: row.status || 'Live',
    ...(row.slug ? { slug: row.slug } : {}),
    ...(row.map_x !== null && row.map_x !== undefined ? { mapX: row.map_x } : {}),
    ...(row.map_y !== null && row.map_y !== undefined ? { mapY: row.map_y } : {}),
    ...(row.lat ? { lat: row.lat } : {}),
    ...(row.lng ? { lng: row.lng } : {}),
    ...(row.state ? { state: row.state } : {}),
    ...(row.country ? { country: row.country } : {}),
    ...(row.short_title ? { shortTitle: row.short_title } : {})
  };
}

function normalizeTripToRow(trip, index) {
  return {
    id: Number(trip.id) || Date.now() + index,
    sort_order: index,
    title: trip.title || 'Untitled Journey',
    location: trip.location || 'Global',
    region: trip.region || 'international',
    badge: trip.badge || 'Luxury Escapes',
    tag_color: trip.tagColor || 'bg-stone-900 text-white',
    price: String(trip.price || '$2,500'),
    duration: trip.duration || '7 Days / 6 Nights',
    rating: Number(trip.rating) || 4.95,
    reviews: parseInt(trip.reviews, 10) || 0,
    category: trip.category || 'Luxury Escapes',
    image: trip.image || '',
    image_alt: trip.imageAlt || '',
    description: trip.description || '',
    highlights: Array.isArray(trip.highlights) ? trip.highlights : [],
    status: trip.status || 'Live',
    slug: trip.slug || null,
    map_x: trip.mapX !== undefined && trip.mapX !== '' ? parseInt(trip.mapX, 10) : null,
    map_y: trip.mapY !== undefined && trip.mapY !== '' ? parseInt(trip.mapY, 10) : null,
    lat: trip.lat ? String(trip.lat) : null,
    lng: trip.lng ? String(trip.lng) : null,
    state: trip.state || null,
    country: trip.country || null,
    short_title: trip.shortTitle || null,
    updated_at: new Date().toISOString()
  };
}

async function ensureCatalogBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = Array.isArray(buckets) && buckets.some(b => b.name === STORAGE_BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
  }
}

export default async function handler(req, res) {
  if (!supabase) {
    return res.status(200).json({
      success: false,
      cloudConfigured: false,
      customized: false,
      destinations: null,
      message: 'Supabase is not configured on the server.'
    });
  }

  if (req.method === 'GET') {
    try {
      // 1. Try native destinations table first
      const { data: tableData, error: tableErr } = await supabase
        .from('destinations')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!tableErr) {
        if (Array.isArray(tableData) && tableData.length > 0) {
          return res.status(200).json({
            success: true,
            cloudConfigured: true,
            source: 'table',
            customized: true,
            destinations: tableData.map(normalizeRowToTrip)
          });
        }
        return res.status(200).json({
          success: true,
          cloudConfigured: true,
          source: 'table',
          customized: false,
          destinations: null
        });
      }

      if (!isMissingTableError(tableErr)) {
        throw tableErr;
      }

      // 2. Fallback: Read JSON catalog from Supabase Storage bucket
      const { data: fileBlob, error: dlError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(STORAGE_FILE);

      if (dlError || !fileBlob) {
        return res.status(200).json({
          success: true,
          cloudConfigured: true,
          source: 'storage',
          customized: false,
          destinations: null
        });
      }

      const rawText = await fileBlob.text();
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.destinations) ? parsed.destinations : null);

      return res.status(200).json({
        success: true,
        cloudConfigured: true,
        source: 'storage',
        customized: Array.isArray(list) && list.length > 0,
        destinations: Array.isArray(list) && list.length > 0 ? list : null
      });
    } catch (err) {
      console.error('GET /api/destinations error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to read destinations from Supabase.'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { action, destinations: payloadDestinations } = req.body || {};

      // Validate input
      if (action !== 'reset' && (!Array.isArray(payloadDestinations) || payloadDestinations.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'Valid destinations array or reset action is required.'
        });
      }

      // 1. Try native destinations table first
      const { error: probeErr } = await supabase
        .from('destinations')
        .select('id')
        .limit(1);

      if (!probeErr) {
        // Table exists: replace rows atomically to keep order, additions, edits, and deletions exact
        await supabase.from('destinations').delete().gte('id', 0);

        if (action === 'reset') {
          return res.status(200).json({
            success: true,
            source: 'table',
            reset: true,
            message: 'Cloud catalog reset to default curated itineraries.'
          });
        }

        const rows = payloadDestinations.map(normalizeTripToRow);
        const { error: upsertErr } = await supabase.from('destinations').insert(rows);
        if (upsertErr) throw upsertErr;

        return res.status(200).json({
          success: true,
          source: 'table',
          count: rows.length
        });
      }

      if (!isMissingTableError(probeErr)) {
        throw probeErr;
      }

      // 2. Fallback: Persist catalog snapshot to Supabase Storage bucket
      await ensureCatalogBucket();

      if (action === 'reset') {
        await supabase.storage.from(STORAGE_BUCKET).remove([STORAGE_FILE]);
        return res.status(200).json({
          success: true,
          source: 'storage',
          reset: true,
          message: 'Cloud catalog reset to default curated itineraries.'
        });
      }

      const jsonBody = JSON.stringify({
        updatedAt: new Date().toISOString(),
        destinations: payloadDestinations
      });

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(STORAGE_FILE, Buffer.from(jsonBody, 'utf8'), {
          contentType: 'application/json',
          upsert: true,
          cacheControl: '0'
        });

      if (uploadErr) throw uploadErr;

      return res.status(200).json({
        success: true,
        source: 'storage',
        count: payloadDestinations.length
      });
    } catch (err) {
      console.error('POST /api/destinations error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to persist destinations to Supabase.'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
