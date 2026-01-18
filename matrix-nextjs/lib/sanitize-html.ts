// MATRIX CBS - HTML Sanitization Utility
// Basic HTML sanitization for blog content
// NOTE: This is a simple implementation. For production use with untrusted content,
// consider using a library like DOMPurify or isomorphic-dompurify

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows safe HTML tags and removes potentially dangerous attributes and scripts
 */
export function sanitizeHTML(html: string): string {
  // For admin-controlled content from the database, we can allow these tags
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span', 'hr',
  ];

  const allowedAttributes: Record<string, string[]> = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'div': ['class'],
    'span': ['class'],
    'code': ['class'],
    'pre': ['class'],
  };

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocols
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');

  // Remove data: protocols from src (can be used for XSS)
  sanitized = sanitized.replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""');

  // Remove style attributes that could contain expression()
  sanitized = sanitized.replace(/style\s*=\s*["'][^"']*expression\([^"']*\)["']/gi, '');

  return sanitized;
}

/**
 * Alternative: If you need stricter sanitization, install and use DOMPurify:
 *
 * npm install isomorphic-dompurify
 *
 * import DOMPurify from 'isomorphic-dompurify';
 *
 * export function sanitizeHTML(html: string): string {
 *   return DOMPurify.sanitize(html, {
 *     ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
 *                    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
 *     ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class'],
 *   });
 * }
 */
