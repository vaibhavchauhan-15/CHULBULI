import { defineConfig } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env'

// Load .env, .env.local, .env.production similar to Next.js runtime behavior.
loadEnvConfig(process.cwd())

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in environment variables')
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
