'use client'

// MATRIX CBS - Referencia Kezelő Komponens
// Admin felületen referenciák CRUD műveletek

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, GripVertical, X, Check, Star, Globe, Eye, EyeOff } from 'lucide-react'

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

interface ReferenceFormData {
  companyName: string
  contactName: string
  contactRole: string
  testimonial: string
  logoPath: string
  websiteUrl: string
  featured: boolean
  sortOrder: number
  isActive: boolean
}

export default function ReferenceManager() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<ReferenceFormData>({
    companyName: '',
    contactName: '',
    contactRole: '',
    testimonial: '',
    logoPath: '',
    websiteUrl: '',
    featured: false,
    sortOrder: 0,
    isActive: true
  })

  // Referenciák betöltése
  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/references')
      if (!res.ok) throw new Error('Hiba a referenciák betöltésekor')
      const data = await res.json()
      setReferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Referencia mentése
  const handleSave = async () => {
    try {
      // Validáció
      if (!formData.companyName.trim() || !formData.testimonial.trim()) {
        setError('A cégnév és a vélemény megadása kötelező')
        return
      }

      const url = editingId
        ? `/api/admin/references/${editingId}`
        : '/api/admin/references'

      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contactName: formData.contactName || null,
          contactRole: formData.contactRole || null,
          logoPath: formData.logoPath || null,
          websiteUrl: formData.websiteUrl || null
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchReferences()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Referencia törlése
  const handleDelete = async (id: number) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a referenciát?')) return

    try {
      const res = await fetch(`/api/admin/references/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchReferences()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Aktív/Inaktív váltás
  const toggleActive = async (reference: Reference) => {
    try {
      const res = await fetch(`/api/admin/references/${reference.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reference,
          isActive: !reference.isActive
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchReferences()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Kiemelt váltás
  const toggleFeatured = async (reference: Reference) => {
    try {
      const res = await fetch(`/api/admin/references/${reference.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reference,
          featured: !reference.featured
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchReferences()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Szerkesztés indítása
  const startEdit = (reference: Reference) => {
    setEditingId(reference.id)
    setFormData({
      companyName: reference.companyName,
      contactName: reference.contactName || '',
      contactRole: reference.contactRole || '',
      testimonial: reference.testimonial,
      logoPath: reference.logoPath || '',
      websiteUrl: reference.websiteUrl || '',
      featured: reference.featured,
      sortOrder: reference.sortOrder,
      isActive: reference.isActive
    })
    setShowForm(true)
  }

  // Űrlap visszaállítása
  const resetForm = () => {
    setEditingId(null)
    setShowForm(false)
    setFormData({
      companyName: '',
      contactName: '',
      contactRole: '',
      testimonial: '',
      logoPath: '',
      websiteUrl: '',
      featured: false,
      sortOrder: 0,
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
        <h2 className="text-lg font-semibold text-gray-900">Referenciák</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Új referencia
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cégnév <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Cég neve"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weboldal URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapcsolattartó neve
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Kovács János"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapcsolattartó beosztása
              </label>
              <input
                type="text"
                value={formData.contactRole}
                onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ügyvezető igazgató"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vélemény <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Az ügyfél véleménye a szolgáltatásról..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo elérési útvonal
              </label>
              <input
                type="text"
                value={formData.logoPath}
                onChange={(e) => setFormData({ ...formData, logoPath: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="/images/logos/company.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sorrend
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Kiemelt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Aktív</span>
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

      {/* Referencia lista */}
      <div className="divide-y divide-gray-200">
        {references.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            Még nincsenek referenciák
          </div>
        ) : (
          references.map((reference) => (
            <div
              key={reference.id}
              className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 ${
                !reference.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-gray-900">{reference.companyName}</div>
                    {reference.featured && (
                      <Star className="w-4 h-4 text-orange-500 fill-current" />
                    )}
                    {reference.websiteUrl && (
                      <Globe className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-1">
                    {reference.testimonial}
                  </div>
                  {reference.contactName && (
                    <div className="text-sm text-gray-500 mt-1">
                      {reference.contactName}
                      {reference.contactRole && ` - ${reference.contactRole}`}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(reference)}
                  className={`p-2 transition ${
                    reference.isActive
                      ? 'text-green-500 hover:text-green-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={reference.isActive ? 'Aktív' : 'Inaktív'}
                >
                  {reference.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => toggleFeatured(reference)}
                  className={`p-2 transition ${
                    reference.featured
                      ? 'text-orange-500 hover:text-orange-600'
                      : 'text-gray-400 hover:text-orange-500'
                  }`}
                  title={reference.featured ? 'Kiemelt' : 'Nem kiemelt'}
                >
                  <Star className={`w-4 h-4 ${reference.featured ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => startEdit(reference)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(reference.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
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
