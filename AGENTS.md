# Agents Knowledge Base

## Directory Purpose
React 19 + Vite 7 + Tailwind CSS 4 learning platform for "Agentic Design Patterns" book by Antonio Gulli. Teaches 21 agentic AI design patterns through interactive tutorials, diagrams, quizzes, and code examples.

## Architecture Overview

### Tech Stack
- **Framework**: React 19.2 with TypeScript 5.9
- **Build**: Vite 7.2 with `@tailwindcss/vite` plugin
- **Styling**: Tailwind CSS 4 with `@theme` directive in `index.css`
- **Routing**: React Router DOM 7.12 (BrowserRouter)
- **Animation**: Framer Motion 12.26 + GSAP 3.14
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
│   ├── ChapterQuiz.tsx      # Quiz component
│   ├── ChapterCelebration.tsx # Completion celebration
│   ├── ConceptTooltip.tsx   # Concept hover tooltips
│   ├── LearningObjectives.tsx # Chapter learning objectives
│   ├── ProgressiveContent.tsx # Progressive content reveal
│   ├── ReadingProgressBar.tsx # Reading progress indicator
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
│   └── progressMerge.ts   # Progress data merging utility
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

## Gotchas & Warnings
- `chapters.ts` is too large to read at once (425KB) - use offset/limit or grep
- Light theme uses CSS custom property inversion (T-340) plus custom `html.light` overrides — `text-white` on non-colored backgrounds should be `text-dark-50` to adapt
- Notebook paths in `website_data.json` reference `/home/noreddine/agentic-ai/Agentic_Design_Patterns/repo/notebooks/` (different from actual path)
- The `RouteTransitionWrapper` uses CSS opacity transitions (not framer-motion) for route changes — do NOT reintroduce `AnimatePresence` around `<Outlet />`
