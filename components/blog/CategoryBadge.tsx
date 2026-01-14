// MATRIX CBS - Kategória Jelvény Komponens
// Kategória badge megjelenítése színnel és linkkel

import Link from 'next/link'
import { Category } from '@prisma/client'

interface CategoryBadgeProps {
  name: string
  slug: string
  color?: string | null
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'subtle'
  className?: string
  showDot?: boolean
}

export default function CategoryBadge({
  name,
  slug,
  color,
  size = 'md',
  variant = 'subtle',
  className = '',
  showDot = true,
}: CategoryBadgeProps) {
  // Méret osztályok
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  // Színskéma generálás kategória színből
  const getColorClasses = () => {
    if (!color || variant === 'solid') {
      // Alapértelmezett színek ha nincs megadva vagy solid variant
      if (variant === 'solid') {
        return {
          background: color || '#6366f1',
          text: 'text-white',
          border: '',
        }
      }
      if (variant === 'outline') {
        return {
          background: 'transparent',
          text: 'text-gray-700',
          border: 'border border-gray-300',
        }
      }
      return {
        background: '#f3f4f6',
        text: 'text-gray-700',
        border: '',
      }
    }

    // Variant specifikus színek
    if (variant === 'outline') {
      return {
        background: 'transparent',
        text: color,
        border: `border-2`,
        borderColor: color,
      }
    }

    // Subtle variant - világosított háttér
    return {
      background: `${color}15`, // 15% opacity
      text: color,
      border: '',
    }
  }

  const colorClasses = getColorClasses()

  const badgeStyle: React.CSSProperties = {
    backgroundColor: colorClasses.background,
    borderColor: colorClasses.borderColor,
  }

  const textStyle: React.CSSProperties =
    variant !== 'outline' && color && variant === 'subtle'
      ? { color: color }
      : {}

  const content = (
    <span className="flex items-center gap-1.5">
      {showDot && color && variant !== 'outline' && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      <span>{name}</span>
    </span>
  )

  return (
    <Link
      href={`/blog/kategoria/${slug}`}
      className={`
        inline-flex items-center rounded-full font-medium
        transition-all hover:shadow-sm
        ${sizeClasses[size]}
        ${colorClasses.text}
        ${colorClasses.border}
        ${className}
      `}
      style={badgeStyle}
      aria-label={`${name} kategória megtekintése`}
    >
      {content}
    </Link>
  )
}

// Kategória lista komponens
interface CategoryListProps {
  categories: Pick<Category, 'id' | 'name' | 'slug' | 'color'>[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'subtle'
  showDot?: boolean
  maxDisplay?: number
  className?: string
}

export function CategoryList({
  categories,
  size = 'sm',
  variant = 'subtle',
  showDot = true,
  maxDisplay,
  className = '',
}: CategoryListProps) {
  const displayCategories = maxDisplay
    ? categories.slice(0, maxDisplay)
    : categories

  const remainingCount = maxDisplay && categories.length > maxDisplay
    ? categories.length - maxDisplay
    : 0

  if (categories.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {displayCategories.map((category) => (
        <CategoryBadge
          key={category.id}
          name={category.name}
          slug={category.slug}
          color={category.color}
          size={size}
          variant={variant}
          showDot={showDot}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-sm text-gray-500">
          +{remainingCount} további
        </span>
      )}
    </div>
  )
}
