'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function MatrixSolutionSection() {
  return (
    <section className="py-20 lg:py-32 bg-[var(--color-bg-secondary)]">
      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main Text Box */}
          <motion.div
            variants={fadeInUp}
            className="relative p-8 md:p-12 rounded-3xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] mb-12"
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] rounded-full" />

            <p className="text-xl md:text-2xl lg:text-3xl text-[var(--color-text-primary)] font-medium leading-relaxed text-center">
              A MATRIX abban segít, hogy a szervezetek kilépjenek a mindennapi mókuskerékből, és egy{' '}
              <span className="text-accent-red">átláthatóbb</span>,{' '}
              <span className="text-accent-orange">könnyebben működtethető</span>{' '}
              rendszerre álljanak át.
            </p>
          </motion.div>

          {/* Three pillars */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center gap-4 md:gap-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="text-center px-6 py-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">Átláthatóbb működés</p>
              </div>

              <svg className="w-6 h-6 text-[var(--color-accent-orange)] hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>

              <div className="text-center px-6 py-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">Könnyebben működtethető rendszer</p>
              </div>

              <svg className="w-6 h-6 text-[var(--color-accent-orange)] hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>

              <div className="text-center px-6 py-4 rounded-xl bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)]">
                <p className="text-lg font-semibold text-white">Valódi eredmény</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
