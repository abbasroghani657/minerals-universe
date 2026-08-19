import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_SETTINGS } from '@/lib/defaultData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  try {
    if (key) {
      const setting = await prisma.setting.findUnique({
        where: { key }
      });
      return NextResponse.json({ success: true, key, value: setting ? setting.value : (DEFAULT_SETTINGS[key] || null) });
    }

    const settings = await prisma.setting.findMany();
    if (settings && settings.length > 0) {
      const config = settings.reduce((acc: any, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
      return NextResponse.json({ success: true, settings: { ...DEFAULT_SETTINGS, ...config } });
    }

    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (err: any) {
    console.warn('[GET /api/settings] Database not ready, using fallback settings:', err.message);
    if (key) {
      return NextResponse.json({ success: true, key, value: DEFAULT_SETTINGS[key] || null });
    }
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function POST(req: Request) {
  try {
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

    return NextResponse.json({ success: true, setting });
  } catch (err: any) {
    console.error('[POST /api/settings]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
