import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://matrixcbs.com';

  // Statikus oldalak - trailing slash minden URL-hez (next.config.ts trailingSlash: true)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/szervezeti-kihivasok/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/megoldasaink/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rolunk/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kapcsolat/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/referenciak/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gyik/`,
      lastModified: new Date('2026-01-16'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/adatvedelem/`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dinamikus blog bejegyzések az adatbázisból
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(),
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...blogPages];
  } catch {
    // Ha nincs DB kapcsolat (pl. build időben), csak statikus oldalak
    return staticPages;
  }
}
