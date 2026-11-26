import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe2, 
  ArrowUpRight, 
  Star, 
  Clock, 
  Send, 
  ArrowLeft,
  FileCheck2,
  Search,
  X,
  SlidersHorizontal
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getActiveDestinations } from '../data/travelData';
import { getLocalizedDestinationsList, ensureMissingTranslations } from '../i18n/localizedTravelData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getActiveCategories, syncCategoriesFromCloud } from '../data/categoriesData';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);
  const [activeCategories, setActiveCategories] = useState(() => getActiveCategories());

  useEffect(() => {
    syncCategoriesFromCloud().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) setActiveCategories(cats);
    });

    const handleCats = (e) => {
      const updated = e.detail || getActiveCategories();
      if (Array.isArray(updated) && updated.length > 0) setActiveCategories(updated);
    };
    window.addEventListener('zentrevo_categories_updated', handleCats);
    return () => window.removeEventListener('zentrevo_categories_updated', handleCats);
  }, []);

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

  const categories = useMemo(() => {
    return ['All', ...activeCategories];
  }, [activeCategories]);

  const categoryLabels = {
    All: t('destinations.catAll', 'All'),
    'Luxury Escapes': t('destinations.catLuxury', 'Luxury Escapes'),
    Cultural: t('destinations.catCultural', 'Cultural'),
    'Alpine Nature': t('destinations.catAlpine', 'Alpine Nature'),
    Trending: t('destinations.catTrending', 'Trending')
  };

  // Extract all countries represented in the current International catalog with trip counts
  const availableCountries = useMemo(() => {
    const counts = {};
    internationalDestinations.forEach(d => {
      let country = d.country;
      if (!country && d.location) {
        const parts = d.location.split(',');
        country = parts[parts.length - 1].trim();
      }
      if (country) {
        country = country.replace(/\(.*\)/, '').trim();
        counts[country] = (counts[country] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [internationalDestinations]);

  // Combined Filtering: Category + Country Chip + Search Bar (Just like National)
  const filteredDestinations = useMemo(() => {
    return internationalDestinations.filter(d => {
      // 1. Category match
      const matchesCategory = activeCategory === 'All' || (d.baseCategory || d.category || d.badge) === activeCategory;
      if (!matchesCategory) return false;

      // 2. Selected Country chip match
      if (selectedCountry !== 'All') {
        const cLower = selectedCountry.toLowerCase();
        const dCountry = (d.country || '').toLowerCase();
        const dLoc = (d.location || '').toLowerCase();
        const dTitle = (d.title || '').toLowerCase();
        const matchesCountry = dCountry.includes(cLower) || dLoc.includes(cLower) || dTitle.includes(cLower);
        if (!matchesCountry) return false;
      }

      // 3. Search query match (filters by Country, City, Title, Description, or Highlights)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const dCountry = (d.country || '').toLowerCase();
        const dLoc = (d.location || '').toLowerCase();
        const dTitle = (d.title || '').toLowerCase();
        const dDesc = (d.description || '').toLowerCase();
        const dHighlights = Array.isArray(d.highlights) ? d.highlights.join(' ').toLowerCase() : '';

        const matchesSearch = 
          dCountry.includes(q) || 
          dLoc.includes(q) || 
          dTitle.includes(q) || 
          dDesc.includes(q) || 
          dHighlights.includes(q);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [internationalDestinations, activeCategory, selectedCountry, searchQuery]);

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

        {/* 1. Visa Guidance Reassurance Card */}
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

        {/* 2. Curated International Destinations Cards Grid */}
        <section id="international-grid" className="scroll-mt-24 mb-20">
          {/* Subheading & Filter Bar */}
          <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-stone-200/40">
            {/* Row 1: Heading & Category Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className={`font-editorial text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-stone-950'}`}>
                  {t('destinations.heading', 'Global Itineraries')}
                </h2>
                <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {selectedCountry !== 'All' || searchQuery ? (
                    <span>
                      Showing <strong className="text-amber-500 font-bold">{filteredDestinations.length}</strong> journeys {selectedCountry !== 'All' ? `in ${selectedCountry}` : ''} {searchQuery ? `matching "${searchQuery}"` : ''}
                    </span>
                  ) : (
                    `${filteredDestinations.length} ${t('destinations.destinationsAvailable', 'exclusive journeys available')}`
                  )}
                </span>
              </div>

              {/* Category Pills (Scrollable with all active categories) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none max-w-full sm:max-w-2xl">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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

            {/* Row 2: Search by Country & Destination Bar (Just like National page) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Country, City or Destination (e.g. Japan, Switzerland, Italy, Bali, London...)"
                  className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-medium transition-all focus:outline-none border shadow-sm ${
                    isDark 
                      ? 'bg-[#09152b] border-amber-500/30 text-white placeholder-stone-400 focus:border-amber-400' 
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {(selectedCountry !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountry('All');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Row 3: Quick Country Filter Chips */}
            {availableCountries.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 shrink-0 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-amber-500" />
                  <span>Countries:</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedCountry('All')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    selectedCountry === 'All'
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                      : isDark
                        ? 'bg-[#09152b] text-stone-300 border border-stone-700/60 hover:border-amber-400/50'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  All ({internationalDestinations.length})
                </button>

                {availableCountries.map(([countryName, count]) => (
                  <button
                    key={countryName}
                    type="button"
                    onClick={() => setSelectedCountry(selectedCountry === countryName ? 'All' : countryName)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      selectedCountry === countryName
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm ring-1 ring-amber-500'
                        : isDark
                          ? 'bg-[#09152b] text-stone-300 border border-stone-700/60 hover:border-amber-400/50'
                          : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span>{countryName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCountry === countryName ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-200/60 text-stone-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            )}
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

          {/* Empty Search / Filter State */}
          {filteredDestinations.length === 0 && (
            <div className={`text-center py-16 px-4 rounded-3xl border mt-4 ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}>
              <p className="text-base font-serif font-bold mb-2">No international expeditions found matching your search</p>
              <p className="text-xs text-stone-400 max-w-md mx-auto mb-6">
                Looking for a private journey in this country or region? Our private curators design bespoke itineraries for any international destination worldwide.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountry('All');
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInquiry && onOpenInquiry(`Custom Expedition: ${searchQuery || selectedCountry}`)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Commission This Destination
                </button>
              </div>
            </div>
          )}
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
