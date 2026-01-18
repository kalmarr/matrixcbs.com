// MATRIX CBS - Admin Media Library Page
// Main page for managing media files

'use client'

import { useState, useEffect } from 'react'
import { Upload, Search, Loader2, Filter, FolderOpen } from 'lucide-react'
import MediaGallery from '@/components/admin/MediaGallery'

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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [mimeType, setMimeType] = useState<string>('all')
  const [folder, setFolder] = useState<string>('all')
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    fetchMedia()
  }, [search, mimeType, folder, pagination.page])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      })

      if (mimeType !== 'all') {
        params.append('mimeType', mimeType)
      }
      if (folder !== 'all') {
        params.append('folder', folder)
      }
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/admin/media?${params}`)
      const data = await response.json()

      if (data.media) {
        setMedia(data.media)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      // Upload files one by one
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder === 'all' ? 'general' : folder)

        const response = await fetch('/api/admin/media/upload/', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()
        if (!data.success) {
          alert(`Hiba a fájl feltöltésekor: ${file.name}\n${data.error}`)
        }
      }

      // Refresh media list
      await fetchMedia()
      // Reset file input
      e.target.value = ''
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Hiba történt a feltöltés során')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Remove from local state
        setMedia((prev) => prev.filter((m) => m.id !== id))
      } else {
        alert(data.error || 'Hiba történt a törlés során')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Hiba történt a törlés során')
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900">Médiatár</h1>
          <p className="text-gray-600 mt-2">
            Feltöltött képek és fájlok kezelése
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {/* Upload Button */}
          <div className="flex items-center justify-between">
            <label className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Feltöltés folyamatban...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Új fájl feltöltése
                  </>
                )}
              </button>
            </label>

            <div className="text-sm text-gray-500">
              Összesen: {pagination.total} fájl
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPagination((prev) => ({ ...prev, page: 1 }))
                }}
                placeholder="Keresés..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* File Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={mimeType}
                onChange={(e) => {
                  setMimeType(e.target.value)
                  setPagination((prev) => ({ ...prev, page: 1 }))
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Minden fájltípus</option>
                <option value="image">Képek</option>
              </select>
            </div>

            {/* Folder Filter */}
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={folder}
                onChange={(e) => {
                  setFolder(e.target.value)
                  setPagination((prev) => ({ ...prev, page: 1 }))
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Minden mappa</option>
                <option value="general">Általános</option>
                <option value="uploads">Feltöltések</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <MediaGallery media={media} onDelete={handleDelete} />
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Előző
              </button>
              <span className="px-4 py-2 text-gray-700">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
