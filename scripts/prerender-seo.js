import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { destinations, blogArticles, getActiveDestinations } from '../src/data/travelData.js';
import { 
  CLIENT_DESTINATIONS_SEO, 
  BLOG_SLUGS_MAP, 
  LEGACY_BLOG_SLUGS_MAP,
  DEFAULT_SEO, 
  slugify, 
  getDestinationSlug, 
  getBlogSlug 
} from '../src/lib/seoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://www.zentrevo.in';

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`[prerender-seo] Error: ${TEMPLATE_PATH} not found. Please run 'vite build' first.`);
  process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Mirror dist/index.html to api/_template.html so the serverless SSR function can always read it
try {
  const apiTemplatePath = path.resolve(__dirname, '../api/_template.html');
  fs.writeFileSync(apiTemplatePath, templateHtml, 'utf8');
} catch (e) {
  console.warn('[prerender-seo] Note: could not write api/_template.html:', e.message);
}

// Load authoritative destinations & blogs (Snapshot + Supabase Cloud Sync)
let allDestinations = getActiveDestinations();
let allBlogs = blogArticles;

try {
  const envPath = path.resolve(__dirname, '../.env');
  const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || envText.match(/SUPABASE_URL=(.*)/)?.[1]?.trim();
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || envText.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || envText.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
  
  if (sbUrl && sbKey) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(sbUrl, sbKey);

    // 1. Sync live destinations (table or storage)
    try {
      const { data: dTable } = await supabase.from('destinations').select('*').order('sort_order', { ascending: true });
      if (Array.isArray(dTable) && dTable.length > 0) {
        allDestinations = dTable;
        console.log(`[prerender-seo] Successfully synced ${dTable.length} live destinations from Supabase table!`);
      } else {
        const { data: dBlob } = await supabase.storage.from('zentrevo-catalog').download('destinations.json');
        if (dBlob) {
          const text = await dBlob.text();
          const parsed = JSON.parse(text);
          const list = Array.isArray(parsed) ? parsed : (parsed?.destinations || null);
          if (Array.isArray(list) && list.length > 0) {
            allDestinations = list;
            console.log(`[prerender-seo] Successfully synced ${list.length} live destinations from Supabase storage!`);
          }
        }
      }
    } catch {}

    // 2. Sync live blogs / articles (table or storage)
    try {
      const { data: bTable } = await supabase.from('blogs').select('*').order('sort_order', { ascending: true });
      if (Array.isArray(bTable) && bTable.length > 0) {
        allBlogs = bTable;
        console.log(`[prerender-seo] Successfully synced ${bTable.length} live blogs from Supabase table!`);
      } else {
        const { data: bBlob } = await supabase.storage.from('zentrevo-catalog').download('blogs.json');
        if (bBlob) {
          const text = await bBlob.text();
          const parsed = JSON.parse(text);
          const list = Array.isArray(parsed) ? parsed : (parsed?.articles || null);
          if (Array.isArray(list) && list.length > 0) {
            allBlogs = list;
            console.log(`[prerender-seo] Successfully synced ${list.length} live blogs from Supabase storage!`);
          }
        }
      }
    } catch {}
  }
} catch (e) {
  // Graceful fallback to snapshot
}

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Master Route Definitions
const routes = [];

// 1. Home Route
routes.push({
  path: '/',
  title: 'Zentrevo – Best Travel and Tourism Company in India',
  description: "Zentrevo is a trusted travel company in India, offering domestic and international tour packages, holiday planning, and unforgettable travel experiences worldwide.",
  keywords: 'trips from india, custom travel planner, bali trip from india, japan trip from india, switzerland tour from india, visa guidance india, bespoke travel planner',
  canonical: `${BASE_URL}/`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  priority: 1.0,
  changefreq: 'daily',
  schema: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "name": "Zentrevo",
        "url": `${BASE_URL}/`,
        "email": "contact@zentrevo.in",
        "telephone": "+91-8619928710",
        "areaServed": "IN",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sector 49",
          "addressLocality": "Gurugram",
          "addressRegion": "Haryana",
          "postalCode": "122018",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Zentrevo plan a trip for me?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You tell us where you want to go, when, and roughly what you like to spend. A real person (not a bot) puts your plan together and sends you a quote within 24 hours. We stay on WhatsApp with you until you are home."
            }
          },
          {
            "@type": "Question",
            "name": "Can I change the plan after I get the quote?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, as many times as needed. Want a better hotel, one more day, or no sightseeing on day 3? Just tell your planner, before you pay."
            }
          },
          {
            "@type": "Question",
            "name": "Do you guarantee my visa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, and be careful of anyone who does. Only the embassy decides. We tell you exactly which documents to prepare, check your forms and help with the appointment, so you avoid mistakes."
            }
          },
          {
            "@type": "Question",
            "name": "Are prices in rupees or dollars? What is included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Prices show in INR by default, and you can switch currency on the site. Every quote lists what is included (hotels, transfers, activities) and what is not (visa fees, meals, shopping). No hidden charges. If anything changes, we tell you before you pay."
            }
          },
          {
            "@type": "Question",
            "name": "How do I pay, and is it safe?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can pay securely by UPI (Google Pay, PhonePe, Paytm), NEFT / IMPS bank transfer, or major credit/debit cards. You get a receipt and written confirmation for every payment. We require a 30% advance deposit to confirm bookings, with the balance due 21 to 30 days before departure (or upon visa approval)."
            }
          },
          {
            "@type": "Question",
            "name": "What if I need to cancel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on the airline and hotels booked. We explain the exact refund rules in your quote before you pay. Full policy: Cancellation & Refund Policy (https://www.zentrevo.in/cancellation-and-refund)."
            }
          },
          {
            "@type": "Question",
            "name": "Are there any hidden charges?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. If something in the price changes, we will tell you before you pay, not after."
            }
          },
          {
            "@type": "Question",
            "name": "What if something goes wrong during my trip?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Message your planner on WhatsApp and we will sort it out with you, whether it is a delayed flight, a hotel issue or a change of plan. Our 24/7 round-the-clock emergency concierge is reachable anytime at +91 86199 28710."
            }
          }
        ]
      }
    ]
  },
  bodyTitle: "Zentrevo – Best Travel and Tourism Company in India",
  bodyDescription: "Zentrevo is a trusted travel company in India, offering domestic and international tour packages, holiday planning, and unforgettable travel experiences worldwide."
});

// 2. National Destinations
routes.push({
  path: '/destinations/national',
  aliases: ['/national-destinations', '/national', '/national-tour-packages'],
  title: 'Curated Domestic Expeditions | India | Zentrevo',
  description: 'Handpicked royal heritage palaces, high-altitude Himalayan glamping, and serene cedar houseboats across India tailored around your pace.',
  keywords: 'india luxury tours, royal rajasthan heritage, ladakh glamping, kerala cedar houseboats, kashmir dal lake, luxury travel india',
  canonical: `${BASE_URL}/destinations/national`,
  ogImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  priority: 0.9,
  changefreq: 'weekly',
  breadcrumbs: [
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'National Destinations', url: `${BASE_URL}/destinations/national` }
  ],
  bodyTitle: "Curated Domestic Expeditions Across India",
  bodyDescription: "From the high-altitude silence of Nubra Valley in Ladakh to private cedar houseboats on Dal Lake and candlelit Lake Pichola palaces in Udaipur, experience India's grandest sanctuaries."
});

// 3. International Destinations
routes.push({
  path: '/destinations/international',
  aliases: ['/international-destinations', '/international', '/international-tour-packages'],
  title: 'International Curated Expeditions | Zentrevo',
  description: 'Explore bespoke international luxury retreats, private yacht charters, and alpine journeys across Italy, Japan, Switzerland, Bali, and beyond.',
  keywords: 'international luxury travel, custom overseas trips from india, bespoke travel designer, private jet charters, europe luxury tours',
  canonical: `${BASE_URL}/destinations/international`,
  ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  priority: 0.9,
  changefreq: 'weekly',
  breadcrumbs: [
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'International Destinations', url: `${BASE_URL}/destinations/international` }
  ],
  bodyTitle: "International Curated Expeditions Worldwide",
  bodyDescription: "Handcrafted sovereign itineraries covering Kyoto's ancient wabi-sabi tea gardens, the Swiss Alpine Glacier Express, cliffside Amalfi villas, and Bali's jungle sanctums."
});

// 4. Visa Guidance
routes.push({
  path: '/visa-guidance',
  aliases: ['/visa'],
  title: 'Visa Help for Indian Travelers | Zentrevo',
  description: 'Know your visa before you book: requirement check, document list and form help for Indian passport holders. The embassy decides approval.',
  keywords: 'visa assistance india, tourist visa checklist, schengen visa guidance, japan visa india, uk visa help india, us tourist visa appointment support',
  canonical: `${BASE_URL}/visa-guidance`,
  ogImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  priority: 0.85,
  changefreq: 'monthly',
  breadcrumbs: [
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Visa Guidance', url: `${BASE_URL}/visa-guidance` }
  ],
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you guarantee visa approval for Indian passport holders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Visa guidance and document support are provided in good faith. The embassy decides approval. We help with document checklists, appointment scheduling, and confirmed travel vouchers, but never promise or guarantee visa issuance."
        }
      },
      {
        "@type": "Question",
        "name": "What documents does Zentrevo assist with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide confirmed flight itineraries, hotel vouchers, day-by-day customized cover letters, insurance certificates, and step-by-step visa appointment scheduling."
        }
      }
    ]
  },
  bodyTitle: "Visa Help & Complete Paperwork Guidance for Indian Travelers",
  bodyDescription: "Stress-free visa preparation with verified document checklists, confirmed travel vouchers, appointment scheduling, and 1-on-1 WhatsApp assistance."
});

// 5. Travel Journal
routes.push({
  path: '/journal',
  aliases: ['/blog'],
  title: 'Travel Journal & Stories | Zentrevo',
  description: 'Dispatches, field notes, and insider stories penned by our global expedition directors and cultural curators.',
  keywords: 'travel journal, bespoke travel essays, slow travel philosophy, kyoto artisans, serengeti starlight safari, luxury travel stories',
  canonical: `${BASE_URL}/journal`,
  ogImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  ogType: 'website',
  priority: 0.8,
  changefreq: 'weekly',
  breadcrumbs: [
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Travel Journal', url: `${BASE_URL}/journal` }
  ],
  bodyTitle: "Zentrevo Travel Journal & Field Notes",
  bodyDescription: "Insider stories, dispatches from the world's most secluded valleys, and philosophical reflections on slow travel."
});

// 6. Legal Pages
routes.push({
  path: '/privacy-policy',
  title: 'Privacy Policy | Zentrevo',
  description: 'Zentrevo Privacy Policy explaining how we collect, use, and protect your personal data when booking luxury travel and custom itineraries.',
  keywords: 'privacy policy zentrevo, data protection, travel booking privacy',
  canonical: `${BASE_URL}/privacy-policy`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  priority: 0.3,
  changefreq: 'yearly',
  bodyTitle: "Zentrevo Privacy Policy",
  bodyDescription: "We take your confidentiality seriously. Learn how we handle your travel documents, passport numbers, and booking data with highest security standards."
});

routes.push({
  path: '/terms-of-service',
  title: 'Terms of Service | Zentrevo',
  description: 'Terms and conditions governing the booking of bespoke luxury travel itineraries, private charters, and guided expeditions with Zentrevo.',
  keywords: 'terms of service, booking terms, zentrevo travel conditions',
  canonical: `${BASE_URL}/terms-of-service`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  priority: 0.3,
  changefreq: 'yearly',
  bodyTitle: "Zentrevo Terms of Service",
  bodyDescription: "Clear, transparent booking agreements, payment schedules, and traveler guidelines for all domestic and international bespoke itineraries."
});

routes.push({
  path: '/cancellation-refund',
  title: 'Cancellation & Refund Policy | Zentrevo',
  description: 'Zentrevo cancellation, rescheduling, and refund terms for customized domestic and international travel packages.',
  keywords: 'cancellation policy, refund terms, travel rescheduling zentrevo',
  canonical: `${BASE_URL}/cancellation-refund`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  priority: 0.3,
  changefreq: 'yearly',
  bodyTitle: "Zentrevo Cancellation & Refund Policy",
  bodyDescription: "Transparent cancellation timelines, flexible rescheduling policies, and partner refund procedures."
});

// HTML Sitemap Route
routes.push({
  path: '/sitemap.html',
  aliases: ['/sitemap'],
  title: 'HTML Sitemap & Navigation Index | Zentrevo Curated Journeys',
  description: 'Comprehensive directory of national domestic tour packages, international bespoke expeditions, travel journals, and visa guidance across Zentrevo.',
  keywords: 'zentrevo sitemap, html sitemap, travel directory, national tour packages, international tour packages, travel journals, visa concierge',
  canonical: `${BASE_URL}/sitemap.html`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  priority: 0.8,
  changefreq: 'daily',
  bodyTitle: "HTML Sitemap & Navigation Index",
  bodyDescription: "Direct navigation links to all curated domestic expeditions across India, international luxury retreats, travel journal dispatches, visa concierge services, and official company policies."
});

// Admin Portal Route (Pre-rendered so Vercel never 404s on /admin)
routes.push({
  path: '/admin',
  title: 'Admin Portal | Zentrevo',
  description: 'Zentrevo administrative management console.',
  canonical: `${BASE_URL}/admin`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  noIndex: true,
  skipSitemap: true,
  noBodyPrerender: true
});

// Thank You Confirmation Route (Protected with noindex, kept out of sitemap)
routes.push({
  path: '/thank-you',
  title: 'Inquiry Received | Zentrevo Curated Journeys',
  description: 'Thank you for connecting with Zentrevo. Your travel consultation request is confirmed.',
  canonical: `${BASE_URL}/thank-you`,
  ogImage: `${BASE_URL}/images/og-home.jpg`,
  ogType: 'website',
  noIndex: true,
  skipSitemap: true,
  noBodyPrerender: true
});

// 7. Destination Specific Routes
allDestinations.forEach((dest) => {
  const primarySlug = getDestinationSlug(dest);
  const fullSlug = slugify(dest.title);
  const clientSeo = CLIENT_DESTINATIONS_SEO[primarySlug];

  const title = clientSeo ? `${clientSeo.title} | Zentrevo` : `${dest.title} | Zentrevo`;
  const description = clientSeo ? clientSeo.description : dest.description;
  const canonical = `${BASE_URL}/destinations/${primarySlug}`;
  const aliases = [];

  if (fullSlug && fullSlug !== primarySlug) {
    aliases.push(`/destinations/${fullSlug}`);
  }

  // Schema for Google Rich Results
  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": dest.title,
    "description": description,
    "url": canonical,
    "image": dest.image,
    "touristType": [dest.category || "Luxury Travel", "Bespoke Itinerary"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": dest.location
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(dest.rating || 4.95),
      "reviewCount": String(dest.reviews || 120),
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": String(dest.price || "$2,500").replace(/[^0-9]/g, '') || "2500",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-01-01"
    }
  };

  routes.push({
    path: `/destinations/${primarySlug}`,
    aliases,
    title,
    description,
    keywords: `${dest.location} trip from india, ${dest.title}, custom ${dest.location} tour, luxury ${dest.location} vacation, private itinerary`,
    canonical,
    ogImage: dest.image,
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: dest.region === 'national' ? 'National Destinations' : 'International Destinations', url: `${BASE_URL}/destinations/${dest.region || 'international'}` },
      { name: dest.title, url: canonical }
    ],
    schema: destinationSchema,
    bodyTitle: dest.title,
    bodyLocation: dest.location,
    bodyDuration: dest.duration,
    bodyPrice: dest.price,
    bodyDescription: dest.description,
    bodyHighlights: dest.highlights || []
  });
});

// 8. Journal / Blog Article Routes
allBlogs.forEach((article) => {
  const primarySlug = getBlogSlug(article);
  const canonical = `${BASE_URL}/journal/${primarySlug}`;
  const title = `${article.title} | Zentrevo Journal`;
  const description = article.excerpt || article.pullQuote || DEFAULT_SEO.description;
  const aliases = [`/blog/${primarySlug}`];

  // Also pre-render legacy long slugs and full title slug aliases for seamless backwards-compatibility
  if (LEGACY_BLOG_SLUGS_MAP[article.id]) {
    const legSlug = LEGACY_BLOG_SLUGS_MAP[article.id];
    if (legSlug !== primarySlug) {
      aliases.push(`/journal/${legSlug}`);
      aliases.push(`/blog/${legSlug}`);
    }
  }
  const fullTitleSlug = slugify(article.title);
  if (fullTitleSlug && fullTitleSlug !== primarySlug && !aliases.includes(`/journal/${fullTitleSlug}`)) {
    aliases.push(`/journal/${fullTitleSlug}`);
    aliases.push(`/blog/${fullTitleSlug}`);
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": description,
    "image": article.image,
    "url": canonical,
    "datePublished": "2026-10-18T09:00:00+05:30",
    "dateModified": "2026-11-21T09:00:00+05:30",
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

  routes.push({
    path: `/journal/${primarySlug}`,
    aliases,
    title,
    description,
    keywords: `${article.title}, ${article.destination || 'travel'}, zentrevo travel stories, luxury expedition dispatch`,
    canonical,
    ogImage: article.image,
    ogType: 'article',
    priority: 0.75,
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Travel Journal', url: `${BASE_URL}/journal` },
      { name: article.title, url: canonical }
    ],
    schema: articleSchema,
    bodyTitle: article.title,
    bodyAuthor: article.author ? `${article.author.name} (${article.author.role})` : 'Zentrevo Curator',
    bodyDate: article.date,
    bodyReadTime: article.readTime,
    bodyDescription: article.excerpt || article.pullQuote,
    bodyContent: article.content || [],
    bodyHighlights: article.highlights || []
  });
});

console.log(`[prerender-seo] Total routes mapped for pre-rendering: ${routes.length}`);

// Function to generate the injected HTML for a given route
function generateHtmlForRoute(route) {
  let html = templateHtml;

  // 1. Replace Title
  const titleTag = `<title>${escapeHtml(route.title)}</title>`;
  html = html.replace(/<title>.*?<\/title>/is, titleTag);

  // 2. Replace Meta Description
  const descMeta = `<meta name="description" content="${escapeHtml(route.description)}" />`;
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/is, descMeta);

  // 3. Replace Meta Keywords
  if (route.keywords) {
    const kwMeta = `<meta name="keywords" content="${escapeHtml(route.keywords)}" />`;
    if (html.includes('name="keywords"')) {
      html = html.replace(/<meta\s+name=["']keywords["'][^>]*>/is, kwMeta);
    } else {
      html = html.replace('</head>', `  ${kwMeta}\n</head>`);
    }
  }

  // 3.5 Robots Meta Tag (for private/noIndex routes like /admin)
  if (route.noIndex) {
    const robotsTag = `<meta name="robots" content="noindex, nofollow" />`;
    if (html.includes('name="robots"')) {
      html = html.replace(/<meta\s+name=["']robots["'][^>]*>/is, robotsTag);
    } else {
      html = html.replace('</head>', `  ${robotsTag}\n</head>`);
    }
  }

  // 4. Replace Canonical Link
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(route.canonical)}" />`;
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/is, canonicalTag);

  // 5. Replace Open Graph Tags
  const ogTitle = `<meta property="og:title" content="${escapeHtml(route.title)}" />`;
  const ogDesc = `<meta property="og:description" content="${escapeHtml(route.description)}" />`;
  const ogUrl = `<meta property="og:url" content="${escapeHtml(route.canonical)}" />`;
  const ogType = `<meta property="og:type" content="${escapeHtml(route.ogType || 'website')}" />`;
  const ogImage = `<meta property="og:image" content="${escapeHtml(route.ogImage || `${BASE_URL}/images/og-home.jpg`)}" />`;

  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/is, ogTitle);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/is, ogDesc);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/is, ogUrl);
  html = html.replace(/<meta\s+property=["']og:type["'][^>]*>/is, ogType);
  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/is, ogImage);

  // 6. Replace Twitter Card Tags
  const twTitle = `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`;
  const twDesc = `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`;
  const twUrl = `<meta name="twitter:url" content="${escapeHtml(route.canonical)}" />`;
  const twImage = `<meta name="twitter:image" content="${escapeHtml(route.ogImage || `${BASE_URL}/images/og-home.jpg`)}" />`;

  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/is, twTitle);
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/is, twDesc);
  html = html.replace(/<meta\s+name=["']twitter:url["'][^>]*>/is, twUrl);
  html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/is, twImage);

  // 7. Inject Page-Specific Schema.org JSON-LD
  let schemaTags = '';
  if (route.schema) {
    schemaTags += `\n    <!-- Page Specific Structured Data -->\n    <script type="application/ld+json">\n    ${JSON.stringify(route.schema, null, 2)}\n    </script>\n`;
  }
  if (route.breadcrumbs && route.breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": route.breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "item": b.url
      }))
    };
    schemaTags += `\n    <!-- Breadcrumbs Structured Data -->\n    <script type="application/ld+json">\n    ${JSON.stringify(breadcrumbSchema, null, 2)}\n    </script>\n`;
  }

  if (schemaTags) {
    html = html.replace('</head>', `${schemaTags}</head>`);
  }

  // 8. Inject Pre-rendered Semantic Body inside <div id="root">
  // Crawlers and view-source users see the full readable content immediately
  if (route.path !== '/' && !route.noBodyPrerender) {
    const preRenderedContent = `
    <div id="root">
      <header style="padding: 24px; max-width: 1200px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #666; margin-bottom: 16px;">
          ${(route.breadcrumbs || []).map(b => `<a href="${b.url}" style="color: #666; text-decoration: none;">${escapeHtml(b.name)}</a>`).join(' &gt; ')}
        </nav>
        <h1 style="font-size: 36px; font-weight: 800; color: #111; margin: 0 0 12px 0;">${escapeHtml(route.bodyTitle || route.title)}</h1>
        ${route.bodyLocation ? `<p style="font-size: 16px; color: #f97316; font-weight: 600; margin: 0 0 12px 0;">📍 ${escapeHtml(route.bodyLocation)} ${route.bodyDuration ? `• ⏱️ ${escapeHtml(route.bodyDuration)}` : ''} ${route.bodyPrice ? `• 🏷️ ${escapeHtml(route.bodyPrice)}` : ''}</p>` : ''}
        ${route.bodyAuthor ? `<p style="font-size: 14px; color: #666; margin: 0 0 12px 0;">By <strong>${escapeHtml(route.bodyAuthor)}</strong> • Published on ${escapeHtml(route.bodyDate || '')}</p>` : ''}
        <p style="font-size: 18px; color: #444; line-height: 1.6; max-width: 800px; margin: 0 0 24px 0;">${escapeHtml(route.bodyDescription || route.description)}</p>
      </header>
      <main style="max-width: 1200px; margin: 0 auto; padding: 0 24px 48px 24px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        ${route.bodyHighlights && route.bodyHighlights.length > 0 ? `
          <section style="margin-bottom: 32px;">
            <h2 style="font-size: 22px; font-weight: 700; color: #111; margin-bottom: 12px;">Curated Expedition Highlights</h2>
            <ul style="line-height: 1.8; color: #333; font-size: 15px; padding-left: 20px;">
              ${route.bodyHighlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
        ${route.bodyContent && route.bodyContent.length > 0 ? `
          <section style="margin-bottom: 32px; max-width: 800px;">
            ${route.bodyContent.map(para => `<p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 16px;">${escapeHtml(para)}</p>`).join('')}
          </section>
        ` : ''}
        <section style="margin-top: 32px; padding: 24px; background: #faf9f6; border: 1px solid #e7e5e4; border-radius: 16px; max-width: 800px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111; margin-bottom: 8px;">Plan Your Custom Journey with Zentrevo</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 16px;">Speak with a real journey curator on WhatsApp. Get a bespoke itinerary and transparent pricing within 24 hours.</p>
          <a href="https://wa.me/918619928710?text=Hi%20Zentrevo,%20I%20am%20interested%20in%20planning%20a%20trip%20to%20${encodeURIComponent(route.bodyLocation || route.title)}" style="display: inline-block; padding: 12px 24px; background: #25D366; color: #fff; font-weight: 600; text-decoration: none; border-radius: 9999px; font-size: 14px;">Chat on WhatsApp (+91 86199 28710)</a>
        </section>
      </main>
    </div>`;
    html = html.replace('<div id="root"></div>', preRenderedContent);
  }

  return html;
}

// Ensure directory exists
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Generate static files for each route
let generatedCount = 0;

for (const route of routes) {
  const pageHtml = generateHtmlForRoute(route);

  if (route.path === '/') {
    // Update root index.html
    fs.writeFileSync(TEMPLATE_PATH, pageHtml, 'utf-8');
    generatedCount++;
    continue;
  }

  const cleanPath = route.path.replace(/^\//, '').replace(/\/$/, '');
  const allPaths = [cleanPath, ...(route.aliases || []).map(a => a.replace(/^\//, '').replace(/\/$/, ''))];

  for (const p of allPaths) {
    if (!p) continue;

    // If path already ends with .html (e.g. sitemap.html), write directly as file
    if (p.endsWith('.html')) {
      const htmlFilePath = path.join(DIST_DIR, p);
      ensureDirSync(path.dirname(htmlFilePath));
      fs.writeFileSync(htmlFilePath, pageHtml, 'utf-8');
      generatedCount++;
      continue;
    }

    const targetDir = path.join(DIST_DIR, p);
    ensureDirSync(targetDir);

    // 1. Write targetDir/index.html (e.g. dist/destinations/japan/index.html)
    const indexPath = path.join(targetDir, 'index.html');
    fs.writeFileSync(indexPath, pageHtml, 'utf-8');

    // 2. Write dist/destinations/japan.html (matches cleanUrls)
    const htmlFilePath = path.join(DIST_DIR, `${p}.html`);
    ensureDirSync(path.dirname(htmlFilePath));
    fs.writeFileSync(htmlFilePath, pageHtml, 'utf-8');

    generatedCount += 2;
  }
}

// Generate / Update dist/sitemap.xml (excluding private routes like /admin)
const publicRoutes = routes.filter(r => !r.skipSitemap);
const sitemapUrls = publicRoutes.map((r) => {
  return `  <url>
    <loc>${escapeHtml(r.canonical)}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority ? r.priority.toFixed(2) : '0.80'}</priority>
  </url>`;
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`[prerender-seo] Successfully generated ${generatedCount} static HTML files across ${routes.length} unique routes!`);
console.log(`[prerender-seo] Successfully updated dist/sitemap.xml with ${publicRoutes.length} canonical URLs.`);
