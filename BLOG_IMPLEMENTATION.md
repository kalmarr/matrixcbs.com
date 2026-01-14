# MATRIX CBS Blog - Implementation Guide

Public-facing blog pages for the MATRIX CBS Next.js website.

## Created Files

### Pages
- `/app/blog/page.tsx` - Main blog list page with pagination
- `/app/blog/[slug]/page.tsx` - Single blog post page
- `/app/blog/kategoria/[slug]/page.tsx` - Category filter page

### Components
- `/components/blog/PostCard.tsx` - Blog post preview card component

### Utilities
- `/lib/sanitize-html.ts` - HTML sanitization utility

## Features

### Main Blog List (`/blog`)
- Displays all published blog posts in a responsive grid (2 columns on md, 3 on lg)
- Pagination (10 posts per page)
- Category sidebar with post counts
- Responsive design with MATRIX CBS branding
- SEO-optimized metadata

### Single Post Page (`/blog/[slug]`)
- Full blog post display with featured image
- Author information and publication date
- Category badges with custom colors from database
- Tags display
- Related posts based on shared categories (up to 3)
- Breadcrumb navigation
- SEO metadata with Open Graph support
- Sanitized HTML content rendering

### Category Filter Page (`/blog/kategoria/[slug]`)
- Same layout as main blog list
- Filtered by category
- Shows category name, description, and color indicator
- Pagination support
- Breadcrumb navigation

## Design System

### Colors
- **Primary Accent**: `#B2282F` (Red)
- **Secondary Accent**: `#F58B28` (Orange) - Main brand color
- **Background**: Dark theme with `#1a1a1a` base
- **Category Colors**: Custom per category from database

### Typography
- **Headings**: Outfit font family
- **Body**: Plus Jakarta Sans font family
- **Prose**: Tailwind Typography plugin with custom dark theme

### UI Elements
- Cards with hover effects and smooth transitions
- Orange accent highlights on interactive elements
- Gradient text for main headings
- Matrix grid background pattern
- Responsive layouts

## Database Access

All pages use Prisma with optimized queries:
- Server-side rendering (SSR)
- Filters by `status: PUBLISHED` and `publishedAt <= now()`
- Includes only necessary relations
- Parallel queries for performance
- Proper ordering by publish date

## Security Implementation

The blog renders HTML content from the database. Security measures:

1. **Content Source**: Admin-controlled content only (authenticated users)
2. **Sanitization**: Basic HTML sanitization in `/lib/sanitize-html.ts`
3. **Recommendation**: For production, consider using `isomorphic-dompurify`

To upgrade to DOMPurify:
```bash
npm install isomorphic-dompurify
```

See comments in `/lib/sanitize-html.ts` for implementation details.

## SEO Optimization

- Dynamic page titles and descriptions
- Open Graph tags for social media
- Twitter Card support
- Canonical URLs (if specified in post)
- Hungarian language locale (`hu-HU`)
- Semantic HTML structure
- Image optimization with Next.js Image component

## Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus visible styles
- Screen reader friendly
- WCAG 2.1 compliant color contrast

## Usage

### Viewing the Blog
- Visit `/blog` for the main blog list
- Click on any post card to view the full post
- Use category filters in the sidebar
- Navigate with pagination controls

### Post Display Requirements
Posts must have:
- `status: PUBLISHED`
- `publishedAt <= current date/time`

Otherwise, they will not appear and return 404 if accessed directly.

## Future Enhancements

Consider adding:
- Full-text search functionality
- Tag-based filtering pages
- RSS/Atom feed generation
- Social share buttons with meta tags
- Reading time estimation
- View count tracking
- Newsletter subscription forms
- Comment system integration
