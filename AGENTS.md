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
- **Light/dark mode**: `html.light` class toggle with manual `light:` prefix classes in CSS
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

## Gotchas & Warnings
- `chapters.ts` is too large to read at once (425KB) - use offset/limit or grep
- Light theme classes are custom CSS, not Tailwind `dark:` variants - changes need updating in both systems
- Notebook paths in `website_data.json` reference `/home/noreddine/agentic-ai/Agentic_Design_Patterns/repo/notebooks/` (different from actual path)
- The `RouteTransitionWrapper` handles page transitions - changes to routing need to account for this
