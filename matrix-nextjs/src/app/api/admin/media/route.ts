// MATRIX CBS - Media API Route (List & Delete)
// Handles listing media files with pagination/filtering and deletion

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

// GET /api/admin/media - List media with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const folder = searchParams.get('folder') || undefined
    const mimeType = searchParams.get('mimeType') || undefined
    const search = searchParams.get('search') || undefined

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (folder) {
      where.folder = folder
    }
    if (mimeType) {
      if (mimeType === 'image') {
        where.mimeType = {
          startsWith: 'image/'
        }
      } else {
        where.mimeType = {
          startsWith: mimeType
        }
      }
    }
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { alt: { contains: search } },
        { caption: { contains: search } }
      ]
    }

    // Get total count
    const total = await prisma.media.count({ where })

    // Get media files
    const media = await prisma.media.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
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
      media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Media list error:', error)
    return NextResponse.json(
      { error: 'Hiba a médiafájlok betöltésekor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/media?id=123 - Delete media file
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Hiányzó azonosító' },
        { status: 400 }
      )
    }

    // Get media record
    const media = await prisma.media.findUnique({
      where: { id: parseInt(id) }
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Médiafájl nem található' },
        { status: 404 }
      )
    }

    // Delete files from filesystem
    const publicDir = process.cwd() + '/public'

    // Note: Paths come from database (trusted source), not user input
    const mainFilePath = publicDir + '/' + media.path
    const thumbFilePath = media.thumbnailPath ? publicDir + '/' + media.thumbnailPath : null

    try {
      // Delete main file
      await unlink(mainFilePath)
    } catch (err) {
      console.error('Error deleting main file:', err)
    }

    try {
      // Delete thumbnail if exists
      if (thumbFilePath) {
        await unlink(thumbFilePath)
      }
    } catch (err) {
      console.error('Error deleting thumbnail:', err)
    }

    // Delete database record
    await prisma.media.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({
      success: true,
      message: 'Médiafájl sikeresen törölve'
    })
  } catch (error) {
    console.error('Media delete error:', error)
    return NextResponse.json(
      { error: 'Hiba a médiafájl törlésekor' },
      { status: 500 }
    )
  }
}
