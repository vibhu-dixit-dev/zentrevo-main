import React, { useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  MessageCircle, 
  ArrowLeft, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Mail, 
  Phone,
  CalendarCheck,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { updateDocumentSeo, resetDocumentSeo } from '../lib/seoRoutes';

export default function ThankYouPage({
  currentTheme = 'editorial',
  onSelectTheme,
  onNavigateHome,
  onNavigate,
  onOpenInquiry,
  onOpenJournal,
  onOpenVisa
}) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  // Read form type from query param (e.g. /thank-you?type=quote, ?type=visa, ?type=newsletter, ?type=contact)
  const formType = useMemo(() => {
    if (typeof window === 'undefined') return 'quote';
    const params = new URLSearchParams(window.location.search);
    const t = params.get('type') || '';
    if (['visa', 'newsletter', 'contact'].includes(t.toLowerCase())) {
      return t.toLowerCase();
    }
    return 'quote';
  }, []);

  // 1. Meta noindex & dynamic title protection (Search Engine Safe)
  useEffect(() => {
    window.scrollTo(0, 0);
    updateDocumentSeo({
      title: 'Inquiry Received | Zentrevo Curated Journeys',
      description: 'Thank you for contacting Zentrevo. Your travel consultation request is confirmed.',
      canonical: 'https://www.zentrevo.in/thank-you',
      robots: 'noindex, nofollow'
    });

    return () => {
      resetDocumentSeo();
    };
  }, []);

  // 2. GA4 & Meta Pixel Lead Tracking (Safe execution with or without installed scripts)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // GA4 Lead Conversion Event
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'generate_lead', {
          event_category: 'Lead',
          event_label: formType,
          form_type: formType,
          value: 1
        });
      } catch (err) {
        console.warn('GA4 tracking notice:', err);
      }
    }

    // Meta (Facebook/Instagram) Pixel Lead Event
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead', {
          content_name: formType,
          content_category: 'Travel Inquiry',
          currency: 'INR'
        });
      } catch (err) {
        console.warn('Meta Pixel tracking notice:', err);
      }
    }
  }, [formType]);

  // Contextual copy and details based on form submission type
  const details = useMemo(() => {
    switch (formType) {
      case 'visa':
        return {
          badge: 'Consular & Visa Guidance Confirmed',
          title: 'Your Visa Consultation Is Logged',
          subtitle: 'Our senior documentation advisor will review your destination paperwork requirements and prepare an embassy-ready checklist tailored to Indian passport holders.',
          timeline: [
            {
              step: '1. Requirement Audit',
              desc: 'We cross-verify current embassy rules, slot timelines, and photo/income mandates.'
            },
            {
              step: '2. Dossier Preparation',
              desc: 'You receive confirmed flight/hotel vouchers and customized cover letter templates.'
            },
            {
              step: '3. Form Pre-Screening',
              desc: 'Every field is thoroughly checked before your consular or VFS appointment.'
            }
          ],
          whatsAppMsg: 'Hello Zentrevo Concierge, I just submitted a Visa Guidance request on your website. Could we connect?'
        };

      case 'newsletter':
        return {
          badge: 'Subscription Confirmed',
          title: 'Welcome to The Private Journal',
          subtitle: 'You are now part of our global inner circle. Dispatches featuring secretive valleys, culinary dynasties, and seasonal expedition openings will arrive in your inbox monthly.',
          timeline: [
            {
              step: '1. Welcome Dispatch',
              desc: 'An introductory curator briefing is on its way to your inbox.'
            },
            {
              step: '2. Monthly Field Notes',
              desc: 'Delivered on the first Saturday of each month with early itinerary access.'
            },
            {
              step: '3. Invitation Openings',
              desc: 'Exclusive access to chartered expeditions before public announcement.'
            }
          ],
          whatsAppMsg: 'Hello Zentrevo, I just subscribed to The Private Journal on your website!'
        };

      case 'contact':
        return {
          badge: 'Direct Message Received',
          title: 'Thank You for Reaching Out',
          subtitle: 'Your inquiry has been dispatched directly to our Senior Concierge Desk at Sector 49, Gurugram. We will review your query and reply within 24 hours.',
          timeline: [
            {
              step: '1. Desk Allocation',
              desc: 'Your request is assigned to a specialist curator matching your region of interest.'
            },
            {
              step: '2. Verification',
              desc: 'We verify on-ground hotel, villa, and transfer options suited to your inquiry.'
            },
            {
              step: '3. Personal Follow-up',
              desc: 'You receive a detailed reply via email or phone from contact@zentrevo.in.'
            }
          ],
          whatsAppMsg: 'Hello Zentrevo Concierge, I just submitted a message on your website contact form. Could we connect?'
        };

      case 'quote':
      default:
        return {
          badge: 'Bespoke Expedition Request Logged',
          title: 'Your Custom Journey Proposal Is Underway',
          subtitle: 'A real expedition curator (not a bot) has received your travel dates, pacing, and destination wishlist. We are preparing a personalized day-by-day plan and transparent quote within 24 hours.',
          timeline: [
            {
              step: '1. Tailored Blueprint',
              desc: 'Crafting private villa stays, curated excursions, and seamless private transfers.'
            },
            {
              step: '2. Transparent Pricing',
              desc: 'Clear itemized quote in your chosen currency with zero hidden charges.'
            },
            {
              step: '3. WhatsApp Handover',
              desc: '1-on-1 WhatsApp concierge handover with your planner until you are safely home.'
            }
          ],
          whatsAppMsg: 'Hello Zentrevo Concierge, I just submitted a custom itinerary quote request on your website. Could we connect?'
        };
    }
  }, [formType]);

  const whatsAppLink = `https://wa.me/918619928710?text=${encodeURIComponent(details.whatsAppMsg)}`;

  return (
    <div className={`min-h-screen font-sans-clean transition-colors duration-500 flex flex-col justify-between ${
      isSapphire
        ? 'bg-[#050a16] text-stone-100'
        : isEmerald 
          ? 'bg-[#061813] text-stone-100' 
          : 'bg-[#faf9f6] text-stone-900'
    }`}>
      {/* Global Navbar */}
      <Navbar 
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onOpenInquiry={() => onOpenInquiry && onOpenInquiry('Custom Journey Consultation')}
        onOpenJournal={onOpenJournal}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 w-full flex-1 flex flex-col justify-center">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-6 opacity-70">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="font-semibold text-amber-500">Confirmation</span>
        </nav>

        {/* Hero Card */}
        <div className={`p-6 sm:p-10 lg:p-12 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isSapphire
            ? 'bg-[#08142c] border-amber-500/35 text-white shadow-blue-950/60'
            : isEmerald
              ? 'bg-[#09221b] border-emerald-700/50 text-white shadow-emerald-950/50'
              : 'bg-white border-stone-200 text-stone-900 shadow-xl'
        }`}>
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              isSapphire 
                ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30' 
                : isEmerald 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-600/40' 
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                isSapphire
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-500/30'
                  : isEmerald
                    ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-600/30'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}>
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{details.badge}</span>
              </span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className={`font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 leading-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            {details.title}
          </h1>

          <p className={`text-xs sm:text-base leading-relaxed max-w-2xl mb-8 ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            {details.subtitle}
          </p>

          {/* 3-Step Next Steps Breakdown */}
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">
              What Happens Next:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {details.timeline.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDark 
                      ? 'bg-black/20 border-white/10' 
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1 text-amber-500">{item.step}</span>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Prominent WhatsApp Concierge + Return Home */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-stone-200/20">
            {/* WhatsApp Priority Button */}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-[1.02] cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-950/20"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp (+91 86199 28710)</span>
            </a>

            {/* Return to Expeditions Button */}
            <button
              type="button"
              onClick={onNavigateHome}
              className={`px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              }`}
            >
              <span>Explore More Expeditions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Support Reassurance Footer */}
          <div className="mt-6 pt-4 border-t border-stone-200/10 flex flex-wrap items-center justify-between gap-3 text-[11px] opacity-75">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zentrevo Sovereign Travel Privacy Guarantee • No Spam</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="mailto:contact@zentrevo.in" className="hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>contact@zentrevo.in</span>
              </a>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>24/7 Concierge Support</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Global Footer */}
      <Footer 
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onOpenInquiry={() => onOpenInquiry && onOpenInquiry('Voyage Inquiry')}
        onOpenJournal={onOpenJournal}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />
    </div>
  );
}
