import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { criticalCssPlugin } from './vite-plugin-critical-css'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    criticalCssPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Precache all built assets (JS, CSS, HTML)
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Runtime caching strategies
        runtimeCaching: [
          {
            // Cache Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // Cache Google Fonts webfont files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache images with cache-first (they rarely change)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Stale-while-revalidate for API/data responses
            urlPattern: /\/api\//i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-data',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      manifest: {
        name: 'Agentic Design Patterns',
        short_name: 'AgenticPatterns',
        description: 'Interactive learning platform for agentic AI design patterns',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      filter: /\.(js|css|html|svg|json)$/i,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      filter: /\.(js|css|html|svg|json)$/i,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splits — cacheable independently
          // Note: react-i18next goes with react to avoid circular deps
          if (id.includes('node_modules/react-dom')
            || id.includes('node_modules/react-router')
            || id.includes('node_modules/react-i18next')
            || id.includes('node_modules/react/')) return 'vendor-react'
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/i18next')) return 'vendor-i18n'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
          if (id.includes('node_modules/react-syntax-highlighter')
            || id.includes('node_modules/refractor')
            || id.includes('node_modules/prismjs')) return 'vendor-syntax'

          // Data layer — large static data, changes less often than UI
          if (id.includes('/src/data/chapters')) return 'data-chapters'
          if (id.includes('/src/data/codeTerms')) return 'data-codeterms'
          if (id.includes('/src/data/')) return 'data-misc'

          // i18n locale files
          if (id.includes('/src/i18n/')) return 'app-i18n'
        },
      },
    },
  },
})
