import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required.' });
    }

    const subscriberEmail = String(email).trim().toLowerCase();

    // 1. Store in Supabase
    if (supabase) {
      try {
        await supabase.from('inquiries').insert([
          {
            name: 'Journal Subscriber',
            email: subscriberEmail,
            destination: 'The Private Journal Weekly',
            guests: '1 Reader',
            message: 'Subscribed via website footer to weekly private journal dispatches.',
            status: 'Newsletter Subscriber',
            newsletter_subscribed: true
          }
        ]);
      } catch (dbErr) {
        console.warn('Supabase subscription notice:', dbErr.message);
      }
    }

    // 2. Dispatch Welcome Email via Nodemailer if SMTP configured
    const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE !== 'false';
    const smtpUser = process.env.SMTP_USER || 'contact@zentrevo.in';
    const smtpPass = process.env.SMTP_PASS || '';

    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: true }
      });

      const welcomeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to The Private Journal • ZENTREVO</title>
</head>
<body style="margin:0;padding:0;background-color:#050b18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050b18;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#0b1528;border:1px solid #d97706;border-radius:24px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:40px 36px;text-align:center;background:linear-gradient(180deg,#0e1c38 0%,#0b1528 100%);border-bottom:1px solid rgba(217,119,6,0.3);">
              <span style="font-size:10px;text-transform:uppercase;letter-spacing:4px;color:#f59e0b;font-weight:700;">Invitation Confirmed</span>
              <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:12px 0 6px;letter-spacing:1px;">Welcome to The Private Journal</h1>
              <p style="font-size:13px;color:#9ca3af;margin:0;">ZENTREVO Curated Expeditions & Field Notes</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;line-height:1.7;font-size:14px;color:#d1d5db;">
              <p style="margin-top:0;">Dear Voyager,</p>
              <p>Thank you for subscribing to <strong>The Private Journal</strong>. Every Monday, our private voyage architects compile our most coveted insider intelligence:</p>
              <ul style="padding-left:20px;color:#9ca3af;">
                <li style="margin-bottom:8px;"><strong style="color:#ffffff;">Secret Sanctuaries:</strong> Newly opened cliffside villas, private islands, and high-altitude retreats.</li>
                <li style="margin-bottom:8px;"><strong style="color:#ffffff;">First-Look Access:</strong> Private helicopter charters, vintage yacht routes, and seasonal palace buyouts.</li>
                <li style="margin-bottom:8px;"><strong style="color:#ffffff;">Curator Dispatches:</strong> Behind-the-scenes interviews with master artisans and cultural custodians.</li>
              </ul>
              <div style="margin:28px 0;padding:20px;background-color:#081020;border-left:4px solid #f59e0b;border-radius:12px;">
                <p style="margin:0;font-style:italic;font-size:13px;color:#e5e7eb;">
                  "True luxury today is not what you possess, but the absolute stillness and wonder you summon around yourself."
                </p>
              </div>
              <p style="font-size:13px;color:#9ca3af;">Our next weekly dispatch is scheduled for this coming Monday. Should you wish to design a custom journey in the interim, our private concierge is always at your disposal.</p>
              <div style="text-align:center;padding-top:16px;">
                <a href="https://zentrevo.in/#inquiry" style="background:linear-gradient(90deg,#f59e0b,#fbbf24);color:#050b18;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:inline-block;">Explore Curated Voyages</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px;background-color:#070e1c;border-top:1px solid rgba(255,255,255,0.08);text-align:center;font-size:11px;color:#6b7280;">
              <p style="margin:0 0 6px;">ZENTREVO Private Travel Co. • Sector 49, Gurugram 122018</p>
              <p style="margin:0;">Official Support: <a href="mailto:contact@zentrevo.in" style="color:#f59e0b;text-decoration:none;">contact@zentrevo.in</a> • WhatsApp: +91 86199 28710</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await transporter.sendMail({
        from: `"Zentrevo Private Journal" <${smtpUser}>`,
        to: subscriberEmail,
        subject: '✨ Welcome to The Private Journal • ZENTREVO Curated Expeditions',
        html: welcomeHtml
      });
    }

    return res.status(200).json({ success: true, message: 'Subscribed successfully.' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ success: false, message: 'Could not complete subscription.' });
  }
}
