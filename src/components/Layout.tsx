import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Home,
  Map,
  Code,
  Github,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Trophy,
  CheckCircle2
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AmbientBackground from './AmbientBackground'
import RouteTransitionWrapper from './RouteTransitionWrapper'
import LanguageSwitcher from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { UserMenu } from './UserMenu'
import { layoutIds } from '../config/motion'
import { useProgress } from '../contexts/ProgressContext'

const TOTAL_CHAPTERS = 21

const getNavLinks = (t: (key: string) => string, hasProgress: boolean) => [
  { to: '/', label: t('nav.home'), icon: Home },
  { to: '/introduction', label: hasProgress ? t('nav.continue') : t('nav.startHere'), icon: GraduationCap },
  { to: '/chapters', label: t('nav.chapters'), icon: BookOpen },
  { to: '/learning-path', label: t('nav.learningPath'), icon: Map },
  { to: '/playground', label: t('nav.playground'), icon: Code },
  { to: '/leaderboard', label: t('nav.leaderboard'), icon: Trophy },
]

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { completedChapters, completionPercentage } = useProgress()
  const hasProgress = completedChapters.length > 0
  const navLinks = getNavLinks(t, hasProgress)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold gradient-text">{t('header.title')}</h1>
                <p className="text-xs text-dark-400">{t('header.subtitle')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      relative px-4 py-2 rounded-lg flex items-center gap-2
                      transition-all duration-200
                      ${isActive
                        ? 'text-white'
                        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={layoutIds.navActive}
                        className="absolute inset-0 bg-dark-700/80 rounded-lg"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                    {/* Active bottom indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-[1px] left-2 right-2 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Menu, GitHub Link, Language Switcher & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Progress indicator pill - shows when user has progress */}
              {hasProgress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-800/80 border border-dark-700/50"
                >
                  <div className="relative w-5 h-5">
                    <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                      <circle
                        cx="10" cy="10" r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-dark-700"
                      />
                      <motion.circle
                        cx="10" cy="10" r="8"
                        fill="none"
                        stroke="url(#progress-gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 8}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 8 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 8 * (1 - completionPercentage / 100) }}
                        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                      />
                      <defs>
                        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-primary-400)" />
                          <stop offset="100%" stopColor="var(--color-accent-400)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-dark-300">
                    {completedChapters.length}/{TOTAL_CHAPTERS}
                  </span>
                </motion.div>
              )}

              {/* User Menu */}
              <UserMenu />

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Language Switcher */}
              <LanguageSwitcher />

              <a
                href="https://github.com/sarwarbeing-ai/Agentic_Design_Patterns"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors text-dark-300 hover:text-white"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">{t('nav.github')}</span>
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden border-t border-dark-700/50 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {/* Mobile progress bar */}
                {hasProgress && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-dark-800/60"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-dark-300">{t('nav.progress')}</span>
                        <span className="text-xs font-medium text-primary-400">
                          {completedChapters.length}/{TOTAL_CHAPTERS}
                        </span>
                      </div>
                      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ type: 'spring', stiffness: 100, damping: 30, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {navLinks.map((link, index) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.to
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-white border border-primary-500/20'
                            : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                        <span className="flex-1">{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-nav-active"
                            className="w-1.5 h-1.5 rounded-full bg-primary-400"
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Mobile completed chapters badges */}
                {hasProgress && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 px-4 py-2 mt-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-dark-400">
                      {completedChapters.length} {completedChapters.length === 1 ? 'chapter' : 'chapters'} completed
                    </span>
                  </motion.div>
                )}

                <a
                  href="https://github.com/sarwarbeing-ai/Agentic_Design_Patterns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                  {t('nav.viewOnGithub')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Ambient Background - persistent across route changes */}
      <AmbientBackground />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <RouteTransitionWrapper />
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800/40 bg-dark-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-dark-300">
                  {t('footer.basedOn')}{' '}
                  <span className="text-white font-medium">
                    "{t('footer.bookTitle')}"
                  </span>{' '}
                  {t('footer.byAuthor')}
                </p>
                <p className="text-xs text-dark-500">
                  {t('footer.royalties')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-dark-400">
              <a
                href="https://www.amazon.com/Agentic-Design-Patterns-Hands-Intelligent/dp/3032014018/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {t('footer.getBook')}
              </a>
              <a
                href="https://github.com/sarwarbeing-ai/Agentic_Design_Patterns"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {t('footer.sourceCode')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
