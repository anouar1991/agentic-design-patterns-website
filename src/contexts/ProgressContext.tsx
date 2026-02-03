import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import type { CourseProgress, QuizScore } from '../data/types'
import { useAuth } from './AuthContext'
import { mergeProgress, syncChapterToCloud, setLocalProgress, getLocalProgress } from '../utils/progressMerge'

const STORAGE_KEY = 'agentic-patterns-progress'
const TOTAL_CHAPTERS = 21

interface LastVisited {
  chapterId: number
  section?: string
  timestamp: string
}

interface ProgressContextType {
  completedChapters: number[]
  completionPercentage: number
  isChapterCompleted: (chapterId: number) => boolean
  getPhaseProgress: (chapterIds: number[]) => { completed: number; total: number; percentage: number }
  markChapterComplete: (chapterId: number) => void
  toggleChapterComplete: (chapterId: number) => void
  resetProgress: () => void
  syncing: boolean
  // Quiz scores
  quizScores: Record<number, QuizScore>
  getQuizScore: (chapterId: number) => QuizScore | null
  saveQuizScore: (chapterId: number, score: number, totalQuestions: number, passed: boolean) => void
  // Last visited
  lastVisited: LastVisited | null
  setLastVisited: (chapterId: number, section?: string) => void
}

const ProgressContext = createContext<ProgressContextType | null>(null)

function loadProgress(): CourseProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Backward compatibility: ensure new fields exist
      return {
        completedChapters: parsed.completedChapters || [],
        quizScores: parsed.quizScores || {},
        lastVisited: parsed.lastVisited || undefined,
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      }
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error)
  }
  return { completedChapters: [], quizScores: {}, lastUpdated: new Date().toISOString() }
}

function saveProgressToStorage(progress: CourseProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error)
  }
}

// Helper to build a full progress object for saving
function buildProgress(
  chapters: number[],
  scores: Record<number, QuizScore>,
  lastVisited?: LastVisited | null,
): CourseProgress {
  return {
    completedChapters: chapters,
    quizScores: scores,
    lastVisited: lastVisited || undefined,
    lastUpdated: new Date().toISOString(),
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [completedChapters, setCompletedChapters] = useState<number[]>([])
  const [quizScores, setQuizScores] = useState<Record<number, QuizScore>>({})
  const [lastVisited, setLastVisitedState] = useState<LastVisited | null>(null)
  const [syncing, setSyncing] = useState(false)
  const hasMergedRef = useRef(false)
  const previousUserIdRef = useRef<string | null>(null)

  // Refs to avoid stale closures in callbacks
  const quizScoresRef = useRef(quizScores)
  const lastVisitedRef = useRef(lastVisited)
  useEffect(() => { quizScoresRef.current = quizScores }, [quizScores])
  useEffect(() => { lastVisitedRef.current = lastVisited }, [lastVisited])

  // Load progress from localStorage on mount
  useEffect(() => {
    const progress = loadProgress()
    setCompletedChapters(progress.completedChapters)
    setQuizScores(progress.quizScores || {})
    if (progress.lastVisited) {
      setLastVisitedState(progress.lastVisited)
    }
  }, [])

  // Merge progress when user logs in
  useEffect(() => {
    if (authLoading) return

    const currentUserId = user?.id || null

    if (currentUserId && currentUserId !== previousUserIdRef.current) {
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

    if (!currentUserId && previousUserIdRef.current) {
      hasMergedRef.current = false
    }

    previousUserIdRef.current = currentUserId
  }, [user, authLoading])

  const completionPercentage = useMemo(() => {
    return Math.round((completedChapters.length / TOTAL_CHAPTERS) * 100)
  }, [completedChapters])

  const isChapterCompleted = useCallback((chapterId: number) => {
    return completedChapters.includes(chapterId)
  }, [completedChapters])

  const getPhaseProgress = useCallback((chapterIds: number[]) => {
    const completed = chapterIds.filter(id => completedChapters.includes(id)).length
    const total = chapterIds.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }, [completedChapters])

  const markChapterComplete = useCallback((chapterId: number) => {
    setCompletedChapters(prev => {
      if (prev.includes(chapterId)) return prev
      const updated = [...prev, chapterId].sort((a, b) => a - b)
      saveProgressToStorage(buildProgress(updated, quizScoresRef.current, lastVisitedRef.current))
      if (user) syncChapterToCloud(user.id, chapterId, true)
      return updated
    })
  }, [user])

  const toggleChapterComplete = useCallback((chapterId: number) => {
    setCompletedChapters(prev => {
      const isCompleting = !prev.includes(chapterId)
      const updated = isCompleting
        ? [...prev, chapterId].sort((a, b) => a - b)
        : prev.filter(id => id !== chapterId)
      saveProgressToStorage(buildProgress(updated, quizScoresRef.current, lastVisitedRef.current))
      if (user) syncChapterToCloud(user.id, chapterId, isCompleting)
      return updated
    })
  }, [user])

  const resetProgress = useCallback(async () => {
    setCompletedChapters([])
    setQuizScores({})
    setLastVisitedState(null)
    saveProgressToStorage(buildProgress([], {}, null))

    if (user) {
      const localChapters = getLocalProgress()
      for (const chapterId of localChapters) {
        await syncChapterToCloud(user.id, chapterId, false)
      }
      setLocalProgress([])
    }
  }, [user])

  // Quiz score methods
  const getQuizScore = useCallback((chapterId: number): QuizScore | null => {
    return quizScores[chapterId] || null
  }, [quizScores])

  const saveQuizScore = useCallback((chapterId: number, score: number, totalQuestions: number, passed: boolean) => {
    setQuizScores(prev => {
      const existing = prev[chapterId]
      // Only update if this is a better score or first attempt
      if (existing && existing.score >= score) return prev
      const updated = {
        ...prev,
        [chapterId]: { score, totalQuestions, passed, timestamp: new Date().toISOString() },
      }
      // Read latest chapters from state via functional ref to avoid stale closure
      const progress = loadProgress()
      saveProgressToStorage(buildProgress(progress.completedChapters, updated, lastVisitedRef.current))
      return updated
    })
  }, [])

  // Last visited methods
  const setLastVisited = useCallback((chapterId: number, section?: string) => {
    const visited: LastVisited = {
      chapterId,
      section,
      timestamp: new Date().toISOString(),
    }
    setLastVisitedState(visited)
    const progress = loadProgress()
    saveProgressToStorage({
      ...progress,
      lastVisited: visited,
      lastUpdated: new Date().toISOString(),
    })
  }, [])

  const value = useMemo(() => ({
    completedChapters,
    completionPercentage,
    isChapterCompleted,
    getPhaseProgress,
    markChapterComplete,
    toggleChapterComplete,
    resetProgress,
    syncing,
    quizScores,
    getQuizScore,
    saveQuizScore,
    lastVisited,
    setLastVisited,
  }), [completedChapters, completionPercentage, isChapterCompleted, getPhaseProgress, markChapterComplete, toggleChapterComplete, resetProgress, syncing, quizScores, getQuizScore, saveQuizScore, lastVisited, setLastVisited])

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
