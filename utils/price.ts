export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

export const DEFAULT_RATES: Record<string, number> = {
  USD: 1.0,
  PKR: 280.0,
  EUR: 0.92,
  GBP: 0.78,
  AED: 3.67,
  SAR: 3.75,
};

export function parsePrice(priceStr: string | number | undefined | null): number {
  if (priceStr == null) return 0;
  if (typeof priceStr === 'number') return priceStr;
  
  const numericStr = priceStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericStr);
  return isNaN(parsed) ? 0 : parsed;
}

export function getCurrencyCode(currency: string = 'USD $'): string {
  const c = (currency || 'USD $').toUpperCase();
  if (c.includes('PKR') || c.includes('₨') || c.includes('RS')) return 'PKR';
  if (c.includes('EUR') || c.includes('€')) return 'EUR';
  if (c.includes('GBP') || c.includes('£')) return 'GBP';
  if (c.includes('AED') || c.includes('د.إ')) return 'AED';
  if (c.includes('SAR')) return 'SAR';
  return 'USD';
}

export function getCurrencySymbol(currency: string = 'USD $'): string {
  const code = getCurrencyCode(currency);
  switch (code) {
    case 'PKR': return 'PKR ';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'AED': return 'AED ';
    case 'SAR': return 'SAR ';
    case 'USD':
    default:
      return '$';
  }
}

export function getExchangeRate(currency: string = 'USD $', dynamicRates?: Record<string, number> | null): number {
  const code = getCurrencyCode(currency);
  if (dynamicRates && dynamicRates[code] && typeof dynamicRates[code] === 'number') {
    return dynamicRates[code];
  }
  return DEFAULT_RATES[code] || 1.0;
}

export function convertPrice(
  priceUSD: number,
  currency: string = 'USD $',
  dynamicRates?: Record<string, number> | null
): number {
  const rate = getExchangeRate(currency, dynamicRates);
  const num = typeof priceUSD === 'number' ? priceUSD : parsePrice(priceUSD);
  const converted = num * rate;
  
  // For currencies with large units like PKR/AED round to nearest integer, otherwise 2 decimals
  const code = getCurrencyCode(currency);
  if (code === 'PKR' || code === 'AED') {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

export function formatPrice(
  priceUSD: number,
  currency: string = 'USD $',
  dynamicRates?: Record<string, number> | null
): string {
  const symbol = getCurrencySymbol(currency);
  const code = getCurrencyCode(currency);
  const converted = convertPrice(priceUSD, currency, dynamicRates);

  if (code === 'PKR' || code === 'AED') {
    return `${symbol}${converted.toLocaleString()}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

