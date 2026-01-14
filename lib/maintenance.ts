// MATRIX CBS - Maintenance Mode Helper Functions

import { prisma } from '@/lib/prisma';

export interface MaintenanceSettings {
  id: number;
  isActive: boolean;
  message: string | null;
  allowedIps: string[];
  startedAt: Date | null;
  endsAt: Date | null;
  updatedAt: Date;
}

/**
 * Get maintenance mode settings from database
 * Creates default settings if none exist
 */
export async function getMaintenanceSettings(): Promise<MaintenanceSettings> {
  let settings = await prisma.maintenanceMode.findFirst();

  // Create default settings if none exist
  if (!settings) {
    settings = await prisma.maintenanceMode.create({
      data: {
        isActive: false,
        message: null,
        allowedIps: null,
        startedAt: null,
        endsAt: null,
      },
    });
  }

  // Parse allowed IPs from JSON string
  let allowedIps: string[] = [];
  if (settings.allowedIps) {
    try {
      allowedIps = JSON.parse(settings.allowedIps);
    } catch (error) {
      console.error('Failed to parse allowed IPs:', error);
    }
  }

  return {
    id: settings.id,
    isActive: settings.isActive,
    message: settings.message,
    allowedIps,
    startedAt: settings.startedAt,
    endsAt: settings.endsAt,
    updatedAt: settings.updatedAt,
  };
}

/**
 * Check if maintenance mode is currently active
 */
export async function isMaintenanceMode(): Promise<boolean> {
  const settings = await getMaintenanceSettings();
  return settings.isActive;
}

/**
 * Check if an IP address is in the allowed list
 */
export async function isIpAllowed(ip: string): Promise<boolean> {
  const settings = await getMaintenanceSettings();

  if (!settings.isActive) {
    return true; // If maintenance mode is off, all IPs are allowed
  }

  if (settings.allowedIps.length === 0) {
    return false; // No IPs allowed if list is empty
  }

  // Check if IP is in the allowed list
  return settings.allowedIps.includes(ip);
}

/**
 * Normalize IP address (handle IPv6 localhost, etc.)
 */
export function normalizeIp(ip: string | undefined): string {
  if (!ip) return '';

  // Convert IPv6 localhost to IPv4
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }

  // Remove IPv6 prefix from IPv4-mapped addresses
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }

  return ip;
}

/**
 * Get default maintenance message in Hungarian
 */
export function getDefaultMaintenanceMessage(): string {
  return 'Karbantartás miatt ideiglenesen nem elérhető az oldal. Hamarosan visszatérünk!';
}

/**
 * Update maintenance mode settings
 */
export async function updateMaintenanceSettings(data: {
  isActive?: boolean;
  message?: string | null;
  allowedIps?: string[];
  startedAt?: Date | null;
  endsAt?: Date | null;
}): Promise<MaintenanceSettings> {
  const current = await getMaintenanceSettings();

  const updateData: any = {};

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
    if (data.isActive && !current.startedAt) {
      updateData.startedAt = new Date();
    }
  }

  if (data.message !== undefined) {
    updateData.message = data.message;
  }

  if (data.allowedIps !== undefined) {
    updateData.allowedIps = JSON.stringify(data.allowedIps);
  }

  if (data.startedAt !== undefined) {
    updateData.startedAt = data.startedAt;
  }

  if (data.endsAt !== undefined) {
    updateData.endsAt = data.endsAt;
  }

  const updated = await prisma.maintenanceMode.update({
    where: { id: current.id },
    data: updateData,
  });

  return {
    id: updated.id,
    isActive: updated.isActive,
    message: updated.message,
    allowedIps: updated.allowedIps ? JSON.parse(updated.allowedIps) : [],
    startedAt: updated.startedAt,
    endsAt: updated.endsAt,
    updatedAt: updated.updatedAt,
  };
}
