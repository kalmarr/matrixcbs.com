// MATRIX CBS - Admin Single Message API
// GET: Get message details (marks as read)
// PUT: Update message (isRead, isArchived)
// DELETE: Delete message

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-guard'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/admin/messages/[id] - Get message details
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { id: idStr } = await context.params
    const id = parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Érvénytelen üzenet azonosító' },
        { status: 400 }
      )
    }

    // Get message and mark as read
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        message: true,
        isRead: true,
        isArchived: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true
      }
    })

    return NextResponse.json(message)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Üzenet nem található' },
        { status: 404 }
      )
    }

    console.error('Error fetching message:', error)
    return NextResponse.json(
      { error: 'Hiba történt az üzenet lekérdezésekor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/messages/[id] - Update message
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { id: idStr } = await context.params
    const id = parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Érvénytelen üzenet azonosító' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { isRead, isArchived } = body

    // Build update data
    const data: Record<string, boolean> = {}
    if (typeof isRead === 'boolean') {
      data.isRead = isRead
    }
    if (typeof isArchived === 'boolean') {
      data.isArchived = isArchived
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Nincs frissíthető mező megadva' },
        { status: 400 }
      )
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data,
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

    return NextResponse.json(message)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Üzenet nem található' },
        { status: 404 }
      )
    }

    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Hiba történt az üzenet frissítésekor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { id: idStr } = await context.params
    const id = parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Érvénytelen üzenet azonosító' },
        { status: 400 }
      )
    }

    await prisma.contactMessage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Üzenet nem található' },
        { status: 404 }
      )
    }

    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Hiba történt az üzenet törlésekor' },
      { status: 500 }
    )
  }
}
