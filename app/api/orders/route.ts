import { NextResponse } from 'next/server';
import { getAllOrders, saveOrder, generateOrderId } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';
import stripe from '@/lib/stripe';
import prisma from '@/lib/prisma';

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
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingAddress, 
      items, 
      total, 
      totalUSD, 
      currency = 'PKR', 
      currencySymbol = 'PKR ', 
      exchangeRate = 1.0, 
      paymentMethod, 
      card 
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || total == null || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Missing required order details' }, { status: 400 });
    }

    let finalPaymentStatus = body.paymentStatus || 'Pending';

    // 1. PayPal & Bank Card Payments
    if (paymentMethod.includes('PayPal') || paymentMethod.includes('Card')) {
      finalPaymentStatus = body.paymentStatus || 'Paid (PayPal / Card)';
    } else {
      finalPaymentStatus = 'Pending Verification';
    }

    const orderId = generateOrderId();
    const orderData = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      total: Number(total),
      totalUSD: totalUSD ? Number(totalUSD) : undefined,
      currency,
      currencySymbol,
      exchangeRate: Number(exchangeRate),
      paymentMethod: `${paymentMethod} (${currency})`,
      paymentStatus: finalPaymentStatus,
      status: 'Processing',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(orderData);

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        total: Number(total),
        currencySymbol,
        currency,
        paymentMethod: `${paymentMethod} (${currency})`,
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, tracking } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        tracking: tracking || null
      }
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error('[PUT /api/orders]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/orders]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
