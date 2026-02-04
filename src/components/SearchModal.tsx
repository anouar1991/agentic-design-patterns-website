import { memo, useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Code2, ArrowRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import { chapterDetails } from '../data/chapters'
import { codeTerms, type CodeTerm } from '../data/codeTerms'
import { concepts } from '../data/concepts'

// ─── Search Index Types ───────────────────────────────────────────

interface SearchItem {
  type: 'chapter' | 'codeTerm' | 'concept'
  id: string
  title: string
  subtitle: string
  chapterNum?: number
  color?: string
  /** For code terms, the term object for modal opening */
  codeTerm?: CodeTerm
}

// ─── Build Static Index ───────────────────────────────────────────

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // Index chapters
  for (const [num, ch] of Object.entries(chapterDetails)) {
    items.push({
      type: 'chapter',
      id: `chapter-${num}`,
      title: ch.title,
      subtitle: ch.description,
      chapterNum: Number(num),
      color: ch.color,
    })
  }

  // Index code terms
  for (const term of Object.values(codeTerms)) {
    items.push({
      type: 'codeTerm',
      id: `term-${term.id}`,
      title: term.name,
      subtitle: term.shortDescription,
      codeTerm: term,
    })
  }

  // Index concepts
  for (const concept of Object.values(concepts)) {
    items.push({
      type: 'concept',
      id: `concept-${concept.id}`,
      title: concept.name,
      subtitle: concept.shortDescription,
    })
  }

  return items
}

const searchIndex = buildSearchIndex()

// ─── Fuzzy Search ─────────────────────────────────────────────────

function scoreMatch(query: string, item: SearchItem): number {
  const q = query.toLowerCase()
  const title = item.title.toLowerCase()
  const subtitle = item.subtitle.toLowerCase()

  // Exact title match
  if (title === q) return 100

  // Title starts with query
  if (title.startsWith(q)) return 90

  // Title contains query as a word boundary
  if (title.includes(q)) return 70

  // Subtitle contains query
  if (subtitle.includes(q)) return 40

  // Fuzzy: all query chars appear in order in title
  let ti = 0
  for (let qi = 0; qi < q.length && ti < title.length; ti++) {
    if (title[ti] === q[qi]) qi++
    if (qi === q.length) return 20
  }

  return 0
}

function search(query: string): SearchItem[] {
  if (!query.trim()) return []
  const scored = searchIndex
    .map(item => ({ item, score: scoreMatch(query, item) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
  return scored.slice(0, 12).map(s => s.item)
}

// ─── Type Badge Component ─────────────────────────────────────────

const TypeBadge = memo(function TypeBadge({ type }: { type: SearchItem['type'] }) {
  const config = {
    chapter: { label: 'Chapter', bg: 'bg-primary-500/20', text: 'text-primary-300', icon: BookOpen },
    codeTerm: { label: 'Code', bg: 'bg-emerald-500/20', text: 'text-emerald-300', icon: Code2 },
    concept: { label: 'Concept', bg: 'bg-amber-500/20', text: 'text-amber-300', icon: BookOpen },
  }
  const c = config[type]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
});

// ─── Highlight matched text ───────────────────────────────────────

const HighlightText = memo(function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary-500/30 text-inherit font-semibold rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
});

// ─── Modal Component ──────────────────────────────────────────────

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenCodeTerm?: (term: CodeTerm) => void
}

export default function SearchModal({ isOpen, onClose, onOpenCodeTerm }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => search(query), [query])

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      // Focus after animation frame
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0)
  }, [results.length])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.children[selectedIndex] as HTMLElement
    selected?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const handleSelect = useCallback((item: SearchItem) => {
    onClose()
    if (item.type === 'chapter' && item.chapterNum) {
      navigate(`/chapter/${item.chapterNum}`)
    } else if (item.type === 'codeTerm' && item.codeTerm && onOpenCodeTerm) {
      onOpenCodeTerm(item.codeTerm)
    } else if (item.type === 'concept') {
      // Find which chapter introduces this concept and navigate there
      const conceptId = item.id.replace('concept-', '')
      for (const [num, ch] of Object.entries(chapterDetails)) {
        if (ch.conceptsIntroduced?.includes(conceptId)) {
          navigate(`/chapter/${num}`)
          return
        }
      }
      // Fallback: go to chapters list
      navigate('/chapters')
    }
  }, [navigate, onClose, onOpenCodeTerm])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }, [results, selectedIndex, handleSelect, onClose])

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-dark-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed z-[101] top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Search chapters, code terms, and concepts"
          >
            <div className="mx-4 bg-dark-900 border border-dark-700/60 rounded-2xl shadow-2xl shadow-dark-950/50 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-700/40">
                <Search className="w-5 h-5 text-dark-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search chapters, code terms, concepts..."
                  className="flex-1 bg-transparent text-dark-50 placeholder:text-dark-500 outline-none text-sm"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-dark-800 border border-dark-700/50 text-dark-400 text-xs hover:text-dark-200 transition-colors"
                >
                  <span>esc</span>
                </button>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain">
                {query.trim() && results.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-dark-400 text-sm">No results found for "{query}"</p>
                    <p className="text-dark-500 text-xs mt-1">Try a different search term</p>
                  </div>
                )}

                {results.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${idx === selectedIndex ? 'bg-dark-800/80' : 'hover:bg-dark-800/40'}
                      ${idx > 0 ? 'border-t border-dark-800/40' : ''}
                    `}
                  >
                    {/* Color dot for chapters */}
                    {item.type === 'chapter' && item.color && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.type === 'chapter' && item.chapterNum && (
                          <span className="text-dark-500 text-xs font-mono">Ch.{item.chapterNum}</span>
                        )}
                        <span className="text-dark-100 text-sm font-medium truncate">
                          <HighlightText text={item.title} query={query} />
                        </span>
                      </div>
                      <p className="text-dark-400 text-xs truncate mt-0.5">
                        <HighlightText text={item.subtitle} query={query} />
                      </p>
                    </div>

                    <TypeBadge type={item.type} />

                    {idx === selectedIndex && (
                      <ArrowRight className="w-4 h-4 text-dark-400 flex-shrink-0" />
                    )}
                  </button>
                ))}

                {/* Empty state when no query */}
                {!query.trim() && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-dark-400 text-sm">Search across all chapters, code terms, and concepts</p>
                    <div className="flex items-center justify-center gap-4 mt-3 text-dark-500 text-xs">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700/50 text-[10px]">↑↓</kbd>
                        Navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700/50 text-[10px]">↵</kbd>
                        Select
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700/50 text-[10px]">esc</kbd>
                        Close
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="px-4 py-2 border-t border-dark-700/40 flex items-center justify-between text-dark-500 text-xs">
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700/50 text-[10px]">↑↓</kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-dark-800 border border-dark-700/50 text-[10px]">↵</kbd>
                      go
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ─── Hook for Cmd+K Global Shortcut ───────────────────────────────

export function useSearchShortcut() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
  }
}
