import { NextResponse } from 'next/server';
import { getPayPalAccessToken, PAYPAL_BASE } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total } = body;

    // Input validation
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'items must be a non-empty array' }, { status: 400 });
    }
    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ success: false, error: 'total must be a positive number' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create PayPal order');
    }

    return NextResponse.json({ success: true, orderID: data.id });
  } catch (err: any) {
    console.error('[PayPal create-order]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
