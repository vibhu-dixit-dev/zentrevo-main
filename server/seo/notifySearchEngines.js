const SITE_ORIGIN = 'https://www.zentrevo.in';
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;

/**
 * After catalog changes: warm the live sitemap + notify search engines.
 * Fire-and-forget — never throw to callers; SEO ping must not block admin saves.
 */
export default async function notifySearchEngines(options = {}) {
  const urls = Array.isArray(options.urls)
    ? options.urls.filter((u) => typeof u === 'string' && u.startsWith('http'))
    : [];
  const results = {
    sitemapWarmed: false,
    googlePing: false,
    bingPing: false,
    indexNow: false,
    errors: []
  };

  try {
    const warmRes = await fetch(SITEMAP_URL, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      signal: AbortSignal.timeout(8000)
    });
    results.sitemapWarmed = warmRes.ok;
  } catch (err) {
    results.errors.push(`sitemap-warm: ${err?.message || err}`);
  }

  try {
    const googleRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
      { method: 'GET', signal: AbortSignal.timeout(8000) }
    );
    results.googlePing = googleRes.ok || googleRes.status === 200;
  } catch (err) {
    results.errors.push(`google-ping: ${err?.message || err}`);
  }

  try {
    const bingRes = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
      { method: 'GET', signal: AbortSignal.timeout(8000) }
    );
    results.bingPing = bingRes.ok || bingRes.status === 200;
  } catch (err) {
    results.errors.push(`bing-ping: ${err?.message || err}`);
  }

  // IndexNow (Bing / Yandex / others) — optional key via env
  const indexNowKey = process.env.INDEXNOW_KEY || process.env.VITE_INDEXNOW_KEY;
  if (indexNowKey && urls.length > 0) {
    try {
      const indexRes = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'www.zentrevo.in',
          key: indexNowKey,
          keyLocation: `${SITE_ORIGIN}/${indexNowKey}.txt`,
          urlList: urls.slice(0, 100)
        }),
        signal: AbortSignal.timeout(8000)
      });
      results.indexNow = indexRes.ok || indexRes.status === 200 || indexRes.status === 202;
    } catch (err) {
      results.errors.push(`indexnow: ${err?.message || err}`);
    }
  }

  return results;
}

export { SITE_ORIGIN, SITEMAP_URL };
