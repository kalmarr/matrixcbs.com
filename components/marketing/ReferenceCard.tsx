// MATRIX CBS - Referencia Kártya Komponens
// Egy ügyfélreferencia megjelenítése

import { ExternalLink, Star } from 'lucide-react'
import Image from 'next/image'

interface ReferenceCardProps {
  companyName: string
  contactName: string | null
  contactRole: string | null
  testimonial: string
  logoPath: string | null
  websiteUrl: string | null
  featured: boolean
}

export default function ReferenceCard({
  companyName,
  contactName,
  contactRole,
  testimonial,
  logoPath,
  websiteUrl,
  featured
}: ReferenceCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative ${
        featured ? 'border-2 border-orange-500' : ''
      }`}
    >
      {/* Kiemelt badge */}
      {featured && (
        <div className="absolute top-4 right-4">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Kiemelt
          </div>
        </div>
      )}

      {/* Logo */}
      {logoPath && (
        <div className="mb-4 h-16 flex items-center justify-center">
          <Image
            src={logoPath}
            alt={`${companyName} logo`}
            width={120}
            height={60}
            className="object-contain max-h-full"
          />
        </div>
      )}

      {/* Cégnév */}
      <div className="mb-4">
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-gray-900 hover:text-orange-500 transition-colors flex items-center gap-2 group"
          >
            {companyName}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ) : (
          <h3 className="text-xl font-bold text-gray-900">{companyName}</h3>
        )}
      </div>

      {/* Vélemény */}
      <blockquote className="text-gray-700 italic mb-6 relative">
        <span className="text-5xl text-orange-500 absolute -top-2 -left-1 opacity-20">
          "
        </span>
        <p className="relative z-10 pl-4">{testimonial}</p>
        <span className="text-5xl text-orange-500 absolute -bottom-8 right-2 opacity-20">
          "
        </span>
      </blockquote>

      {/* Kapcsolattartó */}
      {(contactName || contactRole) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {contactName && (
            <p className="font-semibold text-gray-900">{contactName}</p>
          )}
          {contactRole && (
            <p className="text-sm text-gray-600">{contactRole}</p>
          )}
        </div>
      )}
    </div>
  )
}
