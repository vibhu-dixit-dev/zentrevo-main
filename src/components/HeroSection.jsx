import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ArrowUpRight, ArrowRight, Play, Plane, CheckCircle2, ChevronDown, Crown, Sparkles, X } from 'lucide-react';

export default function HeroSection({ currentTheme, onSelectDestination, onSearchFilter, onOpenInquiry }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  // Search State
  const [selectedLocation, setSelectedLocation] = useState('Select Destination');
  const [selectedDate, setSelectedDate] = useState('Oct 28 - Nov 4, 2026');
  const [selectedGuests, setSelectedGuests] = useState('Select Travelers');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.search-dropdown-menu')) {
        setLocationDropdownOpen(false);
        setGuestsDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Carousel slide for the cut-corner card in Template 3
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHeroCardDismissed, setIsHeroCardDismissed] = useState(false);

  const heroCuratedSlides = [
    {
      index: "01",
      tag: "(FIRST)",
      title: "Explore our curated list of must-visit destinations around the globe.",
      destination: "Swiss Alpine Glacier Express",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
    },
    {
      index: "02",
      tag: "(PRESENT)",
      title: "Private cliffside villa retreats and yacht voyages along Amalfi clifftops.",
      destination: "Amalfi Coast & Positano",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
    },
    {
      index: "03",
      tag: "(SIGNATURE)",
      title: "Dawn balloon ascents across the fairy chimney valleys of Cappadocia.",
      destination: "Cappadocia Balloon Valley",
      image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroCuratedSlides.length);
  };

  const handleSearchClick = () => {
    if (onSearchFilter) {
      onSearchFilter({
        location: selectedLocation,
        date: selectedDate,
        guests: selectedGuests
      });
    }
    const destEl = document.getElementById('destinations');
    if (destEl) {
      destEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlide = heroCuratedSlides[currentSlideIndex];

  return (
    <section className="relative px-3 sm:px-6 lg:px-8 pt-2 pb-12">
      {/* Outer Framed Canvas (Without overflow-hidden on outer container so dropdown can extend outside freely) */}
      <div 
        className={`relative max-w-7xl mx-auto rounded-[32px] sm:rounded-[40px] transition-all duration-700 border shadow-2xl ${
          isSapphire
            ? 'bg-[#0a142c] border-amber-500/30 text-white shadow-blue-950/50'
            : isEmerald 
              ? 'bg-[#0d2b23] border-emerald-900/60 text-white shadow-emerald-950/40' 
              : 'bg-stone-50 border-stone-200/90 text-stone-900 shadow-stone-300/40'
        }`}
      >
        {/* Background Atmosphere (Clipped cleanly to rounded corners on its own layer) */}
        <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] overflow-hidden pointer-events-none z-0">
          {isSapphire ? (
            /* Royal Sapphire Theme: Midnight Navy Gradient with Gold Star Atmosphere - Clearly visible coastal mountains */
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-[#060e20]/75 via-[#0b1733]/60 to-[#040813]/85 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80" 
                alt="Zentrevo luxury tropical coast and ocean voyage for Indian travelers" 
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover opacity-55 filter saturate-130 contrast-110"
              />
              {/* Constellation navigation lines */}
              <svg className="absolute inset-0 w-full h-full z-10 opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100,200 L 350,140 L 700,220 L 1100,100" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 6" />
                <circle cx="350" cy="140" r="3" fill="#f59e0b" />
                <circle cx="700" cy="220" r="3" fill="#f59e0b" />
                <circle cx="1100" cy="100" r="4" fill="#fbbf24" />
              </svg>
            </div>
          ) : isEmerald ? (
            /* Emerald Theme: Deep forest atmospheric gradient & flight path - Clearly visible alpine peaks */
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a241d]/75 via-[#0d2b23]/60 to-[#061813]/85 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80" 
                alt="Zentrevo alpine expedition and scenic mountain panorama" 
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover opacity-55 filter saturate-135 contrast-115"
              />
              <svg className="absolute inset-0 w-full h-full z-10 opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50,300 Q 400,100 800,280 T 1200,150" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="6 6" />
              </svg>
            </div>
          ) : (
            /* Editorial Theme: Balanced misty mountain and pine forest backdrop */
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/55 to-stone-100/65 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" 
                alt="Zentrevo bespoke valley and mountain landscape itinerary" 
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover opacity-45 filter grayscale contrast-105"
              />
            </div>
          )}
        </div>

        {/* Inner Hero Content Grid */}
        <div className="relative z-20 px-6 sm:px-12 lg:px-16 pt-10 sm:pt-14 pb-6 sm:pb-8">
          {/* Top Tag & Flight Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border backdrop-blur-md shadow-sm transition-all">
              {isSapphire ? (
                <div className="flex items-center gap-2 text-amber-300 border-amber-500/40 bg-[#061025]/60">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Royal Sovereign Expeditions • Curated Heritage & Trust</span>
                </div>
              ) : isEmerald ? (
                <div className="flex items-center gap-2 text-emerald-300 border-emerald-700/50 bg-emerald-950/40">
                  <Plane className="w-3.5 h-3.5 text-emerald-400 rotate-45" />
                  <span>Bespoke Journeys • Summer / Autumn 2026</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-stone-700 border-stone-200 bg-white/80">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Handcrafted Private Expeditions</span>
                </div>
              )}
            </div>

            {/* Template 2 Proof Counter: 20k+ Happy Travelers */}
            <div className={`hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-medium ${
              isSapphire 
                ? 'bg-[#091530]/60 border-amber-500/30 text-stone-200' 
                : isEmerald 
                  ? 'bg-emerald-900/30 border-emerald-700/30 text-stone-200' 
                  : 'bg-white/80 border-stone-200 text-stone-800'
            }`}>
              <div className="flex -space-x-2">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-amber-400 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Zentrevo traveler" loading="lazy" decoding="async" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-amber-400 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Zentrevo traveler" loading="lazy" decoding="async" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-amber-400 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Zentrevo traveler" loading="lazy" decoding="async" />
              </div>
              <span className="font-semibold">One Planner • One WhatsApp Chat</span>
            </div>
          </div>

          {/* Main Hero Header Headline */}
          <div className="max-w-3xl">
            {isSapphire ? (
              /* Royal Sapphire Headline */
              <>
                <p className="text-amber-400 font-semibold tracking-widest text-xs uppercase mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-amber-400"></span>
                  <span>Prestige • Security • Heritage</span>
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
                  Your Journey To <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
                    Timeless Prestige & Wonder
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
                  Experience bespoke royal retreats, private aviation, and centuries of architectural grandeur curated with unshakeable confidence and trust.
                </p>
              </>
            ) : isEmerald ? (
              /* Breezio Style Headline */
              <>
                <p className="text-emerald-400 font-semibold tracking-widest text-xs uppercase mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-emerald-400"></span>
                  <span>Relax • Travel • Reconnect</span>
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
                  Your Journey To <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white">
                    Peace Begins Here
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-emerald-100/80 max-w-xl font-normal leading-relaxed mb-8">
                  Plan your perfect escape with handpicked sanctuaries, private charters, and stress-free bespoke itineraries worldwide.
                </p>
              </>
            ) : (
              /* Travelio & Travel Style Editorial Headline */
              <>
                <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-stone-900 leading-[1.1] mb-6">
                  Your Journey To The World's <br />
                  <span className="inline-flex items-center gap-3">
                    Best
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-2xl bg-stone-900 text-white text-xs font-sans align-middle shadow-md border border-stone-700">
                      🏔️ World Heritage
                    </span>
                    Destinations
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed mb-8">
                  Immerse yourself in authentic cultural wonders, alpine horizons, and private journeys designed with architectural perfection.
                </p>
              </>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={onOpenInquiry}
                className={`group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all shadow-xl cursor-pointer ${
                  isSapphire
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 hover:shadow-amber-500/30'
                    : isEmerald
                      ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 hover:shadow-emerald-500/30'
                      : 'bg-stone-950 text-white hover:bg-stone-800 hover:shadow-stone-900/30'
                }`}
              >
                <span>Join With Us</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 ${
                  isSapphire 
                    ? 'bg-stone-950 text-amber-300' 
                    : isEmerald 
                      ? 'bg-stone-950 text-emerald-300' 
                      : 'bg-white text-stone-950'
                }`}>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>

              <a 
                href="#stories"
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold transition-all border backdrop-blur-md ${
                  isSapphire
                    ? 'bg-[#091530]/60 border-amber-500/30 text-amber-200 hover:bg-[#0f214a]'
                    : isEmerald
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200 hover:bg-emerald-900/60'
                      : 'bg-white/80 border-stone-300 text-stone-800 hover:bg-white hover:border-stone-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isSapphire ? 'bg-amber-400/20 text-amber-400' : isEmerald ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-200 text-stone-900'
                }`}>
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Travel Story Video</span>
              </a>
            </div>
          </div>

          {/* Floating Chamfer Cut-Corner Card (Template 3 Signature Component) */}
          {!isHeroCardDismissed && (
            <div className="hidden lg:block absolute bottom-12 right-12 w-96 z-30 transition-all duration-300 animate-fadeIn">
              <div 
                className={`p-7 rounded-3xl transition-all duration-300 shadow-2xl relative border ${
                  isSapphire
                    ? 'bg-[#0c1a38]/95 border-amber-500/35 text-white backdrop-blur-xl'
                    : isEmerald 
                      ? 'bg-[#0f342a]/95 border-emerald-600/30 text-white backdrop-blur-xl' 
                      : 'bg-white border-stone-200 text-stone-900 shadow-stone-300/60'
                }`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 36px) 0, 100% 36px, 100% 100%, 0 100%)'
                }}
              >
                {/* Top-Right Dismiss Button */}
                <button 
                  onClick={() => setIsHeroCardDismissed(true)}
                  className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm ${
                    isSapphire 
                      ? 'bg-white/10 hover:bg-white/25 text-stone-300 hover:text-white border border-white/10' 
                      : isEmerald 
                        ? 'bg-white/10 hover:bg-white/25 text-stone-300 hover:text-white border border-white/10' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 border border-stone-200/80'
                  }`}
                  title="Dismiss Card (reappears on page refresh)"
                  aria-label="Dismiss Card"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                    isSapphire ? 'bg-amber-500/20 text-amber-300' : isEmerald ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {currentSlide.destination}
                  </span>
                </div>

                <p className="text-sm font-medium leading-snug mb-6 pr-6">
                  "{currentSlide.title}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200/20 text-xs font-mono tracking-wider">
                  <div className="flex items-center gap-3">
                    <span className={currentSlideIndex === 0 ? 'font-bold opacity-100' : 'opacity-40'}>
                      (FIRST)
                    </span>
                    <span className={currentSlideIndex !== 0 ? `font-bold opacity-100 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}` : 'opacity-40'}>
                      (PRESENT)
                    </span>
                  </div>
                  
                  {/* Bottom-Right Pagination Index & Next Slide Arrow */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm">{currentSlide.index}</span>
                    <button 
                      onClick={handleNextSlide}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-md ${
                        isSapphire 
                          ? 'bg-amber-400 text-stone-950 hover:bg-amber-300' 
                          : isEmerald 
                            ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300' 
                            : 'bg-stone-950 text-white hover:bg-stone-800'
                      }`}
                      title="Next Featured Destination"
                      aria-label="Next Featured Destination"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Integrated Quick Search Bar (Template 1 Travelio Bar) - Positioned safely inside the hero card */}
        <div className="relative z-30 px-4 sm:px-8 max-w-5xl mx-auto pb-8 sm:pb-10 search-dropdown-menu">
          <div 
            className={`rounded-3xl p-3 sm:p-4 shadow-2xl transition-all duration-300 border flex flex-col md:flex-row items-center gap-3 ${
            isSapphire
              ? 'bg-[#081226]/95 backdrop-blur-xl border-amber-500/35 text-white shadow-blue-950/60'
              : isEmerald 
                ? 'bg-[#0a241d]/95 backdrop-blur-xl border-emerald-700/50 text-white shadow-emerald-950/60' 
                : 'bg-white/95 backdrop-blur-xl border-stone-200/90 text-stone-900 shadow-xl'
          }`}
        >
          {/* Field 1: Location */}
          <div className="relative w-full md:w-1/3 px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
               onClick={() => {
                 setLocationDropdownOpen(!locationDropdownOpen);
                 setGuestsDropdownOpen(false);
               }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <MapPin className={`w-3.5 h-3.5 ${isSapphire ? 'text-amber-400' : 'text-emerald-500'}`} />
              <span>Destination</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm truncate ${selectedLocation === 'Select Destination' ? 'text-stone-400 font-normal' : 'font-medium'}`}>
                {selectedLocation}
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${locationDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </div>

            <div className={`absolute top-full left-0 mt-3 w-72 rounded-2xl p-2 shadow-2xl z-50 border max-h-60 overflow-y-auto backdrop-blur-xl transition-all duration-200 ease-out origin-top ${
              locationDropdownOpen 
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            } ${
              isSapphire ? 'bg-[#0c1a38]/98 border-amber-500/40 text-stone-100 shadow-blue-950/90' : isEmerald ? 'bg-[#0d2b23]/98 border-emerald-800 text-stone-100 shadow-emerald-950/90' : 'bg-white/98 border-stone-200 text-stone-900 shadow-2xl'
            }`}>
              {['Select Destination', 'Italy (Amalfi Coast)', 'Japan (Kyoto)', 'Switzerland (Glacier Express)', 'Turkey (Cappadocia)', 'Bali (Uluwatu & Ubud)', 'Iceland (Aurora Wilderness)'].map(loc => (
                <button
                  key={loc}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(loc);
                    setLocationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    selectedLocation === loc
                      ? isSapphire
                        ? 'bg-amber-400/20 text-amber-300 font-semibold'
                        : isEmerald
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'bg-stone-900 text-white font-semibold'
                      : isSapphire || isEmerald
                        ? 'hover:bg-white/10 text-stone-200'
                        : 'hover:bg-stone-100 text-stone-800'
                  } ${loc === 'Select Destination' ? 'italic text-stone-400 font-normal' : ''}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block h-10 w-px bg-stone-300/40" />

          {/* Field 2: Date */}
          <div className="w-full md:w-1/3 px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <Calendar className={`w-3.5 h-3.5 ${isSapphire ? 'text-amber-400' : 'text-emerald-500'}`} />
              <span>Travel Dates</span>
            </div>
            <input 
              type="text" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-transparent text-sm font-medium focus:outline-none mt-1"
              placeholder="Select date range"
            />
          </div>

          <div className="hidden md:block h-10 w-px bg-stone-300/40" />

          {/* Field 3: Person / Guests */}
          <div className="relative w-full md:w-1/3 px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
               onClick={() => {
                 setGuestsDropdownOpen(!guestsDropdownOpen);
                 setLocationDropdownOpen(false);
               }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <Users className={`w-3.5 h-3.5 ${isSapphire ? 'text-amber-400' : 'text-emerald-500'}`} />
              <span>Travelers</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm truncate ${selectedGuests === 'Select Travelers' ? 'text-stone-400 font-normal' : 'font-medium'}`}>
                {selectedGuests}
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${guestsDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </div>

            <div className={`absolute top-full left-0 mt-3 w-64 rounded-2xl p-2 shadow-2xl z-50 border max-h-60 overflow-y-auto backdrop-blur-xl transition-all duration-200 ease-out origin-top ${
              guestsDropdownOpen 
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            } ${
              isSapphire ? 'bg-[#0c1a38]/98 border-amber-500/40 text-stone-100 shadow-blue-950/90' : isEmerald ? 'bg-[#0d2b23]/98 border-emerald-800 text-stone-100 shadow-emerald-950/90' : 'bg-white/98 border-stone-200 text-stone-900 shadow-2xl'
            }`}>
              {['Select Travelers', '1 Solo Explorer', '2 Guests (Couple)', '3 Guests', '4-6 Family / Private Group'].map(g => (
                <button
                  key={g}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGuests(g);
                    setGuestsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    selectedGuests === g
                      ? isSapphire
                        ? 'bg-amber-400/20 text-amber-300 font-semibold'
                        : isEmerald
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'bg-stone-900 text-white font-semibold'
                      : isSapphire || isEmerald
                        ? 'hover:bg-white/10 text-stone-200'
                        : 'hover:bg-stone-100 text-stone-800'
                  } ${g === 'Select Travelers' ? 'italic text-stone-400 font-normal' : ''}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Search CTA Button */}
          <button
            onClick={handleSearchClick}
            className={`w-full md:w-auto px-8 py-3.5 rounded-2xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg shrink-0 cursor-pointer ${
              isSapphire
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 hover:shadow-amber-500/30'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 hover:shadow-emerald-500/30'
                  : 'bg-stone-950 text-white hover:bg-stone-800 hover:shadow-stone-900/30'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  </section>
);
}
