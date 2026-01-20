import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Static files for Gmail email signatures
const NEVJEGY_FILES: Record<string, string> = {
  'Logo.jpg': 'image/jpeg',
  'MATRIXCBS_logo.png': 'image/png',
  'fb.jpg': 'image/jpeg',
  'linkedin.jpg': 'image/jpeg',
  'twitter.jpg': 'image/jpeg',
  'skype.jpg': 'image/jpeg',
  'matrix_cbs.jpg': 'image/jpeg',
  'mail-nevjegy_03.jpg': 'image/jpeg',
  'mail-nevjegy_04.jpg': 'image/jpeg',
  'mail-nevjegy_05.jpg': 'image/jpeg',
  'mail-nevjegy_07.jpg': 'image/jpeg',
  'index.html': 'text/html',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const fileName = pathSegments.join('/');

  // Security: only allow whitelisted files
  const mimeType = NEVJEGY_FILES[fileName];
  if (!mimeType) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    // Read from public/nevjegy directory
    const filePath = path.join(process.cwd(), 'public', 'nevjegy', fileName);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
