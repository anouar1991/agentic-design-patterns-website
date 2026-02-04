import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { LeaderboardEntry } from '../lib/database.types'
import { createLogger } from '../utils/logger'

const log = createLogger('Leaderboard')

interface UseLeaderboardOptions {
  countryFilter?: string | null
  limit?: number
}

interface UseLeaderboardResult {
  entries: LeaderboardEntry[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  isConfigured: boolean
}

export function useLeaderboard({
  countryFilter = null,
  limit = 50,
}: UseLeaderboardOptions = {}): UseLeaderboardResult {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isConfigured = isSupabaseConfigured()

  const fetchLeaderboard = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('leaderboard_cache')
        .select('*')
        .order('global_rank', { ascending: true })
        .limit(limit)

      // Apply country filter if specified
      if (countryFilter) {
        query = query.eq('country_code', countryFilter)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      // Transform and filter out invalid entries (null user_id or ranks)
      const validEntries: LeaderboardEntry[] = (data || [])
        .filter(entry => entry.user_id !== null)
        .map(entry => ({
          user_id: entry.user_id!,
          display_name: entry.display_name,
          avatar_url: entry.avatar_url,
          country_code: entry.country_code,
          completed_chapters: entry.completed_chapters ?? 0,
          completion_percentage: entry.completion_percentage ?? 0,
          global_rank: entry.global_rank ?? 0,
        }))

      setEntries(validEntries)
    } catch (err: unknown) {
      const errStr = JSON.stringify(err)
      const isNetworkError = errStr.includes('Failed to fetch') || errStr.includes('ERR_CONNECTION_REFUSED') || errStr.includes('NetworkError')
      if (!isNetworkError) {
        log.error('Error fetching leaderboard:', err)
      }
      const errMsg = err instanceof Error ? err.message : (typeof err === 'object' && err !== null && 'message' in err ? String((err as Record<string, unknown>).message) : 'Failed to fetch leaderboard')
      setError(isNetworkError ? 'Unable to connect to server' : errMsg)
    } finally {
      setLoading(false)
    }
  }, [isConfigured, countryFilter, limit])

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    entries,
    loading,
    error,
    refresh: fetchLeaderboard,
    isConfigured,
  }
}

// Helper to get user's rank
export async function getUserRank(userId: string): Promise<LeaderboardEntry | null> {
  if (!isSupabaseConfigured()) return null

  try {
    const { data, error } = await supabase
      .from('leaderboard_cache')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      const errStr = JSON.stringify(error)
      const isNetworkError = errStr.includes('Failed to fetch') || errStr.includes('ERR_CONNECTION_REFUSED') || errStr.includes('NetworkError')
      if (!isNetworkError) {
        log.error('Error fetching user rank:', error)
      }
      return null
    }

    if (!data || data.user_id === null) return null

    return {
      user_id: data.user_id,
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      country_code: data.country_code,
      completed_chapters: data.completed_chapters ?? 0,
      completion_percentage: data.completion_percentage ?? 0,
      global_rank: data.global_rank ?? 0,
    }
  } catch {
    // Network error or other unexpected failure — silently return null
    return null
  }
}
