// MATRIX CBS - Blog Poszt Strukturált Adat (JSON-LD Schema)
// Article schema generálás SEO optimalizáláshoz

import { Post, Admin, Category, Tag } from '@prisma/client'

interface BlogPostSchemaProps {
  post: Post & {
    author: Pick<Admin, 'name' | 'email'>
    categories: Array<{
      category: Pick<Category, 'name' | 'slug'>
    }>
    tags: Array<{
      tag: Pick<Tag, 'name' | 'slug'>
    }>
  }
  siteUrl?: string
  organizationName?: string
  organizationLogo?: string
}

export default function BlogPostSchema({
  post,
  siteUrl = 'https://matrixcbs.com',
  organizationName = 'MATRIX CBS Kft.',
  organizationLogo = 'https://matrixcbs.com/images/logo.png',
}: BlogPostSchemaProps) {
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = post.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${siteUrl}${post.featuredImage}`
    : `${siteUrl}/images/default-og-image.jpg`

  // JSON-LD Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.metaDescription || '',
    image: imageUrl,
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
      email: post.author.email,
    },
    publisher: {
      '@type': 'Organization',
      name: organizationName,
      logo: {
        '@type': 'ImageObject',
        url: organizationLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  }

  // Ha van kategória, hozzáadjuk az articleSection-t
  if (post.categories.length > 0) {
    Object.assign(articleSchema, {
      articleSection: post.categories.map(pc => pc.category.name).join(', '),
    })
  }

  // Ha van címke, hozzáadjuk a keywords-öt
  if (post.tags.length > 0) {
    Object.assign(articleSchema, {
      keywords: post.tags.map(pt => pt.tag.name).join(', '),
    })
  }

  // BreadcrumbList schema - kategóriával
  const breadcrumbSchema =
    post.categories.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Kezdőlap',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${siteUrl}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.categories[0].category.name,
              item: `${siteUrl}/blog/kategoria/${post.categories[0].category.slug}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: post.title,
              item: postUrl,
            },
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Kezdőlap',
              item: siteUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${siteUrl}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: postUrl,
            },
          ],
        }

  // Note: Using dangerouslySetInnerHTML with JSON.stringify is safe
  // as we're only outputting JSON data, not user HTML
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}

// Blog lista oldal schema
interface BlogListSchemaProps {
  posts: Array<
    Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'featuredImage'> & {
      author: Pick<Admin, 'name'>
    }
  >
  currentPage?: number
  totalPages?: number
  siteUrl?: string
  organizationName?: string
}

export function BlogListSchema({
  posts,
  currentPage = 1,
  totalPages = 1,
  siteUrl = 'https://matrixcbs.com',
  organizationName = 'MATRIX CBS Kft.',
}: BlogListSchemaProps) {
  const blogUrl = `${siteUrl}/blog`

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
    })),
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${organizationName} - Blog`,
    description: 'Szakmai cikkek, hírek és tudásbázis felnőttképzésről és képzésekről',
    url: currentPage > 1 ? `${blogUrl}?oldal=${currentPage}` : blogUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: organizationName,
      url: siteUrl,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Kezdőlap',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: blogUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}

// Kategória oldal schema
interface CategorySchemaProps {
  category: Pick<Category, 'name' | 'slug' | 'description'>
  postCount?: number
  siteUrl?: string
  organizationName?: string
}

export function CategorySchema({
  category,
  postCount = 0,
  siteUrl = 'https://matrixcbs.com',
  organizationName = 'MATRIX CBS Kft.',
}: CategorySchemaProps) {
  const categoryUrl = `${siteUrl}/blog/kategoria/${category.slug}`

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - ${organizationName} Blog`,
    description: category.description || `${category.name} kategória blog bejegyzései`,
    url: categoryUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: organizationName,
      url: siteUrl,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Kezdőlap',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: categoryUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}

// Címke oldal schema
interface TagSchemaProps {
  tag: Pick<Tag, 'name' | 'slug'>
  postCount?: number
  siteUrl?: string
  organizationName?: string
}

export function TagSchema({
  tag,
  postCount = 0,
  siteUrl = 'https://matrixcbs.com',
  organizationName = 'MATRIX CBS Kft.',
}: TagSchemaProps) {
  const tagUrl = `${siteUrl}/blog/cimke/${tag.slug}`

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `#${tag.name} - ${organizationName} Blog`,
    description: `Blog bejegyzések a(z) ${tag.name} címkével`,
    url: tagUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: organizationName,
      url: siteUrl,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Kezdőlap',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `#${tag.name}`,
        item: tagUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
