import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  Star, 
  Compass, 
  Send,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getActiveDestinations } from '../data/travelData';
import { getUnifiedIndiaMapDestinations } from '../data/indiaCityGeoResolver';
import { 
  INDIA_VIEWBOX, 
  INDIA_MAINLAND_PATH, 
  INDIA_STATE_PATHS, 
  INDIA_ISLAND_PATHS 
} from '../data/indiaVectorPaths';

export default function IndiaInteractiveMap({ 
  onSelectDestinationById, 
  onRequestCustomTrip 
}) {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // Live synchronisation with active destinations from admin portal
  const [activeTrips, setActiveTrips] = useState(getActiveDestinations);

  useEffect(() => {
    const handleSync = () => {
      setActiveTrips(getActiveDestinations());
    };
    window.addEventListener('zentrevo_destinations_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('zentrevo_destinations_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Pointers correspond strictly to the cards given in the portal
  const allDestinations = useMemo(() => {
    return getUnifiedIndiaMapDestinations(activeTrips);
  }, [activeTrips]);

  const displayedDestinations = allDestinations;

  // Only set when explicitly hovered or selected (null by default)
  const activeDestination = allDestinations.find(
    d => d.id === (hoveredPlaceId || selectedPlaceId)
  ) || null;

  const handlePointClick = (dest) => {
    if (selectedPlaceId === dest.id) {
      setSelectedPlaceId(null);
    } else {
      setSelectedPlaceId(dest.id);
    }
  };

  const handleMouseEnterPin = (destId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredPlaceId(destId);
  };

  const handleMouseLeavePin = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPlaceId(null);
    }, 120);
  };

  const handleMouseEnterCard = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleMouseLeaveCard = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPlaceId(null);
    }, 120);
  };

  const handleCloseCard = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setSelectedPlaceId(null);
    setHoveredPlaceId(null);
  };

  const handleActionClick = (dest) => {
    if (dest.isAvailableOnPortal && dest.destinationId && onSelectDestinationById) {
      onSelectDestinationById(dest.destinationId);
    } else if (onRequestCustomTrip) {
      onRequestCustomTrip(dest.name);
    }
  };

  // Compute percentage coordinates for anchoring the floating popup
  const getPopupStyle = (dest) => {
    if (!dest) return {};
    const leftPct = (dest.mapX / 1486) * 100;
    const topPct = (dest.mapY / 1734) * 100;

    const style = {};

    // Vertical placement
    if (topPct > 55) {
      // Place above the pin
      style.bottom = `${Math.max(4, 100 - topPct + 3)}%`;
    } else {
      // Place below the pin
      style.top = `${Math.min(75, topPct + 3)}%`;
    }

    // Horizontal placement
    if (leftPct > 65) {
      style.right = `${Math.max(3, 100 - leftPct - 10)}%`;
    } else if (leftPct < 35) {
      style.left = `${Math.max(3, leftPct - 5)}%`;
    } else {
      style.left = `${leftPct}%`;
      style.transform = 'translateX(-50%)';
    }

    return style;
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/30 backdrop-blur-2xl transition-all duration-300 shadow-2xl p-3 sm:p-5 mb-8 bg-[#070d19] text-stone-100 max-w-4xl mx-auto">
      
      {/* Ambient Cartography Glow Effects */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Filter Controls - Compact & Centered */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 bg-amber-400/15 text-amber-300 border border-amber-500/40">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>{t('indiaMap.badge', 'Official Surveyor Cartography')}</span>
          </div>
          <h2 className="font-editorial text-lg sm:text-2xl font-bold tracking-tight text-stone-50">
            {t('indiaMap.heading', 'The Sovereign Map of India')}
          </h2>
        </div>

        {/* Live Card Counter Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-amber-500/30 bg-[#0a1428]/90 backdrop-blur-md self-start sm:self-auto shadow-inner">
          <div className="px-3.5 py-1 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{allDestinations.length} {t('indiaMap.curatedPortfolios', 'Curated Portfolios')}</span>
          </div>
        </div>
      </div>

      {/* Main Map Presentation - Majestic, Clean & Centered (No empty side panel!) */}
      <div 
        onClick={() => { setSelectedPlaceId(null); setHoveredPlaceId(null); }}
        className="relative flex flex-col items-center justify-between rounded-2xl p-2.5 sm:p-4 border border-amber-500/30 bg-[#060c18] overflow-hidden shadow-2xl w-full cursor-default"
      >
        
        {/* Subtle Topographic Radial Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1c3a] via-[#070e1c] to-[#040812] opacity-90 pointer-events-none" />
        
        {/* Architectural Blueprint Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* SVG Container: Scaled so full map comfortably fits in one screen without scrolling */}
        <div className="relative w-full max-w-[430px] sm:max-w-[480px] max-h-[50vh] sm:max-h-[54vh] aspect-[1486/1734] mx-auto py-1 flex items-center justify-center">
          <svg 
            viewBox={INDIA_VIEWBOX} 
            className="w-full h-full drop-shadow-[0_0_24px_rgba(212,175,55,0.18)] select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Midnight Land Gradient */}
              <linearGradient id="indiaLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c1834" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#081226" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#050a16" stopOpacity="0.98" />
              </linearGradient>

              {/* Golden Glow Filter */}
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Pin Beacon Glow */}
              <filter id="pinBeaconGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Official India Mainland Silhouette (True Surveyor Path) */}
            <path 
              d={INDIA_MAINLAND_PATH} 
              fill="url(#indiaLandGradient)" 
              stroke="#d4af37" 
              strokeWidth="3.5" 
              strokeLinejoin="round" 
              strokeLinecap="round"
              filter="url(#goldGlow)"
            />

            {/* 2. Inner Golden Border Contour Line (Dual-line Cartography Accent) */}
            <path 
              d={INDIA_MAINLAND_PATH} 
              fill="none" 
              stroke="#f5c858" 
              strokeWidth="1" 
              strokeOpacity="0.6"
              strokeLinejoin="round" 
            />

            {/* 3. Official Internal State Boundaries (No connecting highway/river lines) */}
            <g fill="none" stroke="#a6832a" strokeWidth="1.2" strokeOpacity="0.38" strokeLinejoin="round">
              {INDIA_STATE_PATHS.map((pathD, idx) => (
                <path key={idx} d={pathD} />
              ))}
            </g>

            {/* 4. Official Island Archipelagos (Andaman & Nicobar, Lakshadweep) */}
            <g fill="url(#indiaLandGradient)" stroke="#d4af37" strokeWidth="2.2" filter="url(#goldGlow)">
              {INDIA_ISLAND_PATHS.map((pathD, idx) => (
                <path key={idx} d={pathD} />
              ))}
            </g>

            {/* 5. Clean Pins with Generous Hit Area (Zero Flickering, No Ping Animation) */}
            {displayedDestinations.map((dest) => {
              const isHovered = hoveredPlaceId === dest.id;
              const isSelected = selectedPlaceId === dest.id;
              const isActive = isHovered || isSelected;
              const isAvail = dest.isAvailableOnPortal;

              return (
                <g 
                  key={dest.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePointClick(dest);
                  }}
                  onMouseEnter={() => handleMouseEnterPin(dest.id)}
                  onMouseLeave={handleMouseLeavePin}
                >
                  {/* Generous Invisible Hit Target Circle (90px target area prevents any cursor-leave flicker) */}
                  <circle 
                    cx={dest.mapX} 
                    cy={dest.mapY} 
                    r="45" 
                    fill="transparent" 
                    stroke="transparent"
                  />

                  {/* Outer Glowing Ring (Static, Clean - No Ping Animation) */}
                  <circle 
                    cx={dest.mapX} 
                    cy={dest.mapY} 
                    r={isActive ? "28" : "18"} 
                    pointerEvents="none"
                    className={`transition-all duration-200 ${
                      isAvail 
                        ? isActive 
                          ? 'fill-emerald-400/40 stroke-emerald-300' 
                          : 'fill-emerald-400/20 stroke-emerald-400/70'
                        : isActive 
                          ? 'fill-amber-400/40 stroke-amber-300' 
                          : 'fill-amber-400/20 stroke-amber-400/70'
                    }`}
                    strokeWidth={isActive ? "3.5" : "2.2"}
                    filter="url(#pinBeaconGlow)"
                  />

                  {/* Pin Core Ring */}
                  <circle 
                    cx={dest.mapX} 
                    cy={dest.mapY} 
                    r={isActive ? "13" : "10"} 
                    pointerEvents="none"
                    className={isAvail ? 'fill-emerald-500 stroke-stone-950' : 'fill-amber-500 stroke-stone-950'}
                    strokeWidth="2"
                  />

                  {/* Center Pure White Dot */}
                  <circle 
                    cx={dest.mapX} 
                    cy={dest.mapY} 
                    r={isActive ? "5.5" : "4"} 
                    pointerEvents="none"
                    fill="#ffffff" 
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Compact Pop-up Card right near the hovered/selected pin */}
          {activeDestination && (
            <div 
              style={getPopupStyle(activeDestination)}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={handleMouseEnterCard}
              onMouseLeave={handleMouseLeaveCard}
              className="absolute z-30 w-60 sm:w-64 rounded-2xl p-2.5 sm:p-3 border border-amber-500/50 bg-[#09152b]/95 text-white shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_20px_rgba(212,175,55,0.25)] backdrop-blur-xl transition-all duration-200 animate-fadeIn pointer-events-auto"
            >
              {/* Close Button & State Header */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 flex items-center gap-1 font-semibold truncate">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{activeDestination.state}</span>
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {activeDestination.isAvailableOnPortal ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                      <span>{t('indiaMap.readyLabel', 'Ready')}</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{t('indiaMap.bespokeLabel', 'Bespoke')}</span>
                    </span>
                  )}

                  <button
                    onClick={handleCloseCard}
                    className="p-0.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title={t('modal.close', 'Close')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Compact Thumbnail Photo */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2 group shadow-md border border-amber-500/25">
                <img 
                  src={activeDestination.image} 
                  alt={activeDestination.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-transparent to-transparent" />
                
                <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between text-white">
                  <span className="text-[8.5px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#060c18]/80 border border-amber-400/40 text-amber-300">
                    {activeDestination.badge}
                  </span>

                  <div className="flex items-center gap-0.5 text-[10px] font-semibold bg-[#060c18]/90 px-1.5 py-0.5 rounded-md border border-amber-400/40 text-amber-300">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{activeDestination.rating}</span>
                  </div>
                </div>
              </div>

              {/* Destination Title */}
              <h4 className="text-xs sm:text-sm font-editorial font-bold leading-tight text-stone-50 line-clamp-1 mb-1">
                {activeDestination.name}
              </h4>

              {/* Meta Price & Action Button */}
              <div className="pt-1.5 border-t border-amber-500/20 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs sm:text-sm font-bold font-editorial text-amber-300 block">
                    {formatPrice(activeDestination.price)}
                  </span>
                </div>

                {activeDestination.isAvailableOnPortal ? (
                  <button
                    onClick={() => handleActionClick(activeDestination)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('indiaMap.viewJourneyBtn', 'View Journey')}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleActionClick(activeDestination)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-2.5 h-2.5" />
                    <span>{t('indiaMap.requestTripBtn', 'Request Trip')}</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Bottom Luxury Poster Typography Block (Default: INDIA; On Hover: Specific City) */}
        <div className="relative z-10 w-full pt-2.5 pb-1 border-t border-amber-500/20 flex flex-col items-center text-center">
          {/* Bold Spaced City/Subcontinent Title */}
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl tracking-[0.35em] sm:tracking-[0.45em] text-[#f4cb63] drop-shadow-[0_2px_10px_rgba(244,203,99,0.3)] transition-all duration-300">
            {activeDestination ? activeDestination.shortTitle : 'I N D I A'}
          </h3>

          {/* Delicate Golden Divider Rule */}
          <div className="w-24 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#e6bc4d] to-transparent my-1.5" />

          {/* Country / State Label */}
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-amber-200/90 font-medium">
            {activeDestination ? `INDIA • ${activeDestination.state.toUpperCase()}` : t('indiaMap.subcontinentSubtitle', 'THE SOVEREIGN SUBCONTINENT')}
          </span>

          {/* Monospace GPS Coordinates */}
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-amber-400/80 mt-0.5">
            {activeDestination ? activeDestination.coordinates : '20.5937° N / 78.9629° E'}
          </span>

          {/* Subtle Corner Attributions */}
          <div className="w-full flex items-center justify-between text-[8px] font-mono tracking-wider text-amber-400/40 mt-1.5 pt-1 border-t border-amber-500/10 px-1">
            <span>© zentrevo.in</span>
            <span className="hidden sm:inline">{t('indiaMap.cartographySuite', 'THE SOVEREIGN CARTOGRAPHY SUITE')}</span>
            <span>© OpenStreetMap contributors</span>
          </div>
        </div>

      </div>

      {/* Quick-select Destination Carousel / Strip at the Bottom */}
      <div className="relative z-10 mt-3 pt-2 border-t border-amber-500/20 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider font-bold text-amber-400">
          <span>{t('indiaMap.selectRegionTitle', 'All Sovereign Indian Places')}</span>
          <span>{displayedDestinations.length} {t('indiaMap.locationsLabel', 'Locations')}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {displayedDestinations.map(d => {
            const isSelected = activeDestination && activeDestination.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedPlaceId(d.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-400 shadow-md font-bold'
                    : 'bg-[#09152b] hover:bg-[#0e2145] text-stone-200 border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${d.isAvailableOnPortal ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{d.name.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
