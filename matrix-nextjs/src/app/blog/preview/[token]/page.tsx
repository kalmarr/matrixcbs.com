// MATRIX CBS - Blog Preview Page
// Display draft/scheduled posts via preview token
// Note: Content is admin-generated and stored in database, XSS risk is minimal

import { notFound } from 'next/navigation';
import { getPostByPreviewToken } from '@/lib/blog/preview';
import { sanitizeHTML } from '@/lib/sanitize-html';
import { Metadata } from 'next';

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

interface PreviewPageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  return {
    title: 'Előnézet | MATRIX CBS Blog',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { token } = await params;

  // Fetch post by preview token
  const post = await getPostByPreviewToken(token);

  // If post not found or token expired, show 404
  if (!post) {
    notFound();
  }

  // Format date
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(post.createdAt).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-black py-3 px-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <div>
              <div className="font-bold text-lg">ELŐNÉZET</div>
              <div className="text-sm">
                Ez egy előnézeti link. Státusz: <strong>{post.status}</strong>
              </div>
            </div>
          </div>
          <div className="text-sm">
            Lejár: {new Date(post.previewExpires!).toLocaleString('hu-HU')}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Post Header */}
        <header className="mb-8">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  style={{
                    backgroundColor: category.color || '#f68616',
                    color: '#fff',
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-6 text-xl text-gray-700 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Content - sanitized with DOMPurify via sanitizeHTML */}
        {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Címkék:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="inline-block px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
