import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'
import { generateToken } from '@/lib/auth'
import { verifyFirebaseToken } from '@/lib/firebase-admin'
import { authRateLimiter } from '@/lib/rateLimit'
import { logAuthEvent, AuditAction } from '@/lib/auditLog'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface GoogleAuthRequest {
  idToken: string
}

// Add GET handler for Next.js build compatibility
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = authRateLimiter(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { idToken } = (await request.json()) as GoogleAuthRequest

    // Validate request
    if (!idToken) {
      return NextResponse.json(
        { error: 'Firebase ID token is required' },
        { status: 400 }
      )
    }

    // Verify Firebase ID token
    let decodedToken
    try {
      decodedToken = await verifyFirebaseToken(idToken)
    } catch (error: any) {
      console.error('Firebase token verification failed:', error.message)
      return NextResponse.json(
        { error: 'Invalid or expired Google sign-in token' },
        { status: 401 }
      )
    }

    // Extract user data from Firebase token
    const { uid: googleId, email, name, picture: photoUrl } = decodedToken

    if (!email) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      )
    }

    // Check if user exists by googleId or email
    let user = await db.query.users.findFirst({
      where: or(
        eq(users.googleId, googleId),
        eq(users.email, email)
      ),
    })

    const now = new Date()

    if (user) {
      // Check if account is deleted
      if (user.accountStatus === 'deleted') {
        return NextResponse.json(
          { error: 'This account has been deleted and cannot be restored.' },
          { status: 403 }
        )
      }

      // Reactivate account if it was deactivated
      const updateData: any = {}
      if (user.accountStatus === 'deactivated') {
        updateData.accountStatus = 'active'
        updateData.deactivatedAt = null
      }

      // User exists - check if we need to update Google OAuth fields
      if (!user.googleId || user.googleId !== googleId) {
        // User exists with email/password auth, now linking Google account
        const [updatedUser] = await db
          .update(users)
          .set({
            googleId,
            provider: 'google',
            photoUrl: photoUrl || user.photoUrl,
            name: name || user.name,
            updatedAt: now,
            ...updateData,
          })
          .where(eq(users.id, user.id))
          .returning()

        user = updatedUser

        logAuthEvent(
          AuditAction.GOOGLE_AUTH_LINKED,
          email,
          request,
          true,
          user.id
        )
      } else {
        // Update photo and name if changed, and handle reactivation
        const updates: any = {
          updatedAt: now,
          ...updateData,
        }

        if (user.photoUrl !== photoUrl) {
          updates.photoUrl = photoUrl || user.photoUrl
        }
        if (user.name !== name) {
          updates.name = name || user.name
        }

        if (Object.keys(updates).length > 1) { // More than just updatedAt
          const [updatedUser] = await db
            .update(users)
            .set(updates)
            .where(eq(users.id, user.id))
            .returning()

          user = updatedUser
        }

        logAuthEvent(
          AuditAction.LOGIN_SUCCESS,
          email,
          request,
          true,
          user.id
        )
      }
    } else {
      // Create new user with Google OAuth
      const userId = nanoid()

      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          name: name || 'Google User',
          email,
          password: null, // No password for OAuth users
          role: 'customer',
          provider: 'google',
          googleId,
          photoUrl: photoUrl || null,
          createdAt: now,
          updatedAt: now,
        })
        .returning()

      user = newUser

      logAuthEvent(
        AuditAction.SIGNUP_SUCCESS,
        email,
        request,
        true,
        user.id
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set HTTP-only cookie
    const response = NextResponse.json({
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
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('==========================================')
    console.error('🔴 GOOGLE AUTHENTICATION ERROR DETAILS:')
    console.error('==========================================')
    console.error('Error Name:', error.name)
    console.error('Error Message:', error.message)
    console.error('Error Stack:', error.stack)
    console.error('Error Code:', error.code)
    console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    console.error('==========================================')
    
    return NextResponse.json(
      { 
        error: 'Google authentication failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
