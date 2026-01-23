// MATRIX CBS - Referenciák oldal
// Szakértések, megbízatások, képzések és pályázatok bemutatása

import { Metadata } from 'next';
import Script from 'next/script';
import { MainLayout } from '@/components/layout/MainLayout';
import { ReferencesContent } from './ReferencesContent';

// SEO optimalizált metadatok
export const metadata: Metadata = {
  title: 'Referenciák | Szakértések és pályázatírás - MATRIX CBS',
  description:
    '15+ év szakmai tapasztalat a felnőttképzés, akkreditáció és pályázatírás területén. Ismerje meg sikeres projektjeinket és szakértői megbízatásainkat: NSZI, NAH, BM, OKF szakértések.',
  keywords: [
    'felnőttképzési szakértő',
    'akkreditációs tanácsadás',
    'pályázatírás',
    'GINOP pályázat',
    'TÁMOP pályázat',
    'NAH akkreditáció',
    'NSZI szakértő',
    'vizsgaközpont akkreditáció',
    'szervezetfejlesztés',
    'HR tanácsadás',
  ],
  openGraph: {
    title: 'Referenciák | MATRIX CBS Kft. - Szakértések és pályázatírás',
    description:
      '15+ év tapasztalat, 20+ sikeres pályázat, 7+ akkreditáció. Tekintse meg szakmai referenciáinkat a felnőttképzés, akkreditáció és pályázatírás területén.',
    type: 'website',
    locale: 'hu_HU',
    siteName: 'MATRIX CBS Kft.',
    url: 'https://matrixcbs.com/referenciak/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Referenciák | MATRIX CBS Kft.',
    description:
      '15+ év szakmai tapasztalat a felnőttképzés és pályázatírás területén.',
  },
  alternates: {
    canonical: 'https://matrixcbs.com/referenciak/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD strukturált adatok
const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'MATRIX CBS Kft. Referenciák',
  description:
    'Szakértési projektek, akkreditációs megbízatások, képzések és pályázatírás referenciái.',
  url: 'https://matrixcbs.com/referenciak/',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: 38,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Szakértések',
        description: 'Tanácsadói és szakértői projektek',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Megbízatások',
        description: 'Akkreditációk és szakértői pozíciók',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Képzések',
        description: 'Felnőttképzési programok',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Pályázatírás',
        description: 'EU és hazai pályázatok',
      },
    ],
  },
  isPartOf: {
    '@type': 'WebSite',
    name: 'MATRIX CBS Kft.',
    url: 'https://matrixcbs.com',
  },
};

export default function ReferenciakPage() {
  return (
    <MainLayout>
      {/* JSON-LD Script - Next.js Script komponens */}
      <Script
        id="references-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLdData)}
      </Script>

      {/* Main Content - Client Component */}
      <ReferencesContent />
    </MainLayout>
  );
}
