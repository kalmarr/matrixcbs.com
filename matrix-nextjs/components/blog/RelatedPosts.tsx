'use client'

// MATRIX CBS - Related Posts Component
// Displays related posts based on categories and tags

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'

interface RelatedPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: string | null
  categories: Array<{
    category: {
      id: number
      name: string
      color: string | null
    }
  }>
}

interface RelatedPostsProps {
  postId: number
  limit?: number
}

export default function RelatedPosts({ postId, limit = 3 }: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/blog/related-posts?postId=${postId}&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch related posts')
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Error fetching related posts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [postId, limit])

  // Format date to Hungarian locale
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Don't render anything if there are no related posts
  if (loading) {
    return (
      <div className="mt-12 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (error || posts.length === 0) {
    return null
  }

  return (
    <section className="mt-12 py-8 border-t border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kapcsolódó cikkek</h2>
        <p className="mt-2 text-gray-600">
          További érdekes tartalmak a témában
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              {/* Featured Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                    <span className="text-4xl text-orange-300">📝</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Categories */}
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map(({ category }) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${category.color || '#f68616'}20`,
                          color: category.color || '#f68616'
                        }}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Date and Read More */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt || ''}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>

                  <span className="flex items-center gap-1 text-orange-600 font-medium group-hover:gap-2 transition-all">
                    Olvasom
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
