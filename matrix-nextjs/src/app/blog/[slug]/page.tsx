// MATRIX CBS - Single Blog Post Page
// Displays full blog post with metadata, content, categories, and tags
// NOTE: Content is sanitized before rendering to prevent XSS attacks

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { sanitizeHTML } from '@/lib/sanitize-html';
import { MainLayout } from '@/components/layout/MainLayout';

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
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
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Cikk nem található',
    };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name],
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              alt: post.title,
            },
          ]
        : undefined,
    },
    alternates: post.canonicalUrl
      ? {
          canonical: post.canonicalUrl,
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.publishedAt || post.createdAt));

  // Get related posts (same categories)
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date(),
      },
      id: {
        not: post.id,
      },
      categories: {
        some: {
          categoryId: {
            in: post.categories.map((c) => c.categoryId),
          },
        },
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
      },
    },
    take: 3,
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-[var(--color-bg-dark)]">
        {/* Breadcrumb */}
      <div className="bg-[var(--color-bg-primary)] border-b border-[var(--color-bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--color-gray-medium)]">
            <Link
              href="/"
              className="hover:text-[var(--color-accent-orange)] transition-colors duration-200"
            >
              Kezdőlap
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href="/blog"
              className="hover:text-[var(--color-accent-orange)] transition-colors duration-200"
            >
              Blog
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[var(--color-text-secondary)]">
              {post.title.length > 50
                ? `${post.title.substring(0, 50)}...`
                : post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/blog/kategoria/${category.slug}`}
                  className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: category.color
                      ? `${category.color}20`
                      : 'rgba(245, 139, 40, 0.1)',
                    color: category.color || 'var(--color-accent-orange)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: category.color || 'var(--color-accent-orange)',
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-sm text-[var(--color-gray-medium)] pb-6 border-b border-[var(--color-bg-secondary)]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-[var(--color-text-secondary)]">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={post.publishedAt?.toISOString()}>
                {formattedDate}
              </time>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] w-full mb-12 overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Content - Sanitized HTML from database */}
        <div
          className="prose prose-invert prose-lg max-w-none mb-12
            prose-headings:font-outfit prose-headings:font-semibold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-gradient
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-[var(--color-text-primary)]
            prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-[var(--color-accent-orange)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-text-primary)] prose-strong:font-semibold
            prose-ul:text-[var(--color-text-secondary)] prose-ul:my-6
            prose-ol:text-[var(--color-text-secondary)] prose-ol:my-6
            prose-li:my-2
            prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-accent-orange)]
            prose-blockquote:bg-[var(--color-bg-primary)] prose-blockquote:py-4 prose-blockquote:px-6
            prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-blockquote:text-[var(--color-text-secondary)]
            prose-code:text-[var(--color-accent-orange)] prose-code:bg-[var(--color-bg-primary)]
            prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-pre:bg-[var(--color-bg-primary)] prose-pre:border prose-pre:border-[var(--color-bg-secondary)]
            prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-12 pb-12 border-b border-[var(--color-bg-secondary)]">
            <h3 className="text-sm font-semibold text-[var(--color-gray-medium)] uppercase tracking-wider mb-4">
              Címkék
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-4 py-2 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-secondary)] hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)] transition-colors duration-200"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
              Kapcsolódó cikkek
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group relative overflow-hidden rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] transition-all duration-300 hover:border-[var(--color-accent-orange)] hover:shadow-lg hover:shadow-[var(--color-accent-orange)]/20"
                >
                  {relatedPost.featuredImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-secondary)]">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-accent-orange transition-colors duration-200">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mt-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog Button */}
        <div className="mt-12 pt-12 border-t border-[var(--color-bg-secondary)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent-orange)] text-white font-semibold rounded-lg hover:bg-[var(--color-accent-orange-hover)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-accent-orange)]/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Vissza a bloghoz
          </Link>
        </div>
      </article>
      </div>
    </MainLayout>
  );
}
