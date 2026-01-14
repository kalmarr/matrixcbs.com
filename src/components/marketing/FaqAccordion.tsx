'use client';

// MATRIX CBS - FAQ Accordion Component
// Animated accordion for FAQ items with category grouping

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
}

interface FaqAccordionProps {
  faqsByCategory: Record<string, Faq[]>;
}

export default function FaqAccordion({ faqsByCategory }: FaqAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const categories = Object.keys(faqsByCategory);

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category}>
          {/* Category Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[var(--color-accent-orange)]/10">
              <HelpCircle className="w-5 h-5 text-[var(--color-accent-orange)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {category}
            </h2>
            <span className="text-sm text-[var(--color-gray-medium)]">
              ({faqsByCategory[category].length})
            </span>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {faqsByCategory[category].map((faq) => {
              const isOpen = openItems.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-bg-secondary)] hover:border-[var(--color-accent-orange)]/30 transition-colors duration-200 overflow-hidden"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-orange)]/50 focus:ring-inset"
                  >
                    <span className="text-[var(--color-text-primary)] font-medium pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-colors duration-200 ${
                          isOpen
                            ? 'text-[var(--color-accent-orange)]'
                            : 'text-[var(--color-gray-medium)]'
                        }`}
                      />
                    </motion.div>
                  </button>

                  {/* Answer Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 border-t border-[var(--color-bg-primary)]">
                          <p className="text-[var(--color-text-secondary)] leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
