// MATRIX CBS - Related Posts API Route
// GET /api/blog/related-posts?postId=X&limit=3

import { NextRequest, NextResponse } from 'next/server'
import { getRelatedPostsByRelevance } from '@/lib/blog/related-posts'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postIdParam = searchParams.get('postId')
    const limitParam = searchParams.get('limit')

    // Validate postId
    if (!postIdParam) {
      return NextResponse.json(
        { error: 'postId parameter is required' },
        { status: 400 }
      )
    }

    const postId = parseInt(postIdParam, 10)
    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: 'Invalid postId parameter' },
        { status: 400 }
      )
    }

    // Parse and validate limit
    const limit = limitParam ? parseInt(limitParam, 10) : 3
    if (isNaN(limit) || limit <= 0 || limit > 10) {
      return NextResponse.json(
        { error: 'Invalid limit parameter (must be between 1 and 10)' },
        { status: 400 }
      )
    }

    // Fetch related posts using the relevance-based algorithm
    const posts = await getRelatedPostsByRelevance(postId, limit)

    // Return the posts
    return NextResponse.json({
      posts,
      count: posts.length
    })
  } catch (error) {
    console.error('Error in related posts API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
