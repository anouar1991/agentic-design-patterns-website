import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { createLogger } from '../utils/logger'

const log = createLogger('Supabase')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  log.warn(
    'Supabase credentials not configured. Auth and cloud sync will be disabled. ' +
    'To enable, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
  )
}

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-from-supabase-start')
}

// Create client with proper typing
// When not configured, disable auto-connect features to prevent console errors
export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'missing-key',
  {
    auth: {
      autoRefreshToken: isSupabaseConfigured(),
      persistSession: isSupabaseConfigured(),
      detectSessionInUrl: isSupabaseConfigured(),
    },
  }
)
