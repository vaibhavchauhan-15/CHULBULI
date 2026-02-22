import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

/**
 * Next.js Middleware - Runs on every request
 * Adds security headers and validates sessions
 */
export function middleware(request: NextRequest) {
  // Skip validation for health check endpoints
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next()
  }
  
  // Validate origin for state-changing requests (CSRF protection)
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const host = request.headers.get('host')
    
    // In production, validate origin or referer matches host
    if (process.env.NODE_ENV === 'production') {
      const hasValidOrigin = origin && new URL(origin).host === host
      const hasValidReferer = referer && new URL(referer).host === host
      
      if (!hasValidOrigin && !hasValidReferer) {
        console.warn('[SECURITY] CSRF attempt detected:', {
          method: request.method,
          path: request.nextUrl.pathname,
          origin,
          referer,
          host
        })
        
        return NextResponse.json(
          { error: 'Invalid request origin' },
          { status: 403 }
        )
      }
    }
  }

  // Create response after all validations
  const response = NextResponse.next()

  // Add additional security headers
  response.headers.set('X-Request-ID', randomUUID())
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Add security headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-DNS-Prefetch-Control', 'off')
    response.headers.set('X-Download-Options', 'noopen')
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
