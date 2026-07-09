import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { saveOrder, generateOrderId } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentIntentId, customerDetails, items, total } = body;

    // Input validation
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing paymentIntentId' }, { status: 400 });
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

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ success: false, error: `Payment not completed. Status: ${paymentIntent.status}` }, { status: 400 });
    }

    const internalOrderId = generateOrderId();

    // Save order
    await saveOrder({
      id: internalOrderId,
      customerName: customerDetails.customerName,
      customerEmail: customerDetails.customerEmail,
      customerPhone: customerDetails.customerPhone,
      shippingAddress: customerDetails.shippingAddress,
      items,
      total,
      paymentMethod: 'Stripe',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
    });

    // Send confirmation email (failure does not fail the request)
    try {
      await sendOrderConfirmationEmail({
        orderId: internalOrderId,
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        shippingAddress: customerDetails.shippingAddress,
        items,
        total,
        paymentMethod: 'Stripe / Card',
      });
    } catch (emailErr) {
      console.error('[Stripe confirm-payment] Email send failed:', emailErr);
    }

    return NextResponse.json({ success: true, orderId: internalOrderId });
  } catch (err: any) {
    console.error('[Stripe confirm-payment]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
