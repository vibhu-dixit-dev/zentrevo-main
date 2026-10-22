import React, { useState } from 'react';
import { Play, X, Star, Quote, ArrowRight, Volume2, Sparkles, Crown } from 'lucide-react';
import { testimonials, blogArticles } from '../data/travelData';

export default function VideoStorySection({ currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const activeReview = testimonials[activeTestimonialIndex];

  return (
    <section id="stories" className="px-4 sm:px-8 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Cinematic Video Teaser */}
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
              Watch a 90-second glimpse through the lens of our private expedition travelers across 4 continents.
            </p>
          </div>

          {/* Cinematic Landscape Card */}
          <div 
            onClick={() => setIsPlayingVideo(true)}
            className="group relative rounded-[36px] overflow-hidden aspect-[16/8] sm:aspect-[21/9] cursor-pointer shadow-2xl border border-stone-800/20"
          >
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
              alt="Cinematic mountain valley"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <span className={`absolute -inset-4 rounded-full animate-ping ${isSapphire ? 'bg-amber-400/20' : 'bg-white/20'}`} />
                <div className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-115 ${
                  isSapphire ? 'bg-amber-400 text-stone-950' : 'bg-white/90 backdrop-blur-md text-stone-950'
                }`}>
                  <Play className="w-6 sm:w-7 h-6 sm:h-7 fill-current ml-1" />
                </div>
              </div>
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Volume2 className={`w-4 h-4 ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span className="font-medium">4K Cinematic Reel • Dolomites & Swiss Horizons</span>
              </div>
              <span className="hidden sm:inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
                Click To Play Preview
              </span>
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
                  alt={activeReview.author}
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
              <h3 className={`${isEditorial ? 'font-editorial font-medium' : 'font-sans font-bold'} text-2xl sm:text-3xl`}>
                Adventure Thrills and Excitement Await
              </h3>
            </div>
            <a 
              href="#inquiry" 
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:underline ${
                isSapphire ? 'text-amber-300' : isEmerald ? 'text-emerald-400' : 'text-stone-900'
              }`}
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogArticles.map((article) => (
              <div
                key={article.id}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                  isSapphire
                    ? 'bg-[#0c1a38] border-amber-500/30 text-stone-100 hover:border-amber-400/60'
                    : isEmerald
                      ? 'bg-[#0d2b23] border-emerald-800/40 text-stone-100'
                      : 'bg-white border-stone-200 text-stone-900'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
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

      {/* Video Modal Player */}
      {isPlayingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
            <button
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&mute=0"
                title="Cinematic Travel Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-stone-900 text-stone-300 text-xs flex items-center justify-between">
              <span>Zentrevo Film Collection • Dolomites, Amalfi & Swiss Rail</span>
              <button 
                onClick={() => setIsPlayingVideo(false)}
                className="text-white hover:underline text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
