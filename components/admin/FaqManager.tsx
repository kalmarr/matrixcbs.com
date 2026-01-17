'use client'

// MATRIX CBS - FAQ Kezelő Komponens
// Admin felületen FAQ CRUD műveletek drag-and-drop átrendezéssel

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, GripVertical, X, Check, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'

interface Faq {
  id: number
  question: string
  answer: string
  category: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FaqFormData {
  question: string
  answer: string
  category: string
  isActive: boolean
}

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FaqFormData>({
    question: '',
    answer: '',
    category: 'Általános',
    isActive: true
  })

  // FAQ-k betöltése
  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/faqs?includeInactive=true')
      if (!res.ok) throw new Error('Hiba a FAQ-k betöltésekor')
      const data = await res.json()
      setFaqs(data.faqs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Expand/collapse FAQ
  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Szerkesztés indítása
  const startEdit = (faq: Faq) => {
    setEditingId(faq.id)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'Általános',
      isActive: faq.isActive
    })
    setShowForm(true)
  }

  // Új FAQ hozzáadása
  const startNew = () => {
    setEditingId(null)
    setFormData({
      question: '',
      answer: '',
      category: 'Általános',
      isActive: true
    })
    setShowForm(true)
  }

  // Űrlap visszaállítása
  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      question: '',
      answer: '',
      category: 'Általános',
      isActive: true
    })
  }

  // FAQ mentése
  const handleSave = async () => {
    try {
      if (!formData.question.trim() || !formData.answer.trim()) {
        alert('Kérdés és válasz megadása kötelező!')
        return
      }

      const url = editingId
        ? `/api/admin/faqs/${editingId}`
        : '/api/admin/faqs'

      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sortOrder: editingId
            ? faqs.find(f => f.id === editingId)?.sortOrder || 0
            : Math.max(0, ...faqs.map(f => f.sortOrder)) + 1
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }

      await fetchFaqs()
      resetForm()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hiba történt a mentéskor')
    }
  }

  // FAQ törlése
  const handleDelete = async (id: number) => {
    if (!confirm('Biztosan törli ezt a FAQ-t?')) return

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Hiba a törléskor')

      await fetchFaqs()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hiba történt a törléskor')
    }
  }

  // Aktív/inaktív váltás
  const toggleActive = async (faq: Faq) => {
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          sortOrder: faq.sortOrder,
          isActive: !faq.isActive
        })
      })

      if (!res.ok) throw new Error('Hiba történt')

      await fetchFaqs()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hiba történt')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (id: number) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault()
    if (draggedId === null || draggedId === targetId) return

    const draggedIndex = faqs.findIndex(f => f.id === draggedId)
    const targetIndex = faqs.findIndex(f => f.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newFaqs = [...faqs]
    const [draggedItem] = newFaqs.splice(draggedIndex, 1)
    newFaqs.splice(targetIndex, 0, draggedItem)

    setFaqs(newFaqs)
  }

  const handleDragEnd = async () => {
    if (draggedId === null) return

    // Update sortOrder for all items
    const updates = faqs.map((faq, index) => ({
      id: faq.id,
      sortOrder: index
    }))

    try {
      // Update each FAQ with new sortOrder
      await Promise.all(
        updates.map(({ id, sortOrder }) =>
          fetch(`/api/admin/faqs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...faqs.find(f => f.id === id),
              sortOrder
            })
          })
        )
      )

      await fetchFaqs()
    } catch (err) {
      alert('Hiba történt a sorrend mentésekor')
      await fetchFaqs() // Reload to reset order
    } finally {
      setDraggedId(null)
    }
  }

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(f => f.category || 'Általános'))).sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Összesen {faqs.length} kérdés ({faqs.filter(f => f.isActive).length} aktív)
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Új kérdés hozzáadása
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Kérdés szerkesztése' : 'Új kérdés hozzáadása'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategória
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="pl. Általános, Képzések, Árak"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kérdés <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Mi a kérdés?"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.question.length}/500 karakter
                </p>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Válasz <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="A válasz..."
                  rows={6}
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Aktív (megjelenik a publikus oldalon)
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Mégse
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
              >
                <Check className="w-4 h-4" />
                Mentés
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="bg-white rounded-lg shadow">
        {faqs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Még nincsenek FAQ-k. Kattintson a fenti gombra új hozzáadásához.
          </div>
        ) : (
          <div className="divide-y">
            {faqs.map((faq) => {
              const isExpanded = expandedIds.has(faq.id)

              return (
                <div
                  key={faq.id}
                  draggable
                  onDragStart={() => handleDragStart(faq.id)}
                  onDragOver={(e) => handleDragOver(e, faq.id)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 ${draggedId === faq.id ? 'opacity-50' : ''} ${
                    !faq.isActive ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <button className="text-gray-400 hover:text-gray-600 cursor-move mt-1">
                      <GripVertical className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded">
                              {faq.category || 'Általános'}
                            </span>
                            {!faq.isActive && (
                              <span className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-600 rounded">
                                Inaktív
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleExpand(faq.id)}
                            className="text-left w-full group"
                          >
                            <div className="flex items-start gap-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition flex-1">
                                {faq.question}
                              </h3>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                              {faq.answer}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(faq)}
                            className={`p-2 rounded-lg transition ${
                              faq.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={faq.isActive ? 'Inaktívvá tétel' : 'Aktiválás'}
                          >
                            {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => startEdit(faq)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Szerkesztés"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Törlés"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
