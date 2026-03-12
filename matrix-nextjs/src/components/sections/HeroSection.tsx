'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GradientMesh } from '@/components/effects/GradientMesh';
import { FloatingShapes } from '@/components/effects/FloatingShapes';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAnimateOnMount } from '@/hooks/useAnimateOnMount';

// Képek variant definíciók a useAnimateOnMount hook-hoz
const mobileImageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
};

const desktopImageVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
};

export function HeroSection() {
  const controls = useAnimateOnMount();

  return (
    <section className="relative min-h-[78vh] lg:min-h-[90vh]">
      {/* Background Effects */}
      <GradientMesh variant="primary" />
      <FloatingShapes count={8} />

      <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
        <div className="grid lg:grid-cols-2 gap-12 min-h-[78vh] lg:min-h-[90vh]">
          {/* Text content */}
          <motion.div
            className="text-center lg:text-left flex flex-col justify-start lg:justify-center pt-6 pb-2 lg:py-20"
            variants={staggerContainer}
            initial={false}
            animate={controls}
          >
            {/* Main Headline - EREDETI SZÖVEG */}
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-12 leading-tight"
              variants={fadeInUp}
            >
              <span className="text-[var(--color-text-primary)]">
                A legtöbb szervezet nem azért küzd, mert rosszul dolgoznak benne az emberek, hanem azért, mert a{' '}
              </span>
              <span className="text-accent-red">működésük nincs rendszerbe szervezve.</span>
            </motion.h1>

            {/* CTA Button - hidden on mobile (header has the button) */}
            <motion.div variants={fadeInUp} className="hidden lg:block">
              <Link href="/kapcsolat">
                <Button variant="primary" size="lg" className="text-lg px-10 py-4">
                  BESZÉLJÜNK
                </Button>
              </Link>
            </motion.div>

          </motion.div>

          {/* Mobile Expert Image - positioned at section bottom, overlapping next section */}
          <motion.div
            className="block lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
            initial={false}
            animate={controls}
            variants={mobileImageVariants}
          >
            <Image
              src="/images/founders/balogh-monika-szakerto-Szerkesztve.png"
              alt="Balogh Mónika - szakértő"
              width={500}
              height={750}
              className="mx-auto max-h-[50vh] w-auto object-contain"
              priority
            />
          </motion.div>

          {/* Expert Image - Balogh Mónika - nagy kép, teteje a szöveg tetejéhez */}
          <motion.div
            className="hidden lg:block absolute right-0 bottom-0 w-1/2"
            initial={false}
            animate={controls}
            variants={desktopImageVariants}
          >
            <div className="relative w-full flex justify-end">
              <Image
                src="/images/founders/balogh-monika-szakerto-Szerkesztve.png"
                alt="Balogh Mónika - szakértő"
                width={700}
                height={1050}
                className="h-[80vh] w-auto object-contain object-bottom"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-[var(--color-text-muted)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
