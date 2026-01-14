// MATRIX CBS - Maintenance Mode Middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow access to maintenance page
  if (pathname === '/maintenance') {
    return NextResponse.next();
  }

  // Always allow access to admin routes (admins need to manage maintenance mode)
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Always allow access to API routes (needed for admin functionality)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check maintenance mode via API (avoids Edge Runtime Prisma issues)
  try {
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/maintenance/status`, {
      headers: {
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'x-real-ip': request.headers.get('x-real-ip') || '',
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.shouldRedirect) {
        // Redirect to maintenance page
        const maintenanceUrl = new URL('/maintenance', request.url);
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  } catch (error) {
    // On error, let users through (fail open)
    console.error('Maintenance check failed:', error);
  }

  return NextResponse.next();
}

// Configure which routes should be handled by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
