import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Verify auth token from HTTP-only cookie and return user data
 * This endpoint is called on app load to restore authentication state
 * Optimized with caching headers and efficient database queries
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      )
    }

    // Verify token (fast - no DB call)
    const payload = verifyToken(token)

    if (!payload) {
      // Token is invalid or expired, clear cookie
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      )
      response.cookies.delete('auth_token')
      return response
    }

    // Fetch current user data from database (optimized query)
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        googleId: true,
        photoUrl: true,
      },
    })

    if (!user) {
      // User no longer exists, clear cookie
      const response = NextResponse.json(
        { error: 'User not found' },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      )
      response.cookies.delete('auth_token')
      return response
    }

    // Return user data with short cache for client-side optimization
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          googleId: user.googleId,
          photoUrl: user.photoUrl,
        },
      },
      {
        headers: {
          // Allow brief client-side caching (5 minutes)
          'Cache-Control': 'private, max-age=300, stale-while-revalidate=60',
          'X-User-Role': user.role,
        },
      }
    )
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Authentication verification failed' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  }
}
