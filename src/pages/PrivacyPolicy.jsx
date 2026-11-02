import React, { useEffect } from 'react';
import { Compass, ArrowLeft, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { legalTranslations } from '../i18n/legalTranslations';

export default function PrivacyPolicy({ onNavigateHome, currentTheme = 'editorial' }) {
  const { language } = useLanguage();
  const lt = legalTranslations[language]?.privacy || null;
  const backText = legalTranslations[language]?.backHome || "Back to Home";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh' 
      ? "隐私政策 | Zentrevo 尊贵旅行" 
      : language === 'es' 
        ? "Política de Privacidad | Zentrevo Travel" 
        : language === 'ar' 
          ? "سياسة الخصوصية | رحلات زينتريفو" 
          : "Privacy Policy | Zentrevo Travel";
  }, [language]);

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  return (
    <div className={`min-h-screen font-sans-clean transition-colors duration-500 ${
      isSapphire 
        ? 'bg-[#050a16] text-stone-100' 
        : isEmerald 
          ? 'bg-[#061813] text-stone-100' 
          : 'bg-[#faf9f6] text-stone-900'
    }`}>
      {/* Top Navigation */}
      <header className={`sticky top-0 z-40 px-4 sm:px-8 py-4 backdrop-blur-xl border-b transition-colors ${
        isDark 
          ? 'bg-black/60 border-white/10 text-white' 
          : 'bg-white/95 border-stone-200 text-stone-900 shadow-sm'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-teal-400 to-sky-400 p-[1px]">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
                <Compass className="w-4 h-4 text-amber-200 group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            <div>
              <span className={`font-editorial text-lg tracking-[0.2em] uppercase font-bold block leading-tight ${
                isDark ? 'text-white' : 'text-stone-950'
              }`}>
                Zentrevo
              </span>
              <span className={`text-[9px] tracking-[0.25em] uppercase font-mono block ${
                isDark ? 'text-amber-300/80' : 'text-stone-500'
              }`}>
                Travel Co.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backText}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-10">
        {/* Page Header */}
        <div className={`space-y-3 border-b pb-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${
              isDark ? 'text-amber-300' : 'text-stone-600'
            }`}>
              {lt?.tag || "Legal & Privacy Disclosure"}
            </span>
          </div>

          <h1 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            {lt?.title || "Privacy Policy"}
          </h1>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {lt?.effectiveDate || "Effective Date: October 27, 2026 • Last Reviewed: October 2026"}
          </p>
        </div>

        {/* Introduction */}
        <section className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <p>
            {lt?.intro1 ? lt.intro1 : (
              <>At <strong className={isDark ? 'text-white' : 'text-stone-950'}>Zentrevo</strong> ("we", "us", or "our"), safeguarding your personal information is fundamental to our concierge craft. We operate the website <a href="https://www.zentrevo.in" className={`font-medium underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}>https://www.zentrevo.in</a> and coordinate private, custom travel itineraries from India to international and domestic destinations.</>
            )}
          </p>
          <p>
            {lt?.intro2 || "This Privacy Policy outlines how we collect, handle, protect, and process personal information when you browse our website, submit travel inquiries, subscribe to our Private Journal, or book bespoke travel journeys with our concierge team."}
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            <span>{lt?.sec1Title || "1. Information We Collect"}</span>
          </h2>
          <div className={`space-y-3 text-sm leading-relaxed pl-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt ? (
              <>
                <p>{lt.sec1A}</p>
                <p>{lt.sec1B}</p>
                <p>{lt.sec1C}</p>
              </>
            ) : (
              <>
                <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>A. Travel Inquiries & Booking Dossiers:</strong> When you submit an itinerary inquiry or confirm a journey, we collect your name, email address, phone/WhatsApp number, preferred travel dates, destination desires, guest count, and estimated budget.</p>
                <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>B. Travel Documents & Identification:</strong> For confirmed bookings and visa guidance assistance, we may receive passport scans, visa applications, date of birth, nationality, and emergency contact details strictly required by airlines, hotels, or embassies.</p>
                <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>C. Technical & Usage Telemetry:</strong> IP addresses, browser types, device information, referring URLs, and page interactions captured through standard analytics to optimize performance.</p>
              </>
            )}
          </div>
        </section>

        {/* 2. How We Use Your Information */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec2Title || "2. How We Use Your Information"}
          </h2>
          <ul className={`list-disc list-inside space-y-2 text-sm pl-2 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt ? (
              <>
                <li>{lt.sec2Item1}</li>
                <li>{lt.sec2Item2}</li>
                <li>{lt.sec2Item3}</li>
                <li>{lt.sec2Item4}</li>
              </>
            ) : (
              <>
                <li>To design custom, day-by-day travel itineraries and furnish quotes within 24 hours.</li>
                <li>To coordinate room reservations, private transfers, rail passes, and local experiences with verified partners.</li>
                <li>To provide step-by-step visa document verification and appointment scheduling guidance.</li>
                <li>To offer dedicated 24/7 on-trip concierge assistance via private WhatsApp channels.</li>
              </>
            )}
          </ul>
        </section>

        {/* 3. Information Sharing */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec3Title || "3. Information Sharing & Sovereign Consular Disclosure"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec3Desc || "We never sell, rent, or trade your personal data. We disclose pertinent traveler information solely to verified luxury accommodation partners, airlines, visa application centers, and consular authorities solely to execute your commissioned journey."}
          </p>
        </section>

        {/* 4. Data Security */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec4Title || "4. Data Security & Retention"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec4Desc || "We implement bank-level TLS encryption, least-privilege administrative access, and strict role-based controls. Traveler documents collected solely for visa purposes are retained only until consular verification is completed, after which they are securely expunged."}
          </p>
        </section>

        {/* 5. Contact Desk */}
        <section className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark 
            ? 'bg-white/[0.03] border-white/10' 
            : 'bg-stone-100/70 border-stone-200'
        }`}>
          <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec5Title || "5. Your Rights & Concierge Contact Desk"}
          </h2>
          <p className={`text-xs sm:text-sm mb-4 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            {lt?.sec5Desc || "You retain the sovereign right to inspect, update, or request the deletion of your personal contact records. Direct all privacy inquiries to our data protection desk:"}
          </p>
          <div className="space-y-1.5 text-xs">
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <a href="mailto:contact@zentrevo.in" className="hover:underline font-medium">contact@zentrevo.in</a>
            </p>
            <p className="flex items-center gap-2 text-stone-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{lt?.contactHq || "Sector 49, Gurugram 122018, Haryana, India"}</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
