// MATRIX CBS - FAQ API Route
// GET: List all FAQs | POST: Create new FAQ

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const faqs = await prisma.faq.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Group by category
    const groupedFaqs: Record<string, typeof faqs> = {}
    faqs.forEach((faq) => {
      const category = faq.category || 'Általános'
      if (!groupedFaqs[category]) {
        groupedFaqs[category] = []
      }
      groupedFaqs[category].push(faq)
    })

    return NextResponse.json({
      faqs,
      groupedFaqs,
      categories: Object.keys(groupedFaqs).sort()
    })
  } catch (error) {
    console.error('Failed to fetch FAQs:', error)
    return NextResponse.json(
      { error: 'Sikertelen lekérdezés' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const faq = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('Failed to create FAQ:', error)
    return NextResponse.json(
      { error: 'Sikertelen létrehozás' },
      { status: 500 }
    )
  }
}
