'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { HexagonCard, HexagonGrid } from '@/components/ui/HexagonCard';
import { ScrollReveal, StaggerContainer } from '@/components/effects/ScrollReveal';
import { fadeInUp } from '@/lib/animations';

const solutions = [
  {
    title: 'Vezetői fejlesztés',
    description: 'Vezetői készségek fejlesztése, coaching és mentoring programok.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Csapatépítés',
    description: 'Hatékony csapatmunka és együttműködés fejlesztése.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Kommunikáció',
    description: 'Belső és külső kommunikáció fejlesztése, konfliktuskezelés.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Változásmenedzsment',
    description: 'Szervezeti változások sikeres lebonyolítása.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Értékesítési tréning',
    description: 'Értékesítési és tárgyalási technikák fejlesztése.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Szervezetfejlesztés',
    description: 'Átfogó szervezeti kultúra és folyamatfejlesztés.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export function SolutionsSection() {
  return (
    <section className="py-20 lg:py-32 bg-[var(--color-bg-primary)]">
      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-[var(--color-accent-orange)] font-medium mb-4">
            Megoldásaink
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-[var(--color-text-primary)]">Testre szabott </span>
            <span className="text-accent-red">fejlesztési programok</span>
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Hat fő területen kínálunk professzionális tréningeket és tanácsadást,
            amelyek valódi változást hoznak a szervezetében.
          </p>
        </ScrollReveal>

        {/* Solutions Grid */}
        <StaggerContainer className="mb-12">
          <HexagonGrid>
            {solutions.map((solution, index) => (
              <motion.div key={solution.title} variants={fadeInUp}>
                <HexagonCard
                  title={solution.title}
                  description={solution.description}
                  icon={solution.icon}
                  index={index}
                />
              </motion.div>
            ))}
          </HexagonGrid>
        </StaggerContainer>

        {/* CTA */}
        <ScrollReveal className="text-center">
          <Link href="/megoldasaink">
            <Button variant="secondary" size="lg">
              Összes megoldásunk
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
