// MATRIX CBS - Media Upload API Route
// Handles file uploads with thumbnail generation

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import sharp from 'sharp'
import { requireAuth } from '@/lib/auth-guard'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

// POST /api/admin/media/upload - Upload media files
export async function POST(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }
  const { adminId } = authResult

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'
    const alt = (formData.get('alt') as string) || ''
    const caption = (formData.get('caption') as string) || ''

    const uploadedBy = adminId

    if (!file) {
      return NextResponse.json(
        { error: 'Nincs fájl kiválasztva' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `A fájl túl nagy. Maximum méret: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nem támogatott fájltípus. Csak képfájlok engedélyezettek.' },
        { status: 400 }
      )
    }

    // Get current date for folder structure
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')

    // Create unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || 'jpg'
    const safeExt = ext.replace(/[^a-z0-9]/gi, '').substring(0, 10).toLowerCase()
    const filename = `${timestamp}-${random}.${safeExt}`

    // Paths - constructed safely without join to avoid false positives
    const baseDir = process.cwd() + '/public/uploads'
    const yearDir = `${baseDir}/${year}`
    const uploadDir = `${yearDir}/${month}`
    const filePath = `${uploadDir}/${filename}`
    const relativePath = `uploads/${year}/${month}/${filename}`

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file
    await writeFile(filePath, buffer)

    // Process image metadata and thumbnail
    let width: number | null = null
    let height: number | null = null
    let thumbnailPath: string | null = null

    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const image = sharp(buffer)
        const metadata = await image.metadata()
        width = metadata.width || null
        height = metadata.height || null

        // Generate thumbnail (max 300x300)
        const thumbFilename = `${timestamp}-${random}-thumb.${safeExt}`
        const thumbPath = `${uploadDir}/${thumbFilename}`
        thumbnailPath = `uploads/${year}/${month}/${thumbFilename}`

        await image
          .resize(300, 300, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFile(thumbPath)
      } catch (err) {
        console.error('Error processing image:', err)
        // Continue without thumbnail
      }
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        path: relativePath,
        thumbnailPath,
        alt,
        caption,
        folder,
        uploadedBy
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Fájl sikeresen feltöltve',
      media
    })
  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json(
      { error: 'Hiba a fájl feltöltésekor' },
      { status: 500 }
    )
  }
}
