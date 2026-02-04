/**
 * Prefetch route chunks on hover to eliminate navigation delay.
 *
 * Each lazy-loaded route in App.tsx uses `import('./pages/X')`.
 * Calling the same `import()` on hover primes the browser module cache
 * so React.lazy resolves instantly when the user actually navigates.
 *
 * A Set tracks already-prefetched routes to avoid redundant fetches.
 */

const prefetched = new Set<string>();

const routeImports: Record<string, () => Promise<unknown>> = {
  chapter: () => import('../pages/Chapter'),
  chapters: () => import('../pages/Chapters'),
  introduction: () => import('../pages/Introduction'),
  'learning-path': () => import('../pages/LearningPath'),
  playground: () => import('../pages/Playground'),
  leaderboard: () => import('../pages/Leaderboard'),
  profile: () => import('../pages/Profile'),
};

/**
 * Prefetch a route's JS chunk. Safe to call multiple times —
 * only the first call triggers an actual fetch.
 */
export function prefetchRoute(route: string): void {
  if (prefetched.has(route)) return;
  const loader = routeImports[route];
  if (loader) {
    prefetched.add(route);
    loader();
  }
}
