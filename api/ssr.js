import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { blogArticles } from '../src/data/travelData.js';
import { cloudDestinationsSnapshot } from '../src/data/cloudDestinationsSnapshot.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const STORAGE_BUCKET = 'zentrevo-catalog';
const BASE_URL = 'https://www.zentrevo.in';

let cachedTemplate = null;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

function getBaseTemplate() {
  if (cachedTemplate) return cachedTemplate;
  const candidates = [
    path.join(process.cwd(), 'api', '_template.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html')
  ];

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        cachedTemplate = fs.readFileSync(c, 'utf8');
        return cachedTemplate;
      }
    } catch {}
  }

  // Fallback production HTML scaffold if no file is found
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zentrevo – Best Travel and Tourism Company in India</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Fetch all live blogs (Supabase DB -> Storage -> local snapshot)
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

// Fetch all live destinations (Supabase DB -> Storage -> local snapshot)
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
  const snapshotList = Array.isArray(cloudDestinationsSnapshot) 
    ? cloudDestinationsSnapshot 
    : (cloudDestinationsSnapshot?.destinations || []);
  return snapshotList;
}

function injectSeoIntoHtml(template, seo) {
  let html = template;

  // 1. Title
  if (/<title>.*?<\/title>/i.test(html)) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  } else {
    html = html.replace('</head>', `  <title>${escapeHtml(seo.title)}</title>\n</head>`);
  }

  // 2. Set/Replace meta tag helper
  const setMeta = (attr, val, content) => {
    if (!content) return;
    const regex = new RegExp(`<meta\\s+${attr}=["']${val}["'][^>]*>`, 'i');
    const newTag = `<meta ${attr}="${val}" content="${escapeHtml(content)}" />`;
    if (regex.test(html)) {
      html = html.replace(regex, newTag);
    } else {
      html = html.replace('</head>', `  ${newTag}\n</head>`);
    }
  };

  setMeta('name', 'description', seo.description);
  setMeta('name', 'keywords', seo.keywords);
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:image', seo.image || `${BASE_URL}/images/og-home.jpg`);
  setMeta('property', 'og:url', seo.canonical || BASE_URL);
  setMeta('property', 'og:type', seo.ogType || 'website');
  setMeta('property', 'og:site_name', 'Zentrevo');
  if (seo.ogType === 'article') {
    if (seo.publishedTime) setMeta('property', 'article:published_time', seo.publishedTime);
    if (seo.author) setMeta('property', 'article:author', seo.author);
    if (seo.section) setMeta('property', 'article:section', seo.section);
  }
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.image || `${BASE_URL}/images/og-home.jpg`);
  setMeta('name', 'twitter:card', 'summary_large_image');

  // 3. Canonical link
  if (seo.canonical) {
    if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
      html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`);
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${escapeHtml(seo.canonical)}" />\n</head>`);
    }
  }

  // 4. Schema JSON-LD
  if (seo.schema) {
    const schemaTag = `\n  <script type="application/ld+json">\n${JSON.stringify(seo.schema, null, 2)}\n  </script>\n`;
    html = html.replace('</head>', `${schemaTag}</head>`);
  }

  // 5. Semantic Pre-Rendered Body inside <div id="root">
  if (seo.bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${seo.bodyHtml}</div>`);
  }

  return html;
}

export default async function handler(req, res) {
  try {
    const rawPath = req.query?.path || req.url || '/';
    const cleanPath = '/' + rawPath.replace(/^\/+/, '').split('?')[0].replace(/\/$/, '');
    
    // Bail out early for missing asset files (e.g. .js, .css, .png, etc.)
    if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|map|json|txt|xml)$/i.test(cleanPath)) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(404).send('Asset not found');
    }

    const template = getBaseTemplate();

    // 1. Admin Routes -> Serve Clean SPA index.html with noindex
    if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
      const adminSeo = {
        title: 'Zentrevo Admin Portal',
        description: 'Secure administration and itinerary management console for Zentrevo Luxury Travel.',
        canonical: `${BASE_URL}/admin`,
        keywords: 'admin'
      };
      let html = injectSeoIntoHtml(template, adminSeo);
      html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return res.status(200).send(html);
    }

    // 2. Journal & Blog Routes (/journal/:slug or /blog/:slug)
    if (cleanPath.startsWith('/journal/') || cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace(/^\/(journal|blog)\/?/, '');
      const blogs = await getLiveBlogs();

      // Find blog matching slug, title, or id
      const article = blogs.find(b => {
        if (b.slug && slugify(b.slug) === slug) return true;
        if (slugify(b.title || '') === slug) return true;
        if (String(b.id) === slug) return true;
        const bSlug = slugify(b.title || '');
        return bSlug.includes(slug) || slug.includes(bSlug);
      });

      if (article) {
        const canonical = `${BASE_URL}/journal/${article.slug || slugify(article.title)}`;
        const description = article.excerpt || article.pullQuote || (Array.isArray(article.content) ? article.content[0] : article.content) || 'Exclusive bespoke narrative from Zentrevo private curators.';
        const keywords = article.keywords || `${article.title}, ${article.destination || 'global'}, luxury travel journal, bespoke expeditions, zentrevo travel stories`;
        const image = article.image || `${BASE_URL}/images/og-home.jpg`;

        const articleSchema = {
          "@context": "https://schema.org",
          "@type": ["Article", "BlogPosting"],
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical
          },
          "headline": article.title,
          "description": description,
          "image": [image],
          "url": canonical,
          "datePublished": article.date || "2026-11-22T00:00:00+05:30",
          "dateModified": article.updated_at || new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": article.author?.name || "Elena Rostova",
            "jobTitle": article.author?.role || "Private Expedition Curator"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Zentrevo",
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/images/og-home.jpg`
            }
          }
        };

        const paragraphs = Array.isArray(article.content) ? article.content : [article.content || description];
        const bodyHtml = `
          <article class="ssr-article max-w-4xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
            <header class="mb-8">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 700;">Zentrevo Travel Journal &bull; ${escapeHtml(article.category || 'Expedition')}</span>
              <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.2; margin: 12px 0; color: #0c0a09;">${escapeHtml(article.title)}</h1>
              <div style="font-size: 13px; color: #78716c;">By ${escapeHtml(article.author?.name || 'Elena Rostova')} &bull; ${escapeHtml(article.date || 'Recent')} &bull; ${escapeHtml(article.readTime || '5 min read')}</div>
            </header>
            ${article.image ? `<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt || article.title)}" style="width: 100%; max-height: 480px; object-fit: cover; border-radius: 16px; margin-bottom: 24px;" />` : ''}
            ${article.pullQuote ? `<blockquote style="font-size: 1.15rem; font-style: italic; border-left: 3px solid #d97706; padding-left: 16px; margin: 24px 0; color: #44403c;">&ldquo;${escapeHtml(article.pullQuote)}&rdquo;</blockquote>` : ''}
            <div class="ssr-content" style="font-size: 16px; line-height: 1.75; color: #292524;">
              ${paragraphs.map(p => `<p style="margin-bottom: 16px;">${escapeHtml(p)}</p>`).join('\n')}
            </div>
          </article>
        `;

        const html = injectSeoIntoHtml(template, {
          title: `${article.title} | Zentrevo Journal`,
          description,
          keywords,
          canonical,
          image,
          ogType: 'article',
          publishedTime: article.date || new Date().toISOString(),
          author: article.author?.name || 'Elena Rostova',
          section: article.category || 'Luxury Travel',
          schema: articleSchema,
          bodyHtml
        });

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
        return res.status(200).send(html);
      }
    }

    // 2.5. National & International Regional Hubs
    if (cleanPath === '/national-tour-packages' || cleanPath === '/national' || cleanPath === '/destinations/national') {
      const destinations = await getLiveDestinations();
      const nationalDests = destinations.filter(d => 
        d.category === 'national' || d.region === 'national' || (d.location && d.location.toLowerCase().includes('india'))
      );
      const bodyHtml = `
        <div class="national-hub max-w-5xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0c0a09; margin-bottom: 12px;">National (Domestic Tours) &amp; Curated Expeditions Across India</h1>
          <p style="font-size: 16px; color: #78716c; margin-bottom: 32px;">Handcrafted luxury journeys across India: Rajasthan palaces, Himalayan sanctuaries, Kerala backwaters, and private wildlife safaris.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
            ${nationalDests.map(d => `
              <div style="border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px;">
                <h2 style="font-size: 16px; font-weight: 700; margin: 0 0 8px;"><a href="/destinations/${escapeHtml(d.slug || slugify(d.location || d.title))}" style="color: #0c0a09; text-decoration: none;">${escapeHtml(d.title)}</a></h2>
                <p style="font-size: 13px; color: #78716c; margin: 0;">${escapeHtml(d.location || 'India')} &bull; ${escapeHtml(d.duration || 'Curated')}</p>
              </div>
            `).join('\n')}
          </div>
        </div>
      `;
      const nationalSeo = {
        title: 'National (Domestic Tours) & Curated Expeditions Across India | Zentrevo',
        description: 'Handcrafted luxury journeys across India: Rajasthan palaces, Himalayan sanctuaries, Kerala backwaters, and private wildlife safaris.',
        keywords: 'luxury india tours, national tour packages, domestic tours india, rajasthan luxury packages, bespoke travel india, private luxury holidays india, kerala luxury houseboats',
        canonical: `${BASE_URL}/national-tour-packages/`,
        image: `${BASE_URL}/images/og-home.jpg`,
        bodyHtml
      };
      const html = injectSeoIntoHtml(template, nationalSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    if (cleanPath === '/international-tour-packages' || cleanPath === '/international' || cleanPath === '/destinations/international') {
      const destinations = await getLiveDestinations();
      const intlDests = destinations.filter(d => 
        d.category !== 'national' && d.region !== 'national' && (!d.location || !d.location.toLowerCase().includes('india'))
      );
      const bodyHtml = `
        <div class="intl-hub max-w-5xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0c0a09; margin-bottom: 12px;">International (International Tours) &amp; Curated Escapes Worldwide</h1>
          <p style="font-size: 16px; color: #78716c; margin-bottom: 32px;">Curated international holidays and bespoke private tours to Switzerland, Japan, Amalfi, Bali, Turkey, and beyond with 24/7 concierge.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
            ${intlDests.map(d => `
              <div style="border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px;">
                <h2 style="font-size: 16px; font-weight: 700; margin: 0 0 8px;"><a href="/destinations/${escapeHtml(d.slug || slugify(d.location || d.title))}" style="color: #0c0a09; text-decoration: none;">${escapeHtml(d.title)}</a></h2>
                <p style="font-size: 13px; color: #78716c; margin: 0;">${escapeHtml(d.location || 'International')} &bull; ${escapeHtml(d.duration || 'Curated')}</p>
              </div>
            `).join('\n')}
          </div>
        </div>
      `;
      const intlSeo = {
        title: 'International (International Tours) & Curated Escapes Worldwide | Zentrevo',
        description: 'Curated international holidays and bespoke private tours to Switzerland, Japan, Amalfi, Bali, Turkey, and beyond with 24/7 concierge.',
        keywords: 'international tour packages, international tours, luxury overseas holidays, japan luxury tours, swiss alpine tours, bespoke private travel',
        canonical: `${BASE_URL}/international-tour-packages/`,
        image: `${BASE_URL}/images/og-home.jpg`,
        bodyHtml
      };
      const html = injectSeoIntoHtml(template, intlSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    // 3. Destinations Routes (/destinations/:slug)
    if (cleanPath.startsWith('/destinations/')) {
      const slug = cleanPath.replace(/^\/destinations\/?/, '');

      // Specific Destination Item
      const destinations = await getLiveDestinations();
      const dest = destinations.find(d => {
        if (d.slug && slugify(d.slug) === slug) return true;
        if (slugify(d.title || '') === slug) return true;
        if (slugify(d.location || '') === slug) return true;
        if (String(d.id) === slug) return true;
        const dSlug = slugify(d.title || '');
        return dSlug.includes(slug) || slug.includes(dSlug);
      });

      if (dest) {
        const canonical = `${BASE_URL}/destinations/${dest.slug || slugify(dest.location || dest.title)}`;
        const description = dest.description || 'Curated ultra-luxury bespoke travel itinerary designed with architectural precision and private concierge.';
        const keywords = dest.keywords || `${dest.location}, ${dest.title}, luxury tour packages from india, bespoke travel planner`;
        const image = dest.image || `${BASE_URL}/images/og-home.jpg`;

        const destSchema = {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": dest.title,
          "description": description,
          "touristType": "Luxury Travelers",
          "itinerary": {
            "@type": "ItemList",
            "numberOfItems": Array.isArray(dest.highlights) ? dest.highlights.length : 3,
            "itemListElement": Array.isArray(dest.highlights) ? dest.highlights.map((h, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": h
            })) : []
          },
          "offers": {
            "@type": "Offer",
            "price": dest.price ? String(dest.price).replace(/[^0-9]/g, '') || "2500" : "2500",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": canonical
          }
        };

        const highlights = Array.isArray(dest.highlights) ? dest.highlights : [];
        const bodyHtml = `
          <div class="ssr-destination max-w-4xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 700;">Zentrevo Curated Expedition &bull; ${escapeHtml(dest.location || 'Global')}</span>
            <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.2; margin: 12px 0; color: #0c0a09;">${escapeHtml(dest.title)}</h1>
            <div style="font-size: 14px; color: #78716c; margin-bottom: 20px;">${escapeHtml(dest.duration || '7 Days / 6 Nights')} &bull; Starting at ${escapeHtml(dest.price || '$2,500')}</div>
            ${dest.image ? `<img src="${escapeHtml(dest.image)}" alt="${escapeHtml(dest.imageAlt || dest.title)}" style="width: 100%; max-height: 480px; object-fit: cover; border-radius: 16px; margin-bottom: 24px;" />` : ''}
            <p style="font-size: 16px; line-height: 1.75; color: #292524; margin-bottom: 24px;">${escapeHtml(description)}</p>
            ${highlights.length > 0 ? `
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; color: #0c0a09;">Curated Highlights</h2>
              <ul style="list-style-type: disc; padding-left: 20px; font-size: 15px; color: #44403c; line-height: 1.8;">
                ${highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('\n')}
              </ul>
            ` : ''}
          </div>
        `;

        const html = injectSeoIntoHtml(template, {
          title: `${dest.title} | Luxury Bespoke Journey | Zentrevo`,
          description,
          keywords,
          canonical,
          image,
          schema: destSchema,
          bodyHtml
        });

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
        return res.status(200).send(html);
      }
    }

    // 4. General Static Pages
    if (cleanPath === '/journal' || cleanPath === '/blog') {
      const blogs = await getLiveBlogs();
      const bodyHtml = `
        <div class="journal-index max-w-5xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0c0a09; margin-bottom: 12px;">Zentrevo Travel Journal &amp; Stories</h1>
          <p style="font-size: 16px; color: #78716c; margin-bottom: 32px;">Read authentic travel stories, cultural chronicles, and private expedition narratives curated by Zentrevo bespoke travel specialists.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
            ${blogs.map(b => `
              <article style="border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 700;">${escapeHtml(b.category || 'Journal')}</span>
                <h2 style="font-size: 17px; font-weight: 700; margin: 8px 0;"><a href="/journal/${escapeHtml(b.slug || slugify(b.title))}" style="color: #0c0a09; text-decoration: none;">${escapeHtml(b.title)}</a></h2>
                <p style="font-size: 13px; color: #57534e; line-height: 1.5;">${escapeHtml(b.excerpt || b.pullQuote || 'Exclusive bespoke narrative from Zentrevo private curators.')}</p>
              </article>
            `).join('\n')}
          </div>
        </div>
      `;
      const journalSeo = {
        title: 'Travel Journal & Stories | Zentrevo',
        description: 'Read authentic travel stories, cultural chronicles, and private expedition narratives curated by Zentrevo bespoke travel specialists.',
        keywords: 'travel journal, bespoke travel essays, slow travel philosophy, kyoto artisans, serengeti starlight safari, luxury travel stories',
        canonical: `${BASE_URL}/blog/`,
        bodyHtml
      };
      const html = injectSeoIntoHtml(template, journalSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    if (cleanPath === '/visa' || cleanPath === '/visa-guidance') {
      const bodyHtml = `
        <div class="visa-guidance max-w-4xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #0c0a09; margin-bottom: 12px;">Visa Help &amp; Document Concierge for Indian Travelers</h1>
          <p style="font-size: 16px; color: #78716c; margin-bottom: 24px;">Seamless private visa concierge for Indian travelers exploring Japan, Schengen Europe, the UK, the US, and UAE with verified document checklists and appointment guidance.</p>
          <div style="border-left: 4px solid #d97706; padding-left: 16px; margin: 24px 0; font-size: 14px; color: #44403c;">
            <strong>Important:</strong> Visa guidance and document support are provided in good faith. The embassy decides approval. We provide confirmed travel vouchers, cover letters, and scheduling support.
          </div>
        </div>
      `;
      const visaSeo = {
        title: 'Visa Help for Indian Travelers | Zentrevo',
        description: 'Know your visa before you book: requirement check, document list and form help for Indian passport holders. The embassy decides approval.',
        keywords: 'visa assistance india, tourist visa concierge, schengen visa assistance, japan visa india, us b1 b2 visa guidance',
        canonical: `${BASE_URL}/visa/`,
        bodyHtml
      };
      const html = injectSeoIntoHtml(template, visaSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    if (cleanPath === '/privacy-policy') {
      const privacySeo = {
        title: 'Privacy Policy | Zentrevo',
        description: 'Zentrevo Privacy Policy explaining how we collect, use, and protect your personal data when booking luxury travel and custom itineraries.',
        keywords: 'privacy policy zentrevo, data protection, travel booking privacy',
        canonical: `${BASE_URL}/privacy-policy`
      };
      const html = injectSeoIntoHtml(template, privacySeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    if (cleanPath === '/terms' || cleanPath === '/terms-of-service') {
      const termsSeo = {
        title: 'Terms of Service | Zentrevo',
        description: 'Terms and conditions governing the booking of bespoke luxury travel itineraries, private charters, and guided expeditions with Zentrevo.',
        keywords: 'terms of service, booking terms, zentrevo travel conditions',
        canonical: `${BASE_URL}/terms-of-service`
      };
      const html = injectSeoIntoHtml(template, termsSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    if (cleanPath === '/cancellation-refund' || cleanPath === '/cancellation-and-refund') {
      const refundSeo = {
        title: 'Cancellation & Refund Policy | Zentrevo',
        description: 'Zentrevo cancellation, rescheduling, and refund terms for customized domestic and international travel packages.',
        keywords: 'cancellation policy, refund terms, travel rescheduling zentrevo',
        canonical: `${BASE_URL}/cancellation-refund`
      };
      const html = injectSeoIntoHtml(template, refundSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    // 4.5. Dynamic HTML Sitemap (/sitemap.html or /sitemap)
    if (cleanPath === '/sitemap.html' || cleanPath === '/sitemap') {
      const destinations = await getLiveDestinations();
      const blogs = await getLiveBlogs();

      const nationalDests = destinations.filter(d => 
        d.category === 'national' || d.region === 'national' || (d.location && d.location.toLowerCase().includes('india'))
      );
      const intlDests = destinations.filter(d => 
        d.category !== 'national' && d.region !== 'national' && (!d.location || !d.location.toLowerCase().includes('india'))
      );

      const sitemapBodyHtml = `
        <div class="sitemap-container max-w-5xl mx-auto px-6 py-12" style="font-family: system-ui, sans-serif;">
          <header style="margin-bottom: 32px; border-bottom: 1px solid #e7e5e4; padding-bottom: 24px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 700;">Zentrevo Curated Journeys &bull; Directory</span>
            <h1 style="font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin: 12px 0; color: #0c0a09;">HTML Sitemap &amp; Navigation Index</h1>
            <p style="font-size: 15px; color: #78716c;">Directory of all curated national expeditions, international bespoke packages, private travel journals, visa guides, and core policies across Zentrevo.</p>
          </header>

          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0c0a09; margin-bottom: 16px; border-left: 4px solid #d97706; padding-left: 12px;">Primary Platform Hubs</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; list-style: none; padding: 0;">
              <li><a href="/" style="display: block; padding: 14px; border: 1px solid #e7e5e4; border-radius: 12px; color: #0c0a09; text-decoration: none; font-weight: 600;">Home Page</a></li>
              <li><a href="/national-tour-packages/" style="display: block; padding: 14px; border: 1px solid #e7e5e4; border-radius: 12px; color: #0c0a09; text-decoration: none; font-weight: 600;">National (Domestic Tours)</a></li>
              <li><a href="/international-tour-packages/" style="display: block; padding: 14px; border: 1px solid #e7e5e4; border-radius: 12px; color: #0c0a09; text-decoration: none; font-weight: 600;">International (International Tours)</a></li>
              <li><a href="/blog/" style="display: block; padding: 14px; border: 1px solid #e7e5e4; border-radius: 12px; color: #0c0a09; text-decoration: none; font-weight: 600;">Travel Blog &amp; Journals</a></li>
              <li><a href="/visa/" style="display: block; padding: 14px; border: 1px solid #e7e5e4; border-radius: 12px; color: #0c0a09; text-decoration: none; font-weight: 600;">Visa Assistance &amp; Concierge</a></li>
              <li><a href="/#inquiry" style="display: block; padding: 14px; border: 1px solid #e7e5e4; border-radius: 12px; color: #0c0a09; text-decoration: none; font-weight: 600;">Private Concierge Inquiry</a></li>
            </ul>
          </section>

          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0c0a09; margin-bottom: 16px; border-left: 4px solid #d97706; padding-left: 12px;">National (Domestic) Tour Packages (${nationalDests.length})</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; list-style: none; padding: 0;">
              ${nationalDests.map(d => {
                const slug = d.slug || slugify(d.location || d.title);
                return `<li><a href="/destinations/${escapeHtml(slug)}" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #292524; text-decoration: none; font-size: 14px;"><strong>${escapeHtml(d.title)}</strong><br/><span style="font-size: 12px; color: #78716c;">${escapeHtml(d.location || 'India')}</span></a></li>`;
              }).join('\n')}
            </ul>
          </section>

          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0c0a09; margin-bottom: 16px; border-left: 4px solid #d97706; padding-left: 12px;">International Tour Packages (${intlDests.length})</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; list-style: none; padding: 0;">
              ${intlDests.map(d => {
                const slug = d.slug || slugify(d.location || d.title);
                return `<li><a href="/destinations/${escapeHtml(slug)}" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #292524; text-decoration: none; font-size: 14px;"><strong>${escapeHtml(d.title)}</strong><br/><span style="font-size: 12px; color: #78716c;">${escapeHtml(d.location || 'International')}</span></a></li>`;
              }).join('\n')}
            </ul>
          </section>

          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0c0a09; margin-bottom: 16px; border-left: 4px solid #d97706; padding-left: 12px;">Travel Blog Articles &amp; Stories (${blogs.length})</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; list-style: none; padding: 0;">
              ${blogs.map(b => {
                const slug = b.slug || slugify(b.title);
                return `<li><a href="/journal/${escapeHtml(slug)}" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #292524; text-decoration: none; font-size: 14px;"><strong>${escapeHtml(b.title)}</strong><br/><span style="font-size: 12px; color: #78716c;">${escapeHtml(b.category || 'Journal')} &bull; ${escapeHtml(b.readTime || '5 min read')}</span></a></li>`;
              }).join('\n')}
            </ul>
          </section>

          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #0c0a09; margin-bottom: 16px; border-left: 4px solid #d97706; padding-left: 12px;">Legal &amp; Crawlers</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; list-style: none; padding: 0;">
              <li><a href="/privacy-policy" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #292524; text-decoration: none;">Privacy Policy</a></li>
              <li><a href="/terms-of-service" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #292524; text-decoration: none;">Terms of Service</a></li>
              <li><a href="/cancellation-refund" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #292524; text-decoration: none;">Cancellation &amp; Refund Policy</a></li>
              <li><a href="/sitemap.xml" target="_blank" style="display: block; padding: 12px; border: 1px solid #e7e5e4; border-radius: 10px; color: #b45309; font-weight: 600; text-decoration: none;">XML Sitemap (for Googlebot)</a></li>
            </ul>
          </section>
        </div>
      `;

      const sitemapSeo = {
        title: 'HTML Sitemap & Navigation Index | Zentrevo Curated Journeys',
        description: 'Comprehensive directory of national domestic tour packages, international bespoke expeditions, travel journals, and visa guidance across Zentrevo.',
        keywords: 'zentrevo sitemap, html sitemap, travel directory, national tour packages, international tour packages, travel journals, visa concierge',
        canonical: `${BASE_URL}/sitemap.html`,
        bodyHtml: sitemapBodyHtml
      };
      const html = injectSeoIntoHtml(template, sitemapSeo);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }

    // 5. Default Fallback (Homepage SEO)
    const homeSeo = {
      title: 'Zentrevo – Best Travel and Tourism Company in India',
      description: 'Zentrevo is a trusted travel company in India, offering domestic and international tour packages, holiday planning, and unforgettable travel experiences worldwide.',
      keywords: 'trips from india, custom travel planner, bali trip from india, japan trip from india, switzerland tour from india, visa guidance india, bespoke travel planner',
      canonical: `${BASE_URL}/`
    };
    const html = injectSeoIntoHtml(template, homeSeo);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    return res.status(200).send(html);

  } catch (err) {
    console.error('SSR Handler Error:', err);
    const template = getBaseTemplate();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(template);
  }
}
