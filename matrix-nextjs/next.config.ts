import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Egyedi build ID minden buildnél — cache-busting
  generateBuildId: async () => {
    return Date.now().toString()
  },

  // Gzip/Brotli tömörítés
  compress: true,

  // Turbopack konfiguráció (Next.js 16 top-level)
  turbopack: {},

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  trailingSlash: true,

  // Use standalone output for production deployments
  output: 'standalone',

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Strict mode for better development
  reactStrictMode: true,

  // Image optimization - unoptimized for ISPConfig (no sharp module)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Legacy URL redirects (régi statikus HTML → új Next.js route-ok)
  redirects: async () => [
    // Régi HTML oldalak (statusCode: 301 a 308 helyett a jobb SEO kompatibilitásért)
    { source: '/index.html', destination: '/', statusCode: 301 },
    { source: '/rolunk.html', destination: '/rolunk/', statusCode: 301 },
    { source: '/contact.html', destination: '/kapcsolat/', statusCode: 301 },
    { source: '/trening.html', destination: '/megoldasaink/', statusCode: 301 },
    { source: '/szolgaltasok.html', destination: '/megoldasaink/', statusCode: 301 },
    { source: '/szolgaltatasok.html', destination: '/megoldasaink/', statusCode: 301 },
    // Trailing slash nélküli / ékezet nélküli változatok
    { source: '/trening', destination: '/megoldasaink/', statusCode: 301 },
    { source: '/szolgaltasok', destination: '/megoldasaink/', statusCode: 301 },
    { source: '/szolgaltatasok', destination: '/megoldasaink/', statusCode: 301 },
    { source: '/contact', destination: '/kapcsolat/', statusCode: 301 },
  ],

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://region1.google-analytics.com",
            "frame-src 'self' https://www.google.com https://www.facebook.com",
            "frame-ancestors 'self'",
          ].join('; '),
        },
      ],
    },
  ],

  // Build optimalizáció
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
