import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'

interface QuizStats {
  totalAttempts: number
  passedAttempts: number
  averageScore: number
  perfectScores: number
}

interface ProgressData {
  chapter_id: number
  completed_at: string
}

interface ProfileStats {
  chaptersCompleted: number
  quizStats: QuizStats
  streak: number
  lastActiveDate: string | null
  recentActivity: ProgressData[]
  achievements: string[]
}

const defaultStats: ProfileStats = {
  chaptersCompleted: 0,
  quizStats: {
    totalAttempts: 0,
    passedAttempts: 0,
    averageScore: 0,
    perfectScores: 0
  },
  streak: 0,
  lastActiveDate: null,
  recentActivity: [],
  achievements: []
}

export function useProfileStats() {
  const { user } = useAuth()
  const { completedChapters } = useProgress()
  const [stats, setStats] = useState<ProfileStats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0

    const sortedDates = [...dates]
      .map(d => new Date(d).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i) // unique dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    // Check if last activity was today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0 // Streak broken
    }

    let streak = 1
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i])
      const next = new Date(sortedDates[i + 1])
      const diff = (current.getTime() - next.getTime()) / 86400000

      if (diff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const calculateAchievements = (
    chaptersCompleted: number,
    quizStats: QuizStats,
    streak: number
  ): string[] => {
    const achievements: string[] = []

    // Chapter milestones
    if (chaptersCompleted >= 1) achievements.push('first_chapter')
    if (chaptersCompleted >= 5) achievements.push('five_chapters')
    if (chaptersCompleted >= 10) achievements.push('halfway')
    if (chaptersCompleted >= 21) achievements.push('completionist')

    // Quiz achievements
    if (quizStats.passedAttempts >= 1) achievements.push('quiz_rookie')
    if (quizStats.passedAttempts >= 10) achievements.push('quiz_master')
    if (quizStats.perfectScores >= 1) achievements.push('perfect_score')
    if (quizStats.perfectScores >= 5) achievements.push('perfectionist')

    // Streak achievements
    if (streak >= 3) achievements.push('streak_3')
    if (streak >= 7) achievements.push('streak_7')
    if (streak >= 30) achievements.push('streak_30')

    return achievements
  }

  const fetchStats = useCallback(async () => {
    if (!isSupabaseConfigured() || !user) {
      // Use local progress data
      const localAchievements = calculateAchievements(
        completedChapters.length,
        defaultStats.quizStats,
        0
      )
      setStats({
        ...defaultStats,
        chaptersCompleted: completedChapters.length,
        achievements: localAchievements
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('chapter_id, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (progressError) throw progressError

      // Fetch quiz attempts
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions, passed')
        .eq('user_id', user.id)

      if (quizError) throw quizError

      // Calculate quiz stats
      const quizStats: QuizStats = {
        totalAttempts: quizData?.length || 0,
        passedAttempts: quizData?.filter(q => q.passed).length || 0,
        averageScore: quizData && quizData.length > 0
          ? Math.round(quizData.reduce((acc, q) => acc + (q.score / q.total_questions) * 100, 0) / quizData.length)
          : 0,
        perfectScores: quizData?.filter(q => q.score === q.total_questions).length || 0
      }

      // Calculate streak from activity dates
      const activityDates = [
        ...(progressData?.map(p => p.completed_at) || []),
        // Could also include quiz attempt dates if we had them
      ]
      const streak = calculateStreak(activityDates)

      // Get recent activity (last 5)
      const recentActivity = progressData?.slice(0, 5) || []

      // Calculate achievements
      const achievements = calculateAchievements(
        progressData?.length || 0,
        quizStats,
        streak
      )

      setStats({
        chaptersCompleted: progressData?.length || 0,
        quizStats,
        streak,
        lastActiveDate: progressData?.[0]?.completed_at || null,
        recentActivity,
        achievements
      })
    } catch (err: unknown) {
      const errStr = JSON.stringify(err)
      const isNetworkError = errStr.includes('Failed to fetch') || errStr.includes('NetworkError')
      if (!isNetworkError) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile stats'))
      }
    } finally {
      setLoading(false)
    }
  }, [user, completedChapters.length])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}
