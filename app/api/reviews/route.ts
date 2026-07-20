import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

interface Review {
  id: string;
  author: string;
  product: string;
  productId?: number;
  rating: number;
  text: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

const dummyReviews: Review[] = [
  { id: 'REV-1', author: 'Sarah K.', product: 'Natural Aquamarine Emerald Cut', rating: 5, text: 'The aquamarine I received was absolutely stunning! The emerald cut really brings out its brilliance. Will order again.', status: 'Approved', createdAt: '2026-10-25T12:00:00Z' },
  { id: 'REV-2', author: 'Marco B.', product: 'Pink Tourmaline Cushion Cut', rating: 5, text: 'Ordered a custom tourmaline for my wife\'s ring. Exceptional color and fast shipping.', status: 'Approved', createdAt: '2026-10-22T12:00:00Z' },
  { id: 'REV-3', author: 'Zayn R.', product: 'Deep Red Pyrope Garnet Oval', rating: 4, text: 'Beautiful deep red color. Under sunlight, the reflections are amazing. Slightly smaller than expected but perfect grade.', status: 'Approved', createdAt: '2026-10-18T12:00:00Z' },
];

async function getReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(REVIEWS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : dummyReviews;
  } catch {
    return dummyReviews;
  }
}

async function saveReviews(reviews: Review[]): Promise<void> {
  try {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
  } catch (err) {
    console.error('[saveReviews] Error writing reviews:', err);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    const productIdFilter = searchParams.get('productId');

    let reviews = await getReviews();

    if (statusFilter) {
      reviews = reviews.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (productIdFilter) {
      reviews = reviews.filter(r => r.productId === Number(productIdFilter));
    }

    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    console.error('[GET /api/reviews]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author, product, productId, rating, text } = body;

    if (!author || !product || !rating || !text) {
      return NextResponse.json({ success: false, error: 'Missing required review fields' }, { status: 400 });
    }

    const reviews = await getReviews();
    const newReview: Review = {
      id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
      author,
      product,
      productId: productId ? Number(productId) : undefined,
      rating: Number(rating),
      text,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    await saveReviews(reviews);

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

    const reviews = await getReviews();
    const updated = reviews.map(r => r.id === id ? { ...r, status } : r);
    await saveReviews(updated);

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

    const reviews = await getReviews();
    const filtered = reviews.filter(r => r.id !== id);
    await saveReviews(filtered);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/reviews]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
