// Supabase client configuration
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { database } from './config/environment'

// Get configuration from centralized environment
const supabaseUrl = database.url
const supabaseAnonKey = database.anonKey

/**
 * Create Supabase client
 * This can be used on both client and server side
 */
export const createClient = (): SupabaseClient => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We're using our own JWT auth
      autoRefreshToken: false,
    },
  })
}

// Export singleton instance for convenience
export const supabase = createClient()
