# Blog Related Posts Feature

This feature provides intelligent related post recommendations based on categories and tags.

## Files

- `lib/blog/related-posts.ts` - Core algorithm for finding related posts
- `components/blog/RelatedPosts.tsx` - React component for displaying related posts
- `app/api/blog/related-posts/route.ts` - API endpoint for fetching related posts

## How It Works

### Algorithm

The related posts algorithm uses a relevance-based scoring system:

1. **Category Matching (weighted 3x)**: Posts that share categories with the current post are prioritized
2. **Tag Matching (weighted 1x)**: Posts that share tags are also considered
3. **Sorting**: Results are sorted by relevance score, then by publish date (newest first)
4. **Filtering**: Only published posts are included, and the current post is always excluded

### Two Implementations

1. **`getRelatedPosts()`** - Simple implementation
   - First finds posts with shared categories
   - If not enough results, adds posts with shared tags
   - Returns up to `limit` posts

2. **`getRelatedPostsByRelevance()`** - Advanced implementation (used by default)
   - Calculates relevance score for each candidate post
   - Weights categories 3x more than tags
   - Returns the most relevant posts

## Usage

### In a Blog Post Page

```tsx
import RelatedPosts from '@/components/blog/RelatedPosts'

export default function BlogPost({ post }) {
  return (
    <article>
      {/* Post content */}
      <h1>{post.title}</h1>
      <div>{post.content}</div>

      {/* Related posts section */}
      <RelatedPosts postId={post.id} limit={3} />
    </article>
  )
}
```

### Component Props

```tsx
interface RelatedPostsProps {
  postId: number  // Required: ID of the current post
  limit?: number  // Optional: Number of posts to show (default: 3, max: 10)
}
```

### API Endpoint

The component fetches data from:
```
GET /api/blog/related-posts?postId={id}&limit={limit}
```

Response:
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "Post excerpt...",
      "featuredImage": "/path/to/image.jpg",
      "publishedAt": "2026-01-01T00:00:00Z",
      "categories": [
        {
          "category": {
            "id": 1,
            "name": "Category Name",
            "color": "#f68616"
          }
        }
      ]
    }
  ],
  "count": 3
}
```

### Direct Function Usage (Server-Side)

You can also use the functions directly in server components or API routes:

```tsx
import { getRelatedPostsByRelevance } from '@/lib/blog/related-posts'

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)
  const relatedPosts = await getRelatedPostsByRelevance(post.id, 3)

  return (
    <div>
      {/* Render post and related posts */}
    </div>
  )
}
```

## Styling

The component uses Tailwind CSS with the following design:
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Card-based design with hover effects
- Category badges with custom colors
- Featured images with fallback placeholder
- Orange accent color (#f68616) matching the site theme

## Features

- Automatic loading state with spinner
- Error handling with graceful fallback
- No rendering if no related posts found
- Hungarian date formatting
- Optimized images with Next.js Image component
- Smooth hover animations
- Mobile-responsive design

## Performance Considerations

- The API route has a maximum limit of 10 posts
- Database queries are optimized with proper indexes
- Images use Next.js Image optimization
- Component only fetches data on mount, not on every render

## Future Enhancements

Potential improvements:
- Cache related posts calculations
- Add user engagement metrics (views, likes) to relevance score
- Allow manual related post selection in admin
- Add A/B testing for different algorithms
- Track click-through rates on related posts
