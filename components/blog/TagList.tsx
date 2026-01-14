// MATRIX CBS - Címke Lista Komponens
// Blog poszt címkék megjelenítése

import Link from 'next/link'
import { Tag } from '@prisma/client'

interface TagListProps {
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'filled'
  maxDisplay?: number
  className?: string
  showLabel?: boolean
  inline?: boolean
}

export default function TagList({
  tags,
  size = 'sm',
  variant = 'default',
  maxDisplay,
  className = '',
  showLabel = false,
  inline = true,
}: TagListProps) {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0

  if (tags.length === 0) {
    return null
  }

  // Méret osztályok
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  // Variant osztályok
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    bordered: 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
    filled: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
  }

  const containerClass = inline
    ? 'flex flex-wrap items-center gap-2'
    : 'flex flex-col gap-2'

  return (
    <div className={`${containerClass} ${className}`}>
      {showLabel && tags.length > 0 && (
        <span className="text-sm font-medium text-gray-600">
          Címkék:
        </span>
      )}

      <nav aria-label="Poszt címkék" className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog/cimke/${tag.slug}`}
            className={`
              inline-flex items-center rounded-full font-medium
              transition-colors
              ${sizeClasses[size]}
              ${variantClasses[variant]}
            `}
            aria-label={`${tag.name} címkével ellátott posztok megtekintése`}
          >
            <span className="mr-1" aria-hidden="true">#</span>
            {tag.name}
          </Link>
        ))}

        {remainingCount > 0 && (
          <span className={`
            inline-flex items-center text-gray-500
            ${sizeClasses[size]}
          `}>
            +{remainingCount} további
          </span>
        )}
      </nav>
    </div>
  )
}

// Tag badge komponens - egyedi címke megjelenítéshez
interface TagBadgeProps {
  name: string
  slug: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'filled'
  className?: string
  showHash?: boolean
}

export function TagBadge({
  name,
  slug,
  size = 'sm',
  variant = 'default',
  className = '',
  showHash = true,
}: TagBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    bordered: 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
    filled: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
  }

  return (
    <Link
      href={`/blog/cimke/${slug}`}
      className={`
        inline-flex items-center rounded-full font-medium
        transition-colors
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      aria-label={`${name} címkével ellátott posztok megtekintése`}
    >
      {showHash && <span className="mr-1" aria-hidden="true">#</span>}
      {name}
    </Link>
  )
}

// Kompakt tag lista - csak számmal
interface CompactTagListProps {
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[]
  className?: string
}

export function CompactTagList({ tags, className = '' }: CompactTagListProps) {
  if (tags.length === 0) {
    return null
  }

  // Első 3 címke megjelenítése, majd összesítő
  const displayTags = tags.slice(0, 3)
  const remainingCount = tags.length > 3 ? tags.length - 3 : 0

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        {displayTags.map((tag, index) => (
          <span key={tag.id}>
            <Link
              href={`/blog/cimke/${tag.slug}`}
              className="hover:text-primary-600 transition-colors"
            >
              {tag.name}
            </Link>
            {index < displayTags.length - 1 && <span className="mx-1">•</span>}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-gray-500">
            {' '}+{remainingCount}
          </span>
        )}
      </div>
    </div>
  )
}

// Tag cloud komponens - népszerűség szerinti megjelenítés
interface TagCloudProps {
  tags: (Pick<Tag, 'id' | 'name' | 'slug'> & {
    _count?: { posts: number }
  })[]
  maxTags?: number
  className?: string
}

export function TagCloud({ tags, maxTags = 20, className = '' }: TagCloudProps) {
  // Rendezés poszt szám szerint
  const sortedTags = [...tags]
    .sort((a, b) => {
      const aCount = a._count?.posts || 0
      const bCount = b._count?.posts || 0
      return bCount - aCount
    })
    .slice(0, maxTags)

  if (sortedTags.length === 0) {
    return null
  }

  // Méret kalkuláció a poszt szám alapján
  const maxCount = Math.max(...sortedTags.map(t => t._count?.posts || 0))
  const minCount = Math.min(...sortedTags.map(t => t._count?.posts || 0))

  const getSizeClass = (count: number) => {
    if (maxCount === minCount) return 'text-base'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.7) return 'text-lg font-semibold'
    if (ratio > 0.4) return 'text-base font-medium'
    return 'text-sm'
  }

  return (
    <nav aria-label="Címke felhő" className={`flex flex-wrap gap-3 ${className}`}>
      {sortedTags.map((tag) => {
        const postCount = tag._count?.posts || 0
        return (
          <Link
            key={tag.id}
            href={`/blog/cimke/${tag.slug}`}
            className={`
              text-gray-600 hover:text-primary-600 transition-colors
              ${getSizeClass(postCount)}
            `}
            title={`${postCount} poszt`}
          >
            #{tag.name}
          </Link>
        )
      })}
    </nav>
  )
}
