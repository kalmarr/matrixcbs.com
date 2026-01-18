import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Valid metric names
const VALID_METRICS = ['LCP', 'FID', 'CLS', 'TTFB', 'INP'] as const
type MetricName = (typeof VALID_METRICS)[number]

// Valid ratings
const VALID_RATINGS = ['good', 'needs-improvement', 'poor'] as const
type Rating = (typeof VALID_RATINGS)[number]

// Request body schema
interface WebVitalRequest {
  metric: string
  value: number
  rating: string
  path: string
  userAgent?: string
}

// Simple in-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 10 // Max 10 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // First request or window expired - reset
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false // Rate limit exceeded
  }

  record.count++
  return true
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Túl sok kérés. Kérjük, próbálja újra később.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = (await request.json()) as WebVitalRequest

    // Validate metric name
    if (!VALID_METRICS.includes(body.metric as MetricName)) {
      return NextResponse.json(
        { error: 'Érvénytelen metrika név' },
        { status: 400 }
      )
    }

    // Validate value
    if (typeof body.value !== 'number' || body.value < 0 || !isFinite(body.value)) {
      return NextResponse.json(
        { error: 'Érvénytelen metrika érték' },
        { status: 400 }
      )
    }

    // Validate rating
    if (!VALID_RATINGS.includes(body.rating as Rating)) {
      return NextResponse.json(
        { error: 'Érvénytelen értékelés' },
        { status: 400 }
      )
    }

    // Validate path
    if (!body.path || typeof body.path !== 'string' || body.path.length > 500) {
      return NextResponse.json(
        { error: 'Érvénytelen útvonal' },
        { status: 400 }
      )
    }

    // Store in database
    await prisma.webVital.create({
      data: {
        metric: body.metric,
        value: body.value,
        rating: body.rating,
        path: body.path,
        userAgent: body.userAgent?.substring(0, 500), // Truncate if too long
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error storing web vital:', error)
    return NextResponse.json(
      { error: 'Hiba történt a metrika mentése során' },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving metrics (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')
    const path = searchParams.get('path')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '1000', 10)

    // Build where clause
    const where: any = {}

    if (metric && VALID_METRICS.includes(metric as MetricName)) {
      where.metric = metric
    }

    if (path) {
      where.path = path
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Fetch metrics
    const metrics = await prisma.webVital.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 10000), // Max 10k records
    })

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching web vitals:', error)
    return NextResponse.json(
      { error: 'Hiba történt a metrikák lekérdezése során' },
      { status: 500 }
    )
  }
}
