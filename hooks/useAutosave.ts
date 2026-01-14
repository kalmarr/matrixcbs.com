'use client'

// MATRIX CBS - Autosave Hook
// Automatikus mentés piszkozatba debounce-szal

import { useState, useEffect, useRef, useCallback } from 'react'

export interface AutosaveData {
  title: string
  content: string
  excerpt: string
  postId?: string
}

export interface AutosaveResult {
  isSaving: boolean
  lastSaved: Date | null
  isDirty: boolean
  saveDraft: () => Promise<void>
  clearDraft: () => Promise<void>
}

interface UseAutosaveOptions {
  data: AutosaveData
  enabled?: boolean
  debounceMs?: number
  autoSaveIntervalMs?: number
}

export function useAutosave({
  data,
  enabled = true,
  debounceMs = 5000,
  autoSaveIntervalMs = 30000
}: UseAutosaveOptions): AutosaveResult {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastDataRef = useRef<string>('')
  const isMountedRef = useRef(true)

  // Mentés API hívás
  const saveDraft = useCallback(async () => {
    if (!enabled || isSaving) return

    try {
      setIsSaving(true)

      const payload = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        postId: data.postId || undefined
      }

      const response = await fetch('/api/admin/posts/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Nem sikerült menteni a piszkozatot')
      }

      if (isMountedRef.current) {
        setLastSaved(new Date())
        setIsDirty(false)
        lastDataRef.current = JSON.stringify(data)
      }
    } catch (error) {
      console.error('Autosave error:', error)
      // Ne zavarjuk a felhasználót hibaüzenettel, csak logoljuk
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false)
      }
    }
  }, [data, enabled, isSaving])

  // Piszkozat törlése
  const clearDraft = useCallback(async () => {
    try {
      const url = data.postId
        ? `/api/admin/posts/draft?postId=${data.postId}`
        : '/api/admin/posts/draft'

      await fetch(url, {
        method: 'DELETE'
      })

      if (isMountedRef.current) {
        setLastSaved(null)
        setIsDirty(false)
        lastDataRef.current = ''
      }
    } catch (error) {
      console.error('Clear draft error:', error)
    }
  }, [data.postId])

  // Adat változás figyelése
  useEffect(() => {
    if (!enabled) return

    const currentData = JSON.stringify({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt
    })

    // Ha változott az adat
    if (currentData !== lastDataRef.current && lastDataRef.current !== '') {
      setIsDirty(true)

      // Debounced mentés (változás után 5 másodperc)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        saveDraft()
      }, debounceMs)
    }

    // Első betöltéskor eltároljuk az adatot
    if (lastDataRef.current === '') {
      lastDataRef.current = currentData
    }
  }, [data, enabled, debounceMs, saveDraft])

  // Periodikus automatikus mentés (30 másodpercenként)
  useEffect(() => {
    if (!enabled) return

    autoSaveTimerRef.current = setInterval(() => {
      if (isDirty) {
        saveDraft()
      }
    }, autoSaveIntervalMs)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [enabled, isDirty, autoSaveIntervalMs, saveDraft])

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [])

  return {
    isSaving,
    lastSaved,
    isDirty,
    saveDraft,
    clearDraft
  }
}
