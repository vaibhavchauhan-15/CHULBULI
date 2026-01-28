import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products, orders, orderItems, reviews } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { verifyToken } from '@/lib/auth'
import { sanitizeReviewData } from '@/lib/validation'
import { apiRateLimiter } from '@/lib/rateLimit'
import { generateId } from '@/lib/db/queries'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = apiRateLimiter(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to submit a review' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Sanitize input to prevent XSS
    const sanitizedData = sanitizeReviewData(body)
    const { productId, rating, comment } = sanitizedData

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, and comment are required' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate comment length
    if (comment.length < 10 || comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 1000 characters' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user has purchased this product (verified buyer)
    const order = await db.query.orders.findFirst({
      where: eq(orders.userId, payload.userId),
      with: {
        orderItems: {
          where: eq(orderItems.productId, productId),
        },
      },
    })

    if (!order || !order.orderItems || order.orderItems.length === 0) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 403 }
      )
    }

    // Check if user has already reviewed this product
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.userId, payload.userId)
      ),
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Create review with sanitized data
    const now = new Date()
    const [review] = await db.insert(reviews).values({
      id: generateId('review'),
      productId,
      userId: payload.userId,
      rating,
      comment,
      approved: false, // Requires admin approval to prevent spam
      createdAt: now,
      updatedAt: now,
    }).returning()

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully. It will be visible after admin approval.',
    })
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    )
  }
}
