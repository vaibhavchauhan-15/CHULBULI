import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { reviews } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch (error) {
    return null
  }
}

// PUT - Update user's own review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = body

    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (comment && comment.trim().length < 10) {
      return NextResponse.json({ error: 'Comment must be at least 10 characters' }, { status: 400 })
    }

    // Verify review belongs to user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.id, params.id), eq(reviews.userId, decoded.userId)))
      .limit(1)

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Update review (will need re-approval if approved previously)
    const updateData: any = {
      updatedAt: new Date(),
      approved: false, // Reset approval status when edited
    }

    if (rating !== undefined) updateData.rating = rating
    if (comment !== undefined) updateData.comment = comment

    const [updatedReview] = await db
      .update(reviews)
      .set(updateData)
      .where(and(eq(reviews.id, params.id), eq(reviews.userId, decoded.userId)))
      .returning()

    if (!updatedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Review updated successfully. It will be reviewed by our team.',
      review: updatedReview,
    })
  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete user's own review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify review belongs to user and delete
    const [deletedReview] = await db
      .delete(reviews)
      .where(and(eq(reviews.id, params.id), eq(reviews.userId, decoded.userId)))
      .returning()

    if (!deletedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
