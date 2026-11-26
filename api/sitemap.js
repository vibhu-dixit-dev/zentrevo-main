import { createClient } from '@supabase/supabase-js';
import { blogArticles } from '../src/data/travelData.js';
import { cloudDestinationsSnapshot } from '../src/data/cloudDestinationsSnapshot.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const BASE_URL = 'https://www.zentrevo.in';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getLiveBlogs() {
  if (supabase) {
    try {
      const { data: tableData } = await supabase
        .from('blogs')
        .select('*')
        .order('sort_order', { ascending: true });
      if (Array.isArray(tableData) && tableData.length > 0) {
        return tableData;
      }
    } catch {}

    try {
      const { data: fileBlob } = await supabase.storage.from(STORAGE_BUCKET).download('blogs.json');
      if (fileBlob) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : (parsed?.articles || null);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch {}
  }
  return blogArticles || [];
}

async function getLiveDestinations() {
  if (supabase) {
    try {
      const { data: tableData } = await supabase
        .from('destinations')
        .select('*')
        .order('sort_order', { ascending: true });
      if (Array.isArray(tableData) && tableData.length > 0) {
        return tableData;
      }
    } catch {}

    try {
      const { data: fileBlob } = await supabase.storage.from(STORAGE_BUCKET).download('destinations.json');
      if (fileBlob) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : (parsed?.destinations || null);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch {}
  }
  const list = Array.isArray(cloudDestinationsSnapshot)
    ? cloudDestinationsSnapshot
    : (cloudDestinationsSnapshot?.destinations || []);
  return list;
}

export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Core Platform Routes
    const urls = [
      { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
      { loc: `${BASE_URL}/national-tour-packages`, lastmod: today, changefreq: 'weekly', priority: '0.95' },
      { loc: `${BASE_URL}/international-tour-packages`, lastmod: today, changefreq: 'weekly', priority: '0.95' },
      { loc: `${BASE_URL}/destinations/national`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
      { loc: `${BASE_URL}/destinations/international`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
      { loc: `${BASE_URL}/blog`, lastmod: today, changefreq: 'daily', priority: '0.9' },
      { loc: `${BASE_URL}/journal`, lastmod: today, changefreq: 'daily', priority: '0.85' },
      { loc: `${BASE_URL}/visa`, lastmod: today, changefreq: 'weekly', priority: '0.85' },
      { loc: `${BASE_URL}/sitemap.html`, lastmod: today, changefreq: 'daily', priority: '0.8' },
      { loc: `${BASE_URL}/privacy-policy`, lastmod: today, changefreq: 'yearly', priority: '0.4' },
      { loc: `${BASE_URL}/terms-of-service`, lastmod: today, changefreq: 'yearly', priority: '0.4' },
      { loc: `${BASE_URL}/cancellation-refund`, lastmod: today, changefreq: 'yearly', priority: '0.4' }
    ];

    // 2. Dynamic Live Destinations (Supabase DB + Storage)
    const destinations = await getLiveDestinations();
    const seenDestSlugs = new Set();
    for (const d of destinations) {
      const rawSlug = d.slug || slugify(d.location || d.title);
      if (!rawSlug || seenDestSlugs.has(rawSlug)) continue;
      seenDestSlugs.add(rawSlug);
      urls.push({
        loc: `${BASE_URL}/destinations/${rawSlug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.85'
      });
    }

    // 3. Dynamic Live Blogs / Articles (Supabase DB + Storage)
    const blogs = await getLiveBlogs();
    const seenBlogSlugs = new Set();
    for (const b of blogs) {
      const rawSlug = b.slug || slugify(b.title);
      if (!rawSlug || seenBlogSlugs.has(rawSlug)) continue;
      seenBlogSlugs.add(rawSlug);
      urls.push({
        loc: `${BASE_URL}/journal/${rawSlug}`,
        lastmod: b.updated_at ? b.updated_at.split('T')[0] : today,
        changefreq: 'weekly',
        priority: '0.80'
      });
    }

    // 4. Build XML Output
    const xmlItems = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // Keep short so newly published cards appear in sitemap within ~1 minute
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(sitemapXml);

  } catch (err) {
    console.error('Dynamic Sitemap Error:', err);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  }
}
