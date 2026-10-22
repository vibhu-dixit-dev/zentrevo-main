import React, { useState } from 'react';
import { Send, Phone, Clock, MapPin, CheckCircle, Sparkles, Crown } from 'lucide-react';

export default function BookingInquirySection({ currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Italy (Amalfi Coast)',
    guests: '2 Guests',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="inquiry" className="px-4 sm:px-8 py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div 
          className={`rounded-[36px] p-8 sm:p-14 border shadow-2xl transition-all duration-300 relative overflow-hidden ${
            isSapphire
              ? 'bg-[#0c1a38] border-amber-500/35 text-white shadow-blue-950/50'
              : isEmerald
                ? 'bg-[#0d2b23] border-emerald-800/60 text-white shadow-emerald-950/40'
                : 'bg-white border-stone-200 text-stone-900 shadow-xl'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Form Details & Value */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${
                  isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-amber-600'
                }`}>
                  {isSapphire ? <Crown className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Custom Itineraries</span>
                </p>
                <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-3xl sm:text-5xl tracking-tight leading-tight mb-4`}>
                  Voyages of Wonder, Crafted For You
                </h2>
                <p className={`text-sm leading-relaxed ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                  Tell us your vision, pacing, and dream destinations. Our private journey curators will design a personalized proposal within 24 hours.
                </p>
              </div>

              {/* Contact Information Cards */}
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  isSapphire 
                    ? 'bg-[#081226]/70 border-amber-500/30' 
                    : isEmerald 
                      ? 'bg-emerald-950/40 border-emerald-800/50' 
                      : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Direct Concierge Line</span>
                    <span className="text-sm font-bold">+1 (800) 555-0129</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  isSapphire 
                    ? 'bg-[#081226]/70 border-amber-500/30' 
                    : isEmerald 
                      ? 'bg-emerald-950/40 border-emerald-800/50' 
                      : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Consultation Hours</span>
                    <span className="text-sm font-semibold">9:00 AM – 8:00 PM EST (7 Days/Week)</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  isSapphire 
                    ? 'bg-[#081226]/70 border-amber-500/30' 
                    : isEmerald 
                      ? 'bg-emerald-950/40 border-emerald-800/50' 
                      : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Global Offices</span>
                    <span className="text-sm font-semibold">Zürich • Tokyo • San Francisco • London</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Booking Form */}
            <div className="lg:col-span-7">
              <div className={`p-6 sm:p-10 rounded-3xl border ${
                isSapphire 
                  ? 'bg-[#081226] border-amber-500/30' 
                  : isEmerald 
                    ? 'bg-[#0a241d] border-emerald-700/40' 
                    : 'bg-stone-50 border-stone-200'
              }`}>
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                      isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Your Itinerary Request Is Received</h3>
                    <p className={`text-sm max-w-md mx-auto ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                      Thank you, <span className={`font-semibold ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`}>{formData.name || 'valued traveler'}</span>. One of our Senior Journey Curators will reach out within 24 hours with your preliminary dossier.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className={`mt-4 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isSapphire 
                          ? 'bg-amber-400 text-stone-950 hover:bg-amber-300' 
                          : 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                      }`}
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Kathleen Smith"
                          className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all ${
                            isSapphire
                              ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="kathleen@domain.com"
                          className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all ${
                            isSapphire
                              ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all ${
                            isSapphire
                              ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                          Target Destination
                        </label>
                        <select
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all cursor-pointer ${
                            isSapphire
                              ? 'bg-[#050b18] border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        >
                          <option value="Amalfi Coast, Italy">Amalfi Coast, Italy</option>
                          <option value="Kyoto, Japan">Kyoto, Japan</option>
                          <option value="Swiss Alps, Switzerland">Swiss Alps, Switzerland</option>
                          <option value="Cappadocia, Turkey">Cappadocia, Turkey</option>
                          <option value="Aurora Wilderness, Iceland">Aurora Wilderness, Iceland</option>
                          <option value="Uluwatu & Ubud, Bali">Uluwatu & Ubud, Bali</option>
                          <option value="Custom Multi-Country">Custom Multi-Country Expedition</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Tell Us About Your Desired Journey
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Dates in mind, celebration milestones, accommodation preferences, private jet needs..."
                        className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all ${
                          isSapphire
                            ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                            : isEmerald
                              ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                              : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                        isSapphire
                          ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 shadow-amber-500/25'
                          : isEmerald
                            ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-500/25'
                            : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/25'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send My Bespoke Request</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
