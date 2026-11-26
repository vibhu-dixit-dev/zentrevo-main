import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  Send
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getActiveBlogArticles } from '../data/travelData';
import { getBlogSlug } from '../lib/seoRoutes';
import { getLocalizedArticlesList } from '../i18n/localizedTravelData';
import { useLanguage } from '../context/LanguageContext';

function JournalStoryCard({ article, currentTheme, onSelect, t, onHoverChange, layout = 'carousel' }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isCarousel = layout === 'carousel';

  return (
    <article
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocusCapture={() => onHoverChange?.(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onHoverChange?.(false);
      }}
      onClick={() => onSelect(article)}
      className={`group rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1.5 ${
        isCarousel
          ? 'shrink-0 w-[min(78vw,250px)] sm:w-[270px] lg:w-[290px] snap-start'
          : 'w-full h-full'
      } ${
        isSapphire
          ? 'bg-[#081226]/80 border-amber-500/25 text-stone-100 hover:border-amber-400/60'
          : isEmerald
            ? 'bg-emerald-950/40 border-emerald-800/40 text-stone-100 hover:border-emerald-500/60'
            : 'bg-white border-stone-200 text-stone-900 hover:border-stone-400'
      }`}
    >
      <div className="overflow-hidden relative aspect-[16/10]">
        <img
          src={article.image}
          alt={article.imageAlt || `${article.title} - Zentrevo Journal`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
        />
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9.5px] font-semibold text-white uppercase tracking-wider">
          {article.category}
        </div>
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9.5px] font-medium text-white/90 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {article.readTime}
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold uppercase">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{article.destination}</span>
          </div>
          <h3 className="font-editorial font-bold text-sm sm:text-base leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-2 border-t border-stone-200/10 flex items-center justify-between text-xs font-semibold">
          <span className="text-[10px] opacity-60 font-normal">{article.date}</span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
            isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
          }`}>
            {t('journal.readMore', 'Read More')}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Continuous movable carousel (same pattern as destinations / home Field Notes) */
function JournalStoriesCarousel({ articles, currentTheme, onSelect, t, title, subtitle }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;
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
    const canScroll = el.scrollWidth - el.clientWidth > 8;
    setCanPrev(canScroll);
    setCanNext(canScroll);
  }, []);

  const getCardStep = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 300;
    const card = el.querySelector('[data-journal-card]');
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
  }, [articles, updateArrows]);

  useEffect(() => {
    if (!articles.length || isHovering || isArrowPaused) return undefined;
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
          const loopPoint = getLoopPoint();
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
  }, [articles, isHovering, isArrowPaused, updateArrows, getLoopPoint]);

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

  if (!articles.length) return null;

  // Duplicate set enough times so even 1–2 cards fill a continuous marquee track
  const loopCopies = articles.length >= 4 ? 2 : articles.length >= 2 ? 3 : 4;

  const arrowClass = `w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md border backdrop-blur-md cursor-pointer ${
    isSapphire
      ? 'bg-[#0a142c]/90 border-amber-500/40 text-amber-200 hover:bg-amber-400 hover:text-stone-950'
      : isEmerald
        ? 'bg-[#0a241d]/90 border-emerald-700/50 text-emerald-200 hover:bg-emerald-400 hover:text-stone-950'
        : 'bg-white/95 border-stone-200 text-stone-800 hover:bg-stone-950 hover:text-white'
  }`;

  return (
    <div className="relative">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-500 mb-1">
            {subtitle}
          </p>
          <h2 className={`font-editorial text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
            {title}
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Previous stories"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className={`${arrowClass} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Next stories"
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
          {Array.from({ length: loopCopies }, (_, copy) =>
            articles.map((article, index) => (
              <div
                key={`${article.id}-${copy}-${index}`}
                data-journal-card={copy === 0 ? '' : undefined}
                data-loop-anchor={copy === 1 && index === 0 ? '' : undefined}
              >
                <JournalStoryCard
                  article={article}
                  currentTheme={currentTheme}
                  onSelect={onSelect}
                  t={t}
                  onHoverChange={setIsHovering}
                />
              </div>
            ))
          )}
        </div>

        <div className={`pointer-events-none absolute inset-y-0 left-0 w-6 ${
          isSapphire || isEmerald
            ? 'bg-gradient-to-r from-[#050a16] to-transparent'
            : 'bg-gradient-to-r from-[#faf9f6] to-transparent'
        }`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 w-6 ${
          isSapphire || isEmerald
            ? 'bg-gradient-to-l from-[#050a16] to-transparent'
            : 'bg-gradient-to-l from-[#faf9f6] to-transparent'
        }`} />
      </div>
    </div>
  );
}

export default function JournalPage({
  currentTheme = 'editorial',
  onSelectTheme,
  onNavigateHome,
  onNavigate,
  onOpenInquiry,
  onOpenJournal,
  onOpenVisa,
  onSelectArticle
}) {
  const { t, language } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  const [articlesList, setArticlesList] = useState(getActiveBlogArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh'
      ? '旅行期刊与故事 | Zentrevo'
      : language === 'es'
        ? 'Diario de Viajes y Relatos | Zentrevo'
        : language === 'ar'
          ? 'مجلة السفر والقصص | زينتريفو'
          : 'Travel Journal & Stories | Zentrevo';
  }, [language]);

  useEffect(() => {
    const handleSync = () => setArticlesList(getActiveBlogArticles());
    window.addEventListener('zentrevo_blogs_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('zentrevo_blogs_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const localizedArticles = useMemo(
    () => getLocalizedArticlesList(articlesList, language),
    [articlesList, language]
  );

  const featured = localizedArticles[0] || null;

  const categories = useMemo(() => {
    return ['All', ...new Set(localizedArticles.map((a) => a.category).filter(Boolean))];
  }, [localizedArticles]);

  const filteredLatest = useMemo(() => {
    return localizedArticles.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q
        || article.title?.toLowerCase().includes(q)
        || article.category?.toLowerCase().includes(q)
        || article.destination?.toLowerCase().includes(q)
        || article.excerpt?.toLowerCase().includes(q)
        || article.author?.name?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [localizedArticles, selectedCategory, searchQuery]);

  const openArticle = (article) => {
    if (onSelectArticle) onSelectArticle(article);
    else if (onOpenJournal) onOpenJournal(article);
  };

  return (
    <div className={`min-h-screen font-sans-clean transition-colors duration-500 ${
      isSapphire
        ? 'bg-[#050a16] text-stone-100'
        : isEmerald
          ? 'bg-[#061813] text-stone-100'
          : 'bg-[#faf9f6] text-stone-900'
    }`}>
      <Navbar
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onOpenInquiry={() => onOpenInquiry?.('Journal Inquiry')}
        onSelectRegion={(reg) => {
          if (reg === 'national') onNavigate?.('/destinations/national');
          if (reg === 'international') onNavigate?.('/destinations/international');
        }}
        onOpenJournal={() => onNavigate?.('/journal')}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />

      {featured && (
        <section className="relative min-h-[70vh] sm:min-h-[78vh] flex items-end overflow-hidden">
          <img
            src={featured.image}
            alt={featured.imageAlt || featured.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-12 sm:pb-16 pt-28">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-6 text-white/70">
              <button type="button" onClick={onNavigateHome} className="hover:text-white flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('journal.breadcrumbHome', 'Home')}</span>
              </button>
              <span>/</span>
              <span className="font-semibold text-amber-300">{t('journal.breadcrumbCurrent', 'Journal')}</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950">
                  {featured.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/15 text-white backdrop-blur-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  {featured.destination}
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                {featured.title}
              </h1>

              <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed max-w-2xl line-clamp-3">
                {featured.excerpt || featured.pullQuote}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openArticle(featured)}
                  className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg cursor-pointer transition-all ${
                    isSapphire
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      : isEmerald
                        ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                        : 'bg-white text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <span>{t('journal.readMore', 'Read More')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-white/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                  <span className="opacity-50">•</span>
                  {featured.date}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16">
        {!featured && (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto opacity-40" />
            <h1 className="font-editorial text-3xl font-bold">
              {t('journal.pageTitle', 'The Private Journal')}
            </h1>
            <p className="text-sm opacity-70 max-w-md mx-auto">
              {t('journal.catalogSub', 'Dispatches penned by our global expedition directors and cultural liaisons.')}
            </p>
          </div>
        )}

        {localizedArticles.length > 0 && (
          <section className="border-b border-stone-200/40 pb-14">
            <JournalStoriesCarousel
              articles={localizedArticles}
              currentTheme={currentTheme}
              onSelect={openArticle}
              t={t}
              title={t('journal.hubsHeading', 'Stories by Destination')}
              subtitle={t('journal.storiesBadge', 'Zentrevo Stories')}
            />
            <p className={`text-xs mt-3 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              {t('journal.hubsSub', 'What our travellers and curators choose to explore now.')}
            </p>
          </section>
        )}

        <section id="latest-posts" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col gap-4 border-b pb-5 border-stone-200/40">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className={`font-editorial text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  {t('journal.latestHeading', 'Latest Posts')}
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {t('journal.latestSub', 'Stay current with our newest field notes and dispatches.')}
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('journal.searchPlaceholder', 'Search stories, destinations...')}
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border focus:outline-none transition-all ${
                    isSapphire
                      ? 'bg-[#081226] border-slate-700 text-white focus:border-amber-400'
                      : isEmerald
                        ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                        : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? isSapphire
                          ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                          : isEmerald
                            ? 'bg-emerald-400 text-stone-950 font-bold shadow-md'
                            : 'bg-stone-950 text-white font-bold'
                        : isSapphire
                          ? 'bg-[#081226] text-stone-300 hover:bg-[#0c1a38]'
                          : isEmerald
                            ? 'bg-emerald-950/60 text-stone-300 hover:bg-emerald-900/60'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'All' ? t('destinations.catAll', 'All') : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredLatest.length === 0 ? (
            <div className="text-center py-16 space-y-2 opacity-70">
              <BookOpen className="w-8 h-8 mx-auto text-stone-400" />
              <p className="text-sm font-semibold">{t('journal.noResults', 'No journal stories match your search')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLatest.map((article) => (
                <JournalStoryCard
                  key={`${article.id}-${getBlogSlug(article)}`}
                  article={article}
                  currentTheme={currentTheme}
                  onSelect={openArticle}
                  t={t}
                  layout="grid"
                />
              ))}
            </div>
          )}
        </section>

        <section className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden ${
          isSapphire
            ? 'bg-gradient-to-r from-[#0a1738] to-[#0c1f4e] border-amber-500/30 text-white'
            : isEmerald
              ? 'bg-gradient-to-r from-[#08221b] to-[#0d3429] border-emerald-800/50 text-white'
              : 'bg-gradient-to-r from-stone-900 to-stone-950 text-white border-stone-800 shadow-xl'
        }`}>
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              {t('journal.commissionTitle', 'Want a journey inspired by these stories?')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-8 max-w-2xl">
              {t('journal.commissionSubtitle', 'Tell us which dispatch moved you — our curators will craft a private itinerary around that exact rhythm.')}
            </p>
            <button
              type="button"
              onClick={() => onOpenInquiry?.('Journal Inspired Journey')}
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('journal.contactUs', 'Contact Us')}</span>
            </button>
          </div>
        </section>
      </main>

      <Footer
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onNavigate={onNavigate}
      />
    </div>
  );
}
