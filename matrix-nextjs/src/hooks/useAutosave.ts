'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAutosaveOptions<T> {
  data: T
  enabled?: boolean
  debounceMs?: number
  autoSaveIntervalMs?: number
  storageKey?: string
}

interface UseAutosaveReturn {
  isSaving: boolean
  lastSaved: Date | null
  isDirty: boolean
  clearDraft: () => Promise<void>
  saveDraft: () => Promise<void>
}

export function useAutosave<T>({
  data,
  enabled = true,
  debounceMs = 3000,
  autoSaveIntervalMs = 30000,
  storageKey = 'matrix-cbs-draft'
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const dataRef = useRef(data)
  const initialDataRef = useRef<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Store initial data on first render
  useEffect(() => {
    if (initialDataRef.current === null) {
      initialDataRef.current = JSON.stringify(data)
    }
  }, [data])

  // Check if data has changed from initial state
  useEffect(() => {
    const currentData = JSON.stringify(data)
    const hasChanged = currentData !== initialDataRef.current
    setIsDirty(hasChanged)
  }, [data])

  // Save draft to localStorage
  const saveDraft = useCallback(async () => {
    if (!enabled) return

    setIsSaving(true)
    try {
      const draftData = {
        data: dataRef.current,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(storageKey, JSON.stringify(draftData))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save draft:', error)
    } finally {
      setIsSaving(false)
    }
  }, [enabled, storageKey])

  // Clear draft from localStorage
  const clearDraft = useCallback(async () => {
    try {
      localStorage.removeItem(storageKey)
      setIsDirty(false)
      setLastSaved(null)
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }
  }, [storageKey])

  // Debounced save on data change
  useEffect(() => {
    if (!enabled || !isDirty) return

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      saveDraft()
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [data, enabled, isDirty, debounceMs, saveDraft])

  // Auto-save interval
  useEffect(() => {
    if (!enabled || !isDirty) return

    intervalRef.current = setInterval(() => {
      saveDraft()
    }, autoSaveIntervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, isDirty, autoSaveIntervalMs, saveDraft])

  // Load draft on mount
  useEffect(() => {
    if (!enabled) return

    try {
      const savedDraft = localStorage.getItem(storageKey)
      if (savedDraft) {
        const { savedAt } = JSON.parse(savedDraft)
        if (savedAt) {
          setLastSaved(new Date(savedAt))
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
  }, [enabled, storageKey])

  return {
    isSaving,
    lastSaved,
    isDirty,
    clearDraft,
    saveDraft
  }
}
