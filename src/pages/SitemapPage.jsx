import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, MapPin, Globe, BookOpen, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { getActiveDestinations, blogArticles, syncDestinationsFromCloud, syncBlogArticlesFromCloud } from '../data/travelData';
import { getDestinationSlug, getBlogSlug } from '../lib/seoRoutes';
import { useLanguage } from '../context/LanguageContext';

export default function SitemapPage({ onNavigateHome, onNavigate, currentTheme = 'editorial' }) {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState(() => getActiveDestinations());
  const [blogs, setBlogs] = useState(() => blogArticles);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "HTML Sitemap & Navigation Index | Zentrevo Curated Journeys";

    // Sync live from cloud storage/Supabase to guarantee 100% freshness
    let isMounted = true;
    syncDestinationsFromCloud().then(() => {
      if (isMounted) setDestinations(getActiveDestinations());
    });
    syncBlogArticlesFromCloud().then(() => {
      if (isMounted) setBlogs(blogArticles);
    });

    const handleBlogsUpdated = () => {
      if (isMounted) setBlogs([...blogArticles]);
    };
    window.addEventListener('zentrevo_blogs_updated', handleBlogsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('zentrevo_blogs_updated', handleBlogsUpdated);
    };
  }, []);

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  const handleLinkClick = (path) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nationalDestinations = destinations.filter(d => 
    d.category === 'national' || d.region === 'national' || (d.location && d.location.toLowerCase().includes('india'))
  );

  const internationalDestinations = destinations.filter(d => 
    d.category !== 'national' && d.region !== 'national' && (!d.location || !d.location.toLowerCase().includes('india'))
  );

  return (
    <div className={`min-h-screen font-sans-clean transition-colors duration-500 ${
      isSapphire 
        ? 'bg-[#050a16] text-stone-100' 
        : isEmerald 
          ? 'bg-[#061813] text-stone-100' 
          : 'bg-[#faf9f6] text-stone-900'
    }`}>
      {/* Top Navigation */}
      <header className={`sticky top-0 z-40 px-4 sm:px-8 py-4 backdrop-blur-xl border-b transition-colors ${
        isDark 
          ? 'bg-black/60 border-white/10 text-white' 
          : 'bg-white/95 border-stone-200 text-stone-900 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            onClick={onNavigateHome}
            className="flex items-center cursor-pointer group"
          >
            <img 
              src={isDark ? "/zentrevo-logo-white.png" : "/zentrevo-logo.png"} 
              alt="Zentrevo Curated Journeys" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        {/* Page Header */}
        <div className={`space-y-4 border-b pb-8 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Website Directory & Sitemap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
            HTML Sitemap
          </h1>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed">
            Direct navigation links to all curated domestic expeditions across India, international luxury retreats, travel journal dispatches, visa concierge services, and official company policies.
          </p>
        </div>

        {/* Section 1: Main Platform Pages */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif">Main Platform Hubs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="/" 
              onClick={handleLinkClick('/')}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400/50' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">Hub</div>
              <h3 className="font-semibold text-base mb-1">Home Page</h3>
              <p className="text-xs text-stone-400">Main portal with handpicked expeditions, video stories, and travel search.</p>
            </a>

            <a 
              href="/national-tour-packages/" 
              onClick={handleLinkClick('/national-tour-packages/')}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400/50' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">Domestic Expeditions</div>
              <h3 className="font-semibold text-base mb-1">National (Domestic Tours)</h3>
              <p className="text-xs text-stone-400">Interactive map and curated royal heritage & mountain retreats across India.</p>
            </a>

            <a 
              href="/international-tour-packages/" 
              onClick={handleLinkClick('/international-tour-packages/')}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400/50' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">Global Expeditions</div>
              <h3 className="font-semibold text-base mb-1">International (International Tours)</h3>
              <p className="text-xs text-stone-400">Handcrafted bespoke retreats across Europe, Asia, Switzerland, and the Mediterranean.</p>
            </a>

            <a 
              href="/blog/" 
              onClick={handleLinkClick('/blog/')}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400/50' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">Stories & Journals</div>
              <h3 className="font-semibold text-base mb-1">Travel Blog & Journals</h3>
              <p className="text-xs text-stone-400">Exclusive field dispatches, artisan profiles, and slow-travel essays.</p>
            </a>

            <a 
              href="/visa/" 
              onClick={handleLinkClick('/visa/')}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400/50' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">Documentation</div>
              <h3 className="font-semibold text-base mb-1">Visa Assistance & Concierge</h3>
              <p className="text-xs text-stone-400">Document checklists and appointment guidance for Indian passport holders.</p>
            </a>

            <a 
              href="/#inquiry" 
              onClick={handleLinkClick('/#inquiry')}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400/50' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">Private Inquiry</div>
              <h3 className="font-semibold text-base mb-1">Private Itinerary Concierge</h3>
              <p className="text-xs text-stone-400">Request custom bespoke travel planning with dedicated 1-on-1 curators.</p>
            </a>
          </div>
        </section>

        {/* Section 2: National Domestic Tour Packages */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-stone-700/50">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-serif">National (Domestic) Tour Packages</h2>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              {nationalDestinations.length} Destinations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nationalDestinations.map(d => {
              const slug = d.slug || getDestinationSlug(d);
              return (
                <a
                  key={d.id}
                  href={`/destinations/${slug}`}
                  onClick={handleLinkClick(`/destinations/${slug}`)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10' 
                      : 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
                  }`}
                >
                  <div className="font-medium text-sm leading-snug">{d.title}</div>
                  <div className="text-[11px] text-stone-400 mt-2 flex items-center justify-between">
                    <span>{d.location || 'India'}</span>
                    <span className="font-semibold text-amber-400">{d.duration || 'Curated'}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Section 3: International Tour Packages */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-stone-700/50">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-serif">International Tour Packages</h2>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              {internationalDestinations.length} Destinations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {internationalDestinations.map(d => {
              const slug = d.slug || getDestinationSlug(d);
              return (
                <a
                  key={d.id}
                  href={`/destinations/${slug}`}
                  onClick={handleLinkClick(`/destinations/${slug}`)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10' 
                      : 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
                  }`}
                >
                  <div className="font-medium text-sm leading-snug">{d.title}</div>
                  <div className="text-[11px] text-stone-400 mt-2 flex items-center justify-between">
                    <span>{d.location || 'International'}</span>
                    <span className="font-semibold text-amber-400">{d.duration || 'Curated'}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Section 4: Travel Blog & Journal Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-stone-700/50">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-serif">Travel Journal & Blog Articles</h2>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              {blogs.length} Articles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {blogs.map(b => {
              const slug = b.slug || getBlogSlug(b);
              return (
                <a
                  key={b.id}
                  href={`/journal/${slug}`}
                  onClick={handleLinkClick(`/journal/${slug}`)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10' 
                      : 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
                  }`}
                >
                  <div className="font-medium text-sm leading-snug">{b.title}</div>
                  <div className="text-[11px] text-stone-400 mt-2 flex items-center justify-between">
                    <span>{b.category || 'Journal'}</span>
                    <span className="text-amber-400">{b.readTime || 'Read Story'}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Section 5: Legal & Search Engine Resources */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif">Company Policies & Crawler Indexes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a 
              href="/privacy-policy" 
              onClick={handleLinkClick('/privacy-policy')}
              className={`p-3.5 rounded-xl border transition-colors ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400' : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="font-semibold text-sm">Privacy Policy</div>
              <div className="text-[11px] text-stone-400 mt-1">Data protection & booking confidentiality</div>
            </a>

            <a 
              href="/terms-of-service" 
              onClick={handleLinkClick('/terms-of-service')}
              className={`p-3.5 rounded-xl border transition-colors ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400' : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="font-semibold text-sm">Terms of Service</div>
              <div className="text-[11px] text-stone-400 mt-1">Booking agreements & traveler rights</div>
            </a>

            <a 
              href="/cancellation-and-refund" 
              onClick={handleLinkClick('/cancellation-and-refund')}
              className={`p-3.5 rounded-xl border transition-colors ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400' : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="font-semibold text-sm">Cancellation & Refund</div>
              <div className="text-[11px] text-stone-400 mt-1">Rescheduling & refund guidelines</div>
            </a>

            <a 
              href="/sitemap.xml" 
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 rounded-xl border transition-colors ${
                isDark ? 'bg-white/5 border-white/10 hover:border-amber-400' : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="font-semibold text-sm">XML Sitemap (Google)</div>
              <div className="text-[11px] text-amber-400 mt-1">Real-time XML index for bots</div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer copyright */}
      <footer className={`mt-16 py-8 border-t text-center text-xs text-stone-400 ${
        isDark ? 'border-white/10 bg-black/40' : 'border-stone-200 bg-stone-100'
      }`}>
        <p>&copy; {new Date().getFullYear()} Zentrevo Luxury Travel. All rights reserved.</p>
      </footer>
    </div>
  );
}
