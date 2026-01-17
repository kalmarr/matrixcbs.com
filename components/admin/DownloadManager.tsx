'use client'

// MATRIX CBS - Letöltések Kezelő Komponens
// Admin felületen dokumentumok CRUD műveletek

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, FileText, Download, Eye, EyeOff, X, Check } from 'lucide-react'

interface Download {
  id: number
  title: string
  description: string | null
  filePath: string
  fileName: string
  fileSize: number
  downloadCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface DownloadFormData {
  title: string
  description: string
  filePath: string
  fileName: string
  fileSize: number
  isActive: boolean
}

// Fájlméret formázása
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
}

// Dátum formázása
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function DownloadManager() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<DownloadFormData>({
    title: '',
    description: '',
    filePath: '',
    fileName: '',
    fileSize: 0,
    isActive: true
  })

  // Dokumentumok betöltése
  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/downloads')
      if (!res.ok) throw new Error('Hiba a dokumentumok betöltésekor')
      const data = await res.json()
      setDownloads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Fájl feltöltés kezelése
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Fájlméret ellenőrzés (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('A fájl mérete maximum 100 MB lehet')
      return
    }

    // Itt egy egyszerű példa: a fájlnevet és méretet tároljuk
    // Valós implementációban fel kell tölteni a fájlt a szerverre
    setFormData({
      ...formData,
      fileName: file.name,
      fileSize: file.size,
      filePath: `/downloads/${file.name}` // Példa útvonal
    })

    setError('Megjegyzés: A fájl feltöltési funkcionalitást implementálni kell!')
  }

  // Dokumentum mentése
  const handleSave = async () => {
    try {
      // Validáció
      if (!formData.title || !formData.fileName || !formData.filePath) {
        setError('A cím, fájlnév és elérési út megadása kötelező')
        return
      }

      const url = editingId
        ? `/api/admin/downloads/${editingId}`
        : '/api/admin/downloads'

      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchDownloads()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Dokumentum törlése
  const handleDelete = async (id: number) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a dokumentumot?')) return

    try {
      const res = await fetch(`/api/admin/downloads/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchDownloads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Aktív/inaktív váltás
  const toggleActive = async (download: Download) => {
    try {
      const res = await fetch(`/api/admin/downloads/${download.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...download,
          isActive: !download.isActive
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchDownloads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Szerkesztés indítása
  const startEdit = (download: Download) => {
    setEditingId(download.id)
    setFormData({
      title: download.title,
      description: download.description || '',
      filePath: download.filePath,
      fileName: download.fileName,
      fileSize: download.fileSize,
      isActive: download.isActive
    })
    setShowForm(true)
  }

  // Űrlap visszaállítása
  const resetForm = () => {
    setEditingId(null)
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      filePath: '',
      fileName: '',
      fileSize: 0,
      isActive: true
    })
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Fejléc */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Letölthető dokumentumok</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Új dokumentum
        </button>
      </div>

      {/* Hibaüzenet */}
      {error && (
        <div className="px-6 py-3 bg-red-50 text-red-700 border-b border-red-100">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Bezár
          </button>
        </div>
      )}

      {/* Új/Szerkesztés űrlap */}
      {showForm && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cím *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Dokumentum címe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leírás
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Rövid leírás a dokumentumról"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fájl feltöltése
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {formData.fileName && (
                <p className="mt-1 text-sm text-gray-600">
                  Kiválasztva: {formData.fileName} ({formatFileSize(formData.fileSize)})
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fájl elérési út *
                </label>
                <input
                  type="text"
                  value={formData.filePath}
                  onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="/downloads/file.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fájlnév *
                </label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="dokumentum.pdf"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Aktív (publikusan elérhető)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <X className="w-4 h-4 inline mr-1" />
              Mégse
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <Check className="w-4 h-4 inline mr-1" />
              {editingId ? 'Mentés' : 'Létrehozás'}
            </button>
          </div>
        </div>
      )}

      {/* Dokumentumok listája */}
      <div className="divide-y divide-gray-200">
        {downloads.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            Még nincsenek dokumentumok
          </div>
        ) : (
          downloads.map((download) => (
            <div
              key={download.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">{download.title}</div>
                    {!download.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                        Inaktív
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                    <span>{download.fileName}</span>
                    <span>•</span>
                    <span>{formatFileSize(download.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {download.downloadCount}
                    </span>
                    <span>•</span>
                    <span>{formatDate(download.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(download)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition"
                  title={download.isActive ? 'Inaktiválás' : 'Aktiválás'}
                >
                  {download.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(download)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition"
                  title="Szerkesztés"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(download.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  title="Törlés"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
