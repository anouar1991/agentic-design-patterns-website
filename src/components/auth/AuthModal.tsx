import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { SocialAuth } from './SocialAuth'

type AuthView = 'login' | 'signup'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: AuthView
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const { t } = useTranslation()
  const [view, setView] = useState<AuthView>(initialView)

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView)
    }
  }, [isOpen, initialView])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleSuccess = () => {
    onClose()
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto bg-dark-900 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-dark-50">
                {view === 'login'
                  ? t('auth.welcomeBack', 'Welcome back')
                  : t('auth.createAccountTitle', 'Create your account')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-dark-400 hover:text-dark-200 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Social auth */}
              <SocialAuth />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-900 text-dark-400">
                    {t('auth.orContinueWith', 'or continue with email')}
                  </span>
                </div>
              </div>

              {/* Email form */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, x: view === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: view === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {view === 'login' ? (
                    <LoginForm
                      onSuccess={handleSuccess}
                      onSwitchToSignup={() => setView('signup')}
                    />
                  ) : (
                    <SignupForm
                      onSuccess={handleSuccess}
                      onSwitchToLogin={() => setView('login')}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-dark-800/50 text-center text-xs text-dark-400">
              {t('auth.termsNotice', 'By continuing, you agree to our Terms of Service and Privacy Policy.')}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
