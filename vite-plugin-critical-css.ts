import type { Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Vite plugin to inline critical above-the-fold CSS into index.html.
 *
 * Strategy: After production build, inject a hand-crafted <style> block
 * containing the minimal CSS for the initial viewport: body background,
 * theme variables, font stack, and layout skeleton. This prevents FOUC
 * (flash of unstyled content) and the white flash before the full CSS loads.
 *
 * The full <link rel="stylesheet"> is preserved for all remaining styles.
 */
export function criticalCssPlugin(): Plugin {
  let outDir = 'dist'

  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir
    },

    closeBundle() {
      const htmlPath = resolve(outDir, 'index.html')
      let html: string
      try {
        html = readFileSync(htmlPath, 'utf-8')
      } catch {
        return
      }

      // Only inject if there's a stylesheet link to complement
      if (!html.includes('<link rel="stylesheet"')) return

      const criticalCss = getCriticalCss()
      const styleTag = `<style data-critical>${criticalCss}</style>\n    `

      // Inject before the stylesheet link
      html = html.replace(
        '<link rel="stylesheet"',
        `${styleTag}<link rel="stylesheet"`
      )

      writeFileSync(htmlPath, html)
    },
  }
}

/**
 * Hand-crafted critical CSS covering the above-the-fold viewport.
 *
 * Covers:
 * - Body background (dark theme default) to prevent white flash
 * - Theme color variables needed by initial layout
 * - Font stack declarations
 * - Layout shell (min-height, flex column)
 * - Navigation skeleton
 * - Hero section background
 * - Light mode body override (if user has light preference stored)
 */
function getCriticalCss(): string {
  return `
:root{--color-primary-400:#3aadfa;--color-primary-500:#0d96e6;--color-primary-600:#0278c7;--color-accent-400:#c48afc;--color-accent-500:#ab5cf7;--color-dark-50:#f8fafc;--color-dark-100:#f0f4f8;--color-dark-200:#e1e7ef;--color-dark-300:#c5cedb;--color-dark-400:#8c9bb5;--color-dark-500:#5f7089;--color-dark-600:#455268;--color-dark-700:#303d52;--color-dark-800:#1b2638;--color-dark-900:#0d1525;--color-dark-950:#050a14;--font-display:"Inter",system-ui,sans-serif;--font-mono:"JetBrains Mono","Fira Code",ui-monospace,monospace;--ease-smooth:cubic-bezier(.25,.1,.25,1)}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{margin:0;background-color:var(--color-dark-950);color:var(--color-dark-100);font-family:var(--font-display);line-height:1.7;letter-spacing:-.01em;background-image:radial-gradient(ellipse 80% 80% at 50% -20%,rgba(100,90,210,.12),transparent),radial-gradient(ellipse 60% 60% at 100% 100%,rgba(13,150,230,.08),transparent);background-attachment:fixed}
html.light body{background-color:#f9fafb;color:#111827;background-image:radial-gradient(ellipse 80% 80% at 50% -20%,rgba(13,150,230,.07),transparent),radial-gradient(ellipse 60% 60% at 100% 100%,rgba(171,92,247,.04),transparent)}
html.light{--color-dark-50:#0f172a;--color-dark-100:#1e293b;--color-dark-200:#334155;--color-dark-300:#475569;--color-dark-400:#64748b;--color-dark-500:#94a3b8;--color-dark-600:#cbd5e1;--color-dark-700:#e2e8f0;--color-dark-800:#f1f5f9;--color-dark-900:#f8fafc;--color-dark-950:#fff}
#root{min-height:100vh;display:flex;flex-direction:column}
`.trim().replace(/\n/g, '')
}
