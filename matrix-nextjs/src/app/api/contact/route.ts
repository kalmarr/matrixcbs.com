// MATRIX CBS - Public Contact Form API
// POST: Submit contact message with email notifications

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  sendEmail,
  getAdminNotificationEmail,
  getCustomerConfirmationEmail
} from '@/lib/email'

// Rate limiting map (in-memory, basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limit: 10 messages per 15 minutes per IP
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60 * 1000) // Clean every minute

export async function POST(request: NextRequest) {
  try {
    // Get IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Túl sok üzenet. Kérjük, várjon 15 percet.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, message } = body

    // Validation - firstName required
    if (!firstName || typeof firstName !== 'string') {
      return NextResponse.json(
        { error: 'A keresztnév megadása kötelező' },
        { status: 400 }
      )
    }

    // Validation - lastName required
    if (!lastName || typeof lastName !== 'string') {
      return NextResponse.json(
        { error: 'A vezetéknév megadása kötelező' },
        { status: 400 }
      )
    }

    // Validation - email required
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Az email cím megadása kötelező' },
        { status: 400 }
      )
    }

    // Validation - message required
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Az üzenet megadása kötelező' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Érvénytelen email cím' },
        { status: 400 }
      )
    }

    // Length validation
    if (firstName.length > 50) {
      return NextResponse.json(
        { error: 'A keresztnév túl hosszú (max. 50 karakter)' },
        { status: 400 }
      )
    }

    if (lastName.length > 50) {
      return NextResponse.json(
        { error: 'A vezetéknév túl hosszú (max. 50 karakter)' },
        { status: 400 }
      )
    }

    if (email.length > 254) {
      return NextResponse.json(
        { error: 'Az email cím túl hosszú' },
        { status: 400 }
      )
    }

    if (phone && phone.length > 20) {
      return NextResponse.json(
        { error: 'A telefonszám túl hosszú (max. 20 karakter)' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Az üzenet túl rövid (min. 10 karakter)' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Az üzenet túl hosszú (max. 5000 karakter)' },
        { status: 400 }
      )
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || undefined

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        message: message.trim(),
        ipAddress: ip !== 'unknown' ? ip : null,
        userAgent: userAgent
      }
    })

    // Prepare email data
    const emailData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      message: message.trim(),
      messageId: contactMessage.id
    }

    // Send admin notification email (plain text)
    const adminEmail = getAdminNotificationEmail(emailData)
    const adminEmailSent = await sendEmail(adminEmail)
    if (!adminEmailSent) {
      console.error('Failed to send admin notification email')
    }

    // Send customer confirmation email (HTML)
    const customerEmail = getCustomerConfirmationEmail(emailData)
    const customerEmailSent = await sendEmail(customerEmail)
    if (!customerEmailSent) {
      console.error('Failed to send customer confirmation email')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Üzenetét sikeresen elküldtük. Hamarosan válaszolunk!',
        id: contactMessage.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { error: 'Hiba történt az üzenet küldésekor. Kérjük, próbálja újra később.' },
      { status: 500 }
    )
  }
}
