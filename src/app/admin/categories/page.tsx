// MATRIX CBS - Admin Kategóriák oldal

import CategoryManager from '@/components/admin/CategoryManager'

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategóriák</h1>
          <p className="text-gray-600">Blog kategóriák kezelése</p>
        </div>
      </div>

      <CategoryManager />
    </div>
  )
}
