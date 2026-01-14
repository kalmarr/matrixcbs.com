// MATRIX CBS - Media Gallery Component
// Displays media files in a grid with actions

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Copy, Check } from 'lucide-react'

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
  onDelete?: (id: number) => void
  onSelect?: (media: MediaFile) => void
  selectable?: boolean
}

export default function MediaGallery({
  media,
  onDelete,
  onSelect,
  selectable = false
}: MediaGalleryProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopyUrl = async (media: MediaFile) => {
    const url = `${window.location.origin}/${media.path}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(media.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Még nincsenek feltöltött médiafájlok.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {media.map((item) => (
        <div
          key={item.id}
          className={`group relative bg-white rounded-lg border-2 overflow-hidden transition-all ${
            selectable
              ? 'cursor-pointer hover:border-orange-500 hover:shadow-lg'
              : 'border-gray-200'
          }`}
          onClick={() => selectable && onSelect?.(item)}
        >
          {/* Image Preview */}
          <div className="aspect-square relative bg-gray-100">
            {item.mimeType.startsWith('image/') ? (
              <Image
                src={`/${item.thumbnailPath || item.path}`}
                alt={item.alt || item.originalName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">📄</span>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyUrl(item)
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="URL másolása"
              >
                {copiedId === item.id ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (
                      confirm(
                        `Biztosan törölni szeretnéd a következő fájlt: ${item.originalName}?`
                      )
                    ) {
                      onDelete(item.id)
                    }
                  }}
                  className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                  title="Törlés"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* File Info */}
          <div className="p-2 space-y-1">
            <p className="text-xs font-medium text-gray-900 truncate" title={item.originalName}>
              {item.originalName}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatFileSize(item.size)}</span>
              {item.width && item.height && (
                <span>
                  {item.width}×{item.height}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
