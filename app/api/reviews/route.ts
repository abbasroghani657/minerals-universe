import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_REVIEWS } from '@/lib/defaultData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const productIdFilter = searchParams.get('productId');

  try {
    const whereClause: any = {};
    if (statusFilter) {
      whereClause.status = statusFilter;
    }
    if (productIdFilter) {
      whereClause.productId = Number(productIdFilter);
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (reviews && reviews.length > 0) {
      return NextResponse.json({ success: true, reviews });
    }
    return NextResponse.json({ success: true, reviews: DEFAULT_REVIEWS });
  } catch (err: any) {
    console.warn('[GET /api/reviews] Database not ready, using fallback reviews:', err.message);
    return NextResponse.json({ success: true, reviews: DEFAULT_REVIEWS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author, product, productId, rating, text } = body;

    if (!author || !product || !rating || !text) {
      return NextResponse.json({ success: false, error: 'Missing required review fields' }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
        author,
        product,
        productId: productId ? Number(productId) : null,
        rating: Number(rating),
        text,
        status: 'Pending',
        createdAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: any) {
    console.error('[POST /api/reviews]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    await prisma.review.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[PUT /api/reviews]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/reviews]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
