// MATRIX CBS - Scheduled Post Publishing Cron Endpoint
// GET: Publishes all scheduled posts that have reached their scheduled time

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret token from header
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('CRON_SECRET environment variable is not configured')
      return NextResponse.json(
        { error: 'Cron endpoint is not properly configured' },
        { status: 500 }
      )
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader?.replace('Bearer ', '')

    if (!token || token !== cronSecret) {
      console.error('Invalid or missing cron secret token')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find all scheduled posts where scheduledAt is in the past or now
    const now = new Date()
    const scheduledPosts = await prisma.post.findMany({
      where: {
        status: PostStatus.SCHEDULED,
        scheduledAt: {
          lte: now
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        scheduledAt: true
      }
    })

    if (scheduledPosts.length === 0) {
      return NextResponse.json({
        message: 'No scheduled posts to publish',
        published: 0,
        posts: []
      })
    }

    // Update all scheduled posts to published status
    const postIds = scheduledPosts.map(post => post.id)

    await prisma.post.updateMany({
      where: {
        id: { in: postIds }
      },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: now
      }
    })

    console.log('Published scheduled posts:', { count: scheduledPosts.length, slugs: scheduledPosts.map(p => p.slug) })

    return NextResponse.json({
      message: `Successfully published ${scheduledPosts.length} post(s)`,
      published: scheduledPosts.length,
      posts: scheduledPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        scheduledAt: post.scheduledAt,
        publishedAt: now
      }))
    })
  } catch (error) {
    console.error('Error publishing scheduled posts:', error)
    return NextResponse.json(
      {
        error: 'An error occurred while publishing scheduled posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Only GET method is allowed for this cron endpoint
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET for cron endpoint.' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET for cron endpoint.' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET for cron endpoint.' },
    { status: 405 }
  )
}
