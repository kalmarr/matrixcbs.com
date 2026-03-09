// Blog content sanitizer - allows rich formatting from TipTap editor
// while protecting against XSS attacks
// NOTE: This is used for trusted admin content, not user-generated content

import DOMPurify from 'isomorphic-dompurify';

const BLOG_DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    // Structure
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'div', 'span',
    // Formatting
    'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'sub', 'sup',
    // Lists
    'ul', 'ol', 'li',
    // Links and media
    'a', 'img', 'figure', 'figcaption',
    // Tables
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Block elements
    'blockquote', 'pre', 'code',
    // TipTap specific
    'iframe',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'width', 'height', 'loading',
    'class', 'style', 'id',
    'colspan', 'rowspan',
    'data-type', 'data-youtube-video',
    'allowfullscreen', 'frameborder',
  ],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['script', 'noscript', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
};

/**
 * Sanitize blog post HTML content from TipTap editor.
 * Allows rich formatting while preventing XSS attacks.
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof dirty !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(dirty, BLOG_DOMPURIFY_CONFIG);
}
