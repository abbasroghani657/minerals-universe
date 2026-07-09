import { NextResponse } from 'next/server';
import { getPayPalAccessToken, PAYPAL_BASE } from '@/lib/paypal';
import { saveOrder, generateOrderId } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderID, customerDetails, items, total } = body;

    // Input validation
    if (!orderID || typeof orderID !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing PayPal orderID' }, { status: 400 });
    }
    if (!customerDetails?.customerName || !customerDetails?.customerEmail || !customerDetails?.customerPhone || !customerDetails?.shippingAddress) {
      return NextResponse.json({ success: false, error: 'Missing customer details' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing items' }, { status: 400 });
    }
    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid total' }, { status: 400 });
    }

    // Capture PayPal payment
    const accessToken = await getPayPalAccessToken();
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureRes.json();
    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      throw new Error(captureData.message || 'PayPal capture failed');
    }

    const internalOrderId = generateOrderId();

    // Save order (failure is logged but does not fail the request)
    await saveOrder({
      id: internalOrderId,
      customerName: customerDetails.customerName,
      customerEmail: customerDetails.customerEmail,
      customerPhone: customerDetails.customerPhone,
      shippingAddress: customerDetails.shippingAddress,
      items,
      total,
      paymentMethod: 'PayPal',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
    });

    // Send confirmation email (failure is logged but does not fail the request)
    try {
      await sendOrderConfirmationEmail({
        orderId: internalOrderId,
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        shippingAddress: customerDetails.shippingAddress,
        items,
        total,
        paymentMethod: 'PayPal',
      });
    } catch (emailErr) {
      console.error('[PayPal capture-order] Email send failed:', emailErr);
    }

    return NextResponse.json({ success: true, orderId: internalOrderId });
  } catch (err: any) {
    console.error('[PayPal capture-order]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
