// MATRIX CBS - Admin Tag API (egyedi)
// GET: Részletek, PUT: Módosítás, DELETE: Törlés

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/admin/tags/[id] - Címke részletei
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'Címke nem található' },
        { status: 404 }
      )
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { error: 'Hiba történt a címke lekérdezésekor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/tags/[id] - Címke módosítása
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const body = await request.json()
    const { name, slug } = body

    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.tag.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Címke nem található' },
        { status: 404 }
      )
    }

    // Slug egyediség ellenőrzése (ha módosul)
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug }
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Ez a slug már létezik' },
          { status: 409 }
        )
      }
    }

    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? existing.name,
        slug: slug ?? existing.slug
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Hiba történt a címke módosításakor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tags/[id] - Címke törlése
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.tag.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Címke nem található' },
        { status: 404 }
      )
    }

    // Címkét törölhetjük posztokkal együtt is (cascade kapcsolat miatt)
    await prisma.tag.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Hiba történt a címke törlésekor' },
      { status: 500 }
    )
  }
}
