/**
 * Site URL configuration for SEO meta tags, canonical links, and structured data.
 * Uses VITE_SITE_URL env var with a sensible GitHub Pages default.
 */

const rawUrl = import.meta.env.VITE_SITE_URL || 'https://anouar1991.github.io/agentic-design-patterns-website';

// Remove trailing slash for consistent URL building
export const SITE_URL = rawUrl.replace(/\/+$/, '');

/** Build a full page URL from a relative path (e.g. "/chapters/1") */
export function pageUrl(path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
