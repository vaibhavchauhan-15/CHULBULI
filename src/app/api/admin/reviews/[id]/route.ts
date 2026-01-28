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

    // Validate approved is a boolean
    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Approved field must be a boolean' },
        { status: 400 }
      )
    }

    // Check if review exists first
    const existingReview = await db.query.reviews.findFirst({
      where: eq(reviews.id, params.id),
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

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
    // Check if review exists first
    const existingReview = await db.query.reviews.findFirst({
      where: eq(reviews.id, params.id),
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    await db.delete(reviews)
      .where(eq(reviews.id, params.id))

    return NextResponse.json({ 
      success: true,
      message: 'Review deleted successfully' 
    })
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
