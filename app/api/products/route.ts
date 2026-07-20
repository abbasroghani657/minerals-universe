import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) }
      });
      return NextResponse.json({ success: true, product });
    }

    if (category) {
      const products = await prisma.product.findMany({
        where: { cat: category }
      });
      return NextResponse.json({ success: true, products });
    }

    const products = await prisma.product.findMany();
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
