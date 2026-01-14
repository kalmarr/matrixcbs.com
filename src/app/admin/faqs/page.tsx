// MATRIX CBS - Admin GYIK oldal

import FaqManager from '@/components/admin/FaqManager'

export default function AdminFaqsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GYIK kezelése</h1>
          <p className="text-gray-600">Gyakran Ismételt Kérdések szerkesztése és rendezése</p>
        </div>
      </div>

      <FaqManager />
    </div>
  )
}
