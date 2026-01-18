// MATRIX CBS - Admin Password Change API
// POST: Change admin password

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Nem vagy bejelentkezve' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'A jelenlegi és új jelszó megadása kötelező' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Az új jelszónak legalább 8 karakter hosszúnak kell lennie' },
        { status: 400 }
      )
    }

    // Get the current user
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Nem található a felhasználó' },
        { status: 404 }
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'A jelenlegi jelszó helytelen' },
        { status: 401 }
      )
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: newPasswordHash
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Hiba történt a jelszó módosítása során' },
      { status: 500 }
    )
  }
}
