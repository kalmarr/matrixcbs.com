'use client'

import { Cloud, CloudOff, Loader2 } from 'lucide-react'

interface AutosaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  isDirty: boolean
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)

  if (diffSec < 10) {
    return 'most'
  } else if (diffSec < 60) {
    return `${diffSec} másodperce`
  } else if (diffMin < 60) {
    return `${diffMin} perce`
  } else if (diffHour < 24) {
    return `${diffHour} órája`
  } else {
    return date.toLocaleDateString('hu-HU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export default function AutosaveIndicator({
  isSaving,
  lastSaved,
  isDirty
}: AutosaveIndicatorProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-lg border border-gray-200 text-sm">
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
            <span className="text-gray-600">Mentés...</span>
          </>
        ) : isDirty ? (
          <>
            <CloudOff className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Nincs mentve</span>
          </>
        ) : lastSaved ? (
          <>
            <Cloud className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              Mentve {formatTimeAgo(lastSaved)}
            </span>
          </>
        ) : (
          <>
            <Cloud className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Új dokumentum</span>
          </>
        )}
      </div>
    </div>
  )
}
