'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const painPoints = [
  'Túl sok a kézi megoldás.',
  'Túl sok döntés egy embernél.',
  'Túl sok energia megy el adminisztrációra.',
  'Túl kevés marad arra, ami valóban értéket teremt.',
];

// Sima reveal animációk
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
} as const;

const cardRevealVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
} as const;

const numberRevealVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
      delay: 0.1,
    },
  },
} as const;

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  },
} as const;

export function PainPointsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-[var(--color-bg-primary)] overflow-hidden">
      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={cardRevealVariants}
              className="group relative perspective-1000"
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Background glow effect */}
              <motion.div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] opacity-0 blur-xl group-hover:opacity-30"
                variants={glowVariants}
                initial="initial"
                whileHover="hover"
              />

              {/* Card - Equal height */}
              <div className="relative h-40 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] group-hover:border-[var(--color-accent-red)]/60 transition-all duration-500 flex items-center justify-center p-8">
                {/* Top accent line */}
                <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent-red)] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number badge */}
                <motion.div
                  variants={numberRevealVariants}
                  className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-[var(--color-bg-dark)] border-2 border-[var(--color-accent-red)] flex items-center justify-center shadow-lg"
                >
                  <span className="text-lg font-bold text-[var(--color-accent-red)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </motion.div>

                {/* Content - centered */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[var(--color-text-primary)] font-semibold leading-relaxed">
                    {point}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--color-accent-orange)]/30 rounded-br-lg group-hover:border-[var(--color-accent-orange)]/60 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
