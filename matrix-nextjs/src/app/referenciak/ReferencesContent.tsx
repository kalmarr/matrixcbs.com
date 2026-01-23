'use client';

/**
 * MATRIX CBS - References Content Component
 * Client komponens a referenciák oldal interaktív tartalmához
 */

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ReferencesHero,
  ReferencesTabs,
  TimelineSection,
  MegbizatasGrid,
  KepzesSection,
  PalyazatAccordion,
} from '@/components/referenciak';
import {
  heroStatistics,
  tabConfig,
  szakertesek,
  megbizatasok,
  kepzesek,
  palyazatok,
} from '@/data/referenciak';
import { tabContent } from '@/lib/animations';
import type { ReferenceCategory } from '@/types/referenciak';

export function ReferencesContent() {
  const [activeTab, setActiveTab] = useState<ReferenceCategory>('szakertesek');

  return (
    <main>
      {/* Breadcrumb navigáció - SEO */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 pt-4"
      >
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]"
        >
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              itemProp="item"
              href="/"
              className="hover:text-[var(--color-accent-orange)] transition-colors"
            >
              <span itemProp="name">Kezdőlap</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true">/</li>
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span itemProp="name" className="text-[var(--color-text-primary)]">
              Referenciák
            </span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* Hero szekció statisztikákkal */}
      <ReferencesHero statistics={heroStatistics} />

      {/* Fő tartalom szekció */}
      <section className="py-12 md:py-16 bg-[var(--color-bg-primary)]">
        {/* Tab navigáció */}
        <ReferencesTabs
          tabs={tabConfig}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab tartalom AnimatePresence-szel */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'szakertesek' && (
              <motion.div
                key="szakertesek"
                variants={tabContent}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <TimelineSection items={szakertesek} />
              </motion.div>
            )}

            {activeTab === 'megbizatasok' && (
              <motion.div
                key="megbizatasok"
                variants={tabContent}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <MegbizatasGrid items={megbizatasok} />
              </motion.div>
            )}

            {activeTab === 'kepzesek' && (
              <motion.div
                key="kepzesek"
                variants={tabContent}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <KepzesSection items={kepzesek} />
              </motion.div>
            )}

            {activeTab === 'palyazatiras' && (
              <motion.div
                key="palyazatiras"
                variants={tabContent}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <PalyazatAccordion eu={palyazatok.eu} hazai={palyazatok.hazai} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA szekció */}
      <section className="py-16 px-4">
        <div className="max-w-[var(--max-content-width)] mx-auto">
          <div className="text-center py-16 px-8 lg:py-20 lg:px-16 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] shadow-[var(--shadow-lg)]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Szeretne Ön is partnereink közé tartozni?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Vegye fel velünk a kapcsolatot, és beszéljük meg, hogyan
              segíthetünk szervezete fejlődésében!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/kapcsolat/"
                className="inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)] focus-visible:ring-offset-2 px-8 py-4 text-lg rounded-[var(--radius-md)] bg-white text-[var(--color-accent-red)] hover:bg-white/90"
              >
                Kapcsolatfelvétel
              </Link>
              <a
                href="tel:+36703272146"
                className="inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)] focus-visible:ring-offset-2 bg-transparent border-2 hover:text-white px-8 py-4 text-lg rounded-[var(--radius-md)] border-white text-white hover:bg-white/10"
              >
                +36 70 327 2146
              </a>
            </div>
          </div>

          {/* Kapcsolódó oldalak - belső linkek SEO-hoz */}
          <div className="mt-12 text-center">
            <p className="text-[var(--color-text-muted)] mb-4">
              Ismerje meg szolgáltatásainkat:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/megoldasaink/"
                className="text-[var(--color-accent-orange)] hover:text-[var(--color-accent-red)] transition-colors underline underline-offset-4"
              >
                Megoldásaink
              </Link>
              <Link
                href="/rolunk/"
                className="text-[var(--color-accent-orange)] hover:text-[var(--color-accent-red)] transition-colors underline underline-offset-4"
              >
                Rólunk
              </Link>
              <Link
                href="/gyik/"
                className="text-[var(--color-accent-orange)] hover:text-[var(--color-accent-red)] transition-colors underline underline-offset-4"
              >
                Gyakori kérdések
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
