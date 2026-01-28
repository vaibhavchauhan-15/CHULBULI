import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { reviews } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handleGET(request: NextRequest) {
  try {
    const allReviews = await db.query.reviews.findMany({
      with: {
        user: true,
        product: true,
      },
      orderBy: desc(reviews.createdAt),
    })

    return NextResponse.json(allReviews)
  } catch (error) {
    console.error('Admin reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
