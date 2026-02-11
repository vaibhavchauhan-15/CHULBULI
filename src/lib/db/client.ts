import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool, PoolConfig } from 'pg'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __chulbuliPool: Pool | undefined
  // eslint-disable-next-line no-var
  var __chulbuliDb: NodePgDatabase<typeof schema> | undefined
  // eslint-disable-next-line no-var
  var __chulbuliDbCleanupRegistered: boolean | undefined
}

const isProduction = process.env.NODE_ENV === 'production'
const isServerless =
  process.env.VERCEL === '1' ||
  process.env.NETLIFY === 'true' ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME

const toBoundedNumber = (
  value: string | undefined,
  fallback: number,
  min: number,
  max: number
) => {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

// Validate DATABASE_URL exists (only at runtime, not during build)
if (!process.env.DATABASE_URL) {
  // During build, DATABASE_URL might not be available - that's okay
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    console.warn('DATABASE_URL is not set - database features will not work')
  }
}

// Parse connection string for validation (only if URL exists)
if (process.env.DATABASE_URL) {
  try {
    new URL(process.env.DATABASE_URL)
  } catch (error) {
    throw new Error(
      `Invalid DATABASE_URL format: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// Determine if SSL should be used
const shouldUseSSL =
  !!process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes('sslmode') ||
    !process.env.DATABASE_URL.includes('localhost'))

// Tuned defaults with environment-variable overrides.
const defaultPoolMax = isServerless ? (isProduction ? 10 : 5) : (isProduction ? 20 : 10)
const defaultPoolMin = isServerless ? 0 : isProduction ? 2 : 0
const defaultIdleTimeout = isServerless ? 10000 : 30000
const defaultConnectTimeout = isServerless ? 8000 : 10000
const defaultMaxUses = isProduction ? 7500 : 3000

const poolConfig: PoolConfig = {
  connectionString:
    process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  max: toBoundedNumber(process.env.DB_POOL_MAX, defaultPoolMax, 1, 100),
  min: toBoundedNumber(process.env.DB_POOL_MIN, defaultPoolMin, 0, 50),
  idleTimeoutMillis: toBoundedNumber(
    process.env.DB_POOL_IDLE_TIMEOUT_MS,
    defaultIdleTimeout,
    1000,
    120000
  ),
  connectionTimeoutMillis: toBoundedNumber(
    process.env.DB_POOL_CONNECT_TIMEOUT_MS,
    defaultConnectTimeout,
    1000,
    30000
  ),
  maxUses: toBoundedNumber(process.env.DB_POOL_MAX_USES, defaultMaxUses, 100, 100000),
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  allowExitOnIdle: isServerless,
  ssl: shouldUseSSL
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
}

// Reuse pool and drizzle instances across hot reloads.
const pool = globalThis.__chulbuliPool ?? new Pool(poolConfig)
if (!globalThis.__chulbuliPool) {
  globalThis.__chulbuliPool = pool
}

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err)
})

pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Database pool connection established')
  }
})

export const db = globalThis.__chulbuliDb ?? drizzle(pool, { schema })
if (!globalThis.__chulbuliDb) {
  globalThis.__chulbuliDb = db
}

// Test connection on initialization (only in development)
if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL) {
  pool
    .query('SELECT 1')
    .then(() => {
      console.log('Database connection verified')
    })
    .catch((err) => {
      console.error('Database connection test failed:', err.message)
      console.error('Please verify:')
      console.error('  1. DATABASE_URL is correct')
      console.error('  2. Database server is running and accessible')
      console.error('  3. Network/firewall allows connections')
    })
}

const cleanup = async () => {
  try {
    await pool.end()
  } catch (err) {
    console.error('Error closing database pool:', err)
  }
}

if (!globalThis.__chulbuliDbCleanupRegistered) {
  process.on('SIGINT', async () => {
    await cleanup()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    await cleanup()
    process.exit(0)
  })

  globalThis.__chulbuliDbCleanupRegistered = true
}

// Export pool for advanced use cases
export { pool }

/**
 * Health check for database connection
 * Use this in API routes to verify database connectivity
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean
  message: string
  latency?: number
}> {
  const startTime = Date.now()

  try {
    await pool.query('SELECT 1')
    const latency = Date.now() - startTime

    return {
      connected: true,
      message: 'Database connection successful',
      latency,
    }
  } catch (error) {
    console.error('Database connection check failed:', error)

    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Unknown database error',
    }
  }
}

/**
 * Wrapper for database operations with automatic error handling
 * Prevents unhandled promise rejections and provides consistent error messages
 */
export async function withDatabase<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const contextMsg = context ? ` (Context: ${context})` : ''

    console.error(`Database operation failed${contextMsg}:`, errorMessage)

    // Check for common connection errors
    if (
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT') ||
      errorMessage.includes("Can't reach database server")
    ) {
      throw new Error(
        'Database connection failed. Please verify DATABASE_URL and ensure the database server is accessible.'
      )
    }

    // Re-throw the original error
    throw error
  }
}
