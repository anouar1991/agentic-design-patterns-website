import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { safeGetJSON, safeSetJSON } from './storage'

/**
 * Merge localStorage progress with cloud progress on first login
 *
 * Strategy:
 * 1. Get local chapters from localStorage
 * 2. Get cloud chapters from Supabase
 * 3. Union both sets (no duplicates)
 * 4. Insert missing chapters to cloud
 * 5. Update localStorage with merged result
 */
export async function mergeProgress(userId: string): Promise<number[]> {
  if (!isSupabaseConfigured()) {
    return getLocalProgress()
  }

  try {
    // Get local progress
    const localChapters = getLocalProgress()

    // Get cloud progress
    const { data: cloudData, error } = await supabase
      .from('progress')
      .select('chapter_id')
      .eq('user_id', userId)

    if (error) {
      const errStr = JSON.stringify(error)
      if (!errStr.includes('Failed to fetch') && !errStr.includes('NetworkError')) {
        console.error('Error fetching cloud progress:', error)
      }
      return localChapters
    }

    const cloudChapters = cloudData?.map(p => p.chapter_id) || []

    // Merge: union of both sets
    const mergedChapters = [...new Set([...localChapters, ...cloudChapters])]

    // Find chapters that are in local but not in cloud
    const chaptersToSync = localChapters.filter(id => !cloudChapters.includes(id))

    // Sync local-only chapters to cloud
    if (chaptersToSync.length > 0) {
      const insertData = chaptersToSync.map(chapter_id => ({
        user_id: userId,
        chapter_id,
      }))

      const { error: insertError } = await supabase
        .from('progress')
        .insert(insertData)

      if (insertError) {
        const errStr = JSON.stringify(insertError)
        if (!errStr.includes('Failed to fetch') && !errStr.includes('NetworkError')) {
          console.error('Error syncing progress to cloud:', insertError)
        }
      }
    }

    // Update localStorage with merged result
    setLocalProgress(mergedChapters)

    return mergedChapters
  } catch (err) {
    console.error('Error merging progress:', err)
    return getLocalProgress()
  }
}

/**
 * Sync a single chapter completion to cloud
 */
export async function syncChapterToCloud(
  userId: string,
  chapterId: number,
  completed: boolean
): Promise<void> {
  if (!isSupabaseConfigured()) return

  try {
    if (completed) {
      // Insert progress record
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          chapter_id: chapterId,
        }, {
          onConflict: 'user_id,chapter_id',
        })

      if (error) {
        const errStr = JSON.stringify(error)
        if (!errStr.includes('Failed to fetch') && !errStr.includes('NetworkError')) {
          console.error('Error syncing chapter to cloud:', error)
        }
      }
    } else {
      // Delete progress record
      const { error } = await supabase
        .from('progress')
        .delete()
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)

      if (error) {
        const errStr = JSON.stringify(error)
        if (!errStr.includes('Failed to fetch') && !errStr.includes('NetworkError')) {
          console.error('Error removing chapter from cloud:', error)
        }
      }
    }
  } catch (err) {
    console.error('Error syncing chapter:', err)
  }
}

/**
 * Fetch all progress from cloud for a user
 */
export async function fetchCloudProgress(userId: string): Promise<number[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('progress')
      .select('chapter_id')
      .eq('user_id', userId)

    if (error) {
      const errStr = JSON.stringify(error)
      if (!errStr.includes('Failed to fetch') && !errStr.includes('NetworkError')) {
        console.error('Error fetching cloud progress:', error)
      }
      return []
    }

    return data?.map(p => p.chapter_id) || []
  } catch (err) {
    console.error('Error fetching progress:', err)
    return []
  }
}

// Local storage helpers
const STORAGE_KEY = 'agentic-patterns-progress'

interface StoredProgress {
  completedChapters: number[]
  lastUpdated: string
}

export function getLocalProgress(): number[] {
  const data = safeGetJSON<StoredProgress | null>(STORAGE_KEY, null)
  if (!data) return []
  return data.completedChapters || []
}

export function setLocalProgress(chapters: number[]): void {
  const data: StoredProgress = {
    completedChapters: chapters,
    lastUpdated: new Date().toISOString(),
  }
  safeSetJSON(STORAGE_KEY, data)
}
