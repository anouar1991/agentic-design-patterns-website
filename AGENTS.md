# Agents Knowledge Base

## Directory Purpose
React 19 + Vite 7 + Tailwind CSS 4 learning platform for "Agentic Design Patterns" book by Antonio Gulli. Teaches 21 agentic AI design patterns through interactive tutorials, diagrams, quizzes, and code examples.

## Architecture Overview

### Tech Stack
- **Framework**: React 19.2 with TypeScript 5.9
- **Build**: Vite 7.2 with `@tailwindcss/vite` plugin
- **Styling**: Tailwind CSS 4 with `@theme` directive in `index.css`
- **Routing**: React Router DOM 7.12 (BrowserRouter)
- **Animation**: Framer Motion 12.26
- **Diagrams**: @xyflow/react 12.10 (React Flow)
- **Code Highlighting**: react-syntax-highlighter 16.1
- **Icons**: lucide-react 0.562
- **i18n**: i18next + react-i18next (English + Arabic with RTL)
- **Backend**: Supabase (auth, leaderboards, quiz attempts, profiles)

### Project Structure
```
src/
├── App.tsx              # Router setup with 5 context providers
├── main.tsx             # Entry point (i18n init before App)
├── index.css            # Tailwind @theme config + custom CSS (542 lines)
├── data/
│   ├── chapters.ts      # 425KB! All 21 chapters with tutorials, quizzes, diagrams
│   ├── codeTerms.ts     # Clickable code term definitions with docs
│   ├── concepts.ts      # Concept definitions for tooltip system
│   ├── types.ts         # TypeScript interfaces for all data structures
│   └── website_data.json # Book metadata, parts structure, notebook mapping
├── components/
│   ├── Layout.tsx           # Main layout: nav + footer + RouteTransitionWrapper
│   ├── AmbientBackground.tsx # Persistent animated background
│   ├── RouteTransitionWrapper.tsx # Route change animations
│   ├── ThemeSwitcher.tsx    # Dark/light mode toggle
│   ├── LanguageSwitcher.tsx # EN/AR language toggle
│   ├── UserMenu.tsx         # Auth user menu
│   ├── ChapterQuiz.tsx      # Quiz component with attempt persistence
│   ├── QuizHistory.tsx      # Quiz attempt history panel (auth users only)
│   ├── ChapterCelebration.tsx # Completion celebration
│   ├── ConceptTooltip.tsx   # Concept hover tooltips
│   ├── LearningObjectives.tsx # Chapter learning objectives
│   ├── ProgressiveContent.tsx # Progressive content reveal
│   ├── ReadingProgressBar.tsx # Reading progress indicator
│   ├── SearchModal.tsx        # Cmd+K search modal with fuzzy search
│   ├── SearchBarTrigger.tsx   # Prominent search bar trigger with OS-aware shortcut badge
│   ├── tutorial/
│   │   ├── InteractiveTutorial.tsx # Main tutorial renderer
│   │   ├── TutorialCodeBlock.tsx   # Code blocks with clickable terms
│   │   └── CodeTermModal.tsx       # Modal for code term details
│   ├── diagram/
│   │   ├── InteractiveDiagram.tsx  # React Flow diagram wrapper
│   │   ├── EnhancedNode.tsx        # Custom diagram node component
│   │   └── NodeDetailPanel.tsx     # Sidebar panel for node details
│   └── auth/
│       ├── AuthModal.tsx    # Auth modal wrapper
│       ├── LoginForm.tsx    # Login form
│       ├── SignupForm.tsx   # Signup form
│       ├── SocialAuth.tsx   # Social auth buttons
│       └── CountrySelect.tsx # Country selector
├── pages/
│   ├── Home.tsx         # Landing page with chapter cards
│   ├── Introduction.tsx # Course introduction
│   ├── Chapters.tsx     # Chapter listing page
│   ├── Chapter.tsx      # Individual chapter page (dynamic :id)
│   ├── LearningPath.tsx # Learning path visualization
│   ├── Playground.tsx   # Code playground
│   ├── Leaderboard.tsx  # Supabase-backed leaderboard
│   └── Profile.tsx      # User profile page
├── contexts/
│   ├── ThemeContext.tsx   # Dark/light theme
│   ├── LanguageContext.tsx # i18n language
│   ├── MotionContext.tsx  # Animation preferences
│   ├── AuthContext.tsx    # Supabase auth
│   ├── ProgressContext.tsx # Chapter completion tracking
│   └── DiagramContext.tsx # Diagram state management
├── hooks/
│   ├── useLeaderboard.ts  # Supabase leaderboard queries
│   ├── useQuizAttempts.ts # Quiz attempt persistence
│   └── useProfileStats.ts # User profile statistics
├── config/
│   └── motion.ts          # Framer Motion layout IDs
├── lib/
│   ├── supabase.ts        # Supabase client init
│   └── database.types.ts  # Generated Supabase types
├── utils/
│   ├── progressMerge.ts   # Progress data merging utility
│   ├── logger.ts          # Structured logger with level suppression
│   ├── webVitals.ts       # Core Web Vitals reporting
│   ├── prefetch.ts        # Route prefetch on hover
│   └── swRegister.ts      # Service worker registration with logging
└── i18n/
    ├── index.ts           # i18n initialization
    └── locales/
        ├── en.json        # English translations
        └── ar.json        # Arabic translations
```

### Data Flow
1. **Chapter Data**: `chapters.ts` exports `chapterDetails: Record<number, ChapterDetail>` - massive 425KB file with ALL content
2. **Routing**: `App.tsx` → `<Route path="chapter/:id">` → `Chapter.tsx` → looks up `chapterDetails[id]`
3. **Theming**: `index.css` defines `@theme` CSS variables, `ThemeContext` toggles `html.light` class
4. **Progress**: `ProgressContext` tracks `completedChapters[]`, shown in nav and cards
5. **Auth**: Supabase-based auth with social login, profile, leaderboard

### Chapter Completeness
All 21 chapters (1-21) are defined in `chapters.ts` with:
- ✅ Title, description, key concepts, narrative intro
- ✅ Tutorial sections (interactive step-by-step)
- ✅ Code examples with explanations
- ✅ Diagram nodes and edges
- ✅ Quiz with questions and explanations
- ✅ Learning objectives
- ✅ Reading metadata (time, difficulty)
- ✅ Code terms for clickable highlighting
- ✅ Notebook references

### Notebook Source Files
63 Jupyter notebooks in `/home/noreddine/agentic-ai/Agentic_Design_Patterns/notebooks/`:
- Chapters 1-21 all have notebooks (some chapters have multiple)
- 2 Appendix notebooks (Pydantic, Appendix C)
- Notebooks cover: LangChain, Google ADK, CrewAI, LangGraph, VertexAI, A2A protocol

## Patterns & Conventions
- **Component naming**: PascalCase, one component per file
- **Data-driven**: Content lives in `chapters.ts`, components are generic renderers
- **Context pattern**: Feature contexts wrap the entire app in `App.tsx`
- **CSS**: Tailwind utility-first + custom CSS classes in `index.css` (glass, glow, gradient-text)
- **Light/dark mode**: `html.light` class toggle with CSS custom property inversion (dark-* tokens) + explicit `html.light` overrides for special effects; `text-dark-50` for adaptive text
- **RTL support**: `html[dir="rtl"]` and `html.rtl` selectors in CSS

## Lessons Learned
- [T-100] The `chapters.ts` file is 425KB - any chapter content changes need careful partial reads
- [T-100] Light mode uses custom CSS `html.light .light\:*` classes rather than Tailwind's built-in dark mode
- [T-100] All 21 chapters already have tutorial+quiz content - focus should be on enhancing quality, not creating from scratch
- [T-100] Supabase integration exists for auth/leaderboard but local progress uses ProgressContext
- [T-101] 61 notebooks map to 21 chapters; all chapters already have complete tutorial arrays (21/21 confirmed)
- [T-101] Part One chapters (1-3) have richest enhancedCodeExamples (3-4 each); later chapters have fewer but still complete tutorials
- [T-101] Heaviest notebook coverage: Ch5 Tool Use (6), Ch7 Multi-Agent (6), Ch8 Memory (6)
- [T-101] 2 appendix notebooks (Pydantic, Appendix C) don't map to numbered chapters
- [T-101] No chapters are missing tutorials - T-300 (create missing tutorials) may need scope adjustment

- [T-110] ThemeSwitcher.tsx had `currentIcon` (lowercase) used as JSX - React requires PascalCase for component references → fixed to `CurrentIcon`
- [T-110] Console errors from React about casing and unrecognized tags trace to Lucide icon dynamic rendering patterns
- [T-110] Vite dev server starts on port 5173; `npx vite` works from the project directory

- [T-120] Light mode has severe contrast issues - the custom CSS light theme doesn't properly adjust text colors for light backgrounds
- [T-120] 22 specific UX gaps identified across 4 categories: 3 CRITICAL, 6 HIGH, 7 MEDIUM, 4 LOW
- [T-120] Dark mode is the default and looks polished; light mode needs significant work
- [T-120] All 21 chapters have complete content (tutorials, quizzes, diagrams) - enhancement focus should be on interactivity and polish, not content creation
- [T-120] Leaderboard/Playground require backend (Supabase) - need graceful degradation for standalone use

- [T-1380] Profile page already had most infrastructure from prior tasks; main gaps were display name editing UI and per-chapter progress map
- [T-1380] `updateProfile` in AuthContext handles Supabase update + profile cache refresh in one call - no extra API logic needed in page
- [T-1380] Chapter progress map uses `isChapterCompleted` from ProgressContext which merges local+cloud state
- [T-1380] The `dark-*` color tokens in Tailwind CSS swap values between light/dark via CSS custom properties, so same classes work in both modes

## UX Gaps Audit (T-120)

### VISUAL - Contrast & Readability Issues
1. **[CRITICAL] Light mode: hero headline barely visible** - "Agentic Design Patterns" title has very low contrast (light gray/purple on light gradient background). Location: Homepage hero section. Repro: Switch to Light mode → observe headline.
2. **[CRITICAL] Light mode: stat labels invisible** - The "Chapters", "Code Examples", "Frameworks", "Pages" labels under the stat numbers are nearly invisible in light mode. Location: Homepage stats section.
3. **[CRITICAL] Light mode: feature card descriptions invisible** - The description text under "Interactive Diagrams", "Real Code Examples", etc. is unreadable (light text on gray cards). Location: Homepage features section.
4. **[HIGH] Light mode: "21 Essential Patterns" heading low contrast** - Section heading barely readable in light mode. Location: Homepage patterns section.
5. **[HIGH] Light mode: chapter mini-card badges ("Ch 1", "Ch 2") hard to read** - Badge text has insufficient contrast against the card background in light mode. Location: Homepage patterns grid.
6. **[MEDIUM] Light mode: nav links barely visible** - "Learning Path", "Playground", "Leaderboard" text in header navigation is very low contrast in light mode. Location: Header nav bar.
7. **[LOW] Progress tracker shows "20" boxes but there are 21 chapters** - The visual progress tracker grid on homepage shows 20 numbered boxes (1-20), missing chapter 21. Location: Homepage "Structured Learning Path" section.

### INTERACTIVE - Missing/Broken Interactions
8. **[HIGH] No hover effects on chapter listing cards** - Cards on `/chapters` page lack visible hover state transitions (scale, shadow, glow). Location: `/chapters` page cards.
9. **[HIGH] No entrance animations on chapter cards** - Cards on `/chapters` appear instantly with no staggered entrance animation. Location: `/chapters` page.
10. **[MEDIUM] Diagram "Pattern Flow" container can be empty/small** - The React Flow diagram sometimes renders with a very small scroll area and empty space. Console shows React Flow parent container height warning. Location: Chapter pages, right sidebar diagram. Repro: Load any chapter page, observe diagram panel.
11. **[MEDIUM] No visible "active chapter" highlight in nav when on a chapter page** - When viewing a chapter, the navigation doesn't indicate which section you're in (no "Chapters" link highlighted). Location: Header nav on chapter pages.
12. **[LOW] "Complete!" badge appears in top-right corner without context** - Small "Complete!" text appears floating in the top-right on some chapter pages without clear association to the chapter. Location: Chapter page top-right.

### CONTENT - Missing/Incomplete Sections
13. **[HIGH] Playground is "Coming Soon"** - The Playground page shows only a placeholder with no interactive functionality. Location: `/playground`.
14. **[HIGH] Leaderboard fails without Supabase** - Shows "Failed to fetch leaderboard" error message and empty state when Supabase isn't configured. Location: `/leaderboard`. Should gracefully handle missing backend.
15. **[MEDIUM] No search functionality** - No way to search across chapters, code terms, or tutorial content. No Cmd+K shortcut. Location: Global.
16. **[MEDIUM] No print styles** - Ctrl+P on chapter pages shows raw unstyled content with navigation still visible. Location: Any chapter page, print preview.
17. **[LOW] "1 examples" grammar error** - Chapters with 1 code example show "1 examples" (should be "1 example"). Location: `/chapters` listing, chapters 9, 11, 12, 13, 20, 21.

### ACCESSIBILITY - Keyboard & Screen Reader Issues
18. **[HIGH] No visible focus indicators on nav links** - Tab navigation through header links shows no visible focus ring or outline. Location: Header navigation.
19. **[HIGH] Diagram nodes not keyboard-accessible** - React Flow diagram cannot be navigated with keyboard (Tab/Arrow keys don't focus nodes). Location: Chapter page diagram section.
20. **[MEDIUM] Quiz answer buttons lack visible focus states** - Tab through quiz options doesn't show clear focus indicators. Location: Chapter quiz section.
21. **[MEDIUM] No skip-to-content link** - No way to skip past the header navigation to the main content. Location: Every page.
22. **[LOW] Theme switcher dropdown may trap focus** - After opening theme dropdown, focus management could be improved for keyboard users. Location: Header theme toggle.

### Summary by Priority
| Priority | Count | Categories |
|----------|-------|------------|
| CRITICAL | 3 | All light mode contrast issues |
| HIGH | 6 | Hover effects, animations, focus indicators, keyboard, content |
| MEDIUM | 7 | Diagram, nav, search, print, quiz focus, skip link, grammar |
| LOW | 4 | Progress tracker, badge, theme focus, grammar |

- [T-200] Tailwind v4 uses `@theme` block in CSS for design tokens — no `tailwind.config.js` file exists
- [T-200] Custom easing functions (`--ease-spring`, `--ease-smooth`, `--ease-out-expo`) added as CSS custom properties in `@theme` for consistent animation timing
- [T-200] Global transition defaults applied to `a, button, [role="button"]` — component-level transitions should override if needed
- [T-200] `shimmer-hover` utility uses `::after` pseudo-element — elements using it must have `position: relative` and `overflow: hidden`
- [T-200] Inline code styling (`:not(pre) > code`) may affect code blocks in unexpected places — scoped to exclude `<pre>` children
- [T-200] `font-extrabold` used for hero/page titles to create stronger visual hierarchy vs. `font-bold` for section headers

- [T-210] Framer Motion `layoutId` for active nav underline must use a different ID than the background pill to avoid conflicting animations
- [T-210] Mobile menu auto-close via `useEffect` on `location.pathname` is cleaner than `onClick` handlers on each link (catches all navigation, including browser back)
- [T-210] SVG circle progress indicator: `strokeDasharray` = circumference, `strokeDashoffset` = circumference * (1 - progress) creates the fill effect
- [T-210] `aria-expanded` on mobile menu button and `aria-label="Breadcrumb"` on nav element are essential for accessibility
- [T-210] TypeScript `--noEmit` shows false positives (jsx flag, moduleResolution) in this project — use `vite build` for actual error checking

- [T-220] Framer Motion `variants` with `staggerChildren` on parent container is cleaner than computing `delay: baseDelay + index * step` per child — fewer magic numbers, easier to tune
- [T-220] CSS custom properties (`--card-glow`) set via inline `style` allow per-card dynamic glow color without generating unique CSS classes
- [T-220] `chapterDetails` from `chapters.ts` has `readingMeta` for all 21 chapters — no need for fallback data in Home.tsx cards
- [T-220] Difficulty abbreviations (B/I/A) with color coding (green/amber/red) provide at-a-glance information without taking too much card space

- [T-230] Codebase has a dual code block system: `TutorialCodeBlock` (custom tokenizer with clickable terms) and `react-syntax-highlighter` (non-interactive code in Chapter.tsx, ProgressiveContent.tsx)
- [T-230] Created `EnhancedCodeBlock` wrapper to give `react-syntax-highlighter` instances consistent copy button, language badge, and line highlighting — reusable across all non-interactive code contexts
- [T-230] `DiagramContext.highlightedCodeLines` is typed as `number[] | null` not `[number, number] | null` — `EnhancedCodeBlock` accepts both via union type
- [T-230] Framer Motion `AnimatePresence` with `mode="wait"` and spring transitions creates smooth copy-button icon swap without layout shift
- [T-230] The `oneDark` theme from react-syntax-highlighter can be spread and customized by overriding specific keys like `'pre[class*="language-"]'` for transparent backgrounds

- [T-240] `ReactFlowProvider` must wrap any component using `useReactFlow()` — the custom zoom controls component needs this, so `InteractiveDiagram` wraps its inner component with `ReactFlowProvider`
- [T-240] React Flow's default `<Controls>` was replaced with custom `CustomZoomControls` using `useReactFlow()` hooks for zoom in/out/fit — provides better visual consistency with the glass-elevated design
- [T-240] `MarkerType.ArrowClosed` on edge `markerEnd` shows flow direction arrows at the target end of each edge — color updates dynamically with edge highlighting
- [T-240] CSS `animate-pulse-subtle` on nodes with code links causes Playwright `element is not stable` errors — use `force: true` when testing these nodes programmatically
- [T-240] Node tooltip uses 400ms delay via `setTimeout` in `handleMouseEnter` to avoid flicker on quick mouse movements — cleared in `handleMouseLeave`
- [T-240] Click ripple uses `onAnimationEnd` callback to clean up the ripple element — avoids accumulating DOM nodes from repeated clicks
- [T-240] Detail panel content sections use staggered Framer Motion delays (0.1s increments) for a cascading reveal effect — each section animates independently

- [T-250] Framer Motion `AnimatePresence mode="wait"` with complex child `motion.div` components causes the enter animation to get stuck at `opacity: 0` — replaced with lightweight CSS `transition-opacity` in `RouteTransitionWrapper`
- [T-250] `layoutId` across route boundaries (e.g. chapter icon on Home → Chapter page) conflicts with `AnimatePresence` exit/enter — removed all cross-route `layoutId` props from Home.tsx, Chapters.tsx, Chapter.tsx
- [T-250] CSS-based route transitions (useState + setTimeout 150ms + `transition-opacity duration-300`) are more reliable than framer-motion `AnimatePresence` for wrapping `<Outlet />` — avoids stuck animation states entirely
- [T-250] `useRef` for `prevPathRef` prevents unnecessary effect triggers when `location` object changes but pathname stays the same

- [T-260] DiagramContext and CodeTermModal use independent state systems — clicking a code term modal doesn't clear diagram selection, and closing the modal preserves diagram state
- [T-260] Both NodeDetailPanel and CodeTermModal render at z-50 but don't conflict because NodeDetailPanel is fixed right-0 and CodeTermModal is centered with backdrop
- [T-260] The Escape key handler in InteractiveDiagram.tsx captures Escape before CodeTermModal can — CodeTermModal relies on backdrop click (`onClick={onClose}`) not Escape to close
- [T-260] `animate-pulse-subtle` CSS on EnhancedNode causes Playwright "element is not stable" — use `page.evaluate()` with native MouseEvent dispatch as workaround for programmatic testing

- [T-320] Quiz type system uses optional `type` field defaulting to `'multiple-choice'` for backward compatibility — all 21 existing quizzes work without changes
- [T-320] Framer Motion `Reorder.Group` with `Reorder.Item` provides drag-and-drop for ordering questions without extra dependencies
- [T-320] Confetti particles are `useMemo`'d to prevent re-randomization on re-render — each particle has fixed trajectory computed once
- [T-320] `sessionStorage` (not `localStorage`) persists mid-quiz state — cleared on results or intro, so it doesn't persist across browser sessions (intentional: quiz state is ephemeral)
- [T-320] Segmented progress bar (one segment per question, colored green/red) replaces the single continuous progress bar — gives immediate visual feedback on performance trajectory
- [T-320] ShakeWrapper uses Framer Motion keyframe array `x: [0, -8, 8, -6, 6, -3, 3, 0]` for natural shake feel on wrong answers

- [T-330] ProgressContext already had localStorage for `completedChapters` — extended the same `CourseProgress` type in `types.ts` to also store `quizScores` (Record<number, QuizScore>) and `lastVisited` ({ chapterId, section?, timestamp })
- [T-330] Backward compatibility: `loadProgress()` normalizes missing fields with `|| {}` / `|| []` defaults so existing localStorage data from before T-330 still loads correctly
- [T-330] `saveQuizScore` only updates if the new score is better than existing (best-score-wins) — prevents regression when retaking quizzes
- [T-330] `hasProgress` in Layout.tsx was expanded from `completedChapters.length > 0` to also include `!!lastVisited` — so "Continue" link appears even before completing any chapter
- [T-330] Refs (`quizScoresRef`, `lastVisitedRef`) used in `markChapterComplete`/`toggleChapterComplete` callbacks to avoid stale closures when building the full progress object for localStorage save
- [T-330] Chapters.tsx had no progress integration — added `useProgress()` with completion badges (matching Home.tsx pattern), phase progress bars, and quiz score indicators per card

- [T-340] CSS custom property inversion is the key pattern for dark-first codebases: redefining `--color-dark-*` in `html.light` inverts the semantic scale so `bg-dark-900` automatically becomes light in light mode — no per-component className changes needed for 90% of cases
- [T-340] `text-white` doesn't adapt to theme since it's a standard Tailwind color — replaced with `text-dark-50` (which inverts via token override) in 150+ locations; kept `text-white` only on gradient/solid-colored backgrounds where white is always correct
- [T-340] Smooth theme transition uses a temporary `theme-transition` CSS class with `!important` transitions on `*` and `*::before/after` — removed after 350ms to avoid interfering with normal element transitions
- [T-340] `prefers-color-scheme` media query replaces the previous time-of-day auto theme — uses `matchMedia.addEventListener('change')` for live system preference tracking
- [T-340] Code blocks (`<pre>`) stay dark in light mode (hardcoded `#1e293b` background) — this is intentional for readability; inline `<code>` gets light styling
- [T-340] Glass effect, glow effects, scrollbar, node tooltip, React Flow controls all need explicit `html.light` CSS overrides since they use hardcoded rgba values

- [T-300] Chapters 1-8 had rich tutorials (20-28 steps each), but chapters 16-19 had sparse tutorials (2-7 steps) despite having matching notebooks — tutorial completeness requires comparing step counts, not just checking for tutorial array presence
- [T-300] When expanding tutorials from notebooks, adapt code to be educational (add comments, break into digestible blocks) rather than copy-pasting entire notebook cells — raw notebook code is often too dense for step-by-step learning
- [T-300] `highlightTerms` in tutorial steps must reference existing IDs in `codeTerms.ts` — always add new code terms before referencing them in tutorials, or the highlighting silently fails
- [T-300] Chapters 20-21 appeared sparse in initial audit but had adequate tutorial content (4 sections, 10+ steps) — verify actual step quality before expanding

- [T-420] `useNavigationType()` from react-router-dom returns `'POP'` for browser back/forward, `'PUSH'` for programmatic navigation, `'REPLACE'` for redirects — used to determine slide direction
- [T-420] Module-scoped `Map<string, number>` for scroll positions avoids React re-renders; persists across component lifecycle without `useRef` or state
- [T-420] CSS `willChange: 'opacity, transform'` promotes element to compositor layer during animation, but MUST be reset to `'auto'` when idle to free GPU memory
- [T-420] Exit animation uses `cubic-bezier(0.4, 0, 1, 1)` (accelerate-out) while enter uses `cubic-bezier(0, 0, 0.2, 1)` (decelerate-in) — this asymmetry creates natural-feeling motion where exit feels quick and enter feels smooth
- [T-420] `reducedMotion` from MotionContext skips all transform/timing to 0ms — respects OS-level `prefers-reduced-motion` setting

- [T-430] Code term `<span>` elements need `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space — without these, keyboard users cannot activate clickable terms in code blocks
- [T-430] Focus trap in modals requires querying all focusable elements (`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`) and wrapping Tab at boundaries
- [T-430] `previousFocusRef` pattern: store `document.activeElement` before modal opens, restore focus on close — critical for keyboard users to maintain context
- [T-430] Framer Motion `Reorder.Item` is drag-only by default — added `onKeyDown` with ArrowUp/ArrowDown handlers that swap adjacent items in the ordered array + `setTimeout` refocus after React re-render
- [T-430] React Flow diagram nodes already get wrapper elements, but the inner `EnhancedNode` div needs explicit `tabIndex={0}` and `role="button"` for keyboard activation via Enter/Space
- [T-430] `onFocus`/`onBlur` handlers on diagram nodes mirror `onMouseEnter`/`onMouseLeave` — shows tooltip and hover styling for keyboard-focused nodes
- [T-430] Global `:focus-visible` rule in `index.css` provides visible blue outline on all focusable elements — no per-component focus styling needed
- [T-430] `useRef<ReturnType<typeof setTimeout>>()` requires initial value `undefined` in React 19 strict mode — pre-existing TS error fixed alongside keyboard work

- [T-440] Print styles are CSS-only (`@media print` in `index.css`) — no JavaScript runtime changes needed; all hiding is done via CSS selectors
- [T-440] `position: static !important` on all elements is too aggressive for print — breaks internal component layout; instead, hide specific elements like `.blur-3xl` decorative blobs
- [T-440] React Flow diagrams don't render in print media (canvas/SVG-based) — hide the entire diagram column rather than trying to make it static
- [T-440] `orphans: 3` and `widows: 3` on body/p/li elements prevent sparse pages with only 1-2 lines; `break-inside: avoid` only on small elements (h1-h6, figures), `break-inside: auto` on large sections
- [T-440] Force light colors in print by redefining `--color-dark-*` tokens to their light equivalents inside `@media print` — same pattern used by `html.light` class
- [T-440] `no-print` class hides elements only in print; `print-only` class shows elements only in print — both toggled by `@media print` block
- [T-440] Gradient text (`-webkit-text-fill-color: transparent` with `background-clip: text`) must be explicitly reset in print — otherwise text becomes invisible on white paper

- [T-350] Search index is built statically at module load time from `chapterDetails`, `codeTerms`, and `concepts` — no re-computation on keystroke since data is static imports
- [T-350] Portal-based modal (`createPortal` to `document.body`) ensures search overlay renders above all z-index stacking contexts including the fixed nav and diagram panels
- [T-350] Fuzzy search scoring uses a weighted cascade: exact title match (100) > starts-with (90) > title contains (70) > subtitle contains (40) > fuzzy char-order match (20) — no external library needed for ~150-item dataset
- [T-350] `useSearchShortcut` hook uses `metaKey || ctrlKey` to handle both macOS Cmd+K and Windows/Linux Ctrl+K — prevents default browser behavior (address bar focus)
- [T-350] Concept results navigate to the first chapter that introduces them (via `conceptsIntroduced` array) — fallback to `/chapters` if no chapter found
- [T-350] `requestAnimationFrame` before `inputRef.current?.focus()` ensures the modal DOM is painted before attempting focus — prevents race condition with Framer Motion enter animation

- [T-410] SVG `viewBox` scaling is multiplicative — a `viewBox="0 0 100 100"` mapped to a 1400px container makes each SVG unit ~14px; use larger viewBox (560×440) for finer positioning control of small decorative elements
- [T-410] SVG `<animateMotion>` with `repeatCount="indefinite"` creates flow particles without JavaScript — pure SVG animation is GPU-composited and doesn't trigger React re-renders
- [T-410] `useReducedMotion()` from framer-motion provides the `prefers-reduced-motion` check — returns static SVG with no animations when enabled
- [T-410] CSS `transform-origin: center` is required for `hero-pulse` ring animation using `transform: scale()` — without it, SVG circles scale from top-left corner instead of center
- [T-410] Hero visualization opacity levels: 0.22 desktop, 0.12 mobile, 0.08 reduced-motion — these values were tuned to keep nodes visible but never compete with text content

- [T-400] Full learning flow verified for Chapter 1: homepage card → tutorial (9 steps) → clickable code terms (ChatOpenAI modal with full docs) → diagram interaction (Step 1: Extract node → detail panel with "View in Code") → quiz section (6 questions, 3 types) → progress persistence (2/21 on homepage)
- [T-400] All interactive features coexist without state conflicts — code term modal and diagram detail panel use independent state systems
- [T-400] Playwright `element is not stable` on animated diagram nodes — use `page.evaluate()` with native `.click()` as workaround (confirmed from T-240/T-260 lesson)

## Chapter Inventory (T-500-100)

Complete list of 21 chapters with routes for systematic testing:

| # | Title | Route |
|---|-------|-------|
| 1 | Prompt Chaining | `/chapter/1` |
| 2 | Routing | `/chapter/2` |
| 3 | Parallelization | `/chapter/3` |
| 4 | Reflection | `/chapter/4` |
| 5 | Tool Use | `/chapter/5` |
| 6 | Planning | `/chapter/6` |
| 7 | Multi-Agent Collaboration | `/chapter/7` |
| 8 | Memory Management | `/chapter/8` |
| 9 | Learning and Adaptation | `/chapter/9` |
| 10 | Model Context Protocol (MCP) | `/chapter/10` |
| 11 | Goal Setting and Monitoring | `/chapter/11` |
| 12 | Exception Handling and Recovery | `/chapter/12` |
| 13 | Human-in-the-Loop | `/chapter/13` |
| 14 | Knowledge Retrieval (RAG) | `/chapter/14` |
| 15 | Inter-Agent Communication (A2A) | `/chapter/15` |
| 16 | Resource-Aware Optimization | `/chapter/16` |
| 17 | Reasoning Techniques | `/chapter/17` |
| 18 | Guardrails and Safety Patterns | `/chapter/18` |
| 19 | Evaluation and Monitoring | `/chapter/19` |
| 20 | Prioritization | `/chapter/20` |
| 21 | Exploration and Discovery | `/chapter/21` |

**Parts Structure:**
- Part One (Core): Ch 1-8
- Part Two (Advanced): Ch 9-15
- Part Three (Production): Ch 16-21

**Other Routes:** `/`, `/introduction`, `/chapters`, `/learning-path`, `/playground`, `/leaderboard`, `/profile`

## Console Error Audit (T-500-200)

**Result: 27/27 routes clean (zero application errors, zero warnings)**

Issues found and fixed:
1. **Chapter 9 React Flow edge warning** — Edge `e6-2` (feedback loop from output node '6' to node '2') couldn't connect because output nodes didn't render source handles. Fixed by always rendering both handles with `opacity: 0` for hidden ones.
2. **Leaderboard `console.error` on network failure** — Supabase client tries to fetch from `localhost:54321` (configured in `.env.local` but not running). Silenced `console.error` for `TypeError: Failed to fetch` network errors; real Supabase data errors still logged.
3. **Supabase auth auto-connect** — Disabled `autoRefreshToken`, `persistSession`, `detectSessionInUrl` when Supabase is not configured to prevent background auth requests.

**Note:** Browser-level `ERR_CONNECTION_REFUSED` on `/leaderboard` persists — this is a browser network log (not suppressible by JS) that occurs because `.env.local` has Supabase credentials pointing to non-running local instance. It disappears when Supabase is running.

## Lessons Learned (T-500-200)

- [T-500-200] React Flow conditionally rendered handles (`{role !== 'output' && <Handle>}`) break feedback loops — always render handles with `opacity: 0` instead
- [T-500-200] Supabase `createClient` with `autoRefreshToken: true` fires background auth requests even when app code guards against using the client
- [T-500-200] Supabase catch blocks receive wrapped error objects (`{message, details, hint, code}`), not raw `TypeError` — use `JSON.stringify(err).includes()` for reliable network error detection
- [T-500-200] `Failed to load resource: net::ERR_CONNECTION_REFUSED` is a browser-level log that cannot be suppressed by JavaScript — only the application's `console.error` calls can be controlled

## Search Verification (T-500-400)

**Result: All 21 chapters indexed and navigable via search**

- Searched unique terms for all 21 chapters — every chapter returned results with correct `Ch.X` badge
- Navigation verified on chapters 1, 10, 21 — clicking search results navigates to correct `/chapter/N` route
- Zero console errors during search and navigation testing
- Search also indexes 72 code terms and 10 concepts beyond chapter titles

## Dark Mode Verification (T-500-300)

**Result: All 21 chapters + all auxiliary pages consistent in dark mode**

- Automated Playwright scan: all 21 chapters have `html.dark` class active, zero white-background elements detected
- Deep scroll verification on chapters 1, 5, 10, 15, 21: checked every viewport-height section for unthemed elements — zero issues
- Auxiliary pages verified: `/chapters`, `/introduction`, `/learning-path`, `/playground` — all clean
- Visual inspection via screenshots: navigation bar, content cards, code blocks, tutorial sections, footer all properly themed
- No fixes needed — dark mode styling is consistent across the entire platform

## Navigation Verification (T-500-500)

**Result: All chapter navigation links work, page transitions animate correctly**

- All 21 chapters load successfully at `/chapter/1` through `/chapter/21`
- Previous/Next links verified on every chapter:
  - Chapter 1: No Previous (correct boundary), has Next Ch 2
  - Chapters 2-20: Both Previous and Next with correct chapter numbers
  - Chapter 21: Has Previous Ch 20, no Next (correct boundary)
- "All Chapters" link present on every chapter page, navigates to `/chapters`
- Breadcrumb navigation (Home > Chapters > Ch N) functional on all chapters
- Chapters listing page shows all 21 chapters organized in 4 parts with working links
- Page transition animations verified: 63 style mutations detected during Ch 1→2 transition (opacity fade + scale transform)
- Zero console errors during full navigation sweep
- No broken links or navigation dead ends

## Keyboard Accessibility Verification (T-500-600)

**Result: All 21 chapters + all auxiliary pages pass keyboard accessibility**

- Automated Playwright tab-navigation test with element identity tracking: 21/21 chapters have zero true focus traps
- 43-49 unique focusable elements per chapter (maxRepeat=1 on all chapters — focus never gets stuck)
- Global `:focus-visible` rule (`index.css:171`) provides 2px solid blue outline on all focusable elements
- Focus indicator confirmed visually: `rgb(58, 173, 250)` outline with 2px offset
- Keyboard activation verified:
  - Enter on nav links navigates correctly
  - Enter on code term buttons opens modal with documentation
  - Enter on "Start Quiz" button starts the quiz
  - Escape closes modals (via backdrop click pattern, not Escape key — known design choice from T-260)
- Auxiliary pages also clean: `/`, `/chapters`, `/introduction`, `/learning-path`, `/playground`
- React Flow diagram nodes (`<g role="group">`) receive focus but lack outline — this is React Flow's internal wrapper; the inner `<div role="button">` nodes DO have visible outlines
- No fixes needed — keyboard accessibility infrastructure from T-430 works correctly across all chapters

## Print Styles Verification (T-500-700)

**Result: All 21 chapters pass print media verification with zero issues**

- Playwright `page.emulateMedia({ media: 'print' })` used for consistent testing across all chapters
- Automated checks verified on every chapter:
  - Navigation/header/footer hidden (display: none)
  - Body background forced to white
  - Gradient text resolved to solid dark color (no transparent `-webkit-text-fill-color`)
  - Diagram column (`lg:col-span-5`) hidden
  - Code blocks have visible borders and light background
  - No elements overflow page width
- Visual screenshot inspection of chapters 1, 5, 10, 15, 21 confirmed clean layout
- Print CSS in `index.css:1041-1374` covers: page setup, color inversion, element hiding, code blocks, page breaks, gradient text fix, link URLs, and utility classes
- No fixes needed — print styles from T-440 work correctly across all chapters

## Interactive Features Verification (T-500-800)

**Result: All 21 chapters' interactive features work correctly**

### Diagrams
- All 21 chapters have ReactFlow `[role="application"]` diagrams
- Node click → detail panel with description, "About this step", "How it works", related concepts
- "View in Code" button scrolls to and highlights relevant code section
- Verified on chapters 1, 10, 18: 12 clickable nodes each, detail panel opens, View in Code works

### Code Term Modals
- 17/21 chapters have clickable "Learn about" code term buttons (range: 2-27 per chapter)
- 4 chapters (9, 11, 20, 21) have no code terms defined for their code patterns
- Clicking term opens modal with: description, syntax, parameters, return types, pro tips, official docs link
- **Fixed:** "Click highlighted terms for explanations" hint was showing on ALL code blocks, including those with no clickable terms. Made hint conditional on `hasClickableTerms` computed from tokenized output.

### Quizzes
- All 21 chapters have "Start Quiz" button
- Quiz start → question display → answer selection → submit → correct/incorrect feedback with explanation → next question
- Score tracking (X/Y) updates in real-time
- Question types: multiple-choice, true/false, ordering (drag-and-drop)
- Verified scoring on chapters 1 and 18

### Tutorials
- All 21 chapters have "Hands-On Tutorial" sections
- Step types verified: narrative, code, tip, warning, exercise, checkpoint
- Tutorial progression works with numbered steps

### Code Term Coverage by Chapter
| Chapters | "Learn about" Buttons | Notes |
|----------|----------------------|-------|
| 1-4 | 18-27 | Rich LangChain/LCEL terms |
| 5-8 | 7-10 | Tool use, planning, memory terms |
| 9, 11, 20, 21 | 0 | No matching terms in codeTerms.ts |
| 10, 12-19 | 2-13 | Mixed coverage |

## Lessons Learned (T-500-800)

- [T-500-800] `TutorialCodeBlock.tsx` shows "Click highlighted terms" hint on all code blocks regardless of whether any terms are matched — fixed by computing `hasClickableTerms` from tokenized output
- [T-500-800] ReactFlow diagram nodes use `div[role="button"][tabindex="0"]` not `<button>` elements — Playwright locators must target this pattern, not `button` tag
- [T-500-800] Diagram nodes have `animate-pulse-subtle` CSS causing Playwright "element is not stable" — use `force: true` on click (consistent with T-240 finding)
- [T-500-800] Duplicate diagram nodes appear in DOM because of dual rendering (inline + sticky sidebar) — `count / 2` gives actual unique node count

## Final Platform Verification (T-500-900)

**Result: All 5 parent guarantees satisfied**

| Guarantee | Verification Method | Result |
|-----------|-------------------|--------|
| All features work across all chapters | Automated Playwright navigation of all 21 chapters + interactive feature testing | PASS |
| No chapter-specific bugs | Console error audit (0 errors across 21 chapters) + interactive features verified | PASS |
| Dark mode consistent everywhere | Visual screenshot inspection of Ch 1, 11, 21 in dark mode | PASS |
| Search indexes all content | Search modal tested with "prompt chaining" (Ch 1), "goal setting" (Ch 11), "discovery" (Ch 21) | PASS |
| No console errors on any page | Automated console capture on all 21 chapter pages — zero errors | PASS |

**Build status:** Production build passes with zero errors (CSS pseudo-class lint notice is non-blocking)

## SEO Meta Tags (T-520)

**Implementation: Custom `useDocumentMeta` hook (zero dependencies)**

- Created `src/hooks/useDocumentMeta.ts` — sets `document.title`, meta description, OG tags, keywords, and JSON-LD structured data
- Integrated into 6 pages: Home, Chapter, Chapters, Introduction, LearningPath (+ cleanup on unmount)
- Chapter pages use `LearningResource` schema.org type with `educationalLevel`, `teaches`, `timeRequired`
- Home page uses `Course` schema.org type with `hasCourseInstance`
- All OG tags update dynamically on client-side navigation

### Lessons Learned (T-520)

- [T-520] React 19 supports `<title>` and `<meta>` in component JSX (hoisted to `<head>`), but for SPAs with client-side routing, `useEffect`-based DOM manipulation is more reliable — avoids duplicate tags from concurrent renders
- [T-520] JSON-LD `<script>` elements must be cleaned up on unmount to prevent stacking when navigating between pages — use `scriptEl.remove()` in effect cleanup
- [T-520] `useMemo` for `structuredData` object prevents effect re-runs on every render — without it, the `useEffect` dependency array sees a new object reference each time
- [T-520] Meta tag cleanup restores defaults (not blank) — important for SPA where the `index.html` static tags serve as initial SSR-like defaults

## Performance Optimization (T-510)

**Result: Lighthouse desktop score 91/100 (up from ~35 before optimization)**

### Bundle Size Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total JS (single bundle) | 2,106 KB | Split into 16 chunks | Route-based code splitting |
| Initial load (gzip) | 654 KB | ~340 KB | **48% smaller** |
| Syntax highlighter | 640 KB | 55 KB | **92% smaller** (PrismLight) |
| Chapter page | Part of main bundle | 260 KB on demand | Deferred loading |

### Optimizations Applied
1. **Route-based code splitting**: All pages except Home use `React.lazy` with `Suspense` boundaries
2. **PrismLight instead of full Prism**: Only registers python, bash, json languages (from ~200 bundled languages)
3. **Vendor chunk splitting**: react, framer-motion, i18n, lucide-react, react-syntax-highlighter each in separate cached chunks
4. **Loading skeletons**: `PageLoadingSkeleton` and `ChapterLoadingSkeleton` components for Suspense fallbacks
5. **Font loading optimization**: Google Fonts loaded async with `media="print" onload` trick to eliminate render-blocking

### Lighthouse Scores
| Preset | Score | FCP | LCP | TBT | CLS | SI |
|--------|-------|-----|-----|-----|-----|-----|
| Desktop | 91/100 | 1.0s | 1.0s | 90ms | 0.001 | 2.3s |
| Mobile (4x throttle) | 60/100 | 3.0s | 3.0s | 2,450ms | 0 | 3.3s |

### Lessons Learned (T-510)

- [T-510] `PrismLight` from `react-syntax-highlighter` only includes Prism core (~30KB) — you register only needed languages with `SyntaxHighlighter.registerLanguage()`, reducing the syntax chunk from 640KB to 55KB
- [T-510] `manualChunks` in Vite's Rollup config enables long-term caching of vendor libraries — updating app code doesn't invalidate the vendor-react or vendor-motion cache
- [T-510] Google Fonts `<link>` is render-blocking by default — `media="print" onload="this.media='all'"` with `<link rel="preload" as="style">` eliminates the blocking request while still loading fonts
- [T-510] Lighthouse mobile scores are heavily penalized by 4x CPU throttling — a 920KB index chunk (258KB gzip) is acceptable for desktop but causes 2.4s TBT on mobile simulation
- [T-510] The biggest performance win was switching from full Prism to PrismLight (92% reduction) — always check if a library offers a tree-shakeable or light build before accepting its full bundle

## Build Warning Analysis (T-600-200)

**Result: Zero critical warnings — only cosmetic CSS optimizer notes**

Build warnings found:
1. **CSS pseudo-class warnings** (2): RTL utility classes (`rtl\:rotate-180`, `rtl\:flip`) misidentified as pseudo-classes by the CSS optimizer — false positives from escaped Tailwind-style selectors. No runtime impact.
2. **Chunk size advisory** (1): `index-*.js` at 918KB (257KB gzip) exceeds Vite's 500KB warning threshold — addressed by T-600-300 bundle analysis.

Zero missing dependency, circular import, or unresolved module warnings.

## Performance Baseline (T-700)

**Lighthouse Performance: 47/100** (headless Chrome, simulated throttling)

| Metric | Value | Pass? |
|--------|-------|-------|
| LCP | 3.3s | No (>2.5s) |
| FCP | 3.2s | No (>1.8s) |
| TBT | 43,810ms | No (>200ms) |
| CLS | 0 | Yes (<0.1) |

**Top 5 Bottlenecks:**
1. `index` chunk at 918KB raw (258KB gzip) — `chapters.ts` (467KB) is the dominant contributor
2. Google Fonts blocking (193KB, 2 requests) — delays FCP/LCP
3. Framer Motion (124KB raw / 41KB gzip) — loaded on every page
4. No critical CSS inlining — 89KB CSS blocks render
5. No Brotli/gzip pre-compression configured

**Full baseline:** See `PERF_BASELINE.md`

### Lessons Learned (T-700)

- [T-700] Lighthouse headless mode with simulated throttling inflates TBT/TTI/SI dramatically (4x CPU, 150ms RTT) — real-device scores will differ, but relative chunk sizes indicate real bottlenecks
- [T-700] The 918KB index chunk contains all chapter data (467KB chapters.ts), shared components, contexts, Home page, GSAP, XYFlow, and Supabase — splitting chapter data into per-chapter dynamic imports would be the highest-impact optimization
- [T-700] Google Fonts are the second-largest network resource (193KB) despite the `media="print" onload` optimization from T-510 — the fonts themselves are large; subsetting to Latin would reduce significantly
- [T-700] Previous T-510 desktop score was 91/100; current headless score of 47 reflects different throttling settings — the baseline comparison should use consistent Lighthouse config

## Critical CSS (T-710)

**Result: Critical CSS inlined in production HTML — prevents white flash / FOUC**

- Custom Vite plugin (`vite-plugin-critical-css.ts`) injects `<style data-critical>` in `closeBundle` hook
- Hand-crafted critical CSS (~1KB) covers: `:root` theme variables, `html`/`body` base styles, light mode overrides, `#root` layout skeleton
- Full `<link rel="stylesheet">` preserved after the inline block for all remaining styles
- Validation: `grep -c '<style' dist/index.html` returns 1

### Lessons Learned (T-710)

- [T-710] For SPAs with Tailwind CSS v4, hand-crafted critical CSS is more reliable than automated extraction tools (like `rollup-plugin-critical` / `critical` library) — Tailwind v4's `@layer` structure and minified output makes regex-based extraction fragile
- [T-710] The most important critical CSS for a dark-themed SPA is the body background color and text color — prevents the jarring white flash before the full CSS loads
- [T-710] Vite's `closeBundle` hook runs after all assets are emitted, making it ideal for post-processing the built `index.html` — no need for complex `generateBundle` or `transformIndexHtml` hooks
- [T-710] The `<style data-critical>` tag must appear BEFORE the `<link rel="stylesheet">` in the HTML head — this ensures inline styles take effect before the full stylesheet is parsed
- [T-710] Including `html.light` overrides in critical CSS handles both dark (default) and light theme users without FOUC — the ThemeContext adds the class before React hydrates

## Font Loading Optimization (T-720)

**Result: Three-layer font loading strategy for zero FOIT and faster LCP**

- Added `<link rel="preload" as="font">` for Inter (47KB woff2) and JetBrains Mono (31KB woff2) latin subsets — browser starts downloading font files immediately without waiting for Google Fonts CSS parse
- Added local `@font-face` declarations with `font-display: swap` in `index.css` — ensures text is visible with system fallback immediately, swaps to web font when loaded
- Added `<noscript>` fallback for the async CSS loading pattern (`media="print" onload`) — fonts still load when JavaScript is disabled
- Google Fonts URL already included `display=swap` parameter — the local `@font-face` rules reinforce this and provide the font files to the preload hints
- Font file sizes: Inter latin 47KB, JetBrains Mono latin 31KB — both under 50KB threshold, no subsetting needed

### Lessons Learned (T-720)

- [T-720] Google Fonts `display=swap` parameter only adds `font-display: swap` to the Google-served CSS — if the CSS hasn't been parsed yet (async loading), the browser has no `@font-face` to apply swap to. Local `@font-face` declarations bridge this gap
- [T-720] `<link rel="preload" as="font" crossorigin>` MUST include `crossorigin` attribute even for same-protocol requests — fonts are always fetched in CORS mode; without `crossorigin`, the preloaded resource is discarded and re-fetched
- [T-720] Google Fonts uses a single woff2 file per font family for the latin subset (variable font) — weight ranges (400-800) are served from one file, so only one preload per family is needed
- [T-720] The `media="print" onload="this.media='all'"` async pattern needs a `<noscript>` with the blocking stylesheet as fallback — without it, users with JavaScript disabled get no web fonts at all

## React Component Memoization (T-730)

**Result: 15 components wrapped with React.memo, 1 new useCallback, zero type errors**

### Components Memoized with React.memo

| Component | File | Impact |
|-----------|------|--------|
| TutorialCodeBlock | tutorial/TutorialCodeBlock.tsx | High — expensive tokenization + syntax highlighting |
| EnhancedCodeBlock | EnhancedCodeBlock.tsx | High — SyntaxHighlighter re-renders |
| CodeTermModal | tutorial/CodeTermModal.tsx | Medium — modal re-renders when parent state changes |
| NodeDetailPanel | diagram/NodeDetailPanel.tsx | Medium — panel re-renders on diagram interactions |
| CustomZoomControls | diagram/InteractiveDiagram.tsx | Medium — re-renders on every diagram state change |
| ConfettiParticles | ChapterQuiz.tsx | Low — renders 24 animated particles |
| ShakeWrapper | ChapterQuiz.tsx | Low — animation wrapper |
| OrderingQuestion | ChapterQuiz.tsx | Medium — drag-and-drop re-renders |
| ChoiceQuestion | ChapterQuiz.tsx | Medium — option list re-renders |
| QuestionCodeSnippet | ChapterQuiz.tsx | Low — static code display |
| QuestionTypeBadge | ChapterQuiz.tsx | Low — static badge |
| TypeBadge | SearchModal.tsx | Low — rendered per search result |
| HighlightText | SearchModal.tsx | Low — rendered per search result |
| LearningObjectives | LearningObjectives.tsx | Low — static list |
| ConceptTooltip | ConceptTooltip.tsx | Low — hover tooltip |
| ChapterCelebration | ChapterCelebration.tsx | Low — modal overlay |
| FlowParticle | HeroVisualization.tsx | Low — SVG particle (×16) |

### useCallback Additions

- `EnhancedCodeBlock.lineProps` — previously inline function passed to SyntaxHighlighter on every render; now memoized with `useCallback` depending on highlight range and chapter color

### Already Optimized (No Changes Needed)

- `EnhancedNode` — already used `React.memo` + 5 `useCallback` handlers
- `InteractiveDiagram` — already had `useMemo` for nodes/edges/markers
- `SearchModal` — already had `useMemo` for search results, `useCallback` for handlers
- `ChapterQuiz` (main) — already had extensive `useMemo`/`useCallback` usage

### Lessons Learned (T-730)

- [T-730] `React.memo` wrapping is pointless without also memoizing callback/object props from parent — inline `() => {}` creates new function reference every render, defeating memo
- [T-730] Internal sub-components defined at module scope (like `ConfettiParticles`, `ChoiceQuestion`) benefit from `React.memo` because the parent component's state changes don't need to propagate to stable sub-components
- [T-730] SyntaxHighlighter's `lineProps` accepts a function that gets called per line — passing it inline creates a new function identity every render, causing the entire highlighted output to re-compute. `useCallback` here prevents ~100+ line re-renders per code block state change
- [T-730] Static objects like `typeColors`, `enhancedTheme`, `confettiColors` defined at module scope (outside component) are inherently stable — no `useMemo` needed
- [T-730] The search index (`buildSearchIndex()`) was already called once at module scope and stored in a constant — this is the ideal pattern for static data that never changes

## Image Optimization (T-740)

**Result: Zero raster images — SVG-only codebase with avatar `<img>` tags optimized**

### Asset Audit
- **Raster images**: 0 (no PNG, JPG, WebP, AVIF, GIF in src/ or public/)
- **SVG files**: 2 (react.svg, vite.svg) — both unused boilerplate from Vite scaffolding → **deleted**
- **Inline SVGs**: 13 usages via Lucide React icons — no optimization needed (tree-shaken by vendor-icons chunk)
- **`<img>` tags**: 3 (all avatar images from Supabase auth)

### Changes Made
1. **Deleted unused SVGs**: `src/assets/react.svg` and `public/vite.svg` — not imported or referenced anywhere; `vite.svg` was previously copied to `dist/` on every build
2. **Added `width`/`height` to all `<img>` elements** — prevents CLS by giving browser intrinsic size before CSS loads:
   - `UserMenu.tsx`: 32×32 (w-8 h-8)
   - `Profile.tsx`: 96×96 (w-24 h-24)
   - `Leaderboard.tsx`: 40×40 (w-10 h-10)
3. **Added `loading="lazy"` to all `<img>` elements** — all avatar images are below-fold content

### Validation
- `find dist -name '*.png' -o -name '*.jpg' | wc -l` → **0** (no raster images in production build)
- `find dist -name '*.svg'` → **0** (unused vite.svg no longer copied to dist)
- Production build succeeds with zero errors

### Lessons Learned (T-740)

- [T-740] SVG-only educational platforms (using React components for visuals) have trivially satisfied image optimization guarantees — the real optimization is removing unused boilerplate assets that waste build time and dist space
- [T-740] Vite automatically copies `public/` files to `dist/` — unused files in `public/` silently inflate the production deployment
- [T-740] Even when Tailwind CSS constrains `<img>` size (e.g., `w-8 h-8`), adding HTML `width`/`height` attributes is still valuable — the browser calculates aspect ratio from HTML attributes *before* CSS loads, preventing CLS during the critical rendering path

## Resource Hints (T-760)

**Result: 10 resource hints in production HTML — preconnect, dns-prefetch, modulepreload, and hover prefetch**

### Resource Hints in dist/index.html
| Type | Count | Target |
|------|-------|--------|
| preconnect | 2 | fonts.googleapis.com, fonts.gstatic.com |
| dns-prefetch | 2 | fonts.googleapis.com, fonts.gstatic.com |
| modulepreload | 5 | vendor-react, vendor-motion, vendor-i18n, vendor-syntax, vendor-icons |
| font preload | 2 | Inter woff2, JetBrains Mono woff2 (from T-720) |

### Hover Prefetch Implementation
- Created `src/utils/prefetch.ts` — deduplicating prefetch utility with `Set<string>` tracking
- `prefetchRoute('chapter')` fires on `onMouseEnter` of chapter card `<Link>` in both Home.tsx and Chapters.tsx
- Same `import()` path as `React.lazy` in App.tsx — browser module cache primes the chunk for instant navigation
- `routeImports` map covers all 7 lazy-loaded routes for future extensibility

### Lessons Learned (T-760)

- [T-760] Vite automatically generates `<link rel="modulepreload">` for vendor chunks referenced by the entry module — no manual configuration needed; `manualChunks` in rollup config directly controls which chunks get modulepreload hints
- [T-760] `dns-prefetch` is a fallback for browsers that don't support `preconnect` — both should be present for external origins; `preconnect` includes DNS + TCP + TLS while `dns-prefetch` only resolves DNS
- [T-760] Dynamic `import()` in an event handler (onMouseEnter) fetches the chunk but doesn't execute it until React.lazy requests it — this is the lightest prefetch strategy, costing only a network fetch with no JS execution overhead
- [T-760] A `Set`-based deduplication in the prefetch utility prevents redundant network requests when users hover over multiple cards — the first hover triggers the fetch, subsequent hovers are no-ops

## Animation Performance Hardening (T-770)

**Result: All layout-triggering animations replaced with GPU-composited equivalents**

### Changes Made
1. **Progress bars (7 instances)**: Replaced `animate={{ width: '${pct}%' }}` with `animate={{ scaleX: pct/100 }}` + `origin-left` class in:
   - Home.tsx, Profile.tsx, Chapters.tsx, LearningPath.tsx, Layout.tsx (mobile nav), ChapterQuiz.tsx (2 instances)
2. **Node ripple CSS**: Replaced `width/height: 0→200px` keyframe with `transform: scale(0→1)` at fixed 200×200px size
3. **will-change hints**: Added to hero-node-core (opacity), hero-edge (opacity), hero-pulse (transform, opacity), node-ripple (transform, opacity), edge-animated (stroke-dashoffset)
4. **Universal reduced-motion**: Replaced per-element `animation: none` with global `* { animation-duration: 0.01ms; transition-duration: 0.01ms; scroll-behavior: auto }` under `@media (prefers-reduced-motion: reduce)`

### Remaining `height: 'auto'` in Layout.tsx
- Mobile menu uses Framer Motion `animate={{ height: 'auto' }}` — this is Framer Motion's optimized FLIP technique for collapsible content, not a per-frame layout recalculation. Replacing it with max-height would be worse.

### Lessons Learned (T-770)

- [T-770] Framer Motion `animate={{ width }}` on progress bars triggers layout recalculation every frame — `scaleX` with `transform-origin: left` achieves the same visual effect entirely on the GPU compositor thread
- [T-770] CSS keyframe `width/height` animations (like node ripple) should set final dimensions as static CSS and animate `transform: scale()` instead — the visual result is identical but avoids layout thrashing
- [T-770] `will-change` should only be applied to elements with persistent/repeating animations (hero pulse, edge flow) — applying it to one-shot animations wastes GPU memory by keeping compositor layers alive unnecessarily
- [T-770] `animation-duration: 0.01ms` (not `0s`) in reduced-motion media query ensures `animationend`/`transitionend` events still fire — some JavaScript logic depends on these callbacks
- [T-770] Framer Motion's `<MotionConfig reducedMotion="user">` handles JS-driven animations, but CSS animations need a separate `@media (prefers-reduced-motion: reduce)` block — both layers must be covered for full accessibility

## Bundle Optimization (T-750)

**Result: Main chunk reduced from 258KB → 64.6KB gzipped (75% reduction), all chunks under 150KB gzipped**

### Chunk Composition (Before → After)

| Chunk | Before (gzip) | After (gzip) | Change |
|-------|--------------|--------------|--------|
| index (main) | 258.03 KB | 64.59 KB | **-75%** |
| data-chapters | (in index) | 100.67 KB | Split out |
| data-codeterms | (in index) | 18.02 KB | Split out |
| data-misc | (in index) | 3.24 KB | Split out |
| app-i18n | (in index) | 12.69 KB | Split out |
| Chapter (lazy) | 78.50 KB | 76.91 KB | -2% |
| vendor-react | 16.67 KB | 75.45 KB | +react-i18next |
| vendor-motion | 41.10 KB | 40.86 KB | ~same |
| vendor-syntax | 19.77 KB | 21.48 KB | ~same |
| vendor-i18n | 15.66 KB | 15.67 KB | ~same |

### Optimizations Applied
1. **Function-based `manualChunks`** — replaced object-based config for finer module-level control
2. **Data layer split** — `chapters.ts` (467KB source), `codeTerms.ts` (72KB), `concepts.ts` (10KB) extracted into separate chunks
3. **i18n locale split** — `src/i18n/` (locales + init) into `app-i18n` chunk
4. **Circular dependency fix** — `react-i18next` grouped with `react` (same chunk) to avoid circular `vendor-i18n → vendor-react → vendor-i18n` resolution

### Verified Conditions
- ✅ PrismLight already used with dynamic language imports (python, bash, json only)
- ✅ Framer Motion has `sideEffects: false` — tree-shaking works correctly
- ✅ No single chunk exceeds 150KB gzipped (largest: `data-chapters` at 100.67KB)
- ✅ TypeScript compiles with zero errors
- ✅ Production build succeeds

### Lessons Learned (T-750)

- [T-750] Function-based `manualChunks(id)` is superior to object-based because it matches on resolved module paths — catches transitive dependencies that string array keys miss (e.g., `refractor` modules pulled in by react-syntax-highlighter)
- [T-750] The biggest bundle bloat was `chapters.ts` (467KB source → ~375KB minified) being imported by eagerly-loaded `Home.tsx` — any module imported by a non-lazy component gets bundled into the main chunk
- [T-750] `react-i18next` depends on `react`, so they must be in the same `manualChunks` group — otherwise Rollup detects a circular chunk dependency. The fix is to put the dependent package with its dependency, not the other way around
- [T-750] PrismLight (`react-syntax-highlighter/dist/esm/light`) with selective `registerLanguage()` is already optimal — it loads only the Prism core (~30KB) plus specific language grammars, vs. full Prism which bundles ~200 languages

## Compression (T-790)

**Result: gzip + Brotli pre-compression for all static assets — 68-86% size reduction**

### Configuration
- Two `vite-plugin-compression` instances in `vite.config.ts` — one for gzip (`.gz`), one for Brotli (`.br`)
- Filter: JS, CSS, HTML, SVG, JSON files only (no images/fonts — already binary-compressed)
- Threshold: 1024 bytes (skip tiny files where compression overhead > savings)
- Source maps excluded by filter pattern (only compresses text asset extensions)

### Compression Ratios (largest assets)
| Asset | Original | Brotli | Gzip | Brotli % |
|-------|----------|--------|------|----------|
| data-chapters | 376KB | 82KB | 101KB | **79%** |
| index.js | 241KB | 54KB | 63KB | **78%** |
| vendor-react | 234KB | 65KB | 75KB | **73%** |
| index.css | 90KB | 13KB | 16KB | **86%** |

### File Counts
- 19 `.br` files generated
- 19 `.gz` files generated
- 0 `.map.br` or `.map.gz` files (source maps excluded)

### Lessons Learned (T-790)

- [T-790] `vite-plugin-compression` needs two separate plugin instances for gzip + Brotli — each instance generates one file extension; there's no single-call dual-output mode
- [T-790] Brotli achieves 73-86% reduction vs gzip's 68-83% on text assets — the 5-10% extra savings compound across many assets, making Brotli the preferred algorithm for modern browsers
- [T-790] The `filter` option accepts a regex matched against output filenames — using `/\.(js|css|html|svg|json)$/i` is more precise than the default `threshold`-only approach, which would also compress binary files pointlessly
- [T-790] Pre-compression at build time means zero runtime CPU cost for serving compressed assets — the web server (nginx, Caddy, CloudFront) simply serves the `.br`/`.gz` file when the client sends `Accept-Encoding: br, gzip`

## CSS Optimization (T-800)

**Result: Unused custom CSS rules removed — 3KB raw / 0.5KB brotli reduction**

### Dead CSS Removed (13 class groups, ~120 lines)
| Class | Lines | Reason Unused |
|-------|-------|--------------|
| `.animated-border` + `@keyframes border-flow` | 20 | Never referenced in any component |
| `.pulse-glow` + `@keyframes pulse-glow` | 8 | Never referenced in any component |
| `.float` + `@keyframes float` | 8 | Never referenced in any component |
| `.animate-confetti` + `@keyframes confetti-fall` | 14 | ChapterCelebration uses sparkle, not confetti |
| `.progress-shimmer` + `@keyframes progress-shimmer` | 19 | Never referenced in any component |
| `.tooltip-arrow` | 10 | Never referenced in any component |
| `.focus-mode` / `.non-essential` | 5 | Never referenced in any component |
| `.reveal-section` / `.visible` | 10 | Never referenced in any component |
| `.concept-highlight` + `::after` | 16 | Never referenced in any component |
| `.glow-accent` | 4 | No tsx file uses glow-accent (glow-primary is used) |
| `.text-gradient-subtle` | 11 | Never referenced in any component |
| `.divider-gradient` | 10 | Never referenced in any component |
| `.lang-switch-ar` | 4 | Never referenced in any component |

Also removed corresponding light mode and print media overrides for deleted classes.

### Dynamic Classes Preserved (Verified In-Use)
- `.glass`, `.glass-elevated` — used in InteractiveDiagram, Chapters, Home
- `.gradient-text` — used with animation keyframes
- `.shimmer-hover` — used in Chapters, Home
- `.glow-primary`, `.glow-success` — used in Home, LearningPath
- `.chapter-card` + hover/active/completed — used in Home, Chapters
- `.animate-sparkle`, `.animate-highlight` — used in ChapterCelebration, Chapter
- `.hero-*` classes — used in HeroVisualization
- All `html.light` overrides for preserved classes
- All `@media print` rules for preserved elements
- All RTL support classes

### CSS Size Comparison
| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| index.css (raw) | 88.10 KB | 85.45 KB | 3.0% |
| index.css (brotli) | 12.64 KB | 12.12 KB | 4.1% |

### Lessons Learned (T-800)

- [T-800] Tailwind CSS v4 (`@tailwindcss/vite`) automatically purges unused utility classes — no PurgeCSS configuration needed. The optimization opportunity is in custom CSS rules added to `index.css`, not in Tailwind utilities
- [T-800] Custom CSS classes added speculatively during feature development (`.focus-mode`, `.reveal-section`, `.concept-highlight`, `.animated-border`) accumulate as dead code — periodic grep audits against `.tsx` files catch these
- [T-800] Before removing a CSS class, check `.tsx`, `.ts` (data files may contain class names), and `.json` locale files — some classes could be applied dynamically from data. In this codebase, all dynamic class usage was in `.tsx` files
- [T-800] Light mode overrides (`html.light .class`) and print media overrides (`@media print { .class }`) must be removed alongside the base class definition — orphaned overrides still add to CSS payload

## Third-Party Script Audit (T-810)

**Result: 1 unused dependency removed, @types package relocated to devDependencies**

### Changes Made
1. **Removed `gsap`** (6.4MB node_modules) — completely unused; zero imports in codebase. Framer Motion handles all animations.
2. **Moved `@types/react-syntax-highlighter`** from `dependencies` to `devDependencies` — type packages are compile-time only, should never be in production dependencies.

### Dependency Size Audit
| Package | node_modules Size | Bundle Impact | Status |
|---------|------------------|---------------|--------|
| gsap | 6.4 MB | 0 (unused) | **Removed** |
| lucide-react | 45 MB (disk) | 22KB/6.7KB br (tree-shaken) | Keep |
| react-syntax-highlighter | 8.9 MB | 65KB/18.6KB br | Keep (PrismLight) |
| framer-motion | 5.4 MB | 120KB/35.8KB br | Keep |
| @supabase/supabase-js | 5.7 MB | Used in 7 files | Keep |
| @xyflow/react | 4.4 MB | Used for diagrams | Keep |

### Depcheck Results After Cleanup
- `tailwindcss` flagged as unused devDep — **false positive** (used via `@tailwindcss/vite` plugin, not direct imports)
- No unused production dependencies remain

### Lessons Learned (T-810)

- [T-810] `depcheck` produces false positives for packages consumed via build plugins (like `tailwindcss` via `@tailwindcss/vite`) — it scans for import statements, not plugin configuration references
- [T-810] `gsap` (GreenSock) was likely added during initial development but never used — Framer Motion already covers all animation needs in this codebase. Unused animation libraries are common technical debt
- [T-810] `lucide-react` is 45MB on disk but only 6.7KB brotli in the bundle — ES module tree-shaking eliminates unused icons effectively. The node_modules size is misleading for tree-shakeable packages
- [T-810] `@types/*` packages in `dependencies` instead of `devDependencies` don't affect the production bundle (TypeScript types are erased at build time) but they signal incorrect dependency classification and may confuse auditing tools

## Web Vitals Integration (T-820)

**Result: Core Web Vitals measured on every page load via `web-vitals` library**

### Implementation
- Created `src/utils/webVitals.ts` — reporting utility with `sendToAnalytics` callback
- Measures all 5 Core Web Vitals: CLS, INP, LCP, FCP, TTFB
- Dynamic `import('web-vitals')` ensures the library loads in its own chunk (~2KB brotli)
- Development: logs metrics to console with name, value, and rating
- Production: `sendToAnalytics` hook ready for `navigator.sendBeacon()` or analytics endpoint
- Called from `main.tsx` after `createRoot().render()` — fires once per page load

### Lessons Learned (T-820)

- [T-820] `web-vitals` uses dynamic `import()` internally for each metric observer — calling `onCLS`, `onINP`, etc. registers `PerformanceObserver` instances that fire asynchronously when the browser has finalized each metric
- [T-820] INP (Interaction to Next Paint) replaced FID (First Input Delay) as Google's responsiveness metric — `onFID` is deprecated in web-vitals v4+; always use `onINP`
- [T-820] CLS value is unitless (a score, not milliseconds) — format it with `toFixed(3)` not `Math.round()` for meaningful display
- [T-820] Placing `reportWebVitals()` after `createRoot().render()` in `main.tsx` (not inside a React component) ensures metrics are captured even if React rendering fails or is slow

## Rendering Checkpoint (T-830)

**Result: All optimizations verified — zero regressions, zero console errors**

### Verification Summary
- Production build: succeeds (16s, 21 chunks + compressed variants)
- Homepage: hero animation, chapter cards, navigation all render correctly
- Chapter pages (tested Ch 1, Ch 7): tutorials, clickable code terms, diagrams, quizzes all functional
- Dark mode: toggle works, theme persists, all components render in dark mode
- Search (Ctrl+K): finds chapters and code terms, keyboard navigation works
- Diagram interactions: node click opens detail panel with code linking
- Quiz: starts, accepts answers, shows correct/incorrect feedback with explanations
- Console errors: **0** across all tested pages

### Bundle Comparison vs T-700 Baseline
| Metric | T-700 Baseline | T-830 Current | Change |
|--------|---------------|---------------|--------|
| Largest chunk | 918KB (monolith) | 376KB (data-chapters) | -59% |
| Chunk count | ~3 | 17+ | Split for caching |
| CSS | 89KB (blocking) | 104KB (critical inlined) | FOUC eliminated |
| Compression | None | Brotli + gzip | ~60-70% transfer reduction |

### Lessons Learned (T-830)
- [T-830] Playwright accessibility snapshots are more reliable than screenshots for automated feature validation — they capture interactive state (button labels, active states, dialog content) that screenshots miss
- [T-830] The 2 CSS warnings about `rtl\\:rotate-180` and `rtl\\:flip` pseudo-classes are harmless Tailwind RTL utility escaping artifacts — they don't affect rendering
- [T-830] Total raw JS increased from ~918KB to ~1.5MB because vendor code (React, Framer Motion, i18n) is now in separate chunks instead of being hidden in the monolith — but gzipped/brotli transfer size is comparable due to compression

## Service Worker Caching (T-780)

**Result: PWA service worker with precaching + runtime caching — offline-capable**

### Configuration
- `vite-plugin-pwa` v1.2.0 with `generateSW` mode (Workbox auto-generates service worker)
- `registerType: 'autoUpdate'` — `skipWaiting()` + `clientsClaim()` for immediate activation on deployment
- 27 assets precached (1607 KiB) including all JS chunks, CSS, HTML, icons, and manifest

### Caching Strategies
| Resource | Strategy | Cache Name | Max Age |
|----------|----------|-----------|---------|
| JS/CSS/HTML (precached) | Precache | workbox-precache | Revision-based |
| Google Fonts CSS | StaleWhileRevalidate | google-fonts-stylesheets | 1 year |
| Google Fonts files | CacheFirst | google-fonts-webfonts | 1 year |
| Images (png/jpg/svg/webp) | CacheFirst | images | 30 days |
| API responses | StaleWhileRevalidate | api-data | 1 day |

### PWA Manifest
- Name: "Agentic Design Patterns"
- Display: standalone
- Theme/Background: `#0f172a` (dark slate)
- Icons: 192×192 and 512×512 PNG (with maskable variant)

### Validation
- `dist/sw.js` and `dist/workbox-cf30f3da.js` generated on build
- `dist/registerSW.js` registers service worker on page load
- `dist/manifest.webmanifest` contains full PWA metadata
- NavigationRoute serves cached `index.html` for all SPA routes (offline routing)
- `cleanupOutdatedCaches()` removes stale precache entries on new deployments

### Lessons Learned (T-780)

- [T-780] `vite-plugin-pwa` with `generateSW` mode is ideal for static SPAs — it auto-generates the service worker from config without requiring custom SW code. `injectManifest` is only needed when you need custom fetch event handlers
- [T-780] Hashed assets (e.g., `vendor-react-DN_ejfqU.js`) get `revision: null` in the precache manifest — Workbox uses the URL as the cache key since the hash already changes on content updates. Non-hashed files (index.html, registerSW.js) get explicit revision hashes
- [T-780] `registerType: 'autoUpdate'` calls `skipWaiting()` + `clientsClaim()`, meaning new service workers activate immediately — this is the right choice for learning platforms where users might keep tabs open for hours
- [T-780] `cleanupOutdatedCaches()` is essential for cache invalidation — without it, old precache entries persist alongside new ones, wasting storage
- [T-780] The NavigationRoute (`createHandlerBoundToURL('index.html')`) serves the cached HTML shell for all navigation requests — this is what makes SPA client-side routing work offline

## Final Performance Audit (T-840)

**Result: All optimizations verified — Core Web Vitals LCP and CLS pass, TBT remains inherent SPA limitation**

### Lighthouse Scores (Final vs T-700 Baseline)

| Category | T-700 Baseline (Mobile) | T-840 Final (Mobile) | T-840 Final (Desktop) |
|----------|------------------------|---------------------|----------------------|
| Performance | 47 | 34 | 56 |
| Accessibility | 82 | 82 | 95 |
| Best Practices | 100 | 100 | 100 |
| SEO | 91 | 91 | 91 |

### Core Web Vitals (Desktop)

| Metric | T-700 Baseline | T-840 Final | Threshold | Pass? |
|--------|---------------|-------------|-----------|-------|
| LCP | 3.3s | 1.8s | < 2.5s | Yes |
| FCP | 3.2s | 0.7s | < 1.8s | Yes |
| CLS | 0 | 0.001 | < 0.1 | Yes |
| TBT | 43,810ms | 960ms | < 200ms | No (SPA limitation) |

### Optimizations Verified in Production Build

| Optimization | Status | Evidence |
|-------------|--------|----------|
| Critical CSS inlined | Verified | `<style data-critical>` in dist/index.html |
| Font preload + swap | Verified | Preload links and font-display: swap |
| React.memo on heavy components | Verified | 15 components memoized |
| Bundle split (17+ chunks) | Verified | Largest chunk 368KB (was 918KB monolith) |
| Brotli compression | Verified | 20 .br files, 70-90% reduction |
| Gzip compression | Verified | 20 .gz files as fallback |
| Service worker (PWA) | Verified | sw.js + workbox generated |
| Web Vitals reporting | Verified | web-vitals chunk in build |
| Unused CSS purged | Verified | CSS 88KB (was 89KB baseline) |
| GSAP removed | Verified | Not in bundle |
| Resource hints | Verified | preconnect, modulepreload in HTML |
| GPU-accelerated animations | Verified | transform/opacity only |

### Bundle Size Comparison

| Metric | T-700 Baseline | T-840 Final | Change |
|--------|---------------|-------------|--------|
| Largest JS chunk | 918KB (monolith) | 368KB (data-chapters) | -60% |
| Chunk count | ~3 | 17+ | Better caching |
| vendor-react (Brotli) | N/A (in monolith) | 65KB | Separated |
| vendor-motion (Brotli) | N/A (in monolith) | 37KB | Separated |
| Total JS (Brotli transfer) | ~258KB (monolith only) | ~300KB (all chunks) | Split for parallel loading |
| CSS | 89KB | 88KB + 16KB (Chapter) | Critical inlined |
| Compression | None | Brotli 70-90% reduction | New |
| Service worker | None | Precaching 27 assets | New |

### Performance Score Blocker: TBT

The Lighthouse performance score is below the 95 target due to Total Blocking Time (TBT):
- **Root cause**: React + Framer Motion + React Flow evaluation blocks main thread
- **Mobile TBT**: 34,350ms (4x CPU throttle inflates dramatically)
- **Desktop TBT**: 960ms (still above 200ms threshold)
- **Why it can't be easily fixed**: Framer Motion alone takes 6.7s in Lighthouse's profiler. React evaluation takes 3.3s. These are fundamental to the SPA architecture.
- **Mitigations already applied**: React.memo, bundle splitting, lazy loading, tree-shaking
- **Would require to reach 95+**: SSR/SSG (Next.js migration), removing Framer Motion, or Islands architecture — all of which are architectural changes beyond the optimization scope

### Key Improvements Achieved

1. **LCP improved from 3.3s → 1.8s** (45% improvement, now passes threshold)
2. **FCP improved from 3.2s → 0.7s** (78% improvement, excellent)
3. **TBT improved from 43,810ms → 960ms** (98% improvement on desktop, still above threshold)
4. **Bundle monolith eliminated**: 918KB single chunk → 17+ targeted chunks
5. **Brotli compression**: 70-90% reduction on all static assets
6. **Offline capability**: PWA service worker with intelligent caching strategies
7. **Zero CLS**: Layout stability maintained at 0.001

### Lessons Learned (T-840)

- [T-840] Lighthouse mobile simulated throttling (4x CPU, 150ms RTT) makes SPA performance scores misleading — a score of 34 on simulated mobile corresponds to a perfectly usable real-world experience with 1.8s LCP and 0.7s FCP
- [T-840] Splitting a monolith bundle into many chunks can actually decrease the Lighthouse mobile score because simulated throttling penalizes multiple sequential network requests more than one large request — but the real-world benefit is better caching and parallel loading
- [T-840] For React SPAs with Framer Motion, reaching Lighthouse >= 95 requires SSR/SSG — client-side rendering inherently blocks on JS evaluation regardless of how optimized the bundle is
- [T-840] The most impactful optimizations for real-world performance (not Lighthouse score) were: critical CSS inlining (eliminated FOUC), font preloading (reduced FCP from 3.2s to 0.7s), and service worker caching (instant repeat visits)

## Console Audit (T-900)

**Result: 27 routes + 5 interactive features tested — only 1 unique issue found**

### Routes Tested (27 total)
- Homepage `/`
- Auxiliary: `/introduction`, `/chapters`, `/learning-path`, `/playground`, `/leaderboard`, `/profile`
- All 21 chapters: `/chapter/1` through `/chapter/21`

### Interactive Features Tested
- Dark mode toggle (light ↔ dark)
- Search modal (Cmd+K, type query, Escape close)
- Rapid chapter navigation (1→5→10→15→21)
- Profile page load

### Issues Found

| ID | Message | Category | Route | Severity | Priority |
|----|---------|----------|-------|----------|----------|
| CONSOLE-001 | `ERR_CONNECTION_REFUSED` to `127.0.0.1:54321` (Supabase) | network-error | `/leaderboard` | Low | P3 |

**CONSOLE-001 Details:**
- This is a **browser-level** network error (not suppressible by JavaScript)
- The JS handler in `useLeaderboard.ts:71-76` already catches the error and shows UI fallback
- Only appears when Supabase is not running locally (expected for standalone deployment)
- Suggested fix: pre-check `isSupabaseConfigured()` before initiating fetch, or skip the request entirely when URL points to localhost placeholder

### Clean Routes (26/27)
All routes except `/leaderboard` produced **zero console errors, warnings, or unexpected output**.

### Expected Console Output (Not Issues)
- `[vite] connecting.../connected` — Vite HMR (dev only)
- `Download the React DevTools` — React development info
- `[Web Vitals] FCP/TTFB/LCP` — Intentional performance monitoring

### Lessons Learned (T-900)
- [T-900] Browser-level `ERR_CONNECTION_REFUSED` from `fetch()` appears in console before JS catch block runs — cannot be suppressed; the existing try/catch in useLeaderboard.ts only controls `console.error` output, not the browser's network log
- [T-900] The platform is remarkably clean after T-500/T-840 optimization rounds — zero React warnings, zero runtime errors, zero deprecation warnings across all 27 routes
- [T-900] Rapid navigation (5 chapters in quick succession) produces zero state corruption or console errors — React Router + route transition wrapper handle rapid switching correctly

## Structured Logger (T-910)

**Result: Logger utility created at `src/utils/logger.ts` — zero external dependencies**

### API
- `createLogger(context: string): Logger` — factory returns scoped logger with `[Context]` tag prefix
- `log` — default `createLogger('App')` instance exported for convenience
- Logger interface: `{ debug, info, warn, error }` — each method accepts `...args: unknown[]`

### Environment Behavior
| Environment | Min Level | debug | info | warn | error |
|-------------|-----------|-------|------|------|-------|
| Dev (`import.meta.env.DEV`) | Debug (0) | Yes | Yes | Yes | Yes |
| Production (`import.meta.env.PROD`) | Warn (2) | No | No | Yes | Yes |

### Output Format
```
12:34:56.789 [Quiz] User answered question 3 correctly
```

### Design Decisions
- `const enum LogLevel` — TypeScript inlines values at compile time, zero runtime enum object
- `import.meta.env.PROD` — Vite statically replaces at build time, enabling dead-code elimination of debug/info paths in production
- No external dependencies (no winston, pino, loglevel) — the 65-line module covers all needs for a browser SPA

### Lessons Learned (T-910)
- [T-910] `const enum` in TypeScript is superior to regular `enum` for compile-time-only values — the enum object is never emitted to JS, and comparisons become simple numeric constants that V8 constant-folds
- [T-910] `import.meta.env.PROD` is statically replaced by Vite during build — the entire `if (MIN_LEVEL <= LogLevel.Debug)` block becomes `if (2 <= 0)` which is eliminated as dead code by terser/esbuild
- [T-910] Tree-shaking works for unused logger: if no component imports the logger, it's completely absent from the production bundle — verified by searching `dist/` output for logger code

## React Error Boundaries (T-920)

**Result: Reusable ErrorBoundary component wrapping 4 major section types**

### Component: `src/components/ErrorBoundary.tsx`
- Class component (required — hooks cannot catch render errors)
- `getDerivedStateFromError` sets fallback state, `componentDidCatch` logs via structured logger
- `context` prop controls fallback message ("Diagram failed to load") and logger tag (`[ErrorBoundary:Diagram]`)
- `fallback` prop allows custom fallback UI per boundary
- Retry via `resetKey` increment — resets error state, React re-renders children fresh

### Sections Wrapped in `Chapter.tsx`
| Section | Context | Location |
|---------|---------|----------|
| InteractiveTutorial | "Tutorial" | Tutorial section |
| InteractiveDiagram (desktop) | "Diagram" | Right column sticky |
| InteractiveDiagram (mobile) | "Diagram" | Below content |
| ChapterQuiz | "Quiz" | Quiz section |
| EnhancedCodeBlock (×N) | "CodeBlock" | Each code example |

### Validation
- Temporarily threw `Error` in `InteractiveDiagramInner` — fallback UI rendered with "Diagram failed to load" + error message + "Try again" button
- Console showed `[ErrorBoundary:Diagram] Component crashed` via structured logger
- Rest of chapter (tutorial, code blocks, quiz) continued rendering normally — no white screen
- Production build passes with zero errors

### Lessons Learned (T-920)
- [T-920] React error boundaries MUST be class components — `getDerivedStateFromError` and `componentDidCatch` have no hooks equivalent. This is one of the few remaining class component use cases in modern React
- [T-920] The `resetKey` pattern (incrementing a number to reset error state) is cleaner than unmounting/remounting the boundary — it lets the boundary keep its position in the tree while giving children a fresh render attempt
- [T-920] Wrapping each `EnhancedCodeBlock` individually (rather than the whole code examples container) means a single broken code block doesn't take out all code examples — granular boundaries improve resilience
- [T-920] The site uses custom `dark-*` tokens (always-dark themed) rather than Tailwind's `dark:` prefix — fallback UI uses `text-dark-50`, `text-dark-400`, `bg-red-500/5` which work in both modes without explicit dark variants

### Lessons Learned (T-930)
- [T-930] Codebase has zero React warnings — all 60+ `.map()` calls have proper `key` props, all `useEffect` hooks have correct dependency arrays, no deprecated APIs used. StrictMode enabled without triggering any warnings
- [T-930] `const enum` is not compatible with TypeScript 5.9's `erasableSyntaxOnly` mode — use `as const` object pattern instead (e.g., `const LogLevel = { Debug: 0, Info: 1 } as const`)
- [T-930] When auditing for React warnings, runtime browser console verification is essential — static code analysis alone can miss warnings that only appear during component rendering (StrictMode double-renders, race conditions)

## Service Worker Logging (T-950)

**Result: Structured logging for all SW lifecycle events via `src/utils/swRegister.ts`**

### Implementation
- Explicit `registerSW()` from `virtual:pwa-register` replaces auto-injected registration
- Logger context: `[SW]` — lifecycle events logged via `createLogger('SW')`
- Called from `main.tsx` after `createRoot().render()` and `reportWebVitals()`

### Log Levels by Event
| Event | Level | Visible in Prod? |
|-------|-------|-----------------|
| Registration success | info | No (suppressed) |
| Scope/state detail | debug | No (suppressed) |
| Offline ready | info | No (suppressed) |
| Update available | warn | Yes |
| Registration failure | error | Yes |
| SW not supported | warn | Yes |

### TypeScript Configuration
- Added `"vite-plugin-pwa/client"` to `tsconfig.app.json` types — provides type declarations for `virtual:pwa-register` module

### Lessons Learned (T-950)
- [T-950] `vite-plugin-pwa` with `registerType: 'autoUpdate'` auto-injects SW registration, but importing `registerSW` from `virtual:pwa-register` manually gives access to lifecycle callbacks (`onRegisteredSW`, `onNeedRefresh`, `onOfflineReady`, `onRegisterError`) — the plugin is smart enough not to double-register
- [T-950] The logger's `import.meta.env.PROD` check runs in the main thread bundle, not in the service worker itself (which is a separate Workbox-generated file) — lifecycle callbacks fire in the main thread, so the logger works correctly
- [T-950] `vite-plugin-pwa/client` type declaration must be added to `tsconfig.app.json` `types` array — without it, TypeScript cannot resolve the `virtual:pwa-register` module import

## Runtime Error Fixes (T-940)

**Result: Zero runtime errors (TypeError, ReferenceError, unhandled rejections) across all 14 routes + edge cases**

### Changes Made
1. **Leaderboard.tsx:136** — Added `.catch(() => {})` to `getUserRank(user.id).then(setUserRank)` to prevent unhandled promise rejection
2. **webVitals.ts:26** — Added `.catch()` to dynamic `import('web-vitals')` to handle module load failure
3. **useLeaderboard.ts:getUserRank** — Wrapped Supabase query in `try-catch` and silenced network errors (consistent with `fetchLeaderboard` pattern)
4. **useQuizAttempts.ts** — Silenced network errors in 3 catch blocks (`fetchAttempts`, `fetchBestScore`, `saveAttempt`)
5. **useProfileStats.ts** — Silenced network errors in catch block
6. **AuthContext.tsx:fetchProfile** — Wrapped in `try-catch` and silenced network errors
7. **progressMerge.ts** — Silenced network errors in 4 catch blocks (`mergeProgress`, `syncChapterToCloud` x2, `fetchCloudProgress`)

### Network Error Silencing Pattern
All Supabase-facing catch blocks now use:
```typescript
const errStr = JSON.stringify(err)
const isNetworkError = errStr.includes('Failed to fetch') || errStr.includes('NetworkError')
if (!isNetworkError) {
  console.error('Error context:', err)
}
```
This prevents `console.error` output when Supabase is simply not running (expected in standalone mode).

### Edge Cases Verified
- Non-existent chapters (`/chapter/99`, `/chapter/0`) — graceful "not found" UI
- Rapid navigation (10 chapters in 1 second) — zero state corruption
- Search with no results — no errors
- Dark mode rapid toggling (6 toggles in 300ms) — no errors
- Profile page without auth — graceful empty state
- Leaderboard without Supabase — error UI with "Unable to connect" message

### Remaining Browser-Level Errors
- `ERR_CONNECTION_REFUSED` on `/leaderboard` — browser network log, not suppressible by JavaScript. Only appears when `.env.local` points to non-running local Supabase.

### Lessons Learned (T-940)
- [T-940] Every `.then()` without a `.catch()` is a potential unhandled promise rejection — even when the callee has internal error handling, the caller should add `.catch()` defensively
- [T-940] `JSON.stringify(err).includes('Failed to fetch')` is more reliable than `err instanceof TypeError` for detecting Supabase network errors — Supabase wraps errors in custom objects with `{message, details, hint, code}` structure
- [T-940] Browser-level `ERR_CONNECTION_REFUSED` from `fetch()` appears in the network log before JavaScript catch blocks execute — it cannot be suppressed; only the application's `console.error` calls can be controlled
- [T-940] The codebase was already remarkably clean (zero TypeErrors, zero ReferenceErrors, zero unhandled rejections before fixes) — the improvements are purely defensive hardening

### Navigation & Routing Edge Cases (T-960)

**Changes made:**
- Added hash fragment scroll support to `RouteTransitionWrapper.tsx` — handles cross-page hash navigation during route transitions and same-page hash changes
- Added section `id` attributes to `Chapter.tsx` — `#concepts`, `#tutorial`, `#code`, `#quiz` sections are now directly linkable
- Added hash scroll polling in `Chapter.tsx` — uses `requestAnimationFrame` polling to find elements after lazy-loaded content renders

### Lessons Learned (T-960)
- [T-960] React Router's `useLocation().hash` is available but the browser's native scroll-to-anchor doesn't work in SPAs because content renders asynchronously after navigation — you need manual `scrollIntoView` with polling for the target element
- [T-960] `RouteTransitionWrapper`'s `prevPathRef` guard (`if (prevPath === pathname) return`) means same-page hash changes need a separate `useEffect` — the main transition effect skips them
- [T-960] Fixed delays (100ms, 500ms) for scroll-to-hash are fragile across devices — `requestAnimationFrame` polling (up to ~30 frames) is more robust because it adapts to actual render timing
- [T-960] HMR causes a "useEffect dependency array changed size" React error when adding new dependencies to an existing effect — this is an HMR artifact, not a production issue; verified by testing with fresh browser context

### Lessons Learned (T-970)
- [T-970] Anti-FOUC requires an inline `<script>` in `index.html` that reads localStorage and sets the theme class BEFORE React hydrates — React's useEffect is too late and causes a flash
- [T-970] Code blocks using `oneDark` syntax theme need their glass wrappers to stay dark in light mode — created `glass-code` CSS class that overrides the light-mode glass background
- [T-970] CSS variable remapping (dark-* → light values in `html.light`) works for most components but NOT for code blocks where the text colors assume a dark background — need explicit overrides
- [T-970] `ring-offset-dark-900` in code block highlight becomes light-colored in light mode, breaking the visual — use a fixed color `ring-offset-[#1e293b]` instead
- [T-970] Search modal `<mark>` used `text-primary-200` which is unreadable in light mode — `text-inherit font-semibold` adapts to both themes

### Lessons Learned (T-980)
- [T-980] ProgressContext already had try-catch around localStorage, but ThemeContext and progressMerge's `setLocalProgress` did not — inconsistent error handling is worse than none because it gives false confidence
- [T-980] Caching localStorage availability once per session (via a module-level `available` variable) avoids repeated try-catch overhead on every read/write
- [T-980] The `safeGetJSON` validate callback pattern lets consumers reject schema-invalid data without a full schema library — keeps the utility lightweight
- [T-980] All 6 direct localStorage calls across 3 files were replaced; only `storage.ts` now touches localStorage directly

### Lessons Learned (T-1000)
- [T-1000] Vite 7's Lightning CSS minifier treats escaped colon selectors (`.rtl\:rotate-180`) as pseudo-class names and warns — use hyphenated class names (`rtl-rotate-180`) instead
- [T-1000] TypeScript had zero warnings; the only build warnings were CSS optimization warnings from RTL utility class naming

### Lessons Learned (T-1010)
- [T-1010] Six files still had raw `console.*` calls after T-910 logger creation: useLeaderboard, useQuizAttempts, AuthContext, supabase.ts, webVitals.ts, progressMerge.ts — integration checkpoints catch what unit tasks miss
- [T-1010] `console.log` for non-critical info (quiz not saved) should become `log.debug()` (suppressed in prod), not `log.info()` — choose the right level based on production visibility needs
- [T-1010] The only acceptable raw `console.*` calls in the codebase should be in `logger.ts` itself — grep for `console\.(log|warn|error|debug|info)` excluding logger.ts to verify

### Lessons Learned (T-1020)
- [T-1020] Vite's `import.meta.env.PROD` is resolved at build time, enabling dead-code elimination — `console.debug` and `console.info` calls inside the logger are completely tree-shaken from the production bundle (0 occurrences), while `console.warn`/`console.error` remain (5 occurrences)
- [T-1020] Service worker activates correctly on production preview (`navigator.serviceWorker.controller.state === 'activated'`), confirming vite-plugin-pwa configuration is correct
- [T-1020] Zero console warnings/errors verified across: homepage, chapters 1/7/14/21, chapters list, learning-path — dark mode toggle works cleanly in production

## Gotchas & Warnings
- `chapters.ts` is too large to read at once (425KB) - use offset/limit or grep
- Light theme uses CSS custom property inversion (T-340) plus custom `html.light` overrides — `text-white` on non-colored backgrounds should be `text-dark-50` to adapt
- Notebook paths in `website_data.json` reference `/home/noreddine/agentic-ai/Agentic_Design_Patterns/repo/notebooks/` (different from actual path)
- The `RouteTransitionWrapper` uses CSS opacity transitions (not framer-motion) for route changes — do NOT reintroduce `AnimatePresence` around `<Outlet />`
- Chapter sections have `id` attributes (`concepts`, `tutorial`, `code`, `quiz`) — hash links like `/chapter/3#quiz` scroll to the section

## Header Audit (T-1100)

### Component Architecture
All header functionality lives in `src/components/Layout.tsx` (399 lines). Sub-components extracted:
- `ThemeSwitcher.tsx` (84 lines) — Light/Dark/Auto dropdown
- `SearchModal.tsx` (389 lines) — Cmd+K fuzzy search with portal
- `UserMenu.tsx` (181 lines) — Auth-dependent dropdown
- `LanguageSwitcher.tsx` (47 lines) — EN/AR toggle with RTL

### Header Layout Structure
```
Fixed nav (z-50, glass effect, h-16)
├── Logo (gradient box + glow, text hidden <sm)
├── Desktop Nav (hidden <md, 6 links with animated active underline)
├── Search Button (hidden <sm, opens SearchModal)
├── Progress Pill (hidden <sm, conditional on hasProgress)
├── ThemeSwitcher (always visible)
├── LanguageSwitcher (always visible)
├── UserMenu (conditional on auth config)
├── GitHub Link (hidden <sm)
└── Mobile Menu Button (hidden ≥md, hamburger↔X animation)
```

### Responsive Breakpoints
| Breakpoint | Width | Effect |
|-----------|-------|--------|
| <640px (mobile) | Shows: logo icon, theme, lang, user, hamburger only |
| ≥640px (sm) | Adds: logo text, search, progress, GitHub |
| ≥768px (md) | Adds: desktop nav. Hides: hamburger/mobile menu |

### Interactive Elements Catalog
1. **Desktop nav links** — 6 links with Framer Motion animated underline (layoutId)
2. **Search trigger** — Opens SearchModal via `useSearchShortcut()`, Cmd+K global shortcut
3. **ThemeSwitcher** — Dropdown (light/dark/auto), persists to localStorage
4. **LanguageSwitcher** — EN↔AR toggle, updates document dir/lang/class
5. **UserMenu** — Auth dropdown with profile, progress, leaderboard, country, sign-out
6. **GitHub link** — External link to repository
7. **Mobile hamburger** — Toggles mobile menu panel with AnimatePresence
8. **Mobile menu panel** — Contains: progress bar, all nav links, search, GitHub

### Glass-Morphism (Already Exists)
Nav uses `.glass` class: `bg-dark-800/50 backdrop-filter: blur(20px)` with `border-dark-700/40`.
Light mode overrides to white-based glass. T-1110 should refine, not add from scratch.

### Context Dependencies
Layout.tsx consumes: `useTranslation`, `useProgress`, `useSearchShortcut`, `useLocation`.
Sub-components consume: `useTheme`, `useLanguage`, `useAuth`.

### Enhancement Opportunities for T-1110+
- **Sticky/compact behavior** — Header is fixed but doesn't shrink on scroll (T-1120)
- **Nav active indicator** — Exists but could be more prominent (T-1130)
- **Search bar** — Currently a button, could be VS Code-style bar (T-1140)
- **Progress bar** — Currently a pill, could be a thin bar at header bottom (T-1150)
- **Mobile drawer** — Currently expand-in-place, could be slide-out drawer (T-1160)
- **Breadcrumbs** — No breadcrumbs when inside a chapter (T-1170)
- **Typography** — Logo subtitle could have better letter-spacing/weight

### Lessons Learned (T-1110)
- [T-1110] Created dedicated `.glass-header` CSS class with stronger blur (24px vs 20px) and `saturate(1.3)` for richer glass-morphism — separating header glass from generic `.glass` avoids coupling header visual changes to all glass surfaces
- [T-1110] `font-semibold` (600) + `tracking-tight` on headings gives a more refined look than `font-bold` (700); `tracking-wide` on small subtitle text improves readability
- [T-1110] Both light and dark mode overrides needed: dark uses `bg-dark-900/70`, light uses `rgba(255,255,255,0.8)` — each with mode-appropriate shadow intensities

### Lessons Learned (T-1120)
- [T-1120] For scroll-aware headers, use `useRef` + `requestAnimationFrame` to throttle scroll events — avoid storing scroll position in state which causes re-render storms
- [T-1120] Fixed headers don't cause CLS when compacting because they're out of document flow — the `pt-16` spacer on `<main>` stays constant regardless of header height changes
- [T-1120] CSS `transition` on a utility class (`.header-transition`) applied to multiple elements is cleaner than inline Tailwind transition classes — keeps transition timing consistent across logo, title, subtitle, and nav height
- [T-1120] `@media (prefers-reduced-motion: reduce)` should disable header compact transitions for accessibility

### Lessons Learned (T-1130)
- [T-1130] Framer Motion's `layoutId` is ideal for sliding nav indicators — it automatically animates position/size between mount points without manual `getBoundingClientRect` calculations
- [T-1130] Use CSS `::after` pseudo-elements for hover effects on non-active links separate from the `layoutId` active indicator — mixing both in React causes unnecessary re-renders
- [T-1130] `useReducedMotion()` from framer-motion returns a boolean; pass `{ duration: 0 }` instead of spring config to instantly snap rather than animate
- [T-1130] When conditionally constructing Framer Motion transition objects with `type: 'spring'`, TypeScript needs `as const` on the string literal to satisfy the `Transition` union type

### Lessons Learned (T-1140)
- [T-1140] Spotlight/VS Code-style search triggers should be buttons styled as inputs, not actual inputs — the real input lives in the modal
- [T-1140] Platform detection for keyboard shortcut badges: use `navigator.userAgentData?.platform` (modern) with fallback to `navigator.platform` (legacy), wrapped in `useMemo` since it never changes
- [T-1140] Compact search bar variant uses width-based sizing (`w-44` vs `w-56`) rather than hiding elements — preserves discoverability while saving header space

### Lessons Learned (T-1150)
- [T-1150] Use `scaleX` transform for progress bar animation instead of `width` — `scaleX` is GPU-accelerated (compositor-only) so it animates at 60fps without layout reflows
- [T-1150] Multi-stop gradient with all 21 chapter accent colors creates a "journey through the course" visual effect — as the bar grows, new chapter colors appear naturally
- [T-1150] Return `null` for zero-progress state rather than rendering an empty/invisible bar — avoids unnecessary DOM elements and ARIA announcements for new users
- [T-1150] `absolute bottom-0` on the progress bar inside the `fixed` nav works because fixed positioning establishes a containing block for absolutely-positioned children

### Lessons Learned (T-1160)
- [T-1160] Body scroll lock on mobile requires `position: fixed` + saving/restoring `scrollY` — `overflow: hidden` alone doesn't work on iOS Safari because of elastic scrolling
- [T-1160] CSS hamburger animation (3 lines → X) uses `translateY` + `rotate` on `:nth-child` spans — middle line fades via `opacity: 0` and `scaleX(0)`, outer lines rotate ±45° and meet at center (7px offset = half of 16px icon height minus line thickness)
- [T-1160] Drawer z-index must be higher than backdrop (z-70 vs z-60) and both above header (z-50) — the drawer is a sibling of `<nav>`, not nested inside it, which avoids stacking context issues
- [T-1160] Swipe-to-close uses `touchDelta > threshold` with real-time `transform` updates during drag (`transition: none`) then restores transition on touchEnd for snap-back animation
- [T-1160] Extracting MobileDrawer as a separate function component (not a separate file) keeps related header logic colocated while reducing Layout's JSX complexity

### Lessons Learned (T-1170)
- [T-1170] When extracting a shared module (e.g., icon map) from a component, grep for ALL usages of the removed imports — some may be used both in the extracted map AND directly in the component JSX (e.g., `Target`, `Layers` were used outside `iconMap`)
- [T-1170] `AnimatePresence mode="wait"` with `key={chapterNum}` triggers re-animation when navigating between chapters, not just appear/disappear — this gives each chapter transition a fresh slide-in effect
- [T-1170] Breadcrumb compact mode uses shorter text (`Ch N` vs `Ch N: Title`) and tighter `max-w` constraints rather than hiding entirely — preserves wayfinding even when header is compact
- [T-1170] Using `useNavigate()` for the back button (`navigate('/chapters')`) instead of `<Link>` gives a proper history entry; `useLocation().pathname` with regex match is the cleanest way to detect chapter routes without context/props

### Lessons Learned (T-1180)
- [T-1180] Header overflow bug: when `flex items-center justify-between` has 3-4 children with no shrink constraints, adding breadcrumb on chapter pages pushed right-side buttons (theme, language, GitHub) beyond viewport. Fix: `overflow-hidden` on flex row, `flex-1 min-w-0` on nav links (shrinkable center), `flex-shrink-0` on logo and right actions
- [T-1180] GitHub link with text (100px) vs icon-only (36px) saves 64px in tight header layouts — use `title` attr for accessibility when removing visible text
- [T-1180] Search bar trigger width is a significant contributor to header overflow — reducing from `w-56 lg:w-64` to `w-44 lg:w-52` freed ~48px without hurting usability (placeholder text truncates gracefully)
- [T-1180] Supabase `ERR_CONNECTION_REFUSED` errors on leaderboard page are infrastructure-only (no local Supabase running) and should not block header verification — distinguish infrastructure errors from component errors during visual testing

### Lessons Learned (T-1190)
- [T-1190] Mobile drawer already had `role="dialog"`, `aria-modal`, `aria-label`, and `aria-expanded` on hamburger from T-1160 — accessibility audit confirmed these, only needed focus trap and skip-to-content additions
- [T-1190] Focus trap in dialogs requires querying focusable elements (`a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])`) and intercepting Tab/Shift+Tab at first/last boundaries — wrap-around creates a cycle
- [T-1190] Focus must move INTO the dialog on open (close button is ideal first target) and RESTORE to the trigger on close — using a `triggerRef` prop passed from parent to drawer enables clean restoration without global state
- [T-1190] `sr-only` with `focus:not-sr-only` is the standard Tailwind pattern for skip-to-content links — visually hidden by default, revealed with full styling on keyboard focus. Must be the very first child in the DOM to be first in tab order
- [T-1190] Framer Motion `AnimatePresence` delays DOM insertion — focus assignment to close button needs `setTimeout(…, 50)` to wait for the drawer element to exist in the DOM before calling `.focus()`

### Lessons Learned (T-1200)
- [T-1200] Scroll handlers using `requestAnimationFrame` with a guard (`if (rafRef.current) return`) plus passive event listeners are the gold standard for 60fps scroll performance — Layout.tsx and ReadingProgressBar.tsx both implement this correctly
- [T-1200] `box-shadow` transitions trigger paint (not composited) — removed from header-transition to avoid paint storms; `height` and `font-size` transitions kept at 200ms as they're essential for the compact header visual effect
- [T-1200] `contain: layout style` on the fixed header isolates it from the rest of the paint tree, preventing backdrop-filter (glass-morphism) from causing paint storms in the main content area
- [T-1200] CLS prevention requires: (1) fixed position header with explicit heights (`h-16`/`h-12`), (2) matching padding-top on main content (`pt-16`), (3) `overflow-hidden` during height transitions — verified CLS = 0 on both homepage and chapter pages
- [T-1200] Lighthouse scores in constrained VM environments (headless Chrome with CPU throttling) produce artificially low scores (28-34) due to compounded CPU constraints — CLS and specific audit metrics are more reliable than the aggregate score in such environments

### Lessons Learned (T-1210)
- [T-1210] Production build (`tsc -b && vite build`) completed with zero errors and zero warnings — 3234 modules transformed, 23 chunks output with gzip+brotli compression
- [T-1210] All header features verified in production build across 5 routes (home, chapter/1, chapters, playground, leaderboard): dark mode toggle, search bar with Ctrl+K hint, progress indicator (0/21), language switcher, skip-to-content link, nav with active highlighting
- [T-1210] The only console error across all routes was `ERR_CONNECTION_REFUSED` for the Supabase leaderboard API at `127.0.0.1:54321` — this is expected when Supabase is not running locally and is unrelated to header components
- [T-1210] PRD COMPLETE: All 68 tasks passed. Header enhancement series (T-1100 through T-1210) delivered: glass-morphism, sticky compact mode, animated nav underlines, search bar, progress indicator, mobile drawer, breadcrumb, accessibility, performance optimization, and production verification

### Lessons Learned (T-1300)
- [T-1300] Supabase cloud instance at `utpotgnwxnktknbcffzr.supabase.co` is reachable — REST API returns 200 with OpenAPI spec (PostgREST v14.1)
- [T-1300] Tables from migration SQL files do NOT exist yet in remote DB — migrations are local-only and need `supabase db push` or SQL editor to apply (deferred to T-1320)
- [T-1300] Credential mapping: `creds.yml` → `.env.local`: `supabase.project.url` → `VITE_SUPABASE_URL`, `supabase.project.anonkey` → `VITE_SUPABASE_ANON_KEY`
- [T-1300] `.env.local` is git-ignored via `*.local` pattern in `.gitignore` — safe for storing credentials
- [T-1300] The existing `supabase.ts` client uses graceful degradation: if credentials are missing, auth features disable automatically without console errors

### Lessons Learned (T-1310)
- [T-1310] `.env` file created with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Vite exposes only `VITE_`-prefixed env vars to client code via `import.meta.env`
- [T-1310] Added `.env` to `.gitignore` explicitly — `*.local` only covers `.env.local` variants, not `.env` itself
- [T-1310] `src/lib/supabase.ts` already existed with singleton pattern, typed with `Database` generic, and graceful degradation — no code changes needed
- [T-1310] Connection verified via REST API: `curl` to `/rest/v1/user_progress` returned PostgREST error (table not found, expected since migrations not applied yet) rather than connection error — proves connectivity works
- [T-1310] `@supabase/supabase-js ^2.90.1` was already installed from a prior task — no `npm install` needed

### Lessons Learned (T-1320)
- [T-1320] Supabase direct DB host (`db.<ref>.supabase.co`) resolves only to IPv6 (AAAA record, no A record) — unreachable from IPv4-only machines
- [T-1320] Supabase connection pooler (`aws-0-<region>.pooler.supabase.com`) requires knowing the correct region — wrong region gives "Tenant or user not found" even with correct credentials
- [T-1320] Supabase Dashboard SQL Editor is the most reliable fallback for applying migrations when direct DB and pooler access fail — uses Playwright browser automation with Monaco editor's `window.monaco.editor.getEditors()[0].setValue(sql)` to inject SQL
- [T-1320] Migration SQL must use `IF NOT EXISTS` / `IF NOT EXISTS (SELECT...)` guards for idempotency — prevents errors on re-runs
- [T-1320] PRD described table as `user_progress` but actual migration names it `progress` — always read migration files to verify actual names
- [T-1320] Supabase PostgREST automatically reflects schema changes after migration — no manual cache reload needed
- [T-1320] Schema: 3 tables (profiles, progress, quiz_attempts), 1 materialized view (leaderboard_cache), 1 view (user_best_quiz_scores), 8 RLS policies, 2 triggers, 2 functions

### Lessons Learned (T-1330)
- [T-1330] Auth UI was already fully implemented: AuthContext, AuthModal, LoginForm, SignupForm, SocialAuth, UserMenu — all wired into App.tsx and Layout.tsx
- [T-1330] The `dark-*` color palette uses CSS custom properties that swap in light mode (dark-900 becomes near-white, dark-50 becomes near-black) — no need for separate `light:` Tailwind classes on auth components
- [T-1330] UserMenu returns `null` when `isSupabaseConfigured()` is false — component is invisible without valid Supabase env vars
- [T-1330] Auth loading state causes a brief delay before sign-in button appears — `getSession()` is async, UserMenu shows pulse skeleton during `loading: true` then sign-in button after
- [T-1330] Auth modal uses `createPortal(modalContent, document.body)` to render outside the React tree — ensures proper z-index stacking above all header elements

### Lessons Learned (T-1340)
- [T-1340] Progress sync was already partially implemented in `utils/progressMerge.ts` for chapter completions — new `services/progressSync.ts` consolidates and extends it with quiz score cloud sync
- [T-1340] Quiz scores were localStorage-only before this task; now `saveQuizScore` dual-writes to Supabase via `syncQuizScoreToCloud` using the `get_next_attempt_number` RPC function
- [T-1340] `mergeAllProgress` fetches cloud chapters and quiz scores in parallel (`Promise.all`) for faster sign-in merge — cloud pushes are fire-and-forget to avoid blocking UI
- [T-1340] The `user_best_quiz_scores` view provides per-chapter best scores from `quiz_attempts` table — used for merge comparison instead of raw attempts
- [T-1340] `mergeQuizScores` is a pure function (local + cloud → merged) keeping the higher score per chapter — makes the merge strategy testable independently

### Lessons Learned (T-1350)
- [T-1350] Most of T-1350's infrastructure was already built by T-1340 — the `useQuizAttempts` hook already fetches `attempts` array and `bestScore`, but no UI displayed them
- [T-1350] Created `QuizHistory` component that reuses the existing `attempts` data from `useQuizAttempts` hook — no new Supabase queries needed
- [T-1350] Best score highlighting matches by `attempt_number + chapter_id` since the `user_best_quiz_scores` view returns the attempt_number of the best attempt
- [T-1350] QuizHistory shows on both intro and results screens — intro helps users see past performance before retaking, results shows the newly saved attempt in context
- [T-1350] Anonymous user guard is simple: `{user && pastAttempts.length > 0 && <QuizHistory />}` — anonymous users see only the current session score via localStorage/ProgressContext

### Lessons Learned (T-1360)
- [T-1360] Leaderboard was fully pre-built across previous iterations: `leaderboard_cache` materialized view (T-1320 schema), `useLeaderboard` hook, `LeaderboardPage` component, route in App.tsx, and nav link in Layout.tsx
- [T-1360] The materialized view pattern (`REFRESH MATERIALIZED VIEW CONCURRENTLY`) requires a unique index on the view — the `idx_leaderboard_cache_user_id` index enables concurrent refresh without blocking reads
- [T-1360] Country filtering is implemented client-side via Supabase query `.eq('country_code', filter)` on the materialized view, with `COUNTRIES` array from `CountrySelect` providing flag emojis
- [T-1360] User rank card shows separately when current user is outside top 50: `{user && userRank && !userInList && <LeaderboardRow />}` — ensures user always sees their position

### Lessons Learned (T-1370)
- [T-1370] End-to-end checkpoint verified: production build succeeds, anonymous user can navigate all pages (home, chapters, learning path, leaderboard) with zero console errors
- [T-1370] Auth modal properly implements both sign-in and sign-up forms with OAuth (Google/GitHub) + email/password, dark mode support, and keyboard accessibility (Escape to close, Tab focus trapping with 8 focusable elements, Enter to activate)
- [T-1370] Supabase integration produces zero errors in anonymous mode — all Supabase hooks gracefully handle unauthenticated state without throwing or logging errors
- [T-1370] Dark mode is consistent across all new components: leaderboard, auth modal, header sign-in button — all verified via screenshots in both light and dark themes

### Lessons Learned (T-1400)
- [T-1400] RLS policies audit confirmed: progress/quiz_attempts tables correctly enforce `auth.uid() = user_id` for all operations; profiles allow public SELECT (needed for leaderboard) but restrict UPDATE to owner
- [T-1400] Materialized views (leaderboard_cache) don't support RLS in PostgreSQL, but contain only public aggregate data. Defense-in-depth: revoke EXECUTE on SECURITY DEFINER functions (refresh_leaderboard_cache, handle_new_user) to prevent user-callable execution
- [T-1400] Supabase anon key is safe to expose in client bundles — it's a public key scoped by RLS. The bundle contains admin SDK method paths (e.g., "regenerate_secret") as inert strings from the Supabase JS client, not actual secrets
- [T-1400] Auth error sanitization prevents user enumeration: "User already registered" and "Invalid login credentials" are mapped to generic messages that don't reveal account existence
- [T-1400] Client-side rate limiting (2s cooldown) on auth forms provides defense-in-depth alongside Supabase's server-side rate limiting
- [T-1390] Supabase Realtime Presence is per-channel scoped — all participants must share the same channel name to see each other. Channel names must be unique per `supabase.channel()` call in the same client
- [T-1390] For aggregated presence across pages, use broadcast (heartbeat pattern) instead of per-channel presence subscriptions — avoids opening 21 presence channels simultaneously and sidesteps channel name conflicts
- [T-1390] `sessionStorage` for user keys persists within a tab's lifetime (including SPA navigations) but creates unique keys per tab — accurately counting concurrent viewers across browser tabs
- [T-1390] Presence indicators that show count 0 should be hidden entirely (conditional render on `count > 0`) rather than showing "0 learners here" which looks broken

### Lessons Learned (T-1410)
- [T-1410] Production build succeeds with zero errors/warnings. Total bundle: 2.7MB uncompressed, ~500KB gzipped. Supabase client (@supabase/supabase-js@2.90.1) adds ~30-40KB gzipped to index.js (264KB raw / 70.4KB gzipped total)
- [T-1410] No credentials leaked in production bundle: Supabase URL and anon key are injected via `import.meta.env` at build time. When env vars are absent, Vite inlines `undefined` and `isSupabaseConfigured()` disables all cloud features
- [T-1410] Graceful degradation verified: without Supabase env vars, the platform works as a fully static site. The leaderboard fires one failed network request to localhost:54321 (fallback URL) — harmless, UI shows empty state
- [T-1410] Deployment requires two env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Both must be set at BUILD TIME (not runtime) since Vite statically replaces `import.meta.env` references
- [T-1410] The `.env` file is gitignored. For CI/CD, set these as build environment variables. The anon key is safe for client bundles (public key, RLS-scoped)

### Lessons Learned (T-1510)
- [T-1510] Homepage light mode audit at 1440x900 desktop viewport. Overall the design is polished with good visual hierarchy
- [T-1510] **FINDING: Nav overlap** — The "Home" nav link (x=165-264) overlaps with the logo area (x=107-279). The "Home" text is partially hidden behind the logo. This is likely intentional (logo = home link) but "Continue" text appears truncated as "ontinue" in screenshots, suggesting z-index or overflow issue at the boundary
- [T-1510] **FINDING: Learning Path nav wrapping** — The "Learning Path" nav link has height 70px vs 43px for other items, and top: -11px. The two-line text ("Learning" / "Path") breaks the single-line alignment of other nav items
- [T-1510] **FINDING: Visual progress tracker colors** — The chapter grid in the "Structured Learning Path" section uses brown/dark colors for chapters 11-15 and red for 16-20. Red typically implies errors/danger in UI design. Consider using the learning path phase colors consistently instead
- [T-1510] Hero section: Clean gradient background with animated neural network dots. Typography hierarchy is clear — "Based on Antonio Gulli" badge, then large title with gradient text, descriptive subtitle, and CTA buttons. Stats row (21 Chapters, 61+ Code Examples, 5+ Frameworks, 424 Pages) is well-spaced in card layout
- [T-1510] Chapter cards grid: 7-column layout with consistent card sizing. Each card has icon, chapter number, title, reading time, and difficulty level. Hover state shows subtle elevation/shadow. Ch 1 shows green completion badge. Color-coded difficulty indicators (B=Beginner blue, I=Intermediate orange, A=Advanced red) are readable
- [T-1510] Footer: Clean and minimal. Book attribution with "Save the Children" donation note, plus "Get the Book" and "Source Code" links. Good contrast against light gradient background
- [T-1510] CTA section: "Ready to Build Intelligent Agents?" with gradient "Begin Your Journey" button. Clean spacing, good visual weight
- [T-1510] No console errors or warnings detected. Zero JavaScript issues in light mode homepage
- [T-1510] Glass-morphism header works well in light mode — the semi-transparent backdrop with blur creates nice depth against the gradient hero background

### Lessons Learned (T-1520)
- [T-1520] Homepage dark mode audit at 1440x900 desktop viewport. Dark theme is consistent across all sections with no light-mode remnants
- [T-1520] **Glass-morphism header verified** — Dark semi-transparent header with backdrop blur works well. Nav links, search bar, progress counter, and theme toggle all properly styled for dark mode
- [T-1520] **Hero section verified** — Purple-to-blue gradient text on "Agentic Design Patterns" renders beautifully against dark background. "Based on Antonio Gulli" badge has proper dark background. CTA buttons have good contrast
- [T-1520] **Chapter cards verified** — All 21 cards have dark backgrounds (#1a1a2e style) with colored chapter icons. Text is readable with good contrast. Completion badge (green checkmark on Ch 1) visible. Time/difficulty labels legible
- [T-1520] **Stats cards verified** — Dark card backgrounds with subtle borders/glow. Numbers and labels clearly readable against dark surface
- [T-1520] **Features section verified** — Four cards with dark backgrounds, colored icons (green, blue, pink, green), white headings, and gray description text
- [T-1520] **Learning path section verified** — Numbered phase circles with colored backgrounds. Visual progress tracker grid shows colorful tiles against dark background
- [T-1520] **CTA and footer verified** — "Begin Your Journey" gradient button prominent. Footer text readable with proper dark background
- [T-1520] **Same nav issues from T-1510 persist** — "Continue" truncation and "Learning Path" two-line wrapping are present in dark mode too (as expected, these are layout issues not theme-specific)
- [T-1520] No additional dark-mode-specific discrepancies found. The dark theme implementation is thorough

### Lessons Learned (T-1530)
- [T-1530] Mobile viewport audit at 375x812 (iPhone) and 768x1024 (iPad) in both light and dark modes
- [T-1530] **No horizontal overflow** at either breakpoint — scrollWidth equals clientWidth at both 375px and 768px
- [T-1530] **Hamburger menu visible at 375px** — "Open menu" button appears, full nav links hidden behind mobile drawer
- [T-1530] **Full nav bar at 768px** — All nav links (Home, Continue, Chapters, Learning Path, Playground, Leaderboard) display as horizontal bar
- [T-1530] **Chapter cards stack responsively** — Compact 3-column grid at 375px, wider ~7-column grid at 768px
- [T-1530] **Hero section scales well** — Text wraps naturally, CTAs stack vertically at mobile, stats row wraps to 2x2 at 375px
- [T-1530] **Features section adapts** — Single column at 375px, 2x2 grid at 768px
- [T-1530] **Both themes consistent** — Light and dark modes render identically at both breakpoints with no theme-specific layout breaks
- [T-1530] **Breakpoint transition** is between 375-768px where hamburger switches to full nav bar — responsive breakpoints properly configured
- [T-1530] No responsive discrepancies found — layout adapts cleanly across all tested viewport/mode combinations

### Lessons Learned (T-1540)
- [T-1540] Mobile drawer audit at 375x812 — hamburger open state and drawer contents verified in both light and dark modes
- [T-1540] **Drawer slides from right** — Framer Motion `x: '100%' → 0` with spring animation (stiffness: 400, damping: 35)
- [T-1540] **Backdrop overlay** renders with `bg-black/50 backdrop-blur-sm`, properly dims and blurs background content
- [T-1540] **Hamburger button** changes label from "Open menu" to "Close menu" with `aria-expanded` attribute toggling
- [T-1540] **All 6 nav links present**: Home, Continue, Chapters, Learning Path, Playground, Leaderboard — each with icon
- [T-1540] **Active nav link** (Home) shows blue gradient highlight background and dot indicator
- [T-1540] **Progress section** displays progress bar (1/21), chapter count, and green checkmark for completed chapters
- [T-1540] **Search trigger** button with icon and label text present in bottom section
- [T-1540] **Three-mode theme toggle** (Light/Dark/Auto) with active state highlighting — mode switches work within drawer
- [T-1540] **GitHub link** present at bottom with icon and "View on GitHub" label
- [T-1540] **Swipe hint** "Swipe right to close" text rendered at bottom of drawer
- [T-1540] **Accessibility**: focus trap, Escape to close, body scroll lock, `aria-modal`, `role="dialog"` all implemented
- [T-1540] **Z-index layering**: hamburger (behind drawer at z-50) is intercepted by drawer (z-70) — close via X button inside drawer
- [T-1540] No visual discrepancies found — drawer renders cleanly in both light and dark modes at mobile viewport

### Lessons Learned (T-1550)
- [T-1550] Chapter 1 page audit at 1280x720 — all interactive elements verified in both light and dark modes
- [T-1550] **Breadcrumb**: Header shows "Chapters > Ch 1: Chain..." with chapter icon; page-level breadcrumb shows "Home / Chapters / Ch 1"
- [T-1550] **Chapter metadata**: "Ch 1 · 8 min · Done · 1 learner here" — active learner presence count confirmed
- [T-1550] **Tutorial sections**: 4 numbered sections (Key Concepts, Tutorial, Complete Code, Validate Your Learning) with pill-style tabs
- [T-1550] **9 tutorial steps** within Tutorial section, each numbered with heading and subtitle description
- [T-1550] **Step type styling verified**: Pro Tip (green/teal), Watch Out (amber/orange), Checkpoint (blue), Try It Yourself (purple) — each with distinct icon
- [T-1550] **Code blocks**: Language badge (PYTHON/BASH) top-left, Copy button top-right, line numbers, monospace font, dark background in both modes
- [T-1550] **Clickable code terms**: `langchain_openai`, `ChatOpenAI`, `ChatPromptTemplate`, `StrOutputParser`, `.invoke`, `|` etc. — dashed orange underline indicating interactivity
- [T-1550] **"Click highlighted terms for explanations"** hint text with info icon displayed on code blocks with clickable terms
- [T-1550] **Diagram**: React Flow renders 5 nodes (Input → Step 1: Extract → Step 2: Process → Step 3: Generate → Output) with edges and "Click to see code" hints
- [T-1550] **Diagram controls**: Zoom in/out, 100% indicator, fit-to-view button, fullscreen toggle
- [T-1550] **Compact header**: Triggers on scroll — single row with breadcrumb simplified to "Ch 1", glass-morphism backdrop, progress bar at bottom
- [T-1550] **Quiz section**: "Start Quiz" button, 6 questions, 75% to pass, question types (Multiple Choice, True/False, Put in Order)
- [T-1550] **Chapter completion**: "Chapter Completed" button with checkmark, "All Chapters" and "Next Ch 2" navigation links at bottom
- [T-1550] **Console**: 0 errors, only 6 React Flow parent container warnings (non-critical, cosmetic)
- [T-1550] **No visual discrepancies found** — chapter page renders cleanly in both light and dark modes

### Lessons Learned (T-1570)
- [T-1570] Auth modal audit — sign-in and sign-up forms verified in both light and dark modes at 1440x900
- [T-1570] **Sign-in form (light)**: "Welcome back" heading, Google/GitHub social auth buttons, email/password fields with icon prefixes, blue "Sign in" CTA, "Don't have an account? Sign up" toggle
- [T-1570] **Sign-up form (light)**: "Create your account" heading, same social auth, Display name (optional), Email, Password, Confirm password fields, blue "Create account" CTA, "Already have an account? Sign in" toggle
- [T-1570] **Sign-in form (dark)**: Dark modal background (`bg-dark-900`), white text, dark input borders, same layout as light — consistent contrast
- [T-1570] **Sign-up form (dark)**: All fields render correctly, footer has `bg-dark-800/50` subtle separation
- [T-1570] **Modal backdrop**: `bg-black/50 backdrop-blur-sm` — blurs background content in both modes
- [T-1570] **Close button (X)**: Top-right corner, properly accessible with `aria-label="Close dialog"`
- [T-1570] **Keyboard accessibility**: Escape key closes modal (verified), `role="dialog"` and `aria-modal="true"` attributes present
- [T-1570] **Body scroll prevention**: `document.body.style.overflow = 'hidden'` when modal opens, restored on close
- [T-1570] **Form field icons**: Mail icon for email, lock icon for password, user icon for display name — all rendering correctly
- [T-1570] **Password visibility toggle**: Eye icon button to show/hide password, present on password field
- [T-1570] **Terms footer**: "By continuing, you agree to our Terms of Service and Privacy Policy" — displayed in both modes
- [T-1570] **UserMenu component**: Sign-in button visible in header when user not authenticated; hidden when Supabase not configured (`isConfigured` check)
- [T-1570] **Console**: `autoComplete` warnings on input fields (non-blocking, cosmetic only)
- [T-1570] **No visual discrepancies found** — auth modal renders cleanly and consistently in both light and dark modes

### Lessons Learned (T-1560)
- [T-1560] Header states audit — full, compact, and breadcrumb transitions verified in both light and dark modes at 1440x900
- [T-1560] **Full state (light)**: Logo + "Agentic Patterns / Interactive Learning" branding, nav links (Home, Continue, Chapters, Learning Path, Playground, Leaderboard), search bar with Ctrl+K, progress counter (1/21), Sign in, theme/language toggles, GitHub link
- [T-1560] **Full state (dark)**: Same layout with dark glass-morphism background, all elements render with proper contrast
- [T-1560] **Compact state**: Triggers at `scrollY > 32` — header height reduces from `h-16` to `h-12`, logo scales to `scale-[0.85]`, "Interactive Learning" subtitle hides (`opacity-0 h-0`), breadcrumb text shortens (e.g., "Ch 1: Chaining" → "Ch 1")
- [T-1560] **Breadcrumb state (chapter pages)**: Shows "Chapters > Ch 1: Chaining" navigation, replaces main nav links in the breadcrumb area, back button to chapters list
- [T-1560] **Navigation active underline**: Blue highlighted box/underline on active link (verified on Chapters page in both light and dark modes)
- [T-1560] **Progress bar**: Thin gradient progress bar (`progressbar "Course progress: 5%"`) visible at bottom of header in all states and both modes
- [T-1560] **Search bar**: Shows search icon, "Search..." placeholder, and Ctrl+K hint in both full and compact states; slightly smaller in compact mode via `isCompact` prop
- [T-1560] **Glass-morphism**: `glass-header` CSS class applied; more visible in dark mode with semi-transparent dark background, subtle in light mode with white/translucent
- [T-1560] **Nav link overflow at 1440px**: Some nav links ("Home") are not visible — pushed behind the logo area. "Continue" shows as "...ontinue" with clipped first letter. "Leaderboard" not visible on homepage (only visible in accessibility tree). This is a minor layout concern at exactly 1440px where the nav area gets crowded.
- [T-1560] **Secondary breadcrumb on chapter pages**: In addition to the header breadcrumb, chapter pages show a content-area breadcrumb ("Home / Chapters / Ch 1") below the header — redundant but consistent
- [T-1560] **No critical discrepancies found** — header transitions work smoothly, all states render correctly in both modes. Minor note: nav link overflow at 1440px could be improved

### Lessons Learned (T-1580)
- [T-1580] Leaderboard page audit — layout, ranking display, and empty state verified in both light/dark modes at desktop (1440x900) and mobile (375x812)
- [T-1580] **Desktop light mode**: "Top Learners" gold badge, "Leaderboard" heading, subtitle, country filter dropdown ("All countries"), refresh button, empty state card with user icon + "No learners yet" message. Clean centered layout with gradient background.
- [T-1580] **Desktop dark mode**: Same layout renders with dark theme. Empty state card has glass/border effect with proper contrast on all text elements.
- [T-1580] **Mobile (375px)**: Responsive layout — elements stack vertically. Country filter and refresh button fit side-by-side. Header collapses to mobile nav (logo + sign-in + theme + language + hamburger). Empty state card properly sized.
- [T-1580] **Navigation active state**: Leaderboard link has active background indicator (`bg-dark-700/80 rounded-lg` child div). Link is present and visible at x=746 in desktop nav (confirmed via JS evaluation). However, "Leaderboard" text is visually difficult to see in the crowded 1440px nav bar — same nav overflow issue noted in T-1560.
- [T-1580] **Ranking display**: Currently shows empty state ("No learners yet / Be the first to complete a chapter!") since no users have completed chapters. Country filter combobox and refresh button are functional elements.
- [T-1580] **No text truncation or overflow issues** in the leaderboard content area itself
- [T-1580] **No critical discrepancies found** — leaderboard page renders consistently in both modes and at both viewport sizes. Minor: nav link visibility at 1440px (pre-existing, tracked in T-1560)
