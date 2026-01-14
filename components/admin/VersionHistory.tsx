'use client'

// MATRIX CBS - Verziókezelés UI komponens
// Poszt verzióinak listázása, előnézete és visszaállítása

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

// ============================================
// TÍPUSOK
// ============================================

interface PostVersion {
  id: number
  postId: number
  title: string
  content: string
  excerpt: string | null
  versionNum: number
  changeNote: string | null
  createdAt: string
  createdBy: number
  createdByName?: string
}

interface VersionDiff {
  field: string
  label: string
  oldValue: string | null
  newValue: string | null
  changed: boolean
}

interface VersionHistoryProps {
  postId: number
  onRestore?: () => void
}

// ============================================
// KOMPONENS
// ============================================

export default function VersionHistory({ postId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<PostVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<PostVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<PostVersion | null>(null)
  const [diffs, setDiffs] = useState<VersionDiff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [comparing, setComparing] = useState(false)

  // ============================================
  // ADATOK BETÖLTÉSE
  // ============================================

  useEffect(() => {
    loadVersions()
  }, [postId])

  const loadVersions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/posts/${postId}/versions`)
      if (!response.ok) throw new Error('Hiba a verziók betöltésekor')
      const data = await response.json()
      setVersions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // VERZIÓ VISSZAÁLLÍTÁSA
  // ============================================

  const handleRestore = async (versionNum: number) => {
    if (!confirm(`Biztosan visszaállítja a ${versionNum}. verziót?\n\nA jelenlegi állapot biztonsági mentésre kerül.`)) {
      return
    }

    setRestoring(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/posts/${postId}/versions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionNum })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Hiba a visszaállításkor')
      }

      alert(`A ${versionNum}. verzió sikeresen visszaállítva!`)
      await loadVersions()
      setSelectedVersion(null)
      onRestore?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setRestoring(false)
    }
  }

  // ============================================
  // ÖSSZEHASONLÍTÁS
  // ============================================

  const handleCompareWithCurrent = async (version: PostVersion) => {
    setComparing(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/admin/posts/${postId}/versions?compare=${version.versionNum}`
      )
      if (!response.ok) throw new Error('Hiba az összehasonlításkor')
      const data = await response.json()
      setDiffs(data.diffs)
      setCompareVersion(version)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setComparing(false)
    }
  }

  // ============================================
  // TARTALOM ELŐNÉZET (biztonságos, csak szöveg)
  // ============================================

  const getContentPreview = (content: string, maxLength = 500): string => {
    // HTML tagek eltávolítása
    const strippedContent = content.replace(/<[^>]*>/g, ' ')
    // Többszörös szóközök eltávolítása
    const cleanContent = strippedContent.replace(/\s+/g, ' ').trim()
    // Vágás
    return cleanContent.length > maxLength
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent
  }

  // ============================================
  // RENDERELÉS
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Verziók betöltése...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Hiba</p>
        <p>{error}</p>
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">Még nincsenek mentett verziók</p>
        <p className="text-sm mt-2">A verziók automatikusan mentésre kerülnek a poszt módosításakor</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* VERZIÓ LISTA */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Verzióelőzmények ({versions.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                selectedVersion?.id === version.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      v{version.versionNum}
                    </span>
                    <span className="text-sm text-gray-600">
                      {format(new Date(version.createdAt), 'yyyy. MMMM d. HH:mm', { locale: hu })}
                    </span>
                    <span className="text-sm text-gray-500">
                      {version.createdByName || 'Ismeretlen'}
                    </span>
                  </div>

                  {version.changeNote && (
                    <p className="mt-1 text-sm text-gray-700">
                      {version.changeNote}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                    {version.title}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setSelectedVersion(
                      selectedVersion?.id === version.id ? null : version
                    )}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  >
                    {selectedVersion?.id === version.id ? 'Bezárás' : 'Előnézet'}
                  </button>

                  <button
                    onClick={() => handleCompareWithCurrent(version)}
                    disabled={comparing}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  >
                    Összehasonlítás
                  </button>

                  <button
                    onClick={() => handleRestore(version.versionNum)}
                    disabled={restoring}
                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
                  >
                    Visszaállítás
                  </button>
                </div>
              </div>

              {/* ELŐNÉZET */}
              {selectedVersion?.id === version.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Előnézet</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Cím</label>
                      <p className="text-sm text-gray-900 mt-1">{version.title}</p>
                    </div>

                    {version.excerpt && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Kivonat</label>
                        <p className="text-sm text-gray-700 mt-1">{version.excerpt}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-gray-600">Tartalom</label>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                        {getContentPreview(version.content)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ÖSSZEHASONLÍTÁS EREDMÉNYE */}
      {compareVersion && diffs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Összehasonlítás: v{compareVersion.versionNum} vs. Jelenlegi
            </h3>
            <button
              onClick={() => {
                setCompareVersion(null)
                setDiffs([])
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {diffs.filter(d => d.changed).map((diff) => (
              <div key={diff.field} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">{diff.label}</h4>
                </div>

                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-4 bg-red-50">
                    <p className="text-xs font-medium text-red-700 mb-2">v{compareVersion.versionNum}</p>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {diff.oldValue || <span className="text-gray-400 italic">Üres</span>}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50">
                    <p className="text-xs font-medium text-green-700 mb-2">Jelenlegi</p>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {diff.newValue || <span className="text-gray-400 italic">Üres</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {diffs.every(d => !d.changed) && (
              <p className="text-center text-gray-500 py-4">
                Nincs különbség a verzió és a jelenlegi állapot között
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
