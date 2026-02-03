import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { QuizAttempt, BestQuizScore } from '../lib/database.types'

interface QuizAttemptData {
  chapterId: number
  score: number
  totalQuestions: number
  passed: boolean
  durationSeconds?: number
}

interface UseQuizAttemptsResult {
  // Data
  attempts: QuizAttempt[]
  bestScore: BestQuizScore | null
  attemptCount: number

  // State
  loading: boolean
  saving: boolean
  error: string | null

  // Actions
  saveAttempt: (data: QuizAttemptData) => Promise<QuizAttempt | null>
  fetchAttempts: (chapterId: number) => Promise<void>
  fetchBestScore: (chapterId: number) => Promise<void>

  // Helpers
  isConfigured: boolean
}

export function useQuizAttempts(chapterId?: number): UseQuizAttemptsResult {
  const { user } = useAuth()
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [bestScore, setBestScore] = useState<BestQuizScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isConfigured = isSupabaseConfigured()

  // Fetch all attempts for a chapter
  const fetchAttempts = useCallback(async (chapId: number) => {
    if (!isConfigured || !user) {
      setAttempts([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', chapId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setAttempts(data || [])
    } catch (err) {
      console.error('Error fetching quiz attempts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch quiz attempts')
    } finally {
      setLoading(false)
    }
  }, [isConfigured, user])

  // Fetch best score for a chapter
  const fetchBestScore = useCallback(async (chapId: number) => {
    if (!isConfigured || !user) {
      setBestScore(null)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('user_best_quiz_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', chapId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is fine
        throw fetchError
      }

      if (data && data.user_id) {
        setBestScore({
          user_id: data.user_id,
          chapter_id: data.chapter_id!,
          score: data.score!,
          total_questions: data.total_questions!,
          passed: data.passed!,
          attempt_number: data.attempt_number!,
          created_at: data.created_at!,
        })
      } else {
        setBestScore(null)
      }
    } catch (err) {
      console.error('Error fetching best quiz score:', err)
    }
  }, [isConfigured, user])

  // Save a new quiz attempt
  const saveAttempt = useCallback(async (data: QuizAttemptData): Promise<QuizAttempt | null> => {
    if (!isConfigured || !user) {
      console.log('Quiz attempt not saved: user not logged in or Supabase not configured')
      return null
    }

    setSaving(true)
    setError(null)

    try {
      // Get next attempt number
      const { data: attemptNum, error: rpcError } = await supabase
        .rpc('get_next_attempt_number', {
          p_user_id: user.id,
          p_chapter_id: data.chapterId,
        })

      if (rpcError) {
        console.warn('Could not get attempt number, using 1:', rpcError)
      }

      const attemptNumber = attemptNum || 1

      // Insert the attempt
      const { data: insertedAttempt, error: insertError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          chapter_id: data.chapterId,
          score: data.score,
          total_questions: data.totalQuestions,
          passed: data.passed,
          duration_seconds: data.durationSeconds,
          attempt_number: attemptNumber,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update local state
      setAttempts(prev => [insertedAttempt, ...prev])

      // Refresh best score
      await fetchBestScore(data.chapterId)

      return insertedAttempt
    } catch (err) {
      console.error('Error saving quiz attempt:', err)
      setError(err instanceof Error ? err.message : 'Failed to save quiz attempt')
      return null
    } finally {
      setSaving(false)
    }
  }, [isConfigured, user, fetchBestScore])

  // Auto-fetch attempts when chapterId is provided
  useEffect(() => {
    if (chapterId && user) {
      fetchAttempts(chapterId)
      fetchBestScore(chapterId)
    }
  }, [chapterId, user, fetchAttempts, fetchBestScore])

  return {
    attempts,
    bestScore,
    attemptCount: attempts.length,
    loading,
    saving,
    error,
    saveAttempt,
    fetchAttempts,
    fetchBestScore,
    isConfigured,
  }
}

// Utility to get quiz stats for display
export function formatQuizScore(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100)
  return `${score}/${total} (${percentage}%)`
}

// Get improvement between attempts
export function calculateImprovement(
  currentScore: number,
  previousScore: number,
  totalQuestions: number
): { percentage: number; improved: boolean } {
  const currentPct = (currentScore / totalQuestions) * 100
  const previousPct = (previousScore / totalQuestions) * 100
  const diff = currentPct - previousPct
  return {
    percentage: Math.abs(Math.round(diff)),
    improved: diff > 0,
  }
}
