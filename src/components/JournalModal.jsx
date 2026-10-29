import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Share2, 
  Compass, 
  Sparkles, 
  Crown, 
  Check, 
  MapPin, 
  Send,
  BookOpen,
  Filter
} from 'lucide-react';
import { blogArticles } from '../data/travelData';
import { getBlogSlug } from '../lib/seoRoutes';

export default function JournalModal({ 
  isOpen, 
  onClose, 
  initialArticle = null, 
  currentTheme = 'editorial',
  onInquireStory,
  onArticleChange
}) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [activeArticle, setActiveArticle] = useState(initialArticle);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync initialArticle whenever modal opens or initialArticle changes
  useEffect(() => {
    if (isOpen) {
      setActiveArticle(initialArticle);
      setSearchQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen, initialArticle]);

  // Handle article change and notify parent route listener
  const handleSelectArticle = (article) => {
    setActiveArticle(article);
    if (onArticleChange) {
      onArticleChange(article);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Unique categories list
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(blogArticles.map(a => a.category))];
    return cats;
  }, []);

  // Filtered articles for the catalog view
  const filteredArticles = useMemo(() => {
    return blogArticles.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        article.title.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.destination.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  // Handle Share link with clean canonical URL
  const handleShare = (article) => {
    const slug = getBlogSlug(article);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.zentrevo.in';
    const url = `${origin}/journal/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Find adjacent articles for next/prev navigation
  const currentIndex = activeArticle 
    ? blogArticles.findIndex(a => a.id === activeArticle.id) 
    : -1;
  const prevArticle = currentIndex > 0 ? blogArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < blogArticles.length - 1 ? blogArticles[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-5xl max-h-[92vh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isSapphire
            ? 'bg-[#0a1630] border-amber-500/40 text-stone-100 shadow-blue-950/80'
            : isEmerald
              ? 'bg-[#09221b] border-emerald-700/50 text-stone-100 shadow-emerald-950/80'
              : 'bg-white border-stone-200 text-stone-900 shadow-2xl'
        }`}
      >
        {/* Modal Top Header Bar */}
        <div className={`px-5 sm:px-8 py-4 border-b flex items-center justify-between shrink-0 ${
          isSapphire
            ? 'border-amber-500/20 bg-[#081226]/80'
            : isEmerald
              ? 'border-emerald-800/40 bg-emerald-950/60'
              : 'border-stone-200 bg-stone-50/80'
        }`}>
          <div className="flex items-center gap-3">
            {activeArticle ? (
              <button
                type="button"
                onClick={() => handleSelectArticle(null)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                  isSapphire
                    ? 'border-amber-500/40 hover:bg-amber-400/20 text-amber-300'
                    : isEmerald
                      ? 'border-emerald-700/50 hover:bg-emerald-500/20 text-emerald-300'
                      : 'border-stone-300 hover:bg-stone-200 text-stone-800'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Field Notes</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSapphire ? 'bg-amber-400/20 text-amber-400' : isEmerald ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-900 text-white'
                }`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">Zentrevo Gazette</span>
                  <h2 className="text-sm sm:text-base font-bold">The Journal & Field Notes</h2>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeArticle && (
              <button
                type="button"
                onClick={() => handleShare(activeArticle)}
                title="Share Article Link"
                className={`p-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
                  isSapphire
                    ? 'border-slate-700 hover:bg-white/10 text-stone-300'
                    : isEmerald
                      ? 'border-emerald-800 hover:bg-white/10 text-stone-300'
                      : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-semibold text-emerald-400 pr-1">Copied!</span>
                  </>
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isSapphire
                  ? 'border-slate-700 hover:bg-white/10 text-stone-300'
                  : isEmerald
                    ? 'border-emerald-800 hover:bg-white/10 text-stone-300'
                    : 'border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
              aria-label="Close Journal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {activeArticle ? (
            /* ================= VIEW 1: IMMERSIVE STORY READER ================= */
            <article className="animate-in fade-in zoom-in-95 duration-200">
              {/* Hero Image Banner */}
              <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden">
                <img 
                  src={activeArticle.image} 
                  alt={activeArticle.imageAlt || `${activeArticle.title} - Zentrevo Journal Story`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-4 sm:bottom-6 left-5 sm:left-8 right-5 sm:right-8 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isSapphire
                        ? 'bg-amber-400 text-stone-950'
                        : isEmerald
                          ? 'bg-emerald-400 text-stone-950'
                          : 'bg-white text-stone-950 shadow-md'
                    }`}>
                      {activeArticle.category}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{activeArticle.destination}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-white/80 text-[11px] font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {activeArticle.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeArticle.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Story Content Area */}
              <div className="px-5 sm:px-12 py-8 max-w-4xl mx-auto space-y-8">
                {/* Title & Author */}
                <div>
                  <h1 className={`${isEditorial ? 'font-editorial' : 'font-sans'} text-2xl sm:text-4xl font-bold leading-tight mb-5`}>
                    {activeArticle.title}
                  </h1>

                  <div className={`flex items-center gap-3 pb-6 border-b ${
                    isSapphire ? 'border-slate-800' : isEmerald ? 'border-emerald-900' : 'border-stone-200'
                  }`}>
                    <img 
                      src={activeArticle.author.avatar} 
                      alt={`${activeArticle.author.name} - ${activeArticle.author.role}`}
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40" 
                    />
                    <div>
                      <span className="text-xs font-bold block">{activeArticle.author.name}</span>
                      <span className="text-[11px] opacity-70 block">{activeArticle.author.role}</span>
                    </div>
                  </div>
                </div>

                {/* Pull Quote */}
                {activeArticle.pullQuote && (
                  <blockquote className={`p-5 sm:p-6 rounded-2xl border-l-4 italic text-sm sm:text-base leading-relaxed ${
                    isSapphire
                      ? 'bg-[#081226] border-l-amber-400 text-stone-200'
                      : isEmerald
                        ? 'bg-emerald-950/60 border-l-emerald-400 text-stone-200'
                        : 'bg-stone-50 border-l-stone-900 text-stone-800'
                  }`}>
                    "{activeArticle.pullQuote}"
                  </blockquote>
                )}

                {/* Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed opacity-90">
                  {activeArticle.content.map((p, idx) => (
                    <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:mr-0.5">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Curator Highlights Card */}
                {activeArticle.highlights && activeArticle.highlights.length > 0 && (
                  <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
                    isSapphire
                      ? 'bg-[#081226]/80 border-amber-500/30'
                      : isEmerald
                        ? 'bg-emerald-950/50 border-emerald-800/60'
                        : 'bg-amber-50/40 border-amber-200/80 text-stone-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Curator's Insider Access</h3>
                    </div>
                    <ul className="space-y-2">
                      {activeArticle.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs opacity-90">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inquiry CTA Box */}
                <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 ${
                  isSapphire
                    ? 'bg-gradient-to-b from-[#081226] to-[#0d1e3d] border-amber-500/40'
                    : isEmerald
                      ? 'bg-gradient-to-b from-emerald-950/80 to-[#071f18] border-emerald-700/50'
                      : 'bg-stone-900 text-white border-stone-800'
                }`}>
                  <Crown className="w-6 h-6 text-amber-400 mx-auto" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1 text-white">Experience This Itinerary in Person</h3>
                    <p className="text-xs text-stone-300 max-w-md mx-auto">
                      Our private journey planners can customize this exact voyage to {activeArticle.destination} for you and your party.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onInquireStory) {
                        onInquireStory(activeArticle.destination);
                      }
                      onClose();
                    }}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      isSapphire
                        ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                        : isEmerald
                          ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                          : 'bg-white text-stone-950 hover:bg-stone-100'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire About This Journey</span>
                  </button>
                </div>

                {/* Previous & Next Story Navigation */}
                <div className="pt-6 border-t border-stone-200/20 flex items-center justify-between gap-4">
                  {prevArticle ? (
                    <button
                      type="button"
                      onClick={() => handleSelectArticle(prevArticle)}
                      className="flex items-center gap-2 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity text-left cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                      <div className="truncate max-w-[150px] sm:max-w-[220px]">
                        <span className="text-[10px] uppercase text-stone-400 block">Previous Story</span>
                        <span className="truncate block">{prevArticle.title}</span>
                      </div>
                    </button>
                  ) : <div />}

                  {nextArticle ? (
                    <button
                      type="button"
                      onClick={() => handleSelectArticle(nextArticle)}
                      className="flex items-center gap-2 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity text-right cursor-pointer"
                    >
                      <div className="truncate max-w-[150px] sm:max-w-[220px]">
                        <span className="text-[10px] uppercase text-stone-400 block">Next Story</span>
                        <span className="truncate block">{nextArticle.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  ) : <div />}
                </div>
              </div>
            </article>
          ) : (
            /* ================= VIEW 2: ALL ARTICLES CATALOG ================= */
            <div className="p-5 sm:p-8 space-y-6">
              {/* Filter & Search Bar */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`${isEditorial ? 'font-editorial' : 'font-sans'} text-xl sm:text-2xl font-bold`}>
                      Field Notes, Essays & Insider Stories
                    </h3>
                    <p className="text-xs opacity-70 mt-0.5">
                      Dispatches penned by our global expedition directors and cultural liaisons.
                    </p>
                  </div>

                  {/* Real-time Search Box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search stories, destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                        isSapphire
                          ? 'bg-[#081226] border-slate-700 text-white focus:border-amber-400'
                          : isEmerald
                            ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                            : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 text-stone-400 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? isSapphire
                              ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                              : isEmerald
                                ? 'bg-emerald-400 text-stone-950 font-bold shadow-md'
                                : 'bg-stone-950 text-white font-bold'
                            : isSapphire
                              ? 'bg-[#081226] text-stone-300 hover:bg-[#0c1a38]'
                              : isEmerald
                                ? 'bg-emerald-950/60 text-stone-300 hover:bg-emerald-900/60'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Articles Grid */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16 space-y-2 opacity-70">
                  <BookOpen className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="text-sm font-semibold">No journal stories match your search</p>
                  <p className="text-xs">Try selecting "All" or adjusting your search keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => handleSelectArticle(article)}
                      className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col cursor-pointer ${
                        isSapphire
                          ? 'bg-[#081226]/80 border-amber-500/25 text-stone-100 hover:border-amber-400/60 hover:-translate-y-0.5'
                          : isEmerald
                            ? 'bg-emerald-950/40 border-emerald-800/40 text-stone-100 hover:border-emerald-500/60 hover:-translate-y-0.5'
                            : 'bg-white border-stone-200 text-stone-900 hover:border-stone-400 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={article.image}
                          alt={article.imageAlt || `${article.title} - Zentrevo Journal`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9.5px] font-semibold text-white uppercase tracking-wider">
                          {article.category}
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9.5px] font-medium text-white/90">
                          {article.readTime}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold uppercase">
                            <MapPin className="w-3 h-3" />
                            <span>{article.destination}</span>
                          </div>

                          <h4 className="font-bold text-sm leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
                            {article.title}
                          </h4>

                          <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-200/10 flex items-center justify-between text-xs font-semibold">
                          <span className="text-[10px] opacity-60 font-normal">{article.date}</span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
                          }`}>
                            Read Story
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}