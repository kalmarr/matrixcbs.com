'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Eye, Copy, Check, X } from 'lucide-react'

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

interface MediaGalleryProps {
  media: MediaFile[]
  onDelete: (id: number) => void
  onSelect?: (file: MediaFile) => void
  selectable?: boolean
  selectedIds?: number[]
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function MediaGallery({
  media,
  onDelete,
  onSelect,
  selectable = false,
  selectedIds = []
}: MediaGalleryProps) {
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopyUrl = async (file: MediaFile) => {
    try {
      await navigator.clipboard.writeText(file.path)
      setCopiedId(file.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      onDelete(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      // Reset after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nincs feltöltött fájl
        </h3>
        <p className="text-gray-500">Töltsd fel az első fájlt a fenti gombbal.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((file) => {
          const isSelected = selectedIds.includes(file.id)
          const isImage = file.mimeType.startsWith('image/')

          return (
            <div
              key={file.id}
              className={`group relative rounded-lg border-2 transition-all overflow-hidden ${
                isSelected
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-gray-200 hover:border-gray-300'
              } ${selectable ? 'cursor-pointer' : ''}`}
              onClick={() => selectable && onSelect?.(file)}
            >
              {/* Thumbnail */}
              <div className="aspect-square relative bg-gray-100">
                {isImage ? (
                  <Image
                    src={`/${file.thumbnailPath || file.path}`}
                    alt={file.alt || file.originalName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Selection indicator */}
                {selectable && isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewFile(file)
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                    title="Előnézet"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyUrl(file)
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                    title="URL másolás"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(file.id)
                    }}
                    className={`p-2 rounded-full transition-colors text-white ${
                      deleteConfirm === file.id
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white/20 hover:bg-red-500'
                    }`}
                    title={deleteConfirm === file.id ? 'Kattints újra a törléshez' : 'Törlés'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* File info */}
              <div className="p-2 bg-white">
                <p
                  className="text-xs font-medium text-gray-700 truncate"
                  title={file.originalName}
                >
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setPreviewFile(null)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            {previewFile.mimeType.startsWith('image/') && (
              <div className="relative">
                <img
                  src={`/${previewFile.path}`}
                  alt={previewFile.alt || previewFile.originalName}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            )}

            {/* File details */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">
                {previewFile.originalName}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Méret:</span>{' '}
                  <span className="text-gray-700">{formatFileSize(previewFile.size)}</span>
                </div>
                {previewFile.width && previewFile.height && (
                  <div>
                    <span className="text-gray-500">Felbontás:</span>{' '}
                    <span className="text-gray-700">
                      {previewFile.width} × {previewFile.height}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Típus:</span>{' '}
                  <span className="text-gray-700">{previewFile.mimeType}</span>
                </div>
                <div>
                  <span className="text-gray-500">Feltöltve:</span>{' '}
                  <span className="text-gray-700">{formatDate(previewFile.createdAt)}</span>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm text-gray-500 mb-1">URL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={previewFile.path}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(previewFile)}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    {copiedId === previewFile.id ? 'Másolva!' : 'Másolás'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
