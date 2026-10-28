import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  try {
    const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE !== 'false';
    const smtpUser = process.env.SMTP_USER || 'contact@zentrevo.in';
    const smtpPass = process.env.SMTP_PASS || '';

    if (!smtpPass) {
      return res.status(200).json({ success: false, message: 'Cron skipped: SMTP not configured.' });
    }

    // 1. Fetch all subscribed patrons from Supabase with name & email (newsletter_subscribers + inquiries deduplicated)
    let recipients = [];
    if (supabase) {
      const emailMap = new Map();

      // Check dedicated newsletter_subscribers table
      try {
        const { data: subData } = await supabase
          .from('newsletter_subscribers')
          .select('email, name')
          .eq('is_active', true);

        if (subData) {
          for (const item of subData) {
            const cleanEmail = String(item.email || '').trim().toLowerCase();
            if (cleanEmail.includes('@') && !cleanEmail.includes('zentrevo.in')) {
              emailMap.set(cleanEmail, {
                email: cleanEmail,
                name: item.name && item.name !== 'Journal Subscriber' && item.name !== 'Traveler' ? String(item.name).trim() : ''
              });
            }
          }
        }
      } catch (_) {}

      // Check inquiries table (deduplicated)
      try {
        const { data: inqData } = await supabase
          .from('inquiries')
          .select('email, name')
          .eq('newsletter_subscribed', true);

        if (inqData) {
          for (const item of inqData) {
            const cleanEmail = String(item.email || '').trim().toLowerCase();
            if (cleanEmail.includes('@') && !cleanEmail.includes('zentrevo.in')) {
              if (!emailMap.has(cleanEmail) || (!emailMap.get(cleanEmail).name && item.name)) {
                emailMap.set(cleanEmail, {
                  email: cleanEmail,
                  name: item.name ? String(item.name).trim() : ''
                });
              }
            }
          }
        }
      } catch (_) {}

      recipients = Array.from(emailMap.values());
    }

    if (recipients.length === 0) {
      return res.status(200).json({ success: true, message: 'Cron completed: No subscribers found.' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: true }
    });

    const generateWeeklyHtml = (greeting) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#050b18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050b18;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#0b1528;border:1px solid rgba(217,119,6,0.35);border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:40px 36px;text-align:center;background:linear-gradient(180deg,#0e1c38 0%,#0b1528 100%);">
              <span style="font-size:10px;text-transform:uppercase;letter-spacing:4px;color:#f59e0b;font-weight:700;">The Private Journal • Weekly Dispatch</span>
              <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:10px 0;">New Secret Sanctuaries & Pacing Notes</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;line-height:1.75;font-size:14px;color:#d1d5db;">
              <p style="font-weight:600;color:#ffffff;">${greeting}</p>
              <p>Welcome to this week's editorial dispatch from Zentrevo. Our private journey architects have curated three new high-altitude sanctuaries and private coastal estates for your upcoming calendar.</p>
              <div style="text-align:center;padding:24px 0;">
                <a href="https://zentrevo.in/#stories" style="background:linear-gradient(90deg,#f59e0b,#fbbf24);color:#050b18;text-decoration:none;padding:12px 30px;border-radius:9999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:inline-block;">Read Weekly Field Notes</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;text-align:center;font-size:11px;color:#6b7280;background-color:#070e1c;">
              ZENTREVO Private Travel Co. • contact@zentrevo.in
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    let count = 0;
    for (const recipient of recipients) {
      try {
        const rawName = recipient.name;
        const greeting = (rawName && rawName.toLowerCase() !== 'valued guest')
          ? `Dear ${rawName},`
          : `Dear Traveler,`;

        await transporter.sendMail({
          from: `"Zentrevo Private Journal" <${smtpUser}>`,
          to: recipient.email,
          subject: 'Zentrevo Private Journal: Weekly Field Notes & Secret Sanctuaries',
          html: generateWeeklyHtml(greeting)
        });
        count++;
      } catch (err) {
        console.warn(`Cron dispatch failed to ${recipient.email}:`, err.message);
      }
    }

    return res.status(200).json({ success: true, count, message: `Cron executed: ${count} emails dispatched.` });
  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
