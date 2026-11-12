import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { 
  Globe2, 
  ArrowUpRight, 
  Star, 
  Clock, 
  Send, 
  ArrowLeft,
  FileCheck2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getActiveDestinations } from '../data/travelData';
import { getLocalizedDestinationsList, ensureMissingTranslations } from '../i18n/localizedTravelData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const WorldInteractiveMap = lazy(() => import('../components/WorldInteractiveMap'));

export default function InternationalDestinationsPage({
  currentTheme = 'editorial',
  onSelectTheme,
  onSelectDestination,
  onNavigateHome,
  onNavigate,
  onOpenInquiry,
  onOpenJournal,
  onOpenVisa
}) {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  const [activeCategory, setActiveCategory] = useState('All');
  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh'
      ? "全球奢华度假臻选 | Zentrevo 尊贵旅行"
      : language === 'es'
        ? "Destinos Internacionales Curados | Zentrevo"
        : language === 'ar'
          ? "الرحلات الاستكشافية الدولية | رحلات زينتريفو"
          : "International Curated Expeditions | Zentrevo";
  }, [language]);

  useEffect(() => {
    const handleSync = () => {
      setDestinationsList(getActiveDestinations());
    };
    window.addEventListener('zentrevo_destinations_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('zentrevo_destinations_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  useEffect(() => {
    ensureMissingTranslations(destinationsList, language);
  }, [destinationsList, language]);

  const localizedList = useMemo(() => {
    return getLocalizedDestinationsList(destinationsList, language);
  }, [destinationsList, language]);

  // Filter only International destinations
  const internationalDestinations = useMemo(() => {
    return localizedList.filter(d => (d.region || 'international') === 'international');
  }, [localizedList]);

  const categories = ['All', 'Luxury Escapes', 'Cultural', 'Alpine Nature', 'Trending'];

  const categoryLabels = {
    All: t('destinations.catAll', 'All'),
    'Luxury Escapes': t('destinations.catLuxury', 'Luxury Escapes'),
    Cultural: t('destinations.catCultural', 'Cultural'),
    'Alpine Nature': t('destinations.catAlpine', 'Alpine Nature'),
    Trending: t('destinations.catTrending', 'Trending')
  };

  const filteredDestinations = activeCategory === 'All'
    ? internationalDestinations
    : internationalDestinations.filter(d => (d.baseCategory || d.category) === activeCategory);

  const handleSelectDestinationById = (id) => {
    const found = destinationsList.find(d => d.id === id || String(d.id) === String(id));
    if (found && onSelectDestination) {
      onSelectDestination(found);
    }
  };

  const handleRequestCustomTrip = (placeName) => {
    if (onOpenInquiry) {
      onOpenInquiry(`Custom Global Trip: ${placeName}`);
    }
  };

  return (
    <div className={`min-h-screen font-sans-clean transition-colors duration-500 ${
      isSapphire
        ? 'bg-[#050a16] text-stone-100'
        : isEmerald 
          ? 'bg-[#061813] text-stone-100' 
          : 'bg-[#faf9f6] text-stone-900'
    }`}>
      {/* Global Navbar */}
      <Navbar 
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onOpenInquiry={() => onOpenInquiry('International Expedition Itinerary')}
        onSelectRegion={(reg) => {
          if (reg === 'national' && onNavigate) {
            onNavigate('/destinations/national');
          } else if (reg === 'international') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenJournal={onOpenJournal}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-8 opacity-75">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('internationalPage.breadcrumbHome', 'Home')}</span>
          </button>
          <span>/</span>
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="hover:underline cursor-pointer"
          >
            {t('internationalPage.breadcrumbDest', 'Destinations')}
          </button>
          <span>/</span>
          <span className="font-semibold text-amber-500">{t('internationalPage.breadcrumbCurrent', 'International')}</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b pb-8 border-stone-200/40">
          <div>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 border ${
              isSapphire
                ? 'bg-amber-400/20 text-amber-300 border-amber-500/40'
                : isEmerald
                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-600/40'
                  : 'bg-white text-stone-800 border-stone-200 shadow-sm'
            }`}>
              <Globe2 className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('internationalPage.badge', 'Global Expeditions')}</span>
            </div>
            
            <h1 className={`font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              {t('internationalPage.title', 'Curated International Escapes')}
            </h1>
            
            <p className={`text-sm sm:text-base max-w-2xl mt-3 leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              {t('internationalPage.subtitle', 'Handcrafted journeys across Amalfi cliffs, Kyoto zen sanctuaries, Swiss alpine passes, and Turkish balloon valleys.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Custom Global Expedition')}
              className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isSapphire
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-amber-950/30'
                  : isEmerald
                    ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-950/30'
                    : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('internationalPage.commissionBtn', 'Plan Custom World Journey')}</span>
            </button>
          </div>
        </div>

        {/* 1. The Interactive World Map Section */}
        <section aria-label="Interactive World Map" className="mb-12">
          <Suspense
            fallback={
              <div className="h-[460px] rounded-2xl border border-amber-500/20 bg-[#071022] flex items-center justify-center text-amber-300/80 text-xs font-mono uppercase tracking-[0.25em]">
                Loading Interactive Map...
              </div>
            }
          >
            <WorldInteractiveMap 
              onSelectDestinationById={handleSelectDestinationById}
              onRequestCustomTrip={handleRequestCustomTrip}
            />
          </Suspense>
        </section>

        {/* 2. Visa Guidance Reassurance Card */}
        <section aria-label="Visa Guidance Banner" className="mb-14">
          <div className={`rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
            isSapphire
              ? 'bg-[#0a1633] border-amber-500/30 text-white'
              : isEmerald
                ? 'bg-[#09221b] border-emerald-800/50 text-white'
                : 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border-amber-200/80 text-stone-900 shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/30'
                  : 'bg-amber-100 text-amber-900 border-amber-300/60'
              }`}>
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
                  isDark ? 'text-amber-300' : 'text-amber-800'
                }`}>
                  {t('internationalPage.visaBannerBadge', 'Indian Passport Friendly')}
                </span>
                <h2 className="text-lg sm:text-xl font-editorial font-bold mb-1">
                  {t('internationalPage.visaBannerTitle', 'Hassle-Free Visa Guidance & Paperwork Support')}
                </h2>
                <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {t('internationalPage.visaBannerSubtitle', 'Embassy rules, document checklists, and application guidance tailored for Indian travelers before you book.')}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenVisa}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all border cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'bg-white hover:bg-stone-100 text-stone-900 border-stone-300 shadow-sm'
              }`}
            >
              <span>{t('internationalPage.visaBannerBtn', 'Explore Visa Guidance')}</span>
            </button>
          </div>
        </section>

        {/* 3. Curated International Destinations Cards Grid */}
        <section id="international-grid" className="scroll-mt-24 mb-20">
          {/* Subheading & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-stone-200/40">
            <div>
              <h2 className={`font-editorial text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {t('destinations.heading', 'Global Itineraries')}
              </h2>
              <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {filteredDestinations.length} {t('destinations.destinationsAvailable', 'exclusive journeys available')}
              </span>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeCategory === cat
                      ? isSapphire
                        ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
                        : isEmerald
                          ? 'bg-emerald-400 text-stone-950 shadow-md shadow-emerald-500/20'
                          : 'bg-stone-950 text-white shadow-md shadow-stone-900/20'
                      : isSapphire
                        ? 'bg-[#0a142c] text-stone-300 border border-amber-500/30 hover:border-amber-400'
                        : isEmerald
                          ? 'bg-[#0a241d] text-stone-300 border border-emerald-800/40 hover:border-emerald-500'
                          : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {categoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid - Refined & Compact 3-Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredDestinations.map((item) => (
              <div
                key={item.id}
                className={`group rounded-2xl sm:rounded-[22px] overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                  isSapphire
                    ? 'bg-[#0c1a38] border-amber-500/30 text-white hover:border-amber-400/60 shadow-blue-950/40'
                    : isEmerald
                      ? 'bg-[#0d2b23] border-emerald-800/50 text-white shadow-emerald-950/20'
                      : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
                }`}
              >
                {/* Image Frame */}
                <div 
                  onClick={() => onSelectDestination(item)}
                  className="relative aspect-[16/11] overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt || `${item.title} - ${item.location} tour | Zentrevo`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Location Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md ${item.tagColor}`}>
                      {item.location}
                    </span>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-black/60 text-white backdrop-blur-md">
                      {item.duration}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white text-[11px] font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                    <span className="opacity-75">({item.reviews} {t('common.reviews', 'reviews')})</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-600'
                      }`}>
                        {item.badge}
                      </span>
                      <span className="text-base sm:text-lg font-bold font-editorial">
                        {formatPrice(item.price)}
                        <span className={`text-[11px] font-medium font-sans ${isDark ? 'text-stone-300' : 'text-stone-600'}`}> {t('destinations.perGuest')}</span>
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectDestination(item)}
                      className="font-editorial text-lg sm:text-xl font-bold mb-2 leading-snug group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                      isDark ? 'text-stone-300' : 'text-stone-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Card Action Row */}
                  <div className={`pt-3 border-t flex items-center justify-between ${
                    isDark ? 'border-white/10' : 'border-stone-200/80'
                  }`}>
                    <span className={`text-[11px] font-medium flex items-center gap-1 ${
                      isSapphire ? 'text-amber-300/80' : isEmerald ? 'text-emerald-300/80' : 'text-stone-600'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{t('destinations.conciergeIncluded')}</span>
                    </span>

                    <button
                      onClick={() => onSelectDestination(item)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
                        isSapphire
                          ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-stone-950 border border-amber-500/30'
                          : isEmerald
                            ? 'bg-emerald-400/20 text-emerald-300 hover:bg-emerald-400 hover:text-stone-950 border border-emerald-600/40'
                            : 'bg-stone-100 hover:bg-stone-950 hover:text-white text-stone-800 border border-stone-200'
                      }`}
                    >
                      <span>{t('destinations.viewDetails')}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Bespoke Global Commission Banner */}
        <section className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden mb-16 ${
          isSapphire
            ? 'bg-gradient-to-r from-[#0a1738] to-[#0c1f4e] border-amber-500/30 text-white'
            : isEmerald
              ? 'bg-gradient-to-r from-[#08221b] to-[#0d3429] border-emerald-800/50 text-white'
              : 'bg-gradient-to-r from-stone-900 to-stone-950 text-white border-stone-800 shadow-xl'
        }`}>
          <div className="relative z-10 max-w-3xl">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-amber-400 mb-2 block">
              {t('internationalPage.badge', 'Global Expeditions')}
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              {t('internationalPage.commissionTitle', 'Seeking a Global Destination Not Listed Here?')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-8 max-w-2xl">
              {t('internationalPage.commissionSubtitle', 'Our expedition designers curate private worldwide itineraries — from the French Riviera and Patagonia to New Zealand fjords.')}
            </p>
            <button
              onClick={() => onOpenInquiry('Custom Global Expedition Request')}
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('internationalPage.commissionBtn', 'Plan Custom World Journey')}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer 
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onNavigate={onNavigate}
      />
    </div>
  );
}
