// MATRIX CBS - Middleware (Maintenance Mode + Admin Authentication)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow access to maintenance page
  if (pathname === '/maintenance') {
    return NextResponse.next();
  }

  // Always allow NextAuth API routes (needed for authentication)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Always allow admin login page (needed to authenticate)
  // Handle both with and without trailing slash
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return NextResponse.next();
  }

  // Protect admin routes - check authentication using NextAuth v5 auth()
  if (pathname.startsWith('/admin')) {
    const session = await auth();

    if (!session) {
      // Not authenticated - redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated - allow access
    return NextResponse.next();
  }

  // Protect admin API routes - check authentication
  if (pathname.startsWith('/api/admin')) {
    const session = await auth();

    if (!session) {
      // Not authenticated - return 401
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Authenticated - allow access
    return NextResponse.next();
  }

  // Allow all other API routes (public APIs)
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
