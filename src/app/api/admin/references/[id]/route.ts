// MATRIX CBS - Admin Reference API (egyedi)
// GET: Részletek, PUT: Módosítás, DELETE: Törlés

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/admin/references/[id] - Referencia részletei
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const reference = await prisma.reference.findUnique({
      where: { id: parseInt(id) }
    })

    if (!reference) {
      return NextResponse.json(
        { error: 'Referencia nem található' },
        { status: 404 }
      )
    }

    return NextResponse.json(reference)
  } catch (error) {
    console.error('Error fetching reference:', error)
    return NextResponse.json(
      { error: 'Hiba történt a referencia lekérdezésekor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/references/[id] - Referencia módosítása
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const body = await request.json()
    const {
      companyName,
      contactName,
      contactRole,
      testimonial,
      logoPath,
      websiteUrl,
      featured,
      sortOrder,
      isActive
    } = body

    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.reference.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Referencia nem található' },
        { status: 404 }
      )
    }

    // Validáció
    if (companyName !== undefined && !companyName) {
      return NextResponse.json(
        { error: 'A cégnév megadása kötelező' },
        { status: 400 }
      )
    }

    if (testimonial !== undefined && !testimonial) {
      return NextResponse.json(
        { error: 'A vélemény megadása kötelező' },
        { status: 400 }
      )
    }

    const reference = await prisma.reference.update({
      where: { id: parseInt(id) },
      data: {
        companyName: companyName ?? existing.companyName,
        contactName: contactName !== undefined ? contactName : existing.contactName,
        contactRole: contactRole !== undefined ? contactRole : existing.contactRole,
        testimonial: testimonial ?? existing.testimonial,
        logoPath: logoPath !== undefined ? logoPath : existing.logoPath,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : existing.websiteUrl,
        featured: featured !== undefined ? featured : existing.featured,
        sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
        isActive: isActive !== undefined ? isActive : existing.isActive
      }
    })

    return NextResponse.json(reference)
  } catch (error) {
    console.error('Error updating reference:', error)
    return NextResponse.json(
      { error: 'Hiba történt a referencia módosításakor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/references/[id] - Referencia törlése
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.reference.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Referencia nem található' },
        { status: 404 }
      )
    }

    await prisma.reference.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reference:', error)
    return NextResponse.json(
      { error: 'Hiba történt a referencia törlésekor' },
      { status: 500 }
    )
  }
}
