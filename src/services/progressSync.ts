/**
 * Progress Sync Service
 *
 * Bidirectional sync between localStorage and Supabase for authenticated users.
 * Anonymous users continue using localStorage only.
 *
 * Responsibilities:
 * - Merge local + cloud progress on sign-in (union, keep highest completion)
 * - Dual-write chapter completions to localStorage + Supabase
 * - Sync quiz scores to Supabase for authenticated users
 * - Fetch best quiz scores from cloud on sign-in
 * - All cloud operations are fire-and-forget (never block UI)
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { QuizScore } from '../data/types'
import { createLogger } from '../utils/logger'

const log = createLogger('ProgressSync')

// ─── Helpers ─────────────────────────────────────────────────

/** Swallow network errors silently, log real errors */
function isNetworkError(error: unknown): boolean {
  const s = JSON.stringify(error)
  return s.includes('Failed to fetch') || s.includes('NetworkError')
}

function logIfReal(msg: string, error: unknown): void {
  if (!isNetworkError(error)) {
    log.error(msg, error)
  }
}

// ─── Chapter Completion Sync ─────────────────────────────────

/**
 * Merge local and cloud chapter completions on sign-in.
 * Returns the merged (union) set of completed chapter IDs.
 */
export async function mergeChapterProgress(userId: string): Promise<number[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('progress')
      .select('chapter_id')
      .eq('user_id', userId)

    if (error) {
      logIfReal('Error fetching cloud chapters:', error)
      return []
    }

    return data?.map(r => r.chapter_id) ?? []
  } catch (err) {
    logIfReal('Error in mergeChapterProgress:', err)
    return []
  }
}

/**
 * Sync local-only chapters to cloud (those not already in cloud).
 */
export async function pushChaptersToCloud(
  userId: string,
  localChapters: number[],
  cloudChapters: number[],
): Promise<void> {
  if (!isSupabaseConfigured()) return

  const toSync = localChapters.filter(id => !cloudChapters.includes(id))
  if (toSync.length === 0) return

  try {
    const { error } = await supabase
      .from('progress')
      .insert(toSync.map(chapter_id => ({ user_id: userId, chapter_id })))

    if (error) logIfReal('Error pushing chapters to cloud:', error)
  } catch (err) {
    logIfReal('Error in pushChaptersToCloud:', err)
  }
}

/**
 * Upsert a single chapter completion to cloud.
 */
export async function syncChapterToCloud(
  userId: string,
  chapterId: number,
  completed: boolean,
): Promise<void> {
  if (!isSupabaseConfigured()) return

  try {
    if (completed) {
      const { error } = await supabase
        .from('progress')
        .upsert(
          { user_id: userId, chapter_id: chapterId },
          { onConflict: 'user_id,chapter_id' },
        )
      if (error) logIfReal('Error syncing chapter to cloud:', error)
    } else {
      const { error } = await supabase
        .from('progress')
        .delete()
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
      if (error) logIfReal('Error removing chapter from cloud:', error)
    }
  } catch (err) {
    logIfReal('Error in syncChapterToCloud:', err)
  }
}

// ─── Quiz Score Sync ─────────────────────────────────────────

/**
 * Fetch best quiz scores from cloud for a user.
 * Returns a map of chapterId → QuizScore.
 */
export async function fetchCloudQuizScores(
  userId: string,
): Promise<Record<number, QuizScore>> {
  if (!isSupabaseConfigured()) return {}

  try {
    const { data, error } = await supabase
      .from('user_best_quiz_scores')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      logIfReal('Error fetching cloud quiz scores:', error)
      return {}
    }

    const scores: Record<number, QuizScore> = {}
    for (const row of data ?? []) {
      if (row.chapter_id != null && row.score != null && row.total_questions != null) {
        scores[row.chapter_id] = {
          score: row.score,
          totalQuestions: row.total_questions,
          passed: row.passed ?? false,
          timestamp: row.created_at ?? new Date().toISOString(),
        }
      }
    }
    return scores
  } catch (err) {
    logIfReal('Error in fetchCloudQuizScores:', err)
    return {}
  }
}

/**
 * Merge local quiz scores with cloud scores.
 * Strategy: keep the higher score per chapter.
 */
export function mergeQuizScores(
  local: Record<number, QuizScore>,
  cloud: Record<number, QuizScore>,
): Record<number, QuizScore> {
  const merged = { ...cloud }

  for (const [key, localScore] of Object.entries(local)) {
    const chapterId = Number(key)
    const cloudScore = merged[chapterId]

    if (!cloudScore || localScore.score > cloudScore.score) {
      merged[chapterId] = localScore
    }
  }

  return merged
}

/**
 * Save a quiz score to Supabase (as a new attempt).
 */
export async function syncQuizScoreToCloud(
  userId: string,
  chapterId: number,
  score: number,
  totalQuestions: number,
  passed: boolean,
): Promise<void> {
  if (!isSupabaseConfigured()) return

  try {
    // Get next attempt number using the database function
    const { data: attemptNum, error: fnError } = await supabase
      .rpc('get_next_attempt_number', {
        p_user_id: userId,
        p_chapter_id: chapterId,
      })

    if (fnError) {
      logIfReal('Error getting attempt number:', fnError)
      return
    }

    const { error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        chapter_id: chapterId,
        score,
        total_questions: totalQuestions,
        passed,
        attempt_number: attemptNum ?? 1,
      })

    if (error) logIfReal('Error syncing quiz score to cloud:', error)
  } catch (err) {
    logIfReal('Error in syncQuizScoreToCloud:', err)
  }
}

// ─── Full Merge on Sign-In ───────────────────────────────────

export interface MergedProgress {
  chapters: number[]
  quizScores: Record<number, QuizScore>
}

/**
 * Full merge: combine local + cloud data for both chapters and quiz scores.
 * Called once on sign-in. Returns merged data and pushes local-only data to cloud.
 */
export async function mergeAllProgress(
  userId: string,
  localChapters: number[],
  localQuizScores: Record<number, QuizScore>,
): Promise<MergedProgress> {
  if (!isSupabaseConfigured()) {
    return { chapters: localChapters, quizScores: localQuizScores }
  }

  try {
    // Fetch cloud data in parallel
    const [cloudChapters, cloudQuizScores] = await Promise.all([
      mergeChapterProgress(userId),
      fetchCloudQuizScores(userId),
    ])

    // Merge chapters (union)
    const mergedChapters = [...new Set([...localChapters, ...cloudChapters])]

    // Push local-only chapters to cloud (fire-and-forget)
    pushChaptersToCloud(userId, localChapters, cloudChapters).catch(() => {})

    // Merge quiz scores (keep highest per chapter)
    const mergedScores = mergeQuizScores(localQuizScores, cloudQuizScores)

    // Push local quiz scores that are better than cloud to cloud
    for (const [key, localScore] of Object.entries(localQuizScores)) {
      const chapterId = Number(key)
      const cloudScore = cloudQuizScores[chapterId]
      if (!cloudScore || localScore.score > cloudScore.score) {
        syncQuizScoreToCloud(
          userId,
          chapterId,
          localScore.score,
          localScore.totalQuestions,
          localScore.passed,
        ).catch(() => {})
      }
    }

    return { chapters: mergedChapters, quizScores: mergedScores }
  } catch (err) {
    logIfReal('Error in mergeAllProgress:', err)
    return { chapters: localChapters, quizScores: localQuizScores }
  }
}
