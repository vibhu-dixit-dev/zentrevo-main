import React, { useEffect } from 'react';
import { Compass, ArrowLeft, RefreshCw, Mail, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { legalTranslations } from '../i18n/legalTranslations';

export default function CancellationRefund({ onNavigateHome, currentTheme = 'editorial' }) {
  const { language } = useLanguage();
  const lt = legalTranslations[language]?.refund || null;
  const backText = legalTranslations[language]?.backHome || "Back to Home";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh' 
      ? "退改政策 | Zentrevo 尊贵旅行" 
      : language === 'es' 
        ? "Política de Cancelación y Reembolso | Zentrevo Travel" 
        : language === 'ar' 
          ? "سياسة الإلغاء والاسترداد | رحلات زينتريفو" 
          : "Cancellation & Refund Policy | Zentrevo Travel";
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
              {lt?.tag || "Booking Safeguards & Transparent Terms"}
            </span>
          </div>

          <h1 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            {lt?.title || "Cancellation & Refund Policy"}
          </h1>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {lt?.effectiveDate || "Effective Date: October 27, 2026 • Sovereign Travel Guarantee"}
          </p>
        </div>

        {/* Introduction */}
        <section className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <p>
            {lt?.intro || "At Zentrevo, bespoke expeditions involve early reservation of private villas, chartered transport, and restricted heritage access. This policy clearly delineates the cancellation timeline and refund calculations."}
          </p>
        </section>

        {/* Cancellation Schedule */}
        <section className="space-y-4 border-t pt-8 border-stone-200/20">
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.timelineTitle || "Standard Cancellation Schedule & Refund Tiers"}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Tier 1 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  {lt?.tier1Time || "30 Days or More Prior to Departure"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lt?.tier1Refund || "Up to 85% to 90% Refundable"}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {lt?.tier1Note || "Subject to committed third-party flight and hotel non-recoverable booking costs."}
              </p>
            </div>

            {/* Tier 2 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  {lt?.tier2Time || "15 to 29 Days Prior to Departure"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {lt?.tier2Refund || "Up to 50% to 70% Refundable"}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {lt?.tier2Note || "Calculated based on contracted private villa buyout terms and chartered transport cancellation fees."}
              </p>
            </div>

            {/* Tier 3 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  {lt?.tier3Time || "Less than 14 Days Prior to Departure"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {lt?.tier3Refund || "Case-by-Case Rescheduling"}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {lt?.tier3Note || "Within 14 days, partner suppliers enforce 100% cancellation penalties; our concierge team works to reschedule whenever feasible."}
              </p>
            </div>
          </div>
        </section>

        {/* Processing Timeline */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {lt?.processTitle || "Refund Processing Timeline"}
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            {lt?.processDesc || "Approved refunds are transferred back to your original payment method within 7 to 10 business days."}
          </p>
        </section>

        {/* Consular Clause */}
        <section className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark 
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
            : 'bg-amber-50/70 border-amber-200 text-stone-900'
        }`}>
          <h2 className={`text-base sm:text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-amber-300' : 'text-stone-950'}`}>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>{lt?.visaClauseTitle || "Special Visa Refusal Clause"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {lt?.visaClauseDesc || "If a traveler's visa application is formally refused by an embassy at least 15 days prior to travel (official consular rejection letter required), Zentrevo waives all our internal planning fees and returns all recoverable partner funds."}
          </p>
        </section>
      </main>
    </div>
  );
}
