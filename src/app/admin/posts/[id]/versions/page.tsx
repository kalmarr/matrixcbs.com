// MATRIX CBS - Poszt Verzióelőzmények Teljes Oldal
// Részletes verziókezelés, összehasonlítás, visszaállítás

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import VersionHistory from '@/components/admin/VersionHistory'

// ============================================
// TÍPUSOK
// ============================================

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// ============================================
// POSZT ADATOK LEKÉRÉSE
// ============================================

async function getPost(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      },
      versions: {
        orderBy: { versionNum: 'desc' },
        take: 1
      }
    }
  })

  if (!post) {
    notFound()
  }

  return post
}

// ============================================
// OLDAL KOMPONENS
// ============================================

export default async function PostVersionsPage({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    notFound()
  }

  const post = await getPost(postId)
  const latestVersion = post.versions[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FEJLÉC */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/posts/${postId}`}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Verzióelőzmények
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Poszt: {post.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/admin/posts/${postId}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Vissza a szerkesztéshez
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TARTALOM */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STATISZTIKÁK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Összesen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestVersion ? latestVersion.versionNum : 0}
                </p>
                <p className="text-xs text-gray-500">mentett verzió</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Szerző</p>
                <p className="text-lg font-bold text-gray-900">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500">{post.author.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Státusz</p>
                <p className="text-lg font-bold text-gray-900">
                  {post.status === 'PUBLISHED' ? 'Publikálva' :
                   post.status === 'DRAFT' ? 'Piszkozat' :
                   post.status === 'SCHEDULED' ? 'Ütemezett' : 'Archivált'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VERZIÓ TÖRTÉNET */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Mi a verziókezelés?
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            A verziókezelés automatikusan menti a poszt korábbi állapotait.
            Bármikor visszaállíthatod a poszt egy korábbi verzióját, ha szükséges.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Automatikus mentés:</strong> Minden módosításkor új verzió készül</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Összehasonlítás:</strong> Lásd a különbségeket a verziók között</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Visszaállítás:</strong> Egyszerű visszaállítás biztonsági mentéssel</span>
            </li>
          </ul>
        </div>

        {/* VERZIÓ LISTA KOMPONENS */}
        <VersionHistory
          postId={postId}
          onRestore={() => {
            // Frissítés után átirányítás
            redirect(`/admin/posts/${postId}`)
          }}
        />
      </div>
    </div>
  )
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) {
    return {
      title: 'Hiba - MATRIX CBS Admin'
    }
  }

  try {
    const post = await getPost(postId)
    return {
      title: `Verzióelőzmények: ${post.title} - MATRIX CBS Admin`,
      robots: 'noindex, nofollow'
    }
  } catch {
    return {
      title: 'Poszt nem található - MATRIX CBS Admin'
    }
  }
}
