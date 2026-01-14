// MATRIX CBS - Admin Tags API
// GET: Lista, POST: Új címke

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/tags - Címkék listája
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const tags = await prisma.tag.findMany({
      where: search ? {
        name: {
          contains: search
        }
      } : undefined,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Hiba történt a címkék lekérdezésekor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tags - Új címke létrehozása
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    // Validáció
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'A név és a slug megadása kötelező' },
        { status: 400 }
      )
    }

    // Slug egyediség ellenőrzése
    const existingTag = await prisma.tag.findUnique({
      where: { slug }
    })

    if (existingTag) {
      return NextResponse.json(
        { error: 'Ez a slug már létezik' },
        { status: 409 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Hiba történt a címke létrehozásakor' },
      { status: 500 }
    )
  }
}
