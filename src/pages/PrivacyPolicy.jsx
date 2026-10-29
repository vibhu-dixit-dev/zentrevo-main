import React, { useEffect } from 'react';
import { Compass, ArrowLeft, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function PrivacyPolicy({ onNavigateHome, currentTheme = 'editorial' }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | Zentrevo Travel";
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
              Legal & Privacy Disclosure
            </span>
          </div>

          <h1 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            Privacy Policy
          </h1>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Effective Date: October 27, 2026 • Last Reviewed: October 2026
          </p>
        </div>

        {/* Introduction */}
        <section className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <p>
            At <strong className={isDark ? 'text-white' : 'text-stone-950'}>Zentrevo</strong> ("we", "us", or "our"), safeguarding your personal information is fundamental to our concierge craft. We operate the website <a href="https://www.zentrevo.in" className={`font-medium underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}>https://www.zentrevo.in</a> and coordinate private, custom travel itineraries from India to international and domestic destinations.
          </p>
          <p>
            This Privacy Policy outlines how we collect, handle, protect, and process personal information when you browse our website, submit travel inquiries, subscribe to our Private Journal, or book bespoke travel journeys with our concierge team.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            <span>1. Information We Collect</span>
          </h2>
          <div className={`space-y-3 text-sm leading-relaxed pl-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>A. Travel Inquiries & Booking Dossiers:</strong> When you submit an itinerary inquiry or confirm a journey, we collect your name, email address, phone/WhatsApp number, preferred travel dates, destination desires, guest count, and estimated budget.</p>
            <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>B. Travel Documents & Identification:</strong> For confirmed bookings and visa guidance assistance, we may receive passport scans, visa applications, date of birth, nationality, and emergency contact details strictly required by airlines, hotels, or embassies.</p>
            <p><strong className={isDark ? 'text-white' : 'text-stone-900'}>C. Technical & Usage Telemetry:</strong> IP addresses, browser types, device information, referring URLs, and page interactions captured through standard analytics to optimize performance.</p>
          </div>
        </section>

        {/* 2. How We Use Your Information */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            2. How We Use Your Information
          </h2>
          <ul className={`list-disc list-inside space-y-2 text-sm pl-2 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <li>To design custom, day-by-day travel itineraries and furnish quotes within 24 hours.</li>
            <li>To coordinate room reservations, private transfers, rail passes, and local experiences with verified partners.</li>
            <li>To provide step-by-step visa document verification and appointment scheduling guidance.</li>
            <li>To offer real-time concierge assistance via WhatsApp during your travel until you safely return home.</li>
            <li>To dispatch seasonal Private Journal editions (with an immediate one-click unsubscribe mechanism).</li>
          </ul>
        </section>

        {/* 3. Non-Disclosure & Data Sharing */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            3. Data Sharing & Non-Disclosure
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            We <strong className={isDark ? 'text-white' : 'text-stone-900'}>never sell, lease, or monetize</strong> your personal details to third-party advertisers. Information is only shared strictly under necessary operational circumstances:
          </p>
          <ul className={`list-disc list-inside space-y-2 text-sm pl-2 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <li><strong className={isDark ? 'text-white' : 'text-stone-900'}>Travel Suppliers:</strong> Airlines, boutique hotels, rail operators, and licensed local expedition guides who require traveler identity to honor bookings.</li>
            <li><strong className={isDark ? 'text-white' : 'text-stone-900'}>Embassies & Consulates:</strong> Official government bodies solely for processing visa applications per your request.</li>
            <li><strong className={isDark ? 'text-white' : 'text-stone-900'}>Legal Compliance:</strong> When strictly required by law, subpoena, or governmental mandate.</li>
          </ul>
        </section>

        {/* 4. Security Standards */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            4. Security Standards & Storage
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            All data transmitted through our web services is protected via 256-bit Transport Layer Security (TLS) encryption. Administrative portals are fortified with restricted secret-key authentication, and passport files are encrypted at rest with multi-factor safeguards.
          </p>
        </section>

        {/* 5. Your Rights */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            5. Your Data Rights
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            You retain full rights to access, amend, download, or request the permanent erasure of your personal data from our active registers at any time. To make a data request, please write to us at <a href="mailto:contact@zentrevo.in" className={`font-semibold underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}>contact@zentrevo.in</a>.
          </p>
        </section>

        {/* 6. Contact Information Block */}
        <section className={`p-6 rounded-2xl border space-y-3 ${
          isDark 
            ? 'bg-white/[0.03] border-white/10 text-stone-200' 
            : 'bg-stone-50 border-stone-200 text-stone-900'
        }`}>
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            Official Data Controller Desk
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
              href="/terms-of-service" 
              onClick={(e) => { 
                e.preventDefault(); 
                window.history.pushState({}, '', '/terms-of-service'); 
                window.dispatchEvent(new PopStateEvent('popstate')); 
              }} 
              className={`font-semibold hover:underline ${isDark ? 'text-amber-300' : 'text-stone-900'}`}
            >
              Terms of Service →
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
