'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Star, StarOff, Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import ReferenceForm from './ReferenceForm'

interface Reference {
  id: number
  companyName: string
  contactName: string | null
  contactRole: string | null
  testimonial: string
  logoPath: string | null
  websiteUrl: string | null
  featured: boolean
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ReferenceManager() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      const res = await fetch('/api/admin/references')
      if (res.ok) {
        const data = await res.json()
        setReferences(data)
      } else {
        setError('Nem sikerült betölteni a referenciákat')
      }
    } catch (err) {
      console.error('Error fetching references:', err)
      setError('Hiba történt a referenciák betöltése közben')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingReference(null)
    setShowForm(true)
  }

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }

    try {
      const res = await fetch(`/api/admin/references/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setReferences(references.filter((r) => r.id !== id))
      } else {
        const data = await res.json()
        setError(data.error || 'Hiba történt a törlés során')
      }
    } catch (err) {
      console.error('Error deleting reference:', err)
      setError('Hiba történt a törlés során')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleToggleFeatured = async (reference: Reference) => {
    try {
      const res = await fetch(`/api/admin/references/${reference.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reference, featured: !reference.featured })
      })

      if (res.ok) {
        const updated = await res.json()
        setReferences(references.map((r) => (r.id === updated.id ? updated : r)))
      }
    } catch (err) {
      console.error('Error toggling featured:', err)
    }
  }

  const handleToggleActive = async (reference: Reference) => {
    try {
      const res = await fetch(`/api/admin/references/${reference.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reference, isActive: !reference.isActive })
      })

      if (res.ok) {
        const updated = await res.json()
        setReferences(references.map((r) => (r.id === updated.id ? updated : r)))
      }
    } catch (err) {
      console.error('Error toggling active:', err)
    }
  }

  const handleFormSubmit = async (data: Partial<Reference>) => {
    try {
      let res: Response

      if (editingReference) {
        res = await fetch(`/api/admin/references/${editingReference.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } else {
        res = await fetch('/api/admin/references', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      }

      if (res.ok) {
        const result = await res.json()
        if (editingReference) {
          setReferences(references.map((r) => (r.id === result.id ? result : r)))
        } else {
          setReferences([result, ...references])
        }
        setShowForm(false)
        setEditingReference(null)
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Hiba történt')
      }
    } catch (err) {
      console.error('Error saving reference:', err)
      throw err
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingReference(null)
  }

  // Sanitize HTML for safe rendering
  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    })
  }

  // Strip HTML tags for preview
  const stripHtml = (html: string): string => {
    const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
    return sanitized.substring(0, 150) + (sanitized.length > 150 ? '...' : '')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (showForm) {
    return (
      <ReferenceForm
        reference={editingReference}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {references.length} referencia{references.length !== 1 ? '' : ''}
        </p>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Új referencia
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* References list */}
      {references.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Még nincsenek referenciák
          </h3>
          <p className="text-gray-500 mb-4">
            Adj hozzá ügyfélvéleményeket és referenciákat.
          </p>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Első referencia hozzáadása
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {references.map((reference) => (
            <div
              key={reference.id}
              className={`bg-white rounded-lg border border-gray-200 p-4 ${
                !reference.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {reference.logoPath ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={reference.logoPath}
                        alt={reference.companyName}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {reference.companyName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reference.companyName}
                    </h3>
                    {reference.featured && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        Kiemelt
                      </span>
                    )}
                    {!reference.isActive && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        Inaktív
                      </span>
                    )}
                  </div>

                  {(reference.contactName || reference.contactRole) && (
                    <p className="text-sm text-gray-600 mb-2">
                      {reference.contactName}
                      {reference.contactRole && ` - ${reference.contactRole}`}
                    </p>
                  )}

                  <p className="text-gray-700 text-sm line-clamp-2">
                    {stripHtml(reference.testimonial)}
                  </p>

                  {reference.websiteUrl && (
                    <a
                      href={reference.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:underline mt-2 inline-block"
                    >
                      {reference.websiteUrl}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(reference)}
                    className={`p-2 rounded-lg transition-colors ${
                      reference.featured
                        ? 'text-yellow-500 hover:bg-yellow-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={reference.featured ? 'Kiemelés törlése' : 'Kiemelés'}
                  >
                    {reference.featured ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(reference)}
                    className={`p-2 rounded-lg transition-colors ${
                      reference.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={reference.isActive ? 'Elrejtés' : 'Megjelenítés'}
                  >
                    {reference.isActive ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(reference)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    title="Szerkesztés"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(reference.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === reference.id
                        ? 'bg-red-100 text-red-600'
                        : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title={
                      deleteConfirm === reference.id
                        ? 'Kattints újra a törléshez'
                        : 'Törlés'
                    }
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
