import React, { useState, useEffect, useMemo } from 'react';
import { getActiveDestinations } from '../data/travelData';
import { X, Search, MapPin, Globe2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDestinationsList, ensureMissingTranslations } from '../i18n/localizedTravelData';
import { DestinationCarousel } from './DestinationCarousel';

export default function DestinationsGrid({
  currentTheme,
  onSelectDestination,
  selectedRegion = 'all',
  searchFilter = null,
  onClearSearchFilter
}) {
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';
  const isEditorial = currentTheme === 'editorial';

  const [destinationsList, setDestinationsList] = useState(getActiveDestinations);

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

  useEffect(() => {
    if (selectedRegion === 'national' || selectedRegion === 'international') {
      const target = document.getElementById(
        selectedRegion === 'national' ? 'destinations-national' : 'destinations-international'
      );
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedRegion]);

  const localizedList = useMemo(() => {
    return getLocalizedDestinationsList(destinationsList, language);
  }, [destinationsList, language]);

  const hasActiveSearch = Boolean(
    searchFilter && (searchFilter.destinationId || searchFilter.destinationTitle || searchFilter.destinationLocation || searchFilter.label || searchFilter.query)
  );

  const searchMatched = useMemo(() => {
    if (!hasActiveSearch) return null;
    return localizedList.filter((d) => {
      if (searchFilter.destinationId && String(d.id) === String(searchFilter.destinationId)) {
        return true;
      }
      const qTitle = (searchFilter.destinationTitle || '').toLowerCase();
      const qLoc = (searchFilter.destinationLocation || '').toLowerCase();
      const qRaw = (searchFilter.query || searchFilter.label || '').toLowerCase().trim();
      const dTitle = (d.title || '').toLowerCase();
      const dLoc = (d.location || '').toLowerCase();
      const dState = (d.state || '').toLowerCase();
      const dCountry = (d.country || '').toLowerCase();
      const dHighlights = Array.isArray(d.highlights) ? d.highlights.join(' ').toLowerCase() : '';
      const dDesc = (d.description || '').toLowerCase();

      if (qTitle && dTitle.includes(qTitle)) return true;
      if (qLoc && dLoc.includes(qLoc)) return true;
      if (qRaw) {
        return (
          dTitle.includes(qRaw) ||
          dLoc.includes(qRaw) ||
          dState.includes(qRaw) ||
          dCountry.includes(qRaw) ||
          dHighlights.includes(qRaw) ||
          dDesc.includes(qRaw)
        );
      }
      return false;
    });
  }, [hasActiveSearch, searchFilter, localizedList]);

  const sourceList = searchMatched || localizedList;

  const nationalDestinations = useMemo(
    () => sourceList.filter((d) => (d.region || 'international') === 'national'),
    [sourceList]
  );

  const internationalDestinations = useMemo(
    () => sourceList.filter((d) => (d.region || 'international') === 'international'),
    [sourceList]
  );

  return (
    <section id="destinations" className="px-4 sm:px-8 py-12 sm:py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 max-w-3xl">
          <h2 className={`${isEditorial ? 'font-editorial font-normal' : 'font-sans font-bold'} text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight ${
            isSapphire || isEmerald ? 'text-stone-100' : 'text-stone-900'
          }`}>
            {t('destinations.headingMain', 'The Most Amazing Travel Packages Every Traveler Dreams Of.')}
          </h2>
        </div>

        {hasActiveSearch && (
          <div className={`mb-8 p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 animate-fadeIn ${
            isSapphire
              ? 'bg-[#091530] border-amber-500/40 text-stone-100'
              : isEmerald
                ? 'bg-[#08221a] border-emerald-700/50 text-stone-100'
                : 'bg-white border-stone-300 text-stone-900 shadow-sm'
          }`}>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isSapphire ? 'bg-amber-400/20 text-amber-300' : isEmerald ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-100 text-stone-800'
              }`}>
                <Search className="w-3 h-3" />
                <span>Filtered Result</span>
              </span>
              <span className="font-semibold">
                {searchFilter.query || searchFilter.label || searchFilter.destinationTitle || searchFilter.destinationLocation}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onClearSearchFilter) onClearSearchFilter();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                isSapphire
                  ? 'border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-stone-950'
                  : isEmerald
                    ? 'border-emerald-600/50 text-emerald-300 hover:bg-emerald-400 hover:text-stone-950'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-950 hover:text-white'
              }`}
            >
              <span>Show All Journeys</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="space-y-10 sm:space-y-12">
          <DestinationCarousel
            id="destinations-national"
            title={t('destinations.nationalFilter', 'National')}
            subtitle={`${nationalDestinations.length} ${t('destinations.curatedJourneys', 'curated journeys')}`}
            icon={MapPin}
            items={nationalDestinations}
            currentTheme={currentTheme}
            onSelectDestination={onSelectDestination}
            formatPrice={formatPrice}
            t={t}
          />

          <DestinationCarousel
            id="destinations-international"
            title={t('destinations.internationalFilter', 'International')}
            subtitle={`${internationalDestinations.length} ${t('destinations.curatedJourneys', 'curated journeys')}`}
            icon={Globe2}
            items={internationalDestinations}
            currentTheme={currentTheme}
            onSelectDestination={onSelectDestination}
            formatPrice={formatPrice}
            t={t}
          />
        </div>
      </div>
    </section>
  );
}
