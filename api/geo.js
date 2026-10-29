export default async function handler(req, res) {
  // Read Vercel's automated geolocation header
  const country = req.headers['x-vercel-ip-country'] || 
                  req.headers['x-country-code'] || 
                  req.headers['cf-ipcountry'] || 
                  '';

  // Cache response at edge for 24 hours per client
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  
  return res.status(200).json({
    country: country ? String(country).toUpperCase() : null,
    isIndia: country ? String(country).toUpperCase() === 'IN' : null
  });
}
