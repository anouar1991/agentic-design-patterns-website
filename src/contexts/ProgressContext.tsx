import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import type { CourseProgress } from '../data/types'
import { useAuth } from './AuthContext'
import { mergeProgress, syncChapterToCloud, setLocalProgress, getLocalProgress } from '../utils/progressMerge'

const STORAGE_KEY = 'agentic-patterns-progress'
const TOTAL_CHAPTERS = 21

interface ProgressContextType {
  completedChapters: number[]
  completionPercentage: number
  isChapterCompleted: (chapterId: number) => boolean
  getPhaseProgress: (chapterIds: number[]) => { completed: number; total: number; percentage: number }
  markChapterComplete: (chapterId: number) => void
  toggleChapterComplete: (chapterId: number) => void
  resetProgress: () => void
  syncing: boolean
}

const ProgressContext = createContext<ProgressContextType | null>(null)

function loadProgress(): CourseProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error)
  }
  return { completedChapters: [], lastUpdated: new Date().toISOString() }
}

function saveProgress(progress: CourseProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error)
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [completedChapters, setCompletedChapters] = useState<number[]>([])
  const [syncing, setSyncing] = useState(false)
  const hasMergedRef = useRef(false)
  const previousUserIdRef = useRef<string | null>(null)

  // Load progress from localStorage on mount
  useEffect(() => {
    const progress = loadProgress()
    setCompletedChapters(progress.completedChapters)
  }, [])

  // Merge progress when user logs in
  useEffect(() => {
    // Skip if auth is still loading
    if (authLoading) return

    const currentUserId = user?.id || null

    // Detect login (user changed from null to logged in, or different user)
    if (currentUserId && currentUserId !== previousUserIdRef.current) {
      // Only merge once per login session
      if (!hasMergedRef.current || previousUserIdRef.current !== currentUserId) {
        setSyncing(true)
        hasMergedRef.current = true

        mergeProgress(currentUserId)
          .then(mergedChapters => {
            setCompletedChapters(mergedChapters)
          })
          .finally(() => {
            setSyncing(false)
          })
      }
    }

    // Detect logout
    if (!currentUserId && previousUserIdRef.current) {
      hasMergedRef.current = false
    }

    previousUserIdRef.current = currentUserId
  }, [user, authLoading])

  // Computed completion percentage
  const completionPercentage = useMemo(() => {
    return Math.round((completedChapters.length / TOTAL_CHAPTERS) * 100)
  }, [completedChapters])

  // Check if a specific chapter is completed
  const isChapterCompleted = useCallback((chapterId: number) => {
    return completedChapters.includes(chapterId)
  }, [completedChapters])

  // Get progress for a specific phase
  const getPhaseProgress = useCallback((chapterIds: number[]) => {
    const completed = chapterIds.filter(id => completedChapters.includes(id)).length
    const total = chapterIds.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }, [completedChapters])

  // Mark a chapter as complete
  const markChapterComplete = useCallback((chapterId: number) => {
    setCompletedChapters(prev => {
      if (prev.includes(chapterId)) {
        return prev
      }
      const updated = [...prev, chapterId].sort((a, b) => a - b)

      // Save to localStorage first (offline-first)
      saveProgress({ completedChapters: updated, lastUpdated: new Date().toISOString() })

      // Background sync to cloud if logged in
      if (user) {
        syncChapterToCloud(user.id, chapterId, true)
      }

      return updated
    })
  }, [user])

  // Toggle chapter completion status
  const toggleChapterComplete = useCallback((chapterId: number) => {
    setCompletedChapters(prev => {
      const isCompleting = !prev.includes(chapterId)
      let updated: number[]

      if (isCompleting) {
        updated = [...prev, chapterId].sort((a, b) => a - b)
      } else {
        updated = prev.filter(id => id !== chapterId)
      }

      // Save to localStorage first (offline-first)
      saveProgress({ completedChapters: updated, lastUpdated: new Date().toISOString() })

      // Background sync to cloud if logged in
      if (user) {
        syncChapterToCloud(user.id, chapterId, isCompleting)
      }

      return updated
    })
  }, [user])

  // Reset all progress
  const resetProgress = useCallback(async () => {
    setCompletedChapters([])
    saveProgress({ completedChapters: [], lastUpdated: new Date().toISOString() })

    // If logged in, also clear cloud progress
    if (user) {
      // We'll sync each removed chapter
      const localChapters = getLocalProgress()
      for (const chapterId of localChapters) {
        await syncChapterToCloud(user.id, chapterId, false)
      }
      setLocalProgress([])
    }
  }, [user])

  const value = useMemo(() => ({
    completedChapters,
    completionPercentage,
    isChapterCompleted,
    getPhaseProgress,
    markChapterComplete,
    toggleChapterComplete,
    resetProgress,
    syncing,
  }), [completedChapters, completionPercentage, isChapterCompleted, getPhaseProgress, markChapterComplete, toggleChapterComplete, resetProgress, syncing])

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
