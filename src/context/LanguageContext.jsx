import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext();

// Instant 0ms Zero-Flicker Browser & Timezone Detection
const detectInitialLanguage = () => {
  try {
    // 1. Explicit URL parameter for testing/direct links (e.g. ?lang=zh, ?lang=es, ?lang=ar, ?lang=en)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang && ['en', 'zh', 'es', 'ar'].includes(urlLang.toLowerCase())) {
        return { language: urlLang.toLowerCase(), isManual: true };
      }
    }

    // 2. Instant client-side browser languages list (e.g., ['zh-CN', 'zh', 'en'])
    const browserLangs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language || ''])) || [];
    
    // Check if the primary/preferred browser language is Chinese, Spanish, or Arabic
    for (const rawLang of browserLangs) {
      const langLower = String(rawLang).toLowerCase();
      if (langLower.startsWith('zh')) return { language: 'zh', isManual: false };
      if (langLower.startsWith('es')) return { language: 'es', isManual: false };
      if (langLower.startsWith('ar')) return { language: 'ar', isManual: false };
    }

    // 3. Instant client-side timezone heuristic (0ms, zero flicker, runs before first paint)
    const tz = (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) || '';
    if (
      tz.includes('Shanghai') ||
      tz.includes('Chongqing') ||
      tz.includes('Urumqi') ||
      tz.includes('Harbin') ||
      tz.includes('Taipei') ||
      tz.includes('Hong_Kong') ||
      tz.includes('Macau') ||
      tz.includes('China')
    ) {
      return { language: 'zh', isManual: false };
    }

    if (
      tz.includes('Madrid') ||
      tz.includes('Mexico') ||
      tz.includes('Buenos_Aires') ||
      tz.includes('Bogota') ||
      tz.includes('Santiago') ||
      tz.includes('Lima') ||
      tz.includes('Caracas') ||
      tz.includes('Montevideo') ||
      tz.includes('Asuncion') ||
      tz.includes('Guatemala') ||
      tz.includes('Havana') ||
      tz.includes('Panama') ||
      tz.includes('Costa_Rica')
    ) {
      return { language: 'es', isManual: false };
    }

    if (
      tz.includes('Dubai') ||
      tz.includes('Riyadh') ||
      tz.includes('Cairo') ||
      tz.includes('Doha') ||
      tz.includes('Kuwait') ||
      tz.includes('Muscat') ||
      tz.includes('Bahrain') ||
      tz.includes('Baghdad') ||
      tz.includes('Amman') ||
      tz.includes('Beirut') ||
      tz.includes('Casablanca')
    ) {
      return { language: 'ar', isManual: false };
    }

    // Default global fallback
    return { language: 'en', isManual: false };
  } catch {
    return { language: 'en', isManual: false };
  }
};

export const LanguageProvider = ({ children }) => {
  const initial = detectInitialLanguage();
  const [language, setLanguageState] = useState(initial.language);
  const [hasUrlOverride] = useState(initial.isManual);

  // Apply HTML lang and direction (RTL for Arabic, LTR for others)
  useEffect(() => {
    const isArabic = language === 'ar';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      if (isArabic) {
        document.documentElement.classList.add('rtl-mode');
      } else {
        document.documentElement.classList.remove('rtl-mode');
      }
    }
  }, [language]);

  // Background Edge/Geo Verification (Refine language based on real geolocation header)
  useEffect(() => {
    if (hasUrlOverride) return;

    let isMounted = true;
    const verifyCountryLanguage = async () => {
      try {
        let country = null;
        try {
          const res = await fetch('/api/geo');
          if (res.ok) {
            const data = await res.json();
            if (data?.country) country = data.country.toUpperCase();
          }
        } catch {}

        if (!country) {
          try {
            const res = await fetch('https://api.country.is/');
            if (res.ok) {
              const data = await res.json();
              if (data?.country) country = data.country.toUpperCase();
            }
          } catch {}
        }

        if (isMounted && country) {
          // Chinese territories (China, Taiwan, Hong Kong, Macau)
          if (['CN', 'TW', 'HK', 'MO'].includes(country)) {
            setLanguageState('zh');
          }
          // Spanish-speaking nations (Spain, Mexico, Argentina, Colombia, etc.)
          else if (['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR'].includes(country)) {
            setLanguageState('es');
          }
          // Arabic-speaking nations (UAE, Saudi Arabia, Egypt, Qatar, Kuwait, Oman, Bahrain, etc.)
          else if (['AE', 'SA', 'EG', 'QA', 'KW', 'OM', 'BH', 'JO', 'LB', 'IQ', 'MA', 'DZ', 'TN', 'LY', 'SD', 'YE', 'SY', 'PS'].includes(country)) {
            setLanguageState('ar');
          }
        }
      } catch (err) {
        console.warn('Geo language detection retained instant browser heuristic:', err);
      }
    };

    verifyCountryLanguage();
    return () => { isMounted = false; };
  }, [hasUrlOverride]);

  // Manual language switcher
  const setLanguage = useCallback((newLang) => {
    if (!['en', 'zh', 'es', 'ar'].includes(newLang)) return;
    setLanguageState(newLang);
    setIsManualOverride(true);
    try {
      localStorage.setItem('zentrevo_language', newLang);
      localStorage.setItem('zentrevo_language_manual', 'true');
    } catch {}
  }, []);

  // Universal translation lookup helper: e.g. t('nav.planJourney')
  const t = useCallback((path, fallback = '') => {
    if (!path) return fallback;
    const keys = path.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in selected language
        let fallbackCurrent = translations['en'];
        for (const fbKey of keys) {
          if (fallbackCurrent && fallbackCurrent[fbKey] !== undefined) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return fallback || path;
          }
        }
        return fallbackCurrent || fallback || path;
      }
    }

    return current || fallback || path;
  }, [language]);

  const activeLangMeta = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        currentLanguageMeta: activeLangMeta,
        availableLanguages: LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
