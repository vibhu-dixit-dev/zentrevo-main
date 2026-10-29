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
    const { template, isTest, testRecipient } = req.body || {};

    if (!template || !template.subject) {
      return res.status(400).json({ success: false, message: 'Template subject is required.' });
    }

    const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE !== 'false';
    const smtpUser = process.env.SMTP_USER || 'contact@zentrevo.in';
    const smtpPass = process.env.SMTP_PASS || '';

    if (!smtpPass) {
      return res.status(500).json({
        success: false,
        message: 'SMTP_PASS is not configured in .env. Please configure SMTP to dispatch emails.'
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: true }
    });

    // Generate Luxury HTML Newsletter Template with Dynamic Personalization
    const generateHtml = (tpl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tpl.subject || 'ZENTREVO Private Dispatch'}</title>
</head>
<body style="margin:0;padding:0;background-color:#050b18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f3f4f6;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050b18;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:620px;background-color:#0b1528;border:1px solid rgba(217,119,6,0.35);border-radius:24px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);">
          
          <!-- Editorial Masthead -->
          <tr>
            <td style="padding:44px 36px 32px;text-align:center;background:linear-gradient(180deg,#0d1c3a 0%,#0b1528 100%);border-bottom:1px solid rgba(255,255,255,0.08);">
              <span style="font-size:10px;text-transform:uppercase;letter-spacing:4px;color:#f59e0b;font-weight:700;display:block;margin-bottom:8px;">
                ${tpl.issueTag || 'The Private Journal • Weekly Edition'}
              </span>
              <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 10px;line-height:1.3;letter-spacing:0.5px;">
                ${tpl.headline || 'Curated Itineraries, Hidden Sanctuaries & Private Access'}
              </h1>
              <p style="font-size:12px;color:#9ca3af;margin:0;letter-spacing:1px;text-transform:uppercase;">
                Dispatched from Zentrevo Global Concierge
              </p>
            </td>
          </tr>

          <!-- Main Editorial Story with Personalized Greeting -->
          <tr>
            <td style="padding:36px 36px 24px;line-height:1.75;font-size:14px;color:#d1d5db;">
              <div style="margin-bottom:24px;font-size:14px;white-space:pre-line;">
                ${tpl.editorialText || 'Welcome to this week\'s private journal. Our destination curators have scouted three unprecedented routes for travelers seeking absolute tranquility and pristine beauty.'}
              </div>

              <!-- Pull Quote -->
              ${tpl.pullQuote ? `
              <div style="margin:24px 0;padding:18px 24px;background-color:#081020;border-left:4px solid #f59e0b;border-radius:8px;">
                <p style="margin:0;font-style:italic;font-size:13px;color:#fef3c7;">
                  "${tpl.pullQuote}"
                </p>
              </div>` : ''}

              <!-- Featured Itinerary Card (if selected) -->
              ${tpl.featuredTrip ? `
              <div style="margin:32px 0 20px;border:1px solid rgba(217,119,6,0.25);border-radius:18px;overflow:hidden;background-color:#07101e;">
                ${tpl.featuredTrip.image ? `
                <img src="${tpl.featuredTrip.image}" alt="${tpl.featuredTrip.title}" style="width:100%;height:220px;object-fit:cover;display:block;" />
                ` : ''}
                <div style="padding:22px;">
                  <span style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#f59e0b;font-weight:700;display:block;margin-bottom:4px;">
                    ${tpl.featuredTrip.location || 'Curator Highlight'}
                  </span>
                  <h3 style="font-size:18px;font-weight:700;color:#ffffff;margin:0 0 8px;">
                    ${tpl.featuredTrip.title}
                  </h3>
                  <p style="font-size:13px;color:#9ca3af;margin:0 0 14px;line-height:1.6;">
                    ${tpl.featuredTrip.description || tpl.featuredTrip.highlight || 'Private helicopter transfer, cliffside villa buyout, and private chef services included.'}
                  </p>
                  
                  ${tpl.featuredTrip.perks ? `
                  <div style="margin-bottom:16px;padding:12px;background-color:rgba(217,119,6,0.1);border:1px solid rgba(217,119,6,0.2);border-radius:10px;">
                    <span style="font-size:10px;text-transform:uppercase;color:#f59e0b;font-weight:700;display:block;margin-bottom:2px;">Exclusive Privilege:</span>
                    <span style="font-size:12px;color:#fef3c7;">${tpl.featuredTrip.perks}</span>
                  </div>` : ''}

                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size:14px;font-weight:700;color:#f59e0b;">
                        ${tpl.featuredTrip.price ? `From ${tpl.featuredTrip.price}` : 'Private Quote on Inquiry'}
                      </td>
                      <td align="right">
                        <a href="${tpl.ctaUrl || 'https://zentrevo.in/#inquiry'}" style="background-color:#f59e0b;color:#050b18;text-decoration:none;padding:8px 20px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:inline-block;">Reserve Dossier</a>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>` : ''}

              <!-- Concierge Closing -->
              <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;color:#9ca3af;">
                <p style="margin:0 0 4px;color:#ffffff;font-weight:600;">With warm regards,</p>
                <p style="margin:0;color:#f59e0b;font-weight:700;">The Zentrevo Private Concierge</p>
                <p style="margin:4px 0 0;font-size:11px;color:#6b7280;">London • Paris • Mumbai • Tokyo</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 36px;text-align:center;background-color:#070e1c;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#6b7280;line-height:1.6;">
              <p style="margin:0 0 6px;">
                © 2026 Zentrevo Journeys Private Limited. All rights reserved.
              </p>
              <p style="margin:0 0 10px;">
                You received this dispatch because you are registered with The Private Journal at zentrevo.in.
              </p>
              <p style="margin:0;">
                <a href="https://zentrevo.in" style="color:#9ca3af;text-decoration:underline;">Manage Preferences</a> •
                <a href="https://zentrevo.in" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Case 1: Send Test Email
    if (isTest) {
      const target = testRecipient || 'contact@zentrevo.in';
      const testGreeting = target.toLowerCase().includes('contact@zentrevo.in')
        ? 'Dear Concierge Admin,'
        : 'Dear Traveller,';

      let testBody = template.editorialText || '';
      if (/^Dear\s+[^,\n]+,/i.test(testBody)) {
        testBody = testBody.replace(/^Dear\s+[^,\n]+,/i, testGreeting);
      } else {
        testBody = `${testGreeting}\n\n${testBody}`;
      }

      const testTemplate = { ...template, editorialText: testBody };
      const htmlContent = generateHtml(testTemplate);

      await transporter.sendMail({
        from: `"Zentrevo Private Journal" <${smtpUser}>`,
        to: target,
        subject: `[TEST PREVIEW] ${template.subject}`,
        html: htmlContent
      });

      return res.status(200).json({
        success: true,
        message: `Test email dispatched to ${target}`
      });
    }

    // Case 2: Mass Broadcast to All Active Subscribers in Supabase with Personalized Greeting
    let recipients = [];
    if (supabase) {
      const emailMap = new Map();

      // 1. Fetch from dedicated newsletter_subscribers table
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
                name: item.name && item.name !== 'Journal Subscriber' && item.name !== 'Traveler' && item.name !== 'Traveller' && item.name.toLowerCase() !== 'patron' ? String(item.name).trim() : ''
              });
            }
          }
        }
      } catch (_) {}

      // 2. Also fetch from inquiries table (deduplicated) for any existing opted-in clients
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
      // Fallback recipient
      recipients = [{ email: process.env.NOTIFICATION_EMAIL || 'contact@zentrevo.in', name: '' }];
    }

    // Dispatch emails individually with personal greetings
    let dispatchedCount = 0;
    for (const recipient of recipients) {
      try {
        const rawName = recipient.name;
        // Greeting logic: if name is available and not generic "Valued Guest" or "Patron", use "Dear [Name],", else "Dear Traveller,"
        const greeting = (rawName && rawName.toLowerCase() !== 'valued guest' && rawName.toLowerCase() !== 'patron')
          ? `Dear ${rawName},`
          : `Dear Traveller,`;

        let personalizedBody = template.editorialText || '';
        if (/^Dear\s+[^,\n]+,/i.test(personalizedBody)) {
          personalizedBody = personalizedBody.replace(/^Dear\s+[^,\n]+,/i, greeting);
        } else {
          personalizedBody = `${greeting}\n\n${personalizedBody}`;
        }

        const personalizedTemplate = {
          ...template,
          editorialText: personalizedBody
        };
        const htmlContent = generateHtml(personalizedTemplate);

        await transporter.sendMail({
          from: `"Zentrevo Private Journal" <${smtpUser}>`,
          to: recipient.email,
          subject: template.subject,
          html: htmlContent
        });
        dispatchedCount++;
      } catch (sendErr) {
        console.warn(`Failed to dispatch to ${recipient.email}:`, sendErr.message);
      }
    }

    // Dispatched successfully to subscribers
    return res.status(200).json({
      success: true,
      message: `Newsletter successfully dispatched to ${dispatchedCount} subscriber(s).`,
      count: dispatchedCount
    });

  } catch (error) {
    console.error('Broadcast error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Broadcast failed.' });
  }
}
