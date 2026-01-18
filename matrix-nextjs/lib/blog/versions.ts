// MATRIX CBS - Verziókezelés
// Poszt verziók mentése, listázása, visszaállítása, összehasonlítása

import prisma from '@/lib/prisma'
import type { PostVersion, Post } from '@prisma/client'

// ============================================
// TÍPUSOK
// ============================================

export type VersionWithDetails = PostVersion & {
  createdByName?: string
}

export interface VersionDiff {
  field: string
  label: string
  oldValue: string | null
  newValue: string | null
  changed: boolean
}

export interface CreateVersionParams {
  postId: number
  createdBy: number
  changeNote?: string
}

// ============================================
// VERZIÓ LÉTREHOZÁSA
// ============================================

/**
 * Új verzió létrehozása az aktuális poszt állapotából
 */
export async function createVersion({
  postId,
  createdBy,
  changeNote
}: CreateVersionParams): Promise<PostVersion> {
  // Aktuális poszt lekérése
  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      title: true,
      content: true,
      excerpt: true
    }
  })

  if (!currentPost) {
    throw new Error('Poszt nem található')
  }

  // Legutóbbi verzió száma
  const lastVersion = await prisma.postVersion.findFirst({
    where: { postId },
    orderBy: { versionNum: 'desc' }
  })

  const nextVersionNum = (lastVersion?.versionNum || 0) + 1

  // Verzió mentése
  const version = await prisma.postVersion.create({
    data: {
      postId,
      title: currentPost.title,
      content: currentPost.content,
      excerpt: currentPost.excerpt,
      versionNum: nextVersionNum,
      changeNote: changeNote || null,
      createdBy
    }
  })

  return version
}

// ============================================
// VERZIÓK LISTÁZÁSA
// ============================================

/**
 * Poszt összes verziójának lekérése
 */
export async function getVersions(postId: number): Promise<VersionWithDetails[]> {
  const versions = await prisma.postVersion.findMany({
    where: { postId },
    orderBy: { versionNum: 'desc' }
  })

  // Admin nevek lekérése
  const adminIds = [...new Set(versions.map(v => v.createdBy))]
  const admins = await prisma.admin.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, name: true }
  })

  const adminMap = new Map(admins.map(a => [a.id, a.name]))

  // Verziók kiegészítése admin nevekkel
  const versionsWithDetails: VersionWithDetails[] = versions.map(version => ({
    ...version,
    createdByName: adminMap.get(version.createdBy) || 'Ismeretlen'
  }))

  return versionsWithDetails
}

/**
 * Egyedi verzió lekérése
 */
export async function getVersion(
  postId: number,
  versionNum: number
): Promise<PostVersion | null> {
  return prisma.postVersion.findUnique({
    where: {
      postId_versionNum: {
        postId,
        versionNum
      }
    }
  })
}

// ============================================
// VERZIÓ VISSZAÁLLÍTÁSA
// ============================================

/**
 * Poszt visszaállítása egy korábbi verzióra
 * Mentés előtt új verziót hoz létre a jelenlegi állapotról
 */
export async function restoreVersion(
  postId: number,
  versionNum: number,
  restoredBy: number,
  createBackup = true
): Promise<Post> {
  // Verzió lekérése
  const version = await prisma.postVersion.findUnique({
    where: {
      postId_versionNum: {
        postId,
        versionNum
      }
    }
  })

  if (!version) {
    throw new Error('Verzió nem található')
  }

  // Jelenlegi állapot mentése (opcionális)
  if (createBackup) {
    await createVersion({
      postId,
      createdBy: restoredBy,
      changeNote: `Mentés verzió ${versionNum} visszaállítása előtt`
    })
  }

  // Poszt visszaállítása
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title: version.title,
      content: version.content,
      excerpt: version.excerpt
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

  // Visszaállítási verzió létrehozása
  await createVersion({
    postId,
    createdBy: restoredBy,
    changeNote: `Visszaállítva verzió ${versionNum}-ról`
  })

  return updatedPost
}

// ============================================
// VERZIÓK ÖSSZEHASONLÍTÁSA
// ============================================

/**
 * Két verzió összehasonlítása
 */
export async function compareVersions(
  postId: number,
  version1Num: number,
  version2Num: number
): Promise<VersionDiff[]> {
  const [v1, v2] = await Promise.all([
    getVersion(postId, version1Num),
    getVersion(postId, version2Num)
  ])

  if (!v1 || !v2) {
    throw new Error('Az egyik vagy mindkét verzió nem található')
  }

  const diffs: VersionDiff[] = [
    {
      field: 'title',
      label: 'Cím',
      oldValue: v1.title,
      newValue: v2.title,
      changed: v1.title !== v2.title
    },
    {
      field: 'excerpt',
      label: 'Kivonat',
      oldValue: v1.excerpt,
      newValue: v2.excerpt,
      changed: v1.excerpt !== v2.excerpt
    },
    {
      field: 'content',
      label: 'Tartalom',
      oldValue: v1.content,
      newValue: v2.content,
      changed: v1.content !== v2.content
    }
  ]

  return diffs
}

/**
 * Verzió összehasonlítása az aktuális állapottal
 */
export async function compareWithCurrent(
  postId: number,
  versionNum: number
): Promise<VersionDiff[]> {
  const [version, currentPost] = await Promise.all([
    getVersion(postId, versionNum),
    prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        content: true,
        excerpt: true
      }
    })
  ])

  if (!version || !currentPost) {
    throw new Error('Verzió vagy poszt nem található')
  }

  const diffs: VersionDiff[] = [
    {
      field: 'title',
      label: 'Cím',
      oldValue: version.title,
      newValue: currentPost.title,
      changed: version.title !== currentPost.title
    },
    {
      field: 'excerpt',
      label: 'Kivonat',
      oldValue: version.excerpt,
      newValue: currentPost.excerpt,
      changed: version.excerpt !== currentPost.excerpt
    },
    {
      field: 'content',
      label: 'Tartalom',
      oldValue: version.content,
      newValue: currentPost.content,
      changed: version.content !== currentPost.content
    }
  ]

  return diffs
}

// ============================================
// VERZIÓ TÖRLÉSE
// ============================================

/**
 * Verzió törlése (csak admin jogosultsággal)
 */
export async function deleteVersion(
  postId: number,
  versionNum: number
): Promise<void> {
  await prisma.postVersion.delete({
    where: {
      postId_versionNum: {
        postId,
        versionNum
      }
    }
  })
}

/**
 * Régi verziók törlése (cleanup)
 * Csak a legutóbbi N verziót tartja meg
 */
export async function cleanupOldVersions(
  postId: number,
  keepCount = 10
): Promise<number> {
  const versions = await prisma.postVersion.findMany({
    where: { postId },
    orderBy: { versionNum: 'desc' },
    select: { versionNum: true }
  })

  if (versions.length <= keepCount) {
    return 0
  }

  const versionsToDelete = versions.slice(keepCount)
  const versionNums = versionsToDelete.map(v => v.versionNum)

  const result = await prisma.postVersion.deleteMany({
    where: {
      postId,
      versionNum: { in: versionNums }
    }
  })

  return result.count
}
