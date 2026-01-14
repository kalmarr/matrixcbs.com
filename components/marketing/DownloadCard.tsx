'use client'

// MATRIX CBS - Letölthető dokumentum kártya komponens
// Publikus oldalon megjelenő dokumentum kártya

import { Download as DownloadIcon, FileText } from 'lucide-react'

interface Download {
  id: number
  title: string
  description: string | null
  fileName: string
  fileSize: number
  downloadCount: number
}

interface DownloadCardProps {
  download: Download
}

// Fájlméret formázása (bytes -> KB/MB)
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
}

export default function DownloadCard({ download }: DownloadCardProps) {
  const handleDownload = () => {
    window.location.href = `/api/download/${download.id}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Ikon és cím */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {download.title}
            </h3>
            <p className="text-sm text-gray-500">{download.fileName}</p>
          </div>
        </div>

        {/* Leírás */}
        {download.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {download.description}
          </p>
        )}

        {/* Információk és letöltés gomb */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatFileSize(download.fileSize)}</span>
            <span className="flex items-center gap-1">
              <DownloadIcon className="w-4 h-4" />
              {download.downloadCount} letöltés
            </span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <DownloadIcon className="w-4 h-4" />
            Letöltés
          </button>
        </div>
      </div>
    </div>
  )
}
