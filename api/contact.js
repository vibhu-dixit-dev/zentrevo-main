import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client from environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      destination,
      guests,
      message,
      _hp_security_check // Honeypot field for bot suppression
    } = req.body || {};

    // 1. Invisible Honeypot Spam Trap
    if (_hp_security_check) {
      // Return 200 OK without sending email so spam bots are tricked
      return res.status(200).json({ success: true, message: 'Inquiry received' });
    }

    // 2. Validate essential fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Client name and email address are required.'
      });
    }

    const clientName = String(name).trim();
    const clientEmail = String(email).trim();
    const clientPhone = phone ? String(phone).trim() : 'Not provided';
    const clientDest = destination ? String(destination).trim() : 'Custom Expedition';
    const clientGuests = guests ? String(guests).trim() : '2 Guests (Couple)';
    const clientMessage = message ? String(message).trim() : 'No additional requests specified.';
    const planPrice = req.body?.plan_price ? Number(req.body.plan_price) : 2500;

    // 2.5 Persist Lead in Supabase Database (if not already inserted by client)
    if (supabase && !req.body?._supabase_already_saved) {
      try {
        const leadPayload = {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          destination: clientDest,
          guests: clientGuests,
          message: clientMessage,
          status: 'New Inquiry',
          newsletter_subscribed: true,
          plan_price: planPrice
        };

        let { error: dbError } = await supabase.from('inquiries').insert([leadPayload]);
        if (dbError && (dbError.message?.includes('plan_price') || dbError.code === 'PGRST204')) {
          const { plan_price, ...payloadWithoutPrice } = leadPayload;
          const retry = await supabase.from('inquiries').insert([payloadWithoutPrice]);
          dbError = retry.error;
        }

        if (dbError) {
          console.warn('⚠️ Supabase Lead insertion notice:', dbError.message);
        } else {
          console.log(`✅ Supabase Lead saved successfully for: ${clientEmail} with plan price: $${planPrice}`);
        }
      } catch (dbErr) {
        console.warn('⚠️ Supabase insertion catch block:', dbErr.message);
      }
    }

    // 3. SMTP Credentials (GoDaddy Secureserver / Titan for contact@zentrevo.in)
    const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE !== 'false'; // true for port 465
    const smtpUser = process.env.SMTP_USER || 'contact@zentrevo.in';
    const smtpPass = process.env.SMTP_PASS || '';

    // Alert recipient (owner / team)
    const notificationRecipients = process.env.NOTIFICATION_EMAIL || 'contact@zentrevo.in,vibhudixit88@gmail.com';

    if (!smtpPass) {
      console.warn('⚠️ SMTP_PASS is not configured in .env.');
      // If running locally without SMTP_PASS, simulate success so the UI and booking flow can be tested
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📬 [LOCAL DEV SIMULATION] Dossier received for: ${clientName} (${clientEmail})`);
        console.log(`   Destination: ${clientDest} | Party: ${clientGuests}`);
        console.log('   👉 To send REAL emails locally via Titan, add SMTP_PASS=your_password in your .env file!');
        return res.status(200).json({
          success: true,
          message: 'Local simulation: Dossier received successfully. Add SMTP_PASS in .env for live transmission.'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'SMTP credentials not configured. Please set SMTP_PASS in Vercel environment variables.'
      });
    }

    // 4. Initialize Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    const encodedWhatsAppMessage = encodeURIComponent(
      `Hello Zentrevo Concierge, I submitted an inquiry for ${clientDest} (${clientGuests}) under the name ${clientName}. Could we discuss custom arrangements?`
    );
    const whatsappLink = `https://wa.me/918619928710?text=${encodedWhatsAppMessage}`;

    // 5. High-End Editorial HTML Template for Client Auto-Responder
    const clientHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ZENTREVO Expedition Dossier</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f6f5f2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Framed Editorial Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);" cellspacing="0" cellpadding="0">
          
          <!-- Top Editorial Monogram Header -->
          <tr>
            <td style="padding: 44px 44px 28px 44px; text-align: center; border-bottom: 1px solid #f0ede6; background-color: #ffffff;">
              <div style="font-family: Georgia, 'Playfair Display', serif; font-size: 26px; font-weight: 700; letter-spacing: 0.18em; color: #1c1917; text-transform: uppercase;">
                Z E N T R E V O
              </div>
              <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.28em; color: #b45309; text-transform: uppercase; margin-top: 8px;">
                Curated Expeditions &bull; Private Concierge
              </div>
            </td>
          </tr>

          <!-- Main Letter Content -->
          <tr>
            <td style="padding: 40px 44px 32px 44px;">
              <div style="font-family: Georgia, 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #1c1917; line-height: 1.35; margin-bottom: 20px;">
                Your Bespoke Journey Dossier Has Been Received
              </div>

              <p style="font-size: 14px; line-height: 1.7; color: #44403c; margin: 0 0 18px 0;">
                Dear <strong>${clientName}</strong>,
              </p>

              <p style="font-size: 14px; line-height: 1.7; color: #44403c; margin: 0 0 24px 0;">
                Thank you for entrusting ZENTREVO with your voyage vision. Our Senior Expedition Curators have received your requested itinerary parameters and have begun reviewing private villa allocations, seasonal timing, and VIP ground clearance.
              </p>

              <!-- Luxury Framed Itinerary Summary Card -->
              <table role="presentation" width="100%" style="background-color: #faf9f6; border: 1px solid #e7e5e4; border-radius: 16px; margin: 28px 0; overflow: hidden;" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 24px;">
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #78716c; margin-bottom: 16px; border-bottom: 1px dashed #d6d3d1; padding-bottom: 8px;">
                      Dossier Reference &bull; In Review
                    </div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="36%" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c;">
                          Destination
                        </td>
                        <td style="font-size: 13px; font-weight: 700; color: #1c1917;">
                          ${clientDest}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c;">
                          Travelers
                        </td>
                        <td style="font-size: 13px; font-weight: 600; color: #1c1917;">
                          ${clientGuests}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c;">
                          Direct Phone
                        </td>
                        <td style="font-size: 13px; font-weight: 600; color: #1c1917;">
                          ${clientPhone}
                        </td>
                      </tr>
                      ${clientMessage !== 'No additional requests specified.' ? `
                      <tr>
                        <td valign="top" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c;">
                          Wishes / Notes
                        </td>
                        <td style="font-size: 13px; line-height: 1.5; color: #44403c; font-style: italic;">
                          "${clientMessage}"
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; line-height: 1.7; color: #44403c; margin: 0 0 28px 0;">
                A personalized proposal dossier crafted for your exact pacing and style will be presented directly to you within <strong>24 hours</strong>.
              </p>

              <!-- Priority WhatsApp CTA Button -->
              <div style="text-align: center; margin: 34px 0 16px 0;">
                <a href="${whatsappLink}" target="_blank" style="background-color: #1c1917; color: #ffffff; padding: 15px 32px; border-radius: 9999px; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; display: inline-block; box-shadow: 0 10px 20px -5px rgba(0,0,0,0.15);">
                  Direct Concierge WhatsApp &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Signature & Global Office Footer -->
          <tr>
            <td style="padding: 28px 44px; background-color: #faf9f6; border-top: 1px solid #f0ede6; text-align: center;">
              <div style="font-size: 13px; font-weight: 700; color: #1c1917; margin-bottom: 4px;">
                ZENTREVO Travel Co.
              </div>
              <div style="font-size: 11px; color: #78716c; line-height: 1.6;">
                Sector 49, Gurugram 122018 &bull; +91 86199 28710<br>
                Official Concierge: <a href="mailto:contact@zentrevo.in" style="color: #b45309; text-decoration: none; font-weight: 600;">contact@zentrevo.in</a>
              </div>
              <div style="font-size: 10px; color: #a8a29e; margin-top: 12px;">
                &copy; ${new Date().getFullYear()} Zentrevo Luxury Travel &bull; All Rights Reserved
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 6. Admin Notification HTML Template
    const adminHtmlTemplate = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1917; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 24px;">
    <h2 style="color: #b45309; margin-top: 0;">✨ New ZENTREVO Expedition Dossier Request</h2>
    <p>A new traveler has submitted a custom journey proposal request via <strong>zentrevo.in</strong>:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="border-bottom: 1px solid #f0ede6;">
        <td style="padding: 10px 0; font-weight: bold; width: 35%;">Traveler Name:</td>
        <td style="padding: 10px 0;">${clientName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f0ede6;">
        <td style="padding: 10px 0; font-weight: bold;">Client Email:</td>
        <td style="padding: 10px 0;"><a href="mailto:${clientEmail}">${clientEmail}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f0ede6;">
        <td style="padding: 10px 0; font-weight: bold;">Phone Number:</td>
        <td style="padding: 10px 0;"><a href="tel:${clientPhone}">${clientPhone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f0ede6;">
        <td style="padding: 10px 0; font-weight: bold;">Destination:</td>
        <td style="padding: 10px 0;">${clientDest}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f0ede6;">
        <td style="padding: 10px 0; font-weight: bold;">Travelers / Party:</td>
        <td style="padding: 10px 0;">${clientGuests}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-weight: bold;" valign="top">Journey Vision:</td>
        <td style="padding: 10px 0; line-height: 1.5;">${clientMessage}</td>
      </tr>
    </table>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0ede6; font-size: 12px; color: #78716c;">
      Tip: You can hit <strong>Reply</strong> in your email client to reply directly to ${clientName} (${clientEmail}).
    </div>
  </div>
</body>
</html>
    `;

    // 7. Dispatch both emails via Titan SMTP
    // Email 1: Admin Alert to Zentrevo Team
    const adminMailPromise = transporter.sendMail({
      from: `"ZENTREVO Concierge Portal" <${smtpUser}>`,
      to: notificationRecipients,
      replyTo: clientEmail,
      subject: `✨ New Expedition Inquiry: ${clientName} (${clientDest})`,
      html: adminHtmlTemplate
    });

    // Email 2: Luxury Editorial Auto-Responder to Client
    const clientMailPromise = transporter.sendMail({
      from: `"ZENTREVO Private Concierge" <${smtpUser}>`,
      to: clientEmail,
      replyTo: smtpUser,
      subject: `✨ Your ZENTREVO Expedition Dossier is Received • ${clientDest}`,
      html: clientHtmlTemplate
    });

    // Send both concurrently
    await Promise.all([adminMailPromise, clientMailPromise]);

    return res.status(200).json({
      success: true,
      message: 'Expedition dossier successfully transmitted and auto-reply dispatched.'
    });

  } catch (error) {
    console.error('SMTP Mail Transmission Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error transmitting dossier via SMTP.'
    });
  }
}
