// MATRIX CBS - Referenciák oldal
// Publikus oldal az ügyfélreferenciák megjelenítésére

import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import ReferenceCard from '@/components/marketing/ReferenceCard'
import { MainLayout } from '@/components/layout/MainLayout'

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Referenciák',
  description:
    'Partnereink véleménye a MATRIX CBS Kft. képzéseiről és szolgáltatásairól. Nézze meg, hogyan segítettünk más szervezeteknek.',
  openGraph: {
    title: 'Referenciák | MATRIX CBS Kft.',
    description:
      'Partnereink véleménye a MATRIX CBS Kft. képzéseiről és szolgáltatásairól.',
    type: 'website',
  },
}

async function getReferences() {
  try {
    const references = await prisma.reference.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })
    return references
  } catch (error) {
    console.error('Error fetching references:', error)
    return []
  }
}

export default async function ReferenciakPage() {
  const references = await getReferences()

  return (
    <MainLayout>
      {/* Hero szekció */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partnereink véleménye
            </h1>
            <p className="text-xl text-gray-300">
              Büszkék vagyunk arra, hogy sok szervezetnek segíthettünk
              fejlődésük útján. Olvassa el partnereink véleményét
              szolgáltatásainkról.
            </p>
          </div>
        </div>
      </section>

      {/* Referenciák szekció */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {references.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                Jelenleg nincsenek publikus referenciák.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {references.map((reference) => (
                <ReferenceCard
                  key={reference.id}
                  companyName={reference.companyName}
                  contactName={reference.contactName}
                  contactRole={reference.contactRole}
                  testimonial={reference.testimonial}
                  logoPath={reference.logoPath}
                  websiteUrl={reference.websiteUrl}
                  featured={reference.featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA szekció */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Szeretne Ön is partnereink közé tartozni?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vegye fel velünk a kapcsolatot, és beszéljük meg, hogyan
            segíthetünk szervezete fejlődésében!
          </p>
          <a
            href="/kapcsolat"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Kapcsolatfelvétel
          </a>
        </div>
      </section>
    </MainLayout>
  )
}
