import React, { useEffect } from 'react';
import { Compass, ArrowLeft, FileText, Mail, MapPin, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { legalTranslations } from '../i18n/legalTranslations';

export default function TermsOfService({ onNavigateHome, currentTheme = 'editorial' }) {
  const { language } = useLanguage();
  const lt = legalTranslations[language]?.terms || null;
  const backText = legalTranslations[language]?.backHome || "Back to Home";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh' 
      ? "服务协议 | Zentrevo 尊贵旅行" 
      : language === 'es' 
        ? "Términos de Servicio | Zentrevo Travel" 
        : language === 'ar' 
          ? "شروط الخدمة | رحلات زينتريفو" 
          : "Terms of Service | Zentrevo Travel";
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
            className="flex items-center cursor-pointer group"
          >
            <img 
              src={isDark ? "/zentrevo-logo-white.png" : "/zentrevo-logo.png"} 
              alt="Zentrevo Curated Journeys" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
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
              {lt?.tag || "Terms & Conditions"}
            </span>
          </div>

          <h1 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            {lt?.title || "Terms of Service"}
          </h1>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {lt?.effectiveDate || "Effective Date: October 27, 2026 • Governing Law: Republic of India"}
          </p>
        </div>

        {/* Introduction */}
        <section className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <p>
            {lt?.intro || "Welcome to Zentrevo. These Terms of Service govern your access to and use of our website, private bespoke itinerary planning services, and concierge travel arrangements."}
          </p>
        </section>

        {/* 1. Custom Travel Proposals */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec1Title || "1. Custom Itinerary Proposals & Bookings"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec1Desc || "All custom itineraries curated by Zentrevo are bespoke proposals valid for 7 calendar days from issuance. Bookings are formally confirmed only upon receipt of the designated deposit and signed journey confirmation."}
          </p>
        </section>

        {/* 2. Transparent Pricing */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec2Title || "2. Transparent Pricing & Currency"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec2Desc || "Rates are presented in Indian Rupees (₹) for domestic travelers and US Dollars ($) globally. Every quotation provides a comprehensive breakdown of inclusions, accommodations, and private guides with zero hidden fees."}
          </p>
        </section>

        {/* 3. Visa Disclaimer */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec3Title || "3. Consular Visa Advisory & Sovereign Discretion"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec3Desc || "Zentrevo offers document checklists and confirmed travel vouchers in good faith. Sovereign embassies and consulates alone decide visa approvals. We never guarantee visa issuance."}
          </p>
        </section>

        {/* 4. Health & Safety */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec4Title || "4. Travel Safety, Insurance & Health"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec4Desc || "High-altitude journeys (e.g. Ladakh) or private charters require suitable physical fitness. Travelers must maintain comprehensive international travel insurance covering medical emergency and trip interruption."}
          </p>
        </section>

        {/* 5. Jurisdiction */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.sec5Title || "5. Dispute Resolution & Jurisdiction"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.sec5Desc || "These Terms are governed by the laws of India. Any legal dispute or arbitration arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Gurugram, Haryana."}
          </p>
        </section>
      </main>
    </div>
  );
}
