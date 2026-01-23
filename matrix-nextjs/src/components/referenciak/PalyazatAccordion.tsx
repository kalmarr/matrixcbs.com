'use client';

/**
 * MATRIX CBS - Pályázat Accordion Component
 * Accordion a pályázatok megjelenítéséhez (EU és Hazai)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Home } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import type { Palyazat } from '@/types/referenciak';

interface PalyazatAccordionProps {
  eu: Palyazat[];
  hazai: Palyazat[];
}

interface AccordionSectionProps {
  title: string;
  icon: React.ElementType;
  items: Palyazat[];
  defaultOpen?: boolean;
  accentColor: 'red' | 'orange';
}

function AccordionSection({
  title,
  icon: Icon,
  items,
  defaultOpen = false,
  accentColor,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorClasses = {
    red: {
      iconBg: 'bg-[var(--color-accent-red)]/10',
      iconColor: 'text-[var(--color-accent-red)]',
      hoverBorder: 'hover:border-[var(--color-accent-red)]/30',
    },
    orange: {
      iconBg: 'bg-[var(--color-accent-orange)]/10',
      iconColor: 'text-[var(--color-accent-orange)]',
      hoverBorder: 'hover:border-[var(--color-accent-orange)]/30',
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div
      className={`
        bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-bg-tertiary)]
        ${colors.hoverBorder} transition-colors duration-200 overflow-hidden
      `}
    >
      {/* Header button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)]/50 focus-visible:ring-inset"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
            <Icon className={`w-5 h-5 ${colors.iconColor}`} />
          </div>

          {/* Title and count */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>
            <span className="text-sm text-[var(--color-text-muted)]">
              {items.length} pályázat
            </span>
          </div>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors duration-200 ${
              isOpen
                ? colors.iconColor
                : 'text-[var(--color-gray-medium)]'
            }`}
          />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-[var(--color-bg-primary)]">
              {/* Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="text-left text-sm text-[var(--color-text-muted)] border-b border-[var(--color-bg-tertiary)]">
                      <th className="pb-3 font-medium w-[140px]">Pályázat</th>
                      <th className="pb-3 font-medium">Megnevezés</th>
                      <th className="pb-3 font-medium w-[200px]">Cél</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-bg-tertiary)]">
                    {items.map((palyazat) => (
                      <tr key={palyazat.id} className="group">
                        <td className="py-3 pr-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md bg-[var(--color-bg-tertiary)] font-mono text-sm text-[var(--color-accent-orange)] group-hover:bg-[var(--color-accent-orange)]/10 transition-colors">
                            {palyazat.kod}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-[var(--color-text-primary)]">
                          {palyazat.megnevezes}
                        </td>
                        <td className="py-3 text-sm text-[var(--color-text-secondary)]">
                          {palyazat.cel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PalyazatAccordion({ eu, hazai }: PalyazatAccordionProps) {
  return (
    <motion.div
      className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Section header */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Pályázatírás
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Sikeres pályázataink uniós és hazai konstrukciókban
        </p>
      </div>

      {/* Accordion sections */}
      <div className="space-y-4">
        <AccordionSection
          title="Uniós és régiós konstrukciók"
          icon={Globe}
          items={eu}
          defaultOpen={true}
          accentColor="red"
        />

        <AccordionSection
          title="Nemzeti, hazai kormányzati programok"
          icon={Home}
          items={hazai}
          defaultOpen={false}
          accentColor="orange"
        />
      </div>
    </motion.div>
  );
}
