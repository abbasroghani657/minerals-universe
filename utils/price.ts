export function parsePrice(priceStr: string | number | undefined | null): number {
  if (priceStr == null) return 0;
  if (typeof priceStr === 'number') return priceStr;
  
  // Remove currency symbols, commas, spaces, and anything that isn't a digit or a period
  const numericStr = priceStr.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numericStr);
  
  return isNaN(parsed) ? 0 : parsed;
}
