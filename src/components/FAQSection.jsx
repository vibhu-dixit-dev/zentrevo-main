import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export default function FAQSection({ currentTheme, onOpenInquiry }) {
  const { t, language } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [openIndex, setOpenIndex] = useState(0);

  const faqs = (translations[language] && translations[language].faq && translations[language].faq.items) 
    ? translations[language].faq.items 
    : translations.en.faq.items;

  return (
    <section id="faq" className="px-4 sm:px-8 py-16 scroll-mt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-amber-500/30 bg-amber-400/10 text-amber-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('faq.badge', 'Frequently Asked Questions')}</span>
          </div>

          <h2 className={`${isEditorial ? 'font-editorial' : 'font-sans'} text-2xl sm:text-4xl font-bold tracking-tight`}>
            {t('faq.heading', 'Everything You Need to Know Before Booking')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            {t('faq.subheading', 'Clear answers on custom planning, visa support, pricing, and our on-ground concierge.')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isSapphire
                    ? 'bg-[#081226]/80 border-amber-500/25 text-stone-100'
                    : isEmerald
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-stone-100'
                      : 'bg-white border-stone-200 text-stone-900 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-amber-400 text-stone-950' : 'bg-black/10 dark:bg-white/10'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm leading-relaxed opacity-85 border-t border-stone-200/10 mt-1">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Pill Banner */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isSapphire
            ? 'bg-[#050b18] border-slate-700/80 text-stone-300'
            : isEmerald
              ? 'bg-emerald-950/80 border-emerald-800/70 text-stone-300'
              : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}>
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('faq.whatsAppPrompt', 'Have a unique itinerary question? Talk directly with a travel planner on WhatsApp.')}</span>
          </div>

          <button
            type="button"
            onClick={onOpenInquiry}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer shrink-0 ${
              isSapphire
                ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                : isEmerald
                  ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <span>{t('faq.askPlannerBtn', 'Ask a Planner')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
