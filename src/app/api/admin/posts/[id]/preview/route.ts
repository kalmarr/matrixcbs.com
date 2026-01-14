// MATRIX CBS - Preview Link Generation API
// POST /api/admin/posts/[id]/preview
// Generate preview token and return preview URL

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePreviewToken, getPreviewExpiration } from '@/lib/blog/preview';

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Érvénytelen bejegyzés azonosító' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true, status: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'A bejegyzés nem található' },
        { status: 404 }
      );
    }

    // Generate new preview token and expiration
    const previewToken = generatePreviewToken();
    const previewExpires = getPreviewExpiration();

    // Update post with preview token
    await prisma.post.update({
      where: { id: postId },
      data: {
        previewToken,
        previewExpires,
      },
    });

    // Build preview URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const previewUrl = `${baseUrl}/blog/preview/${previewToken}`;

    // Return success response
    return NextResponse.json({
      success: true,
      previewUrl,
      previewToken,
      expiresAt: previewExpires.toISOString(),
      message: 'Előnézeti link sikeresen generálva',
    });
  } catch (error) {
    console.error('Preview link generation error:', error);
    return NextResponse.json(
      { error: 'Hiba történt az előnézeti link generálása során' },
      { status: 500 }
    );
  }
}
