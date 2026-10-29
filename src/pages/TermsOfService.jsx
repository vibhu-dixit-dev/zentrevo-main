import React, { useEffect } from 'react';
import { Compass, ArrowLeft, FileText, Mail, MapPin, ShieldAlert } from 'lucide-react';

export default function TermsOfService({ onNavigateHome, currentTheme = 'editorial' }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service | Zentrevo Travel";
  }, []);

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
            <span>Back to Home</span>
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
              Client Engagement Terms
            </span>
          </div>

          <h1 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            Terms of Service
          </h1>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Effective Date: October 27, 2026 • Last Reviewed: October 2026
          </p>
        </div>

        {/* Introduction */}
        <section className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <p>
            Welcome to <strong className={isDark ? 'text-white' : 'text-stone-950'}>Zentrevo</strong>. By accessing our platform (<a href="https://www.zentrevo.in" className={`font-medium underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}>https://www.zentrevo.in</a>), submitting a travel inquiry, communicating via our WhatsApp concierge, or purchasing a bespoke travel itinerary, you acknowledge and agree to be bound by these Terms of Service.
          </p>
          <p>
            Please read these terms carefully before engaging our itinerary planning and travel coordination services.
          </p>
        </section>

        {/* 1. Nature of Our Services */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            1. Nature of Our Services
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            Zentrevo acts as a custom journey planner, itinerary designer, and booking coordinator. We curate bespoke travel packages from India to international and domestic destinations (including Bali, Japan, Switzerland, Italy, Turkey, Kerala, Ladakh, Rajasthan, and Kashmir). We partner with independent third-party operators—including airlines, boutique hotels, rail systems, private drivers, and certified local guides—to fulfill your itinerary.
          </p>
        </section>

        {/* 2. Visa Support & Mandatory Embassy Disclaimer */}
        <section className={`space-y-4 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            2. Visa Support & Embassy Discretion
          </h2>
          
          <div className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : 'bg-amber-50/80 border-amber-300 text-stone-900 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                isDark ? 'text-amber-300' : 'text-amber-900'
              }`}>
                Mandatory Visa Disclaimer
              </span>
            </div>

            <p className={`text-sm sm:text-base font-bold leading-relaxed mb-1.5 ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              "Visa guidance and document support. The embassy decides approval."
            </p>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              Zentrevo provides document verification, appointment guidance, and confirmed travel booking vouchers in good faith to assist your visa application. We <strong>never promise, guarantee, or influence</strong> the issuance or approval of any visa. The grant, refusal, processing timeline, and conditions of visas remain the exclusive sovereign prerogative of the respective country's embassy, consulate, or high commission.
            </p>
          </div>
        </section>

        {/* 3. Pricing, Inclusions, and Quotes */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            3. Pricing, Inclusions, and Quotes
          </h2>
          <ul className={`list-disc list-inside space-y-2 text-sm pl-2 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <li>All prices are quoted in <strong className={isDark ? 'text-white' : 'text-stone-900'}>Indian Rupees (₹)</strong> on a per-person or twin-share basis as explicitly indicated.</li>
            <li>Custom quotes provided by our planners are valid for 7 days from issuance, subject to real-time hotel and flight tariff availability.</li>
            <li>Inclusions (e.g., accommodations, daily breakfast, private transfers, guided excursions) and exclusions (e.g., personal shopping, discretionary tips, visa embassy fees) will be itemized clearly in your official itinerary dossier.</li>
          </ul>
        </section>

        {/* 4. Traveler Responsibilities */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            4. Traveler Responsibilities
          </h2>
          <div className={`space-y-2 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>A. Passport Validity:</strong> Travelers are solely responsible for ensuring their passport is valid for at least 6 months beyond the date of intended return and possesses adequate blank pages.</p>
            <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>B. Travel & Medical Insurance:</strong> We strongly advise all voyagers to maintain comprehensive international medical, baggage, and trip cancellation insurance coverage.</p>
            <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>C. Health & Fitness:</strong> Voyagers must disclose any physical limitations or health conditions that could impact high-altitude or physically demanding tours.</p>
          </div>
        </section>

        {/* 5. Limitation of Liability */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            5. Limitation of Liability
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            Zentrevo exercises utmost diligence in vetting our partner properties and service providers. However, Zentrevo shall not be held liable for personal injury, property loss, flight rescheduling, acts of God, weather disruptions, civil unrest, or embassy visa delays beyond our reasonable control.
          </p>
        </section>

        {/* 6. Jurisdiction */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            6. Governing Law & Dispute Resolution
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            These Terms of Service are governed by and construed in accordance with the laws of India. Any legal dispute or proceeding arising out of our services shall be subject to the exclusive jurisdiction of the competent courts in <strong className={isDark ? 'text-white' : 'text-stone-900'}>Gurugram, Haryana, India</strong>.
          </p>
        </section>

        {/* Contact Block */}
        <section className={`p-6 rounded-2xl border space-y-3 ${
          isDark 
            ? 'bg-white/[0.03] border-white/10 text-stone-200' 
            : 'bg-stone-50 border-stone-200 text-stone-900'
        }`}>
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            Official Legal Desk
          </h2>
          <div className={`text-xs space-y-1.5 font-mono ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <p className="flex items-center gap-2">
              <Compass className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
              <span>Zentrevo Travel Co.</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
              <span>Sector 49, Gurugram, Haryana 122018, India</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
              <span>contact@zentrevo.in</span>
            </p>
          </div>
        </section>

        {/* Related Policies Navigation Bar */}
        <div className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
          isDark ? 'border-white/10' : 'border-stone-200'
        }`}>
          <div className="flex gap-4">
            <a 
              href="/privacy-policy" 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState({}, '', '/privacy-policy'); 
                window.dispatchEvent(new PopStateEvent('popstate')); 
              }} 
              className={`font-semibold hover:underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}
            >
              ← Privacy Policy
            </a>
            <a 
              href="/cancellation-and-refund" 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState({}, '', '/cancellation-and-refund'); 
                window.dispatchEvent(new PopStateEvent('popstate')); 
              }} 
              className={`font-semibold hover:underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}
            >
              Cancellation & Refund Policy →
            </a>
          </div>
          <button 
            type="button" 
            onClick={onNavigateHome} 
            className={`cursor-pointer ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-950'}`}
          >
            ← Back to Homepage
          </button>
        </div>
      </main>
    </div>
  );
}
