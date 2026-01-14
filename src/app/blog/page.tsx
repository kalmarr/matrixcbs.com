// MATRIX CBS - Blog List Page
// Displays paginated list of published blog posts with category filtering

import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MainLayout } from '@/components/layout/MainLayout';
import PostCard from '@/components/blog/PostCard';

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Olvassa el a MATRIX CBS szakmai blogját a felnőttképzésről, tréningekről és szervezetfejlesztésről.',
  openGraph: {
    title: 'Blog | MATRIX CBS Kft.',
    description:
      'Olvassa el a MATRIX CBS szakmai blogját a felnőttképzésről, tréningekről és szervezetfejlesztésről.',
  },
};

const POSTS_PER_PAGE = 10;

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

async function getBlogData(page: number) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalCount, categories] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
          orderBy: {
            category: {
              sortOrder: 'asc',
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: POSTS_PER_PAGE,
      skip,
    }),
    prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(),
        },
      },
    }),
    prisma.category.findMany({
      where: {
        posts: {
          some: {
            post: {
              status: 'PUBLISHED',
              publishedAt: {
                lte: new Date(),
              },
            },
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: 'PUBLISHED',
                  publishedAt: {
                    lte: new Date(),
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return { posts, totalPages, categories, totalCount };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const { posts, totalPages, categories, totalCount } = await getBlogData(
    currentPage
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[var(--color-bg-dark)]">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-dark)] border-b border-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Blog
            </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            Szakmai cikkek, tapasztalatok és újdonságok a felnőttképzés,
            tréningek és szervezetfejlesztés világából.
          </p>
          <div className="mt-4 text-sm text-[var(--color-gray-medium)]">
            <span className="font-medium text-[var(--color-accent-orange)]">
              {totalCount}
            </span>{' '}
            cikk
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-bg-secondary)] p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[var(--color-accent-orange)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Kategóriák
              </h2>
              <nav className="space-y-2">
                <Link
                  href="/blog"
                  className="flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors duration-200 bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] border border-[var(--color-accent-orange)]/30"
                >
                  <span>Összes cikk</span>
                  <span className="text-xs font-medium">{totalCount}</span>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/kategoria/${category.slug}`}
                    className="flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <span className="flex items-center gap-2">
                      {category.color && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {category.name}
                    </span>
                    <span className="text-xs text-[var(--color-gray-medium)]">
                      {category._count.posts}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] mb-4">
                  <svg
                    className="w-8 h-8 text-[var(--color-gray-medium)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  Még nincsenek cikkek
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  Hamarosan érkeznek az első blog bejegyzések.
                </p>
              </div>
            ) : (
              <>
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    {currentPage > 1 ? (
                      <Link
                        href={`/blog?page=${currentPage - 1}`}
                        className="px-4 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)] transition-colors duration-200"
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Előző
                        </span>
                      </Link>
                    ) : (
                      <span className="px-4 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] text-[var(--color-gray-dark)] cursor-not-allowed">
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Előző
                        </span>
                      </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          // Show first, last, current, and adjacent pages
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            Math.abs(pageNum - currentPage) <= 1
                          ) {
                            return (
                              <Link
                                key={pageNum}
                                href={`/blog?page=${pageNum}`}
                                className={`min-w-[40px] h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${
                                  pageNum === currentPage
                                    ? 'bg-[var(--color-accent-orange)] text-white font-semibold'
                                    : 'bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]'
                                }`}
                              >
                                {pageNum}
                              </Link>
                            );
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNum}
                                className="px-2 text-[var(--color-gray-medium)]"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>

                    {/* Next Button */}
                    {currentPage < totalPages ? (
                      <Link
                        href={`/blog?page=${currentPage + 1}`}
                        className="px-4 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)] transition-colors duration-200"
                      >
                        <span className="flex items-center gap-2">
                          Következő
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </Link>
                    ) : (
                      <span className="px-4 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] text-[var(--color-gray-dark)] cursor-not-allowed">
                        <span className="flex items-center gap-2">
                          Következő
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
