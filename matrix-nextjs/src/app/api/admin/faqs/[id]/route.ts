// MATRIX CBS - Single FAQ API Route
// GET: Get FAQ by ID | PUT: Update FAQ | DELETE: Delete FAQ

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const faqId = parseInt(id)

    if (isNaN(faqId)) {
      return NextResponse.json(
        { error: 'Érvénytelen ID' },
        { status: 400 }
      )
    }

    const faq = await prisma.faq.findUnique({
      where: { id: faqId }
    })

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ nem található' },
        { status: 404 }
      )
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Failed to fetch FAQ:', error)
    return NextResponse.json(
      { error: 'Sikertelen lekérdezés' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const faqId = parseInt(id)

    if (isNaN(faqId)) {
      return NextResponse.json(
        { error: 'Érvénytelen ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { question, answer, category, sortOrder, isActive } = body

    // Validation
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Kérdés és válasz megadása kötelező' },
        { status: 400 }
      )
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: 'A kérdés maximum 500 karakter lehet' },
        { status: 400 }
      )
    }

    const faq = await prisma.faq.update({
      where: { id: faqId },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Failed to update FAQ:', error)
    return NextResponse.json(
      { error: 'Sikertelen frissítés' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const faqId = parseInt(id)

    if (isNaN(faqId)) {
      return NextResponse.json(
        { error: 'Érvénytelen ID' },
        { status: 400 }
      )
    }

    await prisma.faq.delete({
      where: { id: faqId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete FAQ:', error)
    return NextResponse.json(
      { error: 'Sikertelen törlés' },
      { status: 500 }
    )
  }
}
