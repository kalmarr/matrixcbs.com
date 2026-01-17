'use client'

// MATRIX CBS - Poszt Szerkesztő Oldal
// Meglévő posztok szerkesztése verziókezeléssel

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import PostEditor from '@/components/admin/PostEditor'
import TagInput from '@/components/admin/TagInput'
import AutosaveIndicator from '@/components/admin/AutosaveIndicator'
import MediaPicker from '@/components/admin/MediaPicker'
import { useAutosave } from '@/hooks/useAutosave'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import {
  Save,
  ArrowLeft,
  Trash2,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  Search as SearchIcon,
  Calendar,
  Tag as TagIcon,
  FolderOpen,
  History,
  AlertCircle,
  X
} from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  color: string | null
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string | null
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  scheduledAt: string | null
  publishedAt: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  categories: Array<{
    categoryId: number
    category: Category
  }>
  tags: Array<{
    tagId: number
    tag: Tag
  }>
}

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  scheduledAt: string
  categoryIds: number[]
  tags: Tag[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [createVersion, setCreateVersion] = useState(false)
  const [changeNote, setChangeNote] = useState('')
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    status: 'DRAFT',
    scheduledAt: '',
    categoryIds: [],
    tags: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })

  // Autosave hook
  const { isSaving: isSavingDraft, lastSaved, isDirty, clearDraft } = useAutosave({
    data: {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      postId: postId
    },
    enabled: true,
    debounceMs: 5000,
    autoSaveIntervalMs: 30000
  })

  // Böngésző bezárás figyelmeztetés
  useBeforeUnload(isDirty)

  // Poszt és kategóriák betöltése
  useEffect(() => {
    if (!postId) return

    const loadData = async () => {
      try {
        setLoading(true)

        // Poszt betöltése
        const postRes = await fetch(`/api/admin/posts/${postId}`)
        if (!postRes.ok) {
          throw new Error('Hiba a poszt betöltésekor')
        }
        const post: Post = await postRes.json()

        // Kategóriák betöltése
        const categoriesRes = await fetch('/api/admin/categories')
        if (!categoriesRes.ok) {
          throw new Error('Hiba a kategóriák betöltésekor')
        }
        const categoriesData: Category[] = await categoriesRes.json()
        setCategories(categoriesData)

        // Form kitöltése a poszt adataival
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage || '',
          status: post.status,
          scheduledAt: post.scheduledAt
            ? new Date(post.scheduledAt).toISOString().slice(0, 16)
            : '',
          categoryIds: post.categories.map((c) => c.categoryId),
          tags: post.tags.map((t) => t.tag),
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          seoKeywords: post.seoKeywords || ''
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [postId])

  // Slug generálás címből
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Cím módosítás
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  // Kategória toggle
  const toggleCategory = (categoryId: number) => {
    const isSelected = formData.categoryIds.includes(categoryId)
    setFormData({
      ...formData,
      categoryIds: isSelected
        ? formData.categoryIds.filter((id) => id !== categoryId)
        : [...formData.categoryIds, categoryId]
    })
  }

  // Poszt mentése
  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Validáció
      if (!formData.title.trim()) {
        throw new Error('A cím megadása kötelező')
      }
      if (!formData.slug.trim()) {
        throw new Error('A slug megadása kötelező')
      }
      if (!formData.content.trim()) {
        throw new Error('A tartalom megadása kötelező')
      }
      if (formData.categoryIds.length === 0) {
        throw new Error('Legalább egy kategória kiválasztása kötelező')
      }

      // API hívás
      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage || null,
        status: formData.status,
        scheduledAt:
          formData.status === 'SCHEDULED' && formData.scheduledAt
            ? new Date(formData.scheduledAt).toISOString()
            : null,
        categoryIds: formData.categoryIds,
        tagIds: formData.tags.map((t) => t.id),
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
        seoKeywords: formData.seoKeywords || null
      }

      // Verziókezelés
      if (createVersion) {
        payload.createVersion = true
        payload.changeNote = changeNote.trim() || undefined
      }

      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt a mentés során')
      }

      setSuccess('Poszt mentve!')
      setCreateVersion(false)
      setChangeNote('')

      // Töröljük a piszkozatot sikeres mentés után
      await clearDraft()

      // Sikeres mentés után frissítjük az adatokat
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt')
    } finally {
      setSaving(false)
    }
  }

  // Poszt törlése
  const handleDelete = async () => {
    if (
      !confirm(
        'Biztosan törölni szeretnéd ezt a posztot? Ez a művelet nem vonható vissza!'
      )
    ) {
      return
    }

    try {
      setDeleting(true)
      setError(null)

      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt a törlés során')
      }

      // Sikeres törlés után átirányítás
      router.push('/admin/posts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt')
      setDeleting(false)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Fejléc */}
      <div className="mb-6">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Vissza a posztokhoz
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Poszt szerkesztése</h1>
      </div>

      {/* Hibaüzenet */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline mt-1"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}

      {/* Sikeres mentés üzenet */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fő tartalom */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cím és slug */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Cím *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Poszt címe"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <SearchIcon className="w-4 h-4" />
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                placeholder="poszt-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /blog/{formData.slug || 'poszt-slug'}
              </p>
            </div>
          </div>

          {/* Kivonat */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kivonat (excerpt)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Rövid kivonat a posztról..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Megjelenik a blog listában és megosztáskor
            </p>
          </div>

          {/* Tartalom szerkesztő */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tartalom *
            </label>
            <PostEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* SEO Mezők */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <SearchIcon className="w-5 h-5" />
              SEO Beállítások
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Cím
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ha üres, a poszt címe lesz használva"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seoTitle.length}/60 karakter (ideális: 50-60)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Leírás
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Meta description a keresőknek"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seoDescription.length}/160 karakter (ideális: 150-160)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kulcsszavak
              </label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) =>
                  setFormData({ ...formData, seoKeywords: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="kulcsszó1, kulcsszó2, kulcsszó3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vesszővel elválasztva
              </p>
            </div>
          </div>
        </div>

        {/* Oldalsáv */}
        <div className="space-y-6">
          {/* Publikálás */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Publikálás</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Státusz
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as FormData['status']
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="DRAFT">Piszkozat</option>
                <option value="SCHEDULED">Ütemezett</option>
                <option value="PUBLISHED">Publikált</option>
                <option value="ARCHIVED">Archivált</option>
              </select>
            </div>

            {formData.status === 'SCHEDULED' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Ütemezés időpontja
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledAt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Verziókezelés */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <input
                  type="checkbox"
                  checked={createVersion}
                  onChange={(e) => setCreateVersion(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <History className="w-4 h-4" />
                Verzió létrehozása
              </label>
              {createVersion && (
                <textarea
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  rows={2}
                  className="w-full mt-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Változtatás megjegyzése (opcionális)"
                />
              )}
            </div>

            {/* Mentés gombok */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Mentés...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Mentés
                  </>
                )}
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Törlés...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Törlés
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kiemelt kép */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Kiemelt kép
            </h3>
            {formData.featuredImage ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.featuredImage.startsWith('/') ? formData.featuredImage : `/${formData.featuredImage}`}
                  alt="Kiemelt kép"
                  className="w-full aspect-video object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3 py-1 bg-white/90 text-gray-700 text-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                  >
                    Csere
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featuredImage: '' })}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="w-full flex flex-col items-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-gray-500 hover:text-orange-600"
              >
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm font-medium">Kép kiválasztása a médiatárból</span>
              </button>
            )}
          </div>

          {/* Kategóriák */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Kategóriák *
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color || '#6B7280' }}
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500">
                Még nincsenek kategóriák.{' '}
                <Link
                  href="/admin/categories"
                  className="text-orange-500 hover:underline"
                >
                  Hozz létre egyet
                </Link>
              </p>
            )}
          </div>

          {/* Címkék */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Címkék
            </h3>
            <TagInput
              selectedTags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
        </div>

        {/* Autosave indikátor */}
        <AutosaveIndicator isSaving={isSavingDraft} lastSaved={lastSaved} isDirty={isDirty} />
      </div>

      {/* MediaPicker Modal */}
      <MediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => {
          setFormData({ ...formData, featuredImage: media.path })
          setIsMediaPickerOpen(false)
        }}
        mimeType="image"
      />
    </div>
  )
}
