# Performance Baseline - T-700

**Date:** 2026-02-04
**Build tool:** Vite 7.3.1
**Total dist size:** 1.6MB

## Lighthouse Scores (Headless Chrome, Simulated Throttling)

| Category       | Score |
|----------------|-------|
| Performance    | 47    |
| Accessibility  | 82    |
| Best Practices | 100   |
| SEO            | 91    |

## Core Web Vitals

| Metric            | Value    | Score | Threshold |
|-------------------|----------|-------|-----------|
| LCP               | 3.3s     | 0.71  | < 2.5s    |
| FCP               | 3.2s     | 0.44  | < 1.8s    |
| TBT (INP proxy)   | 43,810ms | 0.00  | < 200ms   |
| CLS               | 0        | 1.00  | < 0.1     |
| Speed Index        | 18.2s    | 0.00  | < 3.4s    |
| TTI               | 81.2s    | 0.00  | < 3.8s    |

**Note:** TBT/TTI/Speed Index are inflated by Lighthouse's simulated CPU throttling applied to the massive main-thread JS evaluation. Real-device metrics will differ, but the relative sizes indicate real bottlenecks.

## Bundle Composition

### JavaScript Chunks (by size)

| Chunk                    | Raw Size | Gzip Size | Notes                      |
|--------------------------|----------|-----------|----------------------------|
| index (app code)         | 918.65KB | 257.86KB  | Main bundle - TOO LARGE    |
| Chapter (page)           | 260.12KB | 78.45KB   | Chapter page component     |
| vendor-motion            | 123.80KB | 41.10KB   | Framer Motion              |
| vendor-syntax            | 54.78KB  | 19.77KB   | React Syntax Highlighter   |
| vendor-i18n              | 47.82KB  | 15.66KB   | i18next                    |
| vendor-react             | 47.05KB  | 16.67KB   | React + ReactDOM + Router  |
| vendor-icons             | 22.55KB  | 8.11KB    | Lucide React               |
| Profile                  | 11.81KB  | 3.60KB    | Profile page               |
| Introduction             | 11.55KB  | 2.58KB    | Intro page                 |
| LearningPath             | 9.15KB   | 2.84KB    | Learning path page         |
| Leaderboard              | 8.71KB   | 2.96KB    | Leaderboard page           |
| Chapters                 | 6.83KB   | 2.41KB    | Chapters listing page      |
| Playground               | 3.39KB   | 1.19KB    | Playground page            |

### CSS

| File         | Raw Size | Gzip Size |
|--------------|----------|-----------|
| index.css    | 89.18KB  | 15.48KB   |
| Chapter.css  | 15.85KB  | 2.66KB    |

### Network Resources (Transfer Size)

| Resource Type | Transfer Size | Count |
|---------------|--------------|-------|
| Scripts       | 353.2KB      | 6     |
| Fonts         | 193.0KB      | 2     |
| Stylesheets   | 18.4KB       | 2     |
| Document      | 1.2KB        | 1     |
| Third-party   | 195.9KB      | 3     |

## Top 5 Performance Bottlenecks

### 1. Massive Index Bundle (918KB raw / 258KB gzip)
**Impact:** Critical - causes long TBT and TTI
**Root cause:** `src/data/chapters.ts` is 467KB of raw source containing all chapter content (tutorials, code examples, quizzes) as inline TypeScript objects. This plus all shared components, contexts, Layout, Home page, GSAP, XYFlow, and Supabase all land in the index chunk.
**Fix:** Split chapter data into per-chapter dynamic imports; move heavy libraries (gsap, @xyflow/react, @supabase/supabase-js) to separate vendor chunks or lazy-load them.

### 2. Google Fonts Blocking (193KB, 2 requests)
**Impact:** High - render-blocking font loading delays FCP/LCP
**Root cause:** Google Fonts loaded via CSS `@import` or `<link>` without preload/font-display optimization
**Fix:** Add `<link rel="preload">` for font files, ensure `font-display: swap`, consider self-hosting or subsetting.

### 3. Framer Motion (124KB raw / 41KB gzip)
**Impact:** Medium - large vendor chunk loaded on every page
**Root cause:** Full framer-motion imported into shared components
**Fix:** Verify tree-shaking is effective; consider `motion/react` subpath import or lazy-loading motion components.

### 4. No Critical CSS Inlining
**Impact:** Medium - stylesheet blocks rendering
**Root cause:** 89KB CSS loaded as external file, blocks first paint
**Fix:** Inline critical above-the-fold CSS in HTML `<head>`, defer rest.

### 5. No Compression (gzip/Brotli pre-compression)
**Impact:** Medium - server must compress on-the-fly or serve uncompressed
**Root cause:** No vite-plugin-compression configured
**Fix:** Add Brotli + gzip pre-compression for all static assets.

## Main Thread Breakdown

| Category               | Duration  |
|------------------------|-----------|
| Other                  | 144,123ms |
| Style & Layout         | 5,687ms   |
| Rendering              | 5,501ms   |
| Script Evaluation      | 4,248ms   |
| Garbage Collection     | 495ms     |
| Parse HTML & CSS       | 50ms      |
| Script Parse & Compile | 7ms       |

## Lighthouse Opportunities

| Opportunity              | Potential Savings |
|--------------------------|-------------------|
| Reduce unused JavaScript | 300ms             |

## Data File Analysis

| File                  | Size   | Notes                              |
|-----------------------|--------|------------------------------------|
| src/data/chapters.ts  | 467KB  | All chapter data - dominant source |
| src/data/codeTerms.ts | 73KB   | Code term definitions              |
| src/data/concepts.ts  | 11KB   | Concept definitions                |
| src/data/types.ts     | 7KB    | TypeScript types                   |
