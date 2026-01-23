'use client';

/**
 * MATRIX CBS - Timeline Item Component
 * Egyedi timeline elem a szakértésekhez
 */

import { motion } from 'framer-motion';
import { timelineItem, timelineDot } from '@/lib/animations';
import type { Szakertes } from '@/types/referenciak';

interface TimelineItemProps {
  item: Szakertes;
  index: number;
  isLast?: boolean;
}

// Státusz badge színek
const statusColors = {
  aktiv: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    dot: 'bg-green-500',
    label: 'Aktív',
  },
  folyamatban: {
    bg: 'bg-[var(--color-accent-orange)]/20',
    text: 'text-[var(--color-accent-orange)]',
    dot: 'bg-[var(--color-accent-orange)]',
    label: 'Folyamatban',
  },
  lezart: {
    bg: 'bg-[var(--color-gray-medium)]/20',
    text: 'text-[var(--color-gray-medium)]',
    dot: 'bg-[var(--color-gray-medium)]',
    label: 'Lezárt',
  },
};

export function TimelineItem({ item, index, isLast = false }: TimelineItemProps) {
  const status = statusColors[item.statusz];
  const periodText = item.idoszak.veg
    ? `${item.idoszak.kezdet} - ${item.idoszak.veg}`
    : item.idoszak.kezdet;

  return (
    <motion.div
      className="relative flex gap-4 md:gap-8"
      variants={timelineItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={index}
    >
      {/* Timeline line and dot - left side */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <motion.div
          className="relative z-10"
          variants={timelineDot}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            className={`w-4 h-4 rounded-full ${status.dot} ring-4 ring-[var(--color-bg-primary)]`}
          />
          {/* Glow effect for active items */}
          {item.statusz === 'aktiv' && (
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 blur-md opacity-50" />
          )}
        </motion.div>

        {/* Connecting line */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-[var(--color-accent-red)]/50 to-[var(--color-accent-orange)]/20 min-h-[60px]" />
        )}
      </div>

      {/* Content card - right side */}
      <div className="flex-1 pb-8 md:pb-12">
        {/* Year badge - mobile only shown inline */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-[var(--color-accent-orange)]">
            {periodText}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Card */}
        <div className="group bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-xl p-4 md:p-6 hover:border-[var(--color-accent-red)]/30 transition-colors duration-300">
          {/* Title */}
          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-orange)] transition-colors">
            {item.cim}
          </h3>

          {/* Description */}
          <p className="text-[var(--color-text-secondary)] mb-3">
            {item.leiras}
          </p>

          {/* Footer info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]">
            {/* Partner */}
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {item.partner}
            </span>

            {/* Project code if exists */}
            {item.projektKod && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)] font-mono text-xs">
                {item.projektKod}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
