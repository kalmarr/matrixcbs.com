// MATRIX CBS - Admin Post API (egyedi)
// GET: Részletek, PUT: Módosítás, DELETE: Törlés

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/admin/posts/[id] - Poszt részletei
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
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
        },
        versions: {
          orderBy: { versionNum: 'desc' },
          take: 10
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Poszt nem található' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Hiba történt a poszt lekérdezésekor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/posts/[id] - Poszt módosítása
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

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
      categoryIds,
      tagIds,
      createVersion
    } = body

    const postId = parseInt(id)

    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: true,
        tags: true
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Poszt nem található' },
        { status: 404 }
      )
    }

    // Slug egyediség ellenőrzése (ha módosul)
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug }
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Ez a slug már létezik' },
          { status: 409 }
        )
      }
    }

    // Státusz és publikálási dátum kezelése
    let publishedAt = existing.publishedAt
    const newStatus = status || existing.status

    if (newStatus === PostStatus.PUBLISHED && !existing.publishedAt) {
      publishedAt = new Date()
    }

    // Verzió mentése ha szükséges
    if (createVersion) {
      const lastVersion = await prisma.postVersion.findFirst({
        where: { postId },
        orderBy: { versionNum: 'desc' }
      })

      await prisma.postVersion.create({
        data: {
          postId,
          title: existing.title,
          content: existing.content,
          excerpt: existing.excerpt,
          versionNum: (lastVersion?.versionNum || 0) + 1,
          changeNote: body.changeNote || null,
          createdBy: body.authorId || existing.authorId
        }
      })
    }

    // Tranzakció a poszt és kapcsolatok frissítésére
    const post = await prisma.$transaction(async (tx) => {
      // Kategóriák frissítése ha megadták
      if (categoryIds !== undefined) {
        // Régi kapcsolatok törlése
        await tx.postCategory.deleteMany({
          where: { postId }
        })
        // Új kapcsolatok létrehozása
        if (categoryIds.length > 0) {
          await tx.postCategory.createMany({
            data: categoryIds.map((categoryId: number) => ({
              postId,
              categoryId
            }))
          })
        }
      }

      // Címkék frissítése ha megadták
      if (tagIds !== undefined) {
        // Régi kapcsolatok törlése
        await tx.postTag.deleteMany({
          where: { postId }
        })
        // Új kapcsolatok létrehozása
        if (tagIds.length > 0) {
          await tx.postTag.createMany({
            data: tagIds.map((tagId: number) => ({
              postId,
              tagId
            }))
          })
        }
      }

      // Poszt frissítése
      return tx.post.update({
        where: { id: postId },
        data: {
          title: title ?? existing.title,
          slug: slug ?? existing.slug,
          content: content ?? existing.content,
          excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
          featuredImage: featuredImage !== undefined ? featuredImage : existing.featuredImage,
          status: newStatus,
          publishedAt,
          scheduledAt: scheduledAt !== undefined
            ? (scheduledAt ? new Date(scheduledAt) : null)
            : existing.scheduledAt,
          metaTitle: metaTitle !== undefined ? metaTitle : existing.metaTitle,
          metaDescription: metaDescription !== undefined ? metaDescription : existing.metaDescription,
          canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : existing.canonicalUrl
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
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Hiba történt a poszt módosításakor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/posts/[id] - Poszt törlése
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const postId = parseInt(id)

    // Ellenőrzés, hogy létezik-e
    const existing = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Poszt nem található' },
        { status: 404 }
      )
    }

    // Törlés (cascade törli a kapcsolódó rekordokat is)
    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Hiba történt a poszt törlésekor' },
      { status: 500 }
    )
  }
}
