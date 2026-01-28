import type { Config } from 'drizzle-kit'

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in environment variables')
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config
