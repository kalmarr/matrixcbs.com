'use client';

/**
 * MATRIX CBS - References Hero Section
 * Hero szekció animált statisztikákkal
 */

import { motion } from 'framer-motion';
import { GradientMesh } from '@/components/effects/GradientMesh';
import { FloatingShapes } from '@/components/effects/FloatingShapes';
import {
  staggerContainer,
  fadeInUp,
  countUp,
  statisticPulse,
} from '@/lib/animations';
import type { HeroStatistic } from '@/types/referenciak';

interface ReferencesHeroProps {
  statistics: HeroStatistic[];
}

export function ReferencesHero({ statistics }: ReferencesHeroProps) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <GradientMesh variant="primary" />
      <FloatingShapes count={6} />

      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 md:py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
            variants={fadeInUp}
          >
            <span className="text-[var(--color-text-primary)]">
              Referenciáink és{' '}
            </span>
            <span className="text-accent-gradient">szakmai múltunk</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Több mint másfél évtizedes tapasztalattal segítjük partnereink
            fejlődését szakértői szolgáltatásainkkal.
          </motion.p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={countUp}
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

              {/* Card */}
              <motion.div
                className="relative bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm border border-[var(--color-bg-tertiary)] rounded-2xl p-6 md:p-8 text-center transition-colors duration-300 group-hover:border-[var(--color-accent-red)]/30"
                variants={statisticPulse}
              >
                {/* Value */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent-gradient mb-2">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-[var(--color-accent-orange)]">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base text-[var(--color-text-secondary)] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
