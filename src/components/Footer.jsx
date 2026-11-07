import React, { useState } from 'react';
import { Compass, ArrowRight, Check, Globe, Share2, Mail, Crown, Sparkles, Loader2 } from 'lucide-react';
import { SOCIAL_CHANNELS } from '../data/socialChannels';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ currentTheme, onSelectTheme, onNavigate }) {
  const { t } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleLinkClick = (path) => (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubmitting(true);
    setSubmitError('');

    const cleanEmail = newsletterEmail.trim().toLowerCase();

    // Local fallback queue so the subscriber is never lost
    try {
      const stored = JSON.parse(localStorage.getItem('zentrevo_local_subscribers') || '[]');
      if (!stored.some(s => s.email === cleanEmail)) {
        stored.push({
          email: cleanEmail,
          name: 'Journal Subscriber',
          source: 'Website Footer',
          subscribed_at: new Date().toISOString()
        });
        localStorage.setItem('zentrevo_local_subscribers', JSON.stringify(stored));
      }
    } catch {}

    // 1. Direct Persist to Supabase dedicated newsletter_subscribers table
    if (supabase) {
      try {
        const { error: insertErr } = await supabase
          .from('newsletter_subscribers')
          .insert([
            {
              email: cleanEmail,
              name: 'Journal Subscriber',
              source: 'Website Footer'
            }
          ]);

        if (insertErr && insertErr.code !== '23505') {
          console.warn('Supabase newsletter subscriber notice:', insertErr.message || insertErr);
        }
      } catch (dbErr) {
        console.warn('Supabase newsletter insert note:', dbErr);
      }
    }

    // 2. Send welcome / verification ping to serverless handler
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      }).catch(() => {});
    } catch (_) {}

    setSubscribed(true);
    setIsSubmitting(false);
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
            <div className="flex items-center">
              <img 
                src="/zentrevo-logo-white.png" 
                alt="Zentrevo Curated Journeys" 
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
            
            <p className="text-xs sm:text-sm text-stone-300 max-w-sm leading-relaxed">
              {t('footer.aboutDesc', 'Curating private, architectural, and culturally immersive journeys for discerning travelers across 48 countries worldwide.')}
            </p>

            <div className="text-xs text-stone-300 space-y-1 pt-1">
              <p><span className="text-white font-semibold">{t('footer.hqLabel', 'Headquarters:')}</span> Sector 49, Gurugram 122018</p>
              <p><span className="text-white font-semibold">{t('footer.emailLabel', 'Email:')}</span> <a href="mailto:contact@zentrevo.in" className="hover:text-amber-400 underline">contact@zentrevo.in</a></p>
              <p><span className="text-white font-semibold">{t('footer.phoneLabel', 'Phone:')}</span> <a href="tel:+918619928710" className="hover:text-amber-400">+91 86199 28710</a></p>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300 block mb-2.5">
                {t('footer.officialChannels', 'Official Channels')}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_CHANNELS.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${social.name} • ${social.handle}`}
                      aria-label={social.name}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${social.brandClass}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.colExpeditions', 'Expeditions')}
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Amalfi Coast, Italy</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Kyoto Temples, Japan</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Swiss Glacier Rail</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Cappadocia Valley</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Bali River Sanctum</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.colCompany', 'Company')}
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li><a href="#values" className="hover:text-amber-400 transition-colors">{t('footer.linkBeliefs', 'Our Core Beliefs')}</a></li>
              <li><a href="#experiences" className="hover:text-amber-400 transition-colors">{t('footer.linkWhyChoose', 'Why Choose Us')}</a></li>
              <li><a href="#stories" className="hover:text-amber-400 transition-colors">{t('footer.linkStories', 'Stories & Journals')}</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">{t('footer.linkFaq', 'FAQ & Support')}</a></li>
              <li><a href="#inquiry" className="hover:text-amber-400 transition-colors">{t('footer.linkConcierge', 'Private Concierge')}</a></li>
              <li>
                <a 
                  href="/cancellation-and-refund" 
                  onClick={handleLinkClick('/cancellation-and-refund')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  {t('footer.linkRefund', 'Cancellation & Refund')}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.journalHeading', 'The Private Journal')}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {t('footer.journalDesc', 'Receive exclusive invitation-only itinerary journeys and seasonal destination dispatches once a month.')}
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs">
                <Check className="w-4 h-4 text-amber-400" />
                <span>{t('footer.newsletterSuccess', "You're subscribed to the Private Journal.")}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  id="footer-newsletter-email"
                  name="newsletterEmail"
                  aria-label={t('footer.newsletterPlaceholder', 'Enter your email')}
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('footer.newsletterPlaceholder', 'Enter your email')}
                  className="bg-stone-800/80 border border-stone-700 text-xs px-4 py-2.5 rounded-full text-white focus:outline-none focus:border-amber-400 flex-1"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                    isSubmitting ? 'opacity-70 cursor-wait' : ''
                  } ${
                    isSapphire 
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300' 
                      : isEmerald 
                        ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300' 
                        : 'bg-white text-stone-950 hover:bg-stone-200'
                  }`}
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{t('footer.newsletterBtn', 'Subscribe')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Full-width Luxury Social Discovery Ribbon */}
        <div className={`mt-10 p-5 sm:p-6 rounded-3xl border flex flex-col lg:flex-row items-center justify-between gap-5 transition-all ${
          isSapphire
            ? 'bg-[#081226]/85 border-amber-500/25 text-stone-200'
            : isEmerald
              ? 'bg-emerald-950/40 border-emerald-800/40 text-stone-200'
              : 'bg-stone-800/60 border-stone-800 text-stone-300'
        }`}>
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isSapphire ? 'bg-amber-400/20 text-amber-400' : isEmerald ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Join Our Global Expedition Community</p>
              <p className="text-[11px] text-stone-400">Exclusive visual journals, architectural reels, and real-time expedition dispatches.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {SOCIAL_CHANNELS.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${social.name}: ${social.handle}`}
                  aria-label={social.name}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                    isSapphire
                      ? 'bg-[#050b18] border-slate-700/80 text-stone-200'
                      : isEmerald
                        ? 'bg-emerald-950/80 border-emerald-800/70 text-stone-200'
                        : 'bg-stone-900 border-stone-700 text-stone-200'
                  } ${social.pillClass} hover:scale-105 hover:shadow-md`}
                >
                  <IconComponent className={`w-3.5 h-3.5 shrink-0 ${social.iconColor}`} />
                  <span className="text-[11px]">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300 font-medium">
          <div>
            © {new Date().getFullYear()} ZENTREVO Travel Co. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={handleCycleTheme}
              className="text-stone-300 hover:text-amber-400 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Current Theme:</span>
              <span className="font-semibold text-white uppercase">{currentTheme}</span>
              <span className="underline ml-1">Switch</span>
            </button>
            <a 
              href="/privacy-policy" 
              onClick={handleLinkClick('/privacy-policy')}
              className="text-stone-300 hover:text-amber-400 transition-colors"
            >
              {t('footer.privacyPolicy')}
            </a>
            <a 
              href="/terms-of-service" 
              onClick={handleLinkClick('/terms-of-service')}
              className="text-stone-300 hover:text-amber-400 transition-colors"
            >
              {t('footer.termsOfService')}
            </a>
            <a 
              href="/cancellation-and-refund" 
              onClick={handleLinkClick('/cancellation-and-refund')}
              className="text-stone-300 hover:text-amber-400 transition-colors"
            >
              {t('footer.cancellationPolicy')}
            </a>
            <a href="/admin" className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium">Concierge Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
