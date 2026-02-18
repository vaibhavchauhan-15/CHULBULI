import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, generateToken } from '@/lib/auth'
import { authRateLimiter } from '@/lib/rateLimit'
import { validateEmail } from '@/lib/validation'
import { logAuthEvent, AuditAction } from '@/lib/auditLog'
import { runtime } from '@/lib/config/environment'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent brute force attacks
    const rateLimitResponse = authRateLimiter(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      // Use generic error message to prevent email enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, emailValidation.email),
    })

    // Use same error message for both cases to prevent user enumeration
    if (!user) {
      logAuthEvent(AuditAction.LOGIN_FAILED, emailValidation.email, request, false)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has a password (OAuth users don't have passwords)
    if (!user.password) {
      logAuthEvent(AuditAction.LOGIN_FAILED, user.email, request, false, user.id)
      return NextResponse.json(
        { error: 'This account uses Google Sign-In. Please sign in with Google.' },
        { status: 401 }
      )
    }

    // Verify password using constant-time comparison
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      logAuthEvent(AuditAction.LOGIN_FAILED, user.email, request, false, user.id)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is deleted
    if (user.accountStatus === 'deleted') {
      return NextResponse.json(
        { error: 'This account has been deleted and cannot be restored.' },
        { status: 403 }
      )
    }

    // Reactivate account if it was deactivated
    if (user.accountStatus === 'deactivated') {
      await db
        .update(users)
        .set({
          accountStatus: 'active',
          deactivatedAt: null,
        })
        .where(eq(users.id, user.id))
    }

    // Generate secure JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response without password and without token in body
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

    // Set httpOnly cookie for security (XSS protection)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: runtime.isProduction,
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Log successful login
    logAuthEvent(AuditAction.LOGIN_SUCCESS, user.email, request, true, user.id)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}
