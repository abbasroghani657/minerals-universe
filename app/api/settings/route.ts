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

    // 1. Ultra-fast bulk update (Single atomic MySQL statement: ~30ms, no transaction timeout)
    if (body.settings && typeof body.settings === 'object') {
      const entries = Object.entries(body.settings).filter(([k]) => Boolean(k));

      if (entries.length > 0) {
        try {
          // Method A: Single atomic multi-row upsert in MySQL/TiDB
          const placeholders = entries.map(() => '(?, ?)').join(', ');
          const sqlParams: any[] = [];
          for (const [k, v] of entries) {
            sqlParams.push(String(k), String(v ?? ''));
          }

          await prisma.$executeRawUnsafe(
            `INSERT INTO Setting (\`key\`, \`value\`) VALUES ${placeholders} ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
            ...sqlParams
          );
        } catch (rawErr) {
          console.warn('[Bulk Settings] Raw SQL fallback to parallel chunk upserts:', rawErr);
          // Method B: Parallel batch chunks (No transaction session, no 5000ms timeout)
          const CHUNK_SIZE = 8;
          for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
            const chunk = entries.slice(i, i + CHUNK_SIZE);
            await Promise.all(
              chunk.map(([k, v]) =>
                prisma.setting.upsert({
                  where: { key: k },
                  update: { value: String(v ?? '') },
                  create: { key: k, value: String(v ?? '') },
                })
              )
            );
          }
        }
      }

      invalidateCache('settings*');
      return NextResponse.json({ success: true, count: entries.length, bulk: true });
    }

    // 2. Single key update
    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ success: false, error: 'Missing key or settings payload' }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value ?? '') },
      create: { key, value: String(value ?? '') }
    });

    invalidateCache('settings*');
    return NextResponse.json({ success: true, setting });
  } catch (err: any) {
    console.error('[POST /api/settings]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
