import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db/client'

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Health Check Endpoint
 * Verifies database connectivity and returns system status
 * Use this for monitoring and debugging connection issues
 */
export async function GET() {
  try {
    // Check database connection
    const dbHealth = await checkDatabaseConnection()

    if (!dbHealth.connected) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: {
            connected: false,
            error: dbHealth.message,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: true,
        latency: dbHealth.latency,
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
