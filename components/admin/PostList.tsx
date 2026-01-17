'use client'

// MATRIX CBS - Poszt Lista Komponens
// Admin felületen posztok kezelése táblázatos nézetben

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle,
  Archive,
  Search,
  Filter
} from 'lucide-react'

interface Post {
  id: number
  title: string
  slug: string
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt: string | null
  scheduledAt: string | null
  createdAt: string
  author: {
    id: number
    name: string
    email: string
  }
  categories: Array<{
    category: {
      id: number
      name: string
      color: string | null
    }
  }>
}

interface PostListResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const statusConfig = {
  DRAFT: { label: 'Piszkozat', icon: FileText, color: 'bg-gray-100 text-gray-700' },
  SCHEDULED: { label: 'Ütemezett', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  PUBLISHED: { label: 'Publikált', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  ARCHIVED: { label: 'Archivált', icon: Archive, color: 'bg-yellow-100 text-yellow-700' }
}

export default function PostList() {
  const [data, setData] = useState<PostListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)

  // Posztok betöltése
  useEffect(() => {
    fetchPosts()
  }, [page, statusFilter])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '10')
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/posts?${params}`)
      if (!res.ok) throw new Error('Hiba a posztok betöltésekor')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Keresés indítása
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  // Poszt törlése
  const handleDelete = async (id: number) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a posztot?')) return

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Hiba történt')
      }
      fetchPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
    setActiveMenu(null)
  }

  // Dátum formázás
  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Fejléc és szűrők */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Posztok</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Keresés */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Keresés..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </form>

            {/* Státusz szűrő */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Minden státusz</option>
                <option value="DRAFT">Piszkozat</option>
                <option value="SCHEDULED">Ütemezett</option>
                <option value="PUBLISHED">Publikált</option>
                <option value="ARCHIVED">Archivált</option>
              </select>
            </div>

            {/* Új poszt gomb */}
            <Link
              href="/admin/posts/new"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium text-center"
            >
              + Új poszt
            </Link>
          </div>
        </div>
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

      {/* Táblázat */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : !data || data.posts.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Még nincsenek posztok
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cím
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Szerző
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategóriák
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Státusz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dátum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.posts.map((post) => {
                  const StatusIcon = statusConfig[post.status].icon
                  return (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {post.author.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.categories.map(({ category }) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                              style={{
                                backgroundColor: `${category.color}20`,
                                color: category.color || '#6B7280'
                              }}
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[post.status].color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[post.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {post.status === 'SCHEDULED'
                          ? formatDate(post.scheduledAt)
                          : post.status === 'PUBLISHED'
                          ? formatDate(post.publishedAt)
                          : formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === 'PUBLISHED' && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Megtekintés"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="p-2 text-gray-400 hover:text-orange-500"
                            title="Szerkesztés"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              setActiveMenu(activeMenu === post.id ? null : post.id)
                            }
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown menü */}
                          {activeMenu === post.id && (
                            <div className="absolute right-6 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Törlés
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Lapozás */}
          {data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {data.pagination.total} poszt összesen
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Előző
                </button>
                <span className="px-3 py-1 text-sm">
                  {page} / {data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Következő
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
