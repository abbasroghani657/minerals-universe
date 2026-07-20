export function parsePrice(priceStr: string | number | undefined | null): number {
  if (priceStr == null) return 0;
  if (typeof priceStr === 'number') return priceStr;
  
  // Remove currency symbols, commas, spaces, and anything that isn't a digit or a period
  const numericStr = priceStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericStr);
  
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPrice(priceUSD: number, currency: string = 'USD $'): string {
  let rate = 1.0;
  let symbol = '$';
  
  const c = currency || 'USD $';
  
  if (c.startsWith('EUR')) {
    rate = 0.92;
    symbol = '€';
  } else if (c.startsWith('GBP')) {
    rate = 0.78;
    symbol = '£';
  } else if (c.startsWith('AED')) {
    rate = 3.67;
    symbol = 'AED ';
  } else if (c.startsWith('PKR')) {
    rate = 280.0;
    symbol = 'PKR ';
  }

  const converted = Math.round(priceUSD * rate);
  return `${symbol}${converted.toLocaleString()}`;
}
