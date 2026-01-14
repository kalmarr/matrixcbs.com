// MATRIX CBS - Admin References API
// GET: Lista, POST: Új referencia

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/references - Referenciák listája
export async function GET() {
  try {
    const references = await prisma.reference.findMany({
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(references)
  } catch (error) {
    console.error('Error fetching references:', error)
    return NextResponse.json(
      { error: 'Hiba történt a referenciák lekérdezésekor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/references - Új referencia létrehozása
export async function POST(request: NextRequest) {
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

    // Validáció
    if (!companyName || !testimonial) {
      return NextResponse.json(
        { error: 'A cégnév és a vélemény megadása kötelező' },
        { status: 400 }
      )
    }

    const reference = await prisma.reference.create({
      data: {
        companyName,
        contactName: contactName || null,
        contactRole: contactRole || null,
        testimonial,
        logoPath: logoPath || null,
        websiteUrl: websiteUrl || null,
        featured: featured ?? false,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(reference, { status: 201 })
  } catch (error) {
    console.error('Error creating reference:', error)
    return NextResponse.json(
      { error: 'Hiba történt a referencia létrehozásakor' },
      { status: 500 }
    )
  }
}
