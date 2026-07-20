import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: string; // 'General' or 'Custom Order'
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Replied';
  stoneType?: string;
  caratWeight?: string;
  preferredColor?: string;
  maxBudget?: string;
  intendedUse?: string;
}

async function getInquiries(): Promise<Inquiry[]> {
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveInquiries(inquiries: Inquiry[]): Promise<void> {
  try {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf8');
  } catch (err) {
    console.error('[saveInquiries] Error writing inquiries:', err);
  }
}

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    console.error('[GET /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inquiries = await getInquiries();

    const newInquiry: Inquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name || body.contact || 'Anonymous',
      email: body.email || (body.contact && body.contact.includes('@') ? body.contact : 'no-email@mineralsuniverse.com'),
      phone: body.phone || '',
      type: body.type || (body.stoneType ? 'Custom Order' : 'General'),
      subject: body.subject || (body.stoneType ? `Custom Sourcing Request: ${body.stoneType}` : 'New Inquiry from Contact Form'),
      message: body.message || body.notes || `Budget: $${body.maxBudget || 'N/A'}. Intended Use: ${body.intendedUse || 'N/A'}. Color: ${body.preferredColor || 'N/A'}. Carat: ${body.caratWeight || 'N/A'}.`,
      createdAt: new Date().toISOString(),
      status: 'Unread',
      stoneType: body.stoneType || undefined,
      caratWeight: body.caratWeight || undefined,
      preferredColor: body.preferredColor || undefined,
      maxBudget: body.maxBudget || undefined,
      intendedUse: body.intendedUse || undefined,
    };

    inquiries.push(newInquiry);
    await saveInquiries(inquiries);

    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (err: any) {
    console.error('[POST /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// For changing inquiry status (read/unread/replied) or deleting
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    const inquiries = await getInquiries();
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    await saveInquiries(updated);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[PUT /api/inquiries]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
