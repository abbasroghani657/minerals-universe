import prisma from '@/lib/prisma';
import { DEFAULT_SETTINGS, DEFAULT_PRODUCTS } from '@/lib/defaultData';
import { getCache, setCache } from '@/lib/cache';

export async function getHomepageSettings(): Promise<Record<string, string>> {
  const cached = getCache<Record<string, string>>('settings_all');
  if (cached) return cached;

  try {
    const settings = await prisma.setting.findMany();
    if (settings && settings.length > 0) {
      const config = settings.reduce((acc: Record<string, string>, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
      const merged = { ...DEFAULT_SETTINGS, ...config };
      setCache('settings_all', merged, 180);
      return merged;
    }
  } catch (err) {
    console.warn('[getHomepageSettings] Fallback to default settings:', err);
  }

  return DEFAULT_SETTINGS;
}

export async function getHomepageProducts(): Promise<any[]> {
  const cached = getCache<any[]>('home_products');
  if (cached) return cached;

  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
      take: 4,
    });

    if (products && products.length > 0) {
      setCache('home_products', products, 180);
      return products;
    }
  } catch (err) {
    console.warn('[getHomepageProducts] Fallback to default products:', err);
  }

  return DEFAULT_PRODUCTS.slice(0, 4);
}
