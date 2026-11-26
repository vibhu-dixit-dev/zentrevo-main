import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Crown,
  MapPin,
  Send,
  Share2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getActiveBlogArticles } from '../data/travelData';
import { getBlogSlug } from '../lib/seoRoutes';
import { getLocalizedArticlesList, getLocalizedArticle } from '../i18n/localizedTravelData';
import { useLanguage } from '../context/LanguageContext';

export default function JournalArticlePage({
  article,
  currentTheme = 'editorial',
  onSelectTheme,
  onNavigateHome,
  onNavigate,
  onOpenInquiry,
  onOpenVisa,
  onSelectArticle,
  onBackToJournal,
  onInquireStory
}) {
  const { t, language } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  const [articlesList, setArticlesList] = useState(getActiveBlogArticles);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article?.id, article?.slug]);

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

  const currentArticle = useMemo(() => {
    if (!article) return null;
    return getLocalizedArticle(article, language);
  }, [article, language]);

  useEffect(() => {
    if (!currentArticle) return;
    document.title = `${currentArticle.title} | Zentrevo Journal`;
  }, [currentArticle, language]);

  const currentIndex = currentArticle
    ? localizedArticles.findIndex((a) => a.id === currentArticle.id)
    : -1;
  const prevArticle = currentIndex > 0 ? localizedArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < localizedArticles.length - 1
    ? localizedArticles[currentIndex + 1]
    : null;

  const relatedStories = useMemo(() => {
    if (!currentArticle) return [];
    const sameDest = localizedArticles.filter(
      (a) => a.id !== currentArticle.id
        && (a.destination || '').toLowerCase() === (currentArticle.destination || '').toLowerCase()
    );
    const pool = sameDest.length >= 3
      ? sameDest
      : [
          ...sameDest,
          ...localizedArticles.filter(
            (a) => a.id !== currentArticle.id
              && !sameDest.some((s) => s.id === a.id)
          )
        ];
    return pool.slice(0, 5);
  }, [localizedArticles, currentArticle]);

  const handleShare = () => {
    if (!currentArticle) return;
    const slug = getBlogSlug(currentArticle);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.zentrevo.in';
    const url = `${origin}/journal/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!currentArticle) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${
        isSapphire ? 'bg-[#050a16] text-stone-100' : isEmerald ? 'bg-[#061813] text-stone-100' : 'bg-[#faf9f6] text-stone-900'
      }`}>
        <p className="text-sm font-semibold">{t('journal.notFound', 'This journal story could not be found.')}</p>
        <button
          type="button"
          onClick={onBackToJournal}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950 text-white cursor-pointer"
        >
          {t('journal.backToJournal', 'Back to Journal')}
        </button>
      </div>
    );
  }

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
        onOpenInquiry={() => onOpenInquiry?.(currentArticle.destination)}
        onSelectRegion={(reg) => {
          if (reg === 'national') onNavigate?.('/destinations/national');
          if (reg === 'international') onNavigate?.('/destinations/international');
        }}
        onOpenJournal={onBackToJournal}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs mb-6 opacity-75">
          <button type="button" onClick={onNavigateHome} className="hover:underline flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('journal.breadcrumbHome', 'Home')}</span>
          </button>
          <span>/</span>
          <button type="button" onClick={onBackToJournal} className="hover:underline cursor-pointer">
            {t('journal.breadcrumbCurrent', 'Journal')}
          </button>
          <span>/</span>
          <span className="font-semibold text-amber-500 truncate max-w-[200px] sm:max-w-md">
            {currentArticle.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-10 items-start">
          {/* Article column */}
          <article className="min-w-0">
            <div className="mb-5 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isSapphire
                    ? 'bg-amber-400 text-stone-950'
                    : isEmerald
                      ? 'bg-emerald-400 text-stone-950'
                      : 'bg-stone-950 text-white'
                }`}>
                  {currentArticle.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                  isDark ? 'bg-white/10 text-stone-200' : 'bg-stone-100 text-stone-700'
                }`}>
                  <MapPin className="w-3 h-3 text-amber-500" />
                  {currentArticle.destination}
                </span>
              </div>

              <h1 className="font-editorial text-2xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight">
                {currentArticle.title}
              </h1>

              <div className={`flex flex-wrap items-center justify-between gap-3 pb-5 border-b ${
                isSapphire ? 'border-slate-800' : isEmerald ? 'border-emerald-900' : 'border-stone-200'
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={currentArticle.author?.avatar}
                    alt={`${currentArticle.author?.name} - ${currentArticle.author?.role}`}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <span className="text-xs font-bold block">{currentArticle.author?.name}</span>
                    <span className="text-[11px] opacity-70 block">{currentArticle.author?.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] opacity-70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {currentArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentArticle.readTime}
                  </span>
                  <button
                    type="button"
                    onClick={handleShare}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                      isSapphire
                        ? 'border-slate-700 hover:bg-white/10'
                        : isEmerald
                          ? 'border-emerald-800 hover:bg-white/10'
                          : 'border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t('journal.shareCopied', 'Copied!')}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t('common.share', 'Share')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl mb-8">
              <img
                src={currentArticle.image}
                alt={currentArticle.imageAlt || `${currentArticle.title} - Zentrevo Journal Story`}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="max-w-3xl space-y-8">
              {currentArticle.pullQuote && (
                <blockquote className={`p-5 sm:p-6 rounded-2xl border-l-4 italic text-sm sm:text-base leading-relaxed ${
                  isSapphire
                    ? 'bg-[#081226] border-l-amber-400 text-stone-200'
                    : isEmerald
                      ? 'bg-emerald-950/60 border-l-emerald-400 text-stone-200'
                      : 'bg-stone-50 border-l-stone-900 text-stone-800'
                }`}>
                  &ldquo;{currentArticle.pullQuote}&rdquo;
                </blockquote>
              )}

              {Array.isArray(currentArticle.highlights) && currentArticle.highlights.length > 0 && (
                <div className={`p-5 rounded-2xl border ${
                  isSapphire
                    ? 'bg-[#081226]/80 border-amber-500/30'
                    : isEmerald
                      ? 'bg-emerald-950/50 border-emerald-800/60'
                      : 'bg-amber-50/50 border-amber-200/80'
                }`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-3">
                    {t('journal.jumplinks', 'In this dispatch')}
                  </p>
                  <ol className="space-y-2">
                    {currentArticle.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSapphire || isEmerald ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-white'
                        }`}>
                          {i + 1}
                        </span>
                        <span className="opacity-90 pt-0.5">{h}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed opacity-90">
                {(Array.isArray(currentArticle.content) ? currentArticle.content : [currentArticle.content]).filter(Boolean).map((p, idx) => (
                  <p key={idx} className={idx === 0 ? 'first-letter:text-3xl first-letter:font-editorial first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none' : ''}>
                    {p}
                  </p>
                ))}
              </div>

              {Array.isArray(currentArticle.externalLinks) && currentArticle.externalLinks.length > 0 && (
                <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
                  isSapphire
                    ? 'bg-[#081226]/80 border-amber-500/30'
                    : isEmerald
                      ? 'bg-emerald-950/50 border-emerald-800/60'
                      : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      {t('journal.usefulLinks', 'Useful Links')}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentArticle.externalLinks.map((link, i) => {
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
                            <span className="underline underline-offset-2 decoration-amber-400/60">
                              {link.label || link.title || href}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {Array.isArray(currentArticle.highlights) && currentArticle.highlights.length > 0 && (
                <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
                  isSapphire
                    ? 'bg-[#081226]/80 border-amber-500/30'
                    : isEmerald
                      ? 'bg-emerald-950/50 border-emerald-800/60'
                      : 'bg-amber-50/40 border-amber-200/80 text-stone-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      {t('journal.curatorAccess', "Curator's Insider Access")}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentArticle.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs opacity-90">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 ${
                isSapphire
                  ? 'bg-gradient-to-b from-[#081226] to-[#0d1e3d] border-amber-500/40'
                  : isEmerald
                    ? 'bg-gradient-to-b from-emerald-950/80 to-[#071f18] border-emerald-700/50'
                    : 'bg-stone-900 text-white border-stone-800'
              }`}>
                <Crown className="w-6 h-6 text-amber-400 mx-auto" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1 text-white">
                    {t('journal.experienceInPerson', 'Experience This Itinerary in Person')}
                  </h3>
                  <p className="text-xs text-stone-300 max-w-md mx-auto">
                    {t('journal.customizeVoyage', 'Our private journey planners can customize this exact voyage for you and your party.')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onInquireStory) onInquireStory(currentArticle.destination);
                    else onOpenInquiry?.(currentArticle.destination);
                  }}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                    isSapphire
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      : isEmerald
                        ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                        : 'bg-white text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('journal.inquireJourney', 'Inquire About This Journey')}</span>
                </button>
              </div>

              <div className={`pt-6 border-t flex items-center justify-between gap-4 ${
                isSapphire ? 'border-slate-800' : isEmerald ? 'border-emerald-900' : 'border-stone-200'
              }`}>
                {prevArticle ? (
                  <button
                    type="button"
                    onClick={() => onSelectArticle?.(prevArticle)}
                    className="flex items-center gap-2 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity text-left cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                    <div className="truncate max-w-[140px] sm:max-w-[220px]">
                      <span className="text-[10px] uppercase text-stone-400 block">{t('journal.prevStory', 'Previous Story')}</span>
                      <span className="truncate block">{prevArticle.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextArticle ? (
                  <button
                    type="button"
                    onClick={() => onSelectArticle?.(nextArticle)}
                    className="flex items-center gap-2 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity text-right cursor-pointer ml-auto"
                  >
                    <div className="truncate max-w-[140px] sm:max-w-[220px]">
                      <span className="text-[10px] uppercase text-stone-400 block">{t('journal.nextStory', 'Next Story')}</span>
                      <span className="truncate block">{nextArticle.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                ) : <div />}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className={`rounded-2xl border p-5 space-y-3 ${
              isSapphire
                ? 'bg-[#081226] border-amber-500/30'
                : isEmerald
                  ? 'bg-emerald-950/50 border-emerald-800/50'
                  : 'bg-white border-stone-200 shadow-sm'
            }`}>
              <h3 className="font-editorial text-lg font-bold">
                {t('journal.inquireSidebarTitle', 'Plan this journey')}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {t('journal.inquireSidebarSub', 'Share your dates and party size — our curators reply within 24 hours.')}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onInquireStory) onInquireStory(currentArticle.destination);
                  else onOpenInquiry?.(currentArticle.destination);
                }}
                className={`w-full px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer ${
                  isSapphire
                    ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                    : isEmerald
                      ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                      : 'bg-stone-950 text-white hover:bg-stone-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                {t('journal.contactUs', 'Contact Us')}
              </button>
            </div>

            {relatedStories.length > 0 && (
              <div className={`rounded-2xl border p-5 space-y-4 ${
                isSapphire
                  ? 'bg-[#081226] border-amber-500/30'
                  : isEmerald
                    ? 'bg-emerald-950/50 border-emerald-800/50'
                    : 'bg-white border-stone-200 shadow-sm'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  {t('journal.relatedHeading', 'More Field Notes')}
                </h3>
                <ul className="space-y-3">
                  {relatedStories.map((story) => (
                    <li key={story.id}>
                      <button
                        type="button"
                        onClick={() => onSelectArticle?.(story)}
                        className="w-full flex items-start gap-3 text-left group cursor-pointer"
                      >
                        <img
                          src={story.image}
                          alt=""
                          className="w-16 h-14 rounded-xl object-cover shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-amber-500 transition-colors">
                            {story.title}
                          </p>
                          <p className="text-[10px] opacity-60 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {story.readTime}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={onBackToJournal}
              className={`w-full px-4 py-2.5 rounded-full text-xs font-semibold border inline-flex items-center justify-center gap-2 cursor-pointer ${
                isSapphire
                  ? 'border-amber-500/40 text-amber-300 hover:bg-amber-400/10'
                  : isEmerald
                    ? 'border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10'
                    : 'border-stone-300 text-stone-800 hover:bg-stone-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('journal.allNotes', 'All Field Notes')}
            </button>
          </aside>
        </div>
      </main>

      <Footer
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onNavigate={onNavigate}
      />
    </div>
  );
}
