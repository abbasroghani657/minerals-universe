import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_SETTINGS } from '@/lib/defaultData';
import { verifyAdminRequest } from '@/lib/auth';
import { getCache, setCache, invalidateCache } from '@/lib/cache';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const cacheHeaders = { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' };

  if (!key) {
    const cached = getCache<any>('settings_all');
    if (cached) {
      return NextResponse.json({ success: true, settings: cached }, { headers: cacheHeaders });
    }
  }

  try {
    if (key) {
      const setting = await prisma.setting.findUnique({
        where: { key }
      });
      return NextResponse.json({ success: true, key, value: setting ? setting.value : (DEFAULT_SETTINGS[key] || null) }, { headers: cacheHeaders });
    }

    const settings = await prisma.setting.findMany();
    if (settings && settings.length > 0) {
      const config = settings.reduce((acc: any, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
      const merged = { ...DEFAULT_SETTINGS, ...config };
      setCache('settings_all', merged, 120);
      return NextResponse.json({ success: true, settings: merged }, { headers: cacheHeaders });
    }

    setCache('settings_all', DEFAULT_SETTINGS, 120);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS }, { headers: cacheHeaders });
  } catch (err: any) {
    console.warn('[GET /api/settings] Database fallback:', err.message);
    if (key) {
      return NextResponse.json({ success: true, key, value: DEFAULT_SETTINGS[key] || null }, { headers: cacheHeaders });
    }
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS }, { headers: cacheHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'Missing key' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });

    invalidateCache('settings*');
    return NextResponse.json({ success: true, setting });
  } catch (err: any) {
    console.error('[POST /api/settings]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
