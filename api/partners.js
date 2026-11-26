import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const STORAGE_FILE = 'partners.json';

export const DEFAULT_PARTNERS = [
  {
    id: 1001,
    name: 'Taj Hotels',
    tagline: 'Heritage Luxury Stays',
    logo: 'https://logo.clearbit.com/tajhotels.com',
    website: 'https://www.tajhotels.com',
    active: true
  },
  {
    id: 1002,
    name: 'Emirates',
    tagline: 'Premium Global Flights',
    logo: 'https://logo.clearbit.com/emirates.com',
    website: 'https://www.emirates.com',
    active: true
  },
  {
    id: 1003,
    name: 'IndiGo',
    tagline: 'Pan-India Connectivity',
    logo: 'https://logo.clearbit.com/goindigo.in',
    website: 'https://www.goindigo.in',
    active: true
  },
  {
    id: 1004,
    name: 'Booking.com',
    tagline: 'Worldwide Stays Network',
    logo: 'https://logo.clearbit.com/booking.com',
    website: 'https://www.booking.com',
    active: true
  },
  {
    id: 1005,
    name: 'Agoda',
    tagline: 'Asia Stay Partners',
    logo: 'https://logo.clearbit.com/agoda.com',
    website: 'https://www.agoda.com',
    active: true
  },
  {
    id: 1006,
    name: 'Hertz',
    tagline: 'Private Fleet Transfers',
    logo: 'https://logo.clearbit.com/hertz.com',
    website: 'https://www.hertz.com',
    active: true
  },
  {
    id: 1007,
    name: 'MakeMyTrip',
    tagline: 'India Travel Network',
    logo: 'https://logo.clearbit.com/makemytrip.com',
    website: 'https://www.makemytrip.com',
    active: true
  },
  {
    id: 1008,
    name: 'Airbnb',
    tagline: 'Boutique Homes & Villas',
    logo: 'https://logo.clearbit.com/airbnb.com',
    website: 'https://www.airbnb.com',
    active: true
  }
];

function isMissingTableError(error) {
  if (!error) return false;
  const msg = String(error.message || '');
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    msg.includes('Could not find the table')
  );
}

function isPermissionDeniedError(error) {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  return (
    error.code === '42501' ||
    msg.includes('permission denied') ||
    msg.includes('row-level security')
  );
}

function normalizeWebsite(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function normalizeRowToPartner(row, index = 0) {
  return {
    id: Number(row.id) || Date.now() + index,
    name: String(row.name || 'Partner').trim() || 'Partner',
    tagline: String(row.tagline || row.tag || '').trim(),
    logo: String(row.logo || row.image || '').trim(),
    website: normalizeWebsite(row.website || row.url || ''),
    active: row.active !== false
  };
}

function normalizePartnerToRow(partner, index) {
  return {
    id: Number(partner.id) || Date.now() + index,
    sort_order: index,
    name: String(partner.name || 'Partner').trim() || 'Partner',
    tagline: String(partner.tagline || '').trim(),
    logo: String(partner.logo || '').trim(),
    website: normalizeWebsite(partner.website || ''),
    active: partner.active !== false,
    updated_at: new Date().toISOString()
  };
}

async function ensureCatalogBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = Array.isArray(buckets) && buckets.some((b) => b.name === STORAGE_BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
    }
  } catch (e) {
    console.warn('Storage bucket check note:', e?.message || e);
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (!supabase) {
    return res.status(200).json({
      success: false,
      cloudConfigured: false,
      customized: false,
      partners: DEFAULT_PARTNERS,
      message: 'Supabase is not configured on the server.'
    });
  }

  if (req.method === 'GET') {
    try {
      const { data: tableData, error: tableErr } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!tableErr && Array.isArray(tableData) && tableData.length > 0) {
        return res.status(200).json({
          success: true,
          cloudConfigured: true,
          source: 'table',
          customized: true,
          partners: tableData.map(normalizeRowToPartner)
        });
      }

      if (tableErr && !isMissingTableError(tableErr) && !isPermissionDeniedError(tableErr)) {
        console.warn('Supabase partners table read warning:', tableErr.message);
      } else if (isPermissionDeniedError(tableErr)) {
        // Table exists but GRANTs/RLS missing — fall back to storage/defaults quietly.
        // Fix: run GRANT + policies from supabase_partners_schema.sql in Supabase SQL Editor.
        console.warn(
          'Partners table permission denied — using storage/defaults. Run supabase_partners_schema.sql grants in Supabase SQL Editor.'
        );
      }

      const { data: fileBlob, error: dlError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(STORAGE_FILE);

      if (dlError || !fileBlob) {
        return res.status(200).json({
          success: true,
          cloudConfigured: true,
          source: 'default',
          customized: false,
          partners: DEFAULT_PARTNERS
        });
      }

      const rawText = await fileBlob.text();
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed)
        ? parsed
        : (Array.isArray(parsed?.partners) ? parsed.partners : null);

      return res.status(200).json({
        success: true,
        cloudConfigured: true,
        source: 'storage',
        customized: Array.isArray(list) && list.length > 0,
        partners: Array.isArray(list) && list.length > 0
          ? list.map(normalizeRowToPartner)
          : DEFAULT_PARTNERS
      });
    } catch (err) {
      console.error('GET /api/partners error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to read partners from Supabase.'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { action, partners: payloadPartners } = req.body || {};

      await ensureCatalogBucket();

      if (action === 'reset') {
        try {
          await supabase.from('partners').delete().gte('id', 0);
        } catch {}
        await supabase.storage.from(STORAGE_BUCKET).remove([STORAGE_FILE]);

        return res.status(200).json({
          success: true,
          reset: true,
          partners: DEFAULT_PARTNERS,
          message: 'Cloud partners reset to curated defaults.'
        });
      }

      if (!Array.isArray(payloadPartners)) {
        return res.status(400).json({
          success: false,
          message: 'Valid partners array or reset action is required.'
        });
      }

      const normalized = payloadPartners.map(normalizeRowToPartner);

      let tableSaved = false;
      try {
        const { error: probeErr } = await supabase.from('partners').select('id').limit(1);
        if (!probeErr) {
          await supabase.from('partners').delete().gte('id', 0);
          if (normalized.length > 0) {
            const rows = normalized.map(normalizePartnerToRow);
            const { error: insertErr } = await supabase.from('partners').insert(rows);
            if (!insertErr) tableSaved = true;
            else console.warn('Partners table insert notice:', insertErr.message);
          } else {
            tableSaved = true;
          }
        }
      } catch (dbErr) {
        console.warn('DB table insert notice:', dbErr.message);
      }

      const serialized = JSON.stringify(normalized, null, 2);
      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(STORAGE_FILE, serialized, {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadErr && !tableSaved) {
        throw uploadErr;
      }

      return res.status(200).json({
        success: true,
        cloudConfigured: true,
        source: tableSaved ? 'table+storage' : 'storage',
        count: normalized.length,
        partners: normalized,
        message: `Successfully synchronized ${normalized.length} partners to Supabase cloud.`
      });
    } catch (err) {
      console.error('POST /api/partners error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to persist partners to Supabase.'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
