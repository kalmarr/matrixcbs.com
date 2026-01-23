'use client';

/**
 * MATRIX CBS - References Tabs Navigation
 * Tab navigáció a referencia kategóriákhoz
 */

import { motion } from 'framer-motion';
import type { ReferenceCategory, TabConfig } from '@/types/referenciak';

interface ReferencesTabsProps {
  tabs: TabConfig[];
  activeTab: ReferenceCategory;
  onTabChange: (tab: ReferenceCategory) => void;
}

export function ReferencesTabs({
  tabs,
  activeTab,
  onTabChange,
}: ReferencesTabsProps) {
  return (
    <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
      {/* Tab container with horizontal scroll on mobile */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center gap-2 md:gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 md:px-6 py-3 md:py-4
                  rounded-xl font-medium text-sm md:text-base whitespace-nowrap
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]
                  ${
                    isActive
                      ? 'text-white'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                  }
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-red)] to-[var(--color-accent-orange)] rounded-xl"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Tab content */}
                <span className="relative z-10">{tab.label}</span>

                {/* Count badge */}
                <span
                  className={`
                    relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fade edges for scroll indication on mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent pointer-events-none md:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent pointer-events-none md:hidden" />
      </div>
    </div>
  );
}
