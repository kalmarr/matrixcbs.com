// MATRIX CBS - Admin Categories API
// GET: Lista, POST: Új kategória

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/categories - Kategóriák listája
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Hiba történt a kategóriák lekérdezésekor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Új kategória létrehozása
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, color, sortOrder } = body

    // Validáció
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'A név és a slug megadása kötelező' },
        { status: 400 }
      )
    }

    // Slug egyediség ellenőrzése
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Ez a slug már létezik' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || null,
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Hiba történt a kategória létrehozásakor' },
      { status: 500 }
    )
  }
}
