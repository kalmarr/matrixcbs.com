/**
 * Security Utilities
 * HTML sanitization, CSRF protection, and other security helpers
 */

import DOMPurify, { Config } from 'isomorphic-dompurify';

/**
 * DOMPurify configuration for strict HTML sanitization
 */
const DOMPURIFY_CONFIG: Config = {
  ALLOWED_TAGS: [], // No HTML tags allowed by default
  ALLOWED_ATTR: [], // No attributes allowed
  KEEP_CONTENT: true, // Keep text content
};

/**
 * Sanitize HTML input - removes all HTML tags
 * @param dirty - Untrusted input string
 * @returns Sanitized string with HTML removed
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(dirty, DOMPURIFY_CONFIG).trim();
}

/**
 * Sanitize user input with limited formatting allowed
 * Useful for message fields where basic formatting might be acceptable
 */
const RICH_DOMPURIFY_CONFIG: Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

export function sanitizeRichText(dirty: string): string {
  if (typeof dirty !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(dirty, RICH_DOMPURIFY_CONFIG).trim();
}

/**
 * Sanitize an object's string values recursively
 * @param obj - Object to sanitize
 * @returns Object with all string values sanitized
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Escape HTML entities for safe display
 * Use this when you need to display user input as text
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate CSRF token (origin-based)
 * For static sites using PHP backend, we validate the origin header
 */
export function validateOrigin(
  requestOrigin: string | null,
  allowedOrigins: string[]
): boolean {
  if (!requestOrigin) {
    return false;
  }

  return allowedOrigins.some((origin) => {
    // Exact match
    if (requestOrigin === origin) return true;

    // Handle with/without www
    const normalizedRequest = requestOrigin.replace(/^https?:\/\/(www\.)?/, '');
    const normalizedAllowed = origin.replace(/^https?:\/\/(www\.)?/, '');

    return normalizedRequest === normalizedAllowed;
  });
}

/**
 * Generate a simple CSRF token
 * Note: For static sites, we rely on origin validation primarily
 */
export function generateCsrfToken(): string {
  if (typeof window === 'undefined') {
    // Server-side: use crypto
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  } else {
    // Client-side: use Web Crypto API
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * Allowed origins for CSRF validation
 */
export const ALLOWED_ORIGINS = [
  'https://matrixcbs.com',
  'https://www.matrixcbs.com',
  'http://localhost:3000', // Development
];

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Truncate string safely
 */
export function truncate(str: string, maxLength: number): string {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
