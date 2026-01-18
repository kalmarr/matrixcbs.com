'use client'

// MATRIX CBS - Blog Poszt Szűrők Komponens
// Kategória és címke alapú szűrés oldalsávval

import Link from 'next/link'
import { Category, Tag } from '@prisma/client'

interface CategoryWithCount extends Category {
  _count?: {
    posts: number
  }
}

interface TagWithCount extends Tag {
  _count?: {
    posts: number
  }
}

interface PostFiltersProps {
  categories: CategoryWithCount[]
  tags: TagWithCount[]
  selectedCategory?: string
  selectedTag?: string
  onCategoryChange?: (slug: string | null) => void
  onTagChange?: (slug: string | null) => void
}

export default function PostFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}: PostFiltersProps) {
  const hasActiveFilters = selectedCategory || selectedTag

  const handleClearFilters = () => {
    if (onCategoryChange) onCategoryChange(null)
    if (onTagChange) onTagChange(null)
  }

  // Legnépszerűbb címkék (legtöbb poszttal rendelkező 10)
  const popularTags = tags
    .filter(tag => tag._count && tag._count.posts > 0)
    .sort((a, b) => {
      const aCount = a._count?.posts || 0
      const bCount = b._count?.posts || 0
      return bCount - aCount
    })
    .slice(0, 10)

  return (
    <aside className="space-y-6">
      {/* Szűrők fejléc */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Szűrők</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            aria-label="Összes szűrő törlése"
          >
            Törlés
          </button>
        )}
      </div>

      {/* Kategóriák */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Kategóriák
        </h3>
        <nav aria-label="Blog kategóriák">
          <ul className="space-y-2">
            {categories.map((category) => {
              const postCount = category._count?.posts || 0
              const isActive = selectedCategory === category.slug

              return (
                <li key={category.id}>
                  {onCategoryChange ? (
                    <button
                      onClick={() => onCategoryChange(isActive ? null : category.slug)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        transition-colors text-left
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="flex items-center gap-2">
                        {category.color && (
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                            aria-hidden="true"
                          />
                        )}
                        <span>{category.name}</span>
                      </span>
                      {postCount > 0 && (
                        <span className={`
                          text-sm px-2 py-0.5 rounded-full
                          ${isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {postCount}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={`/blog/kategoria/${category.slug}`}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg
                        transition-colors
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="flex items-center gap-2">
                        {category.color && (
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                            aria-hidden="true"
                          />
                        )}
                        <span>{category.name}</span>
                      </span>
                      {postCount > 0 && (
                        <span className={`
                          text-sm px-2 py-0.5 rounded-full
                          ${isActive
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {postCount}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {categories.length === 0 && (
          <p className="text-sm text-gray-500 italic">Nincsenek kategóriák</p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Népszerű címkék */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Népszerű címkék
        </h3>
        <nav aria-label="Népszerű blog címkék">
          {popularTags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {popularTags.map((tag) => {
                const isActive = selectedTag === tag.slug

                return (
                  <li key={tag.id}>
                    {onTagChange ? (
                      <button
                        onClick={() => onTagChange(isActive ? null : tag.slug)}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          text-sm transition-colors
                          ${isActive
                            ? 'bg-primary-600 text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <span>{tag.name}</span>
                        {tag._count && tag._count.posts > 0 && (
                          <span className={`
                            text-xs
                            ${isActive ? 'text-primary-100' : 'text-gray-500'}
                          `}>
                            ({tag._count.posts})
                          </span>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={`/blog/cimke/${tag.slug}`}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          text-sm transition-colors
                          ${isActive
                            ? 'bg-primary-600 text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span>{tag.name}</span>
                        {tag._count && tag._count.posts > 0 && (
                          <span className={`
                            text-xs
                            ${isActive ? 'text-primary-100' : 'text-gray-500'}
                          `}>
                            ({tag._count.posts})
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">Nincsenek címkék</p>
          )}
        </nav>
      </div>

      {/* Aktív szűrők összegzése */}
      {hasActiveFilters && (
        <>
          <hr className="border-gray-200" />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Aktív szűrők
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span className="font-medium">Kategória:</span>
                  <span>{categories.find(c => c.slug === selectedCategory)?.name}</span>
                  {onCategoryChange && (
                    <button
                      onClick={() => onCategoryChange(null)}
                      className="ml-1 hover:text-primary-900"
                      aria-label="Kategória szűrő törlése"
                    >
                      ✕
                    </button>
                  )}
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <span className="font-medium">Címke:</span>
                  <span>{tags.find(t => t.slug === selectedTag)?.name}</span>
                  {onTagChange && (
                    <button
                      onClick={() => onTagChange(null)}
                      className="ml-1 hover:text-primary-900"
                      aria-label="Címke szűrő törlése"
                    >
                      ✕
                    </button>
                  )}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
