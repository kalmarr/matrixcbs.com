'use client';

/**
 * MATRIX CBS - Képzések Section Component
 * Képzési programok megjelenítése
 */

import { motion } from 'framer-motion';
import { GraduationCap, Users, Calendar } from 'lucide-react';
import { staggerContainer, hexagonReveal, cardWithGlow } from '@/lib/animations';
import type { Kepzes } from '@/types/referenciak';

interface KepzesSectionProps {
  items: Kepzes[];
}

export function KepzesSection({ items }: KepzesSectionProps) {
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
          Képzési programok
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Felnőttképzési és szervezeti képzési programjaink
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((kepzes, index) => {
          const periodText = kepzes.idoszak.veg
            ? `${kepzes.idoszak.kezdet} - ${kepzes.idoszak.veg}`
            : `${kepzes.idoszak.kezdet}-től`;

          return (
            <motion.div
              key={kepzes.id}
              className="relative group"
              variants={hexagonReveal}
              custom={index}
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

              {/* Card */}
              <motion.div
                className="relative h-full bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl p-6 md:p-8 group-hover:border-[var(--color-accent-red)]/30 transition-colors duration-300"
                variants={cardWithGlow}
                initial="rest"
                whileHover="hover"
              >
                {/* Icon */}
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[var(--color-accent-red)]/10 to-[var(--color-accent-orange)]/10 border border-[var(--color-accent-red)]/20 mb-4">
                  <GraduationCap className="w-7 h-7 text-[var(--color-accent-orange)]" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent-orange)] transition-colors">
                  {kepzes.cim}
                </h3>

                {/* Description */}
                <p className="text-[var(--color-text-secondary)] mb-5">
                  {kepzes.leiras}
                </p>

                {/* Training types */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {kepzes.tipusok.map((tipus, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[var(--color-bg-tertiary)] text-sm text-[var(--color-text-secondary)] border border-[var(--color-bg-primary)]"
                    >
                      {tipus}
                    </span>
                  ))}
                </div>

                {/* Footer stats */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--color-bg-tertiary)]">
                  {/* Period */}
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {periodText}
                  </div>

                  {/* Participants if exists */}
                  {kepzes.resztvevokSzama && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <Users className="w-4 h-4" aria-hidden="true" />
                      <span className="text-[var(--color-accent-orange)] font-semibold">
                        {kepzes.resztvevokSzama}
                      </span>{' '}
                      résztvevő
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
