import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { User, LogOut, Settings, Trophy, ChevronDown, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { AuthModal } from './auth'
import { CountrySelect, type CountryCode } from './auth/CountrySelect'

export function UserMenu() {
  const { t } = useTranslation()
  const { user, profile, loading, isConfigured, signOut, updateProfile } = useAuth()

  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setShowCountryPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
  }

  const handleCountryChange = async (code: CountryCode) => {
    await updateProfile({ country_code: code })
    setShowCountryPicker(false)
  }

  // Not configured - hide entirely
  if (!isConfigured) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-dark-700 animate-pulse" />
    )
  }

  // Not logged in - show sign in button
  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-dark-200 hover:text-blue-400 transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{t('auth.signIn', 'Sign in')}</span>
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialView="login"
        />
      </>
    )
  }

  // Logged in - show user menu
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-dark-800 transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-dark-800"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-dark-200 max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-dark-900 rounded-xl shadow-lg border border-dark-700 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-dark-700">
              <p className="text-sm font-medium text-dark-50 truncate">
                {displayName}
              </p>
              <p className="text-xs text-dark-400 truncate">
                {user.email}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-dark-200 hover:bg-dark-800 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                {t('auth.myProgress', 'My Progress')}
              </Link>

              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-dark-200 hover:bg-dark-800 transition-colors"
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
                {t('nav.leaderboard', 'Leaderboard')}
              </Link>

              <button
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dark-200 hover:bg-dark-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-dark-400" />
                {t('auth.setCountry', 'Set country')}
                {profile?.country_code && (
                  <span className="ml-auto text-xs font-mono text-dark-400">
                    {profile.country_code}
                  </span>
                )}
              </button>

              {showCountryPicker && (
                <div className="px-4 py-2">
                  <CountrySelect
                    value={profile?.country_code as CountryCode || null}
                    onChange={handleCountryChange}
                  />
                </div>
              )}
            </div>

            {/* Sign out */}
            <div className="border-t border-dark-700 py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('auth.signOut', 'Sign out')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
