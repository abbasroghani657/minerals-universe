import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';
import { getCache, setCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    const cacheKey = 'admin_overview_data';
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, fromCache: true });
    }

    // Fast parallel aggregation
    const [
      allOrdersSimple,
      recentOrders,
      unreadInquiries,
      pendingReviews,
      allProductsSimple,
    ] = await Promise.all([
      // 1. Total revenue & count (only fetch required columns)
      prisma.order.findMany({
        select: { total: true, status: true }
      }).catch(() => []),

      // 2. Recent orders for dashboard table (only 8 items)
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { items: true }
      }).catch(() => []),

      // 3. Unread inquiries
      prisma.inquiry.findMany({
        where: { status: 'Unread' },
        orderBy: { createdAt: 'desc' },
        take: 10
      }).catch(() => []),

      // 4. Pending reviews
      prisma.review.findMany({
        where: { status: 'Pending' },
        orderBy: { createdAt: 'desc' },
        take: 10
      }).catch(() => []),

      // 5. Products stock check (minimal fields)
      prisma.product.findMany({
        select: { id: true, name: true, stock: true, priceNum: true, img: true }
      }).catch(() => [])
    ]);

    const totalRevenue = allOrdersSimple.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrdersCount = allOrdersSimple.length;
    const processingOrdersCount = allOrdersSimple.filter(o => (o.status || 'Processing') === 'Processing').length;
    const deliveredOrdersCount = allOrdersSimple.filter(o => o.status === 'Delivered').length;

    // Identify low stock products
    const lowStockProducts = allProductsSimple.filter((p: any) => {
      if (!p.stock) return false;
      const s = String(p.stock).toLowerCase().trim();
      if (s.includes('only') || s.includes('left') || s.includes('out') || s === '0' || s === '1' || s === '2') {
        return true;
      }
      const num = parseInt(s);
      return !isNaN(num) && num <= 2;
    });

    const payload = {
      stats: {
        totalRevenue,
        totalOrdersCount,
        processingOrdersCount,
        deliveredOrdersCount,
        pendingReviewsCount: pendingReviews.length,
        unreadInquiriesCount: unreadInquiries.length,
        lowStockCount: lowStockProducts.length
      },
      recentOrders,
      unreadInquiries,
      pendingReviews,
      lowStockProducts: lowStockProducts.slice(0, 6),
      allProductsCount: allProductsSimple.length
    };

    // Cache overview for 20 seconds to make subsequent clicks instant
    setCache(cacheKey, payload, 20);

    return NextResponse.json({ success: true, ...payload });
  } catch (err: any) {
    console.error('[GET /api/admin/overview] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
