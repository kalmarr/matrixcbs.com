// MATRIX CBS - Blog Preview Token Utilities
// Token generation and validation for preview links

import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Generate a secure random preview token (64 character hex string)
 * @returns {string} Random 64-character hex token
 */
export function generatePreviewToken(): string {
  // Generate 32 random bytes, convert to hex (64 characters)
  return randomBytes(32).toString('hex');
}

/**
 * Get expiration date for preview token (24 hours from now)
 * @returns {Date} Expiration date
 */
export function getPreviewExpiration(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration;
}

/**
 * Validate a preview token and check if it belongs to the specified post
 * @param {string} token - Preview token to validate
 * @param {number} postId - Post ID to verify against
 * @returns {Promise<boolean>} True if token is valid and not expired
 */
export async function validatePreviewToken(
  token: string,
  postId: number
): Promise<boolean> {
  try {
    // Find post with matching preview token
    const post = await prisma.post.findUnique({
      where: {
        previewToken: token,
      },
      select: {
        id: true,
        previewExpires: true,
      },
    });

    // Check if post exists and matches the expected ID
    if (!post || post.id !== postId) {
      return false;
    }

    // Check if token has expired
    if (!post.previewExpires || post.previewExpires < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Preview token validation error:', error);
    return false;
  }
}

/**
 * Get post by preview token (if valid and not expired)
 * @param {string} token - Preview token
 * @returns {Promise<Post | null>} Post or null if invalid/expired
 */
export async function getPostByPreviewToken(token: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        previewToken: token,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Check if post exists
    if (!post) {
      return null;
    }

    // Check if token has expired
    if (!post.previewExpires || post.previewExpires < new Date()) {
      return null;
    }

    return post;
  } catch (error) {
    console.error('Get post by preview token error:', error);
    return null;
  }
}
