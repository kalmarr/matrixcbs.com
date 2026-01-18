import type { Metadata } from 'next';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScrollReveal, StaggerContainer } from '@/components/effects/ScrollReveal';
import { GradientMesh } from '@/components/effects/GradientMesh';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Szervezeti Kihívások',
  description: 'Önnek is ismerősek ezek a helyzetek? Túlterheltség, szétesett működés, kapacitásproblémák - a MATRIX ezeket az állapotokat alakítja át fenntartható szervezeti működéssé.',
};

// EREDETI SZÖVEGEK a tervből
const challenges = [
  {
    emoji: '😰',
    title: '„Működünk, de folyamatos a túlterheltség."',
    points: [
      'minden sürgős',
      'mindenki „mindent csinál"',
      'a vezető nélkül megáll a rendszer',
    ],
  },
  {
    emoji: '📈',
    title: '„Növekedtünk, de szétesett a működés."',
    points: [
      'a régi megoldások már nem bírják',
      'a folyamatok nincsenek kimondva',
      'az új emberek nehezen illeszkednek be',
    ],
  },
  {
    emoji: '👥',
    title: '„Több ember kellene, de nem akarunk létszámot növelni."',
    points: [
      'az adminisztráció túl sok időt visz el',
      'ugyanazokat a feladatokat többen végzik',
      'sok a kézi, hibára hajlamos folyamat',
    ],
  },
];

const workProcess = [
  {
    step: 1,
    title: 'Megértjük a szervezet valós működését',
  },
  {
    step: 2,
    title: 'Feltárjuk a valódi szűk keresztmetszeteket',
  },
  {
    step: 3,
    title: 'Kiválasztjuk, mi fejlesztendő emberrel, és mi kiváltható folyamattal vagy alkalmazással',
  },
  {
    step: 4,
    title: 'Bevezetjük, menedzseljük, mérjük az eredményt',
  },
];

export default function SzervezetiKihivasokPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[32vh] lg:min-h-[60vh] overflow-hidden">
        <GradientMesh variant="subtle" />

        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 min-h-[32vh] lg:min-h-[60vh]">
            {/* Expert Image - Kalmár Róbert - kép alja a szekció aljához */}
            <div className="hidden lg:flex items-end justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/founders/Kalmar_Robert_Szerkesztve.png"
                  alt="Kalmár Róbert - szakértő"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Text content */}
            <ScrollReveal className="text-center lg:text-left order-1 lg:order-2 flex flex-col items-center lg:items-start pt-6 pb-2 lg:py-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-[var(--color-text-primary)]">Önnek is ismerősek </span>
                <span className="text-accent-red">A KÖVETKEZŐ HELYZETEK?</span>
              </h1>
            </ScrollReveal>

            {/* Mobile Expert Image - Kalmár Róbert - section aljára pozícionálva */}
            <div className="flex lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
              <Image
                src="/images/founders/Kalmar_Robert_Szerkesztve.png"
                alt="Kalmár Róbert - szakértő"
                width={450}
                height={300}
                className="max-w-sm w-full h-auto"
                loading="eager"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="space-y-8 max-w-4xl mx-auto">
            {challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="group relative p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent-red)]/50 transition-all duration-300"
              >
                {/* Emoji */}
                <span className="text-4xl mb-4 block">{challenge.emoji}</span>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                  {challenge.title}
                </h3>

                {/* Divider */}
                <div className="w-full h-px bg-[var(--color-border)] mb-6" />

                {/* Points */}
                <ul className="space-y-3">
                  {challenge.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[var(--color-accent-red)] mt-1">•</span>
                      <span className="text-[var(--color-text-secondary)]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Transition Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl text-[var(--color-text-primary)] font-medium mb-6">
              Ezek nem egyedi problémák.
            </p>
            <p className="text-2xl md:text-3xl font-bold mb-8">
              Ezek <span className="text-accent-red">MŰKÖDÉSI ÁLLAPOTOK.</span>
            </p>
            <p className="text-xl text-[var(--color-text-secondary)]">
              A MATRIX ezeket az állapotokat alakítja át{' '}
              <span className="text-[var(--color-accent-orange)] font-semibold">
                fenntartható szervezeti működéssé.
              </span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Work Process Section */}
      <section className="py-20 lg:py-32 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[var(--color-text-primary)]">Nem sablonokban, hanem </span>
              <span className="text-accent-orange">RENDSZEREKBEN</span>
              <span className="text-[var(--color-text-primary)]"> gondolkodunk.</span>
            </h2>
          </ScrollReveal>

          {/* Process Steps */}
          <StaggerContainer className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-4 gap-6">
              {workProcess.map((item) => (
                <div key={item.step} className="text-center">
                  {/* Step number */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>

                  {/* Description */}
                  <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
                    {item.title}
                  </p>

                  {/* Arrow (except last) */}
                  {item.step < 4 && (
                    <div className="hidden md:flex justify-center mt-4">
                      <svg className="w-6 h-6 text-[var(--color-accent-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </StaggerContainer>

          {/* Closing statement */}
          <ScrollReveal className="text-center">
            <div className="inline-block px-8 py-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <p className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
                Nem tanácsot adunk, hanem{' '}
                <span className="text-accent-red">MŰKÖDÉST ALAKÍTUNK ÁT.</span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </MainLayout>
  );
}
