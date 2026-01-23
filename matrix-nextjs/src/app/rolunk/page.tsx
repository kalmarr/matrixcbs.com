import type { Metadata } from 'next';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScrollReveal, StaggerContainer } from '@/components/effects/ScrollReveal';
import { GradientMesh } from '@/components/effects/GradientMesh';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Rólunk',
  description: 'A MATRIX CBS Kft. 2006 óta foglalkozik felnőttképzéssel és szervezeti fejlesztéssel. 26 év szakmai tapasztalat, minőség és hitelesség.',
};

// Csapat adatok
const team = [
  {
    name: 'Kalmár Róbert',
    role: 'tulajdonos, ügyvezető',
    image: '/images/founders/Kalmar_Robert_alapito_Szerkesztve.png',
  },
  {
    name: 'Balogh Mónika',
    role: 'tulajdonos, képzésért felelős szakmai vezető',
    image: '/images/founders/Balogh_Monika_Szerkesztve.png',
  },
];

// Miért a MATRIX? - értékek
const values = [
  { icon: '🧭', title: '26 év szakmai tapasztalat' },
  { icon: '⚙️', title: 'Valós működésből indulunk ki' },
  { icon: '🧠', title: 'Rendszerszintű gondolkodás' },
  { icon: '🎯', title: 'Célra szabott megoldások' },
  { icon: '🛠️', title: 'Nem elmélet, hanem megvalósítás' },
  { icon: '⏱️', title: 'Valódi tehercsökkentés' },
  { icon: '🔍', title: 'Átlátható működés' },
  { icon: '📊', title: 'Mérhető eredmények' },
  { icon: '🧱', title: 'Hosszú távon működő rendszerek' },
  { icon: '🤝', title: 'Partneri együttműködés' },
];

export default function RolunkPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <GradientMesh variant="subtle" />

        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block text-[var(--color-accent-orange)] font-medium mb-4">
              Rólunk
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-accent-red">
              A MATRIX MÖGÖTT
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent-red)]/50 transition-all duration-300 overflow-hidden"
              >
                {/* Founder Image - full rectangle */}
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    priority
                    loading="eager"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-secondary)] via-transparent to-transparent" />
                </div>

                {/* Info overlay at bottom */}
                <div className="p-6 text-center -mt-16 relative z-10">
                  {/* Name */}
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                    {member.name}
                  </h3>

                  {/* Divider */}
                  <div className="w-16 h-1 mx-auto mb-3 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] rounded-full" />

                  {/* Role */}
                  <p className="text-[var(--color-text-secondary)] text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About History Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Timeline indicator */}
            <ScrollReveal className="flex items-center justify-between mb-12 px-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-[var(--color-accent-red)]">2006</span>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Alapítás</p>
              </div>
              <div className="flex-1 h-1 mx-8 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] rounded-full" />
              <div className="text-center">
                <span className="text-3xl font-bold text-[var(--color-accent-orange)]">2026</span>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">26 év tapasztalat</p>
              </div>
            </ScrollReveal>

            {/* Main content - EREDETI SZÖVEGEK */}
            <ScrollReveal className="space-y-6">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why MATRIX Section */}
      <section className="py-20 lg:py-32 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-accent-red">
              MIÉRT A MATRIX?
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent-red)]/50 transition-all duration-300 text-center"
              >
                <span className="text-3xl mb-3 block">{value.icon}</span>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {value.title}
                </p>
              </div>
            ))}
          </StaggerContainer>

          {/* Quote */}
          <ScrollReveal className="text-center">
            <div className="inline-block px-8 py-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <p className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
                "A MATRIX nem gyors megoldásokat ígér,
              </p>
              <p className="text-xl md:text-2xl font-bold mt-2">
                hanem <span className="text-accent-orange">MŰKÖDŐ SZERVEZETEKET ÉPÍT.</span>"
              </p>
            </div>
          </ScrollReveal>

          {/* Referenciák gomb */}
          <ScrollReveal className="text-center mt-8">
            <a
              href="/referenciak"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Referenciáink
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </MainLayout>
  );
}
