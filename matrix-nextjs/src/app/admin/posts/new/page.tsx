'use client'

// MATRIX CBS - Új Blog Poszt Létrehozása
// Admin felület új poszt írásához kategóriákkal, címkékkel és SEO beállításokkal

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from '@/components/admin/PostEditor'
import TagInput from '@/components/admin/TagInput'
import AutosaveIndicator from '@/components/admin/AutosaveIndicator'
import MediaPicker from '@/components/admin/MediaPicker'
import { useAutosave } from '@/hooks/useAutosave'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import { ArrowLeft, Save, Calendar, Eye, FileText, Image as ImageIcon, X } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  // Form állapotok
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [featuredImage, setFeaturedImage] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [status, setStatus] = useState<PostStatus>('DRAFT')
  const [scheduledAt, setScheduledAt] = useState('')
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

  // Autosave hook
  const { isSaving, lastSaved, isDirty, clearDraft } = useAutosave({
    data: {
      title,
      content,
      excerpt
    },
    enabled: true,
    debounceMs: 5000,
    autoSaveIntervalMs: 30000
  })

  // Böngésző bezárás figyelmeztetés
  useBeforeUnload(isDirty)

  // Kategóriák betöltése
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        } else {
          setError('Nem sikerült betölteni a kategóriákat')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Hiba történt a kategóriák betöltése közben')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Automatikus slug generálás a címből
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setSlug(generatedSlug)
    }
  }, [title, slugManuallyEdited])

  // Form validálás
  const validateForm = () => {
    if (!title.trim()) {
      setError('A cím mező kitöltése kötelező')
      return false
    }
    if (!slug.trim()) {
      setError('A slug mező kitöltése kötelező')
      return false
    }
    if (!excerpt.trim()) {
      setError('A kivonat mező kitöltése kötelező')
      return false
    }
    if (!content.trim() || content === '<p></p>') {
      setError('A tartalom mező kitöltése kötelező')
      return false
    }
    if (selectedCategories.length === 0) {
      setError('Legalább egy kategóriát ki kell választani')
      return false
    }
    if (status === 'SCHEDULED' && !scheduledAt) {
      setError('Ütemezett publikálás esetén kötelező megadni a dátumot és időpontot')
      return false
    }
    return true
  }

  // Form beküldése
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        featuredImage: featuredImage.trim() || null,
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
        status,
        scheduledAt: status === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        authorId: 1,
        categoryIds: selectedCategories,
        tagIds: selectedTags.map((tag) => tag.id)
      }

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Nem sikerült létrehozni a posztot')
      }

      // Sikeres létrehozás után töröljük a piszkozatot és átirányítunk
      await clearDraft()
      router.push('/admin/posts')
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Hiba történt a poszt létrehozása közben')
      setLoading(false)
    }
  }

  // Kategória kiválasztás váltás
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Fejléc */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/posts')}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Új Blog Poszt</h1>
          </div>
        </div>

        {/* Hibaüzenet */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alapadatok kártya */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5 text-orange-500" />
              Alapadatok
            </h2>

            <div className="space-y-4">
              {/* Cím */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Cím <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Add meg a poszt címét..."
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setSlugManuallyEdited(true)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                  placeholder="automatikusan-generalva-a-cimbol"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Az URL-ben megjelenő egyedi azonosító. Automatikusan generálódik a címből.
                </p>
              </div>

              {/* Kivonat */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Kivonat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Rövid leírás a posztról (megjelenik a listákban és kereső találatoknál)..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {excerpt.length} / 200 karakter (ajánlott: 120-160)
                </p>
              </div>

              {/* Kiemelt kép */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiemelt kép
                </label>
                {featuredImage ? (
                  <div className="relative inline-block">
                    <img
                      src={featuredImage}
                      alt="Kiemelt kép"
                      className="max-w-xs rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="absolute bottom-2 right-2 px-3 py-1 bg-white/90 text-gray-700 text-sm rounded-lg hover:bg-white transition border border-gray-300"
                    >
                      Csere
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="flex items-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition w-full justify-center text-gray-500 hover:text-orange-600"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span>Kép kiválasztása a médiatárból</span>
                  </button>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Vagy adj meg URL-t közvetlenül:
                </p>
                <input
                  type="url"
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Tartalom szerkesztő */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Tartalom <span className="text-red-500">*</span>
            </h2>
            <PostEditor content={content} onChange={setContent} />
          </div>

          {/* Kategóriák és címkék */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Kategóriák és Címkék</h2>

            <div className="space-y-4">
              {/* Kategóriák */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategóriák <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    Kategóriák betöltése...
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-500">Még nincsenek kategóriák.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition ${
                          selectedCategories.includes(category.id)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Címkék */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Címkék
                </label>
                <TagInput selectedTags={selectedTags} onChange={setSelectedTags} />
                <p className="mt-1 text-xs text-gray-500">
                  Kezdj el gépelni címkék kereséséhez vagy új címke létrehozásához. Enter-rel adhatsz hozzá.
                </p>
              </div>
            </div>
          </div>

          {/* SEO beállítások */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <Eye className="w-5 h-5 text-orange-500" />
              SEO Beállítások
            </h2>

            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Cím
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ha üres, az alap cím kerül használatra"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {metaTitle.length} / 60 karakter (ajánlott: 50-60)
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Leírás
                </label>
                <textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Ha üres, a kivonat kerül használatra"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {metaDescription.length} / 160 karakter (ajánlott: 150-160)
                </p>
              </div>

              {/* SEO Előnézet */}
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Keresőben megjelenő előnézet:</p>
                <div className="space-y-1">
                  <h3 className="text-blue-700 text-lg font-medium">
                    {metaTitle || title || 'Poszt címe'}
                  </h3>
                  <p className="text-green-700 text-xs">
                    matrixcbs.com › blog › {slug || 'poszt-slug'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {metaDescription || excerpt || 'Poszt leírása jelenik meg itt...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Publikálási beállítások */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5 text-orange-500" />
              Publikálás
            </h2>

            <div className="space-y-4">
              {/* Státusz */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Státusz <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition ${
                      status === 'DRAFT'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="DRAFT"
                      checked={status === 'DRAFT'}
                      onChange={(e) => setStatus(e.target.value as PostStatus)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="font-medium text-gray-700">Piszkozat</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition ${
                      status === 'SCHEDULED'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="SCHEDULED"
                      checked={status === 'SCHEDULED'}
                      onChange={(e) => setStatus(e.target.value as PostStatus)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="font-medium text-gray-700">Ütemezett</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition ${
                      status === 'PUBLISHED'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="PUBLISHED"
                      checked={status === 'PUBLISHED'}
                      onChange={(e) => setStatus(e.target.value as PostStatus)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="font-medium text-gray-700">Publikálva</span>
                  </label>
                </div>
              </div>

              {/* Ütemezett dátum (csak ha SCHEDULED) */}
              {status === 'SCHEDULED' && (
                <div>
                  <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-1">
                    Publikálás időpontja <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledAt"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required={status === 'SCHEDULED'}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    A poszt automatikusan publikálásra kerül ezen a dátumon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Akció gombok */}
          <div className="flex items-center justify-between gap-4 bg-white rounded-lg shadow-sm p-6">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Mégse
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mentés folyamatban...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Poszt mentése
                </>
              )}
            </button>
          </div>
        </form>

        {/* Autosave indikátor */}
        <AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} isDirty={isDirty} />

        {/* Media Picker Modal */}
        <MediaPicker
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(media) => {
            setFeaturedImage(media.path)
            setIsMediaPickerOpen(false)
          }}
          mimeType="image"
        />
      </div>
    </div>
  )
}
