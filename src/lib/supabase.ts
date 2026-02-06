import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { createLogger } from '../utils/logger'

const log = createLogger('Supabase')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-from-supabase-start')
}

// Only create the Supabase client when credentials are available.
// On GitHub Pages without env vars, supabase will be null and all
// features gracefully fall back to localStorage-only mode.
function createSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    log.warn(
      'Supabase credentials not configured. Auth and cloud sync will be disabled. ' +
      'To enable, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
    )
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export const supabase: SupabaseClient<Database> | null = createSupabaseClient()
