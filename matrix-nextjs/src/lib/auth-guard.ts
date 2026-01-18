// MATRIX CBS - Auth Guard for Admin API Routes
// Provides authentication middleware for protected API endpoints

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

interface AuthResult {
  session: {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role?: string
    }
  }
  adminId: number
  error?: never
}

interface AuthError {
  error: NextResponse
  session?: never
  adminId?: never
}

/**
 * Checks if the current request has a valid admin session
 * Returns session data or a 401 error response
 */
export async function requireAuth(): Promise<AuthResult | AuthError> {
  const session = await auth()

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: 'Nincs bejelentkezve. Kérjük, jelentkezzen be.' },
        { status: 401 }
      )
    }
  }

  const adminId = parseInt(session.user.id)

  if (isNaN(adminId)) {
    return {
      error: NextResponse.json(
        { error: 'Érvénytelen felhasználói azonosító' },
        { status: 401 }
      )
    }
  }

  return {
    session,
    adminId
  }
}
