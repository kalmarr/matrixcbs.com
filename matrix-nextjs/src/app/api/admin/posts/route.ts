// MATRIX CBS - Admin Posts API
// GET: Lista szűréssel/lapozással, POST: Új poszt

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'
import { requireAuth } from '@/lib/auth-guard'

// GET /api/admin/posts - Posztok listája
export async function GET(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)

    // Szűrési paraméterek
    const status = searchParams.get('status') as PostStatus | null
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Where feltételek építése
    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId: parseInt(categoryId)
        }
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    // Párhuzamos lekérdezések
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Hiba történt a posztok lekérdezésekor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/posts - Új poszt létrehozása
export async function POST(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult.error) {
    return authResult.error
  }

  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status,
      scheduledAt,
      metaTitle,
      metaDescription,
      canonicalUrl,
      authorId,
      categoryIds,
      tagIds
    } = body

    // Validáció
    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: 'A cím, slug, tartalom és szerző megadása kötelező' },
        { status: 400 }
      )
    }

    // Slug egyediség ellenőrzése
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Ez a slug már létezik' },
        { status: 409 }
      )
    }

    // Státusz és publikálási dátum kezelése
    let postStatus = status || PostStatus.DRAFT
    let publishedAt = null

    if (postStatus === PostStatus.PUBLISHED) {
      publishedAt = new Date()
    } else if (postStatus === PostStatus.SCHEDULED && scheduledAt) {
      // Ütemezett posztok
    }

    // Poszt létrehozása tranzakcióban
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
        status: postStatus,
        publishedAt,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        authorId,
        // Kategóriák hozzáadása
        categories: categoryIds?.length ? {
          create: categoryIds.map((categoryId: number) => ({
            categoryId
          }))
        } : undefined,
        // Címkék hozzáadása
        tags: tagIds?.length ? {
          create: tagIds.map((tagId: number) => ({
            tagId
          }))
        } : undefined
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Hiba történt a poszt létrehozásakor' },
      { status: 500 }
    )
  }
}
