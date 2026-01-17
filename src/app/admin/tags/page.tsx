'use client'

// MATRIX CBS - Címkék kezelő oldal
// Admin felületen címkék kezelése táblázatos nézetben inline szerkesztéssel

import { useState, useEffect } from 'react'
import {
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  Search,
  Tag as TagIcon,
  AlertCircle
} from 'lucide-react'

interface Tag {
  id: number
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', slug: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', slug: '' })

  // Címkék betöltése
  useEffect(() => {
    fetchTags()
  }, [search])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/tags?${params}`)
      if (!res.ok) throw new Error('Hiba a címkék betöltésekor')
      const json = await res.json()
      setTags(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Slug generálás névből
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Ékezetek eltávolítása
      .replace(/[^a-z0-9\s-]/g, '') // Csak betűk, számok, szóközök, kötőjel
      .trim()
      .replace(/\s+/g, '-') // Szóközök -> kötőjel
      .replace(/-+/g, '-') // Többszörös kötőjelek -> egy kötőjel
  }

  // Új címke hozzáadása
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newForm.name.trim()) {
      setError('A név megadása kötelező')
      return
    }

    try {
      const slug = newForm.slug.trim() || generateSlug(newForm.name)
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newForm.name.trim(), slug })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      setNewForm({ name: '', slug: '' })
      setIsAdding(false)
      fetchTags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Szerkesztés indítása
  const startEdit = (tag: Tag) => {
    setEditingId(tag.id)
    setEditForm({ name: tag.name, slug: tag.slug })
  }

  // Szerkesztés mentése
  const saveEdit = async (id: number) => {
    if (!editForm.name.trim()) {
      setError('A név megadása kötelező')
      return
    }

    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          slug: editForm.slug.trim() || generateSlug(editForm.name)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      setEditingId(null)
      fetchTags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Szerkesztés megszakítása
  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', slug: '' })
  }

  // Címke törlése
  const handleDelete = async (id: number, name: string, postCount: number) => {
    const message = postCount > 0
      ? `Biztosan törölni szeretnéd a "${name}" címkét? Ez ${postCount} poszthoz van hozzárendelve.`
      : `Biztosan törölni szeretnéd a "${name}" címkét?`

    if (!confirm(message)) return

    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }
      fetchTags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  return (
    <div className="space-y-6">
      {/* Fejléc */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Címkék</h1>
          <p className="text-gray-600">Blog címkék kezelése</p>
        </div>
      </div>

      {/* Főtartalom */}
      <div className="bg-white rounded-lg shadow">
        {/* Fejléc és keresés */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Címkék kezelése</h2>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Keresés */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Keresés címkékben..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Új címke gomb */}
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Új címke
              </button>
            </div>
          </div>
        </div>

        {/* Hibaüzenet */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Új címke form */}
        {isAdding && (
          <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Név *
                  </label>
                  <input
                    type="text"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    placeholder="pl. Webfejlesztés"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={newForm.slug}
                    onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
                    placeholder="Automatikus, ha üresen hagyod"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mentés
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false)
                    setNewForm({ name: '', slug: '' })
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Mégse
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Táblázat */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : tags.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <TagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Még nincsenek címkék</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              Hozd létre az elsőt
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Név
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posztok száma
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tags.map((tag) => {
                  const isEditing = editingId === tag.id
                  const postCount = tag._count?.posts || 0

                  return (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      {isEditing ? (
                        <>
                          {/* Szerkesztési mód */}
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              autoFocus
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.slug}
                              onChange={(e) =>
                                setEditForm({ ...editForm, slug: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">{postCount}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => saveEdit(tag.id)}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                                title="Mentés"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
                                title="Mégse"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Normál nézet */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <TagIcon className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{tag.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {tag.slug}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {postCount} poszt
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(tag)}
                                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded"
                                title="Szerkesztés"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(tag.id, tag.name, postCount)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Törlés"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Összesítés */}
        {!loading && tags.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
            {tags.length} címke összesen
          </div>
        )}
      </div>
    </div>
  )
}
