import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup: () => void
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { t } = useTranslation()
  const { signInWithEmail } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signInWithEmail(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-dark-300 mb-1">
          {t('auth.email', 'Email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2.5 border border-dark-600 rounded-lg bg-dark-800 text-white placeholder-dark-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-dark-300 mb-1">
          {t('auth.password', 'Password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-12 py-2.5 border border-dark-600 rounded-lg bg-dark-800 text-white placeholder-dark-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
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
          t('auth.signIn', 'Sign in')
        )}
      </button>

      <p className="text-center text-sm text-dark-400">
        {t('auth.noAccount', "Don't have an account?")}{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          {t('auth.signUp', 'Sign up')}
        </button>
      </p>
    </form>
  )
}
