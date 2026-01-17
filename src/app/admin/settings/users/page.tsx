'use client'

// MATRIX CBS - Admin User Management Page
// Felhasználók kezelése: SUPER_ADMIN és ADMIN jogosultság szükséges

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Shield,
  ShieldAlert,
  UserCog,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'

interface AdminUser {
  id: number
  email: string
  name: string
  role: 'SUPER_ADMIN'
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin'
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700'
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Form states
  const [formEmail, setFormEmail] = useState('')
  const [formName, setFormName] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState<'SUPER_ADMIN'>('SUPER_ADMIN')
  const [formIsActive, setFormIsActive] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else if (res.status === 403) {
        setError('Nincs jogosultságod a felhasználók megtekintéséhez')
      } else {
        setError('Hiba történt a felhasználók betöltése során')
      }
    } catch (err) {
      setError('Hiba történt a felhasználók betöltése során')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingUser(null)
    setFormEmail('')
    setFormName('')
    setFormPassword('')
    setFormRole('SUPER_ADMIN')
    setFormIsActive(true)
    setShowPassword(false)
    setShowModal(true)
  }

  const openEditModal = (user: AdminUser) => {
    setModalMode('edit')
    setEditingUser(user)
    setFormEmail(user.email)
    setFormName(user.name)
    setFormPassword('')
    setFormRole(user.role)
    setFormIsActive(user.isActive)
    setShowPassword(false)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormEmail('')
    setFormName('')
    setFormPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalLoading(true)
    setError('')

    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formEmail,
            password: formPassword,
            name: formName,
            role: formRole
          })
        })

        if (res.ok) {
          setSuccess('Felhasználó sikeresen létrehozva!')
          closeModal()
          fetchUsers()
          setTimeout(() => setSuccess(''), 3000)
        } else {
          const data = await res.json()
          setError(data.error || 'Hiba történt a felhasználó létrehozása során')
        }
      } else if (editingUser) {
        const updateData: any = {
          email: formEmail,
          name: formName,
          role: formRole,
          isActive: formIsActive
        }
        if (formPassword) {
          updateData.password = formPassword
        }

        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })

        if (res.ok) {
          setSuccess('Felhasználó sikeresen frissítve!')
          closeModal()
          fetchUsers()
          setTimeout(() => setSuccess(''), 3000)
        } else {
          const data = await res.json()
          setError(data.error || 'Hiba történt a felhasználó frissítése során')
        }
      }
    } catch (err) {
      setError('Hiba történt')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setSuccess('Felhasználó sikeresen törölve!')
        setDeleteConfirm(null)
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Hiba történt a felhasználó törlése során')
      }
    } catch (err) {
      setError('Hiba történt a felhasználó törlése során')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleIcon = () => {
    return <ShieldAlert className="w-4 h-4" />
  }

  const isSuperAdmin = (session?.user as any)?.role === 'SUPER_ADMIN'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-600" />
            Felhasználók
          </h1>
          <p className="text-gray-600 mt-1">Admin felhasználók kezelése</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Új felhasználó
          </button>
        )}
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Név</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Szerepkör</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Státusz</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Utolsó belépés</th>
              {isSuperAdmin && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Műveletek</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${roleColors[user.role] || 'bg-purple-100 text-purple-700'}`}>
                    {getRoleIcon()}
                    {roleLabels[user.role] || 'Super Admin'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Aktív
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
                      <X className="w-3 h-3" />
                      Inaktív
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(user.lastLogin)}
                </td>
                {isSuperAdmin && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Szerkesztés"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {session?.user?.email !== user.email && (
                        <>
                          {deleteConfirm === user.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-1 text-red-600 hover:text-red-700"
                                title="Megerősítés"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Mégsem"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Törlés"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                  Nincsenek felhasználók
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalMode === 'create' ? 'Új felhasználó' : 'Felhasználó szerkesztése'}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Név *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jelszó {modalMode === 'create' ? '*' : '(hagyja üresen ha nem változtatja)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      required={modalMode === 'create'}
                      minLength={8}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {modalMode === 'create' && (
                    <p className="mt-1 text-xs text-gray-500">Minimum 8 karakter</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Szerepkör
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900">
                    <span className="inline-flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      Super Admin
                    </span>
                  </div>
                </div>

                {modalMode === 'edit' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Aktív felhasználó
                    </label>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Mégsem
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {modalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {modalMode === 'create' ? 'Létrehozás' : 'Mentés'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
