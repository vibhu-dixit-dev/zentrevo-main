import React, { useEffect } from 'react';
import { X, Check, Star, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function DetailModal({ destination, isOpen, onClose, onBookNow, currentTheme }) {
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

  if (!isOpen || !destination) return null;
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl border max-h-[90vh] flex flex-col transition-all duration-300 ${
          isSapphire
            ? 'bg-[#0c1a38] border-amber-500/35 text-stone-100 shadow-blue-950/70'
            : isEmerald 
              ? 'bg-[#0d2b23] border-emerald-800 text-stone-100 shadow-emerald-950/60' 
              : 'bg-white border-stone-200 text-stone-900 shadow-2xl'
        }`}
      >
        {/* Floating Top-Right Close Button - Always visible regardless of scroll */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body: Header Image + Full Itinerary Content scroll together smoothly */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Header Image (Scrolls smoothly with content) */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
            <img
              src={destination.image}
              alt={destination.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

            <div className="absolute bottom-5 left-6 right-16">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${destination.tagColor}`}>
                {destination.location}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight drop-shadow-sm">
                {destination.title}
              </h3>
            </div>
          </div>

          {/* Modal Text & Highlights Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/20">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Clock className={`w-4 h-4 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`} />
                  {destination.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {destination.rating} ({destination.reviews} reviews)
                </span>
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {destination.price}
                <span className="text-xs font-normal opacity-70"> / guest</span>
              </div>
            </div>

            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900 font-bold'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Overview & Signature Atmosphere</span>
              </h4>
              <p className={`text-sm sm:text-base leading-relaxed ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                {destination.description}
              </p>
            </div>

            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900 font-bold'
              }`}>
                Included Signature Highlights
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {destination.highlights.map((h, i) => (
                  <div 
                    key={i} 
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm transition-all ${
                      isSapphire 
                        ? 'bg-[#081226]/80 border-slate-700/60 text-stone-200' 
                        : isEmerald 
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-stone-200' 
                          : 'bg-stone-50 border-stone-200/80 text-stone-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSapphire 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : isEmerald 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-stone-900 text-white'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              isSapphire 
                ? 'bg-[#081226] border-amber-500/30' 
                : isEmerald 
                  ? 'bg-emerald-950/40 border-emerald-800/50' 
                  : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span>Full flexible cancellation up to 14 days prior to travel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA - Pinned at bottom */}
        <div className={`p-4 sm:p-5 px-6 sm:px-8 border-t flex items-center justify-between shrink-0 ${
          isSapphire 
            ? 'bg-[#081226] border-amber-500/30' 
            : isEmerald 
              ? 'bg-[#0a241d] border-emerald-800/60' 
              : 'bg-stone-50 border-stone-200'
        }`}>
          <button
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onBookNow(destination);
            }}
            className={`px-6 sm:px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-[1.02] cursor-pointer ${
              isSapphire
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 shadow-amber-500/25'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-500/25'
                  : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/25'
            }`}
          >
            <span>Book This Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
