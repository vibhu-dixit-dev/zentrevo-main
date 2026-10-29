import React, { useEffect } from 'react';
import { 
  X, 
  FileCheck2, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  HelpCircle, 
  Stamp, 
  Building2, 
  FileText, 
  CalendarDays 
} from 'lucide-react';

export default function VisaModal({ 
  isOpen, 
  onClose, 
  onGoAhead, 
  currentTheme = 'editorial' 
}) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl max-h-[92vh] flex flex-col transition-all duration-300 ${
          isSapphire
            ? 'bg-[#09152e] border-amber-500/35 text-stone-100 shadow-blue-950/80'
            : isEmerald
              ? 'bg-[#0a231c] border-emerald-700/40 text-stone-100 shadow-emerald-950/80'
              : 'bg-white border-stone-300 text-stone-900 shadow-stone-900/20'
        }`}
      >
        {/* Top Decorative Border Accent */}
        <div className={`h-1.5 w-full ${
          isSapphire 
            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500' 
            : isEmerald 
              ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500' 
              : 'bg-stone-900'
        }`} />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close visa assistance modal"
          className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2 pr-8">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-[0.22em] font-bold ${
                isDark ? 'text-amber-300/90' : 'text-stone-600'
              }`}>
                Consular & Travel Documentation Advisory
              </span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              Visa Guidance & Document Support
            </h2>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              Preparation, requirement checklists, and confirmed booking vouchers for Indian passport holders.
            </p>
          </div>

          {/* Official Policy Callout Box - High Contrast in both Light & Dark themes */}
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
                Official Policy Notice
              </span>
            </div>

            <p className={`text-sm sm:text-base font-bold leading-relaxed mb-1.5 ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              "Visa guidance and document support. The embassy decides approval."
            </p>

            <p className={`text-xs leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-700'
            }`}>
              We never promise, guarantee, or influence visa outcomes. All visa decisions, processing times, and approvals rest strictly and solely with the respective country's sovereign embassy or consulate.
            </p>
          </div>

          {/* What We Help With - 4 Clean Cards */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isDark ? 'text-stone-300' : 'text-stone-800'
            }`}>
              <CheckCircle className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>What Your Planner Helps You With</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Card 1 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-white/[0.03] border-white/10 text-stone-200' 
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    1. Document Checklist
                  </span>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  Tailored checklist for your destination (Schengen, Japan, UK, Bali eVisa, Turkey).
                </p>
              </div>

              {/* Card 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-white/[0.03] border-white/10 text-stone-200' 
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    2. Hotel & Travel Vouchers
                  </span>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  Official day-wise itinerary dossiers and confirmed booking vouchers required for submission.
                </p>
              </div>

              {/* Card 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-white/[0.03] border-white/10 text-stone-200' 
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Stamp className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    3. Application Pre-Check
                  </span>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  Pre-submission review of your completed visa forms and photo dimensions to prevent delays.
                </p>
              </div>

              {/* Card 4 */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-white/[0.03] border-white/10 text-stone-200' 
                  : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <CalendarDays className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-stone-950'}`}>
                    4. Appointment Guidance
                  </span>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  Assistance with booking biometric VFS Global / TLScontact slots across Indian cities.
                </p>
              </div>
            </div>
          </div>

          {/* Subdued Footer Note */}
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            isDark
              ? 'bg-black/20 border-white/10 text-stone-300'
              : 'bg-stone-100/70 border-stone-200 text-stone-700'
          }`}>
            <HelpCircle className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-stone-600'}`} />
            <span>Have specific visa questions before booking? Message our dedicated planner directly on WhatsApp.</span>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className={`p-4 sm:p-5 px-6 sm:px-8 border-t flex items-center justify-between shrink-0 ${
          isSapphire 
            ? 'bg-[#060e20] border-amber-500/25' 
            : isEmerald 
              ? 'bg-[#071813] border-emerald-800/40' 
              : 'bg-stone-50 border-stone-200'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isDark 
                ? 'text-stone-400 hover:text-white' 
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Close
          </button>

          <button
            type="button"
            onClick={onGoAhead}
            className={`px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer ${
              isSapphire
                ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-amber-400/20'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-400/20'
                  : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/30'
            }`}
          >
            <span>Go Ahead</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
