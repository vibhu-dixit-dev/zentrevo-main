import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

function renderHtmlPage({ title, heading, message, email }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} • ZENTREVO</title>
</head>
<body style="margin:0;padding:40px 16px;background-color:#050b18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3f4f6;display:flex;align-items:center;justify-content:center;min-height:100vh;box-sizing:border-box;">
  <div style="max-width:520px;width:100%;background-color:#0b1528;border:1px solid rgba(217,119,6,0.35);border-radius:24px;padding:40px 32px;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#f59e0b;font-weight:700;margin-bottom:10px;">The Private Journal</div>
    <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 14px;">${heading}</h1>
    <p style="font-size:14px;line-height:1.7;color:#d1d5db;margin:0 0 24px;">${message}</p>
    ${email ? `<div style="display:inline-block;padding:8px 16px;border-radius:9999px;background-color:#07101e;border:1px solid rgba(245,158,11,0.3);color:#fbbf24;font-size:12px;font-family:monospace;margin-bottom:28px;">${email}</div><br/>` : ''}
    <a href="https://www.zentrevo.in/" style="display:inline-block;background:linear-gradient(90deg,#f59e0b,#fbbf24);color:#050b18;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Return to Zentrevo</a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    let rawEmail = req.query?.email || req.body?.email || '';
    if (!rawEmail && req.url) {
      const parsedUrl = new URL(req.url, 'https://www.zentrevo.in');
      rawEmail = parsedUrl.searchParams.get('email') || '';
    }

    const cleanEmail = String(rawEmail).trim().toLowerCase();
    const wantsJson = req.method === 'POST' || String(req.headers?.accept || '').includes('application/json');

    if (!cleanEmail || !cleanEmail.includes('@')) {
      if (wantsJson) {
        return res.status(400).json({ success: false, message: 'Valid email address is required.' });
      }
      if (typeof res.setHeader === 'function') res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(renderHtmlPage({
        title: 'Invalid Link',
        heading: 'Missing Email Address',
        message: 'We could not identify an email address in your unsubscribe request. Please contact contact@zentrevo.in for immediate assistance.'
      }));
    }

    if (supabase) {
      await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', cleanEmail);

      await supabase
        .from('inquiries')
        .update({ newsletter_subscribed: false })
        .ilike('email', cleanEmail);
    }

    if (wantsJson) {
      return res.status(200).json({
        success: true,
        email: cleanEmail,
        message: 'Successfully unsubscribed from The Private Journal.'
      });
    }

    if (typeof res.setHeader === 'function') res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(renderHtmlPage({
      title: 'Unsubscribed',
      heading: 'Preferences Updated',
      message: 'You have been respectfully removed from future Private Journal dispatches. Should you wish to curate a bespoke voyage anytime, our concierge remains available 24/7.',
      email: cleanEmail
    }));
  } catch (err) {
    console.error('Newsletter unsubscribe error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to process unsubscribe request.'
    });
  }
}
