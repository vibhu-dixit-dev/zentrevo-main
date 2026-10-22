import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Menu, X, ArrowUpRight, Crown, Sun } from 'lucide-react';

export default function Navbar({ currentTheme, onSelectTheme, onOpenInquiry }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  // Cycle through the 3 themes: editorial -> sapphire -> emerald -> editorial
  const handleCycleTheme = () => {
    if (isEditorial) onSelectTheme('sapphire');
    else if (isSapphire) onSelectTheme('emerald');
    else onSelectTheme('editorial');
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 transition-all duration-300">
      <div 
        className={`max-w-7xl mx-auto rounded-full px-5 sm:px-7 py-3 transition-all duration-300 flex items-center justify-between shadow-lg ${
          isSapphire
            ? scrolled 
              ? 'bg-[#0a1329]/95 backdrop-blur-md border border-amber-500/30 text-stone-100 shadow-blue-950/40' 
              : 'bg-[#0f1d3b] border border-amber-500/25 text-stone-100'
            : isEmerald 
              ? scrolled 
                ? 'bg-[#0a241d]/90 backdrop-blur-md border border-emerald-800/40 text-stone-100 shadow-emerald-950/20' 
                : 'bg-[#0d2b23] border border-emerald-900/50 text-stone-100'
              : scrolled 
                ? 'bg-white/90 backdrop-blur-md border border-stone-200/80 text-stone-900 shadow-stone-200/50' 
                : 'bg-white border border-stone-200 text-stone-900'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 ${
            isSapphire 
              ? 'bg-amber-400 text-[#0a1329]'
              : isEmerald 
                ? 'bg-emerald-500 text-[#0d2b23]' 
                : 'bg-stone-950 text-white'
          }`}>
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-xl tracking-wider font-semibold uppercase leading-none">
              Zentrevo
            </span>
            <span className={`text-[9px] tracking-widest uppercase font-medium mt-0.5 ${
              isSapphire ? 'text-amber-300/80' : isEmerald ? 'text-emerald-300/80' : 'text-stone-400'
            }`}>
              Curated Journeys
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a 
            href="#destinations" 
            className={`transition-colors ${
              isSapphire ? 'text-stone-300 hover:text-amber-300' : isEmerald ? 'text-stone-300 hover:text-emerald-400' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Destinations
          </a>
          <a 
            href="#values" 
            className={`transition-colors ${
              isSapphire ? 'text-stone-300 hover:text-amber-300' : isEmerald ? 'text-stone-300 hover:text-emerald-400' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Our Values
          </a>
          <a 
            href="#experiences" 
            className={`transition-colors ${
              isSapphire ? 'text-stone-300 hover:text-amber-300' : isEmerald ? 'text-stone-300 hover:text-emerald-400' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Experiences
          </a>
          <a 
            href="#stories" 
            className={`transition-colors ${
              isSapphire ? 'text-stone-300 hover:text-amber-300' : isEmerald ? 'text-stone-300 hover:text-emerald-400' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Stories
          </a>
          <a 
            href="#inquiry" 
            className={`transition-colors ${
              isSapphire ? 'text-stone-300 hover:text-amber-300' : isEmerald ? 'text-stone-300 hover:text-emerald-400' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Bookings
          </a>
        </nav>

        {/* Actions & Theme Selector */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Quick Cycle Button */}
          <button
            onClick={handleCycleTheme}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
              isSapphire
                ? 'bg-[#060e20] border-amber-500/40 text-amber-300 hover:border-amber-400'
                : isEmerald
                  ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/80 hover:border-emerald-500'
                  : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
            }`}
            title="Cycle Through UI Themes"
          >
            {isSapphire ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Theme: Royal Sapphire</span>
              </>
            ) : isEmerald ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Theme: Emerald Luxe</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse"></span>
                <span>Theme: Editorial Mono</span>
              </>
            )}
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onOpenInquiry}
            className={`group inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md ${
              isSapphire
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 hover:shadow-amber-500/30'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 hover:shadow-emerald-500/25'
                  : 'bg-stone-950 text-white hover:bg-stone-800 hover:shadow-stone-900/25'
            }`}
          >
            <span>Plan Journey</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
              isSapphire 
                ? 'bg-[#0a1329] text-amber-300' 
                : isEmerald 
                  ? 'bg-stone-950 text-emerald-300' 
                  : 'bg-white text-stone-950'
            }`}>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={handleCycleTheme}
            className={`p-2 rounded-full border text-xs ${
              isSapphire ? 'border-amber-500/40 text-amber-300' : isEmerald ? 'border-emerald-700 text-emerald-300' : 'border-stone-300 text-stone-700'
            }`}
            title="Toggle Theme"
          >
            {isSapphire ? <Crown className="w-4 h-4" /> : isEmerald ? <Sparkles className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isSapphire || isEmerald ? 'text-stone-200' : 'text-stone-800'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`sm:hidden mt-2 rounded-2xl p-6 shadow-xl border ${
          isSapphire 
            ? 'bg-[#0f1d3b] border-amber-500/30 text-stone-100'
            : isEmerald 
              ? 'bg-[#0d2b23] border-emerald-800 text-stone-100' 
              : 'bg-white border-stone-200 text-stone-900'
        }`}>
          <div className="flex flex-col gap-4 text-base font-medium">
            <a href="#destinations" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-stone-200/10">Destinations</a>
            <a href="#values" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-stone-200/10">Our Values</a>
            <a href="#experiences" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-stone-200/10">Experiences</a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)} className="py-1 border-b border-stone-200/10">Stories</a>
            
            {/* Theme selector in mobile drawer */}
            <div className="py-2 flex items-center justify-between border-t border-stone-200/15 pt-3">
              <span className="text-xs uppercase text-stone-400 font-bold">Theme</span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => { onSelectTheme('editorial'); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isEditorial ? 'bg-stone-950 text-white' : 'bg-stone-200 text-stone-800'}`}>
                  Mono
                </button>
                <button 
                  onClick={() => { onSelectTheme('sapphire'); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isSapphire ? 'bg-amber-400 text-stone-950' : 'bg-slate-800 text-amber-200'}`}>
                  Sapphire
                </button>
                <button 
                  onClick={() => { onSelectTheme('emerald'); setMobileMenuOpen(false); }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isEmerald ? 'bg-emerald-400 text-stone-950' : 'bg-emerald-950 text-emerald-200'}`}>
                  Emerald
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className={`w-full py-3 rounded-full text-center font-semibold text-sm mt-2 ${
                isSapphire ? 'bg-amber-400 text-stone-950' : isEmerald ? 'bg-emerald-400 text-stone-950' : 'bg-stone-950 text-white'
              }`}
            >
              Get In Touch & Book
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
