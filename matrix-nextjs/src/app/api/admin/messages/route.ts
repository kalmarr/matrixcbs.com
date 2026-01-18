// MATRIX CBS - Admin Messages API
// GET: List messages with filters and pagination

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'

export async function GET(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)

    // Filters
    const filter = searchParams.get('filter') || 'all' // all, unread, archived
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    if (filter === 'unread') {
      where.isRead = false
      where.isArchived = false
    } else if (filter === 'archived') {
      where.isArchived = true
    } else if (filter === 'all') {
      // Show all non-archived by default
      where.isArchived = false
    }

    // Search in firstName, lastName, email
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count
    const total = await prisma.contactMessage.count({ where })

    // Get messages with pagination
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        message: true,
        isRead: true,
        isArchived: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Hiba történt az üzenetek lekérdezésekor' },
      { status: 500 }
    )
  }
}
