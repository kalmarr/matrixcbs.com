// MATRIX CBS - Blog Post Card Component
// Displays a preview card for a blog post with image, categories, title, excerpt, and metadata

import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@prisma/client';

type PostWithCategories = Post & {
  categories: {
    category: Category;
  }[];
  author: {
    name: string;
  };
};

interface PostCardProps {
  post: PostWithCategories;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.publishedAt || post.createdAt));

  return (
    <article className="group relative overflow-hidden rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-bg-secondary)] transition-all duration-300 hover:border-[var(--color-accent-orange)] hover:shadow-lg hover:shadow-[var(--color-accent-orange)]/20">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        {post.featuredImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-secondary)]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-[var(--color-accent-red)] to-[var(--color-accent-orange)] flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200"
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
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-accent-orange transition-colors duration-200">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-[var(--color-gray-medium)] pt-4 border-t border-[var(--color-bg-secondary)]">
            <div className="flex items-center gap-2">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={post.publishedAt?.toISOString()}>
                {formattedDate}
              </time>
            </div>
          </div>

          {/* Read More Indicator */}
          <div className="flex items-center gap-2 mt-4 text-[var(--color-accent-orange)] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span>Tovább olvasom</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
