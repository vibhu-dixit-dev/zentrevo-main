import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const STORAGE_FILE = 'blogs.json';

function isMissingTableError(error) {
  if (!error) return false;
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    String(error.message || '').includes('Could not find the table')
  );
}

function normalizeRowToArticle(row) {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    category: row.category,
    date: row.date,
    readTime: row.read_time || row.readTime || '5 min read',
    author: typeof row.author === 'object' && row.author !== null ? row.author : {
      name: row.author_name || 'Elena Rostova',
      role: row.author_role || 'Private Expedition Curator',
      avatar: row.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    image: row.image || '',
    imageAlt: row.image_alt || row.imageAlt || '',
    pullQuote: row.pull_quote || row.pullQuote || '',
    excerpt: row.excerpt || '',
    content: Array.isArray(row.content) ? row.content : (row.content ? [row.content] : []),
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    ...(row.translations && typeof row.translations === 'object' ? { translations: row.translations } : {})
  };
}

function normalizeArticleToRow(article, index) {
  return {
    id: Number(article.id) || Date.now() + index,
    sort_order: index,
    title: article.title || 'Untitled Narrative',
    destination: article.destination || 'Global Expedition',
    category: article.category || 'Adventure & Seclusion',
    date: article.date || 'Recent',
    read_time: article.readTime || '5 min read',
    author: article.author || {
      name: 'Elena Rostova',
      role: 'Private Expedition Curator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    image: article.image || '',
    image_alt: article.imageAlt || '',
    pull_quote: article.pullQuote || '',
    excerpt: article.excerpt || '',
    content: Array.isArray(article.content) ? article.content : [],
    highlights: Array.isArray(article.highlights) ? article.highlights : [],
    translations: article.translations && typeof article.translations === 'object' ? article.translations : null,
    updated_at: new Date().toISOString()
  };
}

async function ensureCatalogBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = Array.isArray(buckets) && buckets.some(b => b.name === STORAGE_BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
    }
  } catch (e) {
    console.warn('Storage bucket check note:', e?.message || e);
  }
}

export default async function handler(req, res) {
  if (!supabase) {
    return res.status(200).json({
      success: false,
      cloudConfigured: false,
      customized: false,
      articles: null,
      message: 'Supabase is not configured on the server.'
    });
  }

  // 1. GET: Fetch active blog articles from Supabase (DB table or Storage fallback)
  if (req.method === 'GET') {
    try {
      // 1.1 Try PostgreSQL table 'blogs' first
      const { data: tableData, error: tableErr } = await supabase
        .from('blogs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!tableErr && Array.isArray(tableData) && tableData.length > 0) {
        return res.status(200).json({
          success: true,
          cloudConfigured: true,
          source: 'table',
          customized: true,
          articles: tableData.map(normalizeRowToArticle)
        });
      }

      if (tableErr && !isMissingTableError(tableErr)) {
        console.warn('Supabase blogs table read warning:', tableErr.message);
      }

      // 1.2 Fallback: Read blogs.json from Supabase Storage bucket
      const { data: fileBlob, error: dlError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(STORAGE_FILE);

      if (dlError || !fileBlob) {
        return res.status(200).json({
          success: true,
          cloudConfigured: true,
          source: 'storage',
          customized: false,
          articles: null
        });
      }

      const rawText = await fileBlob.text();
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.articles) ? parsed.articles : null);

      return res.status(200).json({
        success: true,
        cloudConfigured: true,
        source: 'storage',
        customized: Array.isArray(list) && list.length > 0,
        articles: Array.isArray(list) && list.length > 0 ? list : null
      });
    } catch (err) {
      console.error('GET /api/blogs error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to read blogs from Supabase.'
      });
    }
  }

  // 2. POST: Save updated articles or reset to default
  if (req.method === 'POST') {
    try {
      const { action, articles: payloadArticles } = req.body || {};

      await ensureCatalogBucket();

      if (action === 'reset') {
        // Clear DB table if exists
        try {
          await supabase.from('blogs').delete().gte('id', 0);
        } catch {}
        // Clear Storage file
        await supabase.storage.from(STORAGE_BUCKET).remove([STORAGE_FILE]);

        return res.status(200).json({
          success: true,
          reset: true,
          message: 'Cloud blog stories reset to curated editorial defaults.'
        });
      }

      if (!Array.isArray(payloadArticles) || payloadArticles.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid articles array or reset action is required.'
        });
      }

      // 2.1 Attempt writing to PostgreSQL table 'blogs'
      let tableSaved = false;
      try {
        const { error: probeErr } = await supabase.from('blogs').select('id').limit(1);
        if (!probeErr) {
          await supabase.from('blogs').delete().gte('id', 0);
          const rows = payloadArticles.map(normalizeArticleToRow);
          const { error: insertErr } = await supabase.from('blogs').insert(rows);
          if (!insertErr) {
            tableSaved = true;
          }
        }
      } catch (dbErr) {
        console.warn('DB table insert notice:', dbErr.message);
      }

      // 2.2 Dual-persist: Always save to Supabase Storage bucket as well for 100% cloud durability
      const serialized = JSON.stringify(payloadArticles, null, 2);
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
        count: payloadArticles.length,
        message: `Successfully synchronized ${payloadArticles.length} blog stories to Supabase cloud.`
      });
    } catch (err) {
      console.error('POST /api/blogs error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to persist blog stories to Supabase.'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
