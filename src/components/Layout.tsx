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
  Trophy
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AmbientBackground from './AmbientBackground'
import RouteTransitionWrapper from './RouteTransitionWrapper'
import LanguageSwitcher from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { UserMenu } from './UserMenu'
import { layoutIds } from '../config/motion'
import { useProgress } from '../contexts/ProgressContext'

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
  const { completedChapters } = useProgress()
  const hasProgress = completedChapters.length > 0
  const navLinks = getNavLinks(t, hasProgress)

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
                  </Link>
                )
              })}
            </div>

            {/* User Menu, GitHub Link, Language Switcher & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
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
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
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
              className="md:hidden border-t border-dark-700/50"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-dark-700 text-white'
                          : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  )
                })}
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
