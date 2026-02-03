import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Auth and cloud sync will be disabled. ' +
    'To enable, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
  )
}

// Create client with proper typing
// Falls back to empty strings if env vars not set (client will be non-functional)
export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'missing-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-from-supabase-start')
}
