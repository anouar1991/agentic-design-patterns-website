import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  BookOpen,
  Home,
  Map,
  Code,
  Github,
  X,
  Sparkles,
  GraduationCap,
  Trophy,
  CheckCircle2,
  Search,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback, useMemo, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AmbientBackground from './AmbientBackground'
import RouteTransitionWrapper from './RouteTransitionWrapper'
import LanguageSwitcher from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { UserMenu } from './UserMenu'
import SearchBarTrigger from './SearchBarTrigger'
import HeaderProgressBar from './HeaderProgressBar'
import HeaderBreadcrumb from './HeaderBreadcrumb'
import { layoutIds } from '../config/motion'
import { useProgress } from '../contexts/ProgressContext'
import { useTheme } from '../contexts/ThemeContext'
import SearchModal, { useSearchShortcut } from './SearchModal'

const TOTAL_CHAPTERS = 21

const getNavLinks = (t: (key: string) => string, hasProgress: boolean, lastVisitedChapterId?: number | null) => [
  { to: '/', label: t('nav.home'), icon: Home },
  {
    to: hasProgress && lastVisitedChapterId ? `/chapter/${lastVisitedChapterId}` : '/introduction',
    label: hasProgress ? t('nav.continue') : t('nav.startHere'),
    icon: GraduationCap,
  },
  { to: '/chapters', label: t('nav.chapters'), icon: BookOpen },
  { to: '/learning-path', label: t('nav.learningPath'), icon: Map },
  { to: '/playground', label: t('nav.playground'), icon: Code },
  { to: '/leaderboard', label: t('nav.leaderboard'), icon: Trophy },
]

/* ─── Swipe threshold for closing the drawer (px) ─── */
const SWIPE_THRESHOLD = 80

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  navLinks: ReturnType<typeof getNavLinks>
  location: { pathname: string }
  hasProgress: boolean
  completedChapters: number[]
  completionPercentage: number
  openSearch: () => void
  t: (key: string) => string
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

function MobileDrawer({
  isOpen,
  onClose,
  navLinks,
  location,
  hasProgress,
  completedChapters,
  completionPercentage,
  openSearch,
  t,
  triggerRef,
}: MobileDrawerProps) {
  const { mode, setMode } = useTheme()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const touchDeltaRef = useRef(0)
  const [dragging, setDragging] = useState(false)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Focus the close button when drawer opens, restore focus on close
  useEffect(() => {
    if (isOpen) {
      // Small delay to let Framer Motion render the drawer first
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    } else {
      // Restore focus to the hamburger trigger
      triggerRef.current?.focus()
    }
  }, [isOpen, triggerRef])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Focus trap: cycle Tab within the drawer
  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const drawer = drawerRef.current
    if (!drawer) return
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  // Touch/swipe gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    touchDeltaRef.current = 0
    setDragging(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const dx = e.touches[0].clientX - touchStartRef.current.x
    const dy = e.touches[0].clientY - touchStartRef.current.y
    // Only track horizontal swipe (right direction)
    if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
      touchDeltaRef.current = dx
      setDragging(true)
      if (drawerRef.current) {
        drawerRef.current.style.transform = `translateX(${dx}px)`
        drawerRef.current.style.transition = 'none'
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return
    const dx = touchDeltaRef.current
    if (drawerRef.current) {
      drawerRef.current.style.transition = ''
      drawerRef.current.style.transform = ''
    }
    if (dx > SWIPE_THRESHOLD) {
      onClose()
    }
    touchStartRef.current = null
    touchDeltaRef.current = 0
    setDragging(false)
  }, [onClose])

  const themeModes = useMemo(() => [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'auto' as const, icon: Monitor, label: 'Auto' },
  ], [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={dragging ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[280px] max-w-[85vw] glass-header md:hidden flex flex-col overflow-y-auto overscroll-contain"
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold gradient-text">{t('header.title')}</span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-dark-700/50 transition-colors text-dark-400 hover:text-dark-50"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress section */}
            {hasProgress && (
              <div className="px-5 py-3 border-b border-dark-700/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-dark-300">{t('nav.progress')}</span>
                  <span className="text-xs font-medium text-primary-400">
                    {completedChapters.length}/{TOTAL_CHAPTERS}
                  </span>
                </div>
                <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: completionPercentage / 100 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 30, delay: 0.1 }}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px] text-dark-400">
                    {completedChapters.length} {completedChapters.length === 1 ? 'chapter' : 'chapters'} completed
                  </span>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <div className="flex-1 px-3 py-3 space-y-0.5">
              {navLinks.map((link, index) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-dark-50 border border-primary-500/20'
                          : 'text-dark-400 hover:bg-dark-800/60 hover:text-dark-50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                      <span className="flex-1 text-sm">{link.label}</span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom section: Search, Theme toggle, GitHub */}
            <div className="border-t border-dark-700/30 px-3 py-3 space-y-1">
              {/* Search */}
              <button
                onClick={() => { onClose(); openSearch() }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-400 hover:bg-dark-800/60 hover:text-dark-50 transition-colors w-full"
              >
                <Search className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm flex-1 text-left">{t('search.trigger')}</span>
              </button>

              {/* Dark mode toggle */}
              <div className="flex items-center gap-1 px-3 py-2">
                <span className="text-xs text-dark-400 mr-auto">Theme</span>
                {themeModes.map(({ value, icon: ThemeIcon, label }) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`p-1.5 rounded-md transition-colors ${
                      mode === value
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-dark-500 hover:text-dark-300 hover:bg-dark-700/50'
                    }`}
                    aria-label={`${label} theme`}
                    title={label}
                  >
                    <ThemeIcon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/sarwarbeing-ai/Agentic_Design_Patterns"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-400 hover:bg-dark-800/60 hover:text-dark-50 transition-colors"
              >
                <Github className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{t('nav.viewOnGithub')}</span>
              </a>
            </div>

            {/* Swipe hint */}
            <div className="px-5 py-2 text-center">
              <span className="text-[10px] text-dark-600">Swipe right to close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { completedChapters, completionPercentage, lastVisited } = useProgress()
  const { isSearchOpen, openSearch, closeSearch } = useSearchShortcut()
  const prefersReducedMotion = useReducedMotion()
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const hasProgress = completedChapters.length > 0 || !!lastVisited
  const navLinks = getNavLinks(t, hasProgress, lastVisited?.chapterId)

  // Scroll-aware header compacting
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollRef = useRef(false)
  const rafRef = useRef<number>(0)

  const handleScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      const scrolled = window.scrollY > 32
      if (scrollRef.current !== scrolled) {
        scrollRef.current = scrolled
        setIsScrolled(scrolled)
      }
      rafRef.current = 0
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-500 focus:text-white focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-dark-900"
      >
        {t('nav.skipToContent', 'Skip to main content')}
      </a>

      {/* Navigation */}
      <nav aria-label={t('nav.primary', 'Primary')} className={`fixed top-0 left-0 right-0 z-50 glass-header header-transition ${isScrolled ? 'header-compact' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between header-transition ${isScrolled ? 'h-12' : 'h-16'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className={`relative header-transition ${isScrolled ? 'scale-[0.85]' : 'scale-100'}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-semibold tracking-tight gradient-text header-transition ${isScrolled ? 'text-base' : 'text-lg'}`}>{t('header.title')}</h1>
                <p className={`text-[11px] text-dark-400 tracking-wide header-transition ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>{t('header.subtitle')}</p>
              </div>
            </Link>

            {/* Breadcrumb - visible on chapter pages */}
            <HeaderBreadcrumb isCompact={isScrolled} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1 relative min-w-0 flex-1 justify-center overflow-hidden">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                const springTransition = prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring' as const, stiffness: 500, damping: 30 }
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      nav-link relative px-2 lg:px-4 py-2 rounded-lg flex items-center gap-2
                      transition-all duration-200
                      ${isActive
                        ? 'text-dark-50'
                        : 'text-dark-400 hover:text-dark-100'
                      }
                    `}
                    title={link.label}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={layoutIds.navActive}
                        className="absolute inset-0 bg-dark-700/80 rounded-lg"
                        initial={false}
                        transition={springTransition}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className={`w-4 h-4 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                      <span className="hidden lg:inline">{link.label}</span>
                    </span>
                    {/* Active bottom indicator line with glow */}
                    {isActive && (
                      <motion.div
                        layoutId={layoutIds.navUnderline}
                        className="absolute -bottom-[1px] left-2 right-2 h-0.5 nav-underline-glow rounded-full"
                        initial={false}
                        transition={springTransition}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Search, User Menu, GitHub Link, Language Switcher & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search trigger - prominent Spotlight-style bar */}
              <SearchBarTrigger onClick={openSearch} isCompact={isScrolled} />

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
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-dark-800/50 light:bg-white/80 hover:bg-dark-700 light:hover:bg-gray-100 transition-colors text-dark-300 light:text-gray-600 hover:text-dark-50"
                aria-label={t('nav.viewOnGithub', 'View on GitHub')}
                title={t('nav.github')}
              >
                <Github className="w-4 h-4" />
              </a>

              {/* Mobile menu button - animated hamburger to X */}
              <button
                ref={hamburgerRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-drawer"
              >
                <div className="hamburger-icon" aria-hidden="true">
                  <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-open' : ''}`} />
                  <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-open' : ''}`} />
                  <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-open' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Course progress bar at bottom edge of header */}
        <HeaderProgressBar />
      </nav>

      {/* Mobile Slide-Out Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        location={location}
        hasProgress={hasProgress}
        completedChapters={completedChapters}
        completionPercentage={completionPercentage}
        openSearch={openSearch}
        t={t}
        triggerRef={hamburgerRef}
      />

      {/* Ambient Background - persistent across route changes */}
      <AmbientBackground />

      {/* Main Content */}
      <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
        <RouteTransitionWrapper />
      </main>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Footer */}
      <footer className="border-t border-dark-700/40 bg-dark-950/80 no-print" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-dark-300">
                  {t('footer.basedOn')}{' '}
                  <span className="text-dark-50 font-medium">
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
                className="hover:text-dark-50 transition-colors"
              >
                {t('footer.getBook')}
              </a>
              <a
                href="https://github.com/sarwarbeing-ai/Agentic_Design_Patterns"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dark-50 transition-colors"
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
