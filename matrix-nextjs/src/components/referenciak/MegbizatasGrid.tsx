'use client';

/**
 * MATRIX CBS - Megbízatás Grid Component
 * Grid layout a szakértői megbízatásokhoz
 */

import { motion } from 'framer-motion';
import { MegbizatasCard } from './MegbizatasCard';
import { staggerContainer } from '@/lib/animations';
import type { Megbizatas } from '@/types/referenciak';

interface MegbizatasGridProps {
  items: Megbizatas[];
}

export function MegbizatasGrid({ items }: MegbizatasGridProps) {
  // Sort: active first, then by year descending
  const sortedItems = [...items].sort((a, b) => {
    // Active items first
    if (a.statusz === 'aktiv' && b.statusz !== 'aktiv') return -1;
    if (a.statusz !== 'aktiv' && b.statusz === 'aktiv') return 1;

    // Then by year descending
    const yearA = parseInt(a.idoszak.kezdet);
    const yearB = parseInt(b.idoszak.kezdet);
    return yearB - yearA;
  });

  return (
    <motion.div
      className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Section header */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Szakértői megbízatások
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Akkreditációk, névjegyzéki tagságok és hivatalos szakértői pozíciók
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {sortedItems.map((item, index) => (
          <MegbizatasCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
