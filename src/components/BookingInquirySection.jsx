import React, { useState, useEffect } from 'react';
import { Send, Phone, Clock, MapPin, CheckCircle, Sparkles, Crown, Mail, MessageCircle, ArrowUpRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function BookingInquirySection({ currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Italy (Amalfi Coast)',
    guests: '2 Guests (Couple)',
    message: '',
    _hp_security_check: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        if (data.message && data.message.includes('SMTP_PASS')) {
          setErrorMessage('Vercel SMTP configuration pending: Please add SMTP_PASS in Vercel settings.');
        } else {
          throw new Error(data.message || 'Could not send inquiry.');
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Could not connect with concierge servers. Please connect directly via WhatsApp or Phone below.');
    } finally {
      setIsSubmitting(false);
    }
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
            
            {/* Left Column: Form Details & Real Contact Data */}
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

              {/* Real Contact Information Cards */}
              <div className="space-y-4">
                {/* Direct Phone */}
                <a 
                  href="tel:+918619928710"
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.01] ${
                    isSapphire 
                      ? 'bg-[#081226]/70 border-amber-500/30 text-white hover:border-amber-400' 
                      : isEmerald 
                        ? 'bg-emerald-950/40 border-emerald-800/50 text-white hover:border-emerald-500' 
                        : 'bg-stone-50 border-stone-200 text-stone-900 hover:border-stone-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Direct Concierge Phone</span>
                    <span className="text-sm font-bold tracking-wide">+91 86199 28710</span>
                  </div>
                </a>

                {/* Direct Email */}
                <a 
                  href="mailto:contact@zentrevo.in"
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.01] ${
                    isSapphire 
                      ? 'bg-[#081226]/70 border-amber-500/30 text-white hover:border-amber-400' 
                      : isEmerald 
                        ? 'bg-emerald-950/40 border-emerald-800/50 text-white hover:border-emerald-500' 
                        : 'bg-stone-50 border-stone-200 text-stone-900 hover:border-stone-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Official Support Email</span>
                    <span className="text-sm font-semibold tracking-wide">contact@zentrevo.in</span>
                  </div>
                </a>

                {/* Instant WhatsApp Priority Chat */}
                <a 
                  href="https://wa.me/918619928710?text=Hello%20Zentrevo%20Concierge%2C%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20curating%20a%20custom%20luxury%20itinerary.%20Could%20you%20please%20share%20more%20details%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.01] ${
                    isSapphire
                      ? 'bg-[#081226]/80 border-emerald-500/40 text-white hover:border-emerald-400'
                      : isEmerald
                        ? 'bg-emerald-950/60 border-emerald-600/50 text-white hover:border-emerald-400'
                        : 'bg-emerald-50/60 border-emerald-200 text-stone-900 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                      <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-500 block">Fastest Direct Route</span>
                      <span className="text-sm font-bold tracking-wide">Instant WhatsApp Chat</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                </a>

                {/* Consultation Hours */}
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
                    <span className="text-sm font-semibold">9:00 AM – 8:00 PM (All 7 Days)</span>
                  </div>
                </div>

                {/* Office Location */}
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
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Headquarters / Location</span>
                    <span className="text-sm font-semibold">Nawa City, Rajasthan, India 341509</span>
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
                      Thank you, <span className={`font-semibold ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`}>{formData.name || 'valued traveler'}</span>. Our senior team will review your dossier and reply from <strong className="underline">contact@zentrevo.in</strong> within 24 hours.
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
                    {/* Invisible Honeypot Spam Trap (bots fill this, humans don't) */}
                    <input 
                      type="text" 
                      name="_hp_security_check" 
                      value={formData._hp_security_check || ''} 
                      onChange={(e) => setFormData({...formData, _hp_security_check: e.target.value})} 
                      style={{ display: 'none' }} 
                      tabIndex={-1} 
                      autoComplete="off" 
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
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
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="contact@zentrevo.in"
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
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 86199 28710"
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
                          Travelers / Party Size
                        </label>
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: e.target.value})}
                          className={`w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all cursor-pointer ${
                            isSapphire
                              ? 'bg-[#050b18] border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        >
                          <option value="1 Solo Explorer">1 Solo Explorer</option>
                          <option value="2 Guests (Couple)">2 Guests (Couple)</option>
                          <option value="3-4 Small Private Party">3-4 Small Private Party</option>
                          <option value="5-8 Family Expedition">5-8 Family Expedition</option>
                          <option value="8+ Private Charter / Group">8+ Private Charter / Group</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Target Destination
                      </label>
                      <select
                        name="destination"
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

                    <div>
                      <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Tell Us About Your Desired Journey
                      </label>
                      <textarea
                        rows={3}
                        name="message"
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

                    {errorMessage && (
                      <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                        isSubmitting ? 'opacity-70 cursor-wait' : ''
                      } ${
                        isSapphire
                          ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 hover:from-amber-300 hover:to-amber-200 shadow-amber-500/25'
                          : isEmerald
                            ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-500/25'
                            : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/25'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Transmitting Dossier to Concierge...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send My Bespoke Request</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] opacity-60">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Direct TLS Encrypted Delivery via contact@zentrevo.in</span>
                    </div>
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
