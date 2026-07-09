import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/orders';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
