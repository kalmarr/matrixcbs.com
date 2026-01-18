'use client'

// MATRIX CBS - Admin Messages Page
// Contact messages management with filters and search

import { useState, useEffect } from 'react'
import {
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  Phone,
  MapPin,
  Monitor
} from 'lucide-react'

interface ContactMessage {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  message: string
  isRead: boolean
  isArchived: boolean
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

type FilterType = 'all' | 'unread' | 'archived'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [expandedMessage, setExpandedMessage] = useState<ContactMessage | null>(null)

  // Fetch messages
  useEffect(() => {
    fetchMessages()
  }, [filter, search, pagination.page])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        filter,
        search,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      const res = await fetch(`/api/admin/messages?${params}`)
      if (!res.ok) throw new Error('Hiba az üzenetek betöltésekor')

      const data = await res.json()
      setMessages(data.messages)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Clear search
  const clearSearch = () => {
    setSearchInput('')
    setSearch('')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Toggle message expansion
  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
      setExpandedMessage(null)
      return
    }

    try {
      // Fetch full message details
      const res = await fetch(`/api/admin/messages/${id}`)
      if (!res.ok) throw new Error('Hiba az üzenet betöltésekor')

      const message = await res.json()
      setExpandedId(id)
      setExpandedMessage(message)

      // Update message in list as read
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isRead: true } : m))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Toggle read status
  const toggleRead = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus })
      })

      if (!res.ok) throw new Error('Hiba történt')

      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isRead: !currentStatus } : m))
      )

      if (expandedMessage && expandedMessage.id === id) {
        setExpandedMessage({ ...expandedMessage, isRead: !currentStatus })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Toggle archive status
  const toggleArchive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !currentStatus })
      })

      if (!res.ok) throw new Error('Hiba történt')

      // Refresh list to remove/add archived items based on filter
      await fetchMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Delete message
  const deleteMessage = async (id: number) => {
    if (!confirm('Biztosan törölni szeretnéd ezt az üzenetet?')) return

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Hiba történt')

      if (expandedId === id) {
        setExpandedId(null)
        setExpandedMessage(null)
      }

      await fetchMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba')
    }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Most'
    if (diffMins < 60) return `${diffMins} perce`
    if (diffHours < 24) return `${diffHours} órája`
    if (diffDays < 7) return `${diffDays} napja`

    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Üzenetek</h1>
          <p className="text-gray-600">Kapcsolati űrlapról érkezett üzenetek</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilter('all')
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Összes
            </button>
            <button
              onClick={() => {
                setFilter('unread')
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'unread'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Olvasatlan
            </button>
            <button
              onClick={() => {
                setFilter('archived')
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'archived'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Archivált
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Keresés név vagy email alapján..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Keresés
            </button>
          </form>
        </div>
      </div>

      {/* Messages list */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg">Nincsenek üzenetek</p>
            <p className="text-sm mt-1">
              {filter === 'unread'
                ? 'Minden üzenet el van olvasva'
                : filter === 'archived'
                ? 'Nincsenek archivált üzenetek'
                : search
                ? 'Nincs találat'
                : 'Még nem érkezett üzenet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div key={message.id} className="hover:bg-gray-50 transition">
                {/* Message row */}
                <div className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    {/* Read/Unread icon */}
                    <button
                      onClick={() => toggleRead(message.id, message.isRead)}
                      className="mt-1 text-gray-400 hover:text-orange-500 transition"
                    >
                      {message.isRead ? (
                        <MailOpen className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5 text-orange-500" />
                      )}
                    </button>

                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <button
                          onClick={() => toggleExpand(message.id)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm font-medium ${
                                message.isRead ? 'text-gray-700' : 'text-gray-900 font-semibold'
                              }`}
                            >
                              {message.lastName} {message.firstName}
                            </h3>
                            <span className="text-sm text-gray-500">&lt;{message.email}&gt;</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {message.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(message.createdAt)}
                            </span>
                            {message.phone && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {message.phone}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleArchive(message.id, message.isArchived)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition"
                            title={message.isArchived ? 'Archiválás visszavonása' : 'Archiválás'}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition"
                            title="Törlés"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleExpand(message.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition"
                          >
                            {expandedId === message.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === message.id && expandedMessage && (
                  <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-4xl">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Teljes üzenet:</h4>
                        <div className="bg-white rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200">
                          {expandedMessage.message}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {expandedMessage.ipAddress && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-700">IP:</span>
                            <span>{expandedMessage.ipAddress}</span>
                          </div>
                        )}
                        {expandedMessage.userAgent && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <Monitor className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <span className="font-medium text-gray-700">Böngésző:</span>
                              <p className="text-xs text-gray-500 mt-1 break-all">
                                {expandedMessage.userAgent}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {pagination.total} üzenet, {pagination.page}. oldal / {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Előző
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Következő
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
