import React from 'react';
import { X, Check, Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DetailModal({ destination, isOpen, onClose, onBookNow, currentTheme }) {
  if (!isOpen || !destination) return null;
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border max-h-[90vh] flex flex-col ${
          isSapphire
            ? 'bg-[#0c1a38] border-amber-500/35 text-stone-100'
            : isEmerald 
              ? 'bg-[#0d2b23] border-emerald-800 text-stone-100' 
              : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header Image */}
        <div className="relative aspect-[16/8] overflow-hidden shrink-0">
          <img
            src={destination.image}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase ${destination.tagColor}`}>
              {destination.location}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              {destination.title}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
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
            <div className="text-xl font-bold">
              {destination.price}
              <span className="text-xs font-normal opacity-70"> / guest</span>
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`}>
              Overview & Signature Atmosphere
            </h4>
            <p className={`text-sm leading-relaxed ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
              {destination.description}
            </p>
          </div>

          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`}>
              Included Signature Highlights
            </h4>
            <div className="space-y-2.5">
              {destination.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSapphire ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{h}</span>
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
              <ShieldCheck className={`w-4 h-4 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span>Full flexible cancellation up to 14 days prior to travel</span>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className={`p-5 px-6 sm:px-8 border-t flex items-center justify-between shrink-0 ${
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
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              isSapphire
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                  : 'bg-stone-950 text-white hover:bg-stone-800'
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
