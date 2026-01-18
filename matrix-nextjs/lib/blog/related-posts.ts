// MATRIX CBS - Related Posts Algorithm
// Finds related posts based on categories and tags

import { prisma } from '@/lib/prisma'

export interface RelatedPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  categories: Array<{
    category: {
      id: number
      name: string
      color: string | null
    }
  }>
}

/**
 * Get related posts for a given post
 * @param postId - The ID of the current post
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts
 */
export async function getRelatedPosts(
  postId: number,
  limit: number = 3
): Promise<RelatedPost[]> {
  try {
    // First, get the current post's categories and tags
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: {
          select: { categoryId: true }
        },
        tags: {
          select: { tagId: true }
        }
      }
    })

    if (!currentPost) {
      return []
    }

    const categoryIds = currentPost.categories.map(c => c.categoryId)
    const tagIds = currentPost.tags.map(t => t.tagId)

    // Find posts with shared categories (prioritized)
    const relatedByCategory = await prisma.post.findMany({
      where: {
        id: { not: postId },
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        categories: {
          some: {
            categoryId: { in: categoryIds }
          }
        }
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    })

    // If we don't have enough posts from categories, find posts with shared tags
    if (relatedByCategory.length < limit && tagIds.length > 0) {
      const existingIds = relatedByCategory.map(p => p.id)
      const remaining = limit - relatedByCategory.length

      const relatedByTag = await prisma.post.findMany({
        where: {
          id: {
            notIn: [postId, ...existingIds]
          },
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
          tags: {
            some: {
              tagId: { in: tagIds }
            }
          }
        },
        include: {
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: remaining
      })

      return [...relatedByCategory, ...relatedByTag]
    }

    return relatedByCategory
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

/**
 * Get related posts with category match count for better sorting
 * This is an alternative implementation that sorts by relevance score
 */
export async function getRelatedPostsByRelevance(
  postId: number,
  limit: number = 3
): Promise<RelatedPost[]> {
  try {
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: { select: { categoryId: true } },
        tags: { select: { tagId: true } }
      }
    })

    if (!currentPost) {
      return []
    }

    const categoryIds = currentPost.categories.map(c => c.categoryId)
    const tagIds = currentPost.tags.map(t => t.tagId)

    // Get all potential related posts
    const candidates = await prisma.post.findMany({
      where: {
        id: { not: postId },
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          {
            categories: {
              some: { categoryId: { in: categoryIds } }
            }
          },
          {
            tags: {
              some: { tagId: { in: tagIds } }
            }
          }
        ]
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        },
        tags: {
          select: { tagId: true }
        }
      }
    })

    // Calculate relevance score for each candidate
    const scoredPosts = candidates.map(post => {
      const categoryMatches = post.categories.filter(c =>
        categoryIds.includes(c.category.id)
      ).length

      const tagMatches = post.tags.filter(t =>
        tagIds.includes(t.tagId)
      ).length

      // Categories are weighted more heavily than tags
      const score = (categoryMatches * 3) + tagMatches

      return { post, score }
    })

    // Sort by score (descending) and then by publishedAt (descending)
    scoredPosts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      const dateA = a.post.publishedAt?.getTime() || 0
      const dateB = b.post.publishedAt?.getTime() || 0
      return dateB - dateA
    })

    // Return top N posts without the tags field
    return scoredPosts.slice(0, limit).map(({ post }) => {
      const { tags, ...postWithoutTags } = post
      return postWithoutTags
    })
  } catch (error) {
    console.error('Error fetching related posts by relevance:', error)
    return []
  }
}
