// MATRIX CBS - FAQ Schema Component
// JSON-LD structured data for Google FAQ rich results

import Script from 'next/script';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqSchemaProps {
  faqs: Faq[];
}

export default function FaqSchema({ faqs }: FaqSchemaProps) {
  // Sanitize text content for JSON-LD
  const sanitizeText = (text: string): string => {
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: sanitizeText(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: sanitizeText(faq.answer),
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(schemaData)}
    </Script>
  );
}
