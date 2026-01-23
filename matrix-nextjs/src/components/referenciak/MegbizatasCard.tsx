'use client';

/**
 * MATRIX CBS - Megbízatás Card Component
 * Kártya komponens a szakértői megbízatásokhoz
 */

import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  ClipboardCheck,
  GraduationCap,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import { hexagonReveal, cardWithGlow } from '@/lib/animations';
import type { Megbizatas } from '@/types/referenciak';

interface MegbizatasCardProps {
  item: Megbizatas;
  index: number;
}

// Icon mapping
const iconMap = {
  building: Building2,
  search: Search,
  clipboard: ClipboardCheck,
  graduation: GraduationCap,
  shield: Shield,
  badge: BadgeCheck,
};

// Státusz badge színek
const statusConfig = {
  aktiv: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
    label: 'Aktív',
  },
  folyamatban: {
    bg: 'bg-[var(--color-accent-orange)]/20',
    text: 'text-[var(--color-accent-orange)]',
    border: 'border-[var(--color-accent-orange)]/30',
    label: 'Folyamatban',
  },
  lezart: {
    bg: 'bg-[var(--color-gray-medium)]/20',
    text: 'text-[var(--color-gray-medium)]',
    border: 'border-[var(--color-gray-medium)]/30',
    label: 'Lezárt',
  },
};

export function MegbizatasCard({ item, index }: MegbizatasCardProps) {
  const Icon = iconMap[item.icon] || Building2;
  const status = statusConfig[item.statusz];
  const periodText = item.idoszak.veg
    ? `${item.idoszak.kezdet} - ${item.idoszak.veg}`
    : `${item.idoszak.kezdet}-től`;

  return (
    <motion.div
      className="relative group"
      variants={hexagonReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      custom={index}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

      {/* Card */}
      <motion.div
        className={`
          relative h-full bg-[var(--color-bg-secondary)] border rounded-2xl p-5 md:p-6
          transition-colors duration-300
          ${item.statusz === 'aktiv' ? 'border-green-500/20' : 'border-[var(--color-bg-tertiary)]'}
          group-hover:border-[var(--color-accent-red)]/30
        `}
        variants={cardWithGlow}
        initial="rest"
        whileHover="hover"
      >
        {/* Header with icon and status */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--color-accent-red)]/10 to-[var(--color-accent-orange)]/10 border border-[var(--color-accent-red)]/20">
            <Icon className="w-6 h-6 text-[var(--color-accent-orange)]" />
          </div>

          {/* Status badge */}
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
              ${status.bg} ${status.text} border ${status.border}
            `}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${item.statusz === 'aktiv' ? 'bg-green-400 animate-pulse' : item.statusz === 'folyamatban' ? 'bg-[var(--color-accent-orange)]' : 'bg-[var(--color-gray-medium)]'}`}
            />
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-orange)] transition-colors">
          {item.cim}
        </h3>

        {/* Organization & Position */}
        <p className="text-[var(--color-text-secondary)] text-sm mb-3">
          {item.leiras}
        </p>

        {/* Metadata */}
        <div className="space-y-2">
          {/* Period */}
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {periodText}
          </div>

          {/* Registration number if exists */}
          {item.nyilvantartasiSzam && (
            <div className="flex items-center gap-2 text-sm">
              <svg
                className="w-4 h-4 text-[var(--color-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span className="px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)] font-mono text-xs text-[var(--color-accent-orange)]">
                {item.nyilvantartasiSzam}
              </span>
            </div>
          )}

          {/* Expertise areas if exist */}
          {item.szakteruletek && item.szakteruletek.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {item.szakteruletek.map((szakterulet, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-xs text-[var(--color-text-secondary)]"
                >
                  {szakterulet}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
