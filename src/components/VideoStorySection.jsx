import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Star, Quote, ArrowRight, Volume2, VolumeX, Sparkles, Crown } from 'lucide-react';
import { testimonials, blogArticles } from '../data/travelData';

export default function VideoStorySection({ currentTheme, onOpenJournal }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // IntersectionObserver: Automatically plays when scrolled into view, pauses when scrolled up/away
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // User scrolled to card -> auto play video smoothly
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                  // Browser autoplay with sound restriction handled by muted=true
                  video.muted = true;
                  setIsMuted(true);
                  video.play().then(() => setIsPlaying(true)).catch(() => {});
                });
            }
          } else {
            // User scrolled away or scrolled up -> auto pause video
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.4 // Triggers when 40% of the card is visible
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Manual toggle play/pause on card click
  const handleTogglePlayPause = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Mute / Sound
  const handleToggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const activeReview = testimonials[activeTestimonialIndex];

  return (
    <section id="stories" className="px-4 sm:px-8 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Cinematic Video Teaser Header */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
              isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-500' : 'text-amber-600'
            }`}>
              Visual Chronicle
            </p>
            <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-3xl sm:text-5xl tracking-tight ${
              isSapphire || isEmerald ? 'text-stone-100' : 'text-stone-900'
            }`}>
              Adventures And Stories Captured In Pictures
            </h2>
            <p className={`text-sm mt-3 ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
              Watch a panoramic 4K glimpse through the lens of our private expedition travelers across 4 continents.
            </p>
          </div>

          {/* Interactive Scroll-Aware Cinematic Video Card */}
          <div 
            ref={containerRef}
            onClick={handleTogglePlayPause}
            className="group relative rounded-[32px] sm:rounded-[36px] overflow-hidden aspect-[16/10] sm:aspect-[16/9] cursor-pointer shadow-2xl border border-stone-800/20 bg-stone-950"
          >
            {/* Native HTML5 Video matching exact starting picture with poster and video feed */}
            <video
              ref={videoRef}
              src="/videos/yosemite-valley.webm"
              poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-bottom"
            />
            
            {/* Cinematic Gradient Vignette - Softened so river and water ripples remain clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />

            {/* Center Play / Pause Control Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 ${
                  isPlaying 
                    ? 'opacity-0 group-hover:opacity-90 bg-black/60 text-white backdrop-blur-md' 
                    : isSapphire 
                      ? 'bg-amber-400 text-stone-950 opacity-100' 
                      : 'bg-white/95 text-stone-950 opacity-100'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 sm:w-7 h-6 sm:h-7 fill-current" />
                ) : (
                  <Play className="w-6 sm:w-7 h-6 sm:h-7 fill-current ml-1" />
                )}
              </div>
            </div>

            {/* Top Badge: Auto-Play Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isPlaying ? 'Auto-Playing on Scroll' : 'Auto-Paused (Scroll In View)'}</span>
              </div>
            </div>

            {/* Bottom Caption Bar */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs sm:text-sm">
              {/* Sound / Mute Toggle Pill */}
              <button
                onClick={handleToggleMute}
                className="flex items-center gap-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 transition-colors cursor-pointer"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-stone-300" />
                ) : (
                  <Volume2 className={`w-4 h-4 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`} />
                )}
                <span className="font-medium text-xs">
                  {isMuted ? 'Muted • Click for Sound' : 'Audio Active'}
                </span>
              </button>

              {/* Click to Pause / Play Action Hint */}
              <div className="hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs">
                <span className="opacity-80">
                  {isPlaying ? 'Click anywhere to Pause' : 'Click anywhere to Resume'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className={`lg:col-span-8 p-8 sm:p-12 rounded-[32px] border relative overflow-hidden flex flex-col justify-between shadow-xl ${
            isSapphire
              ? 'bg-[#0c1a38] border-amber-500/30 text-stone-100 shadow-blue-950/40'
              : isEmerald
                ? 'bg-[#0d2b23] border-emerald-800/60 text-stone-100'
                : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <Quote className={`w-14 h-14 opacity-20 absolute top-8 right-8 ${
              isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-400'
            }`} />

            <div>
              <div className="flex items-center gap-1.5 mb-6 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-stone-400 ml-2">5.0 Verified Royal Client Review</span>
              </div>

              <blockquote className={`${isEditorial ? 'font-editorial' : 'font-sans'} text-lg sm:text-2xl font-normal leading-relaxed mb-8`}>
                "{activeReview.quote}"
              </blockquote>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-stone-200/15">
              <div className="flex items-center gap-4">
                <img
                  src={activeReview.avatar}
                  alt={`${activeReview.author} - Verified Zentrevo Traveler Review`}
                  loading="lazy"
                  decoding="async"
                  className={`w-12 h-12 rounded-full object-cover ring-2 ${
                    isSapphire ? 'ring-amber-400' : isEmerald ? 'ring-emerald-400' : 'ring-stone-900'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-sm">{activeReview.author}</h4>
                  <p className={`text-xs ${isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-500'}`}>
                    {activeReview.role} • {activeReview.location}
                  </p>
                </div>
              </div>

              {/* Review switch indicators */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonialIndex(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeTestimonialIndex === i 
                        ? `w-7 ${isSapphire ? 'bg-amber-400' : isEmerald ? 'bg-emerald-400' : 'bg-stone-950'}` 
                        : 'w-2.5 bg-stone-400/40'
                    }`}
                    aria-label={`Show review ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Highlights Card */}
          <div className={`lg:col-span-4 p-8 rounded-[32px] border flex flex-col justify-between ${
            isSapphire
              ? 'bg-[#081226] border-amber-500/30 text-stone-100 shadow-blue-950/20'
              : isEmerald
                ? 'bg-[#0a241d] border-emerald-800/40 text-stone-100'
                : 'bg-stone-50 border-stone-200 text-stone-900'
          }`}>
            <div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isSapphire ? 'text-amber-400' : 'text-emerald-500'}`}>
                Guaranteed Excellence
              </span>
              <h3 className="text-xl font-bold mt-2 mb-4">
                Where Wanderlust Meets Reality Destinations
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                Our travelers enjoy VIP ground clearance, verified luxury properties, zero hidden fees, and full carbon-neutral expedition offsets.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/10 dark:bg-white/5 text-xs font-semibold">
                <span>Passport & Visa Concierge</span>
                <span className={`font-bold ${isSapphire ? 'text-amber-400' : 'text-emerald-500'}`}>Included</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/10 dark:bg-white/5 text-xs font-semibold">
                <span>Global Medical & Evac Cover</span>
                <span className={`font-bold ${isSapphire ? 'text-amber-400' : 'text-emerald-500'}`}>Tier 1 Sovereign</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Blogs & Journal Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-500' : 'text-amber-600'
              }`}>
                Field Notes & Stories
              </p>
              <h3 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-2xl sm:text-3xl`}>
                Adventure Thrills and Excitement Await
              </h3>
            </div>
            <button 
              type="button"
              onClick={() => onOpenJournal && onOpenJournal(null)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:underline cursor-pointer transition-all ${
                isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
              }`}
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => onOpenJournal && onOpenJournal(article)}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  isSapphire
                    ? 'bg-[#0c1a38] border-amber-500/30 text-stone-100 hover:border-amber-400/60 hover:-translate-y-1'
                    : isEmerald
                      ? 'bg-[#0d2b23] border-emerald-800/40 text-stone-100 hover:border-emerald-500/60 hover:-translate-y-1'
                      : 'bg-white border-stone-200 text-stone-900 hover:border-stone-400 hover:-translate-y-1'
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
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white uppercase">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h4 className="font-semibold text-base mb-4 leading-snug group-hover:text-amber-400 transition-colors">
                    {article.title}
                  </h4>

                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-300' : 'text-stone-900'
                  }`}>
                    Read Journal Entry
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
