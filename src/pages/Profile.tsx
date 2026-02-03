import { motion } from 'framer-motion'
import { Link, Navigate } from 'react-router-dom'
import {
  Trophy,
  Target,
  Flame,
  BookOpen,
  CheckCircle2,
  Star,
  Award,
  Zap,
  Calendar,
  TrendingUp,
  Medal,
  Crown,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProfileStats } from '../hooks/useProfileStats'
import { CountrySelect, type CountryCode, countryNames, countryFlags } from '../components/auth/CountrySelect'

const achievementConfig: Record<string, { icon: React.ElementType; title: string; description: string; color: string }> = {
  first_chapter: {
    icon: Star,
    title: 'First Steps',
    description: 'Complete your first chapter',
    color: '#f59e0b'
  },
  five_chapters: {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Complete 5 chapters',
    color: '#3b82f6'
  },
  halfway: {
    icon: Target,
    title: 'Halfway There',
    description: 'Complete 10 chapters',
    color: '#8b5cf6'
  },
  completionist: {
    icon: Crown,
    title: 'Completionist',
    description: 'Complete all 21 chapters',
    color: '#f59e0b'
  },
  quiz_rookie: {
    icon: CheckCircle2,
    title: 'Quiz Rookie',
    description: 'Pass your first quiz',
    color: '#10b981'
  },
  quiz_master: {
    icon: Trophy,
    title: 'Quiz Master',
    description: 'Pass 10 quizzes',
    color: '#f97316'
  },
  perfect_score: {
    icon: Sparkles,
    title: 'Perfect!',
    description: 'Get a perfect score on a quiz',
    color: '#ec4899'
  },
  perfectionist: {
    icon: Medal,
    title: 'Perfectionist',
    description: 'Get 5 perfect quiz scores',
    color: '#a855f7'
  },
  streak_3: {
    icon: Flame,
    title: 'On Fire',
    description: '3-day learning streak',
    color: '#ef4444'
  },
  streak_7: {
    icon: Zap,
    title: 'Week Warrior',
    description: '7-day learning streak',
    color: '#f59e0b'
  },
  streak_30: {
    icon: Award,
    title: 'Dedicated Learner',
    description: '30-day learning streak',
    color: '#14b8a6'
  }
}

export default function Profile() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth()
  const { stats, loading: statsLoading } = useProfileStats()

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/" replace />
  }

  const loading = authLoading || statsLoading

  const handleCountryChange = async (code: CountryCode) => {
    await updateProfile({ country_code: code })
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Learner'
  const avatarUrl = profile?.avatar_url
  const countryCode = profile?.country_code as CountryCode

  const progressPercentage = Math.round((stats.chaptersCompleted / 21) * 100)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-500/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-primary-500/30">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {stats.streak >= 3 && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-dark-50" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-dark-50 mb-2">{displayName}</h1>
              <p className="text-dark-400 mb-3">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {countryCode && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-700 text-sm">
                    <span className="text-lg">{countryFlags[countryCode]}</span>
                    <span className="text-dark-300">{countryNames[countryCode]}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  <Trophy className="w-4 h-4" />
                  {stats.chaptersCompleted}/21 Chapters
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-dark-800">
                <div className="text-2xl font-bold text-dark-50">{stats.streak}</div>
                <div className="text-xs text-dark-400 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  Day Streak
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-800">
                <div className="text-2xl font-bold text-dark-50">{stats.quizStats.passedAttempts}</div>
                <div className="text-xs text-dark-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Quizzes Passed
                </div>
              </div>
            </div>
          </div>

          {/* Country Selection */}
          {!countryCode && (
            <div className="mt-6 pt-6 border-t border-dark-700">
              <p className="text-sm text-dark-400 mb-3">Set your country to appear on the leaderboard:</p>
              <div className="max-w-xs">
                <CountrySelect value={null} onChange={handleCountryChange} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            Learning Progress
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-dark-50">{stats.chaptersCompleted}</div>
              <div className="text-sm text-dark-400">Chapters Completed</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-dark-50">{stats.quizStats.totalAttempts}</div>
              <div className="text-sm text-dark-400">Quiz Attempts</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-dark-50">{stats.quizStats.averageScore}%</div>
              <div className="text-sm text-dark-400">Average Quiz Score</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-dark-50">{stats.quizStats.perfectScores}</div>
              <div className="text-sm text-dark-400">Perfect Scores</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dark-400">Overall Completion</span>
              <span className="text-primary-400 font-medium">{progressPercentage}%</span>
            </div>
            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          <p className="text-sm text-dark-500">
            {21 - stats.chaptersCompleted} chapters remaining
          </p>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(achievementConfig).map(([key, config], index) => {
              const Icon = config.icon
              const earned = stats.achievements.includes(key)
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-4 rounded-xl text-center transition-all ${
                    earned
                      ? 'bg-dark-800 border border-dark-600'
                      : 'bg-dark-800/50 opacity-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      earned ? '' : 'grayscale'
                    }`}
                    style={{ backgroundColor: earned ? `${config.color}20` : '#374151' }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: earned ? config.color : '#6b7280' }}
                    />
                  </div>
                  <div className={`text-sm font-medium ${earned ? 'text-dark-50' : 'text-dark-500'}`}>
                    {config.title}
                  </div>
                  <div className="text-xs text-dark-500 mt-1">{config.description}</div>
                  {earned && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-dark-50" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Recent Activity
            </h2>

            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={`${activity.chapter_id}-${activity.completed_at}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <Link
                        to={`/chapter/${activity.chapter_id}`}
                        className="text-dark-50 hover:text-primary-400 transition-colors"
                      >
                        Chapter {activity.chapter_id} Completed
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm text-dark-500">
                    {new Date(activity.completed_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/learning-path"
              className="mt-4 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm"
            >
              Continue Learning
              <TrendingUp className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* Empty State */}
        {stats.chaptersCompleted === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-50 mb-2">Start Your Journey</h3>
            <p className="text-dark-400 mb-6">
              Complete chapters and quizzes to earn achievements and track your progress.
            </p>
            <Link
              to="/chapter/1"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Start with Chapter 1
              <Zap className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
