import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle,
  ArrowRight,
  Stamp,
  Building2,
  FileText,
  CalendarDays,
  MessageCircle,
  Plane
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VISA_TYPES = [
  { id: 'schengen', label: 'Schengen', region: 'Europe', tone: 'from-sky-500 to-indigo-500' },
  { id: 'uk', label: 'UK Visit', region: 'United Kingdom', tone: 'from-rose-500 to-red-600' },
  { id: 'japan', label: 'Japan', region: 'East Asia', tone: 'from-pink-500 to-rose-400' },
  { id: 'bali', label: 'Bali eVisa', region: 'Indonesia', tone: 'from-teal-500 to-emerald-500' },
  { id: 'turkey', label: 'Turkey eVisa', region: 'Anatolia', tone: 'from-amber-500 to-orange-500' },
  { id: 'usa', label: 'USA B1/B2', region: 'North America', tone: 'from-blue-600 to-cyan-500' },
  { id: 'dubai', label: 'UAE Visit', region: 'Middle East', tone: 'from-violet-500 to-fuchsia-500' },
  { id: 'singapore', label: 'Singapore', region: 'Southeast Asia', tone: 'from-emerald-500 to-lime-500' }
];

const HELP_CARDS = [
  {
    icon: FileText,
    titleKey: 'visaModal.card1Title',
    title: '1. Document Checklist',
    descKey: 'visaModal.card1Desc',
    desc: 'A destination-specific checklist covering passport validity, photos, bank statements, cover letters, and supporting proofs for Schengen, Japan, UK, Bali eVisa, Turkey, and more.',
    points: ['Passport & photo requirements', 'Financial & employment proofs', 'Country-specific extras']
  },
  {
    icon: Building2,
    titleKey: 'visaModal.card2Title',
    title: '2. Appointment Booking',
    descKey: 'visaModal.card2Desc',
    desc: 'Clear guidance on when and how to book consular or visa-center slots, including buffer time before departure and what to expect on appointment day.',
    points: ['Slot timing recommendations', 'VFS / embassy center tips', 'What to carry on the day']
  },
  {
    icon: Stamp,
    titleKey: 'visaModal.card3Title',
    title: '3. Confirmed Vouchers',
    descKey: 'visaModal.card3Desc',
    desc: 'Hotel and flight vouchers prepared to embassy presentation standards so your itinerary looks consistent, verifiable, and travel-ready.',
    points: ['Hotel confirmation letters', 'Flight reservation proofs', 'Aligned day-by-day plan']
  },
  {
    icon: CalendarDays,
    titleKey: 'visaModal.card4Title',
    title: '4. Journey Review',
    descKey: 'visaModal.card4Desc',
    desc: 'A final planner review of forms and paperwork before submission — catching missing pages, date mismatches, and common rejection triggers.',
    points: ['Form accuracy check', 'Date & name consistency', 'Pre-submission walkthrough']
  }
];

const VISUAL_MOMENTS = [
  {
    title: 'Passport readiness',
    caption: 'Validity, blank pages, and photo specs checked before you apply.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Embassy-ready file',
    caption: 'Organised proofs that match your itinerary and travel dates.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Departure confidence',
    caption: 'Clear next steps so you focus on the journey, not the paperwork.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80'
  }
];

const FLOW_STEPS = [
  {
    title: 'Tell us where you are headed',
    text: 'Share destination, travel window, passport details, and who is travelling.'
  },
  {
    title: 'Get a tailored checklist',
    text: 'Receive document requirements and appointment timing guidance for that visa type.'
  },
  {
    title: 'Prepare vouchers & forms',
    text: 'We help align hotel/flight proofs and review paperwork before submission.'
  },
  {
    title: 'Submit with clarity',
    text: 'You submit to the embassy or visa center — they alone decide the outcome.'
  }
];

const SKY_PLANES = [
  { top: '7%', size: 28, duration: '14s', delay: '-2s', dir: 'ltr' },
  { top: '16%', size: 22, duration: '18s', delay: '-7s', dir: 'rtl' },
  { top: '27%', size: 32, duration: '16s', delay: '-4s', dir: 'ltr' },
  { top: '38%', size: 20, duration: '20s', delay: '-11s', dir: 'rtl' },
  { top: '49%', size: 26, duration: '15s', delay: '-1s', dir: 'ltr' },
  { top: '61%', size: 18, duration: '19s', delay: '-9s', dir: 'rtl' },
  { top: '72%', size: 30, duration: '17s', delay: '-5s', dir: 'ltr' },
  { top: '83%', size: 24, duration: '21s', delay: '-13s', dir: 'rtl' }
];

function PlaneSky({ isDark }) {
  return (
    <div
      className={`visa-plane-sky ${isDark ? 'visa-plane-sky--dark' : 'visa-plane-sky--light'}`}
      aria-hidden="true"
    >
      {SKY_PLANES.map((plane, index) => (
        <span
          key={index}
          className={`visa-plane ${plane.dir === 'ltr' ? 'visa-plane--ltr' : 'visa-plane--rtl'}`}
          style={{
            top: plane.top,
            animationDuration: plane.duration,
            animationDelay: plane.delay
          }}
        >
          <Plane
            width={plane.size}
            height={plane.size}
            strokeWidth={1.75}
            absoluteStrokeWidth
          />
        </span>
      ))}
    </div>
  );
}

export default function VisaModal({
  isOpen,
  onClose,
  onGoAhead,
  currentTheme = 'editorial'
}) {
  const { t } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;
  const [activeVisa, setActiveVisa] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setInterval(() => {
      setActiveVisa((prev) => (prev + 1) % VISA_TYPES.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const pageBg = isSapphire
    ? 'bg-[#071226] text-stone-100'
    : isEmerald
      ? 'bg-[#071a15] text-stone-100'
      : 'bg-[#f7f5f1] text-stone-900';

  const cardBg = isDark
    ? 'bg-white/[0.04] border-white/10'
    : 'bg-white border-stone-200 shadow-sm';

  const active = VISA_TYPES[activeVisa];

  return (
    <div
      className="fixed inset-0 z-50 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={t('visaModal.title', 'Visa Guidance & Document Support')}
    >
      <div className={`relative w-full h-full overflow-hidden flex flex-col ${pageBg}`}>
        <PlaneSky isDark={isDark} />

        <button
          onClick={onClose}
          aria-label="Close visa assistance"
          className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 shadow-sm'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 overflow-y-auto flex-1">
          <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 py-8 sm:py-10 space-y-8">
            {/* Hero */}
            <section className="visa-fade-up space-y-5">
              <header className="max-w-2xl space-y-3 pr-10">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}>
                  {t('visaModal.topTag', 'Consular & Travel Documentation Advisory')}
                </p>

                <h1 className={`font-editorial text-3xl sm:text-[2.6rem] font-bold tracking-tight leading-[1.15] ${
                  isDark ? 'text-white' : 'text-stone-950'
                }`}>
                  {t('visaModal.title', 'Visa Guidance & Document Support')}
                </h1>

                <p className={`text-sm sm:text-[15px] leading-relaxed ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {t(
                    'visaModal.subtitleExpanded',
                    'Preparation support for Indian passport holders — requirement checklists, appointment guidance, embassy-ready vouchers, and a final paperwork review before you submit.'
                  )}
                </p>
              </header>

              <div className={`relative h-[200px] sm:h-[240px] overflow-hidden rounded-2xl ${
                isDark ? 'bg-[#0a1428]' : 'bg-stone-200'
              }`}>
                <img
                  src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80"
                  alt="Travel documentation and journey planning"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-xs sm:text-sm text-white/95 font-medium">
                  Currently reviewing files for <span className="font-bold">{active.label}</span>
                  <span className="text-white/70"> · {active.region}</span>
                </p>
              </div>
            </section>

            {/* Visa types */}
            <section className="visa-fade-up space-y-3" style={{ animationDelay: '80ms' }}>
              <h2 className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                Visa types we commonly support
              </h2>

              <div className="overflow-hidden">
                <div className="visa-marquee-track flex w-max gap-2">
                  {[...VISA_TYPES, ...VISA_TYPES].map((visa, index) => {
                    const isActive = visa.id === active.id;
                    return (
                      <button
                        key={`${visa.id}-${index}`}
                        type="button"
                        onClick={() => setActiveVisa(VISA_TYPES.findIndex((v) => v.id === visa.id))}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                          isActive
                            ? isSapphire
                              ? 'bg-amber-400 text-stone-950 border-amber-300'
                              : isEmerald
                                ? 'bg-emerald-400 text-stone-950 border-emerald-300'
                                : 'bg-stone-900 text-white border-stone-900'
                            : isDark
                              ? 'bg-transparent text-stone-300 border-white/15 hover:border-white/30'
                              : 'bg-transparent text-stone-700 border-stone-300 hover:border-stone-500'
                        }`}
                      >
                        {visa.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Quiet policy note */}
            <aside
              className={`visa-fade-up pl-4 sm:pl-5 border-l-2 ${
                isDark ? 'border-amber-400/50' : 'border-stone-900'
              }`}
              style={{ animationDelay: '120ms' }}
            >
              <p className={`text-sm sm:text-base font-editorial leading-snug mb-2 ${
                isDark ? 'text-stone-100' : 'text-stone-900'
              }`}>
                {t('visaModal.policyQuote', '"Visa guidance and document support. The embassy decides approval."')}
              </p>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                {t(
                  'visaModal.policyDisclaimer',
                  "We never promise, guarantee, or influence visa outcomes. All visa decisions, processing times, and approvals rest strictly and solely with the respective country's sovereign embassy or consulate."
                )}
              </p>
            </aside>

            {/* Picture moments */}
            <section className="visa-fade-up space-y-3" style={{ animationDelay: '160ms' }}>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}>
                What preparation looks like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {VISUAL_MOMENTS.map((moment) => (
                  <article
                    key={moment.title}
                    className={`rounded-2xl overflow-hidden border ${
                      isDark ? 'border-white/10' : 'border-stone-200'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={moment.image}
                        alt={moment.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className={`p-3.5 ${isDark ? 'bg-white/[0.03]' : 'bg-white'}`}>
                      <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-950'}`}>
                        {moment.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        {moment.caption}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Help cards */}
            <section className="visa-fade-up space-y-4" style={{ animationDelay: '200ms' }}>
              <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? 'text-stone-300' : 'text-stone-800'
              }`}>
                <CheckCircle className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>{t('visaModal.whatWeHelpWith', 'What Your Planner Helps You With')}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HELP_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article key={card.titleKey} className={`p-5 rounded-2xl border ${cardBg}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                        isSapphire
                          ? 'bg-amber-400/15 text-amber-300'
                          : isEmerald
                            ? 'bg-emerald-400/15 text-emerald-300'
                            : 'bg-stone-100 text-stone-800'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className={`font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-stone-950'}`}>
                        {t(card.titleKey, card.title)}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                        {t(card.descKey, card.desc)}
                      </p>
                      <ul className="space-y-1.5">
                        {card.points.map((point) => (
                          <li
                            key={point}
                            className={`text-xs flex items-start gap-2 ${
                              isDark ? 'text-stone-400' : 'text-stone-500'
                            }`}
                          >
                            <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
                              isSapphire ? 'bg-amber-400' : isEmerald ? 'bg-emerald-400' : 'bg-stone-400'
                            }`} />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Animated steps */}
            <section className={`visa-fade-up p-5 sm:p-6 rounded-2xl border ${cardBg}`} style={{ animationDelay: '240ms' }}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-5 ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}>
                How the support usually flows
              </h3>
              <ol className="space-y-4">
                {FLOW_STEPS.map((step, index) => (
                  <li key={step.title} className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isSapphire
                          ? 'bg-amber-400 text-stone-950'
                          : isEmerald
                            ? 'bg-emerald-400 text-stone-950'
                            : 'bg-stone-950 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      {index < FLOW_STEPS.length - 1 && (
                        <span className={`absolute left-1/2 top-8 -translate-x-1/2 w-px h-6 ${
                          isDark ? 'bg-white/15' : 'bg-stone-200'
                        }`} />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-stone-950'}`}>
                        {step.title}
                      </p>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className={`visa-fade-up p-4 rounded-2xl border text-sm flex items-start gap-3 ${
              isDark
                ? 'bg-black/20 border-white/10 text-stone-300'
                : 'bg-white border-stone-200 text-stone-700'
            }`} style={{ animationDelay: '280ms' }}>
              <MessageCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-stone-700'}`} />
              <p className="leading-relaxed">
                {t(
                  'visaModal.footerNote',
                  'Have specific visa questions before booking? Message our dedicated planner directly on WhatsApp.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className={`relative z-10 p-4 sm:p-5 border-t shrink-0 ${
          isSapphire
            ? 'bg-[#060e20]/95 border-amber-500/20'
            : isEmerald
              ? 'bg-[#061510]/95 border-emerald-800/40'
              : 'bg-white/95 border-stone-200'
        }`}>
          <div className="max-w-3xl mx-auto flex justify-end">
            <button
              type="button"
              onClick={onGoAhead}
              className={`px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer ${
                isSapphire
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-amber-400/20'
                  : isEmerald
                    ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-400/20'
                    : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/20'
              }`}
            >
              <span>{t('visaModal.continueBtn', 'Got It, Continue to Contact Page')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
