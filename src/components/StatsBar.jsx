import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck, Award, HeartHandshake, Compass, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getActivePartners,
  syncPartnersFromCloud
} from '../data/partnersData';

function PartnerLogo({ partner }) {
  const [failed, setFailed] = useState(false);
  const initial = (partner.name || 'P').charAt(0).toUpperCase();

  if (!partner.logo || failed) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-lg">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={partner.logo}
      alt={`${partner.name} logo`}
      className="w-12 h-12 object-contain rounded-xl bg-white border border-stone-100 p-1.5"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function PartnersCarousel({ partners, currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const trackRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isArrowPaused, setIsArrowPaused] = useState(false);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: null });
  const arrowPauseTimerRef = useRef(null);

  const getCardStep = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 220;
    const card = el.querySelector('[data-partner-card]');
    if (card) {
      const styles = window.getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap || '16') || 16;
      return card.getBoundingClientRect().width + gap;
    }
    return 220;
  }, []);

  const getLoopPoint = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const anchor = el.querySelector('[data-loop-anchor]');
    return anchor ? anchor.offsetLeft : el.scrollWidth / 2;
  }, []);

  const scrollByCard = useCallback((direction) => {
    const el = trackRef.current;
    if (!el) return;

    setIsArrowPaused(true);
    if (arrowPauseTimerRef.current) window.clearTimeout(arrowPauseTimerRef.current);
    arrowPauseTimerRef.current = window.setTimeout(() => {
      setIsArrowPaused(false);
    }, 2800);

    const step = getCardStep() * direction;
    const loopPoint = getLoopPoint();
    let next = el.scrollLeft + step;

    if (loopPoint > 0) {
      if (next >= loopPoint) next -= loopPoint;
      if (next < 0) next += loopPoint;
    }

    el.scrollTo({ left: next, behavior: 'smooth' });
  }, [getCardStep, getLoopPoint]);

  useEffect(() => {
    return () => {
      if (arrowPauseTimerRef.current) window.clearTimeout(arrowPauseTimerRef.current);
    };
  }, []);

  // Start mid-loop so L→R decrement can wrap cleanly
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !partners.length) return;
    const anchor = el.querySelector('[data-loop-anchor]');
    if (anchor) {
      el.scrollLeft = Math.max(0, anchor.offsetLeft - 1);
    }
  }, [partners]);

  // Auto-scroll LEFT → RIGHT (decrement scrollLeft)
  useEffect(() => {
    if (!partners.length || isHovering || isArrowPaused) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let rafId = 0;
    const speed = 0.55;

    const tick = () => {
      const el = trackRef.current;
      if (el && !dragState.current.active) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 8) {
          const loopPoint = (() => {
            const anchor = el.querySelector('[data-loop-anchor]');
            return anchor ? anchor.offsetLeft : el.scrollWidth / 2;
          })();

          el.scrollLeft -= speed;
          if (loopPoint > 0 && el.scrollLeft <= 0) {
            el.scrollLeft += loopPoint;
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [partners, isHovering, isArrowPaused]);

  const isInteractiveTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('button, a, input, textarea, select, [role="button"]'));
  };

  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el || e.button === 2 || isInteractiveTarget(e.target)) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
      pointerId: e.pointerId
    };
  };

  const onPointerMove = (e) => {
    const el = trackRef.current;
    const drag = dragState.current;
    if (!el || !drag.active) return;

    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) < 10) return;

    drag.moved = true;
    el.scrollLeft = drag.scrollLeft - dx;
    e.preventDefault();
  };

  const endDrag = (e) => {
    const drag = dragState.current;
    if (!drag.active) return;
    drag.active = false;
    if (e?.pointerId != null && trackRef.current?.hasPointerCapture?.(e.pointerId)) {
      try { trackRef.current.releasePointerCapture(e.pointerId); } catch {}
    }
  };

  // Duplicate list for seamless loop
  const loopItems = partners.length > 0 ? [...partners, ...partners] : [];

  if (!partners.length) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto group/carousel">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border shadow-md flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 ${
          isSapphire || isEmerald
            ? 'bg-stone-900/80 border-stone-700 text-white hover:bg-stone-800'
            : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
        }`}
        aria-label="Previous partners"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border shadow-md flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 ${
          isSapphire || isEmerald
            ? 'bg-stone-900/80 border-stone-700 text-white hover:bg-stone-800'
            : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
        }`}
        aria-label="Next partners"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] px-1 py-1 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {loopItems.map((partner, i) => {
          const isAnchor = i === partners.length;
          const CardTag = partner.website ? 'a' : 'div';
          const cardProps = partner.website
            ? { href: partner.website, target: '_blank', rel: 'noopener noreferrer' }
            : {};

          return (
            <CardTag
              key={`${partner.id}-${i}`}
              {...cardProps}
              data-partner-card
              {...(isAnchor ? { 'data-loop-anchor': true } : {})}
              className={`shrink-0 w-[200px] sm:w-[220px] rounded-2xl border px-4 py-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 ${
                isSapphire
                  ? 'bg-[#0d1a36] border-amber-500/25 hover:border-amber-400/50'
                  : isEmerald
                    ? 'bg-[#0f3329] border-emerald-700/40 hover:border-emerald-500/50'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md'
              }`}
            >
              <PartnerLogo partner={partner} />
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-bold truncate ${
                  isSapphire || isEmerald ? 'text-white' : 'text-stone-900'
                }`}>
                  {partner.name}
                </div>
                {partner.tagline && (
                  <div className={`text-[11px] mt-0.5 truncate ${
                    isSapphire ? 'text-amber-200/70' : isEmerald ? 'text-emerald-200/70' : 'text-stone-500'
                  }`}>
                    {partner.tagline}
                  </div>
                )}
              </div>
              {partner.website && (
                <ExternalLink className={`w-3.5 h-3.5 shrink-0 ${
                  isSapphire || isEmerald ? 'text-stone-400' : 'text-stone-400'
                }`} />
              )}
            </CardTag>
          );
        })}
      </div>
    </div>
  );
}

export default function StatsBar({ currentTheme }) {
  const { t } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const [partners, setPartners] = useState(() =>
    getActivePartners().filter((p) => p.active !== false)
  );

  const icons = [Compass, Award, HeartHandshake, ShieldCheck];

  const localizedStats = [
    {
      value: t('stats.stat1Val', '100%'),
      label: t('stats.stat1Label', 'Tailored to You'),
      detail: t('stats.stat1Sub', 'Every minute planned for you')
    },
    {
      value: t('stats.stat2Val', '24/7'),
      label: t('stats.stat2Label', 'Support via WhatsApp'),
      detail: t('stats.stat2Sub', 'Always here whenever you need')
    },
    {
      value: t('stats.stat3Val', 'Zero'),
      label: t('stats.stat3Label', 'Hidden Costs'),
      detail: t('stats.stat3Sub', 'Clear pricing, no surprises')
    },
    {
      value: t('stats.stat4Val', '100%'),
      label: t('stats.stat4Label', 'Real Visa Support'),
      detail: t('stats.stat4Sub', 'Complete paperwork guidance')
    }
  ];

  useEffect(() => {
    const apply = (list) => {
      const next = (Array.isArray(list) ? list : getActivePartners()).filter((p) => p.active !== false);
      setPartners(next);
    };

    const handleSync = (e) => apply(e?.detail);
    window.addEventListener('zentrevo_partners_updated', handleSync);
    window.addEventListener('storage', () => apply());

    let active = true;
    syncPartnersFromCloud().then((result) => {
      if (!active) return;
      if (result.partners) apply(result.partners);
    });

    return () => {
      active = false;
      window.removeEventListener('zentrevo_partners_updated', handleSync);
    };
  }, []);

  return (
    <section className="px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Metric Ribbon */}
        <div
          className={`rounded-3xl p-6 sm:p-10 transition-all duration-300 border shadow-xl ${
            isSapphire
              ? 'bg-[#0a142c] border-amber-500/30 text-white shadow-blue-950/40'
              : isEmerald
                ? 'bg-[#0d2b23] border-emerald-800/60 text-white shadow-emerald-950/20'
                : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
          }`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/20">
            {localizedStats.map((stat, idx) => {
              const IconComp = icons[idx];
              return (
                <div key={idx} className={`flex items-start gap-4 ${idx > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''}`}>
                  <div className={`p-3 rounded-2xl ${
                    isSapphire
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                      : isEmerald
                        ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/40'
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold mt-1">
                      {stat.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      isSapphire ? 'text-amber-300/70' : isEmerald ? 'text-emerald-300/70' : 'text-stone-500'
                    }`}>
                      {stat.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partners carousel (LTR) */}
        <div className="mt-10 pt-4 flex flex-col items-center">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-6 ${
            isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'
          }`}>
            {t('stats.partnersHeading', 'Our Partners • Trusted Networks Across Every Journey')}
          </p>
          <PartnersCarousel partners={partners} currentTheme={currentTheme} />
        </div>
      </div>
    </section>
  );
}
