import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const INITIAL_BUNDLES = [
  {
    name: 'Aquamarine + Garnet Royal Duo',
    description: 'Collector-grade crystalline Aquamarine paired with intense fiery Spessartine Garnet from Northern Pakistan.',
    badge: '✦ Save 10%',
    originalUSD: 620,
    saleUSD: 558,
    imgs: JSON.stringify([
      '/images/bundles/aquamarine.jpg',
      '/images/bundles/garnet.jpg',
    ]),
    items: '1x 4.2ct Natural Aquamarine Crystal, 1x 2.8ct Faceted Spessartine Garnet',
    stock: 'Only 1 Set Available',
    isActive: true,
  },
  {
    name: 'Tourmaline + Imperial Topaz Set',
    description: 'Exceptional bi-color Paprok Tourmaline paired with vivid golden Katlang Imperial Topaz.',
    badge: '✦ Save 10%',
    originalUSD: 1250,
    saleUSD: 1125,
    imgs: JSON.stringify([
      '/images/bundles/tourmaline.jpg',
      '/images/bundles/topaz.jpg',
    ]),
    items: '1x 5.8ct Bi-Color Tourmaline Crystal, 1x 3.1ct Katlang Golden Topaz',
    stock: 'In Stock',
    isActive: true,
  },
  {
    name: 'Lapis + Rhodonite Polished Bundle',
    description: 'Deep royal blue Badakhshan Lapis Lazuli specimen alongside banded high-grade pink Rhodonite stone.',
    badge: '✦ Save 10%',
    originalUSD: 480,
    saleUSD: 432,
    imgs: JSON.stringify([
      '/images/bundles/lapis.jpg',
      '/images/bundles/rhodonite.jpg',
    ]),
    items: '1x 65mm Badakhshan Lapis Specimen, 1x 80mm Polished Rhodonite Specimen',
    stock: '2 Sets Left',
    isActive: true,
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    let bundles = await prisma.bundle.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { id: 'desc' },
    });

    // Auto-seed if database has no bundles yet
    if (!bundles || bundles.length === 0) {
      try {
        for (const item of INITIAL_BUNDLES) {
          await prisma.bundle.create({ data: item });
        }
        bundles = await prisma.bundle.findMany({
          where: all ? {} : { isActive: true },
          orderBy: { id: 'desc' },
        });
      } catch (seedErr) {
        console.warn('[GET /api/bundles] Auto-seed skipped:', seedErr);
      }
    }

    // Parse imgs JSON strings safely
    const formatted = (bundles || []).map((b) => {
      let parsedImgs: string[] = [];
      try {
        parsedImgs = JSON.parse(b.imgs);
      } catch {
        parsedImgs = b.imgs ? [b.imgs] : [];
      }
      return {
        ...b,
        imgs: parsedImgs,
      };
    });

    return NextResponse.json({ success: true, bundles: formatted });
  } catch (err: any) {
    console.error('[GET /api/bundles]', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        bundles: INITIAL_BUNDLES.map((b, idx) => ({
          ...b,
          id: 101 + idx,
          imgs: JSON.parse(b.imgs),
        })),
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, badge, originalUSD, saleUSD, imgs, items, stock, isActive } = body;

    if (!name || originalUSD === undefined || saleUSD === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, Original Price, and Sale Price are required.' },
        { status: 400 }
      );
    }

    const imgsJson = Array.isArray(imgs) ? JSON.stringify(imgs) : JSON.stringify(imgs ? [imgs] : []);
    const parsedOriginal = Number(originalUSD);
    const parsedSale = Number(saleUSD);

    const newBundle = await prisma.bundle.create({
      data: {
        name: String(name).trim(),
        description: description ? String(description).trim() : null,
        badge: badge ? String(badge).trim() : 'Special Offer',
        originalUSD: parsedOriginal,
        saleUSD: parsedSale,
        imgs: imgsJson,
        items: items ? String(items).trim() : null,
        stock: stock ? String(stock).trim() : 'In Stock',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({
      success: true,
      bundle: {
        ...newBundle,
        imgs: JSON.parse(newBundle.imgs),
      },
    });
  } catch (err: any) {
    console.error('[POST /api/bundles]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, badge, originalUSD, saleUSD, imgs, items, stock, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Bundle ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = description ? String(description).trim() : null;
    if (badge !== undefined) updateData.badge = badge ? String(badge).trim() : null;
    if (originalUSD !== undefined) updateData.originalUSD = Number(originalUSD);
    if (saleUSD !== undefined) updateData.saleUSD = Number(saleUSD);
    if (imgs !== undefined) updateData.imgs = Array.isArray(imgs) ? JSON.stringify(imgs) : JSON.stringify([imgs]);
    if (items !== undefined) updateData.items = items ? String(items).trim() : null;
    if (stock !== undefined) updateData.stock = stock ? String(stock).trim() : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await prisma.bundle.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      bundle: {
        ...updated,
        imgs: JSON.parse(updated.imgs),
      },
    });
  } catch (err: any) {
    console.error('[PUT /api/bundles]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing Bundle ID' }, { status: 400 });
    }

    await prisma.bundle.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/bundles]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}