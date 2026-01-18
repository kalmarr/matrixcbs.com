// MATRIX CBS - Draft API
// Autosave piszkozat mentés az admin felületen

import { NextRequest, NextResponse } from 'next/server'

// Egyszerű in-memory tárolás a piszkozatokhoz
// Éles környezetben Redis vagy adatbázis ajánlott
const drafts = new Map<string, {
  title: string
  content: string
  excerpt: string
  postId?: string
  updatedAt: Date
}>()

// POST /api/admin/posts/draft - Piszkozat mentése
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, postId } = body

    // Validáció
    if (!title && !content && !excerpt) {
      return NextResponse.json(
        { error: 'Legalább egy mező kitöltése szükséges' },
        { status: 400 }
      )
    }

    // Egyedi kulcs generálása (admin user ID + postId vagy 'new')
    // Éles környezetben a session-ból kell venni az admin user ID-t
    const draftKey = postId || 'new'

    // Piszkozat mentése
    drafts.set(draftKey, {
      title: title || '',
      content: content || '',
      excerpt: excerpt || '',
      postId,
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      savedAt: new Date()
    })
  } catch (error) {
    console.error('Draft save error:', error)
    return NextResponse.json(
      { error: 'Hiba történt a piszkozat mentésekor' },
      { status: 500 }
    )
  }
}

// GET /api/admin/posts/draft - Piszkozat lekérése
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    // Kulcs generálása
    const draftKey = postId || 'new'

    // Piszkozat lekérése
    const draft = drafts.get(draftKey)

    if (!draft) {
      return NextResponse.json(
        { error: 'Nincs mentett piszkozat' },
        { status: 404 }
      )
    }

    return NextResponse.json(draft)
  } catch (error) {
    console.error('Draft fetch error:', error)
    return NextResponse.json(
      { error: 'Hiba történt a piszkozat lekérésekor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/posts/draft - Piszkozat törlése
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    // Kulcs generálása
    const draftKey = postId || 'new'

    // Piszkozat törlése
    const deleted = drafts.delete(draftKey)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Nincs törlendő piszkozat' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Draft delete error:', error)
    return NextResponse.json(
      { error: 'Hiba történt a piszkozat törlésekor' },
      { status: 500 }
    )
  }
}
