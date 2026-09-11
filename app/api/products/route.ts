import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_PRODUCTS } from '@/lib/defaultData';
import { inferMainCategory, isPrimaryCategory, normalizeCategory, CATEGORY_TREE, getVarietiesForMain } from '@/utils/categories';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const mainCategory = searchParams.get('mainCategory');

  try {
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) }
      });
      if (product) {
        return NextResponse.json({ success: true, product });
      }
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === Number(id));
      return NextResponse.json({ success: true, product: fallback || null });
    }

    // 1. Filter by explicit Main Category (e.g. "Loose Gemstones", "Minerals & Crystals", "Polished Stones")
    const targetMain = mainCategory || (category && isPrimaryCategory(category) ? category : null);

    if (targetMain) {
      const normTarget = normalizeCategory(targetMain);
      const matchedMainName = Object.keys(CATEGORY_TREE).find(k => normalizeCategory(k) === normTarget) || targetMain;
      const childVarieties = getVarietiesForMain(matchedMainName);

      const products = await prisma.product.findMany({
        where: {
          OR: [
            { mainCat: matchedMainName },
            { mainCat: { contains: matchedMainName } },
            { cat: matchedMainName },
            { cat: { in: childVarieties } }
          ]
        },
        orderBy: { id: 'desc' }
      });

      return NextResponse.json({ success: true, products: products || [] });
    }

    // 2. Filter by specific Gemstone / Mineral variety (e.g. "Emerald", "Aquamarine", "Quartz")
    if (category) {
      const catTrimmed = category.trim();
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { cat: catTrimmed },
            { cat: catTrimmed.toLowerCase() },
            { cat: catTrimmed.charAt(0).toUpperCase() + catTrimmed.slice(1).toLowerCase() }
          ]
        },
        orderBy: { id: 'desc' }
      });
      return NextResponse.json({ success: true, products: products || [] });
    }

    // 3. Return all products
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });

    if (products && products.length > 0) {
      return NextResponse.json({ success: true, products });
    }
    return NextResponse.json({ success: true, products: DEFAULT_PRODUCTS });
  } catch (err: any) {
    console.warn('[GET /api/products] Database issue, using fallback data:', err.message);
    if (id) {
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === Number(id));
      return NextResponse.json({ success: true, product: fallback || null });
    }
    return NextResponse.json({ success: true, products: DEFAULT_PRODUCTS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mainCat, cat, priceNum, original, sale, desc, origin, treatment, cert, img, stock, badge } = body;

    if (!name || !cat || priceNum === undefined || priceNum === null || !img) {
      return NextResponse.json({ success: false, error: 'Missing required product fields (Title, Category, Price, or Image)' }, { status: 400 });
    }

    const resolvedMainCat = mainCat ? mainCat.trim() : inferMainCategory(cat.trim());
    const parsedPrice = Number(priceNum);

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        mainCat: resolvedMainCat,
        cat: cat.trim(),
        priceNum: parsedPrice,
        original: original ? String(original) : null,
        sale: sale || `$${parsedPrice.toLocaleString()}`,
        desc: desc || '',
        origin: origin || 'Pakistan',
        treatment: treatment || '100% Natural, Unheated',
        cert: cert || 'Authentic Gem',
        img: img.trim(),
        stock: stock ? String(stock) : 'In Stock',
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
    const { id, name, mainCat, cat, priceNum, original, sale, desc, origin, treatment, cert, img, stock, badge } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product ID' }, { status: 400 });
    }

    const resolvedMainCat = mainCat ? mainCat.trim() : (cat ? inferMainCategory(cat.trim()) : undefined);
    const parsedPrice = priceNum !== undefined ? Number(priceNum) : undefined;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: name ? name.trim() : undefined,
        mainCat: resolvedMainCat,
        cat: cat ? cat.trim() : undefined,
        priceNum: parsedPrice,
        original: original !== undefined ? (original ? String(original) : null) : undefined,
        sale: sale || (parsedPrice !== undefined ? `$${parsedPrice.toLocaleString()}` : undefined),
        desc,
        origin,
        treatment,
        cert,
        img: img ? img.trim() : undefined,
        stock: stock !== undefined ? (stock ? String(stock) : null) : undefined,
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
