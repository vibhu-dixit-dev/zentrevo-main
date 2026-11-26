import React, { useState, useEffect, useMemo } from 'react';
import { Globe2, Send, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DestinationCarousel } from '../components/DestinationCarousel';
import { getActiveDestinations } from '../data/travelData';
import { getLocalizedDestinationsList, ensureMissingTranslations } from '../i18n/localizedTravelData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export default function InternationalDestinationsPage({
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
      ? "全球奢华度假臻选 | Zentrevo 尊贵旅行"
      : language === 'es'
        ? "Destinos Internacionales Curados | Zentrevo"
        : language === 'ar'
          ? "الرحلات الاستكشافية الدولية | رحلات زينتريفو"
          : "International Curated Expeditions | Zentrevo";
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

  const internationalDestinations = useMemo(() => {
    return localizedList.filter((d) => (d.region || 'international') === 'international');
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
        onOpenInquiry={() => onOpenInquiry('International Expedition Itinerary')}
        onSelectRegion={(reg) => {
          if (reg === 'national' && onNavigate) {
            onNavigate('/destinations/national');
          } else if (reg === 'international') {
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
            <span>{t('internationalPage.breadcrumbHome', 'Home')}</span>
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:underline cursor-pointer"
          >
            {t('internationalPage.breadcrumbDest', 'Destinations')}
          </button>
          <span>/</span>
          <span className="font-semibold text-amber-500">{t('internationalPage.breadcrumbCurrent', 'International')}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b pb-5 border-stone-200/40">
          <div>
            <h1 className={`font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}>
              {t('internationalPage.title', 'Curated International Escapes')}
            </h1>

            <p className={`text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              {t('internationalPage.subtitle', 'Handcrafted journeys across Amalfi cliffs, Kyoto zen sanctuaries, Swiss alpine passes, and Turkish balloon valleys.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Custom Global Expedition')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isSapphire
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-amber-950/30'
                  : isEmerald
                    ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300 shadow-emerald-950/30'
                    : 'bg-stone-950 text-white hover:bg-stone-800 shadow-stone-900/20'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>{t('internationalPage.commissionBtn', 'Contact Us')}</span>
            </button>
          </div>
        </div>

        <section id="international-grid" className="scroll-mt-24 mb-16">
          <DestinationCarousel
            id="international-destinations-carousel"
            title={t('destinations.internationalFilter', 'International')}
            subtitle={`${internationalDestinations.length} ${t('destinations.curatedJourneys', 'curated journeys')}`}
            icon={Globe2}
            items={internationalDestinations}
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
              {t('internationalPage.commissionTitle', 'Seeking a Global Destination Not Listed Here?')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-8 max-w-2xl">
              {t('internationalPage.commissionSubtitle', 'Our expedition designers curate private worldwide itineraries — from the French Riviera and Patagonia to New Zealand fjords.')}
            </p>
            <button
              onClick={() => onOpenInquiry('Custom Global Expedition Request')}
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('internationalPage.commissionBtn', 'Contact Us')}</span>
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
