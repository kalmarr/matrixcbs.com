'use client'

// MATRIX CBS - Autosave Indicator Component
// Állapot jelző az automatikus mentéshez

import { Cloud, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { hu } from 'date-fns/locale'

interface AutosaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  isDirty: boolean
}

export default function AutosaveIndicator({
  isSaving,
  lastSaved,
  isDirty
}: AutosaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('')

  // Frissítjük az időt minden 10 másodpercben
  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      setTimeAgo(
        formatDistanceToNow(lastSaved, {
          addSuffix: true,
          locale: hu
        })
      )
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000) // 10 másodpercenként

    return () => clearInterval(interval)
  }, [lastSaved])

  // Mentés folyamatban
  if (isSaving) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg shadow-lg border border-orange-200 z-50">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
        <span className="text-sm font-medium">Mentés...</span>
      </div>
    )
  }

  // Nem mentett változások
  if (isDirty) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg shadow-lg border border-yellow-200 z-50">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Nem mentett változások</span>
      </div>
    )
  }

  // Sikeres mentés
  if (lastSaved) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg shadow-lg border border-green-200 z-50">
        <Cloud className="w-4 h-4" />
        <span className="text-sm font-medium">Elmentve: {timeAgo}</span>
      </div>
    )
  }

  // Alapértelmezett (nincs mentés még)
  return null
}
