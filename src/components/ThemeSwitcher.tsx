import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const { mode, theme, setMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options = [
    { value: 'light' as const, icon: Sun, label: t('theme.light', 'Light') },
    { value: 'dark' as const, icon: Moon, label: t('theme.dark', 'Dark') },
    { value: 'auto' as const, icon: Monitor, label: t('theme.auto', 'Auto') },
  ]

  const CurrentIcon = mode === 'auto' ? Monitor : theme === 'light' ? Sun : Moon

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark-800/50 light:bg-white/80 hover:bg-dark-700 light:hover:bg-gray-100 text-dark-300 light:text-gray-600 transition-colors"
        aria-label={t('theme.switchTheme', 'Switch theme')}
      >
        <CurrentIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-dark-900 light:bg-white rounded-xl shadow-lg border border-dark-700 light:border-gray-200 overflow-hidden z-50"
          >
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = mode === option.value

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setMode(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    ${isSelected
                      ? 'bg-primary-500/10 text-primary-400 light:bg-primary-50 light:text-primary-600'
                      : 'text-dark-200 light:text-gray-700 hover:bg-dark-800 light:hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className="ml-auto text-primary-400 light:text-primary-600">✓</span>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
