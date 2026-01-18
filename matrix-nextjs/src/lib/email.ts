// MATRIX CBS - Email Utility
// Nodemailer-based email sending with HTML templates
// Uses sendmail (Postfix) in production, SMTP in development

import nodemailer from 'nodemailer'

// Helper to sanitize email fields (prevent header injection)
function sanitizeEmailField(value: string): string {
  return value.replace(/[\r\n]/g, '').trim()
}

// Helper to escape HTML in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Create transporter based on environment
function createTransporter() {
  // Use sendmail/Postfix in production (no SMTP config needed)
  if (process.env.USE_SENDMAIL === 'true' || !process.env.SMTP_HOST) {
    console.log('Using sendmail transport (Postfix)')
    return nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: process.env.SENDMAIL_PATH || '/usr/sbin/sendmail'
    })
  }

  // Use SMTP in development
  console.log('Using SMTP transport:', process.env.SMTP_HOST)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Create transporter (lazy init)
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter()
  }
  return transporter
}

// Email sending interface
interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

// Send email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter()

    const mailOptions = {
      from: `"MATRIX CBS" <${process.env.EMAIL_FROM || 'info@matrixcbs.com'}>`,
      to: sanitizeEmailField(options.to),
      subject: sanitizeEmailField(options.subject),
      text: options.text,
      html: options.html
    }

    const info = await transport.sendMail(mailOptions)
    console.log('Email sent:', info.messageId || info.envelope?.from || 'OK')
    return true
  } catch (error) {
    console.error('Email send failed:', error)
    return false
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string
  messageId: number
}

// Admin notification email (plain text)
export function getAdminNotificationEmail(data: ContactFormData): EmailOptions {
  // Sanitize user input for email headers
  const safeFirstName = sanitizeEmailField(data.firstName)
  const safeLastName = sanitizeEmailField(data.lastName)
  const safeEmail = sanitizeEmailField(data.email)
  const safePhone = data.phone ? sanitizeEmailField(data.phone) : 'Nincs megadva'
  const safeMessage = data.message.trim()
  const fullName = `${safeLastName} ${safeFirstName}`

  const text = `
Új üzenet érkezett a MATRIX CBS weboldalról!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FELADÓ ADATAI:
  Név: ${fullName}
  Email: ${safeEmail}
  Telefon: ${safePhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ÜZENET:

${safeMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Az üzenet megtekintése az admin felületen:
https://matrixcbs.com/admin/messages

--
MATRIX CBS Automatikus értesítés
Üzenet azonosító: #${data.messageId}
`.trim()

  return {
    to: 'info@matrixcbs.com',
    subject: `[MATRIX CBS] Új üzenet: ${fullName}`,
    text
  }
}

// Customer confirmation email (HTML)
export function getCustomerConfirmationEmail(data: ContactFormData): EmailOptions {
  // Escape HTML to prevent XSS in email
  const safeFirstName = escapeHtml(sanitizeEmailField(data.firstName))
  const safeLastName = escapeHtml(sanitizeEmailField(data.lastName))
  const safeEmail = escapeHtml(sanitizeEmailField(data.email))
  const safePhone = data.phone ? escapeHtml(sanitizeEmailField(data.phone)) : 'Nincs megadva'
  const safeMessage = escapeHtml(data.message.trim())
  const fullName = `${safeLastName} ${safeFirstName}`

  const html = `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Köszönjük üzenetét! - MATRIX CBS</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px 40px; text-align: center;">
        <img src="https://matrixcbs.com/logo/logo-transparent.png" alt="MATRIX CBS" style="max-width: 180px; height: auto;">
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin: 0 0 20px 0;">
          Kedves ${safeFirstName}!
        </h1>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Köszönjük, hogy kapcsolatba lépett velünk! Üzenetét sikeresen megkaptuk, és munkatársaink hamarosan felveszik Önnel a kapcsolatot.
        </p>

        <!-- Full form data summary -->
        <div style="background-color: #f8f9fa; border-left: 4px solid #e63946; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: #1a1a2e; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">
            Az Ön által megadott adatok:
          </h3>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #888; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #e0e0e0; width: 100px;">Név:</td>
              <td style="color: #333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: 500;">${fullName}</td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">E-mail:</td>
              <td style="color: #333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">Telefon:</td>
              <td style="color: #333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${safePhone}</td>
            </tr>
          </table>

          <h4 style="color: #1a1a2e; font-size: 13px; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
            Üzenet:
          </h4>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; background: #fff; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0;">${safeMessage}</p>
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Amennyiben sürgős kérdése lenne, hívjon minket közvetlenül:
        </p>

        <p style="color: #e63946; font-size: 18px; font-weight: bold; margin: 0 0 30px 0;">
          +36 70 327 2146
        </p>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
          Üdvözlettel,<br>
          <strong style="color: #1a1a2e;">A MATRIX CBS csapata</strong>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #1a1a2e; padding: 30px 40px; text-align: center;">
        <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
          MATRIX CBS Kft.
        </p>
        <p style="color: #aaa; font-size: 12px; margin: 0 0 5px 0;">
          6724 Szeged, Pulcz utca 3-2.
        </p>
        <p style="color: #aaa; font-size: 12px; margin: 0 0 15px 0;">
          Felnőttképzési nyilvántartási szám: B/2020/000668
        </p>

        <div style="margin-top: 15px;">
          <a href="https://matrixcbs.com" style="color: #e63946; text-decoration: none; font-size: 12px;">matrixcbs.com</a>
          <span style="color: #555; margin: 0 10px;">|</span>
          <a href="https://www.linkedin.com/company/matrixcbs" style="color: #e63946; text-decoration: none; font-size: 12px;">LinkedIn</a>
        </div>
      </td>
    </tr>
  </table>

  <!-- Disclaimer -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="padding: 20px 40px; text-align: center;">
        <p style="color: #999; font-size: 11px; margin: 0;">
          Ez egy automatikus értesítés. Kérjük, ne válaszoljon erre az e-mailre.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  // Plain text version (sanitized)
  const safeFirstNameText = sanitizeEmailField(data.firstName)
  const safeLastNameText = sanitizeEmailField(data.lastName)
  const safeEmailText = sanitizeEmailField(data.email)
  const safePhoneText = data.phone ? sanitizeEmailField(data.phone) : 'Nincs megadva'
  const safeMessageText = data.message.trim()
  const fullNameText = `${safeLastNameText} ${safeFirstNameText}`

  const text = `
Kedves ${safeFirstNameText}!

Köszönjük, hogy kapcsolatba lépett velünk! Üzenetét sikeresen megkaptuk, és munkatársaink hamarosan felveszik Önnel a kapcsolatot.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AZ ÖN ÁLTAL MEGADOTT ADATOK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Név:      ${fullNameText}
E-mail:   ${safeEmailText}
Telefon:  ${safePhoneText}

ÜZENET:
${safeMessageText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amennyiben sürgős kérdése lenne, hívjon minket közvetlenül: +36 70 327 2146

Üdvözlettel,
A MATRIX CBS csapata

--
MATRIX CBS Kft.
6724 Szeged, Pulcz utca 3-2.
Felnőttképzési nyilvántartási szám: B/2020/000668
https://matrixcbs.com
`.trim()

  return {
    to: data.email,
    subject: 'Köszönjük üzenetét! - MATRIX CBS',
    html,
    text
  }
}
