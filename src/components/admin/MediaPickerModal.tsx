'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Loader2, Search, Check } from 'lucide-react'
import Image from 'next/image'

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
}

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '48',
        mimeType: 'image'
      })

      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/admin/media?${params}`)
      const data = await response.json()

      if (data.media) {
        setMedia(data.media)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        fetchMedia()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, isOpen])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')

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
      e.target.value = ''
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Hiba történt a feltöltés során')
    } finally {
      setUploading(false)
    }
  }

  const handleSelect = () => {
    if (selectedFile) {
      // Ensure path starts with / for proper URL
      const fullPath = selectedFile.path.startsWith('/') ? selectedFile.path : `/${selectedFile.path}`
      onSelect(fullPath)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Kép kiválasztása</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gray-50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Keresés..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Upload */}
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <span className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors font-medium">
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
            </span>
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nincs találat</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {media.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedFile?.id === file.id
                      ? 'border-orange-500 ring-2 ring-orange-500/20'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={`/${file.thumbnailPath || file.path}`}
                    alt={file.alt || file.originalName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                  />
                  {selectedFile?.id === file.id && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          {selectedFile ? (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-medium">{selectedFile.originalName}</span>
              <span className="text-gray-400">|</span>
              <span>{formatFileSize(selectedFile.size)}</span>
              {selectedFile.width && selectedFile.height && (
                <>
                  <span className="text-gray-400">|</span>
                  <span>
                    {selectedFile.width} × {selectedFile.height}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Válassz ki egy képet</div>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Mégse
            </button>
            <button
              type="button"
              onClick={handleSelect}
              disabled={!selectedFile}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Kiválasztás
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
