'use client'

// MATRIX CBS - Kategória Kezelő Komponens
// Admin felületen kategóriák CRUD műveletek

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, GripVertical, X, Check } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  sortOrder: number
  _count?: {
    posts: number
  }
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  color: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6'
  })

  // Kategóriák betöltése
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/categories')
      if (!res.ok) throw new Error('Hiba a kategóriák betöltésekor')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Slug generálás névből
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Ékezetek eltávolítása
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Űrlap kezelése
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  // Kategória mentése
  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories'

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

      await fetchCategories()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Kategória törlése
  const handleDelete = async (id: number) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Szerkesztés indítása
  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#3B82F6'
    })
    setShowForm(true)
  }

  // Űrlap visszaállítása
  const resetForm = () => {
    setEditingId(null)
    setShowForm(false)
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3B82F6'
    })
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
        <h2 className="text-lg font-semibold text-gray-900">Kategóriák</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Új kategória
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
                Név
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Kategória neve"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="kategoria-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leírás
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Rövid leírás"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Szín
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="#3B82F6"
                />
              </div>
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

      {/* Kategória lista */}
      <div className="divide-y divide-gray-200">
        {categories.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            Még nincsenek kategóriák
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color || '#gray' }}
                />
                <div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500">
                    /{category.slug} • {category._count?.posts || 0} poszt
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(category)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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
