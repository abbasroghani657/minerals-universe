import { NextResponse } from 'next/server';
import { getAllOrders, saveOrder, generateOrderId } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, items, total, paymentMethod } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !total || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Missing required order details' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const orderData = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      total,
      paymentMethod,
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(orderData);

    try {
      await sendOrderConfirmationEmail({
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        total,
        paymentMethod,
      });
    } catch (emailErr) {
      console.error('[POST /api/orders] Failed to send order confirmation email:', emailErr);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err: any) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
