import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export function DestinationCard({ item, currentTheme, onSelectDestination, formatPrice, t, onHoverChange }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const openJourney = (e) => {
    e?.stopPropagation?.();
    if (typeof onSelectDestination === 'function') {
      onSelectDestination(item);
    }
  };

  return (
    <div
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocusCapture={() => onHoverChange?.(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onHoverChange?.(false);
      }}
      className={`group shrink-0 w-[min(78vw,250px)] sm:w-[270px] lg:w-[290px] snap-start rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${
        isSapphire
          ? 'bg-[#0c1a38] border-amber-500/30 text-white hover:border-amber-400/60 shadow-blue-950/40'
          : isEmerald
            ? 'bg-[#0d2b23] border-emerald-800/50 text-white shadow-emerald-950/20'
            : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
      }`}
    >
      <div
        onClick={openJourney}
        className="relative aspect-[16/10] overflow-hidden cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.imageAlt || `${item.title} - ${item.location} tour for Indian travelers | Zentrevo`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
          draggable={false}
        />

        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md ${item.tagColor}`}>
            {item.location}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-black/60 text-white backdrop-blur-md">
            {item.duration}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-white text-[11px] font-semibold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{item.rating}</span>
          <span className="opacity-75">({item.reviews})</span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider pt-0.5 ${
              isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-500'
            }`}>
              {item.badge}
            </span>
            <span className="text-sm sm:text-base font-bold whitespace-nowrap">
              {formatPrice(item.price)}
              <span className={`text-[10px] font-medium ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-500'}`}> {t('destinations.perGuest')}</span>
            </span>
          </div>

          <h3
            onClick={openJourney}
            className={`${isEditorial ? 'font-editorial font-medium' : 'font-sans font-bold'} text-[15px] sm:text-base mb-1.5 leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors cursor-pointer`}
          >
            {item.title}
          </h3>

          <p className={`text-[11px] leading-relaxed line-clamp-2 ${
            isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-500'
          }`}>
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-200/15 flex items-center justify-between gap-2">
          <span className={`text-[10px] font-medium flex items-center gap-1 min-w-0 ${
            isSapphire ? 'text-amber-300/80' : isEmerald ? 'text-emerald-300/80' : 'text-stone-500'
          }`}>
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">{t('destinations.conciergeIncluded')}</span>
          </span>

          <button
            type="button"
            onClick={openJourney}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
              isSapphire
                ? 'bg-[#081226] hover:bg-amber-400 hover:text-stone-950 text-amber-200 border border-amber-500/40'
                : isEmerald
                  ? 'bg-emerald-900/60 hover:bg-emerald-400 hover:text-stone-950 text-emerald-200 border border-emerald-700/50'
                  : 'bg-stone-100 hover:bg-stone-950 hover:text-white text-stone-800 border border-stone-200'
            }`}
          >
            <span>{t('destinations.viewJourney', 'View Journey')}</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DestinationCarousel({
  id,
  title,
  subtitle,
  icon: Icon,
  items,
  currentTheme,
  onSelectDestination,
  formatPrice,
  t
}) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isArrowPaused, setIsArrowPaused] = useState(false);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: null });
  const arrowPauseTimerRef = useRef(null);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // Infinite loop track: keep both arrows usable whenever content overflows
    const canScroll = el.scrollWidth - el.clientWidth > 8;
    setCanPrev(canScroll);
    setCanNext(canScroll);
  }, []);

  const getCardStep = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 300;
    const card = el.querySelector('[data-destination-card]');
    if (card) {
      const styles = window.getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap || '16') || 16;
      return card.getBoundingClientRect().width + gap;
    }
    return Math.min(300, el.clientWidth * 0.8);
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

    // Pause continuous auto-scroll so arrow movement is not overwritten
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
    window.setTimeout(updateArrows, 320);
  }, [getCardStep, getLoopPoint, updateArrows]);

  useEffect(() => {
    return () => {
      if (arrowPauseTimerRef.current) window.clearTimeout(arrowPauseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [items, updateArrows]);

  useEffect(() => {
    if (!items.length || isHovering || isArrowPaused) return undefined;
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
          el.scrollLeft += speed;
          if (loopPoint > 0 && el.scrollLeft >= loopPoint) {
            el.scrollLeft -= loopPoint;
          }
          updateArrows();
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [items, isHovering, isArrowPaused, updateArrows]);

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

    if (!drag.moved) {
      drag.moved = true;
      try {
        el.setPointerCapture?.(e.pointerId);
      } catch {}
    }

    el.scrollLeft = drag.scrollLeft - dx;
  };

  const endDrag = () => {
    const el = trackRef.current;
    const drag = dragState.current;
    if (!drag.active) return;

    drag.active = false;
    if (el && drag.pointerId != null) {
      try {
        el.releasePointerCapture?.(drag.pointerId);
      } catch {}
    }

    if (drag.moved) {
      window.setTimeout(() => {
        drag.moved = false;
      }, 0);
    }
  };

  const onClickCapture = (e) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  if (!items.length) return null;

  const arrowClass = `w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md border backdrop-blur-md cursor-pointer ${
    isSapphire
      ? 'bg-[#0a142c]/90 border-amber-500/40 text-amber-200 hover:bg-amber-400 hover:text-stone-950'
      : isEmerald
        ? 'bg-[#0a241d]/90 border-emerald-700/50 text-emerald-200 hover:bg-emerald-400 hover:text-stone-950'
        : 'bg-white/95 border-stone-200 text-stone-800 hover:bg-stone-950 hover:text-white'
  }`;

  return (
    <div id={id} className="relative scroll-mt-28">
      <div className="flex items-end justify-between gap-4 mb-4 px-1">
        <div>
          <div className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${
            isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-500'
          }`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{subtitle}</span>
          </div>
          <h3 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-xl sm:text-2xl tracking-tight ${
            isSapphire || isEmerald ? 'text-stone-100' : 'text-stone-900'
          }`}>
            {title}
          </h3>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label={`Previous ${title}`}
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className={`${arrowClass} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={`Next ${title}`}
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className={`${arrowClass} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-3 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {[0, 1].flatMap((copy) =>
            items.map((item, index) => (
              <div
                key={`${item.id}-${copy}`}
                data-destination-card={copy === 0 ? '' : undefined}
                data-loop-anchor={copy === 1 && index === 0 ? '' : undefined}
              >
                <DestinationCard
                  item={item}
                  currentTheme={currentTheme}
                  onSelectDestination={onSelectDestination}
                  formatPrice={formatPrice}
                  t={t}
                  onHoverChange={setIsHovering}
                />
              </div>
            ))
          )}
        </div>

        <div className={`pointer-events-none absolute inset-y-0 left-0 w-6 transition-opacity duration-300 ${
          canPrev ? 'opacity-100' : 'opacity-0'
        } ${
          isSapphire || isEmerald
            ? 'bg-gradient-to-r from-[#050b18] to-transparent'
            : 'bg-gradient-to-r from-[#fafaf9] to-transparent'
        }`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 w-6 transition-opacity duration-300 ${
          canNext ? 'opacity-100' : 'opacity-0'
        } ${
          isSapphire || isEmerald
            ? 'bg-gradient-to-l from-[#050b18] to-transparent'
            : 'bg-gradient-to-l from-[#fafaf9] to-transparent'
        }`} />
      </div>
    </div>
  );
}

export default DestinationCarousel;
