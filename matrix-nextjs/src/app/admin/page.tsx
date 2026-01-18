// MATRIX CBS - Admin Dashboard
// Statisztikák és gyors áttekintés

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

import {
  FileText,
  FolderOpen,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getDashboardStats() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    scheduledPosts,
    totalCategories,
    unreadMessages,
    recentPosts
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.count({ where: { status: 'SCHEDULED' } }),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } }
      }
    })
  ])

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    scheduledPosts,
    totalCategories,
    unreadMessages,
    recentPosts
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      name: 'Összes poszt',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/posts'
    },
    {
      name: 'Publikált',
      value: stats.publishedPosts,
      icon: Eye,
      color: 'bg-green-500',
      href: '/admin/posts?status=PUBLISHED'
    },
    {
      name: 'Piszkozat',
      value: stats.draftPosts,
      icon: Clock,
      color: 'bg-gray-500',
      href: '/admin/posts?status=DRAFT'
    },
    {
      name: 'Ütemezett',
      value: stats.scheduledPosts,
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/admin/posts?status=SCHEDULED'
    },
    {
      name: 'Kategóriák',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'bg-purple-500',
      href: '/admin/categories'
    },
    {
      name: 'Olvasatlan üzenet',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'bg-red-500',
      href: '/admin/messages'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Üdvözlés */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Üdvözöljük az admin felületen!</p>
      </div>

      {/* Statisztika kártyák */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Gyors műveletek és legutóbbi posztok */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gyors műveletek */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gyors műveletek
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
            >
              <FileText className="w-5 h-5" />
              Új poszt
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <FolderOpen className="w-5 h-5" />
              Kategóriák
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <MessageSquare className="w-5 h-5" />
              Üzenetek
              {stats.unreadMessages > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.unreadMessages}
                </span>
              )}
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <Eye className="w-5 h-5" />
              Médiatár
            </Link>
          </div>
        </div>

        {/* Legutóbbi posztok */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Legutóbbi posztok
            </h2>
            <Link
              href="/admin/posts"
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Összes megtekintése →
            </Link>
          </div>
          {stats.recentPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Még nincsenek posztok
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        {post.author.name} •{' '}
                        {new Date(post.createdAt).toLocaleDateString('hu-HU')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.status === 'PUBLISHED'
                        ? 'Publikált'
                        : post.status === 'SCHEDULED'
                        ? 'Ütemezett'
                        : 'Piszkozat'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
