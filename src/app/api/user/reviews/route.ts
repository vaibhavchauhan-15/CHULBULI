import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { reviews, products, orderItems, orders } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
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

// GET - Get all user reviews with pending reviews
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get all reviews by user
    const userReviews = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        productName: products.name,
        productImage: products.thumbnailImage,
        rating: reviews.rating,
        comment: reviews.comment,
        approved: reviews.approved,
        verifiedPurchase: reviews.verifiedPurchase,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(eq(reviews.userId, decoded.userId))
      .orderBy(reviews.createdAt)

    // Get purchased products that haven't been reviewed yet
    const purchasedProducts = await db
      .selectDistinct({
        productId: orderItems.productId,
        productName: products.name,
        productImage: products.thumbnailImage,
        orderId: orders.id,
        orderDate: orders.createdAt,
      })
      .from(orderItems)
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(orders.userId, decoded.userId),
          eq(orders.status, 'delivered')
        )
      )

    // Filter out products that have already been reviewed
    const reviewedProductIds = new Set(userReviews.map(r => r.productId))
    const pendingReviews = purchasedProducts.filter(
      p => !reviewedProductIds.has(p.productId)
    )

    return NextResponse.json({
      reviews: userReviews,
      pendingReviews: pendingReviews,
    })
  } catch (error) {
    console.error('Get user reviews error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
