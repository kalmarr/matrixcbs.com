<?php
/**
 * Contact Form Handler for MATRIX CBS Kft.
 * Secure PHP mail handler with CSRF protection, validation, and dual email sending
 */

// Start session for CSRF token management
session_start();

// Configuration
define('ADMIN_EMAIL', 'info@matrixcbs.com');
define('SITE_NAME', 'MATRIX CBS Kft.');
define('MAIL_FROM', 'noreply@matrixcbs.com');
define('RATE_LIMIT_SECONDS', 60);

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
 * Send HTML email to user
 */
function sendUserEmail(string $to, string $name, string $subject, string $message): bool {
    $htmlBody = '<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koszonjuk megkereseset!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #f68616; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">MATRIX CBS Kft.</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Ut a celjaihoz! - Alapitva 2006.</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 20px;">Kedves ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '!</h2>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                                Koszonjuk, hogy felkereste cegunkot! Uzenetet sikeresen megkaptuk, es munkatarsunk hamarosan felveszi Onnel a kapcsolatot.
                            </p>
                            <div style="background-color: #f9f9f9; border-left: 4px solid #f68616; padding: 15px; margin: 20px 0;">
                                <p style="color: #333333; margin: 0 0 10px 0;"><strong>Az On uzenete:</strong></p>
                                <p style="color: #666666; margin: 0 0 5px 0;"><strong>Targy:</strong> ' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '</p>
                                <p style="color: #666666; margin: 0; white-space: pre-wrap;">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>
                            </div>
                            <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0;">
                                Udvozlettel,<br>
                                <strong style="color: #f68616;">MATRIX CBS Kft. csapata</strong>
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #C0392B; padding: 20px 30px; text-align: center;">
                            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 12px;">
                                MATRIX CBS Kft. | Pulcz utca 3-2., 6724 Szeged | Tel: +36 70 327 2146
                            </p>
                            <p style="color: #ffffff; margin: 0; font-size: 11px;">
                                Felnottkepzo nyilvantartasba veteli szam: B/2020/000668
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . SITE_NAME . ' <' . MAIL_FROM . '>',
        'Reply-To: ' . ADMIN_EMAIL,
        'X-Mailer: PHP/' . phpversion()
    ];

    return mail($to, '=?UTF-8?B?' . base64_encode('Koszonjuk megkereseset! - ' . SITE_NAME) . '?=', $htmlBody, implode("\r\n", $headers));
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
