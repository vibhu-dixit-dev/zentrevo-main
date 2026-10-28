import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, MapPin, CheckCircle, Sparkles, Crown, Mail, MessageCircle, ArrowUpRight, Loader2, AlertCircle, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { destinations, getActiveDestinations, getDestinationPrice } from '../data/travelData';

export default function BookingInquirySection({ currentTheme, preselectedDestination }) {
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
    destination: 'Select Destination',
    guests: 'Select Travelers',
    message: '',
    _hp_security_check: ''
  });

  const [destOpen, setDestOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const destRef = useRef(null);
  const guestsRef = useRef(null);

  // Sync preselected destination if user clicks "Book This Itinerary" on any card
  useEffect(() => {
    if (preselectedDestination) {
      setFormData(prev => ({
        ...prev,
        destination: preselectedDestination
      }));
    }
  }, [preselectedDestination]);

  const [activeDestList, setActiveDestList] = useState(getActiveDestinations);

  useEffect(() => {
    const handleSync = () => {
      setActiveDestList(getActiveDestinations());
    };
    window.addEventListener('zentrevo_destinations_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('zentrevo_destinations_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const destinationOptions = [
    'Select Destination',
    ...activeDestList.map(d => d.title),
    'Custom Multi-Country Expedition'
  ];

  const guestsOptions = [
    'Select Travelers',
    '1 Solo Explorer',
    '2 Guests (Couple)',
    '3-4 Small Private Party',
    '5-8 Family Expedition',
    '8+ Private Charter / Group'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destRef.current && !destRef.current.contains(event.target)) {
        setDestOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setGuestsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDestOpen(false);
        setGuestsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    let supabaseSaved = false;

    // Automatically determine exact plan price based on destination choice
    const planPrice = getDestinationPrice(formData.destination);

    // 1. Direct Persist to Supabase Database (if human submission)
    if (!formData._hp_security_check && supabase) {
      try {
        const insertPayload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || '',
          destination: formData.destination === 'Select Destination' ? 'Custom Expedition' : formData.destination,
          guests: formData.guests === 'Select Travelers' ? '2 Guests (Couple)' : formData.guests,
          message: formData.message?.trim() || '',
          status: 'New Inquiry',
          newsletter_subscribed: true,
          plan_price: planPrice
        };

        let { error: sbError } = await supabase.from('inquiries').insert([insertPayload]);
        
        // Fallback: If plan_price column doesn't exist yet in Supabase schema, retry without it
        if (sbError && (sbError.message?.includes('plan_price') || sbError.code === 'PGRST204')) {
          const { plan_price, ...payloadWithoutPrice } = insertPayload;
          const retry = await supabase.from('inquiries').insert([payloadWithoutPrice]);
          sbError = retry.error;
        }

        if (!sbError) {
          supabaseSaved = true;

          // Automatically sync email to dedicated newsletter_subscribers table if opted in
          if (formData.email) {
            try {
              const subscriberEmail = formData.email.trim().toLowerCase();
              await supabase.from('newsletter_subscribers').insert([
                {
                  email: subscriberEmail,
                  name: formData.name.trim() || 'Traveler',
                  source: 'Booking Inquiry'
                }
              ]);
            } catch (_) {}
          }
        } else {
          console.warn('Supabase insertion notice:', sbError.message);
        }
      } catch (sbErr) {
        console.warn('Supabase direct insert exception:', sbErr);
      }
    }

    // 2. Transmit to /api/contact for Nodemailer/Titan Email alerts
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          ...formData, 
          plan_price: planPrice,
          _supabase_already_saved: supabaseSaved 
        })
      });

      const data = await response.json().catch(() => ({}));

      if ((response.ok && data.success) || supabaseSaved) {
        setSubmitted(true);
      } else {
        if (data.message && data.message.includes('SMTP_PASS')) {
          setErrorMessage('Vercel SMTP configuration pending: Please add SMTP_PASS in Vercel settings.');
        } else {
          throw new Error(data.message || 'Could not send inquiry.');
        }
      }
    } catch (err) {
      if (supabaseSaved) {
        // Even if local/server email endpoint is offline, data is securely stored in Supabase!
        setSubmitted(true);
      } else {
        console.error('Submission error:', err);
        setErrorMessage(err.message || 'Could not connect with concierge servers. Please connect directly via WhatsApp or Phone below.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div 
          className={`rounded-[28px] p-5 sm:p-8 lg:p-10 border shadow-2xl transition-all duration-300 relative overflow-hidden ${
            isSapphire
              ? 'bg-[#0c1a38] border-amber-500/35 text-white shadow-blue-950/50'
              : isEmerald
                ? 'bg-[#0d2b23] border-emerald-800/60 text-white shadow-emerald-950/40'
                : 'bg-white border-stone-200 text-stone-900 shadow-xl'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Form Details & Real Contact Data */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ${
                  isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-amber-600'
                }`}>
                  {isSapphire ? <Crown className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Custom Itineraries</span>
                </p>
                <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight mb-2.5`}>
                  Voyages of Wonder, Crafted For You
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                  Tell us your vision, pacing, and dream destinations. Our private journey curators will design a personalized proposal within 24 hours.
                </p>
              </div>

              {/* Real Contact Information Cards */}
              <div className="space-y-2.5">
                {/* Direct Email */}
                <a 
                  href="mailto:contact@zentrevo.in"
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.01] ${
                    isSapphire 
                      ? 'bg-[#081226]/70 border-amber-500/30 text-white hover:border-amber-400' 
                      : isEmerald 
                        ? 'bg-emerald-950/40 border-emerald-800/50 text-white hover:border-emerald-500' 
                        : 'bg-stone-50 border-stone-200 text-stone-900 hover:border-stone-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-semibold text-stone-400 block">Official Support Email</span>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">contact@zentrevo.in</span>
                  </div>
                </a>

                {/* Instant WhatsApp Priority Chat */}
                <a 
                  href="https://wa.me/918619928710?text=Hello%20Zentrevo%20Concierge%2C%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20curating%20a%20custom%20luxury%20itinerary.%20Could%20you%20please%20share%20more%20details%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.01] ${
                    isSapphire
                      ? 'bg-[#081226]/80 border-emerald-500/40 text-white hover:border-emerald-400'
                      : isEmerald
                        ? 'bg-emerald-950/60 border-emerald-600/50 text-white hover:border-emerald-400'
                        : 'bg-emerald-50/60 border-emerald-200 text-stone-900 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-emerald-500 block">Fastest Direct Route</span>
                      <span className="text-xs sm:text-sm font-bold tracking-wide">Instant WhatsApp Chat</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                </a>

                {/* Consultation Hours */}
                <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 ${
                  isSapphire 
                    ? 'bg-[#081226]/70 border-amber-500/30' 
                    : isEmerald 
                      ? 'bg-emerald-950/40 border-emerald-800/50' 
                      : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-semibold text-stone-400 block">Consultation Hours</span>
                    <span className="text-xs sm:text-sm font-semibold">24/7 (All 7 Days)</span>
                  </div>
                </div>

                {/* Office Location */}
                <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 ${
                  isSapphire 
                    ? 'bg-[#081226]/70 border-amber-500/30' 
                    : isEmerald 
                      ? 'bg-emerald-950/40 border-emerald-800/50' 
                      : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9.5px] uppercase font-semibold text-stone-400 block">Headquarters / Location</span>
                    <span className="text-xs sm:text-sm font-semibold">Sector 49, Gurugram 122018</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Booking Form */}
            <div className="lg:col-span-7">
              <div className={`p-4 sm:p-6 lg:p-7 rounded-2xl border ${
                isSapphire 
                  ? 'bg-[#081226] border-amber-500/30' 
                  : isEmerald 
                    ? 'bg-[#0a241d] border-emerald-700/40' 
                    : 'bg-stone-50 border-stone-200'
              }`}>
                {submitted ? (
                  <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                      isSapphire ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold">Your Itinerary Request Is Received</h3>
                    <p className={`text-xs sm:text-sm max-w-md mx-auto ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
                      Thank you, <span className={`font-semibold ${isSapphire ? 'text-amber-400' : 'text-emerald-400'}`}>{formData.name || 'valued traveler'}</span>. Our senior team will review your dossier and reply from <strong className="underline">contact@zentrevo.in</strong> within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className={`mt-3 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isSapphire 
                          ? 'bg-amber-400 text-stone-950 hover:bg-amber-300' 
                          : 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                      }`}
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all ${
                            isSapphire
                              ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all ${
                            isSapphire
                              ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all ${
                            isSapphire
                              ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                              : isEmerald
                                ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                                : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                          }`}
                        />
                      </div>

                      <div className="relative" ref={guestsRef}>
                        <label className="text-[10.5px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                          Travelers / Party Size
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setGuestsOpen(!guestsOpen);
                            setDestOpen(false);
                          }}
                          aria-haspopup="listbox"
                          aria-expanded={guestsOpen}
                          className={`w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                            isSapphire
                              ? `bg-[#050b18] text-white ${guestsOpen ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-700 hover:border-slate-500'}`
                              : isEmerald
                                ? `bg-emerald-950/60 text-white ${guestsOpen ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-emerald-800 hover:border-emerald-600'}`
                                : `bg-white text-stone-900 ${guestsOpen ? 'border-stone-800 ring-2 ring-stone-800/10' : 'border-stone-300 hover:border-stone-400'}`
                          }`}
                        >
                          <span className={formData.guests === 'Select Travelers' ? 'text-stone-400' : 'font-medium'}>
                            {formData.guests}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-stone-400 ${guestsOpen ? 'rotate-180 text-amber-400' : ''}`} />
                        </button>

                        {/* Smooth Dropdown Panel */}
                        <div
                          className={`absolute left-0 right-0 mt-2 rounded-2xl p-2 shadow-2xl z-50 border backdrop-blur-xl transition-all duration-200 ease-out origin-top ${
                            guestsOpen 
                              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                          } ${
                            isSapphire
                              ? 'bg-[#091530]/98 border-amber-500/40 text-stone-100 shadow-blue-950/90'
                              : isEmerald
                                ? 'bg-[#0a241d]/98 border-emerald-700/60 text-stone-100 shadow-emerald-950/90'
                                : 'bg-white/98 border-stone-200 text-stone-900 shadow-2xl shadow-stone-300/60'
                          }`}
                        >
                          <div className="max-h-56 overflow-y-auto space-y-1 py-1">
                            {guestsOptions.map((option) => {
                              const isSelected = formData.guests === option;
                              const isDefaultPlaceholder = option === 'Select Travelers';
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, guests: option });
                                    setGuestsOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? isSapphire
                                        ? 'bg-amber-400/20 text-amber-300 font-semibold'
                                        : isEmerald
                                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                                          : 'bg-stone-900 text-white font-semibold'
                                      : isSapphire
                                        ? 'hover:bg-white/10 text-stone-200'
                                        : isEmerald
                                          ? 'hover:bg-white/10 text-stone-200'
                                          : 'hover:bg-stone-100 text-stone-800'
                                  } ${isDefaultPlaceholder ? 'italic text-stone-400 font-normal' : ''}`}
                                >
                                  <span>{option}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative" ref={destRef}>
                      <label className="text-[10.5px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                        Target Destination
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setDestOpen(!destOpen);
                          setGuestsOpen(false);
                        }}
                        aria-haspopup="listbox"
                        aria-expanded={destOpen}
                        className={`w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                          isSapphire
                            ? `bg-[#050b18] text-white ${destOpen ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-700 hover:border-slate-500'}`
                            : isEmerald
                              ? `bg-emerald-950/60 text-white ${destOpen ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-emerald-800 hover:border-emerald-600'}`
                              : `bg-white text-stone-900 ${destOpen ? 'border-stone-800 ring-2 ring-stone-800/10' : 'border-stone-300 hover:border-stone-400'}`
                        }`}
                      >
                        <span className={formData.destination === 'Select Destination' ? 'text-stone-400' : 'font-medium'}>
                          {formData.destination}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-stone-400 ${destOpen ? 'rotate-180 text-amber-400' : ''}`} />
                      </button>

                      {/* Smooth Dropdown Panel */}
                      <div
                        className={`absolute left-0 right-0 mt-2 rounded-2xl p-2 shadow-2xl z-50 border backdrop-blur-xl transition-all duration-200 ease-out origin-top ${
                          destOpen 
                            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        } ${
                          isSapphire
                            ? 'bg-[#091530]/98 border-amber-500/40 text-stone-100 shadow-blue-950/90'
                            : isEmerald
                              ? 'bg-[#0a241d]/98 border-emerald-700/60 text-stone-100 shadow-emerald-950/90'
                              : 'bg-white/98 border-stone-200 text-stone-900 shadow-2xl shadow-stone-300/60'
                        }`}
                      >
                        <div className="max-h-56 overflow-y-auto space-y-1 py-1">
                          {destinationOptions.map((option) => {
                            const isSelected = formData.destination === option;
                            const isDefaultPlaceholder = option === 'Select Destination';
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, destination: option });
                                  setDestOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? isSapphire
                                      ? 'bg-amber-400/20 text-amber-300 font-semibold'
                                      : isEmerald
                                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                                        : 'bg-stone-900 text-white font-semibold'
                                    : isSapphire
                                      ? 'hover:bg-white/10 text-stone-200'
                                      : isEmerald
                                        ? 'hover:bg-white/10 text-stone-200'
                                        : 'hover:bg-stone-100 text-stone-800'
                                } ${isDefaultPlaceholder ? 'italic text-stone-400 font-normal' : ''}`}
                              >
                                <span>{option}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                        Tell Us About Your Desired Journey
                      </label>
                      <textarea
                        rows={2}
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className={`w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all ${
                          isSapphire
                            ? 'bg-[#050b18]/90 border-slate-700 text-white focus:border-amber-400'
                            : isEmerald
                              ? 'bg-emerald-950/60 border-emerald-800 text-white focus:border-emerald-400'
                              : 'bg-white border-stone-300 text-stone-900 focus:border-stone-800'
                        }`}
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-2.5 sm:py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
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
                          <span>Transmitting Dossier...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send My Bespoke Request</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] opacity-60 pt-0.5">
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
