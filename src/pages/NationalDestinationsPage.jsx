import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Send, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DestinationCarousel } from '../components/DestinationCarousel';
import { getActiveDestinations } from '../data/travelData';
import { getLocalizedDestinationsList, ensureMissingTranslations } from '../i18n/localizedTravelData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export default function NationalDestinationsPage({
  currentTheme = 'editorial',
  onSelectTheme,
  onSelectDestination,
  onNavigateHome,
  onNavigate,
  onOpenInquiry,
  onOpenJournal,
  onOpenVisa
}) {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();

  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isDark = isEmerald || isSapphire;

  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'zh'
      ? "印度专属私享旅程 | Zentrevo 尊享旅行"
      : language === 'es'
        ? "Viajes Curados por la India | Zentrevo"
        : language === 'ar'
          ? "رحلات الهند الفاخرة | رحلات زينتريفو"
          : "National Journeys & Curated Expeditions Across India | Zentrevo";
  }, [language]);

  useEffect(() => {
    const handleSync = () => {
      setDestinationsList(getActiveDestinations());
    };
    window.addEventListener('zentrevo_destinations_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('zentrevo_destinations_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  useEffect(() => {
    ensureMissingTranslations(destinationsList, language);
  }, [destinationsList, language]);

  const localizedList = useMemo(() => {
    return getLocalizedDestinationsList(destinationsList, language);
  }, [destinationsList, language]);

  const nationalDestinations = useMemo(() => {
    return localizedList.filter((d) => (d.region || 'international') === 'national');
  }, [localizedList]);

  return (
    <div className={`min-h-screen font-sans-clean transition-colors duration-500 ${
      isSapphire
        ? 'bg-[#050a16] text-stone-100'
        : isEmerald
          ? 'bg-[#061813] text-stone-100'
          : 'bg-[#faf9f6] text-stone-900'
    }`}>
      <Navbar
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onOpenInquiry={() => onOpenInquiry('National India Itinerary')}
        onSelectRegion={(reg) => {
          if (reg === 'international' && onNavigate) {
            onNavigate('/destinations/international');
          } else if (reg === 'national') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenJournal={onOpenJournal}
        onOpenVisa={onOpenVisa}
        onNavigate={onNavigate}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-3 opacity-75">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('nationalPage.breadcrumbHome', 'Home')}</span>
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:underline cursor-pointer"
          >
            {t('nationalPage.breadcrumbDest', 'Destinations')}
          </button>
          <span>/</span>
          <span className="font-semibold text-amber-500">{t('nationalPage.breadcrumbCurrent', 'National (India)')}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b pb-5 border-stone-200/40">
          <div>
            <h1 className={`font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              {t('nationalPage.title', 'Curated India Journeys')}
            </h1>

            <p className={`text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              {t('nationalPage.subtitle', 'From high Himalayan frontier valleys and Kashmiri royal houseboats to Udaipur lake palaces and tranquil Kerala backwaters.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Bespoke India Itinerary')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isSapphire
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-amber-950/30'
                  : isEmerald
                    ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-950/30'
                    : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/20'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>{t('nationalPage.commissionBtn', 'Commission a Bespoke Itinerary')}</span>
            </button>
          </div>
        </div>

        <section id="national-grid" className="scroll-mt-24 mb-16">
          <DestinationCarousel
            id="national-destinations-carousel"
            title={t('destinations.nationalFilter', 'National')}
            subtitle={`${nationalDestinations.length} ${t('destinations.curatedJourneys', 'curated journeys')}`}
            icon={MapPin}
            items={nationalDestinations}
            currentTheme={currentTheme}
            onSelectDestination={onSelectDestination}
            formatPrice={formatPrice}
            t={t}
          />
        </section>

        <section className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden mb-16 ${
          isSapphire
            ? 'bg-gradient-to-r from-[#0a1738] to-[#0c1f4e] border-amber-500/30 text-white'
            : isEmerald
              ? 'bg-gradient-to-r from-[#08221b] to-[#0d3429] border-emerald-800/50 text-white'
              : 'bg-gradient-to-r from-stone-900 to-stone-950 text-white border-stone-800 shadow-xl'
        }`}>
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold mb-4 leading-tight">
              {t('nationalPage.commissionTitle', 'Looking for an Untouched Corner of India?')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-8 max-w-2xl">
              {t('nationalPage.commissionSubtitle', 'We design tailored private journeys across all 28 states — Kaziranga wildlife lodges, Spiti cliff retreats, or private Chettinad heritage mansions.')}
            </p>
            <button
              onClick={() => onOpenInquiry('Bespoke India Custom Request')}
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('nationalPage.commissionBtn', 'Commission a Bespoke Itinerary')}</span>
            </button>
          </div>
        </section>
      </main>

      <Footer
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        onNavigate={onNavigate}
      />
    </div>
  );
}
