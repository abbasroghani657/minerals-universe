import { NextResponse } from 'next/server';

interface RatesResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc?: string;
}

// Fallback rates in case network request fails
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  PKR: 280.0,
  EUR: 0.92,
  GBP: 0.78,
  AED: 3.67,
  SAR: 3.75,
  CAD: 1.38,
  AUD: 1.52,
};

let cachedRates: Record<string, number> | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const now = Date.now();
    if (cachedRates && now - lastFetchTime < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        base: 'USD',
        rates: cachedRates,
      });
    }

    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch live rates: ${res.statusText}`);
    }

    const data: RatesResponse = await res.json();
    if (data && data.rates) {
      cachedRates = data.rates;
      lastFetchTime = now;
      return NextResponse.json({
        success: true,
        source: 'live',
        base: 'USD',
        rates: data.rates,
        lastUpdated: data.time_last_update_utc,
      });
    }

    throw new Error('Invalid rate response format');
  } catch (err: any) {
    console.error('[GET /api/rates] Error fetching exchange rates:', err.message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      base: 'USD',
      rates: cachedRates || FALLBACK_RATES,
    });
  }
}
