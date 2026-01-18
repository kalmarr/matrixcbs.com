/**
 * Rate Limiting Utility
 * Implements in-memory rate limiting with LRU cache
 * Limit: 5 requests per minute per IP
 */

import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number; // Time window in milliseconds
  limit: number; // Max requests per interval
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

const defaultOptions: RateLimitOptions = {
  interval: 60 * 1000, // 1 minute
  limit: 5, // 5 requests per minute
};

// LRU cache to store request counts
const rateLimitCache = new LRUCache<string, { count: number; resetTime: number }>({
  max: 500, // Maximum number of IPs to track
  ttl: defaultOptions.interval, // Auto-expire entries
});

/**
 * Check if a request is rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param options - Rate limit configuration
 * @returns Rate limit result with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): RateLimitResult {
  const { interval, limit } = { ...defaultOptions, ...options };
  const now = Date.now();
  const key = identifier;

  const cached = rateLimitCache.get(key);

  if (!cached) {
    // First request from this identifier
    rateLimitCache.set(key, {
      count: 1,
      resetTime: now + interval,
    });
    return {
      success: true,
      remaining: limit - 1,
      reset: now + interval,
    };
  }

  // Check if the window has reset
  if (now >= cached.resetTime) {
    rateLimitCache.set(key, {
      count: 1,
      resetTime: now + interval,
    });
    return {
      success: true,
      remaining: limit - 1,
      reset: now + interval,
    };
  }

  // Increment count
  cached.count += 1;
  rateLimitCache.set(key, cached);

  if (cached.count > limit) {
    return {
      success: false,
      remaining: 0,
      reset: cached.resetTime,
    };
  }

  return {
    success: true,
    remaining: limit - cached.count,
    reset: cached.resetTime,
  };
}

/**
 * Get client IP from request headers
 * Handles proxied requests
 */
export function getClientIP(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Get the first IP in the chain (original client)
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Fallback
  return 'unknown';
}

/**
 * Reset rate limit for an identifier (useful for testing)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitCache.delete(identifier);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitCache.clear();
}
