// MATRIX CBS - Admin Category API (egyedi)
// GET: Részletek, PUT: Módosítás, DELETE: Törlés

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/admin/categories/[id] - Kategória részletei
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategória nem található' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Hiba történt a kategória lekérdezésekor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/categories/[id] - Kategória módosítása
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const body = await request.json()
    const { name, slug, description, color, sortOrder } = body

    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Kategória nem található' },
        { status: 404 }
      )
    }

    // Slug egyediség ellenőrzése (ha módosul)
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug }
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Ez a slug már létezik' },
          { status: 409 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        description: description !== undefined ? description : existing.description,
        color: color !== undefined ? color : existing.color,
        sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Hiba történt a kategória módosításakor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Kategória törlése
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Kategória nem található' },
        { status: 404 }
      )
    }

    // Ha vannak posztok a kategóriában, figyelmeztetés
    if (existing._count.posts > 0) {
      return NextResponse.json(
        { error: `A kategória nem törölhető, mert ${existing._count.posts} poszt tartozik hozzá` },
        { status: 409 }
      )
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Hiba történt a kategória törlésekor' },
      { status: 500 }
    )
  }
}
