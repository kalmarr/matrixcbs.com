'use client';

/**
 * MATRIX CBS - Timeline Section Component
 * Szakértések megjelenítése idővonalon
 */

import { motion } from 'framer-motion';
import { TimelineItem } from './TimelineItem';
import { staggerContainerSlow } from '@/lib/animations';
import type { Szakertes } from '@/types/referenciak';

interface TimelineSectionProps {
  items: Szakertes[];
}

export function TimelineSection({ items }: TimelineSectionProps) {
  // Sort by year descending (newest first)
  const sortedItems = [...items].sort((a, b) => {
    const yearA = parseInt(a.idoszak.kezdet);
    const yearB = parseInt(b.idoszak.kezdet);
    return yearB - yearA;
  });

  return (
    <motion.div
      className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8"
      variants={staggerContainerSlow}
      initial="hidden"
      animate="visible"
    >
      {/* Section header */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Szakértői projektek
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Tanácsadói és szakértői feladataink időrendi áttekintése
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-2 md:pl-4">
        {sortedItems.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={index}
            isLast={index === sortedItems.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
