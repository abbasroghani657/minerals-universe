import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ success: true, faqs });
  } catch (err: any) {
    console.error('[GET /api/faqs]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: 'Missing question or answer' }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: { question, answer }
    });

    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    console.error('[POST /api/faqs]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, question, answer } = body;

    if (!id || !question || !answer) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const faq = await prisma.faq.update({
      where: { id: Number(id) },
      data: { question, answer }
    });

    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    console.error('[PUT /api/faqs]', err);
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

    await prisma.faq.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/faqs]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
