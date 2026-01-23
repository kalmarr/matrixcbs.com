'use client';

/**
 * MATRIX CBS - Pályázat Accordion Component
 * Accordion a pályázatok megjelenítéséhez (EU és Hazai)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import type { Palyazat } from '@/types/referenciak';

// EU Flag SVG Component - official 12 golden 5-pointed stars on blue
function EUFlag({ className }: { className?: string }) {
  // Create 5-pointed star polygon points
  const starPoints = (cx: number, cy: number, outer: number, inner: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      // Outer point
      const outerAngle = (i * 72 - 90) * Math.PI / 180;
      pts.push(`${cx + outer * Math.cos(outerAngle)},${cy + outer * Math.sin(outerAngle)}`);
      // Inner point
      const innerAngle = (i * 72 + 36 - 90) * Math.PI / 180;
      pts.push(`${cx + inner * Math.cos(innerAngle)},${cy + inner * Math.sin(innerAngle)}`);
    }
    return pts.join(' ');
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EU zászló"
    >
      <defs>
        <clipPath id="euFlagClip">
          <rect width="24" height="24" rx="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#euFlagClip)">
        {/* Blue background - official EU blue #003399 */}
        <rect width="24" height="24" fill="#003399" />
        {/* 12 golden 5-pointed stars arranged in a circle */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const cx = 12 + 7 * Math.cos(angle);
          const cy = 12 + 7 * Math.sin(angle);
          return (
            <polygon
              key={i}
              points={starPoints(cx, cy, 2.2, 0.85)}
              fill="#FFCC00"
            />
          );
        })}
      </g>
    </svg>
  );
}

// Hungarian Flag SVG Component
function HungarianFlag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Magyar zászló"
    >
      <defs>
        <clipPath id="hunFlagClip">
          <rect width="24" height="24" rx="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#hunFlagClip)">
        {/* Red stripe (top) */}
        <rect x="0" y="0" width="24" height="8" fill="#CE2939" />
        {/* White stripe (middle) */}
        <rect x="0" y="8" width="24" height="8" fill="#FFFFFF" />
        {/* Green stripe (bottom) */}
        <rect x="0" y="16" width="24" height="8" fill="#477050" />
      </g>
    </svg>
  );
}

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
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            <Icon className="w-8 h-8" aria-hidden="true" />
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
            aria-hidden="true"
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
          icon={EUFlag}
          items={eu}
          defaultOpen={true}
          accentColor="red"
        />

        <AccordionSection
          title="Nemzeti, hazai kormányzati programok"
          icon={HungarianFlag}
          items={hazai}
          defaultOpen={false}
          accentColor="orange"
        />
      </div>
    </motion.div>
  );
}
