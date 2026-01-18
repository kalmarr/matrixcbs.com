// MATRIX CBS - Admin Referenciák oldal

import ReferenceManager from '@/components/admin/ReferenceManager'

export default function AdminReferencesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referenciák</h1>
          <p className="text-gray-600">Ügyfélreferenciák és vélemények kezelése</p>
        </div>
      </div>

      <ReferenceManager />
    </div>
  )
}
