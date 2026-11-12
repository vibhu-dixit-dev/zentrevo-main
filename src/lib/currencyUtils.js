// Shared multi-currency parser, converter, and formatter
// Supports INR (₹), USD ($), EUR (€), and GBP (£) as both source and target currencies.

export const DEFAULT_EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 86.85,
  GBP: 0.79
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£'
};

/**
 * Parses a raw price string or number and detects its denominated source currency.
 * Numbers or '$' strings default to USD unless fallbackSourceCurrency is specified.
 */
export function parsePriceWithCurrency(rawVal, fallbackSourceCurrency = 'USD') {
  if (rawVal === null || rawVal === undefined || rawVal === '') {
    return { amount: null, sourceCurrency: fallbackSourceCurrency, isNumeric: false, raw: '' };
  }

  if (typeof rawVal === 'number') {
    return {
      amount: isNaN(rawVal) ? null : rawVal,
      sourceCurrency: fallbackSourceCurrency,
      isNumeric: !isNaN(rawVal),
      raw: String(rawVal)
    };
  }

  const str = String(rawVal).trim();
  let sourceCurrency = fallbackSourceCurrency;

  if (str.includes('₹') || /\binr\b/i.test(str) || /\brs\.?\b/i.test(str)) {
    sourceCurrency = 'INR';
  } else if (str.includes('€') || /\beur\b/i.test(str)) {
    sourceCurrency = 'EUR';
  } else if (str.includes('£') || /\bgbp\b/i.test(str)) {
    sourceCurrency = 'GBP';
  } else if (str.includes('$') || /\busd\b/i.test(str)) {
    sourceCurrency = 'USD';
  }

  const numericStr = str.replace(/[^0-9.]/g, '');
  const amount = numericStr ? parseFloat(numericStr) : NaN;

  if (isNaN(amount)) {
    return { amount: null, sourceCurrency, isNumeric: false, raw: str };
  }

  return { amount, sourceCurrency, isNumeric: true, raw: str };
}

/**
 * Converts a price value from its detected source currency into targetCurrency.
 */
export function convertPriceAmount(
  rawVal,
  targetCurrency = 'USD',
  rates = DEFAULT_EXCHANGE_RATES,
  fallbackSourceCurrency = 'USD'
) {
  const parsed = parsePriceWithCurrency(rawVal, fallbackSourceCurrency);
  if (!parsed.isNumeric || parsed.amount === null) return 0;

  if (parsed.sourceCurrency === targetCurrency) {
    return parsed.amount;
  }

  const sourceRate = rates[parsed.sourceCurrency] || DEFAULT_EXCHANGE_RATES[parsed.sourceCurrency] || 1;
  const targetRate = rates[targetCurrency] || DEFAULT_EXCHANGE_RATES[targetCurrency] || 1;

  const usdBase = parsed.amount / sourceRate;
  return usdBase * targetRate;
}

/**
 * Formats any stored price (in ₹, $, €, £, or numeric USD) into targetCurrency display string.
 */
export function formatCurrencyPrice(
  rawVal,
  targetCurrency = 'USD',
  rates = DEFAULT_EXCHANGE_RATES,
  fallbackSourceCurrency = 'USD'
) {
  if (rawVal === '' || rawVal === null || rawVal === undefined) return '';

  const parsed = parsePriceWithCurrency(rawVal, fallbackSourceCurrency);
  if (!parsed.isNumeric || parsed.amount === null) {
    return String(rawVal);
  }

  const converted = convertPriceAmount(rawVal, targetCurrency, rates, fallbackSourceCurrency);
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || '$';
  const locale = targetCurrency === 'INR' ? 'en-IN' : 'en-US';

  if (parsed.sourceCurrency === targetCurrency) {
    const hasFraction = converted % 1 !== 0;
    const formatted = hasFraction
      ? converted.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(converted).toLocaleString(locale);
    return `${symbol}${formatted}`;
  }

  if (converted > 0 && converted < 1) {
    return `${symbol}${converted.toFixed(2)}`;
  }

  return `${symbol}${Math.round(converted).toLocaleString(locale)}`;
}

/**
 * Formats an admin input value into its canonical stored price string (e.g. "₹9", "₹1,50,000", "$2,450"),
 * attributing it to activeCurrency unless the user explicitly typed another currency symbol.
 */
export function formatStoredAdminPrice(rawInput, activeCurrency = 'INR') {
  const str = String(rawInput ?? '').trim();
  if (!str) return '';

  const parsed = parsePriceWithCurrency(str, activeCurrency);
  if (!parsed.isNumeric || parsed.amount === null) {
    return str;
  }

  const symbol = CURRENCY_SYMBOLS[parsed.sourceCurrency] || '$';
  const locale = parsed.sourceCurrency === 'INR' ? 'en-IN' : 'en-US';
  const hasFraction = parsed.amount % 1 !== 0;
  const formatted = hasFraction
    ? parsed.amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(parsed.amount).toLocaleString(locale);

  return `${symbol}${formatted}`;
}

/**
 * Formats a price specifically for populating an editable input field in the active admin currency.
 */
export function formatEditableAdminPrice(storedVal, targetCurrency = 'INR', rates = DEFAULT_EXCHANGE_RATES) {
  const parsed = parsePriceWithCurrency(storedVal, 'USD');
  if (!parsed.isNumeric || parsed.amount === null) {
    return String(storedVal || '');
  }

  const converted = convertPriceAmount(storedVal, targetCurrency, rates, 'USD');
  const locale = targetCurrency === 'INR' ? 'en-IN' : 'en-US';
  if (parsed.sourceCurrency === targetCurrency) {
    return converted % 1 !== 0 ? String(converted) : Math.round(converted).toLocaleString(locale);
  }
  return converted > 0 && converted < 1
    ? converted.toFixed(2)
    : Math.round(converted).toLocaleString(locale);
}
