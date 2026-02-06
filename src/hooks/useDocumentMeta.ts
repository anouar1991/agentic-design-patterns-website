import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  keywords?: string;
  /** JSON-LD structured data object */
  structuredData?: Record<string, unknown>;
}

const BASE_TITLE = 'Agentic Design Patterns';
const DEFAULT_DESCRIPTION =
  'Interactive learning companion for Agentic Design Patterns by Antonio Gulli. Master 21 essential patterns for building intelligent AI systems.';

/**
 * Sets document title, meta description, Open Graph tags,
 * and optional JSON-LD structured data for the current page.
 *
 * Tags are cleaned up on unmount to restore defaults.
 */
export function useDocumentMeta(meta: DocumentMeta) {
  useEffect(() => {
    // --- title ---
    const prevTitle = document.title;
    document.title = meta.title.includes(BASE_TITLE)
      ? meta.title
      : `${meta.title} | ${BASE_TITLE}`;

    // --- helper to set/create a <meta> tag ---
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // description
    if (meta.description) {
      setMeta('name', 'description', meta.description);
    }

    // keywords
    if (meta.keywords) {
      setMeta('name', 'keywords', meta.keywords);
    }

    // Open Graph
    if (meta.ogTitle || meta.title) {
      setMeta('property', 'og:title', meta.ogTitle || meta.title);
    }
    if (meta.ogDescription || meta.description) {
      setMeta('property', 'og:description', (meta.ogDescription || meta.description)!);
    }
    if (meta.ogType) {
      setMeta('property', 'og:type', meta.ogType);
    }
    if (meta.ogUrl) {
      setMeta('property', 'og:url', meta.ogUrl);
    }

    // --- canonical link ---
    let canonicalEl: HTMLLinkElement | null = null;
    if (meta.canonicalUrl) {
      canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', meta.canonicalUrl);
    }

    // --- JSON-LD structured data ---
    let scriptEl: HTMLScriptElement | null = null;
    if (meta.structuredData) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.textContent = JSON.stringify(meta.structuredData);
      document.head.appendChild(scriptEl);
    }

    // --- cleanup ---
    return () => {
      document.title = prevTitle;
      // Restore default meta
      setMeta('name', 'description', DEFAULT_DESCRIPTION);
      setMeta(
        'property',
        'og:title',
        'Agentic Design Patterns - Interactive Learning',
      );
      setMeta(
        'property',
        'og:description',
        'Master 21 essential patterns for building intelligent AI systems with interactive diagrams and code examples.',
      );
      if (scriptEl) {
        scriptEl.remove();
      }
    };
  }, [
    meta.title,
    meta.description,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogType,
    meta.ogUrl,
    meta.canonicalUrl,
    meta.keywords,
    meta.structuredData,
  ]);
}
