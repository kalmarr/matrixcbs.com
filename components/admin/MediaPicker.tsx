// MATRIX CBS - Media Picker Component
// Modal dialog for selecting media files

'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Search, Loader2 } from 'lucide-react'
import MediaGallery from './MediaGallery'

interface MediaFile {
  id: number
  filename: string
  originalName: string
  mimeType: string
  size: number
  width: number | null
  height: number | null
  path: string
  thumbnailPath: string | null
  alt: string | null
  caption: string | null
  folder: string | null
  createdAt: string
  uploader: {
    id: number
    name: string
    email: string
  }
}

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaFile) => void
  mimeType?: 'image' | 'all'
}

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  mimeType = 'image'
}: MediaPickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, search, page, mimeType])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '24',
        mimeType: mimeType
      })
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/admin/media?${params}`)
      const data = await response.json()

      if (data.media) {
        setMedia(data.media)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'uploads')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Refresh media list
        await fetchMedia()
        // Reset file input
        e.target.value = ''
      } else {
        alert(data.error || 'Hiba történt a feltöltés során')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Hiba történt a feltöltés során')
    } finally {
      setUploading(false)
    }
  }

  const handleSelect = (selectedMedia: MediaFile) => {
    onSelect(selectedMedia)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Médiatár</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b space-y-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Keresés fájlnév vagy leírás alapján..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Upload Button */}
            <label className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Feltöltés...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Feltöltés
                  </>
                )}
              </button>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <MediaGallery
              media={media}
              onSelect={handleSelect}
              selectable={true}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Előző
              </button>
              <span className="px-4 py-2 text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Következő
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
