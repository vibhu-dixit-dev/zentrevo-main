import React, { useState, useEffect, useMemo } from 'react';
import { getActiveDestinations } from '../data/travelData';
import { ArrowUpRight, Star, Clock, Sparkles, Crown, Globe2, MapPin, Layers, X, Search, ChevronDown } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDestinationsList, ensureMissingTranslations } from '../i18n/localizedTravelData';

const INITIAL_CARD_COUNT = 9;

export default function DestinationsGrid({ 
  currentTheme, 
  onSelectDestination,
  selectedRegion = 'all',
  onSelectRegion,
  searchFilter = null,
  onClearSearchFilter
}) {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentRegion, setCurrentRegion] = useState(selectedRegion || 'all');
  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARD_COUNT);

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
    if (selectedRegion && selectedRegion !== currentRegion) {
      setCurrentRegion(selectedRegion);
      setVisibleCount(INITIAL_CARD_COUNT);
    }
  }, [selectedRegion, currentRegion]);

  const handleRegionChange = (region) => {
    setCurrentRegion(region);
    setVisibleCount(INITIAL_CARD_COUNT);
    if (onClearSearchFilter) {
      onClearSearchFilter();
    }
    if (onSelectRegion) {
      onSelectRegion(region);
    }
  };

  const categories = ['All', 'Luxury Escapes', 'Cultural', 'Trending', 'Alpine Nature'];

  const categoryLabels = {
    All: t('destinations.catAll', 'All'),
    'Luxury Escapes': t('destinations.catLuxury', 'Luxury Escapes'),
    Cultural: t('destinations.catCultural', 'Cultural'),
    Trending: t('destinations.catTrending', 'Trending'),
    'Alpine Nature': t('destinations.catAlpine', 'Alpine Nature')
  };

  // Localized destinations array
  useEffect(() => {
    ensureMissingTranslations(destinationsList, language);
  }, [destinationsList, language]);

  const localizedList = useMemo(() => {
    return getLocalizedDestinationsList(destinationsList, language);
  }, [destinationsList, language]);

  // Counts for Regional Filters
  const nationalCount = localizedList.filter(d => (d.region || 'international') === 'national').length;
  const internationalCount = localizedList.filter(d => (d.region || 'international') === 'international').length;

  // 1. Apply Hero Search Filter if active
  const hasActiveSearch = Boolean(
    searchFilter && (searchFilter.destinationId || searchFilter.destinationTitle || searchFilter.destinationLocation || searchFilter.label)
  );

  // 2. Filter by Region (National vs International vs All)
  const regionFiltered = currentRegion === 'all'
    ? localizedList
    : localizedList.filter(d => (d.region || 'international') === currentRegion);

  // 3. Filter by Category or Search Criteria
  const filteredDestinations = useMemo(() => {
    if (hasActiveSearch) {
      return localizedList.filter((d) => {
        if (searchFilter.destinationId && String(d.id) === String(searchFilter.destinationId)) {
          return true;
        }
        const qTitle = (searchFilter.destinationTitle || '').toLowerCase();
        const qLoc = (searchFilter.destinationLocation || '').toLowerCase();
        const dTitle = (d.title || '').toLowerCase();
        const dLoc = (d.location || '').toLowerCase();
        return (qTitle && dTitle.includes(qTitle)) || (qLoc && dLoc.includes(qLoc));
      });
    }
    return activeCategory === 'All' 
      ? regionFiltered 
      : regionFiltered.filter(d => (d.baseCategory || d.category) === activeCategory);
  }, [hasActiveSearch, searchFilter, localizedList, activeCategory, regionFiltered]);

  const displayedDestinations = useMemo(() => {
    return filteredDestinations.slice(0, visibleCount);
  }, [filteredDestinations, visibleCount]);

  return (
    <section id="destinations" className="px-4 sm:px-8 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 border">
              {isSapphire ? (
                <div className="flex items-center gap-1.5 text-amber-400 border-amber-500/40 bg-[#061025]/60">
                  <Crown className="w-3.5 h-3.5 inline mr-1" />
                  <span>{t('destinations.badgeSapphire', 'Curated Sovereign Escapes')}</span>
                </div>
              ) : isEmerald ? (
                <div className="text-emerald-400 border-emerald-700/50 bg-emerald-950/40">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                  <span>{t('destinations.badgeEmerald', 'Curated Expeditions')}</span>
                </div>
              ) : (
                <div className="text-stone-700 border-stone-200 bg-white">
                  <span>{t('destinations.badgeEditorial', '✨ Featured Itineraries')}</span>
                </div>
              )}
            </div>
            
            <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-3xl sm:text-5xl tracking-tight leading-tight max-w-2xl ${
              isSapphire || isEmerald ? 'text-stone-100' : 'text-stone-900'
            }`}>
              {t('destinations.headingMain', 'The Most Amazing Travel Packages Every Traveler Dreams Of.')}
            </h2>

            {/* Regional Filter Switcher: All / National / International */}
            <div className={`mt-5 flex items-center gap-1.5 p-1.5 rounded-2xl w-fit border shadow-sm ${
              isSapphire 
                ? 'bg-[#091530] border-amber-500/30 text-stone-100'
                : isEmerald
                  ? 'bg-[#08221a] border-emerald-800/60 text-stone-100'
                  : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
            }`}>
              <button
                type="button"
                onClick={() => handleRegionChange('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentRegion === 'all'
                    ? isSapphire
                      ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                      : isEmerald
                        ? 'bg-emerald-400 text-stone-950 shadow-sm font-bold'
                        : 'bg-stone-950 text-white shadow-sm font-bold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('destinations.allFilter')} ({destinationsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleRegionChange('national')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentRegion === 'national'
                    ? isSapphire
                      ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                      : isEmerald
                        ? 'bg-emerald-400 text-stone-950 shadow-sm font-bold'
                        : 'bg-stone-950 text-white shadow-sm font-bold'
                    : 'text-stone-500 hover:text-stone-950 dark:hover:text-stone-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('destinations.nationalFilter')} ({nationalCount})</span>
              </button>

              <button
                type="button"
                onClick={() => handleRegionChange('international')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentRegion === 'international'
                    ? isSapphire
                      ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                      : isEmerald
                        ? 'bg-emerald-400 text-stone-950 shadow-sm font-bold'
                        : 'bg-stone-950 text-white shadow-sm font-bold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>{t('destinations.internationalFilter')} ({internationalCount})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(INITIAL_CARD_COUNT);
                  if (onClearSearchFilter) onClearSearchFilter();
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? isSapphire
                      ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-500/25 font-bold'
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

        {/* Active Search Filter Banner (from Hero Search Bar) */}
        {hasActiveSearch && (
          <div className={`mb-8 p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 animate-fadeIn ${
            isSapphire
              ? 'bg-[#091530] border-amber-500/40 text-stone-100'
              : isEmerald
                ? 'bg-[#08221a] border-emerald-700/50 text-stone-100'
                : 'bg-white border-stone-300 text-stone-900 shadow-sm'
          }`}>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isSapphire ? 'bg-amber-400/20 text-amber-300' : isEmerald ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-100 text-stone-800'
              }`}>
                <Search className="w-3 h-3" />
                <span>Filtered Result</span>
              </span>
              <span className="font-semibold">
                {searchFilter.label || searchFilter.destinationTitle || searchFilter.destinationLocation}
              </span>
              {searchFilter.date && (
                <span className="opacity-75">• {searchFilter.date}</span>
              )}
              {searchFilter.guests && (
                <span className="opacity-75">• {searchFilter.guests}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setVisibleCount(INITIAL_CARD_COUNT);
                if (onClearSearchFilter) onClearSearchFilter();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                isSapphire
                  ? 'border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-stone-950'
                  : isEmerald
                    ? 'border-emerald-600/50 text-emerald-300 hover:bg-emerald-400 hover:text-stone-950'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-950 hover:text-white'
              }`}
            >
              <span>Show All Journeys</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Masonry / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDestinations.map((item) => (
            <div
              key={item.id}
              className={`group rounded-[28px] overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-1.5 ${
                isSapphire
                  ? 'bg-[#0c1a38] border-amber-500/30 text-white hover:border-amber-400/60 shadow-blue-950/40'
                  : isEmerald
                    ? 'bg-[#0d2b23] border-emerald-800/50 text-white shadow-emerald-950/20'
                    : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
              }`}
            >
              {/* Image Frame - Clickable to open route */}
              <div 
                onClick={() => onSelectDestination(item)}
                className="relative aspect-[4/3] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.imageAlt || `${item.title} - ${item.location} tour for Indian travelers | Zentrevo`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md ${item.tagColor}`}>
                    {item.location}
                  </span>
                </div>

                {/* Duration Tag */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-black/60 text-white backdrop-blur-md">
                    {item.duration}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                  <span className="opacity-75">({item.reviews} {t('common.reviews', 'reviews')})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-600'
                    }`}>
                      {item.badge}
                    </span>
                    <span className="text-lg font-bold">
                      {formatPrice(item.price)}
                      <span className={`text-xs font-medium ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}> {t('destinations.perGuest')}</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectDestination(item)}
                    className={`${isEditorial ? 'font-editorial font-medium' : 'font-sans font-bold'} text-xl mb-3 leading-snug group-hover:text-amber-400 transition-colors cursor-pointer`}
                  >
                    {item.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-6 line-clamp-2 ${
                    isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Card Action Row */}
                <div className="pt-4 border-t border-stone-200/15 flex items-center justify-between">
                  <span className={`text-xs font-medium flex items-center gap-1.5 ${
                    isSapphire ? 'text-amber-300/80' : isEmerald ? 'text-emerald-300/80' : 'text-stone-600'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('destinations.conciergeIncluded')}</span>
                  </span>

                  <button
                    onClick={() => onSelectDestination(item)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isSapphire
                        ? 'bg-[#081226] hover:bg-amber-400 hover:text-stone-950 text-amber-200 border border-amber-500/40'
                        : isEmerald
                          ? 'bg-emerald-900/60 hover:bg-emerald-400 hover:text-stone-950 text-emerald-200 border border-emerald-700/50'
                          : 'bg-stone-100 hover:bg-stone-950 hover:text-white text-stone-800 border border-stone-200'
                    }`}
                  >
                    <span>{t('destinations.viewJourney', 'View Journey')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Expeditions CTA */}
        {filteredDestinations.length > visibleCount && (
          <div className="mt-14 flex flex-col items-center justify-center gap-3 animate-fadeIn">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className={`group px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-300 shadow-md cursor-pointer hover:-translate-y-0.5 ${
                isSapphire
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-300 hover:to-amber-400'
                  : isEmerald
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-stone-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-300'
                    : 'bg-stone-950 text-white shadow-stone-900/20 hover:bg-stone-800'
              }`}
            >
              <span>{t('destinations.viewMore', 'View More Expeditions')}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSapphire || isEmerald ? 'bg-stone-950/20 text-stone-950' : 'bg-white/20 text-white'
              }`}>
                +{Math.min(9, filteredDestinations.length - visibleCount)}
              </span>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <p className={`text-xs ${isSapphire || isEmerald ? 'text-stone-400' : 'text-stone-500'}`}>
              {t('destinations.showingCount', 'Showing')} <span className="font-semibold">{displayedDestinations.length}</span> {t('destinations.ofTotal', 'of')} <span className="font-semibold">{filteredDestinations.length}</span> {t('destinations.curatedJourneys', 'curated journeys')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
