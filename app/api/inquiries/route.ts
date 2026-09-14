import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';
import { sendInquiryReplyEmail } from '@/lib/email';

export async function GET(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

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

    invalidateCache('admin_overview_data');
    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (err: any) {
    console.error('[POST /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, action, replyMessage, subject, toEmail, customerName } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing inquiry ID' }, { status: 400 });
    }

    // 1. Reply to customer via Email & mark as Replied
    if (action === 'reply' || replyMessage) {
      const inquiry = await prisma.inquiry.findUnique({ where: { id } });
      if (!inquiry) {
        return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
      }

      const recipient = toEmail || inquiry.email;
      const name = customerName || inquiry.name;
      const sub = subject || inquiry.subject || 'Your Inquiry with Minerals Universe';

      if (!recipient || !recipient.includes('@') || recipient.includes('no-email')) {
        return NextResponse.json({ success: false, error: 'Customer does not have a valid email address.' }, { status: 400 });
      }

      try {
        await sendInquiryReplyEmail({
          to: recipient,
          customerName: name,
          subject: sub,
          replyMessage: String(replyMessage).trim(),
          originalMessage: inquiry.message,
        });
      } catch (mailErr: any) {
        console.error('[Inquiry Reply Email Error]:', mailErr);
        return NextResponse.json({
          success: false,
          error: `Failed to dispatch email: ${mailErr.message || 'SMTP delivery failure'}. Please verify SMTP settings.`,
        }, { status: 500 });
      }

      // Successfully sent email: update inquiry status to Replied
      const updated = await prisma.inquiry.update({
        where: { id },
        data: { status: 'Replied' }
      });

      invalidateCache('admin_overview_data');
      return NextResponse.json({
        success: true,
        message: `Response email sent successfully to ${recipient}!`,
        inquiry: updated
      });
    }

    // 2. Simple status toggle (Unread / Read / Replied)
    if (!status) {
      return NextResponse.json({ success: false, error: 'Missing status update' }, { status: 400 });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    invalidateCache('admin_overview_data');
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err: any) {
    console.error('[PUT /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // query param is preferred
      }
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing inquiry ID' }, { status: 400 });
    }

    await prisma.inquiry.delete({
      where: { id }
    });

    invalidateCache('admin_overview_data');
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    console.error('[DELETE /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
