import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin: () => void
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { t } = useTranslation()
  const { signUpWithEmail } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch', 'Passwords do not match'))
      return
    }

    if (password.length < 6) {
      setError(t('auth.passwordTooShort', 'Password must be at least 6 characters'))
      return
    }

    setLoading(true)

    const { error } = await signUpWithEmail(email, password, displayName || undefined)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // In most cases, Supabase sends a confirmation email
      // If email confirmation is disabled, call onSuccess
      setTimeout(() => onSuccess?.(), 2000)
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-dark-50 mb-2">
          {t('auth.checkEmail', 'Check your email')}
        </h3>
        <p className="text-dark-400">
          {t('auth.confirmationSent', "We've sent you a confirmation link. Please check your inbox.")}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="signup-name" className="block text-sm font-medium text-dark-300 mb-1">
          {t('auth.displayName', 'Display name')} <span className="text-dark-500">({t('auth.optional', 'optional')})</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            id="signup-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-dark-600 rounded-lg bg-dark-800 text-dark-50 placeholder-dark-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('auth.displayNamePlaceholder', 'Your name')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-dark-300 mb-1">
          {t('auth.email', 'Email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2.5 border border-dark-600 rounded-lg bg-dark-800 text-dark-50 placeholder-dark-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-dark-300 mb-1">
          {t('auth.password', 'Password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full pl-10 pr-12 py-2.5 border border-dark-600 rounded-lg bg-dark-800 text-dark-50 placeholder-dark-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="signup-confirm" className="block text-sm font-medium text-dark-300 mb-1">
          {t('auth.confirmPassword', 'Confirm password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            id="signup-confirm"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2.5 border border-dark-600 rounded-lg bg-dark-800 text-dark-50 placeholder-dark-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          t('auth.createAccount', 'Create account')
        )}
      </button>

      <p className="text-center text-sm text-dark-400">
        {t('auth.hasAccount', 'Already have an account?')}{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          {t('auth.signIn', 'Sign in')}
        </button>
      </p>
    </form>
  )
}
