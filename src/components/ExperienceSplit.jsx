import React from 'react';
import { valuePillars } from '../data/travelData';
import { Check, ShieldCheck, Heart, Users, PhoneCall, Sparkles, Crown } from 'lucide-react';

export default function ExperienceSplit({ currentTheme, onOpenInquiry }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const pillarIcons = [Users, Heart, ShieldCheck];

  return (
    <section id="values" className="px-4 sm:px-8 py-20 relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Core Beliefs Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
            isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-500' : 'text-amber-600'
          }`}>
            The Zentrevo Ethos
          </p>
          <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-3xl sm:text-5xl tracking-tight leading-tight mb-4 ${
            isSapphire || isEmerald ? 'text-stone-100' : 'text-stone-900'
          }`}>
            Our Core Beliefs That Shape Travel Experiences
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${
            isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'
          }`}>
            We believe journeys are life milestones, not mere bookings. Here is how we redefine luxury travel.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {valuePillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx];
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl border transition-all duration-300 relative group hover:-translate-y-1 ${
                  isSapphire
                    ? 'bg-[#0a142c] border-amber-500/30 text-stone-100 hover:border-amber-400/60 shadow-lg shadow-blue-950/20'
                    : isEmerald
                      ? 'bg-[#0a241d] border-emerald-800/40 text-stone-100 hover:border-emerald-600/70 shadow-lg shadow-emerald-950/20'
                      : 'bg-white border-stone-200 text-stone-900 hover:border-stone-400 shadow-md shadow-stone-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isSapphire
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                      : isEmerald 
                        ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50' 
                        : 'bg-stone-100 text-stone-900 border border-stone-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full ${
                    isSapphire
                      ? 'bg-[#050b18] text-amber-400 border border-amber-500/40'
                      : isEmerald 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-stone-100 text-stone-600'
                  }`}>
                    {pillar.tag}
                  </span>
                </div>

                <h3 className={`${isEditorial ? 'font-editorial font-medium' : 'font-sans font-bold'} text-xl mb-3`}>
                  {pillar.title}
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Split Section */}
        <div id="experiences" className={`rounded-[36px] p-8 sm:p-14 border shadow-2xl transition-all duration-300 scroll-mt-24 ${
          isSapphire
            ? 'bg-[#0c1a38] border-amber-500/30 text-stone-100 shadow-blue-950/40'
            : isEmerald
              ? 'bg-[#0d2b23] border-emerald-800/60 text-stone-100 shadow-emerald-950/30'
              : 'bg-stone-50 border-stone-200/90 text-stone-900'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Framed Photo with 25 Years Badge */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/4]">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                    alt="Traveler standing on ocean lookout"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating "25 Years Of Experience" Badge */}
                <div className={`absolute -bottom-6 -right-4 sm:right-6 p-5 rounded-2xl shadow-2xl border flex items-center gap-4 ${
                  isSapphire
                    ? 'bg-[#050b18] border-amber-400/50 text-white'
                    : isEmerald
                      ? 'bg-[#061813] border-emerald-500/40 text-white'
                      : 'bg-stone-950 text-white border-stone-800'
                }`}>
                  <div className={`text-3xl sm:text-4xl font-extrabold ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`}>
                    25
                  </div>
                  <div className="text-xs font-semibold leading-tight uppercase tracking-wider">
                    Years Of <br />
                    <span className="text-stone-400 font-normal">Excellence</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Copy & Checklist */}
            <div className="lg:col-span-6">
              <p className={`text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2 ${
                isSapphire ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {isSapphire ? <Crown className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Why Discerning Travelers Choose Us</span>
              </p>
              
              <h3 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-3xl sm:text-4xl tracking-tight leading-tight mb-6`}>
                Experiencing Traditions & Authentic Cultural Immersion
              </h3>

              <p className={`text-sm leading-relaxed mb-8 ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                Travel isn't about ticking off landmarks from a bus window. It is about quiet dawn mornings in remote mountain shrines, private wine cellar keys held by 5th-generation vintners, and itineraries orchestrated with surgical elegance.
              </p>

              {/* Checklist */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    title: "Curated Private Sanctuaries",
                    sub: "Direct partnerships with verified private villas, boutique castles, and overwater suites."
                  },
                  {
                    title: "24/7 Dedicated Ground Concierge",
                    sub: "Real-time itinerary adjustments, private helicopter charters, and multilingual hosts."
                  },
                  {
                    title: "Seamless Visa & Logistics Handled",
                    sub: "Zero friction from private runway clearance to luggage transfers between cities."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSapphire ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className={`text-xs mt-0.5 ${isSapphire || isEmerald ? 'text-stone-400' : 'text-stone-500'}`}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-200/15">
                <button
                  onClick={onOpenInquiry}
                  className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                    isSapphire
                      ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 shadow-amber-500/20 font-bold'
                      : isEmerald
                        ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                        : 'bg-stone-950 text-white hover:bg-stone-800'
                  }`}
                >
                  Request Itinerary
                </button>

                <a 
                  href="tel:+918619928710"
                  className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-semibold transition-all border ${
                    isSapphire
                      ? 'border-amber-500/40 text-amber-300 hover:bg-[#071126]'
                      : isEmerald
                        ? 'border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/60'
                        : 'border-stone-300 text-stone-800 hover:bg-stone-200/60'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Us: +91 86199 28710</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
