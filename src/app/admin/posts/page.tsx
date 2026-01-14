// MATRIX CBS - Admin Posztok oldal

import PostList from '@/components/admin/PostList'

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posztok</h1>
          <p className="text-gray-600">Blog posztok kezelése</p>
        </div>
      </div>

      <PostList />
    </div>
  )
}
