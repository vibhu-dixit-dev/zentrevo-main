import { destinations, blogArticles, getActiveDestinations } from '../data/travelData';

// Slugify helper: transforms text into a clean URL slug
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Client-specified SEO metadata for key destinations (from the Oct 27, 2026 SEO Short Plan)
export const CLIENT_DESTINATIONS_SEO = {
  bali: {
    slug: 'bali',
    matchKeys: ['bali', 'ubud', 'uluwatu'],
    title: 'Bali Trip from India: Ubud Calm to Uluwatu Sunsets',
    description: "Ubud rice terraces, temple mornings and Uluwatu sunsets. A 5-night Bali plan from India that you can reshape. Quote in 24 hours.",
    path: '/destinations/bali'
  },
  japan: {
    slug: 'japan',
    matchKeys: ['japan', 'kyoto', 'tokyo'],
    title: 'Japan Trip from India: Kyoto Temples to Tokyo Nights',
    description: "Kyoto temples, Tokyo nights and the trains between. A custom Japan trip from India, built around your pace and budget.",
    path: '/destinations/japan'
  },
  switzerland: {
    slug: 'switzerland',
    matchKeys: ['switzerland', 'swiss', 'alps', 'glacier express'],
    title: 'Switzerland Trip from India: Glacier Trains & Lakes',
    description: "Glacier trains, lake towns and Alpine villages. A custom Switzerland trip from India with a clear day-by-day plan and quote.",
    path: '/destinations/switzerland'
  },
  italy: {
    slug: 'italy',
    matchKeys: ['italy', 'amalfi', 'positano', 'capri'],
    title: 'Italy Trip from India: Amalfi Coast, Done Slowly',
    description: "Cliffside towns, slow lunches and coastal roads. A custom Amalfi Coast trip from India, planned around your dates.",
    path: '/destinations/italy'
  },
  turkey: {
    slug: 'turkey',
    matchKeys: ['turkey', 'cappadocia', 'istanbul'],
    title: 'Turkey Trip from India: Cappadocia at Sunrise',
    description: "Balloons over Cappadocia, cave stays and Istanbul bazaars. A custom Turkey trip from India with a plan and quote in 24 hours.",
    path: '/destinations/turkey'
  },
  kerala: {
    slug: 'kerala',
    matchKeys: ['kerala', 'houseboats', 'munnar', 'vembanad'],
    title: 'Kerala Trip: Houseboats, Tea Hills & Quiet Beaches',
    description: "Houseboat days, tea-hill mornings and quiet beaches. A custom Kerala trip for couples, families and groups.",
    path: '/destinations/kerala'
  },
  ladakh: {
    slug: 'ladakh',
    matchKeys: ['ladakh', 'nubra', 'pangong'],
    title: 'Ladakh High Altitude & Nubra Glamping | Zentrevo',
    description: "Heated luxury geodesic domes under starry Himalayan skies, private monastery blessings, and double-humped camel dunes.",
    path: '/destinations/ladakh'
  },
  rajasthan: {
    slug: 'rajasthan',
    matchKeys: ['rajasthan', 'udaipur', 'mewar', 'lake pichola'],
    title: 'Udaipur Lake Palace & Mewar Royal Heritage | Zentrevo',
    description: "Private Lake Pichola palace stays, royal vintage car safari through the Aravalli hills, and candlelit courtyard dining.",
    path: '/destinations/rajasthan'
  },
  kashmir: {
    slug: 'kashmir',
    matchKeys: ['kashmir', 'dal lake', 'pahalgam', 'shikara'],
    title: 'Kashmir Valley & Dal Lake Cedar Houseboat | Zentrevo',
    description: "Hand-carved royal pinewood houseboat suites, private dawn shikara floating market access, and Pahalgam pine valley treks.",
    path: '/destinations/kashmir'
  },
  iceland: {
    slug: 'iceland',
    matchKeys: ['iceland', 'reykjavik', 'aurora'],
    title: 'Reykjavik & Aurora Borealis Wilderness | Zentrevo',
    description: "Super-jeep expeditions into ice caves, private geothermal lagoon bathing, and clear-roof glass igloo nights.",
    path: '/destinations/iceland'
  }
};

// Map article slugs
export const BLOG_SLUGS_MAP = {
  1: 'remote-destinations-2026',
  2: 'art-of-slow-travel',
  3: 'master-ceramicists-in-kyoto',
  4: 'alpine-sanctuaries-engadin-valley',
  5: 'secret-royal-kitchens-of-mewar',
  6: 'great-migration-by-starlight'
};

// Default Home SEO
export const DEFAULT_SEO = {
  title: 'Zentrevo | Trips Planned by People, Not Templates',
  description: "Share your dates and budget. A real planner builds your trip, guides your visa and stays on WhatsApp until you're home. Quote in 24 hours.",
  canonical: 'https://www.zentrevo.in/',
  ogImage: 'https://www.zentrevo.in/images/og-home.jpg'
};

// Determine the primary URL slug for any destination item
export function getDestinationSlug(item) {
  if (!item) return '';
  if (item.slug) return item.slug;

  const loc = (item.location || '').toLowerCase();
  const title = (item.title || '').toLowerCase();

  // 1. Check known client destinations first
  for (const [key, data] of Object.entries(CLIENT_DESTINATIONS_SEO)) {
    if (data.matchKeys.some(k => loc.includes(k) || title.includes(k))) {
      return key;
    }
  }

  // 2. Custom destination fallback (from title or location)
  if (item.title) {
    return slugify(item.title);
  }
  return slugify(item.location || `trip-${item.id}`);
}

// Find a destination object from an URL slug or path
export function findDestinationBySlug(slug, allDestinations = null) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().replace(/^\/destinations\/?/, '').replace(/\/$/, '').trim();
  if (!cleanSlug) return null;

  const list = allDestinations || (typeof window !== 'undefined' ? getActiveDestinations() : destinations);

  // 1. Exact match with client-defined key
  if (CLIENT_DESTINATIONS_SEO[cleanSlug]) {
    const data = CLIENT_DESTINATIONS_SEO[cleanSlug];
    const match = list.find(d => {
      const loc = (d.location || '').toLowerCase();
      const title = (d.title || '').toLowerCase();
      return data.matchKeys.some(k => loc.includes(k) || title.includes(k));
    });
    if (match) return match;
  }

  // 2. Exact match on slugify(title) or slugify(location) or id
  const directMatch = list.find(d => {
    if (String(d.id) === cleanSlug) return true;
    if (d.slug && d.slug === cleanSlug) return true;
    if (slugify(d.title) === cleanSlug) return true;
    if (slugify(d.location) === cleanSlug) return true;
    return false;
  });
  if (directMatch) return directMatch;

  // 3. Substring match
  return list.find(d => {
    const titleSlug = slugify(d.title);
    const locSlug = slugify(d.location);
    return titleSlug.includes(cleanSlug) || cleanSlug.includes(titleSlug) ||
           locSlug.includes(cleanSlug) || cleanSlug.includes(locSlug);
  }) || null;
}

// Determine slug for a blog article
export function getBlogSlug(article) {
  if (!article) return '';
  if (BLOG_SLUGS_MAP[article.id]) {
    return BLOG_SLUGS_MAP[article.id];
  }
  return slugify(article.title);
}

// Find an article from a slug
export function findArticleBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().replace(/^\/(journal|blog)\/?/, '').replace(/\/$/, '').trim();
  if (!cleanSlug) return null;

  // 1. Check ID in BLOG_SLUGS_MAP
  for (const [id, mappedSlug] of Object.entries(BLOG_SLUGS_MAP)) {
    if (mappedSlug === cleanSlug) {
      const found = blogArticles.find(a => a.id === Number(id));
      if (found) return found;
    }
  }

  // 2. Direct match by id or slugified title
  return blogArticles.find(a => {
    if (String(a.id) === cleanSlug) return true;
    if (slugify(a.title) === cleanSlug) return true;
    return slugify(a.title).includes(cleanSlug) || cleanSlug.includes(slugify(a.title));
  }) || null;
}

// Helper to update Document Meta tags dynamically for SEO
export function updateDocumentSeo({ title, description, canonical, ogImage, ogType = 'website' }) {
  if (typeof document === 'undefined') return;

  // Title
  if (title) {
    document.title = title;
  }

  // Meta description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  if (description) {
    descMeta.setAttribute('content', description);
  }

  // Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  if (canonical) {
    canonicalLink.setAttribute('href', canonical);
  }

  // Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute('content', title);

  // Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && description) ogDesc.setAttribute('content', description);

  // Open Graph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && canonical) ogUrl.setAttribute('content', canonical);

  // Open Graph Image
  let ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg && ogImage) ogImg.setAttribute('content', ogImage);
}

// Reset SEO back to homepage default
export function resetDocumentSeo() {
  updateDocumentSeo({
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    canonical: DEFAULT_SEO.canonical,
    ogImage: DEFAULT_SEO.ogImage
  });
}
