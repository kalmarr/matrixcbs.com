'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const values = [
  { title: 'Minőség', icon: '🧭' },
  { title: 'Hitelesség', icon: '⚙️' },
  { title: 'Megújulás', icon: '🔄' },
];

export function AboutSection() {
  return (
    <section className="py-20 lg:py-32 bg-[var(--color-bg-primary)]">
      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Timeline indicator */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-between mb-12 px-4"
          >
            <div className="text-center">
              <span className="text-3xl font-bold text-[var(--color-accent-red)]">2006</span>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Alapítás</p>
            </div>
            <div className="flex-1 h-1 mx-8 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] rounded-full" />
            <div className="text-center">
              <span className="text-3xl font-bold text-[var(--color-accent-orange)]">2026</span>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">20 év tapasztalat</p>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div variants={fadeInUp} className="space-y-6 mb-16">
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              A MATRIX CBS Kft. több mint két évtizede végez felnőttképzési és szervezetfejlesztési
              tevékenységet, munkáját végig a szakmai megalapozottság, a minőségi szemlélet és az
              alkalmazkodóképesség jellemezte.
            </p>

            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Működésünk során tudatosan azokra a területekre fókuszáltunk, ahol valódi igény jelent
              meg, és ahol mérhető, gyakorlati eredményeket tudtunk elérni szervezetek, vállalkozások
              és intézmények számára.
            </p>

            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Ügyfeleink visszajelzései folyamatos iránytűként szolgáltak fejlődésünkhöz, lehetővé
              téve, hogy rugalmasan, mégis következetes szakmai alapokon dolgozzunk. Ez a szemlélet
              biztosítja azt a stabil hátteret, amelyre jelenlegi fejlesztési, tréning- és
              működésoptimalizálási megoldásaink épülnek.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="px-8 py-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent-red)]/50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{value.icon}</span>
                  <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {value.title}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
