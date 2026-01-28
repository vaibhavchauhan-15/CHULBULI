import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { reviews } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved } = await request.json()

    const [review] = await db.update(reviews)
      .set({ approved, updatedAt: new Date() })
      .where(eq(reviews.id, params.id))
      .returning()

    return NextResponse.json(review)
  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleDELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(reviews)
      .where(eq(reviews.id, params.id))

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Review deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PUT = authMiddleware(handlePUT)
export const DELETE = authMiddleware(handleDELETE)
