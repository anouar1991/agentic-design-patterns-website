import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { chapterDetails } from '../data/chapters'
import { getChapterIcon } from '../utils/chapterIcons'

interface HeaderBreadcrumbProps {
  isCompact: boolean
}

/**
 * Animated breadcrumb that appears in the header when viewing a chapter page.
 * Shows: ← Chapters / [icon] Chapter N: Title
 * Animates on chapter navigation and collapses in compact (scrolled) mode.
 */
export default function HeaderBreadcrumb({ isCompact }: HeaderBreadcrumbProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  // Extract chapter number from pathname like /chapter/3
  const chapterNum = useMemo(() => {
    const match = location.pathname.match(/^\/chapter\/(\d+)/)
    return match ? parseInt(match[1], 10) : null
  }, [location.pathname])

  const chapter = chapterNum ? chapterDetails[chapterNum] : null

  if (!chapter || !chapterNum) return null

  const Icon = getChapterIcon(chapter.icon)

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 12 },
        transition: { type: 'spring' as const, stiffness: 500, damping: 35 },
      }

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        key={chapterNum}
        aria-label="Chapter breadcrumb"
        className={`hidden md:flex items-center gap-1 text-sm header-transition flex-shrink-0 ${
          isCompact ? 'max-w-[200px] lg:max-w-[280px]' : 'max-w-[220px] lg:max-w-[300px]'
        }`}
        {...animationProps}
      >
        {/* Back arrow to chapter list */}
        <button
          onClick={() => navigate('/chapters')}
          className="flex items-center gap-0.5 text-dark-400 hover:text-dark-100 transition-colors shrink-0 rounded-md px-1 py-0.5 hover:bg-dark-700/50"
          aria-label="Back to chapters"
          title="Back to chapters"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className={`header-transition ${isCompact ? 'text-xs' : 'text-sm'}`}>
            Chapters
          </span>
        </button>

        {/* Separator */}
        <ChevronRight className="w-3 h-3 text-dark-600 shrink-0" />

        {/* Chapter icon + name */}
        <Link
          to={`/chapter/${chapterNum}`}
          className="flex items-center gap-1.5 min-w-0 rounded-md px-1.5 py-0.5 hover:bg-dark-700/50 transition-colors"
        >
          <span
            className="flex items-center justify-center w-4 h-4 shrink-0 rounded"
            style={{ color: chapter.color }}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span
            className={`truncate font-medium header-transition ${
              isCompact ? 'text-xs' : 'text-sm'
            }`}
            style={{ color: chapter.color }}
            title={`Chapter ${chapterNum}: ${chapter.title}`}
          >
            {isCompact
              ? `Ch ${chapterNum}`
              : `Ch ${chapterNum}: ${chapter.shortTitle || chapter.title}`}
          </span>
        </Link>
      </motion.nav>
    </AnimatePresence>
  )
}
