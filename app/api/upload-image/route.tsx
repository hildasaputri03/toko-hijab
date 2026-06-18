import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // bikin nama file unik
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${crypto.randomBytes(16).toString('hex')}.${ext}`;

  // path fisik di server
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  // URL yang bisa dipakai di <Image src="/uploads/xxx" />
  const publicUrl = `/uploads/${fileName}`;

  return NextResponse.json({ url: publicUrl });
}
