// MATRIX CBS - Public Contact Form API
// POST: Submit contact message with email notifications

import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import {
  sendEmail,
  getAdminNotificationEmail,
  getCustomerConfirmationEmail
} from '@/lib/email'
import {
  jsonResponse,
  createdResponse,
  badRequestResponse,
  serverErrorResponse
} from '@/lib/api-utils'

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
      return jsonResponse(
        { error: 'Túl sok üzenet. Kérjük, várjon 15 percet.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, message } = body

    // Validation - firstName required
    if (!firstName || typeof firstName !== 'string') {
      return badRequestResponse('A keresztnév megadása kötelező')
    }

    // Validation - lastName required
    if (!lastName || typeof lastName !== 'string') {
      return badRequestResponse('A vezetéknév megadása kötelező')
    }

    // Validation - email required
    if (!email || typeof email !== 'string') {
      return badRequestResponse('Az email cím megadása kötelező')
    }

    // Validation - message required
    if (!message || typeof message !== 'string') {
      return badRequestResponse('Az üzenet megadása kötelező')
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return badRequestResponse('Érvénytelen email cím')
    }

    // Length validation
    if (firstName.length > 50) {
      return badRequestResponse('A keresztnév túl hosszú (max. 50 karakter)')
    }

    if (lastName.length > 50) {
      return badRequestResponse('A vezetéknév túl hosszú (max. 50 karakter)')
    }

    if (email.length > 254) {
      return badRequestResponse('Az email cím túl hosszú')
    }

    if (phone && phone.length > 20) {
      return badRequestResponse('A telefonszám túl hosszú (max. 20 karakter)')
    }

    if (message.length < 10) {
      return badRequestResponse('Az üzenet túl rövid (min. 10 karakter)')
    }

    if (message.length > 5000) {
      return badRequestResponse('Az üzenet túl hosszú (max. 5000 karakter)')
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

    return createdResponse({
      success: true,
      message: 'Üzenetét sikeresen elküldtük. Hamarosan válaszolunk!',
      id: contactMessage.id
    })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return serverErrorResponse('Hiba történt az üzenet küldésekor. Kérjük, próbálja újra később.')
  }
}
