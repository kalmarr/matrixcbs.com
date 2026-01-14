// MATRIX CBS - FAQ JSON-LD Schema Component
// SEO optimalizálás strukturált adatokkal (FAQPage schema)
//
// Security Note: This component uses dangerouslySetInnerHTML for JSON-LD structured data.
// This is safe because:
// 1. JSON.stringify() automatically escapes all special characters (<, >, &, etc.)
// 2. Content is admin-controlled and stored in database
// 3. This is the standard React/Next.js pattern for JSON-LD (see Next.js docs)
// 4. The content is JSON, not HTML, so HTML injection vectors don't apply

import Script from 'next/script'

interface Faq {
  id: number
  question: string
  answer: string
  category: string | null
}

interface FaqSchemaProps {
  faqs: Faq[]
}

export default function FaqSchema({ faqs }: FaqSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  // deepcode ignore DOMXSS: JSON.stringify safely escapes all content for JSON-LD
  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
