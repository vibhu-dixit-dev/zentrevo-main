import React from 'react';
import { statistics, partnerLogos } from '../data/travelData';
import { ShieldCheck, Award, HeartHandshake, Compass } from 'lucide-react';

export default function StatsBar({ currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';

  const icons = [Compass, Award, HeartHandshake, ShieldCheck];

  return (
    <section className="px-4 sm:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Metric Ribbon */}
        <div 
          className={`rounded-3xl p-6 sm:p-10 transition-all duration-300 border shadow-xl ${
            isSapphire
              ? 'bg-[#0a142c] border-amber-500/30 text-white shadow-blue-950/40'
              : isEmerald
                ? 'bg-[#0d2b23] border-emerald-800/60 text-white shadow-emerald-950/20'
                : 'bg-white border-stone-200 text-stone-900 shadow-stone-200/50'
          }`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/20">
            {statistics.map((stat, idx) => {
              const IconComp = icons[idx];
              return (
                <div key={idx} className={`flex items-start gap-4 ${idx > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''}`}>
                  <div className={`p-3 rounded-2xl ${
                    isSapphire
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                      : isEmerald 
                        ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/40' 
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold mt-1">
                      {stat.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      isSapphire ? 'text-amber-300/70' : isEmerald ? 'text-emerald-300/70' : 'text-stone-500'
                    }`}>
                      {stat.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner Logos Strip */}
        <div className="mt-10 pt-4 flex flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-6">
            Trusted by Leaders & Industry Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {partnerLogos.map((p, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <span className={`font-semibold tracking-wider text-sm transition-colors ${
                  isSapphire 
                    ? 'text-stone-300 group-hover:text-amber-300'
                    : isEmerald 
                      ? 'text-stone-300 group-hover:text-emerald-300' 
                      : 'text-stone-700 group-hover:text-stone-950'
                }`}>
                  {p.name}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  {p.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
