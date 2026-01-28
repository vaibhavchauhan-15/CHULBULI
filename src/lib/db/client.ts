import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool, PoolConfig } from 'pg'
import * as schema from './schema'

// Validate DATABASE_URL exists (only at runtime, not during build)
if (!process.env.DATABASE_URL) {
  // During build, DATABASE_URL might not be available - that's okay
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    console.warn('⚠️  DATABASE_URL is not set - database features will not work')
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
const shouldUseSSL = process.env.DATABASE_URL && 
  (process.env.DATABASE_URL.includes('sslmode') || 
   !process.env.DATABASE_URL.includes('localhost'))

// Pool configuration for serverless environments
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  // Vercel/Serverless limits: keep connections low
  max: 5, // Maximum connections in pool
  min: 0, // Don't maintain idle connections in serverless
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout new connection attempts after 10s
  // SSL configuration for remote databases (Supabase, etc.)
  // Apply SSL for any connection string that includes sslmode parameter or is not localhost
  ssl: shouldUseSSL
    ? {
        rejectUnauthorized: false, // Required for most hosted databases with self-signed certs
      }
    : undefined,
}

// Create a single connection pool instance
// This is crucial for serverless environments to avoid connection exhaustion
const pool = new Pool(poolConfig)

// Handle pool errors to prevent unhandled rejections
pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err)
  // Log additional context for debugging
  console.error('Database host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown')
})

// Handle connection events for debugging
pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Database pool connection established')
  }
})

// Create Drizzle instance with connection pooling
export const db = drizzle(pool, { schema })

// Test connection on initialization (only in development)
if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL) {
  pool.query('SELECT 1')
    .then(() => {
      console.log('✅ Database connection verified')
    })
    .catch((err) => {
      console.error('❌ Database connection test failed:', err.message)
      console.error('Please verify:')
      console.error('  1. DATABASE_URL is correct')
      console.error('  2. Database server is running and accessible')
      console.error('  3. Network/firewall allows connections')
    })
}

// Gracefully close pool on exit
const cleanup = async () => {
  try {
    console.log('Closing database connections...')
    await pool.end()
    console.log('Database connections closed successfully')
  } catch (err) {
    console.error('Error closing database pool:', err)
  }
}

process.on('SIGINT', async () => {
  await cleanup()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await cleanup()
  process.exit(0)
})

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
    
    console.error(`❌ Database operation failed${contextMsg}:`, errorMessage)
    
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

