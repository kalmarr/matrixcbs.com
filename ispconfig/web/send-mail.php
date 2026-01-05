<?php
/**
 * Contact Form Handler for MATRIX CBS Kft.
 * Secure PHP mail handler for static Next.js site
 * Version: 2.4 - Modern Design Update
 * Updated: 2024-12-22
 */

// Version check endpoint
if (isset($_GET['version'])) {
    header('Content-Type: text/plain');
    echo 'Version 2.4 - Modern Design - ' . date('Y-m-d H:i:s');
    exit;
}

// Start output buffering to prevent any accidental output before JSON
ob_start();

// Disable error display (errors will still be logged)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Configuration
define('ADMIN_EMAIL', 'info@matrixcbs.com');
define('SITE_NAME', 'MATRIX CBS Kft.');
define('MAIL_FROM', 'noreply@matrixcbs.com');

// Clean any output that might have been generated (PHP warnings, etc.)
ob_end_clean();

// Set content type for JSON responses
header('Content-Type: application/json; charset=utf-8');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

/**
 * Sanitize input string
 */
function sanitizeInput(string $input): string {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

/**
 * Validate email format and check for header injection
 */
function isValidEmail(string $email): bool {
    // Check basic format
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        return false;
    }
    // Check for header injection attempts (newlines, carriage returns)
    if (preg_match('/[\r\n]/', $email)) {
        return false;
    }
    return true;
}

/**
 * Send multipart email to user (HTML + Plain Text)
 * Design matches the modern MATRIX CBS website theme (orange + dark gray)
 */
function sendUserEmail(string $to, string $name, string $subject, string $message): bool {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Plain Text Version
    $plainText = "
════════════════════════════════════════════════════════════════
                      MATRIX CBS Kft.
              Út a céljaihoz! · Alapítva 2006
════════════════════════════════════════════════════════════════

Kedves {$name}!

Köszönjük, hogy felkereste cégünket! Üzenetét sikeresen megkaptuk,
és munkatársunk hamarosan felveszi Önnel a kapcsolatot.

────────────────────────────────────────────────────────────────
AZ ÖN ÜZENETE
────────────────────────────────────────────────────────────────

Tárgy: {$subject}

{$message}

────────────────────────────────────────────────────────────────

Üdvözlettel,
MATRIX CBS Kft. csapata

════════════════════════════════════════════════════════════════
MATRIX CBS Kft.
Pulcz utca 3-2., 6724 Szeged
Tel: +36 70 327 2146
E-mail: info@matrixcbs.com
Web: https://matrixcbs.com

Felnőttképző nyilvántartásba vételi szám: B/2020/000668
════════════════════════════════════════════════════════════════
";

    // HTML Version - Modern MATRIX CBS Design (Orange + Dark Gray)
    $htmlBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Köszönjük megkeresését!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #f9fafb;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

                    <!-- Header - Dark Gray with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%); padding: 48px 40px; text-align: center; position: relative;">
                            <!-- Decorative accent -->
                            <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: linear-gradient(135deg, rgba(232, 90, 36, 0.15) 0%, transparent 70%);"></div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">MATRIX <span style="color: #E85A24;">CBS</span></h1>
                            <p style="color: #E85A24; margin: 12px 0 0 0; font-size: 14px; font-weight: 600; letter-spacing: 1px;">Út a céljaihoz! · Alapítva 2006</p>
                        </td>
                    </tr>

                    <!-- Orange Accent Line with Burgundy gradient -->
                    <tr>
                        <td style="background: linear-gradient(90deg, #E85A24 0%, #9B2C2C 100%); height: 4px;"></td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px; background-color: #ffffff;">
                            <h2 style="color: #111827; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">Kedves ' . $safeName . '!</h2>

                            <p style="color: #4b5563; line-height: 1.7; margin: 0 0 28px 0; font-size: 16px;">
                                Köszönjük, hogy felkereste cégünket! Üzenetét sikeresen megkaptuk, és munkatársunk hamarosan felveszi Önnel a kapcsolatot.
                            </p>

                            <!-- Message Box -->
                            <div style="background-color: #f9fafb; border-left: 4px solid #E85A24; border-radius: 0 12px 12px 0; padding: 24px; margin: 32px 0;">
                                <p style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
                                    <span style="color: #E85A24;">●</span> Az Ön üzenete
                                </p>
                                <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">
                                    <strong style="color: #374151;">Tárgy:</strong> ' . $safeSubject . '
                                </p>
                                <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">' . $safeMessage . '</p>
                            </div>

                            <p style="color: #4b5563; line-height: 1.7; margin: 32px 0 0 0; font-size: 16px;">
                                Üdvözlettel,
                            </p>
                            <p style="color: #111827; margin: 8px 0 0 0; font-size: 18px; font-weight: 600;">
                                MATRIX CBS Kft. csapata
                            </p>
                        </td>
                    </tr>

                    <!-- Footer - Dark Gray with Burgundy border -->
                    <tr>
                        <td style="background-color: #111827; border-top: 4px solid #9B2C2C; padding: 32px 40px; text-align: center;">
                            <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 14px;">
                                <strong style="color: #ffffff;">MATRIX CBS Kft.</strong>
                            </p>
                            <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 13px; line-height: 1.6;">
                                Pulcz utca 3-2., 6724 Szeged<br>
                                <a href="tel:+36703272146" style="color: #9ca3af; text-decoration: none;">+36 70 327 2146</a> · <a href="mailto:info@matrixcbs.com" style="color: #9ca3af; text-decoration: none;">info@matrixcbs.com</a>
                            </p>
                            <div style="border-top: 1px solid #374151; padding-top: 16px; margin-top: 8px;">
                                <p style="color: #6b7280; margin: 0 0 4px 0; font-size: 11px;">
                                    Felnőttképző nyilvántartásba vételi szám: <span style="color: #E85A24; font-weight: 600;">B/2020/000668</span>
                                </p>
                            </div>
                        </td>
                    </tr>

                </table>

                <!-- Footer Links -->
                <table role="presentation" style="max-width: 600px; margin: 24px auto 0;">
                    <tr>
                        <td style="text-align: center;">
                            <p style="color: #9ca3af; margin: 0 0 12px 0; font-size: 12px;">
                                <a href="https://matrixcbs.com" style="color: #E85A24; text-decoration: none; font-weight: 600;">matrixcbs.com</a>
                            </p>
                            <p style="color: #6b7280; margin: 0; font-size: 11px;">
                                © ' . date('Y') . ' MATRIX CBS Kft. Minden jog fenntartva.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>';

    // Create multipart boundary
    $boundary = md5(time());

    // Multipart headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
        'Reply-To: ' . ADMIN_EMAIL,
        'X-Mailer: PHP/' . phpversion()
    ];

    // Multipart body
    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $plainText . "\r\n\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $htmlBody . "\r\n\r\n";
    $body .= "--{$boundary}--";

    return mail($to, '=?UTF-8?B?' . base64_encode('Köszönjük megkeresését! - ' . SITE_NAME) . '?=', $body, implode("\r\n", $headers));
}

/**
 * Send plain text email to admin
 */
function sendAdminEmail(string $name, string $email, string $subject, string $message, string $ip): bool {
    $timestamp = date('Y-m-d H:i:s');

    $body = "Új üzenet érkezett a weboldalról\n";
    $body .= "════════════════════════════════\n\n";
    $body .= "Időpont: {$timestamp}\n";
    $body .= "IP cím: {$ip}\n\n";
    $body .= "Küldő adatai:\n";
    $body .= "─────────────\n";
    $body .= "Név: {$name}\n";
    $body .= "E-mail: {$email}\n\n";
    $body .= "Tárgy: {$subject}\n\n";
    $body .= "Üzenet:\n";
    $body .= "───────\n";
    $body .= $message . "\n";

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion()
    ];

    return mail(ADMIN_EMAIL, '=?UTF-8?B?' . base64_encode('[Weboldal] ' . $subject) . '?=', $body, implode("\r\n", $headers));
}

// Main form processing
try {
    // Honeypot check - if filled, it's a bot
    if (!empty($_POST['website'])) {
        // Bot detected, silently accept but don't process
        echo json_encode(['success' => true, 'message' => 'Üzenet sikeresen elküldve!']);
        exit;
    }

    // Get and sanitize inputs
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $captcha = $_POST['captcha'] ?? '';
    $captchaAnswer = $_POST['captcha_answer'] ?? '';

    // GDPR consent validation (accepts: 'on', 'true', '1', true, 1)
    $gdprValue = $_POST['gdpr_consent'] ?? '';
    $gdprConsent = in_array($gdprValue, ['on', 'true', '1', true, 1], true) || $gdprValue === true;
    if (!$gdprConsent) {
        throw new Exception('Kérjük, fogadja el az adatvédelmi tájékoztató feltételeit.');
    }

    // Validation
    $errors = [];

    if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
        $errors[] = 'Érvénytelen név (2-100 karakter szükséges).';
    }

    if (empty($email) || !isValidEmail($email)) {
        $errors[] = 'Érvénytelen e-mail cím.';
    }

    if (empty($subject) || strlen($subject) < 3 || strlen($subject) > 200) {
        $errors[] = 'Érvénytelen tárgy (3-200 karakter szükséges).';
    }

    if (empty($message) || strlen($message) < 10 || strlen($message) > 5000) {
        $errors[] = 'Érvénytelen üzenet (10-5000 karakter szükséges).';
    }

    // Validate CAPTCHA
    if ($captcha !== $captchaAnswer) {
        $errors[] = 'Hibás biztonsági válasz.';
    }

    if (!empty($errors)) {
        throw new Exception(implode(' ', $errors));
    }

    // Get client IP
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

    // Send emails
    $adminSent = sendAdminEmail($name, $email, $subject, $message, $ip);
    $userSent = sendUserEmail($email, $name, $subject, $message);

    if (!$adminSent && !$userSent) {
        throw new Exception('Hiba történt az üzenet küldése közben. Kérem, próbálkozzon később.');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
