import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { verifyAdminRequest } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin clearance required.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'product'; // 'cover' or 'product'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate mime type
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'image/gif',
      'image/avif',
      'image/tiff',
      'image/heic',
      'image/heif'
    ];
    if (!validMimes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Only JPG, PNG, WEBP, GIF, and HEIC images are allowed' },
        { status: 400 }
      );
    }

    // Allow high-res camera/phone photos up to 30MB
    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 30MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    let sharpInstance = sharp(inputBuffer);

    // Apply auto-pilot processing according to type
    if (type === 'cover' || type === 'banner') {
      // Cover Banners: 
      // 'inside' automatically fits within max 2400x1350 without cropping a single pixel!
      // Preserves 100% of the gemstone photo (whether portrait, square, or wide)
      sharpInstance = sharpInstance
        .resize({
          width: 2400,
          height: 1350,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 86, effort: 4 });
    } else {
      // Product image: crisp 1200x1200 max, WebP compressed
      sharpInstance = sharpInstance
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 84, effort: 4 });
    }

    const optimizedBuffer = await sharpInstance.toBuffer();
    const metadata = await sharp(optimizedBuffer).metadata();

    // Unique .webp filename
    const prefix = type === 'cover' || type === 'banner' ? 'cover' : 'gem';
    const filename = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.webp`;

    let publicUrl = '';
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, optimizedBuffer);
      publicUrl = `/uploads/${filename}`;
    } catch (diskErr) {
      console.warn('[Upload Warning] Serverless disk write failed, fallback to Data URI:', diskErr);
      publicUrl = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
    }
    return NextResponse.json({
      success: true,
      url: publicUrl,
      format: 'webp',
      width: metadata.width,
      height: metadata.height,
      size: optimizedBuffer.length,
      originalSize: file.size,
      compressionRatio: `${Math.round((1 - optimizedBuffer.length / file.size) * 100)}% saved`
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process and upload image' },
      { status: 500 }
    );
  }
}
