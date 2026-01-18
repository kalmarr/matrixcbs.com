'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientMesh } from '@/components/effects/GradientMesh';

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <GradientMesh variant="secondary" />

      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <motion.div
            className={cn(
              'text-center py-16 px-8 lg:py-20 lg:px-16',
              'rounded-[var(--radius-lg)]',
              'bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)]',
              'shadow-[var(--shadow-lg)]'
            )}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Készen áll a változásra?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Vegye fel velünk a kapcsolatot egy ingyenes konzultációért, és tárjuk fel együtt,
              hogyan segíthetünk szervezete fejlesztésében.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kapcsolat">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white text-[var(--color-accent-red)] hover:bg-white/90"
                >
                  Kapcsolatfelvétel
                </Button>
              </Link>
              <Link href="tel:+36703272146">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  +36 70 327 2146
                </Button>
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
