<?php
/**
 * Contact Form Handler for MATRIX CBS Kft.
 * Secure PHP mail handler with CSRF protection, validation, and dual email sending
 */

// Start output buffering to prevent any accidental output before JSON
ob_start();

// Disable error display (errors will still be logged)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Start session for CSRF token management
session_start();

// Configuration
define('ADMIN_EMAIL', 'info@matrixcbs.com');
define('SITE_NAME', 'MATRIX CBS Kft.');
define('MAIL_FROM', 'noreply@matrixcbs.com');
define('RATE_LIMIT_SECONDS', 60);

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
 * Generate CSRF token
 */
function generateCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF token
 */
function validateCsrfToken(string $token): bool {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Rate limiting check
 */
function checkRateLimit(): bool {
    $lastSubmission = $_SESSION['last_submission'] ?? 0;
    if (time() - $lastSubmission < RATE_LIMIT_SECONDS) {
        return false;
    }
    $_SESSION['last_submission'] = time();
    return true;
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
 * Design matches the Editorial Sophistication website theme
 */
function sendUserEmail(string $to, string $name, string $subject, string $message): bool {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Plain Text Version
    $plainText = "
════════════════════════════════════════════════════════════════
                      MATRIX CBS Kft.
              Út a céljaihoz! - Alapítva 2006.
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

    // HTML Version - Editorial Sophistication Design
    $htmlBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Köszönjük megkeresését!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #faf8f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);">

                    <!-- Header - Deep Navy -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5a 100%); padding: 48px 40px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-family: Georgia, Times, serif; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">MATRIX CBS</h1>
                            <p style="color: #f59e0b; margin: 12px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Út a céljaihoz! · Alapítva 2006</p>
                        </td>
                    </tr>

                    <!-- Amber Accent Line -->
                    <tr>
                        <td style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); height: 4px;"></td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h2 style="color: #0f172a; margin: 0 0 24px 0; font-family: Georgia, Times, serif; font-size: 24px; font-weight: 500;">Kedves ' . $safeName . '!</h2>

                            <p style="color: #475569; line-height: 1.7; margin: 0 0 28px 0; font-size: 16px;">
                                Köszönjük, hogy felkereste cégünket! Üzenetét sikeresen megkaptuk, és munkatársunk hamarosan felveszi Önnel a kapcsolatot.
                            </p>

                            <!-- Message Box -->
                            <div style="background-color: #faf8f5; border-left: 4px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 24px; margin: 32px 0;">
                                <p style="color: #0f172a; margin: 0 0 16px 0; font-family: Georgia, Times, serif; font-size: 18px; font-weight: 500;">
                                    <span style="color: #f59e0b;">✦</span> Az Ön üzenete
                                </p>
                                <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">
                                    <strong style="color: #334155;">Tárgy:</strong> ' . $safeSubject . '
                                </p>
                                <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">' . $safeMessage . '</p>
                            </div>

                            <p style="color: #475569; line-height: 1.7; margin: 32px 0 0 0; font-size: 16px;">
                                Üdvözlettel,
                            </p>
                            <p style="color: #0f172a; margin: 8px 0 0 0; font-family: Georgia, Times, serif; font-size: 18px; font-weight: 500;">
                                MATRIX CBS Kft. csapata
                            </p>
                        </td>
                    </tr>

                    <!-- Footer - Deep Navy -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5a 100%); padding: 32px 40px; text-align: center;">
                            <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 14px;">
                                <strong style="color: #ffffff;">MATRIX CBS Kft.</strong>
                            </p>
                            <p style="color: #64748b; margin: 0 0 16px 0; font-size: 13px; line-height: 1.5;">
                                Pulcz utca 3-2., 6724 Szeged<br>
                                Tel: +36 70 327 2146 · info@matrixcbs.com
                            </p>
                            <p style="color: #475569; margin: 0; font-size: 11px; border-top: 1px solid #334155; padding-top: 16px;">
                                Felnőttképző nyilvántartásba vételi szám: B/2020/000668
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Footer Links -->
                <table role="presentation" style="max-width: 600px; margin: 24px auto 0;">
                    <tr>
                        <td style="text-align: center;">
                            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                                <a href="https://matrixcbs.com" style="color: #f59e0b; text-decoration: none;">matrixcbs.com</a>
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

    $body = "Uj uzenet erkezett a weboldalrol\n";
    $body .= "================================\n\n";
    $body .= "Idopont: {$timestamp}\n";
    $body .= "IP cim: {$ip}\n\n";
    $body .= "Kuldo adatai:\n";
    $body .= "-------------\n";
    $body .= "Nev: {$name}\n";
    $body .= "E-mail: {$email}\n\n";
    $body .= "Targy: {$subject}\n\n";
    $body .= "Uzenet:\n";
    $body .= "-------\n";
    $body .= $message . "\n";

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion()
    ];

    return mail(ADMIN_EMAIL, '=?UTF-8?B?' . base64_encode('[Weboldal] ' . $subject) . '?=', $body, implode("\r\n", $headers));
}

// Handle token request
if (isset($_POST['action']) && $_POST['action'] === 'get_token') {
    echo json_encode(['token' => generateCsrfToken()]);
    exit;
}

// Main form processing
try {
    // Rate limiting
    if (!checkRateLimit()) {
        throw new Exception('Kerem, varjon egy percet a kovetkezo uzenet kuldese elott.');
    }

    // Validate CSRF token
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!validateCsrfToken($csrfToken)) {
        throw new Exception('Ervenytelen biztonsagi token. Kerem, frissitse az oldalt es probalkozzon ujra.');
    }

    // Honeypot check - if filled, it's a bot
    if (!empty($_POST['website'])) {
        // Bot detected, silently accept but don't process
        echo json_encode(['success' => true, 'message' => 'Uzenet sikeresen elkuldve!']);
        exit;
    }

    // Get and sanitize inputs
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $captcha = $_POST['captcha'] ?? '';
    $captchaAnswer = $_POST['captcha_answer'] ?? '';

    // GDPR consent validation
    $gdprConsent = isset($_POST['gdpr_consent']) && $_POST['gdpr_consent'] === 'on';
    if (!$gdprConsent) {
        throw new Exception('Kerjuk, fogadja el az adatvedelmi tajekoztato feltételeit.');
    }

    // Validation
    $errors = [];

    if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
        $errors[] = 'Ervenytelen nev (2-100 karakter szukseges).';
    }

    if (empty($email) || !isValidEmail($email)) {
        $errors[] = 'Ervenytelen e-mail cim.';
    }

    if (empty($subject) || strlen($subject) < 3 || strlen($subject) > 200) {
        $errors[] = 'Ervenytelen targy (3-200 karakter szukseges).';
    }

    if (empty($message) || strlen($message) < 10 || strlen($message) > 5000) {
        $errors[] = 'Ervenytelen uzenet (10-5000 karakter szukseges).';
    }

    // Validate CAPTCHA
    if ($captcha !== $captchaAnswer) {
        $errors[] = 'Hibas biztonsagi valasz.';
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
        throw new Exception('Hiba tortent az uzenet kuldese kozben. Kerem, probalkozzon kesobb.');
    }

    // Regenerate CSRF token after successful submission
    unset($_SESSION['csrf_token']);

    echo json_encode([
        'success' => true,
        'message' => 'Koszonjuk uzenetet! Hamarosan felvesszuk Onnel a kapcsolatot.'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
