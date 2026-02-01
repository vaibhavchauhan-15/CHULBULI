import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { users, orders, reviews } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handleGET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication - user is already verified by middleware
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id

    // Fetch user details
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user statistics
    const orderCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.userId, userId))

    const reviewCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.userId, userId))

    // Get total spent
    const totalSpentResult = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${orders.totalPrice} AS NUMERIC)), 0)` })
      .from(orders)
      .where(eq(orders.userId, userId))

    // Remove sensitive data
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        totalOrders: Number(orderCount[0]?.count || 0),
        totalReviews: Number(reviewCount[0]?.count || 0),
        totalSpent: Number(totalSpentResult[0]?.total || 0),
      },
    }

    return NextResponse.json(sanitizedUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    )
  }
}

async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id
    const body = await request.json()
    const { role, name } = body

    // Validate role
    if (role && !['admin', 'customer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "customer"' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent admin from demoting themselves
    if (authUser.userId === userId && role === 'customer') {
      return NextResponse.json(
        { error: 'You cannot demote yourself from admin' },
        { status: 400 }
      )
    }

    // Update user
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (role) updateData.role = role
    if (name) updateData.name = name

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning()

    // Remove sensitive data
    const sanitizedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      provider: updatedUser.provider,
      photoUrl: updatedUser.photoUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }

    return NextResponse.json(sanitizedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

async function handleDELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id

    // Prevent admin from deleting themselves
    if (authUser.userId === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (cascade will handle related records based on schema)
    await db.delete(users).where(eq(users.id, userId))

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedUserId: userId,
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
export const PUT = authMiddleware(handlePUT)
export const DELETE = authMiddleware(handleDELETE)
