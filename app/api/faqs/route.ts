import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_FAQS } from '@/lib/defaultData';
import { verifyAdminRequest } from '@/lib/auth';
import { getCache, setCache, invalidateCache } from '@/lib/cache';

const CACHE_KEY = 'faqs_data';

export async function GET() {
  const cacheHeaders = { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' };

  // Fast in-memory cache check (0ms response)
  const cached = getCache<any[]>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ success: true, faqs: cached, fromCache: true }, { headers: cacheHeaders });
  }

  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { id: 'asc' }
    });
    const result = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
    setCache(CACHE_KEY, result, 120); // 2 minutes
    return NextResponse.json({ success: true, faqs: result }, { headers: cacheHeaders });
  } catch (err: any) {
    console.warn('[GET /api/faqs] Database not ready, using fallback FAQs:', err.message);
    return NextResponse.json({ success: true, faqs: DEFAULT_FAQS }, { headers: cacheHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: 'Missing question or answer' }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: { question, answer }
    });

    invalidateCache(CACHE_KEY);
    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    console.error('[POST /api/faqs]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, question, answer } = body;

    if (!id || !question || !answer) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const faq = await prisma.faq.update({
      where: { id: Number(id) },
      data: { question, answer }
    });

    invalidateCache(CACHE_KEY);
    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    console.error('[PUT /api/faqs]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    await prisma.faq.delete({
      where: { id: Number(id) }
    });

    invalidateCache(CACHE_KEY);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/faqs]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
