import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Star,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Share2,
  MapPin,
  ExternalLink,
  Tag
} from 'lucide-react';
import { getDestinationSlug } from '../lib/seoRoutes';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDestination } from '../i18n/localizedTravelData';
import LiveWeatherWidget from './LiveWeatherWidget';

export default function DetailModal({ destination, isOpen, onClose, onBookNow, currentTheme }) {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);

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
  const isDark = isEmerald || isSapphire;

  const localizedDest = getLocalizedDestination(destination, language);
  const highlights = Array.isArray(localizedDest.highlights) ? localizedDest.highlights : [];
  const externalLinks = Array.isArray(localizedDest.externalLinks)
    ? localizedDest.externalLinks
    : (Array.isArray(localizedDest.external_links) ? localizedDest.external_links : []);
  const regionLabel = (localizedDest.region || 'international') === 'national'
    ? t('nav.national', 'National (India)')
    : t('nav.international', 'International');

  const handleShare = () => {
    const slug = getDestinationSlug(localizedDest);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.zentrevo.in';
    const url = `${origin}/destinations/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={localizedDest?.title || 'Destination details'}
    >
      <div
        className={`relative w-full h-full overflow-hidden flex flex-col transition-all duration-300 ${
          isSapphire
            ? 'bg-[#050a16] text-stone-100'
            : isEmerald
              ? 'bg-[#061813] text-stone-100'
              : 'bg-[#faf9f6] text-stone-900'
        }`}
      >
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Share route link"
            title="Copy shareable link"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg border border-white/10 relative"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {copiedLink && (
              <span className="absolute -bottom-8 right-0 bg-stone-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                {t('common.copied', 'Link Copied!')}
              </span>
            )}
          </button>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Immersive hero */}
          <div className="relative h-[48vh] sm:h-[56vh] min-h-[260px] w-full overflow-hidden shrink-0">
            <img
              src={localizedDest.image}
              alt={localizedDest.imageAlt || `${localizedDest.title} - ${localizedDest.location} itinerary | Zentrevo`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 lg:px-10 pb-6 sm:pb-8">
              <div className="max-w-6xl mx-auto space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${localizedDest.tagColor || 'bg-stone-900 text-white'}`}>
                    {localizedDest.location}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/15 text-white backdrop-blur-md uppercase tracking-wider">
                    {regionLabel}
                  </span>
                  {localizedDest.badge && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-400/90 text-stone-950 uppercase tracking-wider inline-flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {localizedDest.badge}
                    </span>
                  )}
                </div>

                <h1 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-4xl drop-shadow-sm">
                  {localizedDest.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-white/85 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    {localizedDest.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {localizedDest.rating} ({localizedDest.reviews} {t('common.reviews', 'reviews')})
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 font-semibold">
                    {formatPrice(localizedDest.price)}
                    <span className="opacity-70 font-normal">{t('destinations.perGuest')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-8 lg:px-10 py-8 sm:py-10 max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-10 items-start">
              <div className="space-y-7 min-w-0">
                <LiveWeatherWidget destination={localizedDest} currentTheme={currentTheme} />

                <section className={`rounded-3xl border p-5 sm:p-6 ${
                  isSapphire
                    ? 'bg-[#081226]/70 border-amber-500/25'
                    : isEmerald
                      ? 'bg-emerald-950/40 border-emerald-800/50'
                      : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                    isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('detailModal.overviewTitle', 'Overview & Signature Atmosphere')}</span>
                  </h2>
                  <p className={`text-sm sm:text-[15px] leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    {localizedDest.description}
                  </p>
                </section>

                {highlights.length > 0 && (
                  <section>
                    <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                      isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
                    }`}>
                      {t('detailModal.highlightsTitle', 'Included Signature Highlights')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {highlights.map((h, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm transition-all ${
                            isSapphire
                              ? 'bg-[#081226]/80 border-slate-700/60 text-stone-200'
                              : isEmerald
                                ? 'bg-emerald-950/40 border-emerald-800/60 text-stone-200'
                                : 'bg-white border-stone-200 text-stone-800 shadow-sm'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            isSapphire || isEmerald
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-stone-950 text-white'
                          }`}>
                            {i + 1}
                          </div>
                          <span className="leading-relaxed pt-0.5">{h}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {externalLinks.length > 0 && (
                  <section className={`rounded-3xl border p-5 sm:p-6 space-y-3 ${
                    isSapphire
                      ? 'bg-[#081226]/70 border-amber-500/25'
                      : isEmerald
                        ? 'bg-emerald-950/40 border-emerald-800/50'
                        : 'bg-white border-stone-200 shadow-sm'
                  }`}>
                    <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
                    }`}>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t('detailModal.usefulLinks', 'Useful Links')}</span>
                    </h2>
                    <ul className="space-y-2">
                      {externalLinks.map((link, i) => {
                        const href = link?.url || link?.href;
                        if (!href) return null;
                        return (
                          <li key={`${href}-${i}`}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                                isSapphire
                                  ? 'text-amber-300 hover:text-amber-200'
                                  : isEmerald
                                    ? 'text-emerald-300 hover:text-emerald-200'
                                    : 'text-stone-900 hover:text-amber-700'
                              }`}
                            >
                              <span className="underline underline-offset-2 decoration-amber-400/50">
                                {link.label || link.title || href}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                <div className={`p-4 rounded-2xl border text-xs flex items-start sm:items-center gap-2 ${
                  isSapphire
                    ? 'bg-[#081226] border-amber-500/30'
                    : isEmerald
                      ? 'bg-emerald-950/40 border-emerald-800/50'
                      : 'bg-white border-stone-200'
                }`}>
                  <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span>{t('detailModal.cancellationPolicy', 'Full flexible cancellation up to 14 days prior to travel')}</span>
                </div>
              </div>

              {/* Sticky side panel */}
              <aside className="space-y-4 lg:sticky lg:top-6">
                <div className={`rounded-3xl border p-5 space-y-4 ${
                  isSapphire
                    ? 'bg-[#081226] border-amber-500/30'
                    : isEmerald
                      ? 'bg-emerald-950/50 border-emerald-800/50'
                      : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{localizedDest.location}</span>
                  </div>

                  <div>
                    <p className={`text-[11px] mb-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {t('detailModal.fromLabel', 'From')}
                    </p>
                    <p className="font-editorial text-3xl font-bold tracking-tight">
                      {formatPrice(localizedDest.price)}
                      <span className={`text-xs font-sans font-medium ml-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {t('destinations.perGuest')}
                      </span>
                    </p>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 text-[11px] ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    <div className={`rounded-2xl border px-3 py-2.5 ${
                      isSapphire ? 'border-slate-700/70' : isEmerald ? 'border-emerald-800/60' : 'border-stone-200'
                    }`}>
                      <p className="opacity-60 mb-0.5">{t('detailModal.durationLabel', 'Duration')}</p>
                      <p className="font-semibold">{localizedDest.duration}</p>
                    </div>
                    <div className={`rounded-2xl border px-3 py-2.5 ${
                      isSapphire ? 'border-slate-700/70' : isEmerald ? 'border-emerald-800/60' : 'border-stone-200'
                    }`}>
                      <p className="opacity-60 mb-0.5">{t('detailModal.ratingLabel', 'Guest Rating')}</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {localizedDest.rating}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBookNow(localizedDest);
                    }}
                    className={`w-full px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                      isSapphire
                        ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200'
                        : isEmerald
                          ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                          : 'bg-stone-950 text-white hover:bg-stone-800'
                    }`}
                  >
                    <span>{t('detailModal.bookItineraryBtn', 'Request Private Itinerary')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className={`p-4 sm:p-5 px-6 sm:px-8 border-t flex items-center justify-between shrink-0 ${
          isSapphire
            ? 'bg-[#081226] border-amber-500/30'
            : isEmerald
              ? 'bg-[#0a241d] border-emerald-800/60'
              : 'bg-white border-stone-200'
        }`}>
          <button
            onClick={onClose}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              isDark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            {t('common.close')}
          </button>

          <button
            onClick={() => {
              onClose();
              onBookNow(localizedDest);
            }}
            className={`px-6 sm:px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-[1.02] cursor-pointer ${
              isSapphire
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 shadow-amber-500/25'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-500/25'
                  : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/25'
            }`}
          >
            <span>{t('detailModal.bookItineraryBtn', 'Request Private Itinerary')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
