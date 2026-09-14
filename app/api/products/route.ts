import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_PRODUCTS } from '@/lib/defaultData';
import { inferMainCategory, isPrimaryCategory, normalizeCategory, CATEGORY_TREE, getVarietiesForMain } from '@/utils/categories';
import { verifyAdminRequest } from '@/lib/auth';
import { getCache, setCache, invalidateCache } from '@/lib/cache';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const mainCategory = searchParams.get('mainCategory');
  const search = searchParams.get('search');

  const cacheHeaders = { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' };

  // Fast in-memory cache accessor for all product operations
  const getAllProductsCached = async () => {
    const cached = getCache<any[]>('products_all');
    if (cached && cached.length > 0) return cached;
    try {
      const dbProducts = await prisma.product.findMany({ orderBy: { id: 'desc' } });
      const result = (dbProducts && dbProducts.length > 0) ? dbProducts : (DEFAULT_PRODUCTS as any[]);
      setCache('products_all', result, 120);
      return result;
    } catch (err: any) {
      console.warn('[getAllProductsCached] Database issue, using fallback data:', err.message);
      return DEFAULT_PRODUCTS as any[];
    }
  };

  try {
    // 1. Fetch single product by ID
    if (id) {
      const cachedAll = getCache<any[]>('products_all');
      if (cachedAll) {
        const found = cachedAll.find(p => p.id === Number(id));
        if (found) return NextResponse.json({ success: true, product: found }, { headers: cacheHeaders });
      }

      const product = await prisma.product.findUnique({
        where: { id: Number(id) }
      });
      if (product) {
        return NextResponse.json({ success: true, product }, { headers: cacheHeaders });
      }
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === Number(id));
      return NextResponse.json({ success: true, product: fallback || null }, { headers: cacheHeaders });
    }

    // Get all products (0ms from cache if already loaded)
    const sourceList = await getAllProductsCached();

    // 2. Global search query across name, category, origin, description
    if (search) {
      const sTrimmed = search.trim().toLowerCase();
      const filtered = sourceList.filter(p => {
        const pAny = p as any;
        return (
          p.name?.toLowerCase().includes(sTrimmed) ||
          p.cat?.toLowerCase().includes(sTrimmed) ||
          pAny.mainCat?.toLowerCase().includes(sTrimmed) ||
          p.origin?.toLowerCase().includes(sTrimmed) ||
          p.desc?.toLowerCase().includes(sTrimmed)
        );
      });

      return NextResponse.json({ success: true, products: filtered }, { headers: cacheHeaders });
    }

    // 3. Filter by Main Department (e.g. "Loose Gemstones", "minerals-and-crystals", "Polished Stones")
    const targetMain = mainCategory || (category && isPrimaryCategory(category) ? category : null);

    if (targetMain) {
      const normTarget = normalizeCategory(targetMain);
      const matchedMainName = Object.keys(CATEGORY_TREE).find(k => normalizeCategory(k) === normTarget) || targetMain;
      const childVarieties = getVarietiesForMain(matchedMainName).map(v => v.toLowerCase());

      const filtered = sourceList.filter(p => {
        const pAny = p as any;
        const pMain = pAny.mainCat ? String(pAny.mainCat).toLowerCase() : inferMainCategory(p.cat).toLowerCase();
        const pCat = (p.cat || '').toLowerCase();
        const targetLower = matchedMainName.toLowerCase();

        return (
          pMain.includes(targetLower) ||
          targetLower.includes(pMain) ||
          pCat.includes(targetLower) ||
          childVarieties.some(cv => pCat.includes(cv) || cv.includes(pCat))
        );
      });

      return NextResponse.json({ success: true, products: filtered }, { headers: cacheHeaders });
    }

    // 4. Filter by Specific Variety (e.g. "lapis-lazuli", "Aquamarine", "emerald", "Quartz")
    if (category) {
      const rawCat = category.trim();
      const normalizedCat = rawCat.replace(/-/g, ' ').toLowerCase();

      const filtered = sourceList.filter(p => {
        const pCat = (p.cat || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pDesc = (p.desc || '').toLowerCase();

        return (
          pCat === normalizedCat ||
          pCat === rawCat.toLowerCase() ||
          pCat.includes(normalizedCat) ||
          normalizedCat.includes(pCat) ||
          pName.includes(normalizedCat) ||
          pDesc.includes(normalizedCat)
        );
      });

      return NextResponse.json({ success: true, products: filtered }, { headers: cacheHeaders });
    }

    // 5. Return all products
    return NextResponse.json({ success: true, products: sourceList }, { headers: cacheHeaders });
  } catch (err: any) {
    console.warn('[GET /api/products] Database issue, using fallback data:', err.message);
    const cacheHeaders = { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' };
    if (id) {
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === Number(id));
      return NextResponse.json({ success: true, product: fallback || null }, { headers: cacheHeaders });
    }
    return NextResponse.json({ success: true, products: DEFAULT_PRODUCTS }, { headers: cacheHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, mainCat, cat, priceNum, original, sale, desc, origin, treatment, cert, img, stock, badge } = body;

    if (!name || !cat || priceNum === undefined || priceNum === null || !img) {
      return NextResponse.json({ success: false, error: 'Missing required product fields (Title, Category, Price, or Image)' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        mainCat: mainCat ? mainCat.trim() : inferMainCategory(cat),
        cat: cat.trim(),
        priceNum: Number(priceNum),
        original: original ? String(original).trim() : null,
        sale: sale ? String(sale).trim() : '$' + Number(priceNum).toLocaleString(),
        desc: desc ? desc.trim() : 'Natural earth-mined certified gemstone specimen.',
        origin: origin ? origin.trim() : 'Pakistan',
        treatment: treatment ? treatment.trim() : 'None (100% Natural)',
        cert: cert ? cert.trim() : 'Authentic Origin Certificate Included',
        img: img.trim(),
        stock: stock !== undefined && stock !== null ? String(stock) : 'In Stock',
        badge: badge ? String(badge).trim() : 'Natural'
      }
    });

    invalidateCache('products*');
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/products] Error:', err);
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
    const { id, name, mainCat, cat, priceNum, original, sale, desc, origin, treatment, cert, img, stock, badge } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required for update' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name: name.trim() }),
        ...(mainCat && { mainCat: mainCat.trim() }),
        ...(cat && { cat: cat.trim() }),
        ...(priceNum !== undefined && { priceNum: Number(priceNum) }),
        ...(original !== undefined && { original: original ? String(original).trim() : null }),
        ...(sale && { sale: String(sale).trim() }),
        ...(desc !== undefined && { desc: desc ? desc.trim() : '' }),
        ...(origin !== undefined && { origin: origin ? origin.trim() : 'Pakistan' }),
        ...(treatment !== undefined && { treatment: treatment ? treatment.trim() : '100% Natural' }),
        ...(cert !== undefined && { cert: cert ? cert.trim() : 'Authentic Gem' }),
        ...(img && { img: img.trim() }),
        ...(stock !== undefined && { stock: String(stock) }),
        ...(badge !== undefined && { badge: badge ? String(badge).trim() : '' }),
      }
    });

    invalidateCache('products*');
    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error('[PUT /api/products] Error:', err);
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
      return NextResponse.json({ success: false, error: 'Missing product ID parameter' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: Number(id) }
    });

    invalidateCache('products*');
    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully.` });
  } catch (err: any) {
    console.error('[DELETE /api/products] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
