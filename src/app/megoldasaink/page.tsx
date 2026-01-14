import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScrollReveal, StaggerContainer } from '@/components/effects/ScrollReveal';
import { GradientMesh } from '@/components/effects/GradientMesh';
import { CTASection } from '@/components/sections/CTASection';
import {
  GraduationCap,
  Settings2,
  Monitor,
  UserCog,
  Compass,
  FileBarChart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Megoldásaink',
  description: 'Tréningek, szervezetoptimalizálás, IT mikroalkalmazások, HR racionalizálás, szakértői tanácsadás és tanulmányok készítése - testre szabott megoldások a szervezeti kihívásokra.',
};

// EREDETI SZÖVEGEK a tervből - 6 szolgáltatás
const solutions = [
  {
    id: 1,
    Icon: GraduationCap,
    title: 'Tréningek, képzések, oktatás',
    subtitle: 'amikor az embereknek kell fejlődniük a rendszerrel együtt.',
    description: 'Szervezeti és vállalati igényekre szabott képzéseket tartunk:',
    points: [
      'magán- és állami szektorban,',
      'valós munkakörnyezetre építve,',
      'azonnal alkalmazható tematikával.',
    ],
    resultTitle: 'Eredmény:',
    results: [
      'fejlődő készségek és képességek,',
      'tisztább szerepek és felelősségek,',
      'hatékonyabb együttműködés.',
    ],
  },
  {
    id: 2,
    Icon: Settings2,
    title: 'Szervezetoptimalizálás és folyamatmenedzsment',
    subtitle: 'amikor a működés önmaga válik akadállyá.',
    description: 'Elsősorban mikro- és KKV-k számára segítünk:',
    points: [
      'átlátni a napi működést,',
      'csökkenteni a felesleges köröket,',
      'stabilabb, kiszámíthatóbb rendszert kialakítani.',
    ],
    resultTitle: 'Eredmény:',
    results: [
      'kevesebb tűzoltás,',
      'felszabaduló vezetői kapacitás,',
      'működő, nem túlbonyolított folyamatok.',
    ],
  },
  {
    id: 3,
    Icon: Monitor,
    title: 'IT Mikroalkalmazások a mindennapi terhek csökkentésére',
    subtitle: 'amikor nem emberekre, hanem eszközökre van szükség.',
    description: 'Szervezet-specifikus mikroalkalmazásokat fejlesztünk és vezetünk be, amelyek:',
    points: [
      'kiváltják a manuális adminisztrációt,',
      'csökkentik a hibalehetőségeket,',
      'mérhető idő- és költségmegtakarítást hoznak.',
    ],
    resultTitle: 'Eredmény:',
    results: [
      'számszerűsíthető hatékonyságnövekedés,',
      'kevesebb rutinfeladat,',
      'több fókusz az értékteremtésen.',
    ],
  },
  {
    id: 4,
    Icon: UserCog,
    title: 'Humán erőforrás racionalizálás automatizált IT megoldásokkal',
    subtitle: 'ember ott, ahol valóban szükséges.',
    description: 'A szervezet teljes humán működését átvizsgáljuk:',
    points: [
      'mit csinálnak az emberek valójában,',
      'mi automatizálható,',
      'hol keletkezik felesleges terhelés.',
    ],
    process: 'Azonosítás → fejlesztés → bevezetés → menedzsment.',
    resultTitle: 'Eredmény:',
    results: [
      'csökkenő terhelés,',
      'felszabaduló kapacitások,',
      'átláthatóbb HR-működés.',
    ],
  },
  {
    id: 5,
    Icon: Compass,
    title: 'Szakértés, tanácsadás, mentorálás',
    subtitle: '',
    description: 'A szervezetek többségénél nem egy-egy részfeladat okozza a problémát, hanem a működés egésze válik nehezen átláthatóvá. Ebben a helyzetben nem gyors tanácsokra van szükség, hanem rendszerszintű megértésre és következetes támogatásra.',
    longDescription: 'Szakértői, tanácsadói és mentorálási tevékenységünk során:',
    points: [
      'nem kiragadott kérdésekre válaszolunk,',
      'hanem a teljes működést vizsgáljuk,',
      'összefüggéseiben értelmezzük a döntési helyzeteket,',
      'és a szervezet valós működéséhez igazodva dolgozunk.',
    ],
    additionalNote: 'A mentorálás nem egyszeri alkalom, hanem folyamat. A döntéshozót nem hagyjuk magára a változtatások során, hanem végig kísérjük a felismeréstől, a döntéseken át, egészen a működésbe történő beépülésig.',
    resultTitle: 'Eredmény:',
    results: [
      'tisztább döntési helyzetek,',
      'csökkenő vezetői bizonytalanság,',
      'következetesebb szervezeti működés,',
      'valóban végig vitt változások.',
    ],
  },
  {
    id: 6,
    Icon: FileBarChart,
    title: 'Tanulmányok, szakértői anyagok',
    subtitle: 'megbízható alap döntésekhez, fejlesztésekhez, pályázatokhoz.',
    description: 'Készítünk:',
    points: [
      'háttértanulmányokat és elemzéseket,',
      'kimutatásokat, összehasonlításokat,',
      'hatásvizsgálatokat,',
      'pályázati és szakértői dokumentációt.',
    ],
    resultTitle: 'Eredmény:',
    results: [
      'megalapozott, védhető döntések,',
      'átlátható alternatívák és következmények,',
      'csökkenő bizonytalanság a fejlesztési irányokban,',
      'használható dokumentáció pályázati és szakmai eljárásokhoz.',
    ],
  },
];

export default function MegoldasainkPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <GradientMesh variant="primary" />

        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block text-[var(--color-accent-orange)] font-medium mb-4">
              Megoldásaink
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-[var(--color-text-primary)]">Hat területen </span>
              <span className="text-accent-red">valódi változást</span>
              <span className="text-[var(--color-text-primary)]"> hozunk</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="space-y-12">
            {solutions.map((solution, index) => {
              const IconComponent = solution.Icon;
              return (
                <div
                  key={solution.id}
                  className={`group relative p-8 md:p-12 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-accent-red)]/50 transition-all duration-300 ${
                    index % 2 === 0 ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-primary)]'
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] p-0.5 group-hover:shadow-[0_0_30px_rgba(178,40,47,0.3)] transition-shadow duration-500">
                      <div className="w-full h-full rounded-2xl bg-[var(--color-bg-dark)] flex items-center justify-center">
                        <IconComponent
                          className="w-8 h-8 text-[var(--color-accent-red)] group-hover:text-[var(--color-accent-orange)] transition-colors duration-300"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        {solution.title}
                      </h2>

                      {/* Subtitle */}
                      {solution.subtitle && (
                        <p className="text-lg text-[var(--color-accent-orange)] italic">
                          {solution.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Number badge */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-accent-red)]/50 transition-colors">
                      <span className="text-sm font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-red)] transition-colors">
                        {String(solution.id).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] mb-8" />

                  {/* Content */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Description & Points */}
                    <div>
                      <p className="text-[var(--color-text-secondary)] mb-4">
                        {solution.description}
                      </p>

                      {solution.longDescription && (
                        <p className="text-[var(--color-text-secondary)] mb-4">
                          {solution.longDescription}
                        </p>
                      )}

                      <ul className="space-y-2">
                        {solution.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-[var(--color-accent-red)] mt-1">•</span>
                            <span className="text-[var(--color-text-secondary)]">{point}</span>
                          </li>
                        ))}
                      </ul>

                      {solution.process && (
                        <p className="mt-4 text-[var(--color-accent-orange)] font-medium">
                          {solution.process}
                        </p>
                      )}

                      {solution.additionalNote && (
                        <p className="mt-4 text-[var(--color-text-muted)] text-sm italic">
                          {solution.additionalNote}
                        </p>
                      )}
                    </div>

                    {/* Right: Results */}
                    <div className="p-6 rounded-2xl bg-[var(--color-bg-dark)]/50 border border-[var(--color-border)]">
                      <h3 className="text-lg font-semibold text-[var(--color-accent-orange)] mb-4">
                        {solution.resultTitle}
                      </h3>
                      <ul className="space-y-2">
                        {solution.results.map((result, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-[var(--color-accent-orange)] mt-1">✓</span>
                            <span className="text-[var(--color-text-primary)]">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </MainLayout>
  );
}
