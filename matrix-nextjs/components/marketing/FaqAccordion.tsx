'use client'

// MATRIX CBS - FAQ Accordion Component
// Kategorikusan csoportosított, összecsukható FAQ megjelenítés

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Faq {
  id: number
  question: string
  answer: string
  category: string | null
}

interface FaqsByCategoryProps {
  faqsByCategory: Record<string, Faq[]>
}

export default function FaqAccordion({ faqsByCategory }: FaqsByCategoryProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const categories = Object.keys(faqsByCategory).sort()

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Jelenleg nincsenek gyakran ismételt kérdések.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          {/* Category Header */}
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2">
            {category}
          </h2>

          {/* FAQ Items */}
          <div className="space-y-3">
            {faqsByCategory[category].map((faq) => {
              const isOpen = openItems.has(faq.id)

              return (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-start justify-between gap-4 p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 text-orange-500">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </span>
                  </button>

                  {/* Answer Panel */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 pt-0 bg-gray-50 border-t border-gray-200">
                      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
