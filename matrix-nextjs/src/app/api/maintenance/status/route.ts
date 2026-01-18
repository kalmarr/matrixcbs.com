// MATRIX CBS - Maintenance Status API
// This endpoint is used by the middleware to check maintenance status
// without using Prisma directly in Edge Runtime

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get client IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    let clientIp = '';
    if (forwardedFor) {
      clientIp = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      clientIp = realIp;
    }

    // Normalize IP
    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
      clientIp = '127.0.0.1';
    }
    if (clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.substring(7);
    }

    // Get maintenance settings
    const settings = await prisma.maintenanceMode.findFirst();

    if (!settings || !settings.isActive) {
      return NextResponse.json({
        isActive: false,
        shouldRedirect: false
      });
    }

    // Check if IP is allowed
    let allowedIps: string[] = [];
    if (settings.allowedIps) {
      try {
        allowedIps = JSON.parse(settings.allowedIps);
      } catch {
        allowedIps = [];
      }
    }

    const ipAllowed = allowedIps.length === 0 ? false : allowedIps.includes(clientIp);

    return NextResponse.json({
      isActive: true,
      shouldRedirect: !ipAllowed,
      message: settings.message
    });
  } catch (error) {
    console.error('Maintenance status check error:', error);
    // On error, don't block - let users through
    return NextResponse.json({
      isActive: false,
      shouldRedirect: false
    });
  }
}
