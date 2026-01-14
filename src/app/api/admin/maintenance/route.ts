// MATRIX CBS - Maintenance Mode API Routes

import { NextRequest, NextResponse } from 'next/server';
import { getMaintenanceSettings, updateMaintenanceSettings } from '@/lib/maintenance';
import { z } from 'zod';

// Request validation schema
const maintenanceSchema = z.object({
  isActive: z.boolean().optional(),
  message: z.string().nullable().optional(),
  allowedIps: z.array(z.string()).optional(),
  endsAt: z.string().nullable().optional(),
});

/**
 * GET /api/admin/maintenance
 * Get current maintenance mode settings
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // For now, this is unprotected - add auth middleware in production

    const settings = await getMaintenanceSettings();

    return NextResponse.json({
      success: true,
      data: {
        id: settings.id,
        isActive: settings.isActive,
        message: settings.message,
        allowedIps: settings.allowedIps,
        startedAt: settings.startedAt?.toISOString() || null,
        endsAt: settings.endsAt?.toISOString() || null,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to get maintenance settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get maintenance settings',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/maintenance
 * Update maintenance mode settings
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // For now, this is unprotected - add auth middleware in production

    const body = await request.json();

    // Validate request body
    const validation = maintenanceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Prepare update data
    const updateData: any = {};

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (data.message !== undefined) {
      updateData.message = data.message;
    }

    if (data.allowedIps !== undefined) {
      // Validate IP addresses
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      const invalidIps = data.allowedIps.filter(ip => !ipPattern.test(ip));

      if (invalidIps.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid IP addresses',
            details: { invalidIps },
          },
          { status: 400 }
        );
      }

      updateData.allowedIps = data.allowedIps;
    }

    if (data.endsAt !== undefined) {
      if (data.endsAt === null) {
        updateData.endsAt = null;
      } else {
        const endsAt = new Date(data.endsAt);
        if (isNaN(endsAt.getTime())) {
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid date format for endsAt',
            },
            { status: 400 }
          );
        }
        updateData.endsAt = endsAt;
      }
    }

    // Update settings
    const settings = await updateMaintenanceSettings(updateData);

    return NextResponse.json({
      success: true,
      message: 'Maintenance settings updated successfully',
      data: {
        id: settings.id,
        isActive: settings.isActive,
        message: settings.message,
        allowedIps: settings.allowedIps,
        startedAt: settings.startedAt?.toISOString() || null,
        endsAt: settings.endsAt?.toISOString() || null,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to update maintenance settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update maintenance settings',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/maintenance
 * Quick toggle maintenance mode on/off
 */
export async function PATCH(request: NextRequest) {
  try {
    // TODO: Add authentication check here

    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'isActive must be a boolean',
        },
        { status: 400 }
      );
    }

    const settings = await updateMaintenanceSettings({ isActive });

    return NextResponse.json({
      success: true,
      message: `Maintenance mode ${isActive ? 'enabled' : 'disabled'}`,
      data: {
        isActive: settings.isActive,
      },
    });
  } catch (error) {
    console.error('Failed to toggle maintenance mode:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle maintenance mode',
      },
      { status: 500 }
    );
  }
}
