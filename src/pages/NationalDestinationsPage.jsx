import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Crown, 
  ArrowUpRight, 
  Star, 
  Clock, 
  Send, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IndiaInteractiveMap from '../components/IndiaInteractiveMap';
import { destinations, getActiveDestinations } from '../data/travelData';
import { getLocalizedDestinationsList } from '../i18n/localizedTravelData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export default function NationalDestinationsPage({
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
  const { t, language, isRTL } = useLanguage();

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';
  const isDark = isEmerald || isSapphire;

  const [activeCategory, setActiveCategory] = useState('All');
  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh'
      ? "印度专属私享旅程 | Zentrevo 尊享旅行"
      : language === 'es'
        ? "Viajes Curados por la India | Zentrevo"
        : language === 'ar'
          ? "رحلات الهند الفاخرة | رحلات زينتريفو"
          : "National Journeys & Interactive Map of India | Zentrevo";
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

  const localizedList = useMemo(() => {
    return getLocalizedDestinationsList(destinationsList, language);
  }, [destinationsList, language]);

  // Filter only National (India) destinations
  const nationalDestinations = useMemo(() => {
    return localizedList.filter(d => (d.region || 'international') === 'national');
  }, [localizedList]);

  const categories = ['All', 'Luxury Escapes', 'Cultural', 'Alpine Nature'];

  const categoryLabels = {
    All: t('destinations.catAll', 'All'),
    'Luxury Escapes': t('destinations.catLuxury', 'Luxury Escapes'),
    Cultural: t('destinations.catCultural', 'Cultural'),
    'Alpine Nature': t('destinations.catAlpine', 'Alpine Nature')
  };

  const filteredDestinations = activeCategory === 'All'
    ? nationalDestinations
    : nationalDestinations.filter(d => (d.baseCategory || d.category) === activeCategory);

  const handleSelectDestinationById = (id) => {
    const found = destinationsList.find(d => d.id === id || String(d.id) === String(id));
    if (found && onSelectDestination) {
      onSelectDestination(found);
    }
  };

  const handleRequestCustomTrip = (placeName) => {
    if (onOpenInquiry) {
      onOpenInquiry(`Custom India Trip: ${placeName}`);
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
        onOpenInquiry={() => onOpenInquiry('National India Itinerary')}
        onSelectRegion={(reg) => {
          if (reg === 'international' && onNavigate) {
            onNavigate('/destinations/international');
          } else if (reg === 'national') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenJournal={onOpenJournal}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-3 opacity-75">
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nationalPage.breadcrumbHome', 'Home')}</span>
          </button>
          <span>/</span>
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="hover:underline cursor-pointer"
          >
            {t('nationalPage.breadcrumbDest', 'Destinations')}
          </button>
          <span>/</span>
          <span className="font-semibold text-amber-500">{t('nationalPage.breadcrumbCurrent', 'National (India)')}</span>
        </nav>

        {/* Page Hero Header - Compact to maximize map visibility on first screen */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 border-b pb-4 border-stone-200/40">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-2 border ${
              isSapphire
                ? 'bg-amber-400/20 text-amber-300 border-amber-500/40'
                : isEmerald
                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-600/40'
                  : 'bg-white text-stone-800 border-stone-200 shadow-sm'
            }`}>
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>{t('nationalPage.badge', 'Subcontinent Expeditions')}</span>
            </div>
            
            <h1 className={`font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              {t('nationalPage.title', 'Curated India Journeys')}
            </h1>
            
            <p className={`text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              {t('nationalPage.subtitle', 'From high Himalayan frontier valleys and Kashmiri royal houseboats to Udaipur lake palaces and tranquil Kerala backwaters.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Bespoke India Itinerary')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isSapphire
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-amber-950/30'
                  : isEmerald
                    ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-950/30'
                    : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/20'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>{t('nationalPage.commissionBtn', 'Commission a Bespoke Itinerary')}</span>
            </button>
          </div>
        </div>

        {/* 1. The Interactive India Map Section */}
        <section aria-label="Interactive India Map" className="mb-12">
          <IndiaInteractiveMap 
            currentTheme={currentTheme}
            onSelectDestinationById={handleSelectDestinationById}
            onRequestCustomTrip={handleRequestCustomTrip}
          />
        </section>

        {/* 2. Curated Indian Destinations Cards Grid */}
        <section id="national-grid" className="scroll-mt-24 mb-20">
          {/* Subheading & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-stone-200/40">
            <div>
              <h2 className={`font-editorial text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                {t('nationalPage.allCategories', 'Curated Indian Portfolios')}
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

        {/* 3. Bespoke Commission Banner */}
        <section className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden mb-16 ${
          isSapphire
            ? 'bg-gradient-to-r from-[#0a1738] to-[#0c1f4e] border-amber-500/30 text-white'
            : isEmerald
              ? 'bg-gradient-to-r from-[#08221b] to-[#0d3429] border-emerald-800/50 text-white'
              : 'bg-gradient-to-r from-stone-900 to-stone-950 text-white border-stone-800 shadow-xl'
        }`}>
          <div className="relative z-10 max-w-3xl">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-amber-400 mb-2 block">
              {t('nationalPage.badge', 'Subcontinent Expeditions')}
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              {t('nationalPage.commissionTitle', 'Looking for an Untouched Corner of India?')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-8 max-w-2xl">
              {t('nationalPage.commissionSubtitle', 'We design tailored private journeys across all 28 states — Kaziranga wildlife lodges, Spiti cliff retreats, or private Chettinad heritage mansions.')}
            </p>
            <button
              onClick={() => onOpenInquiry('Bespoke India Custom Request')}
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('nationalPage.commissionBtn', 'Commission a Bespoke Itinerary')}</span>
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
