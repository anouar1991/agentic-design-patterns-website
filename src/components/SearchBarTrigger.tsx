import { memo, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// ─── Platform Detection ──────────────────────────────────────────

function getIsMac(): boolean {
  if (typeof navigator === 'undefined') return false
  // Modern API first, fallback to legacy
  const platform =
    (navigator as { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    ''
  return /mac/i.test(platform)
}

// ─── Component ───────────────────────────────────────────────────

interface SearchBarTriggerProps {
  onClick: () => void
  isCompact?: boolean
}

const SearchBarTrigger = memo(function SearchBarTrigger({
  onClick,
  isCompact = false,
}: SearchBarTriggerProps) {
  const { t } = useTranslation()
  const isMac = useMemo(getIsMac, [])
  const modifierKey = isMac ? '⌘' : 'Ctrl'

  return (
    <button
      onClick={onClick}
      className={`
        search-bar-trigger group
        hidden sm:flex items-center
        rounded-xl border
        bg-dark-800/60 border-dark-700/40
        text-dark-400
        hover:bg-dark-800/90 hover:border-dark-600/60 hover:text-dark-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900
        transition-all duration-200
        ${isCompact
          ? 'gap-1.5 px-2.5 py-1 w-36'
          : 'gap-2.5 px-3 py-1.5 w-36 lg:w-44 xl:w-52'
        }
      `}
      aria-label={t('search.placeholder')}
      type="button"
    >
      <Search className={`flex-shrink-0 text-dark-500 group-hover:text-dark-400 transition-colors ${isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />

      <span className={`flex-1 text-left truncate text-dark-500 group-hover:text-dark-400 transition-colors ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
        {t('search.trigger')}...
      </span>

      <kbd className={`
        inline-flex items-center gap-0.5
        rounded-md
        bg-dark-700/50 border border-dark-600/30
        text-dark-500 font-mono
        group-hover:border-dark-500/40 group-hover:text-dark-400
        transition-colors
        ${isCompact ? 'px-1 py-0 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'}
      `}>
        {modifierKey}<span className="font-sans">+</span>K
      </kbd>
    </button>
  )
})

export default SearchBarTrigger
