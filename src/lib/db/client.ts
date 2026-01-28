import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Create a single connection pool instance
// This is crucial for serverless environments to avoid connection exhaustion
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Vercel limits: keep connections low
  max: 5, // Maximum connections in pool
  min: 1, // Minimum connections to maintain
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout new connection attempts after 10s
  statement_timeout: 30000, // Statement timeout for queries
})

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Create Drizzle instance with connection pooling
export const db = drizzle(pool, { schema })

// Gracefully close pool on exit
process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})

export { pool }
