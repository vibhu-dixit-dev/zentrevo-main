import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';

export default function Navbar({ currentTheme, onToggleTheme, onOpenInquiry }) {
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

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 transition-all duration-300">
      <div 
        className={`max-w-7xl mx-auto rounded-full px-5 sm:px-7 py-3 transition-all duration-300 flex items-center justify-between shadow-lg ${
          isEmerald 
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
            isEmerald ? 'bg-emerald-500 text-[#0d2b23]' : 'bg-stone-950 text-white'
          }`}>
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-xl tracking-wider font-semibold uppercase leading-none">
              Zentrevo
            </span>
            <span className={`text-[9px] tracking-widest uppercase font-medium mt-0.5 ${
              isEmerald ? 'text-emerald-300/80' : 'text-stone-400'
            }`}>
              Curated Journeys
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a 
            href="#destinations" 
            className={`transition-colors hover:${isEmerald ? 'text-emerald-400' : 'text-stone-950'} ${
              isEmerald ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Destinations
          </a>
          <a 
            href="#values" 
            className={`transition-colors hover:${isEmerald ? 'text-emerald-400' : 'text-stone-950'} ${
              isEmerald ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Our Values
          </a>
          <a 
            href="#experiences" 
            className={`transition-colors hover:${isEmerald ? 'text-emerald-400' : 'text-stone-950'} ${
              isEmerald ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Experiences
          </a>
          <a 
            href="#stories" 
            className={`transition-colors hover:${isEmerald ? 'text-emerald-400' : 'text-stone-950'} ${
              isEmerald ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Stories
          </a>
          <a 
            href="#inquiry" 
            className={`transition-colors hover:${isEmerald ? 'text-emerald-400' : 'text-stone-950'} ${
              isEmerald ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Bookings
          </a>
        </nav>

        {/* Actions & Theme Switcher */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
              isEmerald
                ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/80 hover:border-emerald-500'
                : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
            }`}
            title="Switch UI Theme Template"
          >
            {isEmerald ? (
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
              isEmerald
                ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 hover:shadow-emerald-500/25'
                : 'bg-stone-950 text-white hover:bg-stone-800 hover:shadow-stone-900/25'
            }`}
          >
            <span>Plan Journey</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
              isEmerald ? 'bg-stone-950 text-emerald-300' : 'bg-white text-stone-950'
            }`}>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full border text-xs ${
              isEmerald ? 'border-emerald-700 text-emerald-300' : 'border-stone-300 text-stone-700'
            }`}
            title="Toggle Theme"
          >
            {isEmerald ? <Sparkles className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isEmerald ? 'text-stone-200' : 'text-stone-800'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`sm:hidden mt-2 rounded-2xl p-6 shadow-xl border ${
          isEmerald ? 'bg-[#0d2b23] border-emerald-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}>
          <div className="flex flex-col gap-4 text-base font-medium">
            <a 
              href="#destinations" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-stone-200/10"
            >
              Destinations
            </a>
            <a 
              href="#values" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-stone-200/10"
            >
              Our Values
            </a>
            <a 
              href="#experiences" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-stone-200/10"
            >
              Experiences
            </a>
            <a 
              href="#stories" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-stone-200/10"
            >
              Stories
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className={`w-full py-3 rounded-full text-center font-semibold text-sm mt-2 ${
                isEmerald ? 'bg-emerald-400 text-stone-950' : 'bg-stone-950 text-white'
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
