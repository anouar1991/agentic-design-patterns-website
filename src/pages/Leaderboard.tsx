import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Trophy, Medal, Crown, Globe, RefreshCw, UserCircle, AlertCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLeaderboard, getUserRank } from '../hooks/useLeaderboard'
import { useAuth } from '../contexts/AuthContext'
import { COUNTRIES } from '../components/auth/CountrySelect'
import type { LeaderboardEntry } from '../lib/database.types'
import { useEffect } from 'react'

// Get flag emoji for country code
function getFlag(countryCode: string | null): string {
  if (!countryCode) return ''
  const country = COUNTRIES.find(c => c.code === countryCode)
  return country?.flag || ''
}

// Rank badge component
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Crown className="w-4 h-4 text-dark-50" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-400/30">
        <Medal className="w-4 h-4 text-dark-50" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-600/30">
        <Medal className="w-4 h-4 text-dark-50" />
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-sm font-medium text-dark-400">
      {rank}
    </div>
  )
}

// Leaderboard row component
function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  isCurrentUser: boolean
}) {
  const displayName = entry.display_name || 'Anonymous'
  const flag = getFlag(entry.country_code)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
        isCurrentUser
          ? 'bg-blue-900/20 ring-2 ring-blue-500/50'
          : 'bg-dark-800/50 hover:bg-dark-800'
      }`}
    >
      <RankBadge rank={entry.global_rank} />

      {/* Avatar */}
      {entry.avatar_url ? (
        <img
          src={entry.avatar_url}
          alt={displayName}
          width={40}
          height={40}
          loading="lazy"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-dark-50 truncate">
            {displayName}
          </span>
          {flag && <span className="text-lg">{flag}</span>}
          {isCurrentUser && (
            <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full">
              You
            </span>
          )}
        </div>
        <div className="text-sm text-dark-400">
          {entry.completed_chapters} / 21 chapters
        </div>
      </div>

      {/* Progress */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${entry.completion_percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-dark-300 w-12 text-right">
          {entry.completion_percentage}%
        </span>
      </div>
    </motion.div>
  )
}

export default function Leaderboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [countryFilter, setCountryFilter] = useState<string | null>(null)
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)

  const { entries, loading, error, refresh, isConfigured } = useLeaderboard({
    countryFilter,
    limit: 50,
  })

  // Fetch current user's rank
  useEffect(() => {
    if (user) {
      getUserRank(user.id).then(setUserRank).catch(() => {})
    }
  }, [user])

  // Get unique countries from entries for filter
  const availableCountries = useMemo(() => {
    const codes = new Set<string>()
    entries.forEach(e => {
      if (e.country_code) codes.add(e.country_code)
    })
    return COUNTRIES.filter(c => codes.has(c.code))
  }, [entries])

  // Check if current user is in visible entries
  const userInList = user && entries.some(e => e.user_id === user.id)

  if (!isConfigured) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-dark-800/50 rounded-2xl">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h2 className="text-2xl font-bold text-dark-50 mb-2">
            {t('leaderboard.notConfigured', 'Leaderboard Not Available')}
          </h2>
          <p className="text-dark-400 max-w-md mx-auto">
            {t('leaderboard.notConfiguredDesc', 'The leaderboard requires Supabase to be configured. Your progress is still tracked locally.')}
          </p>
          <Link
            to="/learning-path"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-blue-600 text-dark-50 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('leaderboard.viewProgress', 'View your progress')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/30 rounded-full text-yellow-300 text-sm font-medium mb-4">
          <Trophy className="w-4 h-4" />
          {t('leaderboard.badge', 'Top Learners')}
        </div>
        <h1 className="text-4xl font-bold text-dark-50 mb-2">
          {t('leaderboard.title', 'Leaderboard')}
        </h1>
        <p className="text-dark-400 max-w-lg mx-auto">
          {t('leaderboard.subtitle', 'See how you rank against other learners mastering agentic design patterns')}
        </p>
      </div>

      {/* Current user rank card (if not in top 50) */}
      {user && userRank && !userInList && (
        <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
            <Sparkles className="w-4 h-4" />
            {t('leaderboard.yourRank', 'Your Rank')}
          </div>
          <LeaderboardRow entry={userRank} isCurrentUser={true} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-400" />
          <select
            value={countryFilter || ''}
            onChange={(e) => setCountryFilter(e.target.value || null)}
            className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-dark-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('leaderboard.allCountries', 'All countries')}</option>
            {availableCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-blue-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh', 'Refresh')}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && entries.length === 0 && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-dark-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <div className="text-center py-16 bg-dark-800/50 rounded-2xl">
          <UserCircle className="w-16 h-16 mx-auto mb-4 text-dark-400" />
          <h3 className="text-xl font-semibold text-dark-50 mb-2">
            {t('leaderboard.noEntries', 'No learners yet')}
          </h3>
          <p className="text-dark-400">
            {countryFilter
              ? t('leaderboard.noEntriesCountry', 'No learners from this country yet')
              : t('leaderboard.beFirst', 'Be the first to complete a chapter!')}
          </p>
        </div>
      )}

      {/* Leaderboard list */}
      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <LeaderboardRow
              key={entry.user_id}
              entry={{ ...entry, global_rank: index + 1 }}
              isCurrentUser={user?.id === entry.user_id}
            />
          ))}
        </div>
      )}

      {/* Call to action for non-logged in users */}
      {!user && entries.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-center text-white">
          <h3 className="text-xl font-bold mb-2">
            {t('leaderboard.joinCta', 'Want to join the leaderboard?')}
          </h3>
          <p className="text-blue-100 mb-4">
            {t('leaderboard.joinCtaDesc', 'Sign in to track your progress and compete with other learners')}
          </p>
          <Link
            to="/introduction"
            className="inline-block px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            {t('leaderboard.startLearning', 'Start learning')}
          </Link>
        </div>
      )}
    </div>
  )
}
