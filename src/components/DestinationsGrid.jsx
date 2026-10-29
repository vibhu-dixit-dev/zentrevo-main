import React, { useState, useEffect } from 'react';
import { destinations, getActiveDestinations } from '../data/travelData';
import { ArrowUpRight, Star, Clock, Sparkles, Crown, Globe2, MapPin, Layers } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function DestinationsGrid({ 
  currentTheme, 
  onSelectDestination,
  selectedRegion = 'all',
  onSelectRegion
}) {
  const { formatPrice } = useCurrency();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentRegion, setCurrentRegion] = useState(selectedRegion || 'all');
  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);

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
    if (selectedRegion) {
      setCurrentRegion(selectedRegion);
    }
  }, [selectedRegion]);

  const handleRegionChange = (region) => {
    setCurrentRegion(region);
    if (onSelectRegion) {
      onSelectRegion(region);
    }
  };

  const categories = ['All', 'Luxury Escapes', 'Cultural', 'Trending', 'Alpine Nature'];

  // Counts for Regional Filters
  const nationalCount = destinationsList.filter(d => (d.region || 'international') === 'national').length;
  const internationalCount = destinationsList.filter(d => (d.region || 'international') === 'international').length;

  // 1. Filter by Region (National vs International vs All)
  const regionFiltered = currentRegion === 'all'
    ? destinationsList
    : destinationsList.filter(d => (d.region || 'international') === currentRegion);

  // 2. Filter by Category
  const filteredDestinations = activeCategory === 'All' 
    ? regionFiltered 
    : regionFiltered.filter(d => d.category === activeCategory);

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
                  <span>Curated Sovereign Escapes</span>
                </div>
              ) : isEmerald ? (
                <div className="text-emerald-400 border-emerald-700/50 bg-emerald-950/40">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                  <span>Curated Expeditions</span>
                </div>
              ) : (
                <div className="text-stone-700 border-stone-200 bg-white">
                  <span>✨ Featured Itineraries</span>
                </div>
              )}
            </div>
            
            <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-3xl sm:text-5xl tracking-tight leading-tight max-w-2xl ${
              isSapphire || isEmerald ? 'text-stone-100' : 'text-stone-900'
            }`}>
              The Most Amazing Travel Packages Every Traveler Dreams Of.
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
                <span>All ({destinationsList.length})</span>
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
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>National ({nationalCount})</span>
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
                <span>International ({internationalCount})</span>
                <span>International</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((item) => (
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
                  <span className="opacity-75">({item.reviews} reviews)</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-500'
                    }`}>
                      {item.badge}
                    </span>
                    <span className="text-lg font-bold">
                      {formatPrice(item.price)}
                      <span className={`text-xs font-normal ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-400'}`}> / guest</span>
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
                    isSapphire ? 'text-amber-300/80' : isEmerald ? 'text-emerald-300/80' : 'text-stone-500'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Includes Private Concierge</span>
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
                    <span>View Itinerary</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
