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
              <p className="text-sm text-[var(--color-text-muted)] mt-1">26 év tapasztalat</p>
            </div>
          </motion.div>

          {/* Main content - EREDETI SZÖVEGEK */}
          <motion.div variants={fadeInUp} className="space-y-6 mb-16">
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              A MATRIX CBS Kft. 2006 óta foglalkozik felnőttképzéssel és szervezeti fejlesztéssel.
              Kezdetektől fogva a minőség, a szakmai hitelesség és a folyamatos megújulás határozza
              meg működésünket.
            </p>

            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Az elmúlt két évtizedben azokon a területeken maradtunk jelen és erősödtünk meg, ahol
              valós igény mutatkozott, és ahol kézzelfogható eredményeket tudtunk felmutatni – legyen
              szó szervezetekről, cégekről vagy intézményi működésről.
            </p>

            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Partnereink és megbízóink visszajelzései folyamatosan formálták a szemléletünket. Ennek
              köszönhetően tudtuk megőrizni lendületes, dinamikus működésünket, miközben végig
              emberközeli, elérhető és együttműködő partnerek maradtunk. Ez a tapasztalat adja azt a
              stabil alapot, amelyre ma is minden fejlesztést, tréninget és működésoptimalizálási
              projektet építünk.
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
