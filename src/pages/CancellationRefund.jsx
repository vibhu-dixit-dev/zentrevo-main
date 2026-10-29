import React, { useEffect } from 'react';
import { Compass, ArrowLeft, RefreshCw, Mail, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CancellationRefund({ onNavigateHome, currentTheme = 'editorial' }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Cancellation & Refund Policy | Zentrevo Travel";
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
              Transparent Booking Terms
            </span>
          </div>

          <h1 className={`font-editorial text-3xl sm:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-stone-950'
          }`}>
            Cancellation & Refund Policy
          </h1>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            Effective Date: October 27, 2026 • Clear Prices, No Surprises
          </p>
        </div>

        {/* Introduction */}
        <section className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <p>
            At <strong className={isDark ? 'text-white' : 'text-stone-950'}>Zentrevo</strong>, we believe travel planning should be transparent and straightforward. We understand that plans can change unexpectedly due to personal emergencies, schedule shifts, or health matters.
          </p>
          <p>
            This Cancellation and Refund Policy clearly outlines how booking cancellations are handled, applicable timelines, and the refund process for bespoke itineraries from India.
          </p>
        </section>

        {/* 1. Cancellation Timeline Table */}
        <section className={`space-y-4 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            <Clock className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-stone-800'}`} />
            <span>1. Standard Cancellation Schedule</span>
          </h2>
          <p className={`text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            Cancellation requests must be submitted in writing via email or your dedicated WhatsApp concierge chat. Refunds are calculated from the verified timestamp of notice receipt:
          </p>

          <div className={`overflow-x-auto rounded-2xl border ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-stone-300 bg-white shadow-sm'
          }`}>
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className={`border-b text-[11px] uppercase tracking-wider font-bold ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-stone-200' 
                    : 'bg-stone-100 border-stone-200 text-stone-900'
                }`}>
                  <th className="p-3.5 sm:p-4">Notice Period Prior to Travel</th>
                  <th className="p-3.5 sm:p-4">Refund Percentage</th>
                  <th className="p-3.5 sm:p-4">Deductions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5 text-stone-300' : 'divide-stone-200 text-stone-800'}`}>
                <tr className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-stone-50'}>
                  <td className={`p-3.5 sm:p-4 font-semibold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    30 or more days prior
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    Up to 85% - 90%
                  </td>
                  <td className={`p-3.5 sm:p-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    Actual non-refundable flight/hotel booking fees only
                  </td>
                </tr>
                <tr className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-stone-50'}>
                  <td className={`p-3.5 sm:p-4 font-semibold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    15 to 29 days prior
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-amber-600 dark:text-amber-400">
                    50% of land package
                  </td>
                  <td className={`p-3.5 sm:p-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    Supplier retention fees & committed deposits
                  </td>
                </tr>
                <tr className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-stone-50'}>
                  <td className={`p-3.5 sm:p-4 font-semibold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    Less than 14 days prior
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-rose-600 dark:text-rose-400">
                    Non-refundable
                  </td>
                  <td className={`p-3.5 sm:p-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    100% committed supplier non-recoverable costs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Strictly Non-Refundable Items */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            2. Strictly Non-Refundable Items
          </h2>
          <ul className={`list-disc list-inside space-y-2 text-sm pl-2 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <li><strong className={isDark ? 'text-white' : 'text-stone-900'}>Government & Visa Embassy Fees:</strong> Fees paid directly to government visa portals, VFS Global, or consulates are 100% non-refundable under all circumstances once processed.</li>
            <li><strong className={isDark ? 'text-white' : 'text-stone-900'}>Non-Refundable Flight Bookings:</strong> Commercial airline ticket refunds depend strictly on the respective airline’s cancellation rules.</li>
            <li><strong className={isDark ? 'text-white' : 'text-stone-900'}>Peak Season / Holiday Stays:</strong> Certain festive departures (Christmas, New Year, Cherry Blossom peak in Japan) carry strict property-enforced non-refundable terms, which are explicitly flagged before you confirm.</li>
          </ul>
        </section>

        {/* 3. Visa Refusal Mitigation Policy */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            3. In Event of Visa Refusal
          </h2>
          <div className={`p-5 rounded-2xl border space-y-2 text-sm leading-relaxed ${
            isDark 
              ? 'bg-white/[0.03] border-white/10 text-stone-300' 
              : 'bg-stone-50 border-stone-200 text-stone-800'
          }`}>
            <p>
              In the unfortunate event that your visa application is refused by an embassy, we strive to minimize your financial loss:
            </p>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Upon furnishing the official embassy refusal letter at least <strong className={isDark ? 'text-white' : 'text-stone-900'}>10 days prior to departure</strong>, Zentrevo will waive our internal planning fee and recover every possible refundable component from our hotel and ground partners.
            </p>
          </div>
        </section>

        {/* 4. Refund Processing Timeline */}
        <section className={`space-y-3 border-t pt-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-stone-800'}`} />
            <span>4. Refund Processing Timeline</span>
          </h2>
          <div className={`space-y-2 text-sm leading-relaxed pl-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <p>
              Once a cancellation is confirmed in writing, approved refunds are credited back to the <strong className={isDark ? 'text-white' : 'text-stone-900'}>original source of payment (Bank Transfer / UPI / Card)</strong> within <strong className={isDark ? 'text-white' : 'text-stone-900'}>7 to 10 business days</strong>.
            </p>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              A comprehensive refund settlement breakdown statement will be provided directly via email and WhatsApp.
            </p>
          </div>
        </section>

        {/* 5. How to Initiate Cancellation */}
        <section className={`p-6 rounded-2xl border space-y-3 ${
          isDark 
            ? 'bg-white/[0.03] border-white/10 text-stone-200' 
            : 'bg-stone-50 border-stone-200 text-stone-900'
        }`}>
          <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
            <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>How to Initiate a Cancellation</span>
          </h2>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            To request an itinerary cancellation or date rescheduling, contact your dedicated planner immediately:
          </p>
          <div className={`text-xs space-y-1.5 font-mono pt-1 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
            <p className="flex items-center gap-2">
              <Mail className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
              <span>Email: contact@zentrevo.in (Subject: "Cancellation Request - [Your Name]")</span>
            </p>
            <p className="flex items-center gap-2">
              <Compass className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
              <span>Dedicated WhatsApp Concierge Chat (Available 7 days a week)</span>
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
