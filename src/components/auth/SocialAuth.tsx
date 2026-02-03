import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Github } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function SocialAuth() {
  const { t } = useTranslation()
  const { signInWithGoogle, signInWithGithub } = useAuth()
  const [loading, setLoading] = useState<'google' | 'github' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGoogle = async () => {
    setLoading('google')
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setLoading(null)
    }
    // On success, redirect happens automatically
  }

  const handleGithub = async () => {
    setLoading('github')
    setError(null)
    const { error } = await signInWithGithub()
    if (error) {
      setError(error.message)
      setLoading(null)
    }
    // On success, redirect happens automatically
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogle}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-dark-600 rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === 'google' ? (
          <div className="w-5 h-5 border-2 border-dark-400 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="text-dark-200">
          {t('auth.continueWithGoogle', 'Continue with Google')}
        </span>
      </button>

      <button
        onClick={handleGithub}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-dark-600 rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === 'github' ? (
          <div className="w-5 h-5 border-2 border-dark-400 border-t-white rounded-full animate-spin" />
        ) : (
          <Github className="w-5 h-5 text-white" />
        )}
        <span className="text-dark-200">
          {t('auth.continueWithGithub', 'Continue with GitHub')}
        </span>
      </button>
    </div>
  )
}
