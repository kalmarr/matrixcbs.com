// MATRIX CBS - Static uploads serving route
// Serves uploaded files from the public/uploads directory

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

const MIME_TYPES: Record<string, string> = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = path.join('/')

  // Biztonsági ellenőrzés: ne lehessen directory traversal
  if (filePath.includes('..') || filePath.includes('\0')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const ext = filePath.split('.').pop()?.toLowerCase() || ''
  const mimeType = MIME_TYPES[ext]

  if (!mimeType) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // A fájl keresése: standalone/public/uploads vagy private/public/uploads
  const cwd = process.cwd()
  const candidates = [
    `${cwd}/public/uploads/${filePath}`,
    `${cwd}/../../public/uploads/${filePath}`,
  ]

  const fullPath = candidates.find(p => existsSync(p))

  if (!fullPath) {
    console.error(`[uploads] File not found: ${filePath}, cwd: ${cwd}, tried:`, candidates)
    return new NextResponse('Not Found', { status: 404 })
  }

  try {
    const fileBuffer = await readFile(fullPath)
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
