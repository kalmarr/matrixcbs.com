import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { PainPointsSection } from '@/components/sections/PainPointsSection';
import { MatrixSolutionSection } from '@/components/sections/MatrixSolutionSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <MainLayout>
      {/* 1. Hero - Fő üzenet */}
      <HeroSection />

      {/* 2. Fájdalom-pontok */}
      <PainPointsSection />

      {/* 3. MATRIX Megoldás */}
      <MatrixSolutionSection />

      {/* 4. Bemutatkozás - Történet és értékek */}
      <AboutSection />

      {/* 5. CTA Banner */}
      <CTASection />
    </MainLayout>
  );
}
