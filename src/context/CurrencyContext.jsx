import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_EXCHANGE_RATES, formatCurrencyPrice, convertPriceAmount } from '../lib/currencyUtils';

const CurrencyContext = createContext();

const DEFAULT_INR_RATE = DEFAULT_EXCHANGE_RATES.INR;

// Instant 0ms Timezone & Locale Heuristic
const detectInitialCurrency = () => {
  try {
    // 1. Manual user override stored in browser
    const saved = localStorage.getItem('zentrevo_currency');
    if (saved === 'INR' || saved === 'USD') {
      return { currency: saved, isManual: true };
    }

    // 2. Instant client-side timezone check (0ms, no network delay)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (
      tz.includes('Calcutta') ||
      tz.includes('Kolkata') ||
      tz === 'Asia/Colombo' ||
      tz === 'Asia/Kathmandu' ||
      tz === 'Asia/Dhaka'
    ) {
      return { currency: 'INR', isManual: false };
    }

    // 3. Browser language fallback (e.g. en-IN, hi-IN)
    const langs = (navigator.languages || [navigator.language || '']).join(',');
    if (langs.includes('-IN')) {
      return { currency: 'INR', isManual: false };
    }

    // Default for US and international travelers
    return { currency: 'USD', isManual: false };
  } catch (_) {
    return { currency: 'USD', isManual: false };
  }
};

export const CurrencyProvider = ({ children }) => {
  const initial = detectInitialCurrency();
  const [currency, setCurrencyState] = useState(initial.currency);
  const [isManualOverride, setIsManualOverride] = useState(initial.isManual);
  const [inrRate, setInrRate] = useState(DEFAULT_INR_RATE);
  const [isDetecting, setIsDetecting] = useState(false);

  // Background Network Verification (Edge Geo Header or Country API)
  useEffect(() => {
    if (isManualOverride) return;

    let isMounted = true;
    const verifyCountry = async () => {
      try {
        setIsDetecting(true);
        // Attempt Vercel Edge Header first
        let detectedCountry = null;
        try {
          const res = await fetch('/api/geo');
          if (res.ok) {
            const data = await res.json();
            if (data?.country) detectedCountry = data.country;
          }
        } catch (_) {}

        // Fallback to lightweight CORS-friendly Geo IP API if needed
        if (!detectedCountry) {
          try {
            const res = await fetch('https://api.country.is/');
            if (res.ok) {
              const data = await res.json();
              if (data?.country) detectedCountry = data.country;
            }
          } catch (_) {}
        }

        if (isMounted && detectedCountry) {
          const targetCurrency = detectedCountry.toUpperCase() === 'IN' ? 'INR' : 'USD';
          setCurrencyState(targetCurrency);
        }
      } catch (err) {
        console.warn('Geo-detection fallback retained timezone heuristic:', err);
      } finally {
        if (isMounted) setIsDetecting(false);
      }
    };

    verifyCountry();
    return () => { isMounted = false; };
  }, [isManualOverride]);

  // Live Real-Time Forex Rate Sync (Cached for 1 hour)
  useEffect(() => {
    let isMounted = true;
    const fetchForex = async () => {
      try {
        // Check cache
        const cached = localStorage.getItem('zentrevo_forex_cache');
        if (cached) {
          const { rate, ts } = JSON.parse(cached);
          if (Date.now() - ts < 3600000 && rate) {
            setInrRate(rate);
            return;
          }
        }

        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data?.rates?.INR && isMounted) {
            const rate = data.rates.INR;
            setInrRate(rate);
            localStorage.setItem('zentrevo_forex_cache', JSON.stringify({ rate, ts: Date.now() }));
          }
        }
      } catch (_) {
        // Fallback to standard luxury ECB peg
      }
    };

    fetchForex();
    return () => { isMounted = false; };
  }, []);

  // Manual Currency Switcher
  const setCurrency = (newCurrency) => {
    if (newCurrency !== 'INR' && newCurrency !== 'USD') return;
    setCurrencyState(newCurrency);
    setIsManualOverride(true);
    try {
      localStorage.setItem('zentrevo_currency', newCurrency);
      localStorage.setItem('zentrevo_currency_manual', 'true');
    } catch (_) {}
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'INR' ? 'USD' : 'INR');
  };

  // Universal Currency Formatter (respects source currency symbol such as ₹ or $)
  const formatPrice = (rawPriceVal, targetCurrency = currency) => {
    const activeRates = { ...DEFAULT_EXCHANGE_RATES, USD: 1, INR: inrRate };
    return formatCurrencyPrice(rawPriceVal, targetCurrency, activeRates, 'USD');
  };

  // Raw numeric price calculation for booking forms / calculations
  const getConvertedNumber = (rawPriceVal, targetCurrency = currency) => {
    if (!rawPriceVal && rawPriceVal !== 0) return 0;
    const activeRates = { ...DEFAULT_EXCHANGE_RATES, USD: 1, INR: inrRate };
    const converted = convertPriceAmount(rawPriceVal, targetCurrency, activeRates, 'USD');
    return converted >= 1 ? Math.round(converted) : Number(converted.toFixed(2));
  };

  const symbol = currency === 'INR' ? '₹' : '$';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol,
        inrRate,
        isManualOverride,
        isDetecting,
        setCurrency,
        toggleCurrency,
        formatPrice,
        getConvertedNumber
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
