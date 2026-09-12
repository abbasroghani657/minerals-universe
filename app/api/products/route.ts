import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_PRODUCTS } from '@/lib/defaultData';
import { inferMainCategory, isPrimaryCategory, normalizeCategory, CATEGORY_TREE, getVarietiesForMain } from '@/utils/categories';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const mainCategory = searchParams.get('mainCategory');
  const search = searchParams.get('search');

  try {
    // 1. Fetch single product by ID
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

    // 2. Global search query across name, category, origin, description
    if (search) {
      const sTrimmed = search.trim().toLowerCase();
      const allDbProducts = await prisma.product.findMany({ orderBy: { id: 'desc' } });
      const sourceList = allDbProducts && allDbProducts.length > 0 ? allDbProducts : (DEFAULT_PRODUCTS as any[]);
      
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

      return NextResponse.json({ success: true, products: filtered });
    }

    // 3. Filter by Main Department (e.g. "Loose Gemstones", "minerals-and-crystals", "Polished Stones")
    const targetMain = mainCategory || (category && isPrimaryCategory(category) ? category : null);

    if (targetMain) {
      const normTarget = normalizeCategory(targetMain);
      const matchedMainName = Object.keys(CATEGORY_TREE).find(k => normalizeCategory(k) === normTarget) || targetMain;
      const childVarieties = getVarietiesForMain(matchedMainName).map(v => v.toLowerCase());

      const allDbProducts = await prisma.product.findMany({ orderBy: { id: 'desc' } });
      const sourceList = allDbProducts && allDbProducts.length > 0 ? allDbProducts : (DEFAULT_PRODUCTS as any[]);

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

      return NextResponse.json({ success: true, products: filtered });
    }

    // 4. Filter by Specific Variety (e.g. "lapis-lazuli", "Aquamarine", "emerald", "Quartz")
    if (category) {
      const rawCat = category.trim();
      const normalizedCat = rawCat.replace(/-/g, ' ').toLowerCase();

      const allDbProducts = await prisma.product.findMany({ orderBy: { id: 'desc' } });
      const sourceList = allDbProducts && allDbProducts.length > 0 ? allDbProducts : (DEFAULT_PRODUCTS as any[]);

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

      return NextResponse.json({ success: true, products: filtered });
    }

    // 5. Return all products
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

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/products] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
