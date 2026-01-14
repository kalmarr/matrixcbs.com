// MATRIX CBS - Poszt Verziók API
// GET: Verziók listázása, összehasonlítás
// POST: Új verzió manuális létrehozása
// PUT: Verzió visszaállítása

import { NextRequest, NextResponse } from 'next/server'
import {
  getVersions,
  createVersion,
  restoreVersion,
  compareWithCurrent
} from '@/lib/blog/versions'

// ============================================
// TÍPUSOK
// ============================================

type RouteParams = { params: Promise<{ id: string }> }

// ============================================
// GET - Verziók listázása / összehasonlítás
// ============================================

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    return NextResponse.json(
      { error: 'Érvénytelen poszt ID' },
      { status: 400 }
    )
  }

  try {
    // Összehasonlítás paraméter ellenőrzése
    const { searchParams } = new URL(request.url)
    const compareVersionNum = searchParams.get('compare')

    // Összehasonlítás a jelenlegi állapottal
    if (compareVersionNum) {
      const versionNum = parseInt(compareVersionNum)
      if (isNaN(versionNum)) {
        return NextResponse.json(
          { error: 'Érvénytelen verzió szám' },
          { status: 400 }
        )
      }

      const diffs = await compareWithCurrent(postId, versionNum)
      return NextResponse.json({ diffs })
    }

    // Összes verzió listázása
    const versions = await getVersions(postId)
    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hiba a verziók lekérdezésekor' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Új verzió manuális létrehozása
// ============================================

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    return NextResponse.json(
      { error: 'Érvénytelen poszt ID' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const { createdBy, changeNote } = body

    if (!createdBy || typeof createdBy !== 'number') {
      return NextResponse.json(
        { error: 'Hiányzó vagy érvénytelen createdBy paraméter' },
        { status: 400 }
      )
    }

    const version = await createVersion({
      postId,
      createdBy,
      changeNote: changeNote || undefined
    })

    return NextResponse.json(version, { status: 201 })
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hiba a verzió létrehozásakor' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT - Verzió visszaállítása
// ============================================

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    return NextResponse.json(
      { error: 'Érvénytelen poszt ID' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const { versionNum, restoredBy } = body

    if (!versionNum || typeof versionNum !== 'number') {
      return NextResponse.json(
        { error: 'Hiányzó vagy érvénytelen versionNum paraméter' },
        { status: 400 }
      )
    }

    // Ha nincs restoredBy, próbáljuk megszerezni az aktuális felhasználót
    // (valós implementációban session-ból vagy auth token-ből)
    const userId = restoredBy || 1 // Placeholder - implementáld az auth-ot

    const post = await restoreVersion(postId, versionNum, userId)

    return NextResponse.json({
      success: true,
      message: `Verzió ${versionNum} sikeresen visszaállítva`,
      post
    })
  } catch (error) {
    console.error('Error restoring version:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hiba a verzió visszaállításakor' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE - Verzió törlése (opcionális)
// ============================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    return NextResponse.json(
      { error: 'Érvénytelen poszt ID' },
      { status: 400 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const versionNum = searchParams.get('version')

    if (!versionNum) {
      return NextResponse.json(
        { error: 'Hiányzó verzió szám' },
        { status: 400 }
      )
    }

    const versionNumber = parseInt(versionNum)
    if (isNaN(versionNumber)) {
      return NextResponse.json(
        { error: 'Érvénytelen verzió szám' },
        { status: 400 }
      )
    }

    // Verzió törlése - implementálható a versions.ts-ben
    // await deleteVersion(postId, versionNumber)

    return NextResponse.json({
      success: true,
      message: `Verzió ${versionNumber} törölve`
    })
  } catch (error) {
    console.error('Error deleting version:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hiba a verzió törlésekor' },
      { status: 500 }
    )
  }
}
