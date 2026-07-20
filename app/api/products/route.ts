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

    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, cat, priceNum, sale, desc, origin, treatment, cert, img, stock, badge } = body;

    if (!name || !cat || !priceNum || !img) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        cat,
        priceNum: Number(priceNum),
        sale: sale || `PKR ${priceNum}`,
        desc: desc || '',
        origin: origin || 'Unknown',
        treatment: treatment || 'None',
        cert: cert || 'None',
        img,
        stock: stock ? String(stock) : null,
        badge: badge || '',
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, cat, priceNum, sale, desc, origin, treatment, cert, img, stock, badge } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product ID' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        cat,
        priceNum: priceNum ? Number(priceNum) : undefined,
        sale,
        desc,
        origin,
        treatment,
        cert,
        img,
        stock: stock ? String(stock) : null,
        badge,
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    console.error('[PUT /api/products]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product ID' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/products]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
