// MATRIX CBS - GYIK (Gyakran Ismételt Kérdések) oldal
// Public FAQ page with structured data for SEO

import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MainLayout } from '@/components/layout/MainLayout';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import FaqSchema from '@/components/marketing/FaqSchema';

export const metadata: Metadata = {
  title: 'Gyakran Ismételt Kérdések',
  description:
    'Válaszok a leggyakrabban felmerülő kérdésekre a MATRIX CBS felnőttképzési szolgáltatásaival kapcsolatban.',
  openGraph: {
    title: 'Gyakran Ismételt Kérdések | MATRIX CBS Kft.',
    description:
      'Válaszok a leggyakrabban felmerülő kérdésekre a MATRIX CBS felnőttképzési szolgáltatásaival kapcsolatban.',
    type: 'website',
  },
};

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

async function getFaqs() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Group by category
    const faqsByCategory: Record<string, typeof faqs> = {};
    faqs.forEach((faq) => {
      const category = faq.category || 'Általános';
      if (!faqsByCategory[category]) {
        faqsByCategory[category] = [];
      }
      faqsByCategory[category].push(faq);
    });

    return { faqs, faqsByCategory };
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return { faqs: [], faqsByCategory: {} };
  }
}

export default async function GyikPage() {
  const { faqs, faqsByCategory } = await getFaqs();
  const totalCount = faqs.length;
  const categoryCount = Object.keys(faqsByCategory).length;

  return (
    <MainLayout>
      {/* JSON-LD Structured Data for SEO */}
      {faqs.length > 0 && <FaqSchema faqs={faqs} />}

      <div className="min-h-screen bg-[var(--color-bg-dark)]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-dark)] border-b border-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Gyakran Ismételt Kérdések
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
              Válaszok a leggyakrabban felmerülő kérdésekre szolgáltatásainkkal,
              tréningjeinkkel és szervezetfejlesztési megoldásainkkal
              kapcsolatban.
            </p>
            <div className="mt-4 text-sm text-[var(--color-gray-medium)]">
              <span className="font-medium text-[var(--color-accent-orange)]">
                {totalCount}
              </span>{' '}
              kérdés{' '}
              <span className="mx-2 text-[var(--color-bg-secondary)]">|</span>
              <span className="font-medium text-[var(--color-accent-orange)]">
                {categoryCount}
              </span>{' '}
              kategória
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Quick Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-bg-secondary)] p-6">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[var(--color-accent-orange)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Kategóriák
                </h2>
                <nav className="space-y-2">
                  {Object.keys(faqsByCategory).map((category) => (
                    <a
                      key={category}
                      href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      <span>{category}</span>
                      <span className="text-xs text-[var(--color-gray-medium)]">
                        {faqsByCategory[category].length}
                      </span>
                    </a>
                  ))}
                </nav>

                {/* Contact CTA in Sidebar */}
                <div className="mt-6 pt-6 border-t border-[var(--color-bg-secondary)]">
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    Nem találta a választ?
                  </p>
                  <Link
                    href="/kapcsolat"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange-hover)] transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Kapcsolat
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {Object.keys(faqsByCategory).length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] mb-4">
                    <svg
                      className="w-8 h-8 text-[var(--color-gray-medium)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Még nincsenek kérdések
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-6">
                    Hamarosan bővítjük a gyakran ismételt kérdések listáját.
                  </p>
                  <Link
                    href="/kapcsolat"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-md bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange-hover)] transition-colors duration-200"
                  >
                    Kérdezzen tőlünk!
                  </Link>
                </div>
              ) : (
                <>
                  {/* FAQ Accordion */}
                  <div className="bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-bg-secondary)] p-6 md:p-8">
                    <FaqAccordion faqsByCategory={faqsByCategory} />
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-8 bg-gradient-to-br from-[var(--color-accent-orange)]/10 to-[var(--color-accent-orange)]/5 border border-[var(--color-accent-orange)]/20 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                      Nem találta a választ?
                    </h2>
                    <p className="text-[var(--color-text-secondary)] mb-6 max-w-xl mx-auto">
                      Vegye fel velünk a kapcsolatot, szívesen válaszolunk minden
                      kérdésére! Munkatársaink készséggel állnak rendelkezésére.
                    </p>
                    <Link
                      href="/kapcsolat"
                      className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-lg bg-[var(--color-accent-orange)] text-white hover:bg-[var(--color-accent-orange-hover)] transition-colors duration-200 shadow-lg shadow-[var(--color-accent-orange)]/20"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Kapcsolatfelvétel
                    </Link>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
