import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mineralsuniverse.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/wishlist`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/shipping-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/returns-refunds`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  const categories = [
    'loose-gemstones', 'minerals-and-crystals', 'polished-stones',
    'aquamarine', 'emerald', 'tourmaline', 'sapphire', 'ruby', 'topaz',
    'garnet', 'spinel', 'kunzite', 'peridot', 'zircon', 'morganite',
    'quartz', 'fluorite', 'pyrite', 'kyanite', 'selenite', 'amethyst',
    'lapis-lazuli', 'rhodonite', 'tremolite', 'hackmanite', 'calcite', 'afghanite'
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: { id: true }
    });
    productPages = products.map(p => ({
      url: `${baseUrl}/product/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85
    }));
  } catch (err) {
    console.error('[sitemap.ts] Error fetching products:', err);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
