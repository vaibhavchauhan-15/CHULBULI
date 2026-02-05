import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { users, addresses, reviews } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

// DELETE - Permanently delete account and associated data
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Delete user's addresses
    await db.delete(addresses).where(eq(addresses.userId, decoded.userId))

    // Delete user's reviews
    await db.delete(reviews).where(eq(reviews.userId, decoded.userId))

    // Note: We don't delete orders as they contain business records
    // Instead, we mark the user as deleted
    const [deletedUser] = await db
      .update(users)
      .set({
        accountStatus: 'deleted',
        updatedAt: new Date(),
        // Anonymize personal data
        name: 'Deleted User',
        email: `deleted_${decoded.userId}@deleted.com`,
        password: null,
        mobile: null,
        dateOfBirth: null,
        photoUrl: null,
        googleId: null,
      })
      .where(eq(users.id, decoded.userId))
      .returning()

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Clear the auth cookie
    const response = NextResponse.json({
      message: 'Account deleted successfully',
    })

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
