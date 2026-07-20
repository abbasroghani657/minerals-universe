import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    console.error('[GET /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newInquiry = await prisma.inquiry.create({
      data: {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name || body.contact || 'Anonymous',
        email: body.email || (body.contact && body.contact.includes('@') ? body.contact : 'no-email@mineralsuniverse.com'),
        phone: body.phone || '',
        type: body.type || (body.stoneType ? 'Custom Order' : 'General'),
        subject: body.subject || (body.stoneType ? `Custom Sourcing Request: ${body.stoneType}` : 'New Inquiry from Contact Form'),
        message: body.message || body.notes || `Budget: $${body.maxBudget || 'N/A'}. Intended Use: ${body.intendedUse || 'N/A'}. Color: ${body.preferredColor || 'N/A'}. Carat: ${body.caratWeight || 'N/A'}.`,
        createdAt: new Date(),
        status: 'Unread',
        stoneType: body.stoneType || null,
        caratWeight: body.caratWeight || null,
        preferredColor: body.preferredColor || null,
        maxBudget: body.maxBudget ? String(body.maxBudget) : null,
        intendedUse: body.intendedUse || null,
      }
    });

    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (err: any) {
    console.error('[POST /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[PUT /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
