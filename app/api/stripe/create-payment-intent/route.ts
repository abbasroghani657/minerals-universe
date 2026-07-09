import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, customerDetails } = body;

    // Input validation
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'items must be a non-empty array' }, { status: 400 });
    }
    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ success: false, error: 'total must be a positive number' }, { status: 400 });
    }
    if (!customerDetails?.customerEmail) {
      return NextResponse.json({ success: false, error: 'customerDetails.customerEmail is required' }, { status: 400 });
    }

    // Amount in cents (Stripe requires smallest currency unit)
    const amountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      receipt_email: customerDetails.customerEmail,
      metadata: {
        customerName: customerDetails.customerName || '',
        customerPhone: customerDetails.customerPhone || '',
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('[Stripe create-payment-intent]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
