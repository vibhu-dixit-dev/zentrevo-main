import React, { useState } from 'react';
import { Compass, ArrowRight, Check, Globe, Share2, Mail, Crown } from 'lucide-react';

export default function Footer({ currentTheme, onSelectTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  const handleCycleTheme = () => {
    if (isEditorial) onSelectTheme('sapphire');
    else if (isSapphire) onSelectTheme('emerald');
    else onSelectTheme('editorial');
  };

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isSapphire
        ? 'bg-[#040813] border-slate-800 text-stone-300'
        : isEmerald 
          ? 'bg-[#081f19] border-emerald-900/60 text-stone-300' 
          : 'bg-stone-900 border-stone-800 text-stone-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-stone-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isSapphire 
                  ? 'bg-amber-400 text-[#040813]' 
                  : isEmerald 
                    ? 'bg-emerald-500 text-[#081f19]' 
                    : 'bg-white text-stone-900'
              }`}>
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-wider text-white">
                ZENTREVO
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Curating private, architectural, and culturally immersive journeys for discerning travelers across 48 countries worldwide.
            </p>

            <div className="text-xs text-stone-400 space-y-1 pt-1">
              <p><span className="text-stone-300 font-semibold">Headquarters:</span> Nawa City, Rajasthan, India 341509</p>
              <p><span className="text-stone-300 font-semibold">Email:</span> <a href="mailto:contact@zentrevo.in" className="hover:text-amber-400 underline">contact@zentrevo.in</a></p>
              <p><span className="text-stone-300 font-semibold">Phone:</span> <a href="tel:+918619928710" className="hover:text-amber-400">+91 86199 28710</a></p>
            </div>

            {/* Social / Channel Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                title="Global Network"
                className={`w-8 h-8 rounded-full bg-stone-800 hover:text-stone-950 flex items-center justify-center transition-all text-stone-400 ${
                  isSapphire ? 'hover:bg-amber-400' : 'hover:bg-emerald-500'
                }`}
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@zentrevo.in"
                title="Email: contact@zentrevo.in"
                className={`w-8 h-8 rounded-full bg-stone-800 hover:text-stone-950 flex items-center justify-center transition-all text-stone-400 ${
                  isSapphire ? 'hover:bg-amber-400' : 'hover:bg-emerald-500'
                }`}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                title="Share & Media"
                className={`w-8 h-8 rounded-full bg-stone-800 hover:text-stone-950 flex items-center justify-center transition-all text-stone-400 ${
                  isSapphire ? 'hover:bg-amber-400' : 'hover:bg-emerald-500'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Expeditions
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Amalfi Coast, Italy</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Kyoto Temples, Japan</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Swiss Glacier Rail</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Cappadocia Valley</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Bali River Sanctum</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#values" className="hover:text-amber-400 transition-colors">Our Core Beliefs</a></li>
              <li><a href="#experiences" className="hover:text-amber-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#stories" className="hover:text-amber-400 transition-colors">Stories & Journals</a></li>
              <li><a href="#inquiry" className="hover:text-amber-400 transition-colors">Private Concierge</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Careers & Partners</a></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              The Private Journal
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive exclusive invitation-only itinerary dossiers and seasonal destination dispatches once a month.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs">
                <Check className="w-4 h-4 text-amber-400" />
                <span>You're subscribed to the Private Journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-stone-800/80 border border-stone-700 text-xs px-4 py-2.5 rounded-full text-white focus:outline-none focus:border-amber-400 flex-1"
                />
                <button
                  type="submit"
                  className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSapphire 
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300' 
                      : isEmerald 
                        ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300' 
                        : 'bg-white text-stone-950 hover:bg-stone-200'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} ZENTREVO Travel Co. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleCycleTheme}
              className="text-stone-400 hover:text-amber-400 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Current Theme:</span>
              <span className="font-semibold text-white uppercase">{currentTheme}</span>
              <span className="underline ml-1">Switch</span>
            </button>
            <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
